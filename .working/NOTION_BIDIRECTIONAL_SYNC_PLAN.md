# Notion Bidirectional Sync - Attack Plan

**Created:** 2026-01-10
**Status:** Planning Phase
**Goal:** Achieve 100% feature parity for Notion→Repo syncing (matching Repo→Notion capabilities)

---

## 🚨 CRITICAL CONTEXT

### What Happened

1. **Session 3 was run** - Gameplay notes added to Notion under "Gameplay Notes" toggle section
2. **pull_session_notes.py was run** - Pulled content from Notion back to local repo
3. **SYNC CORRUPTION OCCURRED** - 328 lines changed, multiple breaking changes:
   - Wikilinks stripped: `[[Kyle/Nameless]]` → `Kyle/Nameless`
   - Wikilinks corrupted: `[[Geist]]` → `Geist Investigation`
   - List numbering broken: All numbered lists show `1.` instead of sequential (1, 2, 3)
   - Bold formatting broken: `Kyle/Nameless**'s` (asterisks in wrong place)
   - Indentation broken: `**Toggle: Session Flow**` became indented with spaces
   - Extra blank lines removed throughout
   - Frontmatter corrupted: `version: "1.0.0"` → `version: 1.0.0` (quotes removed)
   - Frontmatter corrupted: `tags: [tag1, tag2]` → `tags:\n- tag1\n- tag2` (array format changed)

4. **Deferred modules workflow contaminated** - New session planning system depends on clean Session 3 data, but corruption prevented proper module extraction

5. **Thread confusion** - Another thread correctly identified corruption and reverted Session_3 to HEAD, discarding gameplay notes in the process

### Current State

- **Session_3_The_Steel_Dragon_Begins.md (git HEAD):** Clean, proper wikilinks, no gameplay notes
- **.working/Session_3_Notion_Pull.md:** Contains gameplay notes BUT all the corruption (328 line diff)
- **Gameplay notes are now isolated and safe** in working file
- **Goal:** Fix pull_session_notes.py to merge cleanly without breaking existing content

---

## 📊 SYNC DAMAGE ANALYSIS

### Corruption Categories (328 total line changes)

**1. Wikilink Stripping (50+ instances)**
- Pattern: `[[Entity Name]]` → `Entity Name` (plain text)
- Examples:
  - `[[Kyle/Nameless]]` → `Kyle/Nameless`
  - `[[Manny]]` → `Manny`
  - `[[Nikki]]` → `Nikki`
  - `[[Corvin Tradewise]]` → `Corvin Tradewise`
  - `[[Geist]]` → `Geist Investigation` (WORSE - text also changed!)
  - `[[Mira Saltwind]]` → `Mira Saltwind`
  - `[[Steel Dragon]]` → `Steel Dragon`
  - `[[Meridian's Rest]]` → `Meridian's Rest`
  - `[[Agastia]]` → `Agastia Region` (text changed!)
  - All wikilink section anchors stripped: `[[Inspiring Tables#Temperate Forests (Tier 1)]]`

**2. List Numbering Corruption (20+ instances)**
- Pattern: Sequential numbers `1. 2. 3.` → all become `1. 1. 1.`
- Affected: All ordered lists in Quick Reference toggles
- Example:
  ```markdown
  # Before (correct)
  1. **Travel to Agastia:** 2-3 day journey
  2. **Kyle's Hook:** Encounter on road
  3. **Player Choice:** Multiple options

  # After (broken)
  1. **Travel to Agastia:** 2-3 day journey
  1. **Kyle's Hook:** Encounter on road
  1. **Player Choice:** Multiple options
  ```

**3. Bold Formatting Corruption (10+ instances)**
- Pattern: Asterisks moved to wrong location in text
- Examples:
  - `**[[Kyle/Nameless]]'s Hook:**` → `Kyle/Nameless**'s Hook:**` (broken)
  - `- **[[Corvin Tradewise]]:**` → `- Corvin Tradewise**:**` (broken)
  - `- **[[Mira Saltwind]]:**` → `- Mira Saltwind**:**` (broken)

**4. Indentation Changes (30+ instances)**
- Pattern: List items get indented with 2 spaces where they shouldn't be
- Examples:
  - `**Toggle: Session Flow**` → `  **Toggle: Session Flow**`
  - `**Toggle: Key NPCs**` → `  **Toggle: Key NPCs**`
  - All bullet points under toggles indented with 2 spaces

**5. Frontmatter Format Changes (5 instances)**
- Pattern: YAML format changed from inline to multi-line
- Examples:
  - `version: "1.0.0"` → `version: 1.0.0` (quotes removed)
  - `tags: [session3, travel, agastia]` → `tags:\n- session3\n- travel\n- agastia`

**6. Whitespace Damage (100+ instances)**
- Pattern: Blank lines removed throughout document
- Impact: Reduces markdown readability, changes git diffs
- Examples:
  - Blank lines between sections removed
  - Blank lines after headings removed
  - Blank lines between list items removed

**7. Clue List Renumbering (1 instance)**
- Original: `1. Label, 2. Materials, 3. Note, 4. Card, 5. Burns` (5 clues)
- Corrupted: `1. Label, 1. Materials, 1. Note, 1. Card, 1. Burns` (all numbered 1)

