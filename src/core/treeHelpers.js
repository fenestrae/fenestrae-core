// ============================================================================
// FENESTRAE - TREE HELPERS (core/treeHelpers.js)
// Utilities for traversal and cascade-close of window hierarchies.
// ============================================================================

/**
 * Returns all descendant IDs of `parentId` (recursive, depth-first).
 */
export const getAllDescendants = (parentId, wins) => {
  const childrenByParent = new Map();
  for (const w of wins.values()) {
    const siblings = childrenByParent.get(w.parentId);
    if (siblings) siblings.push(w.id);
    else childrenByParent.set(w.parentId, [w.id]);
  }

  const descendants = [];
  const walk = (id) => {
    const children = childrenByParent.get(id);
    if (!children) return;
    for (const childId of children) {
      descendants.push(childId);
      walk(childId);
    }
  };
  walk(parentId);
  return descendants;
};
