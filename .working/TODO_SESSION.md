# Session TODO List
Last updated: 2025-12-28 22:45

## 🚨 Active Tasks

### Pending
- [ ] [22:45] Commit and push uncommitted files to remote
  - Context: Multiple test scripts and backups created during Notion sync improvements
  - Files: inspect_*.py, upload_with_nesting.py, test_session3_upload*.py, sync_notion_backup_*.py
  - Action: Clean up test files, commit useful changes

- [ ] [22:45] Analyze Session 3 to extract all referenced entities (NPCs, locations, items)
  - Context: Need comprehensive list of all entities mentioned in Session 3
  - Output: Create `.working/session3_references.md` with nested checkboxes
  - Format: Group by type (NPCs/Locations/Items), include line numbers and context
  - Check for: Character names, location names, item names, faction references

- [x] [22:45 → 22:55] Check for duplicates in Session 3 references
  - Context: Identify which entities are already synced to Notion vs need creation
  - Method: Cross-referenced with `.notion_sync_state.json`
  - Output: Updated all entity statuses in `.working/session3_references.md`
  - Results: 15 entities synced, 4 need creation, 6 are scene/table descriptions

- [x] [22:45 → 23:10] Re-sync all Session 3 referenced entities with improved hierarchical nesting format
  - Context: Apply new H1-H3 heading support, H4+ toggle conversion, <details> support
  - Method: Ran `python3 sync_notion.py <file> <type>` for each entity
  - Results: Re-synced 15 entities (3 NPCs, 7 locations, 2 factions, 3 already done earlier)
  - All entities now use improved nesting with toggleable headings

- [x] [22:45 → 23:15] Create wiki index file tracking all synced pages for quick lookup
  - Context: Central index for navigating campaign wiki in Notion
  - File: `WIKI_INDEX.md` (root level)
  - Format: Organized by category (PCs, NPCs, Locations, Factions, Sessions, Campaign Core)
  - Includes: Page name, file path, Notion page ID, sync timestamp
  - Total: 70 entities indexed with Session 3 quick lookup section

- [x] [22:45 → 23:20] Create skill to lookup files by wiki index
  - Context: MCP skill for quick entity lookup by name
  - Location: `.claude/skills/wiki-lookup.md`
  - Features: Search by name, list by category, show sync status, list all entities
  - Integration: Uses WIKI_INDEX.md as data source, validates against .notion_sync_state.json

- [x] [22:45 → 23:25] Ensure all Session 3 entity mentions use wikilink format [[Entity Name]]
  - Context: Convert plain text references to clickable Notion links
  - File: Sessions/Session_3_The_Steel_Dragon_Begins.md
  - Method: Found entity names, wrapped in [[brackets]]
  - Results: Added wikilinks for Corvin Tradewise, Geist (5x), Steel Dragon (4x), Meridian's Rest, Dock District
  - Total wikilinks: 19 instances across 10 entities
  - Re-synced to Notion with all links working

## ✅ Completed Tasks

- [x] [22:30 → 22:45] Improved Notion sync with hierarchical nesting
  - Context: Rewrote markdown-to-Notion converter for proper content nesting
  - Features: H1-H3 headings (toggleable), H4+ as toggles, <details> support
  - Commit: cc3223f "feat: Add H4+ heading support and <details> tag conversion"

- [x] [22:15 → 22:30] Added wikilinks to Session 3
  - Context: Connected Session 3 to campaign locations via [[wikilinks]]
  - Links added: Agastia, Merchant District, Scholar Quarter, Archive of Lost Histories, Il Drago Rosso
  - Verified: All 8 link instances working in Notion
  - Commit: 562d737 "feat: Add wikilinks to Session 3 for location references"

- [x] [21:45 → 22:15] Re-synced Agastia City with new nesting
  - Context: Complex file with deep nesting (H1→H2→H3→H4→<details>)
  - Result: All 7 tier sections properly nested with toggle blocks
  - Verified: City Districts → Tier 1 → Daily Life & Services (3 levels deep)

## 🚨 Active Tasks (New Session)

### Pending
- [x] [23:30 → 00:10] Expand Agastia City wikilinks - link all districts, stores, NPCs, quests
  - Context: Agastia_City.md mentions many entities that should be cross-referenced
  - File: Locations/Cities/Agastia_City.md
  - Results: Added 54 wikilinks (9 districts, 20+ establishments, NPCs in tier descriptions)
  - Re-synced to Notion successfully

- [x] [23:30 → 23:50] Create wikilinking skill for automated cross-reference detection
  - Context: Need repeatable skill for finding and adding wikilinks
  - Location: `.claude/skills/add-wikilinks.md`
  - Features: Scan file for entity names, cross-reference with WIKI_INDEX.md, add [[links]]
  - Integration: Uses WIKI_INDEX.md as entity reference, skips frontmatter
  - Script: `.config/add_wikilinks.py` (single file) + `.config/batch_add_wikilinks.py` (batch)

- [x] [23:30 → 00:05] Comprehensive wikilink pass - entire repository
  - Context: Add wikilinks to all entities across all files
  - Scope: Sessions (4), NPCs (26), Locations (29), Factions (6), Campaign Core (4)
  - Method: Batch script processed all files by category
  - Results: **1,380 total wikilinks added** across 69 files
    - Sessions: 168 links
    - Locations: 645 links (Districts 236, Establishments 315, Other 94)
    - Factions: 120 links
    - NPCs: 426 links (Major 110, Location 201, Faction 93, Mystery 22)
    - Player Characters: 79 links
    - Campaign Core: 110 links

