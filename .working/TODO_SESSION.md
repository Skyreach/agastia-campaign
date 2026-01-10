# Session TODO List - Content Linking & 2-Way Sync Project
Last updated: 2026-01-10 17:00

## 🚨 CRITICAL UNDERSTANDING (2026-01-10)

**EVERY REFERENCE MUST LINK TO ACTIONABLE CONTENT** - This is THE POINT of the wiki structure.

- ❌ "Player Choice Encounter" with no links → useless, gets ignored
- ❌ "Dead Smuggler" with no encounter link → just flavor text
- ❌ "[[Il Drago Rosso]]" with no quest link → why would players go there?

✅ **Process: Search for content → Create if missing → Add wikilinks → Verify**

**Documented in:** CLAUDE.md:172-183 (permanent guidance for all threads)

**Bold Formatting Rule:** `**[[Entity]]:** Description` NOT `[[Entity]]**:** Description`
- Bold the ENTIRE subject including wikilinks, then colon, then description

---

## 📋 PROJECT PHASES

### PHASE 1: Fix Tooling First ✅ (COMPLETED 2026-01-10 17:05)
**Goal:** Create MCP tools and skills to enforce linking requirements automatically

- [x] [17:00 → 17:03] Create skill 'content-linker'
  - **Created:** .claude/skills/content-linker.md
  - **Purpose:** Search repo for content by name/context, suggest wikilinks, report orphans
  - **Features:**
    - Searches Encounters/, Quests/, NPCs/, Locations/, PointCrawls/
    - Reports orphaned references with context
    - Suggests content to create if nothing found
    - Provides wikilink recommendations
  - **Status:** ✅ Complete and ready to use

- [x] [17:00 → 17:02] Create skill 'audit-session-links'
  - **Created:** .claude/skills/audit-session-links.md
  - **Purpose:** Validate every list item in session files has proper wikilinks
  - **Process:**
    - Parses session markdown for list items (bullets, numbered)
    - Checks each has wikilinks to actionable content
    - Reports missing links with context
    - Uses content-linker skill for suggestions
  - **Status:** ✅ Complete and ready to use

- [x] [17:00 → 17:04] Update CONTENT_GENERATION_WORKFLOW.md
  - **Added:** New mandatory section "CRITICAL: Content Linking Requirements" (lines 316-415)
  - **Includes:** Step 5 audit requirement (BEFORE SAVING)
  - **Enforces:** Zero orphaned references before sync
  - **References:** Both new skills and CLAUDE.md:172-183
  - **Status:** ✅ Complete

**✅ PHASE 1 COMPLETION CRITERIA MET:**
- ✅ content-linker skill created (.claude/skills/content-linker.md)
- ✅ audit-session-links skill created (.claude/skills/audit-session-links.md)
- ✅ CONTENT_GENERATION_WORKFLOW.md updated with mandatory linking step

**🔄 CONTINUATION PROMPT FOR PHASE 2:**
```
Phase 1 complete. MCP tool 'content-linker' and skill 'audit-session-links' created.

Next: PHASE 2 - Fix Session 3 data based on linking requirements and formatting rules.

Process:
1. Use audit-session-links skill on Sessions/Session_3_The_Steel_Dragon_Begins.md
2. Use content-linker MCP to find existing content for each orphaned reference
3. Create missing content using workflow-enforcer (present options first)
4. Fix bold formatting: [[Entity]]**: → **[[Entity]]:**
5. Verify all list items link to actionable content

Reference: .working/TODO_SESSION.md Phase 2 for full details
```

---

### PHASE 2: Fix Session 3 Data ⏳ (Next)
**Goal:** Audit and fix Session 3 for orphaned references and formatting issues

- [ ] [17:00] Run audit-session-links skill on Session 3
  - **File:** Sessions/Session_3_The_Steel_Dragon_Begins.md
  - **Report:** All orphaned references (no wikilinks to content)

