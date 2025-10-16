import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '../atoms';

/**
 * Zoom control buttons
 */
export const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onZoomOut}
        variant="default"
        title="Zoom out"
        icon={ZoomOut}
      />
      <span className="text-sm font-medium w-16 text-center">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        onClick={onZoomIn}
        variant="default"
        title="Zoom in"
        icon={ZoomIn}
      />
      <Button
        onClick={onReset}
        variant="default"
        title="Reset zoom"
        icon={RotateCcw}
      />
    </div>
  );
};
