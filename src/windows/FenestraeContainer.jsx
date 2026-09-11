import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import clsx from "clsx";
import { winStore, externalWindowInstances } from "../core";
import { restoreWindows } from "../database/persistence";
import { STORAGE_KEYS, LAUNCHPAD_LOGICAL_ID } from "../core/constants";
import {
  selectDockedZones,
  selectFixedByZone,
  selectFloatingTops,
  selectOrderedByType,
  selectTabs,
} from "../core/windowSelectors";

import FenestraeDockZone from "./FenestraeDockedWindow";
import FenestraeWinRenderer from "./FenestraeWinRenderer";
import FenestraeWinModal from "./FenestraeWinModal";
import FenestraeWinFloating from "./FenestraeWinFloating";
import FenestraeWinPanel from "./FenestraeWinPanel";
import FenestraeWinSide from "./FenestraeWinSide";
import FenestraeWinTop from "./FenestraeWinTop";
import FenestraeWinExtern from "./FenestraeWinExtern";
import FenestraeDesktopTab from "./FenestraeDesktopTab";
import FenestraeFixedZone from "./FenestraeFixedZone";
import FreezeInactive from "./FreezeInactive";

import { useShortcuts } from "../hooks/useShortcuts";
import { postToWindow } from "../lib/security";
import { WIN_TYPES } from "../store/types";

const SECONDARY_TYPES = new Set([
  WIN_TYPES.PANEL,
  WIN_TYPES.MODAL,
  WIN_TYPES.FLOAT,
  WIN_TYPES.SIDE,
]);

