import { CANVAS_DEFAULTS, REGION_SCALE_FACTOR } from '../constants/mapDefaults';
import { getRegionalHexesForWorldHex } from './hexHelpers';

/**
 * Create regional map from extracted world hexes
 */
export const createRegionalMap = (currentMap, extractPreview, maps, currentMapId) => {
  if (!extractPreview || !currentMap.bgImage) {
    throw new Error('Missing extraction preview or background image');
  }

  const { x1, y1, x2, y2 } = extractPreview.bounds;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const width = maxX - minX;
  const height = maxY - minY;

  // Crop background image
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = width;
  cropCanvas.height = height;
  const cropCtx = cropCanvas.getContext('2d');
  cropCtx.drawImage(currentMap.bgImage, minX, minY, width, height, 0, 0, width, height);

  let croppedImageData;
  const croppedImg = new Image();
  try {
    croppedImageData = cropCanvas.toDataURL('image/png');
    croppedImg.src = croppedImageData;
  } catch (err) {
    croppedImageData = null;
  }

  // Calculate regional hex size
  const regionalHexSize = currentMap.hexSize / REGION_SCALE_FACTOR;

  // Calculate new grid dimensions
  const newHexCols = Math.ceil(width / (regionalHexSize * 1.5));
  const newHexRows = Math.ceil(height / (regionalHexSize * Math.sqrt(3)));

  // Create new map ID and name
  const newMapId = `region-${Date.now()}`;
  const regionName = `${currentMap.mapName || 'Map'} - Region ${maps.filter(m => m.parentMapId === currentMapId).length + 1}`;

  // Build regional hexes with parent relationships
  const regionalHexes = [];
  let regionalHexNumber = 10001;

  extractPreview.hexes.forEach(worldHex => {
    const regHexCoords = getRegionalHexesForWorldHex(
      worldHex,
      currentMap.hexSize,
      regionalHexSize,
      minX,
      minY
    );

    regHexCoords.forEach(({ row, col }) => {
      regionalHexes.push({
        key: `${row},${col}`,
        row,
        col,
        number: regionalHexNumber++,
        icon: worldHex.icon,
        faction: worldHex.faction,
        label: worldHex.label,
        events: worldHex.events,
        iconLabel: worldHex.iconLabel,
        parentHexNumber: worldHex.number
      });
    });
  });

  // Create new regional map
  return {
    id: newMapId,
    name: regionName,
    scale: 'region',
    parentHex: currentMapId,
    mapName: regionName,
    bgImage: croppedImg,
    bgImageData: croppedImageData,
    hexSize: regionalHexSize,
    hexCols: newHexCols,
    hexRows: newHexRows,
    hexes: regionalHexes,
    riverEdges: [],
    roads: [],
    parentMapId: currentMapId,
    parentHexes: extractPreview.hexes.map(h => ({
      number: h.number,
      label: h.label,
      icon: h.icon,
      iconLabel: h.iconLabel,
      events: h.events,
      faction: h.faction
    }))
  };
};
