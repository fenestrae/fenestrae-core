import React, { useRef, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom";
import { winStore, externalWindowInstances } from "../core";
import { restoreWindows } from "../database/persistence";

// Componentes existentes
import FenestraeDockZone from "./FenestraeDockedWindow";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import FenestraeWinModal from "./FenestraeWinModal";
import FenestraeWinFloating from "./FenestraeWinFloating";
import FenestraeWinPanel from "./FenestraeWinPanel";
import FenestraeWinSide from "./FenestraeWinSide";
import FenestraeWinTop from "./FenestraeWinTop";
import FenestraeWinExtern from "./FenestraeWinExtern";
import FenestraeDesktopTab from "./FenestraeDesktopTab";

// 🔹 NUEVO: zonas fijas
import FenestraeFixedZone from "./FenestraeFixedZone";

import { useShortcuts } from "../hooks/useShortcuts";
import { postToWindow } from "../lib/security";

const FenestraeContainer = ({ initialWinConfig, bootStrap = null }) => {
  const hasHydrated = winStore((s) => s.hasHydrated);
  const wins = winStore((s) => s.wins);
  const winOrder = winStore((s) => s.winOrder);
  const activeTabId = winStore((s) => s.activeTabId);
  const activeWinId = winStore((s) => s.activeWinId);

  const { setActiveWinId, closeWin } = winStore(
    useShallow((s) => ({
      setActiveWinId: s.setActiveWinId,
      closeWin: s.closeWin,
    }))
  );

  // Heartbeat para ventanas externas
  const birthRef = React.useRef(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      const birth = birthRef.current;
      externalWindowInstances.forEach((win) => {
        try {
          postToWindow(win, { type: "fenestrae-heartbeat", birth });
        } catch { }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Restauración inicial
  const firstRunRef = useRef(false);
  useEffect(() => {
    if (firstRunRef.current) return;
    firstRunRef.current = true;

    async function runRestore() {
      const isNew = await restoreWindows(initialWinConfig);
      if (isNew && typeof bootStrap === "function") {
        const workspace = sessionStorage.getItem("fenestrae_workspace");
        bootStrap(workspace);
      }
    }
    runRestore();
  }, []);

  // Re-registro de ventanas externas
  useEffect(() => {
    if (!hasHydrated) return;
    wins.forEach((w) => {
      if (w.type === "ext" && w.params?.popupWindowInstance) {
        externalWindowInstances.set(w.id, w.params.popupWindowInstance);
      }
    });
  }, [hasHydrated]);

  const navigate = useNavigate();
  const location = useLocation();

  // Tabs
  const tabWinsFijas = useMemo(() => {
    return Array.from(wins.values()).filter((w) => w.type === "tab");
  }, [wins]);

  // Ventanas flotantes, paneles, side, top, externas
  const { topWins, sideWins, panelWins, floatWins, modalWins, extWins } =
    useMemo(() => {
      const groups = {
        topWins: [],
        sideWins: [],
        panelWins: [],
        floatWins: [],
        modalWins: [],
        extWins: [],
      };

      // ✔ Filtrar ventanas que NO deben entrar en docking
      const filtered = winOrder
        .map(id => wins.get(id))
        .filter(w => w && !w.fixed);

      // ✔ Clasificar por tipo
      filtered.forEach(w => {
        switch (w.type) {
          case "top":
            groups.topWins.push(w);
            break;
          case "side":
            groups.sideWins.push(w);
            break;
          case "panel":
            groups.panelWins.push(w);
            break;
          case "float":
            groups.floatWins.push(w);
            break;
          case "modal":
            groups.modalWins.push(w);
            break;
          case "ext":
            groups.extWins.push(w);
            break;
        }
      });

      return groups;
    }, [winOrder, wins]);


  const hasWindowsInZone = (zone) =>
    topWins.some((w) => w.docked && w.dockZone === zone);

  // 🔹 NUEVO: Filtrar ventanas fijas
  const fixedWins = useMemo(() => {
    return Array.from(wins.values()).filter((w) => w.fixed);
  }, [wins]);

  const fixedTop = fixedWins.filter((w) => w.fixedZone === "top");
  const fixedLeft = fixedWins.filter((w) => w.fixedZone === "left");
  const fixedRight = fixedWins.filter((w) => w.fixedZone === "right");
  const fixedBottom = fixedWins.filter((w) => w.fixedZone === "bottom");



  // Función de rotación (la definimos dentro para usar los datos del store actualizados)
  const rotateTab = (direction) => {
    if (tabWinsFijas.length <= 1) return;
    const currentIndex = tabWinsFijas.findIndex((w) => w.id === activeTabId);
    let nextIndex = currentIndex + direction;

    if (nextIndex >= tabWinsFijas.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = tabWinsFijas.length - 1;

    setActiveWinId(tabWinsFijas[nextIndex].id);
  };

  // Registro de Atajos
  useShortcuts(
    {
      // 1. Navegación (Intentamos Tab y damos alternativa con Flechas)
      "Ctrl+Tab": () => rotateTab(1),
      "Ctrl+Shift+Tab": () => rotateTab(-1),
      "Alt+ArrowRight": () => rotateTab(1),
      "Alt+ArrowLeft": () => rotateTab(-1),


      "F7": (e) => {
        e.preventDefault();

        // Opción A: Alert nativo (bloqueante, pero efectivo)
        // alert("El refresco de pantalla está deshabilitado para proteger tus cambios.");

        // Opción B: Si tienes un sistema de notificaciones (Recomendado)
        // notify.warn("Acción no permitida", "Usa el botón de actualizar del formulario.");

        console.log("%c [Sistema] F7 Bloqueado ", "background: #f00; color: #fff; font-weight: bold;");

        // Ejemplo: Podrías usar un estado local para mostrar un mensaje temporal en el UI
        // showFlashMessage("Usa los controles internos del ERP para navegar.");
      },


      // 2. Cerrar ventana (Alt+F4 suele fallar en Chrome, añadimos Alt+w como en CBuilder)
      "Alt+F4": () => {
        if (activeWinId && activeWinId !== "LAUNCHPAD") closeWin(activeWinId);
      },
      "Alt+w": () => {
        // Minúscula porque Alt+w no lleva Shift
        if (activeWinId && activeWinId !== "LAUNCHPAD") closeWin(activeWinId);
      },

      // 3. Escape para capas secundarias
      Escape: () => {
        const currentWin = wins.get(activeWinId);
        if (!currentWin) return;

        // Si es un panel, modal o float, lo cerramos
        const isSecondary = ["panel", "modal", "float", "side"].includes(
          currentWin.type,
        );
        if (isSecondary) {
          closeWin(activeWinId);
        }
      },
    },
    true,
  ); // Siempre activo en el contenedor principal


  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--fn-canvas,#f3f4f6)] overflow-hidden text-[var(--color-window-text,#1f2937)] font-sans antialiased select-none relative">

      {/* 🔹 ZONA FIJA TOP */}
      {fixedTop.map((w) => (
        <FenestraeFixedZone key={w.id} win={w} />
      ))}

      {/* ZONA DOCK TOP */}
      {hasWindowsInZone("top") && (
        <div className="flex-shrink-0 border-b bg-[var(--color-window-header,#0a6ed1)]">
          <FenestraeDockZone zone="top" initialSize={80} />
        </div>
      )}

      {/* FILA CENTRAL */}
      <div className="flex flex-1 flex-row min-h-0 w-full overflow-hidden relative">

        {/* 🔹 ZONA FIJA LEFT */}
        {fixedLeft.map((w) => (
          <FenestraeFixedZone key={w.id} win={w} />
        ))}

        {/* ZONA DOCK LEFT */}
        {hasWindowsInZone("left") && (
          <div className="flex-shrink-0 border-r bg-[var(--color-window-header,#0a6ed1)]">
            <FenestraeDockZone zone="left" initialSize={300} />
          </div>
        )}

        {/* WORKSPACE */}
        <div className="flex flex-col flex-1 min-w-0 h-full bg-[var(--color-window-bg,#ffffff)] overflow-hidden relative">

          {/* TAB BAR */}
          <nav
            className="bg-[var(--color-window-content,#fafafa)] border-b flex-shrink-0 z-10 shadow-sm flex items-center"
            style={{ height: "var(--fn-tab-height, 48px)" }}
          >
            <div className="flex items-center px-2 pt-1 w-full gap-1 overflow-x-auto no-scrollbar h-full">
              {tabWinsFijas.map((w) => (
                <FenestraeDesktopTab
                  key={w.id}
                  win={w}
                  isActive={activeTabId === w.id}
                  setActiveWinId={setActiveWinId}
                  closeWin={closeWin}
                />
              ))}
            </div>
          </nav>

          {/* CONTENIDO */}
          <main className="flex-1 relative overflow-hidden min-h-0 w-full">
            <div className="h-full w-full relative">
              {tabWinsFijas.map((w) => (
                <div
                  key={w.id}
                  className={clsx(
                    "h-full w-full absolute inset-0",
                    w.id === activeTabId ? "block z-1" : "hidden"
                  )}
                >
                  <div className="w-full h-full overflow-hidden">
                    <React.Suspense fallback={<div>Cargando ventana...</div>}>
                      <FenestraeWinRenderer win={w} closeWin={closeWin} />
                    </React.Suspense>
                  </div>
                </div>
              ))}
            </div>

            {/* MODALES */}
            {modalWins.map((w, index) => (
              <FenestraeWinModal
                key={w.id}
                win={w}
                index={index}
                activeWinId={activeWinId}
                setActiveWinId={setActiveWinId}
              />
            ))}
          </main>
          {/* ZONA DOCK BOTTOM */}
          {hasWindowsInZone("bottom") && (
            <div className="flex-shrink-0 border-t bg-[var(--color-window-header,#0a6ed1)]">
              <FenestraeDockZone zone="bottom" />
            </div>
          )}
        </div>

        {/* ZONA DOCK RIGHT */}
        {hasWindowsInZone("right") && (
          <div className="flex-shrink-0 border-l bg-[var(--color-window-header,#0a6ed1)]">
            <FenestraeDockZone zone="right" />
          </div>
        )}

        {/* 🔹 ZONA FIJA RIGHT */}
        {fixedRight.map((w) => (
          <FenestraeFixedZone key={w.id} win={w} />
        ))}
      </div>



      {/* 🔹 ZONA FIJA BOTTOM */}
      {fixedBottom.map((w) => (
        <FenestraeFixedZone key={w.id} win={w} />
      ))}

      {wins.size > 0 && Array.from(wins.values()).some(w => w.isDragging || w.isResizing) && (
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "transparent",
              zIndex: 999998,
              pointerEvents: "auto",
            }}
          />,
          document.body
        )
      )}
      {/* FLOTANTES */}
      {floatWins.map((w, index) => (
        <FenestraeWinFloating
          key={w.id}
          win={w}
          index={index}
          activeWinId={activeWinId}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {/* PANEL */}
      {panelWins.map((w, index) => (
        <FenestraeWinPanel
          key={w.id}
          win={w}
          index={index}
          activeWinId={activeWinId}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {/* SIDE */}
      {sideWins.map((w, index) => (
        <FenestraeWinSide
          key={w.id}
          win={w}
          index={index}
          activeWinId={activeWinId}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {/* TOP flotante */}
      {topWins
        .filter((w) => !w.docked && !w.fixed)
        .map((w, index) => (
          <FenestraeWinTop
            key={w.id}
            win={w}
            index={index}
            activeWinId={activeWinId}
            setActiveWinId={setActiveWinId}
          />
        ))}

      {/* EXTERNAS */}
      {extWins.map((w) => (
        <FenestraeWinExtern key={w.id} win={w}>
          <React.Suspense fallback={<div>Cargando ventana externa...</div>}>
            <FenestraeWinRenderer win={w} closeWin={closeWin} />
          </React.Suspense>
        </FenestraeWinExtern>
      ))}
    </div>
  );
};

export { FenestraeContainer };
export default FenestraeContainer;
