import { MAP_SCALES } from '../constants/mapDefaults';

/**
 * Coordinate Translation for 3-Tier Hex Hierarchy
 *
 * Hierarchy:
 * - World: 24 mi/hex
 * - Region: 3 mi/hex (8x subdivision of world)
 * - Zone: 0.375 mi/hex (8x subdivision of region)
 *
 * Each parent hex contains an 8x8 grid of child hexes (64 total)
 * Uses offset coordinates (row, col)
 */

const SUBDIVISION_FACTOR = 8; // Each parent hex = 8x8 child hexes

/**
 * Convert parent hex coordinates to child hex grid bounds
 * @param {number} parentRow - Parent hex row
 * @param {number} parentCol - Parent hex column
 * @returns {Object} { minRow, maxRow, minCol, maxCol } - Bounds of child hex grid
 */
export function getChildHexBounds(parentRow, parentCol) {
  const minRow = parentRow * SUBDIVISION_FACTOR;
  const maxRow = minRow + SUBDIVISION_FACTOR - 1;
  const minCol = parentCol * SUBDIVISION_FACTOR;
  const maxCol = minCol + SUBDIVISION_FACTOR - 1;

  return { minRow, maxRow, minCol, maxCol };
}

/**
 * Convert child hex coordinates to parent hex coordinates
 * @param {number} childRow - Child hex row
 * @param {number} childCol - Child hex column
 * @returns {Object} { row, col } - Parent hex coordinates
 */
export function getParentHexCoords(childRow, childCol) {
  return {
    row: Math.floor(childRow / SUBDIVISION_FACTOR),
    col: Math.floor(childCol / SUBDIVISION_FACTOR)
  };
}

/**
 * Check if a child hex is contained within a parent hex
 * @param {number} childRow - Child hex row
 * @param {number} childCol - Child hex column
 * @param {number} parentRow - Parent hex row
 * @param {number} parentCol - Parent hex column
 * @returns {boolean} True if child is inside parent
 */
export function isChildInParent(childRow, childCol, parentRow, parentCol) {
  const bounds = getChildHexBounds(parentRow, parentCol);
  return (
    childRow >= bounds.minRow &&
    childRow <= bounds.maxRow &&
    childCol >= bounds.minCol &&
    childCol <= bounds.maxCol
  );
}

/**
 * Get all child hex coordinates within a parent hex
 * @param {number} parentRow - Parent hex row
 * @param {number} parentCol - Parent hex column
 * @returns {Array} Array of { row, col } child hex coordinates
 */
export function getAllChildHexes(parentRow, parentCol) {
  const bounds = getChildHexBounds(parentRow, parentCol);
  const children = [];

  for (let row = bounds.minRow; row <= bounds.maxRow; row++) {
    for (let col = bounds.minCol; col <= bounds.maxCol; col++) {
      children.push({ row, col });
    }
  }

  return children;
}

/**
 * Convert world hex to region hex coordinates
 * @param {number} worldRow - World hex row
 * @param {number} worldCol - World hex column
 * @returns {Object} { minRow, maxRow, minCol, maxCol } - Region hex bounds
 */
export function worldToRegionBounds(worldRow, worldCol) {
  return getChildHexBounds(worldRow, worldCol);
}

/**
 * Convert region hex to world hex coordinates
 * @param {number} regionRow - Region hex row
 * @param {number} regionCol - Region hex column
 * @returns {Object} { row, col } - World hex coordinates
 */
export function regionToWorldCoords(regionRow, regionCol) {
  return getParentHexCoords(regionRow, regionCol);
}

/**
 * Convert region hex to zone hex coordinates
 * @param {number} regionRow - Region hex row
 * @param {number} regionCol - Region hex column
 * @returns {Object} { minRow, maxRow, minCol, maxCol } - Zone hex bounds
 */
export function regionToZoneBounds(regionRow, regionCol) {
  return getChildHexBounds(regionRow, regionCol);
}

/**
 * Convert zone hex to region hex coordinates
 * @param {number} zoneRow - Zone hex row
 * @param {number} zoneCol - Zone hex column
 * @returns {Object} { row, col } - Region hex coordinates
 */
export function zoneToRegionCoords(zoneRow, zoneCol) {
  return getParentHexCoords(zoneRow, zoneCol);
}

/**
 * Convert zone hex to world hex coordinates (double-level lookup)
 * @param {number} zoneRow - Zone hex row
 * @param {number} zoneCol - Zone hex column
 * @returns {Object} { row, col } - World hex coordinates
 */
