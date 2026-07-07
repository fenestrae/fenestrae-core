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
  className={clsx(
    "flex flex-col overflow-hidden",
    "transition-all duration-200",
    getFlexSize(),
    // Sustituimos ring-blue moderno por una sombra pesada o estado activo clásico mediante z-index
    dragging && "z-10 shadow-2xl"
  )}
  style={{
    // 1. Fondo del contenedor acoplado heredado del tema (Beige/Arena en XP)
    backgroundColor: "var(--color-window-bg, #ece9d8)",
    // 2. Bordes dinámicos según el eje de colación del layout
    borderTop: index > 0 && config.axis === "vertical" ? "1px solid var(--color-fn-tab-border, #919b9c)" : undefined,
    borderLeft: index > 0 && config.axis === "horizontal" ? "1px solid var(--color-fn-tab-border, #919b9c)" : undefined,
  }}
>
  {/* Header delgado para arrastrar - Estilo Barra de Herramientas Rebar / Dock XP */}
  <div
    onMouseDown={handleHeaderMouseDown}
    className={clsx(
      "h-6 flex items-center justify-between px-2 flex-shrink-0 select-none border-b",
      dragging ? "cursor-grabbing" : "cursor-grab"
    )}
    style={{
      // 3. Fondo satinado inactivo por defecto para paneles secundarios, o azul brillante si se está arrastrando
      background: dragging
        ? "var(--color-window-header, linear-gradient(180deg, #1e70e4 0%, #0037da 100%))"
        : "var(--color-fn-tab-bg-inactive, linear-gradient(180deg, #f4f3ee 0%, #e2dfd1 100%))",
      borderColor: "var(--color-fn-tab-border, #919b9c)",
    }}
  >
    {/* Título e indicador de textura estriada clásica de XP */}
    <div className="flex items-center gap-1.5 overflow-hidden">
      {/* Indicador visual: Simula los puntos de arrastre (grip) típicos de las barras de XP */}
      <div 
        className="flex gap-0.5 opacity-60 flex-shrink-0"
        style={{ display: dragging ? 'none' : 'flex' }}
      >
        <span className="w-0.5 h-3 bg-white border-r border-gray-400" />
        <span className="w-0.5 h-3 bg-white border-r border-gray-400" />
      </div>
      
      <span 
        className="text-[11px] font-bold truncate select-none"
        style={{
          // 4. Color de texto condicional (Blanco si arrastra, Gris oscuro/Negro si está acoplado)
          color: dragging 
            ? "var(--color-window-header-text, #ffffff)" 
            : "var(--color-fn-tab-text-inactive, #4a4a4a)"
        }}
      >
        {dragging ? "↕ Arrastrando para desacoplar" : displayTitle}
      </span>
    </div>

    {/* Controles del Dock */}
    <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
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
        className="flex items-center justify-center transition-all border"
        style={{
          width: "var(--fn-btn-control-size, 16px)",
          height: "var(--fn-btn-control-size, 16px)",
          borderRadius: "var(--radius-fn-btn-radius, 2px)",
          background: "var(--color-fn-tab-bg-inactive, #e2dfd1)",
          borderColor: "var(--color-fn-tab-border, #919b9c)",
          color: "var(--color-fn-tab-text-inactive, #4a4a4a)"
        }}
        title="Desacoplar ventana"
      >
        {/* Icono simplificado de desacople/restaurar */}
        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
          <path d="M4 4h10v10H4V4zm2 2v6h6V6H6zm12 6h2v8H12v-2h6v-6z"/>
        </svg>
      </button>

      {/* Botón de cerrar */}
      <button
        onClick={() => closeWin(win.id)}
        className="flex items-center justify-center text-white text-center font-bold transition-all"
        style={{
          // En XP, el botón cerrar de los mini-paneles acoplados suele ser rojo plano muy pequeño
          width: "var(--fn-btn-control-size, 16px)",
          height: "var(--fn-btn-control-size, 16px)",
          borderRadius: "var(--radius-fn-btn-radius, 2px)",
          background: "var(--color-fn-btn-close-bg, #ef4444)",
          border: "1px solid var(--fn-btn-close-border, #dc2626)",
          fontSize: "9px",
          lineHeight: "1"
        }}
        title="Cerrar panel"
      >
        ✕
      </button>
    </div>
  </div>
  
  {/* Área de contenido de la ventana acoplada */}
  <div className="flex-1 overflow-auto bg-white" style={{ backgroundColor: "var(--color-window-content, #ffffff)" }}>
    {/* Aquí se renderiza el hijo o contenido interno de la ventana de Fenestrae */}
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