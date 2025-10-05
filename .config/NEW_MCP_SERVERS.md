# New MCP Servers Documentation

**Created:** 2025-10-04

## Overview

Two new Model Context Protocol (MCP) servers have been created to extend D&D campaign management capabilities:

1. **Session Flow MCP** - Tower-defense style session flowcharts
2. **Dungeon Ecology MCP** - Living dungeon ecosystem tracking

---

## 1. Session Flow MCP Server

**Location:** `/mcp_server_session_flow/`

### Purpose
Manage session structure as flowcharts that track player progression through sessions, inspired by tower-defense game flow design.

### Key Features
- **Starting states** - Where and how sessions begin
- **Decision points** - Branching paths based on player choices
- **Encounter nodes** - Links to encounter definitions (cross-references with encounter MCP)
- **NPC interactions** - Track conversations and key information exchange
- **Quest progression** - Mark quest advancement at specific nodes
- **Multiple outcomes** - Define different session ending states and their consequences

### Tools Provided
- `create_session_flow` - Create new session flowchart
- `add_decision_point` - Add branching choice nodes
- `add_encounter_node` - Link encounters to flow
- `add_npc_interaction` - Add NPC interaction nodes
- `add_quest_progression` - Mark quest updates
- `set_session_outcome` - Define possible endings
- `get_session_flow` - Retrieve session by number
- `visualize_flow` - Generate text visualization

### Storage
Session flows are stored in `/Session_Flows/` as markdown files:
- `Session_1_Flow.md`
- `Session_2_Flow.md`
- etc.

### Use Case Example
**Session 1: Caravan to Ratterdan**

```
START: Agastia City Gates
↓
Node: dp1 (Decision Point)
  - Safe road (longer) → enc2 (Merchant encounter)
  - Forest shortcut → enc1 (Bandit ambush)
↓
Node: npc1 (NPC Interaction)
  - Meet hermit in forest
  - Learn about Ratterdan destruction
↓
OUTCOME 1: Arrive at Ratterdan
OUTCOME 2: Return to city for reinforcements
```

Each node can link to:
- Encounters (managed by encounter MCP)
- NPCs (in main campaign database)
- Quests (managed by quest MCP)

---

## 2. Dungeon Ecology MCP Server

**Location:** `/mcp_server_dungeon_ecology/`

### Purpose
Track realistic, living ecosystems within dungeons and locations. Ensures dungeons feel like believable places with logical inhabitant relationships, not random monster collections.

### Key Features
- **Faction tracking** - Who lives here, populations, territories
- **Relationship dynamics** - Predator-prey, symbiotic, hostile, master-servant
- **Food chains** - What eats what, resource scarcity
- **Defensive logic** - Why traps exist, who built them, who maintains them
- **Restocking rules** - How dungeons change when factions are eliminated/added
- **Environmental logic** - Why rooms/features exist and make sense
- **Monster lore citations** - References to official D&D sources (MM, VGtM, MTF)

### Tools Provided
- `create_ecology` - Create new ecology document
- `add_faction` - Add creature/faction to location
- `define_relationship` - Set faction relationships
- `add_defensive_logic` - Document why traps/defenses exist
- `add_resource_flow` - Define food/water/treasure sources
- `define_restocking_rules` - Set change scenarios
- `add_environmental_logic` - Document realistic environmental details
- `add_lore_reference` - Cite official monster lore
- `get_ecology` - Retrieve specific ecology
- `simulate_change` - Predict effects of faction removal/arrival

### Storage
Ecologies are stored in `/Dungeon_Ecologies/` as markdown files:
- `Cragmaw_Hideout_Ecology.md`
- `Ratterdan_Ruins_Ecology.md`
- etc.

### Use Case Example
**Cragmaw Hideout (Goblin Cave with Ettin)**

**Factions:**
- Cragmaw Goblins (12-15) - Outer caves, scavengers
- Ettin "Grimdor" (1) - Deep chamber, territorial

**Relationship:**
- Type: Master-Servant (forced)
- Goblins pay food tribute to Ettin
- Ettin provides protection from external threats

**Defensive Logic:**
- **Pit trap at entrance** - Built by goblins to defend from rival tribes
- **No traps near Ettin's lair** - Ettin too stupid to maintain them, strength IS the defense

