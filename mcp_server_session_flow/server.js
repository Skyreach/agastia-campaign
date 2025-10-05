#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import frontMatter from 'front-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const campaignRoot = path.join(__dirname, '..');

/**
 * Session Flow MCP Server
 *
 * Manages session flowcharts in tower-defense style format, tracking:
 * - Starting locations/conditions
 * - Decision points and branching paths
 * - Encounter references
 * - NPC interactions
 * - Quest progression
 * - Session outcomes
 */
class SessionFlowServer {
  constructor() {
    this.server = new Server(
      {
        name: 'dnd-session-flow-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.sessionFlows = [];
    this.setupHandlers();
    this.loadSessionFlows();
  }

  async loadSessionFlows() {
    this.sessionFlows = [];
    const sessionFlowDir = path.join(campaignRoot, 'Session_Flows');

    try {
      await fs.mkdir(sessionFlowDir, { recursive: true });
      const files = await fs.readdir(sessionFlowDir);

      for (const file of files.filter(f => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(sessionFlowDir, file), 'utf-8');
        const parsed = frontMatter(content);

        this.sessionFlows.push({
          file,
          ...parsed.attributes,
          content: parsed.body
        });
      }
    } catch (error) {
      console.error('Error loading session flows:', error.message);
    }
  }

  setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'session-flow://all',
            mimeType: 'application/json',
            name: 'All Session Flows',
            description: 'All session flowchart documents'
          },
          {
            uri: 'session-flow://template',
            mimeType: 'text/markdown',
            name: 'Session Flow Template',
            description: 'Template for creating new session flowcharts'
          }
        ]
      };
    });

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'session-flow://all':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.sessionFlows, null, 2)
            }]
          };

        case 'session-flow://template':
          const template = this.generateTemplate();
          return {
            contents: [{
              uri,
              mimeType: 'text/markdown',
              text: template
            }]
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_session_flow',
            description: 'Create a new session flowchart document',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Session number (e.g., 1, 2, 3)'
                },
                session_name: {
                  type: 'string',
                  description: 'Session title/name'
                },
                start_location: {
                  type: 'string',
                  description: 'Where the session begins'
                },
                start_condition: {
                  type: 'string',
                  description: 'Initial situation/state at session start'
                }
              },
              required: ['session_number', 'session_name', 'start_location']
            }
          },
          {
            name: 'add_decision_point',
            description: 'Add a decision point node to a session flow',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Which session flow to modify'
                },
                node_id: {
                  type: 'string',
                  description: 'Unique identifier for this node (e.g., "dp1", "dp2")'
                },
                description: {
                  type: 'string',
                  description: 'What decision the players must make'
                },
                options: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Possible choices players can make'
                },
                parent_node: {
                  type: 'string',
                  description: 'ID of the previous node (for flowchart tracking)'
                }
              },
              required: ['session_number', 'node_id', 'description', 'options']
            }
          },
          {
            name: 'add_encounter_node',
            description: 'Link an encounter to the session flow',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Which session flow to modify'
                },
                node_id: {
                  type: 'string',
                  description: 'Unique identifier for this node (e.g., "enc1", "enc2")'
                },
                encounter_name: {
                  type: 'string',
                  description: 'Name/reference to encounter (links to encounter MCP)'
                },
                trigger: {
                  type: 'string',
                  description: 'What causes this encounter to happen'
                },
                parent_node: {
                  type: 'string',
                  description: 'ID of the previous node'
                }
              },
              required: ['session_number', 'node_id', 'encounter_name']
            }
          },
          {
            name: 'add_npc_interaction',
            description: 'Add an NPC interaction node to the flow',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Which session flow to modify'
                },
                node_id: {
                  type: 'string',
                  description: 'Unique identifier for this node (e.g., "npc1", "npc2")'
                },
                npc_name: {
                  type: 'string',
                  description: 'Name of the NPC'
                },
                interaction_type: {
                  type: 'string',
                  description: 'Type of interaction (conversation, trade, combat, etc.)'
                },
                key_information: {
                  type: 'string',
                  description: 'What information/items the NPC provides'
                },
                parent_node: {
                  type: 'string',
                  description: 'ID of the previous node'
                }
              },
              required: ['session_number', 'node_id', 'npc_name', 'interaction_type']
            }
          },
          {
            name: 'add_quest_progression',
            description: 'Mark quest advancement at a specific node',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Which session flow to modify'
                },
                node_id: {
                  type: 'string',
                  description: 'Which node triggers the quest update'
                },
                quest_name: {
                  type: 'string',
                  description: 'Name of the quest (links to quest MCP)'
                },
                progression_type: {
                  type: 'string',
                  description: 'How the quest advances (started, clue_found, completed, etc.)'
                }
              },
              required: ['session_number', 'node_id', 'quest_name', 'progression_type']
            }
          },
          {
            name: 'set_session_outcome',
            description: 'Define the possible outcomes/end states of a session',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Which session flow to modify'
                },
                outcome_id: {
                  type: 'string',
                  description: 'Unique identifier for this outcome'
                },
                description: {
                  type: 'string',
                  description: 'What happens at this ending'
                },
                consequences: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Long-term effects of reaching this outcome'
                },
                parent_node: {
                  type: 'string',
                  description: 'ID of the node that leads here'
                }
              },
              required: ['session_number', 'outcome_id', 'description']
            }
          },
          {
            name: 'get_session_flow',
            description: 'Retrieve a specific session flow by number',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Session number to retrieve'
                }
              },
              required: ['session_number']
            }
          },
          {
            name: 'visualize_flow',
            description: 'Generate a text-based visualization of a session flow',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: {
                  type: 'number',
                  description: 'Session number to visualize'
                }
              },
              required: ['session_number']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_session_flow':
          return await this.createSessionFlow(args);

        case 'add_decision_point':
          return await this.addNode(args, 'decision');

        case 'add_encounter_node':
          return await this.addNode(args, 'encounter');

        case 'add_npc_interaction':
          return await this.addNode(args, 'npc');

        case 'add_quest_progression':
          return await this.addQuestProgression(args);

        case 'set_session_outcome':
          return await this.addNode(args, 'outcome');

        case 'get_session_flow':
          return await this.getSessionFlow(args);

        case 'visualize_flow':
          return await this.visualizeFlow(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  generateTemplate() {
    return `---
name: "Session [NUMBER]: [NAME]"
type: Session
session_number: [NUMBER]
status: Planning
tags: [session, session[NUMBER]]
version: "0.1.0"
---

# Session [NUMBER]: [NAME]

## Session Overview
**Start Location:** [Where players begin]
**Start Condition:** [Initial situation]
**Estimated Duration:** [Hours]
**Target Level:** [Player level]

## Flow Chart

### START: [Initial State]
**Location:** [Starting location]
**Condition:** [What's happening when session starts]

↓

### Node ID: [node_id]
**Type:** [Decision | Encounter | NPC | Location]
**Description:** [What happens here]

**Connections:**
- Option A → [next_node_id]
- Option B → [next_node_id]

↓

[Continue flow...]

### OUTCOMES

#### Outcome 1: [Name]
- [Consequence 1]
- [Consequence 2]

#### Outcome 2: [Name]
- [Consequence 1]
- [Consequence 2]

## Cross-References

### Encounters
- [Encounter Name] (Node: [node_id])

### NPCs
- [NPC Name] (Node: [node_id])

### Quests
- [Quest Name] - [Progression type] at Node [node_id]

### Locations
- [Location 1]
- [Location 2]

## DM Notes
[Private prep notes, secrets, contingencies]
`;
  }

  async createSessionFlow(args) {
    const { session_number, session_name, start_location, start_condition = 'Session begins' } = args;
    const filename = `Session_${session_number}_Flow.md`;
    const filepath = path.join(campaignRoot, 'Session_Flows', filename);

    const content = `---
name: "Session ${session_number}: ${session_name}"
type: Session
session_number: ${session_number}
status: Planning
tags: [session, session${session_number}]
version: "0.1.0"
---

# Session ${session_number}: ${session_name}

## Session Overview
**Start Location:** ${start_location}
**Start Condition:** ${start_condition}
**Estimated Duration:** TBD
**Target Level:** TBD

## Flow Chart

### START: Session Beginning
**Location:** ${start_location}
**Condition:** ${start_condition}

[Flow nodes will be added here using the add_*_node tools]

## Cross-References

### Encounters
[Will be populated as encounter nodes are added]

### NPCs
[Will be populated as NPC interactions are added]

### Quests
[Will be populated as quest progressions are added]

### Locations
- ${start_location}

## DM Notes
[Add private prep notes, secrets, contingencies here]
`;

    await fs.writeFile(filepath, content, 'utf-8');
    await this.loadSessionFlows();

    return {
      content: [{
        type: 'text',
        text: `Created session flow: ${filename}\n\nNext steps:\n- Add decision points with add_decision_point\n- Add encounters with add_encounter_node\n- Add NPC interactions with add_npc_interaction\n- Define outcomes with set_session_outcome`
      }]
    };
  }

  async addNode(args, nodeType) {
    const { session_number } = args;
    const filename = `Session_${session_number}_Flow.md`;
    const filepath = path.join(campaignRoot, 'Session_Flows', filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const parsed = frontMatter(content);

      let nodeSection = '';

      switch (nodeType) {
        case 'decision':
          nodeSection = this.formatDecisionNode(args);
          break;
        case 'encounter':
          nodeSection = this.formatEncounterNode(args);
          break;
        case 'npc':
          nodeSection = this.formatNPCNode(args);
          break;
        case 'outcome':
          nodeSection = this.formatOutcomeNode(args);
          break;
      }

      // Insert node before the Cross-References section
      const newContent = content.replace(
        '## Cross-References',
        `${nodeSection}\n\n## Cross-References`
      );

      await fs.writeFile(filepath, newContent, 'utf-8');
      await this.loadSessionFlows();

      return {
        content: [{
          type: 'text',
          text: `Added ${nodeType} node ${args.node_id} to Session ${session_number}`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to add node: ${error.message}`);
    }
  }

  formatDecisionNode(args) {
    const { node_id, description, options, parent_node } = args;
    const optionsList = options.map(opt => `- ${opt} → [Next node ID]`).join('\n');

    return `
↓ ${parent_node ? `(from ${parent_node})` : ''}

### Node: ${node_id}
**Type:** Decision Point
**Description:** ${description}

**Options:**
${optionsList}
`;
  }

  formatEncounterNode(args) {
    const { node_id, encounter_name, trigger = 'Automatic', parent_node } = args;

    return `
↓ ${parent_node ? `(from ${parent_node})` : ''}

### Node: ${node_id}
**Type:** Encounter
**Name:** ${encounter_name}
**Trigger:** ${trigger}

[See Encounter MCP for full details]
`;
  }

  formatNPCNode(args) {
    const { node_id, npc_name, interaction_type, key_information = 'TBD', parent_node } = args;

    return `
↓ ${parent_node ? `(from ${parent_node})` : ''}

### Node: ${node_id}
**Type:** NPC Interaction
**NPC:** ${npc_name}
**Interaction:** ${interaction_type}
**Key Info:** ${key_information}
`;
  }

  formatOutcomeNode(args) {
    const { outcome_id, description, consequences = [], parent_node } = args;
    const consequenceList = consequences.map(c => `- ${c}`).join('\n');

    return `
↓ ${parent_node ? `(from ${parent_node})` : ''}

### OUTCOME: ${outcome_id}
**Description:** ${description}

**Consequences:**
${consequenceList || '- TBD'}
`;
  }

  async addQuestProgression(args) {
    const { session_number, node_id, quest_name, progression_type } = args;
    const filename = `Session_${session_number}_Flow.md`;
    const filepath = path.join(campaignRoot, 'Session_Flows', filename);

    const content = await fs.readFile(filepath, 'utf-8');

    // Add to Quest section
    const questEntry = `- ${quest_name} - ${progression_type} at Node ${node_id}`;
    const newContent = content.replace(
      '[Will be populated as quest progressions are added]',
      questEntry
    );

    await fs.writeFile(filepath, newContent, 'utf-8');
    await this.loadSessionFlows();

    return {
      content: [{
        type: 'text',
        text: `Added quest progression: ${quest_name} (${progression_type}) at node ${node_id}`
      }]
    };
  }

  async getSessionFlow(args) {
    const { session_number } = args;
    const flow = this.sessionFlows.find(f => f.session_number === session_number);

    if (!flow) {
      throw new Error(`Session flow ${session_number} not found`);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(flow, null, 2)
      }]
    };
  }

  async visualizeFlow(args) {
    const { session_number } = args;
    const filename = `Session_${session_number}_Flow.md`;
    const filepath = path.join(campaignRoot, 'Session_Flows', filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');

      return {
        content: [{
          type: 'text',
          text: `Session ${session_number} Flow Visualization:\n\n${content}`
        }]
      };
    } catch (error) {
      throw new Error(`Session flow ${session_number} not found`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Session Flow MCP server running on stdio');
  }
}

const server = new SessionFlowServer();
server.run().catch(console.error);
