# Session TODO List
Last updated: 2025-11-30 19:45

## 🚨 Active Tasks

### In Progress
- [ ] [16:50] Add ability to delete regional maps
  - Context: No way to remove regional map if user makes mistake in selection
  - Priority: MEDIUM - need UI button + handler
  - Files: TopToolbar.jsx (map selector), useMapState.js (delete function)

### Pending (Priority Order - Easiest First)

5. [ ] [16:50] Improve header UX - declutter tools
   - Context: Header tools are super cluttered making it hard to use
   - Priority: MEDIUM - need to reorganize/collapse sections
   - Files: Header/toolbar component

7. [ ] [16:50] Add auto-save to JSON with DB tracking
   - Context: Should auto-save as events added, track all populated elements in DB
   - Priority: HARD - significant feature addition
   - Files: New feature - persistence layer

## ✅ Completed Tasks
- [x] [16:50 → 19:45] Fix click positioning - marked cell way off from click location
  - Context: Click handler only accounted for zoom, not display scale (baseScale)
  - Fixed by calculating scale ratio between canvas.width and rect.width
  - Files: HexMapEditor.jsx:139-147
  - Clicks now correctly map to internal canvas coordinates

- [x] [16:50 → 18:45] Fix duplicate/identical icons for terrain types
  - Context: Mountains/hills, forest/swamps, village/town, city/castle used same icons
  - Assigned unique Lucide icons: Waves (hills), Droplets (swamps), Building (town), Building2 (city)
  - Files: constants/icons.js
  - All terrain types now visually distinct

- [x] [16:50 → 18:40] Fix numbering button - doesn't work anymore
  - Context: Button was clearing ALL hex data (icons, labels, events) when toggling off
  - Fixed to only clear number field while preserving all other hex data
  - Files: HexMapEditor.jsx:106-137
  - Now correctly toggles numbers on/off without data loss

- [x] [16:50 → 17:04] Fix viewport size - map shows tiny despite large monitor
  - Context: Removed max-width: 1280px from App.css (Vite boilerplate)
  - Removed Math.min(..., 1) cap in useCanvasRenderer.js to allow full viewport usage
  - Files: App.css, hooks/useCanvasRenderer.js
  - Now canvas can use full 3425x1285 available space

- [x] [16:43 → 16:47] Fixed GitHub Pages deployment URL documentation
  - Context: Documentation showed wrong URL (tools/hex-map-editor/ instead of root)
  - Files: tools/README.md, tools/hex-map-editor/README.md, tools/hex-map-editor/DEPLOYMENT.md
  - Correct URL: https://skyreach.github.io/agastia-campaign/

## 📋 Future Topics (Not Started Yet)
(none yet)
