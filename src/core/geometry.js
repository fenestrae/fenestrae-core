// ============================================================================
// FENESTRAE - GEOMETRY HELPERS (core/geometry.js)
// ============================================================================

/**
 * Calculates (x, y) coordinates for a window based on its alignment.
 */
export const calculateAlignment = (align, width, height) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const navHeight = 60;

  switch (align) {
    case "center":
      return { x: Math.max(0, (vw - width) / 2), y: Math.max(0, (vh - height) / 2) };
    case "top-center":
      return { x: Math.max(0, (vw - width) / 2), y: 20 };
    case "right":
    case "alRight":
      return { x: Math.max(0, vw - width), y: 0 };
    case "alLeft":
      return { x: 0, y: 0 };
    case "alBottom":
      return { x: 0, y: vh - navHeight - height };
    default:
      return null;
  }
};

/**
 * Returns preset dimensions and position for a standard layout.
 * @param {object|null} parentWin - Parent window (optional, uses viewport if null).
 * @param {string} preset - Preset name.
 */
export const getStandardLayout = (parentWin, preset = "modal90") => {
  const navHeight = 60;
  const vw = parentWin?.width || window.innerWidth;
  const vh = parentWin?.height || window.innerHeight;

  switch (preset) {
    case "modal97":
      return { width: Math.floor(vw * 0.97), height: Math.floor(vh * 0.97), align: "center" };
    case "modal90":
      return { width: Math.floor(vw * 0.9), height: Math.floor(vh * 0.9), align: "center" };
    case "modal70":
      return { width: Math.floor(vw * 0.7), height: Math.floor(vh * 0.7), align: "center" };
    case "rightPanel":
      return { width: Math.floor(vw * 0.4), height: Math.floor(vh * 0.95), x: vw - Math.floor(vw * 0.4) - 20, y: 20, align: "none" };
    case "panelSide":
      return { width: Math.floor(vw * 0.35), height: vh, x: vw - Math.floor(vw * 0.35), y: 0, align: "none" };
    case "panelSideFull":
      return { width: Math.floor(vw * 0.95), height: Math.floor(vh * 0.90), x: vw - Math.floor(vw * 0.95), y: ((vh - Math.floor(vh * 0.90)) / 2) - 35, align: "none" };
    case "alRight":
      return { width: 450, height: vh - navHeight, x: vw - 450, y: 0, align: "alRight" };
    case "alLeft":
      return { width: 300, height: vh - navHeight, x: 0, y: 0, align: "alLeft" };
    case "alBottom":
      return { width: vw, height: 250, x: 0, y: vh - navHeight - 250, align: "alBottom" };
    case "alside": {
      const calculatedWidth = Math.min(450, window.innerWidth * 0.4);
      return { width: calculatedWidth, height: vh, x: vw - calculatedWidth, y: 0, align: "alRight", isPortal: true };
    }
    default:
      return { width: 700, height: 500, align: "center" };
  }
};
