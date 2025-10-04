#!/usr/bin/env python3
"""Add entity relationships in Notion database (SAFE - only updates relations)"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def find_page_by_name(notion, name):
    """Find a page by name (case-insensitive partial match)"""
    results = notion.databases.query(database_id=DB_ID)

    for page in results['results']:
        try:
            page_name = page['properties']['Name']['title'][0]['text']['content']
            # Flexible matching
            if name.lower() in page_name.lower() or page_name.lower() in name.lower():
                return page['id']
        except (KeyError, TypeError, IndexError):
            pass

    return None

def add_relations(notion, entity_name, relation_property, related_entities):
    """Add relations to an entity"""
    page_id = find_page_by_name(notion, entity_name)

    if not page_id:
        return False, f"❌ Entity not found: {entity_name}"

    # Find all related entity IDs
    related_ids = []
    for related_name in related_entities:
        related_id = find_page_by_name(notion, related_name)
        if related_id:
            related_ids.append({"id": related_id})
        else:
            print(f"   ⚠️  Related entity not found: {related_name}")

    if not related_ids:
        return False, f"❌ No valid relations found for: {entity_name}"

    try:
        notion.pages.update(
            page_id=page_id,
            properties={
                relation_property: related_ids
            }
        )
        return True, f"✅ Added {len(related_ids)} relations to: {entity_name}"
    except Exception as e:
        return False, f"❌ Failed to add relations to {entity_name}: {str(e)[:100]}"

def add_all_relationships(notion):
    """Add all entity relationships based on campaign data"""

    relationships = [
        # PCs → Related Entities
        ("Monomi \"Manny\"", "Related Entities", ["Professor Zero", "Biago \"Nikki\"", "Nona", "The Dominion Evolution Codex"]),
        ("Biago \"Nikki\"", "Related Entities", ["Professor Zero", "Monomi \"Manny\"", "Nona", "The Dominion Evolution Codex"]),
        ("Rakash \"Ian\"", "Related Entities", ["Nameless \"Kyle\"", "Ratterdan", "Giant's Axe"]),
        ("Nameless \"Kyle\"", "Related Entities", ["Rakash \"Ian\"", "Ratterdan"]),
        ("Unknown \"Josh\"", "Related Entities", []),  # To be determined

        # NPCs → Faction
        ("Professor Zero", "Faction", ["Decimate Project"]),
        ("Steel Dragon", "Faction", ["Chaos Cult"]),
        ("Decum", "Faction", ["Decimate Project"]),
        ("Trinity", "Faction", ["Decimate Project"]),
        ("Octavia", "Faction", ["Decimate Project"]),
        ("Tetran", "Faction", ["Decimate Project"]),
        ("Quincy", "Faction", ["Decimate Project"]),
        ("Hexus", "Faction", ["Decimate Project"]),
        ("Septimus", "Faction", ["Decimate Project"]),
        ("Nona", "Faction", ["Decimate Project"]),

        # NPCs → Location
        ("Professor Zero", "Location", ["Agastia"]),
        ("Decum", "Location", ["Agastia"]),
        ("Trinity", "Location", ["Agastia"]),
        ("Octavia", "Location", ["Agastia"]),
        ("Tetran", "Location", ["Agastia"]),
        ("Quincy", "Location", ["Agastia"]),
        ("Hexus", "Location", ["Agastia"]),
        ("Septimus", "Location", ["Agastia"]),
        ("Nona", "Location", ["Agastia"]),

        # Locations → Parent Location
        ("Agastia", "Parent Location", ["Agastia Region"]),
        ("Scholar Quarter", "Parent Location", ["Agastia"]),
        ("Merchant District", "Parent Location", ["Agastia"]),
        ("Government Complex", "Parent Location", ["Agastia"]),
        ("Meridian's Rest", "Parent Location", ["Agastia Region"]),
        ("Infinite Forest", "Parent Location", ["Agastia Region"]),
        ("Ratterdan", "Parent Location", ["Infinite Forest"]),

        # Artifacts → Seekers
        ("The Dominion Evolution Codex", "Seekers", ["Professor Zero", "Monomi \"Manny\"", "Biago \"Nikki\""]),
        ("Giant's Axe", "Seekers", ["Rakash \"Ian\""]),

        # Sessions → Related Entities
        ("Session 0", "Related Entities", ["Monomi \"Manny\"", "Biago \"Nikki\"", "Rakash \"Ian\"", "Nameless \"Kyle\"", "Unknown \"Josh\"", "Professor Zero"]),
        ("Session 1", "Related Entities", ["Rakash \"Ian\"", "Nameless \"Kyle\"", "Ratterdan", "Giant's Axe", "The Patron"]),
    ]

    results = {'success': 0, 'failed': 0}

    for entity_name, relation_property, related_entities in relationships:
        if not related_entities:
            print(f"⏭️  Skipped (no relations): {entity_name}")
            continue

        success, message = add_relations(notion, entity_name, relation_property, related_entities)
        print(message)

        if success:
            results['success'] += 1
        else:
            results['failed'] += 1

    return results

if __name__ == "__main__":
    print("=" * 60)
    print("Add Entity Relationships (SAFE - Relations Only)")
    print("=" * 60)
    print()
    print("This will add bidirectional relationships between entities:")
    print("- PCs ↔ NPCs, Artifacts")
    print("- NPCs → Factions, Locations")
    print("- Locations → Parent-Child hierarchy")
    print("- Artifacts → Seekers")
    print("- Sessions → Relevant entities")
    print()

    response = input("Proceed with adding relationships? (yes/no): ")
    if response.lower() != 'yes':
        print("Cancelled.")
        sys.exit(0)

    print()
    print("=" * 60)
    print("Adding relationships...")
    print("=" * 60)
    print()

    notion = load_notion_client()
    results = add_all_relationships(notion)

    print()
    print("=" * 60)
    print(f"✅ Success: {results['success']}")
    print(f"❌ Failed: {results['failed']}")
    print("=" * 60)
    print()
    print("Relationships added! You can now:")
    print("1. Click on any entity in Notion")
    print("2. See its relations in the properties panel")
    print("3. Click related entities to navigate between pages")
