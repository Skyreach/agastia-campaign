#!/bin/bash
# Session Startup Check - Verifies environment and sync status
# This script MUST pass before starting any session work

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CAMPAIGN_ROOT="$(dirname "$SCRIPT_DIR")"

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

echo
echo "============================================================"
echo "✅ STARTUP CHECK PASSED"
echo "============================================================"
