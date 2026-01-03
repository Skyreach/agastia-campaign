#!/usr/bin/env python3
"""
Validate that tier sections in session files are sorted numerically, not alphabetically.

Usage:
    python3 .config/validate_tier_sorting.py Sessions/Session_3_The_Steel_Dragon_Begins.md
"""

import sys
import re
from pathlib import Path

def validate_tier_sorting(file_path):
    """Check if tier sections are sorted numerically."""

    content = Path(file_path).read_text()

    # Find all tier headings (#### Tier X - Name)
    tier_pattern = r'^####\s+Tier\s+(\d+)\s+-\s+(.+)$'
    tiers = []

    for line_num, line in enumerate(content.split('\n'), 1):
        match = re.match(tier_pattern, line)
        if match:
            tier_num = int(match.group(1))
            tier_name = match.group(2).strip()
            tiers.append((line_num, tier_num, tier_name, line))

    if not tiers:
        print(f"✅ No tier sections found in {file_path}")
        return True

    print(f"\n📋 Found {len(tiers)} tier sections:")
    for line_num, tier_num, tier_name, line in tiers:
        print(f"   Line {line_num}: Tier {tier_num} - {tier_name}")

    # Check if sorted numerically
    tier_numbers = [t[1] for t in tiers]
    sorted_tiers = sorted(tier_numbers)

    print(f"\n🔍 Validation:")
    print(f"   Current order: {tier_numbers}")
    print(f"   Expected order: {sorted_tiers}")

    if tier_numbers == sorted_tiers:
        print(f"\n✅ PASS: Tiers are sorted numerically!")
        return True
    else:
        print(f"\n❌ FAIL: Tiers are NOT sorted numerically!")
        print(f"\n💡 Fix needed:")
        print(f"   Reorder tier sections to match: {sorted_tiers}")

        # Show suggested reordering
        print(f"\n📝 Suggested section order:")
        for tier_num in sorted_tiers:
            for line_num, t_num, t_name, line in tiers:
                if t_num == tier_num:
                    print(f"   {line}")

        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 validate_tier_sorting.py <session_file>")
        sys.exit(1)

    file_path = sys.argv[1]

    if not Path(file_path).exists():
        print(f"❌ File not found: {file_path}")
        sys.exit(1)

    success = validate_tier_sorting(file_path)
    sys.exit(0 if success else 1)
