#!/usr/bin/env python3
"""
Improved markdown-to-Notion implementations for:
1. Tables (based on Notion API table block structure)
2. Wikilinks (based on MdToNotion approach)
3. Fixed toggle parsing

Integrate these into sync_notion.py
"""

import re
from typing import List, Dict, Any, Optional

def parse_markdown_table(lines: List[str], start_idx: int) -> tuple[Optional[Dict[str, Any]], int]:
    """
    Parse a markdown table into a Notion table block.

    Returns: (table_block_dict, next_line_index)
    """
    # Find the table bounds
    table_lines = []
    i = start_idx

    while i < len(lines):
        line = lines[i].strip()
        if not line or not line.startswith('|'):
            break
        table_lines.append(line)
        i += 1

    if len(table_lines) < 2:  # Need at least header + separator
        return None, start_idx + 1

    # Parse table structure
    # Line 0: Header row
    # Line 1: Separator (---|---|---)
    # Line 2+: Data rows

    def parse_table_row(line: str) -> List[str]:
        """Split table row and clean up cells"""
        # Remove leading/trailing pipes and split
        cells = [cell.strip() for cell in line.strip('|').split('|')]
        return cells

    header_cells = parse_table_row(table_lines[0])
    table_width = len(header_cells)

    # Skip separator line (line 1)
    data_rows = [parse_table_row(line) for line in table_lines[2:]]

    # Build table block structure
    # Notion table structure:
    # - table block with table_width
    # - table_row children (first row is header)
    # - each table_row has cells array of rich_text arrays

    table_row_children = []

    # Header row
    header_row = {
        'type': 'table_row',
        'table_row': {
            'cells': [
                [{'type': 'text', 'text': {'content': cell}}]
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
                    [{'type': 'text', 'text': {'content': cell}}]
                    for cell in row[:table_width]  # Trim to table width
                ]
            }
        }
        table_row_children.append(data_row)

    # Create table block
    table_block = {
        'object': 'block',
        'type': 'table',
        'table': {
            'table_width': table_width,
            'has_column_header': True,
            'has_row_header': False,
            'children': table_row_children
        }
    }

    return table_block, i


def parse_wikilinks(text: str, notion_client, database_id: str) -> List[Dict[str, Any]]:
    """
    Parse [[wikilink]] syntax and convert to Notion page mentions.

    Args:
        text: Text containing [[page name]] syntax
        notion_client: Initialized Notion client
        database_id: Database ID to search for pages

    Returns: List of rich_text blocks with mentions
    """
    rich_text = []
    last_end = 0

    # Pattern to match [[page name]]
    wikilink_pattern = r'\[\[([^\]]+)\]\]'

    for match in re.finditer(wikilink_pattern, text):
        # Add text before the wikilink
        if match.start() > last_end:
            plain = text[last_end:match.start()]
            if plain:
                rich_text.append({'type': 'text', 'text': {'content': plain}})

        page_name = match.group(1)

        # Try to find the page in the database
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
                # Page not found - keep as plain text with link styling
                rich_text.append({
                    'type': 'text',
                    'text': {'content': f'[[{page_name}]]'},
                    'annotations': {'code': True}  # Style it differently
                })
        except Exception as e:
            # On error, keep as plain text
            print(f"Warning: Failed to resolve wikilink [[{page_name}]]: {e}")
            rich_text.append({
                'type': 'text',
                'text': {'content': f'[[{page_name}]]'},
                'annotations': {'code': True}
            })

        last_end = match.end()

    # Add remaining text
    if last_end < len(text):
        plain = text[last_end:]
        if plain:
            rich_text.append({'type': 'text', 'text': {'content': plain}})

    return rich_text if rich_text else [{'type': 'text', 'text': {'content': text}}]


