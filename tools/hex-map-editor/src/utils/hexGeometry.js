/**
 * Calculate hex center coordinates
 */
export const getHexCoords = (row, col, hexSize) => {
  const x = col * hexSize * 1.5;
  const y = row * hexSize * Math.sqrt(3) + (col % 2 ? hexSize * Math.sqrt(3) / 2 : 0);
  return { x, y };
};

/**
 * Get hex vertices for drawing
 */
export const getHexVertices = (x, y, size) => {
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

/**
 * Check if point is inside hexagon
 */
export const isPointInHex = (px, py, hexX, hexY, hexSize) => {
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

/**
 * Convert pixel coordinates to hex grid coordinates
 */
export const pixelToHex = (px, py, hexSize) => {
  const col = Math.round(px / (hexSize * 1.5));
  const row = Math.round((py - (col % 2 ? hexSize * Math.sqrt(3) / 2 : 0)) / (hexSize * Math.sqrt(3)));
  return { row, col };
};

/**
 * Draw hexagon path on canvas
 */
export const drawHexagon = (ctx, x, y, size) => {
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

/**
 * Get midpoint of hex edge
 */
export const getEdgeMidpoint = (row, col, edgeIndex, hexSize) => {
  const { x, y } = getHexCoords(row, col, hexSize);
  const vertices = getHexVertices(x, y, hexSize);
  const v1 = vertices[edgeIndex];
  const v2 = vertices[(edgeIndex + 1) % 6];
  return {
    x: (v1.x + v2.x) / 2,
    y: (v1.y + v2.y) / 2
  };
};

/**
 * Find closest hex edge to point
 */
export const findClosestEdge = (px, py, hexRows, hexCols, hexSize) => {
  let closestEdge = null;
  let minDist = hexSize * 0.3;

  for (let row = 0; row < hexRows; row++) {
    for (let col = 0; col < hexCols; col++) {
      const { x, y } = getHexCoords(row, col, hexSize);
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

/**
 * Calculate hex size to fit image
 */
export const calculateHexSize = (imageWidth, imageHeight, hexCols, hexRows) => {
  const sizeFromCols = imageWidth / (hexCols * 1.5 + 0.5);
  const sizeFromRows = imageHeight / (hexRows * Math.sqrt(3) + 0.5);
  return Math.max(sizeFromCols, sizeFromRows);
};
