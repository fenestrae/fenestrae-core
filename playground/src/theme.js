import { mapThemeToCSSVariables, THEME_PRESETS } from "../../src/themes/themeMapper.js";

export const PLAYGROUND_THEME = {
  ...THEME_PRESETS.dark,
  "--fn-canvas": "#1c1917",
  "--color-window-header": "#c2410c",
  "--color-fn-tab-bg-active": "#c2410c",
  "--color-window-active-border": "#ea580c",
};

export const THEME_NAMES = ["modern", "dark", "macOS", "playground"];

const THEME_KEY = "playground_theme";

export function readTheme() {
  const name = sessionStorage.getItem(THEME_KEY);
  return THEME_NAMES.includes(name) ? name : "modern";
}

export function applyTheme(name) {
  const resolved = THEME_NAMES.includes(name) ? name : "modern";
  const input = resolved === "playground" ? PLAYGROUND_THEME : resolved;
  const vars = mapThemeToCSSVariables(input);
  const root = document.getElementById("fenestrae-runtime-root");
  if (root) {
    for (const [key, value] of Object.entries(vars)) {
      if (key.startsWith("--")) root.style.setProperty(key, String(value));
    }
  }
  sessionStorage.setItem(THEME_KEY, resolved);
  return resolved;
}
