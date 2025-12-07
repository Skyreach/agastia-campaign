# Generate Hex-Based Encounter

**CRITICAL: This command MUST follow the CONTENT_GENERATION_WORKFLOW.**

## Workflow Enforcement

1. **Start Workflow:**
   - Call `workflow-enforcer: start_workflow(workflow_type="encounter_generation")`
   - Store returned `workflow_id`

2. **Query Hex Terrain (Exploration Phase):**
   - Use hex-map MCP to query the hex and neighbors
   - Call `query_hex(hex=USER_PROVIDED_HEX, include_neighbors=true, include_pois=true)`
   - Analyze terrain distribution in area
   - Use `get_area_summary(center_row, center_col, radius=2)` for broader context

3. **Present Options (REQUIRED FIRST):**
   - Generate 3-4 encounter/POI options based on terrain
   - Each option should include:
     - **Name:** Evocative title
     - **Type:** (encounter/landmark/dungeon/quest)
     - **Terrain Fit:** Why this makes sense for the terrain
     - **Challenge Level:** Estimated CR or difficulty
     - **Hook:** 1-2 sentence player-facing description
   - Present to user for selection
   - Transition workflow: `transition_workflow(workflow_id, next_stage="user_selection")`

4. **Generate Content (After Selection):**
   - User selects option (or requests "Other")
   - Transition workflow: `transition_workflow(workflow_id, next_stage="generate_content")`
   - Generate full encounter/POI details:
     - Full description (DM-facing)
     - Stat blocks (if combat encounter)
     - Loot/rewards
     - Connections to nearby hexes
     - Environmental details based on terrain

5. **User Approval:**
   - Show generated content to user
   - Get approval before saving
   - Transition workflow: `transition_workflow(workflow_id, next_stage="user_approval")`

6. **Save Content:**
   - If approved, save to hex-map POI layer
   - Call `add_poi(hex, poi_data)`
   - Transition workflow: `transition_workflow(workflow_id, next_stage="save_content")`
   - Complete workflow: `complete_workflow(workflow_id)`

## Terrain-Based Generation Guidelines

**Forest:**
- Bandits, wild animals, fey encounters
- Druid groves, ancient trees, hidden clearings
- Low visibility, ambush potential

**Mountains:**
- Giants, dragons, goliaths
- Mines, caves, ancient dwarven ruins
- High elevation hazards, narrow passes

**Ruins:**
- Undead, cultists, treasure hunters
- Cursed artifacts, lost knowledge
- Structural hazards, traps

**Settlement:**
- NPCs, quests, shops
- Political intrigue, rumors
- Social encounters, faction conflicts

**Grassland:**
- Traveling merchants, patrols
- Small monster groups, wildlife
- Open terrain, visible from distance

**Corrupted:**
- Aberrations, fiends, chaos creatures
- Reality distortions, madness
- Environmental chaos effects

**Water:**
- Aquatic creatures, pirates
- Sunken ruins, islands
- Naval encounters, water hazards

## Example Usage

User types: `/hex-encounter 10,5`