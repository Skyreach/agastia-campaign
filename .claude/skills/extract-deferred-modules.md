# Extract Deferred Modules Skill

**Purpose:** After a session, automatically identify unused prep content and extract it into deferred modules for future use.

**When to use:** After user recaps a session in Notion and we pull gameplay notes.

---

## Core Principles

### 1. Identify Unused Content
**What counts as "unused":**
- Prepared locations PCs didn't visit
- NPCs PCs didn't meet
- Quests/hooks PCs didn't pursue
- Events that didn't trigger
- Point crawl nodes that weren't explored

**What doesn't count:**
- Background flavor that added atmosphere (even if not directly interacted with)
- Prepared content that was referenced/mentioned but not fully explored (mark as AWARE, not UNUSED)

### 2. Module Granularity
**1 module per:**
- Point crawl destination (location they can navigate to)
- Event (something that can happen)
- Quest/Investigation (something they can pursue)
- NPC encounter (someone they can meet)

**Group related content:**
- If 3 NPCs all part of same location/event, they're one module
- If quest has multiple locations, it's still one module (the quest is the module)

### 3. Multi-PC Hooks
**Always identify which PCs a module could hook:**
- Minimum: 1 PC (personal quest)
- Preferred: 2-3 PCs (multi-PC story beats)
- Ideal: Show how multiple PC goals can intersect

**Look for:**
- PC backstory connections
- PC goal alignments
- Complementary skillsets (investigation + social + combat)
- Shared locations/factions

### 4. Skills Integration
**For each module, identify which skills apply:**
- **mystery.md** - If it's an investigation with clues to gather (3-clue rule)
- **point-crawl.md** - If it involves navigation between locations
- **session.md** - Session structure references
- **add-wikilinks.md** - Cross-reference with entity pages

---

## Process

### Step 1: Read Session File + Gameplay Notes

1. Read the entire session file (e.g., `Sessions/Session_N_Title.md`)
2. Find the "Gameplay notes" or "What Actually Happened" section
3. Identify what PCs actually did vs what was prepared

### Step 2: Compare Prep vs Reality

**Create two lists:**

**USED CONTENT (becomes ACTIVE or RESOLVED modules):**
- Locations visited
- NPCs met
- Quests pursued
- Events that occurred

**UNUSED CONTENT (becomes UNUSED or AWARE modules):**
- Locations prepared but not visited
- NPCs prepared but not met
- Quests offered but not pursued
- Events prepared but didn't trigger

### Step 3: Extract Module Data

For each unused piece of content, gather:

