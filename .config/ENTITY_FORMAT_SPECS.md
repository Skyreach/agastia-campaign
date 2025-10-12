# Entity Format Specifications

**Status:** ACTIVE - Single source of truth for all entity document structures
**Last Updated:** 2025-10-12

---

## Purpose

This document defines the canonical content structure and format requirements for all campaign entity files. While `COMPONENT_REGISTRY.md` governs file NAMING, this document governs file CONTENT.

**Enforcement:**
- `format-validator` MCP: Validates document structure (planned)
- Sub-agent verification: Deep format validation
- CLAUDE.md: Requires format compliance before Notion sync

**Related Documentation:**
- `.config/COMPONENT_REGISTRY.md` - File naming conventions
- `.config/NOTION_INTEGRATION.md` - Sync requirements
- `.config/SESSION_FORMAT_SPEC.md` - Session-specific formatting (to be merged here)

---

## Universal Requirements

### All Entity Files Must Have:

1. **YAML Frontmatter** (first block in file)
2. **H1 Title** (immediately after frontmatter)
3. **Consistent Markdown** (no HTML tags)
4. **Version Tracking** (semantic versioning in frontmatter)

### Frontmatter Rules

**Required Fields (All Entities):**
```yaml
---
name: [Entity Name]
type: [Entity Type]
status: [Status Value]
version: "X.Y.Z"
tags: [tag1, tag2, tag3]
---
```

**Optional Fields (Entity-Specific):**
```yaml
player: [Player Name]          # PC only
faction: [Faction Name]         # PCs, NPCs
location: [Location Name]       # NPCs, Encounters
threat_level: [Level]           # NPCs, Factions
related_entities: [...]         # All types
```

### Markdown Compatibility

**✅ Use These:**
- Headers: `#`, `##`, `###`
- Emphasis: `**bold**`, `*italic*`, `code`
- Lists: `- item`, `1. item`
- Blockquotes: `> text` or `| text` (for tiered DCs)
- Code blocks: ` ```language ... ``` `
- Toggles: `**Toggle: Title**` (Notion-specific)

**❌ Never Use:**
- HTML tags: `<details>`, `<div>`, `<br>`
- Inline styles: `<span style="...">`
- Tables (use lists instead)
- Images (not in Notion sync scope)

### Toggle Usage Rules

**What Toggles Are:**
Toggles are collapsible sections in Notion that hide content until clicked. They improve readability for long documents by allowing readers to expand only what they need.

**Notion Toggle Format:**
```markdown
**Toggle: Section Title**
Content inside the toggle goes here.
Can span multiple lines and paragraphs.

Next paragraph still inside toggle.
```

**When to Use Toggles:**
- ✅ Stat blocks (combat statistics)
- ✅ Large equipment lists
- ✅ Session history (one toggle per session)
- ✅ DM Notes subsections (secrets, future hooks)
- ✅ Long relationship lists
- ✅ Detailed background/backstory

**When NOT to Use Toggles:**
- ❌ Player Summary (always visible)
- ❌ Basic Information (quick reference)
- ❌ Current/Active Goals (need visibility)
- ❌ Single-line items
- ❌ Critical at-a-glance information

**Toggle Nesting:**
- Avoid deep nesting (max 2 levels)
- Use headings instead for structure
- Example:
  ```markdown
  ## DM Notes

  ### Secrets
  **Toggle: Secret 1**
  [Content]

  **Toggle: Secret 2**
  [Content]
  ```

**HTML Details Tags:**
NEVER use `<details>` and `<summary>` HTML tags. They don't render in Notion and show as literal text. Always use the `**Toggle: Title**` format instead.

### Information Firewall

**What It Is:**
The information firewall is a structural pattern that separates player-visible information from DM-only secrets within entity documents. This ensures you can show players their file without revealing hidden plot elements.

**Required Sections:**

**Player Summary (Above the Firewall)**
- What players observe and know
- Public information, common knowledge
- Observable behavior and appearance
- Known goals and motivations (as the PC/NPC presents them)
- Basic statistics (for PCs)

