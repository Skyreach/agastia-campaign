#!/usr/bin/env python3
"""Remove properties EXACTLY as user specified"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

# EXACTLY what the user asked to remove
properties_to_remove = [
    # Content properties (should be on page)
    "Class",
    "Created",
    "DM Notes",
    "Date Played",
    "Goal Owner",
    "Goal Status",
    "Goals",
    "Last seen",
    "Level",
    "Notes",
    "Player",
    "Player Summary",

    # Nested relation properties (redundant to top-level Related Entities)
    "Related to D&D Campaign Entities (Child Locations)",
    "Related to D&D Campaign Entities (Current Location)",
    "Related to D&D Campaign Entities (Faction)",
    "Related to D&D Campaign Entities (Goal Owner)",
    "Related to D&D Campaign Entities (Location)",
    "Related to D&D Campaign Entities (Related Entities)",
    "Related to D&D Campaign Entities (Seekers)",

    # Duplicates
    "Child Locations",  # Keep Parent Location instead
    "Current Location",
    "Faction",
    "Location",
    "Seekers",

    # User specified
    "Status",
    "Threat level",
]

if __name__ == "__main__":
    print("=" * 60)
    print("Remove Properties - User Specified List")
    print("=" * 60)
    print()

    notion = load_notion_client()

    # Get current properties
    db = notion.databases.retrieve(database_id=DB_ID)
    current = set(db['properties'].keys())

    print("Properties that WILL BE REMOVED:")
    to_remove_actual = []
    for prop in sorted(properties_to_remove):
        # Match case-insensitive and handle "Last seen" vs "Last Seen"
        matched = None
        for curr_prop in current:
            if prop.lower() == curr_prop.lower():
                matched = curr_prop
                break

        if matched:
            to_remove_actual.append(matched)
            print(f"  ❌ {matched}")
        else:
            print(f"  ⏭️  {prop} (not found)")

    print()
    print("Properties that WILL BE KEPT:")
    will_keep = current - set(to_remove_actual)
    for prop in sorted(will_keep):
        print(f"  ✅ {prop}")

    print()
    print(f"Total to remove: {len(to_remove_actual)}")
    print(f"Total to keep: {len(will_keep)}")
    print()

    response = input("Proceed? (yes/no): ")
    if response.lower() != 'yes':
        print("Cancelled.")
        sys.exit(0)

    print()
    print("Removing properties...")

    properties_update = {prop: None for prop in to_remove_actual}

    try:
        notion.databases.update(
            database_id=DB_ID,
            properties=properties_update
        )
        print("✅ Successfully removed properties!")
    except Exception as e:
        print(f"❌ Error: {e}")
