import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer"; // 🔹 Vinculación al renderer unificado
import FenestraeButton from "../components/FenestraeButton"; // 🔹 Vinculación al botón unificado
import { useDraggable, ResizeHandles, useResizable } from "./Useresizeble";
import { winStore } from "../core";

const FenestraeWinFloating = React.memo(({ win, index, activeWinId, setActiveWinId }) => {
  const self = win; // Manteniendo la convención de contexto 'self'

  // 🔹 Selectores de Zustand atómicos (evitan renderizados innecesarios)
  const updateWinLayout = winStore((s) => s.updateWinLayout);
  const closeWin = winStore((s) => s.closeWin);
  const minimizeWin = winStore((s) => s.minimizeWin);
  const maximizeWin = winStore((s) => s.maximizeWin);

  // 1. Extraemos los valores del store con fallbacks seguros
  const currentX = self.x !== undefined ? self.x : 150 + index * 30;
  const currentY = self.y !== undefined ? self.y : 150 + index * 30;
  const currentW = self.width || 600;
  const currentH = self.height || 450;

  // 2. Hook de Redimensionamiento
  const { size, posAdj, isResizing, handleResizeStart } = useResizable(
    currentW,
    currentH,
    currentX,
    currentY,
    (layout) => updateWinLayout(self.id, layout)
  );

  const isActive = activeWinId === self.id;

  // 3. Hook de Arrastre
  const { position, isDragging, handleMouseDown } = useDraggable(
    currentX,
    currentY,
    (pos) => updateWinLayout(self.id, { x: Math.round(pos.x), y: Math.round(pos.y) })
  );

  // 4. Lógica de renderizado combinada (Flotación estricta y reactiva)
  const finalX = isResizing ? currentX + posAdj.x : position.x;
  const finalY = isResizing ? currentY + posAdj.y : position.y;
  
  // Si se está ejecutando un redimensionamiento manual por gestos, usamos el tamaño del hook.
  // Si está en reposo o auto-calculándose por metadata, mandan las propiedades del store de forma directa.
  const finalW = isResizing ? size.width : currentW;
  const finalH = isResizing ? size.height : currentH;

  const contentRef = useRef(null);

  // 5. Auto-ajuste de dimensiones reactivo al contenido interno (Desacoplado vía RAF)
  useEffect(() => {
    if (!self.autoSize || self.state === "maximized") return;

    let rafId = null;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.target.getBoundingClientRect();

        // 45px de cabecera estándar + Margen de seguridad perimetral
        const targetWidth = Math.ceil(width + 10);
        const targetHeight = Math.ceil(height + 45);

        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.95;

        // Desacoplamos del bucle de layout síncrono del navegador para evitar Layout Thrashing
        rafId = requestAnimationFrame(() => {
          updateWinLayout(self.id, {
            width: Math.min(targetWidth, maxWidth),
            height: Math.min(targetHeight, maxHeight),
            align: self.align || "none",
          });
        });
      }
    });

    if (contentRef.current) observer.observe(contentRef.current);
    
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [self.autoSize, self.align, self.id, updateWinLayout, self.state]);

  const isTopWindow = self.type === "top";

  // Composición de estilos para la capa flotante acelerada por hardware
  const combinedStyles = {
    width: `${finalW}px`,
    height: `${finalH}px`,
    transform: `translate3d(${finalX}px, ${finalY}px, 0)`,
    zIndex: isTopWindow
      ? 2000 + index
      : (isActive ? 1000 : 50 + index),
    position: self.isPortal ? "fixed" : "absolute",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    willChange: isDragging || isResizing ? "transform, width, height" : "auto",
    pointerEvents: "auto",
    ...(self.visible === false ? { display: "none" } : {})
  };

  const handleFocus = useCallback(() => {
    if (!isActive && typeof setActiveWinId === "function") {
      setActiveWinId(self.id);
    }
  }, [isActive, self.id, setActiveWinId]);

  return (
    <div
      style={combinedStyles}
      className={clsx(
        "shadow-2xl border rounded-lg overflow-hidden transition-shadow duration-150",
        "bg-[var(--color-window-bg,#ffffff)] border-[var(--color-window-border,#cbd5e1)]",
        isActive ? "ring-2 ring-blue-500/50 shadow-blue-500/5" : "opacity-95"
      )}
      onMouseDown={handleFocus}
    >
      {/* 🖥️ CABECERA DE VENTANA (Manejador de Arrastre) */}
      <div
        className="handle-movible px-3 py-1.5 flex justify-between items-center select-none cursor-move shrink-0 border-b"
        style={{
          background: isActive
            ? "var(--color-window-header, #1f2937)"
            : "var(--color-window-header-inactive, #e2e8f0)",
          color: isActive
            ? "var(--color-window-header-text, #ffffff)"
            : "var(--color-window-header-inactive-text, #4b5563)",
          borderColor: "var(--color-window-border, #cbd5e1)",
          flexDirection: "var(--fn-header-direction, row)",
        }}
        onMouseDown={(e) => {
          handleFocus();
          if (self.align && self.align !== "none") {
            updateWinLayout(self.id, { align: "none", autoSize: false });
          }
          handleMouseDown(e);
        }}
        onDoubleClick={() => maximizeWin(self.id)}
      >
        {/* Identificador / Título */}
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "w-2 h-2 rounded-full transition-colors duration-150",
              isActive ? "bg-green-400" : "bg-gray-500"
            )}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider select-none">
            {self.title || "Ventana Flotante"}
          </span>
        </div>

        {/* Barra de Controles Universales (Min, Max, Close) */}
        <div className="flex items-center gap-1">
          <FenestraeButton
            variant="ghost"
            iconIndex={2}
            title="Minimizar"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWin(self.id);
            }}
          />
          <FenestraeButton
            variant="ghost"
            iconIndex={self.state === "maximized" ? 3 : 4}
            title={self.state === "maximized" ? "Restaurar" : "Maximizar"}
            onClick={(e) => {
              e.stopPropagation();
              maximizeWin(self.id);
            }}
          />
          <FenestraeButton
            variant="ghost"
            iconIndex={1}
            title="Cerrar"
            className="hover:bg-red-600 hover:text-white transition-colors duration-150"
            onClick={(e) => {
              e.stopPropagation();
              closeWin(self.id);
            }}
          />
        </div>
      </div>

      {/* 📄 CONTENEDOR DE CONTENIDO DE NEGOCIO */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto bg-[var(--color-window-content,#ffffff)] text-[var(--color-window-text,#1f2937)] min-h-0"
        style={{ padding: "var(--spacing-window-padding, 1rem)" }}
        onMouseDown={(e) => {
          handleFocus();
          e.stopPropagation();
        }}
      >
        <FenestraeWinRenderer win={self} closeWin={closeWin} />
      </div>

      {/* 📐 MARCOS ACTIVOS DE REDIMENSIONAMIENTO (BORDES) */}
      {(isActive || isResizing) && (
        <ResizeHandles
          active={isActive}
          onStart={handleResizeStart}
        />
      )}
    </div>
  );
});

FenestraeWinFloating.propTypes = {
  win: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    type: PropTypes.string,
    state: PropTypes.string,
    align: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    autoSize: PropTypes.bool,
    isPortal: PropTypes.bool,
    visible: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  activeWinId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinFloating.displayName = "FenestraeWinFloating";

export default FenestraeWinFloating;