#!/usr/bin/env python3
"""
Manages .notion_sync_state.json for tracking bidirectional sync timestamps.
Prevents false positives when we sync TO Notion and helps detect manual edits.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict

from notion_helpers import get_campaign_root

SYNC_STATE_FILE = get_campaign_root() / '.notion_sync_state.json'

def load_sync_state() -> Dict:
    """Load the sync state file, creating if it doesn't exist."""
    if not SYNC_STATE_FILE.exists():
        return {"sessions": {}, "entities": {}}

    with open(SYNC_STATE_FILE, 'r') as f:
        return json.load(f)

def save_sync_state(state: Dict):
    """Save the sync state file."""
    with open(SYNC_STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def record_push_to_notion(file_path: str, notion_page_id: str):
    """
    Record that we just pushed a file to Notion.
    Call this AFTER successful Notion API sync.

    Args:
        file_path: Relative path from repo root (e.g., "Sessions/Session_1_...")
        notion_page_id: Notion page ID (with or without hyphens)
    """
    state = load_sync_state()

    # Normalize page ID (remove hyphens)
    page_id = notion_page_id.replace('-', '')

    # Determine category
    category = 'sessions' if file_path.startswith('Sessions/') else 'entities'

    # Record timestamp
    now = datetime.now(timezone.utc).isoformat()

    if file_path not in state[category]:
        state[category][file_path] = {}

    state[category][file_path].update({
        'notion_page_id': page_id,
        'last_pushed_to_notion': now
    })

    save_sync_state(state)
    print(f"📝 Recorded push: {file_path} → Notion at {now}")

def record_pull_from_notion(file_path: str, notion_page_id: str):
    """
    Record that we just pulled a file from Notion.
    Call this AFTER successful file update.

    Args:
        file_path: Relative path from repo root
        notion_page_id: Notion page ID
    """
    state = load_sync_state()

    # Normalize page ID
    page_id = notion_page_id.replace('-', '')

    # Determine category
    category = 'sessions' if file_path.startswith('Sessions/') else 'entities'

    # Record timestamp
    now = datetime.now(timezone.utc).isoformat()

    if file_path not in state[category]:
        state[category][file_path] = {}

    state[category][file_path].update({
        'notion_page_id': page_id,
        'last_pulled_from_notion': now
    })

    save_sync_state(state)
    print(f"📥 Recorded pull: Notion → {file_path} at {now}")

def get_last_push_time(file_path: str) -> Optional[datetime]:
    """
    Get the last time we pushed this file to Notion.

    Returns:
        datetime object in UTC, or None if never pushed
    """
    state = load_sync_state()
    category = 'sessions' if file_path.startswith('Sessions/') else 'entities'

    file_state = state.get(category, {}).get(file_path, {})
    timestamp_str = file_state.get('last_pushed_to_notion')

    if timestamp_str:
        return datetime.fromisoformat(timestamp_str)
    return None

def get_notion_page_id(file_path: str) -> Optional[str]:
    """Get the Notion page ID for a given file path."""
    state = load_sync_state()
    category = 'sessions' if file_path.startswith('Sessions/') else 'entities'

    file_state = state.get(category, {}).get(file_path, {})
    return file_state.get('notion_page_id')

def needs_pull_from_notion(file_path: str, notion_last_edited: datetime, buffer_hours: int = 1) -> bool:
    """
    Determine if we should pull from Notion based on timestamps.

    Args:
        file_path: Relative path from repo root
        notion_last_edited: Notion's last_edited_time as datetime
        buffer_hours: Minimum hours difference to consider (default 1)

    Returns:
        True if Notion was edited significantly after our last push
    """
    last_push = get_last_push_time(file_path)

    # If we've never pushed, we should pull
    if last_push is None:
        print(f"⚠️  No push record for {file_path}, will pull from Notion")
        return True

    # Calculate time difference
    diff = notion_last_edited - last_push
    diff_hours = diff.total_seconds() / 3600

    print(f"📊 {file_path}:")
    print(f"   Last pushed: {last_push}")
    print(f"   Notion edited: {notion_last_edited}")
    print(f"   Difference: {diff_hours:.1f} hours")

    if diff_hours > buffer_hours:
        print(f"   ✅ Difference > {buffer_hours}h, will pull")
        return True
    else:
        print(f"   ⏭️  Difference <= {buffer_hours}h, skipping")
        return False
