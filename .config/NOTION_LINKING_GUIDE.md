# Notion Page-to-Page Linking Guide

## ✅ Safe Landing Page Complete

The Agastia Campaign landing page now has navigation placeholders for all 8 filtered views.

---

## 🔗 Adding Manual Page-to-Page Links

### Step 1: Link Database Entries Together

**Goal:** Create bidirectional relationships between entities in the database.

#### Example: Manny → Professor Zero → The Codex

1. Open **Manny's database entry** in Notion
2. Find the "Related Entities" property
3. Click to add relation → Search "Professor Zero" → Select
4. Also add: Nikki, Nona, The Codex
5. Save

Now do the same for Professor Zero:
1. Open **Professor Zero's database entry**
2. Add to "Related Entities": All 10 Decimate subjects, The Codex
3. Save

The relation is **bidirectional** - adding Manny to Professor Zero's relations will automatically add Professor Zero to Manny's relations.

---

### Step 2: Link Locations with Parent-Child Hierarchy

#### Example: Agastia Region → Agastia City → Scholar Quarter

1. Open **Agastia City** database entry
2. Set "Parent Location" property → Select "Agastia Region"
3. Save

4. Open **Scholar Quarter** database entry
5. Set "Parent Location" property → Select "Agastia"
6. Save

7. Go back to **Agastia** database entry
8. Check "Child Locations" - should now show "Scholar Quarter" automatically (bidirectional)

---

### Step 3: Add Faction and Location Relations for NPCs

#### Example: Professor Zero → Decimate Project → Agastia

1. Open **Professor Zero** database entry
2. Set "Faction" property → Select "Decimate Project"
3. Set "Location" property → Select "Agastia" (or specific location like "Scholar Quarter")
4. Save

Do this for all NPCs:
- **Steel Dragon** → Chaos Cult → Unknown
- **The Patron** → (to be determined) → Agastia
- All Decimate NPCs → Decimate Project → Agastia

---

### Step 4: Link Artifacts to Seekers

#### Example: The Codex → Professor Zero, Manny, Nikki

1. Open **The Codex** database entry
2. Find "Seekers" property
3. Add relations: Professor Zero, Manny, Nikki
4. Set "Current Location" → Select a location entity
5. Save

Do the same for:
- **Giant's Axe** → Seekers: Rakash, (anyone interested) → Current Location: Ratterdan

---

### Step 5: Create Session → Entity Links

#### Example: Session 1 → Rakash, Ratterdan, Giant's Axe

1. Open **Session 1** database entry
2. Add to "Related Entities": Rakash, Ratterdan, Giant's Axe, The Patron, Kyle
3. Save

This creates quick navigation from sessions to relevant entities.

---

## 📊 Verification Checklist

After completing manual links, verify:

- [ ] All PCs have "Related Entities" filled in
- [ ] All NPCs have "Faction" and "Location" set
- [ ] All locations have parent-child relationships where applicable
- [ ] Artifacts have "Seekers" and "Current Location" set
- [ ] Sessions link to relevant entities
- [ ] Factions show "Related Entities" for their members

---

## 🎯 Quick Reference: Key Relationships to Create

### PCs → Related Entities
- **Manny** → Professor Zero, Nikki, Nona, The Codex
- **Nikki** → Professor Zero, Manny, Nona, The Codex
- **Rakash** → Kyle, Ratterdan, Giant's Axe, Beholder (mystery)
- **Kyle** → Rakash, Ratterdan, Kaelborn, Geist
- **Josh** → (to be determined based on character development)

### NPCs → Faction + Location
- **Professor Zero** → Decimate Project + Agastia
- **Steel Dragon** → Chaos Cult + Unknown
- **The Patron** → (TBD) + Agastia
- All **Decimate subjects** → Decimate Project + Agastia

### Locations → Hierarchy
- **Agastia Region** (top level)
  - **Agastia** (city)
    - Scholar Quarter (district)
    - Merchant District (district)
    - Government Complex (district)
  - **Meridian's Rest** (town)
  - **Infinite Forest** (wilderness)
    - Ratterdan (ruins)

### Artifacts → Seekers
- **The Codex** → Professor Zero, Manny, Nikki
- **Giant's Axe** → Rakash, (others TBD)

### Sessions → Entities
- **Session 0** → All 5 PCs, Professor Zero, The Patron
- **Session 1** → Rakash, Kyle, Ratterdan, Giant's Axe, The Patron

---

## 🚨 Safety Reminder

- All linking is done **in the database properties**, not by editing page content
- These operations are **100% safe** - they only create relations, no deletions
- You can always undo relations by clicking the X next to a linked entity
- Bidirectional relations update both entries automatically

---

## 📖 Next Step After Linking

Once all manual links are complete:
1. Return to Agastia Campaign landing page
2. Create the 8 linked database views using `/linked` command
3. Apply filters as specified in `.config/NOTION_SETUP_GUIDE.md`
4. Test navigation between pages via relations

---

## Need Help?

If any entities are missing from the database:
1. Run `.config/safe_resync_all.sh` to re-sync all entities
2. Check that markdown files have proper YAML frontmatter
3. Verify entities appear in database before linking
