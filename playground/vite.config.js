import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const playgroundRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(playgroundRoot, "..");

export default defineConfig(({ mode }) => {
  const useDist = mode === "dist";

  return {
    root: playgroundRoot,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        fenestrae: useDist
          ? resolve(repoRoot, "dist/fenestrae.es.js")
          : resolve(repoRoot, "src/index.js"),
        react: resolve(repoRoot, "node_modules/react"),
        "react-dom": resolve(repoRoot, "node_modules/react-dom"),
        "react-router-dom": resolve(repoRoot, "node_modules/react-router-dom"),
      },
      dedupe: ["react", "react-dom", "react-router-dom"],
    },
    optimizeDeps: {
      exclude: useDist ? [] : ["fenestrae"],
    },
    server: {
      port: 5173,
      fs: { allow: [repoRoot] },
    },
  };
});
