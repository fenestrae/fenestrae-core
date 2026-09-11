import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useShallow } from "zustand/react/shallow";
import { winStore } from "../core";
import { selectDockedInZone } from "../core/windowSelectors";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import FNButton from "../components/FNButton";


const ZONE_BASE_CONFIG = {
  left: { axis: "vertical", cls: "h-full flex-shrink-0 flex-row", resizeDir: "e" },
  right: { axis: "vertical", cls: "h-full flex-shrink-0 flex-row-reverse", resizeDir: "w" },
  top: { axis: "horizontal", cls: "w-full flex-shrink-0 flex-col", resizeDir: "s" },
  bottom: { axis: "horizontal", cls: "w-full flex-shrink-0 flex-col-reverse", resizeDir: "n" },
};

const FenestraeDockZone = React.memo(({ zone, initialSize }) => {
  const config = ZONE_BASE_CONFIG[zone];
  const [hint, setHint] = useState(false);
  const defaultFallback = config.axis === "vertical" ? 256 : 192;
  const [customSize, setCustomSize] = useState(initialSize ?? defaultFallback);
  const isResizingRef = useRef(false);

  const closeWin = winStore((self) => self.closeWin);
  const dockedWins = winStore(
    useShallow((s) => selectDockedInZone(s.wins, zone)),
  );

  useEffect(() => {
    if (initialSize !== undefined) {
      setCustomSize(initialSize);
    }
  }, [initialSize]);

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

      if (zone === "left") newSize = startSize + deltaX;
      if (zone === "right") newSize = startSize - deltaX;
      if (zone === "top") newSize = startSize + deltaY;
      if (zone === "bottom") newSize = startSize - deltaY;

      const minSize = 40; // Un poco más de margen para evitar colapsos visuales de headers
      const maxSize = config.axis === "vertical" ? window.innerWidth * 0.45 : window.innerHeight * 0.45;
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
  initialSize: PropTypes.number
};

FenestraeDockZone.displayName = "FenestraeDockZone";

// ─────────────────────────────────────────────────────────────────────────────
const FenestraeDockedWindow = React.memo(({ win, config, closeWin }) => {
  const undockWin = winStore((self) => self.undockWin);

  return (
    <div
      className={clsx(
        "flex flex-col border overflow-hidden bg-[var(--color-window-bg,#ffffff)] border-[var(--color-window-border,#cbd5e1)]",
        config.axis === "vertical" ? "w-full flex-1 min-h-0" : "h-full flex-1 min-w-0"
      )}
    >
      {/* Encabezado con soporte completo de variables de Contrato Visual */}
      <div
        className="h-6 flex items-center justify-between px-2 flex-shrink-0 border-b border-[var(--color-window-border,#cbd5e1)] bg-[var(--color-window-header,#1f2937)]"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-window-header-text,#ffffff)] truncate">
            {win.title || "Panel Acoplado"}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Botón Desacoplar (Undock) */}

          <FNButton
            className="fn-btn fn-btn-minimize"
            iconIndex={6}
            title="Detach Window"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              undockWin(win.id);
            }}
          />

          {/* Botón Cerrar (Close) */}

          <FNButton
            className="fn-btn fn-btn-close"
            iconIndex={1}
            title="Close"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              closeWin(win.id);
            }}
          />
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