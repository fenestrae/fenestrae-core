import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { WIN_ALIGN } from "../store/types";
import { calculateAlignment, getStandardLayout } from "./geometry";

const original = { width: window.innerWidth, height: window.innerHeight };

beforeEach(() => {
  window.innerWidth = 1000;
  window.innerHeight = 800;
});

afterEach(() => {
  window.innerWidth = original.width;
  window.innerHeight = original.height;
});

describe("calculateAlignment", () => {
  it("centers and pins windows against the viewport", () => {
    expect(calculateAlignment(WIN_ALIGN.CENTER, 200, 100)).toEqual({ x: 400, y: 350 });
    expect(calculateAlignment(WIN_ALIGN.TOP_CENTER, 200, 100)).toEqual({ x: 400, y: 20 });
    expect(calculateAlignment(WIN_ALIGN.AL_RIGHT, 200, 100)).toEqual({ x: 800, y: 0 });
    expect(calculateAlignment(WIN_ALIGN.AL_LEFT, 200, 100)).toEqual({ x: 0, y: 0 });
    expect(calculateAlignment(WIN_ALIGN.AL_BOTTOM, 200, 100)).toEqual({ x: 0, y: 640 });
    expect(calculateAlignment(WIN_ALIGN.NONE, 200, 100)).toBeNull();
  });
});

describe("getStandardLayout", () => {
  it("returns modal and panel presets from the viewport", () => {
    expect(getStandardLayout(null, "modal90")).toMatchObject({
      width: 900,
      height: 720,
      align: WIN_ALIGN.CENTER,
    });
    expect(getStandardLayout(null, "modal70").width).toBe(700);
    expect(getStandardLayout({ width: 500, height: 400 }, "modal90")).toMatchObject({
      width: 450,
      height: 360,
    });
  });

  it("falls back to a default floating size", () => {
    expect(getStandardLayout(null, "unknown-preset")).toMatchObject({
      width: 700,
      height: 500,
      align: WIN_ALIGN.CENTER,
    });
  });

  it("caps alside width and marks it as a portal", () => {
    const layout = getStandardLayout(null, WIN_ALIGN.AL_SIDE);
    expect(layout.width).toBe(400);
    expect(layout.isPortal).toBe(true);
    expect(layout.align).toBe(WIN_ALIGN.AL_RIGHT);
  });
});
