# Encounter Page Template

This template defines the standard format for all Tier 1 inspiring encounter pages.

## Template Structure

```markdown
---
name: [Encounter Name]
type: Encounter
terrain: [Temperate Forest | Arctic/Tundra | Mountains | Deserts | Jungles | Swamps | Coastal | Urban]
tier: 1
roll_result: "[Number] on [Dice]"
tags: [encounter, tier1, [terrain-tag], [combat/non-combat], [creature-type]]
---

# [Encounter Name]

**Roll:** [Number] on [Dice]

[Main encounter description paragraph]

**Variation:** [Alternative version or complication]

**Non-Combat:** [How to resolve without fighting]

[Optional: Creature stats or mechanics if needed]
```

## Example: Lost Mastiff

```markdown
---
name: Lost Mastiff
type: Encounter
terrain: Temperate Forest
tier: 1
roll_result: "3 on 2d8"
tags: [encounter, tier1, forest, non-combat, animal, companion]
---

# Lost Mastiff

**Roll:** 3 on 2d8

A skeletal, starving mastiff watches the party from the undergrowth, too scared to approach. It wears a rotted leather collar with a noble family's crest. If offered food, it bonds with whoever feeds it first and becomes fiercely loyal.

**Variation:** The dog is being tracked by a bugbear who wants to eat it—the bugbear arrives in 1d4 rounds after the party encounters the dog.

**Non-Combat:** Following the collar's crest leads to a ruined estate where the dog's original owners were killed by bandits; treasure remains hidden in the wreckage.
```

## Frontmatter Field Guide

### name
- The encounter's display name
- Use title case
- Keep original name from source table

### type
- Always set to `Encounter` for these pages

### terrain
- One of: Temperate Forest, Arctic/Tundra, Mountains, Deserts, Jungles, Swamps, Coastal, Urban
- Matches the section header from source table

### tier
- Always `1` for these Tier 1 encounters
- Future tiers will use 2, 3, 4, etc.

### roll_result
- Format: `"[number] on [dice]"`
- Examples: "3 on 2d8", "12 on 2d6", "20 on 2d10"
- Quoted string in frontmatter

### tags
- Array of lowercase tags
- Always include: `encounter`, `tier1`
- Terrain tag options:
  - forest, arctic, tundra, mountains, desert, jungle, swamp, coastal, urban
- Encounter type:
  - combat, non-combat, mixed
- Creature types (if applicable):
  - dragon, undead, humanoid, beast, fey, aberration, etc.
- Thematic tags:
  - social, exploration, puzzle, trap, ambush, rescue, etc.

## Tag Examples by Encounter

**Lost Mastiff:**
`[encounter, tier1, forest, non-combat, animal, companion]`

**Green Dragon Wyrmling:**
`[encounter, tier1, forest, combat, dragon, negotiation]`

**Goblin Ambush Site:**
`[encounter, tier1, forest, combat, humanoid, trap, ambush]`

**Helpful Sprite Circle:**
`[encounter, tier1, forest, non-combat, fey, social, blessing]`

**Sandstorm:**
`[encounter, tier1, desert, non-combat, environmental, survival]`

**Cult Sacrifice:**
`[encounter, tier1, swamp, combat, humanoid, rescue, social]`

## Content Guidelines

### Description
- Keep the full original text from source table
- Preserve all mechanical details (DCs, damage, stats)
- Include flavor and sensory details
- 2-4 sentences typical

### Variation
- Always include if present in source
- Presents alternative version or complication
- May increase difficulty or add twist
- Prefix with "**Variation:**"

### Non-Combat
- Always include if present in source
- Describes peaceful resolution or alternative approach
- May involve skill checks, negotiation, stealth
- Should offer meaningful alternative to combat
- Prefix with "**Non-Combat:**"

### Optional Sections
Add these only if needed:

**Creature Stats:**
If encounter involves specific creatures, can include stat block reference:
```markdown
## Creatures
- **Giant Wolf Spiders (3):** AC 13, HP 11, +3 to hit, 1d6+1 piercing plus DC 11 CON save or 2d8 poison
- **Ettercap (1):** AC 13, HP 44, +4 to hit, 1d8+2 piercing plus web attack
```

**Rewards/Treasure:**
```markdown
## Treasure
- 2d20 gp in valuables from webbed corpses
- Silk strands worth 10 gp to weavers (if harvested)
```

**Special Mechanics:**
```markdown
## Mechanics
The sprites' blessing grants advantage on the next Survival check made within 24 hours. Once used, the blessing fades.
```

## File Naming Convention

Convert encounter names to valid filenames:
1. Replace spaces with underscores
2. Remove apostrophes and special characters
3. Use title case for each word

Examples:
- "Lost Mastiff" → `Lost_Mastiff.md`
- "Spider's Hunting Ground" → `Spiders_Hunting_Ground.md`
- "Will-o'-Wisp Guides" → `Will_o_Wisp_Guides.md`
- "Ettin's Crossroads" → `Ettins_Crossroads.md`
- "Lamia's Lair" → `Lamias_Lair.md`

## Duplicate Name Resolution

When multiple terrains have the same encounter name, append terrain:
- "Green Dragon Wyrmling" (Forest) → `Green_Dragons_Domain.md` (already unique name in source)
- "Green Dragon Wyrmling" (Jungle) → `Green_Dragon_Wyrmling_Jungle.md`
- "Blue Dragon Wyrmling" (Desert) → `Blue_Dragon_Wyrmling.md`
- "Blue Dragon Wyrmling" (Coastal) → `Blue_Dragon_Wyrmling_Coastal.md`
