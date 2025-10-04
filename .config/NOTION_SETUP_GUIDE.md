# Notion Landing Page Setup Guide

## Overview
You have 36 entities synced to your "D&D Campaign Entities" database. Now you need to create filtered views on your Agastia Campaign landing page.

**Landing Page:** https://www.notion.so/Agastia-Campaign-281693f0c6b480b8b3dbfdfb2ea94997

**Database:** https://www.notion.so/281693f0c6b480be87c3f56fef9cc2b9

---

## Landing Page Structure

Create the following sections with linked database views:

### 1. 📅 Session @today

**Purpose:** Quick session prep - see next session, active goals, relevant NPCs/locations

**Steps to Create:**
1. Type `/linked` and select "Create linked database"
2. Choose "D&D Campaign Entities" database
3. Name the view: "Next Session"
4. Apply filters:
   - `Type` = `Session`
   - `Status` = `Planning` OR `Active`
5. Sort by: `Session Number` (ascending)
6. Properties to show:
   - Name, Type, Status, Session Number, Date Played, Player Summary

**Expected Results:**
- Session 1 - Caravan to Ratterdan (Planning)

---

### 2. 🎭 Player Characters

**Purpose:** Quick reference for all PCs and their current status

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Party Tracker"
3. Filter: `Type` = `PC`
4. Sort by: `Player` (A-Z)
5. Properties to show:
   - Name, Player, Class, Level, Status, Related Entities, Player Summary
6. View as: Table or Gallery (with cover images if you add them)

**Expected Results:**
- Monomi "Manny" (Player 1, Eldritch Knight, Level 2)
- Biago "Nikki" (Player 2, Arcane Trickster, Level 2)
- Rakash "Ian" (Player 3, Barbarian, Level 2)
- Nameless "Kyle" (Player 4, Ranger/Rogue, Level 2)
- Unknown "Josh" (Player 5, Sorcerer, Level 2)

---

### 3. 🎯 Active Goals Dashboard

**Purpose:** Track all in-flight objectives and progress clocks

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Active Goals Dashboard"
3. Filter:
   - `Tags` contains `goal` OR
   - `Progress Clock` is not empty
4. Group by: `Goal Owner` or `Type`
5. Sort by: `Goal Status` (Active first)
6. Properties to show:
   - Name, Goal Owner, Goal Status, Progress Clock, Related Entities, Player Summary, DM Notes

**Expected Results:**
Should show goals from:
- Goals_Tracker page
- Faction progress clocks (Chaos Cult: Artistic Escalation [1/6], etc.)

---

### 4. 🗺️ Locations

**Purpose:** Navigate world geography with hierarchy

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Location Guide"
3. Filter: `Type` = `Location`
4. Group by: `Location Type` (in this order: Continent, Region, City, Town, District, Ward, Building, Wilderness, Dungeon)
5. Sort: Alphabetically
6. Properties to show:
   - Name, Location Type, Parent Location, Child Locations, Status, Player Summary

**Expected Results:**
- **Region:** Agastia Region
- **City:** Agastia
- **District:** Scholar Quarter, Merchant District, Government Complex
- **Town:** Meridian's Rest
- **Wilderness:** Infinite Forest, Ratterdan

---

### 5. 👥 NPCs

**Purpose:** Find NPCs by faction, location, or threat level

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "NPC Directory"
3. Filter: `Type` = `NPC`
4. Group by: `Faction` (or create multiple views: by Faction, by Location, by Threat Level)
5. Sort by: `Threat Level` (descending), then alphabetically
6. Properties to show:
   - Name, Faction, Location, Threat Level, Class, Related Entities, Player Summary, DM Notes (toggle)

**Expected Results:**
- **Decimate Project:** Professor Zero, Decum, Trinity, Octavia, Tetran, Quincy, Hexus, Septimus, Nona (plus Manny & Nikki as PCs)
- **Major NPCs:** Steel Dragon, The Patron
- **Chaos Cult:** (NPCs to be added)
- **Merit Council:** (NPCs to be added)

---

### 6. ⚔️ Factions

**Purpose:** Track faction goals, members, and territories

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Faction Web"
3. Filter: `Type` = `Faction`
4. Sort: Alphabetically
5. Properties to show:
   - Name, Status, Progress Clock, Related Entities, Tags, Player Summary, DM Notes (toggle)

