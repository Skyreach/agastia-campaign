# Campaign Tools

This directory contains utility tools for the Agastia D&D campaign.

## Hex Map Editor

A powerful browser-based hex map editor for creating world and regional maps.

### Features
- Multi-scale mapping (24mi/hex world maps, 3mi/hex regional maps)
- Region extraction to zoom into areas
- Faction territories with color coding
- Rivers, roads (multiple types), terrain icons
- Hex numbering and labeling
- Event tracking per hex
- Export as PNG (full DM map or player-friendly)
- Save/load as JSON for persistence

### Quick Start

#### Local Development
```bash
cd hex-map-editor
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

#### Build for Production
```bash
npm run build
```

#### Deploy to GitHub Pages

See [DEPLOYMENT.md](hex-map-editor/DEPLOYMENT.md) for full instructions.

**Quick version:**
1. Enable GitHub Pages in repo settings (Source: GitHub Actions)
2. Push to main branch
3. Tool auto-deploys to `https://<username>.github.io/agastia-campaign/tools/hex-map-editor/`

### Documentation

- [README.md](hex-map-editor/README.md) - Usage guide
- [REFACTORING.md](hex-map-editor/REFACTORING.md) - Architecture documentation
- [DEPLOYMENT.md](hex-map-editor/DEPLOYMENT.md) - GitHub Pages deployment

### Technology

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **HTML Canvas API** - Map rendering
- **Lucide React** - Icons

### Live Demo

Live demo: **https://skyreach.github.io/agastia-campaign/tools/hex-map-editor/**

Repository: https://github.com/Skyreach/agastia-campaign

## Adding New Tools

To add new tools to this directory:

1. Create subdirectory: `tools/<tool-name>/`
2. Add documentation: `tools/<tool-name>/README.md`
3. If web-based, configure for GitHub Pages deployment
4. Update this README with new tool info

## License

MIT - Free to use for your D&D campaigns!
