// Helpers de origen, iframes y popups. Sin estos controles un título o una URL
// controlados por el huésped se convierten en XSS o en un iframe con el origen de la app.

const DANGEROUS_URL_SCHEME = /^(javascript|data|blob|file|vbscript):/i;

export function getAppOrigin() {
  return window.location.origin;
}

export function isTrustedMessageEvent(event, expectedSource) {
  if (!event) return false;
  if (event.origin !== window.location.origin) return false;
  if (expectedSource && event.source !== expectedSource) return false;
  return true;
}

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
