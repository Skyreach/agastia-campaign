#!/usr/bin/env python3
"""Identify duplicate entries in Notion database (SAFE - read only)"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path
from collections import defaultdict

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def find_duplicates(notion):
    """Find duplicate entries based on similar names"""
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

    # Group by normalized name
    name_groups = defaultdict(list)

    for entry in entries:
        try:
            name = entry['properties']['Name']['title'][0]['text']['content']
            entity_type = entry['properties']['Type']['select']['name']
            page_id = entry['id']

            # Normalize name (remove quotes, lowercase for comparison)
            normalized = name.lower().replace('"', '').replace("'", "")

            name_groups[normalized].append({
                'original_name': name,
                'type': entity_type,
                'page_id': page_id,
                'url': f"https://www.notion.so/{page_id.replace('-', '')}"
            })
        except (KeyError, TypeError, IndexError):
            pass

    # Find duplicates (groups with more than 1 entry)
    duplicates = {k: v for k, v in name_groups.items() if len(v) > 1}

    return duplicates

if __name__ == "__main__":
    print("=" * 60)
    print("Duplicate Detection (SAFE - Read Only)")
    print("=" * 60)
    print()

    notion = load_notion_client()
    duplicates = find_duplicates(notion)

    if not duplicates:
        print("✅ No duplicates found!")
    else:
        print(f"⚠️  Found {len(duplicates)} groups with duplicates:")
        print()

        for normalized_name, entries in sorted(duplicates.items()):
            print(f"Group: {normalized_name}")
            for idx, entry in enumerate(entries, 1):
                print(f"  {idx}. \"{entry['original_name']}\" (Type: {entry['type']})")
                print(f"     Page ID: {entry['page_id']}")
                print(f"     URL: {entry['url']}")
            print()

        print("=" * 60)
        print("Recommended Action:")
        print("=" * 60)
        print("1. Review each duplicate group above")
        print("2. Open both URLs to compare page content")
        print("3. Choose which one to KEEP (usually the one with proper name formatting)")
        print("4. Archive the other one (we'll create a safe script for this)")
        print()
        print("⚠️  DO NOT DELETE - We'll archive duplicates to a separate view first")
