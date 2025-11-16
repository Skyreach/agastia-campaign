#!/usr/bin/env python3
"""
Deterministic Notion cleanup script - removes duplicates and orphaned pages.

Logic:
1. Query all pages from Notion database
2. Group pages by File Path property
3. For each file path:
   - If multiple pages exist: Keep newest (by last_edited_time), archive rest
   - If no local file exists AND not in .notionignore: Archive page (orphan)
4. Report all actions taken
"""

import sys
import fnmatch
from pathlib import Path
from datetime import datetime
from collections import defaultdict

sys.path.insert(0, str(Path(__file__).parent))
from notion_helpers import (
    load_notion_client, load_database_id, get_campaign_root,
    log_error, log_success, log_warning, log_info
)

def load_notionignore():
    """Load .notionignore patterns"""
    ignore_file = get_campaign_root() / '.notionignore'
    if not ignore_file.exists():
        return []

    patterns = []
    with open(ignore_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                patterns.append(line)
    return patterns

def should_ignore(file_path, ignore_patterns):
    """Check if file matches any ignore patterns"""
    file_str = str(file_path)

    for pattern in ignore_patterns:
        if pattern.endswith('/**'):
            dir_pattern = pattern[:-3]
            if file_str.startswith(dir_pattern):
                return True
        elif '*' in pattern:
            if fnmatch.fnmatch(file_str, pattern):
                return True
        elif pattern in file_str or file_str.endswith(pattern):
            return True

    return False

def get_all_local_file_paths():
    """Get set of all valid markdown file paths"""
    campaign_root = get_campaign_root()
    local_paths = set()

    for md_file in campaign_root.rglob('*.md'):
        if any(skip in md_file.parts for skip in ['.config', 'node_modules', '.git', '.claude', 'Resources']):
            continue
        rel_path = str(md_file.relative_to(campaign_root))
        local_paths.add(rel_path)

    return local_paths

def get_all_notion_pages(notion, db_id):
    """Get all pages with their metadata"""
    pages = []
    has_more = True
    start_cursor = None

    while has_more:
        response = notion.databases.query(
            database_id=db_id,
            start_cursor=start_cursor
        )

        for page in response['results']:
            try:
                name_prop = page['properties'].get('Name', {})
                name = name_prop['title'][0]['text']['content'] if name_prop.get('title') else 'Unnamed'

                file_path_prop = page['properties'].get('File Path', {})
                file_path = file_path_prop.get('rich_text', [{}])[0].get('text', {}).get('content', '')

                last_edited = page.get('last_edited_time', '')

                pages.append({
                    'id': page['id'],
                    'name': name,
                    'file_path': file_path,
                    'last_edited': datetime.fromisoformat(last_edited.replace('Z', '+00:00')) if last_edited else None,
                    'url': page['url'],
                    'archived': page.get('archived', False)
                })
            except (KeyError, TypeError, IndexError):
                continue

        has_more = response['has_more']
        start_cursor = response.get('next_cursor')

    return pages

def cleanup_duplicates(dry_run=True):
    """Find and remove duplicate/orphaned pages"""

    log_info("Loading Notion client...")
    notion = load_notion_client()
    db_id = load_database_id()

    log_info("Loading .notionignore patterns...")
    ignore_patterns = load_notionignore()
    log_info(f"Found {len(ignore_patterns)} ignore patterns")

    log_info("Getting local file paths...")
    local_paths = get_all_local_file_paths()
    log_info(f"Found {len(local_paths)} local markdown files")

    log_info("Querying all Notion pages...")
    all_pages = get_all_notion_pages(notion, db_id)
    active_pages = [p for p in all_pages if not p['archived']]
    log_info(f"Found {len(active_pages)} active pages in Notion")

    # Group by file path
    by_file_path = defaultdict(list)
    no_file_path = []

    for page in active_pages:
        if page['file_path']:
            by_file_path[page['file_path']].append(page)
        else:
            no_file_path.append(page)

    # Find issues
    duplicates = []
    orphans = []

    for file_path, pages in by_file_path.items():
        if len(pages) > 1:
            # Sort by last_edited, newest first
            pages.sort(key=lambda p: p['last_edited'], reverse=True)
            duplicates.append({
                'file_path': file_path,
                'keep': pages[0],
                'archive': pages[1:]
            })

        # Check if orphaned (no local file AND not ignored)
        if file_path not in local_paths and not should_ignore(file_path, ignore_patterns):
            orphans.append(pages[0])

    # Pages with no file path are also orphans
    orphans.extend(no_file_path)

    # Report findings
    print("\n" + "="*60)
    print("CLEANUP REPORT")
    print("="*60)

    if duplicates:
        print(f"\n🔴 DUPLICATES FOUND: {len(duplicates)} file paths with multiple pages")
        for dup in duplicates:
            print(f"\n  File: {dup['file_path']}")
            print(f"    ✅ KEEP: {dup['keep']['name']} (edited {dup['keep']['last_edited']})")
            for arch in dup['archive']:
                print(f"    ❌ ARCHIVE: {arch['name']} (edited {arch['last_edited']})")
    else:
        print("\n✅ No duplicates found")

    if orphans:
        print(f"\n🔴 ORPHANS FOUND: {len(orphans)} pages with no matching local file")
        for orphan in orphans:
            print(f"    ❌ ARCHIVE: {orphan['name']} (path: {orphan['file_path'] or 'NONE'})")
    else:
        print("\n✅ No orphans found")

    print("\n" + "="*60)

    # Execute cleanup
    if not dry_run and (duplicates or orphans):
        print("\n🔧 EXECUTING CLEANUP...")

        archived_count = 0

        # Archive duplicates
        for dup in duplicates:
            for page in dup['archive']:
                notion.pages.update(page_id=page['id'], archived=True)
                print(f"  ✅ Archived duplicate: {page['name']}")
                archived_count += 1

        # Archive orphans
        for orphan in orphans:
            notion.pages.update(page_id=orphan['id'], archived=True)
            print(f"  ✅ Archived orphan: {orphan['name']}")
            archived_count += 1

        print(f"\n✅ Cleanup complete: {archived_count} pages archived")
    elif dry_run and (duplicates or orphans):
        print("\n⚠️  DRY RUN - No changes made")
        print("   Run with --execute to perform cleanup")

    return len(duplicates) + len(orphans) == 0

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Clean up duplicate and orphaned Notion pages')
    parser.add_argument('--execute', action='store_true', help='Actually perform cleanup (default is dry run)')
    args = parser.parse_args()

    success = cleanup_duplicates(dry_run=not args.execute)
    sys.exit(0 if success else 1)
