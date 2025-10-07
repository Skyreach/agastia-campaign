#!/usr/bin/env python3
import json
import sys
import os
import subprocess

# Read tool use info from stdin
try:
    hook_input = json.loads(sys.stdin.read())
    tool_name = hook_input.get("toolName", "")
    file_path = hook_input.get("parameters", {}).get("file_path", "")
    command = hook_input.get("parameters", {}).get("command", "")
except:
    tool_name = ""
    file_path = ""
    command = ""

context = ""

# Check if this was a git commit (without push in same command)
if tool_name == "Bash" and "git commit" in command and "git push" not in command:
    context += """
⚠️ CRITICAL: Git commit detected without push. You MUST push immediately.
Run: git push
"""

# Check if MCP server file was modified but not installed
if tool_name in ["Write", "Edit", "NotebookEdit"]:
    # Check if file is in an MCP directory
    if "mcp_server" in file_path or "mcp-server" in file_path:
        # Check if this MCP is in claude_desktop_config.json
        config_path = os.path.expanduser("~/.config/claude/claude_desktop_config.json")
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                mcp_servers = config.get("mcpServers", {})

                # Extract MCP server name from path
                mcp_installed = any(file_path in str(server_config) for server_config in mcp_servers.values())

                if not mcp_installed:
                    context += """
⚠️ CRITICAL: MCP server file modified but not installed in claude_desktop_config.json
You MUST add this server to ~/.config/claude/claude_desktop_config.json before marking complete.
"""
        except:
            pass

output = {
    "hookSpecificOutput": {
        "hookEventName": "PostToolUse",
        "additionalContext": context
    }
}

print(json.dumps(output))
sys.exit(0)
