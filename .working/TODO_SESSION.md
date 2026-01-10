# Session TODO List - Notion Bidirectional Sync Project
Last updated: 2026-01-10 05:20
**STATUS:** 🚧 IN PROGRESS - Attack plan complete, ready for implementation thread

## 📋 PROJECT OVERVIEW

Fix pull_session_notes.py to achieve 100% feature parity with sync_notion.py, enabling clean Notion→Repo syncing without corruption.

**Context:**
- Session 3 was run, gameplay notes added to Notion
- pull_session_notes.py pulled content but corrupted it (328 line diff)
- Wikilinks stripped, list numbering broken, formatting damaged
- Another thread reverted Session_3 to HEAD, discarding gameplay notes
- Gameplay notes now safely isolated in .working/Session_3_Notion_Pull.md
- Need to fix sync tool before merging gameplay notes back

**Files Involved:**
- `.config/pull_session_notes.py` (295 lines) - Tool to fix
- `sync_notion.py` (702 lines) - Reference for working features
- `.working/Session_3_Notion_Pull.md` - Test case (corrupted)
- `Sessions/Session_3_The_Steel_Dragon_Begins.md` (git HEAD) - Test case (correct)
- `.working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md` - Full attack plan

**Goal:** Round-trip sync (repo→Notion→repo) must produce zero diff

---

## 🚨 Active Tasks

### Completed
- [x] [05:14] Pull Session 3 content from Notion with gameplay notes
  - Context: Ran .config/pull_session_notes.py to fetch from Notion
  - Result: 328 lines changed (corruption detected)

- [x] [05:14] Save Notion content as working file (.working/Session_3_Notion_Pull.md)
  - Context: Preserve corrupted version for analysis
  - File: .working/Session_3_Notion_Pull.md (safe copy)

- [x] [05:15] Analyze sync damage - compare Notion pull vs git HEAD version
  - Context: git diff shows 328 line changes
  - Identified 8 corruption categories:
    1. Wikilink stripping (50+ instances)
    2. List numbering (all become "1.")
    3. Bold formatting (asterisks misplaced)
    4. Indentation (extra spaces added)
    5. Frontmatter format (quotes removed, arrays changed)
    6. Whitespace (blank lines removed)
    7. Clue list renumbering
    8. Entity name changes (Geist → Geist Investigation)

- [x] [05:16] Audit sync_notion.py repo→Notion features (what currently works)
  - Context: Reviewed sync_notion.py (702 lines)
  - Documented 7 working feature categories:
    1. Wikilink support (parse_rich_text function)
    2. Rich text formatting (bold, italic, code, strikethrough)
    3. Block types (headings, toggles, lists, quotes, code blocks)
    4. Hierarchical nesting (headings with children)
    5. Frontmatter handling (all Notion property types)
    6. Batch syncing (recursive glob, .notionignore support)
    7. Timestamp tracking (prevent sync loops)

- [x] [05:18] Document expected Notion→repo feature parity requirements
  - Context: All repo→Notion features must work in reverse
  - Documented 10 mandatory features
  - Created 5 test cases with acceptance criteria
  - Defined success criteria (zero diff on round-trip)

- [x] [05:20] Create attack plan document (.working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md)
  - Context: Comprehensive plan for fixing pull_session_notes.py
  - File: .working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md (9,000+ words)
  - Sections:
    - Critical context (what happened)
    - Sync damage analysis (328 line breakdown)
    - Repo→Notion working features (documented)
    - Notion→Repo missing features (what to build)
    - Feature parity requirements (10 mandatory)
    - Attack plan phases (4 phases)
    - Technical implementation notes
    - Test cases & validation
    - Success criteria

### In Progress
- [ ] [05:21] Generate continuation prompt for fresh thread
  - Context: Thread context getting large (88k+ tokens used)
  - Need concise prompt to resume in fresh thread
  - Must include: attack plan location, test files, goal

---

## 📊 PROGRESS TRACKING

**Overall:** Phase 1 complete (6/6 tasks), ready for Phase 2 implementation

**Phase 1: Diagnostic & Audit** ✅ (Complete)
- ✅ Pull Session 3 from Notion
- ✅ Save as working file
- ✅ Analyze corruption (328 lines)
- ✅ Audit sync_notion.py (7 feature categories)
- ✅ Audit pull_session_notes.py (8 broken features)
- ✅ Create attack plan document

