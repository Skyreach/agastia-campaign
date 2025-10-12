# Notion Integration - Complete Guide

**Status:** ACTIVE - Single source of truth for all Notion operations
**Last Updated:** 2025-10-12

**Consolidates:** NOTION.md, AUTO_SYNC_SOLUTION.md, NOTION_ARCHITECTURE.md, SYNC_STRATEGY.md

---

## Quick Start (New Machine Setup)

```bash
# 1. Add API key
echo "YOUR_NOTION_API_KEY" > .config/notion_key.txt

# 2. Install dependencies
pip3 install notion-client python-frontmatter

# 3. Start file watcher (auto-syncs changes)
./start_file_watcher.sh

# 4. Verify environment
./.config/SESSION_STARTUP_CHECK.sh

# 5. Manual sync if needed
python3 sync_notion.py all
```

**Done.** File watcher handles automatic syncing. Git pre-commit hook enforces sync on commits.

---

## How Notion Sync Works

### Automatic Sync (PRIMARY METHOD)

**File Watcher:**
- Monitors all campaign markdown files in real-time
- Auto-syncs changed files to Notion within 500ms
- Runs in background (no manual intervention)
- Start with: `./start_file_watcher.sh`
- Check status: `pgrep -f file_watcher.js`
- View log: `tail -f .config/file_watcher.log`

**Pre-Commit Hook:**
- Syncs all staged markdown files before git commit
- **BLOCKS commit** if Notion sync fails
- Ensures git and Notion always stay in sync
- Location: `.git/hooks/pre-commit`

**What Gets Synced:**
- Properties (from YAML frontmatter): Name, Tags, Status, Version, etc.
- Full content (markdown → Notion blocks): Headers, lists, formatting, code blocks
- Supported formats: H1-H3, **bold**, *italic*, `code`, lists, blockquotes, toggles

**What's Excluded (.notionignore):**
- `.config/**/*.md` - Infrastructure docs
- `README.md`, `CLAUDE.md`, `COMMANDS.md`, `NOT ION.md` - Meta files
- `.working/development/**` - Development logs
- `Sessions/*_notes.md`, `Sessions/*_private.md` - Private session notes

### Manual Sync (When Needed)

```bash
# Sync all files
python3 sync_notion.py all

# Sync single file
python3 sync_notion.py Sessions/Session_1.md session

# Verify sync status
python3 .config/verify_sync_status.py
```

---

## Database Schema

**Database ID:** `281693f0-c6b4-80be-87c3-f56fef9cc2b9`

### Core Properties (All Entities)

| Property | Type | Description |
|----------|------|-------------|
| **Name** | Title | Entity name |
| **Tags** | Multi-select | Entity types, quest tags (pc, npc, faction, session, etc.) |
| **Status** | Select | Active, Planning, Completed, Destroyed, Unknown, Pending |
| **File Path** | Rich text | Local markdown path |
| **Version** | Rich text | Semantic versioning ("X.Y.Z") |

**Important:** Entity type stored in Tags, not separate "Type" property.

### Type-Specific Properties

**For PCs:**
- Player (rich_text)
- Class (rich_text)
- Level (number)

**For NPCs:**
- Faction (relation)
- Location (relation)
- Threat Level (select): None, Low, Medium, High, Extreme

**For Factions:**
- Progress Clock (rich_text): "[X/Y]" format
- Territory (relation to Locations)

**For Locations:**
- Location Type (select): City, Region, District, Town, Wilderness, Dungeon
- Parent Location (relation)
- Child Locations (relation)

**For Sessions:**
- Session Number (number)
- Date Played (date)

**For Artifacts:**
- Current Location (relation)
- Seekers (relation)

**For Goals:**
- Goal Owner (relation to PC/Faction)
- Goal Status (select)
- Progress Clock (rich_text)

---

## Sync Methods: Which Tool to Use?

### Decision Tree

```
Is the document complex with 3+ levels of nested toggles?
├─ NO → Use sync_notion.py (automatic via file watcher)
│       Examples: PC files, NPCs, Factions, simple sessions
│
└─ YES → Use structure builder (build_dungeon_structure.py)
          Examples: Dungeons, complex session flows
```

### Method 1: Flat Sync (sync_notion.py)

**Use For:**
- Simple documents (PCs, NPCs, Factions, Locations)
- Documents with max 1-2 toggle levels
- Automatic via file watcher

**How It Works:**
- Parses markdown line-by-line
- Converts to Notion blocks
- Sets `is_toggleable: True` on headings
- Archives old page, creates new on updates

**Limitations:**
- Can't nest toggles beyond 2 levels
- Not suitable for complex hierarchies

### Method 2: Structure Builder (build_dungeon_structure.py)

**Use For:**
- Dungeons with nested room → creature → individual structure
- Session flows with 3+ toggle levels
- Any complex hierarchical data

