import { useState, useEffect } from 'react';

/**
 * Hook to match against media queries
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} Whether the query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
