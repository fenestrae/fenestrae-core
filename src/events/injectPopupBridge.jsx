import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { POPUP_BRIDGE_SCRIPT } from './popupBridge';

export const injectPopupBridge = (popupWindow, componentName, params = {}, storeInstance) => {
  if (!popupWindow || popupWindow.closed) return;

  try {
    // 1. Inyectar dependencias globales en el contexto del hijo
    popupWindow.React = React;
    popupWindow.ReactDOM = ReactDOM;

    // 2. Guardar la instancia del store principal
    popupWindow.__fenestraeStore__ = storeInstance;

    // 3. Inyectar el script del bridge (event bus)
    const script = popupWindow.document.createElement('script');
    script.textContent = POPUP_BRIDGE_SCRIPT;
    popupWindow.document.head.appendChild(script);

    // 4. Copiar estilos globales y variables CSS
    copyGlobalStyles(popupWindow);

    // ❗ IMPORTANTE:
    // Ya NO renderizamos nada aquí.
    // El renderizado del formulario lo hace FenestraeWinExtern vía createPortal.

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

    // Copiar variables CSS del :root
    const targetRoot = targetWindow.document.documentElement;
    targetRoot.style.cssText = document.documentElement.style.cssText;

  } catch (err) {
    console.warn('⚠️ Error copiando estilos o variables temáticas:', err);
  }
};
