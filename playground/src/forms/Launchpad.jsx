import { useMemo, useState } from "react";
import { fenestrae, version } from "fenestrae";
import { Btn, FormShell, Note, Row, Section } from "../ui";
import { applyTheme, THEME_NAMES, readTheme } from "../theme";
import { readOperator } from "../boot";
import { logApi } from "../lab/log";

const MENU = [
  {
    caption: "Playground",
    items: [
      { caption: "Lab", command: "playground.lab", permission: "lab.use" },
      { caption: "Inspector", command: "playground.inspector" },
      { caption: "Perf", command: "playground.perf" },
    ],
  },
  {
    caption: "Clientes",
    items: [
      { caption: "Editar", command: "clients.edit", payload: { id: "001" }, permission: "clients.write" },
      { caption: "Secreto", command: "clients.secret", permission: "clients.admin" },
    ],
  },
];

export default function Launchpad({ winId }) {
  const Menu = fenestrae.FNMainMenu;
  const operator = readOperator();
  const [theme, setTheme] = useState(readTheme);
  const [sessions, setSessions] = useState([]);
  const perms = useMemo(() => fenestrae.getPermissions().join(", ") || "(ninguno)", []);

  async function refreshSessions() {
    const list = await fenestrae.getSessions();
    setSessions(list);
    logApi("getSessions", {}, list.length);
  }

  async function createSession() {
    const sessionId = await fenestrae.createNewSession();
    logApi("createNewSession", {}, sessionId);
    window.location.reload();
  }

  async function activate(sessionId) {
    await fenestrae.activateSession(sessionId);
    logApi("activateSession", { sessionId }, sessionId);
    window.location.reload();
  }

  async function logout() {
    await fenestrae.closeSession();
    logApi("closeSession");
    window.location.reload();
  }

  return (
    <FormShell title="Launchpad" testId="form-launchpad">
      <Menu items={MENU} winId={winId} orientation="horizontal" />
      <Note>
        {operator.user} / {operator.workspace} · sesión {operator.sessionId || "—"} · v{version}
      </Note>
      <Note>Permisos: {perms}</Note>

      <Section title="Herramientas">
        <Row>
          <Btn id="open-lab" kind="primary" onClick={() => fenestrae.executeCommand(winId, "playground.lab")}>Lab</Btn>
          <Btn id="open-inspector" onClick={() => fenestrae.executeCommand(winId, "playground.inspector")}>Inspector</Btn>
          <Btn id="open-perf" onClick={() => fenestrae.executeCommand(winId, "playground.perf")}>Perf</Btn>
        </Row>
      </Section>

      <Section title="Tema">
        <Row>
          {THEME_NAMES.map((name) => (
            <Btn
              key={name}
              id={`theme-${name}`}
              kind={theme === name ? "primary" : "default"}
              onClick={() => setTheme(applyTheme(name))}
            >
              {name}
            </Btn>
          ))}
        </Row>
      </Section>

      <Section title="Sesiones">
        <Row>
          <Btn id="sessions-refresh" onClick={refreshSessions}>Listar</Btn>
          <Btn id="sessions-create" onClick={createSession}>Nueva sesión</Btn>
          <Btn id="sessions-logout" onClick={logout}>Logout (closeSession)</Btn>
        </Row>
        {sessions.map((s) => (
          <Row key={s.sessionId}>
            <Btn
              id={`session-${s.sessionId}`}
              kind={s.sessionId === operator.sessionId ? "primary" : "default"}
              onClick={() => activate(s.sessionId)}
            >
              {s.sessionId.slice(0, 8)} · {s.updatedAt || s.createdAt || ""}
            </Btn>
          </Row>
        ))}
      </Section>

      <Note>F5 restaura esta pestaña. Una pestaña nueva del navegador no comparte sessionStorage.</Note>
    </FormShell>
  );
}
