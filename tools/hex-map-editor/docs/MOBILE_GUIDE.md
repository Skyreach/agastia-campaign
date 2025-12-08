# Mobile Usage Guide - Hex Map Editor

**Version:** 2.0.0
**Last Updated:** 2025-12-07

This guide covers all mobile-specific features and touch gestures for the Hex Map Editor.

---

## 📱 Mobile Features Overview

The Hex Map Editor is **fully responsive** and optimized for mobile devices, including:

- ✅ Touch-friendly toolbars with 44px minimum touch targets
- ✅ Floating toolbar with bottom sheet menu (mobile)
- ✅ Touch gestures (pinch-to-zoom, double-tap, pan)
- ✅ Mobile-optimized modals (bottom sheets)
- ✅ Adaptive layouts for phone, tablet, and desktop

---

## 🎯 Device Breakpoints

The editor adapts to different screen sizes:

| Device Type | Screen Width | Layout Style |
|-------------|--------------|--------------|
| **Mobile (xs)** | 375px - 639px | Floating toolbar (bottom) |
| **Mobile (sm)** | 640px - 767px | Floating toolbar (bottom) |
| **Tablet (md)** | 768px - 1023px | Collapsible sidebar |
| **Tablet (lg)** | 1024px - 1279px | Collapsible sidebar |
| **Desktop (xl)** | 1280px - 1535px | Fixed sidebar |
| **Desktop (2xl)** | 1536px+ | Fixed sidebar |

---

## 📲 Touch Gestures

### Canvas Interactions

#### **Pinch to Zoom** 🤏
- Use two fingers to pinch in/out on the canvas
- Zoom range: 0.25x (25%) to 5x (500%)
- Smooth, rubberband-constrained zooming

#### **Double Tap to Zoom** 👆
- Quickly tap twice on the canvas
- Toggles between 1x and 2x zoom
- Resets pan offset when zooming out to 1x

#### **Pan When Zoomed** 👉
- When zoomed in (>1x), drag one finger to pan
- Pan is disabled at 1x zoom to prevent accidental movement
- Smooth, bounded panning

#### **Tap to Select** 👆
- Single tap on a hex to select it
- Opens the edit modal for hex properties

### Zoom Controls (Mobile Only)

A floating zoom indicator appears on mobile devices with:
- **Zoom Out (-)** button
- **Current zoom percentage** display
- **Zoom In (+)** button
- **Reset (⊡)** button (appears when zoomed)

Location: Top-right corner, fixed position

---

## 🛠️ Mobile Toolbar

### Phone Layout (< 640px)

**Floating Toolbar:**
- Located at bottom center of screen
- Shows currently selected tool with icon
- Hamburger menu button opens full tool palette
- Tool palette appears as bottom sheet with:
  - Drag handle for visual affordance
  - Grouped tools (Draw, Territory, Edit)
  - 3-column grid layout
  - Large touch targets (48px minimum)

**Selecting Tools:**
1. Tap the hamburger menu (☰) button
2. Bottom sheet slides up with all tools
3. Tap desired tool to select
4. Sheet automatically closes
5. Selected tool icon appears in floating toolbar

### Tablet Layout (768px - 1279px)

**Collapsible Sidebar:**
- Icon-only view by default (collapsed)
- Expand/collapse toggle button at top
- Expanded view shows icons + labels
- Smooth width transition (300ms)

**Using the Sidebar:**
1. Tap the expand button (chevron) to see labels
2. Tap any tool to select it
3. Optionally collapse sidebar to save space

### Desktop Layout (≥ 1280px)

**Fixed Sidebar:**
- Always visible on left side
- Icon-only view with tooltips on hover
- Grouped by category
- No collapse option (plenty of screen space)

---

## 📋 Mobile Modals

### Bottom Sheets vs Dialogs

The editor uses **adaptive modals** that change based on device:

| Device | Modal Style | Features |
|--------|-------------|----------|
| **Mobile** | Bottom Sheet | Slide-up animation, drag handle, full-width |
| **Desktop** | Centered Dialog | Backdrop blur, max-width, shadow |

### Modal Features

**All modals include:**
- ⌨️ Escape key to close
- 🖱️ Click backdrop to close (mobile & desktop)
- 🎯 Auto-focus first input field
- 🚫 Prevents background scrolling
- ✨ Smooth animations (300ms slide-up)

### Hex Edit Modal

**Opens when:** You tap a hex on the canvas

**Mobile behavior:**
- Slides up from bottom
- Touch-friendly 44px input heights
- Full-width text areas
- Large, easy-to-tap buttons

**Fields:**
- **Label:** Name for the hex (e.g., "Dragon's Peak")
- **Events:** What happened here (multi-line textarea)

### Extract Region Modal

**Opens when:** You confirm a region extraction

**Mobile behavior:**
- Scrollable bottom sheet
- Compact hex list preview
- Info cards with rounded corners
- Full-width action buttons

**Content:**
- Region size (hex count)
- Scale information (24mi → 3mi)
- Parent hex preview list
- How-it-works guide

---

## 🎨 Context Panels (Faction/Road Tools)

### Desktop
- Right sidebar panel
- Fixed width (256px)
- Icon close button (top-right)

### Mobile
- Bottom sheet overlay
- Slide-up entrance
- Drag handle at top
- Full-width controls
- Auto-focuses first control

**Triggered by:**
- Selecting **Faction** tool (color palette)
- Selecting **Road** tool (road type selector)

---

## ⚙️ Touch-Optimized Controls

### Minimum Touch Targets

All interactive elements meet **iOS/Android guidelines**:
- **Buttons:** 44px × 44px minimum
- **Inputs:** 44px height minimum
- **Select dropdowns:** 44px height minimum