const FenestraeContainer = ({ initialWinConfig, bootStrap = null }) => {
  const hasHydrated = winStore((s) => s.hasHydrated);
  const activeTabId = winStore((s) => s.activeTabId);
  const activeWinId = winStore((s) => s.activeWinId);

  const { setActiveWinId, closeWin } = winStore(
    useShallow((s) => ({
      setActiveWinId: s.setActiveWinId,
      closeWin: s.closeWin,
    }))
  );

  const tabWinsFijas = winStore(useShallow((s) => selectTabs(s.wins)));
  const floatWins = winStore(useShallow((s) => selectOrderedByType(s.wins, s.winOrder, WIN_TYPES.FLOAT)));
  const modalWins = winStore(useShallow((s) => selectOrderedByType(s.wins, s.winOrder, WIN_TYPES.MODAL)));
  const panelWins = winStore(useShallow((s) => selectOrderedByType(s.wins, s.winOrder, WIN_TYPES.PANEL)));
  const sideWins = winStore(useShallow((s) => selectOrderedByType(s.wins, s.winOrder, WIN_TYPES.SIDE)));
  const extWins = winStore(useShallow((s) => selectOrderedByType(s.wins, s.winOrder, WIN_TYPES.EXT)));
  const topWins = winStore(useShallow((s) => selectFloatingTops(s.wins, s.winOrder)));
  const dockedZones = winStore(useShallow((s) => selectDockedZones(s.wins)));
  const fixedTop = winStore(useShallow((s) => selectFixedByZone(s.wins, "top")));
  const fixedLeft = winStore(useShallow((s) => selectFixedByZone(s.wins, "left")));
  const fixedRight = winStore(useShallow((s) => selectFixedByZone(s.wins, "right")));
  const fixedBottom = winStore(useShallow((s) => selectFixedByZone(s.wins, "bottom")));

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

  const firstRunRef = useRef(false);
  useEffect(() => {
    if (firstRunRef.current) return;
    firstRunRef.current = true;

    async function runRestore() {
      const isNew = await restoreWindows(initialWinConfig);
      if (isNew && typeof bootStrap === "function") {
        const workspace = sessionStorage.getItem(STORAGE_KEYS.WORKSPACE);
        bootStrap(workspace);
      }
    }
    runRestore();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    winStore.getState().wins.forEach((w) => {
      if (w.type === WIN_TYPES.EXT && w.params?.popupWindowInstance) {
        externalWindowInstances.set(w.id, w.params.popupWindowInstance);
      }
    });
  }, [hasHydrated]);

  const rotateTab = useCallback((direction) => {
    const { wins, activeTabId: currentTab, setActiveWinId: setActive } = winStore.getState();
    const tabs = selectTabs(wins);
    if (tabs.length <= 1) return;
    const currentIndex = tabs.findIndex((w) => w.id === currentTab);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= tabs.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = tabs.length - 1;
    setActive(tabs[nextIndex].id);
  }, []);

  const shortcuts = useMemo(
    () => ({
      "Ctrl+Tab": () => rotateTab(1),
      "Ctrl+Shift+Tab": () => rotateTab(-1),
      "Alt+ArrowRight": () => rotateTab(1),
      "Alt+ArrowLeft": () => rotateTab(-1),
      F7: (e) => {
        e.preventDefault();
      },
      "Alt+F4": () => {
        const { activeWinId: id, closeWin: close } = winStore.getState();
        if (id && id !== LAUNCHPAD_LOGICAL_ID) close(id);
      },
      "Alt+w": () => {
        const { activeWinId: id, closeWin: close } = winStore.getState();
        if (id && id !== LAUNCHPAD_LOGICAL_ID) close(id);
      },
      Escape: () => {
        const { wins, activeWinId: id, closeWin: close } = winStore.getState();
        const currentWin = wins.get(id);
        if (!currentWin) return;
        if (SECONDARY_TYPES.has(currentWin.type)) close(id);
      },
    }),
    [rotateTab],
  );

  useShortcuts(shortcuts, true);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--fn-canvas,#f3f4f6)] overflow-hidden text-[var(--color-window-text,#1f2937)] font-sans antialiased select-none relative">

      {fixedTop.map((w) => (
        <FenestraeFixedZone key={w.id} win={w} />
      ))}

      {dockedZones.top && (
        <div className="flex-shrink-0 border-b bg-[var(--color-window-header,#0a6ed1)]">
          <FenestraeDockZone zone="top" initialSize={80} />
        </div>
      )}

      <div className="flex flex-1 flex-row min-h-0 w-full overflow-hidden relative">

        {fixedLeft.map((w) => (
          <FenestraeFixedZone key={w.id} win={w} />
        ))}

        {dockedZones.left && (
          <div className="flex-shrink-0 border-r bg-[var(--color-window-header,#0a6ed1)]">
            <FenestraeDockZone zone="left" initialSize={300} />
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0 h-full bg-[var(--color-window-bg,#ffffff)] overflow-hidden relative">

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
                    <FreezeInactive active={w.id === activeTabId}>
                      <React.Suspense fallback={<div>Cargando ventana...</div>}>
                        <FenestraeWinRenderer win={w} closeWin={closeWin} />
                      </React.Suspense>
                    </FreezeInactive>
                  </div>
                </div>
              ))}
            </div>

            {modalWins.map((w, index) => (
              <FenestraeWinModal
                key={w.id}
                win={w}
                index={index}
                isActive={activeWinId === w.id}
                setActiveWinId={setActiveWinId}
              />
            ))}
          </main>
          {dockedZones.bottom && (
            <div className="flex-shrink-0 border-t bg-[var(--color-window-header,#0a6ed1)]">
              <FenestraeDockZone zone="bottom" />
            </div>
          )}
        </div>

        {dockedZones.right && (
          <div className="flex-shrink-0 border-l bg-[var(--color-window-header,#0a6ed1)]">
            <FenestraeDockZone zone="right" />
          </div>
        )}

        {fixedRight.map((w) => (
          <FenestraeFixedZone key={w.id} win={w} />
        ))}
      </div>

      {fixedBottom.map((w) => (
        <FenestraeFixedZone key={w.id} win={w} />
      ))}

      {floatWins.map((w, index) => (
        <FenestraeWinFloating
          key={w.id}
          win={w}
          index={index}
          isActive={activeWinId === w.id}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {panelWins.map((w, index) => (
        <FenestraeWinPanel
          key={w.id}
          win={w}
          index={index}
          isActive={activeWinId === w.id}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {sideWins.map((w) => (
        <FenestraeWinSide
          key={w.id}
          win={w}
          isActive={activeWinId === w.id}
          setActiveWinId={setActiveWinId}
        />
      ))}

      {topWins.map((w, index) => (
        <FenestraeWinTop
          key={w.id}
          win={w}
          index={index}
          isActive={activeWinId === w.id}
          setActiveWinId={setActiveWinId}
        />
      ))}

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
