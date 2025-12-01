import { Save, AlertCircle, Loader2, Check } from 'lucide-react';
import { getSaveStatusDisplay, formatLastSaveTime, SAVE_STATUS } from '../../hooks/useAutoSave';

/**
 * Save status indicator component
 * Shows current save status with icon and timestamp
 */
export const SaveStatusIndicator = ({ status, lastSaveTime, error }) => {
  const display = getSaveStatusDisplay(status);

  const getIcon = () => {
    switch (status) {
      case SAVE_STATUS.SAVED:
        return <Check size={14} className="text-green-600" />;
      case SAVE_STATUS.SAVING:
        return <Loader2 size={14} className="text-blue-600 animate-spin" />;
      case SAVE_STATUS.UNSAVED:
        return <Save size={14} className="text-yellow-600" />;
      case SAVE_STATUS.ERROR:
        return <AlertCircle size={14} className="text-red-600" />;
      default:
        return <Save size={14} className="text-gray-600" />;
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded bg-gray-50 border border-gray-200"
      title={error || `Last saved: ${formatLastSaveTime(lastSaveTime)}`}
    >
      {getIcon()}
      <span className={`text-xs font-medium ${display.color}`}>
        {display.text}
      </span>
      {lastSaveTime && status === SAVE_STATUS.SAVED && (
        <span className="text-xs text-gray-500">
          {formatLastSaveTime(lastSaveTime)}
        </span>
      )}
      {error && (
        <span className="text-xs text-red-600" title={error}>
          ({error.slice(0, 20)}...)
        </span>
      )}
    </div>
  );
};
