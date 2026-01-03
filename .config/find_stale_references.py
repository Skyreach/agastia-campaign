#!/usr/bin/env python3
"""
Find stale section anchor references after Inspiring Tables updates.

Scans all markdown files for [[Page#Section]] wikilinks and checks if:
1. The page exists in the block cache
2. The section exists in that page's cached H3 blocks

Reports stale references that need updating.
"""

import json
import re
from pathlib import Path
from collections import defaultdict

CACHE_FILE = Path('.config/notion_block_cache.json')


def load_cache():
    """Load block cache."""
    if not CACHE_FILE.exists():
        return {}
    with open(CACHE_FILE, 'r') as f:
        cache = json.load(f)
        return cache.get('pages', {})


def extract_section_anchors(content):
    """Extract all [[Page#Section]] wikilinks from content."""
    # Only match section anchors where # is not inside parentheses
    # and section name contains spaces or is at least 3 chars (not just a number)
    pattern = r'\[\[([^\]#\(]+)#([^\]]+)\]\]'
    matches = re.findall(pattern, content)

    # Filter out false positives like [[Name (Subject#8)]]
    real_anchors = []
    for page, section in matches:
        page = page.strip()
        section = section.strip()

        # Skip if section is just a number (likely part of a name, not a section)
        if section.isdigit():
            continue

        # Skip if page contains unclosed parenthesis (suggests # is inside parens)
        if '(' in page and ')' not in page:
            continue

        real_anchors.append((page, section))

    return real_anchors


def scan_files():
    """Scan all markdown files for section anchor wikilinks."""
    references = defaultdict(list)

    for md_file in Path('.').rglob('*.md'):
        # Skip working directory and config
        if '.working' in str(md_file) or '.config' in str(md_file):
            continue

        try:
            with open(md_file, 'r') as f:
                content = f.read()

            anchors = extract_section_anchors(content)
            for page, section in anchors:
                references[(page, section)].append(str(md_file))
        except Exception:
            continue

    return references


def check_stale_references(references, cache):
    """Check which references are stale."""
    stale = []
    valid = []

    for (page, section), files in references.items():
        page_cache = cache.get(page)

        if not page_cache:
            stale.append({
                'page': page,
                'section': section,
                'files': files,
                'reason': f"Page '{page}' not in cache"
            })
            continue

        h3_blocks = page_cache.get('h3_blocks', {})
        if section not in h3_blocks:
            stale.append({
                'page': page,
                'section': section,
                'files': files,
                'reason': f"Section '{section}' not found in cached H3 blocks",
                'available_sections': list(h3_blocks.keys())[:5]
            })
        else:
            valid.append({
                'page': page,
                'section': section,
                'files': files,
                'block_url': h3_blocks[section]['url']
            })

    return stale, valid


def main():
    """Main execution."""
    print("🔍 Scanning for section anchor references...\n")

    # Load cache
    cache = load_cache()
    if not cache:
        print("❌ No block cache found. Run cache_notion_blocks.py first.")
        return

    print(f"📦 Cache loaded: {len(cache)} pages")
    for page_name in cache:
        h3_count = len(cache[page_name].get('h3_blocks', {}))
        print(f"   - {page_name}: {h3_count} H3 sections")

    print()

    # Scan files
    references = scan_files()
    print(f"📄 Found {len(references)} unique section anchor references")
    print()

    # Check for stale references
    stale, valid = check_stale_references(references, cache)

    # Report results
    print(f"{'='*60}")
    print(f"RESULTS")
    print(f"{'='*60}\n")

    print(f"✅ Valid references: {len(valid)}")
    for ref in valid[:3]:
        print(f"   - [[{ref['page']}#{ref['section']}]] ({len(ref['files'])} files)")

    if len(valid) > 3:
        print(f"   ... and {len(valid) - 3} more")

    print()

    if stale:
        print(f"❌ Stale references: {len(stale)}\n")
        for ref in stale:
            print(f"   [[{ref['page']}#{ref['section']}]]")
            print(f"   Reason: {ref['reason']}")
            print(f"   Files affected: {len(ref['files'])}")
            for file in ref['files'][:2]:
                print(f"      - {file}")
            if len(ref['files']) > 2:
                print(f"      ... and {len(ref['files']) - 2} more")

            if 'available_sections' in ref:
                print(f"   Available sections (sample): {', '.join(ref['available_sections'])}")

            print()

        print(f"{'='*60}")
        print("RECOMMENDATIONS:")
        print(f"{'='*60}")
        print("1. Update stale references to match current H3 section names")
        print("2. Or refresh cache: python3 .config/cache_notion_blocks.py --all")
        print("3. Check if sections were renamed in Inspiring Tables")
    else:
        print("🎉 No stale references found!")

    print()


if __name__ == '__main__':
    main()
