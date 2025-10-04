#!/usr/bin/env python3
"""Verify all campaign entities are synced to Notion"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def get_all_database_entries(notion):
    """Retrieve all entries from the database"""
    entries = []
    has_more = True
    start_cursor = None

    while has_more:
        response = notion.databases.query(
            database_id=DB_ID,
            start_cursor=start_cursor
        )
        entries.extend(response['results'])
        has_more = response['has_more']
        start_cursor = response.get('next_cursor')

    return entries

def count_by_type(entries):
    """Count entries by type"""
    type_counts = {}
    for entry in entries:
        try:
            entry_type = entry['properties']['Type']['select']['name']
            type_counts[entry_type] = type_counts.get(entry_type, 0) + 1
        except (KeyError, TypeError):
            type_counts['Unknown'] = type_counts.get('Unknown', 0) + 1

    return type_counts

def list_entities_by_type(entries):
    """Organize entities by type"""
    entities_by_type = {}
    for entry in entries:
        try:
            entry_type = entry['properties']['Type']['select']['name']
            name = entry['properties']['Name']['title'][0]['text']['content']

            if entry_type not in entities_by_type:
                entities_by_type[entry_type] = []

            entities_by_type[entry_type].append(name)
        except (KeyError, TypeError, IndexError):
            pass

    return entities_by_type

def verify_expected_entities():
    """Check that expected entities exist"""
    expected = {
        'PC': ['Monomi "Manny"', 'Biago "Nikki"', 'Rakash "Ian"', 'Nameless "Kyle"', 'Unknown "Josh"'],
        'NPC': ['Professor Zero', 'Steel Dragon', 'The Patron'],
        'Faction': ['Chaos Cult', 'Merit Council', 'The Dispossessed', 'Decimate Project'],
        'Location': ['Agastia Region', 'Agastia', 'Scholar Quarter', 'Merchant District',
                    'Government Complex', "Meridian's Rest", 'Infinite Forest', 'Ratterdan'],
        'Artifact': ['The Dominion Evolution Codex', "Giant's Axe"],
        'Session': ['Session 0', 'Session 1']
    }

    return expected

if __name__ == "__main__":
    print("=" * 60)
    print("Notion Database Verification")
    print("=" * 60)
    print()

    notion = load_notion_client()

    print("📊 Fetching all database entries...")
    entries = get_all_database_entries(notion)
    print(f"✅ Found {len(entries)} total entries")
    print()

    print("📈 Count by Type:")
    type_counts = count_by_type(entries)
    for entity_type, count in sorted(type_counts.items()):
        print(f"  {entity_type}: {count}")
    print()

    print("📋 Entities by Type:")
    entities_by_type = list_entities_by_type(entries)
    for entity_type, names in sorted(entities_by_type.items()):
        print(f"\n  {entity_type} ({len(names)}):")
        for name in sorted(names):
            print(f"    - {name}")

    print()
    print("=" * 60)
    print("Expected Entity Checklist")
    print("=" * 60)

    expected = verify_expected_entities()
    all_found = True

    for entity_type, expected_names in expected.items():
        print(f"\n{entity_type}:")
        actual_names = entities_by_type.get(entity_type, [])

        for name in expected_names:
            # Flexible matching (allow partial matches)
            found = any(name.lower() in actual.lower() or actual.lower() in name.lower()
                       for actual in actual_names)
            status = "✅" if found else "❌"
            print(f"  {status} {name}")
            if not found:
                all_found = False

    print()
    print("=" * 60)
    if all_found:
        print("✅ All expected entities are synced to Notion!")
    else:
        print("⚠️  Some expected entities are missing. Run safe_resync_all.sh")
    print("=" * 60)
