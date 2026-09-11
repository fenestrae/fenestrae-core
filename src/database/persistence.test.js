import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../core/constants";
import { winStore } from "../core/winStore";
import {
  activateSession,
  closeSession,
  createNewSession,
  delSession,
  getSessions,
  getSessionsByUserAndWorkspace,
  getSessionsByUserId,
  init,
  restoreWindows,
  setWindow,
} from "./persistence";
import { dbTable, STORE_WINDOWS } from "./dbTable";
import { getPermissions, setPermissions } from "../permissions/permissions";
import { eventually, idbRequest, resetPersistence, setOperator } from "../test/helpers";

async function windowsForSession(sessionId) {
  const store = await dbTable(STORE_WINDOWS);
  return idbRequest(store.index("sessionId").getAll(sessionId));
}

beforeEach(async () => {
  await resetPersistence();
});

afterEach(async () => {
  await resetPersistence();
});

describe("init", () => {
  it("registers the operator without creating a session", async () => {
    const count = await init({ user: "pepe", workspace: "erp" });
    expect(count).toBe(0);
    expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBe("pepe");
    expect(sessionStorage.getItem(STORAGE_KEYS.WORKSPACE)).toBe("erp");
    expect(sessionStorage.getItem(STORAGE_KEYS.SESSION)).toBe("");
    expect(await getSessionsByUserId("erp::pepe")).toEqual([]);
  });
});

describe("sessions", () => {
  it("creates a session for the active operator", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await createNewSession();
    expect(sessionId).toBeTruthy();
    expect(sessionStorage.getItem(STORAGE_KEYS.SESSION)).toBe(sessionId);

    const sessions = await eventually(async () => {
      const list = await getSessions();
      expect(list.length).toBeGreaterThan(0);
      return list;
    });
    expect(sessions[0]).toMatchObject({
      sessionId,
      userId: "erp::pepe",
      workspaceId: "erp",
    });
  });

  it("requires user and workspace to list sessions", async () => {
    await expect(getSessionsByUserAndWorkspace("", "erp")).rejects.toThrow(/user/);
    await expect(getSessionsByUserAndWorkspace("pepe", "")).rejects.toThrow(/workspace/);
  });

  it("rejects activating a session that belongs to another operator", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const pepeSession = await createNewSession();

    await init({ user: "maria", workspace: "erp" });
    await expect(activateSession(pepeSession)).rejects.toThrow(/no pertenece/);
  });

  it("creates a session when activateSession has no id", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await activateSession();
    expect(sessionId).toBeTruthy();
    expect(sessionStorage.getItem(STORAGE_KEYS.SESSION)).toBe(sessionId);
  });
});

describe("windows and isolation", () => {
  it("does not persist a window without an active session", async () => {
    setOperator({ user: "pepe", workspace: "erp", sessionId: "" });
    await setWindow("w1", { title: "Customers" });
    expect(await windowsForSession("missing")).toEqual([]);
  });

  it("stores windows inside the active session only", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await createNewSession();
    await setWindow("w1", { title: "Customers", password: "secret" });

    const wins = await eventually(async () => {
      const list = await windowsForSession(sessionId);
      expect(list).toHaveLength(1);
      return list;
    });

    expect(wins[0].winId).toBe("w1");
    expect(wins[0].userId).toBe("erp::pepe");
    expect(wins[0].data.password).toBeUndefined();
    expect(wins[0].data.title).toBe("Customers");
  });

  it("refuses to delete another operator's session", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const pepeSession = await createNewSession();
    await setWindow("w1", { title: "Pepe" });

    await init({ user: "maria", workspace: "erp" });
    await expect(delSession(pepeSession)).rejects.toThrow(/no pertenece/);
  });
});

describe("restoreWindows", () => {
  it("inserts a launchpad when the session has no windows", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();

    const isNew = await restoreWindows({
      title: "Home",
      path: "/",
      name: "launchpad",
    });

    expect(isNew).toBe(true);
    expect(sessionStorage.getItem(STORAGE_KEYS.LAUNCHPAD_ID)).toMatch(/^LAUNCHPAD::/);
    expect(winStore.getState().wins.size).toBe(1);
    expect(winStore.getState().hasHydrated).toBe(false);
  });
});

describe("closeSession", () => {
  it("clears identity, permissions and in-memory windows", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();
    setPermissions(["clients.read"]);
    winStore.getState().createWin("0", {
      type: "tab",
      name: "frmcustomers",
      params: { id: "1" },
    });

    await closeSession();

    expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
    expect(getPermissions()).toEqual([]);
    expect(winStore.getState().wins.size).toBe(0);
  });
});
