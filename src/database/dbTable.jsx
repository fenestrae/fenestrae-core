// ============================================================================
// FENESTRAE — DATABASE HELPERS
// ============================================================================
// This module provides helper functions for interacting with the IndexedDB
// database through the dbManager instance.
//
// It exports:
//   - Store name constants (STORE_*)
//   - A helper function to retrieve a store reference (dbTable)
//
// These helpers are used by the enterprise persistence layer to access
// the different stores without needing to know the underlying dbManager API.
// ============================================================================

import dbManagerInstance from "./dbManager";

// ============================================================================
// STORE NAMES — Constants for all IndexedDB stores
// ============================================================================
// These constants define the names of all stores used by Fenestrae.
// They are used as keys to access specific stores via dbTable().
//
// STORE_WINDOWS    → Stores window data (position, size, type, etc.)
// STORE_SESSIONS   → Stores session data (user, workgroup, window order, etc.)
// STORE_USERS      → Stores user data (userId, workgroupId)
// STORE_WORKGROUPS → Stores workgroup data (workgroupId)
// STORE_CONTEXTS   → Stores window context data (filters, scroll, drafts, etc.)
// ============================================================================

export const STORE_WINDOWS = "windows";
export const STORE_SESSIONS = "sessions";
export const STORE_USERS = "users";
export const STORE_WORKSPACES = "workspaces";
export const STORE_CONTEXTS = "window_contexts";

// ============================================================================
// dbTable — Retrieves an IndexedDB store reference
// ============================================================================
// RESPONSIBILITY:
//   - Ensures the dbManager is initialized.
//   - Returns a reference to the requested store.
//   - Provides a consistent API for accessing IndexedDB stores.
//
// USAGE:
//   const windowsStore = await dbTable(STORE_WINDOWS);
//   const session = await windowsStore.get(sessionId);
//
// PARAMETERS:
//   - storeName: string — The name of the store to access.
//                         Must be one of the STORE_* constants.
//
// RETURNS:
//   - Promise<IDBObjectStore | IDBObjectStoreWrapper> — A reference to the
//     requested store, ready for read/write operations.
//
// IMPORTANT:
//   - This function must be called with await (it returns a Promise).
//   - The store reference returned is already wrapped by dbManager's
//     custom store handler, providing a consistent API for get(), put(),
//     delete(), getAll(), and index() methods.
//   - Do NOT call this function before dbManager is initialized; it will
//     automatically initialize it.
//
// EXAMPLE:
//   const usersStore = await dbTable(STORE_USERS);
//   await usersStore.put({ userId: "office::john", workgroupId: "office" });
//
//   const sessionsStore = await dbTable(STORE_SESSIONS);
//   const allSessions = await sessionsStore.getAll();
// ============================================================================

export async function dbTable(storeName) {
  // Ensure the dbManager is initialized before accessing any store.
  // The dbManager handles connection management and version upgrades.
  await dbManagerInstance.init();

  // Return the custom store handler for the requested store.
  // This handler provides a consistent API across all stores.
  return dbManagerInstance.getCustomStore(storeName);
}

// ============================================================================
// dbMultiTable — Retrieve multiple IndexedDB object stores in a single transaction
// ============================================================================
// RESPONSIBILITY:
//   dbMultiTable encapsulates the creation of a single IndexedDB transaction
//   that spans multiple object stores. This allows Fenestrae to perform
//   multi‑store operations (e.g., reading windows + session metadata) in a
//   consistent, atomic, and safe manner.
//
//   IndexedDB requires that all object stores participating in a transaction
//   share the same transaction mode ("readonly" or "readwrite"). This helper
//   abstracts that rule and provides a clean API for enterprise‑grade
//   multi‑store operations.
//
// WHY THIS FUNCTION EXISTS:
//   - Prevents "TransactionInactiveError" / "The transaction has finished"
//     errors caused by accessing object stores outside their transaction.
//   - Ensures that all stores are accessed within the same active transaction.
//   - Provides a unified, predictable API for complex read/write operations.
//   - Avoids direct imports of dbManagerInstance across the codebase.
//   - Makes restoreWindows(), hydration, and persistence logic stable.
//
// USAGE EXAMPLES:
//
//   // Read-only multi-store access (session + windows)
//   const { windows, sessions } = await dbMultiTable(
//     [STORE_WINDOWS, STORE_SESSIONS],
//     "readonly"
//   );
//
//   const req = windows.index("sessionId").getAll(sessionId);
//
//   // Read-write multi-store access (saving windows + updating session)
//   const { windows, sessions } = await dbMultiTable(
//     [STORE_WINDOWS, STORE_SESSIONS],
//     "readwrite"
//   );
//
// PARAMETERS:
//   - storeNames: string[]
//       A list of object store names to open inside the same transaction.
//       Must be a non-empty array.
//
//   - mode: "readonly" | "readwrite"
//       The transaction mode. Defaults to "readonly".
//       All stores in the transaction will share this mode.
//
// RETURNS:
//   - Promise<Record<string, IDBObjectStore>>
//       An object whose keys match the requested store names and whose values
//       are the corresponding IDBObjectStore instances bound to the same
//       active transaction.
//
// IMPORTANT NOTES:
//   - All stores returned are tied to the SAME transaction.
//   - The transaction remains active as long as requests are pending.
//   - Do NOT store these object stores for later use; they are only valid
//     during the lifetime of the transaction.
//   - This function guarantees that dbManagerInstance is initialized before
//     accessing the database.
// ============================================================================

export async function dbMultiTable(storeNames = [], mode = "readonly") {
  if (!Array.isArray(storeNames) || storeNames.length === 0) {
    throw new Error("dbMultiTable: storeNames must be a non-empty array");
  }

  // Ensure the database is initialized before creating a transaction.
  await dbManagerInstance.init();

  // Create a single transaction for all requested stores.
  const db = await dbManagerInstance.getDB();
  const tx = db.transaction(storeNames, mode);

  // Build an object mapping each store name to its objectStore instance.
  const stores = {};
  for (const name of storeNames) {
    stores[name] = tx.objectStore(name);
  }

  return stores;
}
