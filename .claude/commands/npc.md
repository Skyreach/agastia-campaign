# NPC Generation Command

Generate a new NPC using the workflow-enforced process.

## Process:
1. Start workflow-enforcer for NPC creation
2. Present 3-4 NPC options with:
   - NPC type (major, minor, faction, location, random)
   - Role (ally, rival, neutral, villain, patron, merchant, quest_giver)
   - Faction (optional)
   - Location (optional)
   - CR (optional, for combatants)
   - Include stat block? (optional)
3. Get user selection
4. Generate NPC with selected parameters
5. Show preview and get approval
6. Save to appropriate directory and sync to Notion

## Parameters (all optional):
- **npc_type**: major | minor | faction | location | random
- **role**: ally | rival | neutral | villain | patron | merchant | quest_giver
- **faction**: Associated faction name
- **location**: Current location
- **cr**: Challenge rating (if combatant)
- **include_stat_block**: true | false

## Example Usage:
```
/npc
/npc npc_type=major role=patron
/npc npc_type=faction role=villain faction="Chaos Cult"
```
