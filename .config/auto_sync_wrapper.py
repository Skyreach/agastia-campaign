#!/usr/bin/env python3
"""
Automatic sync wrapper that MUST be called after any file modification.
This enforces the proactive update protocol.
"""

import sys
import os
import subprocess
from pathlib import Path

def sync_if_campaign_file(filepath):
    """Automatically sync to Notion if this is a campaign file"""

    campaign_patterns = {
        'Player_Characters/': 'PC',
        'NPCs/': 'NPC',
        'Factions/': 'Faction',
        'Locations/': 'Location',
        'Sessions/': 'Session',
        'Resources/': 'Resource',
        'Campaign_Core/': 'Artifact',
        'Dungeon_Ecologies/': 'Ecology',
        'Session_Flows/': 'Session'
    }

    for pattern, entity_type in campaign_patterns.items():
        if pattern in filepath and filepath.endswith('.md'):
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

    return True  # Non-campaign file, skip sync

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: auto_sync_wrapper.py <filepath>")
        sys.exit(1)

    success = sync_if_campaign_file(sys.argv[1])
    sys.exit(0 if success else 1)
