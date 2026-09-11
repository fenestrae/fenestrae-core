import { fenestrae, winStore } from "fenestrae";
import { nextId } from "./log";
import { clearCommits, observeLongTasks, recordRun, summarizeCommits, withFps } from "./perfMetrics";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function closeNamed(prefix) {
  const { wins } = winStore.getState();
  for (const win of [...wins.values()]) {
    if (String(win.params?.id || "").startsWith(prefix) || String(win.title || "").startsWith(prefix)) {
      try { fenestrae.destroyWindow(win.id); } catch { /* gone */ }
    }
  }
}

async function runScenario(id, label, work) {
  clearCommits();
  const longTasksPromise = observeLongTasks(8000);
  const commitsBefore = summarizeCommits();
  const fps = await withFps(work);
  await delay(50);
  const commits = summarizeCommits();
  const longTasks = await Promise.race([
    longTasksPromise,
    delay(100).then(() => []),
  ]);
  const state = winStore.getState();
  const run = {
    id,
    label,
    at: new Date().toISOString(),
    elapsedMs: Number(fps.elapsed.toFixed(1)),
    fps: Number(fps.fps.toFixed(1)),
    frames: fps.frames,
    commits,
    commitsBefore,
    longTasks: longTasks.length,
    longTaskMax: longTasks.reduce((max, t) => Math.max(max, t.duration), 0),
    wins: state.wins.size,
  };
  recordRun(run);
  return run;
}

export const SCENARIOS = [
  {
    id: "tabs-50",
    label: "50 tabs",
    run: () => runScenario("tabs-50", "50 tabs", async () => {
      closeNamed("perf-tab");
      for (let i = 0; i < 50; i += 1) {
        fenestrae.showTab(null, "frmlist", { title: `perf-tab ${i}`, id: `perf-tab-${i}` });
      }
    }),
  },
  {
    id: "tabs-200",
    label: "200 tabs",
    run: () => runScenario("tabs-200", "200 tabs", async () => {
      closeNamed("perf-tab");
      for (let i = 0; i < 200; i += 1) {
        fenestrae.showTab(null, "frmlist", { title: `perf-tab ${i}`, id: `perf-tab-${i}` });
      }
    }),
  },
  {
    id: "floats-30",
    label: "30 floats",
    run: () => runScenario("floats-30", "30 floats", async () => {
      closeNamed("perf-float");
      for (let i = 0; i < 30; i += 1) {
        fenestrae.showFloat(null, "frmdetail", {
          title: `perf-float ${i}`,
          id: `perf-float-${i}`,
          x: 40 + (i % 8) * 24,
          y: 40 + (i % 6) * 24,
        });
      }
    }),
  },
  {
    id: "mixed-workspace",
    label: "Workspace mixto",
    run: () => runScenario("mixed-workspace", "Workspace mixto", async () => {
      closeNamed("perf-");
      for (let i = 0; i < 20; i += 1) {
        fenestrae.showTab(null, "frmlist", { title: `perf-tab ${i}`, id: `perf-tab-${i}` });
      }
      for (let i = 0; i < 8; i += 1) {
        fenestrae.showFloat(null, "frmdetail", { title: `perf-float ${i}`, id: `perf-float-${i}` });
      }
      fenestrae.showTop(null, "frmlist", { title: "perf-dock", id: "perf-dock" });
      const top = [...winStore.getState().wins.values()].find((w) => w.params?.id === "perf-dock");
      if (top) fenestrae.dock(top.id, "left");
      fenestrae.showPanel(null, "frmlist", { title: "perf-panel", id: "perf-panel" });
      fenestrae.showModal(null, "frmdetail", { title: "perf-modal", id: "perf-modal" });
    }),
  },
  {
    id: "churn-200",
    label: "Abrir/cerrar 200",
    run: () => runScenario("churn-200", "Abrir/cerrar 200", async () => {
      for (let i = 0; i < 200; i += 1) {
        const id = nextId("churn");
        fenestrae.showFloat(null, "frmdetail", { title: `churn ${i}`, id });
        const win = [...winStore.getState().wins.values()].find((w) => w.params?.id === id);
        if (win) fenestrae.destroyWindow(win.id);
      }
    }),
  },
  {
    id: "context-flood",
    label: "200 saves debounce",
    run: () => runScenario("context-flood", "200 saves debounce", async () => {
      const winId = fenestrae.showTab(null, "frmcontext", { title: "perf-ctx", id: "perf-ctx" });
      for (let i = 0; i < 200; i += 1) {
        fenestrae.context.saveDebounced(winId, "draft", { i });
      }
      await delay(700);
    }),
  },
  {
    id: "heavy-tab",
    label: "Heavy + cambio de tab",
    run: () => runScenario("heavy-tab", "Heavy + cambio de tab", async () => {
      const a = fenestrae.showTab(null, "frmheavy", { title: "heavy-a", id: "heavy-a" });
      const b = fenestrae.showTab(null, "frmheavy", { title: "heavy-b", id: "heavy-b" });
      fenestrae.focusWindow(a);
      await delay(30);
      fenestrae.focusWindow(b);
      await delay(30);
      fenestrae.focusWindow(a);
    }),
  },
];
