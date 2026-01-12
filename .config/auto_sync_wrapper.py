#!/usr/bin/env python3
"""
Automatic sync wrapper that MUST be called after any file modification.
This enforces the proactive update protocol.

Auto-discovers entity type from directory name.
"""

import sys
import os
import subprocess
from pathlib import Path

def infer_entity_type(filepath):
    """Infer entity type from directory name under campaign-content/.

    Examples:
        campaign-content/NPCs/foo.md → NPC
        campaign-content/Encounters/bar.md → Encounter
        campaign-content/Player_Characters/baz.md → PC
    """
    # Normalize path
    filepath = filepath.lstrip('./')

    # Must be under campaign-content/
    if not filepath.startswith('campaign-content/'):
        return None

    # Strip campaign-content/ prefix
    relative = filepath[len('campaign-content/'):]

    # Get entity directory
    if '/' not in relative:
        return None

    entity_dir = relative.split('/')[0]

    # Special case mappings
    if entity_dir == 'Player_Characters':
        return 'PC'

    # Convert plural to singular (NPCs → NPC, Encounters → Encounter)
    if entity_dir.endswith('s') and entity_dir != 'Sessions':
        return entity_dir[:-1]

    # Default: use directory name as-is
    return entity_dir

def sync_if_campaign_file(filepath):
    """Automatically sync to Notion if this is a campaign file"""

    if not filepath.endswith('.md'):
        return True  # Not a markdown file

    # Infer entity type from directory
    entity_type = infer_entity_type(filepath)

    if not entity_type:
        return True  # Not in a recognized directory

    # Sync to Notion
    print(f"🔄 Auto-syncing {filepath} to Notion as {entity_type}...")
    result = subprocess.run(
        ['python3', 'sync_notion.py', filepath, entity_type],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(f"❌ SYNC FAILED: {result.stderr}")
        return False
    else:
        print(f"✅ Synced: {result.stdout}")
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: auto_sync_wrapper.py <filepath>")
        sys.exit(1)

    success = sync_if_campaign_file(sys.argv[1])
    sys.exit(0 if success else 1)
