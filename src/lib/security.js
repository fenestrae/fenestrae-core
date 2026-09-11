import { STORAGE_KEYS } from "../core/constants";

// Helpers de origen, iframes y popups. Sin estos controles un título o una URL
// controlados por el huésped se convierten en XSS o en un iframe con el origen de la app.

const DANGEROUS_URL_SCHEME = /^(javascript|data|blob|file|vbscript):/i;

export function postToWindow(target, data) {
  if (!target || target.closed) return;
  target.postMessage(data, window.location.origin);
}

/**
 * Solo http(s) cuyo origen sea el de la app, o uno de allowedOrigins.
 * javascript:/data:/blob:/file: se rechazan siempre.
 */
export function resolveTrustedFrameUrl(url, allowedOrigins) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed || DANGEROUS_URL_SCHEME.test(trimmed)) return null;

  try {
    const parsed = new URL(trimmed, window.location.href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

    const extra = Array.isArray(allowedOrigins) ? allowedOrigins : [];
    const allowed = new Set([window.location.origin, ...extra.filter((o) => typeof o === "string")]);
    if (!allowed.has(parsed.origin)) return null;

    return {
      href: parsed.href,
      origin: parsed.origin,
      sameOrigin: parsed.origin === window.location.origin,
    };
  } catch {
    return null;
  }
}

export function getFrameSandbox(sameOrigin) {
  // allow-same-origin + allow-scripts anula el sandbox. Solo se concede
  // same-origin tras resolveTrustedFrameUrl, y el bridge del iframe es mínimo.
  return sameOrigin
    ? "allow-scripts allow-forms allow-same-origin"
    : "allow-scripts allow-forms";
}

const SENSITIVE_KEY = /^(password|passwd|pwd|secret|token|accesstoken|refreshtoken|apikey|api_key|authorization|credential|ssn|dni|nie|nif)$/i;
const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function isSensitiveKey(key) {
  return SENSITIVE_KEY.test(String(key));
}

export function sanitizePersistable(data, depth = 0) {
  if (data == null) return data;
  if (depth > 6) return undefined;
  if (typeof data === "function") return undefined;
  if (typeof data !== "object") return data;
  if (typeof Window !== "undefined" && data instanceof Window) return undefined;
  if (typeof Document !== "undefined" && data instanceof Document) return undefined;
  if (typeof HTMLElement !== "undefined" && data instanceof HTMLElement) return undefined;
  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizePersistable(item, depth + 1))
      .filter((item) => item !== undefined);
  }

  const clean = {};
  for (const key of Object.keys(data)) {
    if (FORBIDDEN_KEYS.has(key) || isSensitiveKey(key)) continue;
    const value = sanitizePersistable(data[key], depth + 1);
    if (value !== undefined) clean[key] = value;
  }
  return clean;
}

export function writeBlankPopupDocument(nativeWindow, title) {
  const doc = nativeWindow.document;
  doc.open();
  doc.write("<!DOCTYPE html><html><head></head><body><div id=\"root\"></div></body></html>");
  doc.close();

  const meta = doc.createElement("meta");
  meta.setAttribute("charset", "utf-8");
  doc.head.appendChild(meta);

  const base = doc.createElement("base");
  base.setAttribute("href", window.location.origin);
  doc.head.appendChild(base);

  const style = doc.createElement("style");
  style.textContent =
    "body { margin: 0; padding: 0; overflow: hidden; font-family: system-ui, sans-serif; } #root { width: 100vw; height: 100vh; overflow: auto; }";
  doc.head.appendChild(style);

  doc.title = String(title ?? "");
}

export const FENESTRAE_SESSION_KEYS = Object.values(STORAGE_KEYS);

export function clearFenestraeSessionStorage() {
  FENESTRAE_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
}
