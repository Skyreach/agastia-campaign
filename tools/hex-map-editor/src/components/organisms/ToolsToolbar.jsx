import { Trash2, FileText, Crop, Hash, Download } from 'lucide-react';
import { Button, Divider, Select } from '../atoms';
import { ToolButton, TextToolButton, FactionPalette, VisibilityToggles } from '../molecules';
import { ICON_TYPES } from '../../constants/icons';
import { ROAD_TYPES } from '../../constants/roads';

/**
 * Tools toolbar with all editing tools
 */
export const ToolsToolbar = ({
  selectedTool,
  selectedFaction,
  roadType,
  currentRoad,
  extractMode,
  showBg,
  showGrid,
  showIcons,
  onToolSelect,
  onFactionSelect,
  onRoadTypeChange,
  onNumberAllHexes,
  onToggleExtractMode,
  onToggleBg,
  onToggleGrid,
  onToggleIcons,
  onExportMap,
  onSaveData,
  onLoadData,
  onClearRivers,
  onClearRoads,
  onFinishRoad
}) => {
  return (
    <div className="bg-white shadow-md p-4 flex flex-wrap gap-3 items-center text-base">
      <div className="flex gap-1 flex-wrap items-center">
        <TextToolButton
          label="#"
          isActive={selectedTool === 'number'}
          onClick={() => onToolSelect('number')}
          title="Add numbered hex"
        />

        {Object.entries(ICON_TYPES).map(([key, data]) => (
          <ToolButton
            key={key}
            icon={data.icon}
            label={data.label}
            isActive={selectedTool === key}
            onClick={() => onToolSelect(key)}
          />
        ))}

        <ToolButton
          icon={FileText}
          label="Edit hex (label + events)"
          isActive={selectedTool === 'edit'}
          onClick={() => onToolSelect('edit')}
        />

        <TextToolButton
          label="Faction"
          isActive={selectedTool === 'faction'}
          onClick={() => onToolSelect('faction')}
          title="Paint faction territory"
        />

        <TextToolButton
          label="River"
          isActive={selectedTool === 'river'}
          onClick={() => onToolSelect('river')}
          title="Draw river (click edges)"
        />

        <TextToolButton
          label="Road"
          isActive={selectedTool === 'road'}
          onClick={() => onToolSelect('road')}
          title="Draw road (click hex centers, click last hex again to finish)"
        />

        {selectedTool === 'road' && (
          <Select
            value={roadType}
            onChange={(e) => onRoadTypeChange(e.target.value)}
            title="Select road type"
            options={Object.entries(ROAD_TYPES).map(([key, style]) => ({
              value: key,
              label: style.label
            }))}
          />
        )}

        <ToolButton
          icon={Trash2}
          label="Erase hex"
          isActive={selectedTool === 'erase'}
          onClick={() => onToolSelect('erase')}
        />
      </div>

      {selectedTool === 'faction' && (
        <>
          <Divider />
          <FactionPalette
            selectedFaction={selectedFaction}
            onSelectFaction={onFactionSelect}
          />
        </>
      )}

      <Divider />

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
        title="Extract region: Create new regional map at 3mi/hex scale"
      >
        {extractMode ? 'Cancel Extract' : 'Extract Region'}
      </Button>

      <Divider />

      <VisibilityToggles
        showBg={showBg}
        showGrid={showGrid}
        showIcons={showIcons}
        onToggleBg={onToggleBg}
        onToggleGrid={onToggleGrid}
        onToggleIcons={onToggleIcons}
      />

      <Divider />

      <Button
        onClick={() => onExportMap(true)}
        variant="success"
        icon={Download}
        title="Export full map with background"
      >
        Full
      </Button>

      <Button
        onClick={() => onExportMap(false)}
        variant="purple"
        icon={Download}
        title="Export player map (no background)"
      >
        Player
      </Button>

      <Button
        onClick={onSaveData}
        variant="warning"
        title="Save all maps as JSON"
      >
        Save
      </Button>

      <label className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer" title="Load saved maps">
        Load
        <input
          type="file"
          accept=".json"
          onChange={onLoadData}
          className="hidden"
        />
      </label>

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
  );
};
