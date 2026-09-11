import { memo } from "react";

function FreezeInactive({ children }) {
  return children;
}

export default memo(FreezeInactive, (prev, next) => {
  if (!next.active && !prev.active) return true;
  return false;
});
