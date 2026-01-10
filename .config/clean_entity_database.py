#!/usr/bin/env python3
"""
Clean Entity Database - Remove Spurious Entities

Filters out invalid entities that were picked up from:
- Code examples in documentation
- Template files
- Common words that shouldn't be wikilinked
- Invalid wikilink formats

Usage:
    python3 clean_entity_database.py --dry-run  # Show what would be removed
    python3 clean_entity_database.py            # Apply cleanup
"""

import json
import argparse
from pathlib import Path
import re


# Common words that should NEVER be entities
STOPWORDS = {
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',  # Numbers
    'get', 'set', 'the', 'a', 'an', 'and', 'or', 'but', 'not',  # Common verbs/articles
    'city', 'town', 'village', 'district', 'location',  # Generic location words
    'npc', 'pc', 'dm', 'class', 'level',  # Game terms that are generic
    'page name', 'entity name', 'name', 'string',  # Template placeholders
    ':word:', 'word',  # Documentation examples
    'prototype', 'nonexistent',  # Test/example values
    # Generic descriptive phrases (too broad to wikify)
    'merchant caravan', 'merchant district', 'dock district', 'scholar quarter',
    'noble quarter', 'geist investigation', 'quest geist investigation',
    'quest missing person investigation',
}

# Invalid patterns (regex)
INVALID_PATTERNS = [
    r'^\d+$',  # Pure numbers
    r'^[^a-zA-Z]+$',  # No letters at all
    r'\[\[',  # Contains wikilink syntax itself
    r'^\w$',  # Single character
    r'^[a-z]',  # Starts with lowercase (proper entities should be capitalized)
    r'[\[\]<>{}]',  # Contains brackets or other markup
    r'^".*"$',  # Quoted strings from code
    r'[,;:]',  # Contains punctuation mid-word
]


def is_valid_entity(entity_name: str) -> tuple[bool, str]:
    """
    Check if an entity name is valid.

    Returns:
        (is_valid, reason_if_invalid)
    """
    # Check stopwords
    if entity_name.lower() in STOPWORDS:
        return False, "stopword"

    # Check invalid patterns
    for pattern in INVALID_PATTERNS:
        if re.search(pattern, entity_name):
            return False, f"matches pattern: {pattern}"

    # Check if entity has notion_id (from WIKI_INDEX) - these are definitely valid
    # We'll check this in the cleanup function

    return True, ""


def clean_entity_database(db_path: Path, dry_run: bool = True) -> dict:
    """
    Clean entity database by removing spurious entities.

    Args:
        db_path: Path to entity_database.json
        dry_run: If True, only report what would be removed

    Returns:
        Cleaned database dict
    """
    with open(db_path, 'r') as f:
        db = json.load(f)

    entities = db['entities']
    invalid_entities = []
    valid_count = 0

    for entity_name, entity_data in list(entities.items()):
        # Entities from WIKI_INDEX (have notion_id) are always valid
        if entity_data.get('notion_id'):
            valid_count += 1
            continue

        # Check validity
        is_valid, reason = is_valid_entity(entity_name)

        if not is_valid:
            invalid_entities.append({
                'name': entity_name,
                'reason': reason,
                'type': entity_data.get('type', 'Unknown')
            })

            if not dry_run:
                del entities[entity_name]
        else:
            valid_count += 1

    # Update database stats
    if not dry_run:
        db['entities'] = entities
        db['new_entities_count'] = len([e for e in entities.values() if e.get('discovered_from') == 'wikilink_scan'])

    return db, invalid_entities, valid_count


def main():
    parser = argparse.ArgumentParser(description='Clean entity database')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be removed without modifying file')

    args = parser.parse_args()

    db_path = Path(__file__).parent / 'entity_database.json'

    if not db_path.exists():
        print(f"❌ Entity database not found at {db_path}")
        return

    print("🧹 Entity Database Cleanup")
    print("="*80)

    # Run cleanup
    cleaned_db, invalid_entities, valid_count = clean_entity_database(db_path, dry_run=args.dry_run)

    # Report results
    print(f"\n📊 Cleanup Results:")
    print(f"  Valid entities: {valid_count}")
    print(f"  Invalid entities found: {len(invalid_entities)}")

    if invalid_entities:
        print(f"\n❌ Invalid Entities (would be removed):")
        # Group by reason
        by_reason = {}
        for entity in invalid_entities:
            reason = entity['reason']
            if reason not in by_reason:
                by_reason[reason] = []
            by_reason[reason].append(entity['name'])

        for reason, names in sorted(by_reason.items()):
            print(f"\n  {reason}:")
            for name in sorted(names)[:10]:  # Show first 10
                print(f"    - {name}")
            if len(names) > 10:
                print(f"    ... and {len(names) - 10} more")

    if args.dry_run:
        print(f"\n⚠️  DRY RUN MODE - No changes made")
        print(f"   Run without --dry-run to apply cleanup")
    else:
        # Save cleaned database
        with open(db_path, 'w') as f:
            json.dump(cleaned_db, f, indent=2)

        print(f"\n✅ Database cleaned and saved to {db_path}")
        print(f"   Removed {len(invalid_entities)} invalid entities")


if __name__ == '__main__':
    main()
