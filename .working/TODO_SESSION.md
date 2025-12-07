# Session TODO List
Last updated: 2025-12-07 15:45

## 🚨 Active Tasks

### In Progress
- [ ] [15:45] Create hex-map-query MCP server with terrain analysis
  - Context: Build MCP to query hex map JSON for terrain, neighbors, POIs
  - Features: Load map JSON, calculate hex neighbors (axial coords), terrain lookup
  - Files: New mcp_server_hex_map/index.js
  - References: tools/hex-map-editor/src/utils/mapExport.js (JSON format)

### Pending
- [ ] [15:45] Add POI/encounter storage layer to hex-map MCP
  - Context: Store encounters and points of interest per hex
  - Schema: {hex, name, type, description, encounter_cr, loot}
  - Storage: Separate JSON file (hex_pois.json) alongside map data

- [ ] [15:45] Create /hex-encounter slash command for terrain-based generation
  - Context: User command to generate encounters based on hex terrain
  - Workflow: Query hex → Analyze terrain/neighbors → Generate encounter options → User selects
  - Files: .claude/commands/hex-encounter.md
  - Must follow CONTENT_GENERATION_WORKFLOW (options first, then generate)

- [ ] [15:45] Test hex-map MCP with existing map data
  - Context: Verify MCP works with actual map JSON from editor
  - Need to export map from hex-map-editor first (if not already saved)
  - Test neighbor calculation, terrain detection

- [ ] [15:45] Install hex-map MCP to Claude config
  - Context: Add to ~/.claude/config.json or Claude Code MCP config
  - Document usage in mcp_server_hex_map/README.md
  - Verify MCP is accessible via Claude Code

## ✅ Completed Tasks
- [x] [15:45 → 15:52] Archive old TODO_SESSION.md and create new session tracking file
  - Archived to: .working/archive/TODO_2025-11-30.md

- [x] [15:45 → 15:50] Create hex-map-query MCP server with terrain analysis
  - File: mcp_server_hex_map/index.js
  - Features: query_hex, get_area_summary, neighbor calculation
  - Uses axial coordinates for flat-top hexes

- [x] [15:45 → 15:50] Add POI/encounter storage layer to hex-map MCP
  - Tools: add_poi, list_pois
  - Storage: [mapfile]_pois.json (auto-created)
  - POI types: shop, dungeon, encounter, landmark, quest, npc, other

- [x] [15:45 → 15:51] Create /hex-encounter slash command for terrain-based generation
  - File: .claude/commands/hex-encounter.md
  - Enforces CONTENT_GENERATION_WORKFLOW
  - Terrain-based generation guidelines included

- [x] [15:45 → 15:52] Document hex-map MCP usage
  - File: mcp_server_hex_map/README.md
  - Includes installation, usage examples, troubleshooting

## 📋 Future Topics
- [ ] Connect hex-map POIs to session planning workflow
  - Context: Use hex terrain to auto-suggest encounter types for sessions
  - Low priority until MCP is working

- [ ] Install hex-map MCP to Claude Code config
  - Action: Add to ~/.claude/config.json
  - Action: Restart Claude Code session
  - Action: Verify MCP tools available

- [ ] Export map from hex-map-editor for testing
  - Need actual map data to test MCP
  - Save to /mnt/e/dnd/agastia-campaign/maps/
  - Test with /hex-encounter command

## 📊 Session Summary

**Created:**
- ✅ Hex Map MCP Server (mcp_server_hex_map/)
  - Tools: load_map_data, query_hex, add_poi, list_pois, get_area_summary
  - POI storage layer with persistence
  - Terrain analysis with neighbor detection

- ✅ /hex-encounter Slash Command
  - Terrain-based encounter generation
  - Follows CONTENT_GENERATION_WORKFLOW
  - Options-first approach enforced

- ✅ Documentation
  - README.md - Full API reference
  - INSTALL.md - Step-by-step setup
  - QUICK_START.md - 30-second workflow guide

**Next Session:**
- Install MCP to Claude config
- Export world map from editor
- Test /hex-encounter with real data
