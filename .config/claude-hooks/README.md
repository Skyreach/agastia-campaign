# Claude Code Hooks

This directory contains backup copies of Claude Code hooks used in this project.

## Installation

Run this script to install all hooks to your user-level Claude config:

```bash
./.config/claude-hooks/install-hooks.sh
```

This will:
1. Copy all hook scripts to `~/.claude/`
2. Update `~/.claude/settings.json` to register the hooks
3. Make scripts executable

## Hooks Included

### 1. `critical-behavior-hook.py` (SessionStart)
Enforces critical behavior rule: Never use validation language when user points out mistakes.

### 2. `post-commit-push-reminder.py` (PostToolUse)
- Reminds to push immediately after git commits
- Warns if MCP server files modified but not installed in config

### 3. `stop-unpushed-check.py` (Stop)
Checks for unpushed commits in agastia-campaign repo at end of each response.

## Manual Installation

If you prefer manual installation:

1. Copy scripts to `~/.claude/`:
   ```bash
   cp .config/claude-hooks/*.py ~/.claude/
   chmod +x ~/.claude/*.py
   ```

2. Update `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "SessionStart": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "/home/YOUR_USER/.claude/critical-behavior-hook.py"
             }
           ]
         }
       ],
       "PostToolUse": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "/home/YOUR_USER/.claude/post-commit-push-reminder.py"
             }
           ]
         }
       ],
       "Stop": [
         {
           "hooks": [
             {
               "type": "command",
               "command": "/home/YOUR_USER/.claude/stop-unpushed-check.py"
             }
           ]
         }
       ]
     }
   }
   ```

## Updating Hooks

After modifying hooks in `~/.claude/`, update backups with:

```bash
cp ~/.claude/*-hook.py .config/claude-hooks/
cp ~/.claude/*-reminder.py .config/claude-hooks/
cp ~/.claude/*-check.py .config/claude-hooks/
```
