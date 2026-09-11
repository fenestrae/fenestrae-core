import { useEffect, useState } from "react";
import { Btn, FormShell, Note, Pre, Row } from "../ui";

export default function Popup({ winId, routeParams }) {
  const nativeWindow = routeParams?.popupWindowInstance || window;
  const [heartbeat, setHeartbeat] = useState("—");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const target = nativeWindow || window;
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "fenestrae-heartbeat") {
        setHeartbeat(new Date().toLocaleTimeString());
      }
    };
    target.addEventListener("message", onMessage);

    const bus = target.externalBus;
    const off = bus?.on?.("playground", (payload) => {
      setEvents((prev) => [{ t: Date.now(), payload }, ...prev].slice(0, 8));
    });

    bus?.emit?.("playground-ready", { winId });

    return () => {
      target.removeEventListener("message", onMessage);
      off?.();
    };
  }, [nativeWindow, winId]);

  return (
    <FormShell title="Popup" testId="form-popup">
      <Note>winId {winId}. Heartbeat del padre y window.externalBus.</Note>
      <Note>Último heartbeat: {heartbeat}</Note>
      <Row>
        <Btn
          id="popup-emit"
          kind="primary"
          onClick={() => nativeWindow?.externalBus?.emit?.("playground", { from: winId, ping: Date.now() })}
        >
          Emit playground
        </Btn>
      </Row>
      <Pre>{JSON.stringify(events, null, 2)}</Pre>
    </FormShell>
  );
}
