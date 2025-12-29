#!/usr/bin/env python3
import os
import sys
from pathlib import Path
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.10/site-packages'))

from notion_client import Client

def load_notion_key():
    key_file = Path('.config/notion_key.txt')
    return key_file.read_text().strip()

def get_block_info(block):
    """Extract block type and text content"""
    block_type = block['type']

    if block_type in ['heading_1', 'heading_2', 'heading_3']:
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        is_toggleable = block[block_type].get('is_toggleable', False)
        return f"{block_type.upper()}{' (toggleable)' if is_toggleable else ''}: {text}"
    elif block_type == 'paragraph':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"paragraph: {text[:80]}"
    elif block_type == 'toggle':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"toggle: {text}"
    elif block_type == 'bulleted_list_item':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"bullet: {text[:60]}"
    else:
        return f"{block_type}"

def inspect_blocks(notion, block_id, indent=0, max_depth=4):
    """Recursively inspect blocks"""
    if indent > max_depth:
        return

    prefix = "  " * indent

    response = notion.blocks.children.list(block_id=block_id)
    blocks = response.get('results', [])

    for block in blocks:
        block_info = get_block_info(block)
        print(f"{prefix}└─ {block_info}")

        if block.get('has_children', False):
            inspect_blocks(notion, block['id'], indent + 1, max_depth)

def main():
    page_id = "2d8693f0-c6b4-8110-9e5a-fd0144b96f0b"
    notion = Client(auth=load_notion_key())

    page = notion.pages.retrieve(page_id=page_id)
    title = page['properties'].get('Name', {}).get('title', [{}])[0].get('plain_text', 'Unknown')

    print(f"Page: {title}")
    print("=" * 80)
    print("\nBlock Structure (first 4 levels):")
    print("-" * 80)

    inspect_blocks(notion, page_id, max_depth=4)

    print("\n" + "=" * 80)
    print("\nKey things to check:")
    print("✓ Are district headings toggleable with nested content?")
    print("✓ Are shop/location sections properly nested?")
    print("✓ Do toggle blocks have their children nested?")

if __name__ == '__main__':
    main()
