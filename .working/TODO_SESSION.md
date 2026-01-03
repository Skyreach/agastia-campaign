# Session TODO List
Last updated: 2026-01-02 23:45

## 🚨 CRITICAL - SESSION 3 BUG FIXES

### ✅ Completed
- [x] [23:35 → 23:45] Fix broken district wikilinks - FINDING: Not broken, all 18/22 wikilinks resolve
  - Context: User reported [[Merchant District]] not working
  - Investigation: Ran audit script, all district links resolve correctly
  - Files: Merchant District, Dock District, Scholar Quarter, Noble Quarter all exist and link properly
  - Aliases: 4 alias variations ([[Codex]], [[The Codex]], [[Veridian]], [[Inspiring Tables]]) all map correctly in WIKI_INDEX
  - Result: No fixes needed, wikilinks working as designed

- [x] [23:35 → 23:45] Audit all wikilinks in Session 3 using hashmap/set approach
  - Created: .working/session3_wikilink_audit.py
  - Method: Regex extraction → set deduplication → WIKI_INDEX cross-reference → file existence check
  - Results: 18/22 resolved (81.8%), 4 are aliases (acceptable)
  - Output: Comprehensive audit report showing resolved/unresolved entities

### In Progress
- [ ] [23:45] Add creature details to Sample Jobs in Tier 4
  - Context: Rat Extermination, Guard Caravan, Missing Person quests lack monster/creature details
  - Requirement: Each quest needs specific creature(s), not just generic "rats" or "bandits"
  - Example: "Rat Extermination" → specify Giant Rats (qty, stats) + possible Wererat leader
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md (lines 114-118)

### Pending - Critical Path
- [ ] [23:45] Convert Sample Jobs to use Clock mechanic
  - Context: Quests must have escalation, story purpose, ties to player goals
  - Problem: Current jobs are one-off "kill for gold" with no narrative consequence
  - Clock Mechanic: Each quest advances a faction clock or ties to player backstory
  - Examples:
    - Rat Extermination → Chaos Cult corruption spreading from Depths (Tier 7 → Tier 5)
    - Guard Caravan → Protects merchant who has Codex lead for Manny
    - Missing Person → Victim is Steel Dragon's next target, race against time
  - Resources: Check .config/ or Resources/ for Clock mechanic documentation
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md

- [ ] [23:45] Link Missing Person quest to Point Crawl page
  - Context: Investigation should use point crawl navigation
  - Requirement: Create point crawl nodes for investigation locations
  - Example: [[Central Plaza]] → [[Victim's Home]] → [[Last Seen Location]] → [[Kidnapper's Hideout]]
  - Files: Resources/Point_Crawl_Network.md (add investigation nodes)

- [ ] [23:45] Update session skill to prevent content-introduction spoilers
  - Context: Navigation section spoils murder scene before players discover it
  - Problem: Line 174-179 gives players options including "Walk south to murder scene" when they've never heard of it
  - Solution: Add verification sub-agent to session generation workflow
  - Sub-agent checks:
    1. Is this content introduced earlier in this session?
    2. Was this introduced in a previous session? (must call out: "From Session X")
    3. If neither, FLAG as unintroduced content spoiler
  - Files: .claude/skills/session.md (update skill), workflow-enforcer integration

- [ ] [23:45] Fix tier ordering - sort numerically not alphabetically
  - Context: Session 3 shows tiers as 2, 3, 4, 6 but text says "four > three > two > six" (alphabetical)
  - Current order: Tier 4, Tier 3, Tier 2, Tier 6 (alphabetical by word)
  - Correct order: Tier 2, Tier 3, Tier 4, Tier 6 (numerical)
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md (lines 104-167)

- [ ] [23:45] Update session command to enforce numerical tier sorting
  - Context: Prevent future sessions from repeating alphabetical tier sorting
  - File: Identify session generation command/skill
  - Fix: Add sorting logic to always order tiers 1-7 numerically
  - Validation: Add pre-commit check or workflow-enforcer rule

- [ ] [23:45] Create Mermaid city map diagram
  - Context: Navigation needs visual map showing district/location connections
  - Requirements:
    1. One master city map (all districts)
    2. Nodes for each location (districts, establishments, landmarks)
    3. Edges showing connections with cardinal directions
    4. Use Mermaid graph syntax (graph TD for top-down)
  - Example node: `CentralPlaza[Central Plaza - Job Board]`
  - Example edge: `CentralPlaza -->|2 blocks south| MurderScene[Murder Scene Alleyway]`
  - Location: Sessions/Session_3_The_Steel_Dragon_Begins.md (add before Navigation & Connections)

- [ ] [23:45] Build working file cataloging all Points of Interest for map
  - Context: Ensure city map is comprehensive and accurate
  - File: .working/agastia_poi_catalog.md
  - Contents:
    - Extract all locations from Agastia_City.md
    - Extract all establishments from Locations/Cities/Agastia/*.md
    - Extract all Session 3 mentioned locations
    - Group by tier/district
    - Note cardinal connections between locations
  - Output format: Markdown table with columns: PoI Name | Tier | District | Connections | Source File

- [ ] [23:45] Run verification sub-agent for city map completeness
  - Context: Ensure map includes all PoIs and connections are cardinally accurate
  - Method: Task tool with subagent_type="general-purpose"
  - Agent task: "Review .working/agastia_poi_catalog.md and Sessions/Session_3 map. Verify all PoIs included, check cardinal directions are consistent, report missing connections."
  - Validation criteria:
    - All Session 3 locations on map
    - All Agastia_City.md tier locations referenced
    - Cardinal directions consistent (if A is south of B, then B must be north of A)
    - No orphaned nodes (every location has at least one connection)

- [ ] [23:45] Link Day 2 encounter options to Inspiring Tables
  - Context: Lines 81-89 reference encounters but don't link to table entries
  - Current: "Option 1: The Lost Mastiff (from Inspiring Table)" - no wikilink
  - Fix: Add section anchors to Inspiring Tables, link each option
  - Example: `[[Inspiring Tables#The Lost Mastiff]]`
  - Files: Encounters/Inspiring_Tables.md (add anchors), Sessions/Session_3_The_Steel_Dragon_Begins.md (add links)

- [ ] [23:45] Convert Day 2 Player's Choice to point crawl format
  - Context: Day 2 encounters should use point crawl for player agency
  - Current: DM chooses from 3 options
  - Point Crawl: Players navigate road with encounter nodes, choose which to engage
  - Example:
    ```
    Day 2 Road Nodes:
    - [[Forest Clearing]] (Lost Mastiff encounter)
    - [[Druid's Grove]] (Wandering Druid encounter)
    - [[Goblin Ambush Site]] (Combat encounter)
    - [[Shortcut Path]] (bypasses encounters, harder terrain check)
    ```
  - Integration: Add nodes to Resources/Point_Crawl_Network.md
  - Files: Sessions/Session_3_The_Steel_Dragon_Begins.md, Resources/Point_Crawl_Network.md

## 📋 NEXT STEPS

**Priority Order:**
1. Fix tier ordering (quick fix, 5 min)
2. Add creature details to Sample Jobs (15 min)
3. Convert Sample Jobs to Clock mechanic (30 min, requires design)
4. Build PoI catalog (20 min)
5. Create city map Mermaid diagram (45 min)
6. Run verification sub-agent (10 min)
7. Update session skill with spoiler prevention (45 min, requires workflow integration)
8. Link Day 2 to Inspiring Tables (15 min)
9. Convert Day 2 to point crawl (30 min)
10. Link Missing Person to point crawl (15 min)

**Estimated Total:** ~4 hours

**Blocking Dependencies:**
- City map requires PoI catalog first
- Verification sub-agent requires city map complete
- Sample Jobs Clock conversion may require checking campaign resources for Clock documentation
