Start workflow-enforcer for encounter generation workflow, then present 3-4 encounter options for user to choose from.

Use dnd-campaign MCP's generate_encounter tool with workflow enforcement.

Parameters available (all optional):
- encounter_type: combat | environmental | social | trap | mixed
- difficulty: Easy | Medium | Hard | Deadly (default: Medium)
- location: Where the encounter takes place
- resource_focus: spell_slots | hit_dice | abilities | mixed (default: mixed)

Process:
1. Start workflow: workflow-enforcer start_workflow(workflow_type="encounter_generation")
2. Generate 3-4 encounter concept options with different combinations
   - Include option: "Roll on Inspiring Encounter Tables"
3. User selects one
4. If user selected "inspiring encounter":
   - Call /inspired-encounter with current location and auto_accept=false
   - Present rolled encounter with re-theming options if needed
   - User selects preferred version
   - Integrate into encounter workflow
5. Transition to generate_content stage
6. Call generate_encounter with workflow_id and selected parameters
7. Show preview with resource drain mechanics and tactics
8. Get approval
9. Save to Encounters/ directory and sync to Notion
10. Complete workflow

Inspired Encounter Integration:
- When presenting options, always include "inspiring tables" as one option
- If selected, use /inspired-encounter to roll and present
- Re-theme as needed for current location
- Preserve all mechanics (DCs, stats, rewards) from inspiring tables
- Inject the selected inspiring encounter into the encounter document
