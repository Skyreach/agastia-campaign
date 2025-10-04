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
      artifacts: [],
      partyLevel: 2,
      partySize: 5,
      encounterDifficulty: 'Medium'
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

  async getNotionEntityLinks() {
    /**
     * Get Notion page links for all entities by running the Python script
     */
    try {
      const { spawn } = await import('child_process');
      const scriptPath = path.join(campaignRoot, '.config', 'get_notion_links.py');

      return new Promise((resolve) => {
        const child = spawn('python3', [scriptPath, '--json'], {
          cwd: campaignRoot,
          env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` }
        });

        let output = '';
        child.stdout.on('data', (data) => output += data.toString());

        child.on('close', (code) => {
          if (code === 0) {
            try {
              const entityLinks = JSON.parse(output);
              resolve({
                contents: [{
                  uri: 'campaign://notion/entity-links',
                  mimeType: 'application/json',
                  text: JSON.stringify(entityLinks, null, 2)
                }]
              });
            } catch (e) {
              resolve({
                contents: [{
                  uri: 'campaign://notion/entity-links',
                  mimeType: 'text/plain',
                  text: `Error parsing entity links: ${e.message}`
                }]
              });
            }
          } else {
            resolve({
              contents: [{
                uri: 'campaign://notion/entity-links',
                mimeType: 'text/plain',
                text: 'Failed to fetch entity links from Notion'
              }]
            });
          }
        });
      });
    } catch (error) {
      return {
        contents: [{
          uri: 'campaign://notion/entity-links',
          mimeType: 'text/plain',
          text: `Error fetching entity links: ${error.message}`
        }]
      };
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
          },
          {
            uri: 'campaign://notion/database',
            mimeType: 'text/plain',
            name: 'Notion Database Link',
            description: 'Direct link to D&D Campaign Entities database in Notion'
          },
          {
            uri: 'campaign://notion/landing-page',
            mimeType: 'text/plain',
            name: 'Notion Landing Page',
            description: 'Direct link to Agastia Campaign landing page in Notion'
          },
          {
            uri: 'campaign://notion/entity-links',
            mimeType: 'application/json',
            name: 'Notion Entity Page Links',
            description: 'Direct links to all entity pages in Notion database'
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

        case 'campaign://notion/database':
          return {
            contents: [{
              uri,
              mimeType: 'text/plain',
              text: `D&D Campaign Entities Database

Direct Link: https://www.notion.so/281693f0c6b480be87c3f56fef9cc2b9

Database ID: 281693f0-c6b4-80be-87c3-f56fef9cc2b9

This database contains all campaign entities:
- PCs, NPCs, Factions, Locations, Sessions, Artifacts, etc.
- Use filtered views to organize by type
- Click any row to open the full page with content`
            }]
          };

        case 'campaign://notion/landing-page':
          return {
            contents: [{
              uri,
              mimeType: 'text/plain',
              text: `Agastia Campaign Landing Page

Direct Link: https://www.notion.so/Agastia-Campaign-281693f0c6b480b8b3dbfdfb2ea94997

Page ID: 281693f0c6b480b8b3dbfdfb2ea94997

This page contains:
- Navigation structure for the campaign
- 8 filtered database views (setup required)
- Quick links to key entities and sessions`
            }]
          };

        case 'campaign://notion/entity-links':
          return await this.getNotionEntityLinks();

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
          },
          {
            name: 'generate_encounter',
            description: 'Generate a resource-draining encounter for the party',
            inputSchema: {
              type: 'object',
              properties: {
                encounter_type: { 
                  type: 'string', 
                  enum: ['combat', 'environmental', 'social', 'trap', 'mixed'],
                  description: 'Type of encounter to generate'
                },
                difficulty: {
                  type: 'string',
                  enum: ['Easy', 'Medium', 'Hard', 'Deadly'],
                  description: 'Encounter difficulty',
                  default: 'Medium'
                },
                location: { type: 'string', description: 'Where the encounter takes place' },
                resource_focus: {
                  type: 'string',
                  enum: ['spell_slots', 'hit_dice', 'abilities', 'mixed'],
                  description: 'Which resources to target',
                  default: 'mixed'
                },
                save_to_file: {
                  type: 'boolean',
                  description: 'Save encounter to dated file',
                  default: true
                },
                confirm_before_save: {
                  type: 'boolean',
                  description: 'Ask for confirmation before saving',
                  default: true
                }
              },
              required: ['encounter_type']
            }
          },
          {
            name: 'generate_npc',
            description: 'Generate an NPC with simplified MCDM-style stat block',
            inputSchema: {
              type: 'object',
              properties: {
                npc_type: {
                  type: 'string',
                  enum: ['major', 'minor', 'faction', 'location', 'random'],
                  description: 'Category of NPC'
                },
                role: {
                  type: 'string',
                  enum: ['ally', 'rival', 'neutral', 'villain', 'patron', 'merchant', 'quest_giver'],
                  description: 'NPC role in campaign'
                },
                faction: { type: 'string', description: 'Associated faction (optional)' },
                location: { type: 'string', description: 'Current location' },
                cr: { type: 'number', description: 'Challenge rating if combatant' },
                include_stat_block: {
                  type: 'boolean',
                  description: 'Include combat stats',
                  default: false
                },
                save_to_file: {
                  type: 'boolean',
                  description: 'Save NPC to dated file',
                  default: true
                },
                confirm_before_save: {
                  type: 'boolean',
                  description: 'Ask for confirmation before saving',
                  default: true
                }
              },
              required: ['npc_type', 'role']
            }
          },
          {
            name: 'roll_reaction',
            description: 'Roll on the reaction table for NPC initial attitudes',
            inputSchema: {
              type: 'object',
              properties: {
                modifier: {
                  type: 'number',
                  description: 'Charisma or circumstance modifier',
                  default: 0
                },
                context: {
                  type: 'string',
                  description: 'Situation context for reaction'
                }
              }
            }
          },
          {
            name: 'calculate_encounter_xp',
            description: 'Calculate XP budget for encounter design',
            inputSchema: {
              type: 'object',
              properties: {
                party_size: {
                  type: 'number',
                  description: 'Number of party members',
                  default: 5
                },
                party_level: {
                  type: 'number',
                  description: 'Average party level',
                  default: 2
                },
                difficulty: {
                  type: 'string',
                  enum: ['Easy', 'Medium', 'Hard', 'Deadly'],
                  description: 'Target difficulty'
                }
              },
              required: ['difficulty']
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
          
        case 'generate_encounter':
          return await this.generateEncounter(args);
          
        case 'generate_npc':
          return await this.generateNPC(args);
          
        case 'roll_reaction':
          return await this.rollReaction(args.modifier, args.context);
          
        case 'calculate_encounter_xp':
          return await this.calculateEncounterXP(args.party_size, args.party_level, args.difficulty);
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async syncNotion(target) {
    try {
      await this.initNotion();

      const { spawn } = await import('child_process');
      const scriptPath = path.join(campaignRoot, '.config', 'sync_entity_to_notion.py');

      // Use safe_resync_all.sh for 'all' target to prevent destructive operations
      if (target === 'all') {
        const safeScriptPath = path.join(campaignRoot, '.config', 'safe_resync_all.sh');
        return new Promise((resolve) => {
          const child = spawn('bash', [safeScriptPath], {
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
                text: `✅ Safe re-sync completed (exit code: ${code})\nℹ️  This sync UPDATES entities only, no deletions\n\n${output}`
              }]
            });
          });
        });
      }

      // For individual targets, sync specific files
      return new Promise((resolve) => {
        const child = spawn('python3', [scriptPath, target], {
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

  async generateEncounter(args) {
    try {
      const { encounter_type, difficulty = 'Medium', location, resource_focus = 'mixed', save_to_file = true, confirm_before_save = true } = args;
      
      // Calculate XP budget
      const xpBudget = await this.calculateEncounterXP(this.campaignState.partySize, this.campaignState.partyLevel, difficulty);
      
      // Generate encounter based on type
      let encounter = {
        type: encounter_type,
        difficulty,
        location: location || 'Unknown location',
        resource_focus,
        xp_budget: xpBudget.content[0].text,
        timestamp: new Date().toISOString(),
        party_level: this.campaignState.partyLevel,
        party_size: this.campaignState.partySize
      };

      // Generate encounter details based on type
      switch (encounter_type) {
        case 'combat':
          encounter.details = this.generateCombatEncounter(difficulty, resource_focus);
          break;
        case 'environmental':
          encounter.details = this.generateEnvironmentalEncounter(difficulty, resource_focus);
          break;
        case 'social':
          encounter.details = this.generateSocialEncounter(difficulty, resource_focus);
          break;
        case 'trap':
          encounter.details = this.generateTrapEncounter(difficulty, resource_focus);
          break;
        case 'mixed':
          encounter.details = this.generateMixedEncounter(difficulty, resource_focus);
          break;
      }

      let result = this.formatEncounter(encounter);
      
      if (save_to_file) {
        if (confirm_before_save) {
          result += '\n\n📁 Ready to save. Use commit_and_push to save this encounter.';
        } else {
          // Save immediately
          const date = new Date().toISOString().split('T')[0];
          const filename = `Encounter_${date}_${encounter_type}_${difficulty}.md`;
          const filePath = path.join(campaignRoot, 'Encounters', filename);
          
          await fs.mkdir(path.join(campaignRoot, 'Encounters'), { recursive: true });
          await fs.writeFile(filePath, result);
          
          result += `\n\n✅ Saved to Encounters/${filename}`;
        }
      }

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Encounter generation failed: ${error.message}`
        }]
      };
    }
  }

  generateCombatEncounter(difficulty, resourceFocus) {
    const enemies = {
      Easy: ['2 Goblins (CR 1/4)', '1 Wolf (CR 1/4)', '3 Kobolds (CR 1/8)'],
      Medium: ['1 Ogre (CR 2)', '3 Orcs (CR 1/2)', '1 Dire Wolf (CR 1) + 2 Wolves'],
      Hard: ['1 Owlbear (CR 3)', '2 Dire Wolves (CR 1) + 1 Orc Eye of Gruumsh (CR 2)', '1 Troll (CR 5, adjusted)'],
      Deadly: ['1 Young Dragon (CR 8, adjusted)', '2 Owlbears (CR 3)', '1 Chimera (CR 6, adjusted)']
    };

    const resourceDrains = {
      spell_slots: 'Enemies use Counterspell, Silence zones, or antimagic fields',
      hit_dice: 'Ongoing poison damage, disease effects, or exhaustion',
      abilities: 'Enemies target specific saves, grapples to restrict movement, or charm effects',
      mixed: 'Combination of magical suppression, environmental hazards, and status effects'
    };

    return {
      enemies: enemies[difficulty][Math.floor(Math.random() * enemies[difficulty].length)],
      resource_drain: resourceDrains[resourceFocus],
      tactics: 'Enemies focus on splitting the party, targeting casters, and forcing resource expenditure',
      failure_sensory: 'The metallic taste of blood fills your mouth as exhaustion sets in. Your limbs feel leaden, each movement requiring conscious effort.',
      success_reward: 'Tactical positioning advantage for next encounter, recovered consumables, or useful intelligence'
    };
  }

  generateEnvironmentalEncounter(difficulty, resourceFocus) {
    const challenges = {
      Easy: 'Crossing a swift river (DC 10 Athletics)',
      Medium: 'Navigating a collapsing bridge (DC 13 Dexterity saves)',
      Hard: 'Escaping a forest fire (DC 15 Constitution saves, exhaustion)',
      Deadly: 'Surviving an avalanche (DC 17+ multiple saves)'
    };

    const resourceDrains = {
      spell_slots: 'Requires magical solutions (Fly, Water Walk, etc.)',
      hit_dice: 'Exhaustion levels, ongoing environmental damage',
      abilities: 'Multiple ability checks drain resources like Bardic Inspiration',
      mixed: 'Combination of all resource types needed for success'
    };

    return {
      challenge: challenges[difficulty],
      resource_drain: resourceDrains[resourceFocus],
      complication: 'Time pressure adds urgency - each failed check costs valuable time',
      failure_sensory: 'Your chest burns as you gasp for air. Sweat stings your eyes, blurring your vision. Every muscle screams in protest.',
      success_reward: 'Discovered shortcut, environmental advantage, or shelter for rest'
    };
  }

  generateSocialEncounter(difficulty, resourceFocus) {
    const scenarios = {
      Easy: 'Convincing town guards to allow passage',
      Medium: 'Negotiating with hostile merchants or rival adventurers',
      Hard: 'Mediating between warring factions',
      Deadly: 'Deceiving a powerful devil or fey lord'
    };

    const resourceDrains = {
      spell_slots: 'Magical compulsions needed (Charm Person, Suggestion)',
      hit_dice: 'Stress and tension cause psychic damage on failures',
      abilities: 'Multiple uses of class features (Bardic Inspiration, Channel Divinity)',
      mixed: 'Requires combination of magic, abilities, and roleplay'
    };

    return {
      scenario: scenarios[difficulty],
      resource_drain: resourceDrains[resourceFocus],
      stakes: 'Failure results in combat, loss of reputation, or missed opportunities',
      failure_sensory: 'A cold dread settles in your stomach. Your mouth goes dry as you realize your words have failed you.',
      success_reward: 'New ally, valuable information, or avoided combat'
    };
  }

  generateTrapEncounter(difficulty, resourceFocus) {
    const traps = {
      Easy: 'Pit trap with spikes (DC 12 Perception, 2d6 damage)',
      Medium: 'Poison dart hallway (DC 14 Investigation, ongoing poison)',
      Hard: 'Complex mechanical trap room (multiple DC 15 checks)',
      Deadly: 'Magical maze trap (DC 17+ Intelligence saves, teleportation)'
    };

    const resourceDrains = {
      spell_slots: 'Dispel Magic or similar required to disable',
      hit_dice: 'Ongoing damage forces Hit Dice usage',
      abilities: 'Requires specific class features to bypass safely',
      mixed: 'Multi-stage trap requiring various resources'
    };

    return {
      trap: traps[difficulty],
      resource_drain: resourceDrains[resourceFocus],
      complexity: 'Multiple stages or reset mechanisms',
      failure_sensory: 'Sharp pain lances through you. The acrid smell of your own fear-sweat mingles with ancient dust and decay.',
      success_reward: 'Trap components for later use, hidden treasure, or safe rest area'
    };
  }

  generateMixedEncounter(difficulty, resourceFocus) {
    return {
      primary: this.generateCombatEncounter(difficulty, resourceFocus),
      secondary: 'Environmental complication during combat (difficult terrain, extreme weather)',
      tertiary: 'Social element (innocent bystanders, potential allies to convince)',
      resource_drain: 'All resource types stressed simultaneously',
      failure_sensory: 'Overwhelming chaos. Your senses blur together - pain, fear, exhaustion all melding into a desperate struggle for survival.',
      success_reward: 'Multiple rewards possible based on approach taken'
    };
  }

  formatEncounter(encounter) {
    const date = new Date().toISOString().split('T')[0];
    return `---
type: encounter
encounter_type: ${encounter.type}
difficulty: ${encounter.difficulty}
location: ${encounter.location}
resource_focus: ${encounter.resource_focus}
date_created: ${date}
party_level: ${encounter.party_level}
party_size: ${encounter.party_size}
tags: [encounter, ${encounter.type}, ${encounter.difficulty.toLowerCase()}, resource-drain]
---

# ${encounter.type.charAt(0).toUpperCase() + encounter.type.slice(1)} Encounter - ${encounter.difficulty}

## Overview
- **Type:** ${encounter.type}
- **Difficulty:** ${encounter.difficulty}
- **Location:** ${encounter.location}
- **Resource Focus:** ${encounter.resource_focus}
- **XP Budget:** ${encounter.xp_budget}

## Encounter Details
${Object.entries(encounter.details).map(([key, value]) => 
  `### ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
${value}`
).join('\n\n')}

## Resource Drain Mechanics
This encounter is designed to drain ${encounter.resource_focus === 'mixed' ? 'multiple resource types' : encounter.resource_focus.replace(/_/g, ' ')} rather than just hit points.

## DM Notes
- Adjust difficulty based on party's current resource state
- Consider allowing creative solutions that bypass resource expenditure
- Track resource usage for pacing the adventuring day
- Use failure sensory descriptions to enhance immersion
`;
  }

  async generateNPC(args) {
    try {
      const { npc_type, role, faction, location, cr, include_stat_block = false, save_to_file = true, confirm_before_save = true } = args;
      
      // Generate NPC details
      const npc = this.createNPCDetails(npc_type, role, faction, location);
      
      if (include_stat_block && cr) {
        npc.stat_block = this.generateStatBlock(cr, npc.name);
      }

      let result = this.formatNPC(npc, include_stat_block);
      
      if (save_to_file) {
        if (confirm_before_save) {
          result += '\n\n📁 Ready to save. Use commit_and_push to save this NPC.';
        } else {
          // Save immediately
          const date = new Date().toISOString().split('T')[0];
          const filename = `NPC_${date}_${npc.name.replace(/\s+/g, '_')}.md`;
          const dirMap = {
            'major': 'Major_NPCs',
            'minor': 'Minor_NPCs',
            'faction': 'Faction_NPCs',
            'location': 'Location_NPCs',
            'random': 'Random_NPCs'
          };
          
          const dir = dirMap[npc_type] || 'Random_NPCs';
          const filePath = path.join(campaignRoot, 'NPCs', dir, filename);
          
          await fs.mkdir(path.join(campaignRoot, 'NPCs', dir), { recursive: true });
          await fs.writeFile(filePath, result);
          
          result += `\n\n✅ Saved to NPCs/${dir}/${filename}`;
        }
      }

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ NPC generation failed: ${error.message}`
        }]
      };
    }
  }

  createNPCDetails(type, role, faction, location) {
    // Generate random NPC details
    const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Tiefling', 'Dragonborn', 'Half-Orc', 'Gnome'];
    const genders = ['Male', 'Female', 'Non-binary'];
    
    const names = {
      Human: ['Marcus', 'Elena', 'Theron', 'Lydia', 'Kai'],
      Elf: ['Silvain', 'Miriel', 'Caelum', 'Aelara', 'Zephyr'],
      Dwarf: ['Thorin', 'Dura', 'Grimli', 'Kilda', 'Ori'],
      Halfling: ['Bilbo', 'Rosie', 'Merry', 'Pearl', 'Sam'],
      Tiefling: ['Damakos', 'Makaria', 'Morthos', 'Nemeia', 'Kai'],
      Dragonborn: ['Balasar', 'Kava', 'Donaar', 'Thava', 'Rhogar'],
      'Half-Orc': ['Grok', 'Shel', 'Thokk', 'Emen', 'Morg'],
      Gnome: ['Boddynock', 'Nyx', 'Warryn', 'Breena', 'Zook']
    };

    const race = races[Math.floor(Math.random() * races.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const name = names[race][Math.floor(Math.random() * names[race].length)];

    const personalities = [
      'Gruff but kind-hearted',
      'Nervously enthusiastic',
      'Quietly confident',
      'Boisterously friendly',
      'Mysteriously aloof',
      'Pragmatically cautious'
    ];

    const quirks = [
      'Constantly fidgets with a lucky charm',
      'Speaks in third person when nervous',
      'Has an unusual pet',
      'Collects strange objects',
      'Afraid of a common thing',
      'Laughs at inappropriate times'
    ];

    return {
      name,
      race,
      gender,
      type,
      role,
      faction: faction || 'Independent',
      location: location || 'Wandering',
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      quirk: quirks[Math.floor(Math.random() * quirks.length)],
      motivation: this.generateMotivation(role),
      secret: this.generateSecret(type, role)
    };
  }

  generateMotivation(role) {
    const motivations = {
      ally: 'Seeks to protect the innocent and uphold justice',
      rival: 'Desires to prove superiority through competition',
      neutral: 'Primarily concerned with personal survival and profit',
      villain: 'Craves power and control over others',
      patron: 'Wants specific tasks completed for mysterious reasons',
      merchant: 'Aims to maximize profit while maintaining reputation',
      quest_giver: 'Needs help resolving a personal crisis'
    };
    return motivations[role] || 'Has their own mysterious agenda';
  }

  generateSecret(type, role) {
    const secrets = [
      'Secretly working for another faction',
      'Hiding their true identity',
      'Possesses forbidden knowledge',
      'Owes a debt to dangerous people',
      'Searching for a lost loved one',
      'Cursed by ancient magic',
      'Former member of ' + (role === 'villain' ? 'a heroic order' : 'a villainous cult')
    ];
    return secrets[Math.floor(Math.random() * secrets.length)];
  }

  generateStatBlock(cr, name) {
    // MCDM-inspired simplified stat block
    const crStats = {
      0.125: { hp: 7, ac: 12, attack: '+2', damage: '1d4', saves: 10 },
      0.25: { hp: 10, ac: 13, attack: '+3', damage: '1d6', saves: 11 },
      0.5: { hp: 15, ac: 13, attack: '+3', damage: '1d6+1', saves: 11 },
      1: { hp: 20, ac: 14, attack: '+4', damage: '1d8+2', saves: 12 },
      2: { hp: 30, ac: 14, attack: '+5', damage: '2d6+2', saves: 13 },
      3: { hp: 45, ac: 15, attack: '+5', damage: '2d8+3', saves: 13 },
      4: { hp: 60, ac: 15, attack: '+6', damage: '2d10+3', saves: 14 },
      5: { hp: 75, ac: 16, attack: '+7', damage: '3d8+4', saves: 15 }
    };

    const stats = crStats[cr] || crStats[1];
    
    return {
      ac: stats.ac,
      hp: stats.hp,
      speed: '30 ft.',
      attack_bonus: stats.attack,
      damage: stats.damage,
      save_dc: stats.saves,
      special_abilities: this.generateSpecialAbilities(cr)
    };
  }

  generateSpecialAbilities(cr) {
    const abilities = [
      'Multiattack (2 attacks)',
      'Cunning Action (Dash/Disengage/Hide as bonus)',
      'Spellcasting (3 spell slots)',
      'Resistance to nonmagical damage',
      'Advantage on saves vs magic',
      'Regeneration (5 hp/turn)',
      'Pack Tactics',
      'Sneak Attack (+2d6)'
    ];
    
    const numAbilities = Math.min(Math.floor(cr) + 1, 3);
    const selected = [];
    
    for (let i = 0; i < numAbilities; i++) {
      const ability = abilities[Math.floor(Math.random() * abilities.length)];
      if (!selected.includes(ability)) {
        selected.push(ability);
      }
    }
    
    return selected;
  }

  formatNPC(npc, includeStats) {
    const date = new Date().toISOString().split('T')[0];
    let content = `---
name: ${npc.name}
type: NPC
npc_type: ${npc.type}
role: ${npc.role}
race: ${npc.race}
gender: ${npc.gender}
faction: ${npc.faction}
location: ${npc.location}
status: Active
date_created: ${date}
tags: [npc, ${npc.type}, ${npc.role}, ${npc.race.toLowerCase()}]
---

# ${npc.name}

## Basic Information
- **Name:** ${npc.name}
- **Race:** ${npc.race}
- **Gender:** ${npc.gender}
- **Role:** ${npc.role}
- **Faction:** ${npc.faction}
- **Location:** ${npc.location}

## Appearance
*[Generate based on race and role]*

## Personality
- **Trait:** ${npc.personality}
- **Quirk:** ${npc.quirk}
- **Motivation:** ${npc.motivation}

## Secret
${npc.secret}

## Relationships
- **Allies:** [To be determined based on faction]
- **Rivals:** [To be determined based on role]
- **Contacts:** [Other notable connections]
`;

    if (includeStats && npc.stat_block) {
      content += `
## Combat Statistics (MCDM-Style)
- **AC:** ${npc.stat_block.ac}
- **HP:** ${npc.stat_block.hp}
- **Speed:** ${npc.stat_block.speed}
- **Attack:** ${npc.stat_block.attack_bonus} to hit, ${npc.stat_block.damage} damage
- **Save DC:** ${npc.stat_block.save_dc}

### Special Abilities
${npc.stat_block.special_abilities.map(a => `- ${a}`).join('\n')}
`;
    }

    content += `
## Campaign Integration
[How this NPC connects to current story threads]

## DM Notes
[Private notes for running this NPC]
`;

    return content;
  }

  async rollReaction(modifier = 0, context = '') {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    
    let reaction, description;
    
    if (total <= 1) {
      reaction = 'Hostile';
      description = 'Immediately attacks or actively opposes the party';
    } else if (total <= 5) {
      reaction = 'Unfriendly';
      description = 'Refuses to help, may hinder or report the party';
    } else if (total <= 10) {
      reaction = 'Suspicious';
      description = 'Wary and careful, requires convincing to cooperate';
    } else if (total <= 15) {
      reaction = 'Neutral';
      description = 'Indifferent, will deal fairly but offers no special aid';
    } else if (total <= 18) {
      reaction = 'Friendly';
      description = 'Well-disposed, willing to help within reason';
    } else {
      reaction = 'Helpful';
      description = 'Actively supportive, goes out of their way to assist';
    }

    let result = `🎲 **Reaction Roll**
Roll: ${roll} ${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''} = ${total}
**Result:** ${reaction}
**Behavior:** ${description}`;

    if (context) {
      result += `\n**Context:** ${context}`;
    }

    return {
      content: [{
        type: 'text',
        text: result
      }]
    };
  }

  async calculateEncounterXP(partySize = 5, partyLevel = 2, difficulty) {
    const xpThresholds = {
      1: { Easy: 25, Medium: 50, Hard: 75, Deadly: 100 },
      2: { Easy: 50, Medium: 100, Hard: 150, Deadly: 200 },
      3: { Easy: 75, Medium: 150, Hard: 225, Deadly: 400 },
      4: { Easy: 125, Medium: 250, Hard: 375, Deadly: 500 },
      5: { Easy: 250, Medium: 500, Hard: 750, Deadly: 1100 },
      6: { Easy: 300, Medium: 600, Hard: 900, Deadly: 1400 },
      7: { Easy: 350, Medium: 750, Hard: 1100, Deadly: 1700 },
      8: { Easy: 450, Medium: 900, Hard: 1400, Deadly: 2100 },
      9: { Easy: 550, Medium: 1100, Hard: 1600, Deadly: 2400 },
      10: { Easy: 600, Medium: 1200, Hard: 1900, Deadly: 2800 }
    };

    const threshold = xpThresholds[partyLevel] || xpThresholds[2];
    const xpBudget = threshold[difficulty] * partySize;

    const result = `**XP Budget for ${difficulty} Encounter**
- Party Size: ${partySize}
- Party Level: ${partyLevel}
- Per Character: ${threshold[difficulty]} XP
- **Total Budget: ${xpBudget} XP**

**Suggested Enemies:**
${this.suggestEnemies(xpBudget)}`;

    return {
      content: [{
        type: 'text',
        text: result
      }]
    };
  }

  suggestEnemies(xpBudget) {
    const enemies = [
      { name: 'Kobold', cr: 0.125, xp: 25 },
      { name: 'Goblin', cr: 0.25, xp: 50 },
      { name: 'Wolf', cr: 0.25, xp: 50 },
      { name: 'Skeleton', cr: 0.25, xp: 50 },
      { name: 'Zombie', cr: 0.25, xp: 50 },
      { name: 'Orc', cr: 0.5, xp: 100 },
      { name: 'Shadow', cr: 0.5, xp: 100 },
      { name: 'Dire Wolf', cr: 1, xp: 200 },
      { name: 'Bugbear', cr: 1, xp: 200 },
      { name: 'Ogre', cr: 2, xp: 450 },
      { name: 'Owlbear', cr: 3, xp: 700 }
    ];

    const suggestions = [];
    
    for (const enemy of enemies) {
      if (enemy.xp <= xpBudget) {
        const count = Math.floor(xpBudget / enemy.xp);
        if (count > 0 && count <= 8) {
          suggestions.push(`- ${count} × ${enemy.name} (${count * enemy.xp} XP)`);
        }
      }
    }

    return suggestions.slice(0, 5).join('\n');
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('D&D Campaign MCP server running on stdio');
  }
}

const server = new DnDCampaignServer();
server.run().catch(console.error);