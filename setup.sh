#!/bin/bash

echo "🎲 Setting up D&D Campaign Environment..."

# Check for required tools
command -v git >/dev/null 2>&1 || { echo "❌ Git required but not installed. Aborting." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python3 required but not installed. Aborting." >&2; exit 1; }

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if ! command -v pip3 &> /dev/null; then
    echo "🔧 Installing pip3..."
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    python3 get-pip.py --user
    export PATH="$HOME/.local/bin:$PATH"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

pip3 install -r requirements.txt 2>/dev/null || pip3 install notion-client python-frontmatter pyyaml

# Set up configuration
if [ ! -f .config/notion_key.txt ]; then
    echo "⚠️  Please add your Notion API key to .config/notion_key.txt"
    echo "   Get your key from: https://www.notion.so/my-integrations"
    echo "   🛡️  SECURITY: Remember to clear chat history after providing the key!"
    mkdir -p .config
fi

# Set up aliases
if ! grep -q "alias dnd" ~/.bashrc; then
    echo "🔗 Adding 'dnd' alias to ~/.bashrc..."
    echo 'alias dnd="cd /mnt/c/dnd && claude"' >> ~/.bashrc
fi

# Create index updater
cat > update_index.sh << 'UPDATER'
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
UPDATER

chmod +x update_index.sh

# Create quick commands reference
cat > COMMANDS.md << 'EOF'
# D&D Campaign Quick Commands

## Navigation
- `dnd` - Go to campaign directory and start Claude
- `cd /mnt/c/dnd` - Manual navigation

## Git Operations (SAFE - using mbourqu3@gmail.com)
- `git status` - Check changes
- `git add .` - Stage all changes
- `git commit -m "Session X updates"` - Commit changes
- `git push` - Push to GitHub

## Notion Sync
- `./sync_notion.py all` - Sync everything to Notion
- `./sync_notion.py Player_Characters/PC_Manny.md PC` - Sync specific file

## File Operations
- `ls -la` - List all files
- `find . -name "*.md" | grep -i "zero"` - Search for Professor Zero mentions
- `grep -r "Codex" --include="*.md"` - Search for Codex references

## Claude Operations
- Start Claude and it will auto-load the campaign context
- Ask Claude to "check CLAUDE.md" for navigation
- Request "update [filename]" to modify files

## Safety Checks (Built into CLAUDE.md)
- ✅ Git email verified: mbourqu3@gmail.com
- ✅ OS confirmed: WSL2 Ubuntu
- 🔒 Notion API key protection enabled
EOF

# Install MCP server
echo "🤖 Installing MCP server for persistent campaign context..."
./install_mcp.sh

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. 🔑 Add Notion API key to .config/notion_key.txt"
echo "2. 🔄 Run 'source ~/.bashrc' to activate aliases"
echo "3. 🔄 Restart Claude Desktop to load MCP server"
echo "4. 🎲 Use 'dnd' to start Claude in campaign directory"
echo "5. 🐙 Create GitHub repo: https://github.com/Skyreach/agastia-campaign"
echo ""
echo "🤖 MCP Server Features:"
echo "   - Persistent campaign context across sessions"
echo "   - Automatic loading of PC, NPC, and faction data"
echo "   - Notion sync integration"
echo "   - Session planning and NPC creation tools"