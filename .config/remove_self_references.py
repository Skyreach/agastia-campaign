#!/usr/bin/env python3
"""
Remove self-referencing wikilinks from markdown files.

Scans markdown files and removes [[Entity Name]] wikilinks when the
entity name matches the file's own frontmatter name field.
"""

import re
import sys
from pathlib import Path

def remove_self_references_from_file(file_path, dry_run=False):
    """Remove self-referencing wikilinks from a markdown file"""
    file_path = Path(file_path)

    if not file_path.exists():
        print(f"❌ Error: File not found: {file_path}")
        return 0

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    references_removed = 0

    # Split frontmatter from content
    frontmatter = ""
    body = content
    current_entity_name = None

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = '---' + parts[1] + '---'
            body = parts[2]

            # Extract current file's entity name from frontmatter
            for line in parts[1].split('\n'):
                if line.strip().startswith('name:'):
                    current_entity_name = line.split('name:', 1)[1].strip().strip('"').strip("'")
                    break

    if not current_entity_name:
        print(f"⏭️  Skipped: {file_path} (no name in frontmatter)")
        return 0

    # Search for self-referencing wikilinks
    # Pattern: [[Entity Name]] where Entity Name matches current file's name
    pattern = rf'\[\[{re.escape(current_entity_name)}\]\]'

    # Count matches before removal
    matches = re.findall(pattern, body)
    if matches:
        # Remove self-referencing wikilinks (replace with plain text)
        body, count = re.subn(pattern, current_entity_name, body)
        references_removed = count

        if dry_run:
            print(f"  ⚠️  Found {count}x [[{current_entity_name}]] self-reference(s) in {file_path}")
        else:
            print(f"  ✓ Removed {count}x [[{current_entity_name}]] from {file_path}")

    # Reconstruct file with frontmatter preserved
    final_content = frontmatter + body if frontmatter else body

    if references_removed > 0 and not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_content)

    return references_removed

def scan_directory(directory, dry_run=False):
    """Scan all markdown files in directory for self-references"""
    directory = Path(directory)
    total_removed = 0
    files_affected = 0

    # Find all markdown files
    md_files = list(directory.rglob('*.md'))

    # Exclude certain directories
    excluded_dirs = {'.git', 'node_modules', '.working', '.config'}
    md_files = [f for f in md_files if not any(part in excluded_dirs for part in f.parts)]

    print(f"{'🔍 DRY RUN MODE - No files will be modified' if dry_run else '🔧 REMOVING SELF-REFERENCES'}\n")
    print(f"Scanning {len(md_files)} markdown files...\n")

    for md_file in sorted(md_files):
        removed = remove_self_references_from_file(md_file, dry_run)
        if removed > 0:
            total_removed += removed
            files_affected += 1

    print(f"\n{'[DRY RUN] ' if dry_run else ''}Summary:")
    print(f"  Files with self-references: {files_affected}")
    print(f"  Total self-references {'found' if dry_run else 'removed'}: {total_removed}")

    return total_removed

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 remove_self_references.py <file_or_directory> [--dry-run]")
        print("\nRemoves [[Entity Name]] wikilinks when entity name matches file's frontmatter name")
        print("\nExamples:")
        print("  python3 remove_self_references.py Locations/Cities/Agastia_City.md --dry-run")
        print("  python3 remove_self_references.py . --dry-run")
        print("  python3 remove_self_references.py .")
        sys.exit(1)

    target = sys.argv[1]
    dry_run = '--dry-run' in sys.argv

    target_path = Path(target)

    if target_path.is_file():
        # Single file
        removed = remove_self_references_from_file(target_path, dry_run)
        print(f"\n{'[DRY RUN] ' if dry_run else ''}Total self-references {'found' if dry_run else 'removed'}: {removed}")
    elif target_path.is_dir():
        # Directory (recursive scan)
        scan_directory(target_path, dry_run)
    else:
        print(f"❌ Error: Not a valid file or directory: {target}")
        sys.exit(1)

if __name__ == '__main__':
    main()
