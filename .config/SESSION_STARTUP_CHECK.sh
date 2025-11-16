#!/bin/bash
# Session Startup Check - Verifies environment and sync status
# This script MUST pass before starting any session work

set -e  # Exit on any error

# Hardcoded paths to prevent nested directory issues
CAMPAIGN_ROOT="/mnt/e/dnd/agastia-campaign"
SCRIPT_DIR="$CAMPAIGN_ROOT/.config"

# Ensure we're in the correct directory
cd "$CAMPAIGN_ROOT"

echo "============================================================"
echo "🔍 SESSION STARTUP CHECK"
echo "============================================================"
echo

# Check 1: Notion API Key
echo "1️⃣  Checking Notion API key..."
if [[ ! -f "$SCRIPT_DIR/notion_key.txt" ]]; then
    echo "❌ FAIL: Notion API key not found"
    exit 1
fi
echo "   ✅ Notion API key found"

# Check 2: Python dependencies
echo
echo "2️⃣  Checking Python dependencies..."
python3 -c "
import sys
sys.path.insert(0, '$SCRIPT_DIR')
from notion_helpers import load_notion_client
import frontmatter
print('   ✅ Python dependencies OK')
" || exit 1

# Check 3: Notion Connection
echo
echo "3️⃣  Testing Notion connection..."
python3 -c "
import sys
sys.path.insert(0, '$SCRIPT_DIR')
from notion_helpers import load_notion_client, load_database_id
notion = load_notion_client()
db_id = load_database_id()
notion.databases.query(database_id=db_id, page_size=1)
print('   ✅ Notion connection OK')
" || exit 1

# Check 4: File Watcher
echo
echo "4️⃣  Checking file watcher..."
if pgrep -f "chokidar" > /dev/null; then
    echo "   ✅ File watcher running"
else
    echo "   ⚠️  File watcher not detected"
fi

# Check 5: Git Hooks (PHASE 3)
echo
echo "5️⃣  Checking git hooks..."
HOOK_STATUS=$("$SCRIPT_DIR/git-hooks/check-hooks-installed.sh")
if [ "$HOOK_STATUS" = "INSTALLED" ]; then
    echo "   ✅ Git hooks installed"
elif [ "$HOOK_STATUS" = "MISSING" ]; then
    echo "   ⚠️  Git hooks NOT installed"
    echo "   Run: ./.config/git-hooks/install-git-hooks.sh"
elif [ "$HOOK_STATUS" = "NOT_EXECUTABLE" ]; then
    echo "   ⚠️  Git hooks not executable"
    echo "   Run: chmod +x .git/hooks/pre-commit"
fi

# Check 6: Workflow Recovery (PHASE 4)
echo
echo "6️⃣  Checking for active workflows..."
python3 "$SCRIPT_DIR/workflow_recovery.py" || {
    # workflow_recovery.py returns non-zero if workflows need attention
    # This is informational, not a failure
    echo
    echo "   ℹ️  See workflow recovery information above"
}

# Check 7: Slash Commands Symlink
echo
echo "7️⃣  Checking slash commands symlink..."
PARENT_DIR="$(dirname "$CAMPAIGN_ROOT")"
COMMANDS_LINK="$PARENT_DIR/.claude/commands"
if [[ ! -L "$COMMANDS_LINK" ]]; then
    echo "   ❌ FAIL: Slash commands symlink missing at $COMMANDS_LINK"
    echo "   Run: cd $PARENT_DIR && mkdir -p .claude && ln -sf \"\$(pwd)/agastia-campaign/.claude/commands\" .claude/commands"
    exit 1
elif [[ "$(readlink -f "$COMMANDS_LINK")" != "$CAMPAIGN_ROOT/.claude/commands" ]]; then
    echo "   ❌ FAIL: Slash commands symlink points to wrong location"
    echo "   Expected: $CAMPAIGN_ROOT/.claude/commands"
    echo "   Got: $(readlink -f "$COMMANDS_LINK")"
    exit 1
else
    echo "   ✅ Slash commands symlink OK"
    NUM_COMMANDS=$(ls "$COMMANDS_LINK"/*.md 2>/dev/null | grep -v "\.prompt\.md$" | wc -l)
    echo "   ℹ️  $NUM_COMMANDS commands available"
fi

# Check 8: Hook Error Logs
echo
echo "8️⃣  Checking hook error logs..."
HOOK_ERRORS=0

# Check each hook log for recent errors (last 10 lines)
for LOG in ~/.claude/debug/stop-hook.log ~/.claude/debug/post-tool-hook.log ~/.claude/debug/session-start-hook.log ~/.claude/debug/pretool-hook.log; do
    if [[ -f "$LOG" ]]; then
        # Look for FATAL ERROR or EXCEPTION in last 10 lines
        if tail -10 "$LOG" 2>/dev/null | grep -q "FATAL ERROR\|EXCEPTION:"; then
            HOOK_ERRORS=$((HOOK_ERRORS + 1))
            HOOK_NAME=$(basename "$LOG" .log)
            echo "   ⚠️  Errors found in $HOOK_NAME"
            echo "      Last error:"
            tail -10 "$LOG" | grep -A 2 "FATAL ERROR\|EXCEPTION:" | head -3 | sed 's/^/      /'
        fi
    fi
done

if [ $HOOK_ERRORS -eq 0 ]; then
    echo "   ✅ No hook errors detected"
else
    echo
    echo "   ⚠️  Found errors in $HOOK_ERRORS hook log(s)"
    echo "   Check logs: ls -la ~/.claude/debug/*.log"
fi

echo
echo "============================================================"
echo "✅ STARTUP CHECK PASSED"
echo "============================================================"
