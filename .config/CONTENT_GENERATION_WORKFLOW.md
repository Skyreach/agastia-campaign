# Content Generation Workflow - MANDATORY

## 🚨 CRITICAL RULE: ALWAYS PRESENT OPTIONS FIRST

When generating ANY campaign content (encounters, NPCs, dungeons, quests, etc.), you MUST follow this workflow:

### ❌ NEVER DO THIS:
```
User: "Create an encounter for the caravan"
Assistant: *immediately generates encounter with bandits*
```

### ✅ ALWAYS DO THIS:
```
User: "Create an encounter for the caravan"
Assistant: *presents 3-4 OPTIONS for encounter types/themes*
User: *selects Option B*
Assistant: *presents 3-4 OPTIONS for specific details*
User: *approves*
Assistant: *generates final content*
```

---

## Why This Matters

**User Agency:** The DM needs creative control over their campaign. AI-generated content without options removes player agency from the creative process.

**Better Results:** Options allow the DM to guide the AI toward their vision, resulting in content that actually fits their campaign.

**Avoid Waste:** Generating full content then scrapping it wastes time and tokens. Options are cheap, revisions are expensive.

---

## Workflow Steps

### Step 1: Understand Context
Before presenting options, gather:
- Campaign tone/themes
- Current narrative state
- Player preferences
- Existing constraints

### Step 2: Present Conceptual Options
Offer 3-4 high-level approaches:

**Example - Encounter Generation:**
```markdown
## Encounter Type Options

**Option A: Combat - Bandits**
- Classic bandit ambush, test combat tactics
- Low stakes, establishes road danger

**Option B: Social - Refugees**
- Displaced travelers seeking help
- Moral choice, resource management

**Option C: Environmental - Storm**
- Natural hazard, skill challenge
- No combat, survival focus

**Option D: Mystery - Abandoned Cart**
- Investigation scene, clue discovery
- Ties into larger plot threads

Which approach fits your session goals?
```

### Step 3: Present Detailed Options
Once direction chosen, offer specific variations:

**Example - Bandits Selected:**
```markdown
## Bandit Encounter Details

**Option A: Desperate Refugees Turned Bandits**
- Sympathetic antagonists, moral gray area
- Possible negotiation outcome

**Option B: Professional Highwaymen**
- Tactical combat, extortion demands
- Criminal organization ties

**Option C: Possessed/Corrupted Bandits**
- Supernatural element, mystery hook
- Foreshadows main villain

Which narrative angle works best?
```

### Step 4: Generate Final Content
Only after user approval, create the full stat blocks, descriptions, mechanics, etc.

---

## Content Type Workflows

### Dungeon Keying (SYWABAGM Format)

**Always present options for:**
1. **Dungeon Features** - Lighting, walls, atmosphere (3-4 options)
2. **Corridor Themes** - Environmental palette (3-4 options)
3. **Boxed Text per Room** - Initial description tone (3-4 options per room)
4. **Reactive Skill Checks** - What info is instantly available (2-3 sets)
5. **Room Elements** - Interactive environment pieces (2-3 sets)

**Example Session:**
```
User: "Key the underground dungeon for Session 1"
Assistant: "Let me present dungeon features options..."
  → Present 3 dungeon feature sets (lighting/walls/atmosphere)
User: "Option B"
Assistant: "Great, now corridor themes..."
  → Present 3 corridor theme palettes
User: "Option A"
Assistant: "Now for Room 1 boxed text..."
  → Present 4 boxed text options for Room 1
User: "Option B"
Assistant: "Room 1 reactive skill checks..."
  → Present 2-3 skill check sets
... (repeat for each room)
```

### NPC Generation

**Always present options for:**
1. **Role/Archetype** - What function they serve (3-4 options)
2. **Personality/Quirks** - Character voice (3-4 options)
3. **Secrets/Connections** - Hidden depths (2-3 options)
4. **Stat Block Approach** - Combat style if relevant (2-3 options)

### Encounter Design

**Always present options for:**
1. **Encounter Type** - Combat/Social/Environmental/Mystery (4 options)
2. **Specific Theme** - Within chosen type (3-4 options)
3. **Resource Focus** - What it drains (2-3 options if combat)
4. **Narrative Hooks** - How it connects to story (2-3 options)

### Quest Generation

**Always present options for:**
1. **Quest Structure** - Mission/Travel/Mixed (3 options)
2. **Patron Options** - Who's hiring (3 NPC options)
3. **Location Options** - Where it happens (3 location options)
4. **Node Count** - Quest complexity (2-3 options)
5. **Base Monster/Doom** - Threat type (3 options)

