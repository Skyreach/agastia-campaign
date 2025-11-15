# Dungeon Creation Command

Create a new dungeon with ecology and session flow using workflow enforcement.

## Process:
1. Start workflow-enforcer for dungeon creation
2. Present 3-4 dungeon options with:
   - Dungeon type (cave, ruins, building, forest, underground)
   - Size (small 3-5 rooms, medium 6-10 rooms, large 11+ rooms)
   - Primary faction/inhabitants
   - Jaquaysing principles (multiple paths, loops, verticality)
3. Get user selection
4. Generate dungeon with:
   - Ecology document (factions, food chains, defensive logic)
   - Session flow structure (node-based navigation)
   - Room descriptions with tiered DCs
   - Properly nested Notion structure
5. Show preview and get approval
6. Save to Dungeon_Ecologies/ and Session_Flows/, sync to Notion

## Parameters (all optional):
- **dungeon_name**: Name of the dungeon
- **dungeon_type**: cave | ruins | building | forest | underground
- **size**: small | medium | large
- **primary_faction**: Dominant creature/faction
- **session_number**: Associated session number (if part of session)

## Example Usage:
```
/dungeon
/dungeon dungeon_name="Ratterdan Crypts" dungeon_type=ruins size=small
/dungeon dungeon_name="Goblin Warren" primary_faction="Goblins" session_number=1
```
