// core/iframeBridge.js
import { winStore } from "../core/winStore";
import { win, context } from "../core/index";

export function FenestraeiFrame(iframe, winData, closeWin) {
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

      const s = () => winStore.getState();

      const onSave = winData.onSave || winData.params?.onSave || (() => { });
      const onCancel = winData.onCancel || winData.params?.onCancel || (() => { });
      const onClose = winData.onClose || winData.params?.onClose || (() => { });
      const onError = winData.onError || winData.params?.onError || (() => { });
      const onApply = winData.onApply || winData.params?.onApply || (() => { });
      const onDelete = winData.onDelete || winData.params?.onDelete || (() => { });
      const onNext = winData.onNext || winData.params?.onNext || (() => { });
      const onPrev = winData.onPrev || winData.params?.onPrev || (() => { });

      cw.fenestrae = {
        name: winData.name,
        type: winData.type,

        close: () => closeWin(winData.id),

        routeParams: winData.params,
        winId: winData.id,

        onSave,
        onCancel,
        onError,
        onApply,
        onDelete,
        onNext,
        onPrev,

        // ⭐ API pública correcta
        showTab: win.showTab,
        showModal: win.showModal,
        showFloat: win.showFloat,
        showSide: win.showSide,
        showTop: win.showTop,
        showPanel: win.showPanel,
        showExt: win.showExt,
        showPopup: win.showPopup,
        showPopupSimple: win.showPopupSimple,

        isPortal: winData.isPortal || winData.params?.isPortal,

        onClose: (data) => safeClose(winData, closeWin, data),

        modalProps: {
          winId: winData.id,
          onSave,
          onClose,
        },

        context: context,
      };

     /* cw.addEventListener("beforeunload", () => {
       safeClose(winData, closeWin);
      });
*/
     /* cw.addEventListener("unload", () => {
        safeClose(winData, closeWin);
      });
*/
    
   //  console.log("🔥 FenestraeBridge inyectado correctamente en iframe:", winData.id);

    } catch (e) {
      console.warn("⚠️ No se pudo inyectar FenestraeBridge en el iframe:", e);
    }
  }

  function safeClose(winData, closeWin, data) {
  try {
    if (typeof winData.onClose === "function") {
      winData.onClose(data);
    }
  } catch (e) {
    console.warn("⚠️ Error en onClose del módulo:", e);
  }

  try {
    if (typeof closeWin === "function") {
      closeWin(winData.id);
    }
  } catch (e) {
    console.warn("⚠️ Error cerrando ventana:", e);
  }
}

}
