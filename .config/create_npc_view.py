#!/usr/bin/env python3
"""Create a filtered NPC view on the landing page (SAFE - only modifies landing page)"""

import sys


from notion_client import Client
from pathlib import Path

LANDING_PAGE_ID = '281693f0c6b480b8b3dbfdfb2ea94997'
# DB_ID loaded from notion_helpers

# load_notion_client() now imported from notion_helpers

def create_npc_linked_view(notion):
    """Create a linked database view filtered to NPCs with only Name and Tags columns"""

    print("Creating NPC view on landing page...")
    print(f"Landing Page: {LANDING_PAGE_ID}")
    print(f"Database: {DB_ID}")
    print()

    try:
        # Create a linked database block
        new_block = {
            "type": "linked_database",
            "linked_database": {
                "database_id": DB_ID
            }
        }

        # Append to landing page
        result = notion.blocks.children.append(
            block_id=LANDING_PAGE_ID,
            children=[new_block]
        )

        print(f"✅ Created linked database view!")
        print(f"   Block ID: {result['results'][0]['id']}")
        print()
        print("⚠️  NOTE: Notion API doesn't support setting filters/hidden columns via API")
        print("   You'll need to manually:")
        print("   1. Open the landing page in Notion")
        print("   2. Find the new database view at the bottom")
        print("   3. Click 'Filter' → Add filter: Type is NPC")
        print("   4. Click 'Properties' → Hide all except Name and Tags")
        print()

        return True

    except Exception as e:
        print(f"❌ Failed to create view: {e}")
        print()
        print("Error details:")
        print(f"   {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Create NPC Filtered View (Test)")
    print("=" * 60)
    print()

    notion = load_notion_client()
    success = create_npc_linked_view(notion)

    if success:
        print("=" * 60)
        print("Next: Open landing page and configure the view manually")
        print("=" * 60)
