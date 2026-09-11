// ============================================================================
// FENESTRAE - SLICE: LIFECYCLE (core/slices/lifecycle.js)
// Window open, create and close with hierarchy management.
// ============================================================================

import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { getLaunchpadId } from "../index";
import { calculateAlignment, getStandardLayout } from "../geometry";
import { getAllDescendants } from "../treeHelpers";
import { contextRepository } from "../../database/ContextRepository";
import { WIN_TYPES, WIN_ALIGN } from "../../store/types";
import { ROOT_PARENT_ID } from "../constants";

// Native window instances (window.open). Not persisted.
export const externalWindowInstances = new Map();

function findWindow(wins, predicate) {
  for (const w of wins.values()) {
    if (predicate(w)) return w;
  }
  return undefined;
}

function nextWindowIndex(wins) {
  let max = -1;
  for (const w of wins.values()) {
    const idx = w.index ?? 0;
    if (idx > max) max = idx;
  }
  return max + 1;
}

function dropWindows(self, ids) {
  const removeSet = new Set(ids);
  for (const targetId of ids) {
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

    self.wins.delete(targetId);
    if (self.cache) self.cache.delete(targetId);
    if (self.contexts) {
      const prefix = `${targetId}:`;
      for (const k of self.contexts.keys()) {
        if (k.startsWith(prefix)) self.contexts.delete(k);
      }
    }
    contextRepository.clearWindow(targetId);
  }
  self.winOrder = self.winOrder.filter((oid) => !removeSet.has(oid));
}

