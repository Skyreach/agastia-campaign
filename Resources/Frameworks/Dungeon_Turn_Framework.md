# Dungeon Turn Framework
*From "So You Want to Be a Game Master"*

## Core Concept

The Dungeon Turn is a looping procedure that structures dungeon exploration, lasting roughly **10 minutes in game time** (but flexible based on actions taken).

## The Dungeon Turn Procedure

### 1. Mark Ticks
- Track time passage
- Decrement spell durations
- Track resource consumption (torches, rations, etc.)
- Note environmental changes

### 2. Make an Encounter Check
- Roll for random encounters (method varies by system)
- D&D 5e example: Roll 1d6, encounter on 1
- Adjust frequency based on dungeon danger level
- See `../Tables/Random_Encounter_Guidelines.md`

### 3. Declare Actions
- Ask each player: "What's everyone doing this turn?"
- Collect all declarations before resolving
- Prompt: "What's everyone else doing while [PC] does that?"

### 4. Make Perception-Type Checks as Necessary
- Passive Perception for ambient awareness
- Active checks if PCs are specifically looking
- Advantage if on Lookout action
- Disadvantage if distracted by other actions

### 5. Resolve Actions
- Process declared actions
- Track movement on map
- Update dungeon state
- Loop back to step 1

## Implementation Styles

### Formalized (Explicit Turns)
- DM explicitly announces turns
- Collects action declarations formally
- Clear structure for new players
- Works well for complex dungeons

**Example:**
```
DM: "Okay, that's Turn 3 complete. Turn 4 begins. What's everyone doing?"
```

### Player-Unknown Structure (Invisible Turns)
- DM tracks turns privately
- Players interact naturally with game world
- Smoother narrative flow
- Works well for experienced groups

**Example:**
```
DM: (Mentally notes turn passing while players naturally describe exploration)
```

## Dungeon Actions

### Movement
- **Distance:** Up to dungeon pace (speed × 5 feet)
- **Incidental Movement:** Up to character's speed before requiring full turn
- **Fast Pace:** Speed × 100 feet
  - Disadvantage on Perception/Stealth
  - Cannot map or navigate carefully

**Example Calculations:**
- Speed 30 ft → Dungeon Pace 150 ft/turn
- Speed 30 ft → Fast Pace 3,000 ft/turn

### Combat
- All combatants use Combat as their dungeon action
- New turn begins when combat ends
- Loud noises may trigger additional encounter checks

### Conversation
- Extended discussion (10+ minutes) counts as dungeon action
- Brief exchanges are incidental

### Helping
- Assist allies' actions
- Grant advantage on their check
- OR both work on task (halve time, combine effort)

### Lookout
- Focused observation and vigilance
- Perception checks made normally (not at disadvantage)
- Other actions during same turn = disadvantage on Perception

### Overcome Obstacle
**Examples:**
- Pick locks
- Disable traps
- Climb out of pits
- Force doors
- Solve riddles
- Repair objects

**Guideline:** Line between incidental and full action based on complexity

### Ritual Casting
- Spells with 10-minute casting time
- Counts as full dungeon action
- May require concentration (no other actions)

### Search
- Thoroughly examine an area
- Typical room or 50 feet of hallway
- Colossal rooms may require multiple Search actions
- Required to find traps, secret doors, hidden treasures

### Other Actions
- Any activity taking 5-10 minutes
- Consult with DM on unusual actions

## Incidental Actions

These do NOT consume a dungeon action:

