#!/usr/bin/env python3
"""
Add wikilinks to markdown files based on WIKI_INDEX.md entity names.

Scans a markdown file for mentions of entities tracked in WIKI_INDEX.md
and wraps them in [[wikilinks]] for Notion cross-referencing.
"""

import re
import sys
from pathlib import Path

def load_entity_names():
    """Load all entity names from WIKI_INDEX.md"""
    wiki_index_path = Path("WIKI_INDEX.md")
    if not wiki_index_path.exists():
        print(f"❌ Error: WIKI_INDEX.md not found")
        sys.exit(1)

    entities = set()

    with open(wiki_index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract entity names from markdown tables
    # Format: | Name | File | Notion ID | Last Synced |
    for line in content.split('\n'):
        if line.startswith('|') and '|' in line[1:]:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 3 and parts[1] and not parts[1].startswith('-'):
                # Skip header rows and empty cells
                if parts[1] not in ['Name', 'name', '']:
                    entities.add(parts[1])

    print(f"📋 Loaded {len(entities)} entity names from WIKI_INDEX.md")
    return entities

def add_wikilinks_to_file(file_path, entities, dry_run=False):
    """Add [[wikilinks]] to entity mentions in a markdown file"""
    file_path = Path(file_path)

    if not file_path.exists():
        print(f"❌ Error: File not found: {file_path}")
        return 0

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    links_added = 0

    # Split frontmatter from content
    # Frontmatter is between --- at start of file
    frontmatter = ""
    body = content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = '---' + parts[1] + '---'
            body = parts[2]

    # Sort entities by length (longest first) to avoid partial matches
    # e.g., "Merchant District" should be matched before "Merchant"
    sorted_entities = sorted(entities, key=len, reverse=True)

    for entity in sorted_entities:
        # Skip if entity is already wikilinked in body
        if f"[[{entity}]]" in body:
            continue

        # Create regex pattern for entity name
        # Match whole word, not already in [[brackets]] or markdown link [text](url)
        # Negative lookbehind: not preceded by [[ or ](
        # Negative lookahead: not followed by ]] or )
        pattern = rf'(?<!\[\[)(?<!\]\()(\b{re.escape(entity)}\b)(?!\]\])(?!\))'

        # Count matches before replacement (only in body)
        matches = re.findall(pattern, body)
        if matches:
            # Replace with wikilink (only in body)
            replacement = rf'[[\1]]'
            body, count = re.subn(pattern, replacement, body)
            if count > 0:
                links_added += count
                print(f"  ✓ Added {count}x [[{entity}]]")

    # Reconstruct file with frontmatter preserved
    final_content = frontmatter + body if frontmatter else body

    if links_added > 0:
        if dry_run:
            print(f"\n📊 DRY RUN: Would add {links_added} wikilinks to {file_path}")
        else:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            print(f"\n✅ Added {links_added} wikilinks to {file_path}")
    else:
        print(f"\n⏭️  No wikilinks needed for {file_path}")

    return links_added

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 add_wikilinks.py <file_path> [--dry-run]")
        print("\nAdds [[wikilinks]] to entity mentions based on WIKI_INDEX.md")
        sys.exit(1)

    file_path = sys.argv[1]
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")

    entities = load_entity_names()
    links_added = add_wikilinks_to_file(file_path, entities, dry_run)

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Total links added: {links_added}")

if __name__ == '__main__':
    main()
