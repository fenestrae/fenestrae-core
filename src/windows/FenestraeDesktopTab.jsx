import PropTypes from "prop-types";
import { memo } from "react";
import clsx from "clsx";

import { winStore, getLaunchpadId } from "../core";
import FNButton from "../components/FNButton";
// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE INTERNO: DESKTOP TAB (Estabilizado, sólido y quieto)
// ─────────────────────────────────────────────────────────────────────────────

const FenestraeDesktopTab = memo(({ win: w, isActive, setActiveWinId, closeWin }) => {
  const isLaunchpad = w.id === getLaunchpadId();
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
        <FNButton
          iconIndex={1}
          title="close Tab"
          className="fn-btn fn-btn-close fn-btn-hidden-hover"
          onClick={(e) => {
            e.stopPropagation();
            closeWin(w.id);
          }}
        />
      )}
    </div>
  );
});

export default FenestraeDesktopTab;