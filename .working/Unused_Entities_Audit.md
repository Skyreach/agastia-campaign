# Unused Entities Audit

**Purpose:** Track all entity files that exist but have zero or minimal wikilink references across the repository.
**Created:** 2025-12-30 08:00 UTC
**Scan Results:** 80 entities analyzed, 2,561 total wikilink references found

**Insight:** These entities were created for a reason. Zero references means missed content integration opportunities.

---

## Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| **Orphaned (0 references)** | 15 | 🔴 Critical - Never referenced |
| **Low Usage (1-2 references)** | 13 | 🟡 Warning - Underutilized |
| **Well Referenced (3+)** | 52 | ✅ Good - Properly integrated |
| **Total Entities** | 80 | - |

**Action Required:** 28 entities (35%) need wikilink integration.

---

## 🔴 CRITICAL: Orphaned Entities (0 References)

These files exist but are NEVER wikilinked anywhere in the repository.

### Campaign Core (2 files)

#### Giant Axe
- **File:** `Campaign_Core/Giant_Axe_Artifact.md`
- **Notion ID:** `2d8693f0c6b4810f9ed3c3e6c4b675cc`
- **Status:** 🔴 Never referenced
- **Why it matters:** Central campaign artifact for Ian/Rakash's quest
- **Where to add:**
  - [ ] `Player_Characters/PC_Ian_Rakash.md` - Equipment/Goals section
  - [ ] `Sessions/Session_1_Caravan_to_Ratterdan.md` - Artifact reveal scene
  - [ ] `Quests/Quest_Giant_Axe.md` - Quest description (oh wait, quest also orphaned!)
  - [ ] `Factions/Faction_Storm_Giant_Warband.md` - Origin/history section

#### The Dominion Evolution Codex
- **File:** `Campaign_Core/The_Codex.md`
- **Notion ID:** `2d8693f0c6b481a19fa0d04415d3e8d8`
- **Status:** 🔴 Never referenced (but Session 3 references "[[The Codex]]" - name mismatch!)
- **Issue:** Wikilinks use `[[The Codex]]` but WIKI_INDEX has full name "The Dominion Evolution Codex"
- **Fix:** Either:
  1. Update WIKI_INDEX alias to map "The Codex" → "The Dominion Evolution Codex"
  2. Update all wikilinks to use full name
- **Where to add:**
  - [ ] `Player_Characters/PC_Manny.md` - Primary quest object
  - [ ] `Quests/Quest_Codex_Search.md` - Quest description
  - [ ] `NPCs/Major_NPCs/Professor_Zero.md` - Connection to artifact
  - [ ] `Locations/Cities/Agastia/Location_Archive_of_Lost_Histories.md` - Possible location

### Locations (5 files)

#### Inkwell and Quill
- **File:** `Locations/Cities/Agastia/Shop_Inkwell_and_Quill.md`
- **Notion ID:** `2d8693f0c6b48151a44ee076bd305c32`
- **Status:** 🔴 Never referenced
- **Type:** Shop (Scholar Quarter)
- **Where to add:**
  - [ ] `Locations/Districts/Scholar_Quarter.md` - Notable establishments section
  - [ ] `Sessions/Session_3_The_Steel_Dragon_Begins.md` - Scholar Quarter locations

#### Public Temple
- **File:** `Locations/Cities/Agastia/Shop_Public_Temple.md`
- **Notion ID:** `2d8693f0c6b481e8ba22ca1eafc9a925`
- **Status:** 🔴 Never referenced
- **Type:** Temple (likely Merchant or Lower Residential District)
- **Where to add:**
  - [ ] Appropriate district file - Notable establishments
  - [ ] Consider for healing/divine services references

#### The Delizioso Trattoria
- **File:** `Locations/Cities/Agastia/Shop_The_Delizioso_Trattoria.md`
- **Notion ID:** `2c9693f0c6b4814fae3bfb9b14dfd8bc`
- **Status:** 🔴 Never referenced
- **Type:** Restaurant (competitor to Il Drago Rosso?)
- **Where to add:**
  - [ ] `Locations/Cities/Agastia/Shop_Il_Drago_Rosso.md` - Mention as competition
  - [ ] `Player_Characters/PC_Nikki.md` - Business rivals for Nikki's family
  - [ ] Appropriate district file - Notable establishments

