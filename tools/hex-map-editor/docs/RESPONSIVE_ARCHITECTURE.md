# Hex Map Editor - Responsive Component Architecture

**Date:** 2025-12-07
**Architect:** Component Design Expert Agent
**Status:** Design Complete

## Executive Summary

Comprehensive responsive architecture strategy for transforming the desktop-only hex map editor into a mobile-first, responsive application.

**Stack:** React 19.1.1 + Tailwind CSS 4.1.14 + Vite 7.1.7
**Architecture:** Atomic design (atoms → molecules → organisms)
**Component Count:** 22 JSX components + 3 custom hooks
**Timeline:** 8 weeks (4 phases)

## Current State Analysis

### Component Hierarchy
```
App.jsx
└── HexMapEditor.jsx (Main orchestrator - 551 lines)
    ├── TopBar (organisms/)
    ├── LeftSidebar (organisms/)
    ├── HexCanvas (organisms/)
    ├── RightPanel (organisms/)
    ├── BottomBar (organisms/)
    ├── HexEditModal (organisms/)
    └── ExtractModal (organisms/)
```

### Problems Identified
1. **Layout Rigidity** - Fixed flex layout assumes desktop space
2. **Tool Distribution** - Tools scattered across 4 areas
3. **Canvas Interaction** - Mouse-only, no touch gestures
4. **No Responsive Utilities** - No breakpoint modifiers in use

## Breakpoint Strategy

```javascript
// tailwind.config.js
export default {
  theme: {
    screens: {
      'xs': '375px',   // Small mobile (iPhone SE)
      'sm': '640px',   // Mobile landscape / small tablet
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape / small desktop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
    extend: {
      'touch': { 'raw': '(pointer: coarse)' }, // Touch devices
      'mouse': { 'raw': '(pointer: fine)' },   // Mouse/trackpad
    }
  }
}
```

### Breakpoint Usage by Component

| Component | xs (375px) | sm (640px) | md (768px) | lg (1024px) | xl (1280px) |
|-----------|-----------|-----------|-----------|-------------|-------------  |
| **Layout** | Single column | Single column | Hybrid | 3-column | 3-column |
| **LeftSidebar** | Floating | Floating | Collapsible | Fixed | Fixed |
| **TopBar** | Hamburger | Hamburger | Compact | Full | Full |
| **RightPanel** | Bottom sheet | Bottom sheet | Slide-in | Fixed | Fixed |
| **Canvas** | Full width | Full width | Centered | Centered | Centered |

## Custom Hooks Architecture

### Hook 1: useBreakpoint
```javascript
// hooks/useBreakpoint.js
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};
```

### Hook 2: useMediaQuery
```javascript
// hooks/useMediaQuery.js
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
```

### Hook 3: useViewport
```javascript
// hooks/useViewport.js
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth >= window.innerHeight
  });

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setViewport({
          width,
          height,
          isPortrait: height > width,
          isLandscape: width >= height
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
};
```

### Hook 4: useOrientation
```javascript
// hooks/useOrientation.js
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.screen?.orientation?.type || 'portrait-primary'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation.type);
    };

    window.screen.orientation?.addEventListener('change', handleOrientationChange);
    return () => {
      window.screen.orientation?.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return {
    type: orientation,
    isPortrait: orientation.includes('portrait'),
    isLandscape: orientation.includes('landscape')
  };
};
```

### Hook 5: useDeviceCapabilities
```javascript
// hooks/useDeviceCapabilities.js
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasTouch: false,
    hasMouse: false,
    maxTouchPoints: 0,
    devicePixelRatio: 1,
    supportsHover: false,
  });

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    const dpr = window.devicePixelRatio || 1;
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    setCapabilities({
      hasTouch,
      hasMouse,
      maxTouchPoints: navigator.maxTouchPoints,
      devicePixelRatio: dpr,
      supportsHover,
    });
  }, []);

  return capabilities;
};
```

