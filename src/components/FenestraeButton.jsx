// FenestraeButton.js - Versión con FenestraeIcon integrado
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeIcon from "./FenestraeIcon";

const FenestraeButton = ({ 
  // 📌 Propiedades básicas
  iconIndex,
  children,
  onClick, 
  title = "", 
  className = "", 
  disabled = false,
  style = {},
  
  // 📌 Variantes y estilos
  variant = "primary",
  size = "md",
  isActive = false,
  fullWidth = false,
  
  // 📌 Icono
  iconPosition = "left",
  iconSize: customIconSize,
  iconColor: customIconColor,
  
  // 📌 Props nativos
  type = "button",
  tabIndex,
  "aria-label": ariaLabel,
  ...rest
}) => {
  // 📌 Las variantes que usan clases CSS (controles de ventana)
  const controlVariants = ["ghost", "close", "minimize", "maximize", "restore"];
  const isControl = controlVariants.includes(variant);

  // 📌 Mapeo de variantes de control a clases CSS
  const controlClassMap = {
    ghost: "fn-btn",
    close: "fn-btn-close",
    minimize: "fn-btn-minimize",
    maximize: "fn-btn-maximize",
    restore: "fn-btn-restore",
  };

  // 📌 Clase base para controles de ventana
  const controlClass = isControl ? controlClassMap[variant] || "fn-btn" : "";

  // 📌 Clases para botones de acción (usando Tailwind)
  const actionClasses = {
    primary: `
      bg-[var(--color-fn-primary,var(--color-window-active-border,#0a6ed1))]
      text-[var(--color-fn-text-inverse,#ffffff)]
      hover:bg-[var(--color-fn-primary-hover,var(--color-window-active-border,#0056b3))]
      active:bg-[var(--color-fn-primary-active,#004a99)]
      border-transparent
      hover:shadow-md
      active:shadow-sm
    `,
    secondary: `
      bg-[var(--color-fn-bg-secondary,#f3f4f6)]
      text-[var(--color-fn-text-primary,#1a1a1a)]
      hover:bg-[var(--color-fn-bg-tertiary,#e5e7eb)]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-[var(--color-fn-border-medium,#d1d5db)]
    `,
    emphasized: `
      bg-[var(--color-fn-success,#22c55e)]
      text-[var(--color-fn-text-inverse,#ffffff)]
      hover:bg-[var(--color-fn-success-hover,#16a34a)]
      active:bg-[var(--color-fn-success-hover,#16a34a)]
      border-transparent
      hover:shadow-md
      active:shadow-sm
    `,
    transparent: `
      bg-transparent
      text-[var(--color-fn-text-primary,#1a1a1a)]
      hover:bg-[var(--color-fn-bg-hover,rgba(0,0,0,0.05))]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-transparent
    `,
    tab: `
      bg-transparent
      text-[var(--color-fn-tab-text-inactive,#4b5563)]
      hover:bg-[var(--color-fn-bg-hover,rgba(0,0,0,0.05))]
      hover:text-[var(--color-fn-text-primary,#1a1a1a)]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-b-2 border-transparent
      rounded-none
      h-[var(--fn-tab-height,36px)]
      min-w-[var(--fn-tab-min-width,120px)]
      max-w-[var(--fn-tab-max-width,220px)]
      px-4
      transition-colors duration-200
      group
    `,
    item: `
      bg-transparent
      text-[var(--color-fn-text-primary,#1a1a1a)]
      hover:bg-[var(--color-fn-bg-hover,rgba(0,0,0,0.05))]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-transparent
      w-full
      justify-start
      px-3 py-2
      rounded-[var(--radius-fn-sm,2px)]
    `,
  };

  // 📌 Tamaños
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
    xl: "px-8 py-3 text-lg",
  };

  // 📌 Tamaños de iconos
  const iconSizes = {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  };

  // 📌 Radios
  const radiusClasses = {
    xs: "rounded-[var(--radius-fn-sm,2px)]",
    sm: "rounded-[var(--radius-fn-sm,2px)]",
    md: "rounded-[var(--radius-fn-btn-radius,4px)]",
    lg: "rounded-[var(--radius-fn-md,4px)]",
    xl: "rounded-[var(--radius-fn-lg,8px)]",
  };

  // 📌 Estado activo (para tabs)
  const activeClasses = isActive && variant === "tab"
    ? `
      text-[var(--color-fn-tab-text-active,#ffffff)]
      bg-[var(--color-fn-tab-bg-active,#0a6ed1)]
      border-b-[var(--fn-tab-indicator-weight,3px)]
      border-b-[var(--color-fn-tab-indicator,#3b82f6)]
      hover:bg-[var(--color-fn-tab-bg-active,#0a6ed1)]
      hover:text-[var(--color-fn-tab-text-active,#ffffff)]
    `
    : "";

  // 📌 Ancho completo
  const widthClass = fullWidth ? "w-full" : "";

  // 📌 Estilos base para controles de ventana
  const controlBaseClasses = `
    inline-flex
    items-center
    justify-center
    p-0
    transition-all
    duration-[var(--transition-fn-fast,150ms)]
    cursor-pointer
    select-none
    outline-none
    border-none
    disabled:opacity-[var(--color-fn-disabled-opacity,0.5)]
    disabled:cursor-not-allowed
    disabled:pointer-events-none
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--color-fn-focus-ring,#3b82f6)]
    focus:ring-offset-2
    focus:ring-offset-[var(--color-fn-focus-ring-offset,#ffffff)]
    shrink-0
  `;

  // 📌 Estilos base para botones de acción
  const actionBaseClasses = `
    inline-flex
    items-center
    justify-center
    gap-2
    font-medium
    transition-all
    duration-[var(--transition-fn-base,200ms)]
    cursor-pointer
    select-none
    border
    disabled:opacity-[var(--color-fn-disabled-opacity,0.5)]
    disabled:cursor-not-allowed
    disabled:pointer-events-none
    disabled:bg-[var(--color-fn-disabled-bg,#e5e7eb)]
    disabled:text-[var(--color-fn-disabled-text,#9ca3af)]
    disabled:border-[var(--color-fn-disabled-border,#d1d5db)]
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--color-fn-focus-ring,#3b82f6)]
    focus:ring-offset-2
    focus:ring-offset-[var(--color-fn-focus-ring-offset,#ffffff)]
    whitespace-nowrap
    font-family-inherit
    relative
    ${widthClass}
  `;

  // 📌 Construir clases según el tipo de variante
  let buttonClasses;

  if (isControl) {
    // 👇 CONTROLES DE VENTANA: usan clases CSS
    buttonClasses = clsx(
      controlBaseClasses,
      controlClass, // fn-btn, fn-btn-close, etc.
      className
    );
  } else {
    // 👇 BOTONES DE ACCIÓN: usan Tailwind
    buttonClasses = clsx(
      actionBaseClasses,
      actionClasses[variant] || actionClasses.primary,
      sizeClasses[size] || sizeClasses.md,
      radiusClasses[size] || radiusClasses.md,
      activeClasses,
      className
    );
  }

  // 📌 Tamaño del icono
  const iconSize = customIconSize || iconSizes[size] || iconSizes.md;
  const iconColor = customIconColor || "currentColor";

  // 📌 Renderizar icono usando FenestraeIcon
  const renderIcon = () => {
    if (!iconIndex || isControl) return null;

    return (
      <FenestraeIcon 
        name={iconIndex} 
        size={iconSize}
        color={iconColor}
        className="block shrink-0"
      />
    );
  };

  const iconElement = renderIcon();
  const hasChildren = !!children;

  // 📌 Contenido del botón (solo para botones de acción)
  const content = (
    <>
      {(iconPosition === "left" || iconPosition === "top") && iconElement}
      {hasChildren && <span>{children}</span>}
      {(iconPosition === "right" || iconPosition === "bottom") && iconElement}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title || (typeof children === "string" ? children : "")}
      aria-label={ariaLabel || title || (typeof children === "string" ? children : "")}
      aria-disabled={disabled}
      className={buttonClasses}
      style={style}
      tabIndex={tabIndex}
      {...rest}
    >
      {isControl ? null : content}
    </button>
  );
};

FenestraeButton.propTypes = {
  // Propiedades básicas
  iconIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,

  // Variantes y estilos
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "emphasized",
    "transparent",
    "ghost",
    "close",
    "minimize",
    "maximize",
    "restore",
    "tab",
    "item",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  isActive: PropTypes.bool,
  fullWidth: PropTypes.bool,

  // Icono
  iconPosition: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string,

  // Props nativos
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  tabIndex: PropTypes.number,
  "aria-label": PropTypes.string,
};

FenestraeButton.defaultProps = {
  variant: "primary",
  size: "md",
  disabled: false,
  isActive: false,
  fullWidth: false,
  iconPosition: "left",
  type: "button",
};

export default FenestraeButton;