---
name: Session 2 - Planning (WIP)
type: Session
session_number: 2
status: Planning
version: "0.2.0"
date: TBD
tags: [session2, wip, player-hints, revelation-system, geist-investigation]
---

# Session 2: Planning (Work In Progress)

**Status:** Designing player hint/clue systems
**Date:** 2025-01-20 (updated 2025-10-18)

---

## Current TODOs

### High Priority
1. **Document Codex design in artifact file** - Define complete artifact mechanics
2. **Create NPC: Mayor of Meridian's Rest** - Session 2 quest giver
3. **Update Session 2 notes with NPCs and hook** - Integrate Thava + Torvin
4. **Design Session 2 payment structure** - Gold, rewards, downtime
5. **Create downtime system for crafting** - Potion/scroll creation rules
6. **Propose Session 2 magical plots** - Fantastic element integration

### Player Hint Systems (In Progress)
7. **Design hints for Nameless: Geist/Kaelborn investigation leads** - 3-3-3-1 web structure (IN PROGRESS)
8. **Design hints for Manny: Codex location clues** - Three Clue Rule application
9. **Design hints for Nikki: Temporal Bloodline leads** - NPC/location discovery
10. **Design hints for Josh: Ancestor/civilization clues** - Elemental marking connections
11. **Design hints for Ian: Storm Giant brigade information** - Revenge arc progression

### Session Structure
12. **Design hunt/defense quest for group income** - Money-making opportunity
13. **Design downtime opportunity in Session 2** - Rest/craft/research time
14. **Design crafting system introduction (potions/scrolls)** - Unlock crafting mechanics
15. **Design 3 indirect quests leading to Keeper's Sanctuary hook** - Main quest setup

---

## Revelation System Implementation

### Three Clue Rule (3-3-3-1 Web Structure)

**Structure:**
- **3 Entry Nodes:** NPCs/hooks that provide initial leads
- **3 Locations:** Each entry node points to one investigation location
- **9 Total Clues:** 3 clues per location (massive redundancy)
- **1 Revelation:** All clues point to same discovery

**Benefits:**
- Multiple entry points (players can start anywhere)
- Non-linear investigation (visit locations in any order)
- Massive redundancy (need only ~3 clues, have 9 available)
- Prevents single-point failure (miss some clues, still succeed)

**MCP Tool:** `generate_revelation` - Automatically generates web structure with variant pools

---

## Kyle/Nameless Investigation: Geist's Safe House

**Revelation:** Geist operates smuggling safe house under cover of Merit Council Trade Inspector position in Agastia dock district

**Key Details:**
- Geist = public figure (Merit Council official)
- Kaelborn = stays in shadows (runs operations)
- Safe house disguised as "confiscated goods warehouse"
- Geist uses position to control dock inspections, protect smuggling

### Entry Nodes (NPCs)

**Entry 1: Harren (Dock Worker)**
- Location: The Rusty Anchor tavern, dock district
- Skill: Persuasion DC 10 (easy - first clue should be accessible)
- Hook: Saw Geist accepting bribes from smugglers
- Leads to: Location 1 (Warehouse District)

**Entry 2: Mira Saltwind (Extorted Merchant)**
- Location: Saltwind Imports, merchant district
- Skill: Investigation DC 13 (moderate - hidden ledger)
- Hook: Pays "protection fees" to "Inspector G"
- Leads to: Location 2 (Merit Council Records)

**Entry 3: Rival Smuggler (TBD Name)**
- Location: Underground informant network / black market
- Skill: Intimidation or Persuasion DC 13
- Hook: Geist used Merit authority to shut down competition
- Leads to: Location 3 (Black Market / Informant Network)

### Investigation Locations

**Location 1: Warehouse District (Pier 7)**
- 3 Clues: Environmental, physical, documentary evidence
- Direct observation of safe house operations
- Geist's thugs moving contraband
- Shipping manifests, schedules

**Location 2: Merit Council Records Office**
- 3 Clues: Documentary evidence of Geist's official position
- Inspection records (suspiciously clean)
- Property records for "confiscated goods storage"
- Bribe payments disguised as fees

**Location 3: Black Market / Informant Network**
- 3 Clues: Social/testimonial evidence
- Multiple witnesses to Geist's criminal operations
- Rumors about safe house location
- Information about Geist's protection racket

### Investigation Paths

