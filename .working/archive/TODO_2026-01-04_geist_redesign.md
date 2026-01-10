# Session TODO List - Session 3 Geist Investigation Redesign
Last updated: 2026-01-04 11:15

## 📋 PROJECT OVERVIEW
Redesign Session 3 Geist Investigation to follow 3-3-3-1 mystery structure with proper clues, leads, and revelations.

**Context:**
- Current Geist quest has structural problems (see issues below)
- Need proper mystery design following 3-clue rule
- Must create/update mystery generation skill for future use
- Testing framework with Geist Investigation as example

**User Identified Issues:**
1. Elf ghost encounter missing from session flow
2. Wounded man muttering "Geist Investigation" is weird (should be dead)
3. Crate needs interesting smuggled content (not mundane goods)
4. Crate encounter moots other entry points (points straight to docks)
5. "Difficulty scaling" concept contaminates player agency (where did this come from?)
6. Quest document format unclear - needs mermaid diagrams showing clue flow

## 🚨 Active Tasks

### In Progress
- [ ] [10:30] Initialize TODO tracking system and archive old session
  - Context: Current TODO is from encounter conversion project (completed)
  - Archive: .working/archive/TODO_2026-01-03_encounter_conversion.md
  - Initialize fresh TODO for Session 3 redesign

### Pending - Phase 1: Create/Update Mystery Skill
- [ ] [10:30] Check if mystery generation skill exists
  - Search: .claude/skills/ directory for mystery/investigation skills
  - If exists: Review current implementation
  - If not exists: Create new skill file

