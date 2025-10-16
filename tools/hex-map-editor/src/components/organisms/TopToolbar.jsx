import { Upload } from 'lucide-react';
import { Button, Input, Divider, Select } from '../atoms';
import { GridControls, ZoomControls } from '../molecules';
import { MAP_SCALES } from '../../constants/mapDefaults';

/**
 * Top toolbar with map controls
 */
export const TopToolbar = ({
  maps,
  currentMapId,
  currentMap,
  zoom,
  iconLabel,
  fileInputRef,
  onFileInputClick,
  onImageUpload,
  onMapSelect,
  onMapNameChange,
  onIconLabelChange,
  onGridChange,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) => {
  return (
    <div className="bg-white shadow-md p-3 flex flex-wrap gap-2 items-center text-sm border-b">
      <Button
        onClick={onFileInputClick}
        variant="primary"
        icon={Upload}
        title="Upload background map image"
      >
        Upload Map
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />

      <Divider />

      <Select
        value={currentMapId}
        onChange={(e) => onMapSelect(e.target.value)}
        title="Switch between maps"
        renderOption={(map) => (
          <option key={map.id} value={map.id}>
            {map.name} ({map.scale === MAP_SCALES.WORLD ? '24mi' : '3mi'})
            {map.parentMapId && ` ← ${maps.find(m => m.id === map.parentMapId)?.name || 'Parent'}`}
          </option>
        )}
        options={maps}
      />

      <Input
        value={currentMap.mapName}
        onChange={(e) => onMapNameChange(e.target.value)}
        placeholder="Map Name"
        className="w-40"
        title="Name your map for organization"
      />

      <Input
        value={iconLabel}
        onChange={(e) => onIconLabelChange(e.target.value)}
        placeholder="Icon Label (optional)"
        className="w-40"
        title="Optional: Type label BEFORE placing icon - will be saved to that specific hex"
      />

      {currentMap.scale === MAP_SCALES.REGION && (
        <Input
          value={currentMap.parentHex}
          onChange={(e) => onGridChange({ parentHex: e.target.value })}
          placeholder="Parent Hex #"
          className="w-32"
          title="Which world hex does this region map?"
        />
      )}

      <Divider />

      <GridControls
        hexCols={currentMap.hexCols}
        hexRows={currentMap.hexRows}
        onColsChange={(val) => onGridChange({ hexCols: val })}
        onRowsChange={(val) => onGridChange({ hexRows: val })}
      />

      <Divider />

      <ZoomControls
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onZoomReset}
      />
    </div>
  );
};
