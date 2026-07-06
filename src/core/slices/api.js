// ============================================================================
// FENESTRAE - SLICE: API PÚBLICA (core/slices/api.js)
// High-level methods to open windows, tabs, modals and popups.
// ============================================================================

import { injectPopupBridge } from '../../events/injectPopupBridge';
import { formsRegistry } from './misc';
import { externalWindowInstances } from './lifecycle';

export const createApiSlice = (set, get) => ({

  // -------------------------------------------------------------------------
  // showTab — Opens or reuses a tab by component name
  // -------------------------------------------------------------------------
  showTab: (winIdParent, name, params = {}, route = "") => {
    const validParentId = winIdParent && winIdParent !== "" ? winIdParent : "0";
    if (!name || typeof name !== "string") return null;
    const componentName = name.toLowerCase();

    const entry = formsRegistry.get(componentName);
    if (!entry) return null;

    const queryString = new URLSearchParams(params).toString();
    const fullPathBase = entry.route
      ? `${entry.route}${route}${entry.path || ""}`
      : `${entry.path || ""}${route}`;
    const fullPath = queryString ? `${fullPathBase}?${queryString}` : fullPathBase;

    return get().createWin(validParentId, {
      type: "tab",
      name: componentName,
      title: params.titulo || params.title || entry.title || name.toUpperCase(),
      path: fullPath,
      params: { ...params, name: componentName, isTab: true, route, this: params.initialData || {} },
      safeCallbacks: {},
    });
  },

  // -------------------------------------------------------------------------
  // show — Opens any window type: float, modal, panel, side, ext
  // -------------------------------------------------------------------------
  show: (winIdParent, name, params = {}, callbacks = {}, typeshow = "float") => {
    return new Promise((resolve, reject) => {
      const validParentId = winIdParent && winIdParent !== "" ? winIdParent : "0";
      const componentName = name?.toLowerCase();
 
      const entry = formsRegistry.get(componentName);
      if (!entry) return reject({ status: "error", message: `[Fenestrae] Component not registered: "${name}"` });
 
      const safeCallbacks = {
        ...callbacks,
        onSave:   (data)   => { callbacks?.onSave?.(data);       resolve({ status: "saved",      data }); },
        onClose:  (data)   => { callbacks?.onClose?.(data);      resolve({ status: "closed",     data }); },
        onCancel: (reason) => { callbacks?.onCancel?.(reason);   resolve({ status: "cancelled",  reason }); },
        onError:  (err)    => { callbacks?.onError?.(err);       reject ({ status: "error",      error: err }); },
        onApply:  (data)   => { callbacks?.onApply?.(data);      resolve({ status: "applied",    data }); },
        onDelete: (data)   => { callbacks?.onDelete?.(data);     resolve({ status: "deleted",    data }); },
        onNext:   (data)   => { callbacks?.onNext?.(data);       resolve({ status: "navigated",  direction: "next", data }); },
        onPrev:   (data)   => { callbacks?.onPrev?.(data);       resolve({ status: "navigated",  direction: "prev", data }); },
      };
 
      // Promote layout values to winData root so lifecycle.js can read them
      // directly, regardless of window type. params keeps them too for
      // components that read their own geometry from params.
      const x      = params.x      ?? 100;
      const y      = params.y      ?? 100;
      const width  = params.width  ?? 600;
      const height = params.height ?? 450;
 
      get().createWin(validParentId, {
        type: typeshow,
        name: componentName,
        title: params.titulo || params.title || componentName.toUpperCase(),
        visible: true,
        x, y, width, height,
        params: {
          ...params, name: componentName, this: params.initialData || {},
          x, y, width, height,
        },
        ...safeCallbacks,
      });
    });
  },

  // -------------------------------------------------------------------------
  // Atajos por tipo (mapeo imperativo a show)
  // -------------------------------------------------------------------------
  showModal: (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "modal"),
  showFloat: (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "float"),
  showTop:   (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "top"),
  showPanel: (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "panel"),
  showSide:  (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "side"),
  showExt:   (winIdParent, name, params = {}, callbacks = {}) => get().show(winIdParent, name, params, callbacks, "ext"),

  // -------------------------------------------------------------------------
  // showPopup — Opens in a native browser window (window.open)
  // -------------------------------------------------------------------------
  showPopup: (winIdParent, name, params = {}, callbacks = {}, options = {}) => {
    return new Promise((resolve, reject) => {
      const validParentId = winIdParent && winIdParent !== "" ? winIdParent : "0";
      const componentName = name?.toLowerCase();

      const entry = formsRegistry.get(componentName);
      if (!entry) return reject({ status: 'error', message: `[Fenestrae] Component not registered for external window: "${name}"` });

      const defaultOptions = {
        width: params.width || 900, height: params.height || 700,
        resizable: true, scrollbars: true, status: true,
        menubar: false, toolbar: false, location: false,
        usePip: false, ...options,
      };

      const safeCallbacks = {
        ...callbacks,
        onSave:   (data)   => { callbacks?.onSave?.(data);     resolve({ status: 'saved',     data }); },
        onClose:  (data)   => { callbacks?.onClose?.(data);    resolve({ status: 'closed',    data }); },
        onCancel: (reason) => { callbacks?.onCancel?.(reason); resolve({ status: 'cancelled', reason }); },
        onError:  (err)    => { callbacks?.onError?.(err);     reject ({ status: 'error',     error: err }); },
        onDelete: (data)   => { callbacks?.onDelete?.(data);   resolve({ status: 'deleted',   data }); },
        onNext:   (data)   => { callbacks?.onNext?.(data);     resolve({ status: 'navigated', direction: 'next', data }); },
        onPrev:   (data)   => { callbacks?.onPrev?.(data);     resolve({ status: 'navigated', direction: 'prev', data }); },
      };

      const left = defaultOptions.left ?? 500;
      const top  = defaultOptions.top  ?? 400;

      const features = [
        `width=${defaultOptions.width}`, `height=${defaultOptions.height}`,
        `x=${left}`, `y=${top}`, `left=${left}`, `top=${top}`, `screenX=${left}`, `screenY=${top}`,
        `resizable=${defaultOptions.resizable ? 'yes' : 'no'}`,
        `scrollbars=${defaultOptions.scrollbars ? 'yes' : 'no'}`,
        `status=${defaultOptions.status ? 'yes' : 'no'}`,
        `menubar=${defaultOptions.menubar ? 'yes' : 'no'}`,
        `toolbar=${defaultOptions.toolbar ? 'yes' : 'no'}`,
        `location=${defaultOptions.location ? 'yes' : 'no'}`,
        'popup=yes',
      ].join(',');

      let nativeWindow;
      try {
        const windowName = `erp_${componentName}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        nativeWindow = window.open('', windowName, features);

        if (!nativeWindow) return get().showModal(winIdParent, name, params, safeCallbacks);

        const title = params.titulo || params.title || componentName.toUpperCase();

        nativeWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <meta charset="utf-8">
              <base href="${window.location.origin}">
              <style>
                body { margin: 0; padding: 0; overflow: hidden; font-family: system-ui, sans-serif; }
                #root { width: 100vw; height: 100vh; overflow: auto; }
              </style>
            </head>
            <body><div id="root"></div></body>
          </html>
        `);
        nativeWindow.document.close();

        // Keep title in sync (some browsers reset it)
        const titleInterval = setInterval(() => {
          if (nativeWindow && !nativeWindow.closed) {
            if (nativeWindow.document.title !== title) nativeWindow.document.title = title;
          } else {
            clearInterval(titleInterval);
          }
        }, 100);

        nativeWindow._erpTitleInterval = titleInterval;
        nativeWindow.addEventListener('load', () => { injectPopupBridge(nativeWindow); }, { once: true });

      } catch (err) {
        return get().showModal(winIdParent, name, params, safeCallbacks);
      }

      const winId = get().createWin(validParentId, {
        type: 'ext',
        name: componentName,
        title: params.titulo || params.title || componentName.toUpperCase(),
        width: defaultOptions.width, height: defaultOptions.height,
        visible: true,
        params: {
          ...params, nativeWindow,
          extSubtype: 'popup', this: params.initialData || {},
          ...defaultOptions, titleInterval: nativeWindow._erpTitleInterval,
        },
        ...safeCallbacks,
      });

      return winId;
    });
  },

  showPopupSimple: (name, params = {}, options = {}) =>
    get().showPopup('0', name, params, {}, options),
});
