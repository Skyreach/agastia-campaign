#!/usr/bin/env python3
"""
Format Compliance Check Script

Validates entity file format compliance against ENTITY_FORMAT_SPECS.md
Used by pre-commit hook to enforce format standards
"""

import sys
import re
import pathlib
from typing import Dict, List, Tuple

# Entity type specifications (matches format-validator MCP)
ENTITY_SPECS = {
    'PC': {
        'required_frontmatter': ['name', 'type', 'player', 'race', 'class', 'level', 'status', 'version', 'tags'],
        'required_sections': ['Player Summary', 'Basic Information', 'Appearance', 'Known Personality Traits',
                             'Current Goals', 'Relationships', 'Special Items & Abilities', 'Session History'],
        'status_values': ['Active', 'Inactive', 'Dead']
    },
    'NPC': {
        'required_frontmatter': ['name', 'type', 'status', 'version', 'tags'],
        'required_sections': ['Player Summary', 'Basic Information', 'Known Activities',
                             'Personality & Behavior', 'Relationships', 'DM Notes'],
        'status_values': ['Active', 'Inactive', 'Dead', 'Unknown']
    },
    'Faction': {
        'required_frontmatter': ['name', 'type', 'version', 'status', 'tags', 'related_entities'],
        'required_sections': ['Player Summary', 'DM Notes', 'Overview', 'Key Members',
                             'Goals & Progress Clocks', 'Operations', 'Relationships', 'Future Hooks', 'Secrets'],
        'status_values': ['Active', 'Dissolved', 'Hidden']
    },
    'Location': {
        'required_frontmatter': ['name', 'type', 'location_type', 'status', 'version', 'tags'],
        'required_sections': ['Player Summary', 'Basic Information', 'Geography & Features',
                             'Notable Residents', 'DM Notes', 'Hidden Features', 'Encounters',
                             'Factions Present', 'Plot Hooks'],
        'status_values': ['Active', 'Destroyed', 'Abandoned', 'Accessible'],
        'location_types': ['City', 'District', 'Region', 'Town', 'Wilderness', 'Dungeon']
    },
    'Quest': {
        'required_frontmatter': ['name', 'type', 'quest_type', 'status', 'version', 'tags', 'location', 'related_entities'],
        'required_sections': ['Player Summary', 'Basic Information', 'Objectives', 'Quest Structure',
                             'DM Notes', 'Hidden Information', 'Alternative Approaches', 'Consequences'],
        'status_values': ['Available', 'Active', 'Completed', 'Failed'],
        'quest_types': ['Mission', 'Travel', 'Mixed']
    },
    'Artifact': {
        'required_frontmatter': ['name', 'type', 'status', 'version', 'tags', 'related_entities'],
        'required_sections': ['Player Summary', 'Basic Information', 'Known Properties', 'Legends & Lore',
                             'DM Notes', 'True Properties', 'History', 'Corruption/Curse', 'Plot Significance'],
        'status_values': ['Lost', 'Found', 'Destroyed', 'Wielded']
    },
    'Item': {
        'required_frontmatter': ['name', 'type', 'item_type', 'rarity', 'version', 'tags'],
        'required_sections': ['Description', 'Properties', 'Mechanical Effects'],
        'status_values': [],
        'item_types': ['Weapon', 'Armor', 'Consumable', 'Tool', 'Treasure'],
        'rarity_levels': ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary']
    }
}

# Forbidden HTML patterns
FORBIDDEN_HTML = [
    r'<details>',
    r'</details>',
    r'<summary>',
    r'</summary>',
    r'<div>',
    r'</div>',
    r'<span>',
    r'</span>',
    r'<br>',
    r'<br/>',
    r'style\s*='
]