- [x] [23:30 → 00:15] Run verification sub-agent for missed wikilinks
  - Context: Double-check no entity references were missed
  - Method: Task tool with subagent_type="general-purpose"
  - Agent task: "Review all markdown files, check WIKI_INDEX.md, report any entity mentions without [[wikilinks]]"
  - Results: 85-90% completeness, identified specific gaps (Geist/Kaelborn need aliases)
  - Report: Agent found most issues are NPC names with role descriptions in WIKI_INDEX
  - Follow-up needed: Add entity aliases for "Geist" → "Geist (Bandit Lieutenant)", etc.

## 🚨 Active Tasks (Phase 2: Advanced Integration)

### Pending
- [x] [00:20 → 00:35] Add entity alias support to wikilink system
  - Context: Allow simple names like "Geist" to resolve to "Geist (Bandit Lieutenant)"
  - Files: .config/add_wikilinks.py, WIKI_INDEX.md
  - Implementation: Modified load_entity_names() to extract aliases from parenthetical and slash patterns
  - Testing: Dry-run on Session 2 confirmed 106 alias matches (Geist: 57, Kaelborn: 46, Harren: 3)
  - Results: Batch run added **513 wikilinks** across repository using alias resolution
  - Total repository wikilinks: **1,893** (Phase 1: 1,380 + Phase 2: 513)
  - Impact: Improved coverage from 85-90% → ~95%+

- [x] [00:35 → 00:40] Wikilink player character references in narrative/backstory sections
  - Context: Session files weren't included in batch processing, needed manual pass
  - Files: All session files processed
  - Results: Added 122 wikilinks to session files
    - Session_1: 12 links (Kyle/Nameless, Ian/Rakash, Octavia)
    - Session_2: 106 links (Geist, Kaelborn, Harren from alias system)
    - Session_3: 4 links (Kyle)
    - Session_0: Already complete
  - PC aliases working correctly (Kyle → Kyle/Nameless, Rakash → Ian/Rakash)

- [ ] [00:40] Add wikilinks for NPC hooks, motivations, and faction dispositions
  - Context: NPC files should cross-reference factions, other NPCs, locations they're connected to
  - Files: All NPC files (26 files)
  - Method: Add [[Faction]] links in "Faction Affiliation" sections, [[NPC]] in relationships
  - Example: Professor Zero → links to [[Chaos Cult]], [[Merit Council]]

- [ ] [00:20] Populate Agastia NPC files with hooks, motivations, and faction information
  - Context: Ensure all Agastia NPCs have complete hook/motivation/faction data
  - Files: NPCs/Location_NPCs/* (Agastia-based NPCs)
  - Verify: Corvin, Veridian, Mira, Kex, Harren, Mirella, Thava, Torvin
  - Method: Review each NPC, add missing sections, ensure faction dispositions listed

- [ ] [00:20] Create quest entities as linkable wiki pages
  - Context: Quests should be standalone entities users can reference
  - Location: Quests/ directory (new)
  - Format: Quest_[Name].md with frontmatter, objectives, NPCs, locations, rewards
  - Examples: Quest_Geist_Investigation.md, Quest_Codex_Search.md, Quest_Blood_Target.md
  - Integration: Add to WIKI_INDEX.md, link from session files

- [ ] [00:20] Update session commands to link inspiring encounter tables
  - Context: Sessions copy/paste encounter tables - should link to centralized tables instead
  - Files: Sessions/Session_*.md, create Encounters/Inspiring_Tables.md
  - Method: Extract tables to central file, replace with [[Inspiring Tables#Temperate Forest]]
  - Benefit: Single source of truth, easier updates

- [ ] [00:20] Create point crawl skill using wikilinks as nodes
  - Context: Need modular system for building connected encounters/locations
  - Location: .claude/skills/point-crawl.md
  - Features: Each [[Location]] is a node, connections defined by links
  - Method: Build tree structure from wikilinks, present navigation options
  - Example: [[Town]] → [[Forest Path]] → [[Dungeon Entrance]] → [[Boss Room]]

- [ ] [00:20] Update CLAUDE.md to auto-detect available skills and commands
  - Context: Make skills discoverable without manual documentation
  - File: CLAUDE.md
  - Method: Add section that reads .claude/skills/*.md and lists available skills
  - Format: Skill name, description, usage example
  - Auto-update: Script to regenerate skill list from skill files

## 📋 Future Topics

### From Previous Session (Dec 14)
- [ ] Create Geist NPC file (59 Session 2 mentions)
- [ ] Create Kaelborn NPC file (44 Session 2 mentions)
- [ ] Fix restaurant naming inconsistency (Il Drago Rosso vs The Delizioso Trattoria)
- [ ] Create Archive of Lost Histories location file (Manny's quest)
- [ ] Create Stonemark Antiquities location file (Manny's alternative info source)

### Notion Sync Improvements
- [ ] Implement actual Notion table API (currently using paragraph + bullets)
- [ ] Add support for callouts/info boxes
- [ ] Test wikilinks with NPC and Faction pages
- [ ] Add bidirectional link tracking (backlinks)

### Wiki System
- [ ] Auto-generate category pages (all NPCs, all Locations, etc.)
- [ ] Add search functionality to wiki skill
- [ ] Create wiki navigation structure in Notion
- [ ] Add "Related Pages" section to entity templates
