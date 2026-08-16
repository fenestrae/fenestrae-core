import React from "react";
import PropTypes from "prop-types";
import Icono from "./CTIcons";
import clsx from "clsx";
import "./CTButton.css";

const ButtonContent = ({
  icon: Icon,
  iconIndex,
  iconPosition,
  iconSize,
  iconColor,
  children,
}) => {
  const renderIcon = () => {
    if (iconIndex) {
      return (
        <Icono
          name={iconIndex}
          size={iconSize}
          color={iconColor}
          className="inline-flex shrink-0"
        />
      );
    }
    if (Icon) {
      return <Icon size={iconSize} color={iconColor} className="inline-flex shrink-0" />;
    }
    return null;
  };

  const isVertical = iconPosition === "top" || iconPosition === "bottom";
  const flexClass = isVertical ? "flex-col" : "flex-row";

  return (
    <div className={`flex items-center gap-1.5 ${flexClass}`}>
      {(iconPosition === "top" || iconPosition === "left") && renderIcon()}
      {children && <span className="truncate">{children}</span>}
      {(iconPosition === "bottom" || iconPosition === "right") && renderIcon()}
    </div>
  );
};

const CTButton = ({
  icon,
  iconIndex,
  children,
  onClick,
  disabled = false,
  visible = true,
  className = "",
  title = "",
  iconPosition = "left",
  variant = "primary",
  type = "button",
  iconSize = "1em",
  iconColor = "currentColor",
  name,
  tag = 0,
  height,
  align = "center",
  fontSize,
  bold = false,
  focusRing = true,
  tabIndex = "",
  isActive = false,
}) => {
  // 📌 Variantes con variables CSS de Fenestrae
  const variantClasses = {
    // Botón primario - usa el color de acento del tema
    primary: `
      bg-[var(--color-fn-primary,var(--color-window-active-border,#0a6ed1))]
      text-[var(--color-fn-text-inverse,#ffffff)]
      hover:bg-[var(--color-fn-primary-hover,var(--color-window-active-border,#0056b3))]
      active:bg-[var(--color-fn-primary-active,#004a99)]
      border-transparent
    `,
    // Botón secundario
    secondary: `
      bg-[var(--color-fn-bg-secondary,#f3f4f6)]
      text-[var(--color-fn-text-primary,#1a1a1a)]
      hover:bg-[var(--color-fn-bg-tertiary,#e5e7eb)]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-[var(--color-fn-border-medium,#d1d5db)]
    `,
    // Botón enfatizado (más destacado)
    emphasized: `
      bg-[var(--color-fn-success,#22c55e)]
      text-[var(--color-fn-text-inverse,#ffffff)]
      hover:bg-[var(--color-fn-success-hover,#16a34a)]
      active:bg-[var(--color-fn-success-hover,#16a34a)]
      border-transparent
    `,
    // Botón transparente
    transparent: `
      bg-transparent
      text-[var(--color-fn-text-primary,#1a1a1a)]
      hover:bg-[var(--color-fn-bg-hover,rgba(0,0,0,0.05))]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-transparent
    `,
    // Botón ghost (solo ícono)
    ghost: `
      bg-transparent
      text-[var(--color-fn-btn-action-text,inherit)]
      hover:bg-[var(--color-fn-bg-hover,rgba(0,0,0,0.05))]
      hover:text-[var(--color-fn-text-primary,#1a1a1a)]
      active:bg-[var(--color-fn-bg-active,rgba(0,0,0,0.1))]
      border-transparent
      w-8 h-8 p-0
      rounded-[var(--radius-fn-btn-radius,4px)]
    `,
    // Botón de pestaña (tab)
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
    // Botón de ítem (menú)
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

  // 📌 Estilos base
  const baseClasses = `
    inline-flex
    items-center
    justify-center
    gap-1.5
    font-medium
    transition-all
    duration-[var(--transition-fn-fast,150ms)]
    cursor-pointer
    select-none
    border
    rounded-[var(--radius-fn-btn-radius,4px)]
    px-4
    py-2
    text-sm
    whitespace-nowrap
    disabled:opacity-[var(--color-fn-disabled-opacity,0.5)]
    disabled:pointer-events-none
    disabled:cursor-not-allowed
    disabled:bg-[var(--color-fn-disabled-bg,#e5e7eb)]
    disabled:text-[var(--color-fn-disabled-text,#9ca3af)]
    disabled:border-[var(--color-fn-disabled-border,#d1d5db)]
  `;

  // 📌 Estado activo para tabs
  const activeClasses = isActive
    ? `
      text-[var(--color-fn-tab-text-active,#ffffff)]
      bg-[var(--color-fn-tab-bg-active,#0a6ed1)]
      border-b-[var(--fn-tab-indicator-weight,3px)]
      border-b-[var(--color-fn-tab-indicator,#3b82f6)]
      hover:bg-[var(--color-fn-tab-bg-active,#0a6ed1)]
      hover:text-[var(--color-fn-tab-text-active,#ffffff)]
    `
    : "";

  // 📌 Alineación
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align] || "justify-center";

  // 📌 Tamaño de fuente
  const fontClasses = fontSize ? fontSize : "text-sm";
  const boldClass = bold ? "font-bold" : "font-medium";

  // 📌 Focus ring
  const focusClasses = focusRing
    ? "focus:outline-none focus:ring-2 focus:ring-[var(--color-fn-focus-ring,#3b82f6)] focus:ring-offset-2 focus:ring-offset-[var(--color-fn-focus-ring-offset,#ffffff)]"
    : "focus:outline-none";

  // 📌 Estilo de altura
  const style = {};
  if (height) style.height = height;

  // 📌 Construcción de clases
  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    activeClasses,
    alignClasses,
    fontClasses,
    boldClass,
    focusClasses,
    className
  );

  const computedTitle = title || (typeof children === "string" ? children : "");
  const buttonRef = React.useRef(null);

  const handleClick = (e) => {
    if (!disabled) {
      onClick?.(e);
    }
  };

  if (!visible) return null;

  // 📌 Para variantes ghost, renderizamos solo el ícono
  const isGhost = variant === "ghost";

  return (
    <button
      type={type}
      ref={buttonRef}
      className={buttonClasses}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      data-tag={tag}
      title={computedTitle}
      aria-label={computedTitle}
      aria-disabled={disabled}
      role={variant === "tab" ? "tab" : "button"}
      aria-selected={variant === "tab" ? isActive : undefined}
      {...(tabIndex !== "" ? { tabIndex } : {})}
    >
      {isGhost ? (
        // Ghost: solo ícono, sin texto
        <Icono
          name={iconIndex}
          size={iconSize || "1.2em"}
          color={iconColor || "currentColor"}
          className="inline-flex shrink-0"
        />
      ) : (
        <ButtonContent
          icon={icon}
          iconIndex={iconIndex}
          iconPosition={iconPosition}
          iconSize={iconSize}
          iconColor={iconColor}
        >
          {children}
        </ButtonContent>
      )}
    </button>
  );
};

CTButton.propTypes = {
  icon: PropTypes.elementType,
  iconIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconPosition: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  visible: PropTypes.bool,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "transparent",
    "emphasized",
    "ghost",
    "tab",
    "item",
  ]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string,
  tag: PropTypes.number,
  height: PropTypes.string,
  align: PropTypes.oneOf(["left", "center", "right"]),
  fontSize: PropTypes.string,
  bold: PropTypes.bool,
  focusRing: PropTypes.bool,
  tabIndex: PropTypes.string,
};

CTButton.defaultProps = {
  variant: "primary",
  type: "button",
  iconPosition: "left",
  align: "center",
  bold: false,
  focusRing: true,
  disabled: false,
  visible: true,
  isActive: false,
};

export default CTButton;