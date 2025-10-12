# Notion Database Architecture

## Master Database: "Campaign Entities"

### Core Properties

#### Identity & Classification
- **Name** (Title) - Entity name
- **Type** (Select: PC, NPC, Faction, Location, Session, Artifact, Goal, Campaign Doc)
- **Status** (Select: Active, Planning, Completed, Destroyed, Unknown, Pending)
- **Tags** (Multi-select) - Flexible tagging for search/filtering

#### Content Separation
- **Player Summary** (Rich text) - What players can see/know
- **DM Notes** (Rich text) - Secret info, plans, hidden connections
- **File Path** (Text) - Local markdown file location

#### Version Control
- **Version** (Text) - Semantic versioning (e.g., "1.2.3")
  - **Major (X.0.0)**: Complete overhaul/redesign of entity
  - **Minor (1.X.0)**: New concept/element added
  - **Patch (1.2.X)**: Edits/fixes to existing content

#### Relationships
- **Related Entities** (Relation to self - bidirectional) - Generic connections
- **Parent Location** (Relation to Location type) - Hierarchy support
- **Child Locations** (Relation to Location type) - Reverse hierarchy

### Type-Specific Properties

#### For PCs
- **Player** (Text) - Player name
- **Class** (Text)
- **Level** (Number)

#### For NPCs
- **Faction** (Relation → Faction entities)
- **Location** (Relation → Location entities)
- **Threat Level** (Select: Low, Medium, High, Extreme)

#### For Factions
- **Territory** (Relation → Location entities)
- **Key NPCs** (Relation → NPC entities)

#### For Locations
- **Location Type** (Select: Continent, Region, City, Town, Ward, District, Building, Dungeon, Wilderness, Pocket Dimension)
- **Parent Location** (Relation → Location with higher hierarchy)
- **Child Locations** (Relation → Locations with lower hierarchy)
- **Full Path** (Formula) - Auto-generates "Continent > Region > City > Ward"

#### For Sessions
- **Session Number** (Number)
- **Date Played** (Date)
- **Locations Visited** (Relation → Location entities)
- **NPCs Encountered** (Relation → NPC entities)
- **Goals Advanced** (Relation → Goal entities)

#### For Goals
- **Goal Owner** (Relation → PC or Faction)
- **Goal Status** (Select: Active, Pending, Completed, Failed, Abandoned)
- **Progress Clock** (Text) - "[3/6]" format for tracking
- **Related Entities** (Relation) - Connected PCs, NPCs, Locations, Artifacts

#### For Artifacts
- **Current Location** (Relation → Location or PC/NPC)
- **Seekers** (Relation → PC/NPC/Faction entities)

---

## Location Hierarchy System

### Hierarchy Levels (Top to Bottom)
1. **Continent** - Largest landmass
2. **Region** - Geographic area within continent
3. **City** / **Town** - Major settlement
4. **Ward** / **District** - Neighborhood within city
5. **Building** / **Dungeon** / **Wilderness** - Specific location

### Example Hierarchy
```
Unknown Continent (Continent)
└── Agastia Region (Region)
    ├── Agastia City (City)
    │   ├── Scholar Quarter (Ward)
    │   │   └── Solace of Sterling (Building)
    │   ├── Merchant District (Ward)
    │   │   └── Brightcoin Emergency Supplies (Building)
    │   └── Government Complex (Ward)
    ├── Infinite Forest (Wilderness)
    │   └── Ratterdan Ruins (Destroyed Settlement)
    └── Meridian's Rest (Town)
```

### Location File Structure (Local)
```
/Locations/
  /Continents/
    Unknown_Continent.md
  /Regions/
    Agastia_Region.md
  /Cities/
    Agastia_City.md
    Meridians_Rest.md
  /Districts/
    Scholar_Quarter.md
    Merchant_District.md
  /Buildings/
    Solace_of_Sterling.md
    Brightcoin_Supplies.md
  /Wilderness/
    Infinite_Forest.md
    Ratterdan_Ruins.md
  /Dungeons/
    [Future dungeons]
```

---

## Filtered Database Views

### 1. 📍 Session Hub
**Purpose:** Quick session prep and review
- **Filter:** Type = Session
- **Sort:** Session Number (ascending)
- **Grouped by:** Status (Planning, Active, Completed)
- **Properties shown:**
  - Session Number
  - Date Played
  - Locations Visited (with full path)
  - NPCs Encountered
  - Goals Advanced
  - Player Summary
  - DM Notes

