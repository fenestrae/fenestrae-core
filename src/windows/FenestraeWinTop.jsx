// ============================================================================
// FENESTRAE - FenestraeWinTop (components/FenestraeWinTop.jsx)
// Floating / always-on-top window container.
// ============================================================================

import React, { useEffect, useRef, useCallback, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import { useDraggable, useResizable, ResizeHandles } from "./Useresizeble";
import { winStore } from "../core";

const FenestraeWinTop = React.memo(({ win, index, activeWinId, setActiveWinId }) => {
  // 🔹 Selectores atómicos e individuales de Zustand para mitigar re-renders globales
  const updateWinLayout = winStore((s) => s.updateWinLayout);
  const closeWin = winStore((s) => s.closeWin);
  const minimizeWin = winStore((s) => s.minimizeWin);
  const maximizeWin = winStore((s) => s.maximizeWin);
  const dockWin = winStore((s) => s.dockWin);
  const undockWin = winStore((s) => s.undockWin);

  const x = win.x ?? 150 + index * 30;
  const y = win.y ?? 150 + index * 30;
  const w = win.width ?? 600;
  const h = win.height ?? 450;

  // --- Resize ----------------------------------------------------------------
  const { size, posAdj, isResizing, handleResizeStart } = useResizable(
    w, h, x, y,
    (layout) => updateWinLayout(win.id, layout)
  );

  // --- Drag ------------------------------------------------------------------
  const { position, isDragging, handleMouseDown } = useDraggable(
    x, y,
    (pos) => updateWinLayout(win.id, { x: Math.round(pos.x), y: Math.round(pos.y) }),
    { winId: win.id, dockable: true }
  );

  const finalX = isResizing ? x + posAdj.x : position.x;
  const finalY = isResizing ? y + posAdj.y : position.y;

  // --- AutoSize via ResizeObserver ------------------------------------------
  const contentRef = useRef(null);
  const updateLayoutRef = useRef(updateWinLayout);
  updateLayoutRef.current = updateWinLayout;

  useEffect(() => {
    if (!win.autoSize || win.state === "maximized") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.target.getBoundingClientRect();
        updateLayoutRef.current(win.id, {
          width: Math.min(width + 10, window.innerWidth * 0.95),
          height: Math.min(height + 45, window.innerHeight * 0.95),
          align: win.align,
        });
      }
    });

    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [win.id, win.autoSize, win.state, win.align]);

  // --- Dock events -----------------------------------------------------------
  const [dockHint, setDockHint] = useState(null);

  useEffect(() => {
    const onHint = (e) => {
      if (!e.detail) return;
      if (e.detail.winId === win.id) {
        setDockHint(e.detail.zone); 
      }
    };

    const onDrop = (e) => {
      if (!e.detail) return;
      if (e.detail.winId === win.id && e.detail.zone) {
        dockWin(win.id, e.detail.zone);
        setDockHint(null);
      }
    };

    window.addEventListener("fenestrae:dockHint", onHint);
    window.addEventListener("fenestrae:dockDrop", onDrop);

    return () => {
      window.removeEventListener("fenestrae:dockHint", onHint);
      window.removeEventListener("fenestrae:dockDrop", onDrop);
    };
  }, [win.id, dockWin]);

  // --- Focus -----------------------------------------------------------------
  const isActive = activeWinId === win.id;

  const handleFocus = useCallback(() => {
    if (!isActive) setActiveWinId(win.id);
  }, [isActive, win.id, setActiveWinId]);

  const showMinimize = win.params?.showMinimize !== false;
  const showMaximize = win.params?.showMaximize !== false;
  const showClose = win.params?.showClose !== false;

  const handleHeaderMouseDown = useCallback((e) => {
    handleFocus();
    if (win.align !== "none") {
      updateWinLayout(win.id, { align: "none", autoSize: false });
    }
    handleMouseDown(e);
  }, [handleFocus, win.align, win.id, updateWinLayout, handleMouseDown]);

  // --- Styles ----------------------------------------------------------------
  const combinedStyle = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    transform: `translate3d(${finalX}px, ${finalY}px, 0)`,
    zIndex: win.type === "top"
      ? 2000 + index
      : isActive ? 1000 : 50 + index,
    position: win.isPortal ? "fixed" : "absolute",
    top: 0,
    left: 0,
    display: win.visible ? "flex" : "none",
    flexDirection: "column",
    willChange: isDragging || isResizing ? "transform, width, height" : "auto",
    pointerEvents: "auto", 
    backgroundColor: "var(--color-window-bg, #ffffff)",
  };

  return (
    <div
      style={combinedStyle}
      className={clsx(
        "shadow-xl border rounded-md overflow-hidden flex flex-col transition-shadow duration-150",
        isActive 
          ? "border-[var(--color-window-active-border,#4b5563)] ring-1 ring-[var(--color-window-active-border,#4b5563)] shadow-2xl" 
          : "border-[var(--color-window-border,#cbd5e1)] opacity-95",
        dockHint && "ring-2 ring-blue-500 ring-offset-1",
      )}
      onMouseDown={handleFocus}
    >
      {/* HEADER */}
      <div
        className={clsx(
          "handle-movible h-7 flex justify-between items-center select-none",
          "cursor-move shrink-0 px-2 transition-colors duration-200",
          isActive
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
            : "bg-gray-200 text-gray-600",
        )}
        style={{
          backgroundColor: isActive ? "var(--color-window-header,#1f2937)" : "var(--color-window-header-inactive,#e2e8f0)",
          color: isActive ? "var(--color-window-header-text,#ffffff)" : "var(--color-window-header-inactive-text,#4b5563)"
        }}
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => showMaximize && maximizeWin(win.id)}
      >
        {/* Left: indicator + title */}
        <div className="flex items-center gap-2 overflow-hidden mr-4">
          <div className={clsx(
            "w-2 h-2 rounded-full shadow-inner flex-shrink-0",
            dockHint ? "bg-blue-500 animate-ping" :
            isActive ? "bg-yellow-400 animate-pulse" : "bg-gray-400",
          )} />
          <span className="text-[10px] font-bold uppercase tracking-tight truncate">
            {dockHint ? `Acoplar en ${dockHint.toUpperCase()}` : (win.title || "Ventana")}
          </span>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-0.5" onMouseDown={(e) => e.stopPropagation()}>
          {win.docked && (
            <button
              onClick={() => undockWin(win.id)}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-blue-500 hover:text-white text-gray-400 transition-all mr-1"
              title="Desacoplar Ventana"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
              </svg>
            </button>
          )}
          
          {(showMinimize || showMaximize || showClose) && <div className="h-5 w-px bg-gray-400/40 mx-1" />}
          
          {showMinimize && (
            <button
              onClick={() => minimizeWin(win.id)}
              className={clsx(
                "flex items-center justify-center w-5 h-5 rounded transition-all",
                isActive ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-300 text-gray-500",
              )}
              title="Minimizar"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M19 13H5v-2h14v2z" />
              </svg>
            </button>
          )}

          {showMaximize && (
            <button
              onClick={() => maximizeWin(win.id)}
              className={clsx(
                "flex items-center justify-center w-5 h-5 rounded transition-all",
                isActive ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-300 text-gray-500",
              )}
              title="Maximizar"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M3 3h8v2H5v6H3V3zm10 0h8v8h-2V5h-6V3zM3 13h2v6h6v2H3v-8zm16 6h-6v2h8v-8h-2v6z" />
              </svg>
            </button>
          )}

          {showClose && (
            <button
              onClick={() => closeWin(win.id)}
              className={clsx(
                "flex items-center justify-center w-5 h-5 rounded transition-all",
                isActive ? "hover:bg-red-500 hover:text-white text-gray-300" : "hover:bg-gray-300 text-gray-500",
              )}
              title="Cerrar"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* BODY */}
      <div
        ref={contentRef}
        className={clsx(
          "flex-1 overflow-auto min-h-0 bg-[var(--color-window-content,#ffffff)] text-[var(--color-window-text,#1f2937)]",
          (isDragging || isResizing) && "pointer-events-none select-none"
        )}
        onMouseDown={(e) => { handleFocus(); e.stopPropagation(); }}
      >
        <FenestraeWinRenderer win={win} closeWin={closeWin} />
      </div>

      {/* RESIZE HANDLES */}
      {(isActive || isResizing) && (
        <ResizeHandles active={isActive} onStart={handleResizeStart} />
      )}
    </div>
  );
});

FenestraeWinTop.propTypes = {
  win: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  activeWinId: PropTypes.string,
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinTop.displayName = "FenestraeWinTop";

export default FenestraeWinTop;