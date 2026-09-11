// ============================================================================
// FENESTRAE - CONSTANTS (core/constants.js)
// ============================================================================
// Domain identifiers shared across persistence, sessionStorage and UI.
// Composite IDs always use ID_SEPARATOR so userId / contextId / launchpad
// physical IDs stay in the same protocol.
// ============================================================================

export const LAUNCHPAD_LOGICAL_ID = "LAUNCHPAD";

export const ROOT_PARENT_ID = "0";

export const ID_SEPARATOR = "::";

export const CONTEXT_KEY_LEGACY = "legacy";

export const CONTEXT_DEBOUNCE_MS = 500;

export const PERSIST_DEBOUNCE_MS = 300;

export const STORAGE_KEYS = {
  USER: "fenestrae_user",
  WORKSPACE: "fenestrae_workspace",
  SESSION: "fenestrae_session",
  HYDRATED: "fenestrae_hydrated",
  LAUNCHPAD_ID: "fenestrae_launchpadId",
  PERMISSIONS: "fenestrae_permissions",
};

export const HYDRATION_STATE = {
  PENDING: "0",
  READY: "1",
};

export function buildUserId(workspace, user) {
  return `${workspace}${ID_SEPARATOR}${user}`;
}

export function buildContextId(sessionId, winId, key) {
  return `${sessionId}${ID_SEPARATOR}${winId}${ID_SEPARATOR}${key}`;
}

export function buildLegacyContextId(winId, key = CONTEXT_KEY_LEGACY) {
  return `${winId}${ID_SEPARATOR}${key}`;
}

export function buildLaunchpadPhysicalId(uniqueId) {
  return `${LAUNCHPAD_LOGICAL_ID}${ID_SEPARATOR}${uniqueId}`;
}

export const initialState = {
  wins: new Map(),
  winOrder: [],
  activeTabId: null,
  activeWinId: null,
  context: new Map(),
  cache: new Map(),
  user: null,
};
