// ============================================================================
// FENESTRAE - ZUSTAND PERSIST ADAPTER
// ============================================================================
// This module provides an IndexedDB adapter for Zustand Persist middleware.
//
// It implements the Storage interface required by Zustand's persist middleware,
// allowing Zustand to store and retrieve state from IndexedDB instead of
// localStorage.
//
// The adapter follows Fenestrae's enterprise architecture:
//   workspace → User → Session → Windows
//
// All data is isolated by session, ensuring that windows and their state
// are specific to each user session (tab).
// ============================================================================

import dbManagerInstance from "./dbManager";
import { createJSONStorage } from "zustand/middleware";
import { setWindow, delWindow, setSession } from "./persistence";
import {
  dbTable,
  STORE_SESSIONS,
  STORE_USERS,
  STORE_WINDOWS,
  STORE_WORKSPACES,
  STORE_CONTEXTS
} from "./dbTable";

// ============================================================================
// INDEXEDDB ADAPTER — Zustand Storage Interface
// ============================================================================
// RESPONSIBILITY:
//   - Implement the Storage interface required by Zustand's persist middleware
//   - Store and retrieve window state from IndexedDB
//   - Isolate state by session (tab)
//   - Maintain window order and active window state
//
// METHODS:
//   - getItem(key)     → Retrieve state for a given key
//   - setItem(key, value) → Store state for a given key
//   - removeItem(key)  → Remove state for a given key
//
// USAGE:
//   import { indexedDBStorage } from './persistAdapter';
//
//   const useStore = create(
//     persist(
//       (set) => ({ ... }),
//       {
//         name: 'wins',
//         storage: indexedDBStorage,
//       }
//     )
//   );
// ============================================================================

const indexedDBAdapter = {

  // -------------------------------------------------------------------------
  // GET ITEM — Retrieve window state from IndexedDB
  // -------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Read the current session's window data from IndexedDB
  //   - Restore window order and active window
  //   - Return state in the format expected by Zustand Persist

  

  //
  // STATE FORMAT:
  //   {
  //     state: {
  //       wins: [[winId, winData], ...],
  //       winOrder: [winId, ...],
  //       activeTabId: string | null
  //     }
  //   }
  //
  // IMPORTANT:
  //   - The session must already exist (the session ID is read from sessionStorage)
  //   - Windows are isolated by session (tab)
  //   - Windows that are not in the new state are deleted
  // ===========================================================================

  setItem: async (_, value) => {

    const sessionId = sessionStorage.getItem("fenestrae_session");
    const hydrated = sessionStorage.getItem("fenestrae_hydrated");
    if (!sessionId || hydrated !== "1") {
      return; // ← prevents Zustand from recreating the session
    }

    const parsed = JSON.parse(value);


    //console.log("parsed in setItem ",sessionId,parsed);

    const wins = parsed.state?.wins || [];
    const winOrder = parsed.state?.winOrder || [];
    const activeTabId = parsed.state?.activeTabId || null;

    const windowsStore = await dbTable(STORE_WINDOWS);

    // 1. Ventanas existentes
    const existingReq = windowsStore.index("sessionId").getAll(sessionId);
    const existingWins = await new Promise((resolve, reject) => {
      existingReq.onsuccess = () => resolve(existingReq.result || []);
      existingReq.onerror = () => reject(existingReq.error);
    });

    const newWinIds = wins.map(([winId]) => winId);


 
    // 2. Borrar ventanas eliminadas
    for (const oldWin of existingWins) {
      if (!newWinIds.includes(oldWin.winId)) {
        await delWindow(oldWin.winId);
      }
    }

    // 3. Crear/actualizar ventanas
    for (const [winId, winData] of wins) {
      await setWindow(winId, winData);
    }

    //console.log("setSession dentro de setItem:")
    // 4. Actualizar sesión
    await setSession({
      winOrder,
      activeWinId: activeTabId
    });
  },

  // -------------------------------------------------------------------------
  // REMOVE ITEM — Delete a single window
  // -------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Remove a window from IndexedDB
  //   - Also removes its associated context
  //
  // PARAMETERS:
  //   - winId: string — The ID of the window to delete
  //
  // IMPORTANT:
  //   - This only deletes the window, not the session
  //   - The window is removed from all stores (windows and contexts)
  // ===========================================================================

  removeItem: async (winId) => {
    await delWindow(winId);
  }
};

// ============================================================================
// EXPORT — Zustand Storage Instance
// ============================================================================
// This creates a storage instance that Zustand's persist middleware can use.
// It wraps the adapter with createJSONStorage to handle JSON serialization.
// ============================================================================

export const indexedDBStorage = createJSONStorage(() => indexedDBAdapter);