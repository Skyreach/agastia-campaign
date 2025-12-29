import { getHexCoords, getEdgeMidpoint, drawHexagon, getHexVertices } from './hexGeometry';
import { ICON_TYPES } from '../constants/icons';

/**
 * Draw smooth paths (rivers/roads) on canvas
 */
export const drawSmoothPaths = (ctx, edges, color, lineWidth, hexSize) => {
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

        const p1 = getEdgeMidpoint(lastEdge.row, lastEdge.col, lastEdge.edge, hexSize);
        const p2 = getEdgeMidpoint(e.row, e.col, e.edge, hexSize);
        const dist1 = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

        const p3 = getEdgeMidpoint(firstEdge.row, firstEdge.col, firstEdge.edge, hexSize);
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

    const points = path.map(e => getEdgeMidpoint(e.row, e.col, e.edge, hexSize));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 1) {
      const edge = path[0];
      const { x, y } = getHexCoords(edge.row, edge.col, hexSize);
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

/**
 * Draw hex grid
 */
export const drawHexGrid = (ctx, hexRows, hexCols, hexSize) => {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;

  for (let row = 0; row < hexRows; row++) {
    for (let col = 0; col < hexCols; col++) {
      const { x, y } = getHexCoords(row, col, hexSize);
      drawHexagon(ctx, x, y, hexSize);
      ctx.stroke();
    }
  }
};

/**
 * Draw hex with number, label, icon, and events indicator
 */
export const drawHex = (ctx, hex, hexSize) => {
  const { x, y } = getHexCoords(hex.row, hex.col, hexSize);

  // Semi-transparent background for content
  if (hex.number || hex.label || hex.icon) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    drawHexagon(ctx, x, y, hexSize * 0.85);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Events indicator
  if (hex.events && hex.events.trim()) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + hexSize * 0.6, y - hexSize * 0.6, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scale font sizes
  const fontSize = Math.max(8, hexSize * 0.2);
  const iconSize = Math.max(12, hexSize * 0.3);
  const labelSize = Math.max(7, hexSize * 0.18);

  // Hex number
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hex.number, x, y - hexSize * 0.4);

  // Label
  if (hex.label) {
    ctx.font = `bold ${labelSize}px sans-serif`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillText(hex.label, x, y - hexSize * 0.2);
  }

  // Icon
  if (hex.icon && ICON_TYPES[hex.icon]) {
    ctx.font = `${iconSize}px Arial`;
    ctx.fillText(ICON_TYPES[hex.icon].emoji, x, y + hexSize * 0.05);

    if (hex.iconLabel) {
      ctx.font = `bold ${Math.max(6, hexSize * 0.15)}px sans-serif`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillText(hex.iconLabel, x, y + hexSize * 0.35);
    }
  }
};

/**
 * Draw extraction selection
 */
export const drawExtractionSelection = (ctx, corner1, corner2) => {
  if (!corner1) return;

  if (corner2) {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(
      corner1.x,
      corner1.y,
      corner2.x - corner1.x,
      corner2.y - corner1.y
    );
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.fillRect(
      corner1.x,
      corner1.y,
      corner2.x - corner1.x,
      corner2.y - corner1.y
    );
  } else {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(corner1.x, corner1.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
};

/**
 * Draw roads on canvas
 */
export const drawRoads = (ctx, roads, roadStyles, hexSize) => {
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
        const { x, y } = getHexCoords(wp.row, wp.col, hexSize);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);
  });
};

/**
 * Draw current road being created
 */
export const drawCurrentRoad = (ctx, currentRoad, roadStyles, hexSize) => {
  if (!currentRoad || currentRoad.waypoints.length === 0) return;

  const style = roadStyles[currentRoad.type] || roadStyles.trail;
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width + 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash(style.dash);

  ctx.beginPath();
  currentRoad.waypoints.forEach((wp, i) => {
    const { x, y } = getHexCoords(wp.row, wp.col, hexSize);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw waypoints
  currentRoad.waypoints.forEach(wp => {
    const { x, y } = getHexCoords(wp.row, wp.col, hexSize);
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
};
