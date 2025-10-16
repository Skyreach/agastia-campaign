# Hex Map Editor - Atomic Design Refactoring

## Overview

The hex map editor has been completely refactored using atomic design principles for better maintainability and code organization.

## Architecture

```
src/
├── components/
│   ├── atoms/              # Basic UI building blocks
│   │   ├── Button.jsx     # Reusable button component
│   │   ├── Input.jsx      # Input and NumberInput components
│   │   ├── Select.jsx     # Dropdown select component
│   │   ├── Divider.jsx    # Visual separator
│   │   └── index.js       # Barrel export
│   │
│   ├── molecules/          # Simple combinations of atoms
│   │   ├── ToolButton.jsx         # Icon tool button
│   │   ├── ZoomControls.jsx       # Zoom in/out/reset
│   │   ├── GridControls.jsx       # Grid dimension inputs
│   │   ├── FactionPalette.jsx     # Faction color selector
│   │   ├── VisibilityToggles.jsx  # Layer visibility toggles
│   │   └── index.js               # Barrel export
│   │
│   ├── organisms/          # Complex feature components
│   │   ├── TopToolbar.jsx     # Top navigation/settings bar
│   │   ├── ToolsToolbar.jsx   # Main tools and actions
│   │   ├── HexCanvas.jsx      # Canvas rendering component
│   │   ├── HexEditModal.jsx   # Hex editing modal
│   │   ├── ExtractModal.jsx   # Region extraction modal
│   │   ├── StatusBar.jsx      # Bottom status display
│   │   └── index.js           # Barrel export
│   │
│   └── templates/          # (Reserved for future layout templates)
│
├── hooks/                  # Custom React hooks
│   ├── useMapState.js      # Map state management
│   └── useCanvasRenderer.js # Canvas rendering logic
│
├── utils/                  # Utility functions
│   ├── hexGeometry.js      # Hex coordinate calculations
│   ├── hexHelpers.js       # Hex creation and manipulation
│   ├── canvasDrawing.js    # Canvas drawing functions
│   ├── mapExport.js        # Export/save/load functions
│   └── regionExtraction.js # Region map creation
│
├── constants/              # Configuration constants
│   ├── icons.js            # Icon definitions
│   ├── factions.js         # Faction colors
│   ├── roads.js            # Road type styles
│   └── mapDefaults.js      # Default map configuration
│
├── HexMapEditor.jsx        # Main component (refactored)
├── HexMapEditor.old.jsx    # Backup of original
├── App.jsx                 # Root component
└── index.css               # Global styles
```

## Benefits

### 1. Separation of Concerns
- **UI components** are separated from **business logic**
- **Drawing functions** are isolated in utilities
- **Configuration** is centralized in constants

### 2. Reusability
- Atomic components can be reused across the app
- Utility functions can be tested independently
- Constants can be modified in one place

### 3. Maintainability
- Smaller, focused files are easier to understand
- Changes to UI don't affect business logic
- Easy to locate and fix bugs

### 4. Testability
- Each component/function has a single responsibility
- Utils and hooks can be unit tested
- Component behavior is predictable

### 5. Scalability
- Easy to add new tools or features
- New components follow established patterns
- Clear structure for new developers

## Component Hierarchy

```
HexMapEditor (Main Component)
├── TopToolbar
│   ├── Button (Upload)
│   ├── Select (Map selector)
│   ├── Input (Map name, icon label)
│   ├── GridControls
│   │   └── NumberInput (cols, rows)
│   └── ZoomControls
│       └── Button (zoom in/out/reset)
│
├── ToolsToolbar
│   ├── ToolButton (icons)
│   ├── TextToolButton (text tools)
│   ├── FactionPalette (when faction tool active)
│   ├── Select (road type)
│   ├── VisibilityToggles
│   │   └── Button (BG, Grid, Icons)
│   └── Button (export, save, load, clear)
│
├── HexCanvas
│   └── canvas (with useCanvasRenderer hook)
│
├── HexEditModal
│   ├── Input (label)
│   ├── textarea (events)
│   └── Button (save, cancel)
│
├── ExtractModal
│   ├── Preview list
│   └── Button (confirm, cancel)
│
└── StatusBar
    └── Status text
```

## Key Utilities

