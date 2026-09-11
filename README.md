# Fenestrae

Workspace manager for enterprise web applications — windowing, docking, sessions and continuity in React.

![Fenestrae Logo](https://raw.githubusercontent.com/fenestrae/fenestrae/main/logo.png)

![npm version](https://img.shields.io/npm/v/fenestrae)
![license](https://img.shields.io/badge/license-Apache%202.0-blue)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
![react](https://img.shields.io/badge/React-Compatible-61dafb)

Fenestrae is **not** a general-purpose UI kit. It restores desktop-style multitasking (tabs, floats, modals, docking, external windows) inside a host ERP.

```bash
npm install fenestrae
```

```js
import { FenestraeProvider, FenestraeContainer, fenestrae } from "fenestrae";
import "fenestrae/dist/fenestrae.css";
```

## Documentation

| Guide | Contents |
| --- | --- |
| [Documentation index](doc/README.md) | Map of every guide |
| [Identity and roadmap](doc/identity.md) | Product intent, 1.0.3 scope, Context Manager |
| [Getting started](doc/getting-started.md) | Provider, Container, init and first window |
| [Usage](doc/usage.md) | Window types, sessions, context, messaging |
| [Architecture](doc/architecture.md) | C4 context, containers and components |
| [API](doc/api.md) | `fenestrae` / `win` / `ae` and public types |
| [Security](doc/security.md) | Permissions, persistence, iframes, CSP |
| [Contributing](doc/contributing.md) | How to change this repository |

## Contact

fenestrae.ws@gmail.com

## License

Apache 2.0
