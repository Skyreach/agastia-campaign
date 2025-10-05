# Adversary Rosters Framework
*From "So You Want to Be a Game Master"*

## Core Concept

**Problem:** In static dungeons, denizen information is scattered across room keys, embedded in descriptions. They feel "stuck" to rooms and can't respond dynamically.

**Solution:** Adversary Roster - a list of denizens separate from the room key, allowing them to move, respond, and act like real creatures.

## Why Use Adversary Rosters?

### Freedom of Movement
- Denizens can patrol, respond to alarms, reinforce allies
- Not trapped in their "starting rooms"
- Realistic behavior patterns

### Simplified Tracking
- All combatants in one place
- Easy to see who's where and doing what
- Two discrete chunks (room key + roster) vs. chaotic multitude

### Dynamic Response
- Denizens react to PC actions in real-time
- Steam mephit flees to alert boss
- Work crew becomes patrol after hearing combat
- Guards converge on alarm

### Faction Integration
- Faction rosters become adversary rosters
- Multiple factions = multiple rosters (or one with faction noted)
- See `Factions_Framework.md` for faction design

## Action Groups

**Action Group** = fundamental building block of adversary roster

### Purpose
- Don't track every individual separately
- Group for easy management
- Some can be single individual if appropriate
- Usually all adversaries in single starting location

### Examples
- "4 mud mephits"
- "Patrol: 2 smoke mephits + 1 steam mephit"
- "Work Crew: 2 magmin + 2 mud mephits"
- "Asuvius + 2 magmin + 2 smoke mephits" (boss group)

### Labeling
- Number each group for reference (Group 1, Group 2)
- OR name for keyword/reminder ("Death Squad," "Perimeter Guard")
- Helps recall behavior/response patterns

### Stat Sheets
- Prep stat sheets for some/all action groups
- All denizen stat blocks on single sheet
- Grab matching sheet when PCs encounter
- No flipping between pages

## Action Group Types

### PATROLS
- Regular circuits through location
- Key their route: "Patrol Areas 1, 5, 7, 8, 9, 2, 1"
- Return to start and repeat
- Can have multiple patrol groups
- **Separate Patrol Roster** if multiple/complicated routes

**Example Roster Entry:**
```
North Patrol: 3 hobgoblin guards
Route: Area 12 → 15 → 18 → 20 → 18 → 15 → 12 (repeat)
Duration: 3 turns per circuit
```

### MOBILE (Default)
- Keyed to specific starting location
- Willing and able to respond to PC activities
- Can be redeployed, reinforcements, or pursue PCs
- Most action groups are Mobile

**Example Roster Entry:**
```
Throne Room Guard: 1 orc captain + 4 orc warriors
Area: 23
Notes: Will respond to alarm from Areas 20-25
```

