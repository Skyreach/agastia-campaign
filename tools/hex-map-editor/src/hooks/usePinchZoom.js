import { useGesture } from '@use-gesture/react';
import { useRef } from 'react';

/**
 * Hook for pinch-to-zoom gesture on canvas
 * Returns gesture handlers and current zoom/pan state
 */
export const usePinchZoom = ({
  initialZoom = 1,
  minZoom = 0.25,
  maxZoom = 5,
  onZoomChange,
  onPanChange,
  enabled = true
}) => {
  const zoomRef = useRef(initialZoom);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Gesture handlers using @use-gesture/react
  const bind = useGesture(
    {
      // Pinch gesture for zoom
      onPinch: ({ offset: [scale], origin: [ox, oy], first, memo }) => {
        if (!enabled) return;

        // Calculate zoom level
        const newZoom = Math.max(minZoom, Math.min(maxZoom, scale));

        if (first) {
          // Store initial state
          memo = {
            initialZoom: zoomRef.current,
            initialOffset: { ...offsetRef.current }
          };
        }

        // Update zoom
        zoomRef.current = newZoom;
        if (onZoomChange) {
          onZoomChange(newZoom);
        }

        return memo;
      },

      // Drag gesture for panning (when zoomed in)
      onDrag: ({ offset: [x, y], pinching, cancel }) => {
        if (!enabled) return;

        // Don't pan while pinching
        if (pinching) {
          cancel();
          return;
        }

        // Only allow panning when zoomed in
        if (zoomRef.current <= 1) {
          return;
        }

        offsetRef.current = { x, y };
        if (onPanChange) {
          onPanChange({ x, y });
        }
      },

      // Double tap to zoom in/out
      onDoubleTap: ({ event }) => {
        if (!enabled) return;

        event.preventDefault();

        // Toggle between 1x and 2x zoom
        const newZoom = zoomRef.current === 1 ? 2 : 1;
        zoomRef.current = newZoom;

        // Reset pan when zooming out to 1x
        if (newZoom === 1) {
          offsetRef.current = { x: 0, y: 0 };
          if (onPanChange) {
            onPanChange({ x: 0, y: 0 });
          }
        }

        if (onZoomChange) {
          onZoomChange(newZoom);
        }
      }
    },
    {
      // Gesture options
      pinch: {
        scaleBounds: { min: minZoom, max: maxZoom },
        rubberband: true
      },
      drag: {
        from: () => [offsetRef.current.x, offsetRef.current.y]
      },
      eventOptions: { passive: false } // Prevent default scrolling
    }
  );

  return {
    bind,
    zoom: zoomRef.current,
    offset: offsetRef.current
  };
};
