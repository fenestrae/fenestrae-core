// ============================================================================
// FENESTRAE - SLICE: LIFECYCLE (core/slices/lifecycle.js)
// Window open, create and close with hierarchy management.
// ============================================================================

import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { injectPopupBridge } from '../../events/injectPopupBridge';
import { LAUNCHPAD_ID } from "../constants";
import { calculateAlignment, getStandardLayout } from "../geometry";
import { getAllDescendants } from "../treeHelpers";

// Native window instances (window.open). Not persisted.
export const externalWindowInstances = new Map();

export const createLifecycleSlice = (set, get) => ({
  createWin: (winIdParent, winData) => {
    let newId = null;
    const { nativeWindow, ...params } = winData.params || {};
    const { type = "tab", name } = winData;

    const uniqueKey = type === "ext"
      ? `${name}-${uuidv4()}`
      : `${name}-${params.id || "0"}-${params.param1 || ""}-${params.param2 || ""}-${params.param3 || ""}`;

    // Tabs with the same uniqueKey are reused instead of duplicated
    if (type === "tab") {
      const existing = Array.from(get().wins.values()).find(
        (w) => w.uniqueKey === uniqueKey && w.type === "tab"
      );
      if (existing) {
        set(produce((state) => {
          state.activeTabId = existing.id;
          state.activeWinId = existing.id;
        }));
        return existing.id;
      }
    }

    newId = uuidv4();

    set(produce((self) => {
      const { preset } = params;
      // top windows are system tools — always rooted, never children
      const validParentId = (type === "tab" || type === "top") ? "0" : winIdParent || "0";

      // Side with isMatchCode: replaces any previous side with that flag
      if (type === "side" && params.isMatchCode === true) {
        const existingMatchSide = Array.from(self.wins.values()).find(
          (w) => w.type === "side" && w.params?.isMatchCode === true
        );
        if (existingMatchSide) {
          const toRemove = [existingMatchSide.id, ...getAllDescendants(existingMatchSide.id, self.wins)];
          toRemove.forEach((targetId) => {
            self.wins.delete(targetId);
            self.winOrder = self.winOrder.filter((oid) => oid !== targetId);
          });
        }
      }

      const isVisible = winData.hasOwnProperty("visible") ? winData.visible : type === "tab";
      let layout = {};

      if (type === "ext") {
        layout = { width: winData.width ?? 800, height: winData.height ?? 600, x: winData.x ?? 100, y: winData.y ?? 100, isExternal: true };
      } else if (type === "modal") {
        layout = getStandardLayout(null, preset || "modal90");
      } else if (type === "side") {
        layout = getStandardLayout(null, "alSide");
      } else if (type === "panel") {
        layout = winData.align === "none"
          ? { x: winData.x ?? 0, y: winData.y ?? 0, width: winData.width ?? 400, height: winData.height ?? 300, align: "none" }
          : getStandardLayout(null, winData.align || preset || "panelSide");
      } else if (type === "float" || type === "top") {
        // params.width/height/x/y are accepted as fallback for convenience
        const pw = params.width;
        const ph = params.height;
        const px = params.x;
        const py = params.y;
        layout = preset
          ? getStandardLayout(null, preset)
          : {
              x:      winData.x      ?? px ?? Math.random() * 100 + 50,
              y:      winData.y      ?? py ?? Math.random() * 100 + 50,
              width:  winData.width  ?? pw ?? 700,
              height: winData.height ?? ph ?? 500,
              state:  type === "top" ? "z-900" : "normal",
            };
      }

      const newWin = {
        ...winData,
        id: newId,
        type,
        uniqueKey,
        parentId: validParentId,
        visible: type === "top" || type === "ext" ? true : isVisible,
        ...layout,
        params: {
          ...params,
          winId: newId,
          parentId: validParentId,
          isTab: type === "tab",
          isFloat: type === "float",
          isModal: type === "modal",
          isPanel: type === "panel",
          isSide: type === "side",
          isMatchCode: params.isMatchCode || false,
          isExternal: type === "ext",
        },
        // Docking state
        docked:   false,
        dockZone: null,
      };

      if (newWin.align && newWin.align !== "none") {
        const coords = calculateAlignment(newWin.align, newWin.width, newWin.height);
        if (coords) { newWin.x = coords.x; newWin.y = coords.y; }
      }

      self.wins.set(newId, newWin);
      self.winOrder.push(newId);
      if (type === "tab") self.activeTabId = newId;
      self.activeWinId = newId;
    }));

    // Bind native window events if present
    if (nativeWindow) {
      externalWindowInstances.set(newId, nativeWindow);
      nativeWindow.onfocus = () => {
        if (get().activeWinId !== newId) get().setActiveWinId(newId);
      };
      nativeWindow.onbeforeunload = () => {
        setTimeout(() => {
          if (get().wins.has(newId)) get().closeWin(newId);
        }, 100);
      };
    }

    return newId;
  },

  openWin: (winData) => get().createWin("0", winData),

  // --------------------------------------------------------------------------
  // create — Creates a window in memory, always invisible (except tabs).
  // Returns winId. Use win.show(winId) when ready to display.
  // --------------------------------------------------------------------------
  create: (parentWinId, name, options = {}) => {
    const { type = "float", x, y, width, height, params = {}, ...rest } = options;
    const componentName = name?.toLowerCase();

    return get().createWin(parentWinId || "0", {
      type,
      name: componentName,
      title: params.title || componentName?.toUpperCase(),
      visible: type === "tab", // tabs visible by default, everything else hidden
      x, y, width, height,
      params,
      ...rest,
    });
  },

  // --------------------------------------------------------------------------
  // show — Makes an existing window visible and brings it to front.
  // --------------------------------------------------------------------------
  show: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win) return;

    win.visible = true;
    self.winOrder = self.winOrder.filter((oid) => oid !== winId);
    self.winOrder.push(winId);
    self.activeWinId = winId;

    if (win.type !== "side") {
      let current = win;
      while (current) {
        if (current.type === "tab") { self.activeTabId = current.id; break; }
        if (current.type === "ext") break;
        current = self.wins.get(current.parentId);
      }
    }
  })),

  // --------------------------------------------------------------------------
  // hide — Hides a window without destroying it. State is preserved.
  // --------------------------------------------------------------------------
  hide: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || win.type === "tab") return; // tabs cannot be hidden, only switched

    win.visible = false;

    // Transfer focus to the parent or the last window in order
    if (self.activeWinId === winId) {
      const parentId = win.parentId;
      if (parentId && parentId !== "0" && self.wins.has(parentId)) {
        self.activeWinId = parentId;
      } else {
        const remaining = self.winOrder.filter((oid) => oid !== winId);
        self.activeWinId = remaining.length > 0 ? remaining[remaining.length - 1] : LAUNCHPAD_ID;
      }
    }
  })),

  closeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (!win || win.closable === false) return;

    const toRemove = [id, ...getAllDescendants(id, self.wins)];

    // Close associated native windows and clean up their intervals
    toRemove.forEach((targetId) => {
      if (externalWindowInstances.has(targetId)) {
        const pipWin = externalWindowInstances.get(targetId);
        if (pipWin && !pipWin.closed) {
          if (pipWin._erpTitleInterval) {
            clearInterval(pipWin._erpTitleInterval);
            pipWin._erpTitleInterval = null;
          }
          pipWin.close();
        }
        externalWindowInstances.delete(targetId);
      }
    });

    // Recalculate active window
    if (toRemove.includes(self.activeWinId)) {
      const parentId = win.parentId;
      if (parentId && parentId !== "0" && self.wins.has(parentId) && !toRemove.includes(parentId)) {
        self.activeWinId = parentId;
      } else {
        const remainingWins = self.winOrder.filter((oid) => !toRemove.includes(oid));
        self.activeWinId = remainingWins.length > 0 ? remainingWins[remainingWins.length - 1] : LAUNCHPAD_ID;
      }
    }

    // Recalculate active tab if it was the one being closed
    if (win.type === "tab" && self.activeTabId === id) {
      const remainingTabs = Array.from(self.wins.values()).filter(
        (w) => w.type === "tab" && !toRemove.includes(w.id)
      );
      const lastTab = remainingTabs[remainingTabs.length - 1];
      self.activeTabId = lastTab ? lastTab.id : LAUNCHPAD_ID;
      if (toRemove.includes(self.activeWinId)) self.activeWinId = self.activeTabId;
    }

    toRemove.forEach((targetId) => {
      self.wins.delete(targetId);
      self.winOrder = self.winOrder.filter((oid) => oid !== targetId);
      if (self.cache) self.cache.delete(targetId);
    });
  })),

  // --------------------------------------------------------------------------
  // dockWin — Docks a top window into a zone (left | right | top | bottom).
  // Saves current position in prevLayout so undockWin can restore it.
  // --------------------------------------------------------------------------
  dockWin: (winId, zone) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || win.type !== "top") return;
    if (!["left", "right", "top", "bottom"].includes(zone)) return;

    // Save current position for later restore
    win.prevLayout = { x: win.x, y: win.y, width: win.width, height: win.height };

    win.docked   = true;
    win.dockZone = zone;
    win.visible  = true;
  })),

  // --------------------------------------------------------------------------
  // undockWin — Releases a docked window back to floating top.
  // Restores the position it had before docking.
  // --------------------------------------------------------------------------
  undockWin: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || !win.docked) return;

    win.docked   = false;
    win.dockZone = null;

    // Restore previous position
    if (win.prevLayout) {
      win.x      = win.prevLayout.x;
      win.y      = win.prevLayout.y;
      win.width  = win.prevLayout.width;
      win.height = win.prevLayout.height;
      win.prevLayout = null;
    }

    // Bring to front
    self.winOrder = self.winOrder.filter((oid) => oid !== winId);
    self.winOrder.push(winId);
    self.activeWinId = winId;
  })),

  registerExternalInstance: (id, winInstance) => {
    externalWindowInstances.set(id, winInstance);
  },

  externalizeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (win) { win.type = "ext"; win.visible = true; }
  })),
});
