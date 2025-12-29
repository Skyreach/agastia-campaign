#!/usr/bin/env python3
"""
Test script to upload Session 3 with proper Notion block structure.
This creates a new page to test formatting without overwriting the existing one.
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

def parse_markdown_to_blocks(content):
    """Convert markdown content to Notion blocks"""
    blocks = []
    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]

        # Skip empty lines
        if not line.strip():
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            blocks.append({
                'object': 'block',
                'type': 'heading_1',
                'heading_1': {'rich_text': create_rich_text(line[2:])}
            })
            i += 1
        elif line.startswith('## '):
            blocks.append({
                'object': 'block',
                'type': 'heading_2',
                'heading_2': {'rich_text': create_rich_text(line[3:])}
            })
            i += 1
        elif line.startswith('### '):
            blocks.append({
                'object': 'block',
                'type': 'heading_3',
                'heading_3': {'rich_text': create_rich_text(line[4:])}
            })
            i += 1

        # Blockquotes
        elif line.startswith('> '):
            quote_lines = []
            while i < len(lines) and lines[i].startswith('> '):
                quote_lines.append(lines[i][2:])
                i += 1
            blocks.append({
                'object': 'block',
                'type': 'quote',
                'quote': {'rich_text': create_rich_text(' '.join(quote_lines))}
            })

        # Code blocks
        elif line.startswith('```'):
            code_lines = []
            language = line[3:].strip() or 'plain text'
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1  # Skip closing ```

            code_text = '\n'.join(code_lines)
            # Split long code blocks into chunks
            for chunk in [code_text[j:j+2000] for j in range(0, len(code_text), 2000)]:
                blocks.append({
                    'object': 'block',
                    'type': 'code',
                    'code': {
                        'rich_text': [{'type': 'text', 'text': {'content': chunk}}],
                        'language': language
                    }
                })

        # Bulleted lists
        elif line.startswith('- ') or line.startswith('* '):
            blocks.append({
                'object': 'block',
                'type': 'bulleted_list_item',
                'bulleted_list_item': {'rich_text': create_rich_text(line[2:])}
            })
            i += 1

        # Numbered lists
        elif re.match(r'^\d+\.\s', line):
            match = re.match(r'^\d+\.\s(.*)$', line)
            blocks.append({
                'object': 'block',
                'type': 'numbered_list_item',
                'numbered_list_item': {'rich_text': create_rich_text(match.group(1))}
            })
            i += 1

        # Table detection (simple)
        elif '|' in line and i + 1 < len(lines) and '---' in lines[i + 1]:
            # Parse table
            header = [cell.strip() for cell in line.split('|')[1:-1]]
            i += 2  # Skip separator

            # For now, convert table to bulleted list (Notion tables are complex)
            blocks.append({
                'object': 'block',
                'type': 'paragraph',
                'paragraph': {'rich_text': create_rich_text('**Table: ' + ' | '.join(header) + '**')}
            })

            while i < len(lines) and '|' in lines[i]:
                row = [cell.strip() for cell in lines[i].split('|')[1:-1]]
                blocks.append({
                    'object': 'block',
                    'type': 'bulleted_list_item',
                    'bulleted_list_item': {'rich_text': create_rich_text(' | '.join(row))}
                })
                i += 1

        # Toggle blocks (special handling for "**Toggle: ...**")
        elif line.startswith('**Toggle:'):
            toggle_title = line.replace('**Toggle:', '').replace('**', '').strip()
            blocks.append({
                'object': 'block',
                'type': 'toggle',
                'toggle': {
                    'rich_text': create_rich_text(toggle_title),
                    'children': []  # Will need to collect children
                }
            })
            i += 1

        # Regular paragraphs
        else:
            blocks.append({
                'object': 'block',
                'type': 'paragraph',
                'paragraph': {'rich_text': create_rich_text(line)}
            })
            i += 1

    return blocks

def main():
    # Read Session 3
    session_file = Path('Sessions/Session_3_The_Steel_Dragon_Begins.md')
    with open(session_file, 'r', encoding='utf-8') as f:
        post = frontmatter.load(f)

    # Parse content
    blocks = parse_markdown_to_blocks(post.content)

    print(f"Parsed {len(blocks)} blocks from markdown")

    # Initialize Notion client
    notion = Client(auth=load_notion_key())

    # Create page properties
    properties = {
        'Name': {'title': [{'text': {'content': 'Session 3: The Steel Dragon Begins - TEST'}}]},
        'Status': {'select': {'name': post.get('status', 'Planning')}},
        'File Path': {'rich_text': [{'text': {'content': 'Sessions/Session_3_The_Steel_Dragon_Begins.md - TEST'}}]},
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

if __name__ == '__main__':
    main()
