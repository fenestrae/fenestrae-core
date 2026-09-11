import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import FNMainMenu from "./FNMainMenu";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("FNMainMenu", () => {
  it("renders top-level captions", () => {
    render(
      createElement(FNMainMenu, {
        items: [{ caption: "File" }, { caption: "Edit" }],
        winId: "w1",
      }),
    );
    expect(screen.getByTitle("File")).toBeInTheDocument();
    expect(screen.getByTitle("Edit")).toBeInTheDocument();
  });

  it("opens a submenu in the portal root", () => {
    const portal = document.createElement("div");
    portal.id = "fenestrae-portal-root";
    document.body.appendChild(portal);

    render(
      createElement(FNMainMenu, {
        items: [{ caption: "File", items: [{ caption: "Save", command: "file.save" }] }],
        winId: "w1",
      }),
    );

    fireEvent.click(screen.getByTitle("File"));
    expect(portal.textContent).toContain("Save");
  });
});
