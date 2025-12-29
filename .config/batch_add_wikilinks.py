#!/usr/bin/env python3
"""
Batch add wikilinks to all markdown files in the repository.
"""

import subprocess
from pathlib import Path

def process_directory(directory, description):
    """Process all .md files in a directory"""
    md_files = list(Path(directory).rglob("*.md"))
    md_files = [f for f in md_files if f.is_file()]  # Filter out directories

    if not md_files:
        print(f"\n⏭️  No markdown files found in {directory}")
        return 0

    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}")
    print(f"Processing {len(md_files)} files...\n")

    total_links = 0
    for file_path in sorted(md_files):
        result = subprocess.run(
            ['python3', '.config/add_wikilinks.py', str(file_path)],
            capture_output=True,
            text=True
        )

        # Parse output for total links added
        for line in result.stdout.split('\n'):
            if 'Total links added:' in line:
                count = int(line.split(':')[1].strip())
                total_links += count
                if count > 0:
                    print(f"  ✓ {file_path.name}: {count} links")
            elif '⏭️' in line:
                print(f"  ⏭️  {file_path.name}: already done")

    print(f"\n📊 {description} Complete: {total_links} total links added")
    return total_links

def main():
    grand_total = 0

    print("🔗 BATCH WIKILINK PROCESSING")
    print("=" * 60)

    # Process in priority order
    categories = [
        ("Locations/Districts", "DISTRICTS"),
        ("Locations/Cities/Agastia", "AGASTIA ESTABLISHMENTS"),
        ("Locations/Towns", "TOWNS"),
        ("Locations/Regions", "REGIONS"),
        ("Locations/Wilderness", "WILDERNESS"),
        ("Factions", "FACTIONS"),
        ("NPCs/Major_NPCs", "MAJOR NPCs"),
        ("NPCs/Location_NPCs", "LOCATION NPCs"),
        ("NPCs/Faction_NPCs", "FACTION NPCs"),
        ("NPCs/Mystery_NPCs", "MYSTERY NPCs"),
        ("Player_Characters", "PLAYER CHARACTERS"),
        ("Campaign_Core", "CAMPAIGN CORE"),
    ]

    for directory, description in categories:
        if Path(directory).exists():
            total = process_directory(directory, description)
            grand_total += total

    print(f"\n{'='*60}")
    print(f"🎉 BATCH COMPLETE: {grand_total} total wikilinks added across all files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
