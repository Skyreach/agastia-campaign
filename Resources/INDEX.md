# Campaign Resources Index

This directory contains frameworks, tables, and MCPs extracted from two essential GM books and tailored for automated campaign management.

## 📚 Source Materials

1. **So You Want to Be a Game Master** - Dungeon design, scene framing, mystery structure
2. **The Game Master's Book of Proactive Roleplaying** - Goals, Factions, Patrons

## 📁 Directory Structure

```
Resources/
├── Frameworks/          # Detailed methodology for each system
├── Tables/              # Random generation tables and references
├── MCP_Servers/         # Automated tools (Model Context Protocol)
├── So-You-Want-to-Be-a-Game-Master_Text.md
├── The-Game-Master-s-Book-of-Proactive-Roleplaying_CLEANED.md
└── INDEX.md (this file)
```

## 🎯 Core Frameworks (Frameworks/)

### Proactive Roleplay Systems

1. **Goals_Framework.md**
   - The Five Rules of Proactive Fun
   - Goal creation process (PC/Faction/Patron)
   - Progress tracking with clocks
   - Validation checklist

2. **Factions_Framework.md**
   - Four Elements (Identity, Area, Power, Ideology)
   - Common Archetypes (Government, Labor, Criminal, Religious)
   - Faction conflict resolution
   - Integration with goals and patrons

3. **Patrons_Framework.md**
   - Patrons vs. Allies distinction
   - Three Key Design Factors
   - Long-term goal generation
   - Two Dials negotiation system

### Dungeon Systems

4. **Dungeon_Turn_Framework.md**
   - 10-minute turn procedure
   - Dungeon actions (Movement, Search, Combat, etc.)
   - Time tracking and resource management
   - Integration with encounter checks

5. **Adversary_Rosters_Framework.md**
   - Action Groups (Patrol/Mobile/Mostly Stationary/Stationary)
   - Separating denizens from room keys
   - Dynamic dungeon response to PCs
   - Faction integration

### Mystery & Scene Systems

6. **Three_Clue_Rule_Framework.md**
   - The Three Clue Rule for mysteries
   - Leads vs. Evidence
   - Node-based adventure design
   - Permissive clue-finding
   - Red herring warnings

7. **Scene_Framing_Framework.md**
   - Empty time identification
   - Scene transitions (sharp cut, abstract time, blended)
   - The Bang (explosive openings)
   - First Lull vs. Second Lull
   - Splitting the party management

## 📊 Reference Tables (Tables/)

1. **Goal_Generation_Tables.md**
   - Objective + Reason + Complication formula
   - Random tables (d20 each)
   - Faction goal adaptations
   - Customization guidelines

2. **Faction_Conflict_Table.md**
   - Conflict check procedure (1d6)
   - Outcome table (1d8)
   - Interpretation examples
   - Civil strife rules

3. **Patron_Negotiation_Table.md**
   - PC Goal → Patron Goal conversions
   - The Two Dials framework
   - Negotiation examples
   - Relationship progression

4. **Reaction_Table.md**
   - Standard 2d6 reaction table
   - Biased checks (+2/-2)
   - Faction-specific reactions
   - Shifting reactions during play

5. **Clue_Categories_Reference.md**
   - Five broad categories
   - Skill-based clue finding
   - Magical/fantastical clues
   - Avoiding monoclonal clues

## 🤖 MCP Servers (MCP_Servers/)

### 1. Campaign Goals MCP
**Tools:**
- `create_goal` - Create with Five Rules validation
- `list_goals` - Filter by owner/status/timeframe
- `update_goal` - Progress tracking
- `find_goal_overlaps` - Detect natural conflicts
- `generate_random_goal` - Use generation tables
- `validate_goal` - Check without saving

**Data:** `../Campaign_Data/goals.json`

### 2. Factions & Patrons MCP
**Tools:**
- `create_faction` - Four Elements design
- `list_factions` - Filter by archetype/power
- `update_faction` - Modify details
- `run_faction_conflict` - Procedural conflicts
- `create_patron` - Link to faction
- `list_patrons` - View all patrons
- `generate_patron_negotiation` - Based on PC goals
- `update_patron_relationship` - Track jobs/dials

**Data:** `../Campaign_Data/factions.json`, `patrons.json`

### Setup Instructions

See `MCP_Servers/README.md` for:
- Installation steps
- Claude Desktop configuration
- Usage examples
- Troubleshooting

## 🔄 System Integration

