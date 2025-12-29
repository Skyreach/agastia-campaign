#!/usr/bin/env python3
"""
Test script v2: Upload Session 3 with proper hierarchical toggle nesting.
Headings become toggleable blocks with all content until the next same-level heading as children.
"""
import os
import sys
import re
from pathlib import Path
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.10/site-packages'))

from notion_client import Client
import frontmatter

# Load Notion API key
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

    # Simple bold/italic/code parsing
    pattern = r'(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)'
    last_end = 0

    for match in re.finditer(pattern, text):
        # Plain text before match
        if match.start() > last_end:
            plain = text[last_end:match.start()]
            if plain:
                chunks.append({'type': 'text', 'text': {'content': plain}})

        matched = match.group()

        # Code
        if matched.startswith('`') and matched.endswith('`'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[1:-1]},
                'annotations': {'code': True}
            })
        # Bold
        elif matched.startswith('**') and matched.endswith('**'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[2:-2]},
                'annotations': {'bold': True}
            })
        # Italic
        elif matched.startswith('*') and matched.endswith('*'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[1:-1]},
                'annotations': {'italic': True}
            })
        # Strikethrough
        elif matched.startswith('~~') and matched.endswith('~~'):
            chunks.append({
                'type': 'text',
                'text': {'content': matched[2:-2]},
                'annotations': {'strikethrough': True}
            })

        last_end = match.end()

    # Remaining text
    if last_end < len(text):
        chunks.append({'type': 'text', 'text': {'content': text[last_end:]}})

    return chunks if chunks else [{'type': 'text', 'text': {'content': ''}}]


def get_heading_level(line):
    """Return heading level (1-3) or None if not a heading"""
    if line.startswith('### '):
        return 3
    elif line.startswith('## '):
        return 2
    elif line.startswith('# '):
        return 1
    return None


def parse_content_block(lines, start_idx):
    """
    Parse a single content block (not a heading) starting at start_idx.
    Returns (block_dict, next_idx)
    """
    line = lines[start_idx]

    # Skip empty lines
    if not line.strip():
        return (None, start_idx + 1)

    # Blockquotes
    if line.startswith('> '):
        quote_lines = []
        i = start_idx
        while i < len(lines) and lines[i].startswith('> '):
            quote_lines.append(lines[i][2:])
            i += 1
        return ({
            'object': 'block',
            'type': 'quote',
            'quote': {'rich_text': create_rich_text(' '.join(quote_lines))}
        }, i)

    # Code blocks
    if line.startswith('```'):
        code_lines = []
        language = line[3:].strip() or 'plain text'
        i = start_idx + 1
        while i < len(lines) and not lines[i].startswith('```'):
            code_lines.append(lines[i])
            i += 1

        code_text = '\n'.join(code_lines)
        return ({
            'object': 'block',
            'type': 'code',
            'code': {
                'rich_text': [{'type': 'text', 'text': {'content': code_text[:2000]}}],
                'language': language
            }
        }, i + 1)  # Skip closing ```

    # Bulleted lists
    if line.startswith('- ') or line.startswith('* '):
        return ({
            'object': 'block',
            'type': 'bulleted_list_item',
            'bulleted_list_item': {'rich_text': create_rich_text(line[2:])}
        }, start_idx + 1)

    # Numbered lists
    if re.match(r'^\d+\.\s', line):
        match = re.match(r'^\d+\.\s(.*)$', line)
        return ({
            'object': 'block',
            'type': 'numbered_list_item',
            'numbered_list_item': {'rich_text': create_rich_text(match.group(1))}
        }, start_idx + 1)

    # Table detection
    if '|' in line and start_idx + 1 < len(lines) and '---' in lines[start_idx + 1]:
        # Parse table rows
        table_blocks = []
        header = [cell.strip() for cell in line.split('|')[1:-1]]

        # Table header as bold paragraph
        table_blocks.append({
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': create_rich_text('**' + ' | '.join(header) + '**')}
        })

        i = start_idx + 2  # Skip separator
        while i < len(lines) and '|' in lines[i] and lines[i].strip():
            row = [cell.strip() for cell in lines[i].split('|')[1:-1]]
            table_blocks.append({
                'object': 'block',
                'type': 'bulleted_list_item',
                'bulleted_list_item': {'rich_text': create_rich_text(' | '.join(row))}
            })
            i += 1

        # Return list of blocks (will be flattened later)
        return (table_blocks, i)

    # Toggle markers (e.g., "**Toggle: Title**")
    if line.startswith('**Toggle:'):
        toggle_title = line.replace('**Toggle:', '').replace('**', '').strip()
        return ({
            'object': 'block',
            'type': 'toggle',
            'toggle': {
                'rich_text': create_rich_text(toggle_title),
                'children': []
            }
        }, start_idx + 1)

    # Regular paragraph
    return ({
        'object': 'block',
        'type': 'paragraph',
        'paragraph': {'rich_text': create_rich_text(line)}
    }, start_idx + 1)


