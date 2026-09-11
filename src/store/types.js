/**
 * Constantes de los tipos de ventanas soportadas por Fenestrae
 */
export const WIN_TYPES = {
  TAB: 'tab',
  MODAL: 'modal',
  FLOAT: 'float',
  SIDE: 'side',
  TOP: 'top',
  PANEL: 'panel',
  EXT: 'ext'
};

/**
 * Alineaciones reales usadas por geometry.js y los contenedores de ventana.
 * No confundir con zonas de docking (left/right/top/bottom) ni con presets
 * de layout (modal90, panelSide, …).
 */
export const WIN_ALIGN = {
  NONE: "none",
  CENTER: "center",
  TOP_CENTER: "top-center",
  RIGHT: "right",
  AL_RIGHT: "alRight",
  AL_LEFT: "alLeft",
  AL_BOTTOM: "alBottom",
  AL_SIDE: "alSide",
};
