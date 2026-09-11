import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HYDRATION_STATE, STORAGE_KEYS } from "../core/constants";
import { dbMultiTable, dbTable, STORE_WINDOWS } from "./dbTable";
import { indexedDBStorage } from "./indexedDBAdapter";
import { createNewSession, init } from "./persistence";
import { eventually, idbRequest, resetPersistence } from "../test/helpers";

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

describe("dbTable helpers", () => {
  it("rejects an empty multi-store request", async () => {
    await expect(dbMultiTable([])).rejects.toThrow(/non-empty array/);
  });

  it("opens the configured object stores", async () => {
    const windows = await dbTable(STORE_WINDOWS);
    expect(windows.put).toBeTypeOf("function");
    const stores = await dbMultiTable([STORE_WINDOWS], "readwrite");
    expect(stores[STORE_WINDOWS]).toBeTruthy();
  });
});

describe("indexedDBStorage.setItem", () => {
  it("no-ops until the session is hydrated", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await createNewSession();
    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.PENDING);

    await indexedDBStorage.setItem("wins", {
      state: {
        wins: [["w1", { title: "Nope" }]],
        winOrder: ["w1"],
        activeTabId: "w1",
      },
    });

    expect(await windowsForSession(sessionId)).toEqual([]);
  });

  it("writes windows after hydration is marked ready", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await createNewSession();
    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.READY);

    await indexedDBStorage.setItem("wins", {
      state: {
        wins: [["w1", { title: "Customers" }]],
        winOrder: ["w1"],
        activeTabId: "w1",
      },
    });

    await eventually(async () => {
      const wins = await windowsForSession(sessionId);
      expect(wins).toHaveLength(1);
      expect(wins[0].data.title).toBe("Customers");
    });
  });

  it("coalesces rapid writes to the last snapshot", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const sessionId = await createNewSession();
    sessionStorage.setItem(STORAGE_KEYS.HYDRATED, HYDRATION_STATE.READY);

    const first = indexedDBStorage.setItem("wins", {
      state: {
        wins: [["w1", { title: "A" }]],
        winOrder: ["w1"],
        activeTabId: "w1",
      },
    });
    const second = indexedDBStorage.setItem("wins", {
      state: {
        wins: [["w1", { title: "B" }]],
        winOrder: ["w1"],
        activeTabId: "w1",
      },
    });

    await Promise.all([first, second]);

    const wins = await windowsForSession(sessionId);
    expect(wins).toHaveLength(1);
    expect(wins[0].data.title).toBe("B");
  });
});
