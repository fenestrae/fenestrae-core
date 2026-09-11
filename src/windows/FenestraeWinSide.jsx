// ============================================================================
// FENESTRAE - FenestraeWinSide (components/FenestraeWinSide.jsx)
// Side-panel / Drawer window container (Fiori Style Side Panel).
// ============================================================================

import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import FNButton from "../components/FNButton";
import { winStore } from "../core";
import { WIN_ALIGN } from "../store/types";

const FenestraeWinSide = React.memo(({ win, activeWinId, setActiveWinId }) => {
  // 🔹 Selectores atómicos para evitar re-renders globales del store
  const closeWin = winStore((s) => s.closeWin);
  const updateWinLayout = winStore((s) => s.updateWinLayout);
  
  const self = win;
  const resizeRef = useRef({ startX: 0, startWidth: 0 });

  // --- Efecto para ajustar dimensiones si el navegador cambia de tamaño -------
  useEffect(() => {
    const handleResize = () => {
      if (self.align === WIN_ALIGN.AL_SIDE) {
        updateWinLayout(self.id, { 
          height: window.innerHeight,
          x: window.innerWidth - (self.width ?? 400) 
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [self.width, self.id, self.align, updateWinLayout]);

  // --- Lógica nativa de redimensión del Eje X (Hacia la izquierda) ------------
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Enfocar ventana al interactuar con el borde
    if (activeWinId !== self.id) setActiveWinId(self.id);

    resizeRef.current = {
      startX: e.clientX,
      startWidth: self.width ?? 400
    };

    const handlePointerMove = (moveEvent) => {
      // Al redimensionar desde la derecha de la pantalla hacia la izquierda,
      // mover el ratón a la izquierda disminuye el clientX, incrementando el ancho real.
      const deltaX = resizeRef.current.startX - moveEvent.clientX;
      const newWidth = Math.max(250, Math.min(resizeRef.current.startWidth + deltaX, window.innerWidth * 0.85));
      
      updateWinLayout(self.id, { 
        width: Math.round(newWidth),
        x: window.innerWidth - Math.round(newWidth)
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "default";
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.body.style.cursor = "ew-resize";
  }, [self.id, self.width, activeWinId, setActiveWinId, updateWinLayout]);

  // --- Estilos Estructurados --------------------------------------------------
  const isActive = activeWinId === self.id;
  const currentWidth = self.width ?? 400;

  const style = {
    position: "fixed",
    top: 0,
    right: 0,
    width: `${currentWidth}px`,
    height: "100vh",
    zIndex: 3000, // Z-index prioritario sobre contenedores Top flotantes
    display: self.visible ? "flex" : "none",
    flexDirection: "column",
    boxShadow: "-5px 0 15px rgba(0,0,0,0.15)",
    transition: "transform 0.2s ease-out, width 0.05s linear", // Fluidez de apertura y rendimiento en redimensión
    transform: self.visible ? "translateX(0)" : "translateX(100%)",
    backgroundColor: "var(--color-window-bg, #ffffff)",
  };

  return (
    <div 
      style={style}
      className={clsx(
        "border-l shadow-2xl transition-shadow",
        isActive 
          ? "border-[var(--color-window-active-border,#4b5563)] ring-1 ring-[var(--color-window-active-border,#4b5563)]" 
          : "border-[var(--color-window-border,#cbd5e1)] opacity-98"
      )}
      onMouseDown={() => activeWinId !== self.id && setActiveWinId(self.id)}
    >
      {/* CABECERA ESTILO FIORI SIDE PANEL */}
      <div 
        className={clsx(
          "h-10 flex justify-between items-center px-4 shrink-0 select-none transition-colors duration-200",
          isActive
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
            : "bg-gray-100 text-gray-600"
        )}
        style={{
          backgroundColor: isActive ? "var(--color-window-header,#1f2937)" : "var(--color-window-header-inactive,#e2e8f0)",
          color: isActive ? "var(--color-window-header-text,#ffffff)" : "var(--color-window-header-inactive-text,#4b5563)"
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden mr-4">
          <div className={clsx(
            "w-2 h-2 rounded-full shadow-inner flex-shrink-0",
            isActive ? "bg-yellow-400 animate-pulse" : "bg-gray-400",
          )} />
          <span className="text-xs font-bold uppercase tracking-widest truncate">
            {self.title || "Búsqueda Avanzada"}
          </span>
        </div>

        <FNButton
                          className="fn-btn fn-btn-close"
                          iconIndex={1}
                          title="Cerrar"
                          size="md"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeWin(self.id);
                          }}
                        />
      </div>

      {/* CUERPO DEL MATCHCODE / RENDERIZADOR */}
      <div 
        className="flex-1 overflow-y-auto bg-[var(--color-window-content,#ffffff)] text-[var(--color-window-text,#1f2937)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <FenestraeWinRenderer win={self} closeWin={closeWin} /> 
      </div>

      {/* CONTROL DE REDIMENSIÓN (Borde Izquierdo - Eje X Inverso) */}
      <div 
        className="absolute left-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-[var(--color-window-active-border,rgba(234,179,8,0.6))] transition-colors z-[3001]"
        onMouseDown={handleResizeStart}
      />
    </div>
  );
});

FenestraeWinSide.propTypes = {
  win: PropTypes.object.isRequired,
  activeWinId: PropTypes.string,
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinSide.displayName = "FenestraeWinSide";

export default FenestraeWinSide;