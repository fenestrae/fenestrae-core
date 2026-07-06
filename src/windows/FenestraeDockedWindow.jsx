import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { winStore } from "../core";
import FenestraeWinRenderer from "./FenestraeWinRenderer"; // 🔹 Renderer unificado

const ZONE_BASE_CONFIG = {
  left:   { axis: "vertical",  cls: "h-full flex-shrink-0 flex-row",         resizeDir: "e" },
  right:  { axis: "vertical",  cls: "h-full flex-shrink-0 flex-row-reverse", resizeDir: "w" },
  top:    { axis: "horizontal", cls: "w-full flex-shrink-0 flex-col",         resizeDir: "s" },
  bottom: { axis: "horizontal", cls: "w-full flex-shrink-0 flex-col-reverse", resizeDir: "n" },
};

const FenestraeDockZone = React.memo(({ zone }) => {
  const config = ZONE_BASE_CONFIG[zone];
  const [hint, setHint] = useState(false);
  const [customSize, setCustomSize] = useState(config.axis === "vertical" ? 256 : 192);
  const isResizingRef = useRef(false);

  // 🔹 Selectores atómicos de Zustand para optimizar rendimiento de renderizado
  const wins = winStore((s) => s.wins);
  const closeWin = winStore((s) => s.closeWin);

  const dockedWins = useMemo(
    () => Array.from(wins.values()).filter((w) => w.docked && w.dockZone === zone),
    [wins, zone]
  );

  // Escuchamos el evento matemático emitido fluidamente desde el useDraggable
  useEffect(() => {
    const onHint = (e) => {
      if (e.detail?.winId) {
        setHint(e.detail.zone === zone);
      } else {
        setHint(false);
      }
    };
    window.addEventListener("fenestrae:dockHint", onHint);
    return () => window.removeEventListener("fenestrae:dockHint", onHint);
  }, [zone]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = config.axis === "vertical" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    const startSize = customSize;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      let newSize = startSize;

      if (zone === "left")   newSize = startSize + deltaX;
      if (zone === "right")  newSize = startSize - deltaX;
      if (zone === "top")    newSize = startSize + deltaY;
      if (zone === "bottom") newSize = startSize - deltaY;

      const minSize = 140;
      const maxSize = config.axis === "vertical" ? window.innerWidth * 0.4 : window.innerHeight * 0.4;
      setCustomSize(Math.max(minSize, Math.min(newSize, maxSize)));
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const hasContent = dockedWins.length > 0;
  
  // Estilo adaptativo C++Builder/Delphi
  const sizeStyle = hasContent
    ? { [config.axis === "vertical" ? "width" : "height"]: `${customSize}px` }
    : { width: 0, height: 0 };

  return (
    <div
      style={sizeStyle}
      className={clsx(
        "flex relative transition-all duration-75",
        config.cls,
        !hasContent && "overflow-visible"
      )}
    >
      <div className={clsx("flex-1 flex min-w-0 min-h-0 relative", config.axis === "vertical" ? "flex-col" : "flex-row")}>
        
        {/* RECTÁNGULO DE PREVISUALIZACIÓN AZUL PROFESIONAL */}
        {hint && !hasContent && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: config.axis === "vertical" ? `${customSize}px` : "100%",
              height: config.axis === "horizontal" ? `${customSize}px` : "100%",
            }}
            className="bg-blue-500/15 border-2 border-blue-500/60 border-dashed rounded z-[9999] flex items-center justify-center pointer-events-none animate-pulse"
          >
            <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest bg-white/90 px-2 py-1 rounded shadow-sm border border-blue-200">
              Acoplar ({zone})
            </span>
          </div>
        )}

        {/* Listado de ventanas acopladas */}
        {dockedWins.map((w) => (
          <FenestraeDockedWindow key={w.id} win={w} config={config} closeWin={closeWin} />
        ))}
      </div>

      {/* RE-SIZER DIVIDER */}
      {hasContent && (
        <div
          onMouseDown={handleResizeStart}
          className={clsx(
            "bg-[var(--color-window-border,#e2e8f0)] hover:bg-blue-400 active:bg-blue-500 transition-colors z-10 flex-shrink-0 select-none relative",
            config.axis === "vertical" ? "w-1 h-full cursor-col-resize" : "h-1 w-full cursor-row-resize"
          )}
        />
      )}
    </div>
  );
});

FenestraeDockZone.propTypes = {
  zone: PropTypes.oneOf(["left", "right", "top", "bottom"]).isRequired,
};

FenestraeDockZone.displayName = "FenestraeDockZone";

// ─────────────────────────────────────────────────────────────────────────────

const FenestraeDockedWindow = React.memo(({ win, config, closeWin }) => {
  const undockWin = winStore((s) => s.undockWin);

  return (
    <div
      className={clsx(
        "flex flex-col border overflow-hidden bg-[var(--color-window-bg,#ffffff)] border-[var(--color-window-border,#cbd5e1)]",
        config.axis === "vertical" ? "w-full flex-1 min-h-0" : "h-full flex-1 min-w-0"
      )}
    >
      {/* Encabezado con soporte completo de variables de Contrato Visual */}
      <div 
        className="h-6 flex items-center justify-between px-2 flex-shrink-0 border-b border-[var(--color-window-border,#cbd5e1)]"
        style={{
          backgroundColor: "var(--color-window-header, #1f2937)",
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-white truncate">
            {win.title || "Panel Acoplado"}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Botón Desacoplar (Undock) */}
          <button
            onClick={() => undockWin(win.id)}
            className="flex items-center justify-center w-4 h-4 rounded hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Desacoplar Ventana"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
              <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
            </svg>
          </button>
          
          {/* Botón Cerrar (Close) */}
          <button
            onClick={() => closeWin(win.id)}
            className="flex items-center justify-center w-4 h-4 rounded hover:bg-red-600 text-gray-300 hover:text-white transition-all"
            title="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de negocio interna */}
      <div 
        className="flex-1 overflow-auto bg-[var(--color-window-content,#ffffff)] text-[var(--color-window-text,#1f2937)] min-h-0"
        style={{ padding: "var(--spacing-window-padding, 0.5rem)" }}
      >
        <FenestraeWinRenderer win={win} closeWin={closeWin} />
      </div>
    </div>
  );
});

FenestraeDockedWindow.propTypes = {
  win: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  closeWin: PropTypes.func.isRequired,
};

FenestraeDockedWindow.displayName = "FenestraeDockedWindow";

export default FenestraeDockZone;