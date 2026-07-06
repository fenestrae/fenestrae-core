import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer"; // 🔹 Vinculación al renderer purificado
import FenestraeButton from "../components/FenestraeButton"; // 🔹 Vinculación al botón purificado
import { useDraggable, useResizable } from "./Useresizeble";
import { winStore } from "../core";

const FenestraeWinModal = React.memo(({ win, index, activeWinId, setActiveWinId }) => {
  const self = win; // Mantenemos tu convención 'self' para el contexto de la ventana

  // 🔹 Selectores atómicos para evitar re-renders por cambios en estados ajenos del store
  const updateWinLayout = winStore((s) => s.updateWinLayout);
  const closeWin = winStore((s) => s.closeWin);

  // 1. Coordenadas iniciales con fallback seguro de cascada geométrica
  const currentX = self.x !== undefined ? self.x : 150 + index * 30;
  const currentY = self.y !== undefined ? self.y : 150 + index * 30;
  const currentW = self.width || 600;
  const currentH = self.height || 450;

  // 2. Hook de Redimensionamiento
  const { size, posAdj, isResizing } = useResizable(
    currentW,
    currentH,
    currentX,
    currentY,
    (layout) => updateWinLayout(self.id, layout)
  );

  // 3. Hook de Arrastre con callback de sincronización
  const { position, isDragging, handleMouseDown } = useDraggable(
    currentX,
    currentY,
    (pos) => updateWinLayout(self.id, { x: Math.round(pos.x), y: Math.round(pos.y) })
  );

  // 4. Lógica de renderizado fluido combinado (Aceleración por hardware en GPU)
  const finalX = isResizing ? currentX + posAdj.x : position.x;
  const finalY = isResizing ? currentY + posAdj.y : position.y;

  const contentRef = useRef(null);

  // 5. Auto-ajuste de dimensiones según el contenido inyectado
  useEffect(() => {
    if (!self.autoSize || self.state === "maximized") return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.target.getBoundingClientRect();

        const targetWidth = width + 10;
        const targetHeight = height + 45; // 45px aproximados de cabecera

        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.95;

        updateWinLayout(self.id, {
          width: Math.min(targetWidth, maxWidth),
          height: Math.min(targetHeight, maxHeight),
          align: self.align,
        });
      }
    });

    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [self.autoSize, self.align, self.id, updateWinLayout, self.state]);

  // Estilos de composición interna para la caja del modal flotante
  const modalBoxStyles = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    position: "absolute",
    top: 0,
    left: 0,
    // 🚀 Activamos translate3d real para un movimiento ultra-fluido de 60fps sin jittering
    transform: `translate3d(${finalX}px, ${finalY}px, 0)`,
    zIndex: activeWinId === self.id ? 2000 : 1000 + index,
    display: "flex",
    flexDirection: "column",
    willChange: isDragging || isResizing ? "transform, width, height" : "auto",
    pointerEvents: "auto",
  };

  const handleFocus = useCallback(() => {
    if (activeWinId !== self.id && typeof setActiveWinId === "function") {
      setActiveWinId(self.id);
    }
  }, [activeWinId, self.id, setActiveWinId]);

  if (win.visible === false) return null;

  return (
    <div
      className="fixed inset-0 z-[1800] bg-gray-950/40 backdrop-blur-[1px] pointer-events-auto"
      onMouseDown={handleFocus}
    >
      <div
        style={modalBoxStyles}
        className={clsx(
          "bg-[var(--color-window-bg,#ffffff)] border-[var(--color-window-border,#d1d5db)] rounded-xl shadow-2xl overflow-hidden border",
          activeWinId === self.id ? "ring-2 ring-blue-500/40" : "shadow-md",
          isDragging && "opacity-90 cursor-grabbing"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal (Zona de arrastre activa) */}
        <div
          className="flex-shrink-0 border-b p-3 flex justify-between items-center bg-[var(--color-window-header,#fafafa)] border-[var(--color-window-border,#cbd5e1)] select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <h3 className="font-bold text-[var(--color-window-text,#1f2937)] flex items-center gap-2 uppercase text-[10px] font-mono tracking-wider">
            <span className="text-blue-500">■</span>
            {self.title || "Formulario Flotante"}
          </h3>

          <FenestraeButton
            variant="ghost"
            iconIndex={3} // Icono de X / Cerrar universal de Fenestrae
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeWin(self.id);
            }}
          />
        </div>

        {/* Contenedor del Módulo / Vista de Negocio */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-auto bg-[var(--color-window-content,#ffffff)] min-h-0"
          style={{ padding: "var(--spacing-window-padding, 0rem)" }}
        >
          <FenestraeWinRenderer win={self} closeWin={closeWin} />
        </div>
      </div>
    </div>
  );
});

FenestraeWinModal.propTypes = {
  win: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    autoSize: PropTypes.bool,
    state: PropTypes.string,
    align: PropTypes.string,
    visible: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  activeWinId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinModal.displayName = "FenestraeWinModal";

export default FenestraeWinModal;