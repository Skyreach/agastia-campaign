# Create 8 Filtered Database Views on Landing Page

## ✅ Prerequisites Complete
- Landing page navigation structure added
- All entities synced with proper types
- Duplicates archived (Status = Inactive)

## 📋 Step-by-Step Instructions

### Before You Start
1. Open the Agastia Campaign landing page: https://www.notion.so/Agastia-Campaign-281693f0c6b480b8b3dbfdfb2ea94997
2. Scroll to the bottom where the navigation placeholders are
3. Have this guide open side-by-side with Notion

---

## View 1: 📅 Session Hub

**Location:** Under "📅 Session Hub" heading

**Steps:**
1. Click below the "📅 Session Hub" heading
2. Type `/linked` and select "Create linked database"
3. Choose "D&D Campaign Entities" database
4. Name the view: "Session Hub"
5. Click "Filter" button → Add filter:
   - Property: **Type**
   - Condition: **is**
   - Value: **Session**
6. Add another filter:
   - Property: **Status**
   - Condition: **is not**
   - Value: **Inactive**
7. Click "Sort" → Add sort:
   - Property: **Session Number**
   - Direction: **Ascending**
8. Show these properties (click "Properties" button):
   - ✅ Name, Type, Status, Session Number, Date Played, Player Summary
   - ❌ Hide: DM Notes (or keep as toggle)

**Expected Result:** Should show Session 0 and Session 1

---

## View 2: 🎭 Party Tracker

**Location:** Under "🎭 Party Tracker" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Party Tracker"
4. Filter:
   - **Type** is **PC**
   - **Status** is not **Inactive**
5. Sort:
   - **Player** (A-Z)
6. Properties to show:
   - ✅ Name, Player, Class, Level, Status, Related Entities, Player Summary
7. Optional: Change view type to "Gallery" for character portraits

**Expected Result:** Should show 5 active PCs

---

## View 3: 🎯 Active Goals Dashboard

**Location:** Under "🎯 Active Goals Dashboard" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Active Goals Dashboard"
4. Filter (use "Or" for these):
   - **Tags** contains **goal** OR
   - **Progress Clock** is not empty
5. Sort:
   - **Goal Status** (Active first)
6. Group by:
   - **Goal Owner** or **Type**
7. Properties:
   - ✅ Name, Goal Owner, Goal Status, Progress Clock, Related Entities, Player Summary, DM Notes (toggle)

**Expected Result:** Should show faction progress clocks and goals

---

## View 4: 🗺️ Location Guide

**Location:** Under "🗺️ Location Guide" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Location Guide"
4. Filter:
   - **Type** is **Location**
   - **Status** is not **Inactive**
5. Group by:
   - **Location Type** (Order: Region, City, Town, District, Wilderness)
6. Sort:
   - Alphabetically (A-Z)
7. Properties:
   - ✅ Name, Location Type, Parent Location, Child Locations, Status, Player Summary

**Expected Result:** Should show 8 locations grouped by type

---

## View 5: 👥 NPC Directory

**Location:** Under "👥 NPC Directory" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "NPC Directory"
4. Filter:
   - **Type** is **NPC**
   - **Status** is not **Inactive**
5. Group by:
   - **Faction** (or create multiple views: by Faction, by Location, by Threat Level)
6. Sort:
   - **Threat Level** (descending), then alphabetically
7. Properties:
   - ✅ Name, Faction, Location, Threat Level, Class, Related Entities, Player Summary
   - 🔒 DM Notes (toggle or hidden)

**Expected Result:** Should show 12 NPCs grouped by faction

---

## View 6: ⚔️ Faction Web

**Location:** Under "⚔️ Faction Web" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Faction Web"
4. Filter:
   - **Type** is **Faction**
   - **Status** is not **Inactive**
5. Sort:
   - Alphabetically (A-Z)
6. Properties:
   - ✅ Name, Status, Progress Clock, Related Entities, Tags, Player Summary
   - 🔒 DM Notes (toggle)

**Expected Result:** Should show 4 factions

**Optional Sub-view:**
Create a second view "Faction Goals" that shows:
- Filter: **Type** is **Goal** AND **Goal Owner** contains faction name
- This shows progress clocks separately

---

## View 7: 🔍 Quest Threads

**Location:** Under "🔍 Quest Threads" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Quest Threads"
4. Filter (use "Or"):
   - **Tags** contains **codex** OR
   - **Tags** contains **ratterdan** OR
   - **Tags** contains **steel-dragon** OR
   - **Tags** contains **bandit** OR
   - **Tags** contains **lost-civilization**
5. Group by:
   - **Tags** (shows quest groupings)
6. View as:
   - **Board** or **Gallery**
7. Properties:
   - ✅ Name, Type, Related Entities, Player Summary

**Expected Result:** Entities grouped by quest tags

---

## View 8: 📜 Artifacts & Mysteries

**Location:** Under "📜 Artifacts & Mysteries" heading

**Steps:**
1. Type `/linked` → "Create linked database"
2. Choose "D&D Campaign Entities"
3. Name: "Artifacts & Mysteries"
4. Filter (use "Or"):
   - **Type** is **Artifact** OR
   - **Type** is **Campaign Mystery** OR
   - **Type** is **Core Document** OR
   - **Tags** contains **mystery** OR
   - **Tags** contains **artifact**
5. Sort:
   - **Status** (Active first)
6. Properties:
   - ✅ Name, Type, Current Location, Seekers, Related Entities, Player Summary
   - 🔒 DM Notes (toggle)

**Expected Result:** Should show The Codex, Giant's Axe, Campaign Overview

---

## ✅ Verification Checklist

After creating all 8 views:

- [ ] Session Hub shows 2 sessions
- [ ] Party Tracker shows 5 active PCs (duplicates hidden)
- [ ] Active Goals Dashboard shows goals/progress clocks
- [ ] Location Guide shows 8 locations grouped by type
- [ ] NPC Directory shows 12 NPCs
- [ ] Faction Web shows 4 factions
- [ ] Quest Threads shows entities grouped by tags
- [ ] Artifacts & Mysteries shows important items

---

## 🎨 Optional Customizations

### Add Icons to Views
1. Click the three dots on each view
2. Select "Customize view"
3. Add emoji icons to match the headings (📅, 🎭, 🎯, etc.)

### Adjust Property Widths
1. Hover over column headers
2. Drag to resize columns
3. Hide less important properties for cleaner view

### Add Colors to Status
1. Click any Status value
2. Choose color for that status
3. Active = Green, Inactive = Gray, etc.

---

## 📖 Next Steps

Once all 8 views are created:
1. Test clicking through entities to verify page content
2. Use filters to find specific entities quickly
3. Add entity relationships (follow `.config/NOTION_LINKING_GUIDE.md`)

---

## 🚨 If You Get Stuck

**View doesn't show expected results:**
- Check filters are set correctly (especially "is not Inactive")
- Verify database ID is correct (should auto-select "D&D Campaign Entities")
- Try clearing and re-adding filters

**Can't find the /linked command:**
- Make sure you're editing the page (not just viewing)
- Type exactly `/linked` and wait for autocomplete
- Alternatively, use the menu: Click "+" → "Linked view of database"

**Property doesn't exist:**
- Check database schema has the property
- Some properties may be type-specific (e.g., "Player" only for PCs)
- Skip properties that don't exist yet
