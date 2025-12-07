# Hex Map MCP - Installation Guide

## Prerequisites

- Node.js installed
- Claude Code CLI configured
- Hex map editor (tools/hex-map-editor) set up

## Step-by-Step Installation

### 1. Install Dependencies

```bash
cd /mnt/e/dnd/agastia-campaign/mcp_server_hex_map
npm install
```

### 2. Test the MCP Server

```bash
# Test that it starts without errors
node index.js
```

You should see: `Hex Map MCP server running on stdio`

Press Ctrl+C to stop.

### 3. Add to Claude Code Config

**Option A: Local Project Config (Recommended)**

Create or edit `.claude/mcp.json` in the project root:

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

**Option B: Global Claude Config**

Edit `~/.claude/config.json`:

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

### 4. Restart Claude Code

```bash
# Exit current Claude Code session
exit

# Start new session in project directory
cd /mnt/e/dnd/agastia-campaign
claude-code
```

### 5. Verify Installation

In Claude Code, check if the MCP is loaded:

```
You should see hex-map MCP tools available:
- load_map_data
- query_hex
- add_poi
- list_pois
- get_area_summary
```

## First Use

### Export a Map from Hex Editor

1. Open the hex-map-editor: `http://localhost:5173` (or deployed version)
2. Create or edit a map
3. Click "Save Map Data" button
4. Save to `/mnt/e/dnd/agastia-campaign/maps/hex-maps-[timestamp].json`

### Load the Map

In Claude Code:

```javascript
load_map_data({
  file_path: "/mnt/e/dnd/agastia-campaign/maps/hex-maps-1234567890.json"
})
```

### Test a Query

```javascript
// Query any hex on your map
query_hex({ hex: "10,5" })
```

## Using the /hex-encounter Command

Once installed, you can use:

```
/hex-encounter 10,5
```

This will:
1. Query the hex terrain
2. Present 3-4 encounter options
3. Generate full details after selection
4. Save to POI layer

## Troubleshooting

### MCP Not Found

- Check the path in config matches actual location
- Verify `index.js` is executable
- Try absolute path instead of relative

### "No map data loaded" Error

- Make sure you've called `load_map_data` first
- Verify the JSON file exists at the path
- Check file permissions

### Wrong Terrain Returned

- The MCP derives terrain from hex icons/factions
- Check the terrain mapping in README.md
- You can manually add POIs with correct terrain context

### NPM Install Fails

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

## Configuration Options

### Custom POI Storage Location

Edit `index.js` if you want POIs stored elsewhere:

```javascript
// Change this line in loadMapData function:
const poisPath = filePath.replace('.json', '_pois.json');

// To:
const poisPath = '/custom/path/pois.json';
```

### Add Custom Terrain Types

Edit the `getTerrainType` function in `index.js`:

```javascript
function getTerrainType(hex) {
  if (!hex) return 'unknown';

  // Add your custom mappings
  if (hex.icon === 'swamp') return 'swamp';
  if (hex.icon === 'desert') return 'desert';

  // ... rest of function
}
```

## Next Steps

1. Export your world map from hex-map-editor
2. Load it into the MCP
3. Try `/hex-encounter` on a few hexes
4. Build up POI collection for your campaign

See README.md for full API documentation.
