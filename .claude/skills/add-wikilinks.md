---
skill_name: add-wikilinks
description: Automatically detect and add wikilinks to entity mentions in markdown files
version: 1.0.0
---

# Add Wikilinks Skill

Automatically scan markdown files for entity mentions and add [[wikilinks]] for Notion cross-referencing.

## Usage

Invoke this skill to:
1. Scan a file for mentions of entities tracked in WIKI_INDEX.md
2. Automatically wrap entity names in [[wikilinks]]
3. Preview changes before applying (dry-run mode)
4. Batch process multiple files

## Arguments

- `file_path` (required): Path to markdown file to process
- `--dry-run` (optional): Preview changes without modifying file
- `--batch` (optional): Process multiple files (glob pattern)

## Implementation

This skill uses `.config/add_wikilinks.py` to:

1. **Load Entity Database**
   - Read all entity names from WIKI_INDEX.md
   - Extract from markdown tables (Name column)
   - Build searchable entity list (77+ entities)

2. **Smart Detection**
   - Sort entities by length (longest first) to avoid partial matches
   - Example: "Merchant District" matched before "Merchant"
   - Skip entities already wikilinked `[[Entity]]`
   - Skip markdown links `[text](url)`

3. **Frontmatter Protection**
   - Detect YAML frontmatter (`---` ... `---`)
   - Only add wikilinks to body content
   - Preserve frontmatter without modification

4. **Pattern Matching**
   - Whole word boundaries only (`\b`)
   - Not preceded by `[[` or `](`
   - Not followed by `]]` or `)`
   - Case-sensitive matching

## Examples

**Single File:**
```
User: /add-wikilinks Sessions/Session_3_The_Steel_Dragon_Begins.md
Output:
📋 Loaded 77 entity names from WIKI_INDEX.md
  ✓ Added 5x [[Geist]]
  ✓ Added 4x [[Steel Dragon]]
  ✓ Added 3x [[Agastia]]
  ✓ Added 2x [[Merchant District]]

✅ Added 19 wikilinks to Sessions/Session_3_The_Steel_Dragon_Begins.md
```

**Dry Run:**
```
User: /add-wikilinks Locations/Cities/Agastia_City.md --dry-run
Output:
🔍 DRY RUN MODE - No files will be modified

📋 Loaded 77 entity names from WIKI_INDEX.md
  ✓ Added 9x [[Agastia]]
  ✓ Added 5x [[Chaos Cult]]
  ✓ Added 4x [[Brightcoin Emergency Supplies]]
  ... (50 more)

📊 DRY RUN: Would add 54 wikilinks to Locations/Cities/Agastia_City.md
```

**Batch Processing:**
```
User: /add-wikilinks --batch "Sessions/*.md"
Output:
Processing 4 files...

[Session_0_Character_Creation.md]
📋 Loaded 77 entity names
  ✓ Added 12 wikilinks

[Session_1_Caravan_to_Ratterdan.md]
📋 Loaded 77 entity names
  ✓ Added 23 wikilinks

[Session_2_Road_to_Agastia.md]
📋 Loaded 77 entity names
  ✓ Added 31 wikilinks

[Session_3_The_Steel_Dragon_Begins.md]
⏭️  No wikilinks needed (already done)

✅ Batch complete: 66 wikilinks added across 3 files
```

## Protocol

1. **Before Running:**
   - Ensure WIKI_INDEX.md is up to date
   - Consider dry-run mode for large files
   - Back up files if processing many at once

2. **After Running:**
   - Review changes (especially first few times)
   - Re-sync file to Notion with `sync_notion.py`
   - Verify wikilinks work in Notion

3. **Best Practices:**
   - Run on new/updated files before committing
   - Use dry-run first on critical files
   - Process session files before entity files
   - Re-run after updating WIKI_INDEX.md

## Source Data

- **Entity List:** WIKI_INDEX.md (70+ entities)
- **Script:** `.config/add_wikilinks.py`
- **Validation:** Cross-references `.notion_sync_state.json`

## Automation

This skill can be integrated into:
- Pre-commit hooks (auto-link before sync)
- CI/CD pipelines (validate wikilinks)
- File watchers (auto-link on save)

## Limitations

- Only detects exact entity name matches
- Doesn't handle aliases or alternative names
- Skips entities in code blocks (\`code\`)
- Skips entities in inline code
- Frontmatter fields never get wikilinks

## Future Enhancements

- Support entity aliases (e.g., "Nameless" → "Kyle")
- Detect missing entities (mentioned but not in WIKI_INDEX)
- Suggest entity creation for unlinked mentions
- Integration with entity validation tools
