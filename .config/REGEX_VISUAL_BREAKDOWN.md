# Visual Regex Pattern Breakdown

## The Failing Pattern: Test 3

### Input String
```
**Toggle: **Tier 2 - **[[Noble Quarter]]**
```

### What We Want
```
**Toggle: Tier 2 - [[Noble Quarter]]**
```

---

## Original Implementation Analysis

### Regex 1: `r'\*\*Toggle:\s+\*\*'` → `r'**Toggle: '`

**What it matches:**
```
**Toggle: **Tier 2 - **[[Noble Quarter]]**
└──────────┘
   Matched
```

**After replacement:**
```
**Toggle: Tier 2 - **[[Noble Quarter]]**
         └──────────────────────────────┘
         Problem: Still has ** around wikilink
```

### Regex 2: `r'(\*\*Toggle: [^\*]+)\*\*\*\*'` → `r'\1**'`

**Pattern:** `(\*\*Toggle: [^\*]+)\*\*\*\*`
- `(\*\*Toggle: [^\*]+)` - Capture `**Toggle: ` followed by non-asterisk chars
- `\*\*\*\*` - Match four asterisks at the end

**Problem:** The `[^\*]+` stops at the first asterisk, so it can't capture content with `**` in it!

```
**Toggle: Tier 2 - **[[Noble Quarter]]**
└────────────────┘
    Captured (stops at first ** in "- **[[...")
```

**Why it fails:**
- `[^\*]+` means "one or more non-asterisk characters"
- When it hits the `**` before `[[Noble Quarter]]`, it STOPS
- Never captures the wikilink portion
- Never matches the pattern because it expects `****` at the end after the captured portion

---

## Proposed Fix Analysis

### New Regex Pattern

```python
r'\*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$'
```

### Visual Breakdown

```
Pattern:  \*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$

Input:    **Toggle: **Tier 2 - **[[Noble Quarter]]**
          └────────┘ └─┘ └────────────────────────┘ └┘
          Part 1      2   Part 3 (captured)        4

Part 1: \*\*Toggle:\s+
        Matches: "**Toggle: " (literal)

Part 2: \*\*
        Matches: duplicate "**" after "Toggle: "

Part 3: (.*?)
        Matches: "Tier 2 - **[[Noble Quarter]]" (non-greedy, captured in group 1)
        ↑ This is the KEY: .* matches ANY character, including *

Part 4: (?:\*\*)+$
        Matches: one or more "**" at end of line (non-capturing)
```

### Why `.` (dot) vs `[^\*]` Matters

**`[^\*]+` (original):**
- Matches: Any character EXCEPT asterisks
- Problem: Stops at first `*`, can't capture `**[[Noble Quarter]]**`

**`.*?` (proposed):**
- Matches: ANY character (including asterisks)
- `?` makes it non-greedy (stops at first valid end match)
- Can capture: `Tier 2 - **[[Noble Quarter]]` including the `**`

### Example Matching Steps

```
Step 1: Match opening
        **Toggle: **Tier 2 - **[[Noble Quarter]]**
        └────────┘ └─┘
        ✓ Matched \*\*Toggle:\s+\*\*

Step 2: Capture content (non-greedy)
        **Toggle: **Tier 2 - **[[Noble Quarter]]**
                    └────────────────────────┘
        ✓ Captured by (.*?)
        Group 1 = "Tier 2 - **[[Noble Quarter]]"
        (Stops when it sees (?:\*\*)+$ pattern ahead)

Step 3: Match ending asterisks
        **Toggle: **Tier 2 - **[[Noble Quarter]]**
                                                 └┘
        ✓ Matched by (?:\*\*)+$

Full match: "**Toggle: **Tier 2 - **[[Noble Quarter]]**"
Group 1:    "Tier 2 - **[[Noble Quarter]]"
```

### Lambda Function Processing

```python
lambda m: f"**Toggle: {m.group(1).replace('**', '')}**"
```

```
Step 1: Extract group 1
        m.group(1) = "Tier 2 - **[[Noble Quarter]]"

Step 2: Strip all ** from content
        .replace('**', '')
        Result: "Tier 2 - [[Noble Quarter]]"

Step 3: Rebuild with clean opening/closing
        f"**Toggle: {result}**"
        Final: "**Toggle: Tier 2 - [[Noble Quarter]]**"
```

---

## Side-by-Side Comparison

### Pattern: `**Toggle: **Multiple **[[E1]]** and **[[E2]]****`

#### Original Implementation

