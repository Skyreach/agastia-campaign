import { useState, useCallback } from 'react';
import { MAP_SCALES, DEFAULT_MAP_CONFIG } from '../constants/mapDefaults';

/**
 * Hook to manage map state
 */
export const useMapState = () => {
  const [maps, setMaps] = useState([{
    id: 'world-1',
    name: 'World Map',
    scale: MAP_SCALES.WORLD,
    parentHex: '',
    mapName: 'World Map',
    ...DEFAULT_MAP_CONFIG
  }]);

  const [currentMapId, setCurrentMapId] = useState('world-1');

  const currentMap = maps.find(m => m.id === currentMapId) || maps[0];

  const updateCurrentMap = useCallback((updates) => {
    setMaps(prev => prev.map(m =>
      m.id === currentMapId ? { ...m, ...updates } : m
    ));
  }, [currentMapId]);

  const addMap = useCallback((newMap) => {
    setMaps(prev => [...prev, newMap]);
  }, []);

  return {
    maps,
    setMaps,
    currentMapId,
    setCurrentMapId,
    currentMap,
    updateCurrentMap,
    addMap
  };
};
