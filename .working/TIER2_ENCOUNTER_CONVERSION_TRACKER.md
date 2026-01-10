# Tier 2 Inspiring Encounter Conversion Tracker

**Purpose:** Track conversion of Tier 2 Inspiring Encounter Tables from toggled format to individual wikilinked pages

**Status:** In Progress
**Created:** 2026-01-04
**Total Encounters:** 108

---

## Conversion Process

### Phase 1: Extract Encounter Data ✅
- [x] Identify all Tier 2 encounters
- [x] Extract encounter names
- [x] Create tracking document

### Phase 2: Create Individual Pages ⏳
- [ ] Extract full encounter details from Tier2_Inspiring_Table.md
- [ ] Create individual .md files in Encounters/ directory
- [ ] Add proper frontmatter (name, type, terrain, tier, roll_result, tags)
- [ ] Format content (scenario, variation, non-combat)

### Phase 3: Update Table Format ⏳
- [ ] Convert Tier2_Inspiring_Table.md to quick reference format
- [ ] Replace toggled entries with wikilink tables
- [ ] Match Tier1 Inspiring_Tables.md format
- [ ] Preserve roll mechanics (note different dice: 2d6, 2d8, 2d10, etc.)

### Phase 4: Verification ⏳
- [ ] Validate all wikilinks resolve
- [ ] Sync all new encounter pages to Notion
- [ ] Verify table format compliance
- [ ] Test navigation between table and individual pages

---

## Encounter List by Terrain

### Temperate Forests (Tier 2) - Roll 2d8
1. [ ] Ancient Grove Blessing
2. [ ] Werebear Guardian
3. [ ] Fey Court Summons
4. [ ] Corrupted Druid Circle
5. [ ] Displacer Beast Pride
6. [ ] Basilisk Garden
7. [ ] Wandering Oni
8. [ ] Phase Spider Colony
9. [ ] Revenant's Hunt
10. [ ] Satyr Revelry
11. [ ] Green Hag's Bargain
12. [ ] Werewolf Pack
13. [ ] Owlbear Den
14. [ ] Wraith Haunt
15. [ ] Young Green Dragon

### Arctic / Tundra (Tier 2) - Roll 2d6
16. [ ] Silver Dragon's Test
17. [ ] Frost Giant Raid
18. [ ] Remorhaz Tunnel
19. [ ] Bheur Hag's Storm
20. [ ] Mammoth Migration
21. [ ] Yeti Abomination
22. [ ] Ice Devil Patrol
23. [ ] Ghost Ship in Ice
24. [ ] Night Hag's Nightmare Market
25. [ ] Cloud Giant's Sky Castle
26. [ ] Storm Giant Mediator

### Mountains (Tier 2) - Roll 2d10
27. [ ] Stone Giant Artists
28. [ ] Wyvern Nest Raid
29. [ ] Cyclops Oracle
30. [ ] Fire Giant Forgemaster
31. [ ] Chimera Hunt
32. [ ] Roc Eyrie
33. [ ] Manticore Toll
34. [ ] Bulette Territory
35. [ ] Troll Warband
36. [ ] Young Red Dragon
37. [ ] Frost Giant Raiders

... (continuing with all 108 encounters - will be populated as we process the file)

---

## Format Template for Individual Pages

```markdown
---
name: [Encounter Name]
type: Encounter
terrain: [Terrain Type]
tier: 2
roll_result: "[Roll] on [Dice]"
tags: [encounter, tier2, [terrain-tag], [theme-tags]]
---

# [Encounter Name]

**Roll:** [Roll] on [Dice]

[Main scenario description paragraph]

**Variation:** [Variation description]

**Non-Combat:** [Non-combat resolution options]
```

---

## Notes

**Different Dice by Terrain:**
- Temperate Forests: 2d8
- Arctic/Tundra: 2d6
- Mountains: 2d10
- Deserts: 2d8
- Jungles: 2d10
- Swamps: 2d6
- Coastal: 2d8
- Urban: 2d10

**Tier 1 Already Completed:**
- 123 Tier 1 encounters already converted ✅
- Individual pages exist in Encounters/ directory
- Inspiring_Tables.md uses wikilink format

**Goals:**
- Match Tier 1 format exactly
- Maintain all encounter detail and nuance
- Ensure wikilinks work bidirectionally
- Keep quick reference table accessible for DM use
