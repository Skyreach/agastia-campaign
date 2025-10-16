# Hex Map Editor

A powerful React-based hex map editor for D&D campaign mapping with multi-scale support, faction territories, rivers, roads, and region extraction.

## Features

- **Multi-Scale Maps**: Support for world (24mi/hex) and regional (3mi/hex) maps
- **Region Extraction**: Extract portions of world maps into detailed regional maps
- **Hex Numbering**: Auto-numbering with different ranges for world (#1+) and regional (#10001+) maps
- **Terrain & Icons**: Mountains, forests, villages, cities, dungeons, POIs, and more
- **Faction Territories**: Paint hexes with faction colors
- **Rivers & Roads**: Draw smooth rivers along hex edges and roads connecting hex centers
- **Multiple Road Types**: Footpath, trail, road, highway with different styling
- **Hex Labels & Events**: Add names and notes to individual hexes
- **Export Options**: Generate full DM maps or player-friendly maps without background
- **Save/Load**: JSON-based save system preserves all maps and relationships

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

## Live Demo

Access the deployed version at:
**https://skyreach.github.io/agastia-campaign/tools/hex-map-editor/**

GitHub Repository: https://github.com/Skyreach/agastia-campaign

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Basic Workflow

1. **Upload Map Image**: Click "Upload Map" to load your background map
2. **Adjust Grid**: Set hex columns/rows to match your desired grid
3. **Number Hexes**: Click "Number All" to auto-number all hexes
4. **Add Features**: Use toolbar to add icons, labels, rivers, roads, factions
5. **Extract Regions**: Select "Extract Region" to create detailed regional maps
6. **Export**: Save as full map (with background) or player map (grid only)
7. **Save Data**: Use "Save" to export all maps as JSON for later

### Tools

- **# (Number)**: Add numbered hex
- **Icons**: Mountain, forest, village, city, castle, dungeon, POI, etc.
- **Edit (📄)**: Edit hex label and events
- **Faction**: Paint hex with faction territory color
- **River**: Click hex edges to draw rivers
- **Road**: Click hex centers to draw roads (click last hex twice to finish)
- **Erase**: Remove hex data

### Region Extraction

1. Click "Extract Region" button
2. Click first corner of area to extract
3. Click opposite corner
4. Review preview and click "Create Regional Map"
5. New regional map appears in dropdown with 8x subdivision (24mi → 3mi)

### Map Management

- **Map Dropdown**: Switch between world and regional maps
- **Map Name**: Rename maps for organization
- **Zoom Controls**: Zoom in/out for detail work
- **Toggle Visibility**: Show/hide background, grid, or icons

### Keyboard Tips

- Type label in "Icon Label" field BEFORE placing icon to auto-attach label
- Use number inputs in grid section to quickly resize grid
- Zoom controls help with precise placement on large maps

## Data Format

Saved JSON includes:
- All maps (world + regional)
- Hex data (numbers, icons, labels, events, factions)
- Rivers and roads
- Background images (as data URLs)
- Parent-child relationships between maps

## Tips

- Start with world map at 24mi/hex scale
- Use "Number All" to quickly number entire grids
- Extract regions for areas players will explore in detail
- Regional maps inherit faction territories and icons from parent hexes
- Save frequently - JSON includes all work across multiple maps

## License

MIT