**DM Notes (Below the Firewall)**
- True motivations and secret goals
- Hidden allegiances
- Unrevealed backstory
- Plot hooks and future connections
- Secret weaknesses or abilities
- Information players haven't discovered

**Why This Matters:**
1. You can show PC files to players without spoiling secrets
2. Prevents accidental reveals during descriptions
3. Helps you track what players know vs. what's true
4. Supports dramatic reveals and plot twists

**Example Structure:**
```markdown
# NPC Name

## Player Summary
[What players can observe and have learned through interaction]

### Basic Information
[Visible traits, known affiliations]

### Known Activities
[What players have witnessed]

### Personality & Behavior
[Observable mannerisms and patterns]

## DM Notes
[--- INFORMATION FIREWALL ---]

### True Motivations
[What this NPC actually wants]

### Secrets
[Things players don't know]

### Future Hooks
[Plot threads you plan to develop]
```

**Validation:**
Every NPC, Faction, Quest, and Artifact file should have both Player Summary AND DM Notes sections. If a file has DM Notes but no Player Summary, you've failed the information firewall.

---

## Entity Type Specifications

### 1. Player Character (PC)

**File Pattern:** `PC_[Name].md`
**Directory:** `Player_Characters/`
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [Character Name]
type: PC
player: [Player Name]
race: [Race]
class: [Class]
level: [Number]
status: Active|Inactive|Dead
version: "X.Y.Z"
tags: [pc, race, class, ...]
faction: [Faction Name] # Optional
related_entities: [NPC1, NPC2, ...]
---
```

#### Required Sections

```markdown
# [Character Name]

## Player Summary
[2-3 paragraph overview for quick reference]

### Basic Information
- **Player:** [Name]
- **Race:** [Race]
- **Class:** [Class]
- **Level:** [Number]
- **Background:** [Background]
- **Feats:** [Feat list]

### Appearance
[Physical description, mannerisms]

### Known Personality Traits
- [Trait 1]
- [Trait 2]

## Current Goals

### Active Goals
- **[Goal Name]** [Scope] - [Description]

### Completed Goals
- [Goal with completion date]

## Relationships

### Party Members
- **[PC Name]:** [Relationship description]

### NPCs
- **[NPC Name]:** [Relationship description]

### Factions
- **[Faction Name]:** [Role/standing]

## Special Items & Abilities
[Unique equipment, abilities, magical items]

## Session History

### Session [N] ([Date])
[Key events, character development, loot gained]
```

#### Validation Rules
- Must have at least one Active Goal
- Related entities must exist in campaign files
- Level must match campaign progression
- Status must be: Active, Inactive, or Dead

---

### 2. Non-Player Character (NPC)

**File Pattern:** `NPC_[Name].md`
**Directory:** `NPCs/[Category]/` (Major_NPCs, Faction_NPCs, Location_NPCs)
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [NPC Name]
type: NPC
status: Active|Inactive|Dead|Unknown
version: "X.Y.Z"
tags: [npc-category, role, ...]
location: [Current Location]
faction: [Faction] # Optional
threat_level: None|Low|Medium|High|Extreme # If antagonist
related_entities: [Entity1, Entity2, ...]
---
```

#### Required Sections

```markdown
# [NPC Name]

## Player Summary
[What PCs know about this NPC - 2-3 paragraphs]

### Basic Information
- **Type:** [Race/Species]
- **Status:** [Active/Inactive/etc]
- **Location:** [Current location]
- **Threat Level:** [If antagonist]

### Known Activities
[What PCs have observed]

### Personality & Behavior
[Observable traits, mannerisms]

## Relationships

### [Category]
- **[Entity Name]:** [Relationship]

## DM Notes

### True Motivations
[Hidden information PCs don't know]

### Secrets
[Key secrets that could be discovered]

### Future Hooks
[Potential plot threads]

## Stat Block (Optional)

**Toggle: Combat Statistics**
[Stat block if NPC is combatant]
```

