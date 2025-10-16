import { MAP_SCALES } from '../constants/mapDefaults';
import { calculateHexSize } from './hexGeometry';

/**
 * Load default world map
 */
export const loadDefaultWorldMap = () => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const hexCols = 80;
      const hexRows = 60;
      const hexSize = calculateHexSize(img.width, img.height, hexCols, hexRows);

      resolve({
        id: 'world-1',
        name: 'Agastia World Map',
        mapName: 'Agastia World Map',
        scale: MAP_SCALES.WORLD,
        hexCols,
        hexRows,
        hexSize,
        hexes: [],
        riverEdges: [],
        roads: [],
        bgImage: img,
        bgImageData: img.src,
        parentMapId: null,
        parentHex: null
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load default world map'));
    };
    img.src = '/agastia-campaign/default-world-map.jpg';
  });
};
