# Notion Sync Strategy

**Updated:** 2025-01-06

---

## Three Sync Approaches

We have three different sync methods for different use cases:

### 1. Basic Flat Sync (`sync_notion.py`)

**Use For:**
- Simple documents
- PC files
- NPC files
- Faction files
- Location files (without complex structure)

**How It Works:**
- Parses markdown line-by-line
- Creates Notion blocks
- Sets `is_toggleable: True` on headings
- Handles `**Toggle:**` patterns as toggle blocks
- Archives old, creates new on updates

**Limitations:**
- Doesn't nest toggle children properly
- Can't create deep hierarchies
- Good for documents with max 1-2 toggle levels

### 2. Tree-Based Sync (`sync_notion_v2.py`)

**Use For:**
- Moderate complexity
- Some nesting required
- Not performance critical

**How It Works:**
- Parses markdown into tree structure first
- Converts tree to Notion blocks
- Handles up to 2 levels of inline nesting
- Depth limiting (3rd level toggles → bold paragraphs)

**Limitations:**
- Still can't properly nest beyond 2 levels
- Complex parsing logic
- Kept for reference, not recommended for production

### 3. Structure Builder (`build_dungeon_structure.py`)

**Use For:** ✅ **RECOMMENDED FOR COMPLEX STRUCTURES**
- Dungeons
- Session flows with nested encounters
- Any document requiring 3+ toggle levels
- Hierarchical data

**How It Works:**
- Takes structured data (Python dict)
- Explicitly builds Notion hierarchy
- Creates parent blocks first
- Appends children via separate API calls
- Guarantees correct nesting

**Benefits:**
- Reliable, testable
- Unlimited nesting depth
- Clear data model
- Easy to debug

---

## Decision Tree: Which Sync Method?

```
Is the document complex with nested toggles?
├─ NO → Use sync_notion.py
│       Examples: PC files, simple session notes
│
└─ YES → Does it have 3+ levels of toggles?
    ├─ NO → Use sync_notion.py (should work)
    │
    └─ YES → Use structure builder approach
            Examples: Dungeons, complex encounters
```

---

## Structure Builder Workflow

### Step 1: Define Data Model

Create a dict representing your document:

```python
data = {
    'section1': {
        'field': 'value',
        'list': ['item1', 'item2']
    },
    'nested_items': [
        {
            'name': 'Item 1',
            'children': [...]
        }
    ]
}
```

### Step 2: Build Structure Function

Create a function like `create_dungeon_page()`:
- Takes Notion client + data dict
- Creates page
- Builds sections hierarchically
- Returns page ID

### Step 3: Extract from Markdown (Optional)

If starting from markdown:
- Create extraction functions
- Parse markdown → data dict
- Pass to structure builder

### Step 4: Test

```python
# Test with hardcoded data first
test_data = {...}
create_my_structure(notion, "Test Doc", test_data)

# Verify in Notion
# Then integrate markdown extraction
```

---

## Current Implementations

### Working Structure Builders

1. **Dungeon Builder** (`.config/build_dungeon_structure.py`)
   - Overview section
   - Corridors (toggles with properties)
   - Rooms (nested toggles: Room → Creatures → Individual creatures)

### Needed Structure Builders

2. **Session Flow Builder** (TODO)
   - Flowchart
   - Nodes with encounters
   - Decision points

3. **Encounter Builder** (TODO)
   - Creatures with tactics
   - Environment elements
   - Phases/rounds

---

## Migration Plan

### Phase 1: Document Current State ✅
- Created NOTION_STRUCTURE_LESSONS.md
- Updated MCP README
- This document

### Phase 2: Extract Helpers
- Create markdown → data extractors
- One per section type (overview, corridors, rooms)

### Phase 3: Integrate with MCPs
- Add structure builder tools to session flow MCP
- Update templates to show data format
- Test end-to-end workflow

### Phase 4: Cleanup
- Archive failed attempts (sync_notion_v2.py)
- Update all documentation
- Create examples

---

## File Locations

**Active:**
- `.config/sync_notion.py` - Basic sync (flat documents)
- `.config/build_dungeon_structure.py` - Hierarchical builder (complex documents)
- `.config/NOTION_STRUCTURE_LESSONS.md` - Technical knowledge
- `.config/SYNC_STRATEGY.md` - This file

**Reference (Not for production):**
- `.config/sync_notion_v2.py` - Tree-based attempt (learning example)

**Templates:**
- `.config/DUNGEON_FORMAT_TEMPLATE.md` - Will be updated with data format examples

---

## Best Practices

### For Simple Documents
```python
python3 sync_notion.py path/to/file.md type
```

### For Complex Documents
```python
# 1. Extract data
data = extract_dungeon_data('path/to/file.md')

# 2. Build structure
from config.build_dungeon_structure import create_dungeon_page
create_dungeon_page(notion, "Dungeon Name", data)
```

### For New Structure Types
1. Create hardcoded data example
2. Write builder function
3. Test manually
4. Create extraction function
5. Integrate

---

## Troubleshooting

### Toggles appear but are empty
- Using basic sync for complex structure
- Switch to structure builder approach

### API Error: "children should not be present"
- Trying to inline 3+ levels of toggles
- Use sequential creation (parent first, then children)

### Content appears as siblings not children
- Headings with `is_toggleable: True` need children appended separately
- Can't inline children in heading creation

### Nesting is wrong
- Markdown format is ambiguous
- Use explicit data model + structure builder

---

## See Also

- `.config/NOTION_STRUCTURE_LESSONS.md` - Deep technical details
- `.config/NOTION_ARCHITECTURE.md` - Database schema
- `.config/SESSION_FORMAT_SPEC.md` - Session document format
- `mcp_server_session_flow/README.md` - MCP tools