### MOSTLY STATIONARY
- Unlikely to leave keyed area
- Choice (won't respond to alarm) or constraint (dire wolves in locked kennel)
- **Include on roster** (possibility of becoming mobile)
- **Indent entries** to distinguish from active elements

**Reasons for Mostly Stationary:**
- Locked/trapped in area
- Orders to guard specific location
- Unaware of outside events
- Indifferent to faction's fate
- Asleep, drugged, or incapacitated

**Example Roster Entry:**
```
    Kennel Wolves: 6 dire wolves
    Area: 17
    Notes: Locked in kennel, hostile to everyone
```

### STATIONARY
- Will NEVER leave location
- **NOT on roster** (only encountered in location)
- Appears in room key instead
- Immobile creatures, sealed away, or completely uninterested

**Examples:**
- Oozes sealed in jars
- Statues that animate when touched
- Bound demons in summoning circles
- Gelatinous cubes filling corridors
- Plants rooted to ground

**Exception:** If not immediately destroyed when disturbed, might add to roster after first encounter

## Roster Format

### Basic Roster Template

```
DUNGEON: _______________________
FACTION: _______________________

ACTION GROUP         | AREA  | NOTES
---------------------|-------|------------------------
4 mud mephits        | 1     | Ambush intruders
2 smoke + 1 steam    | 2     | Will flee to Area 10
Work Crew: 2 magmin  | 8-10  | Moving between areas
  + 2 mud mephits    |       |
2 magma mephits      | 9     |
BOSS: Asuvius +      | 10    | Boss fight, won't leave
  2 magmin +         |       | throne room
  2 smoke mephits    |       |
  Steam Construct    | 10    | Needs full charge to activate
```

### Advanced Roster with Factions

```
DUNGEON: Bloodpool Labyrinth Level 3

ACTION GROUP              | FACTION  | AREA | NOTES
--------------------------|----------|------|------------------
North Patrol: 3 hobgobs   | Red Orc  | 12   | Route: 12→15→18→20
South Patrol: 3 hobgobs   | Red Orc  | 25   | Route: 25→22→19→16
Orc King's Guard: 1 orc   | Red Orc  | 30   | Throne room, won't leave
  chief + 4 orc warriors  |          |      |
Goblin Scouts: 6 goblins  | Red Orc  | 14   | Allied to orcs, skirmish
  Goblin Boss: 1 boss     | Goblins  | 18   | Independent goals but allied
    + 8 goblins           |          |      |
    Kennel: 4 worgs       | Goblins  | 19   | Locked in kennel
Rival Adventurers: 4 NPCs | Neutral  | 8    | Competing for treasure
Bone Necromancer + 12     | Undead   | 35   | Hostile to all living
  skeletons               | Faction  |      |
```

## Using Rosters in Play

### During Prep
1. Create roster separate from room key
2. Denizens on roster NOT fully described in location key
3. Location key might note "Starting location for Group 3"
4. Cross-reference when PCs enter area

### During Play
1. Keep roster on separate sheet off to side
2. When PCs enter area, check roster for occupants
3. When denizens act, update their location on roster
4. Move denizens in real-time
   - "Steam mephit flees to Area 10 to alert Asuvius"
   - "Work crew now patrolling Areas 6-8"
   - "Hobgoblin patrol arrives in Area 15 (where PCs are fighting)"

### Fog of War Principle

**Don't immediately swarm PCs with all denizens**

Consider:
- Do they know what's happening?
- Are they assigned to guard elsewhere?
- Do they have any idea where the crisis is?
- Would they abandon their post?

**Roleplay Entire Dungeon:**
- Think what each denizen/group knows
- What they'd do with that knowledge
- How long it takes them to respond
- Whether they'd even care

**Example:** Combat in Area 15
- North Patrol in Area 18: Hears combat (2 areas away), arrives in 1 turn
- Throne Room Guard in Area 30: Too far to hear, no response
- Goblin Scouts in Area 14: Adjacent, hear everything, might flee or ambush
- Rival Adventurers in Area 8: Hear faint sounds, might investigate cautiously

## Variable Areas

**For NPCs not tied to single location:**

### Display Options

**Choice During Play:**
```
Feudal Lord: Area 21 (throne room) or Area 40 (bedchambers)
Notes: Choose based on time of day or dramatic timing
```

**Random Determination:**
```
Wizard: Area 21 (1-3) or Area 40 (4-6) [roll 1d6]
Notes: In library or laboratory
```

**Circumstance Dependent:**
```
Orc Sergeant: Area 21 (day) or Area 31 (night) or Area 35 (alert)
Notes: Rotates through barracks
```

### Avoid the Trap
- Don't minutely script every NPC's daily life
- Focus on typical starting condition
- Minor details flow during play
- Use variable areas only when particularly significant

## Advanced Roster Techniques

### Notes/Footnotes Column

**Use For:**
- Specific equipment ("Red Key of Hrathlar on lead cultist")
- Brief tactical notes ("Telepathically summoned by mind flayer")
- Why Mostly Stationary ("Sleeping," "Prepared ambush")
- Current activities ("Polymorphed as prisoners," "Playing poker")

**When to Use:**
- Notes column: Brief enough for one line
- Footnotes: Longer or apply to individuals in larger groups

### Multiple Rosters

**Day vs Night:**
```
DAY ROSTER: Guards active, workers present, lord in throne room
NIGHT ROSTER: Skeleton crew guards, workers absent, lord in bedchambers
```

**Normal vs Alert:**
```
NORMAL: Standard patrols, relaxed guards
ALERT: Double patrols, reinforced positions, boss mobilized
```

**When Worth It:**
- Only if location radically shifts
- If minor/isolated differences, use conditionals for individual groups
- Check player-facing significance

### Split Rosters

**Practical Limit:** ~15-20 action groups per roster (25 = absolute max)

**For Larger Complexes:**

**By Level:**
```
LEVEL 1 ROSTER: Surface level denizens (limited inter-level movement)
LEVEL 2 ROSTER: Mid-level denizens
LEVEL 3 ROSTER: Deep level denizens
```

**By Function:**
```
VIP ROSTER: Leaders, important NPCs, special units
SECURITY ROSTER: Patrols, guards, rapid response
WORKERS ROSTER: Non-combatants, support personnel
```

### Rosters & Random Encounters

**Usually choose EITHER rosters OR random encounters, not both**

**Why:**
- Don't need random security guards if tracking precise locations
- Rosters provide dynamic life already

**When to Use Rosters:**
- Smaller location crawls
- More fun and effective real-time strategy
- Precise tactical control desired

**When to Use Random Encounters:**
- Large locations where roster becomes unmanageable
- Efficient dynamic life modeling
- Abstract wandering monsters

**Hybrid Approaches:**

**Split Rosters + Random Passing Monsters:**
```
LEVEL 4 ROSTER: 12 action groups (detailed)
RANDOM ENCOUNTERS: 1d6 check, on 1 = monster from another level passing through
```

**Limited Patrols + Hazard Focus:**
```
BLOODPOOL LABYRINTH ROSTER:
- 3 patrol groups (detailed on roster)
- Focus on non-mobile hazards in room keys
- Random pressure: 1d6 check prompts random action group to move
```

## Roster Restocking

**Trivial to restock with rosters:**

1. Denizens separated from key
2. Don't need to re-key every room
3. Create new roster
4. Same key works (minimal changes for other alterations)

**Example:**
```
EXPEDITION 1 ROSTER:
4 mud mephits | Area 1
2 smoke + 1 steam | Area 2

EXPEDITION 2 ROSTER (after PCs cleared Area 1):
NEW: 2 magma mephits | Area 1 | Moved in from deeper level
2 smoke + 1 steam | Area 2 | Original survivors
```

See `Restocking_Dungeons_Framework.md` for details.

## Passive Locations

**Not every dungeon needs a roster**

**Appropriate for:**
- Dusty tombs, centuries undisturbed
- Awakened horrors that don't patrol
- Mindless oozes and constructs
- Locations without organized denizens

**Remember:** Variety is spice of life. Right tool for the job.

## Quick Reference

### Roster Checklist
- [ ] All mobile denizens listed
- [ ] Starting areas noted
- [ ] Action group types identified (Patrol/Mobile/Mostly Stationary)
- [ ] Patrol routes keyed (if any)
- [ ] Notes added for special equipment/tactics
- [ ] Faction affiliations noted (if multiple factions)
- [ ] Roster size manageable (~15-20 groups max)

### During Play Checklist
- [ ] Roster on separate sheet, easily visible
- [ ] Cross-reference area when PCs enter
- [ ] Update locations when denizens move
- [ ] Consider fog of war (what do they know?)
- [ ] Roleplay each group's response realistically
- [ ] Track which groups have been encountered/eliminated

## Example: Complete Roster

```
DUNGEON: Mephit Foundry
EXPEDITION: First Delve

ACTION GROUP              | TYPE    | AREA | NOTES
--------------------------|---------|------|---------------------------
Entrance Ambush:          | Mobile  | 1    | 1 hiding in tunnel
  4 mud mephits           |         |      |
Steam Vent Guards:        | Mobile  | 2    | Will flee to 10 if
  2 smoke + 1 steam       |         |      | overwhelmed
  Work Crew:              | Patrol  | 8-10 | Moving materials, can be
    2 magmin + 2 mud      |         |      | redeployed to fight
Forge Guards:             | Mostly  | 9    | Won't leave forge
  2 magma mephits         | Station |      | unattended
BOSS GROUP:               | Mostly  | 10   | Throne room, alerted by
  Asuvius + 2 magmin +    | Station |      | any fleeing mephits
  2 smoke mephits         |         |      |
  Steam Construct         | Station | 10   | Needs full charge (3 turns)
                          |         |      | to activate, then joins boss

TOTAL: 6 action groups, 21 creatures
```

## Related Frameworks
- `Factions_Framework.md` - Faction rosters become adversary rosters
- `Dungeon_Turn_Framework.md` - Time tracking for patrols
- `Restocking_Dungeons_Framework.md` - Updating rosters between expeditions
- `Dynamic_Encounter_Design_Framework.md` - Action group difficulty