#### Validation Rules
- threat_level required if tags include "antagonist"
- location should reference existing Location file
- faction should reference existing Faction file
- DM Notes section MUST exist (even if brief)

---

### 3. Faction

**File Pattern:** `Faction_[Name].md`
**Directory:** `Factions/`
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [Faction Name]
type: Faction
version: "X.Y.Z"
status: Active|Dissolved|Hidden
threat_level: None|Low|Medium|High|Extreme
tags: [faction, alignment, ...]
related_entities:
  - [Key Member 1]
  - [Key Member 2]
  - [Enemy Faction]
---
```

#### Required Sections

```markdown
# [Faction Name]

## Player Summary
[What PCs know - 2-3 paragraphs]

## DM Notes

### Overview
[Full faction description for DM]

### Key Members
- **[Member Name]** - [Role and description]

### Goals & Progress Clocks

**[Goal Name]** [X/Y]
- [Progress description]
- Current Progress: [Details]

### Operations
[How faction operates]

### Relationships
- **Allies:** [Faction/entity list]
- **Enemies:** [Faction/entity list]
- **Neutral:** [Faction/entity list]

### Future Hooks
[Potential plot threads involving faction]

### Secrets
[Hidden information about faction]
```

#### Validation Rules
- Must have at least one Goal with progress clock
- Progress clock format: `[X/Y]` where X ≤ Y
- Key Members should reference existing NPC files
- threat_level required

---

### 4. Location

**File Pattern:** `Location_[Name].md`
**Directory:** `Locations/[Type]/` (Cities, Districts, Regions, Towns, Wilderness)
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [Location Name]
type: Location
location_type: City|District|Region|Town|Wilderness|Dungeon
status: Active|Destroyed|Abandoned|Accessible
version: "X.Y.Z"
tags: [location-type, features, ...]
parent_location: [Parent Location Name] # Optional
child_locations: [Child1, Child2, ...] # Optional
related_entities: [NPC1, Faction1, ...]
---
```

#### Required Sections

```markdown
# [Location Name]

## Player Summary
[What PCs know about this location]

### Basic Information
- **Type:** [Location Type]
- **Status:** [Accessible/etc]
- **Parent Location:** [If part of larger location]
- **Population:** [If settlement]

### Geography & Features
[Physical description, notable landmarks]

### Notable Residents
- **[NPC Name]:** [Role in location]

## DM Notes

### Hidden Features
[Secrets, hidden areas PCs could discover]

### Encounters
[Typical encounters in this location]

### Factions Present
- **[Faction Name]:** [Presence/influence in area]

### Plot Hooks
[Story opportunities tied to location]
```

#### Validation Rules
- location_type must match directory (Cities → City, etc.)
- parent_location and child_locations create hierarchy (validate no loops)
- Notable Residents should reference existing NPC files

---

### 5. Quest

**File Pattern:** `Quest_[Title].md`
**Directory:** `Quests/`
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [Quest Name]
type: Quest
quest_type: Mission|Travel|Mixed
status: Available|Active|Completed|Failed
version: "X.Y.Z"
tags: [quest, ...]
patron: [NPC Name] # Optional
location: [Primary Location]
related_entities: [NPC1, Location1, ...]
---
```

#### Required Sections

```markdown
# [Quest Name]

## Player Summary
[Quest hook as presented to PCs]

### Basic Information
- **Type:** [Mission/Travel/Mixed]
- **Status:** [Available/Active/etc]
- **Patron:** [Who gives quest]
- **Reward:** [Promised reward]

### Objectives
1. [Objective 1]
2. [Objective 2]

## Quest Structure

### Node [N]: [Node Name]
[Node description using tiered DC format if applicable]

**Outcomes:**
- Success: [Result]
- Failure: [Consequence]

## DM Notes

### Hidden Information
[Secrets, twists, complications]

### Alternative Approaches
[Other ways PCs might solve quest]

