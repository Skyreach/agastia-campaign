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
 * Dungeon Ecology MCP Server
 *
 * Manages the living ecosystems within dungeons and locations, tracking:
 * - Faction inhabitants and their relationships
 * - Food chains and territorial boundaries
 * - Defensive logic (why traps exist, original purpose)
 * - Restocking rules (how dungeons change over time)
 * - Monster lore and behavioral patterns
 * - Environmental logic and realism
 */
class DungeonEcologyServer {
  constructor() {
    this.server = new Server(
      {
        name: 'dnd-dungeon-ecology-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.ecologies = [];
    this.setupHandlers();
    this.loadEcologies();
  }

  async loadEcologies() {
    this.ecologies = [];
    const ecologyDir = path.join(campaignRoot, 'Dungeon_Ecologies');

    try {
      await fs.mkdir(ecologyDir, { recursive: true });
      const files = await fs.readdir(ecologyDir);

      for (const file of files.filter(f => f.endsWith('.md'))) {
        const content = await fs.readFile(path.join(ecologyDir, file), 'utf-8');
        const parsed = frontMatter(content);

        this.ecologies.push({
          file,
          ...parsed.attributes,
          content: parsed.body
        });
      }
    } catch (error) {
      console.error('Error loading dungeon ecologies:', error.message);
    }
  }

  setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'ecology://all',
            mimeType: 'application/json',
            name: 'All Dungeon Ecologies',
            description: 'All dungeon ecology documents'
          },
          {
            uri: 'ecology://template',
            mimeType: 'text/markdown',
            name: 'Ecology Template',
            description: 'Template for creating new dungeon ecology documents'
          },
          {
            uri: 'ecology://lore-sources',
            mimeType: 'text/markdown',
            name: 'Monster Lore Sources',
            description: 'Reference guide for monster behavior and ecology from official sources'
          }
        ]
      };
    });

    // Read resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'ecology://all':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.ecologies, null, 2)
            }]
          };

        case 'ecology://template':
          const template = this.generateTemplate();
          return {
            contents: [{
              uri,
              mimeType: 'text/markdown',
              text: template
            }]
          };

        case 'ecology://lore-sources':
          const loreSources = this.getLoreSources();
          return {
            contents: [{
              uri,
              mimeType: 'text/markdown',
              text: loreSources
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
            name: 'create_ecology',
            description: 'Create a new dungeon ecology document for a location',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Name of the dungeon/location'
                },
                location_type: {
                  type: 'string',
                  description: 'Type (cave, ruins, building, forest, etc.)'
                },
                primary_faction: {
                  type: 'string',
                  description: 'Dominant creature/faction in this location'
                },
                description: {
                  type: 'string',
                  description: 'Brief overview of the location'
                }
              },
              required: ['location_name', 'location_type', 'primary_faction']
            }
          },
          {
            name: 'add_faction',
            description: 'Add a creature faction to the ecology',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                faction_name: {
                  type: 'string',
                  description: 'Name of the creature type/group (e.g., "Goblins", "Ettins")'
                },
                population: {
                  type: 'string',
                  description: 'How many (exact or range, e.g., "12-15" or "1 alpha + pack")'
                },
                territory: {
                  type: 'string',
                  description: 'Which areas they control/inhabit'
                },
                behavior: {
                  type: 'string',
                  description: 'How they act (aggressive, territorial, scavenger, etc.)'
                },
                diet: {
                  type: 'string',
                  description: 'What they eat (carnivore, omnivore, specific prey, etc.)'
                }
              },
              required: ['location_name', 'faction_name', 'population', 'territory', 'behavior']
            }
          },
          {
            name: 'define_relationship',
            description: 'Define the relationship between two factions in the ecology',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                faction_a: {
                  type: 'string',
                  description: 'First faction'
                },
                faction_b: {
                  type: 'string',
                  description: 'Second faction'
                },
                relationship_type: {
                  type: 'string',
                  description: 'Type (predator-prey, symbiotic, hostile, neutral, master-servant, etc.)'
                },
                details: {
                  type: 'string',
                  description: 'Specific dynamics and interactions'
                }
              },
              required: ['location_name', 'faction_a', 'faction_b', 'relationship_type', 'details']
            }
          },
          {
            name: 'add_defensive_logic',
            description: 'Document why and how defenses/traps exist in this location',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                defense_name: {
                  type: 'string',
                  description: 'Name/type of trap or defensive measure'
                },
                location_in_dungeon: {
                  type: 'string',
                  description: 'Where this defense is placed'
                },
                original_purpose: {
                  type: 'string',
                  description: 'Why it was originally built/placed'
                },
                current_state: {
                  type: 'string',
                  description: 'Is it maintained? Degraded? Repurposed?'
                },
                who_maintains: {
                  type: 'string',
                  description: 'Which faction (if any) maintains or triggered it'
                }
              },
              required: ['location_name', 'defense_name', 'location_in_dungeon', 'original_purpose', 'current_state']
            }
          },
          {
            name: 'add_resource_flow',
            description: 'Define how resources (food, water, treasure) flow through the ecology',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                resource_type: {
                  type: 'string',
                  description: 'Type of resource (food, water, treasure, magical energy, etc.)'
                },
                source: {
                  type: 'string',
                  description: 'Where it comes from'
                },
                flow_path: {
                  type: 'string',
                  description: 'How it moves through the dungeon (who uses it, how it\'s contested)'
                },
                scarcity: {
                  type: 'string',
                  description: 'Abundant, moderate, scarce, depleted'
                }
              },
              required: ['location_name', 'resource_type', 'source', 'flow_path']
            }
          },
          {
            name: 'define_restocking_rules',
            description: 'Set rules for how the dungeon changes when factions leave/arrive',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                scenario: {
                  type: 'string',
                  description: 'What changes (e.g., "Goblins eliminated", "Ettin leaves")'
                },
                immediate_effects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'What happens right away'
                },
                long_term_changes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'How the ecology evolves over time (days/weeks/months)'
                },
                new_arrivals: {
                  type: 'string',
                  description: 'What might move in to fill the vacuum'
                }
              },
              required: ['location_name', 'scenario', 'immediate_effects']
            }
          },
          {
            name: 'add_environmental_logic',
            description: 'Document logical details about the environment (why things are where they are)',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                element: {
                  type: 'string',
                  description: 'What environmental element (room layout, water source, ventilation, etc.)'
                },
                purpose: {
                  type: 'string',
                  description: 'Why it exists and how it functions'
                },
                current_use: {
                  type: 'string',
                  description: 'How current inhabitants use or interact with it'
                }
              },
              required: ['location_name', 'element', 'purpose']
            }
          },
          {
            name: 'add_lore_reference',
            description: 'Add monster lore from official sources to justify behavior',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to modify'
                },
                creature_type: {
                  type: 'string',
                  description: 'Type of creature (Goblin, Ettin, Beholder, etc.)'
                },
                source_book: {
                  type: 'string',
                  description: 'Which book/supplement (MM, VGtM, MTF, etc.)'
                },
                lore_summary: {
                  type: 'string',
                  description: 'Relevant lore that informs behavior in this location'
                },
                application: {
                  type: 'string',
                  description: 'How this lore manifests in your dungeon'
                }
              },
              required: ['location_name', 'creature_type', 'source_book', 'lore_summary']
            }
          },
          {
            name: 'get_ecology',
            description: 'Retrieve a specific dungeon ecology by location name',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Name of the location'
                }
              },
              required: ['location_name']
            }
          },
          {
            name: 'simulate_change',
            description: 'Simulate what happens if a specific faction is removed or arrives',
            inputSchema: {
              type: 'object',
              properties: {
                location_name: {
                  type: 'string',
                  description: 'Which ecology to simulate'
                },
                change_type: {
                  type: 'string',
                  description: 'Type of change (faction_removed, faction_added, resource_depleted, etc.)'
                },
                target_faction: {
                  type: 'string',
                  description: 'Which faction is affected'
                }
              },
              required: ['location_name', 'change_type', 'target_faction']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_ecology':
          return await this.createEcology(args);

        case 'add_faction':
          return await this.addSection(args, 'faction');

        case 'define_relationship':
          return await this.addSection(args, 'relationship');

        case 'add_defensive_logic':
          return await this.addSection(args, 'defense');

        case 'add_resource_flow':
          return await this.addSection(args, 'resource');

        case 'define_restocking_rules':
          return await this.addSection(args, 'restocking');

        case 'add_environmental_logic':
          return await this.addSection(args, 'environment');

        case 'add_lore_reference':
          return await this.addSection(args, 'lore');

        case 'get_ecology':
          return await this.getEcology(args);

        case 'simulate_change':
          return await this.simulateChange(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  generateTemplate() {
    return `---
name: "[Location Name] - Ecology"
type: Dungeon_Ecology
location: "[Location Name]"
location_type: "[cave|ruins|building|forest|etc]"
status: Active
tags: [ecology, dungeon, [location-tag]]
version: "0.1.0"
---

# [Location Name] - Dungeon Ecology

## Overview
**Location Type:** [Cave/Ruins/Building/etc]
**Current State:** [Inhabited/Abandoned/Contested/etc]
**Primary Faction:** [Dominant creature type]

[Brief description of the location's current ecological state]

## Inhabitant Factions

### [Faction 1 Name]
**Population:** [Number or range]
**Territory:** [Which areas they control]
**Behavior:** [Aggressive/Territorial/Scavenger/etc]
**Diet:** [What they eat]
**Activity Pattern:** [Nocturnal/Diurnal/etc]

**Lore Source:** [Monster Manual p.XX / VGtM / etc]
**Key Lore:** [Relevant behavioral info from official sources]

### [Faction 2 Name]
[Same structure as above]

## Faction Relationships

### [Faction A] ↔ [Faction B]
**Type:** [Predator-Prey/Symbiotic/Hostile/Neutral/etc]
**Dynamics:** [How they interact]
**Power Balance:** [Who's dominant, how stable is it]

## Resource Flows

### Food
**Source:** [Where food comes from]
**Flow:** [Who hunts/scavenges what]
**Scarcity:** [Abundant/Moderate/Scarce]

### Water
**Source:** [Underground stream, collected rain, etc]
**Access:** [Who controls it]

### Other Resources
[Treasure, magical energy, building materials, etc]

## Defensive Logic

### [Trap/Defense Name]
**Location:** [Where in the dungeon]
**Original Purpose:** [Why it was built]
**Built By:** [Original creators]
**Current State:** [Maintained/Degraded/Repurposed]
**Who Maintains:** [Current faction maintaining it, if any]
**Functionality:** [How it actually works in context]

## Environmental Logic

### [Element Name] (e.g., Main Hall, Water Source, Ventilation)
**Purpose:** [Why it exists architecturally/naturally]
**Original Function:** [What it was designed for]
**Current Use:** [How inhabitants use it now]
**Logic:** [Why it makes sense to be here]

## Restocking Rules

### Scenario: [Faction] Eliminated
**Immediate Effects:**
- [Power vacuum, territorial shifts]
- [Other factions expand]

**Long-Term Changes (1-2 weeks):**
- [What might move in]
- [How ecology rebalances]

**New Arrivals:** [What creatures might claim the territory]

### Scenario: [Faction] Arrives
**Immediate Effects:**
- [Displaced factions]
- [Territorial conflicts]

**Long-Term Changes:**
- [New equilibrium]
- [Modified relationships]

## DM Notes
[Additional secrets, hidden connections, future plans for this ecology]

## Lore References
- [Source Book] p.XX - [Creature Type] behavioral patterns
- [Source Book] p.XX - [Environmental detail]
`;
  }

  getLoreSources() {
    return `# Monster Lore Sources for Ecology Design

## Official D&D 5e Sources

### Monster Manual (MM)
The primary source for creature behavior, habitats, and ecology

**Key Sections to Reference:**
- Individual monster entries (includes "Ecology" or "Behavior" subsections for many creatures)
- Appendix A: Miscellaneous Creatures (variant behaviors)

### Volo's Guide to Monsters (VGtM)
Deep dives into specific creature types with extensive ecology

**Best For:**
- Goblinoids (pp. 40-59): Goblins, Hobgoblins, Bugbears - social structure, tactics
- Giants (pp. 14-39): Ettin psychology, tribal dynamics
- Mind Flayers (pp. 71-84): Colony structures
- Beholders (pp. 3-13): Paranoia, lair logic, minion relationships

### Mordenkainen's Tome of Foes (MTF)
Cultural and sociological details for many creatures

**Best For:**
- Duergar (pp. 78-85): Underground settlements
- Githyanki/Githzerai (pp. 86-101): Planar ecology
- Demons (pp. 50-69): Chaotic hierarchies

### Fizban's Treasury of Dragons
Dragon ecology, territorial behavior, minion relationships

### Other Valuable Sources
- **Sage Advice Compendium**: Official rulings on creature behavior
- **Adventure modules**: Show creatures in context (Out of the Abyss, Waterdeep: Dragon Heist)
- **Dragon Magazine archives**: Historical ecology articles

## How to Apply Lore to Your Dungeon

### 1. Start with the Monster Manual Entry
Read the full creature description, not just stat block:
- "Environment" section tells you where they naturally live
- "Lair" section describes how they modify spaces
- Flavor text reveals motivations and behavior patterns

### 2. Ask Ecological Questions
- **What do they eat?** (Carnivore, herbivore, scavenger, parasite)
- **How do they reproduce?** (Affects population dynamics)
- **What threatens them?** (Natural predators, rival species)
- **Do they modify their environment?** (Build, destroy, pollute)
- **Are they social or solitary?** (Pack dynamics, hierarchies)

### 3. Check for Specific Behavioral Traits
- **Goblins** (MM p.165): Scavengers, bully the weak, fear the strong → They'd flee from Ettin but might secretly steal food
- **Ettins** (MM p.132): Two heads argue, not bright, but strong → Won't maintain complex traps, but natural intimidation keeps goblins in line
- **Beholders** (VGtM p.3): Paranoid, eliminate threats, enslave minions → Any trap serves the beholder's security, minions are expendable tools

### 4. Apply Realistic Constraints
**Example: Goblins in a Cave**
- MM says goblins are "scavengers" → They need food from outside OR another source
- MM says they "fear the strong" → They'll avoid the Ettin's territory unless desperate
- VGtM says they "serve stronger creatures" → The Ettin might use them as servants

**Logical Ecology:**
- Goblins occupy outer caves (can scavenge from forest)
- Ettin lives in deepest chamber (food brought by goblins as tribute)
- Traps in outer caves (goblin-made, crude, protect from external threats)
- No traps near Ettin's lair (Ettin is the defense, doesn't understand traps)

### 5. Create Realistic Restocking
**If Goblins Die:**
- Ettin loses servants → Gets hungry → Ventures out to hunt (becomes wandering threat)
- Cave becomes attractive to other scavengers (gnolls, orcs, etc.) due to vacancy
- Over 2-3 weeks, new faction might move in (roll on wandering monster table)

**If Ettin Dies:**
- Goblins celebrate briefly → Then realize they've lost protection
- Rival goblin tribe might invade to claim the cave
- Goblins might flee entirely, leaving dungeon empty for larger predator (displacer beast, troll)

## Quick Reference by Creature Type

| Creature    | Food Source          | Social?      | Lair Behavior           | Source         |
|-------------|----------------------|--------------|-------------------------|----------------|
| Goblin      | Scavenger/Omnivore   | Tribal       | Crude fortifications    | MM p.165       |
| Ettin       | Carnivore/Hunter     | Solitary pair| Messy, smells bad       | MM p.132       |
| Beholder    | Carnivore            | Solitary     | Obsessively trapped     | VGtM p.3       |
| Troll       | Carnivore            | Solitary     | Filthy, regenerates     | MM p.291       |
| Kobold      | Omnivore             | Tribal       | Complex traps, tunnels  | VGtM p.63      |
| Orc         | Carnivore/Raider     | Tribal/Horde | Fortified camps         | MM p.245       |
| Gnoll       | Carnivore/Hyena      | Pack         | Nomadic, dens           | VGtM p.35      |

## Example Ecology: Goblin + Ettin Cave

**Lore Foundation:**
- **Goblins** (MM p.165, VGtM p.40): Scavengers, serve stronger beings, build crude traps
- **Ettin** (MM p.132): Chaotic, stupid, but powerful; two heads argue

**Relationship:**
- Type: Master-Servant (forced)
- Goblins pay "protection tax" to Ettin (food from raids)
- Ettin tolerates goblins because they feed it
- Goblins use Ettin as deterrent against larger threats

**Defenses:**
- **Outer Cave Traps:** Goblin-made (pit traps, snares) to protect against external raids
  - *Why here?* Goblins fear rival tribes, protect their territory
  - *Logic:* Crude but effective, match goblin intelligence level
- **No Traps in Ettin's Lair:** Ettin doesn't understand or maintain traps
  - *Why not?* Ettin's strength IS the defense
  - *Logic:* Ettin would trigger its own traps due to low intelligence

**Restocking:**
- **Goblins eliminated:** Ettin gets hungry, raids nearby farms, eventually killed by militia OR starves
- **Ettin eliminated:** Goblins celebrate, then face goblin civil war over leadership OR flee in fear of unknown threat that killed the Ettin
`;
  }

  async createEcology(args) {
    const { location_name, location_type, primary_faction, description = '' } = args;
    const filename = `${location_name.replace(/\s+/g, '_')}_Ecology.md`;
    const filepath = path.join(campaignRoot, 'Dungeon_Ecologies', filename);

    const content = `---
name: "${location_name} - Ecology"
type: Dungeon_Ecology
location: "${location_name}"
location_type: "${location_type}"
status: Active
tags: [ecology, dungeon, ${location_name.toLowerCase().replace(/\s+/g, '-')}]
version: "0.1.0"
---

# ${location_name} - Dungeon Ecology

## Overview
**Location Type:** ${location_type}
**Current State:** Active
**Primary Faction:** ${primary_faction}

${description || '[Add description of the location\'s current ecological state]'}

## Inhabitant Factions

### ${primary_faction}
**Population:** [TBD]
**Territory:** [Which areas they control]
**Behavior:** [TBD]
**Diet:** [TBD]
**Activity Pattern:** [TBD]

**Lore Source:** [Reference source book]
**Key Lore:** [Add relevant behavioral info from official sources]

[Use add_faction tool to add more factions]

## Faction Relationships

[Use define_relationship tool to add relationships]

## Resource Flows

### Food
**Source:** [Where food comes from]
**Flow:** [Who hunts/scavenges what]
**Scarcity:** [Abundant/Moderate/Scarce]

[Use add_resource_flow tool for more resources]

## Defensive Logic

[Use add_defensive_logic tool to document traps and defenses]

## Environmental Logic

[Use add_environmental_logic tool to document environmental elements]

## Restocking Rules

[Use define_restocking_rules tool to set restocking scenarios]

## DM Notes
[Add additional secrets, hidden connections, future plans]

## Lore References
[Use add_lore_reference tool to add source citations]
`;

    await fs.writeFile(filepath, content, 'utf-8');
    await this.loadEcologies();

    return {
      content: [{
        type: 'text',
        text: `Created dungeon ecology: ${filename}\n\nNext steps:\n- Add factions with add_faction\n- Define relationships with define_relationship\n- Document defenses with add_defensive_logic\n- Set restocking rules with define_restocking_rules\n- Add monster lore with add_lore_reference`
      }]
    };
  }

  async addSection(args, sectionType) {
    const { location_name } = args;
    const filename = `${location_name.replace(/\s+/g, '_')}_Ecology.md`;
    const filepath = path.join(campaignRoot, 'Dungeon_Ecologies', filename);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      let sectionContent = '';

      switch (sectionType) {
        case 'faction':
          sectionContent = this.formatFactionSection(args);
          break;
        case 'relationship':
          sectionContent = this.formatRelationshipSection(args);
          break;
        case 'defense':
          sectionContent = this.formatDefenseSection(args);
          break;
        case 'resource':
          sectionContent = this.formatResourceSection(args);
          break;
        case 'restocking':
          sectionContent = this.formatRestockingSection(args);
          break;
        case 'environment':
          sectionContent = this.formatEnvironmentSection(args);
          break;
        case 'lore':
          sectionContent = this.formatLoreSection(args);
          break;
      }

      const newContent = this.insertSection(content, sectionType, sectionContent);
      await fs.writeFile(filepath, newContent, 'utf-8');
      await this.loadEcologies();

      return {
        content: [{
          type: 'text',
          text: `Added ${sectionType} to ${location_name} ecology`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to add section: ${error.message}`);
    }
  }

  formatFactionSection(args) {
    const { faction_name, population, territory, behavior, diet } = args;
    return `
### ${faction_name}
**Population:** ${population}
**Territory:** ${territory}
**Behavior:** ${behavior}
**Diet:** ${diet || 'TBD'}
**Activity Pattern:** [TBD]

**Lore Source:** [Reference source book]
**Key Lore:** [Add relevant behavioral info]
`;
  }

  formatRelationshipSection(args) {
    const { faction_a, faction_b, relationship_type, details } = args;
    return `
### ${faction_a} ↔ ${faction_b}
**Type:** ${relationship_type}
**Dynamics:** ${details}
**Power Balance:** [TBD]
`;
  }

  formatDefenseSection(args) {
    const { defense_name, location_in_dungeon, original_purpose, current_state, who_maintains } = args;
    return `
### ${defense_name}
**Location:** ${location_in_dungeon}
**Original Purpose:** ${original_purpose}
**Current State:** ${current_state}
**Who Maintains:** ${who_maintains || 'None'}
**Functionality:** [How it works in context]
`;
  }

  formatResourceSection(args) {
    const { resource_type, source, flow_path, scarcity } = args;
    return `
### ${resource_type}
**Source:** ${source}
**Flow:** ${flow_path}
**Scarcity:** ${scarcity || 'Moderate'}
`;
  }

  formatRestockingSection(args) {
    const { scenario, immediate_effects, long_term_changes = [], new_arrivals } = args;
    const immediateList = immediate_effects.map(e => `- ${e}`).join('\n');
    const longTermList = long_term_changes.map(c => `- ${c}`).join('\n');

    return `
### Scenario: ${scenario}
**Immediate Effects:**
${immediateList}

**Long-Term Changes (1-2 weeks):**
${longTermList || '- [TBD]'}

**New Arrivals:** ${new_arrivals || '[TBD]'}
`;
  }

  formatEnvironmentSection(args) {
    const { element, purpose, current_use } = args;
    return `
### ${element}
**Purpose:** ${purpose}
**Current Use:** ${current_use || '[TBD]'}
**Logic:** [Why it makes sense here]
`;
  }

  formatLoreSection(args) {
    const { creature_type, source_book, lore_summary, application } = args;
    return `
- **${source_book}** - ${creature_type}: ${lore_summary}${application ? `\n  - *Application:* ${application}` : ''}
`;
  }

  insertSection(content, sectionType, sectionContent) {
    const sectionMap = {
      faction: '## Inhabitant Factions',
      relationship: '## Faction Relationships',
      defense: '## Defensive Logic',
      resource: '## Resource Flows',
      restocking: '## Restocking Rules',
      environment: '## Environmental Logic',
      lore: '## Lore References'
    };

    const header = sectionMap[sectionType];
    if (!header) return content;

    // Find the section and append to it
    const headerIndex = content.indexOf(header);
    if (headerIndex === -1) return content;

    // Find the next section header
    const nextHeaderIndex = content.indexOf('\n## ', headerIndex + header.length);
    const insertIndex = nextHeaderIndex === -1 ? content.length : nextHeaderIndex;

    return content.slice(0, insertIndex) + sectionContent + '\n' + content.slice(insertIndex);
  }

  async getEcology(args) {
    const { location_name } = args;
    const ecology = this.ecologies.find(e => e.location === location_name || e.file.includes(location_name.replace(/\s+/g, '_')));

    if (!ecology) {
      throw new Error(`Ecology for ${location_name} not found`);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(ecology, null, 2)
      }]
    };
  }

  async simulateChange(args) {
    const { location_name, change_type, target_faction } = args;

    // This would analyze the ecology and predict changes
    // For now, return a structured prompt for the DM
    return {
      content: [{
        type: 'text',
        text: `Simulating: ${change_type} for ${target_faction} in ${location_name}\n\nAnalyzing:\n- Current faction relationships\n- Resource dependencies\n- Power dynamics\n- Territorial claims\n\n[Full simulation would be implemented here based on ecology data]`
      }]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Dungeon Ecology MCP server running on stdio');
  }
}

const server = new DungeonEcologyServer();
server.run().catch(console.error);
