import { openDB } from 'idb';

const DB_NAME = 'HexMapEditorDB';
const DB_VERSION = 1;
const MAPS_STORE = 'maps';
const STATE_STORE = 'state';

/**
 * Initialize IndexedDB with schema
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Maps store - one entry per map
      if (!db.objectStoreNames.contains(MAPS_STORE)) {
        const mapsStore = db.createObjectStore(MAPS_STORE, { keyPath: 'id' });
        mapsStore.createIndex('scale', 'scale');
        mapsStore.createIndex('parentMapId', 'parentMapId');
        mapsStore.createIndex('lastModified', 'lastModified');
      }

      // State store - app-level state (currentMapId, etc)
      if (!db.objectStoreNames.contains(STATE_STORE)) {
        db.createObjectStore(STATE_STORE);
      }
    }
  });
}

/**
 * Save all maps to IndexedDB
 * @param {Array} maps - Array of map objects
 * @param {string} currentMapId - ID of currently active map
 */
export async function saveToIndexedDB(maps, currentMapId) {
  try {
    const db = await initDB();
    const tx = db.transaction([MAPS_STORE, STATE_STORE], 'readwrite');

    // Add timestamp to each map
    const timestamp = Date.now();
    for (const map of maps) {
      await tx.objectStore(MAPS_STORE).put({
        ...map,
        lastModified: timestamp
      });
    }

    // Save current map ID
    await tx.objectStore(STATE_STORE).put(currentMapId, 'currentMapId');

    await tx.done;

    // Also save to localStorage as backup
    saveToLocalStorageBackup(maps, currentMapId);

    return { success: true };
  } catch (error) {
    console.error('IndexedDB save failed:', error);
    // Fallback to localStorage only
    saveToLocalStorageBackup(maps, currentMapId);
    return { success: false, error };
  }
}

/**
 * Load all maps from IndexedDB
 * @returns {Object} { maps: Array, currentMapId: string } or null if not found
 */
export async function loadFromIndexedDB() {
  try {
    const db = await initDB();
    const tx = db.transaction([MAPS_STORE, STATE_STORE], 'readonly');

    const maps = await tx.objectStore(MAPS_STORE).getAll();
    const currentMapId = await tx.objectStore(STATE_STORE).get('currentMapId');

    await tx.done;

    if (maps.length === 0) {
      return null;
    }

    return {
      maps: maps.sort((a, b) => a.lastModified - b.lastModified),
      currentMapId: currentMapId || maps[0].id
    };
  } catch (error) {
    console.error('IndexedDB load failed:', error);
    // Fallback to localStorage
    return loadFromLocalStorageBackup();
  }
}

/**
 * Save single map to IndexedDB (for auto-save)
 * @param {Object} map - Map object to save
 */
export async function saveMapToIndexedDB(map) {
  try {
    const db = await initDB();
    await db.put(MAPS_STORE, {
      ...map,
      lastModified: Date.now()
    });
    return { success: true };
  } catch (error) {
    console.error('IndexedDB map save failed:', error);
    return { success: false, error };
  }
}

/**
 * Delete map from IndexedDB
 * @param {string} mapId - ID of map to delete
 */
export async function deleteMapFromIndexedDB(mapId) {
  try {
    const db = await initDB();
    await db.delete(MAPS_STORE, mapId);
    return { success: true };
  } catch (error) {
    console.error('IndexedDB delete failed:', error);
    return { success: false, error };
  }
}

/**
 * Clear all data from IndexedDB
 */
export async function clearIndexedDB() {
  try {
    const db = await initDB();
    const tx = db.transaction([MAPS_STORE, STATE_STORE], 'readwrite');
    await tx.objectStore(MAPS_STORE).clear();
    await tx.objectStore(STATE_STORE).clear();
    await tx.done;
    return { success: true };
  } catch (error) {
    console.error('IndexedDB clear failed:', error);
    return { success: false, error };
  }
}

/**
 * Get storage quota information
 */
export async function getStorageInfo() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
    };
  } catch (error) {
    console.error('Storage estimate failed:', error);
    return null;
  }
}

// LocalStorage backup functions (crash recovery)
const STORAGE_KEY = 'hexMapData';

function saveToLocalStorageBackup(maps, currentMapId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ maps, currentMapId }));
  } catch (err) {
    console.error('LocalStorage backup failed:', err);
  }
}

function loadFromLocalStorageBackup() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('LocalStorage load failed:', err);
    return null;
  }
}

export function clearLocalStorageBackup() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('LocalStorage clear failed:', err);
  }
}
