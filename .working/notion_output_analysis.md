# Notion Output Analysis - Attempt 1

## What We Expected
```markdown
**[[Kyle/Nameless]]'s Hook:**
**Travel to [[Agastia]]:**
**[[Corvin Tradewise]]:**
```

## What Notion ACTUALLY Returns
```markdown
**[[Kyle/Nameless]]'s Hook:****     ← Extra ** at end!
**Travel to ****[[Agastia Region]]:** ← Extra ** in middle!
**[[Corvin Tradewise]]:**            ← CORRECT ✓
```

## Pattern Analysis

### Pattern 1: Simple entity at start (WORKS)
- **Input:** `**[[Entity]]:**`
- **Notion:** `**[[Entity]]:**` ✓
- **Status:** Already correct, normalizer preserves

### Pattern 2: Entity with possessive + text (BROKEN)
- **Input:** `**[[Entity]]'s Text:**`
- **Notion:** `**[[Entity]]'s Text:****`
- **Problem:** Extra `**` at the end
- **Fix needed:** Remove trailing `****`

### Pattern 3: Text before entity (BROKEN)
- **Input:** `**Text [[Entity]]:**`
- **Notion:** `**Text ****[[Entity]]:**`
- **Problem:** Extra `**` before the wikilink
- **Fix needed:** Remove middle `****`

## Root Cause

Notion treats wikilinks as separate formatting regions within bold blocks:
- Bold block: `**...**`
- Wikilink inside: Notion adds `**` boundaries around it
- Result: `**text ****[[link]]** text**` (double bold markers)

## Required Normalizer Fixes

1. Remove `****` (4 asterisks) in middle of bold: `**Text ****[[Link]]:` → `**Text [[Link]]:`
2. Remove `****` (4 asterisks) at end of bold: `**[[Link]]'s Text:****` → `**[[Link]]'s Text:**`
3. Preserve correct patterns: `**[[Link]]:**` → `**[[Link]]:**` (no change)

## Test Cases Needed

```python
# Pattern: Text before wikilink
"**Travel to ****[[Agastia]]:**" → "**Travel to [[Agastia]]:**"

# Pattern: Possessive after wikilink
"**[[Kyle/Nameless]]'s Hook:****" → "**[[Kyle/Nameless]]'s Hook:**"

# Pattern: Simple entity (already correct)
"**[[Corvin Tradewise]]:**" → "**[[Corvin Tradewise]]:**"
```
