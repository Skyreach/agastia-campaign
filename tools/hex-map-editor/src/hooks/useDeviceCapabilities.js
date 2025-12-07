import { useState, useEffect } from 'react';

/**
 * Hook to detect device capabilities (touch, mouse, stylus, etc.)
 * @returns {Object} Device capabilities
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasTouch: false,
    hasMouse: false,
    hasStylus: false,
    maxTouchPoints: 0,
    devicePixelRatio: 1,
    isHighDPI: false,
    supportsHover: false,
    colorScheme: 'light'
  });

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    const hasStylus = navigator.maxTouchPoints === 1 && hasMouse;
    const dpr = window.devicePixelRatio || 1;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    setCapabilities({
      hasTouch,
      hasMouse,
      hasStylus,
      maxTouchPoints: navigator.maxTouchPoints,
      devicePixelRatio: dpr,
      isHighDPI: dpr > 1,
      supportsHover,
      colorScheme
    });

    // Listen for color scheme changes
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e) => {
      setCapabilities(prev => ({
        ...prev,
        colorScheme: e.matches ? 'dark' : 'light'
      }));
    };

    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, []);

  return capabilities;
};
