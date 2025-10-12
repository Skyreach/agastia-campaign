# Component Registry - Canonical File Naming Reference

**Status:** ACTIVE - Single source of truth for all file naming conventions
**Last Updated:** 2025-10-12

---

## Purpose

This document defines the canonical file naming patterns and directory structure for the Agastia campaign. All file operations MUST validate against these patterns before creation.

**Enforcement:**
- `file-organizer` MCP: Validates filenames before creation
- Pre-commit hooks: Blocks non-compliant files
- CLAUDE.md: Requires validation for all file operations

---

## File Naming Patterns

### Pattern Format

All campaign entity files follow this structure:
```
[Type]_[Specific_Name].md
```

**Rules:**
- Type prefix is REQUIRED (from Valid Types list below)
- Use underscores for spaces (no spaces allowed)
- Use title case for proper nouns
- No version numbers, dates, or temporal indicators
- Extension must be `.md`

### Valid Type Prefixes

| Type | Pattern | Example | Directory |
|------|---------|---------|-----------|
| **PC** | `PC_[Name].md` | `PC_Manny.md` | `Player_Characters/` |
| **NPC** | `NPC_[Name].md` | `NPC_Professor_Zero.md` | `NPCs/[Category]/` |
| **Faction** | `Faction_[Name].md` | `Faction_Chaos_Cult.md` | `Factions/` |
| **Location** | `Location_[Name].md` | `Location_Agastia_City.md` | `Locations/[Type]/` |
| **Session** | `Session_[Num]_[Title].md` | `Session_1_Caravan_to_Ratterdan.md` | `Sessions/` |
| **Artifact** | `Artifact_[Name].md` | `Artifact_Heartstone.md` | `Campaign_Core/` |
| **Ecology** | `Ecology_[Name].md` | `Ecology_Shadow_Creatures.md` | `Dungeon_Ecologies/` |
| **Quest** | `Quest_[Title].md` | `Quest_Blood_Target.md` | `Quests/` |
| **Item** | `Item_[Name].md` | `Item_Rakash_Axe.md` | `Items/` |

### Regex Patterns (for validation)

```regex
# PC files
^PC_[A-Z][A-Za-z0-9_]+\.md$

# NPC files
^NPC_[A-Z][A-Za-z0-9_]+\.md$

# Faction files
^Faction_[A-Z][A-Za-z0-9_]+\.md$

# Location files
^Location_[A-Z][A-Za-z0-9_]+\.md$

# Session files (requires number)
^Session_\d+_[A-Z][A-Za-z0-9_]+\.md$

# Artifact files
^Artifact_[A-Z][A-Za-z0-9_]+\.md$

# Ecology files
^Ecology_[A-Z][A-Za-z0-9_]+\.md$

# Quest files
^Quest_[A-Z][A-Za-z0-9_]+\.md$

# Item files
^Item_[A-Z][A-Za-z0-9_]+\.md$
```

---

## Forbidden Patterns

### NEVER Use These Patterns

These patterns violate data parity protocol and version control principles:

```regex
# Version indicators
/v\d+/i              # v1, v2, V3
/_v\d+/i             # _v1, _v2, _V3
/_\d+$/              # Ending with _1, _2, _3

# Temporal indicators
/\d{4}-?\d{2}-?\d{2}/  # 20251012, 2025-10-12
/\d{6,8}/              # 251012, 20251012

# Status suffixes
/_updated/i
/_revised/i
/_final/i
/_new/i
/_old/i
/_backup/i
/_copy/i
/_draft/i
/_temp/i
/_wip/i
/_test/i

# Copy indicators
/\(\d+\)/            # (1), (2), (3)
/ copy/i             # " copy", " Copy"
```

### Examples of Invalid Filenames

❌ `PC_Manny_v2.md` - Version number
❌ `NPC_Zero_updated.md` - Status suffix
❌ `Session_1_FINAL.md` - Temporal indicator
❌ `Faction_Cult_2025-10-12.md` - Date stamp
❌ `Location_Agastia (1).md` - Copy indicator
❌ `PC_Manny copy.md` - Copy suffix
❌ `NPC_Octavia_DRAFT.md` - Status suffix

### Why These Are Forbidden

**Git tracks all versions** - Version indicators in filenames defeat the purpose of version control.

**Data parity** - Multiple versions create confusion about source of truth.

**Notion sync** - Duplicate files cause sync conflicts and data desync.

**Cross-session consistency** - Different Claude threads can't coordinate if multiple versions exist.

---

## Directory Structure

### Entity Type → Directory Mapping