**Restocking Rules:**
- **If Goblins eliminated:** Ettin loses food source → raids farms → killed by militia (1 week)
- **If Ettin eliminated:** Goblins celebrate → civil war OR flee → new faction claims cave (2-3 weeks)

**Lore References:**
- MM p.165 - Goblins are scavengers who serve stronger creatures
- MM p.132 - Ettins are territorial but low intelligence

### Design Philosophy

**Questions This Answers:**
- Why are these creatures here together?
- What do they eat?
- Why is there a trap in this hallway?
- What happens if players kill one faction?
- How does this place feel alive and realistic?

**Lore-Based:**
All ecology decisions should reference official D&D sources to ensure monsters behave according to their established lore.

---

## Installation

Run the installation script:
```bash
cd /mnt/e/dnd/agastia-campaign
./install_new_mcps.sh
```

This will:
1. Install npm dependencies for both servers
2. Create storage directories (`Session_Flows/`, `Dungeon_Ecologies/`)
3. Provide Claude Desktop configuration instructions

### Manual Configuration

Add to `~/.config/claude/config.json`:

```json
{
  "mcpServers": {
    "session-flow": {
      "command": "node",
      "args": ["/path/to/agastia-campaign/mcp_server_session_flow/server.js"]
    },
    "dungeon-ecology": {
      "command": "node",
      "args": ["/path/to/agastia-campaign/mcp_server_dungeon_ecology/server.js"]
    }
  }
}
```

Then restart Claude Desktop.

---

## Integration with Existing Tools

### Session Flow + Quest MCP
- Session flow nodes can reference quests
- Quest progression tracked at specific flowchart nodes
- Helps plan sessions around quest advancement

### Session Flow + Encounter MCP
- Encounter nodes link to encounter definitions
- Flowchart shows when/where encounters trigger
- Conditional encounters based on player decisions

### Dungeon Ecology + Main Campaign MCP
- Ecologies reference NPCs in main database
- Faction relationships inform session planning
- Restocking rules create dynamic world changes

### Dungeon Ecology + Session Flow
- Session flows reference ecology documents
- "What happens if players eliminate this faction?" → Check restocking rules
- Helps predict consequences of player actions

---

## Documentation

### Full READMEs:
- `mcp_server_session_flow/README.md` - Complete tool reference
- `mcp_server_dungeon_ecology/README.md` - Complete tool reference

### Lore Resource:
- Access via `ecology://lore-sources` resource
- Comprehensive guide to using Monster Manual, Volo's Guide, etc.
- Examples of applying official lore to custom dungeons

---

## Benefits

### Session Flow Benefits:
1. **Clear session structure** - Visual flowchart of session possibilities
2. **Prepare for player agency** - Multiple paths = player choice matters
3. **Track complexity** - See all encounters, NPCs, quests in one view
4. **Session replay** - Document what actually happened vs. planned paths

### Dungeon Ecology Benefits:
1. **Realistic dungeons** - Creatures act according to lore
2. **Logical defenses** - Traps make sense in context
3. **Dynamic world** - Dungeons change based on player actions
4. **Easy prep** - Answering "what happens if..." is documented
5. **Richer storytelling** - Faction relationships create emergent narratives

---

## Next Steps

1. Install both servers: `./install_new_mcps.sh`
2. Configure Claude Desktop with server paths
3. Restart Claude Desktop
4. Test with example session/dungeon:
   - Create a simple session flow for an upcoming session
   - Create an ecology for a dungeon the players will explore

5. Iterate:
   - Add more detail as you prep
   - Update after sessions based on what actually happened
   - Use restocking rules to evolve dungeons between sessions

---

## Maintenance

### Updates
Both servers use semantic versioning (currently 1.0.0).

### Storage
- Session flows: `/Session_Flows/` (markdown)
- Ecologies: `/Dungeon_Ecologies/` (markdown)
- Both are git-tracked for version control

### Dependencies
- `@modelcontextprotocol/sdk` - MCP framework
- `front-matter` - YAML frontmatter parsing

Run `npm install` in each server directory to update.

---

## Future Enhancements

### Potential Session Flow Additions:
- Visual flowchart export (Mermaid.js, Graphviz)
- Session replay mode (track actual player path)
- Time tracking per node
- Difficulty estimation

### Potential Ecology Additions:
- Automated simulation (run restocking scenarios)
- Population dynamics over time
- Cross-dungeon migrations
- Treasure generation based on factions

---

**Last Updated:** 2025-10-04
