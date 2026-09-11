import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.test.{js,jsx}"],
    restoreMocks: true,
    clearMocks: true,
    onUnhandledError(error) {
      const message = String(error?.message ?? error);
      // Vitest 4 + Node 22 webstorage + jsdom freeze the environment on teardown.
      if (message.includes("setTimeout") || message.includes("Cannot delete property 'jsdom'")) {
        return false;
      }
    },
  },
});
