import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetRuntime } from "../test/helpers";
import { formsRegistry } from "../core/winStore";
import FenestraeWinRenderer from "./FenestraeWinRenderer";

afterEach(() => {
  resetRuntime();
});

describe("FenestraeWinRenderer", () => {
  it("shows URL_NOT_ALLOWED for untrusted iframe urls", () => {
    render(
      createElement(FenestraeWinRenderer, {
        win: {
          id: "w1",
          name: "ext",
          title: "External",
          params: { url: "javascript:alert(1)" },
        },
        closeWin: vi.fn(),
      }),
    );
    expect(screen.getByText("[ERROR: URL_NOT_ALLOWED]")).toBeInTheDocument();
  });

  it("shows NOT_FOUND when the component is not registered", () => {
    render(
      createElement(FenestraeWinRenderer, {
        win: { id: "w1", name: "frmmissing", params: {} },
        closeWin: vi.fn(),
      }),
    );
    expect(screen.getByText("[ERROR: FRMMISSING NOT_FOUND_IN_REGISTRY]")).toBeInTheDocument();
  });

  it("renders a registered component", () => {
    formsRegistry.set("frmcustomers", {
      component: () => createElement("div", null, "Customers form"),
      options: {},
    });

    render(
      createElement(FenestraeWinRenderer, {
        win: { id: "w1", name: "frmcustomers", params: {} },
        closeWin: vi.fn(),
      }),
    );
    expect(screen.getByText("Customers form")).toBeInTheDocument();
  });
});
