// core/commandRegistry.js
import { hasPermission } from "../permissions/permissions";

const commandRegistry = new Map();

/**
 * ============================================================================
 * registerCommand — Registers a workspace command
 * ============================================================================
 * - Centralizes all ERP actions
 * - Allows menus, buttons, popups and shortcuts to trigger logic
 * - Equivalent to VS Code's commands.registerCommand
 *
 * @param {string} name - Command name (ej: "clients.edit")
 * @param {(winId: string, payload: any) => void} fn - Implementation
 * @param {{ permission?: string }} [options] - Optional UI permission gate
 * ============================================================================
 */
export function registerCommand(name, fn, options = {}) {
  commandRegistry.set(name, {
    fn,
    permission: options.permission || null,
  });
}

/**
 * ============================================================================
 * executeCommand — Executes a registered command
 * ============================================================================
 * - Called by menus, popup menus, buttons, shortcuts, etc.
 * - Equivalent to VS Code's commands.executeCommand
 * - If the command declared a permission, it is checked here (UI only)
 *
 * @param {string} winId - Window invoking the command
 * @param {string} name - Command name
 * @param {any} payload - Optional data
 * ============================================================================
 */
export function executeCommand(winId, name, payload) {
  const entry = commandRegistry.get(name);
  if (!entry) {
    console.warn(`Comando no registrado: ${name}`);
    return;
  }

  const impl = typeof entry === "function" ? entry : entry.fn;
  const permission = typeof entry === "object" ? entry.permission : null;

  if (permission && !hasPermission(permission)) {
    console.warn(`Permiso denegado para el comando: ${name}`);
    return;
  }

  impl(winId, payload);
}
