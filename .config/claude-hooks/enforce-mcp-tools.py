#!/usr/bin/env python3
"""
Claude Code Hook: Enforce MCP Tool Usage
Blocks base Write/Edit tools when MCP equivalents exist
"""

import sys
import json

def main():
    # Read hook input from stdin
    input_data = json.load(sys.stdin)

    tool_name = input_data.get("toolName", "")

    # Block base Write tool for campaign files
    if tool_name == "Write":
        file_path = ""
        for param in input_data.get("parameters", []):
            if param.get("name") == "file_path":
                file_path = param.get("value", "")
                break

        # Check if writing campaign entity files
        if any(dir in file_path for dir in ["NPCs/", "Factions/", "Locations/", "Sessions/", "Player_Characters/", "Campaign_Core/"]):
            print("❌ BLOCKED: Use mcp__dnd-campaign__edit_file with auto_commit:true instead of Write", file=sys.stderr)
            print("", file=sys.stderr)
            print("For NEW files:", file=sys.stderr)
            print("  - Use mcp__dnd-campaign__create_npc for NPCs", file=sys.stderr)
            print("  - Use mcp__dnd-campaign__edit_file for other entities", file=sys.stderr)
            print("", file=sys.stderr)
            print("This ensures automatic commit and Notion sync.", file=sys.stderr)
            sys.exit(1)

    # Block base Edit tool for campaign files
    if tool_name == "Edit":
        file_path = ""
        for param in input_data.get("parameters", []):
            if param.get("name") == "file_path":
                file_path = param.get("value", "")
                break

        # Check if editing campaign entity files
        if any(dir in file_path for dir in ["NPCs/", "Factions/", "Locations/", "Sessions/", "Player_Characters/", "Campaign_Core/"]):
            print("❌ BLOCKED: Use mcp__dnd-campaign__edit_file with auto_commit:true instead of Edit", file=sys.stderr)
            print("", file=sys.stderr)
            print("This ensures automatic commit and Notion sync.", file=sys.stderr)
            sys.exit(1)

    # Allow all other tools
    sys.exit(0)

if __name__ == "__main__":
    main()
