const listeners = new Set();

let commits = [];
let lastRestoreMs = null;
let lastRun = null;

function notify() {
  const snapshot = getPerfState();
  for (const fn of listeners) fn(snapshot);
}

export function subscribePerf(fn) {
  listeners.add(fn);
  fn(getPerfState());
  return () => listeners.delete(fn);
}

export function getPerfState() {
  return { commits, lastRestoreMs, lastRun };
}

export function onContainerRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  commits = [...commits, { id, phase, actualDuration, baseDuration, startTime, commitTime }].slice(-400);
  notify();
}

export function clearCommits() {
  commits = [];
  notify();
}

export function recordRestoreMs(ms) {
  lastRestoreMs = ms;
  notify();
}

export function recordRun(run) {
  lastRun = run;
  try {
    sessionStorage.setItem("playground_last_perf", JSON.stringify(run));
  } catch {
    // Quota or private mode — the in-memory copy is enough.
  }
  notify();
}

export function readStoredRun() {
  try {
    const raw = sessionStorage.getItem("playground_last_perf");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function consumeRestoreMark() {
  const mark = sessionStorage.getItem("playground_restore_mark");
  if (!mark) return null;
  sessionStorage.removeItem("playground_restore_mark");
  const ms = Date.now() - Number(mark);
  recordRestoreMs(ms);
  return ms;
}

export function markRestoreAndReload() {
  sessionStorage.setItem("playground_restore_mark", String(Date.now()));
  window.location.reload();
}

export function summarizeCommits(list = commits) {
  if (list.length === 0) {
    return { count: 0, max: 0, avg: 0, over16: 0 };
  }
  const durations = list.map((c) => c.actualDuration);
  const sum = durations.reduce((a, b) => a + b, 0);
  return {
    count: list.length,
    max: Math.max(...durations),
    avg: sum / durations.length,
    over16: durations.filter((d) => d > 16).length,
  };
}

export function observeLongTasks(ms) {
  return new Promise((resolve) => {
    const tasks = [];
    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          tasks.push({ duration: entry.duration, start: entry.startTime });
        }
      });
      observer.observe({ type: "longtask", buffered: true });
    } catch {
      observer = null;
    }
    setTimeout(() => {
      observer?.disconnect();
      resolve(tasks);
    }, ms);
  });
}

export async function withFps(fn) {
  const deltas = [];
  let last = performance.now();
  let handle = 0;
  const loop = (now) => {
    deltas.push(now - last);
    last = now;
    handle = requestAnimationFrame(loop);
  };
  handle = requestAnimationFrame(loop);
  const started = performance.now();
  await fn();
  const elapsed = performance.now() - started;
  cancelAnimationFrame(handle);
  const fps = elapsed > 0 ? (deltas.length / elapsed) * 1000 : 0;
  return { elapsed, fps, frames: deltas.length };
}
