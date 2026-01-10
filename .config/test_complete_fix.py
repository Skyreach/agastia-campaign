#!/usr/bin/env python3
"""
Complete test with proposed fix integrated.
Tests ALL three original failing patterns from git diff.
"""

import re


def fix_bold_wikilink_formatting(text: str) -> str:
    """
    Fix bold formatting around wikilinks.
    (Original implementation - no changes needed)
    """
    # Fix: **[[Entity]]****: → **[[Entity]]:**
    text = re.sub(r'\*\*\[\[([^\]]+)\]\]\*\*\*\*:', r'**[[\1]]:**', text)
    text = re.sub(r'\*\*\[\[([^\]]+)\]\]\*\*\*\*\'s', r"**[[\1]]'s**", text)

    # Fix: **[[Entity]]:**** → **[[Entity]]:**
    text = re.sub(r'(\*\*\[\[([^\]]+)\]\]:)\*\*', r'\1', text)

    # Fix: **[[Entity]]'s** Hook:** → **[[Entity]]'s Hook:**
    text = re.sub(r'\*\*\[\[([^\]]+)\]\]\'s\*\* ([^:]+:)\*\*', r"**[[\1]]'s \2**", text)

    # Fix: [[Entity]]**: → **[[Entity]]:**
    text = re.sub(r'(?<!\*\*)\[\[([^\]]+)\]\]\*\*:', r'**[[\1]]:**', text)
    text = re.sub(r'(?<!\*\*)\[\[([^\]]+)\]\]\*\*\'s', r"**[[\1]]'s**", text)

    return text


def fix_toggle_formatting(text: str) -> str:
    """
    Fix duplicate bold markers in toggle headings.
    (PROPOSED FIX - replaces original implementation)

    Pattern to fix:
    - **Toggle: **Title → **Toggle: Title**
    - **Toggle: **Title** → **Toggle: Title**
    - **Toggle: **Text with **[[Entity]]** → **Toggle: Text with [[Entity]]**

    Args:
        text: Input markdown text

    Returns:
        Text with cleaned toggle formatting
    """
    # Fix toggle lines with nested bold markers
    # Match: **Toggle: **content**[**]
    # Capture: content (without outer **)
    # Strip all ** from content, rebuild with single opening/closing
    text = re.sub(
        r'\*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$',
        lambda m: f"**Toggle: {m.group(1).replace('**', '')}**",
        text,
        flags=re.MULTILINE
    )

    return text


def test_pattern(test_num, description, input_text, expected_output, fix_function):
    """Test a single pattern and show detailed results."""
    print(f"\n{'='*80}")
    print(f"TEST {test_num}: {description}")
    print(f"{'='*80}")

    print(f"\nINPUT:    {repr(input_text)}")

    result = fix_function(input_text)

    print(f"OUTPUT:   {repr(result)}")
    print(f"EXPECTED: {repr(expected_output)}")

    if result == expected_output:
        print(f"\n✅ PASS - Pattern fixed correctly!")
        return True
    else:
        print(f"\n❌ FAIL - Pattern not fixed!")
        print(f"\nDifference:")
        print(f"  Got:      {result}")
        print(f"  Expected: {expected_output}")
        return False


def main():
    print("="*80)
    print("COMPLETE REGEX FIX TEST - ALL THREE ORIGINAL FAILING PATTERNS")
    print("="*80)

    results = []

    # Test Case 1: Bold closes after 's instead of after Hook:
    results.append(test_pattern(
        test_num=1,
        description="Bold closes after 's instead of after Hook:",
        input_text="**[[Kyle/Nameless]]'s** Hook:**",
        expected_output="**[[Kyle/Nameless]]'s Hook:**",
        fix_function=fix_bold_wikilink_formatting
    ))

    # Test Case 2: Extra ** after colon (4 asterisks total instead of 2)
    results.append(test_pattern(
        test_num=2,
        description="Extra ** after colon (4 asterisks total instead of 2)",
        input_text="**[[Corvin Tradewise]]:**** Merchant",
        expected_output="**[[Corvin Tradewise]]:** Merchant",
        fix_function=fix_bold_wikilink_formatting
    ))

    # Test Case 3: Nested bold markers inside toggle
    results.append(test_pattern(
        test_num=3,
        description="Nested bold markers inside toggle",
        input_text="**Toggle: **Tier 2 - **[[Noble Quarter]]**",
        expected_output="**Toggle: Tier 2 - [[Noble Quarter]]**",
        fix_function=fix_toggle_formatting
    ))

    # Additional edge cases for toggle
    results.append(test_pattern(
        test_num=4,
        description="Toggle with multiple wikilinks",
        input_text="**Toggle: **Contains **[[E1]]** and **[[E2]]****",
        expected_output="**Toggle: Contains [[E1]] and [[E2]]**",
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
        print("\nThe proposed fix resolves all three original failing patterns:")
        print("  1. ✅ **[[Entity]]'s** Text:** → **[[Entity]]'s Text:**")
        print("  2. ✅ **[[Entity]]:**** → **[[Entity]]:**")
        print("  3. ✅ **Toggle: **Text **[[E]]** → **Toggle: Text [[E]]**")
        return 0
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED")
        return 1


if __name__ == '__main__':
    import sys
    sys.exit(main())
