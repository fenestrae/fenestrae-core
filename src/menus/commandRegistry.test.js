import { afterEach, describe, expect, it, vi } from "vitest";
import { setPermissions } from "../permissions/permissions";
import { clearCommands, executeCommand, registerCommand } from "./commandRegistry";

afterEach(() => {
  clearCommands();
  setPermissions([]);
});

describe("commandRegistry", () => {
  it("executes a registered command with winId and payload", () => {
    const fn = vi.fn();
    registerCommand("clients.edit", fn);
    executeCommand("win-1", "clients.edit", { id: "001" });
    expect(fn).toHaveBeenCalledWith("win-1", { id: "001" });
  });

  it("warns and skips unknown commands", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    executeCommand("win-1", "missing.command");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("blocks execution when the UI permission is missing", () => {
    const fn = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerCommand("clients.delete", fn, { permission: "clients.delete" });
    setPermissions(["clients.read"]);

    executeCommand("win-1", "clients.delete");

    expect(fn).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("runs the command when the declared permission is present", () => {
    const fn = vi.fn();
    registerCommand("clients.delete", fn, { permission: "clients.delete" });
    setPermissions(["clients.delete"]);
    executeCommand("win-1", "clients.delete", true);
    expect(fn).toHaveBeenCalledWith("win-1", true);
  });
});
