# Notion Structure Lessons - CRITICAL KNOWLEDGE

**Date:** 2025-01-06
**Problem Solved:** How to create properly nested toggle structures in Notion via API

---

## The Problem

Markdown-based sync scripts created flat structures. Toggles appeared but had no children, or nesting was incorrect.

**Root Cause:** Notion API requires hierarchical block creation - parent blocks must be created BEFORE children can be added.

---

## The Solution: Hierarchical Structure Builder

### Key Discovery

**Notion Toggle Nesting Rules:**
1. **Max 2 levels of inline nesting** - When creating blocks with `children` arrays
2. **Unlimited depth with sequential creation** - Create parent first, then append children to parent's ID
3. **Toggleable headings need children appended separately** - Can't inline children in heading creation

### Working Pattern

```python
# ❌ DOESN'T WORK - 3 levels inline
room_toggle = {
    'type': 'toggle',
    'toggle': {
        'rich_text': [...],
        'children': [
            {
                'type': 'toggle',  # Level 2
                'toggle': {
                    'children': [
                        {
                            'type': 'toggle',  # Level 3 - API REJECTS THIS
                            'toggle': {'children': [...]}
                        }
                    ]
                }
            }
        ]
    }
}

# ✅ WORKS - Sequential creation
# Step 1: Create parent
result = notion.blocks.children.append(parent_id, [room_toggle])
room_id = result['results'][0]['id']

# Step 2: Add children to parent
result2 = notion.blocks.children.append(room_id, [creatures_toggle])
creatures_id = result2['results'][0]['id']

# Step 3: Add grandchildren
notion.blocks.children.append(creatures_id, [creature_stats])
```

---

## Successful Structure Builder Location

**File:** `.config/build_dungeon_structure.py`

**What It Does:**
- Takes structured data (dict format)
- Builds Notion blocks hierarchically
- Guarantees correct nesting

**Key Functions:**
- `create_dungeon_page()` - Main builder
- `parse_rich_text()` - Simple text formatter

---

## Data Format for Structure Builder

```python
data = {
    'overview': {
        'size': 'Small (3 rooms)',
        'mechanics': ['Mechanic 1', 'Mechanic 2']
    },
    'corridors': [
        {
            'name': 'Corridor Name',
            'properties': ['Prop 1', 'Prop 2']
        }
    ],
    'rooms': [
        {
            'name': 'Room 1 - Name',
            'boxed_text': 'Read-aloud description',
            'creatures': [
                {
                    'name': 'Creature Type (Count)',
                    'stats': ['Stat 1', 'Stat 2']
                }
            ]
        }
    ]
}
```

---

## Why This Approach Works

### Separation of Concerns

1. **Data Extraction** (from markdown) - Simple parsing
2. **Structure Building** (to Notion) - Explicit, guaranteed

### Benefits

- **Guaranteed Success** - Structure builder creates exact Notion structure every time
- **Debuggable** - Can test with hardcoded data
- **Flexible** - Can add new section types without breaking existing code
- **Clear** - Explicit about what goes where

---

## Migration Path

### Old Approach (Failed)
```
Markdown → Parse line-by-line → Try to build nested structure → Upload
```
**Problem:** Ambiguous markdown, complex nesting logic, fragile

### New Approach (Works)
```
Markdown → Extract data to dict → Structure builder → Upload
```
**Success:** Clear data model, explicit structure, reliable

---

## Next Steps for MCPs

### 1. Session Flow MCP Updates

Add tools:
- `create_dungeon_structure` - Uses structure builder
- `add_room_to_dungeon` - Adds single room hierarchically
- `add_creature_to_room` - Adds creature with stats

### 2. Markdown Helpers

Create extractors:
- `extract_overview_data(markdown)` → dict
- `extract_corridor_data(markdown)` → list
- `extract_room_data(markdown)` → list

### 3. Template Updates

Update `DUNGEON_FORMAT_TEMPLATE.md`:
- Show data extraction format
- Explain structure builder usage
- Remove ambiguous markdown patterns

---

## Critical Rules for Future Development

### ✅ DO:
- Create parent blocks first
- Append children to parent IDs
- Use structure builders for complex nesting
- Test with explicit data before markdown parsing
- Keep nesting depth ≤ 3 levels

### ❌ DON'T:
- Try to inline more than 2 toggle levels
- Parse markdown directly to Notion blocks
- Create all blocks in one batch for nested structures
- Assume headings automatically contain following content

---

## Files to Reference

- `.config/build_dungeon_structure.py` - Working structure builder
- `.config/sync_notion_v2.py` - Failed tree-based attempt (kept for learning)
- `.config/sync_notion.py` - Original flat sync (works for simple docs)

---

## Testing Protocol

When creating new structure builders:

1. **Start with hardcoded data** - Prove structure works
2. **Extract one section** - Parse markdown for that section only
3. **Integrate incrementally** - Add sections one at a time
4. **Compare to manual** - Create "Fixed" version in Notion, compare block structure
5. **Validate** - Upload, check nesting, verify toggles work

---

## API Endpoint Reference

```python
# Create page
page = notion.pages.create(parent={'database_id': DB_ID}, properties={...})

# Add top-level blocks
result = notion.blocks.children.append(block_id=page_id, children=[...])

# Get created block IDs
block_id = result['results'][0]['id']

# Add children to specific block
notion.blocks.children.append(block_id=parent_block_id, children=[...])

# Check block structure
blocks = notion.blocks.children.list(block_id=parent_id)
```

---

## Example: Room Structure Creation

```python
# 1. Create room toggle (empty)
room = notion.blocks.children.append(page_id, [{
    'type': 'toggle',
    'toggle': {'rich_text': parse_rich_text('Room 1')}
}])
room_id = room['results'][0]['id']

# 2. Add room children (quote + creatures toggle)
room_content = notion.blocks.children.append(room_id, [
    {'type': 'quote', 'quote': {'rich_text': [...]}},
    {'type': 'toggle', 'toggle': {'rich_text': parse_rich_text('Creatures')}}
])
creatures_id = room_content['results'][1]['id']  # Second item

# 3. Add creatures
for creature_data in creatures:
    creature = notion.blocks.children.append(creatures_id, [{
        'type': 'toggle',
        'toggle': {'rich_text': parse_rich_text(creature_data['name'])}
    }])
    creature_id = creature['results'][0]['id']

    # 4. Add creature stats
    notion.blocks.children.append(creature_id, [
        {'type': 'bulleted_list_item', 'bulleted_list_item': {'rich_text': parse_rich_text(stat)}}
        for stat in creature_data['stats']
    ])
```

---

## Version History

- **v1.0** (2025-01-06) - Initial documentation after successful structure builder
