#!/usr/bin/env python3
"""
Sync markdown files to Notion with hierarchical nesting support.
Headings become toggleable blocks with nested children.
"""
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

# Database IDs
DATABASES = {
    'entities': '281693f0-c6b4-80be-87c3-f56fef9cc2b9',
}

def load_notion_key():
    key_file = Path('.config/notion_key.txt')
    if not key_file.exists():
        print("❌ Please create .config/notion_key.txt with your Notion API key")
        sys.exit(1)
    return key_file.read_text().strip()

def get_notion_client():
    try:
        return Client(auth=load_notion_key())
    except Exception as e:
        print(f"❌ Failed to connect to Notion: {e}")
        sys.exit(1)

def load_notionignore():
    """Load .notionignore file and return list of patterns"""
    ignore_file = Path('.notionignore')
    if not ignore_file.exists():
        return []

    patterns = []
    with open(ignore_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                patterns.append(line)
    return patterns

def should_ignore(file_path, ignore_patterns):
    """Check if file matches any ignore patterns"""
    file_str = str(file_path)

    for pattern in ignore_patterns:
        if pattern.endswith('/**'):
            dir_pattern = pattern[:-3]
            if file_str.startswith(dir_pattern):
                return True
        elif '*' in pattern:
            if fnmatch.fnmatch(file_str, pattern):
                return True
        elif pattern in file_str or file_str.endswith(pattern):
            return True

    return False

def parse_rich_text(text, notion_client=None, database_id=None, max_length=2000):
    """
    Parse markdown formatting (bold, italic, code, wikilinks) into Notion rich_text format
    Supports [[wikilink]] syntax that links to other pages in the database
    """
    if not text:
        return []

    rich_text = []
    remaining = text[:max_length]

    # Pattern to match [[wikilink]], **bold**, *italic*, `code`, ~~strikethrough~~
    pattern = r'(\[\[([^\]]+)\]\]|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)'

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
            link_text = match.group(2)  # Extract text inside [[]]

            # Try to resolve wikilink to page ID
            page_id = None
            if notion_client and database_id:
                try:
                    results = notion_client.databases.query(
                        database_id=database_id,
                        filter={"property": "Name", "title": {"equals": link_text}}
                    )
                    if results['results']:
                        page_id = results['results'][0]['id']
                except:
                    pass  # If lookup fails, just use plain text

            if page_id:
                # Create mention link to page
                rich_text.append({
                    'type': 'mention',
                    'mention': {'type': 'page', 'page': {'id': page_id}},
                    'plain_text': link_text
                })
            else:
                # Fallback to plain text with brackets
                rich_text.append({'type': 'text', 'text': {'content': f'[[{link_text}]]'}})

        # Code (inline)
        elif matched_text.startswith('`') and matched_text.endswith('`'):
            rich_text.append({
                'type': 'text',
                'text': {'content': matched_text[1:-1]},
                'annotations': {'code': True}
            })
        # Bold
        elif matched_text.startswith('**') and matched_text.endswith('**'):
            inner_content = matched_text[2:-2]
            # Recursively parse content inside bold for wikilinks
            inner_parsed = parse_rich_text(inner_content, notion_client, database_id, max_length)
            # Apply bold annotation to each result
            for item in inner_parsed:
                if item['type'] == 'text':
                    if 'annotations' not in item:
                        item['annotations'] = {}
                    item['annotations']['bold'] = True
                rich_text.append(item)
        # Italic
        elif matched_text.startswith('*') and matched_text.endswith('*'):
            inner_content = matched_text[1:-1]
            # Recursively parse content inside italic for wikilinks
            inner_parsed = parse_rich_text(inner_content, notion_client, database_id, max_length)
            # Apply italic annotation to each result
            for item in inner_parsed:
                if item['type'] == 'text':
                    if 'annotations' not in item:
                        item['annotations'] = {}
                    item['annotations']['italic'] = True
                rich_text.append(item)
        # Strikethrough
        elif matched_text.startswith('~~') and matched_text.endswith('~~'):
            inner_content = matched_text[2:-2]
            # Recursively parse content inside strikethrough for wikilinks
            inner_parsed = parse_rich_text(inner_content, notion_client, database_id, max_length)
            # Apply strikethrough annotation to each result
            for item in inner_parsed:
                if item['type'] == 'text':
                    if 'annotations' not in item:
                        item['annotations'] = {}
                    item['annotations']['strikethrough'] = True
                rich_text.append(item)

        last_end = match.end()

    # Remaining text
    if last_end < len(remaining):
        rich_text.append({'type': 'text', 'text': {'content': remaining[last_end:]}})

    return rich_text if rich_text else [{'type': 'text', 'text': {'content': ''}}]


def get_heading_level(line):
    """Return heading level (1-6) for parsing. Notion will convert 4+ to H3."""
    if line.startswith('##### '):
        return 5
    elif line.startswith('#### '):
        return 4
    elif line.startswith('### '):
        return 3
    elif line.startswith('## '):
        return 2
    elif line.startswith('# '):
        return 1
    return None


def parse_single_block(lines, idx, notion_client=None, database_id=None):
    """Parse a single non-heading block. Returns (block_or_list, next_idx)"""
    if idx >= len(lines):
        return None, idx

    line = lines[idx]

    if not line.strip():
        return None, idx + 1

    # Code blocks
    if line.startswith('```'):
        language = line[3:].strip() or 'plain text'
        # Detect mermaid
        if language.lower() in ['mermaid', 'graph']:
            language = 'mermaid'

        code_lines = []
        i = idx + 1
        while i < len(lines) and not lines[i].startswith('```'):
            code_lines.append(lines[i])
            i += 1

        code_text = '\n'.join(code_lines)[:2000]
        return ({
            'object': 'block',
            'type': 'code',
            'code': {
                'rich_text': [{'type': 'text', 'text': {'content': code_text}}],
                'language': language
            }
        }, i + 1)

    # Blockquotes
    if line.startswith('> '):
        quote_lines = []
        i = idx
        while i < len(lines) and lines[i].startswith('> '):
            quote_lines.append(lines[i][2:])
            i += 1
        return ({
            'object': 'block',
            'type': 'quote',
            'quote': {'rich_text': parse_rich_text(' '.join(quote_lines), notion_client, database_id)}
        }, i)

    # Bulleted lists
    if line.startswith('- ') or line.startswith('* '):
        return ({
            'object': 'block',
            'type': 'bulleted_list_item',
            'bulleted_list_item': {'rich_text': parse_rich_text(line[2:], notion_client, database_id)}
        }, idx + 1)

    # Numbered lists
    if re.match(r'^\d+\.\s', line):
        match = re.match(r'^\d+\.\s(.*)$', line)
        return ({
            'object': 'block',
            'type': 'numbered_list_item',
            'numbered_list_item': {'rich_text': parse_rich_text(match.group(1), notion_client, database_id)}
        }, idx + 1)

    # Tables - convert to Notion table blocks
    if '|' in line and idx + 1 < len(lines) and '---' in lines[idx + 1]:
        # For now, convert to simple list representation
        # Full Notion table API is complex
        header = [cell.strip() for cell in line.split('|')[1:-1]]
        table_blocks = [{
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': parse_rich_text('**' + ' | '.join(header) + '**', notion_client, database_id)}
        }]

        i = idx + 2
        while i < len(lines) and '|' in lines[i] and lines[i].strip():
            row = [cell.strip() for cell in lines[i].split('|')[1:-1]]
            table_blocks.append({
                'object': 'block',
                'type': 'bulleted_list_item',
                'bulleted_list_item': {'rich_text': parse_rich_text(' | '.join(row), notion_client, database_id)}
            })
            i += 1
        return (table_blocks, i)

    # Toggle markers - handled specially in collect_until_heading
    if line.startswith('**Toggle:'):
        return None, idx

    # HTML details/summary tags - skip them (handled in collect_until_heading)
    if line.strip().startswith('<details>') or line.strip().startswith('</details>') or line.strip().startswith('<summary>') or line.strip().startswith('</summary>'):
        return None, idx + 1

    # Regular paragraph
    return ({
        'object': 'block',
        'type': 'paragraph',
        'paragraph': {'rich_text': parse_rich_text(line, notion_client, database_id)}
    }, idx + 1)


def collect_until_heading(lines, start_idx, parent_level, notion_client=None, database_id=None):
    """Collect blocks until we hit a heading of same or higher level"""
    blocks = []
    i = start_idx

    while i < len(lines):
        line = lines[i]
        level = get_heading_level(line)

        # Stop if we hit a same/higher level heading
        if level is not None and level <= parent_level:
            break

        # If it's a lower-level heading, parse it with its children
        if level is not None and level > parent_level:
            heading_info, i = parse_heading_section(lines, i, notion_client, database_id)
            if heading_info:
                blocks.append(heading_info)
            continue

        # Special handling for <details> HTML tags
        if line.strip().startswith('<details>'):
            i += 1
            # Find summary line
            toggle_title = "Toggle"
            while i < len(lines) and not lines[i].strip().startswith('<summary>'):
                i += 1

            if i < len(lines) and lines[i].strip().startswith('<summary>'):
                # Extract summary text (remove HTML tags)
                summary_line = lines[i].strip()
                summary_line = summary_line.replace('<summary>', '').replace('</summary>', '')
                summary_line = summary_line.replace('<b>', '').replace('</b>', '')
                toggle_title = summary_line.strip()
                i += 1

            # Collect content until </details>
            toggle_children = []
            while i < len(lines) and not lines[i].strip().startswith('</details>'):
                next_level = get_heading_level(lines[i])
                if next_level is not None and next_level <= parent_level:
                    break

                block, i = parse_single_block(lines, i, notion_client, database_id)
                if block:
                    if isinstance(block, list):
                        for b in block:
                            toggle_children.append({'block': b, 'children': []})
                    elif block is not None:
                        toggle_children.append({'block': block, 'children': []})

            # Skip </details> tag
            if i < len(lines) and lines[i].strip().startswith('</details>'):
                i += 1

            toggle_block = {
                'object': 'block',
                'type': 'toggle',
                'toggle': {'rich_text': parse_rich_text(toggle_title, notion_client, database_id)}
            }
            blocks.append({'block': toggle_block, 'children': toggle_children})
            continue

        # Special handling for toggle markers
        if line.startswith('**Toggle:'):
            toggle_title = line.replace('**Toggle:', '').replace('**', '').strip()
            i += 1

            # Collect content until next toggle or heading
            toggle_children = []
            while i < len(lines):
                next_level = get_heading_level(lines[i])
                if next_level is not None and next_level <= parent_level:
                    break
                if lines[i].startswith('**Toggle:'):
                    break

                block, i = parse_single_block(lines, i, notion_client, database_id)
                if block:
                    if isinstance(block, list):
                        for b in block:
                            toggle_children.append({'block': b, 'children': []})
                    elif block is not None:
                        toggle_children.append({'block': block, 'children': []})

            toggle_block = {
                'object': 'block',
                'type': 'toggle',
                'toggle': {'rich_text': parse_rich_text(toggle_title, notion_client, database_id)}
            }
            blocks.append({'block': toggle_block, 'children': toggle_children})
            continue

        # Parse regular block
        block, i = parse_single_block(lines, i, notion_client, database_id)
        if block:
            if isinstance(block, list):
                for b in block:
                    blocks.append({'block': b, 'children': []})
            else:
                blocks.append({'block': block, 'children': []})

    return blocks, i


def parse_heading_section(lines, idx, notion_client=None, database_id=None):
    """
    Parse a heading and collect all content until next same-level heading.
    Returns (section_info, next_idx) where section_info has 'block' and 'children' keys.

    H1-H3: Notion headings (toggleable)
    H4+: Bold paragraph wrapped in toggle (Notion limitation)
    """
    line = lines[idx]
    level = get_heading_level(line)

    if level is None:
        return None, idx

    # Extract heading text
    heading_text = line.lstrip('#').strip()

    # Collect children
    children, next_idx = collect_until_heading(lines, idx + 1, level, notion_client, database_id)

    # H1-H3: Use Notion heading blocks
    if level <= 3:
        if level == 1:
            block_type = 'heading_1'
        elif level == 2:
            block_type = 'heading_2'
        else:
            block_type = 'heading_3'

        heading_block = {
            'object': 'block',
            'type': block_type,
            block_type: {
                'rich_text': parse_rich_text(heading_text, notion_client, database_id),
                'is_toggleable': True
            }
        }
        return {'block': heading_block, 'children': children}, next_idx

    # H4+: Use toggle with bold paragraph (Notion only supports 3 heading levels)
    else:
        # Create toggle block with bold heading text
        toggle_block = {
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': parse_rich_text(f'**{heading_text}**', notion_client, database_id)
            }
        }
        return {'block': toggle_block, 'children': children}, next_idx


