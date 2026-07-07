import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { POPUP_BRIDGE_SCRIPT } from './popupBridge';

export const injectPopupBridge = (popupWindow, componentName, params = {}, storeInstance) => {
  if (!popupWindow || popupWindow.closed) return;

  try {
    // 1. Inyectar dependencias globales en el contexto del hijo
    popupWindow.React = React;
    popupWindow.ReactDOM = ReactDOM;
    
    // Guardamos la instancia del store principal en el popup para que sus
    // sub-componentes ejecuten las acciones contra la madre de forma transparente
    popupWindow.__fenestraeStore__ = storeInstance;

    // 2. Inyectar el script del bridge
    const script = popupWindow.document.createElement('script');
    script.textContent = POPUP_BRIDGE_SCRIPT;
    popupWindow.document.head.appendChild(script);
    
    // 3. Copiar estilos CSS para mantener consistencia visual (Windows XP, Fiori, etc.)
    copyGlobalStyles(popupWindow);

    // 4. 🔥 EL TRUCO: Forzar el renderizado del Workspace MDI dentro del Popup
    // Buscamos el contenedor nativo del hijo
    const container = popupWindow.document.getElementById('root');
    if (container) {
      const root = ReactDOM.createRoot(container);
      
      // Aquí invocamos a tu renderizador dinámico del framework (ej: FenestraeWinRenderer o tu contenedor MDI)
      // Pasándole el contexto de ejecución nativo del popup
      const FenestraeWinRenderer = window.__FenestraeRendererComponent__; 

      if (FenestraeWinRenderer) {
        root.render(
          React.createElement(FenestraeWinRenderer, {
            windowContext: popupWindow, // 👈 Muy importante para que sepa dónde abrir las sub-ventanas
            componentName: componentName,
            params: params
          })
        );
      } else {
        console.warn("[Fenestrae] No se encontró el componente de renderizado global.");
      }
    }
    
  } catch (err) {
    console.error('Error inyectando bridge y renderizador:', err);
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
    
    // Copiar variables CSS del :root (Temas dinámicos de Fenestrae)
    const rootStyles = window.getComputedStyle(document.documentElement);
    const targetRoot = targetWindow.document.documentElement;
    for (let i = 0; i < document.styleSheets.length; i++) {
      // Sincroniza propiedades personalizadas dinámicas de temas
      targetRoot.style.cssText = document.documentElement.style.cssText;
    }
  } catch (err) {
    console.warn('⚠️ Error copiando estilos o variables temáticas:', err);
  }
};