export const MAP_SCALES = {
  WORLD: 'world',
  REGION: 'region'
};

export const HEX_NUMBERING_BASE = {
  [MAP_SCALES.WORLD]: 1,
  [MAP_SCALES.REGION]: 10001
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

export const REGION_SCALE_FACTOR = 8; // 24mi/hex → 3mi/hex
