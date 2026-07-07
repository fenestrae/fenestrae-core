import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { useNavigate, useLocation } from "react-router-dom"; 
import { winStore, LAUNCHPAD_ID } from "../core"; 

// Importaciones de subcomponentes visuales de la librería
import FenestraeDockZone from "../windows/FenestraeDockedWindow";
import FenestraeWinRederer from "../windows/FenestraeWinRenderer";
import FenestraeWinModal from "../windows/FenestraeWinModal";
import FenestraeWinFloating from "../windows/FenestraeWinFloating";
import FenestraeWinPanel from "../windows/FenestraeWinPanel";
import FenestraeWinSide from "../windows/FenestraeWinSide";
import FenestraeWinTop from "../windows/FenestraeWinTop";
import FenestraeWinExtern from "../windows/FenestraeWinExtern";
import FenestraeButton from "./FenestraeButton"; 

const FenestraeContainer = () => {
  const wins = winStore((s) => s.wins);
  const winOrder = winStore((s) => s.winOrder);
  const activeTabId = winStore((s) => s.activeTabId);
  const activeWinId = winStore((s) => s.activeWinId);

  const { setActiveWinId, closeWin } = winStore(
    useShallow((s) => ({ setActiveWinId: s.setActiveWinId, closeWin: s.closeWin }))
  );

  const navigate = useNavigate();
  const location = useLocation();

  // 🌟 SOLUCIÓN AL ORDEN Y RE-RENDERS: Array de pestañas ordenado por creación, aislado del winOrder (Z-index)
  const tabWinsFijas = useMemo(() => {
    return Array.from(wins.values()).filter((w) => w.type === "tab");
  }, [wins]);

  // --- Filtro Single-pass Optimizado para el resto de ventanas flotantes ---
  const { topWins, sideWins, panelWins, floatWins, modalWins, extWins } =
    useMemo(() => {
      const groups = { topWins: [], sideWins: [], panelWins: [], floatWins: [], modalWins: [], extWins: [] };
      
      winOrder.forEach((id) => {
        const w = wins.get(id);
        if (!w) return;
        switch (w.type) {
          case "top":   groups.topWins.push(w);   break;
          case "side":  groups.sideWins.push(w);  break;
          case "panel": groups.panelWins.push(w); break;
          case "float": groups.floatWins.push(w); break;
          case "modal": groups.modalWins.push(w); break;
          case "ext":   groups.extWins.push(w);   break;
        }
      });
      return groups;
    }, [winOrder, wins]);

  const hasWindowsInZone = (zone) => topWins.some((w) => w.docked && w.dockZone === zone);

  return (
    // 1. EL LIENZO GENERAL
    <div className="flex flex-col h-screen w-screen bg-[var(--fn-canvas,#f3f4f6)] overflow-hidden text-[var(--color-window-text,#1f2937)] font-sans antialiased select-none relative">

      {/* ZONA DOCK: TOP */}
      {hasWindowsInZone("top") && (
        <div 
          className="flex-shrink-0 border-b border-[var(--color-window-border,#d1d5db)] bg-[var(--color-window-header,#0a6ed1)]"
       
        >
          <FenestraeDockZone zone="top" initialSize={80} />
        </div>
      )}

      {/* 2. FILA CENTRAL DE DISTRIBUCIÓN */}
      <div className="flex flex-1 flex-row min-h-0 w-full overflow-hidden relative">

        {/* ZONA DOCK: LEFT */}
        {hasWindowsInZone("left") && (
          <div 
            className="flex-shrink-0 border-r border-[var(--color-window-border,#d1d5db)] bg-[var(--color-window-header,#0a6ed1)]"
          
          >
            <FenestraeDockZone zone="left" initialSize={300} />
          </div>
        )}

        {/* CONTENEDOR CENTRAL: ESPACIO DE TRABAJO EN PESTAÑAS (WORKSPACE) */}
        <div className="flex flex-col flex-1 min-w-0 h-full bg-[var(--color-window-bg,#ffffff)] overflow-hidden relative">
          
          {/* BARRA DE PESTAÑAS (TAB BAR) */}
          <nav 
            className="bg-[var(--color-window-content,#fafafa)] border-b border-[var(--color-window-border,#d1d5db)] flex-shrink-0 z-10 shadow-sm flex items-center"
          
          >
            <div className="flex items-center px-2 pt-1 w-full gap-1 overflow-x-auto no-scrollbar h-full">
              {/* 🌟 Mapea desde el array inmutable estabilizado para que no se muevan */}
              {tabWinsFijas.map((w) => (
                <DesktopTab
                  key={w.id}
                  win={w}
                  isActive={activeTabId === w.id}
                  setActiveWinId={setActiveWinId}
                  closeWin={closeWin}
                />
              ))}
            </div>
          </nav>

          {/* ÁREA INTERNA DE CONTENIDO DEL WORKSPACE */}
          <main className="flex-1 relative bg-[var(--color-window-bg,#ffffff)] overflow-hidden min-h-0 w-full">
            <div className="h-full w-full relative">
              {tabWinsFijas.map((w) => (
                <div
                  key={w.id}
                  className={clsx(
                    "h-full w-full absolute inset-0",
                    w.id === activeTabId ? "block z-1" : "hidden",
                  )}
                >
                  {/* 🌟 CORRECCIÓN SINTAXIS: Se remueve el comentario de los atributos HTML */}
                  <div 
                    className="w-full h-full overflow-auto bg-[var(--color-window-content,#fafafa)]"
                    style={{ padding: "0px" }}
                  >
                    {/* 🌟 SOLUCIÓN PADDING: Eliminado por completo (A sangre / Edge-to-edge) */}
                    <React.Suspense fallback={<div>Cargando ventana...</div>}>
                      <FenestraeWinRederer win={w} closeWin={closeWin} />
                    </React.Suspense>
                  </div>
                </div>
              ))}
            </div>

            {/* MODALES LOCALES SUPERPUESTOS AL WORKSPACE */}
            {modalWins.map((w, index) => (
              <FenestraeWinModal key={w.id} win={w} index={index} activeWinId={activeWinId} setActiveWinId={setActiveWinId} />
            ))}
          </main>
        </div>

        {/* ZONA DOCK: RIGHT */}
        {hasWindowsInZone("right") && (
          <div 
            className="flex-shrink-0 border-l border-[var(--color-window-border,#d1d5db)] bg-[var(--color-window-header,#0a6ed1)]"
           
          >
            <FenestraeDockZone zone="right" />
          </div>
        )}

      </div>

      {/* ZONA DOCK: BOTTOM */}
      {hasWindowsInZone("bottom") && (
        <div 
          className="flex-shrink-0 border-t border-[var(--color-window-border,#d1d5db)] bg-[var(--color-window-header,#0a6ed1)]"
         
        >
          <FenestraeDockZone zone="bottom" />
        </div>
      )}

      {/* 3. CAPAS GLOBALES FLOTANTES Y PANELES PERIMETRALES */}
      {floatWins.map((w, index) => (
        <FenestraeWinFloating key={w.id} win={w} index={index} activeWinId={activeWinId} setActiveWinId={setActiveWinId} />
      ))}

      {panelWins.map((w, index) => (
        <FenestraeWinPanel key={w.id} win={w} index={index} activeWinId={activeWinId} setActiveWinId={setActiveWinId} />
      ))}

      {sideWins.map((w, index) => (
        <FenestraeWinSide key={w.id} win={w} index={index} activeWinId={activeWinId} setActiveWinId={setActiveWinId} />
      ))}

      {topWins.filter((w) => !w.docked).map((w, index) => (
        <FenestraeWinTop key={w.id} win={w} index={index} activeWinId={activeWinId} setActiveWinId={setActiveWinId} />
      ))}

      {extWins.map((w) => (
        <FenestraeWinExtern key={w.id} win={w}>
          <React.Suspense fallback={<div>Cargando ventana externa...</div>}>
            <FenestraeWinRederer win={w} closeWin={closeWin} />
          </React.Suspense>
        </FenestraeWinExtern>
      ))}

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE INTERNO: DESKTOP TAB (Estabilizado, sólido y quieto)
// ─────────────────────────────────────────────────────────────────────────────

const DesktopTab = ({ win: w, isActive, setActiveWinId, closeWin }) => {
  const isLaunchpad = w.name?.toLowerCase() === "launchpad" || w.id === LAUNCHPAD_ID;
  const formattedTitle = w.title || w.name || "";

  return (
    <div
      onClick={() => setActiveWinId(w.id)}
      className={clsx(
        "group relative flex items-center px-3 h-full cursor-pointer select-none border-x border-t transition-colors duration-150 z-0",
        isActive
          ? "bg-[var(--color-fn-tab-bg-active,var(--color-window-header,#0a6ed1))] text-[var(--color-fn-tab-text-active,#ffffff)] !z-10 shadow-sm border-[var(--color-fn-tab-border,var(--color-window-border,#d1d5db))]"
          : "bg-[var(--color-fn-tab-bg-inactive,#f3f4f6)] text-[var(--color-fn-tab-text-inactive,#4b5563)] border-transparent hover:bg-gray-200",
        isLaunchpad && "font-bold text-xl",
      )}
      style={{
        minWidth: "var(--fn-tab-min-width, 100px)",
        maxWidth: "var(--fn-tab-max-width, 220px)",
        borderRadius: "var(--radius-fn-tab-radius, 8px) var(--radius-fn-tab-radius, 8px) 0 0",
        flexDirection: "var(--fn-tab-direction, row)", 
      }}
    >
      {/* Indicador de pestaña reactiva inferior */}
      {isActive && (
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ 
            height: "var(--fn-tab-indicator-weight, 0px)", 
            backgroundColor: "var(--color-fn-tab-indicator, transparent)" 
          }}
        />
      )}

      <span className={clsx("truncate flex-1", isLaunchpad ? "text-[0.95rem] font-bold" : "text-sm font-medium")}>
        {isLaunchpad ? (w.title || "Inicio") : formattedTitle}
      </span>

      {w.closable !== false && !isLaunchpad && (
        <FenestraeButton
          iconIndex={1} 
          title="Cerrar pestaña"
          className="ml-2 mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150" 
          onClick={(e) => { 
            e.stopPropagation(); 
            closeWin(w.id); 
          }}
        />
      )}
    </div>
  );
};

export { FenestraeContainer };
export default FenestraeContainer;