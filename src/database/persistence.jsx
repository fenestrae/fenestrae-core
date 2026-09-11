/**
 * ============================================================================
 * IMPORTANT NOTE ABOUT sessionStorage AND RELOADS (F5)
 * ============================================================================
 * Fenestrae uses sessionStorage to store (see STORAGE_KEYS):
 *   - USER      → logical operator user
 *   - WORKSPACE → business workspace
 *   - SESSION   → active session selected by the operator
 *
 * This design is INTENTIONAL and addresses a critical behavior:
 *
 *   ➤ Pressing F5 (reloading the page) **DOES NOT clear sessionStorage**
 *   ➤ Pressing F5 **DOES NOT clear the active session**
 *   ➤ Pressing F5 **DOES NOT clear the user**
 *   ➤ Pressing F5 **DOES NOT clear the workspace**
 *
 * This allows:
 *   - The operator to reload the application without losing their business session.
 *   - Zustand Persist to automatically rebuild the workspace.
 *   - IndexedDB to keep all windows and contexts intact.
 *   - The experience to be identical to an ERP or enterprise operating system.
 *
 * When is sessionStorage cleared?
 *   - When closing the browser tab.
 *   - When closing the browser completely.
 *   - When opening a new tab (sessionStorage is not shared between tabs).
 *
 * Why do we NOT use localStorage?
 *   - localStorage persists across browser closures → mixes users.
 *   - localStorage persists across workspaces → mixes contexts.
 *   - localStorage does not respect tab isolation → breaks the architecture.
 *
 * Conclusion:
 *   sessionStorage is the correct choice to maintain the operator's business
 *   identity throughout the tab's lifecycle, allowing reloads without state loss
 *   and ensuring isolation between work sessions.
 * ============================================================================
 */


/**
 * ============================================================================
 * FENESTRAE — ENTERPRISE PERSISTENCE LAYER
 * ============================================================================
 * This module implements Fenestrae's enterprise persistence layer.
 * Manages:
 *   - workspaces
 *   - Users
 *   - Sessions
 *   - Windows
 *   - Window contexts
 *
 * This layer does NOT interact with Zustand directly.
 * This layer does NOT create windows or contexts automatically.
 * This layer does NOT select sessions.
 *
 * Its responsibility is exclusively:
 *   - Register enterprise entities in IndexedDB
 *   - Query enterprise data
 *   - Create, update, and delete sessions
 *   - Delete windows and contexts associated with sessions
 *
 * It is the foundation of the Fenestrae enterprise operating system.
 * ============================================================================
 */

import {
    dbTable,
    dbMultiTable,
    STORE_SESSIONS,
    STORE_USERS,
    STORE_WINDOWS,
    STORE_WORKSPACES,
    STORE_CONTEXTS
} from "./dbTable";
import { winStore } from "../core"
import { sanitizePersistable, clearFenestraeSessionStorage } from "../lib/security";
import { setPermissions } from "../permissions/permissions";
import { v4 as uuidv4 } from "uuid";
import {
    STORAGE_KEYS,
    HYDRATION_STATE,
    CONTEXT_KEY_LEGACY,
    buildUserId,
    buildContextId,
    buildLegacyContextId,
    buildLaunchpadPhysicalId,
} from '../core/constants';
import { WIN_TYPES } from "../store/types";

function getCurrentOperator() {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    if (!user || !workspace) return null;
    return { user, workspace, userId: buildUserId(workspace, user) };
}


/**
 * ============================================================================
 * INIT — Enterprise operator initialization
 * ============================================================================
 * - Saves user and workspace to sessionStorage
 * - Registers user and workspace in IndexedDB (if they don't exist)
 * - Returns the number of active sessions for the operator
 *
 * Important:
 *   - Does NOT create a session
 *   - Does NOT select a session
 *   - Does NOT touch windows
 *   - Does NOT touch contexts
 * ============================================================================
 */
