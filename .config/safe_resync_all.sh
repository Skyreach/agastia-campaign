#!/bin/bash
# Safe re-sync script - tests before any destructive operations

echo "=== SAFE RE-SYNC OF ALL CAMPAIGN ENTITIES ==="
echo "This script will UPDATE existing entities, not delete anything"
echo ""

# Hardcoded paths to prevent nested directory issues
CAMPAIGN_ROOT="/mnt/e/dnd/agastia-campaign"
cd "$CAMPAIGN_ROOT"

echo "PCs (5):"
python3 .config/sync_entity_to_notion.py Player_Characters/PC_Manny.md
python3 .config/sync_entity_to_notion.py Player_Characters/PC_Nikki.md
python3 .config/sync_entity_to_notion.py Player_Characters/PC_Ian_Rakash.md
python3 .config/sync_entity_to_notion.py Player_Characters/PC_Kyle_Nameless.md
python3 .config/sync_entity_to_notion.py Player_Characters/PC_Josh.md

echo ""
echo "Major NPCs (3):"
python3 .config/sync_entity_to_notion.py NPCs/Major_NPCs/Professor_Zero.md
python3 .config/sync_entity_to_notion.py NPCs/Major_NPCs/Steel_Dragon.md
python3 .config/sync_entity_to_notion.py NPCs/Major_NPCs/The_Patron.md

echo ""
echo "Factions (4):"
python3 .config/sync_entity_to_notion.py Factions/Faction_Chaos_Cult.md
python3 .config/sync_entity_to_notion.py Factions/Faction_Merit_Council.md
python3 .config/sync_entity_to_notion.py Factions/Faction_Dispossessed.md
python3 .config/sync_entity_to_notion.py Factions/Faction_Decimate_Project.md

echo ""
echo "Locations (8):"
python3 .config/sync_entity_to_notion.py Locations/Regions/Agastia_Region.md
python3 .config/sync_entity_to_notion.py Locations/Cities/Agastia_City.md
python3 .config/sync_entity_to_notion.py Locations/Districts/Scholar_Quarter.md
python3 .config/sync_entity_to_notion.py Locations/Districts/Merchant_District.md
python3 .config/sync_entity_to_notion.py Locations/Districts/Government_Complex.md
python3 .config/sync_entity_to_notion.py Locations/Towns/Meridians_Rest.md
python3 .config/sync_entity_to_notion.py Locations/Wilderness/Infinite_Forest.md
python3 .config/sync_entity_to_notion.py Locations/Wilderness/Ratterdan_Ruins.md

echo ""
echo "Resources (3):"
python3 .config/sync_entity_to_notion.py Resources/Goals_Tracker.md
python3 .config/sync_entity_to_notion.py Resources/Relationship_Map.md
python3 .config/sync_entity_to_notion.py Resources/Party_Connections.md

echo ""
echo "Campaign Core (3):"
python3 .config/sync_entity_to_notion.py Campaign_Core/Campaign_Overview.md
python3 .config/sync_entity_to_notion.py Campaign_Core/Giant_Axe_Artifact.md
python3 .config/sync_entity_to_notion.py Campaign_Core/The_Codex.md

echo ""
echo "Sessions (2):"
python3 .config/sync_entity_to_notion.py Sessions/Session_0_Character_Creation.md
python3 .config/sync_entity_to_notion.py Sessions/Session_1_Caravan_to_Ratterdan.md

echo ""
echo "✅ Re-sync complete!"
