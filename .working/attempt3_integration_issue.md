# Attempt 3: Integration Issue - Normalizer Not Being Applied

## Status: INTEGRATION FAILURE

The normalizer logic is **correct** but is **not being applied** during the pull process.

## User's Requested Fixes (All Implemented)

1. ✅ Replace `****` with `**` (simple global replacement)
2. ✅ Ignore Agastia → Agastia Region issue (to be fixed later with document merge)
3. ✅ Remove italic wrappers: `*[[` → `[[` and `]]*` → `]]`
4. ✅ (duplicate of 1)
5. ⏳ Ignore indentation (should be handled by hashing - not tested yet)
6. ⏳ Update MD formatting to accept Notion's whitespace (not implemented yet)

## Evidence: Normalizer Works in Isolation

### Test Results
```bash
$ python3 .config/markdown_normalizer.py
Testing markdown normalization...
✅ Test 1 passed:   1. **Travel to [[Agastia Region]]:** 2-3 day journey
✅ Test 2 passed:   2. **[[Kyle/Nameless]]'s Hook:**  An encounter
✅ Test 2b passed:   - **[[Corvin Tradewise]]:**  Merchant leader
✅ Test 3 passed:   - **[[Corvin Tradewise]]:** Merchant leader
✅ Test 4 passed: **Toggle: Session Flow**
✅ Test 5 passed: **Forest Clearing - [[Lost Mastiff]]**
✅ Test 6 passed - Full normalization

✅ All tests passed!
```

### Manual Application Works
```python
# Applied normalizer directly to pulled file
Line 42: 2. **[[Kyle/Nameless]]'s Hook:** An encounter...
  Pattern around 'Hook:': s Hook:** An
```
**Result**: `:****` correctly becomes `:**` ✅

## Evidence: Normalizer NOT Applied During Pull

### Pull Script Output
```bash
$ python3 .config/pull_session_notes_v2.py
📄 Session 3: Session_3_The_Steel_Dragon_Begins.md
   Pulling from Notion...
   ✅ Updated Session_3_The_Steel_Dragon_Begins.md
```

### Actual Pulled File
```bash
$ grep -n "Kyle/Nameless.*Hook" Sessions/Session_3_The_Steel_Dragon_Begins.md
41:2. **[[Kyle/Nameless]]'s Hook:**** An encounter...
```
**Result**: Still has `:****` (4 asterisks) ❌

### Diff Count
```bash
$ git diff Sessions/Session_3_The_Steel_Dragon_Begins.md | wc -l
389 lines
```
(Down from 404, but still way too high)

## Investigation Steps Taken

1. ✅ Verified normalizer is imported in pull script
2. ✅ Verified `normalize_markdown_output()` is called at line 270
3. ✅ Cleared Python `__pycache__` directory
4. ✅ Re-ran pull with `-B` flag (no bytecode)
5. ✅ Manually applied normalizer (works correctly)

## Root Cause: Unknown Integration Issue

The normalizer function is being called in the code:
```python
# Line 270 in pull_session_notes_v2.py
notion_content = normalize_markdown_output(notion_content)
```

But the normalization is **not being applied** to the output file.

## Possible Causes

1. **Silent exception**: Normalizer might be raising an exception that's being caught/ignored
2. **String mismatch**: The string being passed to normalizer might not be what we expect
3. **Overwrite**: File might be written before normalization, or normalization result discarded
4. **Conditional skip**: Some condition might be skipping the normalization step

## Next Steps (Per Two-Failure Rule)

This is Attempt 3, and we've identified:
- **Working**: Normalizer logic (all tests pass)
- **Broken**: Integration between pull script and normalizer
- **Needed**: Sub-agent to investigate pull_session_notes_v2.py flow

## Recommended Action

Spawn sub-agent to:
1. Add debug logging to pull script
2. Verify normalizer is actually called (not skipped by conditional)
3. Verify normalizer return value is used
4. Check for exception handling that might be swallowing errors
5. Trace the full data flow from Notion API → normalizer → file write
