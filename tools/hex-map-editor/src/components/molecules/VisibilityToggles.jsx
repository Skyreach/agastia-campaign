import { Button } from '../atoms';

/**
 * Toggle buttons for layer visibility
 */
export const VisibilityToggles = ({ showGrid, showIcons, onToggleGrid, onToggleIcons }) => {
  return (
    <div className="flex gap-1">
      <Button
        onClick={onToggleGrid}
        variant={showGrid ? 'success' : 'default'}
        title="Toggle hex grid"
      >
        Grid
      </Button>
      <Button
        onClick={onToggleIcons}
        variant={showIcons ? 'success' : 'default'}
        title="Toggle hex icons/labels"
      >
        Icons
      </Button>
    </div>
  );
};
