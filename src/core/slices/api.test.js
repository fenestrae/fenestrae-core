import { afterEach, describe, expect, it } from "vitest";
import { WIN_TYPES } from "../../store/types";
import { registerDummy, resetRuntime } from "../../test/helpers";
import { winStore } from "../winStore";

afterEach(() => {
  resetRuntime();
});

describe("showTab", () => {
  it("returns null when the component is unknown and there is no url", () => {
    expect(winStore.getState().showTab("0", "missing")).toBeNull();
  });

  it("rejects untrusted iframe urls", () => {
    expect(winStore.getState().showTab("0", "ext", { url: "javascript:alert(1)" })).toBeNull();
    expect(winStore.getState().showTab("0", "ext", { url: "https://evil.test" })).toBeNull();
  });

  it("opens a registered component as a tab", () => {
    registerDummy("frmcustomers");
    const id = winStore.getState().showTab("0", "frmcustomers", { id: "001", title: "Customers" });
    const win = winStore.getState().wins.get(id);
    expect(win.type).toBe(WIN_TYPES.TAB);
    expect(win.title).toBe("Customers");
    expect(win.path).toContain("id=001");
  });
});

describe("showFloat / callbacks", () => {
  it("rejects unknown components", async () => {
    await expect(winStore.getState().showFloat("0", "ghost")).rejects.toMatchObject({
      status: "error",
    });
  });

  it("rejects untrusted urls", async () => {
    await expect(
      winStore.getState().showFloat("0", "ext", { url: "javascript:alert(1)" }),
    ).rejects.toMatchObject({ status: "error" });
  });

  it("resolves the promise when onSave fires", async () => {
    registerDummy("frmcustomers");
    const pending = winStore.getState().showFloat("0", "frmcustomers", { title: "Edit" });
    const win = [...winStore.getState().wins.values()].find((w) => w.title === "Edit");
    expect(win.type).toBe(WIN_TYPES.FLOAT);
    win.onSave({ id: "001" });
    await expect(pending).resolves.toEqual({ status: "saved", data: { id: "001" } });
  });
});
