/**
 * Map scale hierarchy:
 * - WORLD: 24 mi/hex
 * - REGION: 3 mi/hex (8x subdivision of world)
 * - ZONE: 0.375 mi/hex (8x subdivision of region)
 */
export const MAP_SCALES = {
  WORLD: 'world',
  REGION: 'region',
  ZONE: 'zone'
};

/**
 * Hex numbering base for each scale
 * - World: 1-10000
 * - Region: 10001-20000
 * - Zone: 20001+
 */
export const HEX_NUMBERING_BASE = {
  [MAP_SCALES.WORLD]: 1,
  [MAP_SCALES.REGION]: 10001,
  [MAP_SCALES.ZONE]: 20001
};

/**
 * Scale metadata (display names and hex size in miles)
 */
export const SCALE_INFO = {
  [MAP_SCALES.WORLD]: { label: 'World Map', milesPerHex: 24 },
  [MAP_SCALES.REGION]: { label: 'Regional Map', milesPerHex: 3 },
  [MAP_SCALES.ZONE]: { label: 'Zone Map', milesPerHex: 0.375 }
};

export const DEFAULT_MAP_CONFIG = {
  hexSize: 60,
  hexCols: 20,
  hexRows: 15,
  bgImage: null,
  bgImageData: null,
  hexes: [],
  riverEdges: [],
  roads: [],
  parentMapId: null,
  parentHexes: []
};

export const CANVAS_DEFAULTS = {
  width: 1200,
  height: 800
};

export const SUBDIVISION_FACTOR = 8; // Each parent hex = 8x8 child hexes (64 total)