**Expected Results:**
- Chaos Cult
- Merit Council
- The Dispossessed
- Decimate Project

**Sub-view Option:**
Create a second view "Faction Goals" that shows:
- Filter: `Type` = `Goal` AND `Goal Owner` contains faction name
- This shows progress clocks separately

---

### 7. 🔍 Quest Threads

**Purpose:** See cross-entity connections by story arc

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Quest Threads"
3. Filter: `Tags` contains one of:
   - `codex-quest`
   - `ratterdan-mystery`
   - `steel-dragon-arc`
   - `bandit-hunt`
   - `lost-civilization`
4. Group by: `Tags` (shows quest groupings)
5. View as: Board or Gallery
6. Properties to show:
   - Name, Type, Related Entities, Player Summary

**Current Quest Tags to Look For:**
- **#codex** → Manny, Nikki, Professor Zero, The Codex
- **#ratterdan** → Rakash, Ratterdan Ruins, Giant's Axe, Session 1
- **#steel-dragon** → Steel Dragon, Chaos Cult, Merit Council
- **#bandit-hunt** → Kyle/Nameless, Kaelborn, Geist
- **#lost-civilization** → Josh, Underdark, Ancient markings

---

### 8. 📜 Artifacts & Mysteries

**Purpose:** Track important items and unsolved mysteries

**Steps:**
1. `/linked` → "D&D Campaign Entities"
2. Name: "Artifacts & Mysteries"
3. Filter:
   - `Type` = `Artifact` OR
   - `Type` = `Campaign Doc` OR
   - `Tags` contains `mystery` OR `artifact`
4. Sort by: `Status` (Active first)
5. Properties to show:
   - Name, Type, Current Location, Seekers, Related Entities, Player Summary, DM Notes (toggle)

**Expected Results:**
- The Dominion Evolution Codex (Artifact - Campaign Doc)
- Giant's Axe (Artifact - Campaign Doc)
- Josh's markings (Mystery)
- Steel Dragon's reincarnation (Mystery)

---

## Session @today Quick Format

For the "Session @today" section, add this structure manually:

```
## 📅 Session @today

### Session 1 - Caravan to Ratterdan
**Patron:** [Link to The Patron page]
**Quest Goal:** Investigate Ratterdan's destruction, secure/retrieve giant's axe
**Current Location:** [Link to Ratterdan page]

**Active Party Goals This Session:**
- [x] Rakash: Return to destroyed village
- [ ] Find clues about storm giant
- [ ] Investigate giant's axe
- [ ] Each PC gets personal clue

**Key NPCs:**
- [The Patron] - Quest giver
- [Professor Zero] - Via Manny/Nikki
- Potential encounters TBD

**Linked Database:** [Next Session view filtered to Session 1]
```

---

## Advanced: Entity Relations

Once views are set up, go back and add relations between entities:

### Example Relations to Add:

**Manny (PC):**
- Related Entities: Professor Zero, Nikki, Nona, The Codex

**Professor Zero (NPC):**
- Related Entities: All 10 Decimate subjects, The Codex

**Rakash (PC):**
- Related Entities: Kyle, Ratterdan, Storm Giant, Beholder

**Ratterdan (Location):**
- Related Entities: Rakash, Kyle, Giant's Axe, Session 1, Infinite Forest
- Parent Location: Infinite Forest

**The Codex (Artifact):**
- Seekers: Professor Zero, Manny, Nikki
- Related Entities: Decimate Project, Session 1

---

## Verification Checklist

After setup, your landing page should have:
- [  ] 8 linked database views with proper filters
- [  ] Session @today section with current session details
- [  ] All 36 entities visible across various views
- [  ] Entity relations showing connections
- [  ] Player Summary visible, DM Notes in toggles/hidden
- [  ] Progress clocks visible for factions

---

## Next Steps

1. **Manual Setup:** Create the 8 views using the instructions above
2. **Add Relations:** Link related entities together
3. **Customize Views:** Adjust properties, colors, icons as desired
4. **Session Prep:** Before each session, update "Session @today" section

## Need Help?

- See `.config/NOTION_ARCHITECTURE.md` for full schema details
- All entities are in database: 281693f0-c6b4-80be-87c3-f56fef9cc2b9
- Landing page: 281693f0-c6b4-80b8-b3dbfdfb2ea94997
