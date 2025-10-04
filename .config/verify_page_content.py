#!/usr/bin/env python3
"""Verify that page content contains all info before removing database properties"""

import sys
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def check_page_has_content(notion, page_id, page_name):
    """Check if a page has content blocks"""
    try:
        blocks = notion.blocks.children.list(block_id=page_id)
        block_count = len(blocks['results'])

        # Check for specific content types
        has_headings = any(b['type'].startswith('heading') for b in blocks['results'])
        has_paragraphs = any(b['type'] == 'paragraph' for b in blocks['results'])
        has_lists = any(b['type'] in ['bulleted_list_item', 'numbered_list_item'] for b in blocks['results'])

        return {
            'name': page_name,
            'block_count': block_count,
            'has_content': block_count > 0,
            'has_headings': has_headings,
            'has_paragraphs': has_paragraphs,
            'has_lists': has_lists
        }
    except Exception as e:
        return {
            'name': page_name,
            'block_count': 0,
            'has_content': False,
            'error': str(e)
        }

def verify_all_pages(notion):
    """Check all pages in database have content"""
    results = notion.databases.query(database_id=DB_ID)

    pages_with_content = 0
    pages_without_content = []

    print("Checking page content for all entities...")
    print()

    for page in results['results']:
        try:
            name = page['properties']['Name']['title'][0]['text']['content']
            page_id = page['id']
            entity_type = page['properties']['Type']['select']['name']

            info = check_page_has_content(notion, page_id, name)

            if info['has_content']:
                pages_with_content += 1
                print(f"✅ {name} ({entity_type}): {info['block_count']} blocks")
            else:
                pages_without_content.append(name)
                print(f"⚠️  {name} ({entity_type}): NO CONTENT")

        except (KeyError, TypeError, IndexError) as e:
            print(f"❌ Error reading page: {e}")

    return pages_with_content, pages_without_content

if __name__ == "__main__":
    print("=" * 60)
    print("Verify Page Content Before Removing Properties")
    print("=" * 60)
    print()

    notion = load_notion_client()
    pages_with_content, pages_without_content = verify_all_pages(notion)

    print()
    print("=" * 60)
    print(f"✅ Pages with content: {pages_with_content}")
    print(f"⚠️  Pages without content: {len(pages_without_content)}")

    if pages_without_content:
        print()
        print("Pages missing content:")
        for name in pages_without_content:
            print(f"  - {name}")

    print()
    print("=" * 60)

    if pages_without_content:
        print("⚠️  Some pages are missing content!")
        print("   We should populate these before removing properties.")
    else:
        print("✅ All pages have content - safe to remove redundant properties!")
