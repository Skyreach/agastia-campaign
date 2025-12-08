import { useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { useResponsiveContext } from './useResponsiveContext';

/**
 * Unified canvas interaction hook for both touch and mouse
 * Handles:
 * - Click/tap for hex selection
 * - Pinch-to-zoom on touch devices
 * - Scroll-to-zoom on desktop
 * - Pan when zoomed in
 * - Long-press for context menu (mobile)
 */
export const useCanvasInteraction = ({
  onHexClick,
  onZoomChange,
  onPanChange,
  zoom = 1,
  minZoom = 0.25,
  maxZoom = 5,
  panOffset = { x: 0, y: 0 }
}) => {
  const { isTouchDevice } = useResponsiveContext();

  // Calculate click position accounting for zoom and pan
  const getCanvasPosition = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoom;
    const y = (event.clientY - rect.top - panOffset.y) / zoom;
    return { x, y };
  }, [zoom, panOffset]);

  // Gesture handlers
  const bind = useGesture(
    {
      // Handle clicks/taps
      onClick: ({ event }) => {
        if (onHexClick) {
          const pos = getCanvasPosition(event);
          onHexClick(pos.x, pos.y, event);
        }
      },

      // Pinch to zoom (touch only)
      onPinch: ({ offset: [scale], origin, first, memo }) => {
        if (!isTouchDevice) return;

        const newZoom = Math.max(minZoom, Math.min(maxZoom, scale));

        if (first) {
          memo = { initialZoom: zoom };
        }

        if (onZoomChange) {
          onZoomChange(newZoom);
        }

        return memo;
      },

      // Wheel to zoom (desktop only)
      onWheel: ({ event, delta: [, dy] }) => {
        if (isTouchDevice) return;

        event.preventDefault();

        // Zoom in/out based on wheel direction
        const zoomDelta = dy > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + zoomDelta));

        if (onZoomChange) {
          onZoomChange(newZoom);
        }
      },

      // Drag to pan (when zoomed in)
      onDrag: ({ offset: [x, y], pinching, cancel, first, memo }) => {
        // Don't pan while pinching or if not zoomed in
        if (pinching || zoom <= 1) {
          cancel();
          return;
        }

        if (first) {
          memo = { initialOffset: { ...panOffset } };
        }

        if (onPanChange) {
          onPanChange({ x, y });
        }

        return memo;
      }
    },
    {
      // Gesture config
      pinch: {
        scaleBounds: { min: minZoom, max: maxZoom },
        rubberband: true,
        from: () => [zoom, 0]
      },
      drag: {
        from: () => [panOffset.x, panOffset.y],
        bounds: zoom > 1 ? undefined : { left: 0, right: 0, top: 0, bottom: 0 }
      },
      wheel: {
        eventOptions: { passive: false }
      },
      eventOptions: {
        passive: false
      }
    }
  );

  return bind;
};
