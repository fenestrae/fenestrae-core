// core/commandRegistry.js

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
 * ============================================================================
 */
export function registerCommand(name, fn) {
  commandRegistry.set(name, fn);
}

/**
 * ============================================================================
 * executeCommand — Executes a registered command
 * ============================================================================
 * - Called by menus, popup menus, buttons, shortcuts, etc.
 * - Equivalent to VS Code's commands.executeCommand
 *
 * @param {string} winId - Window invoking the command
 * @param {string} name - Command name
 * @param {any} payload - Optional data
 * ============================================================================
 */
export function executeCommand(winId, name, payload) {
  const fn = commandRegistry.get(name);
  if (!fn) {
    console.warn(`Comando no registrado: ${name}`);
    return;
  }
  fn(winId, payload);
}