```
Path A: Harren → Warehouse → Observe safe house → Revelation
Path B: Mira → Records → Paper trail → Revelation
Path C: Rival → Informants → Testimonial evidence → Revelation
```

**Players only need ~3 clues to discover revelation, but have 9 available across 3 paths.**

### Proactive Backup (If All Clues Missed)

**Combat Option:** Geist's thugs attack party, carrying warehouse key and dock schedules

**Social Option:** Informant seeks out party with urgent warning about Geist's operation

---

## Codex Design (Needs Documentation)

### Current Concept
- **Single artifact** used by good/neutral faction for protection
- **Protects Temporal Bloodline Tribe** (hiding in temporal stasis)
- **Temporal Bloodline protects Brand's people** (in Underdark/stasis)
- **Removal causes explosion** → fragments scatter (fetch quest)

### Open Questions
1. What faction currently uses Codex?
2. Where is Codex located?
3. What are mechanical effects of protection?
4. How does explosion/fragmentation work?
5. What happens to protected groups when removed?

---

## NPCs Created for Session 2

### Torvin Greycask
- **Role:** Rakash's contact in Meridian's Rest
- **Function:** Provides introduction letter to Agastia patron
- **Payment:** 5 gp for letter + basic intel
- **File:** `NPCs/Location_NPCs/NPC_Torvin_Greycask.md`

### Thava Thornscale
- **Role:** Agastia patron (Merit Council - Office of Artifact Preservation)
- **Function:** Hires party for Keeper's Sanctuary mission
- **Payment:** 50 gp upfront, 150 gp completion, lodging covered (200 gp total)
- **Initial Reaction:** Suspicious (rolled 6 on reaction table)
- **File:** `NPCs/Location_NPCs/NPC_Thava_Thornscale.md`

### Pending NPCs
- **Mayor of Meridian's Rest** - Quest giver, local authority
- **Harren (Dock Worker)** - Entry node for Geist investigation
- **Mira Saltwind (Merchant)** - Entry node for Geist investigation
- **Rival Smuggler** - Entry node for Geist investigation

---

## Player Character Corrections Made

### Nikki (PC_Nikki.md)
- **Fixed:** Subject number from #8 to #2
- **Added:** "Seek members of Temporal Bloodline" to active goals
- **Clarified:** She is SEEKING people with temporal ability, not possessing it herself

### Rakash (PC_Ian_Rakash.md)
- **Removed:** Temporal powers from giant's axe (was incorrect assumption)
- **Simplified:** Axe is just a giant weapon, no magical properties (yet)

### Brand/Josh (PC_Josh.md)
- **Added:** Elemental nature (thunder/lightning) to demonic markings
- **Removed:** Any temporal magic associations
- **Clarified:** Markings react to elemental magic, storms, electrical phenomena

---

## Faction Updates

### Geist & Kaelborn's Bandit Network
- **Geist:** Now public figure with Merit Council position (Trade Inspector)
- **Operating Method:** Uses official authority to protect criminal operations
- **Safe House:** Disguised as legitimate "confiscated goods warehouse"
- **Kyle's Arc:** Must find evidence to overcome Merit Council protection

---

## Session 2 Structure (Placeholder)

### Arrival in Agastia
- Meet Thava Thornscale (patron)
- Receive Keeper's Sanctuary mission
- Lodging at The Scholar's Rest inn

### Player Hint Distribution
- **Kyle:** Rumors about Geist (entry nodes available)
- **Manny/Nikki:** Codex-related clues (TBD)
- **Josh:** Civilization hints (TBD)
- **Ian:** Storm Giant information (TBD)

### Main Quest: Keeper's Sanctuary
- (Details pending - awaits quest design)

### Side Opportunities
- Hunt/defense quest for income
- Downtime for crafting
- Investigation opportunities for each PC

---

## Technical Notes

### MCP Tools Used
- `generate_npc` - Created Torvin and Thava with modular system
- `generate_revelation` - (In testing) 3-3-3-1 web structure for clue systems
- `roll_reaction` - Generated Thava's initial suspicious attitude

### File Watcher Status
- Active and syncing to Notion
- All entity changes automatically synced
- Pre-commit hooks enforce format validation

---

**Version History:**
- 2025-01-20: Initial brainstorming session, 6 campaign fronts proposed
- 2025-10-18: Pivoted to player hint systems, 3-3-3-1 revelation structure, Geist investigation design