### 2. 🎯 Active Goals Dashboard
**Purpose:** Track all in-flight objectives
- **Filter:** Type = Goal, Goal Status = Active OR Pending
- **Grouped by:** Goal Owner (PC name or Faction)
- **Sort:** Goal Status (Active first), then alphabetically
- **Properties shown:**
  - Goal Owner
  - Progress Clock
  - Related Entities
  - Player Summary
  - DM Notes (for secrets)

### 3. 🗺️ Location Guide
**Purpose:** Navigate world geography and history
- **Filter:** Type = Location
- **Grouped by:** Location Type (hierarchy order)
- **Sort:** Alphabetically within group
- **Properties shown:**
  - Location Type
  - Parent Location (shows full path)
  - Child Locations (sub-locations)
  - Status
  - NPCs at Location
  - Session History (where visited)
  - Player Summary
  - DM Notes

**Sub-view: Location Hierarchy Tree**
- **Gallery or Board view**
- Shows parent-child relationships visually
- Click through to explore regions

### 4. 👥 NPC Directory
**Purpose:** Find NPCs by faction, location, or relationship
- **Filter:** Type = NPC
- **Grouped by:** Faction (primary) or Location (alternate view)
- **Sort:** Threat Level (descending), then alphabetically
- **Properties shown:**
  - Faction
  - Location (with full path)
  - Threat Level
  - Related Entities
  - Player Summary
  - DM Notes (secrets, plans)

### 5. ⚔️ Faction Web
**Purpose:** Track faction goals, members, territory
- **Filter:** Type = Faction
- **Sort:** Alphabetically
- **Properties shown:**
  - Territory (locations)
  - Key NPCs
  - Related Goals (with clocks)
  - Player Summary (public info)
  - DM Notes (true motivations, secrets)

**Sub-view: Faction Goals**
- **Filter:** Type = Goal, Goal Owner = Faction
- Shows all faction progress clocks

### 6. 🎲 Party Tracker
**Purpose:** Quick reference for PC info
- **Filter:** Type = PC
- **Sort:** Player name
- **Properties shown:**
  - Player
  - Class/Level
  - Current Goals (relation)
  - Related Entities (connections)
  - Session Notes (appearances)
  - Player Summary
  - DM Notes (secrets, future hooks)

### 7. 🔍 Quest Threads
**Purpose:** See cross-entity connections by story arc
- **Filter:** All types except Campaign Doc
- **Grouped by:** Tags (quest-related tags)
- **Board view:** Cards show entity type and connections
- **Properties shown:**
  - Type
  - Related Entities
  - Progress (for goals)
  - Player Summary

**Example quest tags:**
- `#codex-quest` - Everything related to Dominion Evolution Codex
- `#ratterdan-mystery` - Giant attack investigation
- `#steel-dragon-arc` - Main campaign threat

