#!/usr/bin/env python3
import os
import json
from notion_client import Client
from pathlib import Path
import frontmatter
import sys

# Load Notion API key
def load_notion_key():
    key_file = Path('.config/notion_key.txt')
    if not key_file.exists():
        print("❌ Please create .config/notion_key.txt with your Notion API key")
        print("   Get your key from: https://www.notion.so/my-integrations")
        print("   ⚠️  SECURITY: Remember to clear your chat history after providing the key!")
        sys.exit(1)
    return key_file.read_text().strip()

# Initialize Notion client
def get_notion_client():
    try:
        return Client(auth=load_notion_key())
    except Exception as e:
        print(f"❌ Failed to connect to Notion: {e}")
        print("   Check your API key in .config/notion_key.txt")
        sys.exit(1)

# Database IDs (replace with your actual IDs after creation)
DATABASES = {
    'entities': 'YOUR_DATABASE_ID_HERE',  # Single unified database
}

def sync_to_notion(file_path, entry_type):
    """Sync a markdown file to Notion database"""
    notion = get_notion_client()
    
    with open(file_path, 'r') as f:
        post = frontmatter.load(f)
    
    properties = {
        "Name": {"title": [{"text": {"content": post.get('name', Path(file_path).stem)}}]},
        "Type": {"select": {"name": entry_type}},
        "Tags": {"multi_select": [{"name": tag} for tag in post.get('tags', [])]},
        "Status": {"select": {"name": post.get('status', 'Active')}},
        "Relations": {"rich_text": [{"text": {"content": post.get('relations', '')}}]},
        "Notes": {"rich_text": [{"text": {"content": post.content[:2000]}}]}
    }
    
    # Check if entry exists
    results = notion.databases.query(
        database_id=DATABASES['entities'],
        filter={"property": "Name", "title": {"equals": post.get('name', Path(file_path).stem)}}
    )
    
    if results['results']:
        # Update existing
        notion.pages.update(
            page_id=results['results'][0]['id'],
            properties=properties
        )
        print(f"✅ Updated: {post.get('name', Path(file_path).stem)}")
    else:
        # Create new
        notion.pages.create(
            parent={"database_id": DATABASES['entities']},
            properties=properties
        )
        print(f"✨ Created: {post.get('name', Path(file_path).stem)}")

def sync_all():
    """Sync all campaign files to Notion"""
    if DATABASES['entities'] == 'YOUR_DATABASE_ID_HERE':
        print("❌ Please update database ID in sync_notion.py")
        print("   See .config/NOTION_SETUP.md for instructions")
        sys.exit(1)
        
    sync_mappings = [
        ('Player_Characters/*.md', 'PC'),
        ('NPCs/**/*.md', 'NPC'),
        ('Factions/*.md', 'Faction'),
        ('Locations/*.md', 'Location'),
        ('Resources/*.md', 'Resource'),
    ]
    
    synced_count = 0
    for pattern, entry_type in sync_mappings:
        for file_path in Path('.').glob(pattern):
            if not file_path.name.startswith('_'):
                sync_to_notion(file_path, entry_type)
                synced_count += 1
    
    print(f"🎲 Synced {synced_count} files to Notion")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == 'all':
            sync_all()
        else:
            sync_to_notion(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'Unknown')
    else:
        print("Usage: ./sync_notion.py [all|filepath] [type]")
        print("Example: ./sync_notion.py Player_Characters/PC_Manny.md PC")