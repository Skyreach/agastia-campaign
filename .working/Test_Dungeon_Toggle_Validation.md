---
name: Test Dungeon Toggle Validation
type: Template
status: Testing
version: "1.0.0"
tags: [test, dungeon, toggle-test]
---

# Test Dungeon - Toggle Validation

This is a real dungeon file to test toggle functionality.

---

## Dungeon Overview

**Size:** Small (3 rooms)

**Dungeon-Wide Mechanics:**
- Shadow corruption drains resources
- All creatures regenerate in darkness

---

## Corridors & Connections

- **Entrance Passage (Surface → Room 1)**
    - Length: 30 feet descending
    - Width: 5 feet (single file)
    - Features: Purple mist rises from below

- **Passage A (Room 1 → Room 2)**
    - Length: 20 feet
    - Width: 10 feet
    - Features: Slick walls with corruption residue

---

**Toggle: Room 1 - Shadow Den**

**Toggle: Boxed Text**
> You enter a dark chamber. Purple mist clings to the floor. Shadows move along the walls.

**Toggle: Creatures**

**Toggle: Medium Shadows (2)**
- AC 14, HP 25
- Attack: +5 to hit, 1d8+2 necrotic
- Drain: WIS 14 save or lose resource

**Toggle: Weak Shadows (4)**
- AC 12, HP 7
- Attack: +4 to hit, 1d6+1 necrotic

**Toggle: Turn Order**
- [ ] 14 - Medium Shadow 1
- [ ] 14 - Medium Shadow 2
- [ ] 3 - Weak Shadow 1
- [ ] 3 - Weak Shadow 2
- [ ] 3 - Weak Shadow 3
- [ ] 3 - Weak Shadow 4

**Toggle: Interactive Elements**
- **Corruption Puddles** (Perception DC 12)
    - Purple liquid pools
    - Detonate with fire: 2d6 damage, 10ft radius
- **Stone Columns** (3 available)
    - Full cover
    - Athletics DC 15 to topple: 3d6 damage

**Toggle: Room Tactics**
- Weak shadows swarm first
- Medium shadows ambush from hiding
- Focus isolated targets
- Flee if reduced to 2 creatures

---

## Room 2 - Corruption Nexus

**Toggle: Boxed Text**
> A larger cavern. Corruption pulses rhythmically. Two massive shadow forms peel from the walls.

**Toggle: Creatures**
- **Large Shadows (2)**
    - AC 16, HP 40
    - Attack: +6 to hit, 2d8+3 necrotic
    - Drain: WIS 14 save or lose major resource

**Toggle: Turn Order**
- [ ] 12 - Large Shadow 1
- [ ] 12 - Large Shadow 2

**Toggle: Interactive Elements**
- **Stone Pillars** (3 available)
    - Full cover
    - Can topple for 3d6 damage
- **Secret Passage** (Investigation DC 14)
    - Behind corruption veil
    - Leads to Room 3
    - Bypasses combat

**Toggle: Room Tactics**
- Use pillars for cover
- Drain spell slots to heal
- Retreat when bloodied
- Don't pursue beyond room

---

## Room 3 - Heartstone Chamber

**Toggle: Boxed Text**
> Unexpected stillness. A fist-sized crystal glows with purple light at the room's center.

**Toggle: Interactive Elements**
- **The Heartstone** (Perception DC 12)
    - Fist-sized crystal
    - Warm to touch
    - Requires action to extract
- **Unstable Rubble** (Perception DC 12)
    - 20x20 area around Heartstone
    - STR save DC 11 or collapse
    - 2d6 bludgeoning damage

**Toggle: Room Tactics**
- Navigate rubble carefully
- Identify safe paths
- Extract Heartstone safely

---

## Format Rules Tested

This file tests:
- ✅ H2 headings with `is_toggleable: True`
- ✅ `**Toggle: Title**` creating toggle blocks
- ✅ Content nested under toggles
- ✅ Multiple toggle levels
- ✅ Lists and formatting inside toggles