export const init = async ({ user, workspace }) => {
    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.PENDING);
    sessionStorage.setItem(STORAGE_KEYS.SESSION, "");
    //console.log("inicializacion");
    sessionStorage.setItem(STORAGE_KEYS.USER, user);
    sessionStorage.setItem(STORAGE_KEYS.WORKSPACE, workspace);

    const userId = buildUserId(workspace, user);

    // Registrar usuario y workspace
    const usersStore = await dbTable(STORE_USERS);
    const workspacesStore = await dbTable(STORE_WORKSPACES);

    await usersStore.put({ userId, workspaceId: workspace });
    await workspacesStore.put({ workspaceId: workspace });

    // Leer número de sesiones del operario usando la nueva función
    const sessions = await getSessionsByUserId(userId);

    return sessions.length;
};
/**
 * ============================================================================
 * getSessionsByUserId — Returns all sessions for an operator
 * ============================================================================
 * This function encapsulates the enterprise session reading from IndexedDB.
 *
 * RESPONSIBILITY:
 *   - Receives an enterprise userId (workspace::user)
 *   - Queries the STORE_SESSIONS table
 *   - Returns all sessions associated with that operator
 *
 * IMPORTANT:
 *   - Does not filter by workspace (already included in userId)
 *   - Does not touch windows
 *   - Does not touch contexts
 *   - Does not touch sessionStorage
 *
 * USAGE:
 *   const sessions = await getSessionsByUserId("office::pepe");
 *
 * RETURNS:
 *   Array of session objects:
 *   [
 *     {
 *       sessionId: "...",
 *       userId: "...",
 *       workspaceId: "...",
 *       winOrder: [...],
 *       activeWinId: "...",
 *       createdAt: "...",
 *       updatedAt: "..."
 *     },
 *     ...
 *   ]
 * ============================================================================
 */
export const getSessionsByUserId = async (userId) => {
    const sessionsStore = await dbTable(STORE_SESSIONS);
    const req = sessionsStore.index("userId").getAll(userId);

    return await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
};

/**
 * ============================================================================
 * getSessionsByUserAndWorkspace — Returns all sessions for a specific user+workspace
 * ============================================================================
 * RESPONSIBILITY:
 *   - Build enterprise userId (workspace::user)
 *   - Query STORE_SESSIONS by userId
 *   - Return all sessions for that operator in that workspace
 *
 * USAGE:
 *   const list = await getSessionsByUserAndWorkspace("pepe", "erp");
 *
 * RETURNS:
 *   Array of session objects
 * ============================================================================
 */
export const getSessionsByUserAndWorkspace = async (user, workspace) => {
    if (!user) throw new Error("getSessionsByUserAndWorkspace: user requerido");
    if (!workspace) throw new Error("getSessionsByUserAndWorkspace: workspace requerido");

    const userId = buildUserId(workspace, user);

    const sessionsStore = await dbTable(STORE_SESSIONS);
    const req = sessionsStore.index("userId").getAll(userId);

    return await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
};

/**
 * ============================================================================
 * getSessions — Returns all sessions for the operator
 * ============================================================================
 * - Filters by userId (workspace::user)
 * - Returns all active sessions for the operator
 * ============================================================================
 */
export const getSessions = async () => {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    const userId = buildUserId(workspace, user);

    const sessionsStore = await dbTable(STORE_SESSIONS);
    const req = sessionsStore.index("userId").getAll(userId);

    return await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
};

/**
 * ============================================================================
 * createNewSession — Creates a new enterprise session
 * ============================================================================
 * RESPONSIBILITY:
 *   - Generate a new sessionId
 *   - Register the session in IndexedDB
 *   - Register the active session in sessionStorage
 *
 * USAGE:
 *   const sessionId = await createNewSession(userId, workspace);
 *
 * ============================================================================
 */
export const createNewSession = async (userId = null, workspace = null) => {
    // 1. Leer valores del sessionStorage solo si no vienen como parámetros
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace_ok = workspace ?? sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);

    // 2. Validación fuerte
    if (!workspace_ok) {
        throw new Error("Workspace no definido: createNewSession requiere workspace o sessionStorage.fenestrae_workspace");
    }

    if (!user && !userId) {
        throw new Error("Usuario no definido: createNewSession requiere userId o sessionStorage.fenestrae_user");
    }

    // 3. Construcción del userId final
    const userId_ok = userId ?? buildUserId(workspace_ok, user);

    // 4. IndexedDB
    const sessionsStore = await dbTable(STORE_SESSIONS);

    const sessionId = crypto.randomUUID();
    const now = new Date().toISOString();

    await sessionsStore.put({
        sessionId,
        userId: userId_ok,
        workspaceId: workspace_ok,
        winOrder: [],
        activeWinId: null,
        createdAt: now,
        updatedAt: now
    });

    // 5. Registrar la sesión activa
    sessionStorage.setItem(STORAGE_KEYS.SESSION, sessionId);

    return sessionId;
};


