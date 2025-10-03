# Agastia D&D Campaign Repository

## Prerequisites
- **Python 3.x** with pip
- **Git** for version control
- **Notion account** with integration setup
- **Claude Code CLI** (optional but recommended)

## Installation
1. Clone repository: `git clone https://github.com/Skyreach/agastia-campaign.git`
2. Navigate to directory: `cd /mnt/c/dnd`
3. Install Python dependencies: `pip3 install -r requirements.txt`
   - If pip3 not found: `curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3 get-pip.py --user`
   - Add to PATH: `export PATH="$HOME/.local/bin:$PATH"`
4. Run setup: `./setup.sh`
5. Start Claude: `dnd` (alias) or `claude`

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
- `./sync_notion.py all` - Sync everything to Notion database
- `./sync_notion.py [file] [type]` - Sync specific file
- `./update_index.sh` - Rebuild CLAUDE.md index

## Notion Integration
✅ **Status:** Active and configured
- **Database:** D&D Campaign Entities
- **Entities Synced:** 17 (PCs, NPCs, Factions, Locations, Resources)
- **Last Sync:** Successful

## Required Python Packages
- `notion-client>=2.0.0` - Notion API integration
- `python-frontmatter>=1.0.0` - Markdown frontmatter parsing
- `pyyaml>=6.0` - YAML configuration support