### Button Sizes

Buttons automatically adapt based on device:

| Size | Desktop | Touch Device |
|------|---------|--------------|
| **sm** | 32px height | 44px height |
| **md** | 40px height | 44px height |
| **lg** | 48px height | 48px height |

All buttons use `size="auto"` which detects touch capability and adjusts accordingly.

---

## 🚀 First-Time User Experience

### Gesture Tutorial

On **first mobile visit**, a tutorial overlay appears showing:

**Gestures Covered:**
1. 🤏 **Pinch to zoom** - Use two fingers to zoom in/out
2. 👆 **Double tap** - Quick zoom to 2x
3. 👉 **Drag to pan** - Pan around when zoomed in

**Dismissing:**
- Tap anywhere on the overlay
- Click "Got it!" button
- Tutorial won't show again (stored in local state)

---

## 💡 Tips & Best Practices

### Mobile Tips

1. **Use Landscape Mode** - More horizontal space for the canvas
2. **Pinch to Zoom** - Faster than using zoom buttons
3. **Double-Tap for Quick Zoom** - Toggle 1x ↔ 2x instantly
4. **Pan While Zoomed** - Explore large maps easily
5. **Close Keyboard** - Tap outside input fields to dismiss keyboard

### Tablet Tips

1. **Expand Sidebar Labels** - See full tool names when learning
2. **Collapse When Done** - Maximize canvas space
3. **Use Split Screen** - Reference notes while mapping

### Performance Tips

1. **Limit Zoom Level** - Stay under 3x for smooth performance
2. **Close Unused Modals** - Free up memory
3. **Save Frequently** - Auto-save runs every 2 seconds

---

## 🔧 Troubleshooting

### Gestures Not Working

**Problem:** Pinch/zoom not responding

**Solutions:**
1. Ensure you're using **two fingers**
2. Check browser supports touch events (modern browsers)
3. Try refreshing the page
4. Disable browser zoom (use app zoom instead)

### Toolbar Not Appearing

**Problem:** Floating toolbar missing on mobile

**Solutions:**
1. Check screen width is < 640px
2. Rotate device to portrait mode
3. Refresh the browser
4. Clear browser cache

### Modal Too Large

**Problem:** Bottom sheet takes up too much screen

**Solutions:**
1. Scroll within the modal (it's scrollable)
2. Rotate to landscape for more space
3. Close modal and zoom out canvas first

### Touch Targets Too Small

**Problem:** Buttons hard to tap

**Solutions:**
1. Ensure screen width is detected correctly
2. Try zooming in browser (last resort)
3. Report issue - minimum size should be 44px

---

## 📊 Browser Compatibility

### Supported Browsers

| Browser | Mobile | Desktop | Touch Gestures | Notes |
|---------|--------|---------|----------------|-------|
| **Chrome** | ✅ | ✅ | ✅ | Recommended |
| **Safari** | ✅ | ✅ | ✅ | iOS 14+ |
| **Firefox** | ✅ | ✅ | ✅ | v90+ |
| **Edge** | ✅ | ✅ | ✅ | Chromium |
| **Samsung Internet** | ✅ | - | ✅ | Android |

### Minimum Requirements

- **iOS:** 14+ (iPhone SE and newer)
- **Android:** 10+ (Chrome 90+)
- **Screen:** 375px width minimum
- **Touch:** Multi-touch capable (2+ simultaneous touches)

---

## 🎓 Advanced Features

### Gesture Library (@use-gesture/react)

The editor uses a professional gesture library for:
- Smooth pinch-to-zoom with rubberband bounds
- Multi-touch gesture recognition
- Unified mouse + touch event handling
- Gesture conflict resolution

### Responsive Hooks

Custom React hooks power the responsive behavior:

- `useBreakpoint()` - Current screen breakpoint
- `useDeviceCapabilities()` - Touch/mouse detection
- `useResponsiveContext()` - Combined responsive state
- `usePinchZoom()` - Canvas zoom/pan gestures
- `useLongPress()` - Long-press detection (future: context menus)

See [CUSTOM_HOOKS.md](./CUSTOM_HOOKS.md) for full API reference.

---

## 📞 Support & Feedback

### Reporting Issues

If you encounter issues on mobile:

1. Note your device (iPhone 14, Pixel 7, etc.)
2. Note your browser (Chrome 120, Safari 17, etc.)
3. Describe the issue with steps to reproduce
4. Include screenshot if possible

### Feature Requests

Mobile features we're considering:
- Swipe-to-dismiss modals
- Haptic feedback on tap
- Offline mode (PWA)
- Apple Pencil support

---

## 🔄 Version History

### v2.0.0 (2025-12-07) - Mobile Responsive Release
- ✅ Fully responsive layouts (375px - 2560px)
- ✅ Touch gesture support (pinch, double-tap, pan)
- ✅ Mobile-optimized modals (bottom sheets)
- ✅ Floating toolbar with tool palette
- ✅ Touch-friendly controls (44px minimum)
- ✅ First-time gesture tutorial

### v1.0.0 (2024-11-30) - Desktop Only
- Desktop-only hex map editor
- Mouse-based interactions
- Fixed sidebar layout

---

## 📚 Related Documentation

- [Mobile Implementation Progress](./MOBILE_IMPLEMENTATION_PROGRESS.md) - Technical implementation details
- [Responsive Architecture](./RESPONSIVE_ARCHITECTURE.md) - Component design system
- [Custom Hooks API](./CUSTOM_HOOKS.md) - Hook reference (coming soon)
- [Main README](../README.md) - General usage guide

---

**Need Help?** Check the main [README](../README.md) or open an issue on GitHub.
