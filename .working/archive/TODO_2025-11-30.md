# Session TODO List
Last updated: 2025-11-30 22:30

## 🚨 Active Tasks

### Quick Wins (Do First)
1. [ ] Add hotkeys: + (zoom in), - (zoom out)
   - Files: HexMapEditor.jsx (add keyboard event listener)
   - Simple useEffect with window.addEventListener

2. [ ] Increase zoom limit from 300% to 1000%
   - Files: HexMapEditor.jsx (change Math.min(3, ...) to Math.min(10, ...))
   - One-line change

### Auto-Save Architecture (Phased Implementation)

**Design Complete:** Sub-agent provided full specification (see below)

**Phase 1: Storage Infrastructure** (~30 min)
- [ ] Install `idb` package for IndexedDB
- [ ] Create storage manager with save/load functions
- [ ] Test with existing 2-tier hierarchy
- Files: New `utils/storage/storageManager.js`

**Phase 2: Coordinate System** (~45 min)
- [ ] Implement parent↔child coordinate translation (8x subdivision)
- [ ] Add geometric hex containment checking
- Files: New `utils/coordinateTranslation.js`

**Phase 3: Zone Scale Support** (~30 min)
- [ ] Add zone scale (0.375mi) to constants
- [ ] Update UI for 3-level hierarchy
- Files: `constants/mapDefaults.js`, UI components

**Phase 4: Inheritance System** (~1 hour)
- [ ] Implement overlap detection between regions
- [ ] Build data merging algorithm (newest wins)
- [ ] Add inheritance tracking to hex schema
- Files: New `utils/regionInheritance.js`

**Phase 5: Auto-Save Implementation** (~45 min)
- [ ] Create auto-save hook with 2s debounce
- [ ] Add save status indicator to UI
- [ ] Implement beforeunload handler
- Files: New `hooks/useAutoSave.js`

**Phase 6: Loading Strategy** (~30 min)
- [ ] Update startup flow with crash recovery
- [ ] Add child region loading UI
- Files: `HexMapEditor.jsx`, new `MapSelector.jsx`

**Phase 7: Edge Cases & Polish** (~1 hour)
- [ ] Override tracking (user edits vs inherited data)
- [ ] Storage quota monitoring
- [ ] Image compression for large maps
- Files: Various utilities

**TOTAL ESTIMATED TIME: ~4.5 hours for full auto-save system**

## 📋 Auto-Save Design Summary

**3-Tier Hierarchy:**
```
World (24mi/hex)
  └─ Region (3mi/hex) ← 8x subdivision = 64 hexes per world hex
      └─ Zone (0.375mi/hex) ← 8x subdivision = 64 hexes per region hex
```

**Key Features:**
- **Inheritance:** New regions auto-populate from overlapping regions
- **Coordinate Translation:** Precise mapping between scales
- **Storage:** IndexedDB (primary) + localStorage (crash recovery) + JSON export
- **Auto-save:** 2s debounced, saves on every hex edit
- **Merging:** Newest data wins when regions overlap

**Data Flow Example:**
1. User creates Region B that includes islands from Region A
2. System detects overlap (Region A covers 40% of Region B area)
3. Region B inherits island data from Region A automatically
4. User can override inherited data (tracked with `overridden` flag)
5. Auto-saves to IndexedDB every 2s after edits

## ✅ Completed Tasks
- [x] [16:50 → 21:15] Improve header UX - Professional sidebar layout
- [x] [16:50 → 20:50] Add delete regional maps feature
- [x] [16:50 → 19:45] Fix click positioning bug
- [x] [16:50 → 18:45] Fix duplicate icons
- [x] [16:50 → 18:40] Fix numbering button
- [x] [16:50 → 17:04] Fix viewport size
- [x] [16:43 → 16:47] Fix deployment URL docs

## 🤔 Decision Point

**Do you want to proceed with auto-save implementation?**
- Full implementation = ~4.5 hours
- Can do phases incrementally
- Or defer to future session?

Quick wins (hotkeys + zoom limit) can be done in 5 minutes while you decide.
