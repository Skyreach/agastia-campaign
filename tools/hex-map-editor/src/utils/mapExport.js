import { CANVAS_DEFAULTS } from '../constants/mapDefaults';
import { drawHexGrid, drawHex, drawSmoothPaths, drawRoads } from './canvasDrawing';
import { ROAD_TYPES } from '../constants/roads';

/**
 * Export map as PNG
 */
export const exportMapImage = (map, includeBackground, showBg) => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = map.bgImage ? map.bgImage.width : CANVAS_DEFAULTS.width;
    const height = map.bgImage ? map.bgImage.height : CANVAS_DEFAULTS.height;

    canvas.width = width;
    canvas.height = height;

    // Background
    if (includeBackground && showBg && map.bgImage) {
      ctx.drawImage(map.bgImage, 0, 0);
    } else {
      ctx.fillStyle = '#f7fafc';
      ctx.fillRect(0, 0, width, height);
    }

    // Grid
    drawHexGrid(ctx, map.hexRows, map.hexCols, map.hexSize);

    // Roads
    drawRoads(ctx, map.roads, ROAD_TYPES, map.hexSize);

    // Rivers
    drawSmoothPaths(ctx, map.riverEdges, '#3b82f6', 6, map.hexSize);

    // Hexes
    map.hexes.forEach(hex => {
      drawHex(ctx, hex, map.hexSize);
    });

    const link = document.createElement('a');
    const scaleLabel = map.scale === 'world' ? '24mi' : '3mi';
    const mapLabel = map.name.replace(/\s+/g, '-').toLowerCase();
    link.download = includeBackground ?
      `${mapLabel}-${scaleLabel}-full.png` :
      `${mapLabel}-${scaleLabel}-player.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    alert('Error exporting map: ' + err.message);
  }
};

/**
 * Save map data as JSON
 */
export const saveMapData = (maps, currentMapId) => {
  try {
    const data = {
      maps: maps.map(map => ({
        ...map,
        bgImage: null,
        bgImageData: map.bgImageData
      })),
      currentMapId
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const filename = `hex-maps-${Date.now()}.json`;
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
  } catch (err) {
    alert('Error saving maps: ' + err.message);
  }
};

/**
 * Load map data from JSON file
 */
export const loadMapData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const loadedMaps = data.maps.map(map => {
          if (map.bgImageData) {
            const img = new Image();
            img.src = map.bgImageData;
            return { ...map, bgImage: img };
          }
          return map;
        });

        resolve({
          maps: loadedMaps,
          currentMapId: data.currentMapId || loadedMaps[0]?.id || 'world-1'
        });
      } catch (err) {
        reject(new Error('Error loading maps: ' + err.message));
      }
    };
    reader.readAsText(file);
  });
};
