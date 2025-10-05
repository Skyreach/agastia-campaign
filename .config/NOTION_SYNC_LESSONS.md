# Notion Sync Lessons Learned

## Critical Rules for Notion Content Syncing

### 1. Content Must Be Synced, Not Just Properties
**Problem:** Initial `sync_notion.py` only synced frontmatter properties.
**Solution:** Added `markdown_to_notion_blocks()` to convert markdown content to Notion blocks.
**Lesson:** User reads content from Notion, not GitHub. Properties alone are useless.

### 2. HTML Doesn't Render in Notion
**Problem:** Used HTML `<details>/<summary>` tags for collapsible sections.
**Solution:** Convert to Notion native toggle blocks.
**Lesson:** Notion is not a markdown renderer. Use Notion's native block types.

### 3. Markdown Formatting Requires Annotations
**Problem:** `**bold**` and `*italic*` rendered as literal text.
**Solution:** Parse markdown formatting into Notion `annotations` (bold, italic, code).
**Lesson:** Notion rich_text needs explicit annotation objects, not markdown syntax.

### 4. Large Re-syncs Are Expensive
**Problem:** Deleting 267 blocks and re-adding them times out and wastes quota.
**Solution:** Ask user to delete Notion page content first for fresh sync.
**Lesson:** When making major formatting changes, manual deletion saves quota/time.

### 5. Mermaid Diagrams Use Code Blocks
**Problem:** Uncertain how to sync mermaid flowcharts.
**Solution:** Use Notion code blocks with `language: 'plain text'` (Notion renders mermaid).
**Lesson:** Notion can render mermaid, but syntax must be code block format.

---

## Sync Script Format Rules

### Supported Markdown → Notion Conversions

| Markdown | Notion Block Type | Notes |
|----------|------------------|-------|
| `# Header` | `heading_1` | With rich_text parsing |
| `## Header` | `heading_2` | With rich_text parsing |
| `### Header` | `heading_3` | With rich_text parsing |
| `**bold**` | Annotation: `bold: true` | Inline formatting |
| `*italic*` | Annotation: `italic: true` | Inline formatting |
| `` `code` `` | Annotation: `code: true` | Inline formatting |
| `> Quote` | `quote` | Blockquote |
| `- List item` | `bulleted_list_item` | Unordered list |
| `1. List item` | `numbered_list_item` | Ordered list |
| ` ```code``` ` | `code` | Code block |
| `<details><summary>` | `toggle` | Collapsible section |
| `---` | (skip) | Horizontal rule not needed |

### NOT Supported (Skipped)
- Raw HTML tags (except `<details>/<summary>`)
- Horizontal rules (`---`)
- Tables (requires different approach)
- Images (requires upload API)

---

## Current Sync Status (2025-10-05)

### ✅ Properly Formatted
- Session 1 - Ratterdan Investigation (37 blocks, toggles, bold formatting)

### ⚠️ OLD FORMATTING (needs re-sync)
**High Priority:**
- Session 0 (100 blocks, likely has raw HTML)
- All PCs with content (5 entries, 67-100 blocks each)
- All Factions (4 entries, 43-100 blocks each)
- All Locations (8 entries, 61-100 blocks each)
- All Artifacts with content (3 entries, 100 blocks each)
- Major NPCs (3 entries: Patron, Steel Dragon, Professor Zero)

**Total pages needing re-sync:** ~24 pages

### ❌ EMPTY (needs first sync)
- 10 Decimate Project NPCs (including Octavia - Session 1 villain!)
- 7 Resource files (tables, hooks, guides)
- 1 Artifact (Animated Heartstone)
- 10 duplicate PC entries (old naming format - should DELETE)

**Total empty pages:** 28 pages (10 duplicates should be deleted)

---

## Re-sync Strategy

### Option 1: Full Re-sync (Quota Intensive)
```bash
# Re-sync all markdown files (will timeout on large pages)
python3 sync_notion.py all
```
**Cost:** High quota usage, long runtime, many timeouts

### Option 2: User-Assisted Incremental Re-sync
**Process:**
1. User deletes content from Notion page (keeps properties)
2. Run sync for that specific file
3. Repeat for each high-priority page

**Cost:** Low quota, fast, reliable

**High Priority Order:**
1. Session 0 (needed for campaign reference)
2. Decimate Project NPCs (Octavia needed for Session 1)
3. PCs (party reference)
4. Major NPCs (Patron, Steel Dragon, Professor Zero)
5. Factions (campaign context)
6. Locations (as needed for sessions)

### Option 3: Hybrid Approach
1. DELETE duplicate PC entries entirely (10 pages)
2. Sync empty pages first (low cost, no deletion needed)
3. User-assisted re-sync for large pages with old formatting

---

## MCP Server Integration

### Current Status
- MCP server has `sync_notion` tool but doesn't enforce content syncing
- File watcher monitors changes but uses old sync script
- Pre-commit hook syncs on git commits

### Needed Updates
1. **Update MCP `sync_notion` tool** to use new formatting parser
2. **Update file watcher** to use new sync script
3. **Add sync validation** to verify content blocks exist
4. **Document quota costs** for different sync operations

### File Watcher Config
Location: `.config/file_watcher.py` or similar
**Needs:** Integration with new `sync_notion.py` formatting

---

## Quota Management Lessons

### High Cost Operations
- Deleting individual blocks (1 API call per block)
- Re-syncing large pages (100+ blocks = 100+ calls)
- Batch operations that timeout

### Low Cost Operations
- Syncing new empty pages (1 create + batch block adds)
- User-assisted deletion (Notion UI, no API calls)
- Small page updates

### Best Practices
1. **Ask user to delete** large page content before re-sync
2. **Batch block additions** (max 100 per request)
3. **Skip re-sync** if content hasn't changed (future optimization)
4. **Incremental updates** instead of full replacement (future feature)

---

## Resources Directory Exclusion

**Decision:** `Resources/**` directory is **EXCLUDED** from Notion sync.

**Rationale:**
- Resources are reference material for **content creation** (GM guides, tables, frameworks)
- User reads **campaign content** from Notion, not reference material
- Resources are for assistant use when building content
- Including them clutters the Notion database with non-entity content

**Sync Patterns (Updated):**
```python
sync_mappings = [
    ('Player_Characters/**/*.md', 'PC'),
    ('NPCs/**/*.md', 'NPC'),
    ('Factions/**/*.md', 'Faction'),
    ('Locations/**/*.md', 'Location'),
    # Resources excluded - reference material for content generation, not table use
    ('Campaign_Core/**/*.md', 'Artifact'),
    ('Sessions/**/*.md', 'Session'),
]
```

## Action Items

- [x] Delete 10 duplicate PC entries from Notion (archived all 48 old pages)
- [x] Re-sync Session 0 with proper formatting (fresh sync completed)
- [x] Sync all empty Decimate Project NPCs (8 individual files created + synced)
- [x] Sync empty Artifacts (Heartstone, Codex, Axe, Campaign Overview synced)
- [x] Fresh sync with proper formatting (36 pages total)
- [x] Document Resources exclusion
- [ ] Update MCP server sync tool to use new formatting
- [ ] Update file watcher to use new sync script
- [ ] Optimize pre-commit hook to skip already-synced files
