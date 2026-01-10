# Content Linker Skill

**Purpose:** Search repository for content by name/context, suggest wikilinks, and report orphaned references.

**Use Case:** When you have a reference like "Dead Smuggler" or "Nikki's family restaurant" and need to find if content exists for it.

## When to Use

- During session file audits (with audit-session-links skill)
- When creating new content (to avoid duplicates)
- When user asks "does content exist for X?"
- Before creating new encounters/quests/NPCs

## Search Strategy

### 1. Exact Name Search

Search for exact matches in file names and content:

```bash
# Search file names
find Encounters/ Quests/ NPCs/ Locations/ PointCrawls/ -iname "*Dead_Smuggler*"

# Search file content
grep -ri "Dead Smuggler" Encounters/ Quests/ NPCs/ Locations/
```

### 2. Contextual Search

If exact match fails, search for related terms:

```bash
# Example: "Nikki's family restaurant"
# Search for: Nikki, restaurant, family, Il Drago Rosso

grep -ri "Nikki" Quests/ | grep -i "family\|restaurant"
grep -ri "Il Drago Rosso" Quests/ NPCs/
```

### 3. Entity Database Lookup

Check if entity exists in entity_database.json:

```bash
grep -i "entity_name" .config/entity_database.json
```

## Output Format

### When Content Found

```markdown
## Content Linker Results

**Query:** "Dead Smuggler"

### Matches Found: 2

1. **Sessions/Session_3_The_Steel_Dragon_Begins.md:73**
   - Context: "The Dead Smuggler:" (heading)
   - Type: Session content
   - Wikilink: Already in session file, but not an encounter file

2. **Sessions/Session_3_The_Steel_Dragon_Begins.md:75**
   - Context: "A dead smuggler lies nearby, his body bearing strange shadow burns"
   - Type: Encounter description
   - Status: Embedded in session, no standalone file

### Recommendations

❌ **No standalone encounter file exists**

**Action Required:**
1. Create Encounter_Dead_Smuggler.md with:
   - Description from Session 3 (lines 73-85)
   - Investigation DCs
   - Clues and connections
   - Link to [[Geist Investigation]]

2. Update Session 3 line 48:
   - Current: `**Dead Smuggler:** Victim at crate scene`
   - Fixed: `**Dead Smuggler:** [[Encounter: Starfall Anchor Crate]] - victim provides hook to [[Geist Investigation]]`

**Use:** workflow-enforcer to create encounter file
```

### When Content Not Found

```markdown
## Content Linker Results

**Query:** "Nikki's family threat quest"

### Matches Found: 0

**No files found matching:**
- Quest_Nikki*.md
- Quest_Family*.md
- *Nikki*Family*.md

### Related Content Found: 3

1. **NPCs/Player_Character_NPCs/NPC_Nikki.md**
   - Contains: Nikki character info
   - Missing: No quest info on this page

2. **Locations/Agastia_Districts/Location_Merchant_District.md**
   - Contains: Il Drago Rosso restaurant mention
   - Missing: No quest details

3. **Sessions/Session_3_The_Steel_Dragon_Begins.md:226**
   - Contains: "[[Il Drago Rosso]]** - [[Nikki]]'s Family Restaurant**"
   - Missing: No quest link

### Recommendations

❌ **Quest file does not exist**

**Action Required:**
1. Create Quest_Nikki_Family_Threat.md with:
   - Threat description (aggressive faction)
   - Connection to Il Drago Rosso
   - Investigation/resolution paths
   - NPCs involved: [[Nikki]], faction leader
   - Location: [[Merchant District]], [[Il Drago Rosso]]

2. Update Session 3 line 226:
   - Current: `**[[Il Drago Rosso]]:** [[Nikki]]'s family restaurant`
   - Fixed: `**[[Il Drago Rosso]]:** [[Nikki]]'s family restaurant, threatened by [[Quest: Family Protection]]`

3. Update NPC_Nikki.md to link to new quest