def parse_frontmatter(content: str) -> Dict:
    """Extract YAML frontmatter from content"""
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # Handle arrays
            if value.startswith('[') and value.endswith(']'):
                value = [v.strip() for v in value[1:-1].split(',')]
            # Handle quoted strings
            elif (value.startswith('"') and value.endswith('"')) or \
                 (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]

            frontmatter[key] = value

    return frontmatter

def extract_sections(content: str) -> List[str]:
    """Extract section headings from content"""
    sections = []
    for line in content.split('\n'):
        # H2 and H3 headings
        match = re.match(r'^##\s+(.+)$', line)
        if match:
            sections.append(match.group(1).strip())
        match = re.match(r'^###\s+(.+)$', line)
        if match:
            sections.append(match.group(1).strip())
    return sections

def detect_entity_type(file_path: str, frontmatter: Dict) -> str:
    """Detect entity type from file path and frontmatter"""
    path = pathlib.Path(file_path)

    # Check frontmatter type field first
    if frontmatter and 'type' in frontmatter:
        return frontmatter['type']

    # Infer from directory
    if 'Player_Characters' in path.parts:
        return 'PC'
    elif 'NPCs' in path.parts:
        return 'NPC'
    elif 'Factions' in path.parts:
        return 'Faction'
    elif 'Locations' in path.parts:
        return 'Location'
    elif 'Quests' in path.parts:
        return 'Quest'
    elif 'Campaign_Core' in path.parts and path.stem.startswith('Artifact_'):
        return 'Artifact'
    elif 'Items' in path.parts:
        return 'Item'

    return 'Unknown'

def validate_file(file_path: str) -> Tuple[bool, List[str], List[str]]:
    """
    Validate a single entity file

    Returns:
        (is_valid, errors, warnings)
    """
    errors = []
    warnings = []

    try:
        content = pathlib.Path(file_path).read_text()
    except Exception as e:
        errors.append(f"Failed to read file: {e}")
        return False, errors, warnings

    # 1. Check frontmatter exists
    frontmatter = parse_frontmatter(content)
    if not frontmatter:
        errors.append("No YAML frontmatter found (must start with --- and end with ---)")
        return False, errors, warnings

    # 2. Detect entity type
    entity_type = detect_entity_type(file_path, frontmatter)
    if entity_type == 'Unknown':
        warnings.append(f"Could not detect entity type from path: {file_path}")
        return True, errors, warnings  # Not an error, just can't validate further

    if entity_type not in ENTITY_SPECS:
        warnings.append(f"Unknown entity type: {entity_type}")
        return True, errors, warnings

    spec = ENTITY_SPECS[entity_type]

    # 3. Check required frontmatter fields
    for field in spec['required_frontmatter']:
        if field not in frontmatter:
            errors.append(f"Missing required frontmatter field: {field}")

    # 4. Validate frontmatter values
    if 'type' in frontmatter and frontmatter['type'] != entity_type:
        errors.append(f"Frontmatter type '{frontmatter['type']}' doesn't match expected type '{entity_type}'")

    if 'status' in frontmatter and spec['status_values']:
        if frontmatter['status'] not in spec['status_values']:
            errors.append(f"Invalid status value '{frontmatter['status']}'. Must be one of: {', '.join(spec['status_values'])}")

    if 'version' in frontmatter:
        if not re.match(r'^\d+\.\d+\.\d+$', frontmatter['version']):
            errors.append(f"Invalid version format '{frontmatter['version']}'. Must be semantic versioning (X.Y.Z)")
    else:
        warnings.append("Missing version field - recommended for tracking changes")

    # Entity-specific validation
    if entity_type == 'Location' and 'location_type' in frontmatter:
        if frontmatter['location_type'] not in spec['location_types']:
            errors.append(f"Invalid location_type '{frontmatter['location_type']}'. Must be one of: {', '.join(spec['location_types'])}")

    if entity_type == 'Quest' and 'quest_type' in frontmatter:
        if frontmatter['quest_type'] not in spec['quest_types']:
            errors.append(f"Invalid quest_type '{frontmatter['quest_type']}'. Must be one of: {', '.join(spec['quest_types'])}")

    if entity_type == 'Item' and 'rarity' in frontmatter:
        if frontmatter['rarity'] not in spec['rarity_levels']:
            errors.append(f"Invalid rarity '{frontmatter['rarity']}'. Must be one of: {', '.join(spec['rarity_levels'])}")

    # 5. Check H1 title exists
    h1_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    if not h1_match:
        errors.append("No H1 title found (must have exactly one # heading)")
    elif 'name' in frontmatter and h1_match.group(1).strip() != frontmatter['name']:
        warnings.append(f"H1 title '{h1_match.group(1).strip()}' doesn't match frontmatter name '{frontmatter['name']}'")

    # 6. Check required sections
    sections = extract_sections(content)
    for required_section in spec['required_sections']:
        if not any(required_section in s for s in sections):
            errors.append(f"Missing required section: {required_section}")

    # 7. Check for forbidden HTML
    for pattern in FORBIDDEN_HTML:
        if re.search(pattern, content, re.IGNORECASE):
            errors.append(f"Contains forbidden HTML tag: {pattern}. Use Notion toggles instead (**Toggle: Title**)")
            break  # Only report once

    # 8. Information firewall check
    has_player_summary = any('Player Summary' in s for s in sections)
    has_dm_notes = any('DM Notes' in s for s in sections)

    if has_dm_notes and not has_player_summary:
        warnings.append("Has DM Notes but no Player Summary - consider adding player-facing content")

    # 9. Check tags are lowercase
    if 'tags' in frontmatter and isinstance(frontmatter['tags'], list):
        uppercase_tags = [tag for tag in frontmatter['tags'] if any(c.isupper() for c in str(tag))]
        if uppercase_tags:
            warnings.append(f"Tags should be lowercase with hyphens: {', '.join(uppercase_tags)}")

    is_valid = len(errors) == 0
    return is_valid, errors, warnings

