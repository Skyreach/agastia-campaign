#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Client } from '@notionhq/client';
import fs from 'fs/promises';
import path from 'path';
import frontMatter from 'front-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const campaignRoot = path.join(__dirname, '..');

class DnDCampaignServer {
  constructor() {
    this.server = new Server(
      {
        name: 'dnd-campaign-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.notion = null;
    this.campaignState = {
      lastSession: null,
      activeFactions: [],
      activeNPCs: [],
      playerCharacters: [],
      currentQuests: [],
      pendingDecisions: [],
      recentUpdates: []
    };

    this.setupHandlers();
    this.loadCampaignState();
  }

  async initNotion() {
    try {
      const keyPath = path.join(campaignRoot, '.config', 'notion_key.txt');
      const apiKey = await fs.readFile(keyPath, 'utf-8');
      this.notion = new Client({ auth: apiKey.trim() });
      
      const dbIdPath = path.join(campaignRoot, '.config', 'database_id.txt');
      this.databaseId = (await fs.readFile(dbIdPath, 'utf-8')).trim();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Notion:', error.message);
      return false;
    }
  }

  async loadCampaignState() {
    try {
      // Load player characters
      const pcDir = path.join(campaignRoot, 'Player_Characters');
      const pcFiles = await fs.readdir(pcDir);
      
      for (const file of pcFiles.filter(f => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(pcDir, file), 'utf-8');
        const parsed = frontMatter(content);
        this.campaignState.playerCharacters.push({
          name: parsed.attributes.name || file.replace('.md', ''),
          player: parsed.attributes.player,
          class: parsed.attributes.class,
          status: parsed.attributes.status || 'Active',
          tags: parsed.attributes.tags || [],
          file: file
        });
      }

      // Load factions
      const factionDir = path.join(campaignRoot, 'Factions');
      const factionFiles = await fs.readdir(factionDir);
      
      for (const file of factionFiles.filter(f => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(factionDir, file), 'utf-8');
        const parsed = frontMatter(content);
        if (parsed.attributes.status === 'Active') {
          this.campaignState.activeFactions.push({
            name: parsed.attributes.name || file.replace('.md', '').replace('Faction_', ''),
            type: parsed.attributes.type,
            threat_level: parsed.attributes.threat_level,
            tags: parsed.attributes.tags || [],
            file: file
          });
        }
      }

      // Load latest session info
      const sessionDir = path.join(campaignRoot, 'Sessions');
      try {
        const sessionFiles = await fs.readdir(sessionDir);
        const sessions = sessionFiles
          .filter(f => f.endsWith('.md') && f.includes('Session_'))
          .sort()
          .reverse();
        
        if (sessions.length > 0) {
          const content = await fs.readFile(path.join(sessionDir, sessions[0]), 'utf-8');
          const parsed = frontMatter(content);
          this.campaignState.lastSession = {
            name: parsed.attributes.name,
            number: parsed.attributes.session_number,
            status: parsed.attributes.status,
            date: parsed.attributes.date,
            file: sessions[0]
          };
        }
      } catch (e) {
        // Sessions directory might be empty
      }

      // Load pending decisions from campaign core
      const coreDir = path.join(campaignRoot, 'Campaign_Core');
      try {
        const coreFiles = await fs.readdir(coreDir);
        for (const file of coreFiles.filter(f => f.endsWith('.md'))) {
          const content = await fs.readFile(path.join(coreDir, file), 'utf-8');
          if (content.includes('NEEDS') || content.includes('TBD') || content.includes('DECISION')) {
            this.campaignState.pendingDecisions.push({
              file: file,
              type: 'Campaign Decision',
              description: `Review needed in ${file}`
            });
          }
        }
      } catch (e) {
        // Core directory issues
      }

    } catch (error) {
      console.error('Error loading campaign state:', error.message);
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'campaign://state',
            mimeType: 'application/json',
            name: 'Current Campaign State',
            description: 'Overview of active campaign elements'
          },
          {
            uri: 'campaign://characters',
            mimeType: 'application/json', 
            name: 'Player Characters',
            description: 'All player character information'
          },
          {
            uri: 'campaign://factions',
            mimeType: 'application/json',
            name: 'Active Factions',
            description: 'Currently active faction information'
          },
          {
            uri: 'campaign://decisions',
            mimeType: 'application/json',
            name: 'Pending Decisions',
            description: 'Campaign decisions that need to be made'
          },
          {
            uri: 'campaign://recent-updates',
            mimeType: 'application/json',
            name: 'Recent Updates',
            description: 'Latest changes to campaign files'
          }
        ]
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      switch (uri) {
        case 'campaign://state':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState, null, 2)
            }]
          };
          
        case 'campaign://characters':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.playerCharacters, null, 2)
            }]
          };
          
        case 'campaign://factions':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.activeFactions, null, 2)
            }]
          };
          
        case 'campaign://decisions':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.pendingDecisions, null, 2)
            }]
          };
          
        case 'campaign://recent-updates':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.recentUpdates, null, 2)
            }]
          };
          
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'sync_notion',
            description: 'Sync campaign files with Notion database',
            inputSchema: {
              type: 'object',
              properties: {
                target: {
                  type: 'string',
                  enum: ['all', 'characters', 'factions', 'npcs', 'locations'],
                  description: 'What to sync to Notion'
                }
              },
              required: ['target']
            }
          },
          {
            name: 'create_npc',
            description: 'Create a new NPC file with proper structure',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'NPC name' },
                type: { 
                  type: 'string', 
                  enum: ['Major_NPCs', 'Faction_NPCs', 'Location_NPCs'],
                  description: 'NPC category'
                },
                faction: { type: 'string', description: 'Associated faction' },
                location: { type: 'string', description: 'Current location' }
              },
              required: ['name', 'type']
            }
          },
          {
            name: 'update_campaign_state',
            description: 'Refresh campaign state from current files',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'get_faction_relationships',
            description: 'Get detailed faction relationship information',
            inputSchema: {
              type: 'object',
              properties: {
                faction: { type: 'string', description: 'Faction name to analyze' }
              }
            }
          },
          {
            name: 'plan_session',
            description: 'Create session planning template',
            inputSchema: {
              type: 'object',
              properties: {
                session_number: { type: 'number', description: 'Session number' },
                title: { type: 'string', description: 'Session title/theme' },
                focus: { type: 'string', description: 'Main session focus' }
              },
              required: ['session_number']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'sync_notion':
          return await this.syncNotion(args.target);
          
        case 'create_npc':
          return await this.createNPC(args.name, args.type, args.faction, args.location);
          
        case 'update_campaign_state':
          await this.loadCampaignState();
          return { content: [{ type: 'text', text: 'Campaign state refreshed successfully' }] };
          
        case 'get_faction_relationships':
          return await this.getFactionRelationships(args.faction);
          
        case 'plan_session':
          return await this.planSession(args.session_number, args.title, args.focus);
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async syncNotion(target) {
    try {
      await this.initNotion();
      
      const { spawn } = await import('child_process');
      const scriptPath = path.join(campaignRoot, 'sync_notion.py');
      
      return new Promise((resolve) => {
        const child = spawn('python3', [scriptPath, target === 'all' ? 'all' : target], {
          cwd: campaignRoot,
          env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` }
        });
        
        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.stderr.on('data', (data) => output += data.toString());
        
        child.on('close', (code) => {
          resolve({
            content: [{
              type: 'text',
              text: `Notion sync completed (exit code: ${code})\n${output}`
            }]
          });
        });
      });
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Notion sync failed: ${error.message}`
        }]
      };
    }
  }

  async createNPC(name, type, faction = '', location = '') {
    try {
      const filename = `NPC_${name.replace(/\s+/g, '_')}.md`;
      const filePath = path.join(campaignRoot, 'NPCs', type, filename);
      
      const template = `---
name: ${name}
type: NPC
status: Active
faction: ${faction}
location: ${location}
tags: [npc, ${type.toLowerCase().replace('_', '-')}]
---

# ${name}

## Basic Information
- **Name:** ${name}
- **Faction:** ${faction || '[To be determined]'}
- **Location:** ${location || '[To be determined]'}
- **Status:** Active

## Appearance
[Physical description]

## Personality
[Key personality traits and mannerisms]

## Background
[Character history and motivations]

## Goals & Motivations
[What drives this character]

## Relationships
- **Allies:** [List key allies]
- **Enemies:** [List enemies or rivals]
- **Neutral:** [Other significant relationships]

## Resources & Capabilities
[What this NPC can do or provide]

## Campaign Role
[How this NPC fits into the larger story]

## DM Notes
[Private notes for campaign management]
`;

      await fs.writeFile(filePath, template);
      
      // Update campaign state
      await this.loadCampaignState();
      
      return {
        content: [{
          type: 'text',
          text: `Created NPC file: ${filename} in NPCs/${type}/`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Failed to create NPC: ${error.message}`
        }]
      };
    }
  }

  async getFactionRelationships(factionName) {
    try {
      const factionFile = `Faction_${factionName.replace(/\s+/g, '_')}.md`;
      const factionPath = path.join(campaignRoot, 'Factions', factionFile);
      
      const content = await fs.readFile(factionPath, 'utf-8');
      const relationships = [];
      
      // Extract relationship information
      const lines = content.split('\n');
      let inRelationships = false;
      
      for (const line of lines) {
        if (line.includes('## Relationships') || line.includes('## Relations')) {
          inRelationships = true;
          continue;
        }
        if (inRelationships && line.startsWith('##')) {
          break;
        }
        if (inRelationships && line.trim().startsWith('-')) {
          relationships.push(line.trim());
        }
      }
      
      return {
        content: [{
          type: 'text',
          text: `Faction Relationships for ${factionName}:\n${relationships.join('\n')}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Could not find faction: ${factionName}`
        }]
      };
    }
  }

  async planSession(sessionNumber, title = '', focus = '') {
    try {
      const filename = `Session_${sessionNumber}_${title.replace(/\s+/g, '_') || 'Planning'}.md`;
      const filePath = path.join(campaignRoot, 'Sessions', filename);
      
      const template = `---
name: Session ${sessionNumber}${title ? ` - ${title}` : ''}
session_number: ${sessionNumber}
status: Planning
date: TBD
tags: [session${sessionNumber}, planning${focus ? `, ${focus.toLowerCase()}` : ''}]
---

# Session ${sessionNumber}${title ? `: ${title}` : ''}

## Session Overview
${focus ? `**Focus:** ${focus}` : '[Main theme and objectives for this session]'}

## Key Objectives
- [Primary goal 1]
- [Primary goal 2]
- [Primary goal 3]

## Active NPCs This Session
${this.campaignState.activeNPCs.length > 0 ? 
  this.campaignState.activeNPCs.map(npc => `- **${npc.name}** - ${npc.role || 'Role TBD'}`).join('\n') :
  '- [NPCs to be determined]'
}

## Faction Activities
${this.campaignState.activeFactions.length > 0 ?
  this.campaignState.activeFactions.map(f => `- **${f.name}** - [Current activities]`).join('\n') :
  '- [Faction involvement to be determined]'
}

## Locations
- **Primary Location:** [Main location for session]
- **Secondary Locations:** [Other locations that might be visited]

## Encounters Planned
### Combat Encounters
- [Encounter 1 description]

### Social Encounters  
- [Social encounter 1]

### Exploration/Discovery
- [Discovery opportunities]

## Player Character Hooks
${this.campaignState.playerCharacters.length > 0 ?
  this.campaignState.playerCharacters.map(pc => `- **${pc.name}** - [Personal hook or goal]`).join('\n') :
  '- [PC-specific content to be added]'
}

## Potential Outcomes
- **Success:** [What happens if things go well]
- **Complications:** [What might go wrong]
- **Discoveries:** [What players might learn]

## DM Preparation Notes
- [ ] Review previous session outcomes
- [ ] Prepare NPC stats and voices
- [ ] Set up encounter maps/materials
- [ ] Review relevant campaign lore

## Post-Session Notes
[Space for recording what actually happened]
`;

      await fs.writeFile(filePath, template);
      
      return {
        content: [{
          type: 'text',
          text: `Created session planning file: ${filename}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Failed to create session plan: ${error.message}`
        }]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('D&D Campaign MCP server running on stdio');
  }
}

const server = new DnDCampaignServer();
server.run().catch(console.error);