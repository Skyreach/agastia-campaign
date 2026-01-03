#!/usr/bin/env python3
"""Test parse_rich_text fix for wikilinks inside bold text."""

import sys
sys.path.insert(0, '/mnt/e/dnd/agastia-campaign')

from sync_notion import parse_rich_text

# Test cases
test_cases = [
    "**Tier 4 - [[Merchant District]]**",
    "**Bold with [[link]] inside**",
    "Normal [[link]] outside",
    "**Just bold text**",
    "*Italic with [[link]]*",
    "**Bold** and [[link]] separate",
]

print("Testing parse_rich_text fix for wikilinks inside formatting...\n")

for test_text in test_cases:
    print(f"Input: {test_text}")
    result = parse_rich_text(test_text, notion_client=None, database_id=None)
    print(f"Output: {result}")
    print()

# Specific test for the bug case
print("=" * 60)
print("BUG CASE TEST: **Tier 4 - [[Merchant District]]**")
print("=" * 60)
result = parse_rich_text("**Tier 4 - [[Merchant District]]**", None, None)
print(f"\nParsed result:")
for i, item in enumerate(result):
    print(f"  [{i}] type={item['type']}")
    if item['type'] == 'text':
        print(f"      content={item['text']['content']}")
        if 'annotations' in item:
            print(f"      annotations={item['annotations']}")
    elif item['type'] == 'mention':
        print(f"      plain_text={item.get('plain_text', 'N/A')}")
        if 'annotations' in item:
            print(f"      annotations={item['annotations']}")
    print()

# Check if wikilink was preserved
has_wikilink = any(item['type'] == 'text' and '[[' in item['text']['content']
                   for item in result)
has_mention = any(item['type'] == 'mention' for item in result)

print("\n" + "=" * 60)
if has_mention:
    print("✅ PASS: Wikilink parsed as mention (correct)")
elif has_wikilink:
    print("⚠️  PARTIAL: Wikilink detected but not converted to mention")
    print("   (This is expected if notion_client=None)")
else:
    print("✅ PASS: No raw wikilink brackets in output")

# Check if bold annotation applied
has_bold = any(item.get('annotations', {}).get('bold', False) for item in result)
print(f"\nBold annotation present: {has_bold}")
if has_bold:
    print("✅ PASS: Bold formatting preserved")
else:
    print("❌ FAIL: Bold formatting lost")
