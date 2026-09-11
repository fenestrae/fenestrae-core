import { afterEach, describe, expect, it, vi } from "vitest";
import { injectFenestraeFrameBridge } from "./FenestraeiFrame";

afterEach(() => {
  vi.useRealTimers();
});

describe("injectFenestraeFrameBridge", () => {
  it("clears the poll interval on cleanup", () => {
    vi.useFakeTimers();
    const iframe = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const cleanup = injectFenestraeFrameBridge(iframe, { id: "w1" }, vi.fn(), false);

    cleanup();
    expect(iframe.removeEventListener).toHaveBeenCalledWith("load", expect.any(Function));
  });

  it("no-ops without an iframe", () => {
    expect(injectFenestraeFrameBridge(null, { id: "w1" }, vi.fn())).toBeTypeOf("function");
  });
});
