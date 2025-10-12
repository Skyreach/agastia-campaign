#!/usr/bin/env python3
"""
Auto-Fix Format Script

Automatically repairs common format violations in entity files.
Only performs SAFE repairs - doesn't modify content, only fixes structure.
"""

import sys
import re
import pathlib
from typing import List, Tuple

def add_missing_version(content: str, frontmatter_end: int) -> Tuple[str, List[str]]:
    """Add missing version field to frontmatter (defaults to 1.0.0)"""
    fixes = []

    # Check if version already exists
    if re.search(r'^version:', content[:frontmatter_end], re.MULTILINE):
        return content, fixes

    # Find end of frontmatter (before closing ---)
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if i > 0 and line.strip() == '---':
            # Insert version before closing ---
            lines.insert(i, 'version: "1.0.0"')
            fixes.append("Added missing version field (defaulted to 1.0.0)")
            return '\n'.join(lines), fixes

    return content, fixes

def convert_html_to_toggles(content: str) -> Tuple[str, List[str]]:
    """Convert HTML <details> tags to Notion toggles"""
    fixes = []
    original = content

    # Pattern: <details>\n<summary>Title</summary>\nContent\n</details>
    def replace_details(match):
        title = match.group(1).strip()
        body = match.group(2).strip()

        # Remove HTML tags from title
        title = re.sub(r'<[^>]+>', '', title)

        fixes.append(f"Converted HTML details tag to Notion toggle: {title}")
        return f"**Toggle: {title}**\n{body}"

    # Replace <details> blocks
    content = re.sub(
        r'<details>\s*<summary>(.*?)</summary>\s*(.*?)</details>',
        replace_details,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # If no <details> found, check for standalone tags and warn
    if content == original:
        if re.search(r'<details>|<summary>', content, re.IGNORECASE):
            fixes.append("WARNING: Found incomplete HTML tags - manual fix required")

    return content, fixes

def fix_heading_hierarchy(content: str) -> Tuple[str, List[str]]:
    """Fix skipped heading levels (e.g., H2 → H4 without H3)"""
    fixes = []
    lines = content.split('\n')
    prev_level = 1  # H1 level
    fixed_lines = []

    for line in lines:
        # Match heading
        match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if match:
            current_hashes = match.group(1)
            current_level = len(current_hashes)
            text = match.group(2)

            # Check if we skipped a level
            if current_level > prev_level + 1:
                # Downgrade to one level below previous
                new_level = prev_level + 1
                new_line = '#' * new_level + ' ' + text
                fixed_lines.append(new_line)
                fixes.append(f"Fixed heading hierarchy: '{text}' from H{current_level} to H{new_level}")
                prev_level = new_level
            else:
                fixed_lines.append(line)
                prev_level = current_level
        else:
            fixed_lines.append(line)

    if fixes:
        return '\n'.join(fixed_lines), fixes
    return content, fixes

def lowercase_tags(content: str) -> Tuple[str, List[str]]:
    """Convert uppercase tags to lowercase in frontmatter"""
    fixes = []

    def fix_tags_line(match):
        tags_str = match.group(1)
        original_tags = [t.strip() for t in tags_str.split(',')]
        fixed_tags = [t.lower() for t in original_tags]

        if original_tags != fixed_tags:
            changed = [f"{orig} → {fixed}" for orig, fixed in zip(original_tags, fixed_tags) if orig != fixed]
            fixes.append(f"Lowercased tags: {', '.join(changed)}")

        return f"tags: [{', '.join(fixed_tags)}]"

    content = re.sub(r'^tags:\s*\[(.*?)\]', fix_tags_line, content, flags=re.MULTILINE)

    return content, fixes

def ensure_h1_matches_name(content: str) -> Tuple[str, List[str]]:
    """Ensure H1 title matches frontmatter name"""
    fixes = []

    # Extract frontmatter name
    name_match = re.search(r'^name:\s*(.+)$', content, re.MULTILINE)
    if not name_match:
        return content, fixes

    name = name_match.group(1).strip().strip('"').strip("'")

    # Find H1
    h1_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    if not h1_match:
        # Add H1 after frontmatter
        frontmatter_end = content.find('---', 3) + 3
        if frontmatter_end > 2:
            content = content[:frontmatter_end] + f"\n\n# {name}" + content[frontmatter_end:]
            fixes.append(f"Added missing H1 title: {name}")
    elif h1_match.group(1).strip() != name:
        # Update H1 to match name
        old_title = h1_match.group(1).strip()
        content = re.sub(r'^# .+$', f'# {name}', content, count=1, flags=re.MULTILINE)
        fixes.append(f"Updated H1 title from '{old_title}' to match frontmatter name '{name}'")

    return content, fixes

def add_missing_frontmatter_fields(content: str, entity_type: str) -> Tuple[str, List[str]]:
    """Add commonly missing frontmatter fields with placeholder values"""
    fixes = []

    # Common missing fields
    field_defaults = {
        'status': 'Unknown',
        'tags': '[]',
    }

    lines = content.split('\n')
    frontmatter_end_idx = None

    for i, line in enumerate(lines):
        if i > 0 and line.strip() == '---':
            frontmatter_end_idx = i
            break

    if frontmatter_end_idx is None:
        return content, fixes

    # Check which fields are missing
    frontmatter_block = '\n'.join(lines[1:frontmatter_end_idx])

    for field, default_value in field_defaults.items():
        if not re.search(rf'^{field}:', frontmatter_block, re.MULTILINE):
            # Insert before closing ---
            lines.insert(frontmatter_end_idx, f'{field}: {default_value}')
            fixes.append(f"Added missing frontmatter field: {field} (defaulted to {default_value})")
            frontmatter_end_idx += 1

    if fixes:
        return '\n'.join(lines), fixes

    return content, fixes

def auto_fix_file(file_path: str, dry_run: bool = False) -> List[str]:
    """
    Auto-fix common format violations in a file

    Args:
        file_path: Path to file to fix
        dry_run: If True, report fixes but don't modify file

    Returns:
        List of fixes applied
    """
    all_fixes = []

    try:
        content = pathlib.Path(file_path).read_text()
    except Exception as e:
        print(f"❌ Failed to read {file_path}: {e}")
        return all_fixes

    original_content = content

    # Detect entity type
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    entity_type = "Unknown"
    if frontmatter_match:
        type_match = re.search(r'^type:\s*(.+)$', frontmatter_match.group(1), re.MULTILINE)
        if type_match:
            entity_type = type_match.group(1).strip()

    frontmatter_end = frontmatter_match.end() if frontmatter_match else 0

    # Apply fixes in order
    fixes_to_apply = [
        ("Add missing version", lambda c: add_missing_version(c, frontmatter_end)),
        ("Add missing frontmatter fields", lambda c: add_missing_frontmatter_fields(c, entity_type)),
        ("Convert HTML to toggles", convert_html_to_toggles),
        ("Fix heading hierarchy", fix_heading_hierarchy),
        ("Lowercase tags", lowercase_tags),
        ("Ensure H1 matches name", ensure_h1_matches_name),
    ]

    for fix_name, fix_func in fixes_to_apply:
        content, fixes = fix_func(content)
        if fixes:
            all_fixes.extend(fixes)

    # Write changes if not dry run and changes were made
    if content != original_content and not dry_run:
        try:
            pathlib.Path(file_path).write_text(content)
        except Exception as e:
            print(f"❌ Failed to write {file_path}: {e}")
            return []

    return all_fixes

def main():
    """Main entry point for auto-fix script"""
    if len(sys.argv) < 2:
        print("Usage: auto_fix_format.py [--dry-run] <file1.md> [file2.md] ...")
        print("\nAutomatically fixes common format violations:")
        print("  • Adds missing version field (defaults to 1.0.0)")
        print("  • Adds missing status/tags fields")
        print("  • Converts HTML <details> tags to Notion toggles")
        print("  • Fixes heading hierarchy (no skipped levels)")
        print("  • Lowercases tags in frontmatter")
        print("  • Ensures H1 title matches frontmatter name")
        print("\nOptions:")
        print("  --dry-run    Show what would be fixed without modifying files")
        sys.exit(1)

    dry_run = '--dry-run' in sys.argv
    files = [arg for arg in sys.argv[1:] if arg != '--dry-run']

    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")

    total_fixes = 0
    files_modified = 0

    for file_path in files:
        # Skip non-markdown files
        if not file_path.endswith('.md'):
            continue

        fixes = auto_fix_file(file_path, dry_run=dry_run)

        if fixes:
            files_modified += 1
            total_fixes += len(fixes)
            status = "Would fix" if dry_run else "Fixed"
            print(f"\n{'🔍' if dry_run else '✅'} {status}: {file_path}")
            for fix in fixes:
                print(f"   • {fix}")

    # Summary
    print("\n" + "=" * 60)
    if total_fixes == 0:
        print("✅ No fixes needed - all files are compliant")
    else:
        if dry_run:
            print(f"🔍 DRY RUN COMPLETE")
            print(f"   {total_fixes} fixes identified in {files_modified} files")
            print(f"\nRun without --dry-run to apply fixes")
        else:
            print(f"✅ AUTO-FIX COMPLETE")
            print(f"   {total_fixes} fixes applied to {files_modified} files")
            print(f"\n📋 Review changes and run format_compliance_check.py to verify")

if __name__ == '__main__':
    main()
