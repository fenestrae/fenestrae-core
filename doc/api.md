# Public API

Canonical types: [`src/index.d.ts`](../src/index.d.ts). This page is a map, not a second type file.

## Three exports, two surfaces

```js
import fenestrae, { fenestrae as named, ae, win, context } from "fenestrae";
```

| Export | What it is |
| --- | --- |
| `fenestrae` (default and named) | Full public API. Prefer this. |
| `ae` | Alias of `fenestrae` (same methods). |
| `win` | Window manager only: open, close, dock, register. No sessions, context, commands or permissions. |
| `context` | Same object as `fenestrae.context`. |

`FenestraeProvider` and `FenestraeContainer` are named React components.

## Components

```ts
<FenestraeProvider
  components={{ frmcustomers: Customers }}
  themes={{}}
  defaultTheme="modern"
>
  {children}
</FenestraeProvider>

<FenestraeContainer
  initialWinConfig={{ title, name, path }}
  bootStrap={(workspace) => { /* first empty session */ }}
/>
```

`components` values are a React component or `{ component, options }`. Keys are registered lowercase.

## Window API (`win` / `fenestrae`)

Window types: `"tab" | "modal" | "float" | "side" | "top" | "panel" | "ext"`.

Dock zones: `"top" | "left" | "right" | "bottom"`.

| Method | Notes |
| --- | --- |
| `register(components)` | Same registry as the Provider |
| `createWindow(parentId, options)` | Builds a hidden window; returns `winId` or `null` |
| `showWindow` / `hideWindow` / `destroyWindow` | Visibility and cascade close |
| `showTab` / `showModal` / `showFloat` / `showSide` / `showTop` / `showPanel` / `showExt` / `showPopup` / `showPopupSimple` | Openers |
| `moveWindow` / `resizeWindow` / `setWindowTitle` | Geometry and caption |
| `focusWindow` / `minimizeWindow` / `maximizeWindow` / `getActiveTab` | Z-order |
| `dock` / `undock` / `fixed` / `unfixed` | Docking vs fixed zones |
| `reset` | Clears in-memory workspace |

`show*` openers take `(parent, name, params?, callbacks?)`. `parent` `null` means the workspace root.

`params.url` loads an iframe if `lib/security` accepts the URL. Otherwise `name` must be registered.

## Session API (`fenestrae` only)

```ts
init({ user: string; workspace: string }): Promise<number>
getSessionsByUserId(userId: string): Promise<SessionRecord[]>
getSessionsByUserAndWorkspace(user, workspace): Promise<SessionRecord[]>
getSessions(): Promise<SessionRecord[]>
createNewSession(userId?, workspace?): Promise<string>
activateSession(sessionId?): Promise<string>
setSession({ winOrder?, activeWinId? }): Promise<string | void>
closeSession(): Promise<void>
delSession(sessionId: string): Promise<void>
clearSessions(): Promise<void>
restoreWindows(initialWinConfig?: WindowParams): Promise<boolean | void>
```

`init` returns the number of existing sessions for that operator. It does not select one.

## Context API

```ts
context.save(winId, key, value): Promise<void>
context.saveDebounced(winId, key, value, delay?): void
context.load(winId, key, defaultValue?): Promise<unknown>
context.clear(winId, key): Promise<void>
context.clearAll(winId): Promise<void>
```

## Commands and permissions

```ts
registerCommand(name, fn, { permission }?)
executeCommand(winId, name, payload?)
setPermissions(string[])
getPermissions(): string[]
hasPermission(required?: string): boolean
```

`hasPermission("clients.*")` matches `clients` and `clients.read`, not `clients_admin`. Empty string is denied; `null`/`undefined` is allowed. UI only — see [security](security.md).

## Advanced

`winStore` is exported for host code that must subscribe to window state. Prefer `fenestrae.*` unless you are extending the runtime.

`FNMainMenu` is on `fenestrae.FNMainMenu` for in-window menus that call `executeCommand`.
