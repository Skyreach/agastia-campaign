#!/usr/bin/env python3
"""
Generate individual encounter pages from Tier1_Inspiring_Table.md

Parses the source table file and creates 127 individual encounter .md files
following the standard template format.
"""

import re
import os
from pathlib import Path
from typing import List, Dict, Optional

# Terrain name mappings
TERRAIN_MAP = {
    'TEMPERATE FORESTS': 'Temperate Forest',
    'ARCTIC / TUNDRA': 'Arctic/Tundra',
    'MOUNTAINS': 'Mountains',
    'DESERTS': 'Deserts',
    'JUNGLES': 'Jungles',
    'SWAMPS': 'Swamps',
    'COASTAL': 'Coastal',
    'URBAN': 'Urban'
}

# Dice mappings for each terrain
DICE_MAP = {
    'Temperate Forest': '2d8',
    'Arctic/Tundra': '2d6',
    'Mountains': '2d10',
    'Deserts': '2d8',
    'Jungles': '2d10',
    'Swamps': '2d6',
    'Coastal': '2d8',
    'Urban': '2d10'
}

def sanitize_filename(name: str, terrain: str = None) -> str:
    """Convert encounter name to valid filename."""
    # Remove special characters
    filename = name.replace("'", "")
    filename = filename.replace("'", "")
    filename = filename.replace("-", "_")
    filename = filename.replace(" ", "_")
    filename = filename.replace("/", "_")

    # Handle known duplicates
    if name == "Green Dragon Wyrmling" and terrain == "Jungles":
        filename = "Green_Dragon_Wyrmling_Jungle"
    elif name == "Blue Dragon Wyrmling" and terrain == "Coastal":
        filename = "Blue_Dragon_Wyrmling_Coastal"
    elif name == "Green Dragon's Domain":
        filename = "Green_Dragons_Domain"

    return filename + ".md"

def extract_terrain_tag(terrain: str) -> str:
    """Convert terrain name to lowercase tag."""
    tag_map = {
        'Temperate Forest': 'forest',
        'Arctic/Tundra': 'arctic',
        'Mountains': 'mountains',
        'Deserts': 'desert',
        'Jungles': 'jungle',
        'Swamps': 'swamp',
        'Coastal': 'coastal',
        'Urban': 'urban'
    }
    return tag_map.get(terrain, 'unknown')

def infer_tags(name: str, description: str, terrain: str) -> List[str]:
    """Infer appropriate tags based on encounter content."""
    tags = ['encounter', 'tier1', extract_terrain_tag(terrain)]

    name_lower = name.lower()
    desc_lower = description.lower()

    # Creature type tags
    if 'dragon' in name_lower or 'wyrmling' in name_lower:
        tags.append('dragon')
    if 'undead' in desc_lower or 'zombie' in name_lower or 'mummy' in name_lower:
        tags.append('undead')
    if any(x in name_lower for x in ['goblin', 'orc', 'hobgoblin', 'kobold', 'cultist', 'bandit']):
        tags.append('humanoid')
    if any(x in name_lower for x in ['beast', 'mastiff', 'bear', 'wolf', 'ape', 'tiger']):
        tags.append('beast')
    if 'fey' in desc_lower or 'sprite' in name_lower or 'pixie' in desc_lower:
        tags.append('fey')

    # Combat vs non-combat
    if 'non-combat' in desc_lower or 'peaceful' in desc_lower or 'friendly' in name_lower:
        tags.append('non-combat')
    elif any(x in desc_lower for x in ['attacks', 'combat', 'ambush', 'hostile']):
        tags.append('combat')
    else:
        tags.append('mixed')

    # Thematic tags
    if 'ambush' in name_lower or 'ambush' in desc_lower:
        tags.append('ambush')
    if 'social' in desc_lower or 'negotiation' in desc_lower or 'conversation' in desc_lower:
        tags.append('social')
    if 'trap' in desc_lower:
        tags.append('trap')
    if 'environmental' in desc_lower or 'sandstorm' in name_lower or 'rockslide' in name_lower:
        tags.append('environmental')

    return tags

