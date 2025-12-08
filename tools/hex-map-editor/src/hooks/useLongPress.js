import { useCallback, useRef } from 'react';

/**
 * Hook for long-press detection
 * Useful for opening context menus on mobile devices
 */
export const useLongPress = (
  onLongPress,
  onClick,
  { threshold = 500, shouldPreventDefault = true } = {}
) => {
  const longPressTriggered = useRef(false);
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false
        });
        target.current = event.target;
      }

      longPressTriggered.current = false;

      timeout.current = setTimeout(() => {
        if (onLongPress) {
          onLongPress(event);
          longPressTriggered.current = true;
        }
      }, threshold);
    },
    [onLongPress, threshold, shouldPreventDefault]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);

      if (shouldTriggerClick && !longPressTriggered.current && onClick) {
        onClick(event);
      }

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [onClick, shouldPreventDefault]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onTouchEnd: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchCancel: (e) => clear(e, false)
  };
};

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

const isTouchEvent = (event) => {
  return 'touches' in event;
};
