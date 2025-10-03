# Agastia D&D Campaign Repository

## Quick Start
1. Clone repository: `git clone https://github.com/Skyreach/agastia-campaign.git`
2. Navigate to directory: `cd /mnt/c/dnd`
3. Run setup: `./setup.sh`
4. Start Claude: `dnd` (alias) or `claude`

## Structure
- `Campaign_Core/` - Core campaign documents
- `Player_Characters/` - PC information and goals
- `Factions/` - Faction details and relationships
- `NPCs/` - All NPC information
- `Locations/` - Places and dungeons
- `Sessions/` - Session plans and summaries
- `Resources/` - Tables, hooks, and tools

## Commands
- `dnd` - Navigate to campaign and start Claude
- `./sync_notion.py` - Sync with Notion database
- `./update_index.sh` - Rebuild CLAUDE.md index