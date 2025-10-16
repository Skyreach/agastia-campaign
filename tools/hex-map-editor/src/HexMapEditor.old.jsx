import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Trash2, Mountain, Trees, Home, Castle, Circle, MapPin, Shield, Flag, X, FileText, Crop, ZoomIn, ZoomOut, RotateCcw, Hash } from 'lucide-react';

export default function HexMapEditor() {
  // Map management - multiple maps in memory
  const [maps, setMaps] = useState([{
    id: 'world-1',
    name: 'World Map',
    scale: 'world',
    parentHex: '',
    mapName: 'World Map',
    bgImage: null,
    bgImageData: null,
    hexSize: 60,
    hexCols: 20,
    hexRows: 15,
    hexes: [],
    riverEdges: [],
    roads: [],
    parentMapId: null,
    parentHexes: []
  }]);
  const [currentMapId, setCurrentMapId] = useState('world-1');

  // Get current map
  const currentMap = maps.find(m => m.id === currentMapId) || maps[0];

  // Derived state from current map
  const bgImage = currentMap.bgImage;
  const hexSize = currentMap.hexSize;
  const hexCols = currentMap.hexCols;
  const hexRows = currentMap.hexRows;
  const hexes = currentMap.hexes;
  const riverEdges = currentMap.riverEdges;
  const roads = currentMap.roads;
  const scale = currentMap.scale;
  const parentHex = currentMap.parentHex;
  const mapName = currentMap.mapName;

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

  const [extractMode, setExtractMode] = useState(false);
  const [extractCorner1, setExtractCorner1] = useState(null);
  const [extractCorner2, setExtractCorner2] = useState(null);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractPreview, setExtractPreview] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to update current map
  const updateCurrentMap = (updates) => {
    setMaps(prev => prev.map(m =>
      m.id === currentMapId ? { ...m, ...updates } : m
    ));
  };

  const factions = [
    { name: 'Red', color: 'rgba(239, 68, 68, 0.3)' },
    { name: 'Blue', color: 'rgba(59, 130, 246, 0.3)' },
    { name: 'Green', color: 'rgba(34, 197, 94, 0.3)' },
    { name: 'Yellow', color: 'rgba(234, 179, 8, 0.3)' },
    { name: 'Purple', color: 'rgba(168, 85, 247, 0.3)' },
    { name: 'Orange', color: 'rgba(249, 115, 22, 0.3)' }
  ];

  const icons = {
    mountain: { icon: Mountain, label: 'Mountain', emoji: '⛰️' },
    hills: { icon: Mountain, label: 'Hills', emoji: '🏞️' },
    forest: { icon: Trees, label: 'Forest', emoji: '🌲' },
    swamps: { icon: Trees, label: 'Swamps', emoji: '🌿' },
    village: { icon: Home, label: 'Village', emoji: '🏘️' },
    town: { icon: Home, label: 'Town', emoji: '🏛️' },
    city: { icon: Castle, label: 'City', emoji: '🏙️' },
    castle: { icon: Castle, label: 'Castle', emoji: '🏰' },
    outpost: { icon: Shield, label: 'Outpost', emoji: '🛡️' },
    dungeon: { icon: Circle, label: 'Dungeon', emoji: '🕳️' },
    poi: { icon: MapPin, label: 'POI', emoji: '📍' },
    contested: { icon: Flag, label: 'Contested', emoji: '🚩' }
  };

  const getHexNumberingBase = () => scale === 'world' ? 1 : 10001;

  // Auto-recalculate hex size when grid dimensions or image changes
  const recalculateHexSize = () => {
    const width = bgImage ? bgImage.width : 1200;
    const height = bgImage ? bgImage.height : 800;
    const sizeFromCols = width / (hexCols * 1.5 + 0.5);
    const sizeFromRows = height / (hexRows * Math.sqrt(3) + 0.5);
    // Use Math.max to fill entire image (hexes will be cut at edges)
    const calculatedSize = Math.max(sizeFromCols, sizeFromRows);
    return calculatedSize;
  };

  // Auto-apply when cols/rows change
  useEffect(() => {
    if (bgImage) {
      const newSize = recalculateHexSize();
      updateCurrentMap({ hexSize: newSize });
    }
  }, [hexCols, hexRows, bgImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const sizeFromCols = width / (hexCols * 1.5 + 0.5);
          const sizeFromRows = height / (hexRows * Math.sqrt(3) + 0.5);
          const calculatedSize = Math.max(sizeFromCols, sizeFromRows);
          updateCurrentMap({ bgImage: img, bgImageData: event.target.result, hexSize: calculatedSize });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getHexCoords = (row, col) => {
    const x = col * hexSize * 1.5;
    const y = row * hexSize * Math.sqrt(3) + (col % 2 ? hexSize * Math.sqrt(3) / 2 : 0);
    return { x, y };
  };

  const getHexVertices = (x, y, size) => {
    const vertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      vertices.push({
        x: x + size * Math.cos(angle),
        y: y + size * Math.sin(angle)
      });
    }
    return vertices;
  };

  // Utility: Check if point is inside hexagon
  const isPointInHex = (px, py, hexX, hexY, hexSize) => {
    const vertices = getHexVertices(hexX, hexY, hexSize);
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x, yi = vertices[i].y;
      const xj = vertices[j].x, yj = vertices[j].y;
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Utility: Map world hex to regional hexes (8x scale = 24mi to 3mi)
  const getRegionalHexesForWorldHex = (worldHex, worldHexSize, regionalHexSize, offsetX, offsetY) => {
    const { x: worldX, y: worldY } = getHexCoords(worldHex.row, worldHex.col);
    const regionalHexes = [];

    // Check area around world hex (generous search radius)
    const searchRadius = 15; // Check 15 hexes in each direction
    for (let row = -searchRadius; row < searchRadius; row++) {
      for (let col = -searchRadius; col < searchRadius; col++) {
        const regX = col * regionalHexSize * 1.5 + offsetX;
        const regY = row * regionalHexSize * Math.sqrt(3) +
                     (col % 2 ? regionalHexSize * Math.sqrt(3) / 2 : 0) + offsetY;

        // Check if this regional hex center is inside the world hex
        if (isPointInHex(regX, regY, worldX, worldY, worldHexSize)) {
          regionalHexes.push({ row, col });
        }
      }
    }

    return regionalHexes;
  };

  const getEdgeMidpoint = (row, col, edgeIndex) => {
    const { x, y } = getHexCoords(row, col);
    const vertices = getHexVertices(x, y, hexSize);
    const v1 = vertices[edgeIndex];
    const v2 = vertices[(edgeIndex + 1) % 6];
    return {
      x: (v1.x + v2.x) / 2,
      y: (v1.y + v2.y) / 2
    };
  };

  const findClosestEdge = (px, py) => {
    let closestEdge = null;
    let minDist = hexSize * 0.3;

    for (let row = 0; row < hexRows; row++) {
      for (let col = 0; col < hexCols; col++) {
        const { x, y } = getHexCoords(row, col);
        const vertices = getHexVertices(x, y, hexSize);

        for (let i = 0; i < 6; i++) {
          const v1 = vertices[i];
          const v2 = vertices[(i + 1) % 6];
          const midX = (v1.x + v2.x) / 2;
          const midY = (v1.y + v2.y) / 2;

          const dist = Math.sqrt((px - midX) ** 2 + (py - midY) ** 2);

          if (dist < minDist) {
            minDist = dist;
            closestEdge = { row, col, edge: i };
          }
        }
      }
    }

    return closestEdge;
  };

  const pixelToHex = (px, py) => {
    const col = Math.round(px / (hexSize * 1.5));
    const row = Math.round((py - (col % 2 ? hexSize * Math.sqrt(3) / 2 : 0)) / (hexSize * Math.sqrt(3)));
    return { row, col };
  };

  const drawHexagon = (ctx, x, y, size) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  };

  const drawSmoothPaths = (ctx, edges, color, lineWidth) => {
    if (edges.length === 0) return;

    const paths = [];
    const usedEdges = new Set();

    edges.forEach((edge, idx) => {
      if (usedEdges.has(idx)) return;

      const path = [edge];
      usedEdges.add(idx);

      let changed = true;
      while (changed) {
        changed = false;
        edges.forEach((e, i) => {
          if (usedEdges.has(i)) return;

          const lastEdge = path[path.length - 1];
          const firstEdge = path[0];

          const p1 = getEdgeMidpoint(lastEdge.row, lastEdge.col, lastEdge.edge);
          const p2 = getEdgeMidpoint(e.row, e.col, e.edge);
          const dist1 = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

          const p3 = getEdgeMidpoint(firstEdge.row, firstEdge.col, firstEdge.edge);
          const dist2 = Math.sqrt((p3.x - p2.x) ** 2 + (p3.y - p2.y) ** 2);

          if (dist1 < hexSize * 1.5) {
            path.push(e);
            usedEdges.add(i);
            changed = true;
          } else if (dist2 < hexSize * 1.5) {
            path.unshift(e);
            usedEdges.add(i);
            changed = true;
          }
        });
      }

      paths.push(path);
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    paths.forEach(path => {
      if (path.length === 0) return;

      const points = path.map(e => getEdgeMidpoint(e.row, e.col, e.edge));

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      if (points.length === 1) {
        const edge = path[0];
        const { x, y } = getHexCoords(edge.row, edge.col);
        const vertices = getHexVertices(x, y, hexSize);
        const v1 = vertices[edge.edge];
        const v2 = vertices[(edge.edge + 1) % 6];
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
      } else if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }

      ctx.stroke();
    });
  };

  const getHexesInRect = (x1, y1, x2, y2) => {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return hexes.filter(hex => {
      const { x, y } = getHexCoords(hex.row, hex.col);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });
  };

  const numberAllHexes = () => {
    const allNumbered = hexes.length > 0 && hexes.length === (hexRows * hexCols);

    if (allNumbered) {
      updateCurrentMap({ hexes: [] });
      return;
    }

    const baseNumber = getHexNumberingBase();
    const newHexes = [];
    let hexNumber = baseNumber;

    for (let row = 0; row < hexRows; row++) {
      for (let col = 0; col < hexCols; col++) {
        const hexKey = `${row},${col}`;
        const existing = hexes.find(h => h.key === hexKey);

        if (existing) {
          newHexes.push({ ...existing, number: hexNumber });
        } else {
          newHexes.push({
            key: hexKey,
            row,
            col,
            number: hexNumber,
            icon: null,
            faction: null,
            label: '',
            events: '',
            iconLabel: ''
          });
        }
        hexNumber++;
      }
    }

    updateCurrentMap({ hexes: newHexes });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (extractMode) {
      if (!extractCorner1) {
        setExtractCorner1({ x, y });
      } else if (!extractCorner2) {
        setExtractCorner2({ x, y });
        prepareExtraction({ x, y });
      }
      return;
    }

    if (selectedTool === 'river') {
      const edge = findClosestEdge(x, y);
      if (edge) {
        const existingIndex = riverEdges.findIndex(e =>
          e.row === edge.row && e.col === edge.col && e.edge === edge.edge
        );

        if (existingIndex >= 0) {
          updateCurrentMap({ riverEdges: riverEdges.filter((_, i) => i !== existingIndex) });
        } else {
          updateCurrentMap({ riverEdges: [...riverEdges, edge] });
        }
      }
      return;
    }

    if (selectedTool === 'road') {
      const { row, col } = pixelToHex(x, y);

      if (!currentRoad) {
        setCurrentRoad({
          type: roadType,
          waypoints: [{ row, col }]
        });
      } else {
        const lastWaypoint = currentRoad.waypoints[currentRoad.waypoints.length - 1];

        if (lastWaypoint.row === row && lastWaypoint.col === col) {
          updateCurrentMap({ roads: [...roads, currentRoad] });
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

    if (selectedTool === 'faction') {
      const { row, col } = pixelToHex(x, y);
      const hexKey = `${row},${col}`;

      const existing = hexes.find(h => h.key === hexKey);
      if (existing) {
        updateCurrentMap({
          hexes: hexes.map(h => h.key === hexKey ? { ...h, faction: selectedFaction } : h)
        });
      } else {
        const baseNumber = getHexNumberingBase();
        const nextNum = Math.max(baseNumber - 1, ...hexes.map(h => h.number || baseNumber - 1)) + 1;
        updateCurrentMap({
          hexes: [...hexes, {
            key: hexKey,
            row,
            col,
            number: nextNum,
            icon: null,
            faction: selectedFaction,
            label: '',
            events: '',
            iconLabel: ''
          }]
        });
      }
      return;
    }

    if (selectedTool === 'edit') {
      const { row, col } = pixelToHex(x, y);
      const hexKey = `${row},${col}`;
      const existing = hexes.find(h => h.key === hexKey);

      if (existing) {
        setEditingHex(existing);
        setLabelInput(existing.label || '');
        setEventsInput(existing.events || '');
      }
      return;
    }

    const { row, col } = pixelToHex(x, y);
    const hexKey = `${row},${col}`;

    if (selectedTool === 'erase') {
      updateCurrentMap({ hexes: hexes.filter(h => h.key !== hexKey) });
    } else {
      const existing = hexes.find(h => h.key === hexKey);
      if (existing) {
        updateCurrentMap({ hexes: hexes.filter(h => h.key !== hexKey) });
      } else {
        const baseNumber = getHexNumberingBase();
        const nextNum = Math.max(baseNumber - 1, ...hexes.map(h => h.number || baseNumber - 1)) + 1;

        const existingHex = hexes.find(h => h.row === row && h.col === col);
        const inheritedFaction = existingHex ? existingHex.faction : null;

        updateCurrentMap({
          hexes: [...hexes, {
            key: hexKey,
            row,
            col,
            number: nextNum,
            icon: selectedTool === 'number' ? null : selectedTool,
            faction: inheritedFaction,
            label: '',
            events: '',
            iconLabel: iconLabel
          }]
        });
      }
    }
  };

  const prepareExtraction = (corner2) => {
    if (!extractCorner1 || !bgImage) return;

    try {
      const hexesInRegion = getHexesInRect(
        extractCorner1.x,
        extractCorner1.y,
        corner2.x,
        corner2.y
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
    if (!extractPreview || !bgImage) return;

    try {
      const { x1, y1, x2, y2 } = extractPreview.bounds;
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      const width = maxX - minX;
      const height = maxY - minY;

      // Crop background image
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = width;
      cropCanvas.height = height;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(bgImage, minX, minY, width, height, 0, 0, width, height);

      let croppedImageData;
      const croppedImg = new Image();
      try {
        croppedImageData = cropCanvas.toDataURL('image/png');
        croppedImg.src = croppedImageData;
      } catch (err) {
        croppedImageData = null;
      }

      // Calculate regional hex size (8x smaller for 24mi -> 3mi)
      const regionalHexSize = hexSize / 8;

      // Calculate new grid dimensions for regional map
      const newHexCols = Math.ceil(width / (regionalHexSize * 1.5));
      const newHexRows = Math.ceil(height / (regionalHexSize * Math.sqrt(3)));

      // Create new map ID and name
      const newMapId = `region-${Date.now()}`;
      const regionName = `${currentMap.mapName || 'Map'} - Region ${maps.filter(m => m.parentMapId === currentMapId).length + 1}`;

      // Build regional hexes with parent relationships
      const regionalHexes = [];
      let regionalHexNumber = 10001;

      extractPreview.hexes.forEach(worldHex => {
        const regHexCoords = getRegionalHexesForWorldHex(worldHex, hexSize, regionalHexSize, minX, minY);

        regHexCoords.forEach(({ row, col }) => {
          regionalHexes.push({
            key: `${row},${col}`,
            row,
            col,
            number: regionalHexNumber++,
            icon: worldHex.icon,
            faction: worldHex.faction,
            label: worldHex.label,
            events: worldHex.events,
            iconLabel: worldHex.iconLabel,
            parentHexNumber: worldHex.number
          });
        });
      });

      // Create new regional map
      const newMap = {
        id: newMapId,
        name: regionName,
        scale: 'region',
        parentHex: currentMapId,
        mapName: regionName,
        bgImage: croppedImg,
        bgImageData: croppedImageData,
        hexSize: regionalHexSize,
        hexCols: newHexCols,
        hexRows: newHexRows,
        hexes: regionalHexes,
        riverEdges: [],
        roads: [],
        parentMapId: currentMapId,
        parentHexes: extractPreview.hexes.map(h => ({
          number: h.number,
          label: h.label,
          icon: h.icon,
          iconLabel: h.iconLabel,
          events: h.events,
          faction: h.faction
        }))
      };

      // Add map and switch to it
      setMaps(prev => [...prev, newMap]);
      setCurrentMapId(newMapId);

      // Reset extraction state
      setExtractMode(false);
      setExtractCorner1(null);
      setExtractCorner2(null);
      setShowExtractModal(false);
      setExtractPreview(null);

      console.log('Regional map created:', regionName, 'with', regionalHexes.length, 'hexes');
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
        hexes: hexes.map(h =>
          h.key === editingHex.key ? { ...h, label: labelInput, events: eventsInput } : h
        )
      });
      setEditingHex(null);
      setLabelInput('');
      setEventsInput('');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = bgImage ? bgImage.width : 1200;
    const height = bgImage ? bgImage.height : 800;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width * zoom}px`;
    canvas.style.height = `${height * zoom}px`;

    ctx.clearRect(0, 0, width, height);

    if (showBg && bgImage) {
      ctx.drawImage(bgImage, 0, 0);
    }

    if (extractMode && extractCorner1) {
      if (extractCorner2) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(
          extractCorner1.x,
          extractCorner1.y,
          extractCorner2.x - extractCorner1.x,
          extractCorner2.y - extractCorner1.y
        );
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.fillRect(
          extractCorner1.x,
          extractCorner1.y,
          extractCorner2.x - extractCorner1.x,
          extractCorner2.y - extractCorner1.y
        );
      } else {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(extractCorner1.x, extractCorner1.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;

      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          const { x, y } = getHexCoords(row, col);
          drawHexagon(ctx, x, y, hexSize);
          ctx.stroke();
        }
      }
    }

    const roadStyles = {
      footpath: { color: '#a8a29e', width: 2, dash: [5, 5] },
      trail: { color: '#78716c', width: 3, dash: [8, 4] },
      road: { color: '#57534e', width: 5, dash: [] },
      highway: { color: '#292524', width: 7, dash: [] }
    };

    roads.forEach(road => {
      const style = roadStyles[road.type] || roadStyles.trail;
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash(style.dash);

      if (road.waypoints.length > 1) {
        ctx.beginPath();
        road.waypoints.forEach((wp, i) => {
          const { x, y } = getHexCoords(wp.row, wp.col);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      ctx.setLineDash([]);
    });

    if (currentRoad && currentRoad.waypoints.length > 0) {
      const style = roadStyles[currentRoad.type] || roadStyles.trail;
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.width + 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash(style.dash);

      ctx.beginPath();
      currentRoad.waypoints.forEach((wp, i) => {
        const { x, y } = getHexCoords(wp.row, wp.col);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      currentRoad.waypoints.forEach(wp => {
        const { x, y } = getHexCoords(wp.row, wp.col);
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawSmoothPaths(ctx, riverEdges, '#3b82f6', 6);

    if (showIcons) {
      hexes.forEach(hex => {
        const { x, y } = getHexCoords(hex.row, hex.col);

        if (hex.faction !== null && hex.faction !== undefined) {
          ctx.fillStyle = factions[hex.faction].color;
          drawHexagon(ctx, x, y, hexSize);
          ctx.fill();
        }

        // Draw semi-transparent background only if there's content
        if (hex.number || hex.label || hex.icon) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          drawHexagon(ctx, x, y, hexSize * 0.85);
          ctx.fill();
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (hex.events && hex.events.trim()) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x + hexSize * 0.6, y - hexSize * 0.6, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Scale font sizes based on hex size (for better visibility at different scales)
        const fontSize = Math.max(8, hexSize * 0.2);
        const iconSize = Math.max(12, hexSize * 0.3);
        const labelSize = Math.max(7, hexSize * 0.18);

        // Draw hex number at top
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hex.number, x, y - hexSize * 0.4);

        // Draw label below number
        if (hex.label) {
          ctx.font = `bold ${labelSize}px sans-serif`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillText(hex.label, x, y - hexSize * 0.2);
        }

        // Draw icon emoji in center
        if (hex.icon && icons[hex.icon]) {
          ctx.font = `${iconSize}px Arial`;
          ctx.fillText(icons[hex.icon].emoji, x, y + hexSize * 0.05);

          // Draw icon label at bottom
          if (hex.iconLabel) {
            ctx.font = `bold ${Math.max(6, hexSize * 0.15)}px sans-serif`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillText(hex.iconLabel, x, y + hexSize * 0.35);
          }
        }
      });
    }
  }, [bgImage, hexSize, hexes, riverEdges, roads, currentRoad, showBg, showGrid, showIcons, selectedFaction, extractMode, extractCorner1, extractCorner2, zoom, hexRows, hexCols]);

  const exportMap = (includeBackground) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = bgImage ? bgImage.width : 1200;
      const height = bgImage ? bgImage.height : 800;

      canvas.width = width;
      canvas.height = height;

      if (includeBackground && showBg && bgImage) {
        ctx.drawImage(bgImage, 0, 0);
      } else {
        ctx.fillStyle = '#f7fafc';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;

      for (let row = 0; row < hexRows; row++) {
        for (let col = 0; col < hexCols; col++) {
          const { x, y } = getHexCoords(row, col);
          drawHexagon(ctx, x, y, hexSize);
          ctx.stroke();
        }
      }

      const exportRoadStyles = {
        footpath: { color: '#a8a29e', width: 2, dash: [5, 5] },
        trail: { color: '#78716c', width: 3, dash: [8, 4] },
        road: { color: '#57534e', width: 5, dash: [] },
        highway: { color: '#292524', width: 7, dash: [] }
      };

      roads.forEach(road => {
        const style = exportRoadStyles[road.type] || exportRoadStyles.trail;
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash(style.dash);

        if (road.waypoints.length > 1) {
          ctx.beginPath();
          road.waypoints.forEach((wp, i) => {
            const { x, y } = getHexCoords(wp.row, wp.col);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
        ctx.setLineDash([]);
      });

      drawSmoothPaths(ctx, riverEdges, '#3b82f6', 6);

      hexes.forEach(hex => {
        const { x, y } = getHexCoords(hex.row, hex.col);

        if (hex.faction !== null && hex.faction !== undefined) {
          ctx.fillStyle = factions[hex.faction].color;
          drawHexagon(ctx, x, y, hexSize);
          ctx.fill();
        }

        // Draw semi-transparent background only if there's content
        if (hex.number || hex.label || hex.icon) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          drawHexagon(ctx, x, y, hexSize * 0.85);
          ctx.fill();
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (hex.events && hex.events.trim()) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x + hexSize * 0.6, y - hexSize * 0.6, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Scale font sizes based on hex size
        const fontSize = Math.max(8, hexSize * 0.2);
        const iconSize = Math.max(12, hexSize * 0.3);
        const labelSize = Math.max(7, hexSize * 0.18);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hex.number, x, y - hexSize * 0.4);

        if (hex.label) {
          ctx.font = `bold ${labelSize}px sans-serif`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillText(hex.label, x, y - hexSize * 0.2);
        }

        if (hex.icon && icons[hex.icon]) {
          ctx.font = `${iconSize}px Arial`;
          ctx.fillText(icons[hex.icon].emoji, x, y + hexSize * 0.05);

          if (hex.iconLabel) {
            ctx.font = `bold ${Math.max(6, hexSize * 0.15)}px sans-serif`;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillText(hex.iconLabel, x, y + hexSize * 0.35);
          }
        }
      });

      const link = document.createElement('a');
      const scaleLabel = scale === 'world' ? '24mi' : '3mi';
      const mapLabel = currentMap.name.replace(/\s+/g, '-').toLowerCase();
      link.download = includeBackground ? `${mapLabel}-${scaleLabel}-full.png` : `${mapLabel}-${scaleLabel}-player.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('Error exporting map: ' + err.message);
    }
  };

  const saveData = () => {
    try {
      const data = {
        maps: maps.map(map => ({
          ...map,
          bgImage: null,
          bgImageData: map.bgImageData
        })),
        currentMapId
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const filename = `hex-maps-${Date.now()}.json`;
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
    } catch (err) {
      alert('Error saving maps: ' + err.message);
    }
  };

  const loadData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const loadedMaps = data.maps.map(map => {
            if (map.bgImageData) {
              const img = new Image();
              img.src = map.bgImageData;
              return { ...map, bgImage: img };
            }
            return map;
          });

          setMaps(loadedMaps);
          setCurrentMapId(data.currentMapId || loadedMaps[0]?.id || 'world-1');
        } catch (err) {
          alert('Error loading maps: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-3 flex flex-wrap gap-2 items-center text-sm border-b">
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Upload background map image"
        >
          <Upload size={16} /> Upload Map
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="border-l border-gray-300 h-8 mx-2" />

        <select
          value={currentMapId}
          onChange={(e) => setCurrentMapId(e.target.value)}
          className="border rounded px-3 py-2 text-sm font-medium"
          title="Switch between maps"
        >
          {maps.map(map => (
            <option key={map.id} value={map.id}>
              {map.name} ({map.scale === 'world' ? '24mi' : '3mi'})
              {map.parentMapId && ` ← ${maps.find(m => m.id === map.parentMapId)?.name || 'Parent'}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={currentMap.mapName}
          onChange={(e) => updateCurrentMap({ mapName: e.target.value, name: e.target.value || currentMap.name })}
          placeholder="Map Name"
          className="border rounded px-3 py-2 w-40 text-sm"
          title="Name your map for organization"
        />

        <input
          type="text"
          value={iconLabel}
          onChange={(e) => setIconLabel(e.target.value)}
          placeholder="Icon Label (optional)"
          className="border rounded px-3 py-2 w-40 text-sm"
          title="Optional: Type label BEFORE placing icon - will be saved to that specific hex"
        />

        {scale === 'region' && (
          <input
            type="text"
            value={parentHex}
            onChange={(e) => updateCurrentMap({ parentHex: e.target.value })}
            placeholder="Parent Hex #"
            className="border rounded px-3 py-2 w-32 text-sm"
            title="Which world hex does this region map?"
          />
        )}

        <div className="border-l border-gray-300 h-8 mx-2" />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Grid:</label>
          <input
            type="number"
            value={hexCols}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 20);
              updateCurrentMap({ hexCols: val });
            }}
            className="border rounded px-2 py-1 w-16 text-sm"
            title="Number of hex columns (auto-applies)"
            min="1"
          />
          <span className="text-xs">×</span>
          <input
            type="number"
            value={hexRows}
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 15);
              updateCurrentMap({ hexRows: val });
            }}
            className="border rounded px-2 py-1 w-16 text-sm"
            title="Number of hex rows (auto-applies)"
            min="1"
          />
        </div>

        <div className="border-l border-gray-300 h-8 mx-2" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Reset zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md p-3 flex flex-wrap gap-2 items-center text-sm">
        <div className="flex gap-1 flex-wrap items-center">
          <button
            onClick={() => setSelectedTool('number')}
            className={`px-3 py-2 rounded ${selectedTool === 'number' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Add numbered hex"
          >
            #
          </button>
          {Object.entries(icons).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedTool(key)}
              className={`px-2 py-2 rounded flex items-center ${selectedTool === key ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title={data.label}
            >
              <data.icon size={16} />
            </button>
          ))}
          <button
            onClick={() => setSelectedTool('edit')}
            className={`px-2 py-2 rounded flex items-center ${selectedTool === 'edit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Edit hex (label + events)"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => setSelectedTool('faction')}
            className={`px-3 py-2 rounded ${selectedTool === 'faction' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Paint faction territory"
          >
            Faction
          </button>
          <button
            onClick={() => setSelectedTool('river')}
            className={`px-3 py-2 rounded ${selectedTool === 'river' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Draw river (click edges)"
          >
            River
          </button>
          <button
            onClick={() => setSelectedTool('road')}
            className={`px-3 py-2 rounded ${selectedTool === 'road' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            title="Draw road (click hex centers, click last hex again to finish)"
          >
            Road
          </button>
          {selectedTool === 'road' && (
            <select
              value={roadType}
              onChange={(e) => setRoadType(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
              title="Select road type"
            >
              <option value="footpath">Footpath (dotted, thin)</option>
              <option value="trail">Trail (dashed)</option>
              <option value="road">Road (solid)</option>
              <option value="highway">Highway (thick)</option>
            </select>
          )}
          <button
            onClick={() => setSelectedTool('erase')}
            className={`px-2 py-2 rounded flex items-center ${selectedTool === 'erase' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            title="Erase hex"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {selectedTool === 'faction' && (
          <>
            <div className="border-l border-gray-300 h-8 mx-2" />
            <div className="flex gap-1">
              {factions.map((faction, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFaction(idx)}
                  className={`w-8 h-8 rounded border-2 ${selectedFaction === idx ? 'border-black' : 'border-gray-300'}`}
                  style={{ backgroundColor: faction.color.replace('0.3', '0.7') }}
                  title={faction.name}
                />
              ))}
            </div>
          </>
        )}

        <div className="border-l border-gray-300 h-8 mx-2" />

        <button
          onClick={numberAllHexes}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          title="Toggle: Auto-number all hexes (click again to clear)"
        >
          <Hash size={16} /> Number All
        </button>

        <button
          onClick={() => {
            setExtractMode(!extractMode);
            setExtractCorner1(null);
            setExtractCorner2(null);
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded ${extractMode ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          title="Extract region: Create new regional map at 3mi/hex scale"
        >
          <Crop size={16} /> {extractMode ? 'Cancel Extract' : 'Extract Region'}
        </button>

        <div className="border-l border-gray-300 h-8 mx-2" />

        <div className="flex gap-1">
          <button
            onClick={() => setShowBg(!showBg)}
            className={`px-3 py-2 rounded text-sm ${showBg ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            title="Toggle background image"
          >
            BG
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-2 rounded text-sm ${showGrid ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            title="Toggle hex grid"
          >
            Grid
          </button>
          <button
            onClick={() => setShowIcons(!showIcons)}
            className={`px-3 py-2 rounded text-sm ${showIcons ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            title="Toggle hex icons/labels"
          >
            Icons
          </button>
        </div>

        <div className="border-l border-gray-300 h-8 mx-2" />

        <button
          onClick={() => exportMap(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          title="Export full map with background"
        >
          <Download size={16} /> Full
        </button>
        <button
          onClick={() => exportMap(false)}
          className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          title="Export player map (no background)"
        >
          <Download size={16} /> Player
        </button>

        <button
          onClick={saveData}
          className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          title="Save all maps as JSON"
        >
          Save
        </button>
        <label className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer" title="Load saved maps">
          Load
          <input
            type="file"
            accept=".json"
            onChange={loadData}
            className="hidden"
          />
        </label>

        <button
          onClick={() => updateCurrentMap({ riverEdges: [] })}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          title="Clear all rivers"
        >
          Clear Rivers
        </button>

        <button
          onClick={() => {
            updateCurrentMap({ roads: [] });
            setCurrentRoad(null);
          }}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          title="Clear all roads"
        >
          Clear Roads
        </button>

        {currentRoad && (
          <button
            onClick={() => {
              if (currentRoad.waypoints.length > 1) {
                updateCurrentMap({ roads: [...roads, currentRoad] });
              }
              setCurrentRoad(null);
            }}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            title="Finish current road"
          >
            Finish Road
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border border-gray-300 shadow-lg bg-white cursor-crosshair"
        />

        {editingHex && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border-2 border-blue-500 max-w-lg w-full z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Hex #{editingHex.number}</h3>
              <button
                onClick={() => {
                  setEditingHex(null);
                  setLabelInput('');
                  setEventsInput('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Label</label>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g., Dragon's Peak"
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Events</label>
              <textarea
                value={eventsInput}
                onChange={(e) => setEventsInput(e.target.value)}
                placeholder="What happened here?"
                className="border border-gray-300 rounded px-3 py-2 w-full h-24 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveHexData}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingHex(null);
                  setLabelInput('');
                  setEventsInput('');
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showExtractModal && extractPreview && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl border-2 border-green-500 max-w-2xl w-full z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <ZoomIn size={24} /> Extract Regional Map
              </h3>
              <button onClick={cancelExtraction} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded">
              <p className="text-sm font-medium mb-2">📍 This region contains {extractPreview.hexes.length} world hexes</p>
              <p className="text-xs text-gray-600">Regional hexes will start at #10001</p>
              <p className="text-xs text-gray-600 mt-1">Scale: Converting from 24mi/hex to 3mi/hex (8x subdivision)</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Parent Hexes (will be subdivided):</h4>
              <div className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
                {extractPreview.hexes.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No hexes in selected area</p>
                ) : (
                  extractPreview.hexes.map(hex => (
                    <div key={hex.key} className="text-sm py-1 border-b last:border-0">
                      <span className="font-bold text-blue-600">#{hex.number}</span>
                      {hex.label && <span className="ml-2 text-gray-800">{hex.label}</span>}
                      {hex.icon && <span className="ml-2 text-gray-600">({icons[hex.icon]?.label}{hex.iconLabel ? ` - ${hex.iconLabel}` : ''})</span>}
                      {hex.events && <span className="ml-2 text-red-500 text-xs">🔴 Events</span>}
                      {hex.faction !== null && <span className="ml-2 text-xs">({factions[hex.faction]?.name})</span>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm font-medium mb-2">💡 How Regional Maps Work:</p>
              <ol className="text-xs space-y-2 ml-4 list-decimal">
                <li><strong>New map created in dropdown</strong> - Instantly switch between world and regional views</li>
                <li><strong>8x subdivision</strong> - Each world hex becomes ~64 regional hexes (24mi → 3mi scale)</li>
                <li><strong>Preserved data</strong> - Faction territories, icons, labels carry over to regional hexes</li>
                <li><strong>Independent editing</strong> - Changes to regional map don't affect world map</li>
                <li><strong>Save includes all</strong> - One JSON file stores your entire campaign</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <button
                onClick={confirmExtraction}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
              >
                Create Regional Map
              </button>
              <button
                onClick={cancelExtraction}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t p-2 text-xs text-gray-600">
        {extractMode ? (
          <strong className="text-green-600">🎯 EXTRACT MODE: Click first corner, then opposite corner to select region</strong>
        ) : currentRoad ? (
          <strong className="text-blue-600">🛣️ ROAD MODE: Click hexes to add waypoints • Click last hex again to finish road ({currentRoad.waypoints.length} waypoint{currentRoad.waypoints.length !== 1 ? 's' : ''})</strong>
        ) : (
          <>
            <strong>Map:</strong> {currentMap.name || 'Untitled'}
            {currentMap.parentMapId && ` (Region of ${maps.find(m => m.id === currentMap.parentMapId)?.name || 'Unknown'})`} •
            <strong> Scale:</strong> {scale === 'world' ? '24mi/hex' : '3mi/hex'} •
            <strong> Grid:</strong> {hexCols} × {hexRows} •
            <strong> Zoom:</strong> {Math.round(zoom * 100)}% •
            <strong> Hexes:</strong> {hexes.length} •
            <strong> Roads:</strong> {roads.length}
            {currentMap.parentHexes && currentMap.parentHexes.length > 0 && (
              <strong className="text-blue-600"> • 📍 Contains {currentMap.parentHexes.length} parent hex{currentMap.parentHexes.length !== 1 ? 'es' : ''}</strong>
            )}
          </>
        )}
      </div>
    </div>
  );
}
