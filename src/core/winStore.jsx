// ============================================================================
// FENESTRAE - CORE WINDOWS STORE (core/store.js)
// Gestión Avanzada de Ventanas Empresariales React (Tab, Modal, Float, Ext...)
// Autor: Toni Raventós - Barcelona
// Licencia: Apache-2.0
// ============================================================================

import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { enableMapSet } from "immer";

import { initialState, LAUNCHPAD_ID } from './constants';
import { loadSavedState, persistOptions } from './storage';
import { createLifecycleSlice } from './slices/lifecycle';
import { createLayoutSlice } from './slices/layout';
import { createFocusSlice } from './slices/focus';
import { createApiSlice } from './slices/api';
import { createMiscSlice } from './slices/misc';

enableMapSet();

export { LAUNCHPAD_ID };
export { externalWindowInstances } from './slices/lifecycle';
export { formsRegistry } from './slices/misc';
export { getStandardLayout } from './geometry';

// ============================================================================
// STORE CENTRAL
// ============================================================================
export const winStore = create(
  persist(
    (set, get) => ({
      // Estado base (con sesión de respaldo si existe)
      ...initialState,
      ...loadSavedState(),
      _hasHydrated: false,

      // Slices compuestos
      ...createMiscSlice(set, get),
      ...createLifecycleSlice(set, get),
      ...createLayoutSlice(set, get),
      ...createFocusSlice(set, get),
      ...createApiSlice(set, get),
    }),
    persistOptions
  )
);
