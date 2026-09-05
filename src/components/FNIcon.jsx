import React from "react";
import PropTypes from "prop-types";
import {
  MdClose,
  MdMinimize,
  MdCropSquare,
  MdFilterNone,
  MdDragIndicator,
  MdArrowBack  
} from "react-icons/md";

// El diccionario de iconos core para el gestor de ventanas
const icons = {
  1: MdClose,          // Cerrar
  2: MdMinimize,       // Minimizar
  3: MdCropSquare,     // Maximizar
  4: MdFilterNone,     // Restaurar
  5: MdDragIndicator,   // Handle de arrastre (Resize/Drag)
  6: MdArrowBack       // Flecha atrás (modo móvil)
};

export function FNIcon({ name, size = "1em", className = "", ...props }) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  // Si el size viene como número puro (ej. 20), lo transformamos a píxeles. 
  // Si viene como string (ej. "100%", "1.5rem", "1em"), lo respeta directamente.
  const computedSize = typeof size === "number" ? `${size}px` : size;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 border-none bg-transparent p-0 ${className}`}
      style={{ 
        width: computedSize, 
        height: computedSize 
      }}
    >
      <IconComponent 
        style={{ 
          width: "100%", 
          height: "100%" 
        }} 
        {...props} 
      />
    </span>
  );
}

FNIcon.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

export default FNIcon;