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

import { createJSONStorage } from "zustand/middleware";
import { setWindow, delWindow, setSession } from "./persistence";
import {
  dbTable,
  STORE_WINDOWS,
} from "./dbTable";
import { STORAGE_KEYS, HYDRATION_STATE, PERSIST_DEBOUNCE_MS } from "../core/constants";

let persistTimer = null;
let queuedKey = null;
let queuedValue = null;
let pendingResolvers = [];
let writeToken = 0;
let lastWritten = emptySnapshot();

function emptySnapshot() {
  return {
    sessionId: null,
    knownIds: null,
    winPayloads: new Map(),
    winOrder: null,
    activeTabId: null,
  };
}

function settleWaiters(error) {
  const waiters = pendingResolvers;
  pendingResolvers = [];
  if (error) waiters.forEach(({ reject }) => reject(error));
  else waiters.forEach(({ resolve }) => resolve());
}

export function cancelPersistWrites() {
  writeToken += 1;
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  queuedKey = null;
  queuedValue = null;
  lastWritten = emptySnapshot();
  settleWaiters();
}

export async function flushPersistWrites() {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  if (queuedValue == null) return;
  const key = queuedKey;
  const value = queuedValue;
  queuedKey = null;
  queuedValue = null;
  try {
    await persistWindows(key, value);
    settleWaiters();
  } catch (error) {
    settleWaiters(error);
    throw error;
  }
}

function schedulePersist(key, value) {
  queuedKey = key;
  queuedValue = value;
  return new Promise((resolve, reject) => {
    pendingResolvers.push({ resolve, reject });
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      flushPersistWrites().catch(() => {});
    }, PERSIST_DEBOUNCE_MS);
  });
}

async function persistWindows(_, value) {
  const token = writeToken;
  const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
  const hydrated = sessionStorage.getItem(STORAGE_KEYS.HYDRATED);
  if (!sessionId || hydrated !== HYDRATION_STATE.READY) {
    return;
  }

  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  const wins = parsed.state?.wins || [];
  const winOrder = parsed.state?.winOrder || [];
  const activeTabId = parsed.state?.activeTabId || null;
  const newIds = new Set(wins.map(([winId]) => winId));

  let existingIds = lastWritten.knownIds;
  if (!existingIds || lastWritten.sessionId !== sessionId) {
    const windowsStore = await dbTable(STORE_WINDOWS);
    if (token !== writeToken) return;
    const existingReq = windowsStore.index("sessionId").getAll(sessionId);
    const existingWins = await new Promise((resolve, reject) => {
      existingReq.onsuccess = () => resolve(existingReq.result || []);
      existingReq.onerror = () => reject(existingReq.error);
    });
    if (token !== writeToken) return;
    existingIds = new Set(existingWins.map((w) => w.winId));
  }

  for (const oldId of existingIds) {
    if (newIds.has(oldId)) continue;
    await delWindow(oldId);
    lastWritten.winPayloads.delete(oldId);
    if (token !== writeToken) return;
  }

  for (const [winId, winData] of wins) {
    const payload = JSON.stringify(winData);
    if (lastWritten.winPayloads.get(winId) === payload) continue;
    await setWindow(winId, winData);
    if (token !== writeToken) return;
    lastWritten.winPayloads.set(winId, payload);
  }

  const orderKey = JSON.stringify(winOrder);
  if (lastWritten.winOrder !== orderKey || lastWritten.activeTabId !== activeTabId) {
    await setSession({
      winOrder,
      activeWinId: activeTabId,
    });
    if (token !== writeToken) return;
    lastWritten.winOrder = orderKey;
    lastWritten.activeTabId = activeTabId;
  }

  lastWritten.sessionId = sessionId;
  lastWritten.knownIds = newIds;
}

const indexedDBAdapter = {
  setItem: (key, value) => {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    const hydrated = sessionStorage.getItem(STORAGE_KEYS.HYDRATED);
    if (!sessionId || hydrated !== HYDRATION_STATE.READY) {
      return Promise.resolve();
    }
    return schedulePersist(key, value);
  },

  removeItem: async (winId) => {
    await delWindow(winId);
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushPersistWrites().catch(() => {});
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushPersistWrites().catch(() => {});
    }
  });
}

export const indexedDBStorage = createJSONStorage(() => indexedDBAdapter);