- [ ] [17:00] Fix Key NPCs section (lines 45-52)
  - **Current issues:**
    - `**Dead Smuggler:** Victim at crate scene` → Missing link to encounter
    - `[[Corvin Tradewise]]**:** [[Merchant Caravan]] leader` → Wrong bold format, missing quest link
    - `[[Mira Saltwind]]**:** [[Merchant District]] proprietor` → Wrong bold format, missing shop/quest link
  - **Process:**
    - Use content-linker to search for: Encounter_Dead_Smuggler, Quest_Corvin, Location_Mira_Shop
    - Create if missing (use workflow-enforcer)
    - Fix format: `**[[Entity]]:** Description` with proper wikilinks

- [ ] [17:00] Fix Session Flow section (line 41)
  - **Current:** `**Player Choice Encounter:** An encounter that can be resolved in multiple ways`
  - **Problem:** Completely useless - no links to WHAT encounters
  - **Fix:** Replace with links to specific Day 2 encounters or point-crawl page
  - **Search for:** Day 2 encounter options, PointCrawl files

- [ ] [17:00] Fix Locations section (lines 226+)
  - **[[Il Drago Rosso]]** (line 226) → Link to Nikki's family threat quest
  - **Murder Scene Alleyway** → Link to Steel Dragon investigation quest
  - **Search:** Quest_Nikki_Family_Threat.md, Quest_Steel_Dragon.md
  - **Create if missing**

- [ ] [17:00] Fix bold formatting throughout Session 3
  - **Pattern to fix:** `[[Entity]]**:` → `**[[Entity]]:`
  - **Pattern to fix:** `[[Entity]]**'s Hook:` → `**[[Entity]]'s Hook:`
  - **Pattern to fix:** `[[Location]]** - **[[Entity]]'s Place**` → `**[[Location]] - [[Entity]]'s Place**`
  - **Tool:** Manual edits using Edit tool

**✅ PHASE 2 COMPLETION CRITERIA:**
- Session 3 has ZERO orphaned references
- All bold formatting matches rule: `**[[Entity]]:** Description`
- audit-session-links skill reports 0 issues on Session 3

**🔄 CONTINUATION PROMPT FOR PHASE 3:**
```
Phase 2 complete. Session 3 data fixed - all references link to content, formatting correct.

Next: PHASE 3 - Fix import scripts for 2-way sync.

Problem: pull_session_notes_v2.py creates malformed bold patterns like [[Entity]]**:** when pulling from Notion.

Tasks:
1. Fix markdown_normalizer.py to convert malformed patterns to **[[Entity]]:**
2. Test with: git restore Session_3 → pull → git diff (must be empty)
3. If issues remain, fix wikilink_reconstructor.py

Reference: .working/TODO_SESSION.md Phase 3 for full details
```

---

### PHASE 3: Fix 2-Way Sync Scripts ⏳ (After Phase 2)
**Goal:** Ensure pull_session_notes_v2.py produces zero cosmetic diffs (prevents sync loops)

**Context:** Earlier work fixed most sync issues, but bold formatting still creates diffs:
- Notion returns: `**[[Entity]]:******` (extra asterisks)
- Normalizer creates: `[[Entity]]**:**` (wrong - entity should be bold)
- Need: `**[[Entity]]:**` (entity bold, proper format)

- [ ] [17:00] Fix markdown_normalizer.py bold patterns
  - **File:** .config/markdown_normalizer.py
  - **Current patterns:** Lines 31-39 create `[[Entity]]**:**`
  - **Required patterns:** Detect list items, make entity bold: `**[[Entity]]:**`
  - **Examples:**
    - List item: `- [[Entity]]**:` → `- **[[Entity]]:`
    - Numbered: `2. [[Entity]]**'s Hook:` → `2. **[[Entity]]'s Hook:`
    - Subsection: `[[Location]]** - **[[Entity]]'s` → `**[[Location]] - [[Entity]]'s`
  - **Approach:** Context-aware regex (detect list markers, apply bold to full subject)

- [ ] [17:00] Test pull script with Session 3
  - **Commands:**
    ```bash
    git restore Sessions/Session_3_The_Steel_Dragon_Begins.md
    python3 .config/pull_session_notes_v2.py
    git diff Sessions/Session_3_The_Steel_Dragon_Begins.md
    ```
  - **Expected:** Empty diff (zero lines changed)
  - **If issues:** Debug which patterns still need fixes

