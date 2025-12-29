#!/usr/bin/env python3
import os
import sys
import json
import re
import fnmatch
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.10/site-packages'))

from notion_client import Client
from pathlib import Path
import frontmatter

# Import sync state manager for timestamp tracking
sys.path.insert(0, str(Path(__file__).parent / '.config'))
from sync_state_manager import record_push_to_notion

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

# Database IDs
DATABASES = {
    'entities': '281693f0-c6b4-80be-87c3-f56fef9cc2b9',  # D&D Campaign Entities database
}

def load_notionignore():
    """Load .notionignore file and return list of patterns"""
    ignore_file = Path('.notionignore')
    if not ignore_file.exists():
        return []

    patterns = []
    with open(ignore_file, 'r') as f:
        for line in f:
            line = line.strip()
            # Skip empty lines and comments
            if line and not line.startswith('#'):
                patterns.append(line)
    return patterns

def should_ignore(file_path, ignore_patterns):
    """Check if file matches any ignore patterns"""
    file_str = str(file_path)

    for pattern in ignore_patterns:
        # Handle directory patterns (ending with /**)
        if pattern.endswith('/**'):
            dir_pattern = pattern[:-3]  # Remove /**
            if file_str.startswith(dir_pattern):
                return True
        # Handle wildcard patterns
        elif '*' in pattern:
            if fnmatch.fnmatch(file_str, pattern):
                return True
        # Handle exact matches
        elif pattern in file_str or file_str.endswith(pattern):
            return True

    return False

def parse_rich_text(text, notion_client=None, database_id=None):
    """
    Parse markdown formatting (bold, italic, code, wikilinks) into Notion rich_text format

    Args:
        text: Text with markdown formatting
        notion_client: Optional Notion client for wikilink resolution
        database_id: Optional database ID to search for wikilinked pages
    """
    if not text:
        return []

    rich_text = []
    remaining = text[:2000]  # Notion limit

    # Pattern to match [[wikilink]], **bold**, *italic*, `code`
    # Process in order: wikilink, code, bold, italic to avoid conflicts
    pattern = r'(\[\[([^\]]+)\]\]|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)'

    last_end = 0
    for match in re.finditer(pattern, remaining):
        # Add plain text before the match
        if match.start() > last_end:
            plain = remaining[last_end:match.start()]
            if plain:
                rich_text.append({'type': 'text', 'text': {'content': plain}})

        matched_text = match.group()

        # Wikilink [[page name]]
        if matched_text.startswith('[[') and matched_text.endswith(']]'):
            page_name = match.group(2)  # Capture group 2 is the page name

            # Try to resolve if we have a client
            if notion_client and database_id:
                try:
                    response = notion_client.databases.query(
                        database_id=database_id,
                        filter={
                            'property': 'Name',
                            'title': {
                                'equals': page_name
                            }
                        }
                    )

                    if response['results']:
                        # Found the page - create a mention
                        page_id = response['results'][0]['id']
                        rich_text.append({
                            'type': 'mention',
                            'mention': {
                                'type': 'page',
                                'page': {'id': page_id}
                            }
                        })
                    else:
                        # Page not found - keep as styled text
                        rich_text.append({
                            'type': 'text',
                            'text': {'content': f'[[{page_name}]]'},
                            'annotations': {'code': True}
                        })
                except Exception as e:
                    # On error, keep as plain text
                    print(f"⚠️  Warning: Failed to resolve wikilink [[{page_name}]]: {e}")
                    rich_text.append({
                        'type': 'text',
                        'text': {'content': matched_text},
                        'annotations': {'code': True}
                    })
            else:
                # No client provided - keep as styled text
                rich_text.append({
                    'type': 'text',
                    'text': {'content': matched_text},
                    'annotations': {'code': True}
                })
        # Code (inline)
        elif matched_text.startswith('`') and matched_text.endswith('`'):
            rich_text.append({
                'type': 'text',
                'text': {'content': matched_text[1:-1]},
                'annotations': {'code': True}
            })
        # Bold
        elif matched_text.startswith('**') and matched_text.endswith('**'):
            rich_text.append({
                'type': 'text',
                'text': {'content': matched_text[2:-2]},
                'annotations': {'bold': True}
            })
        # Italic
        elif matched_text.startswith('*') and matched_text.endswith('*'):
            rich_text.append({
                'type': 'text',
                'text': {'content': matched_text[1:-1]},
                'annotations': {'italic': True}
            })

        last_end = match.end()

    # Add remaining plain text
    if last_end < len(remaining):
        plain = remaining[last_end:]
        if plain:
            rich_text.append({'type': 'text', 'text': {'content': plain}})

    return rich_text if rich_text else [{'type': 'text', 'text': {'content': remaining}}]

