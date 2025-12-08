import { Button, Input } from '../atoms';
import { ResponsiveModal } from './ResponsiveModal';

/**
 * Modal for editing hex properties
 * Uses ResponsiveModal for automatic mobile/desktop adaptation
 */
export const HexEditModal = ({
  hex,
  labelInput,
  eventsInput,
  onLabelChange,
  onEventsChange,
  onSave,
  onClose
}) => {
  return (
    <ResponsiveModal
      isOpen={!!hex}
      onClose={onClose}
      title={`Edit Hex ${hex?.number ? `#${hex.number}` : ''}`}
      footer={
        <>
          <Button onClick={onClose} variant="default">
            Cancel
          </Button>
          <Button onClick={onSave} variant="primary">
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Label
          </label>
          <Input
            value={labelInput}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="e.g., Dragon's Peak"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Events
          </label>
          <textarea
            value={eventsInput}
            onChange={(e) => onEventsChange(e.target.value)}
            placeholder="What happened here?"
            className="border border-gray-300 rounded px-3 py-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </ResponsiveModal>
  );
};
