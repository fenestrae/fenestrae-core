let activePermissions = [];

/**
 * ============================================================================
 * setPermissions — Registers the permission list for the active session
 * ============================================================================
 * UI helper only. This is NOT authorization. The host ERP must enforce
 * permissions on the server; anything in sessionStorage can be edited.
 *
 * @param {string[]} permissions - Array of permission identifiers
 * ============================================================================
 */
export function setPermissions(permissions) {
  activePermissions = Array.isArray(permissions)
    ? permissions.filter((p) => typeof p === "string")
    : [];
  sessionStorage.setItem("fenestrae_permissions", JSON.stringify(activePermissions));
}

/**
 * ============================================================================
 * getPermissions — Returns the active permission list
 * ============================================================================
 * - Provides read-only access to the current permission set
 * - Useful for ERP modules that need to inspect user capabilities
 *
 * @returns {string[]} The list of active permissions
 * ============================================================================
 */
export function getPermissions() {
  return activePermissions;
}

/**
 * ============================================================================
 * hasPermission — Evaluates whether the user has a required permission
 * ============================================================================
 * Supports:
 *   - Exact permissions: "clients.read"
 *   - Write permissions: "clients.write"
 *   - Wildcards: "clients.*" (matches "clients" and "clients.read", not "clients_admin")
 *
 * Behavior:
 *   - If required is null/undefined, no check is needed → true
 *   - If required is "", it is treated as invalid → false
 *   - If required ends with ".*", matches the prefix plus a dot boundary
 *   - Otherwise checks for exact match
 *
 * @param {string} required - Permission required to perform an action
 * @returns {boolean} Whether the user has the required permission
 * ============================================================================
 */
export function hasPermission(required) {
  if (required == null) return true;
  if (typeof required !== "string" || required.trim() === "") return false;

  const perms = activePermissions;

  if (required.endsWith(".*")) {
    const prefix = required.slice(0, -2);
    if (!prefix) return false;
    return perms.some((p) => p === prefix || p.startsWith(`${prefix}.`));
  }

  return perms.includes(required);
}

/**
 * ============================================================================
 * hydratePermissions — Restores permissions from sessionStorage
 * ============================================================================
 * - Called automatically by FenestraeContainer or init()
 * - Ensures permissions survive page reloads
 * ============================================================================
 */
export function hydratePermissions() {
  const saved = sessionStorage.getItem("fenestrae_permissions");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    activePermissions = Array.isArray(parsed)
      ? parsed.filter((p) => typeof p === "string")
      : [];
  } catch {
    activePermissions = [];
  }
}
