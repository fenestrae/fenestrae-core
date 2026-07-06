import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import FenestraeIcon from "./FenestraeIcon"; // Importación corregida

const FenestraeButton = ({ 
  iconIndex, 
  onClick, 
  title = "", 
  className = "", 
  disabled = false,
  style = {}
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={clsx(
        // Reset estructural estricto para evitar colisiones con los estilos globales del ERP
        "inline-flex items-center justify-center p-0 transition-all cursor-pointer select-none outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed",
        // Mapeo directo a los estados reactivos hover/text de tu contrato CSS de ventanas
        "hover:bg-[var(--color-fn-btn-close-hover,#ef4444)] hover:text-[var(--color-fn-btn-close-hover-text,#ffffff)] text-[var(--color-fn-btn-action-text,inherit)]",
        className
      )}
      style={{
        // Anatomía del botón dictada al 100% por el tema activo (Windows vs macOS)
        width: "var(--fn-btn-control-size, 16px)",
        height: "var(--fn-btn-control-size, 16px)",
        borderRadius: "var(--radius-fn-btn-radius, 4px)",
        ...style // Permite sobreescrituras puntuales si fueran necesarias
      }}
    >
      {/* Componente corregido: Usa FenestraeIcon y delega el color al flujo de Tailwind text-color */}
      <FenestraeIcon 
        name={iconIndex} 
        size="100%" // Fuerza al icono a encajar perfectamente dentro del contenedor dinámico
        className="block"
      />
    </button>
  );
};

FenestraeButton.propTypes = {
  iconIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object
};

export default FenestraeButton;