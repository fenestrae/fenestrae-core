// ============================================================================
// FENESTRAE - TREE HELPERS (core/treeHelpers.js)
// Utilities for traversal and cascade-close of window hierarchies.
// ============================================================================

/**
 * Checks if `win` is a descendant of `ancestorId` in the window tree.
 */
export const isDescendantOf = (win, ancestorId, allWins) => {
  if (!win || !win.parentId || win.parentId === "0") return false;
  if (win.parentId === ancestorId) return true;
  return isDescendantOf(allWins.get(win.parentId), ancestorId, allWins);
};

/**
 * Returns all descendant IDs of `parentId` (recursive, depth-first).
 */
export const getAllDescendants = (parentId, wins) => {
  let descendants = [];
  Array.from(wins.values()).forEach((w) => {
    if (w.parentId === parentId) {
      descendants.push(w.id);
      descendants = [...descendants, ...getAllDescendants(w.id, wins)];
    }
  });
  return descendants;
};
