#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// State management
let mapData = null;
let poisData = {};
let mapFilePath = null;
let poisFilePath = null;

/**
 * Axial coordinate conversion for hex neighbors
 * Using flat-top hexes with offset coordinates
 */
function getHexNeighbors(row, col) {
  // Offset coordinates for flat-top hexes
  const offset = row % 2 === 0 ? 0 : 1;

  return {
    N:  { row: row - 1, col: col },
    NE: { row: row - 1, col: col + offset },
    SE: { row: row + 1, col: col + offset },
    S:  { row: row + 1, col: col },
    SW: { row: row + 1, col: col - 1 + offset },
    NW: { row: row - 1, col: col - 1 + offset }
  };
}

/**
 * Find hex in map data
 */
function findHex(hexes, row, col) {
  const key = `${row},${col}`;
  return hexes.find(h => h.key === key);
}

/**
 * Derive terrain type from hex data
 */
function getTerrainType(hex) {
  if (!hex) return 'unknown';

  // Derive from icon or faction
  if (hex.icon === 'tree' || hex.icon === 'forest') return 'forest';
  if (hex.icon === 'mountain' || hex.icon === 'peak') return 'mountains';
  if (hex.icon === 'castle' || hex.icon === 'tower') return 'settlement';
  if (hex.icon === 'skull' || hex.icon === 'ruins') return 'ruins';
  if (hex.icon === 'cave') return 'cave';
  if (hex.icon === 'water') return 'water';

  // Default based on faction
  if (hex.faction === 'chaos_cult') return 'corrupted';
  if (hex.faction === 'merit_council') return 'civilized';

  return 'grassland'; // default
}

/**
 * Check if hex has river on specific edge
 */
function hasRiver(riverEdges, hex1Key, hex2Key) {
  return riverEdges.some(r =>
    (r.hex1 === hex1Key && r.hex2 === hex2Key) ||
    (r.hex1 === hex2Key && r.hex2 === hex1Key)
  );
}

/**
 * Check if hex has road connecting to neighbor
 */
function getRoadType(roads, hex1Key, hex2Key) {
  for (const road of roads) {
    const idx1 = road.hexes.indexOf(hex1Key);
    const idx2 = road.hexes.indexOf(hex2Key);

    if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) {
      return road.roadType;
    }
  }
  return null;
}

/**
 * Load map data from JSON file
 */
async function loadMapData(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');
  mapData = JSON.parse(data);
  mapFilePath = filePath;

  // Load POIs if they exist
  const poisPath = filePath.replace('.json', '_pois.json');
  poisFilePath = poisPath;

  try {
    const poisContent = await fs.readFile(poisPath, 'utf-8');
    poisData = JSON.parse(poisContent);
  } catch (err) {
    // POIs file doesn't exist yet, that's fine
    poisData = {};
  }

  return {
    loaded: true,
    mapCount: mapData.maps.length,
    currentMap: mapData.currentMapId
  };
}

/**
 * Query hex terrain and surroundings
 */
function queryHex(hexCoord, includeNeighbors = true, includePois = true) {
  if (!mapData) {
    throw new Error('No map data loaded. Use load_map_data tool first.');
  }

  // Parse hex coordinate
  let row, col;
  if (typeof hexCoord === 'string') {
    [row, col] = hexCoord.split(',').map(Number);
  } else {
    row = hexCoord.row;
    col = hexCoord.col;
  }

  // Find current map
  const currentMap = mapData.maps.find(m => m.id === mapData.currentMapId);
  if (!currentMap) {
    throw new Error('Current map not found');
  }

  // Find hex
  const hex = findHex(currentMap.hexes, row, col);
  const hexKey = `${row},${col}`;

  const result = {
    hex: {
      coordinates: { row, col },
      key: hexKey,
      number: hex?.number || null,
      terrain: getTerrainType(hex),
      label: hex?.label || null,
      icon: hex?.icon || null,
      faction: hex?.faction || null,
      events: hex?.events || null,
      iconLabel: hex?.iconLabel || null
    }
  };

  // Include neighbors if requested
  if (includeNeighbors) {
    const neighbors = getHexNeighbors(row, col);
    result.neighbors = {};

    for (const [direction, coords] of Object.entries(neighbors)) {
      const neighborHex = findHex(currentMap.hexes, coords.row, coords.col);
      const neighborKey = `${coords.row},${coords.col}`;

      result.neighbors[direction] = {
        coordinates: coords,
        key: neighborKey,
        terrain: getTerrainType(neighborHex),
        label: neighborHex?.label || null,
        icon: neighborHex?.icon || null,
        hasRiver: hasRiver(currentMap.riverEdges, hexKey, neighborKey),
        roadType: getRoadType(currentMap.roads, hexKey, neighborKey)
      };
    }
  }

  // Include POIs if requested
  if (includePois) {
    result.pois = poisData[hexKey] || [];
  }

  return result;
}

/**
 * Add POI to hex
 */
