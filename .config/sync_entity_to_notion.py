#!/usr/bin/env python3
"""Sync individual campaign entity to Notion with proper schema"""

import sys
import re
from pathlib import Path

# Import helpers for path/client management
sys.path.insert(0, str(Path(__file__).parent))
from notion_helpers import load_notion_client, load_database_id, log_error, log_success, log_warning

# Dynamically load dependencies
try:
    import frontmatter
except ImportError:
    import site
    sys.path.insert(0, site.getusersitepackages())
    import frontmatter

DB_ID = load_database_id()

def extract_player_summary_and_dm_notes(content):
    """Split markdown content into Player Summary and DM Notes sections"""
    player_summary = ""
    dm_notes = ""

    # Find Player Summary section
    player_match = re.search(r'## Player Summary\s*(.*?)(?=## DM Notes|$)', content, re.DOTALL)
    if player_match:
        player_summary = player_match.group(1).strip()

    # Find DM Notes section
    dm_match = re.search(r'## DM Notes\s*(.*?)$', content, re.DOTALL)
    if dm_match:
        dm_notes = dm_match.group(1).strip()

    return player_summary[:2000], dm_notes[:2000]  # Notion rich_text limit

def find_or_create_entity_id(notion, name):
    """Find existing entity by name or return None"""
    results = notion.databases.query(
        database_id=DB_ID,
        filter={"property": "Name", "title": {"equals": name}}
    )
    return results['results'][0]['id'] if results['results'] else None

def sync_entity(file_path):
    """Sync a single entity file to Notion"""
    notion = load_notion_client()

    # Read markdown file
    path = Path(file_path)
    if not path.exists():
        print(f"❌ File not found: {file_path}")
        return False

    with open(path, 'r') as f:
        post = frontmatter.load(f)

    # Extract content sections
    player_summary, dm_notes = extract_player_summary_and_dm_notes(post.content)

    # Build properties
    # Resolve path to absolute then get relative
    abs_path = path.resolve()
    campaign_root = Path('/mnt/c/dnd')
    try:
        rel_path = abs_path.relative_to(campaign_root)
    except ValueError:
        rel_path = path  # Use as-is if not in campaign root

    # APPROVED PROPERTIES ONLY (16 total)
    # Core: Name, Tags, Status
    # Navigation: Related Entities, Faction, Location, Parent Location
    # Utility: Player, Session Number, Progress Clock, File Path, Version, Location Type
    # Optional: Relations, Secrets, Last Seen

    properties = {
        "Name": {"title": [{"text": {"content": post.get('name', path.stem)}}]},
        "Status": {"select": {"name": post.get('status', 'Active')}},
        "Tags": {"multi_select": [{"name": str(tag)} for tag in post.get('tags', [])]},
        "Version": {"rich_text": [{"text": {"content": post.get('version', '0.1.0')}}]},
        "File Path": {"rich_text": [{"text": {"content": str(rel_path)}}]}
    }

    # Add approved type-specific properties
    if post.get('player'):
        properties["Player"] = {"rich_text": [{"text": {"content": post['player']}}]}

    if post.get('location_type'):
        properties["Location Type"] = {"select": {"name": post['location_type']}}

    if post.get('session_number'):
        properties["Session Number"] = {"number": post['session_number']}

    if post.get('progress_clock'):
        properties["Progress Clock"] = {"rich_text": [{"text": {"content": post['progress_clock']}}]}

    # Note: Relation properties (Faction, Location, Related Entities, Parent Location)
    # are NOT synced from markdown frontmatter to avoid auto-creating nested properties.
    # Use add_entity_relationships.py to manually set these after initial sync.

    # Find or create
    entity_name = post.get('name', path.stem)
    existing_id = find_or_create_entity_id(notion, entity_name)

    try:
        if existing_id:
            notion.pages.update(page_id=existing_id, properties=properties)
            print(f"✅ Updated: {entity_name}")
        else:
            notion.pages.create(
                parent={"database_id": DB_ID},
                properties=properties
            )
            print(f"✨ Created: {entity_name}")
        return True
    except Exception as e:
        print(f"❌ Error syncing {entity_name}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: sync_entity_to_notion.py <file_path>")
        sys.exit(1)

    success = sync_entity(sys.argv[1])
    sys.exit(0 if success else 1)