### Hook 6: useResponsiveContext (Composite)
```javascript
// hooks/useResponsiveContext.js
export const useResponsiveContext = () => {
  const breakpoint = useBreakpoint();
  const viewport = useViewport();
  const orientation = useOrientation();
  const capabilities = useDeviceCapabilities();

  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    viewport,
    orientation,
    capabilities,
    isTouchDevice: capabilities.hasTouch,
    shouldUseCompactLayout: breakpoint === 'xs' || breakpoint === 'sm',
    shouldCollapseSidebar: breakpoint === 'md',
    shouldUseFloatingToolbar: capabilities.hasTouch && (breakpoint === 'xs' || breakpoint === 'sm')
  };
};
```

## Layout System Design

### CSS Grid for Main Layout

**Why Grid over Flexbox?**
- Named grid areas for semantic layout
- Better for non-linear responsive changes
- Easier z-index stacking
- Better gap handling

```jsx
// HexMapEditor.jsx - Responsive Grid Layout
<div className="
  h-screen bg-gray-100
  grid grid-rows-[auto_1fr_auto]
  md:grid-cols-[auto_1fr]
  lg:grid-cols-[80px_1fr_264px]
">
  <header className="md:col-span-2 lg:col-span-3">
    {isMobile ? <MobileHeader /> : <TopBar />}
  </header>

  {!isMobile && (
    <aside className="md:row-start-2">
      <LeftSidebar />
    </aside>
  )}

  <main className="row-start-2 overflow-auto">
    <HexCanvas />
  </main>

  {showRightPanel && (
    <aside className="fixed md:static lg:row-start-2 lg:col-start-3">
      {isMobile ? <BottomSheet /> : <RightPanel />}
    </aside>
  )}

  <footer className="md:col-span-2 lg:col-span-3">
    <BottomBar />
  </footer>
</div>
```

## Touch Interaction Architecture

### Gesture Library: @use-gesture/react

**Installation:**
```bash
npm install @use-gesture/react
```

**Why @use-gesture?**
- Battle-tested (react-spring ecosystem)
- Comprehensive gestures (drag, pinch, wheel)
- Small bundle (~5kb gzipped)
- Excellent TypeScript support

### Touch Hooks

#### usePinchZoom
```javascript
// hooks/usePinchZoom.js
export const usePinchZoom = (elementRef, options = {}) => {
  const { minZoom = 0.5, maxZoom = 5 } = options;
  const [zoom, setZoom] = useState(1);
  const gestureState = useRef({ initialDistance: 0, initialZoom: 1 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        gestureState.current.initialDistance = Math.sqrt(dx * dx + dy * dy);
        gestureState.current.initialZoom = zoom;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = distance / gestureState.current.initialDistance;
        const newZoom = Math.max(minZoom, Math.min(gestureState.current.initialZoom * scale, maxZoom));
        setZoom(newZoom);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [elementRef, zoom, minZoom, maxZoom]);

  return { zoom, setZoom };
};
```

#### useCanvasInteraction
```javascript
// hooks/useCanvasInteraction.js
export const useCanvasInteraction = (canvasRef, currentMap, onHexClick) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { handlers } = useGesture(canvasRef, {
    onTap: ({ x, y }) => {
      const coords = getCanvasCoords(x, y);
      const hex = pixelToHex(coords.x, coords.y, currentMap.hexSize);
      onHexClick?.(hex);
    },
    onDoubleTap: () => setZoom(prev => Math.min(prev * 1.5, 10)),
    onPinch: ({ scale }) => setZoom(prev => Math.max(0.25, Math.min(prev * scale, 10))),
    onPan: ({ dx, dy }) => zoom > 1 && setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }))
  });

  return { handlers, zoom, pan, setZoom };
};
```

## Component Adaptations

### ResponsiveToolbar (replaces LeftSidebar)

**Tool Priority Tiers:**
```javascript
const TOOL_GROUPS = {
  critical: {
    label: 'Essential',
    tools: ['number', 'edit', 'erase'],
    priority: 1
  },
  drawing: {
    label: 'Terrain',
    tools: ['mountain', 'hills', 'forest', 'swamps'],
    priority: 2
  },
  settlements: {
    label: 'Places',
    tools: ['village', 'town', 'city', 'castle'],
    priority: 2
  },
  special: {
    label: 'Special',
    tools: ['dungeon', 'poi', 'contested'],
    priority: 3
  }
};
```

