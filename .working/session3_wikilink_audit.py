#!/usr/bin/env python3
"""Audit all wikilinks in Session 3 to verify they resolve to actual files."""

import re
import os
from pathlib import Path

# Read Session 3
session_file = Path("Sessions/Session_3_The_Steel_Dragon_Begins.md")
content = session_file.read_text()

# Extract all wikilinks using regex
wikilink_pattern = r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]'
matches = re.findall(wikilink_pattern, content)

# Build unique set of entity names
entities = set()
for match in matches:
    # Clean up the entity name (remove #section references)
    entity = match.split('#')[0].strip()
    if entity:
        entities.add(entity)

# Load WIKI_INDEX to get entity → file mappings
wiki_index_file = Path("WIKI_INDEX.md")
wiki_content = wiki_index_file.read_text()

# Parse WIKI_INDEX table rows
entity_files = {}
for line in wiki_content.split('\n'):
    if line.startswith('|') and '`' in line:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 3:
            entity_name = parts[1].strip()
            file_path_match = re.search(r'`([^`]+)`', parts[2])
            if file_path_match:
                file_path = file_path_match.group(1)
                entity_files[entity_name] = file_path

# Audit results
print("=" * 80)
print("SESSION 3 WIKILINK AUDIT")
print("=" * 80)
print()

resolved = []
unresolved = []

for entity in sorted(entities):
    if entity in entity_files:
        file_path = Path(entity_files[entity])
        if file_path.exists():
            resolved.append((entity, str(file_path)))
        else:
            unresolved.append((entity, f"File not found: {file_path}"))
    else:
        unresolved.append((entity, "Not in WIKI_INDEX"))

print(f"✅ RESOLVED ({len(resolved)}):")
print("-" * 80)
for entity, path in resolved:
    print(f"  [[{entity}]] → {path}")

print()
print(f"❌ UNRESOLVED ({len(unresolved)}):")
print("-" * 80)
for entity, reason in unresolved:
    print(f"  [[{entity}]] → {reason}")

print()
print("=" * 80)
print(f"SUMMARY: {len(resolved)} resolved / {len(entities)} total ({len(resolved)/len(entities)*100:.1f}%)")
print("=" * 80)
