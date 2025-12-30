# Session Document Format Specification

## 🚨 MANDATORY FORMAT RULES

All session planning documents MUST follow this structure for Notion compatibility.

---

## Document Structure

### 1. Frontmatter (YAML)
```yaml
---
name: Session X - Title
type: Session
session_number: X
status: Planning|Active|Completed
version: "X.Y.Z"
date: YYYY-MM-DD or TBD
tags: [tag1, tag2, tag3]
---
```

### 2. Title & Metadata
```markdown
# Session X: Title - DM Guide

**Party:** Level X (Y PCs) | **Duration:** X-Y hours | **Type:** Description
```

### 3. Mermaid Flowchart (MUST BE FIRST)
```markdown
## Session Flowchart

**Mermaid code block with flowchart**
```

**Critical Rules:**
- Flowchart MUST appear before "Quick Reference" section
- Use ```mermaid code blocks (Notion renders these)
- Keep flowchart concise and readable
- Show major decision points and branches

---

### 4. Quick Reference Section
```markdown
## Quick Reference

**Toggle: Session Flow**
- Bullet list of major beats
- NO nested toggles inside this toggle

**Toggle: Key NPCs & Factions**
- Bullet list of NPCs/factions
- NO nested toggles inside this toggle

**Toggle: Important Items**
- Bullet list of items/artifacts
- NO nested toggles inside this toggle
```

---

### 5. Nodes Section (ALL UNDER H2)
```markdown
## Nodes

### Node 1: Name

[Content here following tiered DC format]

---

### Node 2: Name

[Content here following tiered DC format]

---

### Node 3: Name

[Content here following tiered DC format]
```

**Critical Rules:**
- "Nodes" is H2 (`##`)
- Each node is H3 (`###`) under the Nodes section
- Separator `---` between nodes
- NO separate H2 for each node

---

## Tiered DC Format for Descriptions

**ALL room/scene descriptions MUST use this format:**

```markdown
### 1: The Scene Name

| Opening description text here. Sets the scene with evocative details that everyone sees immediately.

DC X: Basic information that most PCs will discover

DC X+4: More detailed information with the above included

DC X+7: Deep insights with all above included

DC X+10: Hidden/secret information with all above included
```

**Example:**
```markdown
### 1: The Cloud Compass

| As you approach the crater, you see the massive bluish-silver axe embedded at the center - clearly sized for a storm giant. Around the weapon, a dark storm cloud swirls unnaturally, trapped in place.

DC 10: Sized for a Giant, made of bluish-silver metal. **Corruption Seed:** Dark energy pulsing through the weapon

DC 14: As above and: Reality warps visibly around the artifact. Leaves fall upward in pockets of fey energy. Time seems to flow irregularly.

DC 17: As above and: Draconic runes visible near base. If Draconic known: "storm... bond..." (full translation requires research)

DC 20: As above and: Hidden thieves' cant symbol - looks like the number 8
```

**DC Tier Guidelines:**
- **DC 10-12:** Basic observation, most PCs will get this
- **DC 14-15:** Moderate success, requires attention
- **DC 17-18:** High success, specialized knowledge
- **DC 20+:** Expert/secret information, rare discovery

**Skills indicated via context:**
- Architecture details → Investigation
- Magic effects → Arcana
- Nature/creatures → Nature/Survival
- Hidden things → Perception
- Traps/mechanisms → Investigation/Thieves' Tools
- Social cues → Insight

---

## Notion-Compatible Markdown

### ✅ SUPPORTED (Use These)

**Headers:**
```markdown
# H1 Title
## H2 Section
### H3 Subsection
```

**Emphasis:**
```markdown
**Bold text** - for emphasis, keywords
*Italic text* - for whispers, thoughts
`Code/mechanics` - for game terms, DCs
```

**Lists:**
```markdown
- Unordered list item
  - Nested item (2 spaces)

1. Ordered list item
2. Second item
```

**Blockquotes:**
```markdown
> Quoted text for read-aloud descriptions
> Use pipe | for boxed text in tiered DC format
```

**Code Blocks:**
```markdown
```language
Code here
``` (closing backticks)
```

**Toggles (Notion-specific):**
```markdown
**Toggle: Title**
Content that will be collapsible in Notion
More content
```

### ❌ NOT SUPPORTED (Never Use)

**HTML Tags:**
```html
<details><summary>Title</summary>Content</details>  <!-- NEVER USE -->
<div>Content</div>  <!-- NEVER USE -->
<br />  <!-- NEVER USE -->
```

**Horizontal Rules in Notion:**
```markdown
---  <!-- Use only as separator between nodes, NOT for visual breaks -->
```

**Tables:** (Notion tables work differently, avoid in session docs)

**Images:** (Requires special upload API)

---

## Section-Specific Formatting

### Dungeon Rooms (SYWABAGM Format)

```markdown
### AREA X: Room Name

**Boxed Text:**
> Description of what PCs immediately see

**Reactive Skill Checks:**
- **Perception DC X:** Information revealed
- **Arcana DC X:** Information revealed

**Room Elements:**

**Element Name:** Description and mechanics

**Element Name:** Description and mechanics

**Encounter:**
- Creatures, stats, tactics
```

