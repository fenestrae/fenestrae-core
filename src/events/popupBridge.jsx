// popupBridge.js - Script que se inyecta en ventanas popup
// NOTA: Este archivo NO debe tener imports, es texto plano que se inyecta

export const POPUP_BRIDGE_SCRIPT = `
(function() {
  // Evitar múltiples inicializaciones
  if (window.__erpPopupBridge) return;
  window.__erpPopupBridge = true;

  console.log('🔌 ERP Popup Bridge iniciado');

  /**
   * Proxy del EventBus para comunicación con ventana principal
   */
  class PopupEventBus {
    constructor() {
      this.listeners = new Map();
      this.pendingQueue = {};
      this.setupMessageListener();
      this.notifyReady();
    }

    /**
     * Escuchar mensajes de la ventana principal
     */
    setupMessageListener() {
      window.addEventListener('message', (event) => {
        // Solo aceptar mensajes del opener y del mismo origen.
        if (event.origin !== window.location.origin) return;
        if (event.source !== window.opener) return;

        const { type, channel, payload } = event.data;

        switch(type) {
          case 'EVENT':
            this.dispatchEvent(channel, payload);
            break;
          case 'STORE_SYNC':
            this.handleStoreSync(payload);
            break;
          case 'PING':
            this.sendMessage('PONG');
            break;
        }
      });
    }

    /**
     * Notificar que la ventana está lista
     */
    notifyReady() {
      // Esperar a que el opener esté disponible
      if (window.opener && !window.opener.closed) {
        this.sendMessage('POPUP_READY');
      } else {
        // Reintentar si el opener no está listo
        setTimeout(() => this.notifyReady(), 100);
      }
    }

    /**
     * Enviar mensaje a la ventana principal
     */
    sendMessage(type, data = {}) {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type,
          ...data,
          _source: 'popup',
          _timestamp: Date.now()
        }, window.location.origin);
      }
    }

    /**
     * SUSCRIBIRSE a un evento
     * @param {string} channel - Nombre del canal
     * @param {function} callback - Función a ejecutar
     * @returns {function} unsubscribe
     */
    on(channel, callback) {
      if (!this.listeners.has(channel)) {
        this.listeners.set(channel, new Set());
        
        // Notificar a principal que queremos suscribirnos
        this.sendMessage('SUBSCRIBE', { channel });
      }
      
      this.listeners.get(channel).add(callback);

      // Procesar eventos en cola para este canal
      this.processPendingQueue(channel, callback);

      // Retornar función de limpieza
      return () => {
        const listeners = this.listeners.get(channel);
        if (listeners) {
          listeners.delete(callback);
          if (listeners.size === 0) {
            this.listeners.delete(channel);
            this.sendMessage('UNSUBSCRIBE', { channel });
          }
        }
      };
    }

    /**
     * EMITIR un evento hacia la ventana principal
     * @param {string} eventName - Nombre del evento
     * @param {any} payload - Datos del evento
     */
    emit(eventName, payload) {
      this.sendMessage('EMIT', { 
        eventName, 
        payload 
      });
    }

    /**
     * Dispatch local de eventos recibidos
     */
    dispatchEvent(channel, payload) {
      const listeners = this.listeners.get(channel);
      if (listeners && listeners.size > 0) {
        listeners.forEach(callback => {
          try {
            callback(payload);
          } catch (err) {
            console.error(\`[PopupBridge] Error en \${channel}:\`, err);
          }
        });
      } else {
        // Guardar en cola para cuando haya listeners
        if (!this.pendingQueue[channel]) {
          this.pendingQueue[channel] = [];
        }
        this.pendingQueue[channel].push(payload);
      }
    }

    /**
     * Procesar eventos en cola cuando aparece un listener
     */
    processPendingQueue(channel, callback) {
      const queue = this.pendingQueue[channel];
      if (queue && queue.length > 0) {
        queue.forEach(payload => {
          try {
            callback(payload);
          } catch (err) {
            console.error(\`[PopupBridge] Error procesando cola \${channel}:\`, err);
          }
        });
        delete this.pendingQueue[channel];
      }
    }

    /**
     * Manejar sincronización del store
     */
    handleStoreSync(patches) {
      console.log('Store patches recibidos:', patches);
      this.dispatchEvent('STORE_UPDATED', { patches });
    }
  }

  // Exponer instancia global
  window.externalBus = new PopupEventBus();

  // NOTA: Los hooks de React NO van aquí
  // Los componentes usarán window.externalBus directamente con useEffect

  console.log('✅ Popup Bridge listo');
})();
`;

export default POPUP_BRIDGE_SCRIPT;