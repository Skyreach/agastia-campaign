#!/bin/bash
# Fix hardcoded paths in all Python scripts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# List of files to fix
FILES=(
    "check_notion_database.py"
    "add_entity_relationships.py"
    "archive_duplicates.py"
    "create_npc_view.py"
    "identify_duplicates.py"
    "populate_notion_pages.py"
    "remove_properties_corrected.py"
    "remove_redundant_properties.py"
    "restore_and_populate_properties.py"
    "safe_append_landing_page.py"
    "update_notion_schema.py"
    "update_notion_schema_approved.py"
    "verify_notion_sync.py"
    "verify_page_content.py"
)

echo "Fixing hardcoded paths in ${#FILES[@]} Python scripts..."

for file in "${FILES[@]}"; do
    filepath="$SCRIPT_DIR/$file"

    if [[ ! -f "$filepath" ]]; then
        echo "⚠️  Skipping $file (not found)"
        continue
    fi

    echo "Processing $file..."

    # Create backup
    cp "$filepath" "$filepath.bak"

    # Fix hardcoded site-packages path
    sed -i "s|sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')||g" "$filepath"

    # Fix hardcoded notion key path
    sed -i "s|Path('/mnt/c/dnd/.config/notion_key.txt')|Path(__file__).parent / 'notion_key.txt'|g" "$filepath"

    # Add import for notion_helpers if not present and file uses notion
    if grep -q "from notion_client import Client" "$filepath"; then
        # Add helper import after other imports
        if ! grep -q "from notion_helpers import" "$filepath"; then
            # Find first import line and add after it
            sed -i "/^import sys/a\\from pathlib import Path\\nsys.path.insert(0, str(Path(__file__).parent))\\nfrom notion_helpers import load_notion_client, load_database_id, log_error, log_success" "$filepath"
        fi
    fi
done

echo "✅ Fixed hardcoded paths in all scripts"
echo "📦 Backups saved as *.bak"
