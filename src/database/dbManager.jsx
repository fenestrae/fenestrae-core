// ============================================================================
// FENESTRAE - DB MANAGER v2 (FINAL)
// Enterprise architecture: Workgroups → Users → Sessions → Windows
// ============================================================================
// This module manages the IndexedDB database for Fenestrae.
// It handles:
//   - Database creation and version upgrades
//   - Store creation and migration
//   - Connection management
//   - Store access via the getCustomStore() method
//
// The architecture follows a clear hierarchy:
//   Workgroup (empresa) → User (operario) → Session (pestaña) → Windows (ventanas)
// ============================================================================

export const DB_NAME = "fenestraedb";
export const DB_VERSION = 2;

// ============================================================================
// DBManager Class — Main database management class
// ============================================================================
// RESPONSIBILITY:
//   - Open and manage the IndexedDB connection
//   - Handle version upgrades and migrations
//   - Create and manage object stores
//   - Provide access to stores via getCustomStore()
//   - Handle connection conflicts and version changes
//
// USAGE:
//   const dbManager = new DBManager(DB_NAME, DB_VERSION);
//   await dbManager.init();
//   const store = dbManager.getCustomStore(STORE_WINDOWS);
//   await store.put({ ... });
// ============================================================================

class DBManager {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.isUpgrading = false;
  }

  // ---------------------------------------------------------------------------
  // INIT — Initialize database connection
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Open the database connection
  //   - Handle version upgrades if needed
  //   - Return a reference to the database
  //
  // RETURNS:
  //   - Promise<IDBDatabase> — A reference to the opened database
  //
  // IMPORTANT:
  //   - If the database is already open, returns the existing connection
  //   - Waits for other connections before opening
  //   - Handles blocked connections with a user prompt
  // ============================================================================

  async init() {
    if (this.db) return this.db;

    await this.waitForOtherConnections();

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        this.isUpgrading = true;
        const db = event.target.result;
        const oldVersion = event.oldVersion;

        console.log(`[DB] Migrating from version ${oldVersion} to ${this.version}`);

        if (oldVersion < 1) {
          this.createStoresV1(db);
        }
        if (oldVersion < 2) {
          this.createStoresV2(db);
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isUpgrading = false;

        this.db.onversionchange = () => this.handleVersionChange();

        resolve(this.db);
      };

      request.onerror = (event) => {
        this.isUpgrading = false;
        reject(event.target.error);
      };

      request.onblocked = () => this.handleBlocked();
    });
  }

    async getDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // ---------------------------------------------------------------------------
  // VERSION 1 — Legacy stores (deprecated)
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Create stores used in version 1 of Fenestrae
  //   - These stores are now deprecated and will be removed in future versions
  //
  // STORES CREATED:
  //   - "main"     → legacy main store
  //   - "session"  → legacy session store (will be deleted in v2)
  //   - "contexts" → legacy contexts store
  // ============================================================================

  createStoresV1(db) {
    const stores = ["main", "session", "contexts"];

    stores.forEach((name) => {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name);
        console.log(`[DB] Store '${name}' created (v1).`);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // VERSION 2 — Enterprise architecture stores (current)
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Create all stores for the enterprise architecture
  //   - Set up indices for efficient queries
  //   - Remove legacy stores
  //
  // STORES CREATED:
  //   - "workgroups"      → business groups (keyPath: workgroupId)
  //   - "users"           → users (keyPath: userId, index: workgroupId)
  //   - "sessions"        → user sessions (keyPath: sessionId, indices: userId, workgroupId)
  //   - "windows"         → windows (keyPath: winId, indices: sessionId, userId, workgroupId)
  //   - "window_contexts" → window contexts (keyPath: contextId, indices: winId, sessionId, userId, workgroupId)
  //   - "zustand"         → Zustand persistence (keyPath: key)
  //
  // STORES REMOVED:
  //   - "session" (legacy, replaced by "sessions")
  // ============================================================================
createStoresV2(db) {

  // 1. WORKSPACES (antes workgroups)
  if (!db.objectStoreNames.contains("workspaces")) {
    db.createObjectStore("workspaces", { keyPath: "workspaceId" });
    console.log("[DB] Store 'workspaces' created (v2).");
  }

  // 2. USERS
  if (!db.objectStoreNames.contains("users")) {
    const store = db.createObjectStore("users", { keyPath: "userId" });
    store.createIndex("workspaceId", "workspaceId", { unique: false });
    console.log("[DB] Store 'users' created (v2).");
  }

  // 3. SESSIONS
  if (!db.objectStoreNames.contains("sessions")) {
    const store = db.createObjectStore("sessions", { keyPath: "sessionId" });

    store.createIndex("workspaceId", "workspaceId", { unique: false });
    store.createIndex("userId", "userId", { unique: false });

    console.log("[DB] Store 'sessions' created (v2).");
  }

  // 4. WINDOWS
  if (!db.objectStoreNames.contains("windows")) {
    const store = db.createObjectStore("windows", { keyPath: "winId" });

    store.createIndex("sessionId", "sessionId", { unique: false });
    store.createIndex("workspaceId", "workspaceId", { unique: false });
    store.createIndex("userId", "userId", { unique: false });

    console.log("[DB] Store 'windows' created (v2).");
  }

  // 5. WINDOW CONTEXTS (solo sessionId + winId + key)
  if (!db.objectStoreNames.contains("window_contexts")) {
    const store = db.createObjectStore("window_contexts", { keyPath: "contextId" });

    store.createIndex("sessionId", "sessionId", { unique: false });
    store.createIndex("winId", "winId", { unique: false });
    store.createIndex("key", "key", { unique: false });

    console.log("[DB] Store 'window_contexts' created (v2).");
  }

  // 6. ZUSTAND
  if (!db.objectStoreNames.contains("zustand")) {
    db.createObjectStore("zustand", { keyPath: "key" });
    console.log("[DB] Store 'zustand' created (v2).");
  }

  // 7. Remove legacy store
  if (db.objectStoreNames.contains("session")) {
    db.deleteObjectStore("session");
    console.log("[DB] Store 'session' removed (v2).");
  }
}


  // ---------------------------------------------------------------------------
  // waitForOtherConnections — Wait before opening database
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Wait 300ms to allow other connections to close
  //   - Prevents race conditions during database upgrades
  // ============================================================================

  async waitForOtherConnections() {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // ---------------------------------------------------------------------------
  // handleVersionChange — Handle database version changes
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Close the current connection
  //   - Reload the page to apply changes
  //   - Log a warning for debugging
  // ============================================================================

  handleVersionChange() {
    console.warn("[DB] Version changed, closing connection...");
    if (this.db) this.db.close();
    setTimeout(() => window.location.reload(), 100);
  }

  // ---------------------------------------------------------------------------
  // handleBlocked — Handle blocked database connection
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Prompt the user to close other tabs
  //   - Reload the page if the user confirms
  // ============================================================================

  handleBlocked() {
    const userConfirmed = window.confirm(
      "The application needs to be updated. Close other tabs?"
    );
    if (userConfirmed) window.location.reload();
  }

  // ---------------------------------------------------------------------------
  // close — Close the database connection
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Close the current connection
  //   - Nullify the database reference
  // ============================================================================

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // ---------------------------------------------------------------------------
  // getCustomStore — Get a native IndexedDB store reference
  // ---------------------------------------------------------------------------
  // RESPONSIBILITY:
  //   - Return a reference to a specific object store
  //   - Create a read-write transaction
  //   - Provide direct access to IDBObjectStore methods
  //
  // USAGE:
  //   const store = dbManager.getCustomStore(STORE_WINDOWS);
  //   await store.put({ winId: "...", ... });
  //   const result = await store.get("winId");
  //
  // RETURNS:
  //   - IDBObjectStore — Native IndexedDB object store reference
  //
  // IMPORTANT:
  //   - The returned store is only valid for the current transaction
  //   - All operations on the store are synchronous when using IDBRequest
  //   - Use async/await with Promises for proper error handling
  // ============================================================================

  getCustomStore(storeName) {
    if (!this.db) {
      throw new Error("DB not initialized. Call init() first.");
    }

    const tx = this.db.transaction(storeName, "readwrite");
    return tx.objectStore(storeName);
  }
}

// ============================================================================
// EXPORT — Singleton instance
// ============================================================================
// This is the only instance of DBManager used throughout the application.
// It ensures a single database connection is shared across all modules.
// ============================================================================

const dbManagerInstance = new DBManager(DB_NAME, DB_VERSION);
export default dbManagerInstance;