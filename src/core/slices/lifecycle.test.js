import { afterEach, describe, expect, it } from "vitest";
import { ROOT_PARENT_ID } from "../constants";
import { WIN_TYPES } from "../../store/types";
import { resetRuntime } from "../../test/helpers";
import { winStore } from "../winStore";

afterEach(() => {
  resetRuntime();
});

function createWin(parent, data) {
  return winStore.getState().createWin(parent, data);
}

describe("createWin", () => {
  it("reuses a tab with the same uniqueKey", () => {
    const first = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.TAB,
      name: "frmcustomers",
      params: { id: "001" },
    });
    const second = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.TAB,
      name: "frmcustomers",
      params: { id: "001" },
    });

    expect(second).toBe(first);
    expect(winStore.getState().wins.size).toBe(1);
    expect(winStore.getState().activeTabId).toBe(first);
  });

  it("roots tabs and top windows at ROOT_PARENT_ID", () => {
    const tabId = createWin("parent-x", { type: WIN_TYPES.TAB, name: "tab", params: {} });
    const topId = createWin("parent-x", { type: WIN_TYPES.TOP, name: "top", params: {} });
    expect(winStore.getState().wins.get(tabId).parentId).toBe(ROOT_PARENT_ID);
    expect(winStore.getState().wins.get(topId).parentId).toBe(ROOT_PARENT_ID);
  });

  it("keeps only one side window and closes its descendants", () => {
    const sideA = createWin(ROOT_PARENT_ID, { type: WIN_TYPES.SIDE, name: "nav", params: {} });
    const child = createWin(sideA, { type: WIN_TYPES.FLOAT, name: "child", params: {} });
    const sideB = createWin(ROOT_PARENT_ID, { type: WIN_TYPES.SIDE, name: "search", params: {} });

    const { wins } = winStore.getState();
    expect(wins.has(sideA)).toBe(false);
    expect(wins.has(child)).toBe(false);
    expect(wins.has(sideB)).toBe(true);
    expect([...wins.values()].filter((w) => w.type === WIN_TYPES.SIDE)).toHaveLength(1);
  });
});

describe("show / hide / close", () => {
  it("cannot hide a tab", () => {
    const tabId = createWin(ROOT_PARENT_ID, { type: WIN_TYPES.TAB, name: "tab", params: {} });
    winStore.getState().hide(tabId);
    expect(winStore.getState().wins.get(tabId).visible).toBe(true);
  });

  it("hides a float and restores it with show", () => {
    const id = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "tool",
      visible: true,
      params: {},
    });
    winStore.getState().hide(id);
    expect(winStore.getState().wins.get(id).visible).toBe(false);
    winStore.getState().setVisible(id, true);
    expect(winStore.getState().wins.get(id).visible).toBe(true);
    expect(winStore.getState().activeWinId).toBe(id);
  });

  it("closes a window and its descendants", () => {
    const parent = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "parent",
      params: {},
    });
    const child = createWin(parent, { type: WIN_TYPES.MODAL, name: "child", params: {} });
    winStore.getState().closeWin(parent);
    expect(winStore.getState().wins.has(parent)).toBe(false);
    expect(winStore.getState().wins.has(child)).toBe(false);
  });

  it("closes every closable window in one pass", () => {
    const kept = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "locked",
      closable: false,
      params: {},
    });
    createWin(ROOT_PARENT_ID, { type: WIN_TYPES.FLOAT, name: "gone", params: {} });
    winStore.getState().closeAllWin(true);
    expect(winStore.getState().wins.has(kept)).toBe(true);
    expect(winStore.getState().wins.size).toBe(1);
  });

  it("does not close a window marked as not closable", () => {
    const id = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "locked",
      closable: false,
      params: {},
    });
    winStore.getState().closeWin(id);
    expect(winStore.getState().wins.has(id)).toBe(true);
  });
});

describe("dock and fixed zones", () => {
  it("docks only top windows and restores layout on undock", () => {
    const topId = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.TOP,
      name: "palette",
      x: 40,
      y: 50,
      width: 200,
      height: 100,
      params: {},
    });
    const floatId = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "float",
      params: {},
    });

    winStore.getState().dockWin(floatId, "left");
    expect(winStore.getState().wins.get(floatId).docked).toBeFalsy();

    winStore.getState().dockWin(topId, "left");
    expect(winStore.getState().wins.get(topId)).toMatchObject({
      docked: true,
      dockZone: "left",
    });

    winStore.getState().undockWin(topId);
    const top = winStore.getState().wins.get(topId);
    expect(top.docked).toBe(false);
    expect(top.x).toBe(40);
    expect(top.y).toBe(50);
  });

  it("fixes a window and restores the previous layout", () => {
    const id = createWin(ROOT_PARENT_ID, {
      type: WIN_TYPES.FLOAT,
      name: "fixed",
      x: 10,
      y: 20,
      width: 300,
      height: 150,
      params: {},
    });

    winStore.getState().fixedWin(id, "bottom");
    expect(winStore.getState().wins.get(id)).toMatchObject({
      fixed: true,
      fixedZone: "bottom",
      docked: false,
    });

    winStore.getState().unfixedWin(id);
    expect(winStore.getState().wins.get(id)).toMatchObject({
      fixed: false,
      x: 10,
      y: 20,
      width: 300,
      height: 150,
    });
  });
});