def markdown_to_notion_blocks(content, notion_client=None, database_id=None):
    """
    Convert markdown content to Notion blocks with table, toggle, and wikilink support

    Args:
        content: Markdown content
        notion_client: Optional Notion client for wikilink resolution
        database_id: Optional database ID to search for wikilinked pages
    """
    # Wrapper function to pass notion_client and database_id automatically
    def parse_text(text):
        """Helper to parse rich text with wikilink support"""
        return parse_rich_text(text, notion_client, database_id)

    blocks = []
    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip empty lines at start
        if not blocks and not line.strip():
            i += 1
            continue

        # Handle <details> blocks - convert to Notion toggles
        if line.strip().startswith('<details>'):
            i += 1
            # Find the summary line
            summary_text = "Toggle"
            toggle_content = []

            while i < len(lines) and not lines[i].strip().startswith('</details>'):
                if lines[i].strip().startswith('<summary>'):
                    # Extract summary text (remove HTML tags)
                    summary_line = lines[i].strip()
                    summary_line = summary_line.replace('<summary>', '').replace('</summary>', '')
                    summary_line = summary_line.replace('<b>', '').replace('</b>', '')
                    summary_text = summary_line.strip()
                elif not lines[i].strip().startswith('<') and lines[i].strip():
                    # This is content inside the toggle
                    toggle_content.append(lines[i])
                i += 1

            # Create toggle block with nested content
            toggle_children = []
            for content_line in toggle_content:
                if content_line.startswith('# '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'heading_1',
                        'heading_1': {'rich_text': parse_rich_text(content_line[2:].strip())}
                    })
                elif content_line.startswith('## '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'heading_2',
                        'heading_2': {'rich_text': parse_rich_text(content_line[3:].strip())}
                    })
                elif content_line.startswith('### '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'heading_3',
                        'heading_3': {'rich_text': parse_rich_text(content_line[4:].strip())}
                    })
                elif content_line.strip().startswith('- ') or content_line.strip().startswith('* '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'bulleted_list_item',
                        'bulleted_list_item': {'rich_text': parse_rich_text(content_line.strip()[2:].strip())}
                    })
                elif content_line.strip().startswith('> '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'quote',
                        'quote': {'rich_text': parse_rich_text(content_line.strip()[2:].strip())}
                    })
                elif content_line.strip():
                    toggle_children.append({
                        'object': 'block',
                        'type': 'paragraph',
                        'paragraph': {'rich_text': parse_rich_text(content_line)}
                    })

            blocks.append({
                'object': 'block',
                'type': 'toggle',
                'toggle': {
                    'rich_text': parse_rich_text(summary_text),
                    'children': toggle_children[:100] if toggle_children else []
                }
            })

        # Skip HTML tags and horizontal rules
        elif line.strip().startswith('<') or line.strip() == '---':
            pass

        # Handle headers
        elif line.startswith('# '):
            blocks.append({
                'object': 'block',
                'type': 'heading_1',
                'heading_1': {
                    'rich_text': parse_rich_text(line[2:].strip()),
                    'is_toggleable': True
                }
            })
        elif line.startswith('## '):
            blocks.append({
                'object': 'block',
                'type': 'heading_2',
                'heading_2': {
                    'rich_text': parse_rich_text(line[3:].strip()),
                    'is_toggleable': True
                }
            })
        elif line.startswith('### '):
            blocks.append({
                'object': 'block',
                'type': 'heading_3',
                'heading_3': {
                    'rich_text': parse_rich_text(line[4:].strip()),
                    'is_toggleable': True
                }
            })
        # Handle code blocks (including mermaid)
        elif line.strip().startswith('```'):
            code_lines = []
            i += 1
            language = line.strip()[3:].strip() or 'plain text'
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            blocks.append({
                'object': 'block',
                'type': 'code',
                'code': {
                    'rich_text': [{'type': 'text', 'text': {'content': '\n'.join(code_lines)[:2000]}}],
                    'language': 'plain text' if language == 'mermaid' else language
                }
            })
        # Handle markdown tables
        elif line.strip().startswith('|') and i + 1 < len(lines) and '|' in lines[i + 1]:
            # Parse table
            table_lines = []
            table_start = i
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i])
                i += 1
            i -= 1  # Back up one since main loop will increment

            if len(table_lines) >= 2:  # Need at least header + separator
                # Parse table structure
                def parse_table_row(row_line):
                    """Split table row and clean up cells"""
                    cells = [cell.strip() for cell in row_line.strip('|').split('|')]
                    return cells

                header_cells = parse_table_row(table_lines[0])
                table_width = len(header_cells)

                # Skip separator line (table_lines[1])
                data_rows = [parse_table_row(line) for line in table_lines[2:]]

                # Build table row children
                table_row_children = []

                # Header row
                header_row = {
                    'type': 'table_row',
                    'table_row': {
                        'cells': [
                            parse_rich_text(cell, notion_client, database_id)
                            for cell in header_cells
                        ]
                    }
                }
                table_row_children.append(header_row)

                # Data rows
                for row in data_rows:
                    # Pad row to match table width
                    while len(row) < table_width:
                        row.append('')

                    data_row = {
                        'type': 'table_row',
                        'table_row': {
                            'cells': [
                                parse_rich_text(cell, notion_client, database_id)
                                for cell in row[:table_width]  # Trim to table width
                            ]
                        }
                    }
                    table_row_children.append(data_row)

                # Create table block
                blocks.append({
                    'object': 'block',
                    'type': 'table',
                    'table': {
                        'table_width': table_width,
                        'has_column_header': True,
                        'has_row_header': False,
                        'children': table_row_children
                    }
                })
        # Handle blockquotes
        elif line.strip().startswith('> '):
            blocks.append({
                'object': 'block',
                'type': 'quote',
                'quote': {'rich_text': parse_rich_text(line.strip()[2:].strip())}
            })
        # Handle Toggle blocks (detect **Toggle: Title** pattern)
        elif line.strip().startswith('**Toggle:') and '**' in line.strip()[9:]:
            # Extract toggle title (find closing **)
            text_after_toggle = line.strip()[9:]  # Remove **Toggle:
            end_pos = text_after_toggle.find('**')
            toggle_title = text_after_toggle[:end_pos].strip() if end_pos != -1 else text_after_toggle.strip()

            # Collect content until next heading or toggle
            toggle_content = []
            i += 1
            while i < len(lines):
                next_line = lines[i]
                # Stop at next heading, toggle, or horizontal rule
                if (next_line.startswith('#') or
                    next_line.strip().startswith('**Toggle:') or
                    next_line.strip() == '---'):
                    i -= 1  # Back up so main loop processes this line
                    break
                if next_line.strip():
                    toggle_content.append(next_line)
                i += 1

            # Create toggle block with children (recursively parse for nested toggles)
            toggle_children = []
            j = 0
            while j < len(toggle_content):
                content_line = toggle_content[j]

                # Check for nested toggle
                if content_line.strip().startswith('**Toggle:') and '**' in content_line.strip()[9:]:
                    # Extract nested toggle title
                    text_after = content_line.strip()[9:]
                    end_pos = text_after.find('**')
                    nested_title = text_after[:end_pos].strip()

                    # Collect nested toggle content
                    nested_content = []
                    j += 1
                    while j < len(toggle_content):
                        next_line = toggle_content[j]
                        # Stop at next toggle at same level
                        if next_line.strip().startswith('**Toggle:'):
                            j -= 1
                            break
                        if next_line.strip():
                            nested_content.append(next_line)
                        j += 1

                    # Create nested toggle children
                    nested_children = []
                    for nc_line in nested_content:
                        if nc_line.strip().startswith('- ') or nc_line.strip().startswith('* '):
                            nested_children.append({
                                'object': 'block',
                                'type': 'bulleted_list_item',
                                'bulleted_list_item': {'rich_text': parse_rich_text(nc_line.strip()[2:].strip())}
                            })
                        elif nc_line.strip().startswith('> '):
                            nested_children.append({
                                'object': 'block',
                                'type': 'quote',
                                'quote': {'rich_text': parse_rich_text(nc_line.strip()[2:].strip())}
                            })
                        elif nc_line.strip():
                            nested_children.append({
                                'object': 'block',
                                'type': 'paragraph',
                                'paragraph': {'rich_text': parse_rich_text(nc_line)}
                            })

                    # Add nested toggle
                    toggle_children.append({
                        'object': 'block',
                        'type': 'toggle',
                        'toggle': {
                            'rich_text': parse_rich_text(nested_title),
                            'children': nested_children[:100]
                        }
                    })
                elif content_line.startswith('### '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'heading_3',
                        'heading_3': {'rich_text': parse_rich_text(content_line[4:].strip()), 'is_toggleable': True}
                    })
                elif content_line.strip().startswith('- ') or content_line.strip().startswith('* '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'bulleted_list_item',
                        'bulleted_list_item': {'rich_text': parse_rich_text(content_line.strip()[2:].strip())}
                    })
                elif content_line.strip().startswith('> '):
                    toggle_children.append({
                        'object': 'block',
                        'type': 'quote',
                        'quote': {'rich_text': parse_rich_text(content_line.strip()[2:].strip())}
                    })
                elif content_line.strip():
                    toggle_children.append({
                        'object': 'block',
                        'type': 'paragraph',
                        'paragraph': {'rich_text': parse_rich_text(content_line)}
                    })

                j += 1

            blocks.append({
                'object': 'block',
                'type': 'toggle',
                'toggle': {
                    'rich_text': parse_rich_text(toggle_title),
                    'children': toggle_children[:100] if toggle_children else []
                }
            })

        # Handle bulleted lists
        elif line.strip().startswith('- ') or line.strip().startswith('* '):
            blocks.append({
                'object': 'block',
                'type': 'bulleted_list_item',
                'bulleted_list_item': {'rich_text': parse_rich_text(line.strip()[2:].strip())}
            })
        # Handle numbered lists
        elif line.strip() and line.strip()[0].isdigit() and '. ' in line:
            content = line.strip().split('. ', 1)[1] if '. ' in line else line
            blocks.append({
                'object': 'block',
                'type': 'numbered_list_item',
                'numbered_list_item': {'rich_text': parse_rich_text(content)}
            })
        # Regular paragraph
        elif line.strip():
            blocks.append({
                'object': 'block',
                'type': 'paragraph',
                'paragraph': {'rich_text': parse_rich_text(line)}
            })

        i += 1

    return blocks