---

## ✅ REPO→NOTION FEATURES (Current Working Features)

### What sync_notion.py Does Correctly

**File:** `sync_notion.py` (702 lines)

**1. Wikilink Support (`parse_rich_text` function, lines 83-228)**
- ✅ Converts `[[Entity]]` → Notion mention links to database pages
- ✅ Searches database for matching page by name
- ✅ Creates proper Notion mention block with page_id
- ✅ Supports `[[Page#Section]]` syntax with block cache lookups
- ✅ Falls back to plain text if page not found (graceful degradation)
- ✅ Handles wikilinks within bold/italic/code formatting

**2. Rich Text Formatting (`parse_rich_text` function)**
- ✅ **Bold:** `**text**` → Notion bold annotation
- ✅ *Italic:* `*text*` → Notion italic annotation
- ✅ `Code`: `` `text` `` → Notion code annotation
- ✅ ~~Strikethrough~~: `~~text~~` → Notion strikethrough annotation
- ✅ Mixed formatting: `**[[Bold wikilink]]**` works correctly

**3. Block Types (`parse_single_block` function, lines 244-343)**
- ✅ Headings (H1-H6) → Notion heading_1, heading_2, heading_3
- ✅ Toggles: `**Toggle: Title**` → Notion toggle block
- ✅ Bulleted lists: `- item` → Notion bulleted_list_item
- ✅ Numbered lists: `1. item` → Notion numbered_list_item
- ✅ Blockquotes: `> text` → Notion quote block
- ✅ Code blocks: ` ```lang\ncode\n``` ` → Notion code block with language
- ✅ Paragraphs: Plain text → Notion paragraph block
- ✅ Horizontal rules: `---` → Notion divider

**4. Hierarchical Nesting (`upload_blocks_with_children` function, lines 536-578)**
- ✅ Headings become toggleable with nested children
- ✅ Toggles contain nested content until next same-level heading/toggle
- ✅ List items can nest sub-lists
- ✅ Proper parent-child relationships via Notion API

**5. Frontmatter Handling (`sync_to_notion` function, lines 580-661)**
- ✅ Parses YAML frontmatter via `frontmatter` library
- ✅ Maps frontmatter fields to Notion page properties
- ✅ Supports all Notion property types (title, rich_text, select, multi_select, number, date, url, checkbox, relation)
- ✅ Updates existing pages via page_id lookup
- ✅ Creates new pages if page doesn't exist

