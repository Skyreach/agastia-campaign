#!/usr/bin/env python3
"""
Entity Discovery and Database Builder

Scans the campaign repository to build a comprehensive entity database
that can be used for wikilink reconstruction during Notion sync.

Features:
- Scans WIKI_INDEX.md for all known entities
- Scans all .md files for wikilinks
- Generates entity variants (e.g., "Kyle/Nameless" → ["Kyle", "Nameless"])
- Tracks Notion IDs for bidirectional sync
- Outputs to .config/entity_database.json

Usage:
    python3 discover_entities.py --build     # Build database from scratch
    python3 discover_entities.py --update    # Update with new entities
    python3 discover_entities.py --validate  # Check for orphaned entities
"""

import re
import json
import argparse
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Set, Optional


def get_campaign_root() -> Path:
    """Get campaign root directory."""
    return Path(__file__).parent.parent


def extract_entities_from_wiki_index(wiki_index_path: Path) -> Dict[str, dict]:
    """
    Parse WIKI_INDEX.md to extract all entities with their metadata.

    Returns:
        Dict mapping entity names to metadata (file path, notion_id, type)
    """
    entities = {}

    if not wiki_index_path.exists():
        print(f"⚠️  WIKI_INDEX.md not found at {wiki_index_path}")
        return entities

    content = wiki_index_path.read_text()

    # Track current section to determine entity type
    current_type = None

    # Parse table rows: | Name | File Path | Notion ID |
    for line in content.split('\n'):
        # Detect section headers to track entity type
        if line.startswith('## Player Characters'):
            current_type = 'PC'
        elif line.startswith('### Major NPCs'):
            current_type = 'NPC_Major'
        elif line.startswith('### Faction NPCs'):
            current_type = 'NPC_Faction'
        elif line.startswith('### Location NPCs'):
            current_type = 'NPC_Location'
        elif line.startswith('### Mystery NPCs'):
            current_type = 'NPC_Mystery'
        elif line.startswith('## Factions'):
            current_type = 'Faction'
        elif line.startswith('## Locations'):
            current_type = 'Location'
        elif line.startswith('## Quests'):
            current_type = 'Quest'
        elif line.startswith('## Sessions'):
            current_type = 'Session'
        elif line.startswith('## Campaign Core'):
            current_type = 'Core'

        # Parse table rows
        if '|' in line and not line.startswith('|--'):
            parts = [p.strip() for p in line.split('|')]
            # Valid table row: | Name | File Path | Notion ID |
            if len(parts) >= 4 and parts[1] and parts[2] and not parts[1].startswith('Name'):
                entity_name = parts[1]
                file_path = parts[2].strip('`')
                notion_id = parts[3]

                entities[entity_name] = {
                    'file': file_path,
                    'notion_id': notion_id,
                    'type': current_type or 'Unknown',
                    'variants': generate_entity_variants(entity_name)
                }

    return entities


def generate_entity_variants(entity_name: str) -> List[str]:
    """
    Generate all variants of an entity name for matching.

    Examples:
        "Kyle/Nameless" → ["Kyle/Nameless", "Kyle", "Nameless"]
        "Ian/Rakash" → ["Ian/Rakash", "Ian", "Rakash"]
        "Manny" → ["Manny"]
        "Geist" → ["Geist"]
    """
    variants = [entity_name]  # Always include full name

    # Split on slash to get nickname variants
    if '/' in entity_name:
        parts = entity_name.split('/')
        variants.extend(parts)

    # Split on parentheses to get base name without descriptor
    # Example: "Decum (Subject #10)" → ["Decum (Subject #10)", "Decum"]
    if '(' in entity_name:
        base_name = entity_name.split('(')[0].strip()
        variants.append(base_name)

    # Remove duplicates while preserving order
    seen = set()
    unique_variants = []
    for v in variants:
        if v not in seen:
            seen.add(v)
            unique_variants.append(v)

    return unique_variants


def scan_files_for_wikilinks(root_dir: Path) -> Set[str]:
    """
    Scan all .md files for wikilinks [[Entity Name]].

    Returns:
        Set of all unique entity names found in wikilinks
    """
    wikilinks = set()

    # Pattern: [[Entity Name]] or [[Entity Name#Section]]
    wikilink_pattern = re.compile(r'\[\[([^\]#]+)(?:#[^\]]+)?\]\]')

    # Scan all .md files
    for md_file in root_dir.rglob('*.md'):
        # Skip .claude directory and .working directory
        if '.claude' in str(md_file) or '.working' in str(md_file):
            continue

        try:
            content = md_file.read_text()
            matches = wikilink_pattern.findall(content)
            wikilinks.update(matches)
        except Exception as e:
            print(f"⚠️  Error reading {md_file}: {e}")

    return wikilinks


def detect_new_entities(
    known_entities: Dict[str, dict],
    discovered_wikilinks: Set[str]
) -> List[str]:
    """
    Find wikilinks that aren't in the known entity database.

    Args:
        known_entities: Entities from WIKI_INDEX.md
        discovered_wikilinks: All wikilinks found in .md files

    Returns:
        List of new entity names not yet in database
    """
    new_entities = []

    # Build set of all known variants
    known_variants = set()
    for entity_data in known_entities.values():
        known_variants.update(entity_data['variants'])

    # Check each discovered wikilink
    for wikilink in discovered_wikilinks:
        if wikilink not in known_variants:
            new_entities.append(wikilink)

    return sorted(new_entities)


