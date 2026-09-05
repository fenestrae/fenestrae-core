import React from "react";
import PropTypes from "prop-types";
import { formsRegistry } from "../core/winStore"; // Ajustado a la nomenclatura interna de Fenestrae
import { FenestraeiFrame } from "./FenestraeiFrame";

const FenestraeWinRenderer = React.memo(({ win, closeWin }) => {
  const componentName = win?.name?.toLowerCase();
  const entry = formsRegistry.get(componentName);
 // ⭐ Ventanas externas (HTML / iframe)
  if (win?.params?.url) {
      const desactive=(win.isDragging || win.isResizing) 

     return (
      
      <iframe
        ref={(iframe) => FenestraeiFrame(iframe, win, closeWin)}
        src={win.params.url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          pointerEvents: desactive ? "none":"auto"
        }}
        loading="lazy"
        sandbox="allow-scripts allow-forms allow-same-origin"
        
        referrerPolicy="no-referrer"
        title={win.title || "Fenestrae External Window"}
      />
      
    );
  }
  // Si no hay módulo o clase registrada, un mensaje sutil sin recuadros de error catastróficos
  if (!entry || !entry.component) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-[10px] font-mono p-4 select-none">
        [ERROR: {(win?.name || "UNKNOWN").toUpperCase()} NOT_FOUND_IN_REGISTRY]
      </div>
    );
  }

  const Comp = entry.component;

  // 🛡️ EXTRACCIÓN SEGURA DE CALLBACKS (Resistente a persistencia y rehidrataciones de Zustand)
  const onSave   = win.onSave   || win.params?.onSave   || (() => {});
  const onCancel = win.onCancel || win.params?.onCancel || (() => {});
  const onClose  = win.onClose  || win.params?.onClose  || (() => {});
  const onError  = win.onError  || win.params?.onError  || (() => {});
  const onApply  = win.onApply  || win.params?.onApply  || (() => {});
  const onDelete = win.onDelete || win.params?.onDelete || (() => {});
  const onNext   = win.onNext   || win.params?.onNext   || (() => {});
  const onPrev   = win.onPrev   || win.params?.onPrev   || (() => {});

  return (
    <div className="h-full w-full bg-transparent">
      <React.Suspense 
        fallback={
          <div className="h-full w-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
            {/* Spinner Ultra-Minimalista de Fenestrae */}
            <div className="relative w-8 h-8">
               <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
               <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin" />
            </div>
          </div>
        }
      >
        <Comp 
          routeParams={win.params} 
          winId={win.id} 
          onSave={onSave}
          onCancel={onCancel}
          onError={onError}
          onApply={onApply}
          onDelete={onDelete}
          onNext={onNext}
          onPrev={onPrev}
          isPortal={win.isPortal || win.params?.isPortal}
          
          // Función de cierre unificada para resolver la promesa e invalidar la ventana físicamente
          onClose={(data) => {
            if (typeof onClose === "function") onClose(data);
            if (typeof closeWin === "function") closeWin(win.id);
          }}
          
          // Mantenemos modalProps mapeado al contexto de la ventana por compatibilidad clásica
          modalProps={{ 
            winId: win.id,
            onSave: onSave,
            onClose: onClose,
          }}
        />
      </React.Suspense>
    </div>
  );
});

FenestraeWinRenderer.propTypes = {
  win: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    params: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onApply: PropTypes.func,
    onDelete: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    isPortal: PropTypes.bool,
  }).isRequired,
  closeWin: PropTypes.func.isRequired,
};

FenestraeWinRenderer.displayName = "FenestraeWinRenderer";

export default FenestraeWinRenderer;