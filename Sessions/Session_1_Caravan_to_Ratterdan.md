---
date: TBD
name: Session 1 - Ratterdan Investigation
session_number: 1
status: Planning
tags:
- session1
- ratterdan
- heartstone
- giant-axe
- octavia
- shadow-dungeon
type: Session
version: 2.0.0
---

# Session 1: Ratterdan Investigation - DM Guide

**Party:** Level 1 (5 PCs with food buffs) | **Duration:** 2-3 hours | **Type:** Linear tutorial
## Session Flowchart

```mermaid
graph TD
    Start([Arrive at Ratterdan]) --> Node1[Node 1: Cloud Compass<br/>Skill Challenge]

    Node1 -->|Success| Enter[Find Underground Entrance]
    Node1 -->|Failure| EnterAlerted[Find Entrance<br/>Creatures Alerted]

    Enter --> Room1[Room 1: Shadow Rats<br/>3-4 CR 1/8]
    EnterAlerted --> Room1

    Room1 --> Room2[Room 2: Shadow Spawn<br/>2 CR 1/4]
    Room2 --> |Secret Passage DC 14| Room3Direct[Room 3: Heartstone]
    Room2 --> Room3[Room 3: Heartstone<br/>Environmental Challenge]

    Room3 --> Cutscene[Heartstone Cutscene<br/>Feats Granted]
    Room3Direct --> Cutscene

    Cutscene --> CorruptionBreak[Corruption Breaks<br/>Axe Cleansed]

    CorruptionBreak --> Surface[Return to Surface]

    Surface --> RakashClaim[[[Ian/Rakash]] Claims Axe<br/>Weapon Transforms]

    RakashClaim --> TravelChoice{Long Rest Needed?}

    TravelChoice -->|Yes| Meridian[Stop at [[Meridian's Rest]]<br/>Choose Encounter]
    TravelChoice -->|No| AgastiaDirect[Travel Direct to [[Agastia]]]

    Meridian --> [[Agastia]][Arrive at [[Agastia]]]
    AgastiaDirect --> [[Agastia]]

    [[Agastia]] --> End([Session 1 Complete])
```

## Quick Reference

