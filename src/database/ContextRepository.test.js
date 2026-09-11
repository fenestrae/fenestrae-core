import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../core/constants";
import { contextRepository } from "./ContextRepository";
import { dbTable, STORE_CONTEXTS } from "./dbTable";
import { createNewSession, init } from "./persistence";
import { eventually, idbRequest, resetPersistence, waitMs } from "../test/helpers";

beforeEach(async () => {
  await resetPersistence();
});

afterEach(async () => {
  await resetPersistence();
});

describe("ContextRepository", () => {
  it("does not write without an active session", async () => {
    await contextRepository.save("win-1", "filters", { q: "acme" });
    const store = await dbTable(STORE_CONTEXTS);
    const all = await idbRequest(store.getAll());
    expect(all).toEqual([]);
  });

  it("scopes keys by session and strips secrets", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();

    await contextRepository.save("win-1", "filters", {
      q: "acme",
      password: "secret",
    });

    const loaded = await eventually(async () => {
      const value = await contextRepository.load("win-1", "filters");
      expect(value).toEqual({ q: "acme" });
      return value;
    });
    expect(loaded.password).toBeUndefined();
    expect(await contextRepository.load("win-1", "missing", "fallback")).toBe("fallback");
  });

  it("does not leak another session's context", async () => {
    await init({ user: "pepe", workspace: "erp" });
    const first = await createNewSession();
    await contextRepository.save("win-1", "draft", { name: "pepe" });
    await eventually(async () => {
      expect(await contextRepository.load("win-1", "draft")).toEqual({ name: "pepe" });
    });

    sessionStorage.setItem(STORAGE_KEYS.SESSION, "");
    const second = await createNewSession();
    expect(second).not.toBe(first);
    expect(await contextRepository.load("win-1", "draft", null)).toBeNull();
  });

  it("keeps the last debounced value", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();

    contextRepository.saveDebounced("win-1", "scroll", 1, 20);
    contextRepository.saveDebounced("win-1", "scroll", 99, 20);
    await waitMs(60);

    await eventually(async () => {
      expect(await contextRepository.load("win-1", "scroll")).toBe(99);
    });
  });

  it("flush cancels pending writes without persisting them", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();

    contextRepository.saveDebounced("win-1", "draft", { n: 1 }, 200);
    Array.from(contextRepository.pending.values()).forEach(clearTimeout);
    contextRepository.pending.clear();
    contextRepository.pendingValues.clear();
    await waitMs(40);

    expect(await contextRepository.load("win-1", "draft", null)).toBeNull();
  });

  it("clearWindow removes every key for that window", async () => {
    await init({ user: "pepe", workspace: "erp" });
    await createNewSession();
    await contextRepository.save("win-1", "a", 1);
    await contextRepository.save("win-1", "b", 2);
    await eventually(async () => {
      expect(await contextRepository.load("win-1", "a")).toBe(1);
    });

    await contextRepository.clearWindow("win-1");
    await eventually(async () => {
      expect(await contextRepository.load("win-1", "a", null)).toBeNull();
      expect(await contextRepository.load("win-1", "b", null)).toBeNull();
    });
  });
});
