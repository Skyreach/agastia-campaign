import { useRef } from 'react';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';

/**
 * Canvas for rendering hex map
 */
export const HexCanvas = ({
  currentMap,
  zoom,
  showGrid,
  showIcons,
  extractMode,
  extractCorner1,
  extractCorner2,
  currentRoad,
  onCanvasClick
}) => {
  const canvasRef = useRef(null);

  useCanvasRenderer({
    canvasRef,
    currentMap,
    zoom,
    showGrid,
    showIcons,
    extractMode,
    extractCorner1,
    extractCorner2,
    currentRoad
  });

  return (
    <canvas
      ref={canvasRef}
      onClick={onCanvasClick}
      className="border border-gray-300 shadow-lg bg-white cursor-crosshair"
    />
  );
};
