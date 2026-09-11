// ============================================================================
// FENESTRAE - TREE HELPERS (core/treeHelpers.js)
// Utilities for traversal and cascade-close of window hierarchies.
// ============================================================================

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
