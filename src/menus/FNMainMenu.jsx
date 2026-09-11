// menus/FNMainMenu.jsx

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import FNButton from "../components/FNButton";
//import fenestrae from "fenestrae";
export default function FNMainMenu({
  items = [],
  orientation = "horizontal",
  winId
}) {
  const isHorizontal = orientation === "horizontal";

  const [openMenu, setOpenMenu] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);

  const handleSelectItem = (item, rect) => {
    setOpenMenu(item);
    setAnchorRect(rect);
  };

  return (
    <>
      {/* MAIN MENU BAR */}
      <div
        className={
          isHorizontal
            ? "flex items-center gap-2 px-3 h-10 select-none"
            : "flex flex-col gap-2 px-3 py-2 select-none"
        }
        style={{
          backgroundColor: "var(--color-menu-bg)",
          color: "var(--color-window-text)",
          borderBottom: isHorizontal
            ? "1px solid var(--color-menu-border)"
            : "none"
        }}
      >
        {items.map((item, idx) => (
          <FNMainMenuItem
            key={idx}
            item={item}
            onSelectItem={handleSelectItem}
          />
        ))}
      </div>

      {/* SUBMENU (PORTAL) */}
      {openMenu && (
        <FNGroupMenu
          anchorRect={anchorRect}
          items={openMenu.items}
          winId={winId}
          onClose={() => {
          
            setOpenMenu(null);
          }}
        />
      )}
    </>
  );
}

/* ---------------------------------------------------------
   MAIN MENU ITEM
--------------------------------------------------------- */
function FNMainMenuItem({ item, onSelectItem }) {
  const ref = useRef(null);

  const handleClick = () => {
    const rect = ref.current.getBoundingClientRect();
    onSelectItem?.(item, rect);
  };

  return (
    <FNButton
      ref={ref}
      variant="secondary"
      size="sm"
      iconIndex={item.iconIndex}
      iconPosition="left"
      onClick={handleClick}
      className="px-2 py-1"
      title={item.caption}
    >
      {item.caption}
    </FNButton>
  );
}
/* ---------------------------------------------------------
   GROUP MENU (PORTAL)
--------------------------------------------------------- */
function FNGroupMenu({ anchorRect, items, winId, onClose }) {
 
  const menuRef = useRef(null);

  // Cerrar si se hace clic fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const portalRoot = document.getElementById("fenestrae-portal-root");

  if (!portalRoot) {
    console.error("FNGroupMenu: no existe #fenestrae-portal-root en el DOM");
    return null;
  }

  return createPortal(
    <div
      ref={menuRef}
      className="absolute z-[99999] shadow-xl rounded-md py-1"
      style={{
        top: anchorRect?.bottom + 2,
        left: anchorRect?.left,
        backgroundColor: "var(--color-menu-bg)",
        border: "1px solid var(--color-menu-border)",
        color: "var(--color-window-text)",
        minWidth: "180px"
      }}
    >
      {items?.map((item, idx) => (
        <FNGroupMenuItem
          key={idx}
          item={item}
          winId={winId}
          onClose={onClose}
        />
      ))}
    </div>,
    portalRoot
  );
}

function FNGroupMenuItem({ item, winId, onClose }) {
  const handleClick = () => {
    //fenestrae.executeCommand(winId, item.command, item.payload);
    onClose?.();
  };

  return (
    <FNButton
      variant="item"
      size="sm"
      iconIndex={item.iconIndex}
      iconPosition="left"
      className="w-full text-left"
      onClick={handleClick}
    >
      {item.caption}
    </FNButton>
  );
}
