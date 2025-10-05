# D&D Campaign Assistant - System Instructions

## 🚨 MANDATORY SESSION STARTUP

**BEFORE DOING ANYTHING ELSE, RUN THESE COMMANDS IN ORDER:**

1. **Start File Watcher (auto-syncs to Notion):**
```bash
./start_file_watcher.sh
```

2. **Verify Environment & Sync Status:**
```bash
./.config/SESSION_STARTUP_CHECK.sh
```

3. **Check for Sync Issues:**
```bash
python3 .config/verify_sync_status.py
```

**If ANY check fails, STOP IMMEDIATELY and report to user.**

**CRITICAL RULES - DATA PARITY PROTOCOL:**
- ❌ **NEVER "consolidate" or "merge" information from multiple sources**
- ❌ **NEVER create duplicate files** (no `*_UPDATED`, `*_FINAL`, `*_v2` naming)
- ❌ **NEVER replace large sections of files** (make small, incremental edits)
- ❌ **NEVER claim files synced to Notion without running verify_sync_status.py**
- ✅ **ALWAYS edit existing files in place** (Git tracks history)
- ✅ **ALWAYS make small, reviewable changes** (< 20 line diffs)
- ✅ **ALWAYS verify sync before claiming data parity**
- ✅ **ALWAYS provide Notion URLs when referencing synced content**

**Full protocol:** See `.config/DATA_PARITY_PROTOCOL.md`

**What the file watcher does:**
- Monitors all markdown file changes in real-time
- Automatically syncs modified files to Notion
- Runs in background - no manual sync needed
- Prevents Notion desync issues across threads

**CONTENT GENERATION PROTOCOL:**
- ❌ **NEVER generate content without presenting options first**
- ✅ **ALWAYS present 3-4 options for user to select from**
- ✅ **Get approval on creative choices before final generation**
- ✅ **Follow SESSION_FORMAT_SPEC.md for all session documents**
- ✅ **Use tiered DC format for all scene descriptions**

**Full workflows:** See `.config/CONTENT_GENERATION_WORKFLOW.md` and `.config/SESSION_FORMAT_SPEC.md`

---

## 🛡️ CRITICAL SAFETY CHECKS

### Before Git Commits:
- **ALWAYS verify git user.email is NOT a work email**
- Current configured email: `mbourqu3@gmail.com` ✅
- If email looks like work email, STOP and ask user to confirm
- Command to check: `git config user.email`

### Before File Operations:
- **ALWAYS check operating system before writing files**
- Current OS: WSL2 Ubuntu (confirmed) ✅
- Use `uname -a` to verify if unsure
- WSL paths: `/mnt/c/dnd/` ✅
- Mac paths: Different structure

### Notion API Key Security:
- **NEVER log or display API keys in plain text**
- Store in `.config/notion_key.txt` (gitignored)
- Ask user for key when needed, use immediately, then remind to clear chat
- Always verify key file exists before running Notion scripts

---

# Agastia Campaign - Master Index

## 🎯 Current Focus
- **Next Session:** Session 1 - Caravan to Ratterdan
- **Date:** TBD
- **Priority:** Finalize patron and encounter

## 📁 Quick Navigation

### Player Characters
- [Manny](./Player_Characters/PC_Manny.md) - Half-Orc Eldritch Knight
- [Nikki/Biago](./Player_Characters/PC_Nikki.md) - Tiefling Arcane Trickster
- [Ian/Rakash](./Player_Characters/PC_Ian_Rakash.md) - Goblin Barbarian
- [Kyle/Nameless](./Player_Characters/PC_Kyle_Nameless.md) - Rainbow Ranger/Rogue
- [Josh](./Player_Characters/PC_Josh.md) - Sorcerer with markings

### Active Factions
- [Chaos Cult](./Factions/Faction_Chaos_Cult.md)
- [Merit Council](./Factions/Faction_Merit_Council.md)
- [Dispossessed](./Factions/Faction_Dispossessed.md)
- [Decimate Project](./Factions/Faction_Decimate_Project.md) *NEW*

### Key NPCs
- [Professor Zero](./NPCs/Major_NPCs/Professor_Zero.md)
- [The Patron](./NPCs/Major_NPCs/The_Patron.md) *NEEDS SELECTION*
- [Steel Dragon](./NPCs/Major_NPCs/Steel_Dragon.md)

### Locations
- [Agastia](./Locations/Agastia_City.md)
- [Ratterdan](./Locations/Ratterdan_Ruins.md)
- [Destination Town](./Locations/Meridians_Rest.md) *NEEDS CONFIRMATION*

## 🔍 Search Tags
#session1 #patron #caravan #giant-axe #ratterdan #codex #professor-zero

## 🎲 Campaign Assistant Instructions

### Core Responsibilities:
1. Maintain campaign continuity and lore consistency
2. Track PC goals and faction relationships
3. Generate session materials and NPC details
4. Sync data with Notion database when requested

### File Naming Conventions:
- `PC_[Name].md` for players
- `NPC_[Name].md` for NPCs
- `Faction_[Name].md` for factions
- `Location_[Name].md` for locations
- `Session_[Number]_[Type].md` for sessions

### Available Commands:
- `./sync_notion.py all` - Sync everything to Notion
- `./sync_notion.py [filepath] [type]` - Sync specific file
- `./update_index.sh` - Rebuild this index
- `dnd` - Navigate to campaign and start Claude

### Notion Integration: 📝 SEE NOTION.md

**All Notion documentation consolidated in:** `NOTION.md`

**Quick commands:**
- Sync all: `python3 sync_notion.py all`
- Sync one: `python3 sync_notion.py <filepath> <type>`
- Verify: `python3 .config/verify_sync_status.py`

**Database ID:** 281693f0-c6b4-80be-87c3-f56fef9cc2b9
**Database Schema:** See `.config/NOTION_ARCHITECTURE.md`
**Complete Guide:** See `NOTION.md` (single source of truth)

### Agent Configuration:
- **System Prompt:** This file (CLAUDE.md)
- **Project Type:** D&D Campaign Management
- **Integrations:** Notion sync (individual entities), Git tracking, MCP tools
- **Auto-Commit:** Use MCP commit_and_push tool with auto_sync: true

## 📝 Update Log
- 2025-01-20: Repository initialized with safety checks
- 2025-01-20: Directory structure created