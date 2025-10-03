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
      recentUpdates: [],
      locations: [],
      locationHierarchy: {},
      goals: [],
      artifacts: []
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

      // Load locations with hierarchy
      await this.loadLocations();

      // Load goals
      await this.loadGoals();

      // Load artifacts
      await this.loadArtifacts();

    } catch (error) {
      console.error('Error loading campaign state:', error.message);
    }
  }

  async loadLocations() {
    this.campaignState.locations = [];
    this.campaignState.locationHierarchy = {};

    const locationsRoot = path.join(campaignRoot, 'Locations');

    const loadLocationFiles = async (dir, relPath = '') => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const newRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;

          if (entry.isDirectory()) {
            await loadLocationFiles(fullPath, newRelPath);
          } else if (entry.name.endsWith('.md')) {
            const content = await fs.readFile(fullPath, 'utf-8');
            const parsed = frontMatter(content);
            const attrs = parsed.attributes;

            const location = {
              name: attrs.name || entry.name.replace('.md', ''),
              type: attrs.type || 'Location',
              location_type: attrs.location_type,
              parent_location: attrs.parent_location,
              child_locations: attrs.child_locations || [],
              status: attrs.status,
              tags: attrs.tags || [],
              file: newRelPath,
              version: attrs.version || '0.1.0'
            };

            this.campaignState.locations.push(location);

            // Build hierarchy index
            if (!this.campaignState.locationHierarchy[location.name]) {
              this.campaignState.locationHierarchy[location.name] = {
                ...location,
                children: [],
                path: []
              };
            }
          }
        }
      } catch (e) {
        // Directory doesn't exist yet
      }
    };

    await loadLocationFiles(locationsRoot);

    // Build parent-child relationships
    for (const loc of this.campaignState.locations) {
      if (loc.parent_location && this.campaignState.locationHierarchy[loc.parent_location]) {
        this.campaignState.locationHierarchy[loc.parent_location].children.push(loc.name);
      }
    }

    // Build full paths
    const buildPath = (locName, visited = new Set()) => {
      if (visited.has(locName)) return []; // Prevent circular references
      visited.add(locName);

      const loc = this.campaignState.locationHierarchy[locName];
      if (!loc) return [];

      if (loc.parent_location) {
        const parentPath = buildPath(loc.parent_location, visited);
        return [...parentPath, locName];
      }
      return [locName];
    };

    for (const locName in this.campaignState.locationHierarchy) {
      this.campaignState.locationHierarchy[locName].path = buildPath(locName);
    }
  }

  async loadGoals() {
    this.campaignState.goals = [];

    // Extract goals from PC files
    for (const pc of this.campaignState.playerCharacters) {
      const pcPath = path.join(campaignRoot, 'Player_Characters', pc.file);
      const content = await fs.readFile(pcPath, 'utf-8');
      const parsed = frontMatter(content);

      // Parse goals from content sections
      const lines = content.split('\n');
      let inGoalsSection = false;
      let currentStatus = 'pending';

      for (const line of lines) {
        if (line.match(/##\s+(Active\s+)?Goals?/i)) {
          inGoalsSection = true;
          continue;
        }
        if (inGoalsSection && line.startsWith('##')) {
          break;
        }
        if (inGoalsSection) {
          if (line.match(/###\s+Active/i)) currentStatus = 'active';
          else if (line.match(/###\s+Pending/i)) currentStatus = 'pending';
          else if (line.match(/###\s+Completed/i)) currentStatus = 'completed';

          const goalMatch = line.match(/^[\s-]*\*?\*?(.+?)\*?\*?\s*\[([^\]]+)\]/);
          if (goalMatch) {
            this.campaignState.goals.push({
              description: goalMatch[1].trim(),
              status: currentStatus,
              owner: pc.name,
              owner_type: 'PC',
              scope: goalMatch[2].toLowerCase()
            });
          }
        }
      }
    }

    // Load goals from Resources/Goals_Tracker.md if it exists
    try {
      const goalsPath = path.join(campaignRoot, 'Resources', 'Goals_Tracker.md');
      const content = await fs.readFile(goalsPath, 'utf-8');
      const parsed = frontMatter(content);

      // Extract faction goals with progress clocks
      const lines = content.split('\n');
      for (const line of lines) {
        const clockMatch = line.match(/\*\*(.+?)\*\*.*?\[(\d+)\/(\d+)\]/);
        if (clockMatch) {
          this.campaignState.goals.push({
            description: clockMatch[1].trim(),
            status: 'active',
            progress_clock: `[${clockMatch[2]}/${clockMatch[3]}]`,
            owner: 'Unknown',
            owner_type: 'Faction'
          });
        }
      }
    } catch (e) {
      // Goals tracker doesn't exist yet
    }
  }

  async loadArtifacts() {
    this.campaignState.artifacts = [];

    const coreDir = path.join(campaignRoot, 'Campaign_Core');
    try {
      const files = await fs.readdir(coreDir);

      for (const file of files.filter(f => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(coreDir, file), 'utf-8');
        const parsed = frontMatter(content);
        const attrs = parsed.attributes;

        if (attrs.type === 'Artifact' || file.includes('Artifact') || file.includes('Codex') || file.includes('Axe')) {
          this.campaignState.artifacts.push({
            name: attrs.name || file.replace('.md', ''),
            type: 'Artifact',
            current_location: attrs.current_location || 'Unknown',
            seekers: attrs.seekers || [],
            status: attrs.status,
            tags: attrs.tags || [],
            file: file,
            version: attrs.version || '0.1.0'
          });
        }
      }
    } catch (e) {
      // No artifacts yet
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
          },
          {
            uri: 'campaign://locations/hierarchy',
            mimeType: 'application/json',
            name: 'Location Hierarchy',
            description: 'Full location tree with parent-child relationships'
          },
          {
            uri: 'campaign://locations/all',
            mimeType: 'application/json',
            name: 'All Locations',
            description: 'List of all locations in the campaign'
          },
          {
            uri: 'campaign://goals/active',
            mimeType: 'application/json',
            name: 'Active Goals',
            description: 'All goals with active status'
          },
          {
            uri: 'campaign://goals/all',
            mimeType: 'application/json',
            name: 'All Goals',
            description: 'All goals tracked across PCs and factions'
          },
          {
            uri: 'campaign://artifacts',
            mimeType: 'application/json',
            name: 'Artifacts & Mysteries',
            description: 'Important items and unsolved mysteries'
          },
          {
            uri: 'campaign://sessions/upcoming',
            mimeType: 'application/json',
            name: 'Upcoming Session',
            description: 'Next session information'
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

        case 'campaign://locations/hierarchy':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.locationHierarchy, null, 2)
            }]
          };

        case 'campaign://locations/all':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.locations, null, 2)
            }]
          };

        case 'campaign://goals/active':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                this.campaignState.goals.filter(g => g.status === 'active'),
                null,
                2
              )
            }]
          };

        case 'campaign://goals/all':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.goals, null, 2)
            }]
          };

        case 'campaign://artifacts':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.artifacts, null, 2)
            }]
          };

        case 'campaign://sessions/upcoming':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.campaignState.lastSession || { message: 'No session data yet' }, null, 2)
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
          },
          {
            name: 'commit_and_push',
            description: 'Commit current changes to git and push to GitHub',
            inputSchema: {
              type: 'object',
              properties: {
                message: { type: 'string', description: 'Commit message' },
                auto_sync: { 
                  type: 'boolean', 
                  description: 'Automatically sync to Notion after commit', 
                  default: true 
                }
              },
              required: ['message']
            }
          },
          {
            name: 'edit_file',
            description: 'Edit a campaign file and optionally auto-commit/sync',
            inputSchema: {
              type: 'object',
              properties: {
                file_path: { type: 'string', description: 'Path to file to edit' },
                content: { type: 'string', description: 'New file content' },
                commit_message: { type: 'string', description: 'Commit message for changes' },
                auto_commit: { 
                  type: 'boolean', 
                  description: 'Automatically commit and push changes', 
                  default: true 
                },
                auto_sync: { 
                  type: 'boolean', 
                  description: 'Automatically sync to Notion after edit', 
                  default: true 
                }
              },
              required: ['file_path', 'content']
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
          
        case 'commit_and_push':
          return await this.commitAndPush(args.message, args.auto_sync);
          
        case 'edit_file':
          return await this.editFile(args.file_path, args.content, args.commit_message, args.auto_commit, args.auto_sync);
          
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

  async verifyGitConfig() {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve) => {
      const child = spawn('git', ['config', 'user.email'], { cwd: campaignRoot });
      let output = '';
      
      child.stdout.on('data', (data) => output += data.toString());
      child.on('close', (code) => {
        const email = output.trim();
        resolve(email === 'mbourqu3@gmail.com');
      });
    });
  }

  async commitAndPush(message, autoSync = true) {
    try {
      // Verify git configuration
      const validConfig = await this.verifyGitConfig();
      if (!validConfig) {
        return {
          content: [{
            type: 'text',
            text: '❌ Git commit blocked: Not using approved email (mbourqu3@gmail.com)'
          }]
        };
      }

      const { spawn } = await import('child_process');
      
      // Add all changes
      const addResult = await new Promise((resolve) => {
        const child = spawn('git', ['add', '.'], { cwd: campaignRoot });
        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.stderr.on('data', (data) => output += data.toString());
        child.on('close', (code) => resolve({ code, output }));
      });

      // Check for changes
      const statusResult = await new Promise((resolve) => {
        const child = spawn('git', ['status', '--porcelain'], { cwd: campaignRoot });
        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.on('close', (code) => resolve({ code, output }));
      });

      if (!statusResult.output.trim()) {
        return {
          content: [{
            type: 'text',
            text: '📝 No changes to commit'
          }]
        };
      }

      // Commit changes
      const commitMessage = `${message}

🎲 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      const commitResult = await new Promise((resolve) => {
        const child = spawn('git', ['commit', '-m', commitMessage], { cwd: campaignRoot });
        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.stderr.on('data', (data) => output += data.toString());
        child.on('close', (code) => resolve({ code, output }));
      });

      if (commitResult.code !== 0) {
        return {
          content: [{
            type: 'text',
            text: `❌ Commit failed: ${commitResult.output}`
          }]
        };
      }

      // Push to GitHub
      const pushResult = await new Promise((resolve) => {
        const child = spawn('git', ['push'], { cwd: campaignRoot });
        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.stderr.on('data', (data) => output += data.toString());
        child.on('close', (code) => resolve({ code, output }));
      });

      let resultMessage = `✅ Successfully committed and pushed changes\n${commitResult.output}`;
      
      if (pushResult.code !== 0) {
        resultMessage += `\n⚠️ Push failed: ${pushResult.output}`;
      }

      // Auto-sync to Notion if requested
      if (autoSync) {
        const syncResult = await this.syncNotion('all');
        resultMessage += `\n📊 Auto-synced to Notion`;
      }

      return {
        content: [{
          type: 'text',
          text: resultMessage
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Commit/push failed: ${error.message}`
        }]
      };
    }
  }

  async editFile(filePath, content, commitMessage, autoCommit = true, autoSync = true) {
    try {
      const fullPath = path.join(campaignRoot, filePath);
      
      // Write the file
      await fs.writeFile(fullPath, content);
      
      let resultMessage = `✅ Updated file: ${filePath}`;

      // Auto-commit if requested
      if (autoCommit) {
        const defaultMessage = commitMessage || `Update ${filePath}`;
        const commitResult = await this.commitAndPush(defaultMessage, autoSync);
        resultMessage += `\n${commitResult.content[0].text}`;
      } else if (autoSync) {
        // Just sync to Notion without committing
        const syncResult = await this.syncNotion('all');
        resultMessage += `\n📊 Synced to Notion`;
      }

      // Update campaign state
      await this.loadCampaignState();

      return {
        content: [{
          type: 'text',
          text: resultMessage
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ File edit failed: ${error.message}`
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