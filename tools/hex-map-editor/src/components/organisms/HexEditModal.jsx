import { X } from 'lucide-react';
import { Button, Input } from '../atoms';

/**
 * Modal for editing hex properties
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
  if (!hex) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border-2 border-blue-500 max-w-lg w-full z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Edit Hex #{hex.number}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Label</label>
        <Input
          value={labelInput}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="e.g., Dragon's Peak"
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Events</label>
        <textarea
          value={eventsInput}
          onChange={(e) => onEventsChange(e.target.value)}
          placeholder="What happened here?"
          className="border border-gray-300 rounded px-3 py-2 w-full h-24 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave} variant="primary">
          Save
        </Button>
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
      </div>
    </div>
  );
};
