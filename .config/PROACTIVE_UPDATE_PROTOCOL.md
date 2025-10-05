# Proactive Update Protocol

**Created:** 2025-10-04
**Status:** ACTIVE

## Purpose
Automatically detect and apply updates when the user provides new campaign information during conversations.

## Protocol Steps

### 1. **Detection Phase**
When user provides new information (NPCs, goals, relationships, faction details, etc.):
- Immediately recognize this as potential data
- Identify what type of entity/information it affects
- Determine which files need checking

### 2. **Search & Compare Phase**
- Search existing files for related information
- Check if information is:
  - ✅ **NEW** - Doesn't exist yet, safe to add
  - ⚠️ **CONFLICTING** - Contradicts existing data, requires resolution
  - 🔄 **UPDATING** - Expands/modifies existing data, needs merge

### 3. **Confirmation Phase** (CRITICAL)
**Use color-coded callouts to make updates visible:**

```markdown
## 🟢 NEW DATA DETECTED

**Type:** [NPC/Goal/Relationship/etc]
**Affects:** [File paths]
**Action:** Adding new information

**Details:**
- [What's being added]
- [Where it's being added]
```

```markdown
## 🟡 UPDATE DETECTED

**Type:** [NPC/Goal/Relationship/etc]
**Affects:** [File paths]
**Action:** Modifying existing information

**Changes:**
- Old: [existing data]
- New: [updated data]
```

```markdown
## 🔴 CONFLICT DETECTED

**Type:** [NPC/Goal/Relationship/etc]
**Conflicts with:** [File path and line]
**Action:** NEEDS RESOLUTION

**Conflict:**
- Existing: [current data]
- New: [provided data]

**How to resolve?** [Ask user for decision]
```

### 4. **Execution Phase**
After confirmation:
1. Update local markdown files
2. Maintain frontmatter consistency
3. Update version numbers (semantic versioning)
4. Update related_entities cross-references

### 5. **Notion Sync Phase**
After local updates complete:
- Offer to sync to Notion
- Use MCP `sync_notion` tool if available
- Confirm sync success

### 6. **Summary Phase**
Provide clear summary:
```markdown
## ✅ UPDATES COMPLETE

**Files Modified:**
- [file1.md] - Added [X]
- [file2.md] - Updated [Y]

**Notion Sync:** [Pending/Complete]

**Next Steps:** [If applicable]
```

---

## When to Apply This Protocol

### ALWAYS Apply For:
- New NPC mentions
- New faction relationships
- New PC goals
- New locations
- New quests
- Faction patron changes
- Progress clock updates
- Status changes (Active → Inactive, etc.)

### SOMETIMES Apply For:
- Minor clarifications (confirm if worth documenting)
- Speculative information (mark as speculation)
- Session outcomes (wait until confirmed)

### NEVER Apply For:
- Casual conversation
- Questions about existing data
- Hypotheticals ("what if...")
- Meta-discussion about the campaign

---

## File Update Priority

### Priority 1: Core Campaign Files
- Player_Characters/*.md
- Factions/*.md
- NPCs/Major_NPCs/*.md

### Priority 2: Session & State Files
- Sessions/*.md
- Resources/Goals_Tracker.md
- Campaign_Core/*.md

### Priority 3: Reference Files
- Locations/*.md
- NPCs/Faction_NPCs/*.md
- Resources/*.md

---

## Conflict Resolution Guidelines

### Common Conflict Types:

**Type 1: Factual Contradiction**
- Example: "NPC is in City A" vs "NPC is in City B"
- Resolution: Ask user which is correct, update accordingly

**Type 2: Timeline Issue**
- Example: Events in wrong order
- Resolution: Clarify timeline with user

**Type 3: Relationship Contradiction**
- Example: "A trusts B" vs "A hates B"
- Resolution: Check if relationship changed over time or clarify

**Type 4: Goal/Status Change**
- Example: Goal was completed, now mentioned as active
- Resolution: Usually accept new status as current truth

### Default Assumptions:
- **User's new information is authoritative** (they're the DM)
- **Newer information supersedes older** (unless timeline-specific)
- **When unclear: ASK** (don't guess)

---

## Version Control

### When Updating Files:
- **Patch bump (X.X.+1):** Minor corrections, small additions
- **Minor bump (X.+1.0):** New goals, relationships, significant info
- **Major bump (+1.0.0):** Complete rewrites, fundamental changes

### Commit Messages:
- Use descriptive commits when using git
- Format: `[Proactive Update] Added [X] to [Entity]`

---

## Color Code Reference

| Symbol | Meaning | Use Case |
|--------|---------|----------|
| 🟢 | New Data | Information doesn't exist yet |
| 🟡 | Update | Modifying/expanding existing data |
| 🔴 | Conflict | Contradictory information needs resolution |
| ✅ | Complete | Update successfully applied |
| ⚠️ | Warning | Potential issue or requires attention |
| 🔄 | In Progress | Currently processing update |

---

## Example Workflow

**User says:** "Nikki has a new goal - find the special someone whose blood is key to Zero's plan"

**Claude responds:**

```
## 🟢 NEW DATA DETECTED

**Type:** PC Goal
**Affects:** Player_Characters/PC_Nikki.md
**Action:** Adding new goal

**Details:**
- Adding goal: "Find special someone (blood key to Zero's plan)"
- Status: Active
- Scope: Long-term
- Related to: Professor Zero, Decimate Project

Proceeding with update...
```

Then updates file, syncs Notion, and confirms completion.

---

## Emergency Override

If user says:
- "Don't update files" → Pause protocol for session
- "Manual only" → Switch back to ask-first mode
- "Revert" → Undo last proactive update

---

**Last Updated:** 2025-10-04