#### Working Class Armory
- **File:** `Locations/Cities/Agastia/Shop_Working_Class_Armory.md`
- **Notion ID:** `2d8693f0c6b4814e94e9e3392137eb55`
- **Status:** 🔴 Never referenced
- **Type:** Shop (Lower Residential District)
- **Where to add:**
  - [ ] `Locations/Districts/Lower_Residential_District.md` - Notable establishments
  - [ ] Consider as budget equipment source

#### The Castle
- **File:** `Locations/Districts/The_Castle.md`
- **Notion ID:** `2d8693f0c6b4815fb0b1c3c0edf3520a`
- **Status:** 🔴 Never referenced
- **Type:** District (Tier 1 - Highest tier in Agastia!)
- **CRITICAL:** This is the government seat and highest tier district - should be heavily referenced
- **Where to add:**
  - [ ] `Locations/Cities/Agastia_City.md` - Tier 1 district description
  - [ ] `Factions/Faction_Merit_Council.md` - Seat of power
  - [ ] `Sessions/Session_3_The_Steel_Dragon_Begins.md` - City overview section
  - [ ] `Locations/Districts/Government_Complex.md` - May be duplicate/related?

### NPCs (1 file)

#### Kaelborn
- **File:** `NPCs/Faction_NPCs/NPC_Kaelborn_Bandit_Boss.md`
- **Notion ID:** `2d8693f0c6b4813eb552d3b4e953eeeb`
- **Status:** 🔴 Never referenced (but "Bandit Network (Geist & Kaelborn)" faction EXISTS and IS referenced!)
- **Issue:** Faction name includes Kaelborn but individual NPC file never linked
- **Where to add:**
  - [ ] `Factions/Faction_Bandit_Network_Geist_Kaelborn.md` - Key members section
  - [ ] `NPCs/Faction_NPCs/NPC_Geist_Bandit_Lieutenant.md` - Boss relationship
  - [ ] `Player_Characters/PC_Kyle_Nameless.md` - Ultimate antagonist for Geist quest
  - [ ] `Quests/Quest_Geist_Investigation.md` - Final confrontation

### Quests (3 files) - ALL ORPHANED!

**CRITICAL FINDING:** All 3 quest files are orphaned despite being active campaign quests!

#### Codex Search
- **File:** `Quests/Quest_Codex_Search.md`
- **Notion ID:** `2d8693f0c6b481c0a958e49860591899`
- **Status:** 🔴 Never referenced
- **PC:** Manny's primary quest
- **Where to add:**
  - [ ] `Player_Characters/PC_Manny.md` - Active quests section
  - [ ] `Campaign_Core/The_Codex.md` - Quest hook section
  - [ ] `Sessions/Session_3_The_Steel_Dragon_Begins.md` - Quest hooks for Manny

#### Geist Investigation
- **File:** `Quests/Quest_Geist_Investigation.md`
- **Notion ID:** `2d8693f0c6b4816a9763e4e47513de07`
- **Status:** 🔴 Never referenced
- **PC:** Kyle/Nameless's primary quest
- **Where to add:**
  - [ ] `Player_Characters/PC_Kyle_Nameless.md` - Active quests section
  - [ ] `NPCs/Faction_NPCs/NPC_Geist_Bandit_Lieutenant.md` - Investigation context
  - [ ] `Sessions/Session_3_The_Steel_Dragon_Begins.md` - Quest hooks for Kyle

#### Giant Axe Quest
- **File:** `Quests/Quest_Giant_Axe.md`
- **Notion ID:** `2d8693f0c6b4816bbd99de3faa0ef2c9`
- **Status:** 🔴 Never referenced
- **PC:** Ian/Rakash's primary quest
- **Where to add:**
  - [ ] `Player_Characters/PC_Ian_Rakash.md` - Active quests section
  - [ ] `Campaign_Core/Giant_Axe_Artifact.md` - Quest acquisition
  - [ ] `Sessions/Session_1_Caravan_to_Ratterdan.md` - Axe claiming event

### Sessions (4 files) - ALL ORPHANED!

