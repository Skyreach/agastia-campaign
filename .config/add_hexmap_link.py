#!/usr/bin/env python3
"""Add hex map editor link to Notion landing page under Campaign Navigation"""

import sys
sys.path.insert(0, '/mnt/c/dnd/.config')
from notion_helpers import load_notion_client

LANDING_PAGE_ID = '281693f0c6b480b8b3dbfdfb2ea94997'
HEX_MAP_URL = 'https://skyreach.github.io/agastia-campaign/tools/hex-map-editor/'

def create_bookmark_block(url, caption=None):
    """Create a bookmark block (rich link preview)"""
    block = {
        "type": "bookmark",
        "bookmark": {
            "url": url
        }
    }
    if caption:
        block["bookmark"]["caption"] = [{"type": "text", "text": {"content": caption}}]
    return block

def create_paragraph_with_link(text, url):
    """Create paragraph with embedded link"""
    return {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [
                {"type": "text", "text": {"content": text, "link": {"url": url}}}
            ]
        }
    }

def add_hexmap_link(notion):
    """Add hex map editor link to Campaign Navigation section"""

    print("🗺️  Adding Hex Map Editor link to Notion landing page")
    print(f"📄 Page ID: {LANDING_PAGE_ID}")
    print(f"🔗 URL: {HEX_MAP_URL}")
    print()

    # Create blocks to append
    blocks = [
        create_paragraph_with_link(
            "🗺️ Hex Map Editor - Interactive world/regional map creator",
            HEX_MAP_URL
        )
    ]

    try:
        notion.blocks.children.append(
            block_id=LANDING_PAGE_ID,
            children=blocks
        )
        print("✅ Successfully added Hex Map Editor link!")
        print()
        print("The link has been added to the Campaign Navigation section.")
        print(f"Visit: https://www.notion.so/{LANDING_PAGE_ID.replace('-', '')}")
        return True
    except Exception as e:
        print(f"❌ Failed to add link: {e}")
        return False

if __name__ == "__main__":
    notion = load_notion_client()

    print("=" * 60)
    print("Add Hex Map Editor Link - Agastia Campaign")
    print("=" * 60)
    print()

    success = add_hexmap_link(notion)
    sys.exit(0 if success else 1)
