Start workflow-enforcer for NPC creation workflow, then present 3-4 NPC options for user to choose from.

Use dnd-campaign MCP's generate_npc tool with workflow enforcement.

Parameters available (all optional):
- npc_type: major | minor | faction | location | random
- role: ally | rival | neutral | villain | patron | merchant | quest_giver
- faction: Associated faction name
- location: Current location
- cr: Challenge rating (if combatant)
- include_stat_block: true | false

Process:
1. Start workflow: workflow-enforcer start_workflow(workflow_type="npc_creation")
2. Generate 3-4 NPC concept options with different combinations
3. User selects one
4. Transition to generate_content stage
5. Call generate_npc with workflow_id and selected parameters
6. Show preview, get approval
7. Save and sync to Notion
8. Complete workflow
