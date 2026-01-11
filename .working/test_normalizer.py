#!/usr/bin/env python3
"""Test markdown_normalizer.py with sample Session 3 data"""

import sys
sys.path.insert(0, '.config')

from markdown_normalizer import normalize_markdown_output

# Read the test file
with open('.working/test_sync_sample.md', 'r') as f:
    content = f.read()

print("=" * 60)
print("ORIGINAL CONTENT:")
print("=" * 60)
print(content)

# Normalize it
normalized = normalize_markdown_output(content)

print("\n" + "=" * 60)
print("NORMALIZED CONTENT:")
print("=" * 60)
print(normalized)

# Show specific patterns
print("\n" + "=" * 60)
print("PATTERN ANALYSIS:")
print("=" * 60)

test_patterns = [
    ("[[Kyle/Nameless]]**'s Hook:", "Should become: **[[Kyle/Nameless]]'s Hook:**"),
    ("[[Corvin Tradewise]]**:", "Should become: **[[Corvin Tradewise]]:**"),
    ("[[Mira Saltwind]]**:", "Should become: **[[Mira Saltwind]]:**"),
    ("[[Il Drago Rosso]]** - **[[Nikki]]'s Family Restaurant**", "Should become: **[[Il Drago Rosso]] - [[Nikki]]'s Family Restaurant**"),
    ("[[Veridian Scrollkeeper]]**'s Location**", "Should become: **[[Veridian Scrollkeeper]]'s Location**"),
    ("**Forest Clearing - **[[Lost Mastiff]]", "Should become: **Forest Clearing - [[Lost Mastiff]]**"),
]

for pattern, expected in test_patterns:
    if pattern in content:
        print(f"\n✓ Found in original: {pattern}")
        print(f"  {expected}")
        # Check if it's still there or changed
        if pattern in normalized:
            print(f"  ⚠️  UNCHANGED in normalized output")
        else:
            print(f"  ✓  Changed in normalized output")
