# Notion Content Sync Verification

## ✅ CONFIRMED: sync_notion.py SYNCS FULL CONTENT (NOT JUST PROPERTIES!)

**CRITICAL:** The `sync_notion.py` script in this repo syncs:
1. ✅ Frontmatter properties (Name, Tags, Status, etc.)
2. ✅ **FULL MARKDOWN CONTENT** converted to Notion blocks
3. ✅ Headers, lists, code blocks, toggles, formatting

**See lines 289-326 in sync_notion.py:**
- Line 289: `content_blocks = markdown_to_notion_blocks(post.content)` ← Converts content
- Lines 302-310: Deletes old blocks and adds new content blocks
- Lines 323-324: Adds content blocks to new pages

This document verifies that all Notion content syncing fixes are available in the repo.

## Critical Files Present

### 1. sync_notion.py (Main Sync Script)
**Location:** `/sync_notion.py`
**Status:** ✅ Present with all fixes

**Key Functions:**
- `parse_rich_text(text)` - Parses **bold**, *italic*, `code` into Notion annotations
- `markdown_to_notion_blocks(content)` - Converts markdown to Notion blocks
  - Handles headers (H1, H2, H3)
  - Handles `<details>/<summary>` → toggle blocks
  - Handles blockquotes, lists, code blocks
  - Handles mermaid diagrams as code blocks
- `sync_to_notion(file_path, entry_type)` - Syncs single file with full content
- `sync_all()` - Syncs all campaign files

**What It Does:**
- Syncs markdown **CONTENT** to Notion page bodies (not just properties)
- Converts HTML `<details>` tags to Notion toggle blocks
- Parses markdown formatting (bold/italic/code) into Notion annotations
- Handles mermaid diagrams properly

### 2. NOTION_SYNC_LESSONS.md (Documentation)
**Location:** `.config/NOTION_SYNC_LESSONS.md`
**Status:** ✅ Present

**Contents:**
- Critical rules for syncing content
- Supported markdown → Notion conversions table
- Quota management best practices
- Resources directory exclusion documentation
- Action items checklist

### 3. NOTION_ARCHITECTURE.md (Database Schema)
**Location:** `.config/NOTION_ARCHITECTURE.md`
**Status:** ✅ Present

**Contents:**
- Database properties documentation
- Entity types and relationships
- Location hierarchy system
- Filtered database views

## ANSWER: Which Script Syncs Content?

**Script:** `sync_notion.py` (in repo root)

**What it syncs:**
- ✅ Properties (frontmatter)
- ✅ **FULL PAGE CONTENT** (markdown body converted to Notion blocks)

**Proof (code inspection):**
```python
# Line 289: Converts markdown content to Notion blocks
content_blocks = markdown_to_notion_blocks(post.content)

# Lines 302-310: For existing pages - deletes old blocks, adds new
existing_blocks = notion.blocks.children.list(block_id=page_id)
for block in existing_blocks['results']:
    notion.blocks.delete(block_id=block['id'])
notion.blocks.children.append(block_id=page_id, children=batch)

# Lines 323-324: For new pages - adds content blocks
notion.blocks.children.append(block_id=new_page['id'], children=batch)
```

**This is NOT the old properties-only sync. This syncs EVERYTHING.**

## How To Use On New Machine

### Step 1: Ensure Notion API Key Exists
```bash
# Check if key file exists
ls -la .config/notion_key.txt

# If missing, create it with your Notion API key
echo "YOUR_NOTION_API_KEY" > .config/notion_key.txt
chmod 600 .config/notion_key.txt
```

### Step 2: Verify Python Dependencies
```bash
# Ensure notion-client is installed
python3 -c "import notion_client; print('✅ notion-client installed')"

# If not installed:
pip3 install notion-client python-frontmatter
```

### Step 3: Test Sync Script
```bash
# Sync a single file (test)
python3 sync_notion.py Sessions/Session_1_Caravan_to_Ratterdan.md Session

# Expected output:
# ✅ Updated: Session 1 - Ratterdan Investigation (XX blocks)
# OR
# ✨ Created: Session 1 - Ratterdan Investigation (XX blocks)
```

### Step 4: Sync All Content
```bash
# Sync all campaign files
python3 sync_notion.py all

# This will sync:
# - All PCs (Player_Characters/**/*.md)
# - All NPCs (NPCs/**/*.md)
# - All Factions (Factions/**/*.md)
# - All Locations (Locations/**/*.md)
# - All Campaign Core (Campaign_Core/**/*.md)
# - All Sessions (Sessions/**/*.md)
# - Resources/** is EXCLUDED
```

## What Gets Synced

### Content Syncing (Full Markdown → Notion)
The script now syncs:
- ✅ Frontmatter properties (Name, Tags, Status, etc.)
- ✅ **Full markdown content** as Notion blocks
- ✅ Headers (H1, H2, H3)
- ✅ Bold/italic/code inline formatting
- ✅ Blockquotes (>)
- ✅ Lists (bulleted and numbered)
- ✅ Code blocks (including mermaid)
- ✅ Toggle blocks (converted from `<details>/<summary>`)

### What Doesn't Sync
- ❌ Resources directory (`Resources/**/*.md`) - intentionally excluded
- ❌ Working files (`.working/**/*.md`) - not in sync patterns
- ❌ HTML tags (except `<details>/<summary>` converted to toggles)
- ❌ Horizontal rules (`---`) - skipped
- ❌ Images - requires different API

## Troubleshooting

### "Content is empty in Notion"
**Cause:** Old version of `sync_notion.py` without content syncing
**Fix:** Ensure you've pulled latest repo (this version has fixes)

### "HTML tags show as literal text"
**Cause:** Using `<details>` tags in markdown
**Fix:** Script automatically converts to toggle blocks (already fixed in repo)

### "Bold/italic not rendering"
**Cause:** Old version without `parse_rich_text()` function
**Fix:** Latest script has this function (already in repo)

### "Sync times out"
**Cause:** Large files (100+ blocks) take time
**Solution:**
1. Ask user to delete Notion page content in Notion UI
2. Then re-run sync (creates fresh content faster)
3. OR sync smaller files individually

### "Resources syncing when they shouldn't"
**Cause:** Old sync patterns
**Fix:** Check `sync_all()` function - should have comment excluding Resources

## Verification Commands

```bash
# Check parse_rich_text exists
grep -n "def parse_rich_text" sync_notion.py

# Check markdown_to_notion_blocks exists
grep -n "def markdown_to_notion_blocks" sync_notion.py

# Check toggle conversion exists
grep -n "details.*toggle" sync_notion.py

# Check Resources exclusion
grep -n "Resources" sync_notion.py
# Should show: # Resources excluded - reference material...
```

## Expected Function Counts
```bash
grep -c "def " sync_notion.py
# Should return: 6
# Functions: load_notion_key, get_notion_client, parse_rich_text,
#            markdown_to_notion_blocks, sync_to_notion, sync_all
```

## Summary

✅ **All Notion content sync fixes are in the repository**

The fixes include:
1. Content syncing (not just properties)
2. HTML → toggle conversion
3. Bold/italic/code annotation parsing
4. Mermaid diagram support
5. Resources directory exclusion
6. Comprehensive documentation

**To use on new machine:**
1. Pull latest repo
2. Add Notion API key to `.config/notion_key.txt`
3. Install Python dependencies
4. Run `python3 sync_notion.py all`

All content will sync properly to Notion with:
- Proper formatting (bold/italic)
- Toggle blocks (not raw HTML)
- Full page content (not just properties)
