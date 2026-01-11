# Desynchronization Examples - Session 3 Pull from Notion

## Summary
After pulling Session 3 from Notion with normalizer active, we get 404 lines of diff.
The normalizer runs but doesn't fix all patterns.

## Example 1: Extra `**` at end (Simple entity)

**What we push to Notion:**
```markdown
- **[[Corvin Tradewise]]:** Merchant leader
```

**What Notion returns (after normalizer):**
```markdown
- **[[Corvin Tradewise]]:**** Merchant leader
```

**Problem:** Extra `**` at end not being removed
**Expected:** Should match what we pushed

---

## Example 2: Extra `**` at end (Possessive pattern)

**What we push to Notion:**
```markdown
2. **[[Kyle/Nameless]]'s Hook:** An encounter on the road
```

**What Notion returns (after normalizer):**
```markdown
2. **[[Kyle/Nameless]]'s Hook:**** An encounter on the road
```

**Problem:** Extra `**` at end not being removed
**Expected:** Should match what we pushed

---

## Example 3: Wikilink name changed + formatting broken

**What we push to Notion:**
```markdown
- **[[Agastia]] Job Board:** A central location
```

**What Notion returns (after normalizer):**
```markdown
- [[Agastia]]** Job Board:** A central location
```

**Problem:**
1. Wikilink changed from `[[Agastia]]` → `[[Agastia]]`
2. Bold formatting broken: entity NOT bold, `** Job Board:` has misplaced asterisks

**Expected:** Should preserve `[[Agastia]]` and keep `**[[Agastia]] Job Board:**` format

---

## Example 4: Italics wrapper on wikilinks

**What we push to Notion:**
```markdown
1. **Travel to [[Agastia]]:** 2-3 day journey
```

**What Notion returns (after normalizer):**
```markdown
1. **Travel to *[[Agastia]]*:** 2-3 day journey
```

**Problem:**
1. Wikilink wrapped in italics: `*[[Agastia]]*`
2. Wikilink name changed: `Agastia` → `Agastia Region`

**Expected:** Should remove italic wrapper and preserve original wikilink name

---

## Example 5: Indentation changes

**What we push to Notion:**
```markdown
**Toggle: Key NPCs**
  - **[[Corvin Tradewise]]:** Merchant leader
  - **Dead Smuggler:** Victim at crate scene
```

**What Notion returns (after normalizer):**
```markdown
**Toggle: Key NPCs**
- **[[Corvin Tradewise]]:**** Merchant leader
    - **Dead Smuggler:** Victim at crate scene
```

**Problem:**
1. First bullet loses indentation (2 spaces → 0 spaces)
2. Second bullet gains indentation (2 spaces → 4 spaces)
3. Extra `**` on first bullet

**Expected:** Preserve consistent indentation

---

## Example 6: Extra blank lines

**What we push to Notion:**
```markdown
**Encounter Table:** See [[Inspiring Tables#Temperate Forests (Tier 1)]]
### Day 1: The Starfall Anchor Crate
```

**What Notion returns (after normalizer):**
```markdown
**Encounter Table:** See [[Inspiring Tables#Temperate Forests (Tier 1)]]

### Day 1: The Starfall Anchor Crate
```

**Problem:** Extra blank line inserted between sections
**Expected:** Single blank line (or match source)

---

## Root Causes Identified

### Issue 1: Normalizer regex not matching
The normalizer has patterns like:
```python
text = re.sub(r'(\*\*[^\n]*?:)\*\*+(\s)', r'\1**\2', text)
```

But this requires a space after the extra `**`. If there's no space (end of line), it doesn't match.

### Issue 2: Wikilink name changes
Notion is resolving `[[Agastia]]` to `[[Agastia]]` (the full page title).
The normalizer can't fix this - it's a data change, not formatting.

### Issue 3: Normalizer may not be running
The patterns should be caught, but 404 lines of diff suggests the normalizer might not be invoked at all during the pull process.

---

## Next Steps (Per Two-Failure Rule)

1. ✅ Attempt 1: Fixed simple patterns - FAILED (404 line diff)
2. ✅ Attempt 2: Fixed Notion-specific patterns - FAILED (404 line diff)
3. 🔄 Sub-agent: Debug why normalizer isn't fixing patterns
4. ⏳ Attempt 3 (with sub-agent): Fix integration issue
5. ⏳ If Attempt 3 fails: Escalate to user with report

**Current Status:** Spawning sub-agent to investigate pull_session_notes_v2.py integration