/**
 * ============================================================================
 * activateSession — Activates an enterprise session
 * ============================================================================
 * RESPONSIBILITY:
 *   - Select the operator's active session.
 *   - Verify if the session exists in IndexedDB.
 *   - If it does not exist → create it automatically.
 *   - Register the active session in sessionStorage.
 *   - Allow the visual layer to rebuild the workspace.
 *
 * ============================================================================
 */
export const activateSession = async (sessionId) => {
    const operator = getCurrentOperator();
    if (!operator) {
        throw new Error("activateSession: no hay operador activo en sessionStorage");
    }

    const sessionsStore = await dbTable(STORE_SESSIONS);

    let finalSessionId = sessionId;

    if (!finalSessionId) {
        finalSessionId = await createNewSession(operator.userId, operator.workspace);
    } else {
        const req = sessionsStore.get(finalSessionId);
        const sessionData = await new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });

        if (!sessionData) {
            finalSessionId = await createNewSession(operator.userId, operator.workspace);
        } else {
            if (sessionData.userId !== operator.userId) {
                throw new Error("activateSession: la sesión no pertenece al operador actual");
            }
            sessionStorage.setItem(STORAGE_KEYS.SESSION, finalSessionId);
        }
    }

    return finalSessionId;
};

/**
 * ============================================================================
 * setSession — Updates the active enterprise session
 * ============================================================================
 * RESPONSIBILITY:
 *   - Save the enterprise information of the ACTIVE session:
 *       • winOrder        → window order
 *       • activeWinId     → active window
 *       • updatedAt       → update timestamp
 *
 * IMPORTANT:
 *   - The active session is ALWAYS retrieved from sessionStorage.
 *   - If there is no active session → the developer must call activateSession() first.
 *   - Does NOT create new sessions.
 *   - Does NOT activate sessions.
 *   - Does NOT touch windows.
 *   - Does NOT touch contexts.
 * ============================================================================
 */

export const setSession = async ({ winOrder = [], activeWinId = null } = {}) => {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);

    const userId = buildUserId(workspace, user);
    const sessionsStore = await dbTable(STORE_SESSIONS);

    // Si no existe sesión activa → crear una nueva
    if (!sessionId) {
        // sessionId = await createNewSession(userId, workspace);
        return;
    }
    //console.log("setSession", sessionId);
    const now = new Date().toISOString();

    await sessionsStore.put({
        sessionId,
        userId,
        workspaceId: workspace,
        winOrder,
        activeWinId,
        updatedAt: now
    });

    return sessionId;
};


export const closeSession = async () => {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);

    try {
        winStore.getState().closeAllWin(true);
    } catch { }

    if (sessionId) {
        try {
            await delSession(sessionId);
        } catch (err) {
            console.warn("[Fenestrae] closeSession: no se pudo borrar la sesión en IndexedDB", err);
        }
    }

    clearFenestraeSessionStorage();
    setPermissions([]);

    try {
        winStore.getState().resetStore();
    } catch { }
};


/**
 * ============================================================================
 * delSession — Deletes a complete enterprise session
 * ============================================================================
 * - Deletes the session
 * - Deletes all associated windows
 * - Deletes all associated contexts
 *
 * Important:
 *   - Does NOT touch other sessions
 *   - Does NOT touch other users
 * ============================================================================
 */

/**
 * ============================================================================
 * delSession — Deletes a complete enterprise session (atomic + multi-store)
 * ============================================================================
 * Uses dbMultiTable() to ensure all deletions occur inside ONE active
 * readwrite transaction, preventing TransactionInactiveError.
 *
 * Responsibilities:
 *   - Delete all windows belonging to the session
 *   - Delete all contexts belonging to those windows
 *   - Delete the session record itself
 *
 * Guarantees:
 *   - Atomic operation (all-or-nothing)
 *   - No orphaned windows
 *   - No orphaned contexts
 *   - No cross-session interference
 * ============================================================================
 */
