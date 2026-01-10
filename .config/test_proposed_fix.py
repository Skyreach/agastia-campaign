#!/usr/bin/env python3
"""
Test the proposed fix for toggle formatting.
"""

import re


def fix_toggle_formatting_ORIGINAL(text: str) -> str:
    """Original implementation from markdown_normalizer.py"""
    # Fix duplicate ** in toggle headings
    text = re.sub(r'\*\*Toggle:\s+\*\*', r'**Toggle: ', text)

    # Fix: **Toggle: Title** (make sure ends with **)
    # This pattern finds Toggle lines and ensures they're properly closed
    text = re.sub(r'(\*\*Toggle: [^\*]+)\*\*\*\*', r'\1**', text)

    return text


def fix_toggle_formatting_PROPOSED(text: str) -> str:
    """
    Proposed fix for toggle formatting.

    Handles nested bold markers inside toggle content.
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
    """Test a single pattern."""
    print(f"\n{'='*80}")
    print(f"TEST {test_num}: {description}")
    print(f"{'='*80}")

    print(f"\nINPUT:    {repr(input_text)}")

    result = fix_function(input_text)

    print(f"OUTPUT:   {repr(result)}")
    print(f"EXPECTED: {repr(expected_output)}")

    if result == expected_output:
        print(f"\n✅ PASS")
        return True
    else:
        print(f"\n❌ FAIL")
        print(f"\nDifference:")
        print(f"  Got:      {result}")
        print(f"  Expected: {expected_output}")
        return False


def main():
    print("="*80)
    print("TESTING PROPOSED FIX FOR TOGGLE FORMATTING")
    print("="*80)

    # Test cases
    test_cases = [
        (
            "Basic nested bold in toggle",
            "**Toggle: **Tier 2 - **[[Noble Quarter]]**",
            "**Toggle: Tier 2 - [[Noble Quarter]]**"
        ),
        (
            "Simple toggle with duplicate **",
            "**Toggle: **Simple text**",
            "**Toggle: Simple text**"
        ),
        (
            "Toggle with multiple wikilinks",
            "**Toggle: **Text with **[[Entity1]]** and **[[Entity2]]****",
            "**Toggle: Text with [[Entity1]] and [[Entity2]]**"
        ),
        (
            "Already correct toggle",
            "**Toggle: Text**",
            "**Toggle: Text**"
        ),
        (
            "Toggle with 4 asterisks at end",
            "**Toggle: **Content****",
            "**Toggle: Content**"
        ),
    ]

    print("\n" + "="*80)
    print("ORIGINAL IMPLEMENTATION")
    print("="*80)

    original_results = []
    for i, (desc, input_text, expected) in enumerate(test_cases, 1):
        result = test_pattern(i, desc, input_text, expected, fix_toggle_formatting_ORIGINAL)
        original_results.append(result)

    print("\n" + "="*80)
    print("PROPOSED IMPLEMENTATION")
    print("="*80)

    proposed_results = []
    for i, (desc, input_text, expected) in enumerate(test_cases, 1):
        result = test_pattern(i, desc, input_text, expected, fix_toggle_formatting_PROPOSED)
        proposed_results.append(result)

    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)

    original_passed = sum(original_results)
    proposed_passed = sum(proposed_results)
    total = len(test_cases)

    print(f"\nOriginal Implementation: {original_passed}/{total} passed")
    print(f"Proposed Implementation: {proposed_passed}/{total} passed")

    if proposed_passed > original_passed:
        print(f"\n✅ Proposed fix improves on original (+{proposed_passed - original_passed} tests)")
        return 0
    elif proposed_passed == total:
        print(f"\n✅ Proposed fix passes all tests!")
        return 0
    else:
        print(f"\n⚠️  Proposed fix still has issues ({total - proposed_passed} failing)")
        return 1


if __name__ == '__main__':
    import sys
    sys.exit(main())