- [ ] [17:00] Fix wikilink_reconstructor.py if needed
  - **File:** .config/wikilink_reconstructor.py
  - **Issue:** Applies bold per-segment from Notion (mention separate from punctuation)
  - **Option:** Detect when surrounding text is bold, apply to wikilink too
  - **Priority:** Only if normalizer can't fix it in post-processing

**✅ PHASE 3 COMPLETION CRITERIA:**
- Round-trip sync produces ZERO diff: repo→Notion→repo
- markdown_normalizer.py handles all bold+wikilink patterns
- No cosmetic formatting changes between sync runs

**🔄 CONTINUATION PROMPT FOR PHASE 4:**
```
Phase 3 complete. 2-way sync working - pull_session_notes_v2.py produces zero diff.

Next: PHASE 4 - Fix ALL content across repository.

The linking and formatting issues exist in ALL session files, not just Session 3. Need to:
1. Run audit-session-links on ALL session files
2. Fix orphaned references throughout
3. Fix bold formatting throughout
4. Extend to quests, NPCs, encounters, locations

Reference: .working/TODO_SESSION.md Phase 4 for full details
```

---

### PHASE 4: Fix ALL Content ⏳ (After Phase 3)
**Goal:** Apply linking and formatting fixes across entire repository

**Scope:**
- All session files (Sessions/)
- All quest files (Quests/)
- All NPC files (NPCs/)
- All encounter files (Encounters/)
- All location files (Locations/)

- [ ] [17:00] Audit ALL session files
  - **Files:** Sessions/Session_1*.md, Session_2*.md, Session_3*.md, Session_4*.md
  - **Tool:** Run audit-session-links skill on each
  - **Report:** All orphaned references across all sessions
  - **Fix:** Use content-linker to find/create missing content
  - **Fix:** Bold formatting per rule

- [ ] [17:00] Audit ALL quest files
  - **Files:** Quests/*.md
  - **Check:** Do quests link to encounters, NPCs, locations, factions?
  - **Fix:** Add missing wikilinks
  - **Example:** Quest must link to encounter files, NPC pages involved

- [ ] [17:00] Audit ALL NPC files
  - **Files:** NPCs/**/*.md
  - **Check:** Do NPCs link to quests, factions, locations they're involved with?
  - **Fix:** Add missing wikilinks
  - **Example:** NPC page must link to quests they offer, faction they belong to

- [ ] [17:00] Audit ALL encounter files
  - **Files:** Encounters/*.md
  - **Check:** Do encounters link to NPCs, locations, quests they connect to?
  - **Fix:** Add missing wikilinks

- [ ] [17:00] Audit ALL location files
  - **Files:** Locations/**/*.md
  - **Check:** Do locations link to encounters, quests, NPCs found there?
  - **Fix:** Add missing wikilinks

**✅ PHASE 4 COMPLETION CRITERIA:**
- audit-session-links reports 0 issues across ALL sessions
- All quests link to encounters/NPCs/locations
- All NPCs link to quests/factions/locations
- All encounters link to NPCs/locations/quests
- All locations link to encounters/quests/NPCs
- Bold formatting consistent across all files

**🔄 CONTINUATION PROMPT FOR PHASE 5:**
```
Phase 4 complete. ALL content across repository fixed for linking and formatting.

Next: PHASE 5 - Plan Session 4.

Now that linking requirements are enforced and 2-way sync works, resume session planning workflow:
1. Use workflow-enforcer MCP to start session generation
2. Present 3-4 session structure options
3. Get user approval
4. Generate session content
5. Use audit-session-links to verify all references link to content
6. Sync to Notion

Reference: .working/TODO_SESSION.md Phase 5 for full details
```

---

### PHASE 5: Session 4 Planning ⏳ (After Phase 4)
**Goal:** Plan and generate Session 4 using proper workflows

- [ ] [17:00] Start workflow-enforcer for session generation
  - **MCP:** workflow-enforcer.start_workflow(workflow_type="session_generation")
  - **Stage:** present_options

- [ ] [17:00] Present 3-4 session structure options
  - **Follow:** CONTENT_GENERATION_WORKFLOW.md
  - **Include:** Session themes, major encounters, player hooks
  - **Get:** User approval on preferred option