def parse_encounter_table(content: str) -> List[Dict]:
    """Parse the source markdown file and extract all encounters."""
    encounters = []
    current_terrain = None
    current_dice = None

    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # Detect terrain section header
        terrain_match = re.match(r'^## (.+) \(Tier 1\)', line)
        if terrain_match:
            terrain_raw = terrain_match.group(1).upper()
            current_terrain = TERRAIN_MAP.get(terrain_raw)
            if current_terrain:
                current_dice = DICE_MAP[current_terrain]
            i += 1
            continue

        # Skip lines until we hit encounter entries
        if not current_terrain or not line.startswith('| **'):
            i += 1
            continue

        # Parse table row: | **Roll** | **Name** |
        roll_match = re.match(r'\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*(.+?)\*\*\s*\|', line)
        if roll_match:
            roll_num = roll_match.group(1)
            encounter_name = roll_match.group(2).strip()

            # Next line should be description
            i += 1
            if i >= len(lines):
                break

            desc_line = lines[i].strip()

            # Extract description (starts with | | )
            desc_match = re.match(r'\|\s*\|\s*(.+)\s*\|', desc_line)
            if not desc_match:
                continue

            full_text = desc_match.group(1).strip()

            # Parse the description components
            # Format: "Description. **Variation:** Variation text. **Non-Combat:** Non-combat text."

            # Split by **Variation:** and **Non-Combat:**
            parts = re.split(r'\*\*Variation:\*\*|\*\*Non-Combat:\*\*', full_text)

            description = parts[0].strip() if len(parts) > 0 else ""
            variation = parts[1].strip() if len(parts) > 1 else ""
            non_combat = parts[2].strip() if len(parts) > 2 else ""

            encounters.append({
                'name': encounter_name,
                'terrain': current_terrain,
                'dice': current_dice,
                'roll': roll_num,
                'description': description,
                'variation': variation,
                'non_combat': non_combat
            })

        i += 1

    return encounters

def generate_encounter_page(encounter: Dict, output_dir: Path) -> str:
    """Generate a single encounter markdown file."""
    name = encounter['name']
    terrain = encounter['terrain']
    dice = encounter['dice']
    roll = encounter['roll']
    description = encounter['description']
    variation = encounter['variation']
    non_combat = encounter['non_combat']

    # Generate frontmatter
    tags = infer_tags(name, description, terrain)
    tags_str = ', '.join(tags)

    # Generate filename
    filename = sanitize_filename(name, terrain)
    filepath = output_dir / filename

    # Generate content
    content = f"""---
name: {name}
type: Encounter
terrain: {terrain}
tier: 1
roll_result: "{roll} on {dice}"
tags: [{tags_str}]
---

# {name}

**Roll:** {roll} on {dice}

{description}
"""

    if variation:
        content += f"\n**Variation:** {variation}\n"

    if non_combat:
        content += f"\n**Non-Combat:** {non_combat}\n"

    # Write file
    with open(filepath, 'w') as f:
        f.write(content)

    return str(filepath)

def main():
    """Main execution."""
    # Paths
    source_file = Path('Resources/Tables/Tier1_Inspiring_Table.md')
    output_dir = Path('Encounters')
    tracker_file = Path('.working/encounter_conversion_tracker.md')

    # Ensure output directory exists
    output_dir.mkdir(exist_ok=True)

    # Read source file
    print(f"📖 Reading source file: {source_file}")
    with open(source_file, 'r') as f:
        content = f.read()

    # Parse encounters
    print("🔍 Parsing encounters...")
    encounters = parse_encounter_table(content)
    print(f"   Found {len(encounters)} encounters")

    # Group by terrain for progress tracking
    by_terrain = {}
    for enc in encounters:
        terrain = enc['terrain']
        if terrain not in by_terrain:
            by_terrain[terrain] = []
        by_terrain[terrain].append(enc)

    # Generate files
    print("\n📝 Generating encounter pages...")
    generated = []

    for terrain, terrain_encounters in by_terrain.items():
        print(f"\n   {terrain} ({len(terrain_encounters)} encounters)")
        for enc in terrain_encounters:
            filepath = generate_encounter_page(enc, output_dir)
            generated.append(filepath)
            print(f"      ✅ {enc['name']}")

    print(f"\n🎉 Generated {len(generated)} encounter pages!")
    print(f"   Location: {output_dir}/")

    # Summary by terrain
    print("\n📊 Summary by terrain:")
    for terrain in sorted(by_terrain.keys()):
        count = len(by_terrain[terrain])
        print(f"   - {terrain}: {count} encounters")

    print(f"\n✅ Complete! All {len(encounters)} encounter pages generated.")

if __name__ == '__main__':
    main()