def collect_section_content(lines, start_idx, parent_level):
    """
    Collect all content under a heading until the next heading of same/higher level.
    Returns (list of blocks, next_idx)
    """
    blocks = []
    i = start_idx

    while i < len(lines):
        line = lines[i]

        # Check if we've hit a heading of same or higher level
        level = get_heading_level(line)
        if level is not None and level <= parent_level:
            # Stop here, don't consume this line
            break

        # Check if it's a lower-level heading (becomes nested toggle)
        if level is not None and level > parent_level:
            # Parse as nested heading
            heading_block, i = parse_heading_with_children(lines, i)
            if heading_block:
                blocks.append(heading_block)
            continue

        # Parse regular content block
        block, i = parse_content_block(lines, i)
        if block:
            # Handle table blocks (which return a list)
            if isinstance(block, list):
                blocks.extend(block)
            else:
                blocks.append(block)

    return blocks, i


def parse_heading_with_children(lines, idx):
    """
    Parse a heading and all its children content.
    Returns (heading_block_with_children, next_idx)
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
    else:  # level == 3
        heading_text = line[4:].strip()
        block_type = 'heading_3'

    # Collect all content until next same/higher level heading
    children, next_idx = collect_section_content(lines, idx + 1, level)

    # Create heading block
    heading_block = {
        'object': 'block',
        'type': block_type,
        block_type: {
            'rich_text': create_rich_text(heading_text),
            'is_toggleable': True,
            'children': children[:100] if children else []  # Notion limit
        }
    }

    # If we have more than 100 children, we'll need to append them later
    # For now, just take the first 100
    if len(children) > 100:
        print(f"⚠️  Warning: Heading '{heading_text}' has {len(children)} children, truncating to 100")

    return heading_block, next_idx


def parse_markdown_to_blocks(content):
    """Convert markdown to Notion blocks with proper hierarchical nesting"""
    lines = content.split('\n')
    blocks = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip empty lines at document start
        if not blocks and not line.strip():
            i += 1
            continue

        # Check if it's a heading
        level = get_heading_level(line)
        if level is not None:
            heading_block, i = parse_heading_with_children(lines, i)
            if heading_block:
                blocks.append(heading_block)
        else:
            # Top-level content (no heading parent)
            block, i = parse_content_block(lines, i)
            if block:
                if isinstance(block, list):
                    blocks.extend(block)
                else:
                    blocks.append(block)

    return blocks


def main():
    # Read Session 3
    session_file = Path('Sessions/Session_3_The_Steel_Dragon_Begins.md')
    with open(session_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)

    # Parse content
    blocks = parse_markdown_to_blocks(post.content)

    print(f"Parsed {len(blocks)} top-level blocks from markdown")

    # Initialize Notion client
    notion = Client(auth=load_notion_key())

    # Create page properties
    properties = {
        'Name': {'title': [{'text': {'content': 'Session 3: The Steel Dragon Begins - TEST v2'}}]},
        'Status': {'select': {'name': post.get('status', 'Planning')}},
        'File Path': {'rich_text': [{'text': {'content': 'Sessions/Session_3_The_Steel_Dragon_Begins.md - TEST v2'}}]},
    }

    # Add tags (include session type in tags)
    tags_list = post.get('tags', [])
    if 'session' not in [t.lower() for t in tags_list]:
        tags_list.append('session')
    properties['Tags'] = {'multi_select': [{'name': tag} for tag in tags_list]}

    # Add session number if present
    if 'session_number' in post:
        properties['Session Number'] = {'number': post.get('session_number')}

    # Create page with blocks (max 100 at a time)
    print("Creating Notion page...")

    # First batch (max 100 blocks)
    children = blocks[:100]

    page = notion.pages.create(
        parent={'database_id': DATABASE_ID},
        properties=properties,
        children=children
    )

    page_id = page['id']
    print(f"✅ Created page: {page_id}")
    print(f"   Uploaded {len(children)} blocks in first batch")

    # Append remaining blocks if any
    remaining = blocks[100:]
    while remaining:
        batch = remaining[:100]
        notion.blocks.children.append(
            block_id=page_id,
            children=batch
        )
        print(f"   Appended {len(batch)} more blocks")
        remaining = remaining[100:]

    print(f"\n✅ Test upload complete!")
    print(f"   Total blocks: {len(blocks)}")
    print(f"   Page ID: {page_id}")
    print(f"\nCheck Notion to verify:")
    print(f"   - Session Flowchart contains mermaid code block")
    print(f"   - Quick Reference contains Session Flow, Key NPCs, etc. as children")
    print(f"   - All H2/H3 headings are toggleable with nested content")

if __name__ == '__main__':
    main()