**How It Works:**
- Takes structured data (Python dict)
- Creates parent blocks first
- Appends children via separate API calls
- Guarantees correct nesting (unlimited depth)

**Workflow:**
1. Define data model as Python dict
2. Write builder function
3. Test with hardcoded data
4. Extract from markdown (optional)

**Example:**
```python
from .config.build_dungeon_structure import create_dungeon_page

data = {
    'overview': {...},
    'rooms': [...]
}

create_dungeon_page(notion, "Dungeon Name", data)
```

---

## Markdown → Notion Conversion

### Supported Formats

| Markdown | Notion Block | Notes |
|----------|--------------|-------|
| `# Header` | `heading_1` | With rich_text parsing |
| `## Header` | `heading_2` | With rich_text parsing |
| `### Header` | `heading_3` | With rich_text parsing |
| `**bold**` | Annotation: `bold: true` | Inline formatting |
| `*italic*` | Annotation: `italic: true` | Inline formatting |
| `` `code` `` | Annotation: `code: true` | Inline formatting |
| `> Quote` | `quote` | Blockquote |
| `| Boxed` | `quote` | Tiered DC format opener |
| `- List` | `bulleted_list_item` | Unordered list |
| `1. List` | `numbered_list_item` | Ordered list |
| ` ```code``` ` | `code` | Code blocks (including mermaid) |
| `**Toggle: Title**` | `toggle` | Notion-specific collapsible |
| `<details><summary>` | `toggle` | Converted to Notion toggle |

### Not Supported (Use Alternatives)

❌ HTML tags (`<div>`, `<span>`, `<br>`)
❌ Inline styles
❌ Tables (use lists instead)
❌ Images (not in sync scope)

---

## Critical Rules (Lessons Learned)

### 1. Content Must Sync
**Problem:** Properties-only sync is useless—user reads from Notion
**Solution:** sync_notion.py converts full markdown to Notion blocks

### 2. HTML Doesn't Render
**Problem:** `<details>` tags showed as literal text
**Solution:** Parser converts HTML → native Notion toggles

### 3. Formatting Needs Annotations
**Problem:** `**bold**` rendered as literal text
**Solution:** `parse_rich_text()` converts to Notion annotations

### 4. Large Re-syncs Are Expensive
**Problem:** Deleting 100+ blocks times out
**Solution:** Delete page content in Notion UI first, then re-sync

### 5. Use .notionignore
**Problem:** Infrastructure docs syncing as campaign content
**Solution:** `.notionignore` excludes dev/meta files

---

## File Watcher (Primary Automation)

### What It Monitors

```
Player_Characters/*.md
NPCs/**/*.md
Factions/*.md
Locations/**/*.md
Sessions/*.md
Campaign_Core/*.md
Dungeon_Ecologies/*.md
Quests/*.md
Items/*.md
```

### What It Ignores

```
README.md, CLAUDE.md, COMMANDS.md, NOTION.md
.config/**
.working/**
node_modules/, .git/
```

### Management Commands

```bash
# Start file watcher
./start_file_watcher.sh

# Check if running
pgrep -f file_watcher.js

# View log
tail -f .config/file_watcher.log

# Stop file watcher
pkill -f file_watcher.js

# Restart file watcher
pkill -f file_watcher.js && ./start_file_watcher.sh
```

---

## Enforcement Layers

| Layer | Tool | When Active | Can Bypass? |
|-------|------|-------------|-------------|
| **1** | File Watcher | When running | No (automatic) |
| **2** | Pre-Commit Hook | Every commit | No (blocks commit) |
| **3** | Startup Check | Session start | Yes (if ignored) |
| **4** | CLAUDE.md | If read | Yes (if not read) |

**Most Reliable:** File Watcher (Layer 1)
**Strongest Enforcement:** Pre-Commit Hook (Layer 2)

---

## Troubleshooting

### File Watcher Not Starting

1. Check dependencies: `npm list chokidar`
2. Check log: `cat .config/file_watcher.log`
3. Reinstall: `cd agastia-campaign && npm install chokidar`

### Notion Pages Are Empty

**Check version:**
```bash
grep "markdown_to_notion_blocks" sync_notion.py
```
If not found: Wrong version, pull latest code.

### HTML Tags Showing in Notion

File watcher/sync_notion.py should auto-convert `<details>` → toggles.
**Fix:** Ensure using latest sync_notion.py.

### Sync Times Out

For files with 100+ blocks:
1. Delete page content in Notion UI
2. Re-run sync (much faster without deletion loop)

### Pre-Commit Hook Blocking

1. Check error message
2. Fix Notion sync issue (API key, connection, etc.)
3. Retry commit

### "Resources syncing when they shouldn't"

Check `.notionignore` includes Resources exclusion.

---

## Version Control Integration

### Semantic Versioning in Frontmatter

```yaml
version: "X.Y.Z"
```

