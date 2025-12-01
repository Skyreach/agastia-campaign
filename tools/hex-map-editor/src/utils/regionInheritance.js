import {
  getParentHexCoords,
  isChildInParent,
  findOverlappingMaps,
  calculateOverlapPercentage,
  getChildHexBounds
} from './coordinateTranslation';

/**
 * Region Inheritance System
 *
 * When creating a new regional/zone map, automatically inherit data
 * from overlapping maps at the same scale.
 *
 * Rules:
 * - Newer data wins when regions overlap
 * - User edits override inherited data
 * - Track inheritance with metadata
 */

/**
 * Find all maps that overlap with a new region
 * @param {Object} newRegionBounds - { minRow, maxRow, minCol, maxCol }
 * @param {Array} existingMaps - All maps at the same scale
 * @param {string} scale - Map scale
 * @param {string} excludeMapId - Map ID to exclude (usually the new map itself)
 * @returns {Array} Overlapping maps with overlap percentage
 */
export function findOverlappingRegions(newRegionBounds, existingMaps, scale, excludeMapId = null) {
  return existingMaps
    .filter(map => {
      if (map.scale !== scale) return false;
      if (excludeMapId && map.id === excludeMapId) return false;

      // Get map bounds in coordinate space
      const mapBounds = {
        minRow: 0,
        maxRow: map.hexRows - 1,
        minCol: 0,
        maxCol: map.hexCols - 1
      };

      // Check overlap
      const overlapPct = calculateOverlapPercentage(newRegionBounds, mapBounds);
      return overlapPct > 0;
    })
    .map(map => {
      const mapBounds = {
        minRow: 0,
        maxRow: map.hexRows - 1,
        minCol: 0,
        maxCol: map.hexCols - 1
      };

      return {
        map,
        overlapPercentage: calculateOverlapPercentage(newRegionBounds, mapBounds)
      };
    })
    .sort((a, b) => b.overlapPercentage - a.overlapPercentage); // Highest overlap first
}

/**
 * Inherit hex data from overlapping regions
 * @param {Object} targetMap - The new map to populate
 * @param {Array} overlappingRegions - Result from findOverlappingRegions()
 * @param {Object} coordinateTransform - Function to convert source hex to target hex coords
 * @returns {Array} Inherited hexes with metadata
 */
export function inheritHexData(targetMap, overlappingRegions, coordinateTransform = null) {
  const inheritedHexes = [];
  const hexMap = new Map(); // Track hexes by key to handle overlaps

  // Process overlapping regions in order (highest overlap first)
  for (const { map: sourceMap, overlapPercentage } of overlappingRegions) {
    console.log(`Inheriting from ${sourceMap.name} (${overlapPercentage.toFixed(1)}% overlap)`);

    // Process each hex in the source map
    for (const sourceHex of sourceMap.hexes) {
      // Transform coordinates if needed (e.g., world → region)
      let targetRow, targetCol;

      if (coordinateTransform) {
        const transformed = coordinateTransform(sourceHex.row, sourceHex.col, sourceMap, targetMap);
        if (!transformed) continue; // Hex not in target region
        targetRow = transformed.row;
        targetCol = transformed.col;
      } else {
        // Same scale, use direct coordinates
        targetRow = sourceHex.row;
        targetCol = sourceHex.col;
      }

      // Check if hex is within target map bounds
      if (
        targetRow < 0 || targetRow >= targetMap.hexRows ||
        targetCol < 0 || targetCol >= targetMap.hexCols
      ) {
        continue;
      }

      const hexKey = `${targetRow},${targetCol}`;

      // Create inherited hex (or overwrite with newer data)
      const inheritedHex = {
        ...sourceHex,
        row: targetRow,
        col: targetCol,
        key: hexKey,
        // Inheritance metadata
        inheritedFrom: sourceMap.id,
        inheritedAt: Date.now(),
        overridden: false // User has not modified this hex yet
      };

      hexMap.set(hexKey, inheritedHex);
    }
  }

  return Array.from(hexMap.values());
}

