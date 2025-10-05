# Dungeon Ecology MCP Server

Living ecosystem management for D&D dungeons and locations.

## Purpose
Track the realistic ecology within dungeons:
- Inhabitant factions and populations
- Predator-prey and faction relationships
- Food chains and resource flows
- Defensive logic (why traps exist)
- Restocking rules (how dungeons change)
- Monster lore from official sources
- Environmental realism

## Installation

```bash
cd mcp_server_dungeon_ecology
npm install
```

Add to your Claude Desktop config (`~/.config/claude/config.json`):

```json
{
  "mcpServers": {
    "dungeon-ecology": {
      "command": "node",
      "args": ["/path/to/agastia-campaign/mcp_server_dungeon_ecology/server.js"]
    }
  }
}
```

## Available Tools

### create_ecology
Create a new dungeon ecology document.

**Parameters:**
- `location_name` (string)
- `location_type` (string) - cave, ruins, building, forest
- `primary_faction` (string) - Dominant creature type
- `description` (string, optional)

### add_faction
Add a creature faction to the ecology.

**Parameters:**
- `location_name` (string)
- `faction_name` (string) - e.g., "Goblins", "Ettins"
- `population` (string) - Exact or range
- `territory` (string) - Which areas they control
- `behavior` (string) - aggressive, territorial, scavenger
- `diet` (string) - What they eat

### define_relationship
Define faction relationships.

**Parameters:**
- `location_name` (string)
- `faction_a` (string)
- `faction_b` (string)
- `relationship_type` (string) - predator-prey, symbiotic, hostile
- `details` (string) - Specific dynamics

### add_defensive_logic
Document why defenses exist.

**Parameters:**
- `location_name` (string)
- `defense_name` (string)
- `location_in_dungeon` (string)
- `original_purpose` (string) - Why it was built
- `current_state` (string) - Maintained/degraded
- `who_maintains` (string, optional)

### add_resource_flow
Define resource movement.

**Parameters:**
- `location_name` (string)
- `resource_type` (string) - food, water, treasure
- `source` (string)
- `flow_path` (string) - How it moves through dungeon
- `scarcity` (string, optional)

### define_restocking_rules
Set dungeon change rules.

**Parameters:**
- `location_name` (string)
- `scenario` (string) - What changes
- `immediate_effects` (array) - Instant consequences
- `long_term_changes` (array, optional)
- `new_arrivals` (string, optional)

### add_environmental_logic
Document environmental realism.

**Parameters:**
- `location_name` (string)
- `element` (string) - Room, water source, etc.
- `purpose` (string) - Why it exists
- `current_use` (string, optional)

### add_lore_reference
Add monster lore citations.

**Parameters:**
- `location_name` (string)
- `creature_type` (string)
- `source_book` (string) - MM, VGtM, etc.
- `lore_summary` (string)
- `application` (string, optional)

### get_ecology
Retrieve a specific ecology.

### simulate_change
Simulate faction removal/arrival.

## Resources

- `ecology://all` - All dungeon ecologies
- `ecology://template` - Template for new ecologies
- `ecology://lore-sources` - Monster lore reference guide

## Example Usage

```javascript
// Create ecology for a goblin cave
create_ecology({
  location_name: "Cragmaw Hideout",
  location_type: "cave",
  primary_faction: "Goblins",
  description: "Natural cave system occupied by goblin tribe"
})

// Add the goblin faction
add_faction({
  location_name: "Cragmaw Hideout",
  faction_name: "Cragmaw Goblins",
  population: "12-15 goblins",
  territory: "Outer caves and entrance",
  behavior: "Scavengers, serve the Ettin",
  diet: "Omnivore - raid farms, forage forest"
})

// Add an Ettin as secondary faction
add_faction({
  location_name: "Cragmaw Hideout",
  faction_name: "Ettin (Grimdor)",
  population: "1",
  territory: "Deep chamber",
  behavior: "Territorial, demands tribute",
  diet: "Carnivore - eats tributes from goblins"
})

// Define their relationship
define_relationship({
  location_name: "Cragmaw Hideout",
  faction_a: "Cragmaw Goblins",
  faction_b: "Ettin (Grimdor)",
  relationship_type: "Master-Servant (forced)",
  details: "Goblins pay food tribute, Ettin provides protection"
})

// Document trap logic
add_defensive_logic({
  location_name: "Cragmaw Hideout",
  defense_name: "Pit Trap at Entrance",
  location_in_dungeon: "Main corridor, 20ft from entrance",
  original_purpose: "Protect from rival goblin tribes",
  current_state: "Well-maintained",
  who_maintains: "Cragmaw Goblins"
})

// Add restocking rules
define_restocking_rules({
  location_name: "Cragmaw Hideout",
  scenario: "Goblins Eliminated",
  immediate_effects: [
    "Ettin loses food source",
    "Cave defenses collapse"
  ],
  long_term_changes: [
    "Ettin ventures out to raid farms (1 week)",
    "May attract new goblin tribe (2-3 weeks)"
  ],
  new_arrivals: "Possible: Gnoll pack, Orc scouts, or Kobolds"
})

// Cite official lore
add_lore_reference({
  location_name: "Cragmaw Hideout",
  creature_type: "Goblin",
  source_book: "Monster Manual p.165",
  lore_summary: "Goblins are scavengers who serve stronger creatures out of fear",
  application: "Explains why they tolerate the Ettin's abuse"
})
```

## File Structure

Ecologies are stored in `/Dungeon_Ecologies/` as markdown files:
- `Cragmaw_Hideout_Ecology.md`
- `Ratterdan_Ruins_Ecology.md`
- etc.

Each file contains:
- Frontmatter with metadata
- Faction descriptions
- Relationship dynamics
- Resource flows
- Defensive logic
- Restocking rules
- Environmental details
- Lore citations

## Design Philosophy

**Why this exists:**
Dungeons should feel like living places with logical ecosystems, not random monster collections.

**Questions this helps answer:**
- Why are these creatures here together?
- What do they eat? How do they survive?
- Why are there traps in this hallway?
- What happens if the players kill one faction?
- How does the dungeon change over time?

**Based on official lore:**
All ecology decisions should reference Monster Manual, Volo's Guide, or other official sources to ensure creatures behave appropriately.
