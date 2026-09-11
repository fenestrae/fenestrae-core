import { POPUP_BRIDGE_SCRIPT } from './popupBridge';

export const injectPopupBridge = (popupWindow) => {
  if (!popupWindow || popupWindow.closed) return;

  try {
    // El popup se pinta con createPortal desde el padre. No se inyecta React
    // ni el store: un XSS en el hijo tendría el Zustand completo del workspace.
    const script = popupWindow.document.createElement('script');
    script.textContent = POPUP_BRIDGE_SCRIPT;
    popupWindow.document.head.appendChild(script);

    copyGlobalStyles(popupWindow);
  } catch (err) {
    console.error('Error inyectando bridge:', err);
  }
};

const copyGlobalStyles = (targetWindow) => {
  try {
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(style => {
      if (style.tagName === 'STYLE') {
        const newStyle = targetWindow.document.createElement('style');
        newStyle.textContent = style.textContent;
        targetWindow.document.head.appendChild(newStyle);
      } else if (style.tagName === 'LINK') {
        const newLink = targetWindow.document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = style.href;
        targetWindow.document.head.appendChild(newLink);
      }
    });

    const targetRoot = targetWindow.document.documentElement;
    targetRoot.style.cssText = document.documentElement.style.cssText;

  } catch (err) {
    console.warn('⚠️ Error copiando estilos o variables temáticas:', err);
  }
};
