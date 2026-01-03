#!/usr/bin/env python3
"""
Cache Notion block IDs for H3 sections in reference documents.

This script fetches all H3 heading blocks from specified Notion pages
and caches their block IDs so we can create direct block links in wikilinks.

Usage:
    python3 cache_notion_blocks.py <page_name>
    python3 cache_notion_blocks.py "Inspiring Encounter Tables"
    python3 cache_notion_blocks.py --all  # Cache all known reference pages
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone
from notion_client import Client

# Configuration
CACHE_FILE = Path(__file__).parent / 'notion_block_cache.json'
API_KEY_FILE = Path(__file__).parent / 'notion_key.txt'
DATABASE_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

# Reference pages to cache (can be extended)
REFERENCE_PAGES = [
    'Inspiring Encounter Tables'
]


def load_cache():
    """Load existing cache or create new one."""
    if CACHE_FILE.exists():
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    return {
        'version': '1.0.0',
        'last_updated': None,
        'pages': {}
    }


def save_cache(cache):
    """Save cache to file."""
    cache['last_updated'] = datetime.now(timezone.utc).isoformat()
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)


def get_all_blocks(client, block_id, depth=0, max_depth=5):
    """Recursively fetch all blocks from a page."""
    if depth > max_depth:
        return []

    try:
        blocks = client.blocks.children.list(block_id=block_id)
        all_blocks = []
        for block in blocks['results']:
            all_blocks.append((depth, block))
            if block.get('has_children'):
                children = get_all_blocks(client, block['id'], depth + 1, max_depth)
                all_blocks.extend(children)
        return all_blocks
    except Exception as e:
        print(f"Error fetching blocks at depth {depth}: {e}")
        return []


def cache_page_blocks(client, page_name):
    """Cache all H3 blocks for a specific page."""
    print(f"\n📄 Caching blocks for: {page_name}")

    # Search for page
    results = client.databases.query(
        database_id=DATABASE_ID,
        filter={'property': 'Name', 'title': {'contains': page_name}}
    )

    if not results['results']:
        print(f"❌ Page not found: {page_name}")
        return None

    # Find exact match
    page_id = None
    actual_name = None
    for result in results['results']:
        result_name = result['properties']['Name']['title'][0]['plain_text']
        if result_name == page_name or page_name in result_name:
            page_id = result['id']
            actual_name = result_name
            break

    if not page_id:
        print(f"❌ No exact match found for: {page_name}")
        return None

    print(f"✅ Found page: {actual_name}")
    print(f"   Page ID: {page_id}")

    # Fetch all blocks
    print("   Fetching blocks...")
    all_blocks = get_all_blocks(client, page_id)

    # Extract H3 headings
    h3_blocks = {}
    for depth, block in all_blocks:
        if block['type'] == 'heading_3':
            rich_text = block['heading_3'].get('rich_text', [])
            heading_text = ''.join([t['plain_text'] for t in rich_text])
            block_id = block['id']

            h3_blocks[heading_text] = {
                'block_id': block_id,
                'depth': depth,
                'url': f"https://notion.so/{page_id.replace('-', '')}#{block_id.replace('-', '')}"
            }

    print(f"   Found {len(h3_blocks)} H3 sections")

    # Show first 5
    if h3_blocks:
        print("   Sample sections:")
        for i, (name, data) in enumerate(list(h3_blocks.items())[:5]):
            print(f"     - {name}")
            if i >= 4:
                break

    return {
        'page_id': page_id,
        'page_name': actual_name,
        'cached_at': datetime.now(timezone.utc).isoformat(),
        'h3_blocks': h3_blocks
    }


def main():
    """Main execution."""
    if len(sys.argv) < 2:
        print("Usage: python3 cache_notion_blocks.py <page_name>")
        print("       python3 cache_notion_blocks.py --all")
        sys.exit(1)

    # Read API key
    with open(API_KEY_FILE, 'r') as f:
        api_key = f.read().strip()

    client = Client(auth=api_key)

    # Load existing cache
    cache = load_cache()

    # Determine pages to cache
    if sys.argv[1] == '--all':
        pages_to_cache = REFERENCE_PAGES
    else:
        pages_to_cache = [' '.join(sys.argv[1:])]

    print(f"🔄 Caching {len(pages_to_cache)} page(s)...")

    # Cache each page
    for page_name in pages_to_cache:
        page_data = cache_page_blocks(client, page_name)
        if page_data:
            cache['pages'][page_data['page_name']] = page_data

    # Save cache
    save_cache(cache)
    print(f"\n💾 Cache saved to: {CACHE_FILE}")
    print(f"   Total pages cached: {len(cache['pages'])}")


if __name__ == '__main__':
    main()
