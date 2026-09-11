import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FreezeInactive from "./FreezeInactive";

describe("FreezeInactive", () => {
  it("keeps the last children while the pane stays inactive", () => {
    const { rerender } = render(
      createElement(FreezeInactive, { active: false }, createElement("div", null, "first")),
    );
    expect(screen.getByText("first")).toBeInTheDocument();

    rerender(createElement(FreezeInactive, { active: false }, createElement("div", null, "second")));
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.queryByText("second")).toBeNull();

    rerender(createElement(FreezeInactive, { active: true }, createElement("div", null, "third")));
    expect(screen.getByText("third")).toBeInTheDocument();
  });
});
