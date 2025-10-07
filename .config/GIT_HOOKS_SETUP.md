# Git Hooks Setup

This repository uses git hooks to enforce data parity and automate Notion sync.

## Pre-Commit Hook

The pre-commit hook (`.git/hooks/pre-commit`) runs automatically before every commit.

### What It Does

1. **Enforces Data Parity Protocol**
   - Blocks commits with banned filename patterns: `_UPDATED`, `_FINAL`, `_v2`, `_NEW`, `_CONSOLIDATED`, `_MERGED`, etc.
   - Prevents creation of duplicate files
   - See `.config/DATA_PARITY_PROTOCOL.md` for full protocol

2. **Syncs to Notion**
   - Detects modified markdown files in campaign directories
   - Determines entity type from path (pc, npc, faction, location, session, etc.)
   - Calls `sync_notion.py` for each modified file
   - Blocks commit if sync fails (unless Python packages missing - then relies on file watcher)

### Installation

The pre-commit hook is already installed in `.git/hooks/pre-commit` when you clone the repo.

**If the hook is missing or needs reinstallation:**

```bash
# The hook file is tracked in git at .git/hooks/pre-commit
# Make it executable:
chmod +x .git/hooks/pre-commit
```

### Dependencies

The pre-commit hook requires:
- Python 3
- `notion-client` package
- `python-frontmatter` package

Install dependencies:
```bash
pip3 install -r requirements.txt
```

**Note:** If Python packages are not installed, the hook will warn but allow the commit. The file watcher (`start_file_watcher.sh`) will handle sync instead.

### Manual Sync

If the pre-commit hook is bypassed or fails, manually sync with:

```bash
# Sync all campaign files
python3 sync_notion.py all

# Sync specific file
python3 sync_notion.py <filepath> <entity_type>

# Example
python3 sync_notion.py Player_Characters/PC_Nikki.md pc
```

### Bypassing the Hook (Not Recommended)

To commit without running the hook (emergency only):

```bash
git commit --no-verify -m "message"
```

⚠️ **WARNING:** This bypasses data parity checks and Notion sync. Only use in emergencies.

### Troubleshooting

**Hook not running:**
```bash
# Check if hook is executable
ls -la .git/hooks/pre-commit

# Make executable if needed
chmod +x .git/hooks/pre-commit
```

**Sync failing:**
```bash
# Verify Notion credentials exist
ls -la .config/notion_key.txt

# Test sync manually
python3 sync_notion.py <filepath> <type>

# Check Python packages installed
python3 -c "import notion_client, frontmatter"
```

**Data parity violation:**
- Remove files with banned patterns from staging area
- Edit existing files in place instead
- See `.config/DATA_PARITY_PROTOCOL.md`

## File Watcher (Auto-Sync)

In addition to the pre-commit hook, the file watcher provides real-time sync:

```bash
# Start file watcher (runs in background)
./start_file_watcher.sh
```

The file watcher monitors all markdown files and syncs changes to Notion automatically, independent of git commits.

## Hook Enforcement Philosophy

The pre-commit hook is **defensive** - it:
- ✅ Prevents common mistakes (duplicate files, forgotten syncs)
- ✅ Maintains data parity across local and Notion
- ✅ Fails gracefully when dependencies missing
- ❌ Does NOT block all commits (allows --no-verify for emergencies)
- ❌ Does NOT replace the file watcher (both systems work together)

## Related Documentation

- `.config/DATA_PARITY_PROTOCOL.md` - File naming and editing rules
- `.config/AUTO_SYNC_SOLUTION.md` - File watcher architecture
- `.config/NOTION_ARCHITECTURE.md` - Notion sync implementation details
- `NOTION.md` - Complete Notion integration guide
