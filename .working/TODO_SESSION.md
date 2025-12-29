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
