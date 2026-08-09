// ============================================================================
// FENESTRAE - ENTERPRISE STORAGE LAYER (core/storage.js)
// ============================================================================
// This module defines the persistence configuration used by Fenestrae’s
// window manager. It provides a Zustand Persist adapter that stores window
// state inside IndexedDB following the enterprise hierarchy:
//
//     Workgroup → User → Session → Windows
//
// The goal is to ensure strict isolation of window state per session,
// allowing multiple users, workspaces, and browser tabs to coexist safely.
// ============================================================================

import { createJSONStorage } from "zustand/middleware";
import dbManagerInstance from "../database/dbManager";
import { indexedDBStorage } from "../database/indexedDBAdapter";
import {winStore} from "../core"

// ============================================================================
// loadSavedState — Default empty state for winStore
// ============================================================================
// This function provides the initial state structure expected by the window
// store when no persisted data exists. It ensures compatibility with the
// internal Fenestrae runtime.
//
export const loadSavedState = () => {
  return {
    wins: new Map(),     // Map<winId, winData>
    winOrder: [],        // Array of winIds defining Z‑order
    activeTabId: null,   // Currently active window
    contexts: [],        // Reserved for future context persistence
  };
};

// ============================================================================
// persistOptions — Zustand Persist configuration for Fenestrae
// ============================================================================
// This object configures how Zustand Persist interacts with IndexedDB.
// It defines serialization rules, merge logic, and hydration behavior.
//
// IMPORTANT: Fenestrae uses manual hydration. See `skipHydration` below.
// ============================================================================

export const persistOptions = {
  name: "wins",               // Storage key inside IndexedDB
  storage: indexedDBStorage,  // Custom enterprise adapter

  // -------------------------------------------------------------------------
  // skipHydration: true
  // -------------------------------------------------------------------------
  // By default, Zustand Persist automatically loads (hydrates) the saved
  // state as soon as the store is created. This is NOT desirable for
  // enterprise session‑based window management.
  //
  // Why?
  //   - Automatic hydration would restore windows from the *previous* session
  //     whenever the workspace loads (including on F5 refresh).
  //   - Fenestrae requires explicit control: windows must be restored ONLY
  //     when the application activates a specific session.
  //
  // With skipHydration: true:
  //   - Zustand does NOT automatically call storage.getItem("wins")
  //   - The window store starts EMPTY
  //   - Fenestrae restores windows manually via `fenestrae.restoreWindows()`
  //
  // This ensures:
  //   ✔ Correct session isolation
  //   ✔ No accidental restoration of windows from other users/sessions
  //   ✔ Controlled restoration after `activateSession()`
  //
  skipHydration: true,

  // -------------------------------------------------------------------------
  // partialize — Defines which parts of the state should be persisted
  // -------------------------------------------------------------------------
  // This function filters and sanitizes window data before saving it.
  // It removes non‑serializable references (DOM nodes, native window handles,
  // popup instances, etc.) to ensure clean IndexedDB storage.
  //
 partialize: (state) => {

  const hydrated = winStore.getState().hasHydrated;

  // Bloquear persistencia sin borrar datos
  if (!hydrated) {
  
    return {
      activeTabId: state.activeTabId,
      winOrder: state.winOrder,
      wins: Array.from(state.wins.entries()),
      contexts: state.contexts || []
    };
  }

  
  const persistentEntries = Array.from(state.wins.entries())
    .filter(([id, win]) => win.type !== "ext") // External windows NO se persisten
    .map(([id, win]) => {

      // 1. Eliminar TODAS las propiedades no serializables
      const {
        targetWindow,          // referencia Window
        nativeWindow,          // popup Window
        popupWindowInstance,   // instancia externa
        opener,                // referencia Window
        windowRef,             // DOM
        domRef,                // DOM
        safeCallbacks,         // funciones
        onApply,
        onCancel,
        onClose,
        onDelete,
        onError,
        onNext,
        onPrev,
        onSave,
        ...safeWin
      } = win;

      // 2. Limpiar params (pueden contener referencias DOM o funciones)
      const {
        nativeWindow: p_nativeWindow,
        popupWindowInstance: p_popupWindowInstance,
        opener: p_opener,
        windowRef: p_windowRef,
        domRef: p_domRef,
        this: p_this, // cuidado: puede contener funciones
        ...safeParams
      } = safeWin.params || {};

      // 3. Limpiar "this" si contiene funciones o DOM
      const safeThis = {};
      if (p_this && typeof p_this === "object") {
        for (const [k, v] of Object.entries(p_this)) {
          if (
            typeof v !== "function" &&
            !(v instanceof Window) &&
            !(v instanceof HTMLElement)
          ) {
            safeThis[k] = v;
          }
        }
      }

      const winClean = {
        ...safeWin,
        
        params: {
          ...safeParams,
          isRestored: true,
          this: safeThis
        }
      };

      // 4. Serializar de forma segura
      const serialized = JSON.parse(JSON.stringify(winClean));

      return [id, serialized];
    });

  return {
    activeTabId: state.activeTabId,
    winOrder: state.winOrder.filter((id) =>
      persistentEntries.some(([pid]) => pid === id)
    ),
    wins: persistentEntries,
    contexts: [] // reservado para futuro
  };
},

  // -------------------------------------------------------------------------
  // merge — Reconstructs the persisted state into live Zustand structures
  // -------------------------------------------------------------------------
  // This function is used when Fenestrae manually hydrates the store.
  // It rebuilds Maps and flags windows as "restored" so the UI layer can
  // adjust animations, focus behavior, or other restoration logic.
  //
  merge: (persistedState, currentState) => {
    if (!persistedState) return currentState;
    //console.log("merge",persistedState);

    const reconstructedWins = new Map(
      (persistedState.wins || []).map(([id, win]) => [
        id,
        {
          ...win,
          isRestored: true,
          params: { ...win.params, isRestored: true },
        },
      ])
    );

    const reconstructedContexts = new Map(
      Array.isArray(persistedState.contexts)
        ? persistedState.contexts
        : []
    );

    return {
      ...currentState,
      ...persistedState,
      wins: reconstructedWins,
      contexts: reconstructedContexts,
    };
  },

  // -------------------------------------------------------------------------
  // onRehydrateStorage — Called after manual hydration completes
  // -------------------------------------------------------------------------
  // This hook marks the store as hydrated. Fenestrae uses this flag to
  // coordinate UI initialization (e.g., restoring focus, animations, etc.).
  //
  onRehydrateStorage: () => (state) => {
    if (state) state.setHasHydrated(true);
  },
};
