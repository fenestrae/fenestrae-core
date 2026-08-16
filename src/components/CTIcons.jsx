import React from "react";
import {
  // --- Controles Clásicos de Gestión (Ya incluidos) ---
  MdClose,          // Cerrar ventana
  MdMinimize,       // Minimizar a la barra de tareas
  MdCropSquare,     // Maximizar ventana
  MdFilterNone,     // Restaurar tamaño (antiguo doble cuadrado)
  MdDragIndicator,  // Zona de arrastre / Grip del Header

  // --- Gestión de Estados (Docking & Desacople) ---
  MdPushPin,        // Anclar / Pin ventana en zonas Docker
  MdLaunch,         // Desacoplar / Convertir en ventana flotante externa
  MdOpenInNew,      // Abrir en una ventana independiente del navegador (Pop-out)

  // --- Comportamiento y Visualización (Roll-up / Colapsar) ---
  MdKeyboardArrowUp,   // Colapsar / Enrollar contenido (Shading/Roll-up)
  MdKeyboardArrowDown, // Expandir contenido enrollado
  
  // --- Utilidades de Ventana ---
  MdRefresh,        // Recargar datos / Resetear estado interno del formulario
  MdMoreVert        // Menú contextual de la ventana (Acciones del sistema)
} from "react-icons/md";

const icons = {
  1: { component: MdClose, description: "Close window", caption: "Close" },
  2: { component: MdMinimize, description: "Minimize window", caption: "Minimize" },
  3: { component: MdCropSquare, description: "Maximize window", caption: "Maximize" },
  4: { component: MdFilterNone, description: "Restore window", caption: "Restore" },
  5: { component: MdDragIndicator, description: "Drag window", caption: "Drag" },

  // Modern + Windows-like terminology
  6: { component: MdLaunch, description: "Detach window from dock", caption: "Detach" }
};


// Componente Icono adaptado a Tailwind
export function Icono({ name, size = 20, className = "", ...props }) {
  const iconEntry = icons[name];
  if (!iconEntry) return null;
  const IconComponent = iconEntry.component;

  return (
    <span
      title={iconEntry.description}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <IconComponent style={{ width: size, height: size }} {...props} />
    </span>
  );
}

// Lista para select
export const CTIconList = Object.entries(icons).map(([key, data]) => ({
  value: key,
  label: data.caption,
  description: data.description,
  icon: <Icono name={key} size={18} className="text-gray-900 dark:text-gray-100" />,
}));

export function getIconByIndex(index) {
  const entries = Object.entries(icons);
  if (index < 0 || index >= entries.length) return null;
  const [name, iconData] = entries[index];
  return { name, ...iconData };
}

export function getIconCaption(name) {
  return icons[name]?.caption || "";
}

export function getIconText(name) {
  return icons[name]?.description || "";
}

export default Icono;