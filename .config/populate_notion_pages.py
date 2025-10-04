#!/usr/bin/env python3
"""Populate Notion database pages with actual content (not just properties)"""

import sys
import re
sys.path.insert(0, '/home/matt-bourque/.local/lib/python3.10/site-packages')

from notion_client import Client
from pathlib import Path
import frontmatter

DB_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def load_notion_client():
    key = Path('/mnt/c/dnd/.config/notion_key.txt').read_text().strip()
    return Client(auth=key)

def markdown_to_notion_blocks(markdown_text):
    """Convert markdown to Notion blocks (simplified)"""
    blocks = []
    lines = markdown_text.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip YAML frontmatter section
        if i == 0 and line.strip() == '---':
            while i < len(lines) and lines[i].strip() != '---':
                i += 1
            i += 1
            continue

        # H1 - skip (use title property instead)
        if line.startswith('# '):
            i += 1
            continue

        # H2
        elif line.startswith('## '):
            blocks.append({
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": line[3:].strip()}}]
                }
            })

        # H3
        elif line.startswith('### '):
            blocks.append({
                "type": "heading_3",
                "heading_3": {
                    "rich_text": [{"type": "text", "text": {"content": line[4:].strip()}}]
                }
            })

        # Bullet list
        elif line.strip().startswith('- '):
            content = line.strip()[2:]
            blocks.append({
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": content}}]
                }
            })

        # Divider
        elif line.strip() == '---':
            blocks.append({"type": "divider", "divider": {}})

        # Regular paragraph
        elif line.strip():
            # Handle bold **text**
            text = line.strip()
            if '**' in text:
                # Simple bold handling - split and create rich text array
                parts = text.split('**')
                rich_text = []
                for idx, part in enumerate(parts):
                    if part:
                        rich_text.append({
                            "type": "text",
                            "text": {"content": part},
                            "annotations": {"bold": idx % 2 == 1}
                        })
                blocks.append({
                    "type": "paragraph",
                    "paragraph": {"rich_text": rich_text if rich_text else [{"type": "text", "text": {"content": text}}]}
                })
            else:
                blocks.append({
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": text}}]
                    }
                })

        i += 1

    return blocks

def find_entity_page(notion, name):
    """Find existing entity by name"""
    results = notion.databases.query(
        database_id=DB_ID,
        filter={"property": "Name", "title": {"equals": name}}
    )
    return results['results'][0] if results['results'] else None

def populate_page_content(notion, file_path):
    """Add page content from markdown file to Notion page"""
    path = Path(file_path)
    if not path.exists():
        return False, f"File not found: {file_path}"

    # Read markdown file
    with open(path, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)

    entity_name = post.get('name', path.stem)

    # Find the page in Notion
    page = find_entity_page(notion, entity_name)
    if not page:
        return False, f"Entity not found in Notion: {entity_name}"

    page_id = page['id']

    # Check if page already has content
    existing_blocks = notion.blocks.children.list(block_id=page_id)
    if existing_blocks['results']:
        return True, f"Skipped (already has content): {entity_name}"

    # Convert markdown to Notion blocks
    blocks = markdown_to_notion_blocks(post.content)

    # Limit to 100 blocks per API call (Notion limit)
    if len(blocks) > 100:
        blocks = blocks[:100]

    # Append blocks to page
    try:
        notion.blocks.children.append(block_id=page_id, children=blocks)
        return True, f"✅ Populated: {entity_name} ({len(blocks)} blocks)"
    except Exception as e:
        return False, f"❌ Failed {entity_name}: {str(e)[:100]}"

def populate_all_entities(notion, campaign_root):
    """Populate all entity pages with content"""
    files_to_process = [
        # PCs
        ('Player_Characters/PC_Manny.md', 'PC'),
        ('Player_Characters/PC_Nikki.md', 'PC'),
        ('Player_Characters/PC_Ian_Rakash.md', 'PC'),
        ('Player_Characters/PC_Kyle_Nameless.md', 'PC'),
        ('Player_Characters/PC_Josh.md', 'PC'),

        # Major NPCs
        ('NPCs/Major_NPCs/Professor_Zero.md', 'NPC'),
        ('NPCs/Major_NPCs/Steel_Dragon.md', 'NPC'),
        ('NPCs/Major_NPCs/The_Patron.md', 'NPC'),

        # Factions
        ('Factions/Faction_Chaos_Cult.md', 'Faction'),
        ('Factions/Faction_Merit_Council.md', 'Faction'),
        ('Factions/Faction_Dispossessed.md', 'Faction'),
        ('Factions/Faction_Decimate_Project.md', 'Faction'),

        # Locations
        ('Locations/Regions/Agastia_Region.md', 'Location'),
        ('Locations/Cities/Agastia_City.md', 'Location'),
        ('Locations/Districts/Scholar_Quarter.md', 'Location'),
        ('Locations/Districts/Merchant_District.md', 'Location'),
        ('Locations/Districts/Government_Complex.md', 'Location'),
        ('Locations/Towns/Meridians_Rest.md', 'Location'),
        ('Locations/Wilderness/Infinite_Forest.md', 'Location'),
        ('Locations/Wilderness/Ratterdan_Ruins.md', 'Location'),

        # Sessions
        ('Sessions/Session_0_Character_Creation.md', 'Session'),
        ('Sessions/Session_1_Caravan_to_Ratterdan.md', 'Session'),

        # Campaign Core
        ('Campaign_Core/Campaign_Overview.md', 'Core'),
        ('Campaign_Core/Giant_Axe_Artifact.md', 'Artifact'),
        ('Campaign_Core/The_Codex.md', 'Mystery'),
    ]

    results = {'success': 0, 'skipped': 0, 'failed': 0}

    for file_rel_path, entity_type in files_to_process:
        full_path = campaign_root / file_rel_path
        success, message = populate_page_content(notion, full_path)

        print(message)

        if success:
            if 'Skipped' in message:
                results['skipped'] += 1
            else:
                results['success'] += 1
        else:
            results['failed'] += 1

    return results

if __name__ == "__main__":
    print("=" * 60)
    print("Populate Notion Pages with Content")
    print("=" * 60)
    print()
    print("⚠️  This will add page content to empty Notion database pages")
    print("   Existing page content will be skipped (safe)")
    print()

    notion = load_notion_client()
    campaign_root = Path('/mnt/c/dnd')

    results = populate_all_entities(notion, campaign_root)

    print()
    print("=" * 60)
    print(f"✅ Success: {results['success']}")
    print(f"⏭️  Skipped: {results['skipped']}")
    print(f"❌ Failed: {results['failed']}")
    print("=" * 60)
