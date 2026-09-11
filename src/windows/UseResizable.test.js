import { afterEach, describe, expect, it } from "vitest";
import { detectDockZone } from "./UseResizable";

const original = { width: window.innerWidth, height: window.innerHeight };

afterEach(() => {
  window.innerWidth = original.width;
  window.innerHeight = original.height;
});

describe("detectDockZone", () => {
  it("returns a zone when the pointer is within 40px of an edge", () => {
    window.innerWidth = 1000;
    window.innerHeight = 800;

    expect(detectDockZone(10, 400)).toBe("left");
    expect(detectDockZone(980, 400)).toBe("right");
    expect(detectDockZone(500, 10)).toBe("top");
    expect(detectDockZone(500, 790)).toBe("bottom");
    expect(detectDockZone(500, 400)).toBeNull();
  });
});
