# Session TODO List - Encounter Page Conversion
Last updated: 2026-01-03 20:55

## 📋 PROJECT OVERVIEW
Convert 127 encounter table entries to individual encounter pages with wikilink integration

**Context:**
- Current: Encounters in table format (Resources/Tables/Tier1_Inspiring_Table.md)
- Goal: Each encounter as separate page in flat structure (Encounters/[Name].md)
- Reason: Enable wikilink cross-referencing, prevent bloated pages
- Scope: 8 terrain types, 127 total encounters

**Key Decisions:**
1. Flat file structure: `Encounters/Lost_Mastiff.md` (not nested by terrain)
2. Block cache system won't work (too many pages), remove from Session 3
3. Inspiring_Tables.md becomes Quick Reference with wikilinks
4. Fix Notion table formatting (currently displays as bullet list)
5. Keep DM Notes section, drop "How to Use" section

## 🚨 Active Tasks

### In Progress
- [ ] [20:55] Create encounter conversion tracking file
  - Context: Track progress converting 127 encounters to ensure none missed
  - File: .working/encounter_conversion_tracker.md
  - Format: Checklist grouped by terrain type with conversion status
  - Columns: Encounter Name | Roll Result | Status | File Path | Notes

### Pending - Phase 1: Preparation (3 tasks)
- [ ] [20:55] Design encounter page template with frontmatter
  - Context: Standardize format for all 127 encounter pages
  - Requirements:
    - Frontmatter: name, type (encounter), terrain, tier, roll_result, tags
    - Structure: Description, Variation, Non-Combat, Stats (if creatures)
  - Example template for "Lost Mastiff":
    ```yaml
    ---
    name: Lost Mastiff
    type: Encounter
    terrain: Temperate Forest
    tier: 1
    roll_result: "3 on 2d8"
    tags: [encounter, tier1, forest, non-combat, animal]
    ---
    ```
  - Output: .working/encounter_template.md

- [ ] [20:55] Extract all 127 encounters from source file with metadata
  - Context: Parse Resources/Tables/Tier1_Inspiring_Table.md for encounter data
  - Source: Resources/Tables/Tier1_Inspiring_Table.md
  - Extract for each encounter:
    - Name
    - Terrain type
    - Dice roll (2d6, 2d8, 2d10)
    - Roll result number
    - Description text
    - Variation text
    - Non-Combat text
  - Output: .working/encounter_extraction.json (for scripting) or .md (for manual)

- [ ] [20:55] Create automated encounter page generation script
  - Context: Generating 127 files manually is error-prone
  - Script: .working/generate_encounter_pages.py
  - Input: encounter_extraction data
  - Output: 127 .md files in Encounters/ directory
  - Validation: Check file name sanitization, ensure all metadata present

### Pending - Phase 2: Encounter File Generation (8 terrain groups)

#### Temperate Forests (15 encounters)
- [ ] [20:55] Generate Temperate Forest encounter pages (1-15)
  - Roll 2: Helpful Sprite Circle
  - Roll 3: Lost Mastiff
  - Roll 4: Awakened Shrub Choir
  - Roll 5: Pseudodragon Quarrel
  - Roll 6: Wandering Druid
  - Roll 7: Unicorn Sighting
  - Roll 8: Goblin Ambush Site
  - Roll 9: Spider's Hunting Ground
  - Roll 10: Territorial Owlbear
  - Roll 11: Stirge Storm
  - Roll 12: Grick Ambush
  - Roll 13: Hobgoblin Hunting Party
  - Roll 14: Corrupted Grove
  - Roll 15: Ankheg Eruption
  - Roll 16: Green Dragon's Domain

#### Arctic/Tundra (11 encounters)
- [ ] [20:55] Generate Arctic/Tundra encounter pages (1-11)
  - 2d6 roll range: 2-12
  - Files: Friendly_Reindeer_Herders.md through Orc_Raiding_Party.md

#### Mountains (20 encounters)
- [ ] [20:55] Generate Mountains encounter pages (1-20)
  - 2d10 roll range: 2-20
  - Files: Dwarven_Sentries.md through Frost_Giant_Sentry.md

#### Deserts (15 encounters)
- [ ] [20:55] Generate Deserts encounter pages (1-15)
  - 2d8 roll range: 2-16
  - Files: Oasis_Haven.md through Lamias_Lair.md

#### Jungles (20 encounters)
- [ ] [20:55] Generate Jungles encounter pages (1-20)
  - 2d10 roll range: 2-20
  - Files: Friendly_Lizardfolk_Village.md through Yuan_ti_Ambush.md

#### Swamps (11 encounters)
- [ ] [20:55] Generate Swamps encounter pages (1-11)
  - 2d6 roll range: 2-12
  - Files: Will_o_Wisp_Guides.md through Black_Dragon_Wyrmling.md

#### Coastal (15 encounters)
- [ ] [20:55] Generate Coastal encounter pages (1-15)
  - 2d8 roll range: 2-16
  - Files: Friendly_Merfolk.md through Manticore_Lair.md

#### Urban (20 encounters)
- [ ] [20:55] Generate Urban encounter pages (1-20)
  - 2d10 roll range: 2-20
  - Files: Helpful_Priest.md through Mimic_Warehouse.md

### Pending - Phase 3: Update Inspiring_Tables.md
- [ ] [20:55] Rewrite Inspiring_Tables.md with Quick Reference Tables
  - Context: Replace H3 encounter sections with wikilinked tables
  - Keep: Zone headers, Quick Reference Tables, DM Notes section
  - Drop: "How to Use These Tables" section, individual encounter details
  - Structure:
    ```markdown
    # Inspiring Encounter Tables

    ## Temperate Forests (Tier 1)
    **Roll 2d8**

    | Roll | Encounter |
    |------|-----------|
    | 2 | [[Helpful Sprite Circle]] |
    | 3 | [[Lost Mastiff]] |
    ...

    ## DM Notes
    [Keep existing DM Notes section]
    ```
  - Files: Encounters/Inspiring_Tables.md

