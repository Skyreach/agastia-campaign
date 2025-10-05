# Notion Database Schema - VERIFIED

**Last Verified:** 2025-10-04
**Database:** D&D Campaign Entities
**Database ID:** 281693f0-c6b4-80be-87c3-f56fef9cc2b9

---

## ✅ ACTUAL PROPERTIES (Use These!)

### Name (title) - REQUIRED
- **Type:** Title
- **Usage:** Entity name
- **Example:** "Biago \"Nikki\"", "Decimate Project", "Agastia City"

### Tags (multi_select) - REQUIRED
- **Type:** Multi-select
- **Usage:** Entity type + additional tags
- **CRITICAL:** Entity type MUST be in tags (pc, npc, faction, location, etc.)
- **Example:** ["pc", "tiefling", "arcane-trickster", "decimate-project"]

### Status (select) - REQUIRED
- **Type:** Select
- **Options:**
  - Active
  - Planning
  - Completed
  - Destroyed
  - Unknown
  - Pending
  - Needs Selection
  - Active - Expanding
  - Inactive

### File Path (rich_text)
- **Type:** Rich Text
- **Usage:** Path to markdown file
- **Example:** "Player_Characters/PC_Nikki.md"

### Version (rich_text)
- **Type:** Rich Text
- **Usage:** Semantic versioning
- **Example:** "1.0.0"

### Player (rich_text)
- **Type:** Rich Text
- **Usage:** PC player assignment
- **Example:** "Player 2"

### Session Number (number)
- **Type:** Number
- **Usage:** Session ordering
- **Example:** 1, 2, 3

### Location Type (select)
- **Type:** Select
- **Options:**
  - Continent
  - Region
  - City
  - Town
  - Ward
  - District
  - Building
  - Dungeon
  - Wilderness
  - Pocket Dimension
  - Major City
  - Settlement
  - Ruined Settlement

### Parent Location (relation)
- **Type:** Relation (self-referencing)
- **Usage:** Location hierarchy
- **Related To:** Same database (D&D Campaign Entities)

### Progress Clock (rich_text)
- **Type:** Rich Text
- **Usage:** Faction/goal progress tracking
- **Example:** "[3/6]"

### Relations (rich_text)
- **Type:** Rich Text
- **Usage:** Freeform relationship notes
- **Example:** "Allied with Merit Council, opposed to Chaos Cult"

### Secrets (rich_text)
- **Type:** Rich Text
- **Usage:** Hidden DM-only information
- **Example:** "Actually controlled by Professor Zero"

---

## ❌ PROPERTIES THAT DO NOT EXIST

### ⛔ "Type" - DOES NOT EXIST
- **Why removed:** Redundant with Tags
- **What to use instead:** Add entity type to Tags array
- **Example:** Don't use `"Type": "PC"`, use `"Tags": ["pc", ...]`

### ⛔ "Notes" - DOES NOT EXIST
- **Why removed:** Content goes in page body
- **What to use instead:** Use Notion page content/blocks

### ⛔ Relation properties (except Parent Location) - DO NOT EXIST
- No "Related Entities" relation
- No "Faction" relation
- No "Location" relation
- **What to use instead:** Use Relations (rich_text) field for notes

---

## 📋 Sync Script Requirements

When syncing to Notion, the script MUST:

1. **Always include:**
   - Name (title)
   - Tags (multi_select) with entity type
   - Status (select)
   - File Path (rich_text)

2. **Conditionally include (if in frontmatter):**
   - Version (if `version:` exists)
   - Player (if `player:` exists)
   - Session Number (if `session_number:` exists)
   - Location Type (if `location_type:` exists)
   - Progress Clock (if `progress_clock:` exists)

3. **Never try to set:**
   - Type property (doesn't exist)
   - Notes property (doesn't exist)
   - Any relation besides Parent Location

---

## 🔧 How to Verify Schema (If Changes Are Made)

Run this script to pull current schema:

```bash
python3 .config/query_notion_schema.py
```

This will:
1. Connect to Notion database
2. Retrieve full schema
3. Save to `.config/notion_schema_current.json`
4. Display all available properties

---

## 📝 Frontmatter Mapping

```yaml
---
# REQUIRED
name: "Entity Name"         → Name (title)
tags: [type, tag1, tag2]    → Tags (multi_select) - MUST include entity type
status: Active              → Status (select)

# OPTIONAL
version: "1.0.0"            → Version (rich_text)
player: "Player 2"          → Player (rich_text)
session_number: 1           → Session Number (number)
location_type: "City"       → Location Type (select)
progress_clock: "[3/6]"     → Progress Clock (rich_text)
---
```

---

## ⚠️ Critical Reminders

1. **Entity type goes in Tags, not Type property**
2. **NO relation properties work except Parent Location**
3. **Content goes in page body, not Notes property**
4. **Always verify schema if you get 400 errors**
5. **This schema was verified 2025-10-04 - may change over time**

---

**Last Updated:** 2025-10-04
**Verified By:** Schema query script
**Next Verification:** When encountering sync errors
