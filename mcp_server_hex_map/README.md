# Hex Map MCP Server

MCP server for querying hex map terrain, analyzing surroundings, and managing points of interest (POIs) for D&D campaigns.

## Features

- **Terrain Analysis:** Query any hex to get terrain type, neighbors, roads, and rivers
- **Neighbor Detection:** Automatically calculate 6 neighboring hexes using axial coordinates
- **POI Management:** Store encounters, dungeons, shops, landmarks per hex
- **Area Summaries:** Get terrain distribution for areas (e.g., "2-hex radius around this location")
- **Smart Terrain Detection:** Derives terrain from hex icons, factions, and labels

## Installation

1. **Install dependencies:**
   ```bash
   cd mcp_server_hex_map
   npm install
   ```

2. **Add to Claude Code config:**

   Edit `~/.claude/config.json` (or your Claude Code MCP config file):

   ```json
   {
     "mcpServers": {
       "hex-map": {
         "command": "node",
         "args": ["/mnt/e/dnd/agastia-campaign/mcp_server_hex_map/index.js"]
       }
     }
   }
   ```

3. **Restart Claude Code** to load the MCP server

## Usage

### 1. Export Map Data

From the hex-map-editor:
1. Click "Save Map Data" button
2. Save as `hex-maps-[timestamp].json`
3. Note the file path

### 2. Load Map Data

```javascript
// In Claude Code, use the MCP tool:
load_map_data({
  file_path: "/mnt/e/dnd/agastia-campaign/maps/hex-maps-1234567890.json"
})
```

### 3. Query Hex Terrain

```javascript
// Query a specific hex
query_hex({
  hex: "10,5",  // or { row: 10, col: 5 }
  include_neighbors: true,
  include_pois: true
})
```

**Returns:**
```json
{
  "hex": {
    "coordinates": { "row": 10, "col": 5 },
    "key": "10,5",
    "number": 1,
    "terrain": "settlement",
    "label": "Agastia City",
    "icon": "castle",
    "faction": "merit_council",
    "events": "Capital of the realm..."
  },
  "neighbors": {
    "N": {
      "coordinates": { "row": 9, "col": 5 },
      "terrain": "forest",
      "hasRiver": false,
      "roadType": "major"
    },
    "NE": { ... },
    // ... 6 neighbors total
  },
  "pois": [
    {
      "id": "poi-123",
      "name": "Blacksmith's Guild",
      "type": "shop",
      "description": "Master craftsman..."
    }
  ]
}
```

### 4. Add Points of Interest

```javascript
add_poi({
  hex: "10,5",
  poi: {
    name: "Bandit Camp",
    type: "encounter",
    description: "A group of bandits led by 'Scarface' Tom",
    encounter_cr: 3,
    loot: "200gp, stolen goods",
    notes: "They're planning to raid the nearby village"
  }
})
```

### 5. Get Area Summary

```javascript
get_area_summary({
  center_row: 10,
  center_col: 5,
  radius: 2  // hexes from center
})
```

**Returns:**
```json
{
  "center": { "row": 10, "col": 5 },
  "radius": 2,
  "hexCount": 19,
  "terrainDistribution": {
    "settlement": 1,
    "forest": 8,
    "grassland": 7,
    "mountains": 3
  },
  "hexes": [ ... ]
}
```

### 6. List All POIs

```javascript
// All POIs
list_pois()

// Filter by type
list_pois({ type: "encounter" })
```

## Terrain Types

The MCP derives terrain from hex data:

| Icon/Faction | Terrain Type |
|--------------|--------------|
| `tree`, `forest` | `forest` |
| `mountain`, `peak` | `mountains` |
| `castle`, `tower` | `settlement` |
| `skull`, `ruins` | `ruins` |
| `cave` | `cave` |
| `water` | `water` |
| `chaos_cult` faction | `corrupted` |
| `merit_council` faction | `civilized` |
| Default | `grassland` |

## POI Types

- `shop` - Merchants, craftsmen, services
- `dungeon` - Multi-room complexes to explore
- `encounter` - Combat or challenge encounters
- `landmark` - Notable locations, no interaction
- `quest` - Quest givers or objectives
- `npc` - Important NPCs to meet
- `other` - Anything else

## Data Storage

- **Map Data:** Loaded from hex-map-editor JSON export
- **POI Data:** Stored in `[mapfile]_pois.json` (auto-created)
- POIs persist across sessions
- Each POI gets unique ID and timestamp

## Slash Command Integration

Use `/hex-encounter [hex]` to generate terrain-appropriate encounters:

```
/hex-encounter 10,5
```

This will:
1. Query the hex and neighbors
2. Analyze terrain distribution
3. Present 3-4 encounter options based on terrain
4. Generate full encounter details after selection
5. Save to POI layer

## Example Workflow

```javascript
// 1. Load your map
load_map_data({ file_path: "/path/to/hex-maps.json" })

// 2. Query a hex
query_hex({ hex: "15,8" })
// Returns: forest terrain, surrounded by more forest and mountains

// 3. Get area context
get_area_summary({ center_row: 15, center_col: 8, radius: 3 })
// Returns: 70% forest, 20% mountains, 10% grassland

// 4. Add encounter based on terrain
add_poi({
  hex: "15,8",
  poi: {
    name: "Owlbear Den",
    type: "encounter",
    description: "An aggressive owlbear protecting its cubs",
    encounter_cr: 4,
    loot: "Owlbear eggs (valuable to collectors)"
  }
})

// 5. Check what's in the area
list_pois({ type: "encounter" })
```

## Technical Details

- **Hex Coordinate System:** Offset coordinates for flat-top hexes
- **Neighbor Calculation:** Handles even/odd row offset correctly
- **River Detection:** Checks edges between hex pairs
- **Road Detection:** Finds roads connecting adjacent hexes in road paths
- **BFS Area Search:** Efficient breadth-first search for area summaries

## Troubleshooting

**"No map data loaded" error:**
- Make sure you've called `load_map_data` first
- Check the file path is absolute and correct

**Wrong neighbors returned:**
- Verify hex coordinate format (row, col)
- Check if using flat-top vs pointy-top hexes (this uses flat-top)

**POIs not persisting:**
- Check write permissions on `*_pois.json` file
- Verify `poisFilePath` is set correctly after loading map

## Future Enhancements

- [ ] Support pointy-top hexes
- [ ] Multi-map support (regions, world maps)
- [ ] POI search by name/description
- [ ] Random encounter table generation per terrain
- [ ] Import/export POI collections
- [ ] Visual POI overlay for hex-map-editor