**Phase 2: Feature Implementation** ⏳ (Next Thread - 9 features)
- Priority 1: Wikilinks, formatting, list numbering (blockers)
- Priority 2: Frontmatter, toggles, code blocks (format preservation)
- Priority 3: Whitespace, blockquotes, nesting (polish)

**Phase 3: Testing & Validation** ⏳ (After Phase 2)
- Round-trip tests
- All 5 test cases
- Acceptance criteria verification

**Phase 4: Session 3 Recovery** ⏳ (After Phase 3)
- Extract gameplay notes
- Run fixed sync tool
- Commit Session 3 with notes
- Extract deferred modules
- Resume session planning workflow

---

## 🔍 KEY DECISIONS

1. **Merge Strategy:** ✅ DECIDED
   - Use "Smart Merge" approach (Approach 2)
   - Detect new sections in Notion, append to local file
   - Preserve existing sections unchanged
   - Upgrade to 3-way merge later if needed

2. **Test Case:** ✅ DECIDED
   - Session 3 is perfect test case (real corruption example)
   - 328 line diff provides comprehensive validation
   - Gameplay notes are actual content needing merge

3. **Implementation Order:** ✅ DECIDED
   - Priority 1 first (wikilinks, formatting, numbering) - blockers
   - Priority 2 second (frontmatter, toggles, code) - important
   - Priority 3 last (whitespace, quotes, nesting) - polish

4. **Success Criteria:** ✅ DECIDED
   - Zero diff on round-trip test is MANDATORY
   - All 10 feature parity requirements must pass
   - No exceptions, no compromises

---

## 📝 NOTES FOR NEXT THREAD

**Attack Plan Location:**
- `.working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md` (complete technical spec)

**Test Files:**
- `.working/Session_3_Notion_Pull.md` (corrupted version from Notion)
- `Sessions/Session_3_The_Steel_Dragon_Begins.md` (git HEAD - correct version)

**Key Insight:**
- sync_notion.py already has all the logic we need (wikilink detection, rich text parsing, etc.)
- We need to reverse-engineer it for Notion→Repo direction
- Copy parse_rich_text logic, invert it

**First Task for Next Thread:**
1. Read NOTION_BIDIRECTIONAL_SYNC_PLAN.md
2. Start with Priority 1: Wikilink reconstruction
3. Implement fetch_page_title function
4. Test against Session 3 Notion pull
5. Verify wikilinks preserved

**Validation Command:**
```bash
# After fixing pull_session_notes.py, test round-trip:
python3 sync_notion.py Sessions/Session_3_The_Steel_Dragon_Begins.md session
python3 .config/pull_session_notes.py
git diff Sessions/Session_3_The_Steel_Dragon_Begins.md
# MUST show zero changes (empty diff)
```

---

## ✅ Completed Tasks Archive

- [x] [05:14 → 05:14] Pull Session 3 content from Notion with gameplay notes
  - Ran: python3 .config/pull_session_notes.py
  - Result: 1 session updated (Session 3), 3 skipped (< 1h since push)
  - Corruption detected: 328 lines changed

- [x] [05:14 → 05:14] Save Notion content as working file
  - Copied to: .working/Session_3_Notion_Pull.md
  - Purpose: Preserve corrupted version for analysis

- [x] [05:15 → 05:16] Analyze sync damage
  - Compared: git diff Sessions/Session_3_The_Steel_Dragon_Begins.md
  - Found: 8 corruption categories, 328 total line changes
  - Documented: All patterns in attack plan

- [x] [05:16 → 05:17] Audit sync_notion.py
  - Reviewed: 702 lines of working code
  - Documented: 7 feature categories that work correctly
  - Found: parse_rich_text function (lines 83-228) handles wikilinks perfectly

- [x] [05:17 → 05:18] Audit pull_session_notes.py
  - Reviewed: 295 lines of broken code
  - Found: notion_blocks_to_markdown function (lines 54-184) has bugs
  - Identified: 8 missing features causing corruption

- [x] [05:18 → 05:19] Document feature parity requirements
  - Created: 10 mandatory features list
  - Created: 5 test cases with acceptance criteria
  - Defined: Zero-diff success criteria

- [x] [05:19 → 05:20] Create attack plan document
  - File: .working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md
  - Size: 9,000+ words, comprehensive technical spec
  - Sections: Context, damage analysis, features, implementation, tests
