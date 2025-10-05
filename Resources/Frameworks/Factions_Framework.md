# Factions Framework
*From "The Game Master's Book of Proactive Roleplaying"*

## Core Concept

Factions are organizations/groups with shared interests that pursue goals concurrently with players. They balance player agency by creating opposition and a living world. Think of factions as GM-controlled counterparts to the party.

**Key Principle:** Players act first; factions sweep in and pursue their own goals relentlessly.

## The Four Elements of Faction Design

### 1. Faction Identity
- What is the faction and what does it do?
- Use archetypes, existing ideas, character backstories as inspiration
- Rule of cool - aesthetics and role they play matter

### 2. Area of Operation
- Where is faction most active?
- Where might they want to expand?
- Location gives clarity on existing goals and conflicts

### 3. Power Level
- How powerful is this faction?
- What resources at disposal?
- Likelihood of coming out on top in conflict
- Determines when factions act vs. sit out

### 4. Ideology
- Core principles
- Why do they do what they do?
- What do they believe about their role in world?
- **Most important** - determines how they act when designing goals

## Faction Goal Structure

Factions use the same goal structure as PCs (see `Goals_Framework.md`):

- **Long-term:** What faction ultimately wants, may take entire campaign
- **Mid-term:** Stepping stones to long-term, comprises multiple short-term goals
- **Short-term:** Specific encounters, directly actionable

## Common Faction Archetypes

### Government Factions

**Core Function:** Exert authority through organization, protection promise, punishment threat. Preserve stability and order.

**Characteristics:**
- Operate at every level: local to empire
- Preserve organization itself
- Keep the peace
- Support status quo
- Oppose disruption of existing order

**Examples:**
- Town Watch
- Royal Court
- City Council
- Imperial Government
- Local Magistrate
- Military Command

**See `../Tables/Faction_Government_Goals.md` for PC Goal → Government Goal conversions**

---

### Labor Factions

**Core Function:** Represent workers' interests. Improve lives of members. Guilds, unions, cartels, trade organizations.

**Characteristics:**
- Strength from membership size and leadership effectiveness
- Nearly everyone works = widespread influence
- More exclusive = fewer beneficiaries
- Ubiquitous - most NPCs belong to one

**Examples:**
- Merchant Guild
- Thieves' Guild
- Craftworkers Union
- Trade Caravan Network
- Professional Association

**Goal Tendencies:**
- Improve everyday lives of members
- Favorable trade deals
- Better working conditions
- Rights to worksites
- Securing contracts

**See `../Tables/Faction_Labor_Goals.md` for PC Goal → Labor Goal conversions**

---

### Criminal Factions

**Core Function:** Organized crime. Network participating in illegal business/trade. Direct opposition to government.

**Characteristics:**
- Somewhat organized
- Must keep activities hidden
- Has leader(s)
- Goals usually "accrue wealth and power"
- **How** they do it is what makes them interesting

**Examples:**
- Crime Family
- Smuggling Ring
- Pirate Crew
- Bandit Network
- Black Market Cartel

**Goal Tendencies:**
- Wealth accumulation
- Power accumulation
- Saving face after embarrassment
- Protecting territory/operations

**See `../Tables/Faction_Criminal_Goals.md` for PC Goal → Criminal Goal conversions**

---

### Religious Factions

**Core Function:** Follow deity/faith. Extremely flexible goals based on god's domain.

**Characteristics:**
- Access to powerful tomes, lost relics, magic items
- Ancient or tied to worthy entity
- Versatility based on pantheon variety
- Can play any needed role (friend, foe, or neutral)

**Examples:**
- Temple of [Deity]
- Cult of [Dark God]
- Monastic Order
- Church Hierarchy
- Mystery Cult

**Goal Tendencies:** Tied directly to god's domain
- Health/Wellness → Aid poor and sickly
- Power/War → Support armies, convert soldiers
- Knowledge → Acquire rare tomes, fund schools
- Vengeance → Punish wicked, root out corruption

**See `../Tables/Faction_Religious_Goals.md` for domain-based goals**

## Faction Tracking

### Recommended Limits
- **Max 12 active factions** in entire campaign
- **Max 4 factions** per plot point/figure
- **Max 6 factions** per location (even large cities)
- Use dice-sided numbers for random generation (d4, d6, d8, d10, d12)

### Simple Tracking Sheet (5 lines per faction)

```
FACTION NAME: _______________________
Relative Power: _____________________
Central Operations: _________________
Brief Description: __________________
Long-term Goals: ____________________
```

### Progress Clocks

Use progress clocks (from Blades in the Dark) to track faction goals:

- Circle divided into 4, 6, 8+ segments based on difficulty
- Fill segments as time passes based on PC interactions
- When full, goal is complete
- Not planned beforehand - interpret PCs' actions
- Maintains consistency and honesty