- **Talking** while doing tasks
- **Minor movement** (up to character's speed)
- **Quick item interaction:**
  - Lighting torch
  - Pulling switch
  - Opening unlocked door
  - Drawing weapon
  - Drinking potion
- **Anything not time-consuming** (DM discretion)

## Tracking Tools

### Dungeon Running Sheet

**Includes:**
- Party Name/Date
- Turn Tracker (tally marks)
  - Mark every 6 turns for torches (1 hour)
  - Track spell durations
- Marching Order template
  - Front, Middle, Rear positions
  - Who's carrying light sources
- Movement calculations
  - Party speed (slowest member)
  - Dungeon pace = speed × 5
  - Fast pace = speed × 100

**Example:**
```
PARTY: The Crimson Blades
DATE: Session 12 - 2024-03-15

TURNS: |||| |||| |||| ||  (17 turns = 2h 50min)

MARCHING ORDER:
Front:  [Gruk (torch)] [Lyra]
Middle: [Finn] [Celeste (lantern)]
Rear:   [Theron] [Mira]

MOVEMENT:
Party Speed: 25 ft (Gruk in heavy armor)
Dungeon Pace: 125 ft/turn
Fast Pace: 2,500 ft/turn
```

### Spell Duration Tracking

**Common Durations:**
- 1 minute = doesn't matter (less than 1 turn)
- 10 minutes = 1 turn
- 1 hour = 6 turns
- 8 hours = 48 turns (rarely tracked in dungeon)

**Tracking Method:**
- Note turn when cast
- Mark expiration turn
- Check off when expires

**Example:**
```
Turn 5: Mage Armor cast (8 hours = Turn 53)
Turn 7: Detect Magic cast (10 min = Turn 8)
Turn 8: Detect Magic EXPIRES
```

## Time-Based Events

### Resource Consumption

**Torches:**
- Burn for 1 hour = 6 turns
- Track on turn tracker
- When expired, declare "torch burns out"

**Rations:**
- Not usually tracked per turn
- 1 meal per 8 hours of activity

**Water:**
- Important in arid environments
- 1 gallon per day per person

### Environmental Changes

**Examples:**
- Patrol routes (guards pass every 30 minutes = 3 turns)
- Rising water (floods one level every hour = 6 turns)
- Closing portcullis (drops after 20 minutes = 2 turns)
- Ritual completion (cultists finish in 1 hour = 6 turns)

### Rest and Recovery

**Short Rest:**
- 1 hour = 6 turns
- Triggers 6 encounter checks in dangerous dungeon
- Risk vs. reward decision for players

**Long Rest:**
- 8 hours = 48 turns
- Usually requires leaving dungeon or secured sanctuary
- Triggers restocking (see `Restocking_Dungeons_Framework.md`)

## Prompt Examples

### Engaging the Group
- "What's everyone else doing while Finn picks the lock?"
- "While Lyra is searching the room, what are the rest of you up to?"
- "Gruk is on lookout. What about Theron, Celeste, and Mira?"

### Clarifying Action Scope
- "Is that your full action for the turn, or just incidental?"
- "Searching this entire library will take a few turns. Still want to do it?"
- "You can chat briefly, or have a full 10-minute conversation. Which?"

### Time Pressure
- "That's turn 14. Your torches will burn out in 2 more turns."
- "You hear footsteps echoing in the distance. They're getting closer."
- "The water is now waist-deep and rising. What do you do?"

## Variants and Modifications

### Different Time Scales

**Micro-Turns (1 minute):**
- Very tense, trap-filled dungeons
- Every action counts
- More frequent encounter checks

**Macro-Turns (30 minutes):**
- Vast, sprawling complexes
- Abstract exploration
- Less frequent but more significant encounters

### Alternative Encounter Triggers

Instead of time-based checks, trigger encounters on:
- Loud noises (combat, smashing doors)
- Specific rooms entered
- Failed Stealth checks
- Opening certain containers
- Plot-driven moments

### Exploration Without Turns

For less structured dungeons:
- Track time narratively
- Encounter checks at DM discretion
- Focus on player descriptions and choices
- Turns still exist "behind the scenes"

## Integration with Other Systems

### Dungeons + Factions
- Faction patrols on schedules (every X turns)
- Action groups respond to alarms
- See `Adversary_Rosters_Framework.md`

### Dungeons + Random Encounters
- Encounter check each turn (or other interval)
- See `../Tables/Random_Encounter_Guidelines.md`

### Dungeons + Restocking
- Track turns between expeditions
- Long rests trigger restocking checks
- See `Restocking_Dungeons_Framework.md`

## Common Pitfalls

### Over-Tracking
- Don't track every second
- Abstract when appropriate
- ~10 minutes is guideline, not law

### Under-Tracking
- Failure to track time = no resource pressure
- No tension or meaningful choices
- Dungeon becomes series of rooms, not expedition

### Inconsistent Implementation
- Sometimes using turns, sometimes not
- Confuses players
- Pick a style and stick with it

### Forgetting Encounter Checks
- Dungeon feels safe, static
- No danger of wandering monsters
- Reduces tension significantly

## Quick Reference

**ONE DUNGEON TURN =**
- ~10 minutes in-game time
- One significant action per PC
- One encounter check
- Movement up to dungeon pace

**TYPICAL TURN ACTIONS:**
- Move (dungeon pace)
- Search (one room)
- Overcome obstacle
- Ritual cast (10-min spell)
- Help ally
- Lookout
- Combat (until resolved)
- Extended conversation

**INCIDENTAL (NOT A TURN):**
- Brief talk
- Minor movement
- Quick item use
- Passive observation

## Related Frameworks
- `Adversary_Rosters_Framework.md` - Dynamic dungeon denizens
- `Restocking_Dungeons_Framework.md` - Between-expedition changes
- `../Tables/Dungeon_Actions_Reference.md` - Complete action list
- `../Tables/Random_Encounter_Guidelines.md` - Encounter frequency
