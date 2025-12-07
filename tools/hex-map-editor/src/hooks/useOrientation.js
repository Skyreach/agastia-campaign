import { useState, useEffect } from 'react';

/**
 * Hook to detect device orientation
 * @returns {Object} Orientation info {type, isPortrait, isLandscape}
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.screen?.orientation?.type || 'portrait-primary'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation.type);
    };

    // Modern API
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);

      return () => {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      };
    }

    // Fallback: listen to resize and detect based on dimensions
    const handleResize = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait-primary' : 'landscape-primary');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    type: orientation,
    isPortrait: orientation.includes('portrait'),
    isLandscape: orientation.includes('landscape')
  };
};