**Mobile: FloatingToolbar**
```jsx
const FloatingToolbar = ({ selectedTool, onToolSelect }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-3 flex items-center gap-2">
        {/* Critical tools always visible */}
        {TOOL_GROUPS.critical.tools.map(tool => (
          <ToolButton key={tool} tool={tool} isActive={selectedTool === tool} />
        ))}

        <div className="w-px h-10 bg-gray-300 mx-2" />

        <button onClick={() => setExpanded(!expanded)} className="touch-target">
          <Menu size={24} />
        </button>
      </div>

      {expanded && (
        <div className="mt-2 bg-white rounded-2xl shadow-2xl p-4">
          {/* All tool groups */}
        </div>
      )}
    </div>
  );
};
```

### ResponsiveModal (base component)

```jsx
export const ResponsiveModal = ({ isOpen, onClose, title, children }) => {
  const { isMobile } = useResponsiveContext();

  if (!isOpen) return null;

  // Mobile: Full-screen
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <header className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    );
  }

  // Desktop: Centered overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
```

## Implementation Phases

### Phase 1: Infrastructure (Weeks 1-2)
**Deliverables:**
- 6 custom hooks
- Updated Tailwind config
- Touch-target utilities

**Tasks:**
1. Create all hooks in `/src/hooks/`
2. Update `tailwind.config.js`
3. Install `@tailwindcss/container-queries`
4. Test hook integration

### Phase 2: Layout Refactor (Weeks 3-4)
**Deliverables:**
- Grid-based responsive layout
- Mobile/tablet/desktop variants
- Updated atomic components

**Tasks:**
1. Refactor `HexMapEditor.jsx` to Grid
2. Create `ResponsiveToolbar.jsx`
3. Create `ResponsiveHeader.jsx`
4. Create `ContextPanel.jsx`
5. Update Button, Input, Select atoms

### Phase 3: Touch Interactions (Weeks 5-6)
**Deliverables:**
- Pinch-zoom canvas
- Touch gesture system
- Mobile-optimized modals

**Tasks:**
1. Install `@use-gesture/react`
2. Create touch hooks
3. Refactor `HexCanvas.jsx`
4. Create `ResponsiveModal.jsx`
5. Refactor existing modals

### Phase 4: Polish (Weeks 7-8)
**Deliverables:**
- Performance optimization
- Accessibility improvements
- Cross-device testing
- Documentation

**Tasks:**
1. Performance audit
2. ARIA labels
3. Device testing
4. Update docs

## Files to Create

### Hooks (Phase 1)
- `src/hooks/useBreakpoint.js`
- `src/hooks/useMediaQuery.js`
- `src/hooks/useViewport.js`
- `src/hooks/useOrientation.js`
- `src/hooks/useDeviceCapabilities.js`
- `src/hooks/useResponsiveContext.js`

### Components (Phase 2-3)
- `src/components/organisms/ResponsiveToolbar.jsx`
- `src/components/organisms/FloatingToolbar.jsx`
- `src/components/organisms/ResponsiveHeader.jsx`
- `src/components/organisms/ContextPanel.jsx`
- `src/components/organisms/ResponsiveModal.jsx`
- `src/components/molecules/TouchZoomIndicator.jsx`

### Touch Hooks (Phase 3)
- `src/hooks/useTouch.js`
- `src/hooks/useGesture.js`
- `src/hooks/usePinchZoom.js`
- `src/hooks/useCanvasInteraction.js`
- `src/hooks/useLongPress.js`

## Success Criteria

### Functionality
- ✅ All features work on mobile
- ✅ Touch targets ≥ 44px
- ✅ Smooth pinch-zoom
- ✅ Responsive at all breakpoints

### Performance
- ✅ Lighthouse mobile > 90
- ✅ 60fps interactions
- ✅ CLS < 0.1

### Accessibility
- ✅ WCAG 2.1 AA
- ✅ Keyboard navigation
- ✅ Screen reader support

---

**Architecture Complete - Ready for Implementation**
