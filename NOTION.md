# Notion Integration - Complete Guide

**Single source of truth for all Notion operations.**

---

## Quick Start (New Machine Setup)

```bash
# 1. Add API key
echo "YOUR_NOTION_API_KEY" > .config/notion_key.txt

# 2. Install dependencies
pip3 install notion-client python-frontmatter

# 3. Sync all content
python3 sync_notion.py all
```

**Done.** All markdown files sync to Notion with full content and formatting.

---

## What sync_notion.py Does

**Syncs BOTH properties AND full markdown content to Notion.**

### Properties (Frontmatter)
- Name, Tags, Status, Version
- Session Number, Player, Location Type, etc.

### Full Content (Markdown Body → Notion Blocks)
- Headers (H1, H2, H3)
- **Bold**, *italic*, `code` formatting
- Blockquotes, lists (bulleted & numbered)
- Code blocks (including mermaid diagrams)
- Toggle blocks (converts `<details>/<summary>` HTML)

### What's Excluded
- `Resources/**` - Reference material only (not table content)
- `.working/**` - Workshop files
- Files starting with `_` - Templates

**Code proof (sync_notion.py):**
- Line 289: `content_blocks = markdown_to_notion_blocks(post.content)` ← Converts content
- Lines 302-310: Deletes old blocks, adds new content
- Lines 323-324: Adds content to new pages

---

## Database Schema

**Database ID:** `281693f0-c6b4-80be-87c3-f56fef9cc2b9`

### Core Properties
- **Name** (title) - Entity name
- **Tags** (multi-select) - Quest tags, entity types (pc, npc, faction, session, etc.)
- **Status** (select) - Active, Planning, Completed, Destroyed, etc.
- **File Path** (rich_text) - Local markdown path
- **Version** (rich_text) - Semantic versioning

### Type-Specific Properties
- **Player** (rich_text) - For PCs
- **Session Number** (number) - For Sessions
- **Location Type** (select) - For Locations (City, Region, District, etc.)
- **Progress Clock** (rich_text) - For Goals/Factions ("[3/6]" format)
- **Parent Location** (relation) - Location hierarchy

**Important:** Entity type stored in Tags, not separate "Type" property.

---

## Commands Reference

### Sync Commands
```bash
# Sync all files
python3 sync_notion.py all

# Sync single file
python3 sync_notion.py Sessions/Session_1.md Session

# Sync specific directory
python3 sync_notion.py NPCs/Faction_NPCs/NPC_Octavia_Subject8.md NPC
```

### Verification Commands
```bash
# Check functions exist
grep "def parse_rich_text" sync_notion.py
grep "def markdown_to_notion_blocks" sync_notion.py

# Test API connection
python3 .config/verify_sync_status.py

# Check database schema
python3 .config/query_notion_schema.py
```

---

## Critical Rules (From Lessons Learned)

### 1. Content Must Sync to Notion Pages
**Problem:** User reads from Notion, not GitHub. Properties-only sync is useless.
**Solution:** `sync_notion.py` converts full markdown content to Notion blocks.

### 2. HTML Doesn't Render in Notion
**Problem:** `<details>/<summary>` showed as literal text.
**Solution:** Parser converts HTML to native Notion toggle blocks.

### 3. Markdown Formatting Needs Annotations
**Problem:** `**bold**` rendered as literal text.
**Solution:** `parse_rich_text()` converts to Notion annotations: `{annotations: {bold: true}}`

### 4. Large Re-syncs Are Expensive
**Problem:** Deleting 100+ blocks individually times out, wastes quota.
**Solution:** Ask user to delete page content in Notion UI first, then re-sync (much faster).

### 5. Mermaid Uses Code Blocks
**Problem:** Uncertain how to sync flowcharts.
**Solution:** Notion renders mermaid in code blocks with `language: 'plain text'`.

---

## Supported Conversions

| Markdown | Notion Block | Notes |
|----------|--------------|-------|
| `# Header` | `heading_1` | With rich_text parsing |
| `## Header` | `heading_2` | With rich_text parsing |
| `### Header` | `heading_3` | With rich_text parsing |
| `**bold**` | Annotation: `bold: true` | Inline formatting |
| `*italic*` | Annotation: `italic: true` | Inline formatting |
| `` `code` `` | Annotation: `code: true` | Inline formatting |
| `> Quote` | `quote` | Blockquote |
| `- List` | `bulleted_list_item` | Unordered list |
| `1. List` | `numbered_list_item` | Ordered list |
| ` ```code``` ` | `code` | Code block |
| `<details><summary>` | `toggle` | Collapsible section |
| `---` | (skipped) | Not needed |

---

## Troubleshooting

### "Notion pages are empty"
**Check:** Are you using `sync_notion.py` from this repo?
```bash
python3 -c "exec(open('sync_notion.py').read()); print('✅' if 'markdown_to_notion_blocks' in dir() else '❌ Wrong version')"
```
If wrong version: `git pull origin main`

### "HTML tags showing in Notion"
**Fixed:** Parser converts `<details>` → toggle blocks automatically.

### "Bold/italic not working"
**Fixed:** `parse_rich_text()` handles annotations.

### "Sync times out"
**For large files (100+ blocks):**
1. Delete page content in Notion UI
2. Re-run sync (much faster without deletion loop)

### "Resources syncing when they shouldn't"
**Check:** `sync_all()` should exclude Resources:
```bash
grep -A5 "sync_mappings" sync_notion.py | grep Resources
# Should show: # Resources excluded - reference material...
```

---

## File Structure

### Active Files (Use These)
- **`sync_notion.py`** - Main sync script (USE THIS)
- **`.config/notion_key.txt`** - API key (gitignored)
- **`.config/notion_helpers.py`** - Helper functions
- **`.config/verify_sync_status.py`** - Verification script
- **`NOTION.md`** - This file (complete guide)

### Obsolete Files (Delete These)
- ❌ `.config/NOTION_SETUP.md` - Redundant
- ❌ `.config/NOTION_SETUP_GUIDE.md` - Redundant
- ❌ `.config/NOTION_LINKING_GUIDE.md` - Redundant
- ❌ `.config/NOTION_CAPABILITIES.md` - Redundant
- ❌ `.config/NOTION_SCHEMA_VERIFIED.md` - Redundant
- ❌ `.config/NOTION_SYNC_LESSONS.md` - Consolidated here
- ❌ `.config/VERIFY_NOTION_CONTENT_SYNC.md` - Consolidated here
- ❌ `NOTION_SYNC_QUICKSTART.md` - Consolidated here
- ❌ All `.bak` files - Cleanup needed

---

## Update CLAUDE.md Reference

**In CLAUDE.md, replace Notion section with:**

```markdown
### Notion Integration: 📝 SEE NOTION.md

**All Notion documentation consolidated in:** `NOTION.md`

**Quick commands:**
- Sync all: `python3 sync_notion.py all`
- Sync one: `python3 sync_notion.py <filepath> <type>`
- Verify: `python3 .config/verify_sync_status.py`

**Database ID:** 281693f0-c6b4-80be-87c3-f56fef9cc2b9
```

---

## Summary

✅ **One file.** One source of truth. Clear hierarchy.
✅ **Quick start** at top for new machines.
✅ **Commands** clearly listed.
✅ **Schema** documented.
✅ **Troubleshooting** included.
✅ **Obsolete files** identified for deletion.

**For new machine:** Read "Quick Start" section (3 commands).
**For troubleshooting:** Read "Troubleshooting" section.
**For schema reference:** Read "Database Schema" section.
**For supported formats:** Read "Supported Conversions" table.

No more confusion. No more hunting through multiple docs.
