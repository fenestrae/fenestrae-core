import { useEffect, useState } from "react";
import { fenestrae, version } from "fenestrae";
import { Btn, Field, FormShell, Note, Row } from "../ui";
import { OPERATORS } from "../boot";

export default function OperatorGate({ onStart }) {
  const [user, setUser] = useState("pepe");
  const [workspace, setWorkspace] = useState("erp");
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState("");

  async function lookup() {
    setError("");
    try {
      await fenestrae.init({ user, workspace });
      const list = await fenestrae.getSessions();
      setSessions(list);
      if (list.length === 0) {
        await onStart({ user, workspace, newSession: true });
      }
    } catch (err) {
      setError(String(err?.message || err));
    }
  }

  useEffect(() => {
    setSessions(null);
  }, [user, workspace]);

  return (
    <FormShell title="Fenestrae playground" testId="operator-gate">
      <Note>Elige operador. init no selecciona sesión; F5 reutiliza la pestaña actual.</Note>
      <Note>v{version}</Note>
      <Row>
        {OPERATORS.map((op) => (
          <Btn
            key={`${op.user}-${op.workspace}`}
            id={`preset-${op.user}-${op.workspace}`}
            kind={user === op.user && workspace === op.workspace ? "primary" : "default"}
            onClick={() => { setUser(op.user); setWorkspace(op.workspace); }}
          >
            {op.user} / {op.workspace}
          </Btn>
        ))}
      </Row>
      <Field label="user" testId="gate-user" value={user} onChange={setUser} />
      <Field label="workspace" testId="gate-workspace" value={workspace} onChange={setWorkspace} />
      <Row>
        <Btn id="gate-continue" kind="primary" onClick={lookup}>Continuar</Btn>
      </Row>
      {error ? <Note>{error}</Note> : null}
      {sessions && sessions.length > 0 ? (
        <>
          <Note>Sesiones existentes</Note>
          <Row>
            <Btn id="gate-new" onClick={() => onStart({ user, workspace, newSession: true })}>Nueva</Btn>
            {sessions.map((s) => (
              <Btn
                key={s.sessionId}
                id={`gate-session-${s.sessionId}`}
                onClick={() => onStart({ user, workspace, sessionId: s.sessionId })}
              >
                {s.sessionId.slice(0, 8)}
              </Btn>
            ))}
          </Row>
        </>
      ) : null}
    </FormShell>
  );
}