/**
 * Merge user edits with inherited data
 * @param {Array} inheritedHexes - Hexes from inheritance
 * @param {Array} userHexes - Hexes created/edited by user
 * @returns {Array} Merged hex data
 */
export function mergeHexData(inheritedHexes, userHexes) {
  const hexMap = new Map();

  // Add inherited hexes first
  for (const hex of inheritedHexes) {
    hexMap.set(hex.key, hex);
  }

  // Overlay user hexes (they win)
  for (const hex of userHexes) {
    const existing = hexMap.get(hex.key);

    if (existing && existing.inheritedFrom) {
      // Mark as overridden
      hexMap.set(hex.key, {
        ...hex,
        inheritedFrom: existing.inheritedFrom,
        overridden: true,
        overriddenAt: Date.now()
      });
    } else {
      hexMap.set(hex.key, hex);
    }
  }

  return Array.from(hexMap.values());
}

/**
 * Extract hexes from parent map that fall within child region
 * Useful when creating a new regional map from a world map
 * @param {Object} parentMap - The parent scale map (e.g., world)
 * @param {number} parentHexRow - Which parent hex row
 * @param {number} parentHexCol - Which parent hex column
 * @param {Object} childMap - The child scale map being created (e.g., region)
 * @returns {Array} Hexes from parent that should be inherited
 */
export function extractParentHexData(parentMap, parentHexRow, parentHexCol, childMap) {
  const childBounds = getChildHexBounds(parentHexRow, parentHexCol);
  const inheritedHexes = [];

  // Find all hexes in parent map that fall within this parent hex
  for (const parentHex of parentMap.hexes) {
    if (isChildInParent(parentHex.row, parentHex.col, parentHexRow, parentHexCol)) {
      // Calculate relative position within parent hex
      const relRow = parentHex.row - childBounds.minRow;
      const relCol = parentHex.col - childBounds.minCol;

      // Check if within child map bounds
      if (relRow >= 0 && relRow < childMap.hexRows && relCol >= 0 && relCol < childMap.hexCols) {
        inheritedHexes.push({
          ...parentHex,
          row: relRow,
          col: relCol,
          key: `${relRow},${relCol}`,
          inheritedFrom: parentMap.id,
          inheritedAt: Date.now(),
          overridden: false
        });
      }
    }
  }

  return inheritedHexes;
}

/**
 * Check if a hex has been overridden by user
 * @param {Object} hex - Hex to check
 * @returns {boolean} True if user has modified this inherited hex
 */
export function isHexOverridden(hex) {
  return hex.inheritedFrom && hex.overridden === true;
}

/**
 * Get inheritance metadata for display
 * @param {Object} hex - Hex to analyze
 * @param {Array} allMaps - All maps for lookups
 * @returns {Object|null} Inheritance info or null
 */
export function getInheritanceInfo(hex, allMaps) {
  if (!hex.inheritedFrom) return null;

  const sourceMap = allMaps.find(m => m.id === hex.inheritedFrom);

  return {
    sourceMapName: sourceMap?.name || 'Unknown',
    inheritedAt: hex.inheritedAt,
    overridden: hex.overridden || false,
    overriddenAt: hex.overriddenAt || null
  };
}

/**
 * Calculate inheritance statistics for a map
 * @param {Array} hexes - Map hexes
 * @returns {Object} Stats about inheritance
 */
export function getInheritanceStats(hexes) {
  const stats = {
    total: hexes.length,
    inherited: 0,
    overridden: 0,
    userCreated: 0,
    sourcesMaps: new Set()
  };

  for (const hex of hexes) {
    if (hex.inheritedFrom) {
      stats.inherited++;
      stats.sourcesMaps.add(hex.inheritedFrom);

      if (hex.overridden) {
        stats.overridden++;
      }
    } else {
      stats.userCreated++;
    }
  }

  return {
    ...stats,
    sourceMaps: Array.from(stats.sourcesMaps)
  };
}
