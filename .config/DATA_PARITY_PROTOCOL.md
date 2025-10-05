# DATA PARITY PROTOCOL

## 🚨 CRITICAL RULES (NEVER VIOLATE)

### Rule #1: NO CONSOLIDATION
**BANNED ACTIONS:**
- ❌ "Consolidating" multiple sources into one file
- ❌ "Merging" information from multiple places
- ❌ "Updating with consolidated content"
- ❌ Creating `*_UPDATED`, `*_FINAL`, `*_v2` files
- ❌ Replacing large sections of files with "better" content

**WHY THIS IS BANNED:**
- Creates massive diffs that hide what actually changed
- Loses incremental change history
- Makes git/Notion sync unreliable
- Makes review impossible
- Causes data desync catastrophes

### Rule #2: Small, Incremental Changes Only
**ALLOWED ACTIONS:**
- ✅ Edit specific lines/sections that need correction
- ✅ Add new sections to existing files
- ✅ Delete incorrect sections
- ✅ Fix typos, update values, correct errors

**EACH CHANGE SHOULD:**
- Have clear before/after in git diff
- Be reviewable in < 20 lines
- Have obvious purpose
- Sync to Notion immediately

### Rule #3: One Source of Truth
**IF FILE EXISTS:**
- It is the source of truth
- Edit it in place
- Do NOT create alternatives

**IF FILE DOESN'T EXIST:**
- Create it fresh
- Do NOT "consolidate" from other sources
- Build from scratch or user input only

### Rule #4: Verify Before Claiming
**NEVER CLAIM:**
- "Synced to Notion" without running `verify_sync_status.py`
- "Updated with latest info" without showing git diff
- "Consolidated from X sources" (this is banned entirely)
- "Merged data from..." (also banned)

**ALWAYS VERIFY:**
```bash
python3 .config/verify_sync_status.py
git diff <file>
```

## Emergency Protocol: When You Catch Yourself

**IF YOU REALIZE YOU'RE ABOUT TO:**
- Consolidate multiple sources
- Replace large sections
- Create duplicate files
- Merge information

**STOP IMMEDIATELY:**
1. Do NOT execute the change
2. Tell user: "I was about to violate data parity protocol"
3. Explain what you were going to do wrong
4. Ask for specific guidance on small, incremental changes

## User Permission Required For

**ONLY with explicit user approval:**
- Deleting entire files
- Restructuring file organization
- Renaming files
- Moving content between files
- Any "consolidation" work

## Automation Enforcement

**Tools that prevent violations:**
- `verify_sync_status.py` - catches desyncs
- `SESSION_STARTUP_CHECK.sh` - verifies before work
- File watcher - immediate sync of small changes
- Git hooks (future) - block large uncommented changes

## Examples

### ❌ WRONG (Consolidation)
```python
# Read Session_1_OLD.md, Session_1_UPDATED.md, user_notes.txt
# "Consolidate" into Session_1_FINAL.md
# Result: 4 files, unclear source of truth, massive diff
```

### ✅ CORRECT (Incremental)
```python
# Edit Session_1.md line 23:
# Change: "level 2 party" → "level 1 party"
# Result: 1 file, 1 line diff, clear change, syncs immediately
```

### ❌ WRONG (Large Replacement)
```python
Edit("file.md",
    old_string="[entire 100-line section]",
    new_string="[completely rewritten 100-line section]"
)
```

### ✅ CORRECT (Targeted Fix)
```python
Edit("file.md",
    old_string="Party is level 2",
    new_string="Party is level 1"
)
```

## Reporting Violations

**When Claude violates this protocol:**
1. Point out the specific violation
2. Reference this document
3. Ask for the CORRECT incremental approach
4. Claude must acknowledge and correct
