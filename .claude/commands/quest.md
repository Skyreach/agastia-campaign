Start workflow-enforcer for quest generation workflow, then present 3-4 quest options for user to choose from.

⚠️ CRITICAL: Read .config/ENCOUNTER_EXPECTATIONS.md if quest involves encounters
- NEVER suggest encounter frequencies or how often to roll
- Provide complete encounter tables only, DM decides usage
- Respect DM authority over gameplay decisions

Use dnd-campaign MCP's generate_quest tool with workflow enforcement and Fronts/Grim Portents mechanics.

Parameters available (all optional):
- quest_type: mission | travel | mixed
- location: Primary location for the quest
- patron_npc: NPC issuing the quest
- reward_npc: NPC providing reward (defaults to patron_npc)
- num_nodes: Number of quest steps (2-10)
- completion_time_days: In-game time to complete
- base_monster: Boss/threat for impending doom
- hook_number: Adventure hook reference number
- export_mermaid: true | false (generates Mermaid flowchart)

Process:
1. Start workflow: workflow-enforcer start_workflow(workflow_type="quest_generation")
2. If missing parameters, generate_quest will suggest 3 options for each:
   - Location options (from campaign locations)
   - Patron NPC options (from active NPCs)
   - Base monster options (impending doom threats)
   - Time estimates (based on node count)
3. User selects options
4. Transition to generate_content stage
5. Call generate_quest with workflow_id and selected parameters
6. Show preview with node-based structure and fail-forward mechanics
7. Get approval
8. Save to Quests/ directory and sync to Notion
9. Complete workflow

Quest Structure:
- Uses Dungeon World Fronts/Grim Portents
- Node-based progression with travel/completion times
- Success/failure/abandon outcomes for each node
- Impending doom if quest abandoned

When Integrating Quests into Sessions:
- If adding to existing session file, follow SESSION_FORMAT_SPEC.md
- Add quest as H3 node under "## Nodes" section
- Include all NPCs inline with stats/DCs (no external references)
- Use tiered DC format for descriptions
- Add to Quick Reference toggles (NPCs, Rewards, Items)
- Keep self-contained for Notion compatibility