async function addPoi(hexCoord, poi) {
  if (!mapData) {
    throw new Error('No map data loaded. Use load_map_data tool first.');
  }

  // Parse hex coordinate
  let hexKey;
  if (typeof hexCoord === 'string') {
    hexKey = hexCoord;
  } else {
    hexKey = `${hexCoord.row},${hexCoord.col}`;
  }

  // Initialize POI array for hex if needed
  if (!poisData[hexKey]) {
    poisData[hexKey] = [];
  }

  // Add POI with ID
  const poiWithId = {
    id: `poi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...poi,
    createdAt: new Date().toISOString()
  };

  poisData[hexKey].push(poiWithId);

  // Save POIs to file
  await fs.writeFile(poisFilePath, JSON.stringify(poisData, null, 2));

  return {
    success: true,
    poi: poiWithId,
    hex: hexKey
  };
}

/**
 * List all POIs (optionally filtered by type)
 */
function listPois(type = null) {
  const allPois = [];

  for (const [hexKey, pois] of Object.entries(poisData)) {
    for (const poi of pois) {
      if (!type || poi.type === type) {
        allPois.push({
          hex: hexKey,
          ...poi
        });
      }
    }
  }

  return allPois;
}

/**
 * Get terrain summary for area
 */
function getAreaSummary(centerRow, centerCol, radius = 2) {
  if (!mapData) {
    throw new Error('No map data loaded. Use load_map_data tool first.');
  }

  const currentMap = mapData.maps.find(m => m.id === mapData.currentMapId);
  if (!currentMap) {
    throw new Error('Current map not found');
  }

  const terrainCounts = {};
  const hexes = [];

  // BFS to get all hexes within radius
  const visited = new Set();
  const queue = [{ row: centerRow, col: centerCol, distance: 0 }];
  visited.add(`${centerRow},${centerCol}`);

  while (queue.length > 0) {
    const { row, col, distance } = queue.shift();

    if (distance > radius) continue;

    const hex = findHex(currentMap.hexes, row, col);
    const terrain = getTerrainType(hex);

    terrainCounts[terrain] = (terrainCounts[terrain] || 0) + 1;
    hexes.push({
      coordinates: { row, col },
      terrain,
      distance,
      label: hex?.label || null
    });

    if (distance < radius) {
      const neighbors = getHexNeighbors(row, col);
      for (const coords of Object.values(neighbors)) {
        const key = `${coords.row},${coords.col}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ ...coords, distance: distance + 1 });
        }
      }
    }
  }

  return {
    center: { row: centerRow, col: centerCol },
    radius,
    hexCount: hexes.length,
    terrainDistribution: terrainCounts,
    hexes
  };
}

// MCP Server setup
const server = new Server(
  {
    name: 'hex-map-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'load_map_data',
        description: 'Load hex map data from JSON file exported from hex-map-editor',
        inputSchema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Absolute path to the hex map JSON file'
            }
          },
          required: ['file_path']
        }
      },
      {
        name: 'query_hex',
        description: 'Query terrain, neighbors, roads, rivers, and POIs for a specific hex',
        inputSchema: {
          type: 'object',
          properties: {
            hex: {
              oneOf: [
                { type: 'string', description: 'Hex coordinate as "row,col" (e.g., "10,5")' },
                {
                  type: 'object',
                  properties: {
                    row: { type: 'number' },
                    col: { type: 'number' }
                  },
                  required: ['row', 'col']
                }
              ]
            },
            include_neighbors: {
              type: 'boolean',
              description: 'Include data for 6 neighboring hexes (default: true)',
              default: true
            },
            include_pois: {
              type: 'boolean',
              description: 'Include points of interest for this hex (default: true)',
              default: true
            }
          },
          required: ['hex']
        }
      },
      {
        name: 'add_poi',
        description: 'Add a point of interest or encounter to a hex',
        inputSchema: {
          type: 'object',
          properties: {
            hex: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    row: { type: 'number' },
                    col: { type: 'number' }
                  }
                }
              ]
            },
            poi: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Name of the POI' },
                type: {
                  type: 'string',
                  enum: ['shop', 'dungeon', 'encounter', 'landmark', 'quest', 'npc', 'other'],
                  description: 'Type of POI'
                },
                description: { type: 'string', description: 'Detailed description' },
                encounter_cr: { type: 'number', description: 'Challenge rating for encounters' },
                loot: { type: 'string', description: 'Loot or rewards available' },
                notes: { type: 'string', description: 'Additional DM notes' }
              },
              required: ['name', 'type', 'description']
            }
          },
          required: ['hex', 'poi']
        }
      },
      {
        name: 'list_pois',
        description: 'List all POIs, optionally filtered by type',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['shop', 'dungeon', 'encounter', 'landmark', 'quest', 'npc', 'other'],
              description: 'Filter by POI type (optional)'
            }
          }
        }
      },
      {
        name: 'get_area_summary',
        description: 'Get terrain distribution summary for an area around a hex',
        inputSchema: {
          type: 'object',
          properties: {
            center_row: { type: 'number', description: 'Center hex row' },
            center_col: { type: 'number', description: 'Center hex column' },
            radius: {
              type: 'number',
              description: 'Radius in hexes (default: 2)',
              default: 2
            }
          },
          required: ['center_row', 'center_col']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'load_map_data':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(await loadMapData(args.file_path), null, 2)
          }]
        };

      case 'query_hex':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(queryHex(args.hex, args.include_neighbors, args.include_pois), null, 2)
          }]
        };

      case 'add_poi':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(await addPoi(args.hex, args.poi), null, 2)
          }]
        };

      case 'list_pois':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(listPois(args.type), null, 2)
          }]
        };

      case 'get_area_summary':
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(getAreaSummary(args.center_row, args.center_col, args.radius), null, 2)
          }]
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: error.message }, null, 2)
      }],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hex Map MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