```
Regex 1: \*\*Toggle:\s+\*\*
Match:   **Toggle: **Multiple **[[E1]]** and **[[E2]]****
         └──────────┘
Replace: **Toggle: Multiple **[[E1]]** and **[[E2]]****
         Problem: Still has ** around wikilinks

Regex 2: (\*\*Toggle: [^\*]+)\*\*\*\*
Match:   **Toggle: Multiple **[[E1]]** and **[[E2]]****
         └──────────────────┘
         [^\*]+ stops at first *, never matches the full pattern
Result:  No match, no change
         **Toggle: Multiple **[[E1]]** and **[[E2]]****
```

#### Proposed Fix

```
Regex:   \*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$
Match:   **Toggle: **Multiple **[[E1]]** and **[[E2]]****
         └────────┘ └─┘ └─────────────────────────────┘ └──┘
         Opening     Dup  Captured content             End

Capture: "Multiple **[[E1]]** and **[[E2]]**"
Strip:   "Multiple [[E1]] and [[E2]]"
Rebuild: "**Toggle: Multiple [[E1]] and [[E2]]**"
```

---

## Key Insights

### Why the Original Failed

1. **Too specific:** `[^\*]+` couldn't handle asterisks in content
2. **Greedy matching:** Expected exact pattern of `****` at end
3. **Single pass:** Only removed duplicate after "Toggle:", missed nested bold

### Why the Proposed Works

1. **Flexible:** `.*?` matches any content including asterisks
2. **Non-greedy:** `?` stops at first valid end match
3. **Complete cleanup:** `.replace('**', '')` strips ALL asterisks from content
4. **MULTILINE flag:** `$` matches end of line, not just end of string

### The Magic of Non-Greedy Matching

```
Greedy (.*):     Matches as MUCH as possible
                 **Toggle: **Text** (.*) matches: "**Text**"
                 Captures too much!

Non-greedy (.*?): Matches as LITTLE as possible
                  **Toggle: **Text** (.*?) matches: "Text"
                  Stops at first ** when (?:\*\*)+$ pattern ahead
                  Perfect!
```

---

## Regex Flags: MULTILINE Explained

### Without MULTILINE

```python
text = "Line 1: **Toggle: **Text**\nLine 2: More text"

# $ matches end of STRING
re.sub(r'pattern$', replacement, text)
# Only matches if pattern is at very end of entire string
```

### With MULTILINE

```python
text = "Line 1: **Toggle: **Text**\nLine 2: More text"

# $ matches end of LINE
re.sub(r'pattern$', replacement, text, flags=re.MULTILINE)
# Matches pattern at end of each line
```

### Why It Matters for Toggle

```
Document with multiple toggles:

**Toggle: **Section 1**
Some content
**Toggle: **Section 2**
More content

Without MULTILINE:
  $ only matches at "More content$"
  Only last toggle would be processed

With MULTILINE:
  $ matches at end of each toggle line
  All toggles are processed
```

---

## Complete Pattern Reference

### Proposed Fix

```python
text = re.sub(
    r'\*\*Toggle:\s+\*\*(.*?)(?:\*\*)+$',
    lambda m: f"**Toggle: {m.group(1).replace('**', '')}**",
    text,
    flags=re.MULTILINE
)
```

### Pattern Components

| Component | Meaning | Example Match |
|-----------|---------|---------------|
| `\*\*Toggle:\s+` | Literal `**Toggle: ` with whitespace | `**Toggle: ` |
| `\*\*` | Duplicate asterisks after Toggle | `**` |
| `(.*?)` | Non-greedy capture of ANY content | `Tier 2 - **[[Noble]]` |
| `(?:\*\*)+` | One or more `**` at end (non-capturing) | `**` or `****` |
| `$` | End of line (with MULTILINE flag) | (end of line) |

### Lambda Function

| Operation | Purpose | Example |
|-----------|---------|---------|
| `m.group(1)` | Extract captured content | `"Tier 2 - **[[Noble]]"` |
| `.replace('**', '')` | Strip all asterisks | `"Tier 2 - [[Noble]]"` |
| `f"**Toggle: {content}**"` | Rebuild with single bold | `"**Toggle: Tier 2 - [[Noble]]**"` |

---

## Testing Matrix

| Input | Match? | Capture | After Strip | Result |
|-------|--------|---------|-------------|--------|
| `**Toggle: **Text**` | ✓ | `Text` | `Text` | `**Toggle: Text**` |
| `**Toggle: **Text****` | ✓ | `Text**` | `Text` | `**Toggle: Text**` |
| `**Toggle: **A **[[E]]** B**` | ✓ | `A **[[E]]** B` | `A [[E]] B` | `**Toggle: A [[E]] B**` |
| `**Toggle: Text**` | ✗ | - | - | `**Toggle: Text**` (unchanged) |

Last row shows pattern that's already correct - the regex doesn't match it because there's no duplicate `**` after "Toggle:", so it's left unchanged. Perfect!