**NOTE:** Session files are typically not wikilinked FROM other files (they're endpoints, not references).
This is expected behavior - sessions reference other entities, not vice versa.
**Action:** No fixes needed - this is by design.

---

## 🟡 WARNING: Low Usage Entities (1-2 References)

These entities exist but are barely referenced. Consider adding more cross-references.

### Campaign Core (1 file)

#### Campaign Overview (1 reference)
- **File:** `Campaign_Core/Campaign_Overview.md`
- **Notion ID:** `2d8693f0c6b481f1a97fe6b54aaaf4e3`
- **Usage:** 1x wikilink
- **Recommendation:** Add to session headers as campaign context reference

### Locations (8 files)

#### Agastia Region (1 reference)
- **File:** `Locations/Regions/Agastia_Region.md`
- **Notion ID:** `2d8693f0c6b4814a8353d3a47515a223`
- **Usage:** 1x wikilink
- **Recommendation:** Add to Agastia City overview, travel sections

#### Stonewick Herbalist (1 reference)
- **File:** `Locations/Cities/Agastia/Shop_Stonewick_Herbalist.md`
- **Notion ID:** `2d8693f0c6b4811581e9e33e0620e1f1`
- **Usage:** 1x wikilink
- **Recommendation:** Add to district establishments list

#### The Gilded Scale (1 reference)
- **File:** `Locations/Cities/Agastia/Shop_The_Gilded_Scale.md`
- **Notion ID:** `2d8693f0c6b481fead5eda92d56281eb`
- **Usage:** 1x wikilink
- **Recommendation:** Add to district establishments list

#### The Grand Cathedral (1 reference)
- **File:** `Locations/Cities/Agastia/Shop_The_Grand_Cathedral.md`
- **Notion ID:** `2d8693f0c6b481258a9ec15c35c21e2a`
- **Usage:** 1x wikilink
- **Recommendation:** Major religious site - should be heavily referenced

#### The Wanderer's Pack (1 reference)
- **File:** `Locations/Cities/Agastia/Shop_The_Wanderers_Pack.md`
- **Notion ID:** `2d8693f0c6b4811aae26d1f34440fad0`
- **Usage:** 1x wikilink
- **Recommendation:** Add to adventuring gear references

#### Sawbones Surgery (2 references)
- **File:** `Locations/Cities/Agastia/Shop_Sawbones_Surgery.md`
- **Notion ID:** `2d8693f0c6b48165816ec0e8acba34dd`
- **Usage:** 2x wikilinks
- **Recommendation:** Medical services - consider for emergency healing references

#### The Desperate's Refuge (2 references)
- **File:** `Locations/Cities/Agastia/Shop_The_Desperates_Refuge.md`
- **Notion ID:** `2d8693f0c6b481e884f0d65920b41bfe`
- **Usage:** 2x wikilinks
- **Recommendation:** Faction connection (Dispossessed?) - add to faction file

#### Tidecaller Armory (2 references)
- **File:** `Locations/Cities/Agastia/Shop_Tidecaller_Armory.md`
- **Notion ID:** `2d8693f0c6b48101b926cef91b39dba1`
- **Usage:** 2x wikilinks
- **Recommendation:** Dock District armory - add to district file

### NPCs (4 files)

#### The Patron (1 reference)
- **File:** `NPCs/Major_NPCs/The_Patron.md`
- **Notion ID:** `2d8693f0c6b481eb8b5acc5579e171d6`
- **Usage:** 1x wikilink
- **CRITICAL:** Major campaign NPC with only 1 reference!
- **Where to add:**
  - [ ] PC files for characters who know The Patron
  - [ ] Relevant quest files
  - [ ] Faction files (Decimate Project?)

#### Decimate Project Subjects (1 reference)
- **File:** `NPCs/Faction_NPCs/Decimate_Project_Subjects.md`
- **Notion ID:** `2d8693f0c6b481e39a8cc26b7579f0a1`
- **Usage:** 1x wikilink
- **Recommendation:** Add to Decimate Project faction file, individual subject NPC files

#### Thava Thornscale (1 reference)
- **File:** `NPCs/Location_NPCs/NPC_Thava_Thornscale.md`
- **Notion ID:** `2d8693f0c6b481c781bcdaacb284c234`
- **Usage:** 1x wikilink
- **Recommendation:** Add to location file where this NPC resides

#### Blood Target (Unknown) (1 reference)
- **File:** `NPCs/Mystery_NPCs/Blood_Target_Unknown.md`
- **Notion ID:** `2d8693f0c6b48151ac06d77d51f5144d`
- **Usage:** 1x wikilink
- **Note:** Mystery NPC for Nikki's quest - limited references may be intentional

---

## ✅ Well Referenced Entities (3+ References)

52 entities are properly integrated with 3 or more wikilink references. Examples:

**Top 10 Most Referenced:**
1. Agastia - City hub (heavily referenced across all content)
2. Merchant District - Primary session location
3. Scholar Quarter - Quest hub location
4. Geist - Major antagonist NPC
5. Merit Council - Central faction
6. Il Drago Rosso - Nikki's family restaurant
7. Kyle/Nameless, Manny, Nikki - Player characters
8. Steel Dragon - Major campaign mystery

---

## Critical Issues Found

### Issue 1: Name Mismatch - "The Codex"
**Problem:** Session 3 and other files use `[[The Codex]]` but WIKI_INDEX only has "The Dominion Evolution Codex"
**Impact:** Wikilink doesn't resolve, entity appears orphaned
**Fix:** Add alias "The Codex" → "The Dominion Evolution Codex" to WIKI_INDEX

### Issue 2: All Quest Files Orphaned
**Problem:** All 3 active quest files have ZERO wikilinks
**Impact:** Quests not connected to PCs, sessions, or related entities
**Fix:** Add quest wikilinks to PC goal sections and session quest hooks

### Issue 3: The Castle District Missing
**Problem:** Tier 1 (highest tier) district has ZERO wikilinks
**Impact:** Entire government/power structure district invisible in content
**Fix:** Add to Agastia City overview and Merit Council references

### Issue 4: Kaelborn Disconnected from Faction
**Problem:** "Bandit Network (Geist & Kaelborn)" faction exists but Kaelborn NPC file never linked
**Impact:** Half of faction leadership invisible
**Fix:** Add Kaelborn references to faction and Geist NPC files

---

## Recommended Actions (Priority Order)

### Immediate (High Impact)
1. **Fix "The Codex" alias** - Add to WIKI_INDEX.md aliases section
2. **Add quest wikilinks to PC files** - Connect quests to player characters
3. **Add The Castle to Agastia City** - Integrate Tier 1 district
4. **Add Kaelborn to faction/Geist files** - Complete bandit network

### High Priority (Campaign Critical)
5. **Add Giant Axe to Ian's PC file and Session 1** - Central artifact for PC quest
6. **Add quest files to session quest hooks** - Link quests to session content
7. **Add The Patron to Decimate Project faction** - Connect major NPC to faction
8. **Add district establishments to district files** - Complete location hierarchy

### Medium Priority (Content Completeness)
9. **Add orphaned shops to district files** - Inkwell and Quill, Public Temple, Delizioso Trattoria, Working Class Armory
10. **Add low-usage locations to appropriate contexts** - Stonewick Herbalist, Gilded Scale, Grand Cathedral, etc.
11. **Cross-reference competitor restaurants** - Il Drago Rosso ↔ Delizioso Trattoria

### Low Priority (Nice to Have)
12. **Add campaign overview to session headers** - Provide campaign context
13. **Add regional context to travel sections** - Agastia Region references

---

## Automation Opportunities

1. **Create .config/find_missing_wikilinks.py** - Detect entities mentioned by name but not wikilinked
2. **Create .config/suggest_wikilinks.py** - AI-powered suggestions for where to add wikilinks
3. **Add pre-commit check** - Warn when creating new entity files without wikilinks

---

## Next Steps

- [ ] Review this audit with user
- [ ] Prioritize which orphaned entities to wikilinkfirst
- [ ] Create implementation plan for high-impact fixes
- [ ] Run add_wikilinks.py on targeted files
- [ ] Re-scan after fixes to measure improvement

---

**Data Source:** `.working/entity_usage_scan.json`
**Scan Method:** Regex search for `\[\[([^\]|]+)` across all markdown files
**Files Scanned:** All `*.md` files (excluding `.working/` and `.config/`)
**Total Wikilinks Found:** 2,561 references to 99 unique entities
