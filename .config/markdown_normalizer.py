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
    Fix bold formatting around wikilinks to match CORRECT format.

    CORRECT format: **[[Entity]]:** (entity IS bold, entire subject bold)

    User-requested simple fixes:
    1. Replace **** with ** (no empty bold, no need for nested bold)
    2. Remove italic wrappers from wikilinks (we don't use italics)
    3. Old format fixes for manual edits

    Args:
        text: Input markdown text

    Returns:
        Text with fixed bold+wikilink patterns matching CORRECT format
    """
    # FIX 1a: Collapse nested bold markers (** **) that Notion creates
    # Notion wraps renamed wikilinks in their own bold inside parent bold

    # Pattern 1: **Text **[[Entity]]** more** → **Text [[Entity]] more**
    text = re.sub(r'(\S)\s*\*\*(\[\[[^\]]+\]\])\*\*', r'\1 \2', text)

    # Pattern 2: **Text - **[[Entity]] → **Text - [[Entity]]
    # (handles cases without closing ** after wikilink)
    text = re.sub(r'\*\*([^*\n]+)\s+-\s+\*\*(\[\[[^\]]+\]\])', r'**\1 - \2', text)

    # FIX 1b: Replace 3+ consecutive asterisks with ** (handles any nesting level)
    # Notion can return 4, 6, 8+ asterisks depending on nesting
    # We normalize all of them to just **
    text = re.sub(r'\*{3,}', '**', text)

    # FIX 2: Remove italic wrappers from wikilinks (we don't use italics)
    # More aggressive approach: remove single * before and after wikilinks independently
    # This catches cases where Notion adds italics inconsistently

    # Remove single * before [[ (but not ** which is bold)
    # Negative lookbehind: not preceded by *, negative lookahead: not followed by *
    text = re.sub(r'(?<!\*)\*(?!\*)(\[\[)', r'\1', text)

    # Remove single * after ]] (but not ** which is bold)
    # Negative lookbehind: not preceded by *, negative lookahead: not followed by *
    text = re.sub(r'(\]\])(?<!\*)\*(?!\*)', r'\1', text)

    # FIX 3: Notion-specific bold pattern fixes
    # Notion stores bold incorrectly: [[Entity]]**Text:** instead of **[[Entity]]Text:**
    # We need to move the ** to the beginning of the subject

    # Fix 3a: List items with possessive - [[Entity]]**'s Text: → **[[Entity]]'s Text:
    text = re.sub(r'(\d+\.|[-*])\s+\[\[([^\]]+)\]\]\*\*', r'\1 **[[\2]]', text)

    # Fix 3b: Standalone subjects - [[Entity]]** → **[[Entity]]
    text = re.sub(r'^\s*\[\[([^\]]+)\]\]\*\*', r'**[[\1]]', text, flags=re.MULTILINE)

    # OLD FORMAT FIXES DISABLED
    # These were designed for fixing manual edits in local files
    # They INTERFERE with Notion output normalization by ADDING asterisks
    # Example: Notion sends "[[Entity]]**'s Hook:**", old fix converts to "**[[Entity]]'s Hook:**"
    # but leaves the trailing "**" from Notion, resulting in "**[[Entity]]'s Hook:****"
    #
    # OLD FORMAT FIX 1: [[Entity]]**: → **[[Entity]]:** (simple case)
    # text = re.sub(r'^\s*(\d+\.|[-*])\s+\[\[([^\]]+)\]\]\*\*:', r'\1 **[[\2]]:**', text, flags=re.MULTILINE)
    #
    # OLD FORMAT FIX 2: [[Entity]]**'s Text: → **[[Entity]]'s Text:** (possessive)
    # text = re.sub(r"^\s*(\d+\.|[-*])\s+\[\[([^\]]+)\]\]\*\*'s ([^*:\n]+):", r"\1 **[[\2]]'s \3:**", text, flags=re.MULTILINE)
    #
    # OLD FORMAT FIX 3: [[Entity]]**'s Location** → **[[Entity]]'s Location** (heading-style)
    # text = re.sub(r"^\s*\[\[([^\]]+)\]\]\*\*'s ([^\*\n]+)\*\*", r"**[[\1]]'s \2**", text, flags=re.MULTILINE)
    #
    # OLD FORMAT FIX 4: **Subject - **[[Entity]] → **Subject - [[Entity]]** (composite)
    # text = re.sub(r'\*\*([^*\n]+) - \*\*(\[\[[^\]]+\]\])', r'**\1 - \2**', text)
    #
    # OLD FORMAT FIX 5: [[Entity]]** - Text** → **[[Entity]] - Text** (entity first)
    # text = re.sub(r'\[\[([^\]]+)\]\]\*\* - ([^*\n]+)\*\*', r'**[[\1]] - \2**', text)

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
    DISABLED: Accept Notion's whitespace exactly as-is.

    Previous behavior was adding blank lines to match our conventions.
    User request: "Update our md formatting to have this whitespace instead
    of trying to detect it on import."

    This means we accept whatever Notion gives us - extra blank lines,
    indentation changes, etc. The goal is to minimize diffs by not fighting
    Notion's formatting choices.

    Args:
        lines: List of markdown lines from Notion

    Returns:
        Same lines unchanged (pass-through)
    """
    # Just return the lines as-is - accept Notion's whitespace
    return lines


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

    # Test 1: Notion returns italic wrapper AND extra **
    test1 = "  1. **Travel to *[[Agastia Region]]*:** 2-3 day journey"
    expected1 = "  1. **Travel to [[Agastia Region]]:** 2-3 day journey"
    result1 = fix_bold_wikilink_formatting(test1)
    assert result1 == expected1, f"Test 1 failed:\n  got: '{result1}'\n  exp: '{expected1}'"
    print(f"✅ Test 1 passed: {result1}")

    # Test 2: Notion returns 4 extra ** at end (possessive)
    test2 = "  2. **[[Kyle/Nameless]]'s Hook:****  An encounter"
    expected2 = "  2. **[[Kyle/Nameless]]'s Hook:**  An encounter"
    result2 = fix_bold_wikilink_formatting(test2)
    assert result2 == expected2, f"Test 2 failed:\n  got: '{result2}'\n  exp: '{expected2}'"
    print(f"✅ Test 2 passed: {result2}")

    # Test 2b: Notion returns 4 extra ** at end (simple)
    test2b = "  - **[[Corvin Tradewise]]:****  Merchant leader"
    expected2b = "  - **[[Corvin Tradewise]]:**  Merchant leader"
    result2b = fix_bold_wikilink_formatting(test2b)
    assert result2b == expected2b, f"Test 2b failed:\n  got: '{result2b}'\n  exp: '{expected2b}'"
    print(f"✅ Test 2b passed: {result2b}")

    # Test 2c: Notion returns 6 asterisks (nested bold)
    test2c = "  - **[[Corvin Tradewise]]:******  Merchant leader"
    expected2c = "  - **[[Corvin Tradewise]]:**  Merchant leader"
    result2c = fix_bold_wikilink_formatting(test2c)
    assert result2c == expected2c, f"Test 2c failed:\n  got: '{result2c}'\n  exp: '{expected2c}'"
    print(f"✅ Test 2c passed: {result2c}")

    # Test 3: Already correct format (Notion doesn't break simple entities)
    test3 = "  - **[[Corvin Tradewise]]:** Merchant leader"
    expected3 = "  - **[[Corvin Tradewise]]:** Merchant leader"
    result3 = fix_bold_wikilink_formatting(test3)
    assert result3 == expected3, f"Test 3 failed:\n  got: '{result3}'\n  exp: '{expected3}'"
    print(f"✅ Test 3 passed: {result3}")

    # Test 4: Toggle fix
    test4 = "**Toggle: **Session Flow**"
    expected4 = "**Toggle: Session Flow**"
    result4 = fix_toggle_formatting(test4)
    assert result4 == expected4, f"Test 4 failed: {result4}"
    print(f"✅ Test 4 passed: {result4}")

    # Test 5: Composite subject with italics - **Forest Clearing - *[[Lost Mastiff]]* → **Forest Clearing - [[Lost Mastiff]]
    test5 = "**Forest Clearing - *[[Lost Mastiff]]*"
    expected5 = "**Forest Clearing - [[Lost Mastiff]]"
    result5 = fix_bold_wikilink_formatting(test5)
    assert result5 == expected5, f"Test 5 failed: got '{result5}', expected '{expected5}'"
    print(f"✅ Test 5 passed: {result5}")

    # Test 6: Full normalization (accepting Notion's whitespace)
    test6 = """# Heading
Text here
## Section
  - **[[Corvin Tradewise]]:****  Merchant leader
  - **Travel to *[[Agastia Region]]*:** 2-3 days"""

    result6 = normalize_markdown_output(test6)
    # We now accept Notion's whitespace (no blank line added before ##)
    expected6 = """# Heading
Text here
## Section
  - **[[Corvin Tradewise]]:**  Merchant leader
  - **Travel to [[Agastia Region]]:** 2-3 days"""
    assert result6 == expected6, f"Test 6 failed:\n  got: '{result6}'\n  exp: '{expected6}'"
    print(f"✅ Test 6 passed - Full normalization")

    print("\n✅ All tests passed!")
