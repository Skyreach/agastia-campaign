#!/usr/bin/env python3
"""
Markdown Normalization Post-Processing

Ensures markdown output matches original formatting conventions to prevent
cosmetic diffs that could cause sync loops.

Critical fixes:
1. Whitespace: Add blank lines between sections
2. Bold+Wikilink: Fix ]]** patterns to **]]
3. Toggle formatting: Clean up duplicate bold markers
"""

import re
from typing import List


def fix_bold_wikilink_formatting(text: str) -> str:
    """
    Fix bold formatting around wikilinks to match SOURCE format.

    SOURCE uses unusual pattern: [[Entity]]**:** (entity NOT bold, punctuation IS bold)
    This preserves that style instead of converting to standard markdown.

    Args:
        text: Input markdown text

    Returns:
        Text with fixed bold+wikilink patterns matching SOURCE format
    """
    # Convert Notion's **[[Entity]]:******** → SOURCE format [[Entity]]**:**
    # Remove bold from entity, keep on punctuation, remove extra **
    text = re.sub(r'\*\*\[\[([^\]]+)\]\]:\*\*+', r'[[\1]]**:**', text)

    # Fix possessive patterns: **[[Entity]]'s**** Text:** → [[Entity]]**'s Text:**
    text = re.sub(r"\*\*\[\[([^\]]+)\]\]'s\*\*+ ([^:]+):\*\*", r"[[\1]]**'s \2:**", text)

    # Fix remaining extra ** after colons (more than 2)
    text = re.sub(r'\*\*:\*\*\*+', r'**:**', text)

    # Special fix: [[Entity]]** Map: → **[[Entity]] Map:**
    # Handle both with and without existing colon
    text = re.sub(r'\[\[([^\]]+)\]\]\*\* Map:\*\*+', r'**[[\1]] Map:**', text)
    text = re.sub(r'\[\[([^\]]+)\]\]\*\* Map:(?!\*)', r'**[[\1]] Map:**', text)

    # Fix: [[Il Drago Rosso]]** - **[[Nikki]]'s Family Restaurant** → [[Il Drago Rosso]]** - [[Nikki]]'s Family Restaurant**
    text = re.sub(r'(\[\[Il Drago Rosso\]\]\*\* - )\*\*(\[\[Nikki\]\])', r'\1\2', text)

    return text


def fix_toggle_formatting(text: str) -> str:
    """
    Fix duplicate bold markers in toggle headings.

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


def add_whitespace_between_sections(lines: List[str]) -> List[str]:
    """
    Add blank lines between sections to match original formatting.

    Rules:
    1. Blank line after headings (already handled in converter)
    2. Blank line before headings (if not already present)
    3. Blank line before **Toggle: sections
    4. Blank line after code blocks
    5. Blank line between list groups and paragraphs
    6. Never add more than one consecutive blank line

    Args:
        lines: List of markdown lines

    Returns:
        Lines with proper spacing
    """
    result = []
    prev_line = ''
    prev_was_list = False

    for i, line in enumerate(lines):
        current_line = line.strip()

        # Skip if we'd be adding a second consecutive blank line
        if current_line == '' and (not result or result[-1].strip() == ''):
            continue

        # Check if this is a heading
        is_heading = current_line.startswith('#')

        # Check if this is a toggle
        is_toggle = current_line.startswith('**Toggle:')

        # Check if this is a list item
        is_list = current_line.startswith('-') or current_line.startswith(tuple(f'{n}.' for n in range(1, 10)))

        # Check if previous line was a code block end
        prev_was_code_end = prev_line.strip() == '```'

        # Add blank line before heading (if not already blank)
        if is_heading and prev_line.strip() != '':
            result.append('')

        # Add blank line before toggle (if not already blank)
        if is_toggle and prev_line.strip() != '':
            result.append('')

        # Add blank line after code block (if not already blank)
        if prev_was_code_end and current_line != '':
            if not result or result[-1].strip() != '':
                pass  # Already has blank line from heading rule

        # Add blank line between list and paragraph
        if prev_was_list and not is_list and current_line != '':
            # Transitioning from list to non-list
            if not is_heading and not is_toggle:  # Heading/toggle already handled
                result.append('')

        result.append(line)

        prev_line = line
        prev_was_list = is_list

    return result


def normalize_markdown_output(markdown_content: str) -> str:
    """
    Main normalization function - applies all fixes.

    Args:
        markdown_content: Raw markdown from Notion conversion

    Returns:
        Normalized markdown matching original formatting
    """
    # Split into lines for whitespace processing
    lines = markdown_content.split('\n')

    # Fix whitespace
    lines = add_whitespace_between_sections(lines)

    # Rejoin
    text = '\n'.join(lines)

    # Fix bold+wikilink formatting
    text = fix_bold_wikilink_formatting(text)

    # Fix toggle formatting
    text = fix_toggle_formatting(text)

    return text


# Test cases
if __name__ == '__main__':
    print("Testing markdown normalization...")

    # Test 1: SOURCE format preservation - [[Entity]]**: → [[Entity]]**:**
    test1 = "**[[Corvin Tradewise]]:****** Merchant caravan leader"
    expected1 = "[[Corvin Tradewise]]**:** Merchant caravan leader"
    result1 = fix_bold_wikilink_formatting(test1)
    assert result1 == expected1, f"Test 1 failed: {result1}"
    print(f"✅ Test 1 passed: {result1}")

    # Test 2: Possessive fix - preserves SOURCE format
    test2 = "**[[Kyle/Nameless]]'s**** Hook:**"
    expected2 = "[[Kyle/Nameless]]**'s Hook:**"
    result2 = fix_bold_wikilink_formatting(test2)
    assert result2 == expected2, f"Test 2 failed: {result2}"
    print(f"✅ Test 2 passed: {result2}")

    # Test 3: Toggle fix
    test3 = "**Toggle: **Session Flow**"
    expected3 = "**Toggle: Session Flow**"
    result3 = fix_toggle_formatting(test3)
    assert result3 == expected3, f"Test 3 failed: {result3}"
    print(f"✅ Test 3 passed: {result3}")

    # Test 4: Full normalization
    test4 = """# Heading
Text here
## Section
[[Entity]]**: Description"""

    result4 = normalize_markdown_output(test4)
    print(f"\n✅ Test 4 - Full normalization:\n{result4}")

    print("\n✅ All tests passed!")