def sync_to_notion(file_path, entry_type):
    """Sync a markdown file to Notion database with full content"""
    notion = get_notion_client()

    with open(file_path, 'r') as f:
        post = frontmatter.load(f)

    # Map to actual Notion properties (based on schema query)
    properties = {
        "Name": {"title": [{"text": {"content": post.get('name', Path(file_path).stem)}}]},
        "Tags": {"multi_select": [{"name": tag} for tag in post.get('tags', [])]},
        "Status": {"select": {"name": post.get('status', 'Active')}},
        "File Path": {"rich_text": [{"text": {"content": str(file_path)}}]},
    }

    # Add optional properties if they exist in frontmatter
    if 'version' in post:
        properties["Version"] = {"rich_text": [{"text": {"content": post.get('version', '')}}]}

    if 'player' in post:
        properties["Player"] = {"rich_text": [{"text": {"content": post.get('player', '')}}]}

    if 'session_number' in post:
        properties["Session Number"] = {"number": post.get('session_number')}

    if 'location_type' in post:
        properties["Location Type"] = {"select": {"name": post.get('location_type')}}

    if 'progress_clock' in post:
        properties["Progress Clock"] = {"rich_text": [{"text": {"content": post.get('progress_clock', '')}}]}

    # Store entity type in Tags if not already present
    tags_list = post.get('tags', [])
    if entry_type.lower() not in [t.lower() for t in tags_list]:
        tags_list.append(entry_type.lower())
        properties["Tags"] = {"multi_select": [{"name": tag} for tag in tags_list]}

    # Check if entry exists - match by File Path, not Name
    results = notion.databases.query(
        database_id=DATABASES['entities'],
        filter={"property": "File Path", "rich_text": {"equals": str(file_path)}}
    )

    # Convert markdown content to Notion blocks (with wikilink support)
    content_blocks = markdown_to_notion_blocks(post.content, notion, DATABASES['entities'])

    if results['results']:
        # Archive existing page
        old_page_id = results['results'][0]['id']

        notion.pages.update(
            page_id=old_page_id,
            archived=True
        )

        # Create new page with fresh content
        new_page = notion.pages.create(
            parent={"database_id": DATABASES['entities']},
            properties=properties
        )

        # Add content in batches
        batch_size = 100
        for i in range(0, len(content_blocks), batch_size):
            batch = content_blocks[i:i+batch_size]
            notion.blocks.children.append(block_id=new_page['id'], children=batch)

        print(f"✅ Updated: {post.get('name', Path(file_path).stem)} (archived old, created new with {len(content_blocks)} blocks)")

        # Record timestamp for push tracking
        record_push_to_notion(str(file_path), new_page['id'])
    else:
        # Create new page with content
        new_page = notion.pages.create(
            parent={"database_id": DATABASES['entities']},
            properties=properties
        )

        # Add content in batches
        batch_size = 100
        for i in range(0, len(content_blocks), batch_size):
            batch = content_blocks[i:i+batch_size]
            notion.blocks.children.append(block_id=new_page['id'], children=batch)

        print(f"✨ Created: {post.get('name', Path(file_path).stem)} ({len(content_blocks)} blocks)")

        # Record timestamp for push tracking
        record_push_to_notion(str(file_path), new_page['id'])

