import { X, ZoomIn } from 'lucide-react';
import { Button } from '../atoms';
import { ICON_TYPES } from '../../constants/icons';
import { FACTIONS } from '../../constants/factions';

/**
 * Modal for region extraction preview and confirmation
 */
export const ExtractModal = ({
  extractPreview,
  onConfirm,
  onCancel
}) => {
  if (!extractPreview) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border-2 border-green-500 max-w-2xl w-full z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <ZoomIn size={24} /> Extract Regional Map
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p className="text-sm font-medium mb-2">
          📍 This region contains {extractPreview.hexes.length} world hexes
        </p>
        <p className="text-xs text-gray-600">Regional hexes will start at #10001</p>
        <p className="text-xs text-gray-600 mt-1">
          Scale: Converting from 24mi/hex to 3mi/hex (8x subdivision)
        </p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Parent Hexes (will be subdivided):</h4>
        <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
          {extractPreview.hexes.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hexes in selected area</p>
          ) : (
            extractPreview.hexes.map(hex => (
              <div key={hex.key} className="text-sm py-1 border-b last:border-0">
                <span className="font-bold text-blue-600">#{hex.number}</span>
                {hex.label && <span className="ml-2 text-gray-800">{hex.label}</span>}
                {hex.icon && (
                  <span className="ml-2 text-gray-600">
                    ({ICON_TYPES[hex.icon]?.label}
                    {hex.iconLabel ? ` - ${hex.iconLabel}` : ''})
                  </span>
                )}
                {hex.events && <span className="ml-2 text-red-500 text-xs">🔴 Events</span>}
                {hex.faction !== null && (
                  <span className="ml-2 text-xs">({FACTIONS[hex.faction]?.name})</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
        <p className="text-sm font-medium mb-2">💡 How Regional Maps Work:</p>
        <ol className="text-xs space-y-2 ml-4 list-decimal">
          <li>
            <strong>New map created in dropdown</strong> - Instantly switch between world and regional views
          </li>
          <li>
            <strong>8x subdivision</strong> - Each world hex becomes ~64 regional hexes (24mi → 3mi scale)
          </li>
          <li>
            <strong>Preserved data</strong> - Faction territories, icons, labels carry over to regional hexes
          </li>
          <li>
            <strong>Independent editing</strong> - Changes to regional map don't affect world map
          </li>
          <li>
            <strong>Save includes all</strong> - One JSON file stores your entire campaign
          </li>
        </ol>
      </div>

      <div className="flex gap-2">
        <Button onClick={onConfirm} variant="success" className="font-semibold">
          Create Regional Map
        </Button>
        <Button onClick={onCancel} variant="default">
          Cancel
        </Button>
      </div>
    </div>
  );
};
