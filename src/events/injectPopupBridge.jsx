import React from 'react';
import ReactDOM from 'react-dom/client'; // 👈 Importar ReactDOM
import { POPUP_BRIDGE_SCRIPT } from './popupBridge';


export const injectPopupBridge = (popupWindow) => {
  if (!popupWindow || popupWindow.closed) return;

  try {
    // 1. Primero, asegurar que React esté disponible en el popup
    // Esto es crucial para que los hooks funcionen
    popupWindow.React = React;
    
    // 2. También podemos exponer otros globals necesarios
    popupWindow.ReactDOM = ReactDOM;
    
    // 3. Luego inyectar el bridge
    const script = popupWindow.document.createElement('script');
    script.textContent = POPUP_BRIDGE_SCRIPT;
    popupWindow.document.head.appendChild(script);
    
   // console.log('Bridge inyectado en popup');

     // Copiar estilos (opcional)
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
  } catch (err) {
    console.warn('⚠️ Error copiando estilos:', err);
  }
};