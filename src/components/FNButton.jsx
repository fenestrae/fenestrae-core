// FNButton.js
import PropTypes from "prop-types";
import clsx from "clsx";
import FNIcon from "./FNIcon";
import "./FNButton.css";

const FNButton = ({
  iconIndex,
  children,
  onClick,
  title = "",
  className = "",
  disabled = false,
  style = {},
  variant = "primary",
  size = "md",
  isActive = false,
  fullWidth = false,
  iconPosition = "left",
  iconSize: customIconSize,
  iconColor: customIconColor,
  type = "button",
  tabIndex,
  "aria-label": ariaLabel,
  theme = "modern", // 🆕 Soporte para temas
  ...rest
}) => {
  const controlVariants = ["ghost", "close", "minimize", "maximize", "restore"];
  const isControl = controlVariants.includes(variant);

  const controlClassMap = {
    ghost: "fn-btn",
    close: "fn-btn fn-btn-close",
    minimize: "fn-btn fn-btn-minimize",
    maximize: "fn-btn fn-btn-maximize",
    restore: "fn-btn fn-btn-restore",
  };

  const controlClass = isControl ? controlClassMap[variant] : "";

  // Mapeo de variantes a clases CSS
  const variantClassMap = {
    primary: "fn-btn-primary",
    secondary: "fn-btn-secondary",
    emphasized: "fn-btn-emphasized",
    transparent: "fn-btn-transparent",
    tab: "fn-btn-tab",
    item: "fn-btn-item",
  };

  // Mapeo de tamaños a clases CSS
  const sizeClassMap = {
    xs: "fn-btn-xs",
    sm: "fn-btn-sm",
    md: "fn-btn-md",
    lg: "fn-btn-lg",
    xl: "fn-btn-xl",
  };

  // Mapeo de radios a clases CSS
  const radiusClassMap = {
    xs: "fn-btn-radius-xs",
    sm: "fn-btn-radius-sm",
    md: "fn-btn-radius-md",
    lg: "fn-btn-radius-lg",
    xl: "fn-btn-radius-xl",
  };

  const iconSizes = {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  };

  // 🆕 Clase de tema (se aplica al contenedor padre normalmente)
  // Pero podemos añadirla como data attribute para estilos específicos
  const themeClass = `fn-theme-${theme}`;

  // Construir clases
  const buttonClasses = isControl
    ? clsx(controlClass, themeClass, className)
    : clsx(
        "fn-btn-action", // Clase base
        variantClassMap[variant] || variantClassMap.primary,
        sizeClassMap[size] || sizeClassMap.md,
        radiusClassMap[size] || radiusClassMap.md,
        themeClass,
        {
          "fn-btn-active": isActive, // Clase activa genérica
          "fn-btn-full-width": fullWidth,
        },
        className
      );

  const iconSize = customIconSize || iconSizes[size] || iconSizes.md;
  const iconColor = customIconColor || "currentColor";

  const iconElement = iconIndex && (
    <FNIcon
      name={iconIndex}
      size={iconSize}
      color={iconColor}
      className="block shrink-0"
    />
  );

  const content = (
    <>
      {(iconPosition === "left" || iconPosition === "top") && iconElement}
      {children && <span>{children}</span>}
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
      data-theme={theme} // 🆕 Data attribute para referencia
      {...rest}
    >
      {content}
    </button>
  );
};

FNButton.propTypes = {
  iconIndex: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "emphasized",
    "transparent",
    "tab",
    "item",
    "ghost",
    "close",
    "minimize",
    "maximize",
    "restore",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  isActive: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconPosition: PropTypes.oneOf(["left", "right", "top", "bottom"]),
  iconSize: PropTypes.string,
  iconColor: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  tabIndex: PropTypes.number,
  "aria-label": PropTypes.string,
  theme: PropTypes.oneOf([
    "modern",
    "macOS",
    "dark",
    "cyberpunk",
    "tropical",
    "pastel",
    "windows11",
    "sapFiori",
    "windowsXP",
    "windowsXPSilver",
    "windowsXPOlive",
    "luna",
  ]),
};

FNButton.defaultProps = {
  theme: "modern",
  variant: "primary",
  size: "md",
  iconPosition: "left",
  type: "button",
};

export default FNButton;