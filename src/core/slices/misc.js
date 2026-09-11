// ============================================================================
// FENESTRAE - SLICE: MISC (core/slices/misc.js)
// Component registry, cache, user, captions and session reset.
// ============================================================================

import { produce } from "immer";
import { initialState } from "../constants";
import { getLaunchpadId } from "../index";
import { WIN_TYPES } from "../../store/types";
// Global component registry (equivalent to Win32 class registration)
export const formsRegistry = new Map();

export const createMiscSlice = (set, get) => ({
  /**
   * Registers components in Fenestrae's central registry.
   * Accepts { key: Component } or { key: { component, options } }.
   */
  register: (components) => {
    if (!components || typeof components !== "object") return;

    Object.entries(components).forEach(([key, value]) => {
      const name = key.toLowerCase();

      if (value && typeof value === "object" && 'component' in value) {
        formsRegistry.set(name, { component: value.component, options: value.options || {} });
        return;
      }

      if (value) {
        formsRegistry.set(name, { component: value, options: {} });
        return;
      }

      console.warn(`[Fenestrae] Registro inválido para la clave '${key}'`);
    });
  },

  setHasHydrated: (state) => set({ hasHydrated: state }),

  setCaption: (id, newCaption) => set(produce((self) => {
    const win = self.wins.get(id);
    if (win) win.title = newCaption;
  })),

  setEmpresa: (newTitle) => set(produce((self) => {
    const launchpad = self.wins.get(getLaunchpadId());
    if (launchpad) {
      launchpad.title = newTitle;
      if (self.activeTabId === getLaunchpadId()) document.title = newTitle;
    }
  })),

  setUser: (userData) => set(produce((self) => {
    self.user = userData;
    const launchpad = self.wins.get(getLaunchpadId());
    if (launchpad && userData?.empresa) launchpad.title = userData.empresa;
  })),

  setCache: (winId, data) => set(produce((self) => {
    self.cache.set(winId, data);
  })),

  setMatchCode: (id) => set(produce((self) => {
    const win = self.wins.get(id);
    if (win) win.isMatchCode = true;
  })),

  isModal: (id) => get().wins.get(id)?.type === WIN_TYPES.MODAL,
  isFloat: (id) => get().wins.get(id)?.type === WIN_TYPES.FLOAT,
  isRestored: (id) => get().wins.get(id)?.isRestored || false,

  resetStore: () => {
    try {
      localStorage.removeItem("erp_session_backup");
    } catch {
      // Some runtimes expose a partial localStorage without Storage methods.
    }
    set(initialState);
  },
});