export const createLifecycleSlice = (set, get) => ({
  createWin: (winIdParent, winData) => {
    let newId = null;
    const { nativeWindow, ...params } = winData.params || {};
    const { type = WIN_TYPES.TAB, name } = winData;

    const uniqueKey = type === WIN_TYPES.EXT
      ? `${name}-${uuidv4()}`
      : `${name}-${params.id || "0"}-${params.param1 || ""}-${params.param2 || ""}-${params.param3 || ""}`;

    // Tabs with the same uniqueKey are reused instead of duplicated
    if (type === WIN_TYPES.TAB) {
      const existing = findWindow(
        get().wins,
        (w) => w.uniqueKey === uniqueKey && w.type === WIN_TYPES.TAB,
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
      const validParentId = (type === WIN_TYPES.TAB || type === WIN_TYPES.TOP) ? ROOT_PARENT_ID : winIdParent || ROOT_PARENT_ID;

      // ---------------------------------------------------------------------
      // FENESTRAE RULE: Only ONE active side window can exist at any time.
      //
      // A side window is a global workspace tool with its own lifecycle.
      // It behaves like a full window (with id, params, persistence, focus),
      // but it is visually attached to a lateral zone of the workspace.
      //
      // By workspace design:
      //   - Only one side window may be active simultaneously.
      //   - When a new side window is requested, any existing side window
      //     must be closed first (including all its descendants).
      //
      // Previously, only side windows with isMatchCode === true were replaced.
      // Now, ANY existing side window is replaced when a new one is created.
      // ---------------------------------------------------------------------

      // Side: replace any existing side window
      if (type === WIN_TYPES.SIDE) {
        const existingMatchSide = findWindow(self.wins, (w) => w.type === WIN_TYPES.SIDE);

        if (existingMatchSide) {
          const toRemove = [existingMatchSide.id, ...getAllDescendants(existingMatchSide.id, self.wins)];
          dropWindows(self, toRemove);
        }
      }

      const isVisible = winData.hasOwnProperty("visible") ? winData.visible : type === WIN_TYPES.TAB;
      let layout = {};

      if (type === WIN_TYPES.EXT) {
        const opts = winData.options || {};
        layout = {
          width: winData.width ?? opts.width ?? 800,
          height: winData.height ?? opts.height ?? 600,
          x: winData.x ?? opts.left ?? 100,
          y: winData.y ?? opts.top ?? 100,
          isExternal: true,
          modal: !!opts.modal,
          topMost: !!opts.topMost,
          toolbox: !!opts.toolbox,
          borderless: !!opts.borderless,
          dockable: !!opts.dockable,
          titlebarStyle: opts.titlebarStyle || "default",
          externalId: opts.externalId || null,
          persistLayout: !!opts.persistLayout,
        };

      } else if (type === WIN_TYPES.MODAL) {
        layout = getStandardLayout(null, preset || "modal90");
      } else if (type === WIN_TYPES.SIDE) {
        layout = getStandardLayout(null, WIN_ALIGN.AL_SIDE);
      } else if (type === WIN_TYPES.PANEL) {
        layout = winData.align === WIN_ALIGN.NONE
          ? { x: winData.x ?? 0, y: winData.y ?? 0, width: winData.width ?? 400, height: winData.height ?? 300, align: WIN_ALIGN.NONE }
          : getStandardLayout(null, winData.align || preset || "panelSide");
      } else if (type === WIN_TYPES.FLOAT || type === WIN_TYPES.TOP) {
        // params.width/height/x/y are accepted as fallback for convenience
        const pw = params.width;
        const ph = params.height;
        const px = params.x;
        const py = params.y;
        layout = preset
          ? getStandardLayout(null, preset)
          : {
            x: winData.x ?? px ?? Math.random() * 100 + 50,
            y: winData.y ?? py ?? Math.random() * 100 + 50,
            width: winData.width ?? pw ?? 700,
            height: winData.height ?? ph ?? 500,
            state: type === WIN_TYPES.TOP ? "z-900" : "normal",
          };
      }

      const newWin = {
        ...winData,
        id: newId,
        type,
        uniqueKey,
        parentId: validParentId,
        visible: type === WIN_TYPES.TOP || type === WIN_TYPES.EXT ? true : isVisible,
        ...layout,
        params: {
          ...params,
          winId: newId,
          parentId: validParentId,
          isTab: type === WIN_TYPES.TAB,
          isFloat: type === WIN_TYPES.FLOAT,
          isModal: type === WIN_TYPES.MODAL,
          isPanel: type === WIN_TYPES.PANEL,
          isSide: type === WIN_TYPES.SIDE,
          isMatchCode: params.isMatchCode || false,
          isExternal: type === WIN_TYPES.EXT,
        },

        // Layout fijo
        fixed: false,
        fixedZone: null,    // "top" | "left" | "right" | "bottom"

        // Docking state
        docked: false,
        dockZone: null,
      };

      if (newWin.align && newWin.align !== WIN_ALIGN.NONE) {
        const coords = calculateAlignment(newWin.align, newWin.width, newWin.height);
        if (coords) { newWin.x = coords.x; newWin.y = coords.y; }
      }

      newWin.index = nextWindowIndex(self.wins);

      self.wins.set(newId, newWin);
      self.winOrder.push(newId);


      if (type === WIN_TYPES.TAB) self.activeTabId = newId;
      self.activeWinId = newId;


    }));

    // Bind native window events if present
    if (nativeWindow) {
      externalWindowInstances.set(newId, nativeWindow);

      // focus → topMost / active
      nativeWindow.onfocus = () => {
        if (get().activeWinId !== newId) get().setActiveWinId(newId);
      };

      // cierre → lifecycle
      nativeWindow.onbeforeunload = () => {
        setTimeout(() => {
          if (get().wins.has(newId)) get().closeWin(newId);
        }, 100);
      };
    }
    return newId;
  },


  openExternalWin: (parentId, name, params = {}, options = {}, callbacks = {}) => {
    const componentName = name?.toLowerCase();

    // aquí no abrimos todavía window.open: solo creamos el registro
    const winId = get().createWin(parentId || ROOT_PARENT_ID, {
      type: WIN_TYPES.EXT,
      name: componentName,
      title: params.title || componentName.toUpperCase(),
      width: options.width,
      height: options.height,
      x: options.left,
      y: options.top,
      params,
      options,      // ← aquí van modal/topMost/toolbox/borderless/dockable...
      ...callbacks,
    });

    return winId;
  },


  openWin: (winData) => get().createWin(ROOT_PARENT_ID, winData),

  // --------------------------------------------------------------------------
  // create — Creates a window in memory, always invisible (except tabs).
  // Returns winId. Use win.show(winId) when ready to display.
  // --------------------------------------------------------------------------
  create: (parentWinId, name, options = {}) => {
    const { type = WIN_TYPES.FLOAT, x, y, width, height, params = {}, ...rest } = options;
    const componentName = name?.toLowerCase();

    return get().createWin(parentWinId || ROOT_PARENT_ID, {
      type,
      name: componentName,
      title: params.title || componentName?.toUpperCase(),
      visible: type === WIN_TYPES.TAB, // tabs visible by default, everything else hidden
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

    if (win.type !== WIN_TYPES.SIDE) {
      let current = win;
      while (current) {
        if (current.type === WIN_TYPES.TAB) { self.activeTabId = current.id; break; }
        if (current.type === WIN_TYPES.EXT) break;
        current = self.wins.get(current.parentId);
      }
    }
  })),

  // --------------------------------------------------------------------------
  // hide — Hides a window without destroying it. State is preserved.
  // --------------------------------------------------------------------------
  hide: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || win.type === WIN_TYPES.TAB) return; // tabs cannot be hidden, only switched

    win.visible = false;

    // Transfer focus to the parent or the last window in order
    if (self.activeWinId === winId) {
      const parentId = win.parentId;
      if (parentId && parentId !== ROOT_PARENT_ID && self.wins.has(parentId)) {
        self.activeWinId = parentId;
      } else {
        const remaining = self.winOrder.filter((oid) => oid !== winId);
        self.activeWinId = remaining.length > 0 ? remaining[remaining.length - 1] : getLaunchpadId();
      }
    }
  })),

  closeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (!win || win.closable === false) return;

    const toRemove = [id, ...getAllDescendants(id, self.wins)];
    const removeSet = new Set(toRemove);

    if (removeSet.has(self.activeWinId)) {
      const parentId = win.parentId;
      if (parentId && parentId !== ROOT_PARENT_ID && self.wins.has(parentId) && !removeSet.has(parentId)) {
        self.activeWinId = parentId;
      } else {
        const remainingWins = self.winOrder.filter((oid) => !removeSet.has(oid));
        self.activeWinId = remainingWins.length > 0 ? remainingWins[remainingWins.length - 1] : getLaunchpadId();
      }
    }

    if (win.type === WIN_TYPES.TAB && self.activeTabId === id) {
      let lastTab = null;
      for (const w of self.wins.values()) {
        if (w.type === WIN_TYPES.TAB && !removeSet.has(w.id)) lastTab = w;
      }
      self.activeTabId = lastTab ? lastTab.id : getLaunchpadId();
      if (removeSet.has(self.activeWinId)) self.activeWinId = self.activeTabId;
    }

    dropWindows(self, toRemove);
  })),

  closeAllWin: (includeLaunchPad = false) => {
    const launchpadId = getLaunchpadId();
    set(produce((self) => {
      const ids = [];
      for (const [id, current] of self.wins) {
        if (!includeLaunchPad && id === launchpadId) continue;
        if (current.closable === false) continue;
        ids.push(id);
      }
      dropWindows(self, ids);
      if (!self.wins.has(self.activeWinId)) {
        self.activeWinId = self.wins.has(launchpadId) ? launchpadId : null;
      }
      if (!self.wins.has(self.activeTabId)) {
        self.activeTabId = self.wins.has(launchpadId) ? launchpadId : null;
      }
    }));
  },

  // --------------------------------------------------------------------------
  // dockWin — Docks a top window into a zone (left | right | top | bottom).
  // Saves current position in prevLayout so undockWin can restore it.
  // --------------------------------------------------------------------------
  dockWin: (winId, zone) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || win.type !== WIN_TYPES.TOP) return;
    if (!["left", "right", "top", "bottom"].includes(zone)) return;

    // Save current position for later restore
    win.prevLayout = { x: win.x, y: win.y, width: win.width, height: win.height };
      win.fixed = false;
    win.fixedZone = null;
    win.docked = true;
    win.dockZone = zone;
    win.visible = true;
  })),

  // --------------------------------------------------------------------------
  // undockWin — Releases a docked window back to floating top.
  // Restores the position it had before docking.
  // --------------------------------------------------------------------------
  undockWin: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || !win.docked) return;

    win.docked = false;
    win.dockZone = null;

    // Restore previous position
    if (win.prevLayout) {
      win.x = win.prevLayout.x;
      win.y = win.prevLayout.y;
      win.width = win.prevLayout.width;
      win.height = win.prevLayout.height;
      win.prevLayout = null;
    }

    // Bring to front
    self.winOrder = self.winOrder.filter((oid) => oid !== winId);
    self.winOrder.push(winId);
    self.activeWinId = winId;
  })),


  // --------------------------------------------------------------------------
  // fixWin — Fija una ventana en una zona (top | left | right | bottom).
  // Guarda la posición actual en prevLayoutFixed para poder restaurarla.
  // --------------------------------------------------------------------------
  fixedWin: (winId, zone) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win) return;
    if (!["top", "left", "right", "bottom"].includes(zone)) return;

    // Guardar layout actual para restaurarlo al hacer unfix
    win.prevLayoutFixed = {
      x: win.x,
      y: win.y,
      width: win.width,
      height: win.height,
    };

    // Estado fijo
    win.fixed = true;
    win.fixedZone = zone;

    // Las ventanas fijas siempre son visibles
    win.visible = true;

    // Desactivar docking si estaba activo
    win.docked = false;
    win.dockZone = null;
  })),

  // --------------------------------------------------------------------------
  // unfixWin — Libera una ventana fija y la devuelve a su estado anterior.
  // Restaura la posición que tenía antes de fijarse.
  // --------------------------------------------------------------------------
  unfixedWin: (winId) => set(produce((self) => {
    const win = self.wins.get(winId);
    if (!win || !win.fixed) return;

    win.fixed = false;
    win.fixedZone = null;

    // Restaurar layout previo
    if (win.prevLayoutFixed) {
      win.x = win.prevLayoutFixed.x;
      win.y = win.prevLayoutFixed.y;
      win.width = win.prevLayoutFixed.width;
      win.height = win.prevLayoutFixed.height;
      win.prevLayoutFixed = null;
    }

    // Traer al frente
    self.winOrder = self.winOrder.filter((oid) => oid !== winId);
    self.winOrder.push(winId);
    self.activeWinId = winId;
  })),



  registerExternalInstance: (id, winInstance) => {
    externalWindowInstances.set(id, winInstance);
  },

  externalizeWin: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (win) { win.type = WIN_TYPES.EXT; win.visible = true; }
  })),
});
