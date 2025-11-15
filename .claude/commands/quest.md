# Quest Generation Command

Generate a new quest using Fronts/Grim Portents mechanics with workflow enforcement.

## Process:
1. Start workflow-enforcer for quest generation
2. Present 3-4 quest options with:
   - Quest type (mission, travel, mixed)
   - Location options
   - Patron NPC options
   - Base monster/boss options
   - Node count options (quest steps)
   - Completion time estimates
3. Get user selection
4. Generate quest with node-based progression
5. Show preview with impending doom mechanics
6. Get approval
7. Save to Quests/ directory and sync to Notion

## Parameters (all optional):
- **quest_type**: mission | travel | mixed
- **location**: Primary location for the quest
- **patron_npc**: NPC issuing the quest
- **reward_npc**: NPC providing reward (defaults to patron_npc)
- **num_nodes**: Number of quest steps (2-10)
- **completion_time_days**: In-game time to complete
- **base_monster**: Boss/threat for impending doom
- **hook_number**: Adventure hook reference number
- **export_mermaid**: true | false (generates Mermaid flowchart)

## Example Usage:
```
/quest
/quest quest_type=mission location="Ratterdan Ruins"
/quest quest_type=mixed patron_npc="The Patron" base_monster="Beholder" num_nodes=5
```
