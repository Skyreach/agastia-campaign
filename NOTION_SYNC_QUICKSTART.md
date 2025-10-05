# Notion Sync - Quick Start Guide

## ✅ YES - This Repo Has FULL CONTENT Syncing

**The script `sync_notion.py` syncs BOTH properties AND full markdown content to Notion.**

This is NOT the old properties-only version. This has ALL the fixes.

---

## Quick Answer: How To Sync On New Machine

```bash
# 1. Ensure you have the Notion API key
echo "your_notion_api_key_here" > .config/notion_key.txt

# 2. Install dependencies (if needed)
pip3 install notion-client python-frontmatter

# 3. Sync everything
python3 sync_notion.py all
```

**That's it!** All content will sync to Notion with proper formatting.

---

## What Gets Synced

### ✅ Properties (Frontmatter)
- Name, Tags, Status, Version
- Session Number, Player, Location Type
- File Path, Progress Clock
- All standard Notion database properties

### ✅ FULL CONTENT (Markdown Body)
Converted to Notion blocks:
- **Headers** (H1, H2, H3)
- **Bold**, *italic*, `code` formatting
- Blockquotes (>)
- Lists (bulleted & numbered)
- Code blocks (including mermaid diagrams)
- **Toggle blocks** (from `<details>/<summary>` HTML)

### ❌ Excluded
- `Resources/**` directory (reference material only)
- `.working/**` files (workshop files)
- Files starting with `_` (templates)

---

## Proof It Works (Code Evidence)

**File:** `sync_notion.py`

**Line 289:** Converts markdown content to Notion blocks
```python
content_blocks = markdown_to_notion_blocks(post.content)
```

**Lines 302-310:** Updates existing pages with content
```python
# Clear existing content
existing_blocks = notion.blocks.children.list(block_id=page_id)
for block in existing_blocks['results']:
    notion.blocks.delete(block_id=block['id'])

# Add new content
notion.blocks.children.append(block_id=page_id, children=batch)
```

**Lines 323-324:** Creates new pages with content
```python
notion.blocks.children.append(block_id=new_page['id'], children=batch)
```

---

## Key Functions (All Present)

1. **`parse_rich_text(text)`** - Parses bold/italic/code into Notion annotations
2. **`markdown_to_notion_blocks(content)`** - Converts markdown to Notion blocks
   - Handles headers, lists, quotes, code, toggles
   - Converts HTML `<details>` → Notion toggles
   - Supports mermaid diagrams
3. **`sync_to_notion(file_path, type)`** - Syncs single file with full content
4. **`sync_all()`** - Syncs all campaign files

**Verify they exist:**
```bash
grep -c "def parse_rich_text" sync_notion.py    # Should return: 1
grep -c "def markdown_to_notion_blocks" sync_notion.py  # Should return: 1
grep -c "def sync_to_notion" sync_notion.py     # Should return: 1
grep -c "def sync_all" sync_notion.py           # Should return: 1
```

---

## Differences From Old Version

### ❌ OLD (Properties Only)
- Synced frontmatter only
- No markdown content in Notion
- HTML tags showed as literal text
- No bold/italic formatting

### ✅ NEW (Full Content - This Repo)
- Syncs properties AND content
- Full markdown converted to Notion blocks
- HTML `<details>` → Notion toggles
- Bold/italic/code properly formatted
- Mermaid diagrams supported

---

## Troubleshooting

### "My Notion pages are empty"
**Check:** Did you use the right script?
```bash
# Run this to verify
python3 -c "
exec(open('sync_notion.py').read())
print('✅ Content sync present:', 'markdown_to_notion_blocks' in dir())
"
```

If it says `False`, you have the wrong version. Pull latest:
```bash
git pull origin main
```

### "HTML tags showing in Notion"
**Fixed:** Latest version converts `<details>` to toggle blocks automatically.

### "Bold/italic not working"
**Fixed:** Latest version has `parse_rich_text()` for annotations.

### "Takes too long / times out"
**Solution:** For very large files (100+ blocks):
1. Delete page content in Notion UI first
2. Then re-run sync (much faster)

---

## Usage Examples

### Sync Single File
```bash
python3 sync_notion.py Sessions/Session_1_Caravan_to_Ratterdan.md Session
```

### Sync All Files
```bash
python3 sync_notion.py all
```

### Test Sync (Verify Setup)
```bash
# Pick any small file to test
python3 sync_notion.py NPCs/Faction_NPCs/NPC_Trinity_Subject3.md NPC

# Expected output:
# ✅ Updated: Trinity (Subject #3) (17 blocks)
```

---

## Documentation Files

- **`sync_notion.py`** - Main sync script (USE THIS)
- **`.config/NOTION_SYNC_LESSONS.md`** - Complete lessons learned
- **`.config/VERIFY_NOTION_CONTENT_SYNC.md`** - Detailed verification guide
- **`.config/NOTION_ARCHITECTURE.md`** - Database schema
- **`NOTION_SYNC_QUICKSTART.md`** - This file

---

## Summary

✅ **The `sync_notion.py` in this repo syncs FULL CONTENT to Notion**
✅ **All formatting fixes are included** (toggles, bold/italic, mermaid)
✅ **Ready to use immediately** on any machine with API key
✅ **No additional setup needed** beyond dependencies

**Just run:** `python3 sync_notion.py all`
