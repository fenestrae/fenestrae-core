// core/iframeBridge.js
export function FenestraeiFrame(iframe, winData, closeWin, sameOrigin = false) {
  if (!iframe || !winData) return;

  tryInject();
  iframe.addEventListener("load", tryInject);

  const interval = setInterval(() => {
    if (iframe.contentWindow) {
      tryInject();
      clearInterval(interval);
    }
  }, 10);

  function tryInject() {
    try {
      const cw = iframe.contentWindow;
      if (!cw) return;
      if (cw.fenestrae) return;
      // Cross-origin: no se puede (ni se debe) inyectar nada en el iframe.
      if (!sameOrigin) return;

      // Bridge mínimo a propósito: showPopup/context/onSave en el iframe
      // permitirían a una página same-origin hostil manejar el workspace.
      cw.fenestrae = {
        winId: winData.id,
        close: () => closeWin(winData.id),
      };
    } catch (e) {
      console.warn("⚠️ No se pudo inyectar FenestraeBridge en el iframe:", e);
    }
  }
}
