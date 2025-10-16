import { useEffect } from 'react';
import { CANVAS_DEFAULTS } from '../constants/mapDefaults';
import { ROAD_TYPES } from '../constants/roads';
import {
  drawHexGrid,
  drawHex,
  drawSmoothPaths,
  drawExtractionSelection,
  drawRoads,
  drawCurrentRoad
} from '../utils/canvasDrawing';

/**
 * Hook to handle canvas rendering
 */
export const useCanvasRenderer = ({
  canvasRef,
  currentMap,
  zoom,
  showBg,
  showGrid,
  showIcons,
  extractMode,
  extractCorner1,
  extractCorner2,
  currentRoad
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const baseWidth = currentMap.bgImage ? currentMap.bgImage.width : CANVAS_DEFAULTS.width;
    const baseHeight = currentMap.bgImage ? currentMap.bgImage.height : CANVAS_DEFAULTS.height;

    // Set actual canvas resolution (for rendering quality)
    canvas.width = baseWidth;
    canvas.height = baseHeight;

    // Scale canvas to fill viewport while maintaining aspect ratio
    const container = canvas.parentElement;
    if (container) {
      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = container.clientHeight - 32;
      const scaleX = containerWidth / baseWidth;
      const scaleY = containerHeight / baseHeight;
      const baseScale = Math.min(scaleX, scaleY, 1); // Don't upscale beyond original

      canvas.style.width = `${baseWidth * baseScale * zoom}px`;
      canvas.style.height = `${baseHeight * baseScale * zoom}px`;
    } else {
      // Fallback to original behavior
      canvas.style.width = `${baseWidth * zoom}px`;
      canvas.style.height = `${baseHeight * zoom}px`;
    }

    ctx.clearRect(0, 0, baseWidth, baseHeight);

    // Background
    if (showBg && currentMap.bgImage) {
      ctx.drawImage(currentMap.bgImage, 0, 0);
    }

    // Extraction selection
    if (extractMode) {
      drawExtractionSelection(ctx, extractCorner1, extractCorner2);
    }

    // Grid
    if (showGrid) {
      drawHexGrid(ctx, currentMap.hexRows, currentMap.hexCols, currentMap.hexSize);
    }

    // Roads
    drawRoads(ctx, currentMap.roads, ROAD_TYPES, currentMap.hexSize);

    // Current road being drawn
    drawCurrentRoad(ctx, currentRoad, ROAD_TYPES, currentMap.hexSize);

    // Rivers
    drawSmoothPaths(ctx, currentMap.riverEdges, '#3b82f6', 6, currentMap.hexSize);

    // Hexes
    if (showIcons) {
      currentMap.hexes.forEach(hex => {
        drawHex(ctx, hex, currentMap.hexSize);
      });
    }
  }, [
    canvasRef,
    currentMap,
    zoom,
    showBg,
    showGrid,
    showIcons,
    extractMode,
    extractCorner1,
    extractCorner2,
    currentRoad
  ]);
};