export function zoneToWorldCoords(zoneRow, zoneCol) {
  // Zone -> Region
  const regionCoords = zoneToRegionCoords(zoneRow, zoneCol);
  // Region -> World
  return regionToWorldCoords(regionCoords.row, regionCoords.col);
}

/**
 * Convert world hex to zone hex bounds (double-level subdivision)
 * @param {number} worldRow - World hex row
 * @param {number} worldCol - World hex column
 * @returns {Object} { minRow, maxRow, minCol, maxCol } - Zone hex bounds
 */
export function worldToZoneBounds(worldRow, worldCol) {
  const factor = SUBDIVISION_FACTOR * SUBDIVISION_FACTOR; // 64
  const minRow = worldRow * factor;
  const maxRow = minRow + factor - 1;
  const minCol = worldCol * factor;
  const maxCol = minCol + factor - 1;

  return { minRow, maxRow, minCol, maxCol };
}

/**
 * Calculate relative position of child within parent (0-1 range)
 * @param {number} childRow - Child hex row
 * @param {number} childCol - Child hex column
 * @param {number} parentRow - Parent hex row
 * @param {number} parentCol - Parent hex column
 * @returns {Object} { rowRatio, colRatio } - Position within parent (0-1)
 */
export function getRelativePosition(childRow, childCol, parentRow, parentCol) {
  const bounds = getChildHexBounds(parentRow, parentCol);

  return {
    rowRatio: (childRow - bounds.minRow) / (SUBDIVISION_FACTOR - 1),
    colRatio: (childCol - bounds.minCol) / (SUBDIVISION_FACTOR - 1)
  };
}

/**
 * Get parent hex coordinates from map ID
 * Parses parentMapId to extract parent hex number
 * @param {string} parentMapId - ID of parent map
 * @param {Array} maps - All maps
 * @returns {Object|null} { row, col } or null if not found
 */
export function getParentHexFromMapId(parentMapId, maps) {
  const parentMap = maps.find(m => m.id === parentMapId);
  if (!parentMap) return null;

  // Parse hex number from parentHex field
  // Assumes format like "Hex 1234" or just "1234"
  const hexMatch = parentMap.parentHex?.match(/\d+/);
  if (!hexMatch) return null;

  const hexNumber = parseInt(hexMatch[0]);

  // Convert hex number to row/col
  // This depends on the hex numbering system
  // For now, assume simple row-major order
  const row = Math.floor((hexNumber - 1) / parentMap.hexCols);
  const col = (hexNumber - 1) % parentMap.hexCols;

  return { row, col };
}

/**
 * Find all maps that overlap with a given hex region
 * @param {Object} bounds - { minRow, maxRow, minCol, maxCol }
 * @param {Array} maps - All maps at the same scale
 * @param {string} scale - Map scale to check
 * @returns {Array} Maps that overlap with bounds
 */
export function findOverlappingMaps(bounds, maps, scale) {
  return maps.filter(map => {
    if (map.scale !== scale) return false;

    // Get this map's bounds
    const mapBounds = {
      minRow: 0,
      maxRow: map.hexRows - 1,
      minCol: 0,
      maxCol: map.hexCols - 1
    };

    // Check if bounds overlap
    const rowOverlap = !(bounds.maxRow < mapBounds.minRow || bounds.minRow > mapBounds.maxRow);
    const colOverlap = !(bounds.maxCol < mapBounds.minCol || bounds.minCol > mapBounds.maxCol);

    return rowOverlap && colOverlap;
  });
}

/**
 * Calculate overlap percentage between two hex regions
 * @param {Object} bounds1 - First region bounds
 * @param {Object} bounds2 - Second region bounds
 * @returns {number} Percentage of overlap (0-100)
 */
export function calculateOverlapPercentage(bounds1, bounds2) {
  // Calculate intersection
  const rowOverlap = Math.max(0,
    Math.min(bounds1.maxRow, bounds2.maxRow) -
    Math.max(bounds1.minRow, bounds2.minRow) + 1
  );

  const colOverlap = Math.max(0,
    Math.min(bounds1.maxCol, bounds2.maxCol) -
    Math.max(bounds1.minCol, bounds2.minCol) + 1
  );

  const overlapArea = rowOverlap * colOverlap;

  // Calculate total area of bounds1
  const totalArea =
    (bounds1.maxRow - bounds1.minRow + 1) *
    (bounds1.maxCol - bounds1.minCol + 1);

  return totalArea > 0 ? (overlapArea / totalArea) * 100 : 0;
}
