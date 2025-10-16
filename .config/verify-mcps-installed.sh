#!/bin/bash
# MCP Installation Verification Script
# Auto-discovers and verifies MCPs using directory conventions

set -e

REPO_DIR="/mnt/c/dnd"
CLAUDE_CONFIG="$HOME/.claude/mcp.json"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  MCP Installation Check (Auto-Discovery)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Convention 1: Legacy MCPs follow pattern mcp_server*/ in repo root
echo ""
echo -e "${BLUE}Discovering legacy MCPs (mcp_server*/ pattern)...${NC}"

LEGACY_MCPS=()
for dir in "$REPO_DIR"/mcp_server*/; do
    if [ -d "$dir" ]; then
        mcp_name=$(basename "$dir")
        if [ -f "$dir/server.js" ]; then
            echo -e "  ${GREEN}✓${NC} $mcp_name"
            LEGACY_MCPS+=("$mcp_name")
        else
            echo -e "  ${RED}✗${NC} $mcp_name (missing server.js)"
        fi
    fi
done

# Convention 2: New MCPs in .config/mcp-servers/*/
echo ""
echo -e "${BLUE}Discovering new MCPs (.config/mcp-servers/*/ pattern)...${NC}"

NEW_MCPS=()
if [ -d "$REPO_DIR/.config/mcp-servers" ]; then
    for dir in "$REPO_DIR/.config/mcp-servers"/*/; do
        if [ -d "$dir" ]; then
            mcp_name=$(basename "$dir")
            if [ -f "$dir/server.js" ]; then
                echo -e "  ${GREEN}✓${NC} $mcp_name"
                NEW_MCPS+=("$mcp_name")
            else
                echo -e "  ${RED}✗${NC} $mcp_name (missing server.js)"
            fi
        fi
    done
else
    echo -e "  ${YELLOW}⚠${NC}  .config/mcp-servers/ directory not found"
fi

# Total discovered
TOTAL_MCPS=$((${#LEGACY_MCPS[@]} + ${#NEW_MCPS[@]}))
echo ""
echo -e "${BLUE}Total MCPs discovered: ${TOTAL_MCPS}${NC}"

# Check Claude Desktop configuration
if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: Claude MCP config not found at $CLAUDE_CONFIG${NC}"
    echo -e "${YELLOW}   MCPs need to be added to Claude Desktop${NC}"
    echo -e "${YELLOW}   Run: claude mcp add <server-name>${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Checking Claude Desktop MCP configuration...${NC}"

CONFIG_MISSING=()

# Check legacy MCPs
for mcp in "${LEGACY_MCPS[@]}"; do
    # Convert mcp_server to dnd-campaign, mcp_server_session_flow to session-flow
    config_name="$mcp"
    if [[ "$mcp" == "mcp_server" ]]; then
        config_name="dnd-campaign"
    elif [[ "$mcp" == mcp_server_* ]]; then
        config_name="${mcp#mcp_server_}"
        config_name="${config_name//_/-}"
    fi

    if grep -q "\"$config_name\"" "$CLAUDE_CONFIG" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $config_name configured"
    else
        echo -e "  ${YELLOW}⚠${NC}  $config_name not in Claude config"
        CONFIG_MISSING+=("$config_name")
    fi
done

# Check new MCPs
for mcp in "${NEW_MCPS[@]}"; do
    if grep -q "\"$mcp\"" "$CLAUDE_CONFIG" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $mcp configured"
    else
        echo -e "  ${YELLOW}⚠${NC}  $mcp not in Claude config"
        CONFIG_MISSING+=("$mcp")
    fi
done

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Report results
if [ ${#CONFIG_MISSING[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All discovered MCPs are configured in Claude Desktop${NC}"
else
    echo -e "${YELLOW}⚠️  MCPs not configured in Claude Desktop (${#CONFIG_MISSING[@]}):${NC}"
    for mcp in "${CONFIG_MISSING[@]}"; do
        echo -e "   - $mcp"
    done
    echo ""
    echo -e "${YELLOW}ACTION REQUIRED:${NC}"
    echo -e "  Add these MCPs to: $CLAUDE_CONFIG"
    echo -e "  Or use: ${BLUE}claude mcp add <server-name>${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Non-blocking: just report status, don't fail
exit 0
