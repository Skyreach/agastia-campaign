# Session Planning Workflow - Complete Guide

**Purpose:** Document the end-to-end workflow for planning sessions using the deferred module system.

**Goal:** Keep unused prep content "top of mind," enable plug-and-play module integration, and maintain multi-PC story beats.

---

## Overview

The session planning workflow consists of 3 phases:

1. **Post-Session:** User recaps what happened, Claude extracts deferred modules
2. **Pre-Session:** Interactive planning with module integration
3. **Session Execution:** Run the session, take notes for next cycle

This creates a continuous loop where unused content is preserved and systematically reintegrated.

---

## Phase 1: Post-Session Processing

**Trigger:** After a session ends, user adds gameplay notes to Notion

### Step 1: User Recaps Session in Notion

**User action:**
- Open session file in Notion (e.g., Session 3 - The Steel Dragon Begins)
- Add "Gameplay Notes" toggle section at end
- Write what actually happened:
  - Where PCs went
  - What they did
  - Key decisions made
  - NPCs met
  - Quests pursued
  - Open questions/hooks for next session

**Example:**
```markdown
**Toggle: Gameplay notes**
The group was awoken by ghost of Elaris. Morning: two riders arrived at caravan site.
Found chest with fey artifacts, opened crown chest. Jhalnir (Jordan) joined as guest.
Discovered someone approached driver, stole artifacts. Brand found parchment "W7B3 - Docks".
Decided to pursue ghost coin to caves instead of investigating theft.
Tracked to cave with draconic entrance. Found mind control crystal. Freed green dragon.
Next session: Going deeper to Garrek's Falls.
```

### Step 2: Claude Pulls Notes from Notion

**Claude action:**
- Run: `python3 .config/pull_session_notes.py`
- This syncs Notion → Local without breaking existing prep content
- Gameplay notes appear as new section in session file

**Result:**
- Session file now has both prep content AND actual play recap
- Local and Notion in sync
- Ready for module extraction

### Step 3: Extract Deferred Modules

**Claude action:**
- Use skill: `extract-deferred-modules.md`
- Process:
  1. Read session file with gameplay notes
  2. Compare prep vs reality (what was used vs unused)
  3. Extract unused content into modules
  4. Identify multi-PC opportunities
  5. Update `.working/DEFERRED_MODULES.md`

**Output:**
```
Extracted 5 unused modules from Session 3:
- Steel Dragon Investigation (UNUSED) - All PCs
- Geist/Warehouse 7 (UNUSED) - Kyle, Manny, Brand
- Agastia Job Board (UNUSED) - All PCs
- Manny's Archive Lead (UNUSED) - Manny, Kyle
- Nikki's Il Drago Rosso (UNUSED) - Nikki primary, All PCs

Created 1 active module:
- Garrek's Falls (ACTIVE) - Session 4 main quest

Multi-PC synergies identified:
- Job Board jobs hook 2-3 PCs each
- Geist + Archive can intersect (artifacts)
- Steel Dragon + Il Drago Rosso (Nikki's family)
```

### Step 4: Commit Changes

**Claude action:**
- Commit updated session file with gameplay notes
- Commit updated DEFERRED_MODULES.md
- Push to remote

**Command:**
```bash
git add Sessions/Session_3_*.md .working/DEFERRED_MODULES.md
git commit -m "feat: Extract deferred modules from Session 3 gameplay

Session 3 Recap:
- PCs pursued ghost coin → caves instead of Agastia
- Found mind control crystal, freed green dragon
- Next: Garrek's Falls (Underdark depths)

Deferred Modules:
- 5 unused modules extracted (all Agastia content)
- 1 active module created (Garrek's Falls)
- Multi-PC synergies identified for future integration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

---

## Phase 2: Pre-Session Planning

**Trigger:** User wants to plan Session N+1

### Step 1: Initialize Planning with /todo

**User action:**
- Run: `/todo` command

**Claude action:**
- Initialize TodoWrite with planning tasks
- Create `.working/TODO_SESSION.md` if not exists
- Track all planning steps

**Initial todo list:**
```markdown
- [ ] Review deferred modules for Session N+1
- [ ] Identify main quest thread
- [ ] Detect tight couplings with deferred modules
- [ ] Present module integration options to user
- [ ] User decides which modules to integrate
- [ ] Plan session structure
- [ ] Build/refine content
- [ ] Verify multi-PC story beats
- [ ] Generate session file
```

### Step 2: Review Deferred Modules

**Claude action:**
- Use skill: `plan-session.md` (Step 1-2)
- Read `.working/DEFERRED_MODULES.md`
- Count modules by status (UNUSED / AWARE / ACTIVE / RESOLVED)
- Identify main quest thread from previous session

**Output:**
```
Current Deferred Modules:
- 5 UNUSED (no PC awareness)
- 0 AWARE (PCs know but haven't engaged)
- 1 ACTIVE (Garrek's Falls - need to build)
- 0 RESOLVED

Main Quest Thread (from Session 3):
PCs going to Garrek's Falls to investigate:
- Why spiders were herding people
- Why Elaris was killed
- How she got the ghost coin
```

**TodoWrite update:**
```
- ✅ Review deferred modules for Session N+1
- [ ] Identify main quest thread
...
```

### Step 3: Detect Tight Couplings

**Claude action:**
- Use skill: `plan-session.md` (Step 3)
- Check for couplings:
  - Geographic (PC location + module location)
  - Thematic (PC quest + module theme)
  - PC goals (individual PC objectives + module hooks)
  - Multi-module (modules that can combine)

**Output:**
```
TIGHT COUPLING DETECTED:

**Geist/Warehouse 7 + Garrek's Falls:**
- Brand has physical clues (W7-DD-B3, Saltwind card)
- Falls is Underdark → May connect to Dock District via smuggling route
- Kyle's Zaos backstory → Stolen artifacts
- Multi-PC: Brand (clues), Kyle (backstory), Manny (artifact interest)

RECOMMENDATION:
Integrate Geist as side thread:
- Brand shares clues during party rest
- Falls investigation reveals smuggling route evidence
- Sets up Geist for future Agastia visit
- Engages 3 PCs naturally!
```

**TodoWrite update:**
```
- ✅ Review deferred modules
- ✅ Identify main quest thread
- ✅ Detect tight couplings
- [ ] Present module integration options to user
...
```

### Step 4: Present Integration Options

**Claude action:**
- Use skill: `plan-session.md` (Step 4)
- Show user:
  - High-priority modules (tight coupling)
  - Medium-priority modules (geographic/thematic match)
  - Low-priority modules (available but no strong fit)
- Recommendations with rationale
- Questions for user decision

**Output:**
```markdown
## Session 4 Planning: Module Integration

**Main Quest Thread:** Garrek's Falls (Underdark depths)

**High-Priority Modules:**

Module: Geist/Warehouse 7
- Relevant PCs: Kyle, Manny, Brand
- Coupling: Brand has clues, Falls may reveal smuggling route
- Integration: Side thread during rest + discovery
- Multi-PC: 3 PCs naturally engaged

**Low-Priority Modules:**
- Steel Dragon, Job Board, Archive, Il Drago Rosso (all require Agastia city)

**Recommendation:**
Add Geist as side content:
1. Opening: Brand mentions clues to party
2. Falls: Discover underground smuggling evidence
3. Hook: Sets up Geist for Agastia visit

**Questions:**
1. Should we integrate Geist as side content?
2. Keep Session 4 focused only on Falls?
3. Any other modules to consider?
```

**Claude waits for user response.**

### Step 5: User Decides Module Integration

**User action:**
- Responds with decisions:
  - Which modules to integrate
  - As main quest or side content
  - Any new content needed

**Example:**
```
User: "Yes, add Geist as side content. Keep Falls as main quest. No other modules."
```

**TodoWrite update:**
```
- ✅ Detect tight couplings
- ✅ Present module integration options to user
- ✅ User decided: Integrate Geist as side content, Falls as main quest
- [ ] Plan session structure
...
```

### Step 6: Check for Escalations

**Claude action:**
- Use skill: `pitch-escalations.md`
- For each module NOT being integrated:
  - Check if escalation appropriate (PC awareness? Time passed?)
  - If yes, present 2-3 escalation options
  - Wait for user approval

**Example:**
```
Steel Dragon module:
- Status: UNUSED
- PC Context: PCs never been to Agastia, unaware
- Time Passed: 2 weeks
- Escalation? NO - PCs have no awareness, unfair to escalate
- Clock stays FROZEN
```

### Step 7: Plan Session Structure

**Claude action:**
- Use skill: `plan-session.md` (Step 7)
- Design session flow:
  - Opening scene
  - Main thread encounters
  - Module integration points
  - Multi-PC beats
  - Climax/decision
  - Next session hooks

**TodoWrite tracking:**
```
- [ ] Design opening scene (Brand shares clues)
- [ ] Build Falls main encounters
- [ ] Integrate Geist evidence discovery
- [ ] Plan multi-PC investigation beat
- [ ] Create climax (dragon? ritual? discovery?)
- [ ] Add hooks for Session 5
```

### Step 8: Build Content

**Claude action:**
- Use skill: `plan-session.md` (Step 8)
- For each todo:
  - Build encounters
  - Add mysteries (use `mystery.md` for 3-clue rule)
  - Add navigation (use `point-crawl.md`)
  - Verify multi-PC engagement

**TodoWrite updates after each piece:**
```
- ✅ Design opening scene
- ✅ Build Falls main encounters (3 encounters ready)
- [ ] Integrate Geist evidence discovery (IN PROGRESS)
...
```

### Step 9: Generate Session File

**Claude action:**
- Use skill: `session.md` for format
- Create `Sessions/Session_4_Title.md`
- Include:
  - Frontmatter (session number, status, etc.)
  - Flowchart (mermaid diagram)
  - Quick Reference (toggles)
  - Nodes section
  - Point crawl navigation
  - Post-session debrief

**TodoWrite final update:**
```
- ✅ All content built
- ✅ Session file generated
- [ ] Review with user before finalizing
```

### Step 10: Update Deferred Modules

**Claude action:**
- Update `.working/DEFERRED_MODULES.md`
- Change integrated modules:
  - Geist: Status UNUSED → AWARE (PCs now have clues + evidence)
  - Update PC Context
  - Note integration in module history

**Commit changes:**
```bash
git add Sessions/Session_4_*.md .working/DEFERRED_MODULES.md
git commit -m "feat: Session 4 - Garrek's Falls with Geist side thread

Main Quest:
- Garrek's Falls investigation (Underdark depths)
- 3 encounters: [list]
- Climax: [description]

Deferred Module Integration:
- Geist/Warehouse 7: Status UNUSED → AWARE
- Brand shares clues, Falls reveals smuggling route
- Multi-PC: Brand, Kyle, Manny engaged
- Sets up Geist investigation for Agastia visit

Next Session Hooks:
- [Hook 1]
- [Hook 2]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

---

## Phase 3: Session Execution

**This happens at the table, outside Claude's involvement**

### User Runs Session

**User action:**
- Run Session N+1 using prepared materials
- Take notes on:
  - What PCs actually did
  - Deviations from plan
  - New hooks created
  - Open questions

### User Adds Notes to Notion

**User action:**
- After session, add gameplay notes to Notion
- Same format as Phase 1, Step 1

**This triggers the next cycle:**
- Phase 1: Extract new deferred modules
- Phase 2: Plan Session N+2
- Continuous loop

---

## Skills Reference

### extract-deferred-modules.md
**When:** After session, gameplay notes pulled from Notion
**Purpose:** Identify unused prep, extract into modules
**Output:** Updated DEFERRED_MODULES.md

### pitch-escalations.md
**When:** During planning, for AWARE/ACTIVE modules not being used
**Purpose:** Generate user-approved escalation options
**Output:** 2-3 escalation pitches, wait for user decision

### plan-session.md
**When:** Planning Session N+1
**Purpose:** Interactive planning with module integration
**Output:** Session structure, content, updated modules

**Also uses:**
- mystery.md (3-clue rule for investigations)
- point-crawl.md (navigation between locations)
- session.md (session file format)

---

## Todo Integration

**MANDATORY:** Use TodoWrite throughout planning

**Why:**
- Keeps deferred modules in-memory
- Prevents forgetting during long conversations
- Tracks progress through planning steps
- Visible to user

**When to update:**
- Start of planning (initialize list)
- After each major step (mark complete, add next tasks)
- When user makes decisions (capture choices)
- When asking questions (track what needs answers)
- End of planning (mark all complete)

**File:** `.working/TODO_SESSION.md`
- Persists across sessions
- Includes Q&A log for design decisions
- Tracks completed tasks for reference

---

## Design Principles Enforced

### 1. Deferred Modules Top of Mind
- **ALWAYS** review modules before planning new content
- **ALWAYS** check for couplings
- **ALWAYS** offer integration options

### 2. Multi-PC Story Beats
- **PREFER** modules hooking 2-3 PCs
- **AVOID** single-PC spotlight for whole session
- **IDENTIFY** intersection opportunities

### 3. User-Controlled Clocks
- **NEVER** auto-advance clocks
- **ALWAYS** pitch escalations, wait for approval
- **REQUIRE** PC agency before escalating

### 4. Skills Leverage
- **USE** mystery.md for 3-clue rule (don't duplicate)
- **USE** point-crawl.md for navigation
- **USE** session.md for format

---

## Example: Complete Cycle

**Session 3 → Session 4:**

1. **Post-Session 3:**
   - User adds gameplay notes to Notion
   - Claude runs `pull_session_notes.py`
   - Claude uses `extract-deferred-modules.md`
   - Result: 5 unused modules, 1 active module
   - Commit + push

2. **Pre-Session 4:**
   - User: "Let's plan Session 4"
   - Claude: Initializes todo with `/todo`
   - Claude: Reviews DEFERRED_MODULES.md (5 unused, 1 active)
   - Claude: Detects Geist coupling with Garrek's Falls
   - Claude: Presents integration options
   - User: "Add Geist as side content"
   - Claude: Plans session structure (updates todo)
   - Claude: Builds content (updates todo)
   - Claude: Generates Session_4_*.md
   - Claude: Updates DEFERRED_MODULES.md (Geist: UNUSED → AWARE)
   - Commit + push

3. **Session 4 Execution:**
   - User runs session at table
   - Takes notes
   - Adds to Notion after session

4. **Cycle Repeats for Session 5**

---

## Troubleshooting

**Problem:** Forgot to review deferred modules during planning
**Solution:** plan-session.md enforces this as Step 1, won't proceed without it

**Problem:** Lost track of what we decided during long planning conversation
**Solution:** Todo tracking captures all decisions in `.working/TODO_SESSION.md`

**Problem:** Created new content instead of using existing modules
**Solution:** plan-session.md checks for couplings first, recommends existing modules

**Problem:** Escalated clocks without user approval
**Solution:** pitch-escalations.md explicitly requires user decision, never auto-advances

**Problem:** Single-PC spotlight for entire session
**Solution:** plan-session.md Step 9 verifies multi-PC beats before finalizing

---

## Success Metrics

**Workflow working well if:**
- ✅ Unused prep gets systematically reintegrated
- ✅ Sessions regularly feature 2-3 PC story beats
- ✅ Clock advancement always has user approval
- ✅ Planning conversations stay organized (todo tracking)
- ✅ Multi-module synergies identified and leveraged
- ✅ Skills (mystery.md, point-crawl.md) consistently applied

**Workflow needs adjustment if:**
- ❌ Modules accumulate without integration
- ❌ Single-PC sessions become common
- ❌ Clocks advance without explicit approval
- ❌ Planning conversations lose track of deferred content
- ❌ New content created while modules sit unused
