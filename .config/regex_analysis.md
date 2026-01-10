# Regex Pattern Analysis - markdown_normalizer.py

## Summary

**Status:**
- ✅ Test 1 PASSES: `**[[Kyle/Nameless]]'s** Hook:**` → `**[[Kyle/Nameless]]'s Hook:**`
- ✅ Test 2 PASSES: `**[[Corvin Tradewise]]:**** Merchant` → `**[[Corvin Tradewise]]:** Merchant`
- ❌ Test 3 FAILS: `**Toggle: **Tier 2 - **[[Noble Quarter]]**` → Should strip nested `**`

## Test 1: Bold Possessive + Text (PASSES)

### Input Pattern
```
**[[Kyle/Nameless]]'s** Hook:**
```

### Current Regex (Line 45)
```python
text = re.sub(r'\*\*\[\[([^\]]+)\]\]\'s\*\* ([^:]+:)\*\*', r"**[[\1]]'s \2**", text)
```

### What It Matches
- `\*\*\[\[([^\]]+)\]\]\'s\*\*` - Matches `**[[Kyle/Nameless]]'s**`
  - Captures `Kyle/Nameless` in group 1
- ` ` - Matches single space
- `([^:]+:)` - Matches `Hook:` (everything up to and including colon)
  - Captures `Hook:` in group 2
- `\*\*` - Matches trailing `**`

### Replacement
- `**[[\1]]'s \2**` → `**[[Kyle/Nameless]]'s Hook:**`

### Why It Works
The regex correctly identifies the misplaced bold markers:
1. Bold around wikilink+possessive (`**[[Entity]]'s**`)
2. Additional text with colon (`Hook:`)
3. Trailing bold marker (`**`)

It repositions the closing bold marker after the colon instead of after the possessive.

---

## Test 2: Trailing Bold After Colon (PASSES)

### Input Pattern
```
**[[Corvin Tradewise]]:**** Merchant
```

### Current Regex (Line 41)
```python
text = re.sub(r'(\*\*\[\[([^\]]+)\]\]:)\*\*', r'\1', text)
```

### What It Matches
- `(\*\*\[\[([^\]]+)\]\]:)` - Matches `**[[Corvin Tradewise]]:**`
  - Captures entire pattern in group 1
  - Captures `Corvin Tradewise` in group 2 (unused)
- `\*\*` - Matches trailing `**`

### Replacement
- `\1` → `**[[Corvin Tradewise]]:`
- Simply removes the trailing `**`

### Why It Works
The regex identifies the duplicate bold closure after the colon and removes it. This handles the Notion quirk where it adds bold to the mention and the punctuation separately, creating `**[[E]]**:**` which becomes `**[[E]]:****` when concatenated.

---

## Test 3: Toggle with Nested Bold (FAILS)

### Input Pattern
```
**Toggle: **Tier 2 - **[[Noble Quarter]]**
```

### Expected Output
```
**Toggle: Tier 2 - [[Noble Quarter]]**
```

### Current Regex (Line 70)
```python
text = re.sub(r'\*\*Toggle:\s+\*\*', r'**Toggle: ', text)
```

### What It Matches
- `\*\*Toggle:\s+\*\*` - Matches `**Toggle: **`
- Replacement: `**Toggle: ` (removes the duplicate ** after "Toggle: ")

### What Actually Happens
```
Input:    **Toggle: **Tier 2 - **[[Noble Quarter]]**
After:    **Toggle: Tier 2 - **[[Noble Quarter]]**
Expected: **Toggle: Tier 2 - [[Noble Quarter]]**
```

The regex fixes the duplicate `**` after "Toggle:" but **doesn't handle the nested bold markers around the wikilink**.

### Why It Fails

The current regex only removes the duplicate `**` immediately after "Toggle:", but it doesn't handle:
1. Bold markers mid-line (`**[[Noble Quarter]]**`)
2. The final closing `**` for the toggle

The pattern we need to match is:
- `**Toggle: ` - Opening bold
- `**Tier 2 - **[[Noble Quarter]]**` - Content with nested bold markers
- `**` - Closing bold (implied, may or may not exist)

