import React from "react";
import {
  MdClose,
  MdMinimize,
  MdCropSquare,
  MdFilterNone,
  MdDragIndicator
} from "react-icons/md";

const icons = {
  1: { component: MdClose, description: "Cerrar ventana", caption: "Cerrar" },
  2: { component: MdMinimize, description: "Minimizar ventana", caption: "Minimizar" },
  3: { component: MdCropSquare, description: "Maximizar ventana", caption: "Maximizar" },
  4: { component: MdFilterNone, description: "Restaurar ventana", caption: "Restaurar" },
  5: { component: MdDragIndicator, description: "Mover / Arrastrar ventana", caption: "Mover" }
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