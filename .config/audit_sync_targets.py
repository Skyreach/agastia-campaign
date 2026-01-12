#!/usr/bin/env python3
"""
Audit what files would be synced to Notion.

Dry-run script to show what files in campaign-content/ actually need syncing
(new files or files modified since last sync).
"""

import os
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime, timezone


def load_sync_state():
    """Load .notion_sync_state.json and return all tracked files with timestamps."""
    sync_state_path = Path('.notion_sync_state.json')

    if not sync_state_path.exists():
        return {}

    with open(sync_state_path, 'r') as f:
        data = json.load(f)

    # Combine sessions and entities
    tracked = {}
    tracked.update(data.get('sessions', {}))
    tracked.update(data.get('entities', {}))

    # Normalize paths (strip leading ./)
    normalized = {}
    for filepath, metadata in tracked.items():
        normalized_path = filepath.lstrip('./')
        normalized[normalized_path] = metadata

    return normalized


def infer_entity_type(filepath):
    """Infer entity type from directory name under campaign-content/.

    Same logic as auto_sync_wrapper.py
    """
    filepath = filepath.lstrip('./')

    if not filepath.startswith('campaign-content/'):
        return None

    relative = filepath[len('campaign-content/'):]

    if '/' not in relative:
        return None

    entity_dir = relative.split('/')[0]

    # Special case mappings
    if entity_dir == 'Player_Characters':
        return 'PC'

    # Convert plural to singular
    if entity_dir.endswith('s') and entity_dir != 'Sessions':
        return entity_dir[:-1]

    return entity_dir


def needs_sync(filepath, sync_state):
    """Check if file needs syncing (new or modified since last push).

    Returns:
        (needs_sync: bool, reason: str)
    """
    normalized_path = str(filepath).lstrip('./')

    # Check if file is tracked
    if normalized_path not in sync_state:
        return (True, 'new')

    # Get last pushed timestamp
    metadata = sync_state[normalized_path]
    last_pushed = metadata.get('last_pushed_to_notion')

    if not last_pushed:
        return (True, 'never_synced')

    # Parse timestamp (ISO 8601 format with timezone)
    try:
        last_pushed_dt = datetime.fromisoformat(last_pushed.replace('Z', '+00:00'))
    except:
        return (True, 'invalid_timestamp')

    # Get file modification time
    file_mtime = datetime.fromtimestamp(os.path.getmtime(filepath), tz=timezone.utc)

    # Compare
    if file_mtime > last_pushed_dt:
        return (True, 'modified')

    return (False, 'up_to_date')


def main():
    print("=" * 80)
    print("SYNC TARGET AUDIT - DRY RUN")
    print("=" * 80)
    print()

    # Load sync state
    sync_state = load_sync_state()
    print(f"Loaded sync state: {len(sync_state)} tracked files")
    print()

    # Scan campaign-content/ directory
    content_root = Path('campaign-content')

    if not content_root.exists():
        print("❌ campaign-content/ directory not found")
        return 1

    # Collect all .md files
    all_md_files = list(content_root.rglob('*.md'))

    # Categorize files
    new_files = defaultdict(list)
    modified_files = defaultdict(list)
    up_to_date_files = defaultdict(list)
    no_entity_type = []

    for md_file in all_md_files:
        rel_path = str(md_file)
        entity_type = infer_entity_type(rel_path)

        if not entity_type:
            no_entity_type.append(rel_path)
            continue

        # Check if needs syncing
        needs, reason = needs_sync(md_file, sync_state)

        if reason == 'new' or reason == 'never_synced':
            new_files[entity_type].append(rel_path)
        elif reason == 'modified':
            modified_files[entity_type].append(rel_path)
        else:
            up_to_date_files[entity_type].append(rel_path)

    # Calculate totals
    total_new = sum(len(files) for files in new_files.values())
    total_modified = sum(len(files) for files in modified_files.values())
    total_up_to_date = sum(len(files) for files in up_to_date_files.values())
    total_needs_sync = total_new + total_modified

    # Print summary
    print(f"Total .md files in campaign-content/: {len(all_md_files)}")
    print(f"Files that NEED syncing: {total_needs_sync}")
    print(f"  ├─ New files: {total_new}")
    print(f"  └─ Modified files: {total_modified}")
    print(f"Files already up-to-date: {total_up_to_date}")
    print()

    # Show files that need syncing
    if total_needs_sync > 0:
        print("=" * 80)
        print("FILES THAT NEED SYNCING")
        print("=" * 80)
        print()

        if new_files:
            print("NEW FILES (not in sync state):")
            print()
            for entity_type in sorted(new_files.keys()):
                files = new_files[entity_type]
                print(f"  {entity_type}: {len(files)} files")
                for f in sorted(files)[:5]:
                    print(f"    - {f}")
                if len(files) > 5:
                    print(f"    ... and {len(files) - 5} more")
                print()

        if modified_files:
            print("MODIFIED FILES (changed since last sync):")
            print()
            for entity_type in sorted(modified_files.keys()):
                files = modified_files[entity_type]
                print(f"  {entity_type}: {len(files)} files")
                for f in sorted(files)[:5]:
                    print(f"    - {f}")
                if len(files) > 5:
                    print(f"    ... and {len(files) - 5} more")
                print()
    else:
        print("✅ All files are up-to-date - nothing needs syncing!")
        print()

    print("=" * 80)
    print("This is a dry run - no files were actually synced")
    print("=" * 80)

    return 0


if __name__ == '__main__':
    import sys
    sys.exit(main())
