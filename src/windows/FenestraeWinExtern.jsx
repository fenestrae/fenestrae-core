import React, { useEffect, useState, useRef, createContext } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { winStore, externalWindowInstances } from "../core";
import FenestraeWinRenderer from "./FenestraeWinRenderer";

// Contexto para que los sub-formularios sepan en qué Window físico residen
export const FenestraeWindowContext = createContext(window);

const FenestraeWinExtern = React.memo(({ win }) => {
  const [ready, setReady] = useState(false);
  const containerRef = useRef(document.createElement("div"));
  
  const closeWin = winStore((s) => s.closeWin);
  const self = win;
  
  const dw = externalWindowInstances.get(self.id); 

  useEffect(() => {
    if (!dw) {
      console.warn(`[Fenestrae] Referencia física nativa perdida para la ventana externa: ${self.id}. Forzando cierre.`);
      closeWin(self.id);
      return;
    }

    let isMounted = true;

    const handleUnload = () => {
      const currentWins = winStore.getState().wins;
      const hasWindow = typeof currentWins.has === "function" ? currentWins.has(self.id) : !!currentWins[self.id];
      if (hasWindow) {
        closeWin(self.id);
      }
    };

    const setupExternalWindow = () => {
      if (!isMounted) return;
      
      try {
        dw.document.head.innerHTML = "";
        
        Array.from(document.styleSheets).forEach((styleSheet) => {
          try {
            if (styleSheet.href) {
              const newLink = dw.document.createElement("link");
              newLink.rel = "stylesheet";
              newLink.href = styleSheet.href;
              dw.document.head.appendChild(newLink);
            } else if (styleSheet.cssRules) {
              const newStyle = dw.document.createElement("style");
              newStyle.innerHTML = Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join("");
              dw.document.head.appendChild(newStyle);
            }
          } catch (e) {}
        });

        dw.document.title = self.title || "ERP Fenestrae Window";
        
        dw.addEventListener("pagehide", handleUnload);
        dw.addEventListener("beforeunload", handleUnload);

        dw.document.body.style.margin = "0";
        dw.document.body.style.padding = "0";
        dw.document.body.style.overflow = "hidden";
        dw.document.body.style.backgroundColor = "var(--color-window-bg, #ffffff)";
        
        dw.document.body.appendChild(containerRef.current);
        containerRef.current.className = "h-screen w-screen flex flex-col min-h-0 overflow-hidden";

        dw.document.documentElement.style.cssText = document.documentElement.style.cssText;

        // 🔥 SOLUCIÓN AL COMPONENTE GLOBAL: Inyectamos la referencia del renderizador 
        // en el objeto window físico del popup para que el bridge no lo pierda
        dw.__FenestraeRendererComponent__ = FenestraeWinRenderer;

        setReady(true);
      } catch (err) {
        console.error("[Fenestrae] Error crítico inicializando el ecosistema de la ventana externa:", err);
      }
    };

    if (self.params?.extSubtype === "popup" && dw.document.readyState !== "complete") {
      dw.addEventListener("load", setupExternalWindow, { once: true });
    } else {
      setupExternalWindow();
    }

    return () => {
      isMounted = false;
      if (dw) {
        dw.removeEventListener("load", setupExternalWindow);
        dw.removeEventListener("pagehide", handleUnload);
        dw.removeEventListener("beforeunload", handleUnload);
        try {
          if (containerRef.current && dw.document.body.contains(containerRef.current)) {
            dw.document.body.removeChild(containerRef.current);
          }
        } catch (e) {}
      }
    };
  }, [self.id, self.params?.extSubtype, dw, closeWin]);

  if (!dw || !ready) return null;

  // Modificación inmutable: En lugar de inyectar en self.params (congelado por Immer), 
  // clonamos el objeto win de manera segura solo para la vista o lo manejamos vía Context/Props
  const winContextualized = {
    ...self,
    params: {
      ...self.params,
      popupWindowInstance: dw
    }
  };

  return createPortal(
    <FenestraeWindowContext.Provider value={dw}>
      <div 
        className="flex-1 flex flex-col min-h-0 overflow-hidden text-[var(--color-window-text,#1f2937)]"
        style={{ backgroundColor: "var(--color-window-content,#ffffff)" }}
      >
        <FenestraeWinRenderer win={winContextualized} closeWin={() => closeWin(self.id)} />
      </div>
    </FenestraeWindowContext.Provider>,
    containerRef.current
  );
});

FenestraeWinExtern.propTypes = {
  win: PropTypes.object.isRequired,
};
FenestraeWinExtern.displayName = "FenestraeWinExtern";

export default FenestraeWinExtern;