**6. Batch Syncing (`sync_all` function, lines 663-702)**
- ✅ Discovers all .md files in repo via recursive glob
- ✅ Respects `.notionignore` patterns
- ✅ Syncs multiple files in batch
- ✅ Records sync timestamps via `.notion_sync_state.json`
- ✅ Error handling per-file (one failure doesn't block others)

**7. Timestamp Tracking (`sync_state_manager.py`)**
- ✅ Records last push timestamp for each file
- ✅ Enables skip-if-recently-synced logic in pull_session_notes.py
- ✅ Prevents sync loops (repo→Notion→repo→Notion...)

---

## ❌ NOTION→REPO MISSING FEATURES (What Needs to Be Built)

### Current Tool: pull_session_notes.py (295 lines)

**What It Does Now:**
1. ✅ Finds session pages in Notion database
2. ✅ Fetches Notion blocks via API (`notion_client.blocks.children.list`)
3. ❌ **Converts blocks → markdown (BROKEN)** - `notion_blocks_to_markdown` function
4. ❌ **Merges with local content (BROKEN)** - `merge_session_content` function
5. ✅ Writes to local file
6. ✅ Records pull timestamp to prevent sync loops

**Why It Breaks:**

### Missing Feature 1: Wikilink Preservation

**Problem:** Notion mentions are converted to plain text, losing wikilink syntax

**Current Code (lines 89-129 in pull_session_notes.py):**
```python
def get_text(block_data):
    """Extract plain text from Notion rich_text array"""
    text_parts = []
    for text_obj in block_data.get('rich_text', []):
        if text_obj['type'] == 'text':
            text_parts.append(text_obj['text']['content'])
        elif text_obj['type'] == 'mention':
            # BUG: Only extracts plain_text, loses wikilink syntax!
            text_parts.append(text_obj['mention'].get('plain_text', ''))
    return ''.join(text_parts)
```

**What We Need:**
```python
def get_text(block_data):
    """Extract text from Notion rich_text, preserving wikilinks"""
    text_parts = []
    for text_obj in block_data.get('rich_text', []):
        if text_obj['type'] == 'text':
            content = text_obj['text']['content']
            # Preserve formatting annotations
            annotations = text_obj.get('annotations', {})
            if annotations.get('bold'):
                content = f"**{content}**"
            if annotations.get('italic'):
                content = f"*{content}*"
            if annotations.get('code'):
                content = f"`{content}`"
            if annotations.get('strikethrough'):
                content = f"~~{content}~~"
            text_parts.append(content)
        elif text_obj['type'] == 'mention':
            # FIX: Reconstruct wikilink syntax [[Page Name]]
            mention_type = text_obj['mention']['type']
            if mention_type == 'page':
                page_id = text_obj['mention']['page']['id']
                # Fetch page title from Notion
                page_title = fetch_page_title(notion_client, page_id)
                text_parts.append(f"[[{page_title}]]")
            else:
                text_parts.append(text_obj['plain_text'])
    return ''.join(text_parts)
```

**Required:**
- Detect `mention` type blocks
- Fetch referenced page title via Notion API
- Reconstruct `[[Page Title]]` syntax
- Handle nested formatting: `**[[Bold Wikilink]]**`

### Missing Feature 2: List Numbering Preservation

**Problem:** All numbered lists become "1. 1. 1." instead of "1. 2. 3."

**Current Code:** No attempt to track list numbering across items

**What We Need:**
- Track list counter state while iterating blocks
- Increment counter for each `numbered_list_item` at same nesting level
- Reset counter when nesting level changes
- Output correct sequential numbers: `1. First\n2. Second\n3. Third`

**Required:**
```python
def notion_blocks_to_markdown(notion_client, page_id, indent_level=0):
    """Convert Notion blocks to markdown with proper list numbering"""
    markdown_lines = []
    list_counters = {}  # Track numbering per nesting level

    for block in blocks:
        block_type = block['type']

        if block_type == 'numbered_list_item':
            # Get or initialize counter for this indent level
            if indent_level not in list_counters:
                list_counters[indent_level] = 1
            else:
                list_counters[indent_level] += 1

            num = list_counters[indent_level]
            text = get_text(block[block_type])
            markdown_lines.append(f"{num}. {text}")

        elif block_type != 'numbered_list_item':
            # Reset counter when we leave numbered list
            list_counters = {}

    return markdown_lines
```

### Missing Feature 3: Frontmatter Format Preservation

**Problem:** YAML format changes from inline to multi-line

**Current Code:** No frontmatter handling in pull_session_notes.py

**What We Need:**
- Parse frontmatter from local file (if exists)
- Fetch frontmatter from Notion page properties
- Preserve original YAML format style:
  - Keep `tags: [tag1, tag2]` instead of converting to `tags:\n- tag1`
  - Keep `version: "1.0.0"` (quoted) instead of `version: 1.0.0` (unquoted)
- Only update changed fields, preserve unchanged fields

**Required:**
```python
def preserve_frontmatter_format(local_frontmatter, notion_properties):
    """Update frontmatter values while preserving original YAML format"""
    # Parse original format (inline vs multi-line, quoted vs unquoted)
    # Update only changed values
    # Return frontmatter string matching original format
```

### Missing Feature 4: Whitespace Preservation

**Problem:** Blank lines removed throughout document

**What We Need:**
- Preserve blank lines between sections
- Add blank line after headings
- Add blank line between list groups
- Match original document spacing conventions

**Required:**
- Analyze local file spacing patterns
- Apply same spacing rules when reconstructing from Notion
- OR: Use git diff to preserve unchanged sections (only append new content)

### Missing Feature 5: Toggle Section Detection

**Problem:** Notion toggles not converted back to `**Toggle: Title**` format

**Current Code:** No toggle → markdown conversion

**What We Need:**
```python
if block_type == 'toggle':
    text = get_text(block['toggle'])
    # Extract title from toggle block
    # Format as: **Toggle: {title}**
    markdown_lines.append(f"**Toggle: {text}**")
    # Recursively process nested children
    children_md = notion_blocks_to_markdown(notion_client, block['id'], indent_level + 1)
    markdown_lines.extend(children_md)
```

### Missing Feature 6: Code Block Language Preservation

**Problem:** Code block language tags not preserved

**What We Need:**
```python
if block_type == 'code':
    language = block['code'].get('language', '')
    code_text = get_text(block['code'])
    markdown_lines.append(f"```{language}")
    markdown_lines.append(code_text)
    markdown_lines.append("```")
```

### Missing Feature 7: Blockquote Preservation

**Problem:** Blockquotes not converted back to `> text` format

**What We Need:**
```python
if block_type == 'quote':
    text = get_text(block['quote'])
    markdown_lines.append(f"> {text}")
```

### Missing Feature 8: Nested List Indentation

**Problem:** Nested lists lose indentation (bullet and numbered)

**What We Need:**
- Track nesting level via `block['has_children']` and recursive calls
- Add proper indentation: `  - nested item` (2 spaces per level)
- Preserve mixed nesting: numbered lists inside bulleted lists and vice versa

---

## 🎯 FEATURE PARITY REQUIREMENTS

### Mandatory Features (100% Parity Required)

**All Repo→Notion features MUST work in Notion→Repo direction:**

1. ✅ **Wikilinks:** `[[Entity]]` and `[[Page#Section]]` must survive round-trip
2. ✅ **Rich Text Formatting:** Bold, italic, code, strikethrough must survive
3. ✅ **List Numbering:** Sequential numbers (1, 2, 3) must be preserved
4. ✅ **Frontmatter Format:** YAML style (inline vs multi-line, quoted vs unquoted) must match original
5. ✅ **Toggles:** `**Toggle: Title**` format must be reconstructed from Notion toggles
6. ✅ **Code Blocks:** Language tags must be preserved
7. ✅ **Blockquotes:** `> text` format must be reconstructed
8. ✅ **Nested Lists:** Indentation must be preserved for all nesting levels
9. ✅ **Whitespace:** Blank lines between sections must match original document conventions
10. ✅ **Mixed Formatting:** `**[[Bold Wikilink]]**` must work correctly

### Test Cases (Validation Required)

**Before accepting solution, ALL test cases must pass:**

1. **Wikilink Test:**
   - Input (repo): `**[[Kyle/Nameless]]'s Hook:**`
   - Push to Notion → Pull from Notion
   - Output (repo): `**[[Kyle/Nameless]]'s Hook:**` (unchanged)

2. **List Numbering Test:**
   - Input (repo): `1. First\n2. Second\n3. Third`
   - Push to Notion → Pull from Notion
   - Output (repo): `1. First\n2. Second\n3. Third` (unchanged)

3. **Frontmatter Test:**
   - Input (repo): `tags: [session3, travel, agastia]`
   - Push to Notion → Pull from Notion
   - Output (repo): `tags: [session3, travel, agastia]` (unchanged, NOT `tags:\n- session3`)

4. **Toggle Test:**
   - Input (repo): `**Toggle: Session Flow**`
   - Push to Notion → Pull from Notion
   - Output (repo): `**Toggle: Session Flow**` (unchanged)

5. **Gameplay Notes Append Test:**
   - Input (repo): Session file without gameplay notes
   - Push to Notion → Add "Gameplay Notes" toggle in Notion → Pull from Notion
   - Output (repo): Original content unchanged + new "**Toggle: Gameplay notes**" section appended at end

---

## 📋 ATTACK PLAN PHASES

### Phase 1: Diagnostic & Audit ✅ (Complete)

**Tasks:**
- [x] Pull Session 3 from Notion (with gameplay notes)
- [x] Save as .working/Session_3_Notion_Pull.md
- [x] Compare against git HEAD (identify all 328 corruptions)
- [x] Audit sync_notion.py (document working features)
- [x] Audit pull_session_notes.py (identify broken features)
- [x] Create this attack plan document
- [x] Incorporate architectural improvements (hash-based sync, tokenization)

### Phase 2: Infrastructure Setup (Next Thread - NEW)

**Priority 0: Build Foundation Tools**
1. [ ] Create `.config/discover_entities.py` - Entity database builder
   - Scan WIKI_INDEX.md for entities
   - Scan all .md files for wikilinks
   - Scan point-crawl files for locations
   - Generate entity variants (nicknames, aliases)
   - Output: `.config/entity_database.json`
2. [ ] Build initial entity database
   - Run discover_entities.py --build
   - Validate database completeness
   - Test entity lookup performance
3. [ ] Create hash-based block comparison utilities
   - Implement hash_block_content function
   - Implement build_block_hashmap function
   - Implement find_changed_blocks function
   - Test against Session 3 (verify unchanged blocks detected)

**Benefits:**
- Deterministic entity matching (no guessing)
- Efficient sync (only process changed blocks)
- Maintainable (entity database auto-updates)

### Phase 3: Feature Implementation (After Infrastructure)

**Priority 1: Critical Features (Blockers)**
1. [ ] Implement hash-based differential sync
   - Hash each block on both sides (Notion + local)
   - Compare hashes after sanitization
   - Keep unchanged blocks with original formatting
   - Only reconstruct changed blocks
2. [ ] Implement wikilink reconstruction (hybrid approach)
   - Method 1: Direct from Notion mentions (fetch page titles)
   - Method 2: Tokenization using entity database
   - Combine both for maximum reliability
   - Convert mentions → `[[Page Name]]` syntax
3. [ ] Implement rich text formatting preservation
   - Detect bold/italic/code/strikethrough annotations
   - Wrap text with markdown syntax
   - Handle nested formatting correctly
4. [ ] Implement list numbering tracking
   - Track counters per nesting level
   - Output sequential numbers
   - Reset when nesting level changes

**Priority 2: Format Preservation**
5. [ ] Implement frontmatter format preservation
   - Parse original YAML format
   - Update values without changing format
   - Preserve quotes, array style, etc.
6. [ ] Implement toggle reconstruction
   - Convert Notion toggle blocks → `**Toggle: Title**`
   - Recursively process children
7. [ ] Implement code block language preservation
   - Extract language tag from Notion
   - Format as ` ```language\ncode\n``` `

**Priority 3: Whitespace & Polish**
8. [ ] Implement whitespace preservation
   - Blank lines between sections
   - Blank lines after headings
   - Match original document conventions
9. [ ] Implement blockquote preservation
   - Convert Notion quote blocks → `> text`
10. [ ] Implement nested list indentation
    - Track nesting level
    - Add 2 spaces per level
    - Preserve mixed nesting (bullets + numbers)

**Priority 4: Gameplay Notes Analysis & Wikilink Discovery**
11. [ ] Analyze gameplay notes for new wikilink opportunities
    - Parse "Gameplay notes" toggle section from Notion
    - Identify entity mentions (NPCs, locations, items)
    - Cross-reference with entity database
    - Flag new entities not yet in database
12. [ ] Auto-wikify gameplay notes
    - Apply tokenization to gameplay notes
    - Convert entity mentions → wikilinks
    - Preserve narrative flow (don't over-wikify common words)
13. [ ] Update entity relationships from gameplay interactions
    - Detect interactions: "X met Y", "X traveled to Y"
    - Update PC knowledge sections with new discoveries
    - Add relationships to entity files
    - Track quest progression from gameplay

**Priority 5: Performance & API Optimization**
14. [ ] Optimize for Notion API rate limits
    - Batch API calls where possible
    - Cache page title lookups (avoid redundant fetches)
    - Respect 3 requests/second limit
    - Implement exponential backoff on rate limit errors
15. [ ] BigO complexity analysis
    - Ensure O(n) complexity for block comparison (no nested loops)
    - Use hash lookups (O(1)) instead of linear search
    - Optimize entity database queries
16. [ ] Add performance metrics logging
    - Track API call count per sync
    - Track time spent per phase (hash, compare, reconstruct)
    - Identify bottlenecks for future optimization

**Deferred (Acknowledged but Not Blocking):**
- Table formatting preservation (complex, handle separately)
- Advanced list formatting (definition lists, task lists)
- Embedded content (images, files)

### Phase 4: Testing & Validation (After Implementation)

**Tests:**
1. [ ] Hash-based differential test
   - Verify unchanged blocks detected correctly
   - Verify changed blocks identified
   - Verify only changed blocks reconstructed
2. [ ] Entity database test
   - Verify all existing entities detected
   - Verify entity variants work (Kyle → Kyle/Nameless)
   - Verify new entities added bidirectionally
3. [ ] Round-trip test: Sync Session_3 repo→Notion→repo, verify no changes
4. [ ] Wikilink test: All wikilinks preserved exactly
5. [ ] List numbering test: Sequential numbers preserved
6. [ ] Frontmatter test: YAML format unchanged
7. [ ] Toggle test: Toggle syntax preserved
8. [ ] Gameplay notes test: New content appends without breaking existing
9. [ ] Performance test: Measure API calls, execution time
10. [ ] Rate limit test: Verify backoff works, no API errors

**Acceptance Criteria:**
- Zero diff when syncing unchanged content (repo→Notion→repo produces identical file)
- All test cases pass
- Session 3 gameplay notes merge cleanly without any corruption
- API calls minimized (< 50 calls for Session 3 sync)
- Execution time reasonable (< 30 seconds for Session 3)
- No rate limit errors

### Phase 5: Session 3 Recovery (After Tool Fixed)

**Tasks:**
1. [ ] Extract gameplay notes from .working/Session_3_Notion_Pull.md
2. [ ] Run fixed pull_session_notes.py on Session 3
3. [ ] Verify zero corruption in output
4. [ ] Commit Session 3 with gameplay notes
5. [ ] Run extract-deferred-modules skill to create DEFERRED_MODULES.md
6. [ ] Proceed with deferred modules workflow for Session 4 planning

---

## 🏗️ IMPROVED ARCHITECTURAL APPROACH

### Hash-Based Differential Sync

**Core Concept:** Only sync blocks that actually changed, preserve formatting for unchanged blocks.

**Implementation:**

1. **Hash each block on both sides:**
```python
import hashlib

def hash_block_content(block_text, sanitize=True):
    """Hash block content after sanitization"""
    if sanitize:
        # Normalize: remove formatting differences that don't matter
        text = block_text.strip()
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = text.lower()  # Case-insensitive
    else:
        text = block_text

    return hashlib.sha256(text.encode('utf-8')).hexdigest()
```

2. **Build hash maps for both sides:**
```python
def build_block_hashmap(blocks):
    """Create hashmap: block_hash → block_data"""
    hashmap = {}
    for block in blocks:
        text = extract_text(block)
        block_hash = hash_block_content(text, sanitize=True)
        hashmap[block_hash] = {
            'original_text': text,
            'block_data': block,
            'formatting': extract_formatting(block)
        }
    return hashmap
```

3. **Compare hashmaps to find changes:**
```python
def find_changed_blocks(local_hashmap, notion_hashmap):
    """Identify which blocks changed, were added, or removed"""
    local_hashes = set(local_hashmap.keys())
    notion_hashes = set(notion_hashmap.keys())

    unchanged = local_hashes & notion_hashes  # Intersection
    added_in_notion = notion_hashes - local_hashes  # Only in Notion
    removed_in_notion = local_hashes - notion_hashes  # Only in local

    return {
        'unchanged': unchanged,  # Keep local formatting
        'added': added_in_notion,  # Add to local file
        'removed': removed_in_notion  # Keep in local (don't delete)
    }
```

4. **Merge strategy:**
```python
def merge_with_hash_diff(local_file, notion_blocks):
    """Merge using hash-based differential"""
    local_blocks = parse_local_file(local_file)
    local_hashmap = build_block_hashmap(local_blocks)
    notion_hashmap = build_block_hashmap(notion_blocks)

    diff = find_changed_blocks(local_hashmap, notion_hashmap)

    result = []

    # 1. Keep all unchanged blocks with original formatting
    for block_hash in diff['unchanged']:
        result.append(local_hashmap[block_hash]['original_text'])

    # 2. Add new blocks from Notion (reconstruct formatting)
    for block_hash in diff['added']:
        notion_block = notion_hashmap[block_hash]
        reconstructed = reconstruct_markdown(notion_block)
        result.append(reconstructed)

    # 3. Keep removed blocks in local (preserve local-only content)
    # Don't delete - Notion may not have everything

    return '\n\n'.join(result)
```

**Benefits:**
- ✅ Preserves formatting for unchanged content (solves 90% of corruption issues)
- ✅ Only processes changed blocks (API efficient)
- ✅ Deterministic (same input = same output)
- ✅ Scales to large documents (O(n) complexity)

### Tokenization for Wikilink Reconstruction

**Problem:** Notion mentions lose wikilink syntax, hard to reverse-engineer.

**Solution:** Build entity database from existing wikilinks, use tokenization to reconstruct.

**Implementation:**

1. **Build wikilink database from WIKI_INDEX.md:**
```python
def build_wikilink_database():
    """Extract all entity names from WIKI_INDEX.md and existing files"""
    entities = {}

    # Read WIKI_INDEX.md
    wiki_index = Path('WIKI_INDEX.md').read_text()
    for match in re.finditer(r'\[\[([^\]]+)\]\]', wiki_index):
        entity_name = match.group(1)
        # Store variants: "Kyle/Nameless", "Kyle", "Nameless"
        entities[entity_name] = True
        if '/' in entity_name:
            parts = entity_name.split('/')
            for part in parts:
                entities[part] = entity_name  # Map back to full name

    # Scan all .md files for wikilinks
    for md_file in Path('.').rglob('*.md'):
        content = md_file.read_text()
        for match in re.finditer(r'\[\[([^\]]+)\]\]', content):
            entity_name = match.group(1)
            entities[entity_name] = True

    return entities
```

2. **Tokenize Notion text and match against entity database:**
```python
def tokenize_and_wikify(text, entity_database):
    """Convert plain text back to wikilinks using entity database"""
    result = text

    # Sort entities by length (longest first) to avoid partial matches
    sorted_entities = sorted(entity_database.keys(), key=len, reverse=True)

    for entity in sorted_entities:
        # Match whole words only (avoid partial matches)
        pattern = r'\b' + re.escape(entity) + r'\b'
        # Replace with wikilink if not already wikilinked
        result = re.sub(
            pattern,
            lambda m: f"[[{entity}]]" if '[[' not in m.group(0) else m.group(0),
            result,
            flags=re.IGNORECASE
        )

    return result
```

3. **Hybrid approach (Notion mentions + tokenization):**
```python
def reconstruct_wikilinks(notion_block, entity_database):
    """Use both Notion mentions AND tokenization"""
    text_parts = []

    for text_obj in notion_block['rich_text']:
        if text_obj['type'] == 'mention' and text_obj['mention']['type'] == 'page':
            # Method 1: Direct mention (reliable)
            page_id = text_obj['mention']['page']['id']
            page_title = fetch_page_title(notion_client, page_id)
            text_parts.append(f"[[{page_title}]]")

        elif text_obj['type'] == 'text':
            # Method 2: Tokenization (fallback for corrupted mentions)
            plain_text = text_obj['text']['content']
            wikilinked_text = tokenize_and_wikify(plain_text, entity_database)
            text_parts.append(wikilinked_text)

    return ''.join(text_parts)
```

**Benefits:**
- ✅ Deterministic entity matching (no guessing)
- ✅ Handles both Notion mentions AND plain text
- ✅ Recovers from corruption (if mentions lost, tokenization catches them)
- ✅ Maintains entity database automatically

### Python Script for Entity Discovery

**Tool:** `.config/discover_entities.py`

**Purpose:** Build and maintain wikilink/entity database from existing content.

**Features:**
1. Scan WIKI_INDEX.md for all entities
2. Scan all .md files for wikilinks
3. Scan point-crawl files for location references
4. Detect new entities from both repo and Notion
5. Generate entity variants (nicknames, aliases)
6. Output: `.config/entity_database.json`

**Usage:**
```bash
# Build initial database
python3 .config/discover_entities.py --build

# Update database (detect new entities)
python3 .config/discover_entities.py --update

# Validate database (check for orphaned entities)
python3 .config/discover_entities.py --validate
```

**Database Format:**
```json
{
  "entities": {
    "Kyle/Nameless": {
      "variants": ["Kyle", "Nameless"],
      "type": "PC",
      "file": "Player_Characters/PC_Kyle_Nameless.md",
      "notion_id": "abc123..."
    },
    "Geist": {
      "variants": ["Geist Investigation", "Bandit Lieutenant"],
      "type": "NPC",
      "file": "NPCs/Faction_NPCs/NPC_Geist_Bandit_Lieutenant.md",
      "notion_id": "def456..."
    }
  },
  "last_updated": "2026-01-10T05:30:00Z"
}
```

### Bidirectional Content Tracking

**Challenge:** New entities can be added from either repo or Notion.

**Solution:** Detect new content from both directions, update entity database.

**Implementation:**

1. **Detect new entities in Notion:**
```python
def detect_new_notion_entities(notion_blocks, entity_database):
    """Find entities mentioned in Notion that aren't in database"""
    new_entities = []

    for block in notion_blocks:
        for text_obj in block.get('rich_text', []):
            if text_obj['type'] == 'mention' and text_obj['mention']['type'] == 'page':
                page_id = text_obj['mention']['page']['id']
                page_title = fetch_page_title(notion_client, page_id)

                if page_title not in entity_database:
                    new_entities.append({
                        'name': page_title,
                        'notion_id': page_id,
                        'source': 'notion'
                    })

    return new_entities
```

2. **Detect new entities in repo:**
```python
def detect_new_repo_entities(file_path, entity_database):
    """Find wikilinks in repo that aren't in database"""
    new_entities = []
    content = Path(file_path).read_text()

    for match in re.finditer(r'\[\[([^\]]+)\]\]', content):
        entity_name = match.group(1)

        if entity_name not in entity_database:
            new_entities.append({
                'name': entity_name,
                'source': 'repo',
                'file': file_path
            })

    return new_entities
```

3. **Update database from both sides:**
```python
def sync_entity_database():
    """Bidirectional entity database update"""
    db = load_entity_database()

    # Scan repo for new entities
    repo_new = scan_repo_for_new_entities(db)

    # Scan Notion for new entities
    notion_new = scan_notion_for_new_entities(db)

    # Merge both
    for entity in repo_new + notion_new:
        db['entities'][entity['name']] = entity

    # Save updated database
    save_entity_database(db)

    return db
```

### Gameplay Notes Analysis for Content Updates

**Challenge:** Gameplay notes contain valuable information about:
- New entity mentions (NPCs met, locations visited)
- PC interactions and relationships
- Quest progression and discoveries
- Items acquired, events witnessed

**Solution:** Analyze gameplay notes to discover new content and update existing entity files.

**Implementation:**

1. **Extract gameplay notes section:**
```python
def extract_gameplay_notes(notion_blocks):
    """Find and extract 'Gameplay notes' toggle section"""
    in_gameplay_section = False
    gameplay_blocks = []

    for block in notion_blocks:
        # Find the "Gameplay notes" toggle
        if block['type'] == 'toggle':
            text = get_text(block['toggle'])
            if 'gameplay' in text.lower() and 'notes' in text.lower():
                in_gameplay_section = True
                # Get children blocks
                if block.get('has_children'):
                    children = fetch_all_children(notion_client, block['id'])
                    gameplay_blocks.extend(children)
                break

    return gameplay_blocks
```

2. **Analyze for entity mentions:**
```python
def analyze_gameplay_for_entities(gameplay_text, entity_database):
    """Identify entity mentions in gameplay notes"""
    # NLP patterns for entity detection
    patterns = {
        'npc_met': r'met|encountered|spoke with|talked to|found (\w+)',
        'location_visited': r'went to|traveled to|arrived at|entered (\w+)',
        'item_acquired': r'found|received|took|acquired (.*?)(?:\.|,|$)',
        'interaction': r'(\w+) (?:and|with) (\w+)',
    }

    discoveries = {
        'new_npcs': [],
        'new_locations': [],
        'new_items': [],
        'interactions': []
    }

    # Check against entity database
    for entity in entity_database:
        if entity.lower() in gameplay_text.lower():
            # Entity mentioned - track it
            pass

    # Look for unknown entities
    for pattern_type, regex in patterns.items():
        for match in re.finditer(regex, gameplay_text, re.IGNORECASE):
            entity_name = match.group(1).strip()
            if entity_name not in entity_database:
                # Potential new entity
                if pattern_type == 'npc_met':
                    discoveries['new_npcs'].append(entity_name)
                elif pattern_type == 'location_visited':
                    discoveries['new_locations'].append(entity_name)
                elif pattern_type == 'item_acquired':
                    discoveries['new_items'].append(entity_name)

    return discoveries
```

3. **Update PC knowledge sections:**
```python
def update_pc_knowledge(gameplay_notes, pc_files):
    """Update PC files with new discoveries from gameplay"""
    for pc_file in pc_files:
        pc_data = read_pc_file(pc_file)

        # Extract relevant information
        discoveries = analyze_gameplay_for_entities(gameplay_notes, entity_database)

        # Update PC knowledge section
        updates = []
        for npc in discoveries['new_npcs']:
            if npc not in pc_data.get('known_npcs', []):
                updates.append(f"- Met [[{npc}]] during session")

        for location in discoveries['new_locations']:
            if location not in pc_data.get('visited_locations', []):
                updates.append(f"- Visited [[{location}]]")

        # Append to PC file knowledge section
        if updates:
            append_to_pc_knowledge(pc_file, updates)
```

4. **Auto-wikify gameplay notes:**
```python
def wikify_gameplay_notes(gameplay_text, entity_database):
    """Add wikilinks to entity mentions in gameplay notes"""
    result = gameplay_text

    # Sort entities by length (longest first)
    sorted_entities = sorted(entity_database.keys(), key=len, reverse=True)

    for entity in sorted_entities:
        # Only wikify proper nouns (capitalized words)
        # Avoid over-wikilinking common words
        if entity[0].isupper():
            pattern = r'\b' + re.escape(entity) + r'\b'
            # Don't replace if already wikilinked
            result = re.sub(
                pattern,
                lambda m: f"[[{entity}]]" if '[[' not in result[max(0, m.start()-2):m.end()+2] else m.group(0),
                result
            )

    return result
```

5. **Detect quest progression:**
```python
def detect_quest_progression(gameplay_notes):
    """Identify quest-related events in gameplay"""
    quest_keywords = [
        'quest', 'mission', 'objective', 'goal',
        'completed', 'failed', 'started', 'abandoned',
        'discovered', 'learned', 'found out'
    ]

    events = []
    lines = gameplay_notes.split('\n')

    for line in lines:
        if any(keyword in line.lower() for keyword in quest_keywords):
            events.append({
                'text': line,
                'type': 'quest_event',
                'requires_review': True
            })

    return events
```

**Benefits:**
- ✅ Automatically discovers new entities from gameplay
- ✅ Updates PC knowledge sections with session discoveries
- ✅ Maintains entity database from actual play
- ✅ Wikifies gameplay notes for easy cross-referencing
- ✅ Tracks quest progression automatically
- ✅ Reduces manual data entry after sessions

## 🛠️ TECHNICAL IMPLEMENTATION NOTES

### API Calls Required

**For Wikilink Reconstruction:**
```python
def fetch_page_title(notion_client, page_id):
    """Fetch page title from Notion given page_id"""
    page = notion_client.pages.retrieve(page_id=page_id)
    # Extract title from page properties
    title_prop = page['properties'].get('name') or page['properties'].get('Name')
    if title_prop and title_prop['type'] == 'title':
        return title_prop['title'][0]['plain_text']
    return None
```

**For Recursive Block Fetching:**
```python
def fetch_all_children(notion_client, block_id):
    """Recursively fetch all children of a block"""
    children = []
    cursor = None

    while True:
        response = notion_client.blocks.children.list(
            block_id=block_id,
            start_cursor=cursor
        )
        children.extend(response['results'])

        if not response['has_more']:
            break
        cursor = response['next_cursor']

    return children
```

### State Tracking During Conversion

**List Counter State:**
```python
class MarkdownConverter:
    def __init__(self):
        self.list_counters = {}  # {nesting_level: counter}
        self.prev_block_type = None
        self.indent_level = 0

    def process_numbered_list_item(self, block):
        # Get or increment counter for current indent level
        if self.prev_block_type != 'numbered_list_item':
            self.list_counters[self.indent_level] = 1
        else:
            self.list_counters[self.indent_level] += 1

        num = self.list_counters[self.indent_level]
        text = self.get_text(block['numbered_list_item'])
        return f"{num}. {text}"
```

### Merge Strategy

**Approach 1: Full Replacement (Current - Dangerous)**
- Wipes out local file entirely
- Replaces with Notion content
- Loses all formatting/whitespace
- **DO NOT USE**

**Approach 2: Smart Merge (Recommended)**
- Detect new sections added in Notion
- Append new sections to local file
- Preserve existing sections unchanged
- Use section headings as merge points

**Approach 3: Git-Style 3-Way Merge**
- Track "last synced" state
- Compare: local file, Notion content, last synced state
- Merge changes from both sides
- Flag conflicts if both sides changed same section

**Recommendation:** Start with Approach 2 (smart merge), upgrade to Approach 3 later if needed

---

## 📁 FILES INVOLVED

**Files to Modify:**
- `.config/pull_session_notes.py` (295 lines) - Primary changes here
- `.config/notion_helpers.py` - May need new helper functions

**Files to Reference:**
- `sync_notion.py` (702 lines) - Copy working logic from here
- `.working/Session_3_Notion_Pull.md` - Test case (corrupted version)
- `Sessions/Session_3_The_Steel_Dragon_Begins.md` (git HEAD) - Test case (correct version)

**Files to Create:**
- `.config/notion_to_markdown.py` - Shared conversion functions (extracted from pull_session_notes.py)
- `tests/test_notion_sync.py` - Automated test suite for round-trip validation

---

## 🎯 SUCCESS CRITERIA

**Definition of Done:**

1. ✅ All 10 feature parity requirements implemented
2. ✅ All 5 test cases pass with zero diff
3. ✅ Round-trip test: `sync_notion.py` → Notion → `pull_session_notes.py` produces identical file
4. ✅ Session 3 gameplay notes merge cleanly without any corruption
5. ✅ Zero regressions in existing sync_notion.py functionality
6. ✅ Documentation updated with new capabilities
7. ✅ DEFERRED_MODULES.md successfully created from Session 3

**Failure is NOT acceptable if:**
- Any wikilinks are lost or corrupted
- Any list numbering is broken
- Any frontmatter format is changed
- Any existing content is modified during append operation
- Any round-trip test produces a diff

---

## 🚀 NEXT STEPS

**For Next Thread (Fresh Context):**

1. Read this attack plan document
2. Implement Priority 1 features (wikilinks, formatting, list numbering)
3. Test against Session 3 Notion pull
4. Iterate until all test cases pass
5. Implement Priority 2 features (frontmatter, toggles, code blocks)
6. Implement Priority 3 features (whitespace, blockquotes, nesting)
7. Run full round-trip validation
8. Merge Session 3 gameplay notes cleanly
9. Extract deferred modules from Session 3
10. Resume session planning workflow

**Files to Carry Forward:**
- This attack plan: `.working/NOTION_BIDIRECTIONAL_SYNC_PLAN.md`
- Test case (corrupted): `.working/Session_3_Notion_Pull.md`
- Test case (correct): `Sessions/Session_3_The_Steel_Dragon_Begins.md` (git HEAD)

---

**END OF ATTACK PLAN**