- [ ] [20:55] Fix Notion table formatting
  - Context: Current tables render as bullet lists in Notion
  - Problem: Likely markdown table syntax not translating correctly
  - Investigation: Check sync_notion.py table handling
  - Fix: Ensure proper Notion table block format in markdown_to_notion_blocks()
  - Test: Sync updated Inspiring_Tables.md to Notion and verify table display

- [ ] [20:55] Remove H3 block cache for Inspiring Tables
  - Context: Block cache system no longer needed with individual pages
  - Files:
    - .config/notion_block_cache.json (remove Inspiring Encounter Tables entry)
    - .config/cache_notion_blocks.py (remove from REFERENCE_PAGES list)
  - Keep: Cache infrastructure for potential future use

### Pending - Phase 4: Update Session 3
- [ ] [20:55] Update Session 3 Day 2 encounter links to use encounter pages
  - Context: Replace section anchor links with encounter page wikilinks
  - Current (line 83): `[[Inspiring Encounter Tables#Lost Mastiff]]`
  - New: `[[Lost Mastiff]]`
  - Lines to update:
    - Line 83: Lost Mastiff
    - Line 88: Wandering Druid
    - Line 93: Goblin Ambush Site
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md

- [ ] [20:55] Sync Session 3 to Notion and verify encounter links work
  - Context: Test that wikilinks to encounter pages resolve correctly
  - Command: `python3 sync_notion.py Sessions/Session_3_The_Steel_Dragon_Begins.md session`
  - Verification: Open in Notion, click encounter links, confirm they navigate to encounter pages

### Pending - Phase 5: Cleanup & Verification
- [ ] [20:55] Run format validation on all 127 encounter pages
  - Context: Ensure all encounter pages follow template format
  - Script: `python3 .config/format_compliance_check.py Encounters/*.md`
  - Check: Frontmatter complete, required sections present, no formatting errors

- [ ] [20:55] Sync all 127 encounter pages to Notion
  - Context: Bulk sync all new encounter files
  - Method: Modify sync_notion.py to handle batch encounter sync
  - Command: `python3 sync_notion.py Encounters/ encounter` (may need script modification)
  - Verify: Check Notion database shows all 127 encounter pages

- [ ] [20:55] Update WIKI_INDEX.md with encounter page entries
  - Context: Enable wiki-lookup skill to find encounter pages
  - Add entries for all 127 encounters
  - Format: `Lost Mastiff: Encounters/Lost_Mastiff.md`
  - Alphabetical order within Encounters section

- [ ] [20:55] Run verification sub-agent for conversion completeness
  - Context: Verify all 127 encounters converted, no data lost
  - Method: Task tool with subagent_type="general-purpose"
  - Agent task: "Compare Resources/Tables/Tier1_Inspiring_Table.md against Encounters/*.md files. Verify all encounters converted, check for missing content, validate roll result mappings."
  - Validation:
    - Count matches: 127 source entries = 127 .md files
    - Content complete: All Description/Variation/Non-Combat sections preserved
    - Roll results accurate: Each encounter has correct dice roll mapping

## ✅ Completed Tasks
(None yet)

## 📊 PROGRESS TRACKING

**Overall:** 0/127 encounters converted (0%)

**By Terrain:**
- Temperate Forests: 0/15 (0%)
- Arctic/Tundra: 0/11 (0%)
- Mountains: 0/20 (0%)
- Deserts: 0/15 (0%)
- Jungles: 0/20 (0%)
- Swamps: 0/11 (0%)
- Coastal: 0/15 (0%)
- Urban: 0/20 (0%)

**By Phase:**
- Phase 1 (Preparation): 0/3 tasks
- Phase 2 (Generation): 0/8 terrain groups
- Phase 3 (Inspiring_Tables): 0/3 tasks
- Phase 4 (Session 3): 0/2 tasks
- Phase 5 (Cleanup): 0/4 tasks

**Estimated Time:** ~8-10 hours total
- Phase 1: 1 hour (setup)
- Phase 2: 4-5 hours (file generation + validation)
- Phase 3: 1 hour (table updates)
- Phase 4: 30 min (Session 3)
- Phase 5: 1.5 hours (cleanup + verification)

## 🔍 DEPENDENCIES & RISKS

**Blockers:**
- None currently

**Dependencies:**
- Phase 2 requires Phase 1 complete (need template + extraction)
- Phase 3 requires Phase 2 complete (need encounter files to link to)
- Phase 4 requires Phase 3 complete (need updated Inspiring_Tables)
- Phase 5 requires all phases complete

**Risks:**
1. File name collisions if multiple terrains have same encounter name
   - Mitigation: Check for duplicates during extraction, append terrain suffix if needed
2. Notion sync may timeout with 127 bulk uploads
   - Mitigation: Batch sync in groups of 20-30
3. Lost content during conversion from table format
   - Mitigation: Verification sub-agent will compare source vs output
4. Table formatting may still not work in Notion
   - Mitigation: Research Notion table block format, may need custom sync logic

## 📝 NOTES & DECISIONS

**2026-01-03 20:55:**
- Decided on flat file structure over nested (Encounters/[Name].md not Encounters/[Terrain]/[Name].md)
- Block cache system archived (too many pages would bloat)
- Keeping DM Notes in Inspiring_Tables.md for strategic guidance
- Dropping "How to Use" section as redundant with DM Notes