export const delSession = async (sessionId, { force = false } = {}) => {

    if (!force) {
        const operator = getCurrentOperator();
        const peek = await dbTable(STORE_SESSIONS);
        const sessionData = await new Promise((resolve, reject) => {
            const req = peek.get(sessionId);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
        if (sessionData && (!operator || sessionData.userId !== operator.userId)) {
            throw new Error("delSession: la sesión no pertenece al operador actual");
        }
    }

    // ⭐ Open a single readwrite transaction for all required stores
    const stores = await dbMultiTable(
        [STORE_WINDOWS, STORE_SESSIONS, STORE_CONTEXTS],
        "readwrite"
    );

    //console.log("DelSession", sessionId);

    const windowsStore = stores[STORE_WINDOWS];
    const sessionsStore = stores[STORE_SESSIONS];
    const contextsStore = stores[STORE_CONTEXTS];

    // ---------------------------------------------------------------------------
    // 1. Retrieve all windows belonging to the session
    // ---------------------------------------------------------------------------
    const winReq = windowsStore.index("sessionId").getAll(sessionId);
    const wins = await new Promise((resolve, reject) => {
        winReq.onsuccess = () => resolve(winReq.result || []);
        winReq.onerror = () => reject(winReq.error);
    });

    // ---------------------------------------------------------------------------
    // 2. Delete each window + its contexts
    // ---------------------------------------------------------------------------
    for (const w of wins) {
        const winId = w.winId;

        // Delete window record
        windowsStore.delete(winId);

        const ctxReq = contextsStore.index("winId").getAll(winId);
        const ctxs = await new Promise((resolve, reject) => {
            ctxReq.onsuccess = () => resolve(ctxReq.result || []);
            ctxReq.onerror = () => reject(ctxReq.error);
        });

        ctxs
            .filter((c) => !c.sessionId || c.sessionId === sessionId)
            .forEach((c) => contextsStore.delete(c.contextId));
    }

    // ---------------------------------------------------------------------------
    // 3. Delete the session record
    // ---------------------------------------------------------------------------
    sessionsStore.delete(sessionId);

    // ---------------------------------------------------------------------------
    // 4. Wait for the transaction to complete
    // ---------------------------------------------------------------------------
    await new Promise((resolve, reject) => {
        const tx = windowsStore.transaction; // all stores share the same tx
        tx.oncomplete = resolve;
        tx.onerror = reject;
        tx.onabort = reject;
    });
};


/**
 * ============================================================================
 * clearSessions — Deletes ALL sessions for the operator
 * ============================================================================
 * - Deletes all sessions for the user
 * - Deletes all associated windows
 * - Deletes all associated contexts
 *
 * Important:
 *   - Does NOT delete the user
 *   - Does NOT delete the workspace
 * ============================================================================
 */

export const clearSessions = async () => {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    const userId = buildUserId(workspace, user);

    const sessionsStore = await dbTable(STORE_SESSIONS);
    const windowsStore = await dbTable(STORE_WINDOWS);

    // Leer todas las sesiones del usuario
    const req = sessionsStore.index("userId").getAll(userId);
    const sessions = await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });

    // Borrar ventanas y contextos de cada sesión
    for (const ses of sessions) {

        // 1. Obtener ventanas de la sesión
        const winReq = windowsStore.index("sessionId").getAll(ses.sessionId);
        const wins = await new Promise((resolve, reject) => {
            winReq.onsuccess = () => resolve(winReq.result || []);
            winReq.onerror = () => reject(winReq.error);
        });

        // 2. Borrar cada ventana con su contexto
        for (const w of wins) {
            await delWindow(w.winId);
        }

        // 3. Borrar la sesión
        await sessionsStore.delete(ses.sessionId);
    }
};


function sanitize(data) {
    return sanitizePersistable(data) || {};
}


/**
 * ============================================================================
 * setWindow — Creates or updates an enterprise window
 * ============================================================================
 * RESPONSIBILITY:
 *   - Register a window within the active session
 *   - Save its enterprise content (data)
 *
 * IMPORTANT:
 *   - Does not modify winOrder
 *   - Does not modify activeWinId
 *   - Does not touch the sessions table
 * ============================================================================
 */
export const setWindow = async (winId, data) => {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);

      if (!sessionId || sessionId === "null") {
     
        return;
    }

    const userId = buildUserId(workspace, user);
    const windowsStore = await dbTable(STORE_WINDOWS);

    await windowsStore.put({
        winId,
        sessionId,
        userId,
        workspaceId: workspace,
        data: sanitize(data)
    });
};



/**
 * ============================================================================
 * delWindow — Deletes an enterprise window
 * ============================================================================
 * RESPONSIBILITY:
 *   - Delete the window
 *   - Delete its associated context
 *
 * IMPORTANT:
 *   - Does not modify winOrder
 *   - Does not modify activeWinId
 *   - Does not touch the enterprise session
 * ============================================================================
 */

