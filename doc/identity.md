# Identity and roadmap

The name **Fenestrae** is Latin for *windows*. The product restores what enterprise operators lost when apps moved to the browser: multiple processes, multiple contexts, and an uninterrupted workspace.

> Fenestrae is exclusively for enterprise applications. It is not a general web UI library.

## Version 1.0.3

The current release is a **workspace manager**:

- Window lifecycle (tab, modal, float, side, top, panel, external)
- Docking and fixed zones
- Multi-monitor popups
- Session restore after F5
- Per-window UI state via `fenestrae.context`

That last API is **not** the Context Manager described in the roadmap. In 1.0.3, `context` stores key/value UI state for a window (filters, form drafts). It does not model user/application process context.

## Roadmap: Context Manager (1.1.x)

Later versions aim to handle:

- User and application contexts
- Deep process persistence
- Intelligent workspace restoration
- Continuity across a full operator day

Until then, treat 1.0.3 as a window and session manager with a small per-window store.