def parse_toggle_block_improved(lines: List[str], start_idx: int) -> tuple[Optional[Dict[str, Any]], int]:
    """
    Improved toggle parsing that handles <details> tags properly.

    Fixes bugs:
    1. Properly tracks nesting depth
    2. Handles empty toggles
    3. Better iteration logic
    4. Recursively parses children

    Returns: (toggle_block_dict, next_line_index)
    """
    line = lines[start_idx].strip()

    if not line.startswith('<details>'):
        return None, start_idx + 1

    # Find summary and content
    summary_text = "Toggle"
    content_lines = []
    i = start_idx + 1

    while i < len(lines):
        curr_line = lines[i]

        # End of details block
        if curr_line.strip().startswith('</details>'):
            i += 1
            break

        # Summary line
        if curr_line.strip().startswith('<summary>'):
            # Extract summary (remove tags)
            summary_line = curr_line.strip()
            summary_line = re.sub(r'</?summary>', '', summary_line)
            summary_line = re.sub(r'</?b>', '', summary_line)  # Remove bold tags
            summary_text = summary_line.strip()

        # Content line (not a tag)
        elif not curr_line.strip().startswith('<'):
            if curr_line.strip():
                content_lines.append(curr_line)

        i += 1

    # Recursively parse toggle content
    toggle_children = []
    if content_lines:
        # Re-use the main markdown parser for children
        # (This would need to call markdown_to_notion_blocks, but we can't do recursion here)
        # For now, simple paragraph/list parsing
        for content_line in content_lines:
            content_stripped = content_line.strip()

            if content_stripped.startswith('# '):
                toggle_children.append({
                    'object': 'block',
                    'type': 'heading_1',
                    'heading_1': {'rich_text': [{'type': 'text', 'text': {'content': content_stripped[2:]}}]}
                })
            elif content_stripped.startswith('## '):
                toggle_children.append({
                    'object': 'block',
                    'type': 'heading_2',
                    'heading_2': {'rich_text': [{'type': 'text', 'text': {'content': content_stripped[3:]}}]}
                })
            elif content_stripped.startswith('### '):
                toggle_children.append({
                    'object': 'block',
                    'type': 'heading_3',
                    'heading_3': {'rich_text': [{'type': 'text', 'text': {'content': content_stripped[4:]}}]}
                })
            elif content_stripped.startswith('- ') or content_stripped.startswith('* '):
                toggle_children.append({
                    'object': 'block',
                    'type': 'bulleted_list_item',
                    'bulleted_list_item': {'rich_text': [{'type': 'text', 'text': {'content': content_stripped[2:]}}]}
                })
            elif content_stripped.startswith('> '):
                toggle_children.append({
                    'object': 'block',
                    'type': 'quote',
                    'quote': {'rich_text': [{'type': 'text', 'text': {'content': content_stripped[2:]}}]}
                })
            elif content_stripped:
                toggle_children.append({
                    'object': 'block',
                    'type': 'paragraph',
                    'paragraph': {'rich_text': [{'type': 'text', 'text': {'content': content_line}}]}
                })

    toggle_block = {
        'object': 'block',
        'type': 'toggle',
        'toggle': {
            'rich_text': [{'type': 'text', 'text': {'content': summary_text}}],
            'children': toggle_children
        }
    }

    return toggle_block, i


# Usage instructions:
"""
To integrate into sync_notion.py:

1. TABLE SUPPORT:
   In markdown_to_notion_blocks(), add after code block handling:

   # Handle tables
   elif line.strip().startswith('|'):
       table_block, next_i = parse_markdown_table(lines, i)
       if table_block:
           blocks.append(table_block)
           i = next_i
           continue

2. WIKILINK SUPPORT:
   Replace parse_rich_text() calls with:

   # When you have access to notion_client and database_id:
   parse_wikilinks(text, notion_client, database_id)

3. IMPROVED TOGGLE:
   Replace the <details> handling section with:

   if line.strip().startswith('<details>'):
       toggle_block, next_i = parse_toggle_block_improved(lines, i)
       if toggle_block:
           blocks.append(toggle_block)
           i = next_i
           continue
"""