### Root Cause

**The problem:** Notion is adding bold markers to:
1. The toggle heading itself (`**Toggle: ...**`)
2. The wikilink inside the toggle (`**[[Noble Quarter]]**`)

This creates a pattern like:
```
**Toggle: **Tier 2 - **[[Noble Quarter]]****
```

Or in this case:
```
**Toggle: **Tier 2 - **[[Noble Quarter]]**
```

The current regex fixes the first duplicate (`**Toggle: **`) but leaves the nested wikilink bold markers intact.

### The Fix Needed

We need a regex that:
1. Identifies toggle lines (`**Toggle: `)
2. Removes ALL internal `**` markers
3. Ensures a single closing `**` at the end

### Proposed Solution

**Option 1: Two-pass approach**
```python
# First: Fix the duplicate ** after Toggle:
text = re.sub(r'\*\*Toggle:\s+\*\*', r'**Toggle: ', text)

# Second: Remove bold markers from wikilinks inside toggle lines
text = re.sub(r'(\*\*Toggle: [^\n]*?)\*\*(\[\[[^\]]+\]\])\*\*([^\n]*?\*\*)', r'\1\2\3', text)
```

**Issue with Option 1:** This assumes only one wikilink per toggle. If there are multiple, it won't catch them all.

**Option 2: Remove all ** except opening/closing in toggle lines**
```python
# Match entire toggle line and rebuild without internal **
def fix_toggle_bold(match):
    content = match.group(1)
    # Remove all ** from content
    content = content.replace('**', '')
    return f'**Toggle: {content}**'

text = re.sub(r'\*\*Toggle:\s+\*\*(.*?)(?:\*\*)?$', fix_toggle_bold, text, flags=re.MULTILINE)
```

**Issue with Option 2:** Uses a callback function, which is more complex than the current simple regex replacements.

**Option 3: Greedy match and strip (RECOMMENDED)**
```python
# Match the entire toggle line and strip internal bold markers
text = re.sub(
    r'\*\*Toggle:\s+\*\*(.*?)\*\*(?:\*\*)?',
    lambda m: f"**Toggle: {m.group(1).replace('**', '')}**",
    text
)
```

This approach:
1. Matches `**Toggle: **`
2. Captures everything until the final `**` (or `****`)
3. Strips all `**` from the captured content
4. Rebuilds with clean opening and closing markers

### Edge Cases to Test

1. `**Toggle: **Simple text**` → `**Toggle: Simple text**`
2. `**Toggle: **Text with **[[Entity]]****` → `**Toggle: Text with [[Entity]]**`
3. `**Toggle: **Multiple **[[E1]]** and **[[E2]]****` → `**Toggle: Multiple [[E1]] and [[E2]]**`
4. `**Toggle: **Text**` (already correct) → `**Toggle: Text**` (no change)

---

## Recommended Fix

Replace the `fix_toggle_formatting()` function with:

```python
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
```

### How the New Regex Works

Pattern: `r'\*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$'`

1. `\*\*Toggle:\s+` - Matches `**Toggle: ` (with any whitespace)
2. `\*\*` - Matches the duplicate `**` after "Toggle: "
3. `(.*?)` - Non-greedy capture of content (group 1)
4. `(?:\*\*)+` - Matches one or more `**` at the end (non-capturing)
5. `$` - End of line (with MULTILINE flag, this is end of line not end of string)

The lambda function:
1. Extracts the content (group 1)
2. Strips all `**` markers from it
3. Rebuilds with clean `**Toggle: {content}**` format

### Test Coverage

After applying this fix, all three test cases should pass:

1. ✅ `**[[Kyle/Nameless]]'s** Hook:**` → `**[[Kyle/Nameless]]'s Hook:**`
2. ✅ `**[[Corvin Tradewise]]:**** Merchant` → `**[[Corvin Tradewise]]:** Merchant`
3. ✅ `**Toggle: **Tier 2 - **[[Noble Quarter]]**` → `**Toggle: Tier 2 - [[Noble Quarter]]**`
