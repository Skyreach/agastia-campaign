# Auto-Sync Enforcement Solution

**Created:** 2025-10-04
**Problem:** Claude threads were not syncing to Notion, causing data inconsistencies

---

## ✅ IMPLEMENTED SOLUTIONS

### 1. **File Watcher (PRIMARY SOLUTION)**
**Location:** `.config/file_watcher.js`
**Startup:** `./start_file_watcher.sh`

**How it works:**
- Monitors all campaign markdown files in real-time
- Automatically syncs changed files to Notion
- Runs in background (no manual intervention needed)
- Uses `chokidar` library for reliable file watching

**What it watches:**
- `Player_Characters/*.md`
- `NPCs/**/*.md`
- `Factions/*.md`
- `Locations/*.md`
- `Sessions/*.md`
- `Campaign_Core/*.md`
- `Dungeon_Ecologies/*.md`
- `Session_Flows/*.md`
- `Resources/*.md`

**What it ignores:**
- `README.md`, `CLAUDE.md`, `COMMANDS.md`
- `.config/` directory
- `node_modules/`, `.git/`

### 2. **Git Pre-Commit Hook**
**Location:** `.git/hooks/pre-commit`

**How it works:**
- Runs before every git commit
- Syncs all staged markdown files to Notion
- **BLOCKS COMMIT** if Notion sync fails
- Ensures git and Notion stay in sync

### 3. **Session Startup Check**
**Location:** `.config/SESSION_STARTUP_CHECK.sh`

**What it checks:**
- Notion connection is working
- Sync script uses correct schema
- Protocol files exist
- Warns about uncommitted changes

### 4. **CLAUDE.md Mandatory Startup**
**Location:** Lines 3-23 of `CLAUDE.md`

**Requires Claude to run:**
1. `./start_file_watcher.sh`
2. `./.config/SESSION_STARTUP_CHECK.sh`

---

## 📋 HOW TO USE

### For You (User):
1. **At start of session:** Run `./start_file_watcher.sh` once
2. **Work normally:** File watcher handles all syncing automatically
3. **At end of day:** Commit changes (pre-commit hook will sync too)

### For Claude (New Threads):
Claude MUST run these commands at session start (specified in CLAUDE.md):
```bash
./start_file_watcher.sh
./.config/SESSION_STARTUP_CHECK.sh
```

---

## 🔧 MAINTENANCE

### Check if File Watcher is Running:
```bash
pgrep -f file_watcher.js
```

### View File Watcher Log:
```bash
tail -f .config/file_watcher.log
```

### Stop File Watcher:
```bash
pkill -f file_watcher.js
```

### Restart File Watcher:
```bash
pkill -f file_watcher.js && ./start_file_watcher.sh
```

### Manual Sync (if needed):
```bash
python3 sync_notion.py [filepath] [type]
```

---

## 🚨 TROUBLESHOOTING

### File Watcher Not Starting:
1. Check dependencies: `npm list chokidar`
2. Check log: `cat .config/file_watcher.log`
3. Reinstall: `npm install chokidar`

### Sync Failures:
1. Check Notion connection: `python3 .config/query_notion_schema.py`
2. Verify API key: `.config/notion_key.txt`
3. Check sync script: `grep "File Path" sync_notion.py`

### Pre-Commit Hook Blocking:
1. Check what failed: Look for error message
2. Fix the Notion sync issue
3. Try commit again

---

## 📊 ENFORCEMENT LEVELS

| Level | Tool | When Active | Bypass Possible? |
|-------|------|-------------|------------------|
| 1 | File Watcher | When running | No (automatic) |
| 2 | Pre-Commit Hook | Every commit | No (blocks commit) |
| 3 | Startup Check | Session start | Yes (if ignored) |
| 4 | CLAUDE.md | If read | Yes (if not read) |

**Most Reliable:** File Watcher (Level 1)
**Strongest Enforcement:** Pre-Commit Hook (Level 2)

---

## 🎯 EXPECTED BEHAVIOR

### ✅ Correct Flow:
1. Claude edits `Player_Characters/PC_Nikki.md`
2. File watcher detects change within 500ms
3. Auto-syncs to Notion as "PC" type
4. Notion updated automatically
5. All threads see updated data

### ❌ Without These Tools:
1. Claude edits file
2. File sits locally
3. Notion remains outdated
4. Other threads read stale data
5. Conflicts arise

---

## 📝 FILES CREATED

### Core Scripts:
- `.config/file_watcher.js` - Real-time file monitoring
- `start_file_watcher.sh` - Launcher script
- `.git/hooks/pre-commit` - Commit-time enforcement
- `.config/SESSION_STARTUP_CHECK.sh` - Environment validation
- `.config/auto_sync_wrapper.py` - Manual sync helper

### Documentation:
- `.config/PROACTIVE_UPDATE_PROTOCOL.md` - Update guidelines
- `.config/NOTION_SCHEMA_VERIFIED.md` - Schema reference
- `.config/NOTION_CAPABILITIES.md` - API capabilities
- This file - Overall solution documentation

### Updated:
- `CLAUDE.md` - Added mandatory startup commands
- `sync_notion.py` - Fixed to use correct Notion schema

---

## 🔄 NEXT STEPS FOR OTHER THREADS

If you encounter a thread that's not syncing:

1. **Immediate:** Start file watcher in that shell
   ```bash
   ./start_file_watcher.sh
   ```

2. **Tell Claude:** Paste this in chat:
   ```
   CRITICAL: Run these commands NOW:
   ./start_file_watcher.sh
   ./.config/SESSION_STARTUP_CHECK.sh
   ```

3. **Verify:** Check that CLAUDE.md starts with "🚨 MANDATORY SESSION STARTUP"

---

**Last Updated:** 2025-10-04
**Status:** ✅ ACTIVE AND WORKING
