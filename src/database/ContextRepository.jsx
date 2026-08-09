// ============================================================================
// FENESTRAE — ContextRepository Empresarial (v2)
// Windows → Context Keys
// contextId = winId::key
//
// PURPOSE:
//   This repository provides granular, per‑window persistence for UI state.
//   Each window (winId) can store multiple independent context keys such as
//   scroll positions, filters, form drafts, active tabs, etc.
//
//   Contexts are stored in IndexedDB inside the STORE_CONTEXTS table.
//   Each context entry is uniquely identified by:
//
//       contextId = `${winId}::${key}`
//
//   This design ensures:
//     • Fast lookup of individual context keys
//     • Efficient deletion of all contexts for a window
//     • Clean separation between windows and sessions
//     • Enterprise‑grade restoration of UI state
// ============================================================================

import { dbTable, STORE_CONTEXTS } from "./dbTable";

class ContextRepository {
  constructor() {
    // Cache for fast in‑memory reads (avoids IndexedDB round‑trips)
   

    // Debounce timers for delayed writes
    this.pending = new Map();

    // Values waiting to be written after debounce delay
    this.pendingValues = new Map();
  }

  // -------------------------------------------------------------------------
  // buildContextId
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Generates the unique identifier for a context entry.
  //   The identifier combines the window ID and the context key.
  //
  // RETURNS:
  //   A string in the format: "winId::key"
  // -------------------------------------------------------------------------
  buildContextId(winId, key) {
    return `${winId}::${key}`;
  }

  // -------------------------------------------------------------------------
  // save
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Saves a context value immediately into IndexedDB.
  //   Also updates the in‑memory cache for faster future reads.
  //
  // PARAMETERS:
  //   winId  → Window identifier
  //   key    → Context key name
  //   value  → Any serializable value
  //
  // BEHAVIOR:
  //   - Writes the context object to STORE_CONTEXTS
  //   - Overwrites existing values for the same contextId
  // -------------------------------------------------------------------------
  async save(winId, key, value) {
    const contextId = this.buildContextId(winId, key);

    const store = await dbTable(STORE_CONTEXTS);

    await store.put({
      contextId,
      winId,
      key,
      value
    });
  }

  // -------------------------------------------------------------------------
  // saveDebounced
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Saves a context value with debounce.
  //   Useful for high‑frequency updates (scroll, typing, resizing).
  //
  // PARAMETERS:
  //   winId  → Window identifier
  //   key    → Context key name
  //   value  → Value to persist
  //   delay  → Debounce delay in milliseconds (default: 500ms)
  //
  // BEHAVIOR:
  //   - Cancels previous pending writes for the same contextId
  //   - Schedules a new write after the delay
  //   - Ensures IndexedDB is not spammed with rapid writes
  // -------------------------------------------------------------------------
  saveDebounced(winId, key, value, delay = 500) {
    const contextId = this.buildContextId(winId, key);

    this.pendingValues.set(contextId, value);

    const timer = this.pending.get(contextId);
    if (timer) clearTimeout(timer);

    this.pending.set(
      contextId,
      setTimeout(async () => {
        const finalValue = this.pendingValues.get(contextId);
        this.pending.delete(contextId);
        this.pendingValues.delete(contextId);
        await this.save(winId, key, finalValue);
      }, delay)
    );
  }

  // -------------------------------------------------------------------------
  // flush
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Cancels all pending debounced writes.
  //   Useful when closing a window or shutting down the application.
  // -------------------------------------------------------------------------
  async flush() {
    Array.from(this.pending.values()).forEach(clearTimeout);
    this.pending.clear();
  }

  // -------------------------------------------------------------------------
  // load
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Loads a context value from cache or IndexedDB.
  //
  // PARAMETERS:
  //   winId         → Window identifier
  //   key           → Context key name
  //   defaultValue  → Value returned if the context does not exist
  //
  // BEHAVIOR:
  //   - Returns cached value if available
  //   - Otherwise reads from IndexedDB
  //   - Stores the result in cache for future fast access
  // -------------------------------------------------------------------------
  async load(winId, key, defaultValue = null) {
    const contextId = this.buildContextId(winId, key);


    const store = await dbTable(STORE_CONTEXTS);
    const req = store.get(contextId);

    return await new Promise((resolve, reject) => {
      req.onsuccess = () => {
        const value = req.result?.value ?? defaultValue;
      //  console.log("Load datos Form",value);
        resolve(value);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Deletes a single context key for a window.
  //
  // PARAMETERS:
  //   winId  → Window identifier
  //   key    → Context key name
  //
  // BEHAVIOR:
  //   - Removes the entry from cache
  //   - Removes the entry from IndexedDB
  // -------------------------------------------------------------------------
  async remove(winId, key) {
    const contextId = this.buildContextId(winId, key);

    const store = await dbTable(STORE_CONTEXTS);
    await store.delete(contextId);
  }

  // -------------------------------------------------------------------------
  // clearWindow
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Deletes ALL context keys associated with a window.
  //
  // PARAMETERS:
  //   winId → Window identifier
  //
  // BEHAVIOR:
  //   - Uses the "winId" index to fetch all related contexts
  //   - Deletes each context entry
  //   - Clears cache entries for the window
  //
  // USE CASES:
  //   - Closing a window
  //   - Destroying a session
  //   - Resetting UI state
  // -------------------------------------------------------------------------
  async clearWindow(winId) {
    const store = await dbTable(STORE_CONTEXTS);
    const req = store.index("winId").getAll(winId);

    const ctxs = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    for (const c of ctxs) {
      await store.delete(c.contextId);
   
    }
  }

  // -------------------------------------------------------------------------
  // getWindowContexts
  // -------------------------------------------------------------------------
  // PURPOSE:
  //   Retrieves ALL context keys and values for a window.
  //
  // PARAMETERS:
  //   winId → Window identifier
  //
  // RETURNS:
  //   An object shaped like:
  //     {
  //       scroll: 120,
  //       filters: { city: "Madrid" },
  //       draft: { name: "John" },
  //       tab: "details"
  //     }
  //
  // USE CASES:
  //   - Restoring a window after reload
  //   - Rebuilding UI state
  //   - Debugging window persistence
  // -------------------------------------------------------------------------
  async getWindowContexts(winId) {
    const store = await dbTable(STORE_CONTEXTS);
    const req = store.index("winId").getAll(winId);

    const ctxs = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    const result = {};
    for (const c of ctxs) {
      result[c.key] = c.value;
    }

    return result;
  }
}

export const contextRepository = new ContextRepository();
