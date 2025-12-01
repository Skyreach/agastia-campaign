import { useEffect, useRef, useState, useCallback } from 'react';
import { saveToIndexedDB } from '../utils/storage/storageManager';

/**
 * Auto-save hook with debouncing
 *
 * Features:
 * - Debounced saves (2s delay)
 * - Save status indicator
 * - beforeunload warning for unsaved changes
 * - Immediate save on unmount
 */

export const SAVE_STATUS = {
  SAVED: 'saved',
  SAVING: 'saving',
  UNSAVED: 'unsaved',
  ERROR: 'error'
};

export function useAutoSave(maps, currentMapId, isLoading, debounceMs = 2000) {
  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.SAVED);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const saveTimeoutRef = useRef(null);
  const isSavingRef = useRef(false);
  const hasUnsavedChangesRef = useRef(false);

  /**
   * Perform the actual save operation
   */
  const performSave = useCallback(async () => {
    if (isSavingRef.current || maps.length === 0) {
      return;
    }

    isSavingRef.current = true;
    setSaveStatus(SAVE_STATUS.SAVING);
    setSaveError(null);

    try {
      const result = await saveToIndexedDB(maps, currentMapId);

      if (result.success) {
        setSaveStatus(SAVE_STATUS.SAVED);
        setLastSaveTime(Date.now());
        hasUnsavedChangesRef.current = false;
      } else {
        setSaveStatus(SAVE_STATUS.ERROR);
        setSaveError(result.error?.message || 'Save failed');
        hasUnsavedChangesRef.current = true;
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setSaveStatus(SAVE_STATUS.ERROR);
      setSaveError(error.message);
      hasUnsavedChangesRef.current = true;
    } finally {
      isSavingRef.current = false;
    }
  }, [maps, currentMapId]);

  /**
   * Trigger debounced save
   */
  const triggerSave = useCallback(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Mark as unsaved
    setSaveStatus(SAVE_STATUS.UNSAVED);
    hasUnsavedChangesRef.current = true;

    // Schedule save
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);
  }, [performSave, debounceMs]);

  /**
   * Force immediate save (for unmount, navigation, etc.)
   */
  const forceSave = useCallback(async () => {
    // Cancel pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Perform immediate save
    await performSave();
  }, [performSave]);

  /**
   * Auto-save when maps or currentMapId changes
   */
  useEffect(() => {
    if (!isLoading && maps.length > 0) {
      triggerSave();
    }
  }, [maps, currentMapId, isLoading, triggerSave]);

  /**
   * Save immediately on unmount
   */
  useEffect(() => {
    return () => {
      if (hasUnsavedChangesRef.current && maps.length > 0) {
        // Synchronous save on unmount (best effort)
        saveToIndexedDB(maps, currentMapId);
      }
    };
  }, [maps, currentMapId]);

  /**
   * beforeunload handler - warn about unsaved changes
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    lastSaveTime,
    saveError,
    forceSave,
    triggerSave
  };
}

/**
 * Format last save time for display
 * @param {number|null} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
export function formatLastSaveTime(timestamp) {
  if (!timestamp) return 'Never';

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 1000) return 'Just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return new Date(timestamp).toLocaleString();
}

/**
 * Get save status display info
 * @param {string} status - SAVE_STATUS value
 * @returns {Object} { text, color, icon }
 */
export function getSaveStatusDisplay(status) {
  switch (status) {
    case SAVE_STATUS.SAVED:
      return { text: 'Saved', color: 'text-green-600', icon: '✓' };
    case SAVE_STATUS.SAVING:
      return { text: 'Saving...', color: 'text-blue-600', icon: '⟳' };
    case SAVE_STATUS.UNSAVED:
      return { text: 'Unsaved changes', color: 'text-yellow-600', icon: '●' };
    case SAVE_STATUS.ERROR:
      return { text: 'Save failed', color: 'text-red-600', icon: '✗' };
    default:
      return { text: 'Unknown', color: 'text-gray-600', icon: '?' };
  }
}
