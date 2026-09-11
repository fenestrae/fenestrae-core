import { useEffect, useRef } from "react";
import { getFrameSandbox } from "../lib/security";

export function injectFenestraeFrameBridge(iframe, winData, closeWin, sameOrigin = false) {
  if (!iframe || !winData) return () => {};

  const tryInject = () => {
    try {
      const cw = iframe.contentWindow;
      if (!cw) return;
      if (cw.fenestrae) return;
      if (!sameOrigin) return;

      cw.fenestrae = {
        winId: winData.id,
        close: () => closeWin(winData.id),
      };
    } catch (e) {
      console.warn("⚠️ No se pudo inyectar FenestraeBridge en el iframe:", e);
    }
  };

  tryInject();
  iframe.addEventListener("load", tryInject);

  const interval = setInterval(() => {
    if (iframe.contentWindow) {
      tryInject();
      clearInterval(interval);
    }
  }, 50);

  return () => {
    clearInterval(interval);
    iframe.removeEventListener("load", tryInject);
  };
}

export function FenestraeFrame({ win, closeWin, trusted, inputLocked = false }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    return injectFenestraeFrameBridge(
      iframeRef.current,
      win,
      closeWin,
      trusted.sameOrigin,
    );
  }, [win, closeWin, trusted.sameOrigin]);

  return (
    <iframe
      ref={iframeRef}
      src={trusted.href}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
        pointerEvents: inputLocked ? "none" : "auto",
      }}
      loading="lazy"
      sandbox={getFrameSandbox(trusted.sameOrigin)}
      referrerPolicy="no-referrer"
      title={win.title || "Fenestrae External Window"}
    />
  );
}

export function FenestraeiFrame(iframe, winData, closeWin, sameOrigin = false) {
  return injectFenestraeFrameBridge(iframe, winData, closeWin, sameOrigin);
}
