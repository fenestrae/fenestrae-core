# Getting started

Fenestrae boots as two React components plus an imperative API.

1. `FenestraeProvider` registers forms and themes.
2. `FenestraeContainer` renders the workspace and restores windows.
3. `fenestrae` opens windows and manages sessions from anywhere in the host app.

The container uses React Router hooks, so it must sit inside a router.

## Install

```bash
npm install fenestrae
```

Peer dependencies (provided by the host): React 18 or 19, React DOM, React Router, Zustand, Immer, `uuid`, `clsx`, `prop-types`, `react-icons`.

```js
import { FenestraeProvider, FenestraeContainer, fenestrae } from "fenestrae";
import "fenestrae/dist/fenestrae.css";
```

## Minimal host

```jsx
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  FenestraeProvider,
  FenestraeContainer,
  fenestrae,
} from "fenestrae";
import "fenestrae/dist/fenestrae.css";
import Customers from "./forms/Customers";

const components = {
  frmcustomers: Customers,
};

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await fenestrae.init({ user: "pepe", workspace: "erp" });
      const sessions = await fenestrae.getSessions();
      if (sessions.length === 0) {
        await fenestrae.createNewSession();
      } else {
        await fenestrae.activateSession(sessions[0].sessionId);
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <BrowserRouter>
      <FenestraeProvider components={components} defaultTheme="modern">
        <FenestraeContainer
          initialWinConfig={{ title: "ERP", name: "frmcustomers" }}
          bootStrap={() => {
            fenestrae.showTab(null, "frmcustomers", { title: "Customers" });
          }}
        />
      </FenestraeProvider>
    </BrowserRouter>
  );
}
```

## Boot order

`init` only records the operator (`user` + `workspace`) in `sessionStorage` and IndexedDB. It does **not** create or select a session, and it does not open windows.

Typical sequence:

1. Authenticate in the host app.
2. `await fenestrae.init({ user, workspace })`.
3. `createNewSession()` or `activateSession(sessionId)`.
4. Mount `FenestraeContainer`.
5. The container calls `restoreWindows`. If the session has no windows, it inserts a launchpad and runs `bootStrap(workspace)`.

Call `init` **before** the container mounts. `restoreWindows` reads the operator from `sessionStorage`; without it, there is nothing to restore and `bootStrap` does not run.

## Registered forms

Keys passed to `FenestraeProvider` (`frmcustomers`) are stored lowercase. Opening APIs look up that name:

```js
fenestrae.showTab(null, "frmcustomers", { title: "Customers", id: "001" });
```

Each form receives at least:

| Prop | Meaning |
| --- | --- |
| `winId` | Window id in the store |
| `routeParams` | `params` used when the window was opened |
| `onClose` / `onSave` / … | Callbacks from `showModal` / `showFloat` / … |

See [usage](usage.md) for window types and [API](api.md) for the full surface.
