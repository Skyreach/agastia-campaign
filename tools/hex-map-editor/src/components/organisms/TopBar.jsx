import { Upload, Trash2, Download, Save, FolderOpen, RotateCcw, Map } from 'lucide-react';
import { Button, Input, Select, Divider } from '../atoms';
import { GridControls } from '../molecules';
import { MAP_SCALES } from '../../constants/mapDefaults';

/**
 * Top bar with file operations and map info
 */
export const TopBar = ({
  maps,
  currentMapId,
  currentMap,
  iconLabel,
  fileInputRef,
  onFileInputClick,
  onImageUpload,
  onMapSelect,
  onMapDelete,
  onMapNameChange,
  onIconLabelChange,
  onGridChange,
  onExportMap,
  onSaveData,
  onLoadData,
  onClearRivers,
  onClearRoads,
  onClearStorage,
  onLoadDefaultMap
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-3 flex flex-wrap gap-3 items-center text-sm">
      {/* File Operations */}
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

      <Button
        onClick={onSaveData}
        variant="success"
        icon={Save}
        title="Save all maps as JSON"
      >
        Save
      </Button>

      <label className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer inline-flex items-center gap-2" title="Load saved maps">
        <FolderOpen size={16} />
        Load
        <input
          type="file"
          accept=".json"
          onChange={onLoadData}
          className="hidden"
        />
      </label>

      <Divider />

      {/* Export */}
      <Button
        onClick={() => onExportMap(true)}
        variant="default"
        icon={Download}
        title="Export full map with background"
      >
        Export Full
      </Button>

      <Button
        onClick={() => onExportMap(false)}
        variant="purple"
        icon={Download}
        title="Export player map (no background)"
      >
        Export Player
      </Button>

      <Divider />

      {/* Map Selection */}
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

      {maps.length > 1 && (
        <Button
          onClick={() => {
            if (confirm(`Delete "${currentMap.name}"? This cannot be undone.`)) {
              onMapDelete(currentMapId);
            }
          }}
          variant="danger"
          icon={Trash2}
          title="Delete current map"
        />
      )}

      <Input
        value={currentMap.mapName}
        onChange={(e) => onMapNameChange(e.target.value)}
        placeholder="Map Name"
        className="w-40"
        title="Name your map"
      />

      <Divider />

      {/* Grid Controls */}
      <GridControls
        hexCols={currentMap.hexCols}
        hexRows={currentMap.hexRows}
        onColsChange={(val) => onGridChange({ hexCols: val })}
        onRowsChange={(val) => onGridChange({ hexRows: val })}
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

      <Input
        value={iconLabel}
        onChange={(e) => onIconLabelChange(e.target.value)}
        placeholder="Icon Label (optional)"
        className="w-40"
        title="Type label BEFORE placing icon"
      />

      <Divider />

      {/* Utility Actions */}
      <Button
        onClick={onClearRivers}
        variant="danger"
        title="Clear all rivers"
      >
        Clear Rivers
      </Button>

      <Button
        onClick={onClearRoads}
        variant="danger"
        title="Clear all roads"
      >
        Clear Roads
      </Button>

      <Button
        onClick={onLoadDefaultMap}
        variant="default"
        icon={Map}
        title="Load default Agastia world map"
      >
        Load Default
      </Button>

      <Button
        onClick={onClearStorage}
        variant="danger"
        icon={RotateCcw}
        title="Clear all saved data and reset"
      >
        Reset All
      </Button>
    </div>
  );
};
