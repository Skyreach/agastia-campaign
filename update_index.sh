#!/bin/bash
echo "📝 Updating CLAUDE.md index..."

# Get current date
DATE=$(date +%Y-%m-%d)

# Count files by type
PC_COUNT=$(find Player_Characters -name "*.md" 2>/dev/null | wc -l)
NPC_COUNT=$(find NPCs -name "*.md" 2>/dev/null | wc -l)
FACTION_COUNT=$(find Factions -name "*.md" 2>/dev/null | wc -l)
LOCATION_COUNT=$(find Locations -name "*.md" 2>/dev/null | wc -l)

echo "📊 Campaign Stats: ${PC_COUNT} PCs, ${NPC_COUNT} NPCs, ${FACTION_COUNT} Factions, ${LOCATION_COUNT} Locations"

# Update the log entry in CLAUDE.md
sed -i "$ a- $DATE: Index updated (${PC_COUNT} PCs, ${NPC_COUNT} NPCs, ${FACTION_COUNT} Factions, ${LOCATION_COUNT} Locations)" CLAUDE.md

echo "✅ CLAUDE.md updated"
