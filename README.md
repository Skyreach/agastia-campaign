# Agastia D&D Campaign Repository

## Prerequisites
- **Python 3.x** with pip
- **Node.js** (for MCP server)
- **Git** for version control
- **Notion account** with integration setup
- **Claude Desktop** (for MCP server integration)

## Installation
1. Clone repository: `git clone https://github.com/Skyreach/agastia-campaign.git`
2. Navigate to directory: `cd /mnt/c/dnd`
3. Run automated setup: `./setup.sh`
   - Installs Python dependencies (pip3, notion-client, etc.)
   - Installs Node.js and MCP server dependencies
   - Sets up Claude Desktop MCP integration
   - Creates shell aliases and configuration
4. Add your Notion API key to `.config/notion_key.txt`
5. Restart Claude Desktop to load MCP server
6. Start Claude: `dnd` (alias) or open Claude Desktop in this directory

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

## MCP Server Features
🤖 **Persistent Campaign Context** - The MCP server provides:

### Automatic Context Loading
- **Player Characters**: All PC info, goals, and status
- **Active Factions**: Current faction states and relationships  
- **Recent Sessions**: Latest session info and outcomes
- **Pending Decisions**: Campaign choices that need to be made

### Campaign Management Tools
- **Notion Sync**: `sync_notion` - Push updates to Notion database
- **NPC Creation**: `create_npc` - Generate new NPCs with templates
- **Session Planning**: `plan_session` - Create session planning documents
- **Faction Analysis**: `get_faction_relationships` - Analyze faction dynamics
- **State Refresh**: `update_campaign_state` - Reload current campaign data

### Multi-Machine Setup
✅ **Works across all your devices** - Just clone the repo and run setup
- MCP server auto-configures for Claude Desktop
- All campaign data syncs via Git + Notion
- API keys are the only manual step per machine

## Dependencies (Auto-Installed)
- **Python**: `notion-client`, `python-frontmatter`, `pyyaml`
- **Node.js**: `@modelcontextprotocol/sdk`, `@notionhq/client`, `front-matter`