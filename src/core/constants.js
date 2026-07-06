// ============================================================================
// FENESTRAE - CONSTANTS (core/constants.js)
// ============================================================================

export const LAUNCHPAD_ID = "root-launchpad";

export const LAUNCHPAD_WIN = {
  id: LAUNCHPAD_ID,
  type: "tab",
  name: "launchpad",
  title: "Inicio",
  path: "/",
  state: "normal",
  closable: false,
  zIndex: 100,
  uniqueKey: "launchpad-root",
  params: {},
  visible: true,
  logoUrl: "",
};

export const initialState = {
  wins: new Map([[LAUNCHPAD_ID, LAUNCHPAD_WIN]]),
  winOrder: [LAUNCHPAD_ID],
  activeTabId: LAUNCHPAD_ID,
  activeWinId: LAUNCHPAD_ID,
  cache: new Map(),
  user: null,
};
