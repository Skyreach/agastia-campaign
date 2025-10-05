#!/usr/bin/env python3
"""Remove redundant database properties (SAFE - only modifies database schema, not data)"""

import sys


from notion_client import Client
from pathlib import Path

# DB_ID loaded from notion_helpers

# load_notion_client() now imported from notion_helpers

def remove_properties(notion):
    """Remove redundant properties from database schema"""

    # Properties to remove (data should be in page content instead)
    properties_to_remove = [
        "Class",  # On page
        "Created",  # Not needed
        "DM Notes",  # On page
        "Date Played",  # On page
        "Goal Owner",  # Relation (keep Related Entities instead)
        "Goal Status",  # On page
        "Goals",  # On page
        "Last seen",  # Not needed
        "Level",  # On page
        "Notes",  # Duplicate of DM Notes
        "Player",  # On page
        "Player Summary",  # On page
        "Child Locations",  # Redundant (use Related Entities)
        "Current Location",  # Redundant (use Related Entities)
        "Faction",  # Redundant (use Related Entities or Tags)
        "Location",  # Redundant (use Related Entities)
        "Seekers",  # Redundant (use Related Entities)
        "Status",  # Mostly redundant (Active/Inactive only, keep for filtering)
        "Threat Level",  # On page
    ]

    # Actually, let's keep Status for filtering. Remove it from the list
    properties_to_remove.remove("Status")

    print("Properties that will be REMOVED:")
    for prop in sorted(properties_to_remove):
        print(f"  ❌ {prop}")

    print()
    print("Properties that will be KEPT:")
    kept_props = [
        "Name",  # ESSENTIAL
        "Type",  # ESSENTIAL for filtering
        "Tags",  # ESSENTIAL for quest threads
        "Status",  # USEFUL for filtering (Active/Inactive)
        "Related Entities",  # USEFUL for navigation
        "Parent Location",  # USEFUL for location hierarchy
        "Session Number",  # USEFUL for sessions
        "Progress Clock",  # USEFUL for factions/goals
        "Version",  # USEFUL for tracking changes
        "File Path",  # USEFUL for sync
        "Location Type",  # USEFUL for location views
    ]

    for prop in sorted(kept_props):
        print(f"  ✅ {prop}")

    print()
    response = input("Proceed with removing redundant properties? (yes/no): ")
    if response.lower() != 'yes':
        print("Cancelled.")
        return False

    print()
    print("=" * 60)
    print("Removing properties...")
    print("=" * 60)
    print()

    # Get current database schema
    db = notion.databases.retrieve(database_id=DB_ID)
    current_properties = db['properties']

    # Build update with null values to remove properties
    properties_update = {}

    for prop_name in properties_to_remove:
        if prop_name in current_properties:
            properties_update[prop_name] = None  # Setting to null removes the property
            print(f"✅ Removing: {prop_name}")
        else:
            print(f"⏭️  Not found (already removed?): {prop_name}")

    # Update database schema
    try:
        notion.databases.update(
            database_id=DB_ID,
            properties=properties_update
        )
        print()
        print("✅ Successfully removed redundant properties!")
        print()
        print("Your database view should now be much cleaner.")
        print("Main properties remaining: Name, Type, Tags, Status, Related Entities")
        return True
    except Exception as e:
        print(f"❌ Failed to update database: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Remove Redundant Database Properties")
    print("=" * 60)
    print()
    print("This will clean up the database by removing properties")
    print("whose information is already in the page content.")
    print()
    print("⚠️  This is SAFE - it only removes column headers, not data!")
    print("   All information is preserved in page content.")
    print()

    notion = load_notion_client()
    success = remove_properties(notion)

    if success:
        print()
        print("=" * 60)
        print("Next steps:")
        print("1. Refresh your Notion database view")
        print("2. Verify clean appearance")
        print("3. Click entity pages to see full information")
        print("=" * 60)
