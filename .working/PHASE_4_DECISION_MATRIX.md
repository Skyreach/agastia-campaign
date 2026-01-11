# Phase 4 Remaining Work - Decision Matrix

**Instructions:** Please mark each item with:
- **Y** = You defer implementation to me (I'll create content)
- **M** = You have opinions (add your guidance after the item)
- **Skip** = Defer this item entirely

---

## P2 - Medium Priority Issues

### Session 1

- [A] **Ratterdan Underground Ecology** (line 134 references `Dungeon_Ecologies/Ratterdan_Underground_Ecology.md`)
  - **Issue:** Session 1 line 134 says "See full ecology: Dungeon_Ecologies/Ratterdan_Underground_Ecology.md" but file doesn't exist
  - **Options:**
    - (A) Create the ecology file in `Resources/Dungeon_Ecologies/Ratterdan_Underground_Ecology.md`
    - (B) Remove the reference from Session 1
    - (C) Inline ecology notes directly into session file

### Session 0

- [Y] **Italian Restaurant → Il Drago Rosso** (line 44 needs wikilink)
  - **Issue:** Line 44 says "**Italian Restaurant:** [Details to be developed]" but should link to existing location
  - **Action:** Link to existing `Locations/Agastia_City_Districts/Il_Drago_Rosso.md`
  - **Change:** `- **Italian Restaurant:** [Details to be developed]` → `- **[[Il Drago Rosso]]:** [[Nikki]]'s family restaurant (Italian-themed)`

- [A, B, C] **Midnight Market** (line 46 needs entity file)
  - **Issue:** "**Midnight Market:** Underground economy and information exchange" has no entity file
  - **Options:**
    - (A) Create as Agastia district location file: `Locations/Agastia_City_Districts/Location_Midnight_Market.md`
    - (B) Link to existing black market location (if one exists in The Depths)
    - (C) Create as faction/organization file: `Factions/Faction_Midnight_Market.md`

---

## P3 - Low Priority Issues

### Session 0

- [A] **Traveling Carnival** (line 45, player-created location)
  - **Issue:** "**Traveling Carnival:** Mobile entertainment with potential faction connections" has no entity file
  - **Options:**
    - (A) Create location file: `Locations/World_Locations/Location_Traveling_Carnival.md`
    - (B) Leave as placeholder (develop later if relevant to plot)
    - (C) Remove reference entirely

- [A] **Burned Mansion** (line 47, player-created location)
  - **Issue:** "**Burned Mansion:** Destroyed noble estate, potential investigation site" has no entity file
  - **Options:**
    - (A) Create location file: `Locations/World_Locations/Location_Burned_Mansion.md`
    - (B) Leave as placeholder (develop later if players pursue it)
    - (C) Remove reference entirely

- [A] **Villages and Landmarks** (line 48, vague reference)
  - **Issue:** "**Villages and Landmarks:** Multiple settlements and geographic features" is vague placeholder
  - **Options:**
    - (A) List specific villages with wikilinks (requires creating those location files)
    - (B) Remove this vague placeholder entirely
    - (C) Leave as-is (world-building fluff)

---

## Phase 4B - Extended Content Audit

**Quests Directory:**
- [ ] Audit all quest files for orphaned references (references without wikilinks or missing entity files)
- [ ] Audit all quest files for missing NPC/location wikilinks (entities mentioned but not linked)

**NPCs Directory:**
- [ ] Audit all NPC files for orphaned references
- [ ] Audit all NPC files for missing faction/location wikilinks

**Encounters Directory:**
- [ ] Audit all encounter files for orphaned references
- [ ] Audit all encounter files for missing NPC/location wikilinks

**Locations Directory:**
- [ ] Audit all location files for orphaned references
- [ ] Audit all location files for missing quest/NPC/encounter wikilinks

---

## Phase 4C - Notion Sync

- [ ] Sync all 7 new files to Notion (5 NPCs + 1 Faction + 1 Report)
  - NPC_Thorne_Kallister.md
  - NPC_Brian_Thornscale.md
  - NPC_Greta_Moss.md
  - NPC_Aldwin_Quill.md
  - NPC_Assistant_Bellweather.md
  - Faction_Temporal_Bloodline_Tribe.md
  - PHASE_4_SESSION_AUDIT_REPORT.md (skip this one - working file)

- [ ] Sync updated Session 2 to Notion

- [ ] Run `python3 .config/verify_sync_status.py` and fix any desync issues

- [ ] Verify all wikilinks render correctly in Notion

---

## Summary Stats

**P2 Issues:** 3 items
**P3 Issues:** 3 items
**Phase 4B Audits:** 8 audit tasks
**Phase 4C Sync:** 4 sync tasks

**Total Remaining:** 18 decision points

---

**Next Steps:**
1. Review this file
2. Mark each checkbox with Y (you decide), M (your guidance + notes), or Skip
3. I'll execute in sequence based on your marks