### Consequences
[Long-term impacts of quest outcomes]
```

#### Validation Rules
- patron should reference existing NPC file
- location should reference existing Location file
- Must have at least one objective

---

### 6. Artifact

**File Pattern:** `Artifact_[Name].md`
**Directory:** `Campaign_Core/`
**Syncs to Notion:** ✅ Yes

#### Frontmatter
```yaml
---
name: [Artifact Name]
type: Artifact
status: Lost|Found|Destroyed|Wielded
version: "X.Y.Z"
tags: [artifact, magic-type, ...]
current_wielder: [Entity Name] # Optional
related_entities: [Entity1, Entity2, ...]
---
```

#### Required Sections

```markdown
# [Artifact Name]

## Player Summary
[Legends, known information]

### Basic Information
- **Status:** [Lost/Found/etc]
- **Type:** [Weapon/Item/etc]
- **Power Level:** [Minor/Major/Legendary]

### Known Properties
[Observable magical effects]

### Legends & Lore
[Stories, myths about artifact]

## DM Notes

### True Properties
[All magical abilities]

### History
[Origin, previous wielders]

### Corruption/Curse
[Negative effects if any]

### Plot Significance
[Role in campaign story]
```

#### Validation Rules
- current_wielder should reference existing entity
- Power Level should be Minor, Major, or Legendary

---

### 7. Item

**File Pattern:** `Item_[Name].md`
**Directory:** `Items/`
**Syncs to Notion:** ✅ Yes (Simple format)

#### Frontmatter
```yaml
---
name: [Item Name]
type: Item
item_type: Weapon|Armor|Consumable|Tool|Treasure
rarity: Common|Uncommon|Rare|Very Rare|Legendary
version: "X.Y.Z"
tags: [item-type, ...]
current_owner: [Entity Name] # Optional
---
```

#### Required Sections

```markdown
# [Item Name]

## Description
[Physical description, appearance]

## Properties
- **Type:** [Weapon/Armor/etc]
- **Rarity:** [Rarity level]
- **Requires Attunement:** Yes/No

## Mechanical Effects
[Game mechanics, stats, bonuses]

## Lore (Optional)
[History, significance if notable]
```

#### Validation Rules
- rarity must be standard D&D rarity level
- current_owner should reference existing entity
- Mechanical Effects required

---

## Session Format (Special Case)

Sessions have complex formatting requirements detailed separately. **Full spec at:** `.config/SESSION_FORMAT_SPEC.md`

**Key Requirements:**
- Mermaid flowchart must appear BEFORE Quick Reference
- All nodes under single H2 "## Nodes"
- Tiered DC format for scene descriptions
- Notion-compatible toggles (no HTML)

**Quick Reference:**
```markdown
## Session Flowchart
```mermaid
[flowchart code]
` ``

## Quick Reference

**Toggle: Session Flow**
[Content]

## Nodes

### Node 1: [Name]
[Tiered DC format description]

---

### Node 2: [Name]
[Tiered DC format description]
```

---

## Tiered DC Description Format

**Use for:** Scene descriptions, room descriptions, investigation opportunities

**Format:**
```markdown
### [Scene/Room Name]

| Opening description - What everyone sees immediately

DC X: Basic information most PCs will discover

DC X+4: More detailed information with above included

DC X+7: Deep insights with all above included

DC X+10: Hidden/secret information with all above included
```

**Guidelines:**
- Use `|` pipe for opening boxed text
- Each tier includes previous information ("as above and...")
- DC 10-12: Basic observation
- DC 14-15: Moderate success
- DC 17-18: High success
- DC 20+: Expert/secret

**Example:**
```markdown
### 1: The Cloud Compass

| A massive bluish-silver axe embedded in the crater center. Around the weapon, a dark storm cloud swirls unnaturally.

DC 10: Sized for a giant, made of bluish-silver metal. Dark energy pulses through the weapon.

DC 14: As above and: Reality warps visibly around the artifact. Time flows irregularly nearby.

DC 17: As above and: Draconic runes near base read "storm... bond..." (requires Draconic language).

