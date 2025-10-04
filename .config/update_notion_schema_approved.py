#!/usr/bin/env python3
"""Update Notion database schema to APPROVED properties only (16 total)"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

# Load API key
key_file = Path('/mnt/c/dnd/.config/notion_key.txt')
key = key_file.read_text().strip()
notion = Client(auth=key)

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

# APPROVED SCHEMA - 16 properties total
approved_properties = {
    # Core Properties
    "Name": {"title": {}},
    "Tags": {"multi_select": {}},
    "Status": {
        "select": {
            "options": [
                {"name": "Active", "color": "green"},
                {"name": "Inactive", "color": "gray"},
                {"name": "Planning", "color": "yellow"},
                {"name": "Completed", "color": "blue"},
                {"name": "Destroyed", "color": "red"},
                {"name": "Unknown", "color": "gray"}
            ]
        }
    },

    # Navigation Properties (IMPORTANT: Use single_property for non-bidirectional)
    "Related Entities": {
        "relation": {
            "database_id": DB_ID
            # NO dual_property - prevents auto-creating nested props
        }
    },
    "Faction": {
        "relation": {
            "database_id": DB_ID
        }
    },
    "Location": {
        "relation": {
            "database_id": DB_ID
        }
    },
    "Parent Location": {
        "relation": {
            "database_id": DB_ID,
            "single_property": {}
        }
    },

    # Utility Properties
    "Player": {"rich_text": {}},
    "Session Number": {"number": {}},
    "Progress Clock": {"rich_text": {}},
    "File Path": {"rich_text": {}},
    "Version": {"rich_text": {}},
    "Location Type": {
        "select": {
            "options": [
                {"name": "Continent", "color": "purple"},
                {"name": "Region", "color": "blue"},
                {"name": "City", "color": "green"},
                {"name": "Town", "color": "green"},
                {"name": "Ward", "color": "yellow"},
                {"name": "District", "color": "yellow"},
                {"name": "Building", "color": "orange"},
                {"name": "Dungeon", "color": "red"},
                {"name": "Wilderness", "color": "brown"}
            ]
        }
    },

    # Optional Properties
    "Relations": {"rich_text": {}},
    "Secrets": {"rich_text": {}},
    "Last Seen": {"date": {}}
}

print("🔧 Updating Notion database to APPROVED schema...")
print(f"Database ID: {DB_ID}")
print()
print("Approved Properties (16 total):")
for prop_name in sorted(approved_properties.keys()):
    print(f"  ✅ {prop_name}")
print()

try:
    # Update the database with approved properties
    notion.databases.update(
        database_id=DB_ID,
        properties=approved_properties
    )

    print("✅ Database schema updated successfully!")
    print()
    print("⚠️  This does NOT remove existing properties.")
    print("   Manually delete unwanted properties in Notion UI if needed.")
    print()
    print("Properties that should NOT exist:")
    print("  ❌ Type (inferred from Tags)")
    print("  ❌ Class, Level, Threat Level (on pages)")
    print("  ❌ Player Summary, DM Notes (on pages)")
    print("  ❌ Any 'Related to D&D Campaign Entities (...)' nested props")

except Exception as e:
    print(f"❌ Error updating schema: {e}")
    sys.exit(1)
