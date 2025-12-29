---
skill_name: wiki-lookup
description: Quick lookup for campaign entities in the wiki index
version: 1.0.0
---

# Wiki Lookup Skill

Quick entity lookup by name from the campaign wiki index.

## Usage

Invoke this skill to:
1. Search for an entity by name
2. List all entities of a specific type
3. Check sync status of entities
4. Get Notion page IDs and file paths

## Arguments

- `entity_name` (optional): Name of entity to lookup
- `category` (optional): Filter by category (sessions, pcs, npcs, locations, factions, campaign-core)
- `list_all` (optional): List all entities in category

## Implementation

When this skill is invoked:

1. **Single Entity Lookup**
   - Search WIKI_INDEX.md for entity name (case-insensitive)
   - Return: File path, Notion page ID, last sync timestamp
   - If multiple matches, show all

2. **Category Listing**
   - List all entities in specified category
   - Show: Name, file path, last sync date
   - Sort by last sync date (newest first)

3. **Sync Status Check**
   - Compare against `.notion_sync_state.json`
   - Report if entity needs re-sync (local file modified after last sync)

## Examples

**Lookup single entity:**
```
User: /wiki-lookup Corvin Tradewise
Output:
Name: Corvin Tradewise
File: NPCs/Location_NPCs/NPC_Corvin_Tradewise.md
Notion ID: 2ad693f0c6b4811fafb3fa29f2f51e8f
Last Synced: 2025-12-29 05:00:49
Type: Location NPC
```

**List category:**
```
User: /wiki-lookup --category npcs
Output:
Major NPCs (4):
- Professor Zero (2025-11-16 01:32:15)
- Steel Dragon (2025-12-29 05:08:33)
- The Patron (2025-11-16 01:32:44)
- Krythak Stormbringer (2025-11-16 13:50:47)

Location NPCs (8):
- Corvin Tradewise (2025-12-29 05:00:49)
- Veridian Scrollkeeper (2025-12-29 05:02:19)
...
```

**List all entities:**
```
User: /wiki-lookup --list-all
Output:
Total Entities: 70
- Sessions: 4
- Player Characters: 5
- NPCs: 26
- Locations: 29
- Factions: 6
- Campaign Core: 4
```

## Source Data

Primary source: `WIKI_INDEX.md`
Validation: `.notion_sync_state.json`

## Protocol

1. Read WIKI_INDEX.md
2. Parse markdown tables
3. Search or filter based on arguments
4. Return formatted results

If entity not found, suggest similar names or provide category list.