### Skill Challenges

```markdown
### Node X: Challenge Name

| Description of the challenge

**Goal:** What success achieves

**Structure:** X successes before Y failures

**DC:** Base difficulty (adjust per skill)

**Possible Skills:**
- **Skill Name:** How it's used, what it reveals
- **Skill Name:** How it's used, what it reveals

**Success:** Outcome if they win

**Failure:** Outcome if they lose (still progress, but complications)
```

### Cutscenes

```markdown
### Cutscene: Event Name

**When triggered:**

1. **First Beat:**
   > Read-aloud description

2. **Second Beat:**
   > Read-aloud description
   >
   > **[To specific PC]:** Personal moment

3. **Resolution:**
   > Outcome description

**DM Notes:**
- Mechanical effects
- Player choices preserved
```

---

## Toggle Usage Rules

### Quick Reference Toggles
```markdown
**Toggle: Section Name**
- Content here
- More content
- NO nested toggles
```

### Node Content Toggles
```markdown
**Toggle: Detailed Stats**
Full stat block here

**Toggle: DM Notes**
Secret information here

**Toggle: Alternate Outcomes**
If players do X, then Y
```

**Critical:** Never nest toggles more than one level deep. Notion doesn't handle this well.

---

## Formatting Anti-Patterns

### ❌ Wrong: HTML Details Tags
```markdown
<details>
<summary><b>Room Description</b></summary>
Content here
</details>
```

### ✅ Right: Notion Toggles
```markdown
**Toggle: Room Description**
Content here
```

---

### ❌ Wrong: Separate H2 Per Node
```markdown
## Node 1: Cloud Compass
[content]

## Node 2: Underground Dungeon
[content]
```

### ✅ Right: Nodes Under Single H2
```markdown
## Nodes

### Node 1: Cloud Compass
[content]

---

### Node 2: Underground Dungeon
[content]
```

---

### ❌ Wrong: Boxed Text Without Tiers
```markdown
> You see an axe. It's big and magical.
```

### ✅ Right: Tiered DC Format
```markdown
| You see a massive axe embedded in the crater.

DC 10: Storm giant-sized, bluish-silver metal

DC 14: As above and: Corruption pulses through it, reality warps nearby
```

---

## Content Guidelines: What Belongs Where

### ✅ INCLUDE in Session Files (Runnable Content)

**Must be self-contained for Notion use:**
- All NPCs appearing in this session (inline descriptions with stats/DCs)
- All stat blocks for combat encounters (inline or in toggles)
- All DCs for skill checks
- Quest objectives and rewards
- Read-aloud text for atmosphere
- Flowcharts showing session structure
- Quick reference toggles
- Post-session debrief section

**Example inline stat block:**
```markdown
**Shadow Guard:** AC 14, HP 30, ATK +5 (1d8+3 necrotic), Special: Resistance to non-magical damage
```

### ❌ EXCLUDE from Session Files (Planning Content)

**Move to `.working/Session_X_Planning_Notes.md` instead:**
- Planning notes and TODOs
- Design discussion and alternatives considered
- Revelation system implementation details (3-3-3-1 web structures)
- Technical notes about MCP tools
- Version history and changelog
- Faction/world lore not directly relevant to running the session
- Player hint systems design documentation
- NPC design notes and alternatives
- Random session notes and brainstorming

**Why:** Session files must be runnable from Notion without external references. Planning content clutters the DM guide.

---

## City-Based Session Requirements (MANDATORY)

**When a session takes place primarily in a city (Agastia, etc.), MUST follow this structure:**

### Required Section: Locations Visited This Session

After the city overview link, sessions MUST include a "Locations Visited This Session" section that organizes all locations by the city's taxonomic hierarchy.

**Structure:**
```markdown
## Welcome to [City Name]

**City Overview:** See [[City Name]] for complete city details, tier structure, districts, and navigation.

### Locations Visited This Session

[Brief explanation that locations are organized by tier/district]

#### Tier X - [[District Name]]

**Overview:** Brief district description

**Location Name - Specific Place**
- **What:** Physical description
- **Who:** Key NPCs present
- **Hook:** Quest hooks or connections
- **Connection:** Why PCs visit/hear about this

**DM Notes:**
- Session-specific notes
```

### Taxonomic Hierarchy Format

**CRITICAL:** City sessions must organize locations hierarchically:

1. **City** → 2. **Tier** → 3. **District** → 4. **Location** → 5. **NPC**

**Example Structure:**
```markdown
#### Tier 4 - [[Merchant District]]

**Overview:** Mid-tier commercial hub, accessible to most citizens.

**Central Plaza - Job Board**
- **What:** Large job posting board
- **Who:** [[Merit Council]] clerk
- **System:** Jobs → gold + merit → tier access
- **Hook:** Primary quest hub

**Murder Scene Alleyway**
- **What:** Crime scene in quiet alley
- **Who:** Captain Valerius (city guard)
- **Hook:** [[Steel Dragon]] investigation
- **Connection:** Can become job board quest

**[[Il Drago Rosso]] - Nikki's Family Restaurant**
- **What:** Family-owned restaurant
- **Hook:** Faction threatening businesses
- **Connection:** [[Nikki]]'s safe haven
```

