#!/usr/bin/env python3
"""Archive duplicate PC entries by changing their status (SAFE - no deletions)"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def find_page_by_exact_name(notion, name):
    """Find a page by exact name match"""
    results = notion.databases.query(
        database_id=DB_ID,
        filter={"property": "Name", "title": {"equals": name}}
    )
    return results['results'][0] if results['results'] else None

def archive_duplicate(notion, page_id, name):
    """Archive a duplicate by setting its status to 'Archived'"""
    try:
        # First, check if 'Archived' status exists in the schema
        db = notion.databases.retrieve(database_id=DB_ID)
        status_options = db['properties']['Status']['select']['options']

        # Add 'Archived' option if it doesn't exist
        has_archived = any(opt['name'] == 'Archived' for opt in status_options)

        if not has_archived:
            print(f"⚠️  'Archived' status doesn't exist. Using 'Inactive' instead.")
            status_name = 'Inactive'
        else:
            status_name = 'Archived'

        # Update the page status
        notion.pages.update(
            page_id=page_id,
            properties={
                "Status": {"select": {"name": status_name}}
            }
        )
        return True, f"✅ Archived: {name} (Status → {status_name})"
    except Exception as e:
        return False, f"❌ Failed to archive {name}: {str(e)[:100]}"

if __name__ == "__main__":
    print("=" * 60)
    print("Archive Duplicate PC Entries (SAFE - No Deletions)")
    print("=" * 60)
    print()

    # Duplicates to archive (old format with parentheses)
    duplicates_to_archive = [
        "Biago (Nikki)",
        "Nameless (Kyle)",
        "Rakash (Ian)",
        "Manny",  # Keep "Monomi 'Manny'" as canonical
        "Josh's Sorcerer"  # Keep "Unknown 'Josh'" as canonical
    ]

    # Canonical versions to keep
    canonical_versions = [
        "Biago \"Nikki\"",
        "Nameless \"Kyle\"",
        "Rakash \"Ian\"",
        "Monomi \"Manny\"",
        "Unknown \"Josh\""
    ]

    print("Duplicates to archive:")
    for name in duplicates_to_archive:
        print(f"  - {name}")
    print()

    print("Canonical versions to keep:")
    for name in canonical_versions:
        print(f"  ✅ {name}")
    print()

    response = input("Proceed with archiving? (yes/no): ")
    if response.lower() != 'yes':
        print("Cancelled.")
        sys.exit(0)

    print()
    print("=" * 60)
    print("Archiving duplicates...")
    print("=" * 60)
    print()

    notion = load_notion_client()

    for name in duplicates_to_archive:
        page = find_page_by_exact_name(notion, name)
        if page:
            success, message = archive_duplicate(notion, page['id'], name)
            print(message)
        else:
            print(f"⚠️  Not found: {name}")

    print()
    print("=" * 60)
    print("✅ Archiving complete!")
    print()
    print("Next steps:")
    print("1. Verify canonical versions still exist in database")
    print("2. Create a filtered view to hide archived entries")
    print("3. Duplicates can be permanently deleted later if needed")
