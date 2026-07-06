// ============================================================================
// FENESTRAE - CTDockerPanel (components/CTDockerPanel.jsx)
// Panel para ventanas docked en las zonas.
// ============================================================================

import React, { useRef, useCallback, useState, useEffect } from "react";
import clsx from "clsx";
import { winStore } from "../core/winStore";
import { useShallow } from "zustand/react/shallow";
import CTWinRenderer from "./CTWinRenderer";

const CTDockerPanel = ({ win, config, closeWin, zoneRef, index = 0, total = 1 }) => {
  const { undockWin } = winStore(useShallow((s) => ({ undockWin: s.undockWin })));

  const isDraggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const winRef = useRef(win);

  useEffect(() => {
    winRef.current = win;
  }, [win]);

  const handleHeaderMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();

    isDraggingRef.current = true;
    setDragging(true);

    const currentWidth = winRef.current.width || 600;

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      if (!zoneRef?.current) return;

      const rect = zoneRef.current.getBoundingClientRect();
      const cx = moveEvent.clientX;
      const cy = moveEvent.clientY;
      
      const inside = cx >= rect.left && cx <= rect.right &&
                     cy >= rect.top && cy <= rect.bottom;

      if (!inside) {
        cleanup();

        const cursorX = moveEvent.clientX;
        const cursorY = moveEvent.clientY;
        const headerHeight = 28;
        
        const targetX = Math.max(0, cursorX - (currentWidth / 2));
        const targetY = Math.max(0, cursorY - (headerHeight / 2));

        undockWin(winRef.current.id, { x: targetX, y: targetY });

        window.dispatchEvent(
          new CustomEvent("fenestrae:undockDrag", {
            detail: { 
              winId: winRef.current.id, 
              clientX: cursorX, 
              clientY: cursorY 
            }
          })
        );
      }
    };

    const onMouseUp = () => cleanup();

    const cleanup = () => {
      isDraggingRef.current = false;
      setDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return cleanup;
  }, [undockWin, zoneRef]);

  // Calcular el tamaño basado en el total de ventanas
  const getFlexSize = () => {
    if (config.axis === "vertical") {
      // Vertical (left/right) - cada ventana ocupa el mismo alto
      return `flex-1 min-h-0`;
    } else {
      // Horizontal (top/bottom) - cada ventana ocupa el mismo ancho
      return `flex-1 min-w-0`;
    }
  };

  const displayTitle = win.title || "Window";

  return (
    <div
      className={clsx(
        "flex flex-col bg-white overflow-hidden",
        "transition-all duration-200",
        getFlexSize(),
        dragging && "shadow-xl ring-2 ring-blue-400 z-10",
        // Borde entre ventanas docked
        index > 0 && config.axis === "vertical" && "border-t border-gray-200",
        index > 0 && config.axis === "horizontal" && "border-l border-gray-200",
        // Sombra sutil
        "shadow-sm",
      )}
    >
      {/* Header delgado para arrastrar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className={clsx(
          "h-5 flex items-center justify-between px-2 flex-shrink-0 select-none",
          "transition-colors duration-150",
          dragging
            ? "bg-gradient-to-r from-blue-600 to-blue-500 cursor-grabbing"
            : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 cursor-grab",
        )}
      >
        {/* Título e indicador */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div className={clsx(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            dragging ? "bg-white animate-ping" : "bg-blue-400",
          )} />
          <span className="text-[9px] font-medium text-gray-200 truncate">
            {dragging ? "↕ Drag to undock" : displayTitle}
          </span>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-0.5" onMouseDown={(e) => e.stopPropagation()}>
          {/* Botón de undock */}
          <button
            onClick={() => {
              const rect = zoneRef?.current?.getBoundingClientRect();
              if (rect) {
                const winWidth = win.width || 600;
                const headerHeight = 28;
                undockWin(win.id, { 
                  x: rect.left + (rect.width / 2) - (winWidth / 2),
                  y: rect.top + (rect.height / 2) - (headerHeight / 2)
                });
              } else {
                undockWin(win.id);
              }
            }}
            className="flex items-center justify-center w-4 h-4 rounded hover:bg-gray-500 text-gray-400 hover:text-white transition-all"
            title="Undock"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
              <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
            </svg>
          </button>

          {/* Botón de cerrar */}
          <button
            onClick={() => closeWin(win.id)}
            className="flex items-center justify-center w-4 h-4 rounded hover:bg-red-500 text-gray-400 hover:text-white transition-all"
            title="Close"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <CTWinRenderer win={win} closeWin={closeWin} />
      </div>
    </div>
  );
};

export default CTDockerPanel;