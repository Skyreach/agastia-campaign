# Custom Hooks API Reference

**Version:** 2.0.0
**Last Updated:** 2025-12-07

Complete API documentation for all custom React hooks in the Hex Map Editor.

---

## Table of Contents

1. [Responsive Hooks](#responsive-hooks)
   - [useBreakpoint](#usebreakpoint)
   - [useMediaQuery](#usemediaquery)
   - [useViewport](#useviewport)
   - [useOrientation](#useorientation)
   - [useDeviceCapabilities](#usedevicecapabilities)
   - [useResponsiveContext](#useresponsivecontext)
2. [Touch Gesture Hooks](#touch-gesture-hooks)
   - [usePinchZoom](#usepinchzoom)
   - [useLongPress](#uselongpress)
   - [useCanvasInteraction](#usecanvasinteraction)

---

## Responsive Hooks

### useBreakpoint

Detects the current responsive breakpoint based on window width.

**Import:**
```javascript
import { useBreakpoint } from '../hooks/useBreakpoint';
```

**Usage:**
```javascript
const breakpoint = useBreakpoint();
// Returns: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

**Return Value:**

| Breakpoint | Screen Width | Typical Device |
|------------|--------------|----------------|
| `'xs'` | 375px - 639px | Small phone |
| `'sm'` | 640px - 767px | Phone landscape |
| `'md'` | 768px - 1023px | Tablet portrait |
| `'lg'` | 1024px - 1279px | Tablet landscape |
| `'xl'` | 1280px - 1535px | Desktop |
| `'2xl'` | 1536px+ | Large desktop |

**Example:**
```javascript
function MyComponent() {
  const breakpoint = useBreakpoint();

  return (
    <div>
      {breakpoint === 'xs' && <MobileView />}
      {breakpoint === 'md' && <TabletView />}
      {['xl', '2xl'].includes(breakpoint) && <DesktopView />}
    </div>
  );
}
```

**Performance:**
- Uses 150ms debounce on window resize
- Returns cached value between debounce intervals
- Automatically cleans up event listeners on unmount

---

### useMediaQuery

Generic media query hook for custom breakpoint logic.

**Import:**
```javascript
import { useMediaQuery } from '../hooks/useMediaQuery';
```

**Usage:**
```javascript
const matches = useMediaQuery('(min-width: 768px)');
// Returns: boolean
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string` | CSS media query string |

**Return Value:** `boolean` - Whether the media query matches

**Examples:**
```javascript
// Check for dark mode
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

// Check for reduced motion
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

// Check for landscape orientation
const isLandscape = useMediaQuery('(orientation: landscape)');

// Check for high DPI screens
const isRetina = useMediaQuery('(min-resolution: 2dppx)');

// Custom breakpoint
const isWideScreen = useMediaQuery('(min-width: 1920px)');
```

**Performance:**
- Listens to media query changes via `matchMedia`
- Automatically updates when query match changes
- Cleans up listeners on unmount

---

### useViewport

Provides current viewport dimensions with debounced resize handling.

**Import:**
```javascript
import { useViewport } from '../hooks/useViewport';
```

**Usage:**
```javascript
const { width, height, aspectRatio, isPortrait, isLandscape } = useViewport();
```

**Return Value:**

```typescript
{
  width: number;           // Viewport width in pixels
  height: number;          // Viewport height in pixels
  aspectRatio: number;     // width / height ratio
  isPortrait: boolean;     // height > width
  isLandscape: boolean;    // width >= height
}
```

**Example:**
```javascript
function Canvas() {
  const { width, height, isPortrait } = useViewport();

  return (
    <canvas
      width={isPortrait ? width : width * 0.7}
      height={height - 100}
    />
  );
}
```

**Performance:**
- 150ms debounce on window resize events
- Caches values between debounce intervals
- SSR-safe (returns 0 on server)

---

### useOrientation

Detects device orientation using Screen Orientation API or viewport dimensions.

**Import:**
```javascript
import { useOrientation } from '../hooks/useOrientation';
```

**Usage:**
```javascript
const { type, isPortrait, isLandscape } = useOrientation();
```

**Return Value:**

```typescript
{
  type: 'portrait' | 'landscape';  // Current orientation
  isPortrait: boolean;             // type === 'portrait'
  isLandscape: boolean;            // type === 'landscape'
}
```

**Example:**
```javascript
function RotatePrompt() {
  const { isPortrait } = useOrientation();

  if (isPortrait) {
    return (
      <div className="rotate-prompt">
        📱 Rotate your device for a better experience
      </div>
    );
  }

  return null;
}
```

**Detection Method:**
1. Tries `window.screen.orientation` API (modern browsers)
2. Falls back to `window.orientation` (older iOS)
3. Falls back to viewport dimensions (width vs height)

---

### useDeviceCapabilities

Detects device input capabilities (touch, mouse, stylus, hover support).

**Import:**
```javascript
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
```

**Usage:**
```javascript
const {
  hasTouch,
  hasMouse,
  maxTouchPoints,
  devicePixelRatio,
  supportsHover,
  colorScheme
} = useDeviceCapabilities();
```

**Return Value:**

```typescript
{
  hasTouch: boolean;           // Touch input available
  hasMouse: boolean;           // Mouse/trackpad available
  maxTouchPoints: number;      // Max simultaneous touches
  devicePixelRatio: number;    // Screen pixel density
  supportsHover: boolean;      // Hover interactions supported
  colorScheme: 'light' | 'dark'; // Preferred color scheme
}
```

**Example:**
```javascript
function Button({ onClick, children }) {
  const { hasTouch, supportsHover } = useDeviceCapabilities();

  return (
    <button
      onClick={onClick}
      className={`
        ${hasTouch ? 'min-h-[44px]' : 'min-h-[32px]'}
        ${supportsHover ? 'hover:bg-blue-600' : ''}
      `}
    >
      {children}
    </button>
  );
}
```

**Use Cases:**
- Adjust touch target sizes
- Conditionally apply hover effects
- Detect high-DPI screens for image quality
- Respect user's color scheme preference

---

### useResponsiveContext

**Recommended:** Composite hook combining all responsive hooks for convenience.

**Import:**
```javascript
import { useResponsiveContext } from '../hooks/useResponsiveContext';
```

**Usage:**
```javascript
const responsive = useResponsiveContext();
```

**Return Value:**

```typescript
{
  // Breakpoint detection
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isMobile: boolean;     // xs or sm
  isTablet: boolean;     // md or lg
  isDesktop: boolean;    // xl or 2xl

  // Device capabilities
  isTouchDevice: boolean;
  hasHover: boolean;
  devicePixelRatio: number;
  colorScheme: 'light' | 'dark';

  // Viewport
  viewport: {
    width: number;
    height: number;
    aspectRatio: number;
    isPortrait: boolean;
    isLandscape: boolean;
  };

  // Orientation
  orientation: {
    type: 'portrait' | 'landscape';
    isPortrait: boolean;
    isLandscape: boolean;
  };

  // Layout helpers
  shouldUseCompactLayout: boolean;  // Mobile or portrait
  shouldUseFloatingToolbar: boolean; // Mobile only
}
```

**Example:**
```javascript
function AdaptiveComponent() {
  const { isMobile, isTouchDevice, viewport } = useResponsiveContext();

  return (
    <div className={isMobile ? 'p-4' : 'p-8'}>
      <Canvas
        width={viewport.width}
        touchEnabled={isTouchDevice}
      />
    </div>
  );
}
```

**Benefits:**
- Single hook import instead of multiple
- Consistent naming across app
- Optimized with shared state
- Type-safe return value

---

## Touch Gesture Hooks

### usePinchZoom

Advanced pinch-to-zoom gesture handling with pan and double-tap support.

**Import:**
```javascript
import { usePinchZoom } from '../hooks/usePinchZoom';
```

**Usage:**
```javascript
const { bind, zoom, offset } = usePinchZoom({
  initialZoom: 1,
  minZoom: 0.25,
  maxZoom: 5,
  onZoomChange: (newZoom) => console.log('Zoom:', newZoom),
  onPanChange: ({ x, y }) => console.log('Pan:', x, y),
  enabled: true
});

// Apply to element
<div {...bind()}>Pinch to zoom!</div>
```

**Parameters:**

```typescript
{
  initialZoom?: number;      // Starting zoom level (default: 1)
  minZoom?: number;          // Minimum zoom (default: 0.25)
  maxZoom?: number;          // Maximum zoom (default: 5)
  onZoomChange?: (zoom: number) => void;  // Zoom change callback
  onPanChange?: (offset: { x: number; y: number }) => void;  // Pan callback
  enabled?: boolean;         // Enable/disable gestures (default: true)
}
```

**Return Value:**

```typescript
{
  bind: () => EventHandlers;  // Gesture event handlers
  zoom: number;                // Current zoom level (ref)
  offset: { x: number; y: number };  // Current pan offset (ref)
}
```

**Supported Gestures:**
- **Pinch:** Two-finger pinch in/out to zoom
- **Double-tap:** Quick toggle between 1x and 2x
- **Drag:** Pan around when zoomed in (>1x)

**Example:**
```javascript
function ZoomableCanvas() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { bind } = usePinchZoom({
    initialZoom: zoom,
    minZoom: 0.5,
    maxZoom: 3,
    onZoomChange: setZoom,
    onPanChange: setPan
  });

  return (
    <div {...bind()} style={{ touchAction: 'none' }}>
      <canvas
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
        }}
      />
    </div>
  );
}
```

**Features:**
- Rubberband bounds (smooth overscroll)
- Pinch origin tracking
- Auto-reset pan when zooming out to 1x
- Prevents pinch-drag conflicts

---

### useLongPress

Detects long-press gestures on touch and mouse devices.

**Import:**
```javascript
import { useLongPress } from '../hooks/useLongPress';
```

**Usage:**
```javascript
const longPressHandlers = useLongPress(
  onLongPress,
  onClick,
  { threshold: 500, shouldPreventDefault: true }
);

<button {...longPressHandlers}>Long press me</button>
```

**Parameters:**

```typescript
useLongPress(
  onLongPress: (event) => void,       // Long-press callback
  onClick?: (event) => void,          // Regular click callback
  options?: {
    threshold?: number;               // Long-press duration (ms, default: 500)
    shouldPreventDefault?: boolean;   // Prevent default touch (default: true)
  }
)
```

**Return Value:**

Event handlers object:
```typescript
{
  onMouseDown: (e) => void;
  onTouchStart: (e) => void;
  onMouseUp: (e) => void;
  onTouchEnd: (e) => void;
  onMouseLeave: (e) => void;
  onTouchCancel: (e) => void;
}
```

**Example:**
```javascript
function ContextMenuButton() {
  const [showMenu, setShowMenu] = useState(false);

  const handlers = useLongPress(
    () => setShowMenu(true),   // Long press: show menu
    () => alert('Clicked!'),    // Regular click: action
    { threshold: 600 }
  );

  return (
    <>
      <button {...handlers}>Press & hold for menu</button>
      {showMenu && <ContextMenu onClose={() => setShowMenu(false)} />}
    </>
  );
}
```

**Use Cases:**
- Context menus on mobile
- Alternative actions on long-press
- Confirm dialogs for destructive actions
- Hidden features (Easter eggs)

---

### useCanvasInteraction

Unified canvas interaction hook combining touch gestures and mouse controls.

**Import:**
```javascript
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
```

**Usage:**
```javascript
const bind = useCanvasInteraction({
  onHexClick: (x, y, event) => console.log('Clicked:', x, y),
  onZoomChange: (zoom) => setZoom(zoom),
  onPanChange: ({ x, y }) => setPan({ x, y }),
  zoom: currentZoom,
  minZoom: 0.25,
  maxZoom: 5,
  panOffset: { x: 0, y: 0 }
});

<canvas {...bind()} />
```

**Parameters:**

```typescript
{
  onHexClick?: (x: number, y: number, event: Event) => void;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (offset: { x: number; y: number }) => void;
  zoom?: number;              // Current zoom level
  minZoom?: number;           // Min zoom (default: 0.25)
  maxZoom?: number;           // Max zoom (default: 5)
  panOffset?: { x: number; y: number };  // Current pan offset
}
```

**Return Value:**

Gesture event handlers (spread onto element).

**Supported Interactions:**

| Interaction | Desktop | Touch | Description |
|-------------|---------|-------|-------------|
| **Click/Tap** | ✅ | ✅ | Select hex |
| **Scroll wheel** | ✅ | ❌ | Zoom in/out |
| **Pinch** | ❌ | ✅ | Zoom in/out |
| **Drag** | ✅ | ✅ | Pan (when zoomed) |
| **Double-tap** | ❌ | ✅ | Quick zoom |

**Example:**
```javascript
function HexCanvas() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const handleHexClick = (x, y, event) => {
    const hex = findHexAtPosition(x, y);
    if (hex) selectHex(hex);
  };

  const bind = useCanvasInteraction({
    onHexClick: handleHexClick,
    onZoomChange: setZoom,
    onPanChange: setPan,
    zoom,
    panOffset: pan
  });

  return (
    <canvas
      {...bind()}
      style={{ touchAction: 'none' }}
      width={800}
      height={600}
    />
  );
}
```

**Features:**
- Automatically detects touch vs mouse device
- Unified zoom handling (pinch on touch, wheel on desktop)
- Pan disabled when zoom = 1x
- Click position accounts for zoom and pan transformations

---

## Best Practices

### Performance

1. **Use useResponsiveContext** instead of multiple individual hooks
2. **Memoize callbacks** passed to gesture hooks
3. **Debounce expensive operations** (already built into hooks)
4. **Set touchAction: 'none'** on gesture-enabled elements

### Accessibility

1. **Provide keyboard alternatives** to touch gestures
2. **Add ARIA labels** to interactive elements
3. **Maintain focus management** in modals
4. **Test with screen readers**

### Mobile Optimization

1. **Use touch-friendly sizes** (44px minimum)
2. **Test on real devices**, not just simulators
3. **Optimize gesture thresholds** based on user feedback
4. **Provide visual feedback** for touch interactions

---

## TypeScript Support

All hooks are fully typed. Import types from the hook files:

```typescript
import { useResponsiveContext } from '../hooks/useResponsiveContext';
import type { ResponsiveContextValue } from '../hooks/useResponsiveContext';

const responsive: ResponsiveContextValue = useResponsiveContext();
```

---

## Browser Support

All hooks support:
- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+ (iOS/macOS)
- ✅ Edge 90+ (Chromium)

Graceful degradation for older browsers (falls back to basic functionality).

---

## Related Documentation

- [Mobile Usage Guide](./MOBILE_GUIDE.md) - User-facing mobile features
- [Responsive Architecture](./RESPONSIVE_ARCHITECTURE.md) - Component design patterns
- [Implementation Progress](./MOBILE_IMPLEMENTATION_PROGRESS.md) - Development timeline

---

**Questions or Issues?** Open an issue on GitHub or check the main [README](../README.md).
