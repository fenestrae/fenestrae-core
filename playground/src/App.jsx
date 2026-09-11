import { Profiler, useCallback, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { FenestraeContainer, FenestraeProvider, fenestrae, winStore } from "fenestrae";
import { DEFAULT_PERMISSIONS, hasRestorableSession, readStoredPermissions } from "./boot";
import OperatorGate from "./chrome/OperatorGate";
import { registerPlaygroundCommands } from "./commands";
import { consumeRestoreMark, onContainerRender } from "./lab/perfMetrics";
import { components } from "./registry";
import { PLAYGROUND_THEME, applyTheme, readTheme } from "./theme";

export default function App() {
  const [gate, setGate] = useState(() => !hasRestorableSession());
  const [ready, setReady] = useState(() => hasRestorableSession());
  const [workspaceKey, setWorkspaceKey] = useState(0);
  const theme = readTheme();

  const enter = useCallback(async ({ user, workspace, sessionId, newSession }) => {
    await fenestrae.init({ user, workspace });
    if (newSession) {
      await fenestrae.createNewSession();
    } else if (sessionId) {
      await fenestrae.activateSession(sessionId);
    } else {
      const sessions = await fenestrae.getSessions();
      if (sessions.length === 0) await fenestrae.createNewSession();
      else await fenestrae.activateSession(sessions[0].sessionId);
    }
    fenestrae.setPermissions(DEFAULT_PERMISSIONS);
    fenestrae.setUser({ name: user, empresa: workspace });
    fenestrae.setEmpresa(workspace);
    registerPlaygroundCommands();
    setWorkspaceKey((k) => k + 1);
    setGate(false);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!hasRestorableSession()) return;
    registerPlaygroundCommands();
    const stored = readStoredPermissions();
    fenestrae.setPermissions(stored.length ? stored : DEFAULT_PERMISSIONS);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyTheme(readTheme());
    const onHydrated = (s) => {
      if (s.hasHydrated) consumeRestoreMark();
    };
    const unsub = winStore.subscribe(onHydrated);
    onHydrated(winStore.getState());
    return unsub;
  }, [ready, workspaceKey]);

  if (gate) return <OperatorGate onStart={enter} />;
  if (!ready) return null;

  return (
    <BrowserRouter>
      <FenestraeProvider
        components={components}
        defaultTheme={theme}
        themes={{ playground: PLAYGROUND_THEME }}
      >
        <Profiler id="FenestraeContainer" onRender={onContainerRender}>
          <FenestraeContainer
            key={workspaceKey}
            initialWinConfig={{ title: "Playground", name: "frmlaunchpad" }}
            bootStrap={() => {
              fenestrae.showSide(null, "frmlab", { title: "Lab", id: "lab" });
            }}
          />
        </Profiler>
      </FenestraeProvider>
    </BrowserRouter>
  );
}
