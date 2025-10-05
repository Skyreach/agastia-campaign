#!/usr/bin/env python3
"""Get Notion page links for all entities"""

import sys
import json
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def get_all_entity_links(notion):
    """Get all entity names and their Notion page links"""
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

    # Build entity map
    entity_links = {}

    for entry in entries:
        try:
            name = entry['properties']['Name']['title'][0]['text']['content']
            entity_type = entry['properties']['Type']['select']['name']
            page_id = entry['id'].replace('-', '')
            url = f"https://www.notion.so/{page_id}"

            if entity_type not in entity_links:
                entity_links[entity_type] = []

            entity_links[entity_type].append({
                'name': name,
                'url': url,
                'page_id': entry['id']
            })
        except (KeyError, TypeError, IndexError):
            pass

    return entity_links

if __name__ == "__main__":
    notion = load_notion_client()

    if len(sys.argv) > 1 and sys.argv[1] == '--json':
        # Output as JSON for MCP
        entity_links = get_all_entity_links(notion)
        print(json.dumps(entity_links, indent=2))
    else:
        # Human-readable output
        print("=" * 60)
        print("Notion Entity Page Links")
        print("=" * 60)
        print()

        entity_links = get_all_entity_links(notion)

        for entity_type, entities in sorted(entity_links.items()):
            print(f"\n{entity_type} ({len(entities)}):")
            for entity in sorted(entities, key=lambda x: x['name']):
                print(f"  • {entity['name']}")
                print(f"    {entity['url']}")