## Faction Reactions to PCs

Use standard Reaction Table (2d6):

| 2D6 | REACTION |
|-----|----------|
| 2-3 | Immediate Attack |
| 4-5 | Hostile |
| 6-8 | Cautious/Threatening |
| 9-10 | Neutral |
| 11-12 | Amiable |

**Determination Options:**
1. Random chance via reaction check at first encounter
2. Preset during prep based on faction ideology
3. Bias to reaction check (2d6+2 or 2d6-2)

**PC actions may influence/change over time**

## Faction Conflicts

### Between-Sessions Faction Activity

**When to Use:**
- Personal inspiration takes precedence
- If looking for inspiration
- Procedural content generator

**Procedure:**
1. **Faction conflict check:** Roll 1d6, on 1 = conflict occurred
2. **Identify factions:** Roll twice on faction table (same = civil strife or reroll)
3. **Determine outcome:** Roll on Faction Conflict Table (see `../Tables/Faction_Conflict_Table.md`)
4. **Interpret result:** Translate to adversary roster + key updates

### Random Faction Table Construction

List all factions in campaign/region, assign to appropriate die:

**Example:**
- 1-2: Town Watch
- 3-4: Merchant Guild
- 5: Cult of the Serpent
- 6: Wandering Adventurers (or roll again twice)

**Optional Additions:**
- **Wandering Adventurers:** Competing adventuring groups
- **Outsiders:** External faction becomes interested
- **Roll Again Twice:** Multi-party conflicts

## Faction Integration with Other Systems

### Factions → Goals
- Faction goals should overlap with PC goals (creates collision)
- Use Goal Overlap tables to ensure natural conflict
- See `Goals_Framework.md` for goal structure

### Factions → Patrons
- Faction leaders become patrons
- Patrons inherit faction resources and power
- See `Patrons_Framework.md` for patron design

### Factions → Dungeons
- Faction rosters become adversary rosters
- Faction territories map to dungeon zones
- Multiple factions in dungeon create dynamic play
- See `Adversary_Rosters_Framework.md` for implementation

### Factions → Mysteries
- Faction members become investigation nodes
- Faction goals create mystery motivations
- Faction conflicts generate clues
- See `Three_Clue_Rule_Framework.md` for integration

## Enemy Tactics by Faction Goal

Faction ideology determines how minions fight:

| Faction Goal | Minion Tactic |
|--------------|---------------|
| Create new law code | Never cheat in combat |
| Emphasize group unity | Attack in groups, never break formation |
| Prove controversial theorem | Outwit opponents, exploit weaknesses |
| Reclaim lost homeland | Never flee, never back down |
| Follow ancient warrior-king | Challenge strongest foe |
| Take control of throne | Backstab allies, make bargains |
| Divine tenets no matter what | Hold true to god's tenets |
| Find redemption | Attack any foe who slays ally |

### Clever Enemy Guidelines

1. **Target Certain Foes:** Weaker characters, healers, exploit specific weaknesses
2. **Use Terrain:** Cover for archers, space for fliers, corridors for grapplers
3. **Work Together:** Balanced teams, diverse encounters
4. **Don't Get Cornered:** Plan movement, maintain mobility, positioning matters

## Why Multiple Factions?

### Action
- Single-faction lairs settle into status quo
- Multiple factions → conflict + competing interests drive events forward
- Dynamic world that responds to PC actions

### Opportunity
- Sow division between factions
- Forge alliances
- Seek refuge with friendlier faction
- Play both ends against middle
- Take advantage of complex strategic tapestry

### Framework for Between-Sessions
- PCs disrupt balance of power
- Factions help figure "what happens next"
- Quick brainstorming generates hours of prep

**Example:** "PCs killed 70% of orcs. Who takes advantage? Orc King's response? Wait, they killed Orc King - orcs broken into factions? Red Prince allied with goblins? Other orcs turn to Voodoo Necromancer?"

## Faction Roster Template

```
FACTION: _________________________________
Archetype: ______________________________
Power Level: ____________________________
Territory: ______________________________
Ideology: _______________________________

GOALS:
Long-term: ______________________________
Mid-term: _______________________________
Short-term: _____________________________

ROSTER:
Action Group 1: _________________________
Action Group 2: _________________________
Action Group 3: _________________________

REACTION TO PCs: ________________________
PROGRESS CLOCKS: ________________________
NOTES: __________________________________
```

## Related Frameworks
- `Goals_Framework.md` - Goal structure for factions
- `Patrons_Framework.md` - Faction leaders as patrons
- `Adversary_Rosters_Framework.md` - Faction rosters in dungeons
- `../Tables/Faction_Conflict_Table.md` - Procedural faction conflicts
