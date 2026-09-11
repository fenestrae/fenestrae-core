// ============================================================================
// FENESTRAE - SLICE: LAYOUT (core/slices/layout.js)
// Actualización de posición/tamaño, maximizar y minimizar ventanas.
// ============================================================================

import { produce } from "immer";
import { calculateAlignment } from "../geometry";
import { externalWindowInstances } from "./lifecycle";
import { postToWindow } from "../../lib/security";

export const createLayoutSlice = (set, get) => ({
  updateWinLayout: (id, layout) => set(produce((self) => {
    const win = self.wins.get(id);
    if (!win) return;

    if (layout.width !== undefined)   win.width    = layout.width;
    if (layout.height !== undefined)  win.height   = layout.height;
    if (layout.autoSize !== undefined) win.autoSize = layout.autoSize;
    if (layout.caption !== undefined) win.title    = layout.caption;
    if (layout.visible !== undefined) win.visible  = layout.visible;

    const coords = layout.align ? calculateAlignment(layout.align, win.width, win.height) : null;

    if (coords) {
      win.x = coords.x; win.y = coords.y; win.align = layout.align;
    } else {
      if (layout.x !== undefined) win.x = layout.x;
      if (layout.y !== undefined) win.y = layout.y;
      if (layout.align === "none") win.align = "none";
    }

    // Sincroniza ventana nativa si es un popup externo
    if (win.type === 'ext' && win.params?.extSubtype === 'popup') {
      const nativeWindow = externalWindowInstances.get(id);
      if (nativeWindow && !nativeWindow.closed) {
        try {
          if (layout.width !== undefined || layout.height !== undefined)
            nativeWindow.resizeTo(layout.width || win.width, layout.height || win.height);
          if (layout.x !== undefined || layout.y !== undefined)
            nativeWindow.moveTo(layout.x !== undefined ? layout.x : win.x, layout.y !== undefined ? layout.y : win.y);
          if (layout.caption !== undefined)
            nativeWindow.document.title = layout.caption;

          nativeWindow.moveTo(win.x, win.y);
          postToWindow(
            nativeWindow,
            { type: 'LAYOUT_UPDATED', layout: { width: win.width, height: win.height, x: win.x, y: win.y, caption: win.title } },
          );
        } catch (err) {
          console.warn('[Fenestrae] Error actualizando popup nativa:', err);
        }
      }
    }

    // Notifica cambio de layout del padre a los popups hijos
    if (win.type === 'tab' || win.type === 'float' || win.type === 'modal') {
      const childPopups = Array.from(self.wins.values()).filter(
        (w) => w.type === 'ext' && w.params?.extSubtype === 'popup' && w.parentId === id
      );
      childPopups.forEach((popup) => {
        const nativePopup = externalWindowInstances.get(popup.id);
        if (nativePopup && !nativePopup.closed) {
          postToWindow(
            nativePopup,
            { type: 'PARENT_LAYOUT_CHANGED', parentId: id, parentLayout: { width: win.width, height: win.height, x: win.x, y: win.y } },
          );
        }
      });
    }
  })),

  minimizeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (win) win.state = "minimized";
  })),

  maximizeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (!win) return;

    if (win.state === "maximized") {
      win.state = "normal";
      if (win.prevLayout) Object.assign(win, win.prevLayout);
    } else {
      win.prevLayout = { x: win.x, y: win.y, width: win.width, height: win.height };
      win.state = "maximized";
      win.x = 0; win.y = 0;
      win.width = window.innerWidth;
      win.height = window.innerHeight;
    }
  })),
});