### 8. 📜 Artifacts & Mysteries
**Purpose:** Track important items and unsolved mysteries
- **Filter:** Type = Artifact OR tags contains "mystery"
- **Sort:** Status (Active first)
- **Properties shown:**
  - Current Location (with full path)
  - Seekers (who wants it)
  - Related Entities
  - Player Summary (what's known)
  - DM Notes (true nature, hidden properties)

---

## Navigation Examples

### "What happened in Ratterdan?"
1. Open **Location Guide** view
2. Filter/search for "Ratterdan"
3. See:
   - Parent Location: Infinite Forest → Agastia Region
   - Status: Destroyed
   - Related Sessions: Session 1
   - NPCs encountered: [Any NPCs found there]
   - Player Summary: What players know about destruction
   - DM Notes: Beholder hired giant (secret)

### "Are Monomi's older siblings acting as patrons?"
1. Open **NPC Directory** view
2. Group by Faction → "Decimate Project"
3. See all 10 subjects (#1-#10)
4. Check each NPC's relationships and DM Notes
5. See Nona (#9) is protective, not patron
6. See Professor Zero is true patron

### "Which goals are currently active?"
1. Open **Active Goals Dashboard**
2. See grouped by owner:
   - **Manny:** Find Codex [Active], Meet dragon [Pending]
   - **Nikki:** Protect Manny [Active], Master skills [Ongoing]
   - **Rakash:** Investigate Ratterdan [Active], Kill giant [Active]
   - **Kyle:** Hunt bandits [Active]
   - **Josh:** Understand markings [Active]
   - **Chaos Cult:** Artistic Escalation [1/6]
   - **Merit Council:** Order Restoration [1/6]

### "What artifacts are in play?"
1. Open **Artifacts & Mysteries** view
2. See:
   - **Dominion Evolution Codex:** Location unknown, sought by Manny/Nikki/Professor Zero
   - **Giant's Axe:** Ratterdan Ruins, bleeding reality, Patron wants it
   - **Beholder Earring:** Partial, Rakash has it, needs 11 gems

---

## Sync Strategy

### Local → Notion
1. Parse markdown frontmatter for properties
2. Extract Player Summary from `## Description` or `## Overview` sections
3. Extract DM Notes from `## DM Notes` or `## Secrets` sections
4. Build location hierarchy from file path
5. Create bidirectional relations
6. Auto-increment version on changes (patch by default)

### Notion → Local
- Generally one-way (local is source of truth)
- Can pull version numbers for tracking
- Can pull added relations/connections made in Notion

### Version Increment Rules
- **Major bump:** When Type or Name changes, or complete rewrite
- **Minor bump:** New sections added (new NPC relationship, new goal, etc.)
- **Patch bump:** Typo fixes, clarifications, minor edits

---

## MCP Server Requirements

### New Resources to Expose
```typescript
// Existing
campaign://state
campaign://characters
campaign://factions
campaign://decisions
campaign://recent-updates

// NEW
campaign://locations/hierarchy     // Full location tree
campaign://goals/active            // Active goals dashboard
campaign://goals/pending           // Pending goals
campaign://sessions/upcoming       // Next session prep
campaign://sessions/last           // Most recent session
campaign://npcs/by-faction         // NPCs grouped by faction
campaign://npcs/by-location        // NPCs grouped by location
campaign://artifacts               // All artifacts and mysteries
campaign://quest-threads           // Cross-entity quest connections
```

### New Query Capabilities
```typescript
// Location queries
getLocationHierarchy(locationName: string): LocationTree
getLocationPath(locationName: string): string[]  // ["Continent", "Region", "City"]
getLocationsOfType(type: LocationType): Location[]
getChildLocations(parentName: string): Location[]

// Goal queries
getActiveGoals(owner?: string): Goal[]
getGoalsByStatus(status: GoalStatus): Goal[]
getGoalsWithClocks(): Goal[]

// Relationship queries
getRelatedEntities(entityName: string, relationshipType?: string): Entity[]
getEntitiesByTag(tag: string): Entity[]
getQuestThread(questTag: string): Entity[]

// Session queries
getUpcomingSession(): Session
getLastSession(): Session
getSessionsByLocation(locationName: string): Session[]
```

### Frontmatter Schema Updates
```yaml
---
name: Entity Name
type: PC|NPC|Faction|Location|Session|Artifact|Goal|Campaign Doc
status: Active|Planning|Completed|Destroyed|Unknown|Pending
version: "1.2.3"
tags: [tag1, tag2, tag3]

# Location-specific
location_type: Continent|Region|City|Town|Ward|District|Building|Dungeon|Wilderness
parent_location: Parent Location Name
child_locations: [Child 1, Child 2]

# Type-specific
player: Player Name              # For PCs
class: Class Name                # For PCs
level: 2                         # For PCs
faction: Faction Name            # For NPCs
location: Location Name          # For NPCs
threat_level: High               # For NPCs
session_number: 1                # For Sessions
goal_owner: PC or Faction Name   # For Goals
goal_status: Active              # For Goals
progress_clock: "[3/6]"          # For Goals
current_location: Location/PC    # For Artifacts

# Relations (arrays)
related_entities: [Entity1, Entity2]
seekers: [NPC1, Faction1]        # For Artifacts
---

# Entity Name

## Player Summary
What the players know and can see.

## DM Notes
Secret information, hidden motivations, future hooks.

## [Other sections as needed]
```

---

## Implementation Checklist

- [ ] Update sync_notion.py to handle new properties
- [ ] Add location hierarchy parsing
- [ ] Separate Player Summary vs DM Notes sections
- [ ] Implement semantic versioning
- [ ] Create Notion database with all properties
- [ ] Set up all 8 filtered views
- [ ] Update MCP server with new resources
- [ ] Add hierarchy query functions
- [ ] Reorganize local /Locations/ directory
- [ ] Update CLAUDE.md with new navigation patterns
- [ ] Test full sync cycle
- [ ] Document version increment guidelines
