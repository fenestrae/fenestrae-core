# Usage

All examples use the `fenestrae` object. `ae` is the same API. `win` is the window subset without sessions, context, commands or permissions. Details in [API](api.md).

## Opening windows

The first argument is the parent window id. Use `null` (or `""`) for the workspace root.

```js
fenestrae.showTab(null, "frmcustomers", {
  title: "Customers",
  id: "001",
});

fenestrae.showFloat(parentWinId, "frmcustomers", { id: "001231" });

fenestrae.showFloat(parentWinId, "", { url: "/customers?id=001231" });
```

Other openers: `showModal`, `showSide`, `showTop`, `showPanel`, `showExt`, `showPopup`, `showPopupSimple`.

The component name must already be registered, unless you pass a trusted `params.url` (iframe). Names are matched case-insensitively.

`showModal` / `showFloat` / similar return a Promise that settles when a callback fires (`onSave`, `onClose`, `onCancel`, …).

## Closing and layout

```js
fenestrae.destroyWindow(winId);
fenestrae.focusWindow(winId);
fenestrae.minimizeWindow(winId);
fenestrae.maximizeWindow(winId);
fenestrae.dock(winId, "left");   // "top" | "left" | "right" | "bottom"
fenestrae.undock(winId);
fenestrae.fixed(winId, "right");
fenestrae.unfixed(winId);
```

## Sessions

Window position, size and basic form data live in IndexedDB. Operator identity lives in `sessionStorage` so F5 keeps the session, while a new browser tab starts isolated.

```js
await fenestrae.init({ user: "pepe", workspace: "erp" });
const sessions = await fenestrae.getSessions();
await fenestrae.activateSession(sessionId);
await fenestrae.restoreWindows(initialWinConfig);
await fenestrae.closeSession(); // logout of the current tab
```

| Call | Effect |
| --- | --- |
| `init` | Stores user/workspace; does not create a session |
| `createNewSession` | New session id, selected in `sessionStorage` |
| `activateSession` | Selects an existing session for this operator |
| `restoreWindows` | Hydrates the Zustand store from IndexedDB |
| `closeSession` | Clears `fenestrae_*` keys, drops the active session, resets in-memory windows |
| `delSession` | Deletes that session and its windows/contexts |
| `clearSessions` | Deletes every session for the current operator |

Reload (F5) does **not** clear `sessionStorage`. Closing the tab does. Do not use `localStorage` for operator identity: it would mix users and workspaces across tabs.

## Per-window context

```js
await fenestrae.context.save(winId, "filters", { q: "acme" });
const filters = await fenestrae.context.load(winId, "filters");
fenestrae.context.saveDebounced(winId, "draft", form, 500);
await fenestrae.context.clear(winId, "filters");
await fenestrae.context.clearAll(winId);
```

This is UI state for a window, not the 1.1.x Context Manager. Do not store passwords, tokens or identity documents. See [security](security.md).

## Commands and permissions

```js
fenestrae.setPermissions(["clients.read", "clients.write"]);
fenestrae.registerCommand("clients.edit", (winId, payload) => {
  fenestrae.showModal(winId, "frmclientedit", payload);
}, { permission: "clients.write" });

fenestrae.executeCommand(winId, "clients.edit", { id: "001" });
```

`hasPermission` only hides UI. The host backend must authorize every action.

## Cross-window messaging

Native popup windows get an injected `window.externalBus`. Subscribe in the popup; the opener talks through the popup bridge (`EVENT`, `STORE_SYNC`, heartbeat). There is no `app.send` / `app.on` API.

`postMessage` is restricted to `window.location.origin`.
