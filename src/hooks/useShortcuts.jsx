import { useEffect } from "react";


export function useShortcuts(shortcuts, active = true) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event) => {
      const { key, ctrlKey, altKey, shiftKey } = event;
      
      let combo = "";
      if (ctrlKey) combo += "Ctrl+";
      if (shiftKey) combo += "Shift+";
      if (altKey) combo += "Alt+";
      combo += key;

      if (shortcuts[combo]) {
        event.preventDefault();
        event.stopPropagation();
        shortcuts[combo](event);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [shortcuts, active]);
}