#!/usr/bin/env python3
"""
Fetch and inspect the structure of a Notion page to verify nesting issues
"""
import os
import sys
from pathlib import Path
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.10/site-packages'))

from notion_client import Client

def load_notion_key():
    key_file = Path('.config/notion_key.txt')
    return key_file.read_text().strip()

def get_block_type_and_text(block):
    """Extract block type and text content"""
    block_type = block['type']

    if block_type in ['heading_1', 'heading_2', 'heading_3']:
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        is_toggleable = block[block_type].get('is_toggleable', False)
        return f"{block_type.upper()}{' (toggleable)' if is_toggleable else ''}: {text}"
    elif block_type == 'paragraph':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"paragraph: {text[:80]}"
    elif block_type == 'code':
        language = block[block_type].get('language', 'unknown')
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"code ({language}): {len(text)} chars"
    elif block_type == 'bulleted_list_item':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"bullet: {text[:60]}"
    elif block_type == 'toggle':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"toggle: {text}"
    elif block_type == 'quote':
        text = ''.join([rt.get('plain_text', '') for rt in block[block_type].get('rich_text', [])])
        return f"quote: {text[:60]}"
    else:
        return f"{block_type}"

def inspect_blocks(notion, block_id, indent=0):
    """Recursively inspect blocks and their children"""
    prefix = "  " * indent

    # Fetch child blocks
    response = notion.blocks.children.list(block_id=block_id)
    blocks = response.get('results', [])

    for block in blocks:
        block_info = get_block_type_and_text(block)
        print(f"{prefix}└─ {block_info}")

        # Check if block has children
        if block.get('has_children', False):
            inspect_blocks(notion, block['id'], indent + 1)

def main():
    # Page ID from latest sync
    page_id = "2d8693f0-c6b4-8132-b56b-f4adf4e90243"

    notion = Client(auth=load_notion_key())

    # Get page info
    page = notion.pages.retrieve(page_id=page_id)
    title = page['properties'].get('Name', {}).get('title', [{}])[0].get('plain_text', 'Unknown')

    print(f"Page: {title}")
    print(f"=" * 80)
    print("\nBlock Structure:")
    print("-" * 80)

    inspect_blocks(notion, page_id)

    print("\n" + "=" * 80)
    print("\nIssues to look for:")
    print("1. Is the mermaid code block directly under 'Session Flowchart' heading?")
    print("2. Are 'Session Flow', 'Key NPCs', 'Important Items' nested under 'Quick Reference'?")
    print("3. Is content nested under headings like 'Travel to Agastia', 'TEMPERATE FORESTS'?")

if __name__ == '__main__':
    main()
