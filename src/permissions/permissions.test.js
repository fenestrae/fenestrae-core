import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../core/constants";
import { getPermissions, hasPermission, setPermissions } from "./permissions";

afterEach(() => {
  setPermissions([]);
  sessionStorage.clear();
});

describe("setPermissions / getPermissions", () => {
  it("keeps only string permissions and persists them", () => {
    setPermissions(["clients.read", 12, null, "clients.write"]);
    expect(getPermissions()).toEqual(["clients.read", "clients.write"]);
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEYS.PERMISSIONS))).toEqual([
      "clients.read",
      "clients.write",
    ]);
  });

  it("treats a non-array as an empty list", () => {
    setPermissions("clients.read");
    expect(getPermissions()).toEqual([]);
  });
});

describe("hasPermission", () => {
  it("skips the check when required is nullish and rejects empty strings", () => {
    expect(hasPermission(null)).toBe(true);
    expect(hasPermission(undefined)).toBe(true);
    expect(hasPermission("")).toBe(false);
    expect(hasPermission("   ")).toBe(false);
  });

  it("matches exact permissions", () => {
    setPermissions(["clients.read", "clients.write"]);
    expect(hasPermission("clients.read")).toBe(true);
    expect(hasPermission("clients.delete")).toBe(false);
  });

  it("matches wildcard prefixes on a dot boundary", () => {
    setPermissions(["clients", "clients.read", "clients_admin"]);
    expect(hasPermission("clients.*")).toBe(true);
    expect(hasPermission("clients_admin")).toBe(true);
    expect(hasPermission("clients.*") && hasPermission("clients_admin")).toBe(true);
    expect(hasPermission("invoices.*")).toBe(false);
    expect(hasPermission(".*")).toBe(false);
  });

  it("does not treat clients.* as clients_admin", () => {
    setPermissions(["clients_admin"]);
    expect(hasPermission("clients.*")).toBe(false);
  });
});

