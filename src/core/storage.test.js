import { afterEach, describe, expect, it } from "vitest";
import { WIN_TYPES } from "../store/types";
import { resetRuntime } from "../test/helpers";
import { persistOptions } from "./storage";
import { winStore } from "./winStore";

afterEach(() => {
  resetRuntime();
});

describe("persistOptions", () => {
  it("skips automatic zustand hydration", () => {
    expect(persistOptions.skipHydration).toBe(true);
  });

  it("does not strip windows before the store is hydrated", () => {
    winStore.setState({ hasHydrated: false });
    const partial = persistOptions.partialize({
      activeTabId: "1",
      winOrder: ["1", "2"],
      wins: new Map([
        ["1", { type: WIN_TYPES.TAB, title: "A" }],
        ["2", { type: WIN_TYPES.EXT, title: "B" }],
      ]),
      contexts: [],
    });

    expect(partial.wins).toHaveLength(2);
  });

  it("drops external windows, callbacks and secrets after hydration", () => {
    winStore.setState({ hasHydrated: true });
    const partial = persistOptions.partialize({
      activeTabId: "1",
      winOrder: ["1", "2"],
      wins: new Map([
        [
          "1",
          {
            type: WIN_TYPES.TAB,
            title: "Customers",
            onSave: () => {},
            params: { password: "secret", city: "Madrid", this: { q: "acme" } },
          },
        ],
        ["2", { type: WIN_TYPES.EXT, title: "Popup", params: {} }],
      ]),
      contexts: [],
    });

    expect(partial.wins.map(([id]) => id)).toEqual(["1"]);
    expect(partial.winOrder).toEqual(["1"]);
    expect(partial.wins[0][1].onSave).toBeUndefined();
    expect(partial.wins[0][1].params.password).toBeUndefined();
    expect(partial.wins[0][1].params.city).toBe("Madrid");
    expect(partial.wins[0][1].params.this).toEqual({ q: "acme" });
  });

  it("rebuilds Maps and marks restored windows on merge", () => {
    const merged = persistOptions.merge(
      { wins: [["w1", { title: "A", params: { id: "1" } }]], winOrder: ["w1"] },
      { extra: true, wins: new Map() },
    );

    expect(merged.extra).toBe(true);
    expect(merged.wins).toBeInstanceOf(Map);
    expect(merged.wins.get("w1").isRestored).toBe(true);
    expect(merged.wins.get("w1").params.isRestored).toBe(true);
  });

  it("keeps the current state when nothing was persisted", () => {
    const current = { wins: new Map() };
    expect(persistOptions.merge(null, current)).toBe(current);
  });
});
