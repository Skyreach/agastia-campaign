import { useBreakpoint } from './useBreakpoint';
import { useViewport } from './useViewport';
import { useOrientation } from './useOrientation';
import { useDeviceCapabilities } from './useDeviceCapabilities';

/**
 * Composite hook combining all responsive utilities
 * Provides complete responsive context in one call
 * @returns {Object} Complete responsive context
 */
export const useResponsiveContext = () => {
  const breakpoint = useBreakpoint();
  const viewport = useViewport();
  const orientation = useOrientation();
  const capabilities = useDeviceCapabilities();

  return {
    // Breakpoint
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',

    // Viewport
    viewport,

    // Orientation
    orientation,

    // Capabilities
    capabilities,

    // Composite checks
    isTouchDevice: capabilities.hasTouch,
    isMouseDevice: capabilities.hasMouse,
    isHybridDevice: capabilities.hasTouch && capabilities.hasMouse,

    // Layout recommendations
    shouldUseCompactLayout: breakpoint === 'xs' || breakpoint === 'sm' || viewport.width < 640,
    shouldCollapseSidebar: breakpoint === 'md' || viewport.width < 1024,
    shouldUseFloatingToolbar: capabilities.hasTouch && (breakpoint === 'xs' || breakpoint === 'sm')
  };
};
