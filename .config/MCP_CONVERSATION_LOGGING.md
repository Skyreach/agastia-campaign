# MCP Conversation Logging System

## Overview

Three new MCP servers manage conversation logging and file organization:

1. **conversation-classifier** - Classifies conversations as campaign or infrastructure
2. **file-organizer** - Enforces naming conventions and detects componentization opportunities
3. **conversation-tracker** - Logs conversations to markdown files with source references

## Directory Structure

```
.working/
  conversation_logs/          # Campaign discussions (SYNCED to Notion)
    Session_1_Questions.md
    Patron_Selection.md
  development/                # Infrastructure fixes (NOT synced)
    Sync_Error_Fix.md
    Hook_Configuration.md
```

## .notionignore File

Controls which files sync to Notion (gitignore syntax):

```
# Development/Infrastructure work
.working/development/**
.config/**/*.md
README.md
CLAUDE.md

# Session private notes
Sessions/*_notes.md
Sessions/*_private.md

# Logs and temp
*.log
*.tmp
```

## MCP Server: conversation-classifier

**Purpose:** Determines if conversation is about campaign content or infrastructure

**Tool:** `classify_conversation`
- **Input:** `context` (string) - conversation text to classify
- **Output:**
  ```json
  {
    "classification": "campaign" | "infrastructure",
    "confidence": 0.0-1.0,
    "reasoning": "explanation",
    "sync_to_notion": boolean
  }
  ```

**Classification Logic:**
- **Campaign keywords:** session, character, npc, faction, encounter, lore, worldbuilding
- **Infrastructure keywords:** sync, git, hook, mcp, error, bug, script, api, configuration

## MCP Server: file-organizer

**Purpose:** Enforces file naming and detects cross-cutting concerns

**Tool 1:** `validate_filename`
- **Input:** `proposed_name`, `content_type` (optional)
- **Output:**
  ```json
  {
    "valid": boolean,
    "errors": ["error messages"],
    "warnings": ["warning messages"],
    "suggested_name": "corrected filename"
  }
  ```

**Forbidden Patterns:**
- Version numbers: `v1`, `v2`, `V3`
- Dates: `20251012`, `2025-10-12`
- Temporal indicators: `_updated`, `_revised`, `_final`, `_new`, `_old`, `_draft`
- Copy indicators: `_backup`, `_copy`, `(1)`, `(2)`

**Valid Filename Pattern:** `{Type}_{Specific_Name}.md`
- Examples: `PC_Manny.md`, `Location_Ratterdan.md`, `NPC_Professor_Zero.md`

**Tool 2:** `check_cross_cutting_concerns`
- **Input:** `content` (string)
- **Output:** Array of concerns detected
- **Detects:**
  - Content spanning multiple entity types
  - References to multiple sessions
  - Large files (>500 lines)

**Tool 3:** `propose_componentization`
- **Input:** `file_path`
- **Output:**
  ```json
  {
    "proposed_files": [{"path": "...", "reason": "..."}],
    "cross_cutting_concerns": [...],
    "delete_original": boolean,
    "requires_user_approval": boolean
  }
  ```
- **Stops and asks user if cross-cutting concerns detected**

## MCP Server: conversation-tracker

**Purpose:** Logs conversations to markdown with source references

**Tool:** `log_conversation`
- **Input:**
  - `question` (string)
  - `answer` (string)
  - `conversation_type` ("campaign" | "infrastructure")
  - `topic` (string) - file name base
  - `references` (array) - file paths referenced
- **Output:**
  ```json
  {
    "file_path": "path/to/log.md",
    "conversation_type": "campaign",
    "synced_to_notion": true,
    "message": "Logged conversation..."
  }
  ```

**Resource:** `conversation-log://recent`
- Returns list of 10 most recent logs with metadata

**Log Structure:**
```markdown
---
name: Session 1 Questions
type: Conversation Log
date: 2025-01-12
tags: [campaign, conversation-log]
---

# Session 1 Questions

## Q: What's in Session 1?

**References:** Sessions/Session_1_Caravan_to_Ratterdan.md
**Timestamp:** 2025-01-12T14:30:00Z

Session has 4 nodes: Cloud Compass skill challenge...

---
```

## Claude Desktop Configuration

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "conversation-classifier": {
      "command": "node",
      "args": [
        "/path/to/agastia-campaign/.config/mcp-servers/conversation-classifier/server.js"
      ]
    },
    "file-organizer": {
      "command": "node",
      "args": [
        "/path/to/agastia-campaign/.config/mcp-servers/file-organizer/server.js"
      ]
    },
    "conversation-tracker": {
      "command": "node",
      "args": [
        "/path/to/agastia-campaign/.config/mcp-servers/conversation-tracker/server.js"
      ],
      "env": {
        "CAMPAIGN_ROOT": "/path/to/agastia-campaign"
      }
    }
  }
}
```

## Integration with Existing Infrastructure

### sync_notion.py
- Now reads `.notionignore` patterns
- Skips files matching ignore patterns
- Includes `.working/conversation_logs/**/*.md` in sync (type: "Conversation")
- Reports skipped file count

### file_watcher.js
- Loads `.notionignore` on startup
- Checks patterns before syncing files
- Added `.working/conversation_logs/` to entity type mapping
- Removed hardcoded ignore list (uses .notionignore)

## Workflow

### Campaign Conversation
1. User asks question about Session 1
2. Claude classifies conversation: `classify_conversation(context)` → "campaign"
3. Claude logs conversation: `log_conversation(q, a, "campaign", "Session_1_Questions", ["Sessions/Session_1.md"])`
4. File created: `.working/conversation_logs/Session_1_Questions.md`
5. File watcher detects change
6. sync_notion.py syncs to Notion (not in .notionignore)

### Infrastructure Conversation
1. User reports sync error
2. Claude classifies: `classify_conversation(context)` → "infrastructure"
3. Claude logs: `log_conversation(q, a, "infrastructure", "Sync_Error_Fix", [...])`
4. File created: `.working/development/Sync_Error_Fix.md`
5. File watcher detects but skips (matches `.working/development/**` in .notionignore)
6. File tracked in git but NOT synced to Notion

### File Creation
1. Claude proposes filename: "PC_Manny_Updated.md"
2. Validates: `validate_filename("PC_Manny_Updated.md")` → error (contains "_Updated")
3. Corrects to: "PC_Manny.md"
4. Before splitting bulk file: `propose_componentization("Bulk_File.md")`
5. If cross-cutting concerns detected → **STOP and ask user**
6. On approval → split file → delete original

## Testing

### Test conversation-classifier
```bash
cd .config/mcp-servers/conversation-classifier
node server.js
# Send test via MCP protocol
```

### Test file-organizer
```bash
cd .config/mcp-servers/file-organizer
node server.js
# Send test via MCP protocol
```

### Test conversation-tracker
```bash
export CAMPAIGN_ROOT=/path/to/agastia-campaign
cd .config/mcp-servers/conversation-tracker
node server.js
# Send test via MCP protocol
```

## Maintenance

### Adding Ignore Patterns
Edit `.notionignore` following gitignore syntax:
- `**/*.log` - all log files
- `.working/temp/**` - entire directory
- `*_private.md` - files ending with _private.md

### Updating Classification Keywords
Edit `.config/mcp-servers/conversation-classifier/server.js`:
- Add to `CAMPAIGN_KEYWORDS` array
- Add to `INFRASTRUCTURE_KEYWORDS` array

### Updating Filename Validation
Edit `.config/mcp-servers/file-organizer/server.js`:
- Add patterns to `FORBIDDEN_PATTERNS` array
- Add types to `VALID_TYPES` array
