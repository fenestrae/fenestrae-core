# Security

Fenestrae is a **client-side** window manager. It does not authenticate users or authorize server actions. Anything stored in the browser is readable by any script on the same origin.

## Permissions

`setPermissions` / `hasPermission` only hide UI (menus, commands). The host application must enforce access on the backend. Values in `sessionStorage` can be edited by the operator.

## What not to persist

Do not put passwords, tokens or identity documents in:

- `fenestrae.context`
- window `params`
- IndexedDB payloads

The persistence layer strips keys such as `password`, `token`, `authorization`, `dni`, `nie`, `nif`. That is a safety net, not a license to store secrets.

IndexedDB is origin-scoped. Any XSS on the host app can read it.

## Session logout

Call `fenestrae.closeSession()` on host logout. It clears `fenestrae_*` keys from `sessionStorage`, drops the active IndexedDB session and resets in-memory window state.

## Iframes and popups

Iframes only load `http(s)` URLs from the app origin, or from `params.allowedOrigins`. Schemes such as `javascript:`, `data:`, `blob:` and `file:` are rejected.

`postMessage` always targets `window.location.origin`. Popup scripts should ignore messages from any other origin (the injected bridge already does).

Prefer a host CSP, for example:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; frame-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'
```

Widen `frame-src` only if you intentionally embed extra origins.
