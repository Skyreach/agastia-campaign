# Audit Session Links Skill

**Purpose:** Validate that every list item in session files has proper wikilinks to actionable content.

**CRITICAL RULE:** Every reference must link to its WHY (encounter/quest/point-crawl page). No orphaned references allowed.

## When to Use

- After generating or editing session files
- Before syncing session files to Notion
- During content audits (Phase 4 of linking project)
- When user asks to validate session completeness

## Process

### 1. Parse Session File for List Items

Extract all list items (bulleted and numbered) from the session file:

```bash
# Find bulleted list items
grep -E "^  - \*\*" Sessions/Session_N_Title.md

# Find numbered list items
grep -E "^  [0-9]+\.  \*\*" Sessions/Session_N_Title.md
```

### 2. Check Each Item for Actionable Links

For each list item, verify it links to actionable content:

**NPC entries** (under "Toggle: Key NPCs"):
- MUST link to NPC page, quest, or encounter
- Example: `**[[Corvin Tradewise]]:** [[Merchant Caravan]] leader who can provide information about [[Geist Investigation]]`
- Check: Does this link to an encounter, quest, or NPC file?

**Encounter entries** (under "Session Flow"):
- MUST link to encounter file or point-crawl page
- Example: `**[[Kyle/Nameless]]'s Hook:** [[Encounter: Starfall Anchor Crate]] - connection to [[Geist Investigation]]`
- BAD: `**Player Choice Encounter:** An encounter that can be resolved` (no link!)

**Location entries** (in tier toggles):
- MUST link to location page AND quests/encounters that happen there
- Example: `**[[Il Drago Rosso]]:** [[Nikki]]'s family restaurant, central to [[Quest: Family Threat]]`
- Check: Does this link to quest/encounter content, not just flavor text?

### 3. Report Orphaned References

List items that fail validation:

```
ORPHANED REFERENCES FOUND:

Line 41: **Player Choice Encounter:** An encounter that can be resolved in multiple ways
  Problem: No wikilinks to WHAT encounters are available
  Suggestion: Link to specific encounter files or point-crawl page

Line 48: **Dead Smuggler:** Victim at crate scene
  Problem: No link to encounter file
  Suggestion: Create Encounter_Dead_Smuggler.md or link to Day 1 encounter

Line 226: **[[Il Drago Rosso]]:** Restaurant description
  Problem: Links to location but not to quest/encounter
  Suggestion: Add link to Nikki's family threat quest
```

### 4. Use content-linker Skill for Suggestions

For each orphaned reference, use the content-linker skill to search for existing content:

```
Use content-linker skill: "Dead Smuggler"
Result: No matching files found
Suggestion: Create Encounter_Dead_Smuggler.md using workflow-enforcer
```

## Expected Output Format

```markdown
# Session Link Audit Report
**File:** Sessions/Session_3_The_Steel_Dragon_Begins.md
**Date:** 2026-01-10

## Summary
- Total list items: 47
- Items with actionable links: 37
- Orphaned references: 10
- Status: ❌ FAILING

## Orphaned References

### Key NPCs Section
1. **Line 48:** `**Dead Smuggler:** Victim at crate scene`
   - Missing: Link to encounter file
   - Search: No Encounter_Dead_Smuggler.md found
   - Action: Create encounter file or link to existing Day 1 encounter

2. **Line 49:** `**[[Corvin Tradewise]]:** [[Merchant Caravan]] leader`
   - Missing: Link to quest/encounter involving Corvin
   - Search: NPC_Corvin_Tradewise.md exists, but no quest link
   - Action: Add link to relevant quest or create one

### Session Flow Section
3. **Line 41:** `**Player Choice Encounter:** An encounter...`
   - Missing: Links to WHAT encounters
   - Search: Multiple encounters exist in Encounters/ directory
   - Action: Replace with specific encounter links or point-crawl reference

### Locations Section
4. **Line 226:** `**[[Il Drago Rosso]]:** [[Nikki]]'s family restaurant`
   - Missing: Link to quest/encounter at this location
   - Search: No Quest_Nikki_Family_Threat.md found
   - Action: Create quest file for family threat storyline

## Recommendations

1. Create missing content:
   - Encounter_Dead_Smuggler.md
   - Quest_Nikki_Family_Threat.md
   - Quest_Steel_Dragon_Investigation.md

2. Fix orphaned references by adding wikilinks to created content

3. Re-run audit after fixes to verify 0 orphans
```

## Validation Rules

### What Counts as "Actionable Content"?

✅ **GOOD - Has actionable links:**
- `**[[NPC Name]]:** Description linking to [[Quest]] or [[Encounter]]`
- `**Encounter Name:** [[Encounter: File Name]] description`
- `**[[Location]]:** Description with [[Quest]] or [[Encounter]] links`

❌ **BAD - Orphaned references:**
- `**NPC Name:** Description` (no wikilinks at all)
- `**[[NPC Name]]:** Description` (links to NPC but not to quest/encounter)
- `**Vague Hook:** Some text` (no specific encounter/quest link)
- `**[[Location]]:** Flavor text` (no quest/encounter happening there)

### Edge Cases

**Case 1:** Location links to location page but not quest
- Status: ❌ ORPHANED
- Why: Players need to know WHY to go there, not just WHERE it is

**Case 2:** NPC links to NPC page but not quest/encounter
- Status: ⚠️ PARTIAL (acceptable if NPC page has quest info)
- Verify: Check NPC page has quest/encounter links

**Case 3:** Encounter description with inline quest reference
- Status: ✅ GOOD
- Example: `**Hook:** See [[Quest: Geist Investigation]] for details`

## Integration with Workflow

**Before syncing to Notion:**
```bash
# Run audit
Use audit-session-links skill on Sessions/Session_N.md

# If orphans found, use content-linker
Use content-linker skill: "Entity Name"

# Create missing content
Use workflow-enforcer to create encounter/quest

# Add wikilinks
Edit session file to add [[Entity]] links

# Re-audit
Use audit-session-links skill (verify 0 orphans)

# Sync to Notion
python3 sync_notion.py Sessions/Session_N.md session
```

## Notes

- This skill is CRITICAL for maintaining wiki structure integrity
- Zero orphaned references is MANDATORY before Session 4 planning
- Document results in audit report for user review
- Use with content-linker skill for efficient gap analysis
