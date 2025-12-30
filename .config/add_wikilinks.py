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
    """Load all entity names and aliases from WIKI_INDEX.md"""
    wiki_index_path = Path("WIKI_INDEX.md")
    if not wiki_index_path.exists():
        print(f"❌ Error: WIKI_INDEX.md not found")
        sys.exit(1)

    entities = set()
    aliases = {}  # alias -> full_name mapping

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
                    full_name = parts[1]
                    entities.add(full_name)

                    # Create aliases for common patterns
                    # "Geist (Bandit Lieutenant)" → alias "Geist"
                    if '(' in full_name and ')' in full_name:
                        simple_name = full_name.split('(')[0].strip()
                        if simple_name:
                            aliases[simple_name] = full_name

                    # "Kyle/Nameless" → aliases "Kyle" and "Nameless"
                    if '/' in full_name:
                        for part in full_name.split('/'):
                            part = part.strip()
                            if part and len(part) > 2:  # Avoid very short aliases
                                aliases[part] = full_name

                    # "Ian/Rakash" → aliases "Ian" and "Rakash"
                    # Already handled by above

    print(f"📋 Loaded {len(entities)} entity names + {len(aliases)} aliases from WIKI_INDEX.md")
    return entities, aliases

def add_wikilinks_to_file(file_path, entities, aliases, dry_run=False):
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
    current_entity_name = None

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = '---' + parts[1] + '---'
            body = parts[2]

            # Extract current file's entity name from frontmatter to prevent self-references
            for line in parts[1].split('\n'):
                if line.strip().startswith('name:'):
                    current_entity_name = line.split('name:', 1)[1].strip().strip('"').strip("'")
                    break

    # Combine entities and aliases, prioritize by length
    # Create list of (search_term, wiki_name) tuples
    search_terms = []

    # Add full entity names (skip current file's entity to prevent self-reference)
    for entity in entities:
        if current_entity_name and entity == current_entity_name:
            continue  # Skip self-reference
        search_terms.append((entity, entity))

    # Add aliases that map to full names (skip if alias maps to current entity)
    for alias, full_name in aliases.items():
        if current_entity_name and full_name == current_entity_name:
            continue  # Skip self-reference via alias
        search_terms.append((alias, full_name))

    # Sort by search term length (longest first) to avoid partial matches
    search_terms.sort(key=lambda x: len(x[0]), reverse=True)

    for search_term, wiki_name in search_terms:
        # Skip if this search term or wiki name is already wikilinked in body
        if f"[[{search_term}]]" in body or f"[[{wiki_name}]]" in body:
            continue

        # Create regex pattern for search term
        # Match whole word, not already in [[brackets]] or markdown link [text](url)
        # Negative lookbehind: not preceded by [[ or ](
        # Negative lookahead: not followed by ]] or )
        pattern = rf'(?<!\[\[)(?<!\]\()(\b{re.escape(search_term)}\b)(?!\]\])(?!\))'

        # Count matches before replacement (only in body)
        matches = re.findall(pattern, body)
        if matches:
            # Replace with wikilink using the full wiki name
            replacement = rf'[[{wiki_name}]]'
            body, count = re.subn(pattern, replacement, body)
            if count > 0:
                links_added += count
                if search_term != wiki_name:
                    print(f"  ✓ Added {count}x [[{wiki_name}]] (matched '{search_term}')")
                else:
                    print(f"  ✓ Added {count}x [[{wiki_name}]]")

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
        print("Supports entity aliases (e.g., 'Geist' → 'Geist (Bandit Lieutenant)')")
        sys.exit(1)

    file_path = sys.argv[1]
    dry_run = '--dry-run' in sys.argv

    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")

    entities, aliases = load_entity_names()
    links_added = add_wikilinks_to_file(file_path, entities, aliases, dry_run)

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Total links added: {links_added}")

if __name__ == '__main__':
    main()