1. **Module Name:** Descriptive title (e.g., "Steel Dragon Investigation")
2. **Type:** Mystery, Point Crawl, Event, Personal Quest, etc.
3. **Relevant PCs:** Who has hooks? (prefer 2-3)
4. **Skills:** Which existing skills apply?
5. **Location:** Where does it take place?
6. **Status:** UNUSED (no awareness) or AWARE (they know but haven't engaged)
7. **Content Links:** File paths + line numbers where content lives
8. **Clock State:** FROZEN (no advancement) initially
9. **PC Context:** What do PCs know? What clues do they have?
10. **Multi-PC Opportunities:** How can 2-3 PCs get involved?
11. **Integration Options:** How to plug into future sessions?
12. **Dependencies:** What needs to happen first?
13. **Notes:** Any important context

### Step 4: Check for Multi-PC Synergies

**For each module, ask:**
- Can this hook 2-3 PCs instead of just 1?
- Are there natural intersections with other modules?
- Can we weave PC goals together?

**Examples:**
- Steel Dragon + Nikki's Restaurant: Murders threaten her family's business
- Geist Investigation + Manny's Codex: Stolen artifacts from Zaos's collection
- Job Board quests that drop clues for multiple investigations

### Step 5: Write to DEFERRED_MODULES.md

Add or update modules in `.working/DEFERRED_MODULES.md` using this format:

```markdown
#### Module: [Name]
- **Type:** [Mystery / Point Crawl / Event / Personal Quest]
- **Relevant PCs:** [[PC1]] (reason), [[PC2]] (reason), [[PC3]] (reason)
- **Skills:** mystery.md, point-crawl.md, etc.
- **Origin:** Session N prep (unused - PCs did X instead)
- **Location:** [[Wikilinked Location]]
- **Status:** UNUSED | AWARE | ACTIVE | RESOLVED
- **Content Links:**
  - Path/to/file.md:lines (description)
  - Path/to/other_file.md:lines (description)
- **Clock State:** ❄️ FROZEN - [Why clocks are frozen]
- **PC Context:** [What PCs know, what clues they have]
- **Multi-PC Opportunities:**
  - [[PC1]]: [How they can engage]
  - [[PC2]]: [How they can engage]
  - [Intersection opportunities with other modules]
- **Integration Options:**
  - [How to plug into main quest]
  - [How to plug into side content]
  - [How to add as background flavor]
- **Dependencies:** [What must happen first]
- **Notes:** [Important context, connections to mysteries/point crawls]
```

### Step 6: Update Module Status

**If content was used:**
- Mark module as ACTIVE or RESOLVED
- Update PC Context with what they learned
- Note clock state changes

**If content was mentioned but not explored:**
- Change status from UNUSED to AWARE
- Update PC Context with how they learned about it
- Clock stays FROZEN until they engage

---

## Integration with Other Skills

### With mystery.md
- If module is an investigation, reference that it needs 3-clue rule structure
- Note if clues already exist in Quest files
- Identify if clues need to be built

### With point-crawl.md
- If module involves navigation, note the point crawl nodes
- Check if nodes exist in `Resources/Point_Crawl_Network.md`
- Identify if new nodes need to be added

### With session.md
- Note if module could become a full session
- Or if it's better as side content within another session

---

## Output Format

After extraction, provide:

1. **Summary Stats:**
   - X modules extracted
   - Y modules updated
   - Z new multi-PC synergies identified

2. **Module List:**
   - Brief name + status for each

3. **Recommendations:**
   - Suggested module combinations for next session
   - Multi-PC opportunities to prioritize
   - Any clocks that should advance (with user approval)

---

## Example Usage

**User:** "I added gameplay notes for Session 3 in Notion. Players went to caves instead of Agastia."

**Process:**
1. Read `Sessions/Session_3_The_Steel_Dragon_Begins.md`
2. Find gameplay notes section (lines 316-327)
3. Compare: Prep had Agastia city content, PCs went to caves
4. Extract unused modules:
   - Steel Dragon Investigation (UNUSED)
   - Geist/Warehouse 7 (UNUSED - but Brand has clues, so mark relevant PC context)
   - Agastia Job Board (UNUSED)
   - Manny's Archive Lead (UNUSED)
   - Nikki's Il Drago Rosso (UNUSED)
5. Create Garrek's Falls as ACTIVE module (where PCs actually went)
6. Identify multi-PC synergies (Steel Dragon + Nikki, Geist + Kyle + Manny)
7. Update `.working/DEFERRED_MODULES.md`

**Output:**
```
Extracted 5 unused modules from Session 3:
- Steel Dragon Investigation (UNUSED) - All PCs, spotlight: Manny, Nikki
- Geist/Warehouse 7 (UNUSED) - Kyle, Manny, Brand
- Agastia Job Board (UNUSED) - All PCs (system)
- Manny's Archive Lead (UNUSED) - Manny, Kyle
- Nikki's Il Drago Rosso (UNUSED) - Nikki primary, All PCs (safe haven)

Created 1 active module:
- Garrek's Falls (ACTIVE) - Session 4 main quest

Multi-PC synergies identified:
- Job Board jobs hook 2-3 PCs each
- Geist + Archive investigations can intersect (stolen artifacts)
- Steel Dragon + Il Drago Rosso (threat to Nikki's family)
```

---

## Maintenance

**After each session:**
- Run this skill to extract deferred modules
- Update existing modules if PCs learned more
- Check for new multi-PC synergies
- Keep `.working/DEFERRED_MODULES.md` current

**Before next session:**
- Review deferred modules with user
- Ask which modules to integrate
- Identify multi-PC story beats to prioritize
