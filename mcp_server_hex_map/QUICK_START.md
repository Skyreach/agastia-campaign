# Hex Map MCP - Quick Start Guide

## 30-Second Setup

```bash
# 1. Install
cd mcp_server_hex_map && npm install

# 2. Add to Claude config (~/.claude/config.json)
{
  "mcpServers": {
    "hex-map": {
      "command": "node",
      "args": ["/mnt/e/dnd/agastia-campaign/mcp_server_hex_map/index.js"]
    }
  }
}

# 3. Restart Claude Code
```

## Basic Workflow

### 1. Export Map
- Open hex-map-editor
- Click "Save Map Data"
- Save to `maps/my-world.json`

### 2. Load in Claude
```javascript
load_map_data({ file_path: "/path/to/maps/my-world.json" })
```

### 3. Query Terrain
```javascript
query_hex({ hex: "10,5" })
// Returns: terrain type, neighbors, roads, rivers, POIs
```

### 4. Generate Encounter
```
/hex-encounter 10,5
```
→ Analyzes terrain → Presents options → Generates encounter → Saves to POI

### 5. View All POIs
```javascript
list_pois()
// or filter:
list_pois({ type: "encounter" })
```

## Common Patterns

### Finding Good Encounter Locations
```javascript
// Get area summary
get_area_summary({ center_row: 15, center_col: 8, radius: 3 })

// Look for interesting terrain (70% forest = good for bandit camp)
// Query specific hexes in that area
query_hex({ hex: "15,8" })
```

### Planning Travel Routes
```javascript
// Query each hex along route
query_hex({ hex: "10,5", include_neighbors: true })
query_hex({ hex: "10,6", include_neighbors: true })

// Check for roads, rivers, terrain changes
// Place encounters at chokepoints
```

### Building Dungeon Network
```javascript
// Add main dungeon
add_poi({
  hex: "12,7",
  poi: {
    name: "Shadow Keep",
    type: "dungeon",
    description: "Ancient fortress corrupted by chaos",
    encounter_cr: 8
  }
})

// Add related encounters in nearby hexes
add_poi({
  hex: "12,8",
  poi: {
    name: "Shadow Keep Patrols",
    type: "encounter",
    description: "Corrupted guards from the keep",
    encounter_cr: 5,
    notes: "Connected to Shadow Keep quest"
  }
})
```

## Terrain Cheat Sheet

| Terrain | Good For |
|---------|----------|
| Forest | Bandits, druids, wild animals, fey |
| Mountains | Giants, dragons, caves, dwarven ruins |
| Ruins | Undead, cultists, treasure, traps |
| Settlement | NPCs, quests, shops, intrigue |
| Grassland | Merchants, patrols, open battles |
| Corrupted | Aberrations, chaos effects, madness |
| Water | Pirates, aquatic creatures, islands |

## Pro Tips

1. **Use Area Summaries First:** Get terrain distribution before placing encounters
2. **Check Neighbors:** Encounters should make sense with surrounding terrain
3. **Roads = Encounters:** Place bandits/merchants on road hexes
4. **Rivers = Natural Barriers:** Great for chokepoints and bridges
5. **POI Types Matter:** Use correct type for better filtering later

## Troubleshooting One-Liners

```bash
# MCP not loading?
cat ~/.claude/config.json | grep hex-map

# Map file not found?
ls -la /mnt/e/dnd/agastia-campaign/maps/*.json

# Wrong terrain?
# Check: mcp_server_hex_map/README.md → Terrain Types section

# POIs not saving?
ls -la /mnt/e/dnd/agastia-campaign/maps/*_pois.json
```

## Next Steps

- See `README.md` for full API docs
- See `INSTALL.md` for detailed setup
- See `.claude/commands/hex-encounter.md` for command workflow
- Try `/hex-encounter` on different terrain types
