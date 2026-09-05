let activePermissions = [];

/**
 * ============================================================================
 * setPermissions — Registers the permission list for the active session
 * ============================================================================
 * - Stores the user's permissions in memory
 * - Persists the permission list in sessionStorage
 * - Used by menus, popup menus, commands and workspace logic
 * - Equivalent to VS Code's context keys for permission evaluation
 *
 * @param {string[]} permissions - Array of permission identifiers
 * ============================================================================
 */
export function setPermissions(permissions) {
  activePermissions = permissions;
  sessionStorage.setItem("fenestrae_permissions", JSON.stringify(permissions));
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
 *   - Wildcards: "clients.*"
 *
 * Behavior:
 *   - If no permission is required, returns true
 *   - If required ends with ".*", any matching prefix is accepted
 *   - Otherwise checks for exact match
 *
 * Examples:
 *   hasPermission("clients.read");   // true / false
 *   hasPermission("clients.*");      // true if any clients.* permission exists
 *
 * @param {string} required - Permission required to perform an action
 * @returns {boolean} Whether the user has the required permission
 * ============================================================================
 */
export function hasPermission(required) {
  if (!required) return true;

  const perms = activePermissions;

  if (required.endsWith(".*")) {
    const prefix = required.replace(".*", "");
    return perms.some(p => p.startsWith(prefix));
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
  if (saved) {
    activePermissions = JSON.parse(saved);
  }
}
