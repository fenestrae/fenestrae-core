// ============================================================================
// FENESTRAE - FenestraeWinExtern (components/FenestraeWinExtern.jsx)
// Multi-Context Native Window / Document Picture-in-Picture Portals.
// ============================================================================

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { winStore, externalWindowInstances } from "../core";
import FenestraeWinRenderer from "./FenestraeWinRenderer";

const FenestraeWinExtern = React.memo(({ win }) => {
  const [ready, setReady] = useState(false);
  const containerRef = useRef(document.createElement("div"));
  
  // 🔹 Selectores atómicos para aislar el contexto de ejecución
  const closeWin = winStore((s) => s.closeWin);
  const self = win;
  
  // Recuperamos la instancia física nativa asignada (window reference / PiP target)
  const dw = externalWindowInstances.get(self.id); 

  useEffect(() => {
    if (!dw) {
      console.warn(`[Fenestrae] Referencia física nativa perdida para la ventana externa: ${self.id}. Forzando cierre.`);
      closeWin(self.id);
      return;
    }

    let isMounted = true;

    // Callbacks unificados para evitar fugas de memoria cruzadas entre contextos (Cross-Context Garbage Collection)
    const handleUnload = () => {
      const currentWins = winStore.getState().wins;
      // Verificamos compatibilidad nativa si es un Map clásico o una colección indexada
      const hasWindow = typeof currentWins.has === "function" ? currentWins.has(self.id) : !!currentWins[self.id];
      if (hasWindow) {
        closeWin(self.id);
      }
    };

    const setupExternalWindow = () => {
      if (!isMounted) return;
      
      try {
        // 1. Sincronización y clonación de Hojas de Estilos (Soporta Tailwind y variables globales de Theme)
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
          } catch (e) {
            // Evitar bloqueos silenciosos por políticas CORS en hojas de estilo de CDNs externos
          }
        });

        dw.document.title = self.title || "ERP Fenestrae Window";
        
        // 2. Suscribir eventos nativos de ciclo de vida del Sistema Operativo en la ventana hija
        dw.addEventListener("pagehide", handleUnload);
        dw.addEventListener("beforeunload", handleUnload);

        // 3. Preparación y montaje del nodo raíz para el Portal de React
        dw.document.body.style.margin = "0";
        dw.document.body.style.padding = "0";
        dw.document.body.style.overflow = "hidden";
        dw.document.body.style.backgroundColor = "var(--color-window-bg, #ffffff)";
        
        dw.document.body.appendChild(containerRef.current);
        containerRef.current.className = "h-screen w-screen flex flex-col min-h-0 overflow-hidden";

        setReady(true);
      } catch (err) {
        console.error("[Fenestrae] Error crítico inicializando el ecosistema de la ventana externa:", err);
      }
    };

    // Control de sincronización asíncrona: Si es un popup clásico, esperar a la carga completa del DOM nativo secundario
    if (self.params?.extSubtype === "popup" && dw.document.readyState !== "complete") {
      dw.addEventListener("load", setupExternalWindow, { once: true });
    } else {
      // Si es Document Picture-in-Picture (PiP), el búfer del documento ya está abierto y listo para mutar
      setupExternalWindow();
    }

    // 🔹 Limpieza estricta: previene fugas de memoria gigantescas al cerrar las pantallas
    return () => {
      isMounted = false;
      if (dw) {
        dw.removeEventListener("load", setupExternalWindow);
        dw.removeEventListener("pagehide", handleUnload);
        dw.removeEventListener("beforeunload", handleUnload);
        try {
          // Remover el nodo del árbol DOM secundario de forma segura antes del Garbage Collection
          if (containerRef.current && dw.document.body.contains(containerRef.current)) {
            dw.document.body.removeChild(containerRef.current);
          }
        } catch (e) {
          // Contexto destruido prematuramente por el S.O.
        }
      }
    };
  }, [self.id, self.params?.extSubtype, dw, closeWin]);

  if (!dw || !ready) return null;

  // Renderizado multi-contexto acoplado mediante portales nativos a la ventana externa
  return createPortal(
    <div 
      className="flex-1 flex flex-col min-h-0 overflow-hidden text-[var(--color-window-text,#1f2937)]"
      style={{ backgroundColor: "var(--color-window-content,#ffffff)" }}
    >
      <FenestraeWinRenderer win={self} closeWin={() => closeWin(self.id)} />
    </div>,
    containerRef.current
  );
});

FenestraeWinExtern.propTypes = {
  win: PropTypes.object.isRequired,
};

FenestraeWinExtern.displayName = "FenestraeWinExtern";

export default FenestraeWinExtern;