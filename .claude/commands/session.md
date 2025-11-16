Start workflow-enforcer for session generation workflow, then present 3-4 session structure options for user to choose from.

⚠️ CRITICAL: Read .config/ENCOUNTER_EXPECTATIONS.md before generating session content
- NEVER suggest encounter frequencies or how often to roll on tables
- Provide complete encounter tables only, DM decides usage
- Respect DM authority over gameplay decisions

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

Session Format Requirements (SESSION_FORMAT_SPEC.md):

**Required Sections (In Order):**
1. Frontmatter (YAML: name, session_number, status, version, tags)
2. H1 Title + Party Line
3. Session Flowchart (Mermaid - MUST be before Quick Reference)
4. Quick Reference (4-6 toggle categories: Flow, NPCs, Rewards, Items, Hints)
5. Nodes (All under single H2 "Nodes", each node as H3, separated by ---)
6. Post-Session Debrief (required section)

**Critical Requirements:**
- Self-contained: All NPCs inline with stats/DCs (no external file references)
- All stat blocks inline or in toggles
- All skill check DCs specified
- Tiered DC format for all scene descriptions (| opening, DC 10/14/17/20)
- Notion-compatible: No HTML tags, use **Toggle:** format
- Planning notes go to .working/Session_X_Planning_Notes.md (separate file)

**Before Marking status: Ready:**
- [ ] All required sections present
- [ ] All NPCs described inline
- [ ] All combat encounters have stat blocks
- [ ] All DCs specified
- [ ] Nodes under single H2
- [ ] Planning notes separated to .working/
- [ ] File runnable from Notion (no external dependencies)
