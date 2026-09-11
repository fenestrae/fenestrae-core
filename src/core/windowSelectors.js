// ============================================================================
// FENESTRAE - WINDOW SELECTORS (core/windowSelectors.js)
// Derived lists for Zustand subscriptions. Returning arrays of window
// references lets useShallow skip renders when Immer keeps unchanged
// window objects identical.
// ============================================================================

import { WIN_TYPES } from "../store/types";

export function selectTabs(wins) {
  const tabs = [];
  for (const w of wins.values()) {
    if (w.type === WIN_TYPES.TAB) tabs.push(w);
  }
  return tabs;
}

export function selectOrderedByType(wins, winOrder, type) {
  const list = [];
  for (const id of winOrder) {
    const w = wins.get(id);
    if (w && !w.fixed && w.type === type) list.push(w);
  }
  return list;
}

export function selectFloatingTops(wins, winOrder) {
  const list = [];
  for (const id of winOrder) {
    const w = wins.get(id);
    if (w && w.type === WIN_TYPES.TOP && !w.fixed && !w.docked) list.push(w);
  }
  return list;
}

export function selectFixedByZone(wins, zone) {
  const list = [];
  for (const w of wins.values()) {
    if (w.fixed && w.fixedZone === zone) list.push(w);
  }
  return list;
}

export function selectDockedInZone(wins, zone) {
  const list = [];
  for (const w of wins.values()) {
    if (w.docked && w.dockZone === zone) list.push(w);
  }
  return list;
}

export function selectDockedZones(wins) {
  const zones = { top: false, left: false, right: false, bottom: false };
  for (const w of wins.values()) {
    if (w.docked && Object.prototype.hasOwnProperty.call(zones, w.dockZone)) {
      zones[w.dockZone] = true;
    }
  }
  return zones;
}
