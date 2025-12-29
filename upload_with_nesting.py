#!/usr/bin/env python3
"""
Upload Session 3 with proper hierarchical nesting using Notion block API.
Handles the 2-level nesting limitation by creating blocks then appending children.
"""
import os
import sys
import re
from pathlib import Path
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.10/site-packages'))

from notion_client import Client
import frontmatter

def load_notion_key():
    key_file = Path('.config/notion_key.txt')
    if not key_file.exists():
        print("❌ Please create .config/notion_key.txt with your Notion API key")
        sys.exit(1)
    return key_file.read_text().strip()

DATABASE_ID = '281693f0-c6b4-80be-87c3-f56fef9cc2b9'

def create_rich_text(text, max_length=2000):
    """Create Notion rich_text with basic markdown parsing"""
    if not text:
        return []

    text = text[:max_length]
    chunks = []
    pattern = r'(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)'
    last_end = 0

    for match in re.finditer(pattern, text):
        if match.start() > last_end:
            plain = text[last_end:match.start()]
            if plain:
                chunks.append({'type': 'text', 'text': {'content': plain}})

        matched = match.group()
        if matched.startswith('`') and matched.endswith('`'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[1:-1]},
                'annotations': {'code': True}
            })
        elif matched.startswith('**') and matched.endswith('**'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[2:-2]},
                'annotations': {'bold': True}
            })
        elif matched.startswith('*') and matched.endswith('*'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[1:-1]},
                'annotations': {'italic': True}
            })
        elif matched.startswith('~~') and matched.endswith('~~'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[2:-2]},
                'annotations': {'strikethrough': True}
            })
        last_end = match.end()

    if last_end < len(text):
        chunks.append({'type': 'text', 'text': {'content': text[last_end:]}})

    return chunks if chunks else [{'type': 'text', 'text': {'content': ''}}]


def get_heading_level(line):
    """Return heading level (1-3) or None"""
    if line.startswith('### '):
        return 3
    elif line.startswith('## '):
        return 2
    elif line.startswith('# '):
        return 1
    return None


def parse_single_block(lines, idx):
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
            'quote': {'rich_text': create_rich_text(' '.join(quote_lines))}
        }, i)

    # Bulleted lists
    if line.startswith('- ') or line.startswith('* '):
        return ({
            'object': 'block',
            'type': 'bulleted_list_item',
            'bulleted_list_item': {'rich_text': create_rich_text(line[2:])}
        }, idx + 1)

    # Numbered lists
    if re.match(r'^\d+\.\s', line):
        match = re.match(r'^\d+\.\s(.*)$', line)
        return ({
            'object': 'block',
            'type': 'numbered_list_item',
            'numbered_list_item': {'rich_text': create_rich_text(match.group(1))}
        }, idx + 1)

    # Tables
    if '|' in line and idx + 1 < len(lines) and '---' in lines[idx + 1]:
        header = [cell.strip() for cell in line.split('|')[1:-1]]
        table_blocks = [{
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': create_rich_text('**' + ' | '.join(header) + '**')}
        }]

        i = idx + 2
        while i < len(lines) and '|' in lines[i] and lines[i].strip():
            row = [cell.strip() for cell in lines[i].split('|')[1:-1]]
            table_blocks.append({
                'object': 'block',
                'type': 'bulleted_list_item',
                'bulleted_list_item': {'rich_text': create_rich_text(' | '.join(row))}
            })
            i += 1
        return (table_blocks, i)

    # Toggle markers - these will be handled specially in collect_until_heading
    # Don't parse them here as single blocks
    if line.startswith('**Toggle:'):
        return None, idx

    # Regular paragraph
    return ({
        'object': 'block',
        'type': 'paragraph',
        'paragraph': {'rich_text': create_rich_text(line)}
    }, idx + 1)


def collect_until_heading(lines, start_idx, parent_level):
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
            heading_info, i = parse_heading_section(lines, i)
            if heading_info:
                blocks.append(heading_info)
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

                block, i = parse_single_block(lines, i)
                if block:
                    if isinstance(block, list):
                        for b in block:
                            toggle_children.append({'block': b, 'children': []})
                    elif block is not None:  # parse_single_block can return None now
                        toggle_children.append({'block': block, 'children': []})

            toggle_block = {
                'object': 'block',
                'type': 'toggle',
                'toggle': {'rich_text': create_rich_text(toggle_title)}
            }
            blocks.append({'block': toggle_block, 'children': toggle_children})
            continue

        # Parse regular block
        block, i = parse_single_block(lines, i)
        if block:
            if isinstance(block, list):
                # Table returns list of blocks
                for b in block:
                    blocks.append({'block': b, 'children': []})
            else:
                blocks.append({'block': block, 'children': []})

    return blocks, i


