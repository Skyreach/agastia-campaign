# Session Flow MCP Server

Tower-defense style flowchart tracking for D&D sessions.

## Purpose
Manage session structure as flowcharts that track:
- Starting locations and conditions
- Decision points with branching paths
- Encounter references
- NPC interactions
- Quest progression nodes
- Multiple possible outcomes

## Installation

```bash
cd mcp_server_session_flow
npm install
```

Add to your Claude Desktop config (`~/.config/claude/config.json`):

```json
{
  "mcpServers": {
    "session-flow": {
      "command": "node",
      "args": ["/path/to/agastia-campaign/mcp_server_session_flow/server.js"]
    }
  }
}
```

## Available Tools

### create_session_flow
Create a new session flowchart document.

**Parameters:**
- `session_number` (number) - Session number
- `session_name` (string) - Session title
- `start_location` (string) - Where session begins
- `start_condition` (string, optional) - Initial situation

### add_decision_point
Add a decision node where players choose between options.

**Parameters:**
- `session_number` (number)
- `node_id` (string) - Unique ID like "dp1"
- `description` (string) - What decision players face
- `options` (array) - Possible choices
- `parent_node` (string, optional) - Previous node ID

### add_encounter_node
Link an encounter to the flow.

**Parameters:**
- `session_number` (number)
- `node_id` (string)
- `encounter_name` (string) - Links to encounter MCP
- `trigger` (string, optional) - What causes it
- `parent_node` (string, optional)

### add_npc_interaction
Add an NPC interaction node.

**Parameters:**
- `session_number` (number)
- `node_id` (string)
- `npc_name` (string)
- `interaction_type` (string) - conversation, trade, combat
- `key_information` (string, optional)
- `parent_node` (string, optional)

### add_quest_progression
Mark quest advancement at a node.

**Parameters:**
- `session_number` (number)
- `node_id` (string) - Which node triggers it
- `quest_name` (string)
- `progression_type` (string) - started, clue_found, completed

### set_session_outcome
Define a possible ending state.

**Parameters:**
- `session_number` (number)
- `outcome_id` (string)
- `description` (string)
- `consequences` (array, optional)
- `parent_node` (string, optional)

### get_session_flow
Retrieve a session flow by number.

### visualize_flow
Generate text visualization of the flow.

## Resources

- `session-flow://all` - All session flows
- `session-flow://template` - Template for new flows

## Example Usage

```javascript
// Create a new session flow
create_session_flow({
  session_number: 1,
  session_name: "Caravan to Ratterdan",
  start_location: "Agastia City Gates",
  start_condition: "Party meets patron"
})

// Add a decision point
add_decision_point({
  session_number: 1,
  node_id: "dp1",
  description: "Patron offers two routes to Ratterdan",
  options: ["Safe road (longer)", "Forest shortcut (dangerous)"],
  parent_node: "start"
})

// Add an encounter
add_encounter_node({
  session_number: 1,
  node_id: "enc1",
  encounter_name: "Bandit Ambush",
  trigger: "If players take forest route",
  parent_node: "dp1"
})
```

## File Structure

Session flows are stored in `/Session_Flows/` as markdown files:
- `Session_1_Flow.md`
- `Session_2_Flow.md`
- etc.

Each file contains:
- Frontmatter with metadata
- Flowchart nodes in markdown
- Cross-references to encounters, NPCs, quests
- DM notes section