export const delWindow = async (winId) => {
    //console.log("delWindows", winId)
    const windowsStore = await dbTable(STORE_WINDOWS);
    const contextsStore = await dbTable(STORE_CONTEXTS);

    // 1. Borrar la ventana
    await windowsStore.delete(winId);

    // 2. Borrar todos los contextos asociados a la ventana
    const req = contextsStore.index("winId").getAll(winId);
    const ctxs = await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });

    for (const c of ctxs) {
        await contextsStore.delete(c.contextId);
    }
};


export async function restoreWindows(initialWinConfig) {
    let isnew=false;
    const data = await readSessionWindows();
    if (!data) return;

    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.PENDING);

    let winsArray = data.wins;
    let winOrder = data.winOrder;
    let activeTabId = data.activeTabId;

    // ⭐ Si la sesión NO tiene ventanas, insertar Launchpad con ID físico único
    if (winsArray.length === 0) {
        //console.log("restoreWindows: sesión vacía → inserto Launchpad");
         isnew=true;
        const physicalId = buildLaunchpadPhysicalId(uuidv4());

        // Guardar el ID físico del launchpad para esta sesión
        sessionStorage.setItem(STORAGE_KEYS.LAUNCHPAD_ID, physicalId);

        const launchpadWin = {
            id: physicalId,
            type: WIN_TYPES.TAB,
            launchpad: true,
            index: -1,
            title: initialWinConfig.title,
            path: initialWinConfig.path,
            name: initialWinConfig.name,
            params: {},
        };

        winsArray = [
            [physicalId, launchpadWin]
        ];

        winOrder = [physicalId];
        activeTabId = physicalId;
    } else {
        // Si la sesión ya tiene ventanas, recuperar el launchpadId
        const lp = winsArray.find(([id, win]) => win.launchpad);
        if (lp) {
            sessionStorage.setItem(STORAGE_KEYS.LAUNCHPAD_ID, lp[0]);
        }
    }

    winsArray.sort((a, b) => {
        const ia = a[1].index ?? 0;
        const ib = b[1].index ?? 0;
        return ia - ib;
    });

    //  winOrder reconstruido por índice
    winOrder = winsArray.map(([id]) => id);

    // Hidratar Zustand con el estado final
    winStore.setState({
        wins: new Map(winsArray),
        winOrder,
        activeTabId
    });

    // ⭐ Marcar hidratación después del render
    setTimeout(() => {
        winStore.setState({ hasHydrated: true });
    }, 0);
    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.READY);
    //console.log("Fenestrae: ventanas restauradas manualmente.", winsArray);
    return isnew;
}


export async function readSessionWindows() {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionId) return null;
    //console.log("readSessionWindows", sessionId);
    // ⭐ Obtener stores en una sola transacción
    const {
        [STORE_WINDOWS]: windowsStore,
        [STORE_SESSIONS]: sessionsStore
    } = await dbMultiTable([STORE_WINDOWS, STORE_SESSIONS]);

    // 1. Leer sesión
    const sessReq = sessionsStore.get(sessionId);
    const sessionData = await new Promise((resolve, reject) => {
        sessReq.onsuccess = () => resolve(sessReq.result || {});
        sessReq.onerror = () => reject(sessReq.error);
    });

    const winOrder = sessionData.winOrder || [];
    const activeTabId = sessionData.activeWinId || null;

    // 2. Leer ventanas
    const winsReq = windowsStore.index("sessionId").getAll(sessionId);
    const allWins = await new Promise((resolve, reject) => {
        winsReq.onsuccess = () => resolve(winsReq.result || []);
        winsReq.onerror = () => reject(winsReq.error);
    });

    // 3. Ordenar
    const orderedWins = winOrder
        .map(id => allWins.find(w => w.winId === id))
        .filter(w => w && w.data);

    const winsArray = orderedWins.map(w => [w.winId, w.data]);

    // 4. Devolver formato empresarial
    return {
        wins: winsArray,
        winOrder,
        activeTabId,
        allWins,
        sessionData
    };
}

/**
 * ============================================================================
 * getWindowsBySession — Returns all windows for a session
 * ============================================================================
 * RESPONSIBILITY:
 *   - Query the STORE_WINDOWS table
 *   - Filter by sessionId
 *
 * IMPORTANT:
 *   - Does not return contexts
 *   - Does not touch the enterprise session
 * ============================================================================
 */

