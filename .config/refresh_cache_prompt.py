#!/usr/bin/env python3
"""
Prompt to refresh block cache and update stale references when reference pages are synced.

This script is called by sync_notion.py when a reference page (like Inspiring Tables)
is being synced to Notion.
"""

import sys
import subprocess
from pathlib import Path

# Reference pages that have cached block IDs
REFERENCE_PAGES = {
    'Inspiring Encounter Tables': 'Encounters/Inspiring_Tables.md'
}


def prompt_refresh(page_name):
    """Prompt user to refresh cache and update references."""
    print(f"\n{'='*60}")
    print(f"⚠️  REFERENCE PAGE UPDATE DETECTED")
    print(f"{'='*60}")
    print(f"Page: {page_name}")
    print()
    print("This page has cached block IDs for section anchor links.")
    print("If you added/removed/renamed H3 sections, cached block IDs may be stale.")
    print()
    print("Recommended actions:")
    print(f"  1. Refresh cache: python3 .config/cache_notion_blocks.py \"{page_name}\"")
    print(f"  2. Find stale refs: python3 .config/find_stale_references.py")
    print()

    response = input("Refresh cache now? (y/N): ")
    if response.lower() == 'y':
        print("\n🔄 Refreshing cache...")
        result = subprocess.run(
            ['python3', '.config/cache_notion_blocks.py', page_name],
            capture_output=True,
            text=True
        )
        print(result.stdout)

        if result.returncode == 0:
            print("✅ Cache refreshed successfully")

            find_refs = input("\nFind stale references now? (y/N): ")
            if find_refs.lower() == 'y':
                subprocess.run(['python3', '.config/find_stale_references.py'])
        else:
            print(f"❌ Cache refresh failed: {result.stderr}")
    else:
        print("Skipping cache refresh. Run manually if needed.")

    print(f"{'='*60}\n")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 refresh_cache_prompt.py <page_name>")
        sys.exit(1)

    page_name = ' '.join(sys.argv[1:])

    if page_name in REFERENCE_PAGES:
        prompt_refresh(page_name)
    else:
        print(f"Page '{page_name}' is not a known reference page with cached blocks.")
