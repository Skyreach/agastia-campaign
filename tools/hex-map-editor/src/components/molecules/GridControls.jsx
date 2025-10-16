import { NumberInput } from '../atoms';

/**
 * Grid dimension controls
 */
export const GridControls = ({ hexCols, hexRows, onColsChange, onRowsChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Grid:</label>
      <NumberInput
        value={hexCols}
        onChange={(e) => onColsChange(parseInt(e.target.value) || 20)}
        title="Number of hex columns (auto-applies)"
        min={1}
      />
      <span className="text-xs">×</span>
      <NumberInput
        value={hexRows}
        onChange={(e) => onRowsChange(parseInt(e.target.value) || 15)}
        title="Number of hex rows (auto-applies)"
        min={1}
      />
    </div>
  );
};
