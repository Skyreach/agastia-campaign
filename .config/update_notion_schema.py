#!/usr/bin/env python3
"""Update Notion database schema to match NOTION_ARCHITECTURE.md"""

import sys


from notion_client import Client
from pathlib import Path

# Load API key
key_file = Path(__file__).parent / 'notion_key.txt'
key = key_file.read_text().strip()
notion = Client(auth=key)

# DB_ID loaded from notion_helpers

# Define complete schema according to NOTION_ARCHITECTURE.md
new_properties = {
    # Core Properties
    "Name": {"title": {}},  # Keep existing
    "Type": {
        "select": {
            "options": [
                {"name": "PC", "color": "blue"},
                {"name": "NPC", "color": "green"},
                {"name": "Faction", "color": "red"},
                {"name": "Location", "color": "yellow"},
                {"name": "Session", "color": "purple"},
                {"name": "Artifact", "color": "orange"},
                {"name": "Goal", "color": "pink"},
                {"name": "Campaign Doc", "color": "gray"}
            ]
        }
    },
    "Status": {
        "select": {
            "options": [
                {"name": "Active", "color": "green"},
                {"name": "Planning", "color": "yellow"},
                {"name": "Completed", "color": "blue"},
                {"name": "Destroyed", "color": "red"},
                {"name": "Unknown", "color": "gray"},
                {"name": "Pending", "color": "orange"}
            ]
        }
    },
    "Tags": {"multi_select": {}},  # Keep existing
    "Player Summary": {"rich_text": {}},  # NEW
    "DM Notes": {"rich_text": {}},  # NEW (consolidate from Secrets/Notes)
    "Version": {"rich_text": {}},  # NEW
    "File Path": {"rich_text": {}},  # NEW

    # Relationship Properties
    "Related Entities": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # NEW - bidirectional self-referencing
    "Parent Location": {"relation": {"database_id": DB_ID, "single_property": {}}},  # NEW - single location parent
    "Child Locations": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # NEW - bidirectional children

    # Type-Specific Properties
    "Player": {"rich_text": {}},  # For PCs
    "Class": {"rich_text": {}},  # For PCs
    "Level": {"number": {}},  # For PCs
    "Faction": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # For NPCs/Locations - relation
    "Location": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # For NPCs - relation
    "Threat Level": {
        "select": {
            "options": [
                {"name": "Low", "color": "green"},
                {"name": "Medium", "color": "yellow"},
                {"name": "High", "color": "orange"},
                {"name": "Extreme", "color": "red"},
                {"name": "Unknown", "color": "gray"}
            ]
        }
    },
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
                {"name": "Wilderness", "color": "brown"},
                {"name": "Pocket Dimension", "color": "pink"}
            ]
        }
    },
    "Session Number": {"number": {}},  # For Sessions
    "Date Played": {"date": {}},  # For Sessions
    "Goal Owner": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # For Goals
    "Goal Status": {
        "select": {
            "options": [
                {"name": "Active", "color": "green"},
                {"name": "Pending", "color": "yellow"},
                {"name": "Completed", "color": "blue"},
                {"name": "Failed", "color": "red"},
                {"name": "Abandoned", "color": "gray"}
            ]
        }
    },
    "Progress Clock": {"rich_text": {}},  # For Goals/Factions
    "Current Location": {"relation": {"database_id": DB_ID, "dual_property": {}}},  # For Artifacts
    "Seekers": {"relation": {"database_id": DB_ID, "dual_property": {}}}  # For Artifacts
}

print("🔧 Updating Notion database schema...")
print(f"Database ID: {DB_ID}")
print()

try:
    # Update the database with new properties
    notion.databases.update(
        database_id=DB_ID,
        properties=new_properties
    )

    print("✅ Database schema updated successfully!")
    print()
    print("New/Updated Properties:")
    print("  ✨ Player Summary (rich text)")
    print("  ✨ DM Notes (rich text)")
    print("  ✨ Version (rich text)")
    print("  ✨ File Path (rich text)")
    print("  ✨ Related Entities (relation - self-referencing)")
    print("  ✨ Parent Location (relation)")
    print("  ✨ Child Locations (relation)")
    print("  ✨ Faction (changed to relation)")
    print("  ✨ Location (changed to relation)")
    print("  ✨ All type-specific properties added")
    print()
    print("🎲 Ready for entity sync!")

except Exception as e:
    print(f"❌ Error updating schema: {e}")
    sys.exit(1)
