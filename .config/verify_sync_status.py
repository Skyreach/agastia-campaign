#!/usr/bin/env python3
"""Verify Notion sync status - checks if local files match Notion pages"""

import sys
from pathlib import Path
from datetime import datetime, timezone
import argparse

sys.path.insert(0, str(Path(__file__).parent))
from notion_helpers import (
    load_notion_client, load_database_id,
    get_campaign_root,
    log_error, log_success, log_warning, log_info
)

try:
    import frontmatter
except ImportError:
    import site
    sys.path.insert(0, site.getusersitepackages())
    import frontmatter

def get_local_files():
    """Get all markdown files with frontmatter"""
    campaign_root = get_campaign_root()
    files = {}

    for md_file in campaign_root.rglob('*.md'):
        # Skip certain directories
        if any(skip in md_file.parts for skip in ['.config', 'node_modules', '.git', '.claude']):
            continue

        try:
            post = frontmatter.load(md_file)
            if post.metadata:
                rel_path = md_file.relative_to(campaign_root)
                files[str(rel_path)] = {
                    'path': md_file,
                    'name': post.metadata.get('name', md_file.stem),
                    'modified': datetime.fromtimestamp(md_file.stat().st_mtime, tz=timezone.utc),
                    'tags': post.metadata.get('tags', [])
                }
        except Exception:
            continue

    return files

def get_notion_pages(notion, db_id):
    """Get all Notion pages with their last_edited time"""
    pages = {}
    has_more = True
    start_cursor = None

    while has_more:
        try:
            response = notion.databases.query(
                database_id=db_id,
                start_cursor=start_cursor
            )

            for page in response['results']:
                try:
                    name_prop = page['properties'].get('Name', {})
                    if name_prop.get('title'):
                        name = name_prop['title'][0]['text']['content']
                    else:
                        continue

                    file_path_prop = page['properties'].get('File Path', {})
                    file_path = file_path_prop.get('rich_text', [{}])[0].get('text', {}).get('content', '')

                    last_edited = page.get('last_edited_time', '')

                    if file_path:
                        pages[file_path] = {
                            'name': name,
                            'last_edited': datetime.fromisoformat(last_edited.replace('Z', '+00:00')) if last_edited else None,
                            'url': page['url'],
                            'id': page['id']
                        }
                except (KeyError, TypeError, IndexError):
                    continue

            has_more = response['has_more']
            start_cursor = response.get('next_cursor')

        except Exception as e:
            log_error(f"Error querying Notion: {e}")
            return {}

    return pages

def verify_sync(quiet=False):
    """Verify sync status between local and Notion"""
    if not quiet:
        log_info("Verifying Notion sync status...")

    try:
        notion = load_notion_client()
        db_id = load_database_id()
    except Exception as e:
        log_error(f"Failed to initialize Notion client: {e}")
        return False

    local_files = get_local_files()
    notion_pages = get_notion_pages(notion, db_id)

    if not quiet:
        log_info(f"Found {len(local_files)} local files")
        log_info(f"Found {len(notion_pages)} Notion pages")

    # Check for desyncs
    issues = []

    # Files not in Notion
    missing_in_notion = []
    for file_path, file_info in local_files.items():
        if file_path not in notion_pages:
            missing_in_notion.append(file_path)

    # Files potentially out of sync (local newer than Notion)
    out_of_sync = []
    for file_path, file_info in local_files.items():
        if file_path in notion_pages:
            notion_edited = notion_pages[file_path]['last_edited']
            local_modified = file_info['modified']

            if notion_edited and local_modified > notion_edited:
                time_diff = (local_modified - notion_edited).total_seconds()
                if time_diff > 60:  # More than 1 minute difference
                    out_of_sync.append({
                        'path': file_path,
                        'local': local_modified,
                        'notion': notion_edited,
                        'diff_seconds': time_diff
                    })

    # Report results
    has_issues = bool(missing_in_notion or out_of_sync)

    if not quiet:
        print()
        print("=" * 60)
        print("SYNC STATUS REPORT")
        print("=" * 60)

        if missing_in_notion:
            print()
            log_warning(f"{len(missing_in_notion)} files not found in Notion:")
            for path in missing_in_notion[:10]:  # Show first 10
                print(f"  • {path}")
            if len(missing_in_notion) > 10:
                print(f"  ... and {len(missing_in_notion) - 10} more")

        if out_of_sync:
            print()
            log_warning(f"{len(out_of_sync)} files potentially out of sync:")
            for item in out_of_sync[:10]:
                mins = int(item['diff_seconds'] / 60)
                print(f"  • {item['path']}")
                print(f"    Local: {item['local'].strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"    Notion: {item['notion'].strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"    Difference: {mins} minutes")
            if len(out_of_sync) > 10:
                print(f"  ... and {len(out_of_sync) - 10} more")

        print()
        print("=" * 60)

        if has_issues:
            print("⚠️  SYNC ISSUES DETECTED")
            print("Run: python3 sync_notion.py all")
        else:
            print("✅ ALL FILES IN SYNC")

        print("=" * 60)

    return not has_issues

def main():
    parser = argparse.ArgumentParser(description='Verify Notion sync status')
    parser.add_argument('--quiet', action='store_true', help='Minimal output')
    args = parser.parse_args()

    success = verify_sync(quiet=args.quiet)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