DC 20: As above and: Hidden thieves' cant symbol resembling the number 8.
```

---

## Validation Checklist

Before syncing ANY entity file to Notion:

- [ ] YAML frontmatter present with required fields
- [ ] H1 title matches frontmatter name
- [ ] All required sections present for entity type
- [ ] NO HTML tags (use Notion toggles instead)
- [ ] Version number follows semantic versioning
- [ ] related_entities reference existing files
- [ ] Status value from approved list
- [ ] Tags are lowercase with hyphens
- [ ] Markdown compatible with Notion (see Universal Requirements)

**Tool:** Use `format-validator` MCP with `use_subagent: true` for deep validation

---

## Version Control

### Semantic Versioning

Format: `"X.Y.Z"` (in quotes in YAML)

**When to bump:**
- **Patch (X.X.+1):** Typo fixes, minor clarifications, small corrections
- **Minor (X.+1.0):** New sections added, new goals, relationship updates, significant info
- **Major (+1.0.0):** Complete rewrites, fundamental character/entity changes, status changes

**Examples:**
- Fixed typo: `1.2.3` → `1.2.4`
- Added new goal: `1.2.3` → `1.3.0`
- Character dies: `1.2.3` → `2.0.0`

---

## Format Validation Tools

### Layer 1: Manual Checklist
Use validation checklist above before syncing

### Layer 2: format-validator MCP (Planned)
- `validate_document_format(file_path, entity_type)`
- Returns errors/warnings for format violations
- Can launch sub-agent for deep validation

### Layer 3: Sub-Agent Verification
- Reads file + this spec document
- Returns detailed format compliance report
- Catches subtle violations (heading hierarchy, toggle nesting, etc.)

### Layer 4: Pre-Sync Verification
- Notion sync scripts check frontmatter validity
- Block sync if required fields missing
- Warn for recommended fields missing

---

## Common Mistakes

### ❌ Wrong: HTML Details Tags
```markdown
<details>
<summary><b>Combat Stats</b></summary>
[content]
</details>
```

### ✅ Right: Notion Toggles
```markdown
**Toggle: Combat Stats**
[content]
```

---

### ❌ Wrong: Missing Frontmatter
```markdown
# Character Name

Description here...
```

### ✅ Right: Frontmatter First
```markdown
---
name: Character Name
type: PC
...
---

# Character Name
```

---

### ❌ Wrong: Inconsistent Heading Levels
```markdown
## Section A
#### Subsection (skipped H3)
```

### ✅ Right: Sequential Headers
```markdown
## Section A
### Subsection
```

---

## Migration & Legacy Files

Some existing files may not match current specs:
- Document in this section
- Create migration plan if needed
- DO NOT break existing Notion syncs

**Known legacy formats:**
- Older PC files may lack "Current Goals" section
- Some NPCs may lack threat_level
- Sessions may use HTML details tags

**Migration approach:**
- Update incrementally as files are edited
- Don't force retroactive updates
- New files MUST follow current spec

---

## Related Documentation

- `.config/COMPONENT_REGISTRY.md` - File naming conventions
- `.config/NOTION_INTEGRATION.md` - Sync methods and requirements
- `.config/DATA_PARITY_PROTOCOL.md` - Edit safety rules
- `.config/SESSION_FORMAT_SPEC.md` - Detailed session formatting (will be archived, merged here)

---

## Version History

- **2025-10-12:** Initial specification created
  - Consolidated format requirements from existing entities
  - Added simple entity types (PC, NPC, Faction, Location, Quest, Artifact, Item)
  - Added tiered DC format specification
  - Added validation checklists and common mistakes
  - Planned format-validator MCP integration

---

## Future Additions

**Complex entities to be added:**
- Session (detailed - currently in SESSION_FORMAT_SPEC.md)
- Dungeon (currently in DUNGEON_FORMAT_TEMPLATE.md)
- Encounter
- Spell/Ability

These will be added after simple entity validation is working.
