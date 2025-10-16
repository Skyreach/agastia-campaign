import { HEX_NUMBERING_BASE } from '../constants/mapDefaults';
import { getHexCoords, isPointInHex } from './hexGeometry';

/**
 * Get hex numbering base based on scale
 */
export const getHexNumberingBase = (scale) => {
  return HEX_NUMBERING_BASE[scale] || 1;
};

/**
 * Get hexes within rectangular bounds
 */
export const getHexesInRect = (hexes, x1, y1, x2, y2, hexSize) => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  return hexes.filter(hex => {
    const { x, y } = getHexCoords(hex.row, hex.col, hexSize);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  });
};

/**
 * Map world hex to regional hexes
 */
export const getRegionalHexesForWorldHex = (worldHex, worldHexSize, regionalHexSize, offsetX, offsetY) => {
  const { x: worldX, y: worldY } = getHexCoords(worldHex.row, worldHex.col, worldHexSize);
  const regionalHexes = [];

  const searchRadius = 15;
  for (let row = -searchRadius; row < searchRadius; row++) {
    for (let col = -searchRadius; col < searchRadius; col++) {
      const regX = col * regionalHexSize * 1.5 + offsetX;
      const regY = row * regionalHexSize * Math.sqrt(3) +
                   (col % 2 ? regionalHexSize * Math.sqrt(3) / 2 : 0) + offsetY;

      if (isPointInHex(regX, regY, worldX, worldY, worldHexSize)) {
        regionalHexes.push({ row, col });
      }
    }
  }

  return regionalHexes;
};

/**
 * Create default hex object
 */
export const createHex = (row, col, number, overrides = {}) => {
  return {
    key: `${row},${col}`,
    row,
    col,
    number,
    icon: null,
    faction: null,
    label: '',
    events: '',
    iconLabel: '',
    ...overrides
  };
};
