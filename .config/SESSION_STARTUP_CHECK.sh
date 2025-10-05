#!/bin/bash
# SESSION STARTUP CHECK - Run this at the start of EVERY Claude session

echo "================================================"
echo "🔍 CAMPAIGN DATA INTEGRITY CHECK"
echo "================================================"
echo ""

# Check Notion sync script exists and is correct
if ! grep -q "File Path" sync_notion.py; then
    echo "❌ CRITICAL: sync_notion.py is using old schema!"
    echo "   Run: git checkout sync_notion.py"
    exit 1
fi

# Check protocol exists
if [ ! -f ".config/PROACTIVE_UPDATE_PROTOCOL.md" ]; then
    echo "❌ CRITICAL: Proactive update protocol missing!"
    exit 1
fi

# Test Notion connection
echo "Testing Notion connection..."
python3 -c "
from notion_client import Client
import sys
try:
    with open('.config/notion_key.txt', 'r') as f:
        notion = Client(auth=f.read().strip())
    with open('.config/database_id.txt', 'r') as f:
        db_id = f.read().strip()
    notion.databases.retrieve(database_id=db_id)
    print('✅ Notion connection verified')
except Exception as e:
    print(f'❌ Notion connection failed: {e}')
    sys.exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ CRITICAL: Cannot connect to Notion!"
    exit 1
fi

# Check for uncommitted changes
if git diff --name-only | grep -q '\.md$'; then
    echo "⚠️  WARNING: Uncommitted markdown files detected"
    echo "   These changes may not be synced to Notion:"
    git diff --name-only | grep '\.md$' | while read file; do
        echo "     - $file"
    done
    echo ""
fi

echo "================================================"
echo "✅ STARTUP CHECK PASSED"
echo "================================================"
echo ""
echo "REMINDER: After ANY file modification, run:"
echo "  python3 .config/auto_sync_wrapper.py <filepath>"
echo ""
