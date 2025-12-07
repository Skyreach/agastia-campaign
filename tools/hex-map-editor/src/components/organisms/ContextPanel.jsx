import { X } from 'lucide-react';
import { useResponsiveContext } from '../../hooks/useResponsiveContext';
import { Select } from '../atoms';
import { FactionPalette } from '../molecules';
import { ROAD_TYPES } from '../../constants/roads';

/**
 * Responsive wrapper for context-sensitive tool options
 * - Desktop/Tablet: Side panel (RightPanel)
 * - Mobile: Bottom sheet
 */
export const ContextPanel = ({
  selectedTool,
  selectedFaction,
  roadType,
  onFactionSelect,
  onRoadTypeChange,
  onClose
}) => {
  const { isMobile } = useResponsiveContext();

  // Don't show if tool doesn't need context panel
  if (selectedTool !== 'faction' && selectedTool !== 'road') {
    return null;
  }

  // Mobile: Bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />

        {/* Bottom sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
          <div className="p-6">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedTool === 'faction' ? 'Faction Colors' : 'Road Type'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Close panel"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
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
                  className="mb-4"
                />
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  Click hex centers to add waypoints. Click the last hex again to finish the road.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Desktop/Tablet: Side panel
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
