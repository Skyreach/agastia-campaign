import { useState, useEffect } from 'react';

/**
 * Hook to track viewport dimensions and orientation
 * @returns {Object} Viewport info {width, height, aspectRatio, isPortrait, isLandscape}
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    isLandscape: window.innerWidth >= window.innerHeight
  });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setViewport({
          width,
          height,
          aspectRatio: width / height,
          isPortrait: height > width,
          isLandscape: width >= height
        });
      }, 150); // 150ms debounce
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
};
