import { createElement } from "react";
import { HYDRATION_STATE, STORAGE_KEYS } from "../core/constants";
import { externalWindowInstances, winStore } from "../core/winStore";
import { formsRegistry } from "../core/slices/misc";
import dbManager from "../database/dbManager";
import { contextRepository } from "../database/ContextRepository";
import { cancelPersistWrites } from "../database/indexedDBAdapter";
import { clearCommands } from "../menus/commandRegistry";
import { setPermissions } from "../permissions/permissions";

export function waitMs(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function idbRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function ensureDatabase() {
  await dbManager.init();
  return dbManager.getDB();
}

export async function clearAllStores() {
  const db = await ensureDatabase();
  const names = Array.from(db.objectStoreNames);
  if (names.length === 0) return;

  const tx = db.transaction(names, "readwrite");
  for (const name of names) {
    tx.objectStore(name).clear();
  }

  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

export function clearSessionStorage() {
  sessionStorage.clear();
  try {
    localStorage.removeItem("erp_session_backup");
  } catch {
    // Node 22 exposes a partial localStorage without Storage.clear.
  }
}

export function setOperator({
  user = "pepe",
  workspace = "erp",
  sessionId = "",
  hydrated = false,
} = {}) {
  sessionStorage.setItem(STORAGE_KEYS.USER, user);
  sessionStorage.setItem(STORAGE_KEYS.WORKSPACE, workspace);
  sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionId);
  sessionStorage.setItem(
    STORAGE_KEYS.HYDRATED,
    hydrated ? HYDRATION_STATE.READY : HYDRATION_STATE.PENDING,
  );
}

export function resetRuntime() {
  cancelPersistWrites();
  clearSessionStorage();
  setPermissions([]);
  clearCommands();
  formsRegistry.clear();
  externalWindowInstances.clear();
  winStore.setState({
    ...winStore.getState(),
    wins: new Map(),
    winOrder: [],
    activeTabId: null,
    activeWinId: null,
    cache: new Map(),
    user: null,
    hasHydrated: false,
  });

  if (contextRepository.pending) {
    Array.from(contextRepository.pending.values()).forEach(clearTimeout);
    contextRepository.pending.clear();
  }
  if (contextRepository.pendingValues) {
    contextRepository.pendingValues.clear();
  }
  if (contextRepository.cache) {
    contextRepository.cache.clear();
  }
}

export async function resetPersistence() {
  resetRuntime();
  await clearAllStores();
}

export function registerDummy(name = "frmcustomers", Component = DummyForm) {
  winStore.getState().register({
    [name]: { component: Component, options: { title: name.toUpperCase(), path: `/${name}` } },
  });
}

export function DummyForm() {
  return createElement("div", null, "dummy-form");
}

export async function eventually(fn, { timeout = 1000, interval = 15 } = {}) {
  const start = Date.now();
  let lastError;

  while (Date.now() - start < timeout) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      await waitMs(interval);
    }
  }

  throw lastError;
}
