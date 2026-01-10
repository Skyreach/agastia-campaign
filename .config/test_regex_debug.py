#!/usr/bin/env python3
"""
Standalone test script for debugging markdown_normalizer.py regex patterns.

Tests the EXACT failing patterns from git diff:
1. **[[Kyle/Nameless]]'s** Hook:** → **[[Kyle/Nameless]]'s Hook:**
2. **[[Corvin Tradewise]]:**** Merchant → **[[Corvin Tradewise]]:** Merchant
3. **Toggle: **Tier 2 - **[[Noble Quarter]]** → **Toggle: Tier 2 - [[Noble Quarter]]**
"""

import sys
import os

# Add parent directory to path to import markdown_normalizer
sys.path.insert(0, os.path.dirname(__file__))

from markdown_normalizer import fix_bold_wikilink_formatting, fix_toggle_formatting


def test_pattern(test_num, description, input_text, expected_output, fix_function):
    """
    Test a single pattern and show detailed results.

    Args:
        test_num: Test case number
        description: Human-readable description
        input_text: Input markdown text
        expected_output: Expected result
        fix_function: Function to apply (fix_bold_wikilink_formatting or fix_toggle_formatting)
    """
    print(f"\n{'='*80}")
    print(f"TEST {test_num}: {description}")
    print(f"{'='*80}")

    print(f"\nINPUT:")
    print(f"  {repr(input_text)}")

    result = fix_function(input_text)

    print(f"\nOUTPUT:")
    print(f"  {repr(result)}")

    print(f"\nEXPECTED:")
    print(f"  {repr(expected_output)}")

    if result == expected_output:
        print(f"\n✅ PASS - Pattern fixed correctly!")
        return True
    else:
        print(f"\n❌ FAIL - Pattern not fixed!")
        print(f"\nDIFFERENCE:")
        print(f"  Got:      {repr(result)}")
        print(f"  Expected: {repr(expected_output)}")

        # Character-by-character comparison
        print(f"\nCHARACTER COMPARISON:")
        max_len = max(len(result), len(expected_output))
        for i in range(max_len):
            r_char = result[i] if i < len(result) else '∅'
            e_char = expected_output[i] if i < len(expected_output) else '∅'
            match = '✓' if r_char == e_char else '✗'
            print(f"  [{i:3d}] {match} Got: {repr(r_char):6s} Expected: {repr(e_char):6s}")

        return False


def main():
    print("MARKDOWN NORMALIZER REGEX DEBUG TEST")
    print("="*80)
    print("Testing EXACT patterns from git diff")

    results = []

    # Test Case 1: Bold closes after 's instead of after Hook:
    # Pattern: **[[Kyle/Nameless]]'s** Hook:**
    # The issue: Bold marker (**) appears after 's, but should be after Hook:
    results.append(test_pattern(
        test_num=1,
        description="Bold closes after 's instead of after Hook:",
        input_text="**[[Kyle/Nameless]]'s** Hook:**",
        expected_output="**[[Kyle/Nameless]]'s Hook:**",
        fix_function=fix_bold_wikilink_formatting
    ))

    # Test Case 2: Extra ** after colon (4 asterisks total instead of 2)
    # Pattern: **[[Corvin Tradewise]]:**** Merchant
    # The issue: We have **[[...]]:**** (4 asterisks at end) instead of **[[...]]:** (2 asterisks)
    results.append(test_pattern(
        test_num=2,
        description="Extra ** after colon (4 asterisks total instead of 2)",
        input_text="**[[Corvin Tradewise]]:**** Merchant",
        expected_output="**[[Corvin Tradewise]]:** Merchant",
        fix_function=fix_bold_wikilink_formatting
    ))

    # Test Case 3: Nested bold markers inside toggle
    # Pattern: **Toggle: **Tier 2 - **[[Noble Quarter]]**
    # The issue: Toggle has nested ** markers and wikilink has ** markers
    results.append(test_pattern(
        test_num=3,
        description="Nested bold markers inside toggle",
        input_text="**Toggle: **Tier 2 - **[[Noble Quarter]]**",
        expected_output="**Toggle: Tier 2 - [[Noble Quarter]]**",
        fix_function=fix_toggle_formatting
    ))

    # Summary
    print(f"\n{'='*80}")
    print("TEST SUMMARY")
    print(f"{'='*80}")

    passed = sum(results)
    total = len(results)

    print(f"\nTests passed: {passed}/{total}")

    if passed == total:
        print("\n✅ ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED")
        print("\nFailed tests indicate regex patterns need to be updated.")
        return 1


if __name__ == '__main__':
    sys.exit(main())