def parse_heading_section(lines, idx):
    """
    Parse a heading and collect all content until next same-level heading.
    Returns (block_info, next_idx) where block_info has 'block' and 'children' keys.
    """
    line = lines[idx]
    level = get_heading_level(line)

    if level is None:
        return None, idx

    # Extract heading text
    if level == 1:
        heading_text = line[2:].strip()
        block_type = 'heading_1'
    elif level == 2:
        heading_text = line[3:].strip()
        block_type = 'heading_2'
    else:
        heading_text = line[4:].strip()
        block_type = 'heading_3'

    # Collect children
    children, next_idx = collect_until_heading(lines, idx + 1, level)

    # Create heading block (without children property initially)
    heading_block = {
        'object': 'block',
        'type': block_type,
        block_type: {
            'rich_text': create_rich_text(heading_text),
            'is_toggleable': True
        }
    }

    return {'block': heading_block, 'children': children}, next_idx


def parse_markdown(content):
    """Parse markdown into structured format for Notion upload"""
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
            section, i = parse_heading_section(lines, i)
            if section:
                sections.append(section)
        else:
            # Top-level content (no heading)
            block, i = parse_single_block(lines, i)
            if block:
                if isinstance(block, list):
                    for b in block:
                        sections.append({'block': b, 'children': []})
                else:
                    sections.append({'block': block, 'children': []})

    return sections


def upload_blocks_with_children(notion, parent_id, sections, depth=0):
    """
    Upload blocks in batches, then handle children.
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
            print(f"{indent}Uploading {len(batch)} blocks (batch {i//100 + 1})")
            notion.blocks.children.append(
                block_id=parent_id,
                children=batch
            )

    # Upload blocks with children one at a time, then recursively upload their children
    for section in blocks_with_children:
        block = section['block']
        children = section['children']
        block_type = block.get('type', 'unknown')

        print(f"{indent}Uploading {block_type} with {len(children)} children")

        response = notion.blocks.children.append(
            block_id=parent_id,
            children=[block]
        )

        created_block = response['results'][0]
        block_id = created_block['id']

        # Recursively upload children
        upload_blocks_with_children(notion, block_id, children, depth + 1)

    return True


def main():
    session_file = Path('Sessions/Session_3_The_Steel_Dragon_Begins.md')
    with open(session_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)

    print("Parsing markdown with hierarchical structure...")
    sections = parse_markdown(post.content)
    print(f"Parsed {len(sections)} top-level sections")

    # Initialize Notion client
    notion = Client(auth=load_notion_key())

    # Create page properties
    properties = {
        'Name': {'title': [{'text': {'content': 'Session 3: The Steel Dragon Begins - NESTED'}}]},
        'Status': {'select': {'name': post.get('status', 'Planning')}},
        'File Path': {'rich_text': [{'text': {'content': 'Sessions/Session_3_The_Steel_Dragon_Begins.md - NESTED'}}]},
    }

    tags_list = post.get('tags', [])
    if 'session' not in [t.lower() for t in tags_list]:
        tags_list.append('session')
    properties['Tags'] = {'multi_select': [{'name': tag} for tag in tags_list]}

    if 'session_number' in post:
        properties['Session Number'] = {'number': post.get('session_number')}

    print("Creating Notion page...")
    page = notion.pages.create(
        parent={'database_id': DATABASE_ID},
        properties=properties
    )

    page_id = page['id']
    print(f"✅ Created page: {page_id}")

    print("Uploading blocks with nested children...")
    upload_blocks_with_children(notion, page_id, sections)

    print(f"\n✅ Upload complete!")
    print(f"   Page ID: {page_id}")
    print(f"\nVerify in Notion:")
    print(f"   - Session Flowchart contains mermaid code block as child")
    print(f"   - Quick Reference contains 3 toggles as children")
    print(f"   - All H2/H3 headings have their content as children")

if __name__ == '__main__':
    main()