def sync_all():
    """Sync all campaign files to Notion - dynamically discovers all markdown files"""

    sync_mappings = [
        ('Player_Characters/**/*.md', 'PC'),
        ('NPCs/**/*.md', 'NPC'),
        ('Factions/**/*.md', 'Faction'),
        ('Locations/**/*.md', 'Location'),
        ('Campaign_Core/**/*.md', 'Artifact'),
        ('Sessions/**/*.md', 'Session'),
        ('Resources/**/*.md', 'Resource'),
        ('Dungeon_Ecologies/**/*.md', 'Ecology'),
        ('Session_Flows/**/*.md', 'Flow'),
        ('.working/conversation_logs/**/*.md', 'Conversation'),
        # Technical documentation and test files (source materials)
        ('.config/NOTION_SYNC_IMPROVEMENTS.md', 'Documentation'),
        ('.config/SYNC_COMMAND_REFERENCE.md', 'Documentation'),
        ('.config/test_markdown_features.md', 'Test'),
    ]

    # Load ignore patterns
    ignore_patterns = load_notionignore()

    synced_count = 0
    skipped_count = 0

    for pattern, entry_type in sync_mappings:
        for file_path in Path('.').glob(pattern):
            # Skip files starting with underscore
            if file_path.name.startswith('_'):
                continue

            # Check if file should be ignored
            if should_ignore(file_path, ignore_patterns):
                skipped_count += 1
                print(f"⏭️  Skipped (ignored): {file_path}")
                continue

            sync_to_notion(file_path, entry_type)
            synced_count += 1

    print(f"🎲 Synced {synced_count} files to Notion ({skipped_count} skipped via .notionignore)")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == 'all':
            sync_all()
        else:
            sync_to_notion(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'Unknown')
    else:
        print("Usage: ./sync_notion.py [all|filepath] [type]")
        print("Example: ./sync_notion.py Player_Characters/PC_Manny.md PC")