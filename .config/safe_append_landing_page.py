#!/usr/bin/env python3
"""Safely APPEND content to Agastia Campaign landing page (NO DELETIONS)"""

import sys


from notion_client import Client
from pathlib import Path

LANDING_PAGE_ID = '281693f0c6b480b8b3dbfdfb2ea94997'
# DB_ID loaded from notion_helpers

# load_notion_client() now imported from notion_helpers

def create_heading_block(text, level=2):
    """Create a heading block"""
    heading_type = f"heading_{level}"
    return {
        "type": heading_type,
        heading_type: {
            "rich_text": [{"type": "text", "text": {"content": text}}]
        }
    }

def create_paragraph_block(text):
    """Create a paragraph block"""
    return {
        "type": "paragraph",
        "paragraph": {
            "rich_text": [{"type": "text", "text": {"content": text}}]
        }
    }

def create_divider_block():
    """Create a divider block"""
    return {"type": "divider", "divider": {}}

def create_callout_block(emoji, text):
    """Create a callout block"""
    return {
        "type": "callout",
        "callout": {
            "icon": {"type": "emoji", "emoji": emoji},
            "rich_text": [{"type": "text", "text": {"content": text}}]
        }
    }

def safe_append_navigation_structure(notion):
    """SAFELY APPEND navigation structure to landing page (NO DELETIONS)"""

    print("🛡️  SAFE MODE: Appending content only (NO deletions)")
    print(f"📄 Target page: {LANDING_PAGE_ID}")
    print()

    # Build blocks to append
    blocks = [
        create_divider_block(),
        create_heading_block("🗺️ Campaign Navigation", 2),
        create_callout_block(
            "ℹ️",
            "All campaign entities are in the D&D Campaign Entities database. Use the linked views below to filter by type."
        ),

        create_divider_block(),
        create_heading_block("📅 Session Hub", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = Session"),

        create_heading_block("🎭 Party Tracker", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = PC"),

        create_heading_block("🎯 Active Goals Dashboard", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Tags contains 'goal' OR Progress Clock is not empty"),

        create_heading_block("🗺️ Location Guide", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = Location, grouped by Location Type"),

        create_heading_block("👥 NPC Directory", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = NPC, grouped by Faction"),

        create_heading_block("⚔️ Faction Web", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = Faction"),

        create_heading_block("🔍 Quest Threads", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Tags (codex, ratterdan, steel-dragon, etc.)"),

        create_heading_block("📜 Artifacts & Mysteries", 3),
        create_paragraph_block("→ Create a linked database view here filtered by Type = Artifact OR Type = Campaign Doc"),

        create_divider_block(),
        create_callout_block(
            "📖",
            "To create linked database views: Type /linked → Select 'Create linked database' → Choose 'D&D Campaign Entities' → Apply filters as shown above"
        )
    ]

    print(f"📝 Prepared {len(blocks)} blocks to append")
    print()

    # SAFE: Only APPEND blocks, never delete
    try:
        notion.blocks.children.append(
            block_id=LANDING_PAGE_ID,
            children=blocks
        )
        print("✅ Successfully appended navigation structure!")
        print()
        print("Next steps:")
        print("1. Open Agastia Campaign page in Notion")
        print("2. Manually create linked database views following the placeholders")
        print("3. See .config/NOTION_SETUP_GUIDE.md for detailed filter instructions")
        return True
    except Exception as e:
        print(f"❌ Failed to append content: {e}")
        print()
        print("This is a SAFE operation that only appends content.")
        print("No data was deleted or modified.")
        return False

if __name__ == "__main__":
    notion = load_notion_client()

    print("=" * 60)
    print("SAFE APPEND MODE - Agastia Campaign Landing Page")
    print("=" * 60)
    print()

    success = safe_append_navigation_structure(notion)
    sys.exit(0 if success else 1)
