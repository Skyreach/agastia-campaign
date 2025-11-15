Start workflow-enforcer for session generation workflow, then present 3-4 session structure options for user to choose from.

Use dnd-campaign MCP's plan_session tool with workflow enforcement and SESSION_FORMAT_SPEC.md compliance.

Parameters available (all optional):
- session_number: Session number (required if not provided)
- title: Session title/theme
- focus: Main session focus (combat, social, exploration, mixed)
- session_type: linear | node-based | sandbox | dungeon-crawl

Process:
1. Start workflow: workflow-enforcer start_workflow(workflow_type="session_generation")
2. Generate 3-4 session structure options:
   - Different session types (linear, node-based, sandbox, dungeon-crawl)
   - Different focus areas (combat, social, exploration, mixed)
   - Different structural approaches (skill challenge → dungeon, social → travel, etc.)
3. User selects one
4. Transition to generate_content stage
5. Call plan_session with workflow_id and selected parameters
6. Generate session following SESSION_FORMAT_SPEC.md:
   - Collapsible sections for table reference
   - Node-based structure with flowchart
   - Tiered DCs for all scenes
   - Tucker's Kobolds tactics
   - Post-session debrief questions
7. During session creation, ask if user wants to integrate inspiring encounters:
   - "Would you like to roll on inspiring encounter tables for any encounters?"
   - If yes: Call /inspired-encounter for each encounter slot
   - If terrain matches session location: Inject as-is with auto_accept=true
   - If terrain doesn't match: Present re-theming options, get selection
   - Integrate selected encounters into session document
8. Show preview and get approval
9. Save to Sessions/ directory and sync to Notion
10. Complete workflow

Inspired Encounter Integration for Sessions:
- After session structure is defined, offer to populate encounters from inspiring tables
- If session location is known (e.g., "Temperate Forest"), auto-match terrain
- If location is unusual (e.g., "Ratterdan Ruins"), ask which terrain to roll on
- Present re-themed options to fit session location
- Inject as formatted encounter blocks within session document
- Preserve tiered DC format and SESSION_FORMAT_SPEC.md compliance

Session Format Requirements:
- Must follow SESSION_FORMAT_SPEC.md structure
- All scenes use tiered DC format (DC 10/13/16/19/22)
- Collapsible sections for NPCs, items, rules
- Mermaid flowchart showing session flow
- Post-session debrief questions
