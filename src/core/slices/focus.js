// ============================================================================
// FENESTRAE - SLICE: FOCUS (core/slices/focus.js)
// Window focus, visibility and Z-order management.
// ============================================================================

import { produce } from "immer";
import { externalWindowInstances } from "./lifecycle";
import { getLaunchpadId } from "../index"

export const createFocusSlice = (set, get) => ({

  /**
    * setFocus:
    * Cuando una TAB se activa, busca la última ventana secundaria
    */
  setFocus: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win) return;

    self.activeWinId = winId;

    self.winOrder = self.winOrder.filter((oid) => oid !== winId);
    self.winOrder.push(winId);

    win.visible = true; 
  })),

  setActiveWinId: (id) => set(produce((self) => {
    const targetWin = self.wins.get(id);
    if (!targetWin) return;

    self.activeWinId = id;

    // Focus native window if present in the parent chain
    let focusRunner = targetWin;
    while (focusRunner) {
      if (focusRunner.type === "ext" || externalWindowInstances.has(focusRunner.id)) {
        const nativeWin = externalWindowInstances.get(focusRunner.id);
        if (nativeWin && !nativeWin.closed) nativeWin.focus();
        break;
      }
      focusRunner = self.wins.get(focusRunner.parentId);
    }

    // Update active tab by walking up the hierarchy (except side panels)
    if (targetWin.type !== "side") {
      let current = targetWin;
      let rootTabCandidate = null;
      while (current) {
        if (current.type === "tab") { rootTabCandidate = current.id; break; }
        if (current.type === "ext") break;
        current = self.wins.get(current.parentId);
      }
      if (rootTabCandidate) self.activeTabId = rootTabCandidate;
    }

    // Bring window to front of winOrder
    self.winOrder = self.winOrder.filter((oid) => oid !== id);
    self.winOrder.push(id);

    // Recalculate visibility for all windows
    const checkVisibility = (win) => {
      if (win.id === getLaunchpadId()) return true;
      if (win.type === "top") return true;
      if (win.type === "side") return true;
      if (win.type === "ext") return true;

      if (win.type === "modal" || win.type === "float" || win.type === "panel") {
        let runner = win;
        while (runner) {
          const p = self.wins.get(runner.parentId);
          if (!p) break;
          if (p.id === self.activeTabId || p.type === "ext") return true;
          runner = p;
        }
        const root = self.wins.get(win.parentId);
        if (root && root.type === "top") return true;
      }

      if (win.type === "tab") return win.id === self.activeTabId;

      const parent = self.wins.get(win.parentId);
      if (!parent) return false;
      return checkVisibility(parent);
    };

    self.wins.forEach((win) => { win.visible = checkVisibility(win); });

    if (targetWin.type === "tab") {
      const focusableTypes = new Set(["float", "modal", "side", "panel"]);
      const { wins, winOrder, activeTabId } = self;

      let lastChild = null;

      for (let i = winOrder.length - 1; i >= 0; i--) {
        const wid = winOrder[i];
        const w = wins.get(wid);
        if (!w) continue;

        if (focusableTypes.has(w.type) && w.parentId === activeTabId) {
          lastChild = w.id;
          break;
        }
      }

      if (lastChild) {
        get().setFocus(lastChild);
      }
    }

  })),

  setVisible: (id, isVisible) => set(produce((self) => {
    const win = self.wins.get(id);
    if (!win) return;

    win.visible = isVisible;

    // If becoming visible, bring to front of winOrder
    if (isVisible) {
      self.winOrder = self.winOrder.filter((oid) => oid !== id);
      self.winOrder.push(id);
      self.activeWinId = id;

      // Update active tab if applicable
      if (win.type !== "side") {
        let current = win;
        while (current) {
          if (current.type === "tab") { self.activeTabId = current.id; break; }
          if (current.type === "ext") break;
          current = self.wins.get(current.parentId);
        }
      }
    }
  })),

  bringToFront: (winId) => {
    const { wins } = get();
    const win = wins.get(winId);
    if (!win) return;

    if (win.type === 'ext') {
      const dw = externalWindowInstances.get(winId);
      if (dw && !dw.closed) { dw.focus(); set({ activeWinId: winId }); }
    } else {
      set({ activeWinId: winId });
      if (win.type === 'tab') set({ activeTabId: winId });
    }
  },

  getActiveTab: () => {
    const { wins, activeWinId } = get();
    let current = wins.get(activeWinId);
    while (current && current.type !== "tab" && current.parentId !== "0") {
      current = wins.get(current.parentId);
    }
    return current?.type === "tab" ? current.id : getLaunchpadId();
  },
    getActiveWin: () => {
    const {  activeWinId } = get();
    let current = wins.get(activeWinId);
    return current.id ;
  },
});
