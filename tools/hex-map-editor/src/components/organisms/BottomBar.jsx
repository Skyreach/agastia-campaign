import { Crop, Hash } from 'lucide-react';
import { Button } from '../atoms';
import { VisibilityToggles, ZoomControls } from '../molecules';

/**
 * Bottom bar with view controls and status
 */
export const BottomBar = ({
  extractMode,
  showBg,
  showGrid,
  showIcons,
  zoom,
  currentMap,
  maps,
  currentRoad,
  onToggleExtractMode,
  onToggleBg,
  onToggleGrid,
  onToggleIcons,
  onNumberAllHexes,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFinishRoad
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <VisibilityToggles
          showBg={showBg}
          showGrid={showGrid}
          showIcons={showIcons}
          onToggleBg={onToggleBg}
          onToggleGrid={onToggleGrid}
          onToggleIcons={onToggleIcons}
        />

        <div className="h-6 w-px bg-gray-300" />

        <Button
          onClick={onNumberAllHexes}
          variant="indigo"
          icon={Hash}
          title="Toggle: Auto-number all hexes (click again to clear)"
        >
          Number All
        </Button>

        <Button
          onClick={onToggleExtractMode}
          variant={extractMode ? 'success' : 'default'}
          icon={Crop}
          title="Extract region: Create new regional map"
        >
          {extractMode ? 'Cancel Extract' : 'Extract Region'}
        </Button>

        {currentRoad && (
          <Button
            onClick={onFinishRoad}
            variant="success"
            title="Finish current road"
          >
            Finish Road
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-600">
          {currentMap.name} • {currentMap.hexCols}×{currentMap.hexRows} •
          {currentMap.hexes.length} hexes • {maps.length} maps
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <ZoomControls
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onZoomReset}
        />
      </div>
    </div>
  );
};
