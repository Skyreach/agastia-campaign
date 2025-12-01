import { X } from 'lucide-react';
import { Select } from '../atoms';
import { FactionPalette } from '../molecules';
import { ROAD_TYPES } from '../../constants/roads';

/**
 * Right panel for context-sensitive tool options
 */
export const RightPanel = ({
  selectedTool,
  selectedFaction,
  roadType,
  onFactionSelect,
  onRoadTypeChange,
  onClose
}) => {
  if (selectedTool !== 'faction' && selectedTool !== 'road') {
    return null;
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {selectedTool === 'faction' ? 'Faction Colors' : 'Road Type'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {selectedTool === 'faction' && (
        <FactionPalette
          selectedFaction={selectedFaction}
          onSelectFaction={onFactionSelect}
        />
      )}

      {selectedTool === 'road' && (
        <div>
          <Select
            value={roadType}
            onChange={(e) => onRoadTypeChange(e.target.value)}
            title="Select road type"
            options={Object.entries(ROAD_TYPES).map(([key, style]) => ({
              value: key,
              label: style.label
            }))}
          />
          <p className="text-xs text-gray-500 mt-2">
            Click hex centers to add waypoints. Click the last hex again to finish the road.
          </p>
        </div>
      )}
    </div>
  );
};
