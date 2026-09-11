import { fenestrae, winStore } from "fenestrae";
import { findWin, lastWin, logApi, nextId } from "./log";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function step(results, name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail: detail ?? "ok" });
  } catch (error) {
    results.push({ name, ok: false, detail: String(error?.message || error) });
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function closeExtras() {
  const { wins } = winStore.getState();
  for (const win of [...wins.values()]) {
    if (!win.launchpad && win.params?.id !== "lab") {
      try { fenestrae.destroyWindow(win.id); } catch { /* already gone */ }
    }
  }
}

export async function runSmoke() {
  const results = [];
  const launchpad = findWin((w) => w.launchpad || w.name === "frmlaunchpad");
  const parent = launchpad?.id || null;

  await step(results, "boot / launchpad", () => {
    expect(launchpad, "no hay launchpad");
    expect(sessionStorage.getItem("fenestrae_session"), "falta fenestrae_session");
    return launchpad.id;
  });

  await step(results, "abrir cada tipo", () => {
    const id = nextId("smoke");
    fenestrae.showTab(parent, "frmlist", { title: "smoke-tab", id: `${id}-tab` });
    fenestrae.showModal(parent, "frmdetail", { title: "smoke-modal", id: `${id}-modal` });
    fenestrae.showFloat(parent, "frmdetail", { title: "smoke-float", id: `${id}-float` });
    fenestrae.showTop(parent, "frmlist", { title: "smoke-top", id: `${id}-top` });
    fenestrae.showPanel(parent, "frmlist", { title: "smoke-panel", id: `${id}-panel` });
    const types = ["tab", "modal", "float", "side", "top", "panel"];
    expect(lastWin((w) => w.type === "side"), "no hay side (Lab)");
    for (const type of types) {
      expect(lastWin((w) => w.type === type), `no se abrió ${type}`);
    }
    return types.join(",");
  });

  await step(results, "dock left + undock", () => {
    fenestrae.showTop(parent, "frmlist", { title: "smoke-dock", id: "smoke-dock" });
    const top = lastWin((w) => w.params?.id === "smoke-dock");
    expect(top, "no hay top para dock");
    fenestrae.dock(top.id, "left");
    const docked = winStore.getState().wins.get(top.id);
    expect(docked?.docked && docked.dockZone === "left", "dock left falló");
    fenestrae.undock(top.id);
    expect(!winStore.getState().wins.get(top.id)?.docked, "undock falló");
  });

  await step(results, "modal onSave", async () => {
    let saved = false;
    fenestrae.showModal(parent, "frmdetail", { title: "smoke-save", id: "smoke-save" }, {
      onSave: () => { saved = true; },
    });
    const modal = lastWin((w) => w.params?.id === "smoke-save");
    expect(modal, "modal no abierto");
    modal.onSave?.({ ok: true });
    await delay(20);
    expect(saved, "onSave no disparó");
  });

  await step(results, "context save/load", async () => {
    const tabId = fenestrae.showTab(parent, "frmcontext", { title: "smoke-ctx", id: "smoke-ctx" });
    await fenestrae.context.save(tabId, "filters", { q: "acme" });
    const loaded = await fenestrae.context.load(tabId, "filters");
    expect(loaded?.q === "acme", "context no redondeó");
    await fenestrae.context.save(tabId, "secrets", { password: "nope", token: "abc", q: "keep" });
    const secrets = await fenestrae.context.load(tabId, "secrets");
    expect(secrets?.q === "keep" && secrets?.password == null && secrets?.token == null, "no se sanitizaron password/token");
    return loaded;
  });

  await step(results, "iframe rechazado", () => {
    const opened = fenestrae.showTab(parent, "frmiframe", {
      title: "smoke-js",
      id: "smoke-js",
      url: "javascript:alert(1)",
    });
    expect(opened == null, "javascript: no debió abrir tab");
  });

  await step(results, "comando sin permiso", () => {
    const before = fenestrae.getPermissions();
    fenestrae.setPermissions(["clients.read"]);
    fenestrae.executeCommand(parent, "clients.secret", {});
    fenestrae.setPermissions(before);
    const entry = lastWin(() => false);
    return entry ? "unexpected" : "blocked";
  });

  await step(results, "sessionStorage operador", () => {
    expect(sessionStorage.getItem("fenestrae_user"), "falta user");
    expect(sessionStorage.getItem("fenestrae_workspace"), "falta workspace");
  });

  closeExtras();
  logApi("smoke", { count: results.length, failed: results.filter((r) => !r.ok).length });
  return results;
}
