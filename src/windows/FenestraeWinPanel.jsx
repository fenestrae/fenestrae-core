import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeWinRenderer from "./FenestraeWinRenderer"; // 🔹 Vinculado al nuevo renderer purificado
import { winStore } from "../core";
import { WIN_ALIGN } from "../store/types"; // Ajustado a tu exportación del core

const FenestraeWinPanel = React.memo(({ win, index, isActive, setActiveWinId }) => {
  const { id, width, height, align, x, y } = win;
  
  // 🔹 Selector optimizado para evitar re-renders masivos por cambios en otros estados del store
  const closeWin = winStore((s) => s.closeWin);

  // Calculamos el estilo dinámicamente según el tipo de alineación geométrica
  const getStyle = () => {
    const baseStyle = {
      width: `${width}px`,
      height: `${height}px`,
      zIndex: 1000 + index,
      position: "absolute",
    };

    if (align === WIN_ALIGN.NONE) {
      // Coordenadas flotantes libres o calculadas relativas al lienzo padre
      return {
        ...baseStyle,
        left: `${x}px`,
        top: `${y}px`,
        transform: "none",
      };
    }
   
    // Comportamiento de estiramiento estructural para paneles perimetrales anclados
    return {
      ...baseStyle,
      width: align === WIN_ALIGN.AL_BOTTOM ? "100%" : `${width}px`,
      height: align === WIN_ALIGN.AL_BOTTOM ? `${height}px` : "100%",
      transform: "none", // 🔹 Corregido: removido !important inline no válido en React
    };
  };

  const alignClasses = clsx(
    // Clases anatómicas base mapeadas a variables CSS del contrato visual de Fenestrae
    "bg-[var(--color-window-bg,#ffffff)] border-[var(--color-window-border,#d1d5db)] shadow-xl z-20 flex flex-col border",
    {
      "top-0 right-0 h-full": align === WIN_ALIGN.AL_RIGHT,
      "top-0 left-0 h-full": align === WIN_ALIGN.AL_LEFT,
      "bottom-0 left-0 w-full": align === WIN_ALIGN.AL_BOTTOM,
      // Si align es "none", manda el objeto style posicionado por coordenadas (x,y)
    },
    // Efecto visual sutil si el panel es la ventana activa del viewport
    isActive && "ring-1 ring-blue-500/20"
  );

  return (
    <div
      style={getStyle()}
      className={alignClasses}
      onMouseDown={() => {
        if (!isActive && typeof setActiveWinId === "function") {
          setActiveWinId(id);
        }
      }}
    >
      <div 
        className="flex-1 overflow-auto bg-[var(--color-window-content,#fafafa)]"
        style={{ padding: "var(--spacing-window-padding, 1rem)" }}
      >
        <FenestraeWinRenderer win={win} closeWin={closeWin} />
      </div>
    </div>
  );
});

FenestraeWinPanel.propTypes = {
  win: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.oneOf([WIN_ALIGN.NONE, WIN_ALIGN.AL_LEFT, WIN_ALIGN.AL_RIGHT, WIN_ALIGN.AL_BOTTOM]),
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  setActiveWinId: PropTypes.func.isRequired,
};

FenestraeWinPanel.displayName = "FenestraeWinPanel";

export default FenestraeWinPanel;