def markdown_to_notion_blocks(content, notion_client=None, database_id=None):
    """
    Convert markdown to hierarchical Notion block structure.
    Returns list of sections with 'block' and 'children' keys.
    """
    lines = content.split('\n')
    sections = []
    i = 0

    while i < len(lines):
        # Skip empty lines at start
        if not sections and not lines[i].strip():
            i += 1
            continue

        # Check for heading
        level = get_heading_level(lines[i])
        if level is not None:
            section, i = parse_heading_section(lines, i, notion_client, database_id)
            if section:
                sections.append(section)
        else:
            # Top-level content
            block, i = parse_single_block(lines, i, notion_client, database_id)
            if block:
                if isinstance(block, list):
                    for b in block:
                        sections.append({'block': b, 'children': []})
                else:
                    sections.append({'block': block, 'children': []})

    return sections


def upload_blocks_with_children(notion, parent_id, sections, depth=0):
    """
    Upload blocks in batches, handling nested children recursively.
    """
    indent = "  " * depth

    # Separate blocks with and without children
    blocks_without_children = []
    blocks_with_children = []

    for section in sections:
        if section['children']:
            blocks_with_children.append(section)
        else:
            blocks_without_children.append(section['block'])

    # Batch upload blocks without children (up to 100 at a time)
    if blocks_without_children:
        for i in range(0, len(blocks_without_children), 100):
            batch = blocks_without_children[i:i+100]
            notion.blocks.children.append(
                block_id=parent_id,
                children=batch
            )

    # Upload blocks with children one at a time, then recursively upload their children
    for section in blocks_with_children:
        block = section['block']
        children = section['children']

        response = notion.blocks.children.append(
            block_id=parent_id,
            children=[block]
        )

        created_block = response['results'][0]
        block_id = created_block['id']

        # Recursively upload children
        upload_blocks_with_children(notion, block_id, children, depth + 1)

    return True


