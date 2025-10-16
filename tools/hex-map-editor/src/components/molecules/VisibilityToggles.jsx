import { Button } from '../atoms';

/**
 * Toggle buttons for layer visibility
 */
export const VisibilityToggles = ({ showBg, showGrid, showIcons, onToggleBg, onToggleGrid, onToggleIcons }) => {
  return (
    <div className="flex gap-1">
      <Button
        onClick={onToggleBg}
        variant={showBg ? 'success' : 'default'}
        title="Toggle background image"
      >
        BG
      </Button>
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
