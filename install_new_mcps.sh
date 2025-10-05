#!/bin/bash

# Install new MCP servers for Session Flow and Dungeon Ecology

set -e

echo "================================================"
echo "Installing New D&D MCP Servers"
echo "================================================"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install Session Flow MCP
echo "📊 Installing Session Flow MCP Server..."
cd "$SCRIPT_DIR/mcp_server_session_flow"
npm install
echo "✅ Session Flow MCP installed"
echo ""

# Install Dungeon Ecology MCP
echo "🌿 Installing Dungeon Ecology MCP Server..."
cd "$SCRIPT_DIR/mcp_server_dungeon_ecology"
npm install
echo "✅ Dungeon Ecology MCP installed"
echo ""

# Create directories for storing data
echo "📁 Creating storage directories..."
mkdir -p "$SCRIPT_DIR/Session_Flows"
mkdir -p "$SCRIPT_DIR/Dungeon_Ecologies"
echo "✅ Directories created"
echo ""

# Check if Claude Desktop config exists
CLAUDE_CONFIG="$HOME/.config/claude/config.json"

if [ -f "$CLAUDE_CONFIG" ]; then
  echo "================================================"
  echo "⚠️  Manual Configuration Required"
  echo "================================================"
  echo ""
  echo "Add these entries to your Claude Desktop config:"
  echo "$CLAUDE_CONFIG"
  echo ""
  echo "Add inside the \"mcpServers\" section:"
  echo ""
  echo "  \"session-flow\": {"
  echo "    \"command\": \"node\","
  echo "    \"args\": [\"$SCRIPT_DIR/mcp_server_session_flow/server.js\"]"
  echo "  },"
  echo ""
  echo "  \"dungeon-ecology\": {"
  echo "    \"command\": \"node\","
  echo "    \"args\": [\"$SCRIPT_DIR/mcp_server_dungeon_ecology/server.js\"]"
  echo "  }"
  echo ""
  echo "Then restart Claude Desktop to load the new servers."
  echo ""
else
  echo "⚠️  Claude Desktop config not found at $CLAUDE_CONFIG"
  echo "Please manually add MCP server configuration."
  echo ""
fi

echo "================================================"
echo "✅ Installation Complete!"
echo "================================================"
echo ""
echo "New MCP Servers Available:"
echo "  1. Session Flow MCP - Tower-defense style session flowcharts"
echo "  2. Dungeon Ecology MCP - Living dungeon ecosystems"
echo ""
echo "Documentation:"
echo "  - mcp_server_session_flow/README.md"
echo "  - mcp_server_dungeon_ecology/README.md"
echo ""
echo "Don't forget to restart Claude Desktop!"
