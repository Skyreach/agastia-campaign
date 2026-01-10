# Pitch Escalations Skill

**Purpose:** Generate user-approved escalation options for ACTIVE or AWARE deferred modules when clocks need to advance.

**When to use:** When PCs have engaged with a module (ACTIVE) or become aware of it (AWARE), and time has passed.

**CRITICAL:** User controls ALL clock advancement. This skill only provides options - NEVER auto-advance clocks.

---

## Core Principles

### 1. PC Agency Requirement
**ONLY suggest escalations when:**
- ✅ PCs have awareness of the threat/situation (they know it exists)
- ✅ PCs had opportunity to act (it's not hidden information)
- ✅ PCs chose to pursue other priorities (player agency)
- ✅ Escalation is fair consequence of their choice

**NEVER suggest escalations if:**
- ❌ PCs don't know the situation exists (no context = no agency = unfair)
- ❌ PCs couldn't have known (hidden until now)
- ❌ Escalation feels punitive rather than logical world response
- ❌ PCs would reasonably expect the situation to remain static

### 2. Scale to PC Power Level
**Escalations should match current party capabilities:**
- Level 1-2: Escalate threats but keep them beatable (CR +1-2)
- Level 3-5: Can introduce new complications, additional enemies (CR +2-3)
- Level 6+: World-changing consequences, faction responses (CR appropriate)

**Examples:**
- Level 2 PCs ignore bandit problem → Bandits grow bolder (6 → 10 bandits)
- Level 5 PCs ignore cult ritual → Ritual succeeds, demon summoned (now must deal with consequences)
- Level 10 PCs ignore political intrigue → War breaks out (world state changes)

### 3. Semantically Appropriate Escalations
**Escalations must make narrative sense:**

**Good escalations (logical consequences):**
- Murder investigation ignored → Killer strikes again, patterns emerge
- Smuggling ring ignored → Operation expands, more goods move through city
- Cult activity ignored → Ritual progresses, power grows
- Political threat ignored → Faction consolidates power, situation worsens

**Bad escalations (arbitrary punishment):**
- Murder investigation ignored → Suddenly killer targets PCs (why? They're not involved)
- Smuggling ring ignored → Smugglers declare war on PCs (no provocation)
- Unrelated threats suddenly merge (feels contrived)

### 4. Failsafe Clues (from mystery.md)
**Escalations can deliver new information:**
- New crime scene → New clues available
- Villain acts → Leaves evidence behind
- Faction responds → Reveals their involvement
- Time pressure → Forces PC engagement or provides alternate entry point

---

## Process

### Step 1: Identify Module for Escalation

From `.working/DEFERRED_MODULES.md`, check:
1. **Status:** Is it AWARE or ACTIVE?
2. **PC Context:** What do PCs know?
3. **Clock State:** Is it FROZEN or already ADVANCING?
4. **Time Passed:** How much time has elapsed in-game?

**Eligibility:**
- UNUSED modules → No escalation (PCs unaware, clocks frozen)
- AWARE modules → Possible escalation (PCs know but haven't engaged)
- ACTIVE modules → Escalation likely appropriate (PCs engaged but deprioritized)

### Step 2: Assess PC Context

**Key questions:**
- When did PCs learn about this?
- What clues/information do they have?
- Have they had reasonable opportunity to act?
- Did they explicitly choose to pursue something else?
- Would escalation feel fair to players?

**Example (Fair):**
- PCs learn about murders in city
- Captain offers them investigation contract
- PCs say "We'll come back to this" and leave city
- 2 weeks pass in-game
- Escalation: More murders occurred (fair - they knew and chose not to engage)

**Example (Unfair):**
- PCs never been to city
- Don't know murders exist
- 6 months pass while they're on other quests
- Escalation: Serial killer now controls city guard (unfair - no agency)

### Step 3: Check PC Power Level

**Determine current party level:**
- Look at most recent session notes
- Check PC files if needed
- Note any significant power changes (magic items, level-ups)

**Match escalation to level:**
- Don't make threats unbeatable
- Don't make them trivial
- Aim for "challenging but fair"

### Step 4: Generate 2-3 Escalation Options

**For each option, provide:**

1. **Escalation Title:** Short, descriptive name
2. **What Happens:** Clear description of world change
3. **Why This Makes Sense:** Narrative justification
4. **PC Hook:** How PCs learn about this / how to re-engage
5. **Difficulty Change:** How challenge scales (CR, DCs, complexity)
6. **New Clues/Opportunities:** What failsafe information becomes available
7. **Reversible?:** Can PCs still solve original problem, or has situation fundamentally changed?

**Variety in options:**
- **Conservative:** Situation worsens slightly, still very recoverable
- **Moderate:** Significant change, harder but still solvable
- **Dramatic:** Major consequence, changes nature of problem

### Step 5: Present to User for Approval

**Format:**

```markdown
## Escalation Pitch: [Module Name]

**Current Status:** AWARE/ACTIVE
**PC Context:** [What PCs know]
**Time Passed:** [X days/weeks in-game]
**Party Level:** [Current level]

**Escalation Options:**

### Option 1: [Conservative Title]
**What Happens:** [Description]
**Narrative Justification:** [Why this makes sense]
**PC Hook:** [How they learn / re-engage]
**Difficulty:** [CR/DC changes]
**New Clues:** [Failsafe information]
**Reversible:** Yes/No - [explanation]

### Option 2: [Moderate Title]
[Same format]

### Option 3: [Dramatic Title]
[Same format]

**Recommendation:** [Which option I suggest and why, based on narrative flow]

**Question for User:** Should we advance the clock with one of these options, or keep it frozen?
```

---

## Escalation Categories

### Mystery/Investigation Modules

**Escalation types:**
- **New Crime:** Another victim, new pattern emerges, more clues
- **Witness Dies:** Someone who could help is eliminated, evidence trail
- **Villain Escalates:** More brazen crime, public statement, faction involvement
- **Time Pressure:** Ritual/plan reaching critical stage, countdown begins
- **Failsafe Clue:** Evidence delivered to PCs, informant reaches out, public outcry

**Example (Steel Dragon Investigation):**
```
Option 1 (Conservative): Two More Murders
- What: 2 additional victims over 3 weeks, same pattern
- Why: Serial killer continues work, PCs not stopping them
- Hook: City guard captain sends messenger asking for help
- Difficulty: Same CR, more crime scenes = more clues (easier actually)
- Clues: New victims reveal pattern (all wealthy merchants, all in Merchant District)
- Reversible: Yes - can still catch killer

Option 2 (Moderate): Public Panic
- What: 5 more murders, city in fear, businesses closing, merchant guild offering bounty
- Why: Unchecked killer becomes bolder, city response intensifies
- Hook: Massive bounty posted (500gp), can't avoid hearing about it
- Difficulty: CR same, but city is less cooperative (fearful), time pressure (guild wants results fast)
- Clues: Pattern now obvious (targeting merchants), witness comes forward
- Reversible: Yes - but city damaged, trust in Merit Council shaken

Option 3 (Dramatic): Copycat Killers
- What: Original killer inspired cult following, 3 copycat killers active, 12 total victims
- Why: Unchecked violence breeds more violence, symbol becomes rallying point
- Hook: PCs can't enter Merchant District without seeing impact, guards recognize them
- Difficulty: Now hunting 4 killers (CR 5 each instead of 1 CR 7), complex investigation
- Clues: Copycats are sloppier, easier to catch (can interrogate for info on original)
- Reversible: Partially - can stop copycats and original, but city fundamentally changed
```

### Smuggling/Criminal Network Modules

**Escalation types:**
- **Operation Expands:** More goods, more locations, harder to investigate
- **Faction War:** Rival criminal group or law enforcement moves in
- **Corruption Spreads:** More officials compromised, harder to find allies
- **Public Exposure:** Operation becomes known, forces public response
- **Direct Threat:** Criminals learn of PC interest, preemptive action

### Quest Hub/System Modules

**Escalation types:**
- **Jobs Expire:** Time-sensitive contracts no longer available
- **Faction Takes Job:** Other adventurers complete contracts, earn rewards/favor
- **New Jobs Posted:** More urgent contracts appear, tied to other modules
- **Merit Consequences:** Other PCs gain standing, unlock higher tiers first

### Personal Quest Modules

**Escalation types:**
- **Rival Pursues:** Another NPC seeks same goal, competition
- **Opportunity Closes:** Window for action narrows, costs increase
- **Faction Learns:** PC's goal becomes known, allies/enemies respond
- **Connection Revealed:** Personal quest ties to larger plot

---

## Integration with Other Skills

### With mystery.md
- Escalations deliver new clues (failsafe mechanism)
- Follow 3-clue rule (each escalation should provide 3 ways to learn new info)
- Escalations should never remove clues, only add complexity

### With point-crawl.md
- Escalations may add new nodes (crime scenes, faction safehouses)
- Or change existing nodes (location becomes dangerous, allies disappear)
- Track changes in Point_Crawl_Network.md

### With extract-deferred-modules.md
- After escalation, update module in DEFERRED_MODULES.md
- Change clock state from FROZEN to ADVANCING
- Update PC Context with new information
- Note escalation in module history

---

## Anti-Patterns (DO NOT DO THIS)

### ❌ Auto-Advance Clocks
```
BAD: "The murders continued, I've updated the module to show 5 new victims."
GOOD: "Should we advance the Steel Dragon clock? Here are 3 escalation options..."
```

### ❌ Punish PCs for Lacking Context
```
BAD: PCs never heard of villain → Villain conquers city while they're away
GOOD: PCs know about threat → Threat grows in their absence
```

### ❌ Make Escalations Unbeatable
```
BAD: Level 2 party ignored bandits → Now CR 10 bandit army
GOOD: Level 2 party ignored bandits → 6 bandits became 12 (still beatable)
```

### ❌ Contrived Targeting
```
BAD: PCs not involved in murder case → Killer targets them anyway
GOOD: PCs not involved → Killer continues pattern, city offers bounty
```

### ❌ Remove Player Agency Retroactively
```
BAD: "While you were gone, the BBEG destroyed the artifact you needed"
GOOD: "While you were gone, the BBEG moved the artifact to a new location (harder to reach)"
```

---

## Example Usage

**User:** "PCs have been in the Underdark for 2 weeks. Should the Steel Dragon murders escalate?"

**Process:**
1. Read Steel Dragon module from DEFERRED_MODULES.md
2. Check PC Context: PCs never been to Agastia, unaware murders exist
3. Assess agency: NO - PCs have no knowledge of this threat
4. **Response:** "No, clocks stay frozen. PCs have no awareness of Steel Dragon, so escalation would be unfair. When they reach Agastia, we can introduce the murders at whatever stage makes sense for the current timeline."

---

**User:** "PCs learned about the murders, Captain offered them the case, but they chose to pursue Geist instead. It's been 1 week. Should Steel Dragon escalate?"

**Process:**
1. Read Steel Dragon module
2. Check PC Context: PCs know about murders, were offered case, chose different priority
3. Assess agency: YES - They had context and chose otherwise
4. Check party level: Level 2
5. Generate 3 escalation options (conservative/moderate/dramatic)
6. **Response:** [Present 3 options as shown in examples above]
7. **Wait for user approval before updating module**

---

## Maintenance

**After suggesting escalations:**
- Wait for user decision
- If approved: Update DEFERRED_MODULES.md with chosen escalation
- Change clock state to ADVANCING
- Note escalation in module history
- Update PC hooks (how they learn about escalation)

**If user rejects escalation:**
- Clock stays in current state
- No changes to module
- Can suggest again later if circumstances change