- [ ] [10:30] Create mystery generation skill (.claude/skills/mystery.md)
  - Context: Need reusable framework for 3-3-3-1 mystery design
  - Required sections:
    - **Core Principles:**
      - Fantasy setting requirement (make it fantastical and matter!)
      - 3-clue rule (each conclusion needs 3 independent clues)
      - No red herrings (overrated and confusing)
      - Proactive clues (failsafe if players stuck)
      - 2 clue types: Revelations (what's happening) vs Leads (where to go next)
    - **3-3-3-1 Structure:**
      - 3 entry points (different triggers)
      - 3 investigation locations (each entry → 3 leads)
      - 3 clues per location/conclusion (redundancy for player failure)
      - 1 final revelation (all paths converge)
    - **Revelation List Template:**
      - Who, How, Why, When, Where questions
      - List all conclusions PCs need to reach
      - 3 clues per revelation (each clue sufficient alone)
    - **Location List Template:**
      - Investigation sites players can visit
      - 3 clues per location
      - Mix of revelations and leads
    - **Clue Design Rules:**
      - Each clue = complete conclusion (not partial)
      - Avoid "6ft + green sweater + gray hair" trap (requires all 3)
      - Clues can point to leads (next location)
      - Clues can reveal truth (who/what/why)
    - **Depth Gauge Question:**
      - "How many successful leads should players follow?" (2-3 typical)
    - **Proactive Clue Examples:**
      - Villain retaliates (sends thugs)
      - New crime (another victim)
      - Clue delivered (matchbook in thug's pocket)
  - Capture issues to AVOID:
    - ❌ Difficulty scaling (removes player agency)
    - ❌ Single entry point dominating (moots other paths)
    - ❌ Mundane content (fantasy setting needs fantastical stakes)
    - ❌ Unclear clue flow (need diagrams)
    - ❌ Required clue combinations (violates 3-clue rule)
  - Output: .claude/skills/mystery.md

- [ ] [10:30] Test mystery skill with Geist Investigation redesign
  - Context: Use skill to redesign Geist quest as proof-of-concept
  - Input: Current Quest_Geist_Investigation.md problems
  - Expected output: Complete 3-3-3-1 structure with proper clues
  - Validation: Does output follow all skill principles?

### Pending - Phase 2: Understand Current Geist Mystery
- [ ] [10:30] Map underlying situation (Who/How/Why/When/Where)
  - Who is Geist? (Corrupt inspector, bandit lieutenant, dwarf assassin)
  - How does smuggling operation work? (Need to design this!)
  - Why is he smuggling? (Need motivation!)
  - When did smuggling start? (Timeline context)
  - Where does operation run? (Warehouse 7, docks, underground market)
  - **CRITICAL:** What is being smuggled? (Must be fantastical!)
  - **CRITICAL:** Why does it matter? (Stakes!)

- [ ] [10:30] Design fantastical smuggling content
  - Context: User wants "something fantastical happening" with real stakes
  - Requirements:
    - Not mundane goods (bread, wine, fabric)
    - Fantasy setting appropriate
    - Matters to the world/campaign
    - Creates interesting consequences if unchecked
  - Options to explore:
    - Feywild artifacts (Kyle connection - Lord Zaos wants them back)
    - Shadow creatures/corruption (Chaos Cult connection)
    - Stolen magical items (Merit Council scandal)
    - Contraband spell components (enables dangerous magic)
    - Enslaved fey/creatures (moral stakes)
  - Decision: Get user input on which direction

- [ ] [10:30] Create revelation list for Geist Investigation
  - Context: All conclusions PCs need to reach to solve mystery
  - Format:
    ```
    REVELATION 1: Geist is corrupt inspector
    - Clue A: [Specific evidence that proves this alone]
    - Clue B: [Different evidence that proves this alone]
    - Clue C: [Third independent proof]

    REVELATION 2: Kaelborn is Geist's boss
    - Clue A: [Evidence proving connection]
    - Clue B: [Different evidence proving connection]
    - Clue C: [Third independent proof]

    [Continue for all revelations...]
    ```
  - Revelations needed:
    1. Geist is corrupt (not just inspector)
    2. Geist runs smuggling operation
    3. Smuggled goods are [fantastical content from above]
    4. Kaelborn is ultimate boss (public official)
    5. Operation threatens [specific stakes]
  - Validation: Each clue standalone sufficient? No combinations required?

- [ ] [10:30] Create location list for Geist Investigation
  - Context: All places PCs can investigate + clues at each
  - Format:
    ```
    LOCATION: Warehouse 7
    - Clue 1 (Revelation): [Points to what's happening]
    - Clue 2 (Lead): [Points to next location]
    - Clue 3 (Revelation): [Points to who's responsible]

    LOCATION: Mira's Shop
    - Clue 1 (Lead): [Points to Warehouse 7]
    - Clue 2 (Revelation): [Proves Geist corruption]
    - Clue 3 (Lead): [Points to Merit Council Records]

    [Continue for all locations...]
    ```
  - Locations needed:
    - Entry points (3): Crate scene, Mira Saltwind, Kex the Fence
    - Investigation sites (6-9): Warehouse 7, Merit Council Records, Underground Market, etc.
  - Validation: 3 clues per location? Mix of revelations + leads?

### Pending - Phase 3: Fix Session 3 Entry Points
- [ ] [10:30] Redesign Day 1 crate encounter (Kyle's hook)
  - Current problem: Wounded man muttering "Geist Investigation" is weird
  - Fix: Dead smuggler instead (murdered? accident? monster attack?)
  - Crate contents: [Fantastical smuggled goods from Phase 2]
  - Clues available at scene:
    1. Dead smuggler (how did he die? Points to what?)
    2. Crate contents (what's being smuggled? Why dangerous?)
    3. Shipping manifest/symbol (points to where? Who?)
  - Validation: 3 clues? Each standalone? Points to ONE of 3 entry locations?
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md lines 61-76

- [ ] [10:30] Balance entry points so crate doesn't moot others
  - Current problem: Crate points straight to docks, makes Mira/Kex irrelevant
  - Fix options:
    - Crate clues point to Mira's shop (indirect route)
    - Crate clues point to Merit Council Records (official route)
    - Crate clues point to Underground Market (criminal route)
    - Crate clues are vague (need other entries to clarify)
  - Goal: Make all 3 entries equally viable paths
  - Validation: Can players reach same revelations via Mira? Via Kex? Via crate?

- [ ] [10:30] Add elf ghost encounter to session flowchart
  - Current problem: Ghost of Elaris missing from session flow
  - Location in file: Lines 276-307 (exists in content but not flowchart)
  - Flowchart location: Lines 14-28
  - Fix: Add conditional branch in mermaid diagram
  - Trigger: IF spider encounter completed → ghost appears during long rest
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md

### Pending - Phase 4: Create Clue Flow Diagrams
- [ ] [10:30] Create entry point → investigation diagram
  - Context: Show how 3 entry points lead to investigation locations
  - Format: Mermaid flowchart
  - Structure:
    ```
    Entry 1 (Crate) → Location A, Location B, Location C
    Entry 2 (Mira) → Location D, Location E, Location F
    Entry 3 (Kex) → Location G, Location H, Location I
    (Locations may overlap between entries)
    ```
  - Show: Which clues available at each node
  - Show: Which revelations each clue supports

- [ ] [10:30] Create clue → revelation diagram
  - Context: Show how clues map to revelations
  - Format: Mermaid flowchart or table
  - Structure:
    ```
    Clue A (Warehouse 7) → Revelation 1, 3
    Clue B (Mira's Ledger) → Revelation 1, 2
    Clue C (Kex Intel) → Revelation 2, 4
    [etc...]
    ```
  - Goal: Visualize redundancy (multiple paths to same revelation)

- [ ] [10:30] Create investigation path examples diagram
  - Context: Show 2-3 example paths players could take
  - Format: Mermaid flowchart
  - Examples:
    - Path A: Crate → Warehouse 7 → Merit Council → Confrontation
    - Path B: Mira → Underground Market → Kaelborn Office → Confrontation
    - Path C: Kex → Warehouse 7 → Mira → Confrontation
  - Show: Which revelations discovered at each step

### Pending - Phase 5: Rewrite Quest Document
- [ ] [10:30] Rewrite Quest_Geist_Investigation.md with new structure
  - Context: Current format unclear, needs proper 3-3-3-1 presentation
  - New sections:
    1. **The Situation** (Who/How/Why/When/Where)
    2. **Revelation List** (All conclusions with 3 clues each)
    3. **Location List** (All investigation sites with 3 clues each)
    4. **Entry Points** (3 ways to start investigation)
    5. **Clue Flow Diagrams** (Mermaid charts from Phase 4)
    6. **Proactive Clues** (Failsafe if players stuck)
    7. **Depth Gauge** (How many leads before resolution? 2-3)
    8. **Confrontation Options** (Multiple resolution paths)
  - Remove: "Difficulty Scaling" section (lines 154-173)
  - Files: Quests/Quest_Geist_Investigation.md

- [ ] [10:30] Update Session 3 with revised Geist hooks
  - Context: Session file needs to reflect new entry point design
  - Lines to update:
    - 61-76: Day 1 crate encounter (dead smuggler, fantastical goods)
    - 168-171: Guard a Caravan job (Kyle hook - adjust to not overlap with crate)
    - 206-208: Smuggling Operations (update description)
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md

### Pending - Phase 6: User Review & Iteration
- [ ] [10:30] Present redesigned Geist Investigation to user
  - Show: New mystery structure
  - Show: Revelation list with 3-clue redundancy
  - Show: Location list with clue mapping
  - Show: Clue flow diagrams
  - Ask: Does this follow 3-3-3-1 principles correctly?
  - Ask: Is smuggled content fantastical enough? Right stakes?

- [ ] [10:30] Get user input on mystery depth
  - Question: "How many successful leads should players follow for Geist Investigation?"
  - User suggestion: 2-3 leads
  - Adjust: Location count and clue distribution based on answer

- [ ] [10:30] Iterate based on user feedback
  - Context: May need multiple revision rounds
  - Track: Specific feedback points
  - Revise: Quest document, session hooks, diagrams

### Pending - Phase 7: Finalize & Sync
- [ ] [10:30] Run format validation on updated files
  - Files: Quests/Quest_Geist_Investigation.md
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md
  - Command: `python3 .config/format_compliance_check.py [files]`

- [ ] [10:30] Sync updated files to Notion
  - Quest document: `python3 sync_notion.py Quests/Quest_Geist_Investigation.md quest`
  - Session 3: `python3 sync_notion.py Sessions/Session_3_The_Steel_Dragon_Begins.md session`
  - Verify: Diagrams render correctly in Notion

- [ ] [10:30] Git commit and push changes
  - Commit message format:
    ```
    feat: Redesign Geist Investigation with 3-3-3-1 mystery structure

    Session 3 Changes:
    - Fixed Day 1 crate encounter (dead smuggler, fantastical contraband)
    - Balanced entry points (crate doesn't moot Mira/Kex routes)
    - Added elf ghost to session flowchart
    - Updated smuggling operation description

    Quest Changes:
    - Complete revelation list (5 conclusions, 3 clues each)
    - Complete location list (9 sites, 3 clues each)
    - Added clue flow diagrams (entry → investigation → revelation)
    - Removed difficulty scaling (player agency preserved)
    - Added proactive clue failsafes

    Infrastructure:
    - Created mystery generation skill (.claude/skills/mystery.md)
    - Documented 3-clue rule and common pitfalls
    - Added fantastical content requirement for fantasy settings

    🤖 Generated with [Claude Code](https://claude.com/claude-code)

    Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
    ```
  - Command: `git -C agastia-campaign add [files] && git -C agastia-campaign commit -m "..." && git -C agastia-campaign push`

## ✅ Completed Tasks
- [x] [10:30 → 10:35] Initialize TODO tracking and archive old session
  - Archived: .working/archive/TODO_2026-01-03_encounter_conversion.md
  - Created: Fresh TODO for Session 3 Geist redesign

- [x] [10:35 → 10:50] Design Feywild artifact(s) being smuggled
  - Presented 4 options (Veil Anchors, Thornheart Seeds, Starfall Prisms, Shadowglass Stones)
  - User chose: Combine Options 1 + 3
  - Created: **Starfall Anchors** (dual-purpose artifacts)
  - Features: Barrier stabilization + wish-granting (when removed)

- [x] [10:50 → 11:00] Revise artifact context for session scope
  - User clarification: Drop campaign-level goals, focus on 1-2 session scope
  - Timeline shift: Theft already happened, PCs discover aftermath
  - New context: Legitimate import to **The Augury** for research
  - Geist intercepted shipment using inspector authority
  - Unboxing scene has research papers (what it's for, not how it works)

- [x] [11:00 → 11:10] Map underlying Geist situation (Who/How/Why/When/Where)
  - **WHO:** Geist (thief), Kaelborn (partner), The Architect/Chaos Cult (buyer)
  - **HOW:** Fake detention, Warehouse 7 unboxing, sold to buyers
  - **WHY:** Greed (25,000+ gp), Chaos Cult needs for ritual
  - **WHEN:** 5 days ago (theft) → today (crate discovery)
  - **WHERE:** Docks → Warehouse 7 → Buyers → Crate scene

- [x] [11:10 → 11:15] Create revelation list for Geist Investigation
  - 5 revelations with 3 clues each (15 total clues)
  - Focus: What it's for, who's behind it, where it went, why it matters
  - REVELATION 1: Starfall Anchors are valuable research artifacts
  - REVELATION 2: Geist intercepted legitimate shipment
  - REVELATION 3: Unboxed at Warehouse 7
  - REVELATION 4: Kaelborn is Geist's partner
  - REVELATION 5: Sold to Chaos Cult and others

- [x] [11:15 → 11:30] Create location list for Geist Investigation
  - 7 investigation sites with 4-5 clues each
  - Entry points: Crate Scene, Mira Saltwind, Kex the Fence
  - Investigation sites: Warehouse 7, The Augury, Merit Council Records, Chaos Cult Safehouse
  - Each location provides clues for multiple revelations + leads to other locations

- [x] [11:30 → 11:45] Revise clues for realism and subtlety
  - User feedback: Shipment must be confidential (not publicly advertised)
  - Geist never goes in person (sends thugs)
  - Plausible deniability method (misrouting via dock clerk, not direct detention)
  - Castle has ultimate power (Geist fears direct confrontation)
  - Revised method: Dock clerk Harren "accidentally" misroutes cargo, Geist's thugs collect
  - Updated all location clues to reflect confidential nature and indirect operation

## 📊 PROGRESS TRACKING

**Overall:** 7/21 tasks completed (33%)

**By Phase:**
- Phase 1 (Mystery Skill): 0/2 tasks (skill creation pending)
- Phase 2 (Understand Situation): 4/4 tasks ✅ COMPLETE
- Phase 2b (Location Design): 2/2 tasks ✅ COMPLETE
- Phase 3 (Fix Entry Points): 0/3 tasks
- Phase 4 (Diagrams): 0/3 tasks
- Phase 5 (Rewrite): 0/2 tasks
- Phase 6 (Review): 0/3 tasks
- Phase 7 (Finalize): 0/3 tasks

**Critical Blockers:**
- None currently
- Next: Create clue flow diagrams (mermaid visualizations)

## 🔍 KEY DECISIONS MADE

1. **What is being smuggled?** ✅ DECIDED
   - **Starfall Anchors** (Feywild barrier stabilizers + wish crystals)
   - Legitimate import to The Augury for research
   - Geist intercepted using inspector authority
   - 6 total: 4 sold to Chaos Cult, 2 in transit (crate scene)

2. **What are the stakes?** ✅ DECIDED
   - Chaos Cult needs them for dimensional corruption ritual
   - Legitimate research blocked (Augury waiting)
   - Lord Zaos (Kyle's patron) wants them back
   - Political scandal if Kaelborn exposed

3. **How deep is the mystery?** ✅ CONFIRMED
   - 2-3 successful leads to reach confrontation
   - Flexible: Can add leads if players re-route
   - Forgiving to PCs (skill will accommodate)

## 📝 DESIGN PRINCIPLES (Captured from User)

**3-Clue Rule:**
- Each conclusion needs 3 independent clues
- Each clue must be sufficient ALONE to reach conclusion
- No "combine 3 partial clues" design (this is 3 conclusions, not 1)
- Example BAD: "6ft tall" + "green sweater" + "gray hair" (only works if unique on ALL)
- Example GOOD: "Signed confession" OR "Witnessed act" OR "Unique tool found at scene"

**Clue Types:**
- **Revelations:** Answer who/what/why (solve the mystery)
- **Leads:** Point to next location (continue investigation)
- Both follow 3-clue rule but in different ways
- Early scenes may have only leads (no revelations yet)
- Deep investigation eventually reveals truth

**No Red Herrings:**
- User says "overrated" - don't use them
- Focus on multiple paths to truth, not false paths

**Proactive Clues (Failsafe):**
- If players stuck, villain acts
- New crime scene (another victim, robbery)
- Retaliation (thugs sent after party)
- Clue delivered (matchbook, letter, witness comes forward)

**Fantasy Setting:**
- Make it fantastical and matter!
- Not mundane goods or low stakes
- Consequences if unchecked should be significant

**Player Agency:**
- No "difficulty scaling" that changes mystery based on level
- Players choose their own path
- Multiple solutions valid

## 📁 FILES TO MODIFY

**Create:**
- `.claude/skills/mystery.md` - Mystery generation skill

**Modify:**
- `Quests/Quest_Geist_Investigation.md` - Complete rewrite with 3-3-3-1 structure
- `Sessions/Session_3_The_Steel_Dragon_Begins.md` - Fix entry points, add ghost to flowchart

**Reference:**
- `Player_Characters/PC_Kyle_Nameless.md` - Kyle's background and quest
- `NPCs/Major_NPCs/NPC_Geist.md` - Geist character details
- `NPCs/Major_NPCs/NPC_Kaelborn.md` - Kaelborn character details