```
agastia-campaign/
├── Player_Characters/
│   └── PC_*.md
│
├── NPCs/
│   ├── Major_NPCs/
│   │   └── NPC_*.md
│   ├── Faction_NPCs/
│   │   └── NPC_*.md
│   └── Location_NPCs/
│       └── NPC_*.md
│
├── Factions/
│   └── Faction_*.md
│
├── Locations/
│   ├── Cities/
│   │   └── Location_*.md
│   ├── Districts/
│   │   └── Location_*.md
│   ├── Regions/
│   │   └── Location_*.md
│   ├── Towns/
│   │   └── Location_*.md
│   └── Wilderness/
│       └── Location_*.md
│
├── Sessions/
│   └── Session_*_*.md
│
├── Campaign_Core/
│   ├── Artifact_*.md
│   ├── Campaign_Overview.md
│   └── The_Codex.md
│
├── Dungeon_Ecologies/
│   └── Ecology_*.md
│
├── Quests/
│   └── Quest_*.md
│
├── Items/
│   └── Item_*.md
│
└── Resources/
    ├── Encounter_Design_Guide.md
    ├── Goals_Tracker.md
    └── [Reference materials - not entity files]
```

### Directory Validation Rules

**Rule 1: Type-Directory Consistency**
- PC files MUST be in `Player_Characters/`
- NPC files MUST be in `NPCs/[Category]/`
- Faction files MUST be in `Factions/`
- Location files MUST be in `Locations/[Type]/`
- Session files MUST be in `Sessions/`

**Rule 2: No Loose Files**
- Campaign root should contain only directory-organizing files (README.md, CLAUDE.md, etc.)
- All entity files must be in their designated directories

**Rule 3: Subdirectory Categories**
- NPCs use functional categories: Major_NPCs, Faction_NPCs, Location_NPCs
- Locations use geographic types: Cities, Districts, Regions, Towns, Wilderness
- New categories require documentation update

---

## Special Cases

### Generated Content Files

**Temporary generation files** (before user approval):
- Location: `.working/generated/`
- Pattern: `YYYY-MM-DD_[Type]_[Name].md`
- These files are NOT synced to Notion
- Deleted after content approved and moved to proper location

**Example workflow:**
1. Generate content → `.working/generated/2025-10-12_Encounter_Bandits.md`
2. User approves → Move to `Sessions/Session_1_Encounters.md` or integrate into session file
3. Delete temporary file

### Workshop Files

**Ephemeral work-in-progress files:**
- Location: `.working/workshop/`
- Pattern: `[Anything].md` (no restrictions)
- NOT synced to Notion
- Deleted when work complete

### Conversation Logs

**Campaign-related conversations:**
- Location: `.working/conversation_logs/`
- Pattern: `[Topic].md` (no type prefix required)
- Synced to Notion with tag: `conversation-log`

**Infrastructure conversations:**
- Location: `.working/development/`
- Pattern: `[Topic].md`
- NOT synced to Notion

---

## Validation Checklist

Before creating ANY `.md` file, verify:

- [ ] Has valid type prefix from approved list
- [ ] Uses underscores instead of spaces
- [ ] Contains NO forbidden patterns (versions, dates, status suffixes)
- [ ] Target directory matches entity type
- [ ] No similar filename already exists in target directory
- [ ] Uses `.md` extension
- [ ] Follows title case for proper nouns

**Tool:** Use `file-organizer` MCP `validate_filename` before creating files.

---

## Enforcement Mechanisms

### Layer 1: MCP Tools
- `file-organizer` MCP provides `validate_filename` tool
- Returns errors for forbidden patterns
- Returns warnings for missing type prefixes (should be errors - planned enhancement)

### Layer 2: Pre-Commit Hooks
- Git hook validates all staged `.md` files
- Blocks commit if forbidden patterns detected
- Blocks commit if file in wrong directory

### Layer 3: CLAUDE.md Instructions
- Behavioral requirement to call `validate_filename` before file creation
- Instructions to never bypass validation with direct Write/Edit/Bash

### Layer 4: Manual Review
- Code review during PR process
- Human verification of file naming conventions

---

## Migration Notes

### Renaming Existing Files

If an existing file violates conventions:

1. **DO NOT rename directly** - Git will lose history
2. **Use `git mv` command:**
   ```bash
   git mv old_name.md New_Name.md
   ```
3. **Update all cross-references** in other files
4. **Commit rename separately** with clear message
5. **Sync to Notion after rename**

### Legacy Files

Some files may not follow current conventions (pre-dating this registry):
- Document legacy files in this section
- Create migration plan
- DO NOT create new files with legacy patterns

**Known legacy files:**
- `Campaign_Overview.md` - Lacks prefix, but acceptable as core file
- `The_Codex.md` - Lacks prefix, but acceptable as core file
- `README.md`, `CLAUDE.md`, `NOTION.md` - Infrastructure files, exempt

---

## Related Documentation

- `.config/DATA_PARITY_PROTOCOL.md` - Why duplicate files are forbidden
- `.config/ENTITY_FORMAT_SPECS.md` - Content structure requirements (separate from naming)
- `.config/mcp-servers/file-organizer/server.js` - Validation implementation
- `CLAUDE.md` (lines 184-189) - Original naming conventions

---

## Version History

- **2025-10-12:** Initial registry created, consolidating naming conventions from CLAUDE.md, DATA_PARITY_PROTOCOL.md, and file-organizer MCP patterns
- Added comprehensive regex patterns
- Added directory validation rules
- Added special cases for generated content

---

## Questions?

When uncertain about file naming:
1. Check this document first
2. Use `validate_filename` MCP tool
3. Ask user if ambiguous
4. DO NOT guess or assume