**Toggle: Session Flow**
  1. **Arrival at Ratterdan** → Describe smoking crater, giant's axe
  1. **Node 1: Cloud Compass Skill Challenge** → Find underground entrance
  1. **Node 2: Shadow Dungeon (3 rooms)** → Resource-draining combat
  1. **Node 3: Heartstone Cutscene** → Feats granted, corruption breaks
  1. **Node 4: [[Ian/Rakash]] Claims Axe** → Weapon transforms
  1. **Node 5: Travel to [[Agastia]]** → Ad-hoc ([[Meridian's Rest]] if needed)
**Toggle: Key NPCs & Factions**
  - **None this session** - Solo exploration
  - **Hidden Mastermind:** [[Octavia (Subject #8)]] (Subject #8, unknown to party)
**Toggle: Important Items**
  - **Animated Heartstone:** Grants feats, breaks axe corruption
  - **Giant's Axe:** Too large/cursed until cleansed, then [[Ian/Rakash]] claims it
  - **Zhaask Symbols:** Draconic writing on axe (partial translation possible)

## Nodes

**Toggle: Encounter 1: Weakened Big Shadow**
  AC 14, HP 40 | 
  - 30
  Light sensitivity
  1. 22 - Shadow
  1. 15 - [[Kyle/Nameless]]
  1. 11 - Biago
  1. 11 - Monomi
  1. 6 - Rahk-ash
### Node 1: Cloud Compass Skill Challenge

> As you approach the crater, you see the massive bluish-silver axe embedded at the center - clearly sized for a storm giant. Around the weapon, a dark storm cloud swirls unnaturally, trapped in place. The cloud doesn't dissipate or drift - it hovers, pulsing with electrical energy, as if bound to the axe itself.
**DC 10:** Sized for a storm giant (20+ feet tall). Made of bluish-silver metal, masterwork quality. **Corruption seed visible:** Dark energy pulsing through weapon.
**DC 14:** As above and: Reality warps visibly around the artifact. Leaves fall upward in pockets of fey energy. Time seems to flow irregularly in zones near the crater's edge.
**DC 17:** As above and: **Zhaask symbols** (Draconic) etched near base. If Draconic known: "...storm... bond... dragon..." (full translation requires research)
**DC 20:** As above and: In thieves' cant style, a special rune embedded into the weapon - looks like the number 8
**Skill Challenge - Finding Underground Entrance:**
**Goal:** Party discovers the cloud is pointing underground like a compass
**Structure:** 3 successes before 2 failures
**DC:** 12-14 for all checks
**Possible Skills:**
- **Arcana:** Understand cloud's magical nature, recognize it as directional pointer
- **Investigation:** Examine axe position relative to cloud direction
- **Nature:** Read storm cloud behavior, recognize it's unnatural/bound
- **Perception:** Notice cloud isn't random, has consistent direction
- **Survival:** Use cloud as navigational tool, track direction
**Success:** Party realizes cloud points underground → find entrance to chamber
**Failure:** Find entrance eventually BUT:
- Dungeon creatures alerted (no surprise)
- OR time pressure (weather worsens)
- OR environmental hazard triggered
**Toggle: Axe Interaction**
- Touching causes 1d4 psychic damage (warn them!)
- Cannot be moved (DC 25+ STR, basically impossible)
- Cloud dissipates only after corruption broken

### Node 2: Underground Shadow Dungeon

**Toggle: Entrance Description**
> Following the cloud's direction, you find a collapsed section of ruins where the ground has caved in, revealing a dark passage descending underground. The air is cold, and shadows seem to move unnaturally along the walls. A faint purple glow emanates from somewhere deep below.
**Toggle: Dungeon Map & Ecology**
**Layout:** 3 rooms, linear with one loop option
```plain text
[Entrance]
    |
[Room 1: Shadow Rats]
    |
[Room 2: Shadow Spawn] <--loop--> [Secret Passage]
    |                                    |
[Room 3: Heartstone Chamber] <----------+
```
**Jaquaysing Elements:**
- Secret passage from Room 2 → Room 3 (Investigation DC 14)
- Allows bypassing some encounters
- Verticality: Rats use ceiling cracks, spawn use walls
**Ecology Notes:**
- Shadow creatures spawned from axe corruption
- Feed on magical energy (spell slots, class features)
- Will collapse when corruption source removed
- See full ecology: Dungeon_Ecologies/Ratterdan_Underground_Ecology.md
**Toggle: Dungeon Features**
**Illumination:** None (total darkness). Purple glow from corruption visible in all rooms.
**Ceiling Height:** Varies 6-12 feet. Natural cave ceiling with stalactites. Taller PCs risk head bumps (AC 12, 1 damage if running).
**Walls:** Rough volcanic rock (AC 16, climb DC 13). Fissures leak purple mist. Surface feels greasy with corruption residue.
**Floors:** Uneven cave floor with rubble. Shadow-moss grows in patches (difficult terrain, muffles footsteps - advantage on Stealth).
**Atmosphere:** Unnatural cold despite being underground. Corruption creates visual distortions like heat shimmer, but inverted.
**Toggle: Corridor Themes**
Describe passages showing increasing corruption as party descends. Mix 2-3 elements, intensifying toward Room 3:
- **Purple mist tendrils** creeping along ceiling
- **Shadow-moss patches** dampening sound
- **Fissures** leaking corruption like wounds
- **Distortion zones** where reality warps (visual shimmer)
- **Rubble piles** from ceiling collapses
- **Claw marks** in stone from shadow creatures
**AREA 1: SHADOW RAT DEN**
Shadow Creatures
- [x]  AC 13 | HP 2 w/ Disadvatage
- [x]  AC 13 | HP 8
- [x]  AC 12 | HP 2
- [x]  AC 12 | HP  7
- [x]  AC 12 | HP  7
- [x]  AC 12 | HP  7

1. 23 - [[Kyle/Nameless]]
1. 14 - Shadow Creatures
1. 14 - Rack ash
1. 13 - Biago
1. 12 - Shadow Creatures
1. 1 - Monomi
**Boxed Text:**
> You emerge into a natural cave chamber, its ceiling studded with dripping stalactites. Purple mist clings to the uneven floor in pools. The corruption here is thick—you can taste metal in the air, feel the unnatural cold seeping through your clothes. In the dim purple glow, you see movement: dark shapes that might be rats, but they're too quiet, too purposeful. They're watching you from the walls and ceiling.
**Reactive Skill Checks:**
- **Perception DC 12:** Notice rats positioning for pack tactics, coordinating with chittering sounds
- **Arcana DC 13:** Recognize shadow-essence draining effect (warns of Nibble Essence ability)
- **Survival DC 11:** Notice rat trails leading to Room 2 (escape route prediction)
**Room Elements:**
**Unstable Stalactites:** Can be dropped on rats (DEX attack +5, 2d6 damage, 10ft radius). Perception DC 12 to spot which ones are loose.
**Corruption Pools:** Difficult terrain, can be ignited with fire spells (1d6 fire/round to creatures in pool).
**Ceiling Cracks:** Rats use to move/hide; party can block with Mage Hand/objects (Investigation DC 11 to identify best cracks).
**Wall Fissures:** Leak purple mist; Investigation DC 12 reveals air current flowing toward Room 2.
**Rubble Piles:** Provide half-cover; hiding rats underneath (Perception DC 13 to spot before rats attack).
**Encounter:**
**Creatures:** 3-4 Shadow-Touched Rats (CR 1/8 each)
**Stat Block:**
- **AC:** 12
- **HP:** 7 (2d6) each
- **Speed:** 30ft, climb 30ft
- **Attack:** Bite +4, 1d4+2 piercing
- **Special - Nibble Essence:** On crit, drains 1 use of minor ability (Second Wind, Bardic Inspiration, etc.)
- **Pack Tactics:** Advantage when ally within 5ft of target
**Tactics:**
- Pack tactics (advantage when ally adjacent)
- Attack from ceiling (drop attacks)
- Target isolated PCs
- Flee to Room 2 if reduced to 1 rat
**DM Notes:**
- Introduce resource drain mechanic
- Show that shadows are dangerous but beatable
- Let party test tactics in low-stakes fight
**AREA 2: CORRUPTION NEXUS**
1. Rackash
1. Biago
1. [[Kyle/Nameless]]
1. Monomi
1. Shadow Guard 1 - 43
- [x]  Shadow Guard 2 - 40

**Boxed Text:**
> The passage descends into a larger cavern, and the wrongness hits you like a physical blow. Purple corruption doesn't just glow here—it *pulses*, rhythmic like a heartbeat. The walls are slick with shadow-residue. Pools of liquid darkness gather in floor depressions, their surfaces rippling without wind. Then the walls themselves begin to move. Two humanoid shapes peel away from the stone—shadows given form, reaching toward you with clawed hands that flicker between solid and smoke.
**Reactive Skill Checks:**
- **Perception DC 13:** See spawn eyeing spellcasters specifically (target priority warning)
- **Arcana DC 14:** Detect spawn siphoning ambient magic (explains Power Drain ability)
**Room Elements:**
**Stone Pillars:** Provide full cover, can be toppled on spawn (Athletics DC 15, 3d6 damage). Three pillars in room.
**Corruption Pools:** Feed spawn; destroying with radiant damage/fire deals 1d6 damage to nearest spawn. Four pools scattered throughout.
**Stalactite Clusters:** Can be dropped for area denial (DEX DC 12 or 2d6 damage, 10ft radius). Athletics DC 13 to dislodge.
**Distortion Zones:** Corruption warps space; can be triggered to disorient spawn (Arcana DC 13). Causes disadvantage on spawn attacks for 1 round.
**Shadow Residue Walls:** Slick surface makes climbing impossible, forces ground combat. Athletics DC 18 to climb (nearly impossible).
**Floor Cracks:** Unstable; running triggers DEX save DC 11 or prone. Cracks spiderweb through center of room.
**Secret Passage:** Investigation DC 14 reveals passage behind corruption veil leading to Room 3, bypassing final guardian.
**Encounter:**
**Creatures:** 2 Shadow Spawn (CR 1/4 each)
**Stat Block:**
- **AC:** 12
- **HP:** 9 (2d8) each
- **Speed:** 40ft
- **Attack:** Shadow Touch +4, 1d6+2 necrotic damage
- **Special - Power Drain:** On hit, target makes DC 12 WIS save or lose:
- 1 spell slot (lowest level), OR
- 1 use racial/class feature (player choice), OR
- 1d4 temp HP if no resources
- **Shadow Convert:** Spawn regains HP equal to spell slot level drained
- **Sunlight Sensitivity:** Disadvantage in bright light
- **Shadow Stealth:** Bonus action Hide in dim/dark
**Tactics (Tucker's Kobolds):**
- Use darkness to hide (bonus action Hide in dim/dark)
- Attack from unexpected angles (walls, ceiling if incorporeal)
- Focus fire on casters/healers (drain spell slots)
- Retreat to walls when bloodied
- Guard path to Room 3 (won't pursue far)
**DM Notes:**
- **Resource management test** - drain spell slots/features
- Can be deadly if party bunches up
- Secret passage bypasses this fight entirely
**AREA 3: HEARTSTONE CHAMBER**
**Boxed Text:**
> You emerge into unexpected stillness. The chamber is circular, almost peaceful compared to the chaos behind you. The corruption here isn't violent—it's concentrated, purposeful. Purple light fills the space with an otherworldly glow, emanating from a fist-sized crystal half-buried at the room's center. The Heartstone. It sits among ancient rubble like a treasure on display, its fey energy creating hypnotic patterns in the corruption-thick air. Too easy. The shadows circling it move with deliberate patience, waiting.
**Reactive Skill Checks:**
- **Arcana DC 15:** Identify Heartstone as fey artifact being corrupted, not corruption source
- **Perception DC 12:** Notice shadows won't cross certain threshold near Heartstone (safe zone exists, 5ft radius)
- **Arcana DC 15:** Sense Heartstone's power actively resisting corruption (could cleanse axe)
- **Religion DC 13:** Recognize fey magic signature matching the giant's axe above
**Room Elements:**
**The Heartstone:**
- Perception DC 12 or Investigation DC 10 to find among rubble
- Detect Magic: Strong fey aura, transmutation school
- Size of human fist, warm to touch
- Partially buried, requires action to extract safely
**Unstable Rubble Mound:**
- Corruption has eroded supports; visibly unstable (Perception DC 12 reveals danger)
- Weight-based trigger: Crossing triggers STR save DC 11 or collapse
- Effect: 2d6 bludgeoning damage, creates difficult terrain in 15ft radius
- Twist: Controlled collapse (Athletics DC 14) reveals hidden passage to surface, potential escape route
- Rubble covers 20x20 area around Heartstone
**Shadow Circling Pattern:**
- Shadows patrol in deliberate circle around Heartstone
- Investigation DC 13 reveals they avoid the 5ft safe zone
- Can be used to retrieve Heartstone safely if noticed
**Corruption Veins:**
- Purple veins run from Heartstone through floor toward surface
- Arcana DC 14 reveals they connect to giant's axe above
- Touching veins deals 1d4 psychic damage (warn players)
**Ancient Carvings:**
- Fey symbols carved into circular wall (Religion/Arcana DC 14 to read)
- Translate to: "Guardian heart preserves the bond" (foreshadows axe connection)
**Environmental Challenge (No Combat):**
This room has **no final guardian** this time. Party must navigate:
- Unstable rubble (possible collapse)
- Corruption zones (safe paths require Perception DC 11)
- Extraction challenge (safely removing Heartstone without triggering collapse)
**The Heartstone Cutscene:**
**When party touches/retrieves Heartstone:**
1. **Animation:**
> The crystal heart begins to shift and change, transforming into [DM CHOICE: shape?]. Fey energy pulses visibly through its form.
1. **Feat Granting:**
> Purple light EXPLODES from the Heartstone, washing over each of you.
   >
> **[To each PC individually]:** You see a vision of your deepest desire...
> - **[[Manny]]:** Blade and magic becoming one
> - **[[Nikki]]:** Shadow and arcane merging
> - **[[Ian/Rakash]]:** Primal fury perfected
> - **Kyle:** Rainbow spectrum expanding
> - **[[Josh]]:** Markings glowing with purpose
   >
> The power manifests within you - you gain a new feat immediately!
   >
> The light reclaims back into the Heartstone.
1. **Evil Laugh:**
> An evil, echoing laugh reverberates through the chamber. The Heartstone goes dormant.
1. **Corruption Breaking:**
> You feel a tremendous pulse of energy surge UPWARD through the earth, traveling from the Heartstone toward the surface. Above you, you hear a tremendous CRACK.
**DM Notes:**
- Feats are permanent even if Heartstone lost
- **Critical:** If Heartstone destroyed, party LOSES feats
- Heartstone can be taken or left (player choice)
- Corruption pulse breaks axe curse above
- Controlled rubble collapse can provide alternate exit if party thinks creatively

### Node 3: **Rack ash** Claims the Axe

>  As you emerge from the underground chamber, you see immediate changes. The dark corruption pulsing through the giant's axe has SHATTERED - the weapon now gleams with clean, bluish-silver light. The storm cloud dissipates, finally free.
**DC 10:** The reality warps around Ratterdan fade. The upward-falling leaves drift normally. Time stabilizes.
**DC 14:** As above and: The axe pulses with clean fey energy, no longer corrupted. It seems... smaller? Or perhaps just less menacing.
**[To [[Ian/Rakash]] only]:** You feel an overwhelming compulsion pulling you toward the weapon. Something deep within recognizes this axe as YOURS.
**The Claiming Event:**
**When [[Ian/Rakash]] approaches and touches the axe:**
> As your hand makes contact with the weapon, it SHRINKS. The massive 20-foot giant's axe reduces in size, transforming into a weapon perfectly sized for you to wield. The bluish-silver metal gleams, free of corruption.
>
> You feel dormant power within it - the Storm Bond ability, waiting to activate when lightning strikes.
**Axe Transformation:**
- **Before:** Giant-sized (unusable), cursed, corrupted
- **After:** Medium-sized (usable), cleansed, evolving weapon
- **Storm Bond:** Dormant but present (see Giant_Axe_Artifact.md)
- **[[Ian/Rakash]]:** Can now wield as primary weapon
**Toggle: DM Questions (Answer During Session)**
- What shape did Heartstone take when animated?
- Did Heartstone go dormant or stay animated?
- Did party take Heartstone with them?
- How did [[Ian/Rakash]]'s player react to the compulsion/axe claiming?

### Node 4: Travel to [[Agastia]]

**Toggle: Travel Options (Ad-hoc)**
**Option A: Direct to [[Agastia]]**
- Party pushes through without rest
- Narrate travel, arrive exhausted but safe
- Session ends at [[Agastia]] arrival
**Option B: Stop at [[Meridian's Rest]]**
- Party needs long rest after dungeon
- Choose encounter type:
- **Dream Sequence:** Visions related to Heartstone/feats
- **Night Attack:** 2-4 bandits/wolves (CR 1/8)
- **Social at Inn:** Meet NPC, foreshadow [[Agastia]]
- Then travel to [[Agastia]]

## Post-Session Debrief

**Toggle: Debrief Questions**
**Ask player/DM after session:**
1. What did the party learn/discover?
1. What questions are they asking?
1. Which mysteries hooked them most?
1. Any PC character development moments?
1. What resources did they burn? (spell slots, HP, features)
1. Did they take the Heartstone?
1. What's their plan for next session?
**Then update:**
- PC knowledge sections
- Location files (Ratterdan stabilized)
- Prepare Session 2 branching goals