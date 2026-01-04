#!/usr/bin/env python3
"""Batch sync all encounter pages to Notion"""

import subprocess
import time
from pathlib import Path

def main():
    encounters_dir = Path('Encounters')
    encounters = sorted(encounters_dir.glob('*.md'))

    # Filter out Inspiring_Tables.md (already synced)
    encounters = [e for e in encounters if e.name != 'Inspiring_Tables.md']

    total = len(encounters)
    success = 0
    failed = 0

    print(f"🔄 Starting batch sync of {total} encounter pages to Notion...")
    print()

    for i, encounter_file in enumerate(encounters, 1):
        print(f"[{i}/{total}] Syncing: {encounter_file.name}")

        try:
            result = subprocess.run(
                ['python3', 'sync_notion.py', str(encounter_file), 'encounter'],
                capture_output=True,
                text=True,
                timeout=30
            )

            if result.returncode == 0:
                success += 1
                print(f"  ✅ Success")
            else:
                failed += 1
                print(f"  ❌ Failed: {result.stderr[:100]}")
        except subprocess.TimeoutExpired:
            failed += 1
            print(f"  ❌ Failed: Timeout")
        except Exception as e:
            failed += 1
            print(f"  ❌ Failed: {e}")

        # Small delay to avoid rate limiting
        time.sleep(0.5)

    print()
    print("=" * 45)
    print("📊 Batch Sync Complete!")
    print("=" * 45)
    print(f"Total encounters: {total}")
    print(f"✅ Successful: {success}")
    print(f"❌ Failed: {failed}")
    print()

if __name__ == '__main__':
    main()
