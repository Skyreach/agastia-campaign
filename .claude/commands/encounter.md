# Encounter Generation Command

Generate a new encounter using the workflow-enforced process.

## Process:
1. Start workflow-enforcer for encounter generation
2. Present 3-4 encounter options with:
   - Encounter type (combat, environmental, social, trap, mixed)
   - Difficulty (Easy, Medium, Hard, Deadly)
   - Location (optional)
   - Resource focus (spell_slots, hit_dice, abilities, mixed)
3. Get user selection
4. Generate encounter with selected parameters
5. Show preview and get approval
6. Save to Encounters/ directory and sync to Notion

## Parameters (all optional):
- **encounter_type**: combat | environmental | social | trap | mixed
- **difficulty**: Easy | Medium | Hard | Deadly
- **location**: Where the encounter takes place
- **resource_focus**: spell_slots | hit_dice | abilities | mixed

## Example Usage:
```
/encounter
/encounter encounter_type=combat difficulty=Hard
/encounter encounter_type=mixed location="Ratterdan Ruins" difficulty=Medium
```
