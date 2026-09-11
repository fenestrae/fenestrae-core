// ============================================================================
// FENESTRAE - API PÚBLICA & BARRIL CENTRALIZADO (core/index.js)
// Punto único de entrada para los consumidores de la librería y submódulos.
// Satisface las exportaciones requeridas por Vite/Rollup en producción.
// ============================================================================

import { winStore, externalWindowInstances} from "./winStore";
import { STORAGE_KEYS, ROOT_PARENT_ID } from "./constants";

import {  contextRepository} from "../database/ContextRepository";
import { formsRegistry } from './slices/misc';
import { WIN_TYPES } from "../store/types";

const s = () => winStore.getState();

/**
 * API Imperativa Global Fenestrae.
 * Equivalente a interactuar con el administrador de ventanas de un Sistema Operativo.
 * Todos los métodos son síncronos excepto los disparadores de flujos de ventanas
 * que dependan de resoluciones asíncronas delegadas.
 */
export const win = {

  // --------------------------------------------------------------------------
  // REGISTRO DE COMPONENTES
  // --------------------------------------------------------------------------

  /** Registra uno o varios componentes React en el diccionario central de Fenestrae. */
  register: (components) => s().register(components),


  // --------------------------------------------------------------------------
  // CREACIÓN DE VENTANAS (sin mostrar)
  // --------------------------------------------------------------------------

  /** Crea una estructura de ventana sin inyectarla visualmente. Retorna su winId. */
  createWindow: (
    parentId = ROOT_PARENT_ID,
    {
      component,
      typeshow = WIN_TYPES.FLOAT,
      x = 100,
      y = 100,
      width = 600,
      height = 450,
      params = {},
      callbacks = {},
      title,
    } = {}
  ) => {

   
    
    const entry = formsRegistry.get(component?.toLowerCase());
    if (!entry) {
      console.warn(`[Fenestrae] Componente no registrado previamente en el sistema: ${component}`);
      return null;
    }
   
    const winId = s().createWin(parentId, {
      type: typeshow,
      name: component.toLowerCase(),
      title: title || params.title || entry.title || component.toUpperCase(),
      visible: false,
      params: {
        ...params,
        name: component.toLowerCase(),
        this: params.initialData || {},
        x, y, width, height,
      },
      safeCallbacks: callbacks,
    });

    return winId;
  },


  // --------------------------------------------------------------------------
  // MOSTRAR / OCULTAR / DESTRUIR (Ciclo de Vida MDI)
  // --------------------------------------------------------------------------

  /** Fuerza la visibilidad de una ventana previamente construida. */
  showWindow: (winId) => {
    s().setVisible(winId, true);
    s().bringToFront(winId);
  },

  /** Oculta virtualmente una ventana preservando su estado de memoria interno. */
  hideWindow: (winId) => {
    s().setVisible(winId, false);
  },

  /** Destruye de forma atómica una ventana y libera en cascada a sus descendientes. */
  destroyWindow: (winId) => {
    s().closeWin(winId);
  },
  // --------------------------------------------------------------------------
  // LAYOUT GEOMÉTRICO
  // --------------------------------------------------------------------------

  /** Traslada las coordenadas físicas de renderizado x, y de una ventana. */
  moveWindow: (winId, x, y) =>
    s().updateWinLayout(winId, { x, y }),

  /** Redimensiona dinámicamente el ancho y el alto de una ventana MDI. */
  resizeWindow: (winId, width, height) =>
    s().updateWinLayout(winId, { width, height }),

  /** Altera de forma reactiva el título visible en el encabezado de la ventana. */
  setWindowTitle: (winId, caption) =>
    s().setCaption(winId, caption),


  // --------------------------------------------------------------------------
  // FOCO Y ORDEN Z
  // --------------------------------------------------------------------------

  /** Trae una ventana al plano superior de visualización aplicando foco activo. */
  focusWindow: (winId) =>
    s().bringToFront(winId),

  /** Minimiza una ventana enviándola a la barra de tareas o buffer inactivo. */
  minimizeWindow: (winId) =>
    s().minimizeWin(winId),

  /** Maximiza o restaura el layout ocupando el viewport del Workspace. */
  maximizeWindow: (winId) =>
    s().maximizeWin(winId),

  /** Recupera el ID de la pestaña raíz activa en el contenedor de primer nivel. */
  getActiveTab: () =>
    s().getActiveTab(),

  

  // --------------------------------------------------------------------------
  // APERTURA RÁPIDA (API de consumo directo)
  // --------------------------------------------------------------------------

  showTab: (parent, name, params = {}, route = "") => s().showTab(parent, name, params, route),
  showModal: (parent, name, params = {}, cb = {}) => s().showModal(parent, name, params, cb),
  showFloat: (parent, name, params = {}, cb = {}) => s().showFloat(parent, name, params, cb),
  showSide: (parent, name, params = {}, cb = {}) => s().showSide(parent, name, params, cb),
  showTop: (parent, name, params = {}, cb = {}) => s().showTop(parent, name, params, cb),
  showPanel: (parent, name, params = {}, cb = {}) => s().showPanel(parent, name, params, cb),
  showExt: (parent, name, params = {}, cb = {}) => s().showExt(parent, name, params, cb),
  showPopup: (parent, name, params = {}, cb = {}, opt = {}) => s().showPopup(parent, name, params, cb, opt),
  showPopupSimple: (name, params = {}, opt = {}) => s().showPopupSimple(name, params, opt),





  // --------------------------------------------------------------------------
  // CONTEXTOS Y UTILIDADES DE SISTEMA
  // --------------------------------------------------------------------------

  setMatchCode: (winId) => s().setMatchCode(winId),
  setUser: (user) => s().setUser(user),
  setEmpresa: (nombre) => s().setEmpresa(nombre),
  setCache: (winId, data) => s().setCache(winId, data),
  isModal: (winId) => s().isModal(winId),
  isFloat: (winId) => s().isFloat(winId),
  isRestored: (winId) => s().isRestored(winId),

  /** Purga por completo el Workspace restableciendo el almacén a su estado original. */
  reset: () => s().resetStore(),


  // --------------------------------------------------------------------------
  // ENCAJADO DE COMPONENTES (DOCKING)
  // --------------------------------------------------------------------------

  /** Acopla una ventana flotante a una zona perimetral del Workspace reteniendo su geometría previa. */
  dock: (winId, zone) => s().dockWin(winId, zone),

  /** Libera una ventana encajada devolviéndola al espacio flotante con su tamaño original. */
  undock: (winId) => s().undockWin(winId),

  /** Acopla una ventana a la zona fixed de la ventana */
  fixed: (winId, zone) => s().fixedWin(winId, zone),

  /** Libera una ventana encajada devolviéndola al espacio flotante con su tamaño original. */
  unfixed: (winId) => s().unfixedWin(winId),



};


// ---------------------------------------------------------------------------
// API DE INICIALIZACIÓN EMPRESARIAL
// ---------------------------------------------------------------------------

// --------------------------------------------------------------------------
// EXPORTACIONES COMPORTAMIENTALES (Para consumo interno y avanzado)
// --------------------------------------------------------------------------
export function getLaunchpadId() {
  return sessionStorage.getItem(STORAGE_KEYS.LAUNCHPAD_ID);
}



export { LAUNCHPAD_LOGICAL_ID, ROOT_PARENT_ID, STORAGE_KEYS } from "./constants";
export { winStore, externalWindowInstances };


export const context = {
  save: contextRepository.save.bind(contextRepository),
  saveDebounced: contextRepository.saveDebounced.bind(contextRepository),
  load: contextRepository.load.bind(contextRepository),
  clear: contextRepository.remove.bind(contextRepository),
  clearAll: contextRepository.clearWindow.bind(contextRepository),
};


