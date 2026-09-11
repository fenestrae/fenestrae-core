import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setPermissions } from "../permissions/permissions";
import { clearCommands, registerCommand } from "./commandRegistry";
import FNMainMenu from "./FNMainMenu";

afterEach(() => {
  document.body.innerHTML = "";
  clearCommands();
  setPermissions([]);
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

  it("executes the item command and hides entries without permission", () => {
    const portal = document.createElement("div");
    portal.id = "fenestrae-portal-root";
    document.body.appendChild(portal);

    const save = vi.fn();
    registerCommand("file.save", save);
    setPermissions(["clients.read"]);

    render(
      createElement(FNMainMenu, {
        items: [{
          caption: "File",
          items: [
            { caption: "Save", command: "file.save" },
            { caption: "Admin", command: "file.admin", permission: "clients.admin" },
          ],
        }],
        winId: "w1",
      }),
    );

    fireEvent.click(screen.getByTitle("File"));
    expect(portal.textContent).toContain("Save");
    expect(portal.textContent).not.toContain("Admin");
    fireEvent.click(screen.getByText("Save"));
    expect(save).toHaveBeenCalledWith("w1", undefined);
  });
});
