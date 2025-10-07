#!/usr/bin/env python3
"""
Build dungeon Notion structure from extracted data

This GUARANTEES correct structure by explicitly building
what we know works, based on the Fixed version.
"""

from notion_client import Client
from pathlib import Path

def get_notion_client():
    api_key = Path('.config/notion_key.txt').read_text().strip()
    return Client(auth=api_key)

def parse_rich_text(text):
    """Simple rich text parser"""
    return [{'type': 'text', 'text': {'content': text}}]

def create_dungeon_page(notion, name, data):
    """
    Create a dungeon page with proper structure

    data = {
        'overview': {'size': 'Small', 'mechanics': ['...', '...']},
        'corridors': [{'name': '...', 'properties': ['...', '...']}],
        'rooms': [
            {
                'name': 'Room 1',
                'boxed_text': '...',
                'creatures': [
                    {'name': 'Medium Shadows (2)', 'stats': ['...', '...']}
                ]
            }
        ]
    }
    """

    # Create page
    page = notion.pages.create(
        parent={"database_id": '281693f0-c6b4-80be-87c3-f56fef9cc2b9'},
        properties={
            "Name": {"title": [{"text": {"content": name}}]},
            "Tags": {"multi_select": [{"name": "test"}, {"name": "dungeon"}]},
            "Status": {"select": {"name": "Testing"}},
        }
    )

    page_id = page['id']

    # Add title
    notion.blocks.children.append(
        block_id=page_id,
        children=[{
            'object': 'block',
            'type': 'heading_1',
            'heading_1': {
                'rich_text': parse_rich_text(name),
                'is_toggleable': True
            }
        }]
    )

    # Add overview section
    overview_block = {
        'object': 'block',
        'type': 'heading_2',
        'heading_2': {
            'rich_text': parse_rich_text('Dungeon Overview'),
            'is_toggleable': True
        }
    }

    result = notion.blocks.children.append(block_id=page_id, children=[overview_block])
    overview_id = result['results'][0]['id']

    # Add overview content as children
    overview_children = [
        {
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': parse_rich_text(f"Size: {data['overview']['size']}")}
        },
        {
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': parse_rich_text('Dungeon-Wide Mechanics:')}
        }
    ]

    for mechanic in data['overview']['mechanics']:
        overview_children.append({
            'object': 'block',
            'type': 'bulleted_list_item',
            'bulleted_list_item': {'rich_text': parse_rich_text(mechanic)}
        })

    notion.blocks.children.append(block_id=overview_id, children=overview_children)

    # Add corridors section
    corridors_block = {
        'object': 'block',
        'type': 'heading_2',
        'heading_2': {
            'rich_text': parse_rich_text('Corridors & Connections'),
            'is_toggleable': True
        }
    }

    result = notion.blocks.children.append(block_id=page_id, children=[corridors_block])
    corridors_id = result['results'][0]['id']

    # Add each corridor as a toggle
    corridor_toggles = []
    for corridor in data['corridors']:
        toggle = {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': parse_rich_text(corridor['name']),
                'children': [
                    {
                        'object': 'block',
                        'type': 'bulleted_list_item',
                        'bulleted_list_item': {'rich_text': parse_rich_text(prop)}
                    }
                    for prop in corridor['properties']
                ]
            }
        }
        corridor_toggles.append(toggle)

    notion.blocks.children.append(block_id=corridors_id, children=corridor_toggles)

    # Add rooms
    for room in data['rooms']:
        # Room as top-level toggle (create empty first)
        room_toggle = {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': parse_rich_text(room['name'])
            }
        }

        result = notion.blocks.children.append(block_id=page_id, children=[room_toggle])
        room_id = result['results'][0]['id']

        # Add room children
        room_children = []

        # Add boxed text
        if 'boxed_text' in room:
            room_children.append({
                'object': 'block',
                'type': 'quote',
                'quote': {'rich_text': parse_rich_text(room['boxed_text'])}
            })

        # Add creatures toggle (create empty)
        if 'creatures' in room:
            creatures_toggle = {
                'object': 'block',
                'type': 'toggle',
                'toggle': {
                    'rich_text': parse_rich_text('Creatures')
                }
            }
            room_children.append(creatures_toggle)

        # Append room children
        if room_children:
            result = notion.blocks.children.append(block_id=room_id, children=room_children)

            # Find the creatures toggle ID
            if 'creatures' in room:
                creatures_id = None
                for block in result['results']:
                    if block['type'] == 'toggle':
                        creatures_id = block['id']
                        break

                if creatures_id:
                    # Add each creature as nested toggle
                    for creature in room['creatures']:
                        creature_toggle = {
                            'object': 'block',
                            'type': 'toggle',
                            'toggle': {
                                'rich_text': parse_rich_text(creature['name'])
                            }
                        }

                        result2 = notion.blocks.children.append(block_id=creatures_id, children=[creature_toggle])
                        creature_id = result2['results'][0]['id']

                        # Add creature stats
                        stat_children = [
                            {
                                'object': 'block',
                                'type': 'bulleted_list_item',
                                'bulleted_list_item': {'rich_text': parse_rich_text(stat)}
                            }
                            for stat in creature['stats']
                        ]

                        notion.blocks.children.append(block_id=creature_id, children=stat_children)

    print(f"✨ Created: {name}")
    return page_id

# Test with sample data
if __name__ == "__main__":
    notion = get_notion_client()

    test_data = {
        'overview': {
            'size': 'Small (3 rooms)',
            'mechanics': [
                'Shadow corruption drains resources',
                'All creatures regenerate in darkness'
            ]
        },
        'corridors': [
            {
                'name': 'Entrance Passage (Surface → Room 1)',
                'properties': [
                    'Length: 30 feet descending',
                    'Width: 5 feet (single file)',
                    'Features: Purple mist rises from below'
                ]
            },
            {
                'name': 'Passage A (Room 1 → Room 2)',
                'properties': [
                    'Length: 20 feet',
                    'Width: 10 feet',
                    'Features: Slick walls with corruption residue'
                ]
            }
        ],
        'rooms': [
            {
                'name': 'Room 1 - Shadow Den',
                'boxed_text': 'You enter a dark chamber. Purple mist clings to the floor.',
                'creatures': [
                    {
                        'name': 'Medium Shadows (2)',
                        'stats': ['AC 14, HP 25', 'Attack: +5 to hit, 1d8+2 necrotic', 'Drain: WIS 14 save']
                    },
                    {
                        'name': 'Weak Shadows (4)',
                        'stats': ['AC 12, HP 7', 'Attack: +4 to hit, 1d6+1 necrotic']
                    }
                ]
            }
        ]
    }

    create_dungeon_page(notion, "Test Dungeon (Structure Builder)", test_data)
