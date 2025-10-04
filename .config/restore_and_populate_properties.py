#!/usr/bin/env python3
"""Restore 4 properties and populate them from markdown files"""

import sys
import re
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path
import frontmatter

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'
CAMPAIGN_ROOT = Path('/mnt/c/dnd')

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def add_properties_to_schema(notion):
    """Add the 4 properties to database schema"""
    print("Step 1: Adding properties to database schema...")
    print()

    properties = {
        "Related Entities": {
            "relation": {
                "database_id": DB_ID,
                "dual_property": {}
            }
        },
        "Faction": {
            "relation": {
                "database_id": DB_ID,
                "dual_property": {}
            }
        },
        "Location": {
            "relation": {
                "database_id": DB_ID,
                "dual_property": {}
            }
        },
        "Player": {
            "rich_text": {}
        }
    }

    try:
        notion.databases.update(
            database_id=DB_ID,
            properties=properties
        )
        print("✅ Added properties to schema:")
        print("   - Related Entities (relation)")
        print("   - Faction (relation)")
        print("   - Location (relation)")
        print("   - Player (rich text)")
        print()
        return True
    except Exception as e:
        print(f"❌ Failed to add properties: {e}")
        return False

def find_page_by_name(notion, name):
    """Find a page by name (flexible matching)"""
    results = notion.databases.query(database_id=DB_ID)

    for page in results['results']:
        try:
            page_name = page['properties']['Name']['title'][0]['text']['content']
            if name.lower() in page_name.lower() or page_name.lower() in name.lower():
                return page['id']
        except (KeyError, TypeError, IndexError):
            pass
    return None

def populate_from_file(notion, file_path):
    """Populate properties for a single entity from its markdown file"""
    path = Path(file_path)
    if not path.exists():
        return False, f"File not found: {file_path}"

    try:
        with open(path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)

        entity_name = post.get('name', path.stem)

        # Find the page
        page_id = find_page_by_name(notion, entity_name)
        if not page_id:
            return False, f"Page not found in Notion: {entity_name}"

        # Build properties to update
        properties = {}

        # Player (text field)
        if post.get('player'):
            properties["Player"] = {
                "rich_text": [{"text": {"content": post['player']}}]
            }

        # Related Entities (relation)
        if post.get('related_entities'):
            related_ids = []
            for related_name in post['related_entities']:
                related_id = find_page_by_name(notion, related_name)
                if related_id:
                    related_ids.append({"id": related_id})

            if related_ids:
                properties["Related Entities"] = related_ids

        # Faction (relation)
        if post.get('faction'):
            faction_id = find_page_by_name(notion, post['faction'])
            if faction_id:
                properties["Faction"] = [{"id": faction_id}]

        # Location (relation)
        if post.get('location'):
            location_id = find_page_by_name(notion, post['location'])
            if location_id:
                properties["Location"] = [{"id": location_id}]

        # Update the page
        if properties:
            notion.pages.update(page_id=page_id, properties=properties)
            return True, f"✅ {entity_name} - Updated {len(properties)} properties"
        else:
            return True, f"⏭️  {entity_name} - No properties to update"

    except Exception as e:
        return False, f"❌ Error processing {file_path}: {str(e)[:100]}"

def populate_all_entities(notion):
    """Populate all entity files"""
    print("Step 2: Populating properties from markdown files...")
    print()

    files = [
        # PCs
        'Player_Characters/PC_Manny.md',
        'Player_Characters/PC_Nikki.md',
        'Player_Characters/PC_Ian_Rakash.md',
        'Player_Characters/PC_Kyle_Nameless.md',
        'Player_Characters/PC_Josh.md',

        # NPCs
        'NPCs/Major_NPCs/Professor_Zero.md',
        'NPCs/Major_NPCs/Steel_Dragon.md',
        'NPCs/Major_NPCs/The_Patron.md',

        # Factions
        'Factions/Faction_Chaos_Cult.md',
        'Factions/Faction_Merit_Council.md',
        'Factions/Faction_Dispossessed.md',
        'Factions/Faction_Decimate_Project.md',

        # Locations
        'Locations/Regions/Agastia_Region.md',
        'Locations/Cities/Agastia_City.md',
        'Locations/Districts/Scholar_Quarter.md',
        'Locations/Districts/Merchant_District.md',
        'Locations/Districts/Government_Complex.md',
        'Locations/Towns/Meridians_Rest.md',
        'Locations/Wilderness/Infinite_Forest.md',
        'Locations/Wilderness/Ratterdan_Ruins.md',

        # Sessions
        'Sessions/Session_0_Character_Creation.md',
        'Sessions/Session_1_Caravan_to_Ratterdan.md',

        # Campaign Core
        'Campaign_Core/Campaign_Overview.md',
        'Campaign_Core/Giant_Axe_Artifact.md',
        'Campaign_Core/The_Codex.md',
    ]

    results = {'success': 0, 'skipped': 0, 'failed': 0}

    for file_path in files:
        full_path = CAMPAIGN_ROOT / file_path
        success, message = populate_from_file(notion, full_path)
        print(message)

        if success:
            if 'Updated' in message:
                results['success'] += 1
            else:
                results['skipped'] += 1
        else:
            results['failed'] += 1

    return results

if __name__ == "__main__":
    print("=" * 60)
    print("Restore and Populate Properties")
    print("=" * 60)
    print()

    notion = load_notion_client()

    # Step 1: Add properties to schema
    if not add_properties_to_schema(notion):
        print("Failed to add properties. Exiting.")
        sys.exit(1)

    # Step 2: Populate from files
    results = populate_all_entities(notion)

    print()
    print("=" * 60)
    print(f"✅ Updated: {results['success']}")
    print(f"⏭️  Skipped: {results['skipped']}")
    print(f"❌ Failed: {results['failed']}")
    print("=" * 60)