def build_entity_database(
    wiki_entities: Dict[str, dict],
    discovered_wikilinks: Set[str]
) -> dict:
    """
    Build complete entity database combining WIKI_INDEX and discovered wikilinks.

    Returns:
        Database dict with:
        - entities: Dict of all entities with metadata
        - new_entities: List of entities found but not in WIKI_INDEX
        - last_updated: Timestamp
    """
    database = {
        'entities': wiki_entities.copy(),
        'last_updated': datetime.now(timezone.utc).isoformat(),
        'source': 'discover_entities.py'
    }

    # Detect new entities not in WIKI_INDEX
    new_entities = detect_new_entities(wiki_entities, discovered_wikilinks)

    # Add new entities to database (with placeholder metadata)
    for entity_name in new_entities:
        database['entities'][entity_name] = {
            'file': None,  # Unknown - needs manual mapping
            'notion_id': None,  # Unknown - needs sync
            'type': 'Discovered',
            'variants': generate_entity_variants(entity_name),
            'discovered_from': 'wikilink_scan'
        }

    database['new_entities_count'] = len(new_entities)

    return database


def save_entity_database(database: dict, output_path: Path):
    """Save entity database to JSON file."""
    output_path.write_text(json.dumps(database, indent=2))
    print(f"✅ Entity database saved to {output_path}")


def load_entity_database(db_path: Path) -> Optional[dict]:
    """Load existing entity database."""
    if not db_path.exists():
        return None

    try:
        return json.loads(db_path.read_text())
    except Exception as e:
        print(f"⚠️  Error loading database: {e}")
        return None


def print_database_stats(database: dict):
    """Print statistics about the entity database."""
    total_entities = len(database['entities'])
    new_entities = database.get('new_entities_count', 0)

    # Count by type
    type_counts = {}
    for entity_data in database['entities'].values():
        entity_type = entity_data.get('type', 'Unknown')
        type_counts[entity_type] = type_counts.get(entity_type, 0) + 1

    print("\n" + "="*80)
    print("📊 ENTITY DATABASE STATISTICS")
    print("="*80)
    print(f"Total Entities: {total_entities}")
    print(f"New Entities (not in WIKI_INDEX): {new_entities}")
    print(f"Last Updated: {database['last_updated']}")
    print("\nBreakdown by Type:")
    for entity_type, count in sorted(type_counts.items()):
        print(f"  {entity_type}: {count}")
    print("="*80 + "\n")


def validate_database(database: dict, campaign_root: Path):
    """
    Validate entity database for orphaned entities or missing files.
    """
    print("\n🔍 VALIDATING ENTITY DATABASE...\n")

    issues = []

    for entity_name, entity_data in database['entities'].items():
        file_path = entity_data.get('file')

        # Check if file exists
        if file_path:
            full_path = campaign_root / file_path
            if not full_path.exists():
                issues.append(f"❌ {entity_name}: File not found - {file_path}")

        # Check for missing Notion ID
        if not entity_data.get('notion_id'):
            if entity_data.get('type') != 'Discovered':
                issues.append(f"⚠️  {entity_name}: Missing Notion ID")

    if issues:
        print("Issues Found:")
        for issue in issues[:20]:  # Limit output
            print(f"  {issue}")
        if len(issues) > 20:
            print(f"  ... and {len(issues) - 20} more issues")
    else:
        print("✅ Database validation passed - no issues found")

    print()


def main():
    parser = argparse.ArgumentParser(description='Build and maintain entity database')
    parser.add_argument('--build', action='store_true', help='Build database from scratch')
    parser.add_argument('--update', action='store_true', help='Update database with new entities')
    parser.add_argument('--validate', action='store_true', help='Validate database for issues')

    args = parser.parse_args()

    campaign_root = get_campaign_root()
    wiki_index_path = campaign_root / 'WIKI_INDEX.md'
    db_path = campaign_root / '.config' / 'entity_database.json'

    print("🔍 Entity Discovery and Database Builder")
    print(f"📁 Campaign Root: {campaign_root}")
    print()

    if args.build or args.update:
        print("📖 Step 1: Parsing WIKI_INDEX.md...")
        wiki_entities = extract_entities_from_wiki_index(wiki_index_path)
        print(f"   Found {len(wiki_entities)} entities in WIKI_INDEX.md")

        print("\n🔎 Step 2: Scanning .md files for wikilinks...")
        discovered_wikilinks = scan_files_for_wikilinks(campaign_root)
        print(f"   Found {len(discovered_wikilinks)} unique wikilinks")

        print("\n🏗️  Step 3: Building entity database...")
        database = build_entity_database(wiki_entities, discovered_wikilinks)

        print_database_stats(database)

        print("💾 Step 4: Saving database...")
        save_entity_database(database, db_path)

        if database.get('new_entities_count', 0) > 0:
            print("\n⚠️  New entities discovered (not in WIKI_INDEX.md):")
            for entity_name, entity_data in database['entities'].items():
                if entity_data.get('discovered_from') == 'wikilink_scan':
                    print(f"  - {entity_name}")

    elif args.validate:
        database = load_entity_database(db_path)
        if not database:
            print("❌ No database found. Run with --build first.")
            return

        validate_database(database, campaign_root)

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
