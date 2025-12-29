# Notion Sync Command Reference

## Complete Sync Workflow

### File Pattern Mappings (NOW CONSISTENT)

Both `sync_notion.py` and `auto_sync_wrapper.py` now use the **same patterns**:

| Directory | Type | Auto-Sync | Bulk Sync |
|-----------|------|-----------|-----------|
| `Player_Characters/**/*.md` | PC | ✅ | ✅ |
| `NPCs/**/*.md` | NPC | ✅ | ✅ |
| `Factions/**/*.md` | Faction | ✅ | ✅ |
| `Locations/**/*.md` | Location | ✅ | ✅ |
| `Sessions/**/*.md` | Session | ✅ | ✅ |
| `Resources/**/*.md` | Resource | ✅ | ✅ |
| `Campaign_Core/**/*.md` | Artifact | ✅ | ✅ |
| `Dungeon_Ecologies/**/*.md` | Ecology | ✅ | ✅ |
| `Session_Flows/**/*.md` | Flow | ✅ | ✅ |
| `.working/conversation_logs/**/*.md` | Conversation | ✅ | ✅ |
| `.config/NOTION_SYNC_IMPROVEMENTS.md` | Documentation | ✅ | ✅ |
| `.config/test_markdown_features.md` | Test | ✅ | ✅ |

---

## Command Usage

### 1. Sync Single File
```bash
python3 sync_notion.py <filepath> <type>
```

**Example:**
```bash
python3 sync_notion.py Player_Characters/PC_Manny.md PC
```

### 2. Sync All Files
```bash
python3 sync_notion.py all
```

This will:
- Scan all directories matching the patterns above
- Skip files in `.notionignore`
- Skip files starting with `_`
- Sync everything else to Notion with new table/wikilink support

### 3. Auto-Sync (via pre-commit hook)
Automatically runs when you commit files:
```bash
git add Player_Characters/PC_Manny.md
git commit -m "Update PC"
# Auto-syncs to Notion before commit completes
```

### 4. Manual Auto-Sync Wrapper
```bash
python3 .config/auto_sync_wrapper.py <filepath>
```

---

## New Features in Sync

### ✅ Tables
Markdown tables automatically convert to Notion table blocks:

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell A   | Cell B   |
```

### ✅ Wikilinks
Page references automatically become Notion mentions:

```markdown
[[PC_Manny]] is working with [[NPC_Marcus]] in [[Agastia]].
```

**Requirements:**
- Page name must match "Name" property in Notion (case-sensitive)
- Page must exist in the database
- Falls back to styled code if not found: `[[NonExistent]]`

### ✅ Toggles
HTML details tags become Notion toggle blocks:

```markdown
<details>
<summary>Combat Stats</summary>

- AC: 15
- HP: 45

</details>
```

---

## .notionignore Rules

Files excluded from sync:

```
.config/**/*.md         # All config markdown files
!.config/NOTION_SYNC_IMPROVEMENTS.md  # EXCEPT this one
!.config/test_markdown_features.md    # EXCEPT this one
README.md               # Project readme
CLAUDE.md               # AI instructions
tools/**                # Web tools
Sessions/*_notes.md     # Private DM notes
Sessions/*_private.md   # Private session files
```

---

## Source Material Files

These files document the sync improvements and are **included in Notion** as reference:

1. **`.config/NOTION_SYNC_IMPROVEMENTS.md`**
   - Type: `Documentation`
   - Documents table, wikilink, and toggle improvements
   - Shows implementation details and sources

2. **`.config/test_markdown_features.md`**
   - Type: `Test`
   - Demonstrates all new features
   - Can be synced to verify features work

3. **`.config/notion_markdown_improvements.py`**
   - NOT synced (Python code)
   - Reference implementations for improvements
   - Used to write actual sync_notion.py code

---

## Testing the New Features

1. **Quick Test:**
   ```bash
   python3 sync_notion.py .config/test_markdown_features.md Test
   ```
   Then check Notion to see tables, wikilinks, and toggles working.

2. **Full Sync Test:**
   ```bash
   python3 sync_notion.py all
   ```
   Syncs everything including the documentation files.

3. **Single Feature Test:**
   Create a test markdown file with tables/wikilinks, sync it, verify in Notion.

---

## Pattern Consistency Check

Run this to verify patterns match:

```bash
# Check sync_notion.py patterns
grep -A 12 "sync_mappings = \[" sync_notion.py

# Check auto_sync_wrapper.py patterns
grep -A 12 "campaign_patterns = {" .config/auto_sync_wrapper.py
```

Both should show the same 12 patterns.

---

## Implementation Files

### Main Files
- **`sync_notion.py`** - Main sync command
  - Lines 76-184: Wikilink parsing in `parse_rich_text()`
  - Lines 186-198: Function signature with notion_client/database_id
  - Lines 323-388: Table parsing
  - Line 582: Passes parameters for wikilink support
  - Lines 635-649: File pattern mappings

### Wrapper Files
- **`.config/auto_sync_wrapper.py`** - Auto-sync on file changes
  - Lines 15-29: File pattern mappings (now matches sync_notion.py)

### Documentation
- **`.config/NOTION_SYNC_IMPROVEMENTS.md`** - Implementation docs
- **`.config/test_markdown_features.md`** - Feature demonstrations
- **`.config/notion_markdown_improvements.py`** - Reference code

### Ignore Rules
- **`.notionignore`** - Sync exclusions (with exceptions for docs)

---

## Credits & Sources

**Table Support:**
- [Martian Library](https://github.com/tryfabric/martian)
- [Notion API: Simple Table Support](https://developers.notion.com/changelog/simple-table-support)

**Wikilink Support:**
- [MdToNotion](https://github.com/Layjoo/MdToNotion)
- [Notion API: Query Database](https://developers.notion.com/reference/post-database-query)

**Toggle Improvements:**
- Custom implementation fixing identified bugs
- Based on Notion API toggle block structure
