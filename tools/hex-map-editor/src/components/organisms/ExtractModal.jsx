import { ZoomIn } from 'lucide-react';
import { Button } from '../atoms';
import { ResponsiveModal } from './ResponsiveModal';
import { ICON_TYPES } from '../../constants/icons';
import { FACTIONS } from '../../constants/factions';

/**
 * Modal for region extraction preview and confirmation
 * Uses ResponsiveModal for automatic mobile/desktop adaptation
 */
export const ExtractModal = ({
  extractPreview,
  onConfirm,
  onCancel
}) => {
  return (
    <ResponsiveModal
      isOpen={!!extractPreview}
      onClose={onCancel}
      title={
        <span className="flex items-center gap-2">
          <ZoomIn size={20} /> Extract Regional Map
        </span>
      }
      footer={
        <>
          <Button onClick={onCancel} variant="default">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="success" className="font-semibold">
            Create Regional Map
          </Button>
        </>
      }
      variant="auto"
      className="max-w-2xl"
    >

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm font-medium mb-2">
            📍 This region contains {extractPreview?.hexes?.length || 0} world hexes
          </p>
          <p className="text-xs text-gray-600">Regional hexes will start at #10001</p>
          <p className="text-xs text-gray-600 mt-1">
            Scale: Converting from 24mi/hex to 3mi/hex (8x subdivision)
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Parent Hexes (will be subdivided):</h4>
          <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
            {!extractPreview?.hexes || extractPreview.hexes.length === 0 ? (
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

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
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
      </div>
    </ResponsiveModal>
  );
};