export const getWindowsBySession = async (sessionId) => {
    //console.log("getWindowsBySession", sessionId);
    const windowsStore = await dbTable(STORE_WINDOWS);
    const req = windowsStore.index("sessionId").getAll(sessionId);

    return await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
    });
};


/**
 * ============================================================================
 * saveContext — Saves the persistent context of a window
 * ============================================================================
 * RESPONSIBILITY:
 *   - Register the enterprise state of the window (scroll, filters, etc.)
 *
 * IMPORTANT:
 *   - Does not modify the window
 *   - Does not modify the session
 * ============================================================================
 */
export const saveContext = async (winId, data) => {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionId) return;

    const contextsStore = await dbTable(STORE_CONTEXTS);
    const contextId = buildContextId(sessionId, winId, CONTEXT_KEY_LEGACY);

    await contextsStore.put({
        contextId,
        winId,
        sessionId,
        key: CONTEXT_KEY_LEGACY,
        value: sanitizePersistable(data),
        data: sanitizePersistable(data)
    });
};


/**
 * ============================================================================
 * loadContext — Returns the persistent context of a window
 * ============================================================================
 * RESPONSIBILITY:
 *   - Read the enterprise state of the window
 *
 * IMPORTANT:
 *   - If no context exists → returns null
 * ============================================================================
 */
export const loadContext = async (winId) => {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    const contextsStore = await dbTable(STORE_CONTEXTS);
    const contextId = sessionId ? buildContextId(sessionId, winId, CONTEXT_KEY_LEGACY) : winId;
    const req = contextsStore.get(contextId);

    return await new Promise((resolve, reject) => {
        req.onsuccess = () => {
            const row = req.result;
            if (row?.sessionId && sessionId && row.sessionId !== sessionId) {
                resolve(null);
                return;
            }
            resolve(row?.data ?? row?.value ?? null);
        };
        req.onerror = () => reject(req.error);
    });
};

/**
 * ============================================================================
 * deleteContext — Deletes the context of a window
 * ============================================================================
 * RESPONSIBILITY:
 *   - Delete the persistent state of the window
 *
 * IMPORTANT:
 *   - Does not delete the window
 *   - Does not touch the session
 * ============================================================================
 */
export const deleteContext = async (winId) => {
    const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    const contextsStore = await dbTable(STORE_CONTEXTS);
    if (sessionId) {
        contextsStore.delete(buildContextId(sessionId, winId, CONTEXT_KEY_LEGACY));
    }
    contextsStore.delete(winId);
    contextsStore.delete(buildLegacyContextId(winId));
};



/**
 * ============================================================================
 * cleanOldSessions — Cleans old and obsolete sessions
 * ============================================================================
 * RESPONSIBILITY:
 *   - Delete sessions that haven't been used in X days.
 *   - Do NOT delete the active session.
 *   - Do NOT delete sessions for the current user.
 *   - Do NOT delete sessions for the current workspace.
 *   - Do NOT delete sessions that have windows.
 *   - Do NOT delete sessions that have contexts.
 *
 * ============================================================================
 */
export const cleanOldSessions = async (maxAgeDays = 30) => {
    const user = sessionStorage.getItem(STORAGE_KEYS.USER);
    const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
    const activeSessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    const userId = buildUserId(workspace, user);

    const sessionsStore = await dbTable(STORE_SESSIONS);
    const windowsStore = await dbTable(STORE_WINDOWS);
    const contextsStore = await dbTable(STORE_CONTEXTS);

    const allSessions = await sessionsStore.getAll();

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);

    const toDelete = [];

    for (const session of allSessions) {
        // 1. No borrar la sesión activa
        if (session.sessionId === activeSessionId) continue;

        // 2. No borrar sesiones del usuario actual
        if (session.userId === userId) continue;

        // 3. No borrar sesiones del workspace actual
        if (session.workspaceId === workspace) continue;

        // 4. No borrar sesiones recientes
        if (new Date(session.updatedAt) >= cutoff) continue;

        // 5. No borrar sesiones con ventanas
        const wins = await windowsStore.index("sessionId").getAll(session.sessionId);
        if (wins.length > 0) continue;

        // 6. No borrar sesiones con contextos
        const ctx = await contextsStore.index("sessionId").getAll(session.sessionId);
        if (ctx.length > 0) continue;

        toDelete.push(session.sessionId);
    }

    // Borrar sesiones realmente obsoletas
    for (const sessionId of toDelete) {
        await delSession(sessionId, { force: true });
    }

    return toDelete.length;
};
