# Point Crawl Navigation Skill

Navigate and describe connected locations using fractal point crawl structure.

## Purpose

Enable immersive, player-driven navigation at all scales (world → city → district → location → interior) by:
- Presenting clear connection options at each node
- Describing the journey between nodes with verisimilitude
- Maintaining spatial consistency through the network

## Philosophy

**Fractal Structure:** Point crawls all the way down
- Meridian's Rest → Agastia (world scale)
- Merchant District → Scholar Quarter (city scale)  
- Job Board → Murder Scene (district scale)
- Dining Room → Kitchen (interior scale)

**Inspired by:** London Underground tube map (Harry Beck design) - nodes connected by paths, creating navigable network

## Data Source

**Master Index:** `Resources/Point_Crawl_Network.md`

Contains all nodes and their connections with:
- Node metadata (name, type, scale, wikilink, Notion ID)
- Parent/child relationships (fractal nesting)
- Connection descriptions (path, distance, landmarks)
- Usage examples

## Skill Modes

### Mode 1: Present Navigation Options (At a Node)

**When:** Players are at a location and need to know where they can go

**Process:**
1. Identify current node in Point_Crawl_Network.md
2. Read all connections from that node
3. Present options in immersive format

**Format:**
> "Standing in [Current Location], do you:
> - [Direction/Description 1] to [Destination 1]?
> - [Direction/Description 2] to [Destination 2]?  
> - [Direction/Description 3] to [Destination 3]?"

**Example from campaign:**
> "Standing in Central Plaza where the Job Board stands, do you:
> - Walk south toward the murder scene (2 blocks, past silk merchant and bakery)?
> - Head west on Market Street to Il Drago Rosso (3 blocks)?
> - Go east toward the docks (4 blocks, descending)?
> - Travel north to Scholar's Gate (5 blocks, ascending)?"

### Mode 2: Describe Journey (Moving Between Nodes)

**When:** Players choose a destination and you need to describe travel

**Process:**
1. Find connection between origin and destination nodes
2. Read "Path Description" for that connection
3. Add landmarks and sensory details from the description
4. Embellish with current conditions (weather, time of day, crowds)

**Example from campaign:**
> "You walk west on Market Street. You pass Shadow's Edge Armory where a blacksmith hammers at an anvil, then a curiosity dealer's window full of strange trinkets, and finally a crowded tavern where laughter spills into the street. Three blocks from the plaza, you spot the red dragon banner hanging above a warm, inviting doorway. Il Drago Rosso."

### Mode 3: Add New Node

**When:** Creating new location that players can navigate to

**Process:**
1. Determine scale (world/city/district/location/interior)
2. Identify parent node (what contains this location?)
3. Check if entity page exists in WIKI_INDEX.md
4. Add node entry to Point_Crawl_Network.md
5. Define connections with path descriptions
6. Update parent node's child list

**Required node format:**
- **Type:** District/Location/etc
- **Scale:** World/City/District/Location/Interior  
- **Wikilink:** [[Entity Name]] or N/A
- **Notion ID:** From WIKI_INDEX or N/A
- **Parent Node:** Name
- **Child Nodes:** List or "Not yet mapped"
- **Connections:** See Point_Crawl_Network.md for format

### Mode 4: Multi-Scale Journey

**When:** Travel crosses multiple scales (e.g., district → city → district)

**Process:**
1. Break journey into segments at each scale transition
2. Describe each segment using connection descriptions  
3. Note transitions between scales (gates, bridges, tier changes)
4. Maintain continuity through the full chain

**Example (Merchant District → Scholar Quarter):**
> "You walk north on Academy Avenue, passing bookbinders as the shops shift toward academic trades. The street narrows and quietens. You climb the worn stone steps of Scholar's Gate, an archway adorned with carved books. Guards in blue robes nod as you pass. You emerge in the Scholar Quarter where the air smells of parchment and ink."

## Usage During Sessions

**Entering New Area:**
1. Describe current node (what players see/hear/smell)
2. Present connection options (Mode 1)
3. Wait for player choice
4. Describe journey (Mode 2)
5. Arrive at new node, repeat

**Player Knows Destination:**
1. "Where do you want to go?"
2. Trace route through Point_Crawl_Network.md
3. Describe full journey chain (Mode 4 if multi-scale)
4. Arrive at destination

**Improvising New Locations:**
1. Player asks about location not yet mapped
2. Add new node to Point_Crawl_Network.md (Mode 3)
3. Define how it connects to existing nodes
4. Describe journey there

## Integration

**With Wikilinks:**
- Nodes with entity pages use [[Entity Name]] format
- Track Notion page ID from WIKI_INDEX.md

**With Taxonomic Hierarchy:**
- City sessions: City → Tier → District → Location  
- Point crawl mirrors this structure
- Parent/child relationships match taxonomy

**With Sessions:**
- Include point crawl context in location descriptions
- Add connection options for each location

## Maintenance

**After each session:**
- Review locations visited
- Add improvised nodes to Point_Crawl_Network.md
- Define connections that were described
- Update wikilinks if new entity pages created

**Before next session:**
- Review likely destinations from quest hooks
- Ensure those nodes have path descriptions
- Add missing connections
- Prepare connection options for key locations
