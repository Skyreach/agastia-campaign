# Hex Map Editor

A powerful React-based hex map editor for D&D campaign mapping with multi-scale support, relationship tracking, rivers, roads, and region extraction.

## Features

- **Multi-Scale Maps**: Support for world (24mi/hex) and regional (3mi/hex) maps
- **Region Extraction**: Extract portions of world maps into detailed regional maps
- **Hex Numbering**: Auto-numbering with different ranges for world (#1+) and regional (#10001+) maps
- **Terrain & Icons**: Mountains, forests, villages, cities, dungeons, POIs, and more
- **Rivers & Roads**: Draw smooth rivers along hex edges and roads connecting hex centers
- **Multiple Road Types**: Footpath, trail, road, highway with different styling
- **Hex Labels & Events**: Track what happened where with which NPCs for which players
- **Relationship Tracking**: Associate events and encounters with specific locations
- **Export Options**: Generate map images
- **Save/Load**: JSON-based save system preserves all maps and relationships

## 📱 Mobile Features (NEW!)

**Fully responsive and mobile-optimized!** The editor now works seamlessly on phones, tablets, and desktops.

### Touch Gestures
- 🤏 **Pinch to Zoom**: Use two fingers to zoom in/out (0.25x - 5x)
- 👆 **Double Tap**: Quick toggle between 1x and 2x zoom
- 👉 **Pan**: Drag with one finger when zoomed in
- 📍 **Tap to Select**: Tap any hex to edit its properties

### Adaptive Layouts
- **Phone (< 640px)**: Floating toolbar with bottom sheet menu
- **Tablet (768px - 1279px)**: Collapsible sidebar with expand/collapse
- **Desktop (≥ 1280px)**: Fixed sidebar with full controls

### Mobile-Optimized UI
- ✅ Touch-friendly buttons (44px minimum touch targets)
- ✅ Bottom sheet modals on mobile (slide-up animation)
- ✅ Centered dialog modals on desktop
- ✅ Gesture tutorial overlay on first mobile visit
- ✅ Floating zoom controls (mobile only)

### Browser Support
- Chrome 90+ (mobile & desktop)
- Safari 14+ (iOS & macOS)
- Firefox 90+ (mobile & desktop)
- Edge 90+ (Chromium)

📖 **Full mobile guide:** [docs/MOBILE_GUIDE.md](./docs/MOBILE_GUIDE.md)

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
**https://skyreach.github.io/agastia-campaign/**

GitHub Repository: https://github.com/Skyreach/agastia-campaign

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Basic Workflow

1. **Adjust Grid**: Set hex columns/rows to match your desired map size
2. **Number Hexes**: Click "Number All" to auto-number all hexes
3. **Add Features**: Use toolbar to add icons, labels, rivers, roads
4. **Track Events**: Use Edit tool to add notes about what happened in each hex
5. **Extract Regions**: Select "Extract Region" to create detailed regional maps
6. **Export**: Save map as image
7. **Save Data**: Use "Save" to export all maps as JSON for later

### Tools

- **# (Number)**: Add numbered hex
- **Icons**: Mountain, forest, village, city, castle, dungeon, POI, etc.
- **Edit (📄)**: Edit hex label and events - track what happened here with which NPCs
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
- Hex data (numbers, icons, labels, events)
- Rivers and roads
- Parent-child relationships between maps

## Tips

- Start with world map at 24mi/hex scale
- Use "Number All" to quickly number entire grids
- Extract regions for areas players will explore in detail
- Use the Edit tool to track events: "Party fought bandits here with NPC Marcus"
- Regional maps inherit icons from parent hexes
- Save frequently - JSON includes all work across multiple maps

## License

MIT
