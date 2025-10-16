import { useState, useRef, useEffect } from 'react';
import { useMapState } from './hooks/useMapState';
import { TopToolbar, ToolsToolbar, HexCanvas, HexEditModal, ExtractModal, StatusBar } from './components/organisms';
import { pixelToHex, findClosestEdge, calculateHexSize } from './utils/hexGeometry';
import { getHexesInRect, getHexNumberingBase, createHex } from './utils/hexHelpers';
import { exportMapImage, saveMapData, loadMapData, saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/mapExport';
import { createRegionalMap } from './utils/regionExtraction';
import { loadDefaultWorldMap } from './utils/defaultMap';

export default function HexMapEditor() {
  // Map state
  const { maps, setMaps, currentMapId, setCurrentMapId, currentMap, updateCurrentMap, addMap } = useMapState();
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [zoom, setZoom] = useState(1);
  const [currentRoad, setCurrentRoad] = useState(null);
  const [roadType, setRoadType] = useState('trail');
  const [showBg, setShowBg] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showIcons, setShowIcons] = useState(true);
  const [selectedTool, setSelectedTool] = useState('number');
  const [selectedFaction, setSelectedFaction] = useState(0);
  const [editingHex, setEditingHex] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [eventsInput, setEventsInput] = useState('');
  const [iconLabel, setIconLabel] = useState('');

  // Extraction state
  const [extractMode, setExtractMode] = useState(false);
  const [extractCorner1, setExtractCorner1] = useState(null);
  const [extractCorner2, setExtractCorner2] = useState(null);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractPreview, setExtractPreview] = useState(null);

  const fileInputRef = useRef(null);

  // Load from localStorage on mount, or load default world map
  useEffect(() => {
    const loadInitialState = async () => {
      const saved = loadFromLocalStorage();
      if (saved) {
        setMaps(saved.maps);
        setCurrentMapId(saved.currentMapId);
      } else {
        // Load default world map
        try {
          const defaultMap = await loadDefaultWorldMap();
          setMaps([defaultMap]);
          setCurrentMapId(defaultMap.id);
        } catch (err) {
          console.error('Failed to load default map:', err);
        }
      }
      setIsLoading(false);
    };
    loadInitialState();
  }, []);

  // Auto-save to localStorage whenever maps or currentMapId changes
  useEffect(() => {
    if (!isLoading && maps.length > 0) {
      saveToLocalStorage(maps, currentMapId);
    }
  }, [maps, currentMapId, isLoading]);

  // Auto-recalculate hex size when grid dimensions or image changes
  useEffect(() => {
    if (currentMap.bgImage) {
      const newSize = calculateHexSize(
        currentMap.bgImage.width,
        currentMap.bgImage.height,
        currentMap.hexCols,
        currentMap.hexRows
      );
      updateCurrentMap({ hexSize: newSize });
    }
  }, [currentMap.hexCols, currentMap.hexRows, currentMap.bgImage]);

  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newSize = calculateHexSize(
            img.width,
            img.height,
            currentMap.hexCols,
            currentMap.hexRows
          );
          updateCurrentMap({
            bgImage: img,
            bgImageData: event.target.result,
            hexSize: newSize
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const numberAllHexes = () => {
    const allNumbered = currentMap.hexes.length > 0 && currentMap.hexes.length === (currentMap.hexRows * currentMap.hexCols);

    if (allNumbered) {
      updateCurrentMap({ hexes: [] });
      return;
    }

    const baseNumber = getHexNumberingBase(currentMap.scale);
    const newHexes = [];
    let hexNumber = baseNumber;

    for (let row = 0; row < currentMap.hexRows; row++) {
      for (let col = 0; col < currentMap.hexCols; col++) {
        const hexKey = `${row},${col}`;
        const existing = currentMap.hexes.find(h => h.key === hexKey);

        if (existing) {
          newHexes.push({ ...existing, number: hexNumber });
        } else {
          newHexes.push(createHex(row, col, hexNumber));
        }
        hexNumber++;
      }
    }

    updateCurrentMap({ hexes: newHexes });
  };

  const handleCanvasClick = (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Extraction mode
    if (extractMode) {
      if (!extractCorner1) {
        setExtractCorner1({ x, y });
      } else if (!extractCorner2) {
        setExtractCorner2({ x, y });
        prepareExtraction({ x, y });
      }
      return;
    }

    // River tool
    if (selectedTool === 'river') {
      const edge = findClosestEdge(x, y, currentMap.hexRows, currentMap.hexCols, currentMap.hexSize);
      if (edge) {
        const existingIndex = currentMap.riverEdges.findIndex(e =>
          e.row === edge.row && e.col === edge.col && e.edge === edge.edge
        );

        if (existingIndex >= 0) {
          updateCurrentMap({
            riverEdges: currentMap.riverEdges.filter((_, i) => i !== existingIndex)
          });
        } else {
          updateCurrentMap({
            riverEdges: [...currentMap.riverEdges, edge]
          });
        }
      }
      return;
    }

    // Road tool
    if (selectedTool === 'road') {
      const { row, col } = pixelToHex(x, y, currentMap.hexSize);

      if (!currentRoad) {
        setCurrentRoad({
          type: roadType,
          waypoints: [{ row, col }]
        });
      } else {
        const lastWaypoint = currentRoad.waypoints[currentRoad.waypoints.length - 1];

        if (lastWaypoint.row === row && lastWaypoint.col === col) {
          updateCurrentMap({ roads: [...currentMap.roads, currentRoad] });
          setCurrentRoad(null);
        } else {
          setCurrentRoad({
            ...currentRoad,
            waypoints: [...currentRoad.waypoints, { row, col }]
          });
        }
      }
      return;
    }

    // Faction tool
    if (selectedTool === 'faction') {
      const { row, col } = pixelToHex(x, y, currentMap.hexSize);
      const hexKey = `${row},${col}`;

      const existing = currentMap.hexes.find(h => h.key === hexKey);
      if (existing) {
        updateCurrentMap({
          hexes: currentMap.hexes.map(h =>
            h.key === hexKey ? { ...h, faction: selectedFaction } : h
          )
        });
      } else {
        const baseNumber = getHexNumberingBase(currentMap.scale);
        const nextNum = Math.max(baseNumber - 1, ...currentMap.hexes.map(h => h.number || baseNumber - 1)) + 1;
        updateCurrentMap({
          hexes: [...currentMap.hexes, createHex(row, col, nextNum, { faction: selectedFaction })]
        });
      }
      return;
    }

    // Edit tool
    if (selectedTool === 'edit') {
      const { row, col } = pixelToHex(x, y, currentMap.hexSize);
      const hexKey = `${row},${col}`;
      const existing = currentMap.hexes.find(h => h.key === hexKey);

      if (existing) {
        setEditingHex(existing);
        setLabelInput(existing.label || '');
        setEventsInput(existing.events || '');
      }
      return;
    }

    // Default hex placement/removal
    const { row, col } = pixelToHex(x, y, currentMap.hexSize);
    const hexKey = `${row},${col}`;

    if (selectedTool === 'erase') {
      updateCurrentMap({
        hexes: currentMap.hexes.filter(h => h.key !== hexKey)
      });
    } else {
      const existing = currentMap.hexes.find(h => h.key === hexKey);
      if (existing) {
        updateCurrentMap({
          hexes: currentMap.hexes.filter(h => h.key !== hexKey)
        });
      } else {
        const baseNumber = getHexNumberingBase(currentMap.scale);
        const nextNum = Math.max(baseNumber - 1, ...currentMap.hexes.map(h => h.number || baseNumber - 1)) + 1;

        const existingHex = currentMap.hexes.find(h => h.row === row && h.col === col);
        const inheritedFaction = existingHex ? existingHex.faction : null;

        updateCurrentMap({
          hexes: [...currentMap.hexes, createHex(row, col, nextNum, {
            icon: selectedTool === 'number' ? null : selectedTool,
            faction: inheritedFaction,
            iconLabel: iconLabel
          })]
        });
      }
    }
  };

  const prepareExtraction = (corner2) => {
    if (!extractCorner1 || !currentMap.bgImage) return;

    try {
      const hexesInRegion = getHexesInRect(
        currentMap.hexes,
        extractCorner1.x,
        extractCorner1.y,
        corner2.x,
        corner2.y,
        currentMap.hexSize
      );

      setExtractPreview({
        hexes: hexesInRegion,
        bounds: {
          x1: extractCorner1.x,
          y1: extractCorner1.y,
          x2: corner2.x,
          y2: corner2.y
        }
      });
      setShowExtractModal(true);
    } catch (err) {
      alert('Error preparing region extraction: ' + err.message);
    }
  };

  const confirmExtraction = () => {
    try {
      const newMap = createRegionalMap(currentMap, extractPreview, maps, currentMapId);

      addMap(newMap);
      setCurrentMapId(newMap.id);

      // Reset extraction state
      setExtractMode(false);
      setExtractCorner1(null);
      setExtractCorner2(null);
      setShowExtractModal(false);
      setExtractPreview(null);

      console.log('Regional map created:', newMap.name, 'with', newMap.hexes.length, 'hexes');
    } catch (err) {
      console.error('Extraction error:', err);
      alert('Error extracting region: ' + err.message);
    }
  };

  const cancelExtraction = () => {
    setExtractMode(false);
    setExtractCorner1(null);
    setExtractCorner2(null);
    setShowExtractModal(false);
    setExtractPreview(null);
  };

  const saveHexData = () => {
    if (editingHex) {
      updateCurrentMap({
        hexes: currentMap.hexes.map(h =>
          h.key === editingHex.key ? { ...h, label: labelInput, events: eventsInput } : h
        )
      });
      setEditingHex(null);
      setLabelInput('');
      setEventsInput('');
    }
  };

  const closeHexEdit = () => {
    setEditingHex(null);
    setLabelInput('');
    setEventsInput('');
  };

  const handleLoadData = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadMapData(file)
        .then(({ maps: loadedMaps, currentMapId: loadedMapId }) => {
          setMaps(loadedMaps);
          setCurrentMapId(loadedMapId);
        })
        .catch(err => alert(err.message));
    }
  };

  const finishRoad = () => {
    if (currentRoad && currentRoad.waypoints.length > 1) {
      updateCurrentMap({ roads: [...currentMap.roads, currentRoad] });
    }
    setCurrentRoad(null);
  };

  const handleClearStorage = () => {
    if (confirm('Clear all saved data and reset to default map? This cannot be undone.')) {
      clearLocalStorage();
      window.location.reload();
    }
  };

  const handleLoadDefaultMap = async () => {
    if (confirm('Load default Agastia world map? This will not affect your current work.')) {
      try {
        const defaultMap = await loadDefaultWorldMap();
        addMap(defaultMap);
        setCurrentMapId(defaultMap.id);
      } catch (err) {
        alert('Failed to load default map: ' + err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl">Loading hex map editor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopToolbar
        maps={maps}
        currentMapId={currentMapId}
        currentMap={currentMap}
        zoom={zoom}
        iconLabel={iconLabel}
        fileInputRef={fileInputRef}
        onFileInputClick={() => fileInputRef.current.click()}
        onImageUpload={handleImageUpload}
        onMapSelect={setCurrentMapId}
        onMapNameChange={(name) => updateCurrentMap({ mapName: name, name: name || currentMap.name })}
        onIconLabelChange={setIconLabel}
        onGridChange={(updates) => updateCurrentMap(updates)}
        onZoomIn={() => setZoom(Math.min(3, zoom + 0.25))}
        onZoomOut={() => setZoom(Math.max(0.25, zoom - 0.25))}
        onZoomReset={() => setZoom(1)}
      />

      <ToolsToolbar
        selectedTool={selectedTool}
        selectedFaction={selectedFaction}
        roadType={roadType}
        currentRoad={currentRoad}
        extractMode={extractMode}
        showBg={showBg}
        showGrid={showGrid}
        showIcons={showIcons}
        onToolSelect={setSelectedTool}
        onFactionSelect={setSelectedFaction}
        onRoadTypeChange={setRoadType}
        onNumberAllHexes={numberAllHexes}
        onToggleExtractMode={() => {
          setExtractMode(!extractMode);
          setExtractCorner1(null);
          setExtractCorner2(null);
        }}
        onToggleBg={() => setShowBg(!showBg)}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleIcons={() => setShowIcons(!showIcons)}
        onExportMap={(includeBackground) => exportMapImage(currentMap, includeBackground, showBg)}
        onSaveData={() => saveMapData(maps, currentMapId)}
        onLoadData={handleLoadData}
        onClearRivers={() => updateCurrentMap({ riverEdges: [] })}
        onClearRoads={() => {
          updateCurrentMap({ roads: [] });
          setCurrentRoad(null);
        }}
        onFinishRoad={finishRoad}
        onClearStorage={handleClearStorage}
        onLoadDefaultMap={handleLoadDefaultMap}
      />

      <div className="flex-1 overflow-auto p-4 relative">
        <HexCanvas
          currentMap={currentMap}
          zoom={zoom}
          showBg={showBg}
          showGrid={showGrid}
          showIcons={showIcons}
          extractMode={extractMode}
          extractCorner1={extractCorner1}
          extractCorner2={extractCorner2}
          currentRoad={currentRoad}
          onCanvasClick={handleCanvasClick}
        />

        <HexEditModal
          hex={editingHex}
          labelInput={labelInput}
          eventsInput={eventsInput}
          onLabelChange={setLabelInput}
          onEventsChange={setEventsInput}
          onSave={saveHexData}
          onClose={closeHexEdit}
        />

        {showExtractModal && (
          <ExtractModal
            extractPreview={extractPreview}
            onConfirm={confirmExtraction}
            onCancel={cancelExtraction}
          />
        )}
      </div>

      <StatusBar
        extractMode={extractMode}
        currentRoad={currentRoad}
        currentMap={currentMap}
        maps={maps}
        zoom={zoom}
      />
    </div>
  );
}
