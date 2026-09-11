import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import FNButton from "../components/FNButton";
import { useDraggable, ResizeHandles, useResizable } from "./UseResizable";
import { winStore } from "../core";
import { WIN_TYPES, WIN_ALIGN } from "../store/types";

const FenestraeWinFloating = React.memo(({ win, index, isActive, setActiveWinId }) => {
  const self = win;

  // 🔹 Selectores de Zustand atómicos
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

  // 3. Hook de Arrastre
  const { position, isDragging, handleMouseDown } = useDraggable(
    currentX,
    currentY,
    (pos) => updateWinLayout(self.id, { x: Math.round(pos.x), y: Math.round(pos.y) })
  );

  // 4. Lógica de renderizado combinada
  const finalX = isResizing ? currentX + posAdj.x : position.x;
  const finalY = isResizing ? currentY + posAdj.y : position.y;
  const finalW = isResizing ? size.width : currentW;
  const finalH = isResizing ? size.height : currentH;

  const contentRef = useRef(null);


  const [isMobileView, setIsMobileView] = React.useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);


  // 5. Auto-ajuste de dimensiones reactivo al contenido interno
  useEffect(() => {
    if (!self.autoSize || self.state === "maximized") return;

    let rafId = null;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.target.getBoundingClientRect();

        const targetWidth = Math.ceil(width + 10);
        const targetHeight = Math.ceil(height + 45);

        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.95;

        rafId = requestAnimationFrame(() => {
          updateWinLayout(self.id, {
            width: Math.min(targetWidth, maxWidth),
            height: Math.min(targetHeight, maxHeight),
            align: self.align || WIN_ALIGN.NONE,
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

  const isTopWindow = self.type === WIN_TYPES.TOP;

  const combinedStyles = isMobileView
    ? {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 5000 + index,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      borderRadius: 0,
      boxShadow: "none",
      pointerEvents: "auto",
    }
    : {
      width: `${finalW}px`,
      height: `${finalH}px`,
      transform: `translate3d(${finalX}px, ${finalY}px, 0)`,
      zIndex: isTopWindow ? 2000 + index : isActive ? 1000 : 50 + index,
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
    <>
      {(isDragging || isResizing) && (

        <div
          style={{
            position: "fixed",
            top: finalY - 400,
            left: finalX - 400,
            width: finalW + 800,
            height: finalH + 800,
            background: "transparent",
            zIndex: combinedStyles.zIndex - 1, // debajo de la ventana FLOAT
            pointerEvents: "auto",
          }}
        />
      )}

      <div
        style={combinedStyles}
        className={clsx(
          // Estilos base con variables CSS
          "shadow-2xl rounded-lg overflow-hidden transition-shadow duration-150",
          "bg-[var(--color-window-bg,#ffffff)]",
          "border border-[var(--color-window-border,#d1d5db)]",
          // Estado activo vs inactivo
          isActive
            ? "ring-2 ring-[var(--color-window-active-border,#0a6ed1)]/50 shadow-[var(--color-window-active-border,#0a6ed1)]/5"
            : "opacity"
        )}
        onMouseDown={handleFocus}
      >
        {isMobileView ? (
          <div
            className="px-4 py-3 flex items-center justify-between border-b bg-gray-100"
            style={{ flexShrink: 0 }}
          >
            {/* ⭐ Botón atrás siempre a la izquierda */}
            <FNButton
              variant="close"
              iconIndex={6}      // flecha atrás
              size="md"
              title="Atrás"
              onClick={(e) => {
                e.stopPropagation();
                closeWin(self.id);
              }}
              className="text-gray-700"
            />

            {/* ⭐ Título centrado */}
            <div className="text-sm font-bold flex-1 text-center">
              {self.title}
            </div>

            {/* ⭐ Espacio simétrico para centrar el título */}
            <div style={{ width: 32 }} />
          </div>
        ) : (

          <div
            className="handle-movible px-3 py-1.5 flex justify-between items-center select-none cursor-move shrink-0 border-b"
            style={{
              // Fondo según estado activo/inactivo
              backgroundColor: isActive
                ? "var(--color-window-header, #1e293b)"
                : "var(--color-window-header-inactive, #94a3b8)",
              // Color de texto según estado
              color: isActive
                ? "var(--color-window-header-text, #ffffff)"
                : "var(--color-window-header-inactive-text, #f1f5f9)",
              // Borde inferior
              borderBottomColor: "var(--color-window-border, #d1d5db)",
              // Dirección (para soporte RTL)
              flexDirection: "var(--fn-header-direction, row)",
              // Transición suave
              transition: "background-color 150ms ease, color 150ms ease",
            }}
            onMouseDown={(e) => {
              handleFocus();
              if (self.align && self.align !== WIN_ALIGN.NONE) {
                updateWinLayout(self.id, { align: WIN_ALIGN.NONE, autoSize: false });
              }
              handleMouseDown(e);
            }}
            onDoubleClick={() => maximizeWin(self.id)}
          >
            {/* Identificador / Título */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Indicador de estado (activo/inactivo) */}
              <span
                className={clsx(
                  "w-2 h-2 rounded-full transition-colors duration-150 shrink-0",
                  isActive
                    ? "bg-[var(--color-fn-success,#22c55e)]"
                    : "bg-[var(--color-fn-text-muted,#9ca3af)]"
                )}
              />
              <span className="text-[11px] font-bold uppercase tracking-wider select-none truncate">
                {self.title || "Ventana Flotante"}
              </span>
            </div>

            {/* 🔹 Barra de Controles - USANDO LAS NUEVAS VARIANTES */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {/* Minimizar */}
              <FNButton
                variant={"minimize"}
                iconIndex={2}
                title="Minimizar"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWin(self.id);
                }}
              />

              {/* Maximizar / Restaurar */}
              <FNButton
                variant={"maximize"}
                iconIndex={self.state === "maximized" ? 4 : 3}
                title={self.state === "maximized" ? "Restaurar" : "Maximizar"}
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  maximizeWin(self.id);
                }}
              />

              {/* Cerrar */}
              <FNButton
                variant="close"
                iconIndex={1}
                title="Cerrar"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  closeWin(self.id);
                }}
              />
            </div>
          </div>
        )}

        {/* 📄 CONTENEDOR DE CONTENIDO */}
        <div
          ref={contentRef}
          className="flex-1 min-h-0"
          style={{
            backgroundColor: "var(--color-window-content, #fafafa)",
            color: "var(--color-window-text, #1f2937)",
            padding: "var(--spacing-window-padding, 1rem)",
          }}
          onMouseDown={(e) => {
            handleFocus();
            e.stopPropagation();
          }}
        >
          {/* ⭐ CAPA ANTI-IFRAME DURANTE DRAG/RESIZE */}


          <FenestraeWinRenderer
            win={self}
            closeWin={closeWin}
            inputLocked={isDragging || isResizing}
          />
        </div>

        {/* 📐 MARCOS ACTIVOS DE REDIMENSIONAMIENTO */}
        {(isActive || isResizing) && (
          <ResizeHandles
            active={isActive}
            onStart={handleResizeStart}
          />
        )}
      </div>
    </>
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
  isActive: PropTypes.bool,
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinFloating.displayName = "FenestraeWinFloating";

export default FenestraeWinFloating;