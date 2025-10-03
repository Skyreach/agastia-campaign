#!/bin/bash

echo "🎲 Installing D&D Campaign MCP Server..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install MCP server dependencies
cd mcp_server
echo "📦 Installing MCP server dependencies..."
npm install

# Make server executable
chmod +x server.js

# Check if Claude Desktop config exists
CLAUDE_CONFIG_DIR=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (including WSL)
    CLAUDE_CONFIG_DIR="$HOME/AppData/Roaming/Claude"
else
    # Linux
    CLAUDE_CONFIG_DIR="$HOME/.config/claude"
fi

# Create Claude Desktop config directory if it doesn't exist
mkdir -p "$CLAUDE_CONFIG_DIR"

# Create or update Claude Desktop config
CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "⚠️  Claude Desktop config exists. Please manually add this MCP server:"
    echo "   Path: $(pwd)/server.js"
    echo "   Working Directory: $(dirname $(pwd))"
else
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "dnd-campaign": {
      "command": "node",
      "args": ["$(pwd)/server.js"],
      "cwd": "$(dirname $(pwd))"
    }
  }
}
EOF
    echo "✅ Created Claude Desktop config at: $CONFIG_FILE"
fi

cd ..

# Configure Claude Code MCP
echo "🔧 Configuring Claude Code MCP server..."
if command -v claude &> /dev/null; then
    claude mcp add dnd-campaign node ./mcp_server/server.js --scope project 2>/dev/null || echo "Claude Code MCP config already exists"
else
    echo "⚠️  Claude Code CLI not found - MCP server will work in Claude Desktop only"
fi

echo ""
echo "🎲 MCP Server Installation Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Restart Claude Desktop if it's running"
echo "2. Start a new Claude Code session in this directory (or use Claude Desktop)"
echo "3. The MCP server will provide persistent campaign context in both environments"
echo ""
echo "🔧 MCP Server Features:"
echo "   - Automatic campaign state loading"
echo "   - Notion sync integration"
echo "   - NPC creation tools"
echo "   - Session planning templates"
echo "   - Faction relationship tracking"
echo ""
echo "💡 Test with: Ask Claude to 'show me the current campaign state'"