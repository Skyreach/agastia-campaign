# Plan Session Skill

**Purpose:** Interactive session planning that keeps deferred modules "top of mind" and integrates with /todo tracking to prevent forgetting about unused content.

**When to use:** When planning a new session (Session N+1) after previous session (Session N) is complete.

**CRITICAL:** This skill MUST use the TodoWrite tool to track planning tasks. This prevents deferred modules from being forgotten during long planning conversations.

---

## Core Principles

### 1. Deferred Modules First
**ALWAYS start planning by reviewing unused modules:**
- Read `.working/DEFERRED_MODULES.md` first
- Show user all UNUSED and AWARE modules
- Ask which modules to integrate BEFORE planning new content
- This keeps unused prep "top of mind"

### 2. Multi-PC Story Beats
**Prioritize modules that hook 2-3 PCs:**
- Review "Relevant PCs" field for each module
- Highlight multi-PC opportunities
- Suggest combinations that weave PC goals together
- Avoid spotlight on single PC for entire session

### 3. Todo Integration (MANDATORY)
**Use TodoWrite tool throughout planning:**
- Initialize todo list at planning start
- Track: module decisions, content creation, questions for user
- Update after each planning step
- Ensures deferred modules stay in-memory and in-file
- Prevents forgetting to circle back

### 4. Coupling Detection
**Identify tight couplings between:**
- Current quest thread + deferred modules
- Multiple deferred modules that intersect
- PC locations + nearby deferred modules
- PC goals + module opportunities

When coupling detected, offer recommendation showing overlap opportunities.

---

## Process

### Step 0: Initialize Todo Tracking (MANDATORY)

**Before any planning, call TodoWrite:**

```
Use TodoWrite tool with initial planning tasks:
1. Review deferred modules for Session N+1
2. Identify main quest thread (where PCs are going)
3. Check for deferred module couplings
4. Decide which modules to integrate
5. Plan session structure
6. Build/refine content
```

This ensures planning stays organized and deferred modules aren't forgotten.

### Step 1: Read Deferred Modules

1. Read `.working/DEFERRED_MODULES.md`
2. Identify current state:
   - Count UNUSED modules
   - Count AWARE modules
   - Count ACTIVE modules
   - Note any RESOLVED modules

3. Organize by relevance:
   - Which modules are near PC's current location?
   - Which modules tie to PC's stated goals?
   - Which modules have multi-PC opportunities?
   - Which modules depend on PCs reaching certain milestones?

### Step 2: Identify Main Quest Thread

**Where are PCs going? What are they pursuing?**

From previous session's gameplay notes:
- PC's stated next destination
- Active quests they're pursuing
- Hooks they expressed interest in
- Problems they're trying to solve

**Example:**
- Session 3: PCs going to Garrek's Falls (Underdark)
- Main thread: Investigate mind-controlled spiders, find answers
- PC goals: Understand ghost coin, learn why Elaris died

### Step 3: Detect Tight Couplings (Critical!)

**Check for intersections between main thread and deferred modules:**

**Geographic couplings:**
- If PCs are going to Agastia → All Agastia modules are relevant
- If PCs are in Dock District → Warehouse 7 module nearby
- If PCs are near location → Module at that location

**Thematic couplings:**
- If PCs investigating artifacts → Geist module (stolen artifacts)
- If PCs fighting Chaos Cult → Modules involving cult activity
- If PC pursuing Codex → Archive module, Geist module (artifacts)

**PC goal couplings:**
- If Manny seeking Codex → Archive module, job board hooks
- If Kyle investigating Zaos theft → Geist module directly relevant
- If Nikki worried about family → Il Drago Rosso module

**Multi-module couplings:**
- Steel Dragon + Nikki's Restaurant (murders threaten business)
- Geist + Manny's Archive (stolen artifacts connection)
- Job Board + All other modules (jobs drop clues)

### Step 4: Present Module Integration Options

**Use TodoWrite to update: "Decide which modules to integrate"**

**Format for user:**

```markdown
## Session N+1 Planning: Module Integration

**Main Quest Thread:** [Where PCs are going / what they're pursuing]

**Active Modules** (already in play):
- [Module name]: [Current status]

**Deferred Modules Available:**

### High Priority (Tight Coupling Detected)
**Module: [Name]**
- **Relevant PCs:** [List with reasons]
- **Coupling:** [Why this fits with current thread]
- **Integration:** [How to plug in - main quest / side quest / background]
- **Multi-PC Opportunity:** [How 2-3 PCs can engage]

[Repeat for each high-priority module]

### Medium Priority (Geographic/Thematic Match)
[Same format for medium-priority modules]

### Low Priority (Available but No Strong Coupling)
[Brief list]

**Recommendations:**
Based on tight couplings, I suggest integrating:
1. [Module name]: [Reason - explain the overlap]
2. [Module name]: [Reason - show multi-PC opportunity]

**Questions for User:**
1. Should we integrate any of the high-priority modules?
2. As main quest or side content?
3. Should we create new modules based on where PCs are going?
```

**Wait for user response before continuing.**

### Step 5: Make Module Decisions (Interactive)

**User will respond with:**
- Which modules to integrate
- Whether main quest or side content
- Any new content needed

**Use TodoWrite to track decisions:**
```
Update todo:
- ✅ Reviewed deferred modules
- ✅ Identified main quest thread
- ✅ Detected couplings
- ✅ User decided: Integrate X as main quest, Y as side content
- [ ] Plan session structure
- [ ] Build/refine content
```

### Step 6: Check for Escalations

**For any AWARE or ACTIVE modules NOT being integrated:**

Ask: "Should we pitch escalations for [Module]?"

- Review time passed
- Check PC context (do they have agency?)
- Use `pitch-escalations.md` skill if appropriate

**Add to todo if escalations needed:**
```
- [ ] Pitch escalations for [Module name]
```

### Step 7: Plan Session Structure

**With modules decided, design session flow:**

1. **Opening:** Where do PCs start?
2. **Main Thread:** Core quest content
3. **Module Integration:** How deferred modules plug in
4. **Multi-PC Beats:** Ensure 2-3 PCs involved in key moments
5. **Climax/Decision:** Major choice or revelation
6. **Hooks for Next Session:** What comes after?

**Check existing skills:**
- Does this use **mystery.md** (3-clue rule)?
- Does this use **point-crawl.md** (navigation)?
- Do mysteries have 3-3-3-1 structure already built?

**Use TodoWrite to track structure tasks:**
```
- [ ] Design opening scene
- [ ] Build main thread encounters
- [ ] Integrate [Module X] as main content
- [ ] Integrate [Module Y] as side hook
- [ ] Plan multi-PC beat (Manny + Kyle investigating together)
- [ ] Create climax decision point
- [ ] Add hooks for Session N+2
```

### Step 8: Content Creation / Refinement

**For each todo item, work through content:**

**If using existing deferred module:**
- Read linked content from Session files
- Adapt to current PC level/situation
- Ensure mystery.md or point-crawl.md skills applied
- Update module in DEFERRED_MODULES.md (status: UNUSED → ACTIVE)

**If creating new content:**
- Use `session.md` skill for structure
- Use `mystery.md` for investigations
- Use `point-crawl.md` for navigation
- Consider if this creates NEW deferred modules for later

**Use TodoWrite to track completion:**
```
- ✅ Designed opening scene
- ✅ Built main thread encounters
- [ ] Integrate [Module X] as main content (IN PROGRESS)
- [ ] Integrate [Module Y] as side hook
...
```

### Step 9: Multi-PC Verification

**Before finalizing, check:**
- Does session spotlight 2-3 PCs (not just 1)?
- Are there moments for PC collaboration?
- Do individual PC goals intersect?
- Can PCs with different skillsets shine?

**If single-PC spotlight detected:**
- Identify opportunities to involve another PC
- Check deferred modules for additional hooks
- Add side content that engages other PCs

**Add to todo if adjustments needed:**
```
- [ ] Add hook for [PC name] to engage with main thread
- [ ] Create side scene for [PC name] investigating [related clue]
```

### Step 10: Generate Session File

**Create `Sessions/Session_N+1_Title.md`:**

Use `session.md` skill format:
- Frontmatter (session number, status, etc.)
- Session Flowchart (mermaid)
- Quick Reference (collapsible toggles)
- Nodes section (all encounters/locations)
- Point crawl navigation
- Post-session debrief questions

**Reference integrated modules:**
- Add wikilinks to deferred module content
- Note in module that it's now ACTIVE
- Update DEFERRED_MODULES.md status

**Final todo check:**
```
- ✅ All content created
- ✅ Session file generated
- ✅ DEFERRED_MODULES.md updated
- ✅ Multi-PC beats verified
- [ ] Review with user before finalizing
```

---

## Todo Tracking Format

**Throughout planning, maintain todo list:**

```markdown
## Session N+1 Planning Tasks

**Module Integration:**
- [ ] Review deferred modules
- [ ] Identify main quest thread
- [ ] Detect tight couplings
- [ ] Present integration options to user
- [ ] User decision: [Decision here once made]

**Structure:**
- [ ] Design opening
- [ ] Build main thread
- [ ] Integrate [Module X]
- [ ] Integrate [Module Y]
- [ ] Plan multi-PC beats
- [ ] Create climax
- [ ] Add next session hooks

**Content Creation:**
- [ ] [Specific encounter 1]
- [ ] [Specific encounter 2]
- [ ] [Mystery clue web for Module X]
- [ ] [Point crawl nodes for location]

**Verification:**
- [ ] Multi-PC spotlight check
- [ ] Mystery.md skills applied (3-clue rule)
- [ ] Point-crawl.md navigation added
- [ ] DEFERRED_MODULES.md updated

**Questions for User:**
- [ ] [Question 1]
- [ ] [Question 2]
```

**Update after EVERY major planning step.**

This ensures:
- Deferred modules stay in-memory
- Planning stays organized
- Nothing gets forgotten
- User can see progress

---

## Integration with Other Skills

### With extract-deferred-modules.md
- Start planning by reviewing modules extracted from previous session
- Check if previous session created new modules to consider

### With pitch-escalations.md
- During planning, check if any modules need escalation
- Present escalation options before finalizing session

### With mystery.md
- If integrating investigation module, verify 3-clue rule
- Check if clues already exist or need to be built
- Ensure each revelation has 3 independent clues

### With point-crawl.md
- If integrating location-based module, add navigation
- Check Resources/Point_Crawl_Network.md for existing nodes
- Add new nodes if needed

### With session.md
- Use session format for final session file
- Follow deterministic structure (flowchart, quick ref, nodes)

---

## Anti-Patterns (DO NOT DO THIS)

### ❌ Planning Without Reviewing Modules
```
BAD: "Let's build Session 4. PCs are going to Garrek's Falls, so..."
GOOD: "Let's plan Session 4. First, let me review deferred modules. [Reads DEFERRED_MODULES.md] I see 5 unused modules. Let's check for couplings..."
```

### ❌ Forgetting Todo Integration
```
BAD: [Plans entire session without using TodoWrite]
GOOD: [Uses TodoWrite at start, updates after each major step]
```

### ❌ Ignoring Tight Couplings
```
BAD: Plans Garrek's Falls without mentioning Geist module (Brand has clues from road)
GOOD: "I notice Brand has Geist clues from the road. Should we integrate that as a side thread?"
```

### ❌ Single-PC Spotlight
```
BAD: Entire session focuses on Manny's Codex quest
GOOD: Codex quest main thread, but Kyle and Nikki have side hooks that intersect
```

### ❌ Creating New Content Instead of Using Modules
```
BAD: Creates brand new Agastia content while 5 Agastia modules sit unused
GOOD: "We have 5 Agastia modules prepared. Let's use Steel Dragon + Job Board."
```

---

## Example Usage

**User:** "Let's plan Session 4. PCs are going deeper into Underdark to Garrek's Falls."

**Step 0: Initialize Todo**
```
Uses TodoWrite:
- [ ] Review deferred modules for Session 4
- [ ] Identify main thread (Garrek's Falls)
- [ ] Check for couplings with deferred modules
- [ ] Decide module integrations
- [ ] Plan session structure
```

**Step 1-2: Review Modules + Main Thread**
```
Reads DEFERRED_MODULES.md:
- 5 UNUSED modules (all Agastia-based)
- 1 ACTIVE module (Garrek's Falls - need to build)

Main thread: PCs going to Garrek's Falls (Underdark)
PC goals: Why were spiders herding people? Why Elaris died? How she got coin?
```

**Step 3: Detect Couplings**
```
TIGHT COUPLING DETECTED:
- Brand has Geist clues from road (W7-DD-B3, Saltwind card)
- Garrek's Falls is Underdark → May connect to Dock District (underground routes?)
- Kyle's backstory: Zaos artifacts stolen → Geist has them
- Mind control theme: Spiders controlled in forest, possible Geist connection?

RECOMMENDATION: Consider adding Geist thread as side content
- Brand could mention the clues to party during travel
- Falls investigation could reveal underground smuggling route
- Sets up Geist module for when they reach Agastia
```

**Step 4: Present Options**
```
Updates todo (decision point), presents to user:

## Session 4 Planning: Module Integration

**Main Quest Thread:** Garrek's Falls investigation (Underdark depths)

**Active Modules:**
- Garrek's Falls (ACTIVE) - Need to build content

**Deferred Modules - High Priority:**

**Module: Geist/Warehouse 7**
- **Relevant PCs:** Kyle (Zaos connection), Manny (artifacts), Brand (has clues)
- **Coupling:** Brand has physical clues from road. Falls may have underground smuggling connection.
- **Integration:** Side thread - Brand shares clues, party finds evidence of smuggling route in Falls
- **Multi-PC Opportunity:** Brand (investigation), Kyle (backstory hook), Manny (artifact interest)

**Deferred Modules - Low Priority:**
(All other Agastia modules require PCs in city - not relevant for Underdark session)

**Recommendation:**
Integrate Geist as side thread:
- Opening: Brand mentions weird crate clues to party during rest
- Falls Investigation: Discover smuggling route evidence (connects Underdark → Dock District)
- Hook: Sets up Geist investigation for future Agastia visit
- Multi-PC: Engages Brand, Kyle, Manny (3 PCs!)

**Question:** Should we add Geist as side content, or keep Session 4 focused only on Falls main thread?
```

[Waits for user decision before continuing with Steps 5-10]

---

## Maintenance

**After planning session:**
- Update all integrated modules in DEFERRED_MODULES.md
- Change status UNUSED → ACTIVE or AWARE
- Clear planning todos (session planning complete)
- Add new modules if session planning created future content

**Before next planning session:**
- Review previous session's gameplay notes
- Run extract-deferred-modules.md skill
- Update DEFERRED_MODULES.md with any changes
- Start plan-session.md process again
