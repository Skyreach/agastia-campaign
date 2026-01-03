# Session Generation Skill

Generate D&D session documents with built-in spoiler prevention and content-introduction verification.

## Purpose

Create session files following SESSION_FORMAT_SPEC.md with automated checks to prevent:
- Spoiling unrevealed content in navigation/descriptions
- Referencing entities before they're introduced
- Breaking information firewall between player and DM content

## Usage

```
/session <session_number> <session_title>
```

Example:
```
/session 4 "The Hidden Vault"
```

## Workflow

### Stage 1: Initialize Session Structure

1. Create `Sessions/Session_<number>_<title>.md`
2. Add frontmatter (date, session_number, status: Planning, version, tags)
3. Add Session Flowchart (Mermaid diagram)
4. Add Quick Reference toggles

### Stage 2: Generate Core Content

**CRITICAL: Follow CONTENT_GENERATION_WORKFLOW.md**
- Use workflow-enforcer MCP to track stages
- Present 3-4 options for major encounters/NPCs before generating
- Get user approval before finalizing

Generate sections in order:
1. Travel/Opening Nodes
2. Main Encounters (with point crawl integration)
3. NPC Interactions
4. Quest Hooks
5. Session End/Cliffhanger

**For each section:**
- Specific creatures with stat blocks
- Clock mechanics showing escalation
- Player hooks tied to PC goals
- Wikilinks to all entities mentioned

### Stage 3: Content-Introduction Verification (CRITICAL)

**BEFORE SAVING THE FILE**, run verification sub-agent to prevent spoilers:

```python
# Pseudo-code for verification logic
verification_agent = Task(
    subagent_type="general-purpose",
    prompt="""
    Analyze Sessions/Session_<N>_<Title>.md for content-introduction violations.

    **Rules:**
    1. Content can only be referenced AFTER it's introduced in:
       - This session (earlier sections)
       - Previous sessions (must note: "From Session X")

    2. Navigation prompts must NOT reveal undiscovered content:
       - ❌ BAD: "Walk to the murder scene"
       - ✅ GOOD: "Walk south past the bakery"
       - Use generic descriptions until content revealed

    3. Quick Reference can mention future content (DM tool)
    4. DM Notes can mention future content
    5. Player-facing descriptions CANNOT mention unrevealed content

    **Check for violations in:**
    - Navigation sections
    - Encounter descriptions (read aloud text)
    - NPC dialogue
    - Quest hook descriptions

    **Report format:**
    - Line number + violation type + suggested fix
    - Example: "Line 176: Navigation spoils murder scene before discovery. Change 'Walk to murder scene' to 'Walk south past bakery'"
    """
)

# If violations found, STOP and fix before proceeding
```

**Verification Checklist:**
- [ ] No navigation spoilers (unrevealed locations/events mentioned)
- [ ] All entity references either introduced earlier OR noted "(From Session X)"
- [ ] Read-aloud text doesn't assume player knowledge they don't have
- [ ] NPCs don't mention events players haven't witnessed
- [ ] Quest hooks don't reveal plot points before discovery

### Stage 4: Finalize and Sync

1. Add Post-Session Debrief section
2. **Validate tier sorting:** `python3 .config/validate_tier_sorting.py Sessions/Session_<N>_<Title>.md`
   - MUST pass before proceeding (exit code 0)
   - If fails, reorder tier sections numerically
3. Validate format: `python3 .config/format_compliance_check.py Sessions/Session_<N>_<Title>.md`
4. Auto-fix issues: `python3 .config/auto_fix_format.py Sessions/Session_<N>_<Title>.md`
5. Sync to Notion: `python3 sync_notion.py Sessions/Session_<N>_<Title>.md session`
6. Update SESSION_STARTUP_CHECK to mark session ready

## Content-Introduction Rules (Detailed)

### Pre-Discovery Navigation

**Scenario:** Players haven't discovered murder scene yet

❌ **WRONG:**
```markdown
**At Central Plaza:**
- Walk to the murder scene (2 blocks south)
- Investigate the Steel Dragon's victim
```

✅ **CORRECT:**
```markdown
**At Central Plaza:**
- Walk south past the silk merchant and bakery (2 blocks)
- [Murder scene revealed when players investigate the alley]

**After Discovering Murder Scene:**
- Return to murder scene investigation (2 blocks south)
```

### Cross-Session References

**Scenario:** NPC from Session 2 appears in Session 3

✅ **CORRECT:**
```markdown
**Geist's Arrival** *(From Session 2)*
The dwarf bandit lieutenant the party encountered during their caravan guard mission appears...
```

❌ **WRONG:**
```markdown
**Geist's Arrival**
The dwarf appears... [assumes players remember/know who this is]
```

### Quest Hook Spoilers

**Scenario:** Quest involves finding a traitor

❌ **WRONG:**
```markdown
**Job Board Posting:**
"Investigate the merchant guild. Find the traitor working for the Chaos Cult."
```

✅ **CORRECT:**
```markdown
**Job Board Posting:**
"Investigate suspicious activity at merchant guild. Reports of missing inventory and unauthorized visitors."

**DM Notes:**
Guild treasurer is Chaos Cult mole. Clues point to them if party investigates thoroughly.
```

## Tier Sorting Rule (MANDATORY)

**ALL tier-based sections MUST be sorted numerically, NOT alphabetically.**

❌ **WRONG (Alphabetical):**
```markdown
### Tier 4 - Merchant District
### Tier 3 - Scholar Quarter
### Tier 2 - Noble Quarter
### Tier 6 - Dock District
```

✅ **CORRECT (Numerical):**
```markdown
### Tier 2 - Noble Quarter
### Tier 3 - Scholar Quarter
### Tier 4 - Merchant District
### Tier 6 - Dock District
```

**Implementation:**
- When generating tier sections, sort by tier number (1-7)
- When reading existing district data, always output in numerical order
- Add validation check: `grep "^### Tier" <file> | sort -V` should match original order

## Integration with Other Tools

### Workflow Enforcer
```bash
# Start session generation workflow
workflow_id=$(workflow-enforcer start_workflow session_generation)

# Track stages
workflow-enforcer transition $workflow_id present_options
workflow-enforcer transition $workflow_id generate_content
workflow-enforcer transition $workflow_id verify_introduction
workflow-enforcer transition $workflow_id user_approval
workflow-enforcer complete_workflow $workflow_id
```

### Format Validator
```bash
# Run after generation
format-validator validate_document_format Sessions/Session_<N>.md
```

### Wikilink Integration
```bash
# Add wikilinks after content generation
python3 .config/add_wikilinks.py Sessions/Session_<N>.md --dry-run
python3 .config/add_wikilinks.py Sessions/Session_<N>.md
```

## Testing the Skill

After creating a session file, verify it passes all checks:

```bash
# 1. Format compliance
python3 .config/format_compliance_check.py Sessions/Session_<N>.md

# 2. Tier sorting verification
grep "^#### Tier" Sessions/Session_<N>.md | awk '{print $2}' | tr -d '-' | sort -n -c
# Should not print errors (indicates numerical order)

# 3. Wikilink verification
python3 .working/session3_wikilink_audit.py Sessions/Session_<N>.md
# Should show high resolution rate (>90%)

# 4. Content-introduction check (manual)
# Read through navigation sections - any spoilers?
# Read through encounter descriptions - do they assume unrevealed knowledge?
```

## Common Violations and Fixes

### Violation 1: Navigation Spoilers
**Detection:** Look for navigation options mentioning unrevealed content
**Fix:** Use generic geographic descriptions until content discovered

### Violation 2: Assumed PC Knowledge
**Detection:** Descriptions reference NPCs/events PCs haven't encountered
**Fix:** Add "(From Session X)" or restructure to introduce before referencing

### Violation 3: Quest Hook Reveals
**Detection:** Job board postings or quest descriptions reveal solutions
**Fix:** Move revelation to DM Notes, keep player-facing text vague

### Violation 4: Alphabetical Tier Sorting
**Detection:** `grep "^#### Tier" | head -4` shows 2,3,4,6 or similar jumbled order
**Fix:** Reorder sections numerically (1→2→3→4→5→6→7)

## Future Enhancements

- [ ] Automated content-introduction parser (detect violations programmatically)
- [ ] Integration with LSP for real-time spoiler warnings
- [ ] Pre-commit hook to block session files with introduction violations
- [ ] Mermaid diagram validation (all nodes reachable, no orphans)

## See Also

- `.config/SESSION_FORMAT_SPEC.md` - Required session structure
- `.config/CONTENT_GENERATION_WORKFLOW.md` - Multi-stage generation process
- `.config/DATA_PARITY_PROTOCOL.md` - File modification guidelines
- `.claude/skills/point-crawl.md` - Navigation system integration
- `.claude/skills/add-wikilinks.md` - Entity cross-referencing