---

## MCP Tool Requirements

All content generation MCP tools (generate_encounter, generate_npc, generate_quest, etc.) should:

### Required Parameters:
- `confirmation_mode: boolean` (default: true)
  - If true: Generate options for user selection
  - If false: Generate final content directly (only after user has selected options)

- `selected_options: object` (optional)
  - Stores user's previous option selections
  - Passed through workflow stages

### Workflow Implementation:
```javascript
// Example pseudo-code
if (confirmation_mode === true) {
  // Present options, don't generate final content
  return {
    options: [
      { id: "A", description: "...", preview: "..." },
      { id: "B", description: "...", preview: "..." },
      // ...
    ],
    next_step: "Please select option, then I'll present next choices"
  }
} else {
  // User has made all selections, generate final content
  return {
    final_content: generateFromSelections(selected_options),
    save_to_file: save_to_file_param
  }
}
```

---

## Option Presentation Best Practices

### Good Options:
✅ Distinct from each other (not just minor variations)
✅ Show different tones/approaches
✅ Include brief preview/example
✅ Explain narrative consequences
✅ Reference campaign themes when relevant

### Bad Options:
❌ Too similar (different names, same function)
❌ No preview/context
❌ Generic/forgettable
❌ Don't explain why you'd choose each

### Example - Good vs Bad:

**Bad:**
```
Option A: Goblin enemy
Option B: Orc enemy
Option C: Bandit enemy
```

**Good:**
```
Option A: Desperate Goblins
- Starving tribe, driven from home
- Moral complexity, possible ally
- Ties to Dispossessed faction

Option B: Corrupted Orcs
- Shadow-touched raiders
- Foreshadows main villain
- Resource-draining combat

Option C: Professional Bandits
- Organized crime, extortion
- Social/combat hybrid
- Leads to urban faction conflict
```

---

## Emergency Override

**Only skip option presentation if:**
1. User explicitly says "surprise me" or "just generate it"
2. Generating minor/trivial content (random encounter table entry, etc.)
3. User has already made all necessary decisions in their request

**Even then, confirm:**
```
User: "Generate a random NPC for the tavern"
Assistant: "I can generate a random tavern NPC. Would you like me to:
A) Present 3 archetype options first, or
B) Surprise you with a fully random generation?"
```

---

## Integration with SYWABAGM Framework

When using "So You Want to Be a Game Master" frameworks:

### Dungeon Keying:
- Always use 4-part room anatomy (Name, Boxed Text, Reactive Checks, Room Elements)
- Present options for Dungeon Features section
- Present options for Corridor Themes section
- Present options for each room's boxed text
- Present options for reactive skill checks
- Present options for room elements

### Encounter Building:
- Present options for encounter difficulty
- Present options for creature tactics
- Present options for environmental factors
- Present options for resource targeting

### Scene Framing:
- Present options for scene opening
- Present options for NPC behavior
- Present options for location details

---

## File Naming & Organization

After user approves all options and final content is generated:

**Session Materials:**
- `Sessions/Session_X_[Name].md` - Main session plan (see SESSION_FORMAT_SPEC.md for structure)
- `Sessions/Session_X_Encounters.md` - Encounter stat blocks (if needed)

**NPCs:**
- `NPCs/[Category]/[Name].md` - Individual NPC files
- Never use `_UPDATED`, `_FINAL`, `_v2` suffixes (Git tracks history)

**Generated Content:**
- `Generated/YYYY-MM-DD_[Type]_[Name].md` - Timestamped generated content
- Allows review before integrating into campaign files

---

## Todo List Integration

When generating content with options workflow:

```javascript
TodoWrite([
  { content: "Present dungeon features options", status: "in_progress" },
  { content: "Present corridor themes options", status: "pending" },
  { content: "Present Room 1 boxed text options", status: "pending" },
  { content: "Apply approved content to file", status: "pending" }
])
```

Update status as each option set is approved.

---

## Version History

- **2025-10-05:** Initial workflow documentation created
- Added SYWABAGM dungeon keying integration
- Added MCP tool parameter requirements
- Added option presentation best practices
- Added session format specification reference

---

## See Also

- `.config/DATA_PARITY_PROTOCOL.md` - File editing safety rules
- `.config/NOTION_SYNC_LESSONS.md` - Notion integration workflow
- `.config/SESSION_FORMAT_SPEC.md` - Session document structure requirements
- `Resources/So-You-Want-to-Be-a-Game-Master_Text.md` - Dungeon keying reference
- `Resources/Frameworks/` - Campaign framework documentation