import { useState } from "react";
import { fenestrae, winStore } from "fenestrae";
import Extra from "../forms/Extra";
import { Btn, FormShell, Note, Pre, Row, Section } from "../ui";
import { lastWin, logApi, nextId } from "./log";
import { runSmoke } from "./smoke";

const ZONES = ["top", "left", "right", "bottom"];

function cb() {
  return {
    onSave: (data) => logApi("onSave", data),
    onClose: (data) => logApi("onClose", data),
    onCancel: (data) => logApi("onCancel", data),
    onDelete: (data) => logApi("onDelete", data),
    onApply: (data) => logApi("onApply", data),
    onError: (data) => logApi("onError", data),
    onNext: (data) => logApi("onNext", data),
    onPrev: (data) => logApi("onPrev", data),
  };
}

function targetId(fallback) {
  return winStore.getState().activeWinId || fallback;
}

export default function Lab({ winId }) {
  const [hiddenId, setHiddenId] = useState(null);
  const [smoke, setSmoke] = useState(null);
  const [perms, setPerms] = useState(() => fenestrae.getPermissions().join(","));

  function open(kind, name, params) {
    const id = params.id || nextId(kind);
    const payload = { ...params, id };
    logApi(kind, payload);
    const fn = fenestrae[kind];
    fn(winId, name, payload, cb());
    return lastWin((w) => w.params?.id === id) || lastWin((w) => w.name === name);
  }

  return (
    <FormShell title="Lab" testId="form-lab">
      <Section title="Tipos de ventana">
        <Row>
          <Btn id="lab-tab" onClick={() => fenestrae.showTab(null, "frmlist", { title: "Lista", id: nextId("list") })}>Tab</Btn>
          <Btn id="lab-modal" onClick={() => open("showModal", "frmdetail", { title: "Modal" })}>Modal</Btn>
          <Btn id="lab-float" onClick={() => open("showFloat", "frmdetail", { title: "Float" })}>Float</Btn>
          <Btn id="lab-side" onClick={() => open("showSide", "frmlist", { title: "Side" })}>Side (reemplaza Lab)</Btn>
          <Btn id="lab-top" onClick={() => open("showTop", "frmlist", { title: "Top" })}>Top</Btn>
          <Btn id="lab-panel" onClick={() => open("showPanel", "frmlist", { title: "Panel" })}>Panel</Btn>
          <Btn id="lab-ext" onClick={() => open("showExt", "frmpopup", { title: "Ext", width: 480, height: 360 })}>Ext</Btn>
          <Btn id="lab-popup" onClick={() => { logApi("showPopup"); fenestrae.showPopup(winId, "frmpopup", { title: "Popup", id: nextId("pop") }, cb()); }}>Popup</Btn>
          <Btn id="lab-popup-simple" onClick={() => { logApi("showPopupSimple"); fenestrae.showPopupSimple("frmpopup", { title: "Popup simple", id: nextId("pops") }); }}>Popup simple</Btn>
        </Row>
        <Row>
          <Btn id="lab-wizard" onClick={() => open("showModal", "frmwizard", { title: "Wizard" })}>Wizard</Btn>
          <Btn id="lab-heavy" onClick={() => fenestrae.showTab(null, "frmheavy", { title: "Heavy", id: nextId("heavy") })}>Heavy</Btn>
          <Btn id="lab-context" onClick={() => fenestrae.showTab(null, "frmcontext", { title: "Context", id: nextId("ctx") })}>Context</Btn>
          <Btn id="lab-iframe" onClick={() => fenestrae.showTab(null, "frmiframe", { title: "Iframe", id: "iframe-probe" })}>Iframe</Btn>
          <Btn id="lab-nested" onClick={() => fenestrae.showTab(null, "frmnested", { title: "Nested", id: nextId("nest") })}>Nested</Btn>
          <Btn id="lab-inspector" onClick={() => fenestrae.executeCommand(winId, "playground.inspector")}>Inspector</Btn>
          <Btn id="lab-perf" onClick={() => fenestrae.executeCommand(winId, "playground.perf")}>Perf</Btn>
        </Row>
      </Section>

      <Section title="Ciclo de vida">
        <Row>
          <Btn id="lab-create" onClick={() => {
            const id = fenestrae.createWindow(null, {
              component: "frmlist",
              typeshow: "float",
              title: "Oculta",
              params: { id: nextId("hid") },
            });
            setHiddenId(id);
            logApi("createWindow", {}, id);
          }}>createWindow</Btn>
          <Btn id="lab-show" disabled={!hiddenId} onClick={() => { fenestrae.showWindow(hiddenId); logApi("showWindow", { hiddenId }); }}>show</Btn>
          <Btn id="lab-hide" disabled={!hiddenId} onClick={() => { fenestrae.hideWindow(hiddenId); logApi("hideWindow", { hiddenId }); }}>hide</Btn>
          <Btn id="lab-destroy" onClick={() => {
            const id = targetId(hiddenId);
            fenestrae.destroyWindow(id);
            logApi("destroyWindow", { id });
          }}>destroy activa</Btn>
        </Row>
      </Section>

      <Section title="Geometría y foco">
        <Row>
          <Btn id="lab-move" onClick={() => { const id = targetId(); fenestrae.moveWindow(id, 80, 80); logApi("moveWindow", { id }); }}>move</Btn>
          <Btn id="lab-resize" onClick={() => { const id = targetId(); fenestrae.resizeWindow(id, 480, 320); logApi("resizeWindow", { id }); }}>resize</Btn>
          <Btn id="lab-title" onClick={() => { const id = targetId(); fenestrae.setWindowTitle(id, `Título ${Date.now()}`); logApi("setWindowTitle", { id }); }}>title</Btn>
          <Btn id="lab-focus" onClick={() => { const id = targetId(); fenestrae.focusWindow(id); logApi("focusWindow", { id }); }}>focus</Btn>
          <Btn id="lab-min" onClick={() => { const id = targetId(); fenestrae.minimizeWindow(id); logApi("minimizeWindow", { id }); }}>min</Btn>
          <Btn id="lab-max" onClick={() => { const id = targetId(); fenestrae.maximizeWindow(id); logApi("maximizeWindow", { id }); }}>max</Btn>
          <Btn id="lab-active-tab" onClick={() => logApi("getActiveTab", {}, fenestrae.getActiveTab())}>getActiveTab</Btn>
        </Row>
      </Section>

      <Section title="Dock (solo top) / Fixed">
        <Row>
          {ZONES.map((zone) => (
            <Btn key={`dock-${zone}`} id={`lab-dock-${zone}`} onClick={() => {
              const id = nextId("dock");
              fenestrae.showTop(winId, "frmlist", { title: `Dock ${zone}`, id });
              const win = lastWin((w) => w.params?.id === id);
              if (win) fenestrae.dock(win.id, zone);
              logApi("dock", { zone, id: win?.id });
            }}>dock {zone}</Btn>
          ))}
          <Btn id="lab-undock" onClick={() => { const id = targetId(); fenestrae.undock(id); logApi("undock", { id }); }}>undock</Btn>
        </Row>
        <Row>
          {ZONES.map((zone) => (
            <Btn key={`fixed-${zone}`} id={`lab-fixed-${zone}`} onClick={() => {
              const id = targetId();
              fenestrae.fixed(id, zone);
              logApi("fixed", { zone, id });
            }}>fixed {zone}</Btn>
          ))}
          <Btn id="lab-unfixed" onClick={() => { const id = targetId(); fenestrae.unfixed(id); logApi("unfixed", { id }); }}>unfixed</Btn>
        </Row>
      </Section>

      <Section title="Sesiones">
        <Row>
          <Btn id="lab-sessions" onClick={async () => logApi("getSessions", {}, await fenestrae.getSessions())}>getSessions</Btn>
          <Btn id="lab-set-session" onClick={async () => {
            const state = winStore.getState();
            logApi("setSession", {}, await fenestrae.setSession({
              winOrder: state.winOrder,
              activeWinId: state.activeWinId,
            }));
          }}>setSession</Btn>
          <Btn id="lab-clear-sessions" onClick={async () => { await fenestrae.clearSessions(); logApi("clearSessions"); window.location.reload(); }}>clearSessions</Btn>
          <Btn id="lab-reset" onClick={() => { fenestrae.reset(); logApi("reset"); }}>reset memoria</Btn>
        </Row>
      </Section>

      <Section title="Comandos y permisos">
        <Note>Actual: {perms || "(ninguno)"}</Note>
        <Row>
          <Btn id="lab-perm-rw" onClick={() => { fenestrae.setPermissions(["clients.read", "clients.write", "lab.use"]); setPerms(fenestrae.getPermissions().join(",")); }}>read+write</Btn>
          <Btn id="lab-perm-r" onClick={() => { fenestrae.setPermissions(["clients.read", "lab.use"]); setPerms(fenestrae.getPermissions().join(",")); }}>solo read</Btn>
          <Btn id="lab-perm-none" onClick={() => { fenestrae.setPermissions([]); setPerms(""); }}>ninguno</Btn>
          <Btn id="lab-cmd-edit" onClick={() => fenestrae.executeCommand(winId, "clients.edit", { id: "001" })}>clients.edit</Btn>
          <Btn id="lab-cmd-secret" onClick={() => fenestrae.executeCommand(winId, "clients.secret", {})}>clients.secret</Btn>
          <Btn id="lab-has-star" onClick={() => logApi("hasPermission", { required: "clients.*" }, fenestrae.hasPermission("clients.*"))}>has clients.*</Btn>
        </Row>
      </Section>

      <Section title="Registro runtime / chrome">
        <Row>
          <Btn id="lab-register" onClick={() => {
            fenestrae.register({ frmextra: Extra });
            fenestrae.showTab(null, "frmextra", { title: "Extra", id: "extra" });
            logApi("register", { name: "frmextra" });
          }}>register frmextra</Btn>
          <Btn id="lab-set-user" onClick={() => { fenestrae.setUser({ name: "playground", empresa: "demo" }); logApi("setUser"); }}>setUser</Btn>
          <Btn id="lab-set-empresa" onClick={() => { fenestrae.setEmpresa("Playground S.A."); logApi("setEmpresa"); }}>setEmpresa</Btn>
          <Btn id="lab-flags" onClick={() => {
            const id = targetId();
            logApi("flags", { id }, {
              isModal: fenestrae.isModal(id),
              isFloat: fenestrae.isFloat(id),
              isRestored: fenestrae.isRestored(id),
            });
          }}>isModal/isFloat/isRestored</Btn>
        </Row>
      </Section>

      <Section title="Smoke">
        <Row>
          <Btn id="lab-smoke" kind="primary" onClick={async () => setSmoke(await runSmoke())}>Run smoke</Btn>
        </Row>
        {smoke ? (
          <Pre testId="smoke-results">
            {smoke.map((s) => `${s.ok ? "PASS" : "FAIL"}  ${s.name}  ${typeof s.detail === "string" ? s.detail : JSON.stringify(s.detail)}`).join("\n")}
          </Pre>
        ) : null}
      </Section>
    </FormShell>
  );
}
