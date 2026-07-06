// ============================================================================
// FENESTRAE - STORAGE (core/storage.js)
// IndexedDB adapter for Zustand persist + backup session load.
// ============================================================================

import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { createJSONStorage } from 'zustand/middleware';
import dbManagerInstance from '../database/dbManager';
import { initialState, LAUNCHPAD_ID, LAUNCHPAD_WIN } from './constants';

const DB_STORE_NAME = 'windows';

// --- ADAPTADOR COMPATIBLE CON INDEXEDDB PARA ZUSTAND ---
const indexedDBAdapter = {
  getItem: async (name) => {
    await dbManagerInstance.init();
    const store = dbManagerInstance.getCustomStore(DB_STORE_NAME);
    const parsed = await idbGet(name, store);
    return JSON.stringify(parsed) || null;
  },
  setItem: async (name, value) => {
    await dbManagerInstance.init();
    const store = dbManagerInstance.getCustomStore(DB_STORE_NAME);
    await idbSet(name, JSON.parse(value), store);
  },
  removeItem: async (name) => {
    await dbManagerInstance.init();
    const store = dbManagerInstance.getCustomStore(DB_STORE_NAME);
    await idbDel(name, store);
  },
};

export const indexedDBStorage = createJSONStorage(() => indexedDBAdapter);

// --- CARGA DE SESIÓN DE RESPALDO DESDE localStorage ---
export const loadSavedState = () => {
  try {
    const saved = localStorage.getItem("erp_session_backup");
    if (!saved) return initialState;
    const parsed = JSON.parse(saved);
    return { ...initialState, ...parsed, wins: new Map(parsed.wins) };
  } catch (e) {
    console.error("Error cargando sesión de respaldo:", e);
    return initialState;
  }
};

// --- OPCIONES DE PERSISTENCIA PARA ZUSTAND ---
export const persistOptions = {
  name: 'erp_session_wins',
  storage: indexedDBStorage,

  // Only tabs and the launchpad are persisted
  partialize: (state) => {
    const persistentEntries = Array.from(state.wins.entries()).filter(
      ([id, w]) => w.type === "tab" || id === LAUNCHPAD_ID
    );
    return {
      activeTabId: state.activeTabId,
      winOrder: state.winOrder.filter(id => persistentEntries.some(([pid]) => pid === id)),
      wins: persistentEntries,
    };
  },

  // Rebuild the Map when hydrating from IndexedDB
  merge: (persistedState, currentState) => {
    if (!persistedState) return currentState;

    let reconstructedWins;
    if (persistedState.wins && Array.isArray(persistedState.wins)) {
      reconstructedWins = new Map(persistedState.wins);
    } else {
      reconstructedWins = new Map([[LAUNCHPAD_ID, LAUNCHPAD_WIN]]);
    }

    return {
      ...currentState,
      ...persistedState,
      wins: reconstructedWins,
    };
  },

  onRehydrateStorage: () => (state) => {
    if (state) state.setHasHydrated(true);
  },
};