def main():
    """Main entry point for format compliance check"""
    if len(sys.argv) < 2:
        print("Usage: format_compliance_check.py <file1.md> [file2.md] ...")
        sys.exit(1)

    files = sys.argv[1:]
    total_errors = 0
    total_warnings = 0
    failed_files = []

    for file_path in files:
        # Skip non-markdown files
        if not file_path.endswith('.md'):
            continue

        # Skip excluded paths (infrastructure docs)
        if '.config/' in file_path or 'README.md' in file_path or 'CLAUDE.md' in file_path:
            continue

        is_valid, errors, warnings = validate_file(file_path)

        if errors:
            failed_files.append(file_path)
            print(f"\n❌ {file_path}")
            for error in errors:
                print(f"   ERROR: {error}")
                total_errors += 1

        if warnings:
            print(f"\n⚠️  {file_path}")
            for warning in warnings:
                print(f"   WARNING: {warning}")
                total_warnings += 1

    # Summary
    print("\n" + "=" * 60)
    if total_errors == 0 and total_warnings == 0:
        print("✅ FORMAT COMPLIANCE CHECK PASSED")
        print(f"   {len(files)} files validated, no issues found")
        sys.exit(0)
    else:
        if total_errors > 0:
            print(f"❌ FORMAT COMPLIANCE CHECK FAILED")
            print(f"   {total_errors} errors found in {len(failed_files)} files")
            print(f"\nFailed files:")
            for file_path in failed_files:
                print(f"   • {file_path}")

        if total_warnings > 0:
            print(f"\n⚠️  {total_warnings} warnings (non-blocking)")

        print(f"\n📋 See: .config/ENTITY_FORMAT_SPECS.md for format requirements")
        print(f"📋 Run: .config/auto_fix_format.py <file> to auto-repair common issues")

        sys.exit(1 if total_errors > 0 else 0)

if __name__ == '__main__':
    main()
