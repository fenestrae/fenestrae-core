// ============================================================================
// FENESTRAE - GEOMETRY HELPERS (core/geometry.js)
// ============================================================================

import { WIN_ALIGN } from "../store/types";

/**
 * Calculates (x, y) coordinates for a window based on its alignment.
 */
export const calculateAlignment = (align, width, height) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const navHeight = 60;

  switch (align) {
    case WIN_ALIGN.CENTER:
      return { x: Math.max(0, (vw - width) / 2), y: Math.max(0, (vh - height) / 2) };
    case WIN_ALIGN.TOP_CENTER:
      return { x: Math.max(0, (vw - width) / 2), y: 20 };
    case WIN_ALIGN.RIGHT:
    case WIN_ALIGN.AL_RIGHT:
      return { x: Math.max(0, vw - width), y: 0 };
    case WIN_ALIGN.AL_LEFT:
      return { x: 0, y: 0 };
    case WIN_ALIGN.AL_BOTTOM:
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
      return { width: Math.floor(vw * 0.97), height: Math.floor(vh * 0.97), align: WIN_ALIGN.CENTER };
    case "modal90":
      return { width: Math.floor(vw * 0.9), height: Math.floor(vh * 0.9), align: WIN_ALIGN.CENTER };
    case "modal70":
      return { width: Math.floor(vw * 0.7), height: Math.floor(vh * 0.7), align: WIN_ALIGN.CENTER };
    case "rightPanel":
      return { width: Math.floor(vw * 0.4), height: Math.floor(vh * 0.95), x: vw - Math.floor(vw * 0.4) - 20, y: 20, align: WIN_ALIGN.NONE };
    case "panelSide":
      return { width: Math.floor(vw * 0.35), height: vh, x: vw - Math.floor(vw * 0.35), y: 0, align: WIN_ALIGN.NONE };
    case "panelSideFull":
      return { width: Math.floor(vw * 0.95), height: Math.floor(vh * 0.90), x: vw - Math.floor(vw * 0.95), y: ((vh - Math.floor(vh * 0.90)) / 2) - 35, align: WIN_ALIGN.NONE };
    case WIN_ALIGN.AL_RIGHT:
      return { width: 450, height: vh - navHeight, x: vw - 450, y: 0, align: WIN_ALIGN.AL_RIGHT };
    case WIN_ALIGN.AL_LEFT:
      return { width: 300, height: vh - navHeight, x: 0, y: 0, align: WIN_ALIGN.AL_LEFT };
    case WIN_ALIGN.AL_BOTTOM:
      return { width: vw, height: 250, x: 0, y: vh - navHeight - 250, align: WIN_ALIGN.AL_BOTTOM };
    case WIN_ALIGN.AL_SIDE:
    case "alside": {
      const calculatedWidth = Math.min(450, window.innerWidth * 0.4);
      return { width: calculatedWidth, height: vh, x: vw - calculatedWidth, y: 0, align: WIN_ALIGN.AL_RIGHT, isPortal: true };
    }
    default:
      return { width: 700, height: 500, align: WIN_ALIGN.CENTER };
  }
};
