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
          } catch (e) { }
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

        // 🔥 Inyectamos referencia del renderizador
        dw.__FenestraeRendererComponent__ = FenestraeWinRenderer;

        // ---------------------------------------------------------------------------
        // 🔥 PROTECCIÓN FENESTRAE PARA VENTANAS EXTERNAS
        // ---------------------------------------------------------------------------

        // 1. Bloquear recargas por teclado
        const keydownHandler = (e) => {
          if (e.key === "F5") { e.preventDefault(); e.stopPropagation(); }
          if (e.key.toLowerCase() === "r" && e.ctrlKey) { e.preventDefault(); e.stopPropagation(); }
          if (e.key.toLowerCase() === "r" && e.ctrlKey && e.shiftKey) { e.preventDefault(); e.stopPropagation(); }
        };
        dw.addEventListener("keydown", keydownHandler);

        // 2. Detectar recarga por botón del navegador
        try {
          const nav = dw.performance.getEntriesByType("navigation")[0];
          if (nav && nav.type === "reload") {
            dw.close();
          }
        } catch { }

        // 3. Heartbeat del padre
        // 3. Heartbeat del padre
        let lastHeartbeat = Date.now();
        let parentBirth = null;   // ← sello de vida del padre

        const messageHandler = (event) => {
          if (event.origin !== window.location.origin) return;
          if (dw.opener && event.source !== dw.opener) return;
          if (event.data?.type === "fenestrae-heartbeat") {

            // Actualizar latido
            lastHeartbeat = Date.now();

            // Primer latido: guardar el sello de vida del padre
            if (!parentBirth) {
              parentBirth = event.data.birth;
              return;
            }

            // Si el padre ha renacido (F5, rehidratación, reconstrucción)
            if (event.data.birth !== parentBirth) {
              try { dw.close(); } catch { }
            }
          }
        };


        // ❗ IMPORTANTE: escuchar en dw.window, no en dw
        dw.window.addEventListener("message", messageHandler);

        // 4. Cerrar si el padre muere (no hay heartbeat)
        const heartbeatMonitor = setInterval(() => {
          if (Date.now() - lastHeartbeat > 3000) {
            dw.close();
          }
        }, 1000);

        // 5. Cerrar si opener ya no existe
        const openerMonitor = setInterval(() => {
          if (!dw.opener || dw.opener.closed) {
            dw.close();
          }
        }, 1500);

        // Guardamos referencias para limpieza
        dw.__fenestraeCleanup__ = {
          keydownHandler,
          messageHandler,
          heartbeatMonitor,
          openerMonitor
        };

        setReady(true);
      } catch (err) {
        console.error("[Fenestrae] Error crítico inicializando la ventana externa:", err);
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

        // Limpieza del script de protección
        if (dw.__fenestraeCleanup__) {
          const c = dw.__fenestraeCleanup__;
          dw.removeEventListener("keydown", c.keydownHandler);
          dw.window.removeEventListener("message", c.messageHandler);
          clearInterval(c.heartbeatMonitor);
          clearInterval(c.openerMonitor);
        }

        try {
          if (containerRef.current && dw.document.body.contains(containerRef.current)) {
            dw.document.body.removeChild(containerRef.current);
          }
        } catch (e) { }
      }
    };
  }, [self.id, self.params?.extSubtype, dw, closeWin]);

  if (!dw || !ready) return null;

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
