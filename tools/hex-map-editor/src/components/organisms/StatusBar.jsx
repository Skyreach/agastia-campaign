/**
 * Bottom status bar showing current mode and map info
 */
export const StatusBar = ({
  extractMode,
  currentRoad,
  currentMap,
  maps,
  zoom
}) => {
  return (
    <div className="bg-white border-t p-2 text-xs text-gray-600">
      {extractMode ? (
        <strong className="text-green-600">
          🎯 EXTRACT MODE: Click first corner, then opposite corner to select region
        </strong>
      ) : currentRoad ? (
        <strong className="text-blue-600">
          🛣️ ROAD MODE: Click hexes to add waypoints • Click last hex again to finish road ({currentRoad.waypoints.length} waypoint{currentRoad.waypoints.length !== 1 ? 's' : ''})
        </strong>
      ) : (
        <>
          <strong>Map:</strong> {currentMap.name || 'Untitled'}
          {currentMap.parentMapId && ` (Region of ${maps.find(m => m.id === currentMap.parentMapId)?.name || 'Unknown'})`} •
          <strong> Scale:</strong> {currentMap.scale === 'world' ? '24mi/hex' : '3mi/hex'} •
          <strong> Grid:</strong> {currentMap.hexCols} × {currentMap.hexRows} •
          <strong> Zoom:</strong> {Math.round(zoom * 100)}% •
          <strong> Hexes:</strong> {currentMap.hexes.length} •
          <strong> Roads:</strong> {currentMap.roads.length}
          {currentMap.parentHexes && currentMap.parentHexes.length > 0 && (
            <strong className="text-blue-600">
              {' '}• 📍 Contains {currentMap.parentHexes.length} parent hex{currentMap.parentHexes.length !== 1 ? 'es' : ''}
            </strong>
          )}
        </>
      )}
    </div>
  );
};
