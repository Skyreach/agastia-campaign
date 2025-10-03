# MCP Server Setup Guide

## What is the MCP Server?
The Model Context Protocol (MCP) server provides **persistent campaign context** across all Claude conversations. Instead of starting fresh each time, Claude will automatically know:

- Current player characters and their goals
- Active faction states and relationships  
- Recent session outcomes
- Pending campaign decisions
- File structure and campaign organization

## Automatic Installation
The MCP server is automatically installed when you run `./setup.sh`. Here's what happens:

### 1. Dependencies Installed
- **Node.js** (if not present)
- **MCP SDK** and Notion client packages
- **Campaign management tools**

### 2. Claude Desktop Configuration
The installer automatically creates/updates:
```json
{
  "mcpServers": {
    "dnd-campaign": {
      "command": "node",
      "args": ["/path/to/your/campaign/mcp_server/server.js"],
      "cwd": "/path/to/your/campaign"
    }
  }
}
```

### 3. Available Resources
Once active, Claude can access these campaign resources:
- `campaign://state` - Complete campaign overview
- `campaign://characters` - All player character info
- `campaign://factions` - Active faction data
- `campaign://decisions` - Pending decisions list
- `campaign://recent-updates` - Latest file changes

### 4. Campaign Tools
The MCP server provides specialized tools:
- **sync_notion** - Push changes to Notion database
- **create_npc** - Generate new NPC files with proper structure
- **plan_session** - Create session planning templates
- **get_faction_relationships** - Analyze faction dynamics
- **update_campaign_state** - Refresh campaign data

## Manual Configuration (if needed)

### Find Claude Desktop Config
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  
- **Linux**: `~/.config/claude/claude_desktop_config.json`

### Add MCP Server Entry
```json
{
  "mcpServers": {
    "dnd-campaign": {
      "command": "node",
      "args": ["./mcp_server/server.js"],
      "cwd": "/absolute/path/to/your/campaign"
    }
  }
}
```

## Testing the Setup

### 1. Restart Claude Desktop
After installation, restart Claude Desktop completely.

### 2. Start New Conversation
Open Claude Desktop and navigate to your campaign directory.

### 3. Test Commands
Try these to verify MCP server is working:

```
Show me the current campaign state
```

```
What player characters are active?
```

```
Sync the latest changes to Notion
```

```
Create a new NPC named "Tavern Keeper Tom" in Location_NPCs
```

## Troubleshooting

### MCP Server Not Loading
1. Check Node.js is installed: `node --version`
2. Verify MCP dependencies: `cd mcp_server && npm list`
3. Check Claude Desktop config file exists
4. Restart Claude Desktop completely

### Permission Errors
```bash
chmod +x mcp_server/server.js
chmod +x install_mcp.sh
```

### Path Issues
Ensure the `cwd` in Claude Desktop config points to your campaign root directory (where CLAUDE.md is located).

### API Key Issues
The MCP server reads your Notion API key from `.config/notion_key.txt`. Ensure this file exists and contains your valid API key.

## Multi-Machine Setup

### New Machine Setup
1. Clone the repository
2. Run `./setup.sh` 
3. Add your Notion API key to `.config/notion_key.txt`
4. Restart Claude Desktop
5. MCP server automatically configures and provides campaign context

### No Manual Configuration Needed
The setup script handles:
- Installing all dependencies
- Configuring Claude Desktop
- Setting up file permissions
- Creating necessary directories

This ensures consistent setup across all your devices with minimal manual intervention.