```
Goals ←→ Factions
  - Faction goals overlap with PC goals
  - Creates natural collision

Factions ←→ Patrons
  - Patrons represent factions
  - Inherit resources/power/ideology

Patrons ←→ Goals
  - Patrons enable PC goals
  - Short-term goals generated on-demand

Factions ←→ Dungeons
  - Faction rosters become adversary rosters
  - Territories map to dungeon zones

Goals ←→ Mysteries
  - PC goals become mystery conclusions
  - Goal obstacles become clues

Scenes ←→ ALL
  - Scene Flow orchestrates all systems
  - Determines which system active
```

## 📖 Usage Workflow

### Session Prep
1. Review PC goals (`list_goals`)
2. Check for goal overlaps (`find_goal_overlaps`)
3. Run faction conflict check (`run_faction_conflict`)
4. Update faction states based on conflicts
5. Prepare patron negotiations if PCs need help
6. Design encounters around goals/factions

### During Session
1. Track dungeon turns (if dungeoncrawling)
2. Use adversary rosters for dynamic response
3. Frame scenes with Bangs
4. Track clues found in mysteries
5. Update goal progress clocks
6. Note faction reactions to PC actions

### Between Sessions
1. Update goal statuses/progress
2. Run faction conflict checks
3. Restock dungeons
4. Update adversary rosters
5. Track patron relationships
6. Plan next session hooks from changes

## 🎲 Random Generation Quick Reference

**Generate a Goal:**
```
1. Roll d20 on Objectives table
2. Roll d20 on Reasons table
3. Roll d20 on Complications table
4. Combine: "wants to [OBJ] because [REASON], but [COMP]"
5. Add success criteria, failure consequences, obstacles
6. Validate with Five Rules
```

**Check for Faction Conflict:**
```
1. Roll 1d6 - on 1, conflict occurs
2. Roll twice on faction table (or choose specific factions)
3. Roll 1d8 on Conflict Outcomes table
4. Interpret narratively and update rosters
```

**Generate Patron Negotiation:**
```
1. Identify PC's short-term goal
2. Look up category in Negotiation Table
3. Find related patron goal
4. Set initial Aid and Restriction dials
5. Negotiate until agreement
```

**Run a Mystery:**
```
1. Create revelation list (conclusions PCs should reach)
2. For each revelation, create 3+ clues
3. Place clues in different nodes (locations/people/events)
4. Track clues found/missed/circled during session
5. If stuck, use proactive clues (guy with a gun)
```

## 📝 Related Campaign Files

- `../Campaign_Core/` - Central campaign information
- `../Sessions/` - Session notes and summaries
- `../NPCs/` - Character details
- `../Locations/` - Place descriptions
- `../Campaign_Data/` - MCP data storage (auto-created)

## 🆘 Quick Help

**"I want to create a PC goal"**
→ Read `Frameworks/Goals_Framework.md`
→ Use `Goal_Generation_Tables.md` for inspiration
→ Or use MCP: `create_goal`

**"I need faction conflict between sessions"**
→ Read `Frameworks/Factions_Framework.md`
→ Use `Tables/Faction_Conflict_Table.md`
→ Or use MCP: `run_faction_conflict`

**"My players are stuck in a mystery"**
→ Read `Frameworks/Three_Clue_Rule_Framework.md` → Proactive Clues section
→ Use `Tables/Clue_Categories_Reference.md` for ideas

**"How do I make my dungeon feel alive?"**
→ Read `Frameworks/Adversary_Rosters_Framework.md`
→ Separate denizens from room keys
→ Create Action Groups with patrol routes

**"I need to negotiate as a patron"**
→ Read `Frameworks/Patrons_Framework.md`
→ Use `Tables/Patron_Negotiation_Table.md`
→ Or use MCP: `generate_patron_negotiation`

## 🔮 Future Expansions

Potential additional MCPs:
- Dynamic Dungeon MCP (adversary rosters, restocking)
- Mystery & Investigation MCP (Three Clue Rule enforcement)
- Scene Flow MCP enhancements (Bang generation, lull detection)

These would complete the full automation suite for the frameworks.

## 📜 License

These resources are compiled for personal campaign use. Original books:
- "So You Want to Be a Game Master" by Justin Alexander
- "The Game Master's Book of Proactive Roleplaying" by Jonah & Tristan

Support the authors by purchasing their books!

---

**Last Updated:** 2025-10-04
**Version:** 1.0
**Status:** Core systems implemented, ready for campaign use