def sync_to_notion(file_path, entry_type):
    """Sync a markdown file to Notion database with hierarchical nesting"""
    notion = get_notion_client()

    with open(file_path, 'r') as f:
        post = frontmatter.load(f)

    # Map to actual Notion properties
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

    # Check if entry exists - match by File Path
    results = notion.databases.query(
        database_id=DATABASES['entities'],
        filter={"property": "File Path", "rich_text": {"equals": str(file_path)}}
    )

    # Convert markdown content to hierarchical Notion blocks (with wikilink support)
    content_sections = markdown_to_notion_blocks(post.content, notion, DATABASES['entities'])

    if results['results']:
        # Update existing page (preserve page ID to maintain wikilinks)
        existing_page_id = results['results'][0]['id']

        # Update page properties
        notion.pages.update(
            page_id=existing_page_id,
            properties=properties
        )

        # Delete all existing blocks (clear content while keeping page ID)
        try:
            children = notion.blocks.children.list(block_id=existing_page_id)
            for block in children['results']:
                notion.blocks.delete(block_id=block['id'])
        except Exception as e:
            print(f"⚠️  Warning: Could not delete existing blocks: {e}")

        # Upload new content with nested children
        upload_blocks_with_children(notion, existing_page_id, content_sections)

        print(f"✅ Updated: {post.get('name', Path(file_path).stem)} (in-place, preserved page ID)")
        record_push_to_notion(str(file_path), existing_page_id)
    else:
        # Create new page
        new_page = notion.pages.create(
            parent={"database_id": DATABASES['entities']},
            properties=properties
        )

        # Upload content with nested children
        upload_blocks_with_children(notion, new_page['id'], content_sections)

        print(f"✨ Created: {post.get('name', Path(file_path).stem)} (with nesting)")
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
    ]

    ignore_patterns = load_notionignore()

    for pattern, entity_type in sync_mappings:
        files = Path('.').glob(pattern)
        for file in files:
            if should_ignore(file, ignore_patterns):
                print(f"⏭️  Skipped (ignored): {file}")
                continue

            try:
                sync_to_notion(str(file), entity_type)
            except Exception as e:
                print(f"❌ Failed to sync {file}: {e}")


if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python sync_notion.py <file_path> <entity_type>")
        print("   or: python sync_notion.py all")
        sys.exit(1)

    if sys.argv[1] == 'all':
        sync_all()
    else:
        file_path = sys.argv[1]
        entry_type = sys.argv[2] if len(sys.argv) > 2 else 'Unknown'
        sync_to_notion(file_path, entry_type)
