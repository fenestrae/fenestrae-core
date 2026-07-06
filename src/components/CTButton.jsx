import React from "react";
import PropTypes from "prop-types";
import Icono from "./CTIcons";
import clsx from "clsx"; // Recomiendo usar clsx para limpiar la lógica de clases
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
    if (iconIndex)
      return (
        <Icono
          name={iconIndex}
          size={iconSize}
          color={iconColor}
          className="inline-flex"
        />
      );
    if (Icon)
      return <Icon size={iconSize} color={iconColor} className="inline-flex" />;
    return null;
  };

  const isVertical = iconPosition === "top" || iconPosition === "bottom";
  const flexClass = isVertical ? "btn-flex-col" : "btn-flex-row";

  return (
    <div className={`${flexClass}`}>
      {(iconPosition === "top" || iconPosition === "left") && renderIcon()}
      {children && <span>{children}</span>}
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
  isActive = false, // 🔹 Nuevo prop
}) => {
  
  const variantClass = {
    primary: "btn-sap-primary",
    secondary: "btn-sap-secondary",
    emphasized: "btn-sap-emphasized",
    transparent: "btn-sap-transparent",
    ghost: "btn-sap-ghost",
    tab: "btn-sap-nav-tab",
    item: "btn-sap-item",
  }[variant || "primary"];

  const disabledClass = disabled ? "btn-disabled" : "";

  const style = {};
  if (height) style.height = height;

  let alignClass = "";
  if (align === "left") alignClass = "justify-start";
  else if (align === "right") alignClass = "justify-end";
  else alignClass = "justify-center";

  const fontClass = fontSize ? fontSize : "text-base";
  const boldClass = bold ? "font-bold" : "font-normal";
  const focusClass = !focusRing ? "focus:outline-none focus:ring-0" : "";

  // 🔹 Construcción de clases optimizada
  // Añadimos 'group' manualmente aquí para evitar el error de PostCSS en el archivo CSS
  const buttonClasses = clsx(
    "btn-base",
    variantClass,
    disabledClass,
    alignClass,
    fontClass,
    boldClass,
    focusClass,
    isActive && "active", // 🔹 Aplica la clase 'active' si isActive es true
    (variant === "tab" || variant === "item") && "group", // 🔹 Añade 'group' para variantes de navegación
    className
  );

  const computedTitle = title || (typeof children === "string" ? children : "");

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ x: 0, y: 0 });
  const buttonRef = React.useRef(null);

  const handleClick = (e) => {
    
    onClick?.(e);
  };

  if (!visible) return null;

  const button = (
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
      {...(tabIndex !== "" ? { tabIndex } : {})}
    >
      <ButtonContent
        icon={icon}
        iconIndex={iconIndex}
        iconPosition={iconPosition}
        iconSize={iconSize}
        iconColor={iconColor}
      >
        {children}
      </ButtonContent>
    </button>
  );

  return (
    <>
      {button}
            
    </>
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
  isActive: PropTypes.bool, // 🔹 Validado
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

export default CTButton;