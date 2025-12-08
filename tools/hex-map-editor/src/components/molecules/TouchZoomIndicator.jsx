import { useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useResponsiveContext } from '../../hooks/useResponsiveContext';

/**
 * Visual indicator for zoom level and gesture hints (mobile only)
 * Shows:
 * - Current zoom level
 * - Zoom in/out hints
 * - Gesture tutorial overlay (first time)
 */
export const TouchZoomIndicator = ({ zoom, onZoomIn, onZoomOut, onZoomReset }) => {
  const { isMobile } = useResponsiveContext();
  const [showHint, setShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show hint on first load (mobile only)
  useEffect(() => {
    if (isMobile && !hasInteracted) {
      const timer = setTimeout(() => setShowHint(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasInteracted]);

  // Hide hint after interaction
  const handleInteraction = () => {
    setHasInteracted(true);
    setShowHint(false);
  };

  // Don't show on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Zoom level indicator */}
      <div className="fixed top-20 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
        <button
          onClick={() => {
            onZoomOut();
            handleInteraction();
          }}
          disabled={zoom <= 0.25}
          className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut size={20} />
        </button>

        <div className="min-w-[60px] text-center">
          <div className="text-sm font-semibold">{Math.round(zoom * 100)}%</div>
          <div className="text-xs text-gray-500">zoom</div>
        </div>

        <button
          onClick={() => {
            onZoomIn();
            handleInteraction();
          }}
          disabled={zoom >= 5}
          className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn size={20} />
        </button>

        {zoom !== 1 && (
          <button
            onClick={() => {
              onZoomReset();
              handleInteraction();
            }}
            className="p-1 hover:bg-gray-100 rounded-full border-l border-gray-200 ml-1 pl-2"
            title="Reset zoom"
          >
            <Maximize2 size={18} />
          </button>
        )}
      </div>

      {/* Gesture hint overlay (first time only) */}
      {showHint && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center"
          onClick={handleInteraction}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Touch Gestures</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤏</div>
                <div>
                  <strong>Pinch to zoom</strong>
                  <p className="text-gray-500">Use two fingers to zoom in/out</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">👆</div>
                <div>
                  <strong>Double tap</strong>
                  <p className="text-gray-500">Quick zoom to 2x</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">👉</div>
                <div>
                  <strong>Drag to pan</strong>
                  <p className="text-gray-500">Pan around when zoomed in</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleInteraction}
              className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
