import { fenestrae } from "fenestrae";
import { logApi } from "./lab/log";

let registered = false;

export function registerPlaygroundCommands() {
  if (registered) return;
  registered = true;

  fenestrae.registerCommand("playground.lab", (winId) => {
    fenestrae.showSide(winId, "frmlab", { title: "Lab", id: "lab" });
  }, { permission: "lab.use" });

  fenestrae.registerCommand("playground.inspector", (winId) => {
    fenestrae.showTop(winId, "frminspector", { title: "Inspector", id: "inspector", width: 420, height: 360 });
  });

  fenestrae.registerCommand("playground.perf", (winId) => {
    fenestrae.showFloat(winId, "frmperf", { title: "Perf", id: "perf", width: 520, height: 520 });
  });

  fenestrae.registerCommand("clients.edit", (winId, payload) => {
    logApi("command:clients.edit", { winId, payload });
    fenestrae.showModal(winId, "frmdetail", {
      title: "Editar",
      id: payload?.id || "edit",
      initialData: payload || {},
    });
  }, { permission: "clients.write" });

  fenestrae.registerCommand("clients.secret", (winId, payload) => {
    logApi("command:clients.secret", { winId, payload }, "ran");
  }, { permission: "clients.admin" });
}