**When to bump:**
- **Patch (X.X.+1):** Typo fixes, minor clarifications
- **Minor (X.+1.0):** New sections, goals, relationships
- **Major (+1.0.0):** Complete rewrites, fundamental changes, status changes

**Examples:**
- Fixed typo: `1.2.3` → `1.2.4`
- Added new goal: `1.2.3` → `1.3.0`
- Character death: `1.2.3` → `2.0.0`

---

## File Locations

### Active Files (Use These)

- **`sync_notion.py`** - Main sync script
- **`.config/file_watcher.js`** - Real-time monitoring
- **`start_file_watcher.sh`** - Launcher
- **`.config/notion_helpers.py`** - Helper functions
- **`.config/build_dungeon_structure.py`** - Complex structure builder
- **`.config/verify_sync_status.py`** - Verification
- **`.notionignore`** - Exclusion patterns
- **`.git/hooks/pre-commit`** - Commit-time sync enforcement

### Configuration Files

- **`.config/notion_key.txt`** - API key (gitignored)
- **`.config/database_id.txt`** - Database ID
- **`.config/NOTION_INTEGRATION.md`** - This file (consolidated guide)

### Archived/Obsolete (to be removed)

- ❌ `.config/NOTION_SETUP.md` - Redundant
- ❌ `.config/NOTION_CAPABILITIES.md` - Redundant
- ❌ `.config/NOTION_SYNC_LESSONS.md` - Consolidated here
- ❌ `NOTION.md` (root) - Moved to .config/
- ❌ Various `.bak` files - Cleanup needed

---

## Integration with Other Systems

### With Git

- Pre-commit hook syncs staged files
- Commit blocked if sync fails
- Version bumps tracked in frontmatter

### With File Organizer MCP

- Validates filename before creation
- Ensures files in correct directories
- Prevents forbidden filename patterns

### With Format Validator MCP

- Validates document structure
- Checks frontmatter completeness
- Ensures Notion-compatible markdown

### With CLAUDE.md

- Mandatory startup: `./start_file_watcher.sh`
- Mandatory check: `./.config/SESSION_STARTUP_CHECK.sh`
- References this doc for complete guide

---

## Security & API Keys

### API Key Management

1. **Storage:** `.config/notion_key.txt` (gitignored)
2. **Permissions:** File should be readable only by user
3. **Rotation:** Update key if exposed
4. **Usage:** Scripts read key automatically, never log it

### Never Do

❌ Commit API key to git
❌ Display key in console/logs
❌ Share key in chat logs
❌ Hard-code key in scripts

### Best Practices

✅ Store in gitignored file
✅ Use environment variables (alternative)
✅ Rotate regularly
✅ Clear chat after pasting (if needed for setup)

---

## Expected Behavior

### ✅ Correct Flow

1. Claude edits `Player_Characters/PC_Nikki.md`
2. File watcher detects change within 500ms
3. Auto-syncs to Notion as "pc" type
4. Notion updated automatically
5. All threads see updated data

### ❌ Without File Watcher

1. Claude edits file
2. File sits locally
3. Notion remains outdated
4. Other threads read stale data
5. Conflicts arise, data desync

---

## Session Startup Protocol

**MANDATORY STEPS (From CLAUDE.md):**

1. **Start file watcher:**
   ```bash
   ./start_file_watcher.sh
   ```

2. **Verify environment:**
   ```bash
   ./.config/SESSION_STARTUP_CHECK.sh
   ```

3. **Check for sync issues:**
   ```bash
   python3 .config/verify_sync_status.py
   ```

**If ANY check fails, STOP and report to user.**

---

## Related Documentation

- `.config/COMPONENT_REGISTRY.md` - File naming conventions
- `.config/ENTITY_FORMAT_SPECS.md` - Content structure requirements
- `.config/DATA_PARITY_PROTOCOL.md` - Edit safety rules
- `.config/SESSION_FORMAT_SPEC.md` - Session document formatting
- `CLAUDE.md` - System instructions (references this doc)

---

## Summary

✅ **Automatic sync** via file watcher (primary method)
✅ **Enforced sync** via pre-commit hook (backup)
✅ **Two sync methods:** Flat (simple) and Structure Builder (complex)
✅ **Clear exclusions** via .notionignore
✅ **Security** via gitignored API key
✅ **Version control** via semantic versioning
✅ **Cross-session consistency** via automated enforcement

**For new machine:** Run Quick Start commands
**For troubleshooting:** See Troubleshooting section
**For schema reference:** See Database Schema section
**For sync method choice:** See Decision Tree

No more confusion. No more manual sync. No more data desync.

---

## Version History

- **2025-10-12:** Consolidated from NOTION.md, AUTO_SYNC_SOLUTION.md, NOTION_ARCHITECTURE.md, SYNC_STRATEGY.md
- Added .notionignore documentation
- Clarified sync method decision tree
- Added enforcement layers table
- Streamlined for single source of truth