### Why This Matters

**Problem:** Without hierarchical organization:
- DM can't find location information during session
- "Merchant District" mentioned in collapsed sub-bullet
- No clear path: City → Tier → District → Location
- Breaks session flow, forces ad-hoc document navigation

**Solution:** Taxonomic hierarchy provides:
- Clear navigation: Tier 4 → Merchant District → Job Board
- All locations visible in proper context
- Easy reference during session
- Maintains city's tier structure

### Anti-Pattern: Flat Organization

❌ **WRONG:**
```markdown
## Welcome to Agastia

### Job Board
[content]

### Murder Scene
[content]
```

**Problem:** No tier/district context, hard to navigate city structure.

✅ **RIGHT:**
```markdown
## Welcome to Agastia

**City Overview:** See [[Agastia]] for complete details.

### Locations Visited This Session

#### Tier 4 - [[Merchant District]]

**Central Plaza - Job Board**
[content with What/Who/Hook format]

**Murder Scene Alleyway**
[content with What/Who/Hook format]
```

**Benefit:** Clear tier/district context, easy navigation, maintains city structure.

### City Session Checklist

Before marking city session as `status: Ready`:

- [ ] City overview link present at session start
- [ ] "Locations Visited This Session" section exists
- [ ] All locations organized by Tier → District hierarchy
- [ ] Each location includes What/Who/Hook/Connection format
- [ ] District overview present for each tier mentioned
- [ ] Wikilinks to [[City]], [[District]], [[Location]] pages
- [ ] No locations mentioned without tier/district context
- [ ] Session maintains linear flow while providing hierarchical navigation

---

## Post-Session Debrief (Required Section)

**ALL session files MUST include this final section:**

```markdown
## Post-Session Debrief

**Toggle: Debrief Questions**

**Ask player/DM after session:**
1. Did X critical event happen?
2. What did players choose at Y decision point?
3. Which PCs pursued personal quests?
4. Any major consequences or complications?
5. Which NPCs did players interact with?

**Then update:**
- PC knowledge sections with new discoveries
- Campaign state files with world changes
- Faction relationships if affected
- NPC files with relationship changes
- Prepare Session X+1 based on player choices
```

**Purpose:** Maintains campaign continuity and tracks session outcomes.

---

## File Checklist Before Syncing to Notion

- [ ] Frontmatter present with all required fields (name, session_number, status, version, tags)
- [ ] Mermaid flowchart appears FIRST (before Quick Reference)
- [ ] Quick Reference uses toggles, not HTML details
- [ ] Quick Reference has 4-6 toggle categories
- [ ] All nodes under single "## Nodes" H2
- [ ] Nodes separated by `---`
- [ ] Descriptions use tiered DC format (pipe | for opening, DC tiers below)
- [ ] NO HTML tags anywhere in document
- [ ] Toggles formatted as `**Toggle: Title**` on own line
- [ ] Code blocks use triple backticks with language
- [ ] All emphasis uses markdown (**bold**, *italic*, `code`)
- [ ] All NPCs described inline (no external file references)
- [ ] All stat blocks inline or in toggles
- [ ] Post-Session Debrief section present
- [ ] Planning notes moved to `.working/` directory
- [ ] File is self-contained (runnable from Notion)

---

## Validation Checklist Before Marking `status: Ready`

Before changing `status: Planning` → `status: Ready`:

- [ ] All required sections present (frontmatter, flowchart, quick reference, nodes, debrief)
- [ ] All NPCs in session have inline descriptions with relevant stats/DCs
- [ ] All combat encounters have stat blocks (inline or toggles)
- [ ] All skill check DCs specified
- [ ] All nodes have clear objectives
- [ ] All scene descriptions use tiered DC format
- [ ] File passes format checklist above
- [ ] Planning notes separated to `.working/` directory
- [ ] Session can be run using only this file (no external dependencies)

---

## MCP Integration

When `plan_session` or `generate_quest` tools create session files:

1. **Generate structure** following this spec exactly
2. **Use tiered DC format** for all scene descriptions
3. **Place Mermaid at top** before Quick Reference
4. **Nest nodes under H2** "Nodes" section
5. **NO HTML** - use Notion toggles instead

---

## Version History

- **2025-10-05:** Initial specification created
- Added tiered DC format requirement
- Added Mermaid-first structure
- Added Notion toggle format
- Removed HTML compatibility

---

## See Also

- `.config/NOTION_SYNC_LESSONS.md` - Why these rules exist
- `.config/CONTENT_GENERATION_WORKFLOW.md` - Option presentation requirements
- `Resources/Frameworks/Scene_Framing_Framework.md` - Scene structure guidance