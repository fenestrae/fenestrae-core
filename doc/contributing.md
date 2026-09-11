# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch from the branch you were asked to work on.
3. Keep the public surface stable (`src/index.js` + `src/index.d.ts`). If you add an API, document it in [api.md](api.md) and the types file together.
4. Match the style of the surrounding module: small functions, existing naming (`winId`, `sessionId`, `WIN_TYPES`), no unused exports.
5. Persistence and security changes need extra care. Read [architecture](architecture.md) and [security](security.md) first. Do not switch operator identity to `localStorage`.
6. Include tests when the change can break window lifecycle, sessions, permissions or URL handling.
7. Open a pull request with the *why*, not a file list.

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
