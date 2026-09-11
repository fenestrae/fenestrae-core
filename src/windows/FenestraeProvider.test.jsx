import { render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { formsRegistry } from "../core/winStore";
import { resetRuntime } from "../test/helpers";
import FenestraeProvider from "./FenestraeProvider";

afterEach(() => {
  resetRuntime();
});

describe("FenestraeProvider", () => {
  it("registers host components and mounts the portal root", async () => {
    const Dummy = () => createElement("div", null, "dummy");
    render(
      createElement(
        FenestraeProvider,
        { components: { frmcustomers: Dummy }, defaultTheme: "modern" },
        createElement("div", null, "host-app"),
      ),
    );

    expect(screen.getByText("host-app")).toBeInTheDocument();
    expect(document.getElementById("fenestrae-portal-root")).toBeTruthy();
    await waitFor(() => {
      expect(formsRegistry.has("frmcustomers")).toBe(true);
    });
  });
});
