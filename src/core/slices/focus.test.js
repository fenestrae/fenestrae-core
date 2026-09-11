import { afterEach, describe, expect, it } from "vitest";
import { WIN_TYPES } from "../../store/types";
import { resetRuntime } from "../../test/helpers";
import { formsRegistry, winStore } from "../winStore";

afterEach(() => {
  resetRuntime();
});

describe("focus slice", () => {
  it("brings a window to the front and records the active id", () => {
    const first = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "a",
      params: {},
    });
    const second = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "b",
      params: {},
    });

    winStore.getState().setFocus(first);
    expect(winStore.getState().activeWinId).toBe(first);
    expect(winStore.getState().winOrder.at(-1)).toBe(first);

    winStore.getState().bringToFront(second);
    expect(winStore.getState().activeWinId).toBe(second);
    expect(winStore.getState().getActiveWin()).toBe(second);
  });

  it("walks up to the owning tab", () => {
    const tab = winStore.getState().createWin("0", {
      type: WIN_TYPES.TAB,
      name: "customers",
      params: {},
    });
    const modal = winStore.getState().createWin(tab, {
      type: WIN_TYPES.MODAL,
      name: "edit",
      params: {},
    });
    winStore.getState().setActiveWinId(modal);
    expect(winStore.getState().getActiveTab()).toBe(tab);
  });
});

describe("misc slice", () => {
  it("registers components in lowercase", () => {
    winStore.getState().register({
      FrmCustomers: { component: () => null, options: { title: "Customers" } },
    });
    expect(formsRegistry.has("frmcustomers")).toBe(true);
  });

  it("updates the window caption", () => {
    const id = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "tool",
      params: {},
    });
    winStore.getState().setCaption(id, "New title");
    expect(winStore.getState().wins.get(id).title).toBe("New title");
    expect(winStore.getState().isFloat(id)).toBe(true);
    expect(winStore.getState().isModal(id)).toBe(false);
  });
});
