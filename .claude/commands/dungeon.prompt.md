Start workflow-enforcer for dungeon creation workflow, then present 3-4 dungeon options for user to choose from.

Use dungeon-ecology MCP and session-flow MCP together with workflow enforcement.

Parameters available (all optional):
- dungeon_name: Name of the dungeon
- dungeon_type: cave | ruins | building | forest | underground
- size: small | medium | large
- primary_faction: Dominant creature/faction
- session_number: Associated session number (if part of session)

Process:
1. Start workflow: workflow-enforcer start_workflow(workflow_type="dungeon_creation")
2. Generate 3-4 dungeon concept options:
   - Different types (cave, ruins, building, etc.)
   - Different sizes and complexities
   - Different faction dynamics
   - Different Jaquaysing approaches (loops, multiple entrances, verticality)
3. User selects one
4. Transition to generate_content stage
5. Create dungeon ecology (dungeon-ecology MCP):
   - create_ecology with location, type, primary faction
   - add_faction for each inhabitant group
   - define_relationship between factions
   - add_defensive_logic for traps/defenses
   - add_resource_flow for food/water/treasure
   - define_restocking_rules for dynamic changes
   - add_lore_reference for monster behavior
6. Create session flow structure (session-flow MCP):
   - create_session_flow if part of session
   - add_decision_point for navigation choices
   - add_encounter_node for combat/challenges
   - Use create_dungeon_structure for Notion hierarchical structure
7. Show preview with:
   - Ecology summary (factions, relationships, resources)
   - Room layout and connections
   - Defensive logic and restocking rules
8. Get approval
9. Save to Dungeon_Ecologies/ and Session_Flows/
10. Sync to Notion using hierarchical structure builder
11. Complete workflow

Dungeon Design Principles:
- Jaquaysing: Multiple paths, loops, secrets, verticality
- Living ecology: Factions interact, resources flow, dungeons change
- Defensive logic: Why traps exist, who maintains them
- Restocking rules: What happens when factions are eliminated
- Monster lore: Behavior based on official sources

When Integrating Dungeons into Sessions:
- If adding to session file (session_number provided), follow SESSION_FORMAT_SPEC.md
- Add dungeon rooms as H3 nodes under "## Nodes" section
- Use AREA X: Room Name format for room headers
- Include all stat blocks inline or in **Toggle:** sections
- Use tiered DC format for room descriptions
- Add key NPCs/monsters to Quick Reference toggles
- Keep self-contained for Notion compatibility (no external references)
- Use hierarchical structure builder for complex nested dungeons
