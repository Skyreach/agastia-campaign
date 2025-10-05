#!/usr/bin/env python3
"""Check Notion database details and provide direct link"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

if __name__ == "__main__":
    notion = load_notion_client()

    print("=" * 60)
    print("Notion Database Information")
    print("=" * 60)
    print()

    # Get database info
    db = notion.databases.retrieve(database_id=DB_ID)

    print(f"Database Title: {db['title'][0]['text']['content']}")
    print(f"Database ID: {DB_ID}")
    print()
    print("Direct URL:")
    print(f"https://www.notion.so/{DB_ID.replace('-', '')}")
    print()

    # Query all entries
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

    print(f"Total Entries via API: {len(entries)}")
    print()

    print("=" * 60)
    print("If you see fewer entries in Notion web UI:")
    print("=" * 60)
    print("1. Click on the database")
    print("2. Look for a 'Filter' button in the top-right")
    print("3. Click 'Filter' and check if any filters are active")
    print("4. Clear all filters to see all entries")
    print("5. Or create a new view: Click '+ New view' → 'Table' → Name it 'All Entities'")
    print()