### hexGeometry.js
- `getHexCoords()` - Calculate hex center position
- `getHexVertices()` - Get hex corner points
- `isPointInHex()` - Point-in-polygon test
- `pixelToHex()` - Convert mouse coords to hex grid
- `drawHexagon()` - Draw hex on canvas
- `findClosestEdge()` - Find nearest hex edge
- `calculateHexSize()` - Auto-fit hexes to image

### canvasDrawing.js
- `drawSmoothPaths()` - Render rivers/roads
- `drawHexGrid()` - Render grid overlay
- `drawHex()` - Render individual hex
- `drawRoads()` - Render road network
- `drawCurrentRoad()` - Render road being drawn
- `drawExtractionSelection()` - Render extract area

### mapExport.js
- `exportMapImage()` - Export as PNG
- `saveMapData()` - Save as JSON
- `loadMapData()` - Load from JSON

### regionExtraction.js
- `createRegionalMap()` - Extract region and create new map

## Migration Notes

### From Old to New

**Old approach:**
```jsx
// Everything in one 500+ line component
export default function HexMapEditor() {
  // All state, logic, rendering in one place
  const [everything, setEverything] = useState(...);
  // Inline functions
  // Inline rendering
  // Hard to navigate
}
```

**New approach:**
```jsx
// Clean main component
export default function HexMapEditor() {
  // State management via custom hooks
  const { maps, updateCurrentMap } = useMapState();

  // Clear separation of concerns
  return (
    <div>
      <TopToolbar {...props} />
      <ToolsToolbar {...props} />
      <HexCanvas {...props} />
      <StatusBar {...props} />
    </div>
  );
}
```

### Adding New Features

**Example: Add new icon type**

1. Add to `constants/icons.js`:
```js
export const ICON_TYPES = {
  // ...existing icons
  lake: { icon: Droplet, label: 'Lake', emoji: '💧' }
};
```

2. Import the new icon from lucide-react
3. Tool button automatically appears in toolbar (via Object.entries loop)
4. Drawing logic already handles generic icons

**Example: Add new tool**

1. Add tool button to `ToolsToolbar.jsx`
2. Add handler case to `handleCanvasClick()` in `HexMapEditor.jsx`
3. No need to modify any other files

## Performance

- Canvas rendering optimized with `useCanvasRenderer` hook
- Only re-renders when dependencies change
- Utility functions are pure (no side effects)
- State updates are batched via React

## Future Enhancements

### Potential Improvements
1. **TypeScript migration** - Add type safety
2. **Context API** - Share map state without prop drilling
3. **Undo/Redo** - Command pattern for history
4. **Keyboard shortcuts** - Hotkeys for tools
5. **Component library** - Extract atoms to separate package
6. **Storybook** - Visual component documentation
7. **Unit tests** - Jest + React Testing Library
8. **E2E tests** - Playwright/Cypress

### Template Layer
Currently unused, but reserved for:
- Page layouts
- Modal templates
- Toolbar templates
- Multi-panel layouts

## Developer Guide

### Adding a New Atom
```jsx
// src/components/atoms/NewAtom.jsx
export const NewAtom = ({ prop1, prop2, ...props }) => {
  return <element {...props}>{children}</element>;
};

// Add to src/components/atoms/index.js
export { NewAtom } from './NewAtom';
```

### Adding a New Organism
```jsx
// src/components/organisms/NewOrganism.jsx
import { Atom1, Atom2 } from '../atoms';
import { Molecule1 } from '../molecules';

export const NewOrganism = ({ handlers, state }) => {
  return (
    <div>
      <Molecule1 />
      <Atom1 />
    </div>
  );
};
```

### Adding a Utility Function
```jsx
// src/utils/newUtil.js
/**
 * Description of what this does
 * @param {type} param - Description
 * @returns {type} - Description
 */
export const newUtilFunction = (param) => {
  // Pure function (no side effects)
  return result;
};
```

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Backup

Original monolithic component saved as `HexMapEditor.old.jsx` for reference.

## Summary

The refactoring transforms a 500+ line monolithic component into a clean, modular architecture:

- **20+ small, focused files** instead of 1 massive file
- **Clear separation** of UI, logic, and data
- **Reusable components** following atomic design
- **Easier maintenance** and debugging
- **Better developer experience**
- **Same functionality**, better code quality

All features from the original version are preserved and working.