- [ ] [17:00] Generate session content
  - **Follow:** SESSION_FORMAT_SPEC.md for format
  - **Enforce:** Every list item must link to content (CRITICAL LINKING RULE)
  - **Create:** Required encounters, quests, NPCs using workflow

- [ ] [17:00] Audit Session 4 with audit-session-links
  - **Verify:** Zero orphaned references
  - **Verify:** All formatting correct
  - **Fix:** Any issues found

- [ ] [17:00] Sync Session 4 to Notion
  - **Command:** python3 sync_notion.py Sessions/Session_4*.md session
  - **Verify:** Notion page created correctly

**✅ PHASE 5 COMPLETION CRITERIA:**
- Session 4 fully planned and generated
- All references link to content (0 orphans)
- Formatting correct
- Synced to Notion successfully

---

## ✅ Completed Tasks

- [x] [16:40 → 16:42] Document CRITICAL RULE in CLAUDE.md
  - Added: CLAUDE.md:172-183 with linking requirements
  - Impact: Permanent guidance for all future threads

- [x] [16:45 → 17:00] Update .working/TODO_SESSION.md with phased approach
  - Structured: 5 phases with continuation prompts
  - Purpose: Prevent re-explaining complex nuances when context runs out

- [x] [17:00 → 17:05] PHASE 1 COMPLETE - Fix Tooling
  - Created: .claude/skills/content-linker.md (searches repo for content)
  - Created: .claude/skills/audit-session-links.md (validates session links)
  - Updated: .config/CONTENT_GENERATION_WORKFLOW.md (mandatory linking step)
  - Impact: All future content generation will enforce linking requirements
  - Ready for: Phase 2 (Session 3 fixes) in NEW THREAD

---

## 📝 Key Decisions & Context

### CRITICAL: Linking Rule (2026-01-10 16:40)
**Every reference must link to actionable content** - THE POINT of wiki structure.

User: "No one cares about the restaurant in isolation - this is part of her quest. If you don't give them a link to a point-crawl then how would this not simply become a slog?"

**Process:**
1. Search for existing content (Encounters/, Quests/, NPCs/, PointCrawls/)
2. If found → Add wikilink
3. If not found → Flag gap, create content using workflow-enforcer
4. Never leave orphaned references

### Bold Formatting Rule (2026-01-10 16:30)
**Bold the entire subject including wikilinks:**
- `**[[Entity]]:** Description` NOT `[[Entity]]**:** Description`
- Applies to: NPC lists, session flow items, subsection labels

### Naming Convention
- No fixed convention - contextual
- Flat structure (roladex) > nested hierarchies
- Examples: Encounter_Name.md, Quest_Name.md, NPC_Name.md

### Where to Fix Bold Formatting
- Option B (normalizer) - Post-processing in markdown_normalizer.py
- Easier to test in isolation than modifying reconstructor

---

## 🗂️ File Reference

**Key Files:**
- CLAUDE.md:172-183 (linking rule - permanent)
- .working/TODO_SESSION.md (this file - continuation prompts)
- .config/markdown_normalizer.py (needs bold fixes)
- .config/wikilink_reconstructor.py (may need fixes)
- .config/CONTENT_GENERATION_WORKFLOW.md (needs linking step)

**Audit Targets:**
- Sessions/ (all session files)
- Quests/ (all quest files)
- NPCs/ (all NPC files)
- Encounters/ (all encounter files)
- Locations/ (all location files)

---

## 📊 Overall Progress

**Current Phase:** Phase 1 COMPLETE ✅ → Ready for Phase 2 (NEW THREAD)
**Overall Progress:** 3/21 tasks complete (14%)

**Phase Breakdown:**
- Phase 1: 3/3 tasks ✅ COMPLETE (Tooling)
- Phase 2: 0/5 tasks (Session 3 fixes) - NEXT
- Phase 3: 0/3 tasks (2-way sync)
- Phase 4: 0/5 tasks (All content)
- Phase 5: 0/5 tasks (Session 4)

**Next Action (NEW THREAD):** Begin Phase 2 using continuation prompt above
