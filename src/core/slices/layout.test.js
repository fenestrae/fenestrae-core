import { afterEach, describe, expect, it } from "vitest";
import { WIN_ALIGN, WIN_TYPES } from "../../store/types";
import { resetRuntime } from "../../test/helpers";
import { winStore } from "../winStore";

afterEach(() => {
  resetRuntime();
});

describe("layout slice", () => {
  it("updates coordinates and caption", () => {
    const id = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "tool",
      x: 10,
      y: 10,
      width: 200,
      height: 100,
      params: {},
    });

    winStore.getState().updateWinLayout(id, { x: 40, y: 50, width: 220, caption: "Renamed" });
    expect(winStore.getState().wins.get(id)).toMatchObject({
      x: 40,
      y: 50,
      width: 220,
      title: "Renamed",
    });
  });

  it("toggles maximize and restores the previous box", () => {
    window.innerWidth = 1200;
    window.innerHeight = 800;
    const id = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "tool",
      x: 15,
      y: 25,
      width: 300,
      height: 200,
      align: WIN_ALIGN.NONE,
      params: {},
    });

    winStore.getState().maximizeWin(id);
    expect(winStore.getState().wins.get(id)).toMatchObject({
      state: "maximized",
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
    });

    winStore.getState().maximizeWin(id);
    expect(winStore.getState().wins.get(id)).toMatchObject({
      state: "normal",
      x: 15,
      y: 25,
      width: 300,
      height: 200,
    });
  });

  it("marks a window as minimized", () => {
    const id = winStore.getState().createWin("0", {
      type: WIN_TYPES.FLOAT,
      name: "tool",
      params: {},
    });
    winStore.getState().minimizeWin(id);
    expect(winStore.getState().wins.get(id).state).toBe("minimized");
  });
});