**Use:** workflow-enforcer to create quest file
```

## Search Directories

**Priority order:**

1. **Encounters/** - For combat encounters, investigation scenes
2. **Quests/** - For ongoing storylines, investigations
3. **NPCs/** - For character interactions
4. **Locations/** - For places, buildings, districts
5. **PointCrawls/** - For navigation and exploration content
6. **Sessions/** - For session-specific content (check if should be extracted)

## Common Search Patterns

### Pattern 1: NPC Reference

**Input:** "Corvin Tradewise"

**Search:**
```bash
# Check NPC file
find NPCs/ -iname "*Corvin*"

# Check if involved in quests
grep -ri "Corvin" Quests/

# Check if in encounters
grep -ri "Corvin" Encounters/
```

**Report:**
- NPC file exists: ✅
- Quest involvement: ❌ No quest files mention Corvin
- Encounter involvement: ❌ No encounter files
- **Action:** Create quest or encounter involving Corvin

### Pattern 2: Location Reference

**Input:** "Murder scene alleyway"

**Search:**
```bash
# Check location files
find Locations/ -iname "*Murder*" -o -iname "*Alley*"

# Check encounters
find Encounters/ -iname "*Murder*" -o -iname "*Steel_Dragon*"

# Check quests
grep -ri "murder scene" Quests/
```

**Report:**
- Location file: ❌ Not found
- Encounter file: ❌ Not found
- Quest file: Check Quest_Steel_Dragon*.md
- **Action:** Create Encounter_Murder_Scene.md or Quest_Steel_Dragon_Investigation.md

### Pattern 3: Vague Reference

**Input:** "Player Choice Encounter"

**Search:**
```bash
# Too vague - search context
# Check session file for what section this is in

# If in "Day 2" section, search for Day 2 encounters
grep -ri "Day 2" Encounters/

# Check for point-crawl files
ls -1 PointCrawls/
```

**Report:**
- Encounter files: Multiple found (list them)
- Point-crawl files: Found PointCrawl_Temperate_Forest.md
- **Action:** Replace vague reference with specific encounter list or point-crawl link

## Integration Examples

### Example 1: Used with audit-session-links

```
# audit-session-links finds orphan
Orphan: **Dead Smuggler:** Victim at crate scene

# Use content-linker to search
Use content-linker: "Dead Smuggler"

# Result: No encounter file found
# Create encounter using workflow-enforcer
# Add wikilink to session file
```

### Example 2: Before creating new content

```
# User wants to create new quest
User: "Create a quest for Nikki's family restaurant being threatened"

# Search first to avoid duplicates
Use content-linker: "Nikki family quest"

# Result: No quest found
# Proceed with creation using workflow-enforcer
```

### Example 3: Finding related content

```
# Session mentions "Steel Dragon investigation"
Use content-linker: "Steel Dragon"

# Results:
# - Quest_Steel_Dragon.md (found)
# - Encounter_Murder_Scene.md (not found)
# - NPC_Steel_Dragon.md (found)

# Action: Create missing encounter file
```

## Advanced Search Tips

**Use Grep with Context:**
```bash
# Show 2 lines before and after match
grep -ri "search term" -A 2 -B 2 Quests/
```

**Search Multiple Terms:**
```bash
# AND search (both terms)
grep -ri "term1" Quests/ | grep -i "term2"

# OR search (either term)
grep -ri "term1\|term2" Quests/
```

**Case Insensitive:**
```bash
# Always use -i flag
grep -ri "case insensitive" Files/
```

**File Name Only:**
```bash
# Show only matching file names
grep -ril "search term" Encounters/
```

## Output Checklist

For each search, report:

- ☐ Exact matches found (file names)
- ☐ Content matches found (with context lines)
- ☐ Related content found (similar names/topics)
- ☐ Entity database status
- ☐ Recommendations for action
- ☐ Wikilink suggestions
- ☐ Content creation needs

## Notes

- Always search multiple directories (Encounters, Quests, NPCs, Locations)
- Check entity_database.json for registered entities
- Provide context lines when showing grep results
- Suggest specific file names for new content
- Link to workflow-enforcer for content creation
