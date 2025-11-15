# Inspired Encounter Command

Roll on the inspiring encounter tables (Tier 1 or Tier 2) and present the result, optionally re-themed for the current location.

## Process:
1. Determine party tier (levels 1-4 = Tier 1, levels 5-10 = Tier 2)
2. Determine current terrain/location type
3. Roll appropriate dice for that terrain
4. Present the encounter from the tables
5. If terrain doesn't match current location:
   - Present the original encounter theme
   - Offer 3-4 re-themed variations that fit the current location
   - Get user selection on which version to use
6. Inject into session planning or encounter generation as appropriate

## Parameters (all optional):
- **tier**: 1 | 2 (defaults to party level)
- **terrain**: temperate_forests | arctic_tundra | mountains | deserts | jungles | swamps | coastal | urban
- **roll**: Specific roll number (otherwise random)
- **current_location**: Where the party currently is (for re-theming)
- **auto_accept**: true | false (if true, inject as-is; if false, ask for approval)

## Terrain Dice:
- **Temperate Forests**: 2d8
- **Arctic/Tundra**: 2d6
- **Mountains**: 2d10
- **Deserts**: 2d8
- **Jungles**: 2d10
- **Swamps**: 2d6
- **Coastal**: 2d8
- **Urban**: 2d10

## Example Usage:
```
/inspired-encounter
/inspired-encounter terrain=temperate_forests
/inspired-encounter terrain=mountains current_location="Ratterdan Ruins"
/inspired-encounter tier=2 terrain=jungles auto_accept=true
```

## Notes:
- Encounters are **inspiration only** - DM solves at the table
- Original theme is always presented, even when re-themed
- Re-theming preserves core mechanics and difficulty
- If used in `/session` or `/encounter`, integrates directly into that workflow
