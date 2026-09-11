# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch from the branch you were asked to work on.
3. Keep the public surface stable (`src/index.js` + `src/index.d.ts`). If you add an API, document it in [api.md](api.md) and the types file together.
4. Match the style of the surrounding module: small functions, existing naming (`winId`, `sessionId`, `WIN_TYPES`), no unused exports.
5. Persistence and security changes need extra care. Read [architecture](architecture.md) and [security](security.md) first. Do not switch operator identity to `localStorage`.
6. Include tests when the change can break window lifecycle, sessions, permissions or URL handling.
7. Open a pull request with the *why*, not a file list.

## Commit messages

This repository uses [Conventional Commits](https://www.conventionalcommits.org/). A Husky `commit-msg` hook runs commitlint on every commit.

```
<type>(<optional-scope>): <description>
```

Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.

Keep the subject under 100 characters. Put the *why* in the body when the one-liner is not enough. Scopes are optional; useful ones here are `windows`, `sessions`, `security`, `persistence`, `docs`.

```
perf(windows): baja el sondeo del título de los popups de 100 ms a 1 s
fix(security): cierra XSS e iframes con origen fijo en postMessage
docs: mueve la guía, la API y la arquitectura a doc/
```

Build:

```bash
npm install
npm run build
```

Playground (host SPA against `src/`, or `--mode dist` after a build):

```bash
npm run playground
npm run playground:dist
```

Use the Lab side panel to open every window type, run **Smoke**, and measure commits with the Perf panel (`<Profiler>` around `FenestraeContainer`). Do not add playground files to the published package; `files` already ships only `dist` and types.

## Contact

fenestrae.ws@gmail.com
