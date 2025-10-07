#!/usr/bin/env python3
"""
Preprocess dungeon markdown to match Notion's expected structure

Strategy: Transform ambiguous markdown into explicit nested structure
that the basic sync script can handle correctly.
"""

import re
from pathlib import Path

def preprocess_corridors_section(lines, start_idx):
    """
    Transform:
        - **Corridor Name**
            - Property: value

    Into:
        <TOGGLE>Corridor Name</TOGGLE>
        - Property: value
        <END_TOGGLE>
    """
    result = []
    i = start_idx

    while i < len(lines):
        line = lines[i]

        # Check if we hit next section
        if line.startswith('#'):
            break

        # Detect corridor pattern: - **Name...**
        if re.match(r'^\s*-\s+\*\*(.+?)\*\*\s*$', line):
            match = re.match(r'^\s*-\s+\*\*(.+?)\*\*\s*$', line)
            corridor_name = match.group(1)
            result.append(f'<TOGGLE>{corridor_name}</TOGGLE>')

            # Collect indented children
            i += 1
            while i < len(lines) and lines[i].startswith('    -'):
                # Remove one level of indentation
                result.append(lines[i][4:])
                i += 1

            result.append('<END_TOGGLE>')
            result.append('')
            continue

        result.append(line)
        i += 1

    return result, i

def preprocess_heading_sections(content):
    """
    Wrap content under headings to make them explicit children

    Transform:
        ## Heading
        Content
        Content

    Into:
        <HEADING_START>## Heading</HEADING_START>
        Content
        Content
        <HEADING_END>
    """
    lines = content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Detect heading
        if re.match(r'^##\s+', line):
            result.append(f'<HEADING_START>{line}</HEADING_START>')
            i += 1

            # Collect content until next heading or toggle
            while i < len(lines):
                next_line = lines[i]
                if next_line.startswith('##') or next_line.startswith('<TOGGLE>'):
                    result.append('<HEADING_END>')
                    break
                result.append(next_line)
                i += 1
            else:
                result.append('<HEADING_END>')
            continue

        result.append(line)
        i += 1

    return '\n'.join(result)

def preprocess_file(input_path, output_path):
    """Main preprocessing pipeline"""

    with open(input_path, 'r') as f:
        content = f.read()

    # Split frontmatter and content
    parts = content.split('---\n', 2)
    if len(parts) == 3:
        frontmatter = f"---\n{parts[1]}---\n"
        body = parts[2]
    else:
        frontmatter = ""
        body = content

    # Step 1: Process corridors section
    lines = body.split('\n')
    processed_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Detect corridors section
        if 'Corridors & Connections' in line:
            processed_lines.append(line)
            i += 1
            # Process corridor entries
            corridor_lines, i = preprocess_corridors_section(lines, i)
            processed_lines.extend(corridor_lines)
            continue

        processed_lines.append(line)
        i += 1

    body = '\n'.join(processed_lines)

    # Step 2: Wrap heading sections
    body = preprocess_heading_sections(body)

    # Write output
    with open(output_path, 'w') as f:
        f.write(frontmatter + body)

    print(f"Preprocessed: {input_path} → {output_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python preprocess_dungeon_markdown.py <input_file> [output_file]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace('.md', '_preprocessed.md')

    preprocess_file(input_file, output_file)
