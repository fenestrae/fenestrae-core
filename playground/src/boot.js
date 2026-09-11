import { STORAGE_KEYS } from "../../src/core/constants";

export const OPERATORS = [
  { user: "pepe", workspace: "erp" },
  { user: "ana", workspace: "crm" },
];

export function hasRestorableSession() {
  return Boolean(
    sessionStorage.getItem(STORAGE_KEYS.USER) &&
    sessionStorage.getItem(STORAGE_KEYS.WORKSPACE) &&
    sessionStorage.getItem(STORAGE_KEYS.SESSION),
  );
}

export function readOperator() {
  return {
    user: sessionStorage.getItem(STORAGE_KEYS.USER) || "",
    workspace: sessionStorage.getItem(STORAGE_KEYS.WORKSPACE) || "",
    sessionId: sessionStorage.getItem(STORAGE_KEYS.SESSION) || "",
  };
}

export function readStoredPermissions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const DEFAULT_PERMISSIONS = ["clients.read", "clients.write", "lab.use"];
