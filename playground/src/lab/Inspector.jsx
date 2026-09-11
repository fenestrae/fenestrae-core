import { useEffect, useState } from "react";
import { winStore } from "fenestrae";
import { STORAGE_KEYS } from "../../../src/core/constants";
import { dbTable, STORE_CONTEXTS, STORE_SESSIONS, STORE_WINDOWS } from "../../../src/database/dbTable";
import { FormShell, Note, Pre, Section } from "../ui";
import { subscribeLog } from "./log";

function serializeWins(wins) {
  return [...wins.values()].map((w) => ({
    id: w.id,
    type: w.type,
    name: w.name,
    title: w.title,
    parentId: w.parentId,
    visible: w.visible,
    docked: w.docked || false,
    dockZone: w.dockZone || null,
    fixed: w.fixed || false,
    fixedZone: w.fixedZone || null,
    uniqueKey: w.uniqueKey,
    launchpad: Boolean(w.launchpad),
  }));
}

function sessionKeys() {
  const out = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    out[key] = sessionStorage.getItem(key);
  }
  return out;
}

async function countStore(storeName) {
  const store = await dbTable(storeName);
  return new Promise((resolve, reject) => {
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbCounts() {
  try {
    return {
      windows: await countStore(STORE_WINDOWS),
      sessions: await countStore(STORE_SESSIONS),
      contexts: await countStore(STORE_CONTEXTS),
    };
  } catch (error) {
    return { error: String(error?.message || error) };
  }
}

export default function Inspector() {
  const [tree, setTree] = useState(() => serializeWins(winStore.getState().wins));
  const [meta, setMeta] = useState(() => {
    const s = winStore.getState();
    return {
      activeTabId: s.activeTabId,
      activeWinId: s.activeWinId,
      hasHydrated: s.hasHydrated,
      winOrder: s.winOrder,
    };
  });
  const [storage, setStorage] = useState(sessionKeys);
  const [idb, setIdb] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => subscribeLog(setLog), []);

  useEffect(() => {
    const unsub = winStore.subscribe((s) => {
      setTree(serializeWins(s.wins));
      setMeta({
        activeTabId: s.activeTabId,
        activeWinId: s.activeWinId,
        hasHydrated: s.hasHydrated,
        winOrder: s.winOrder,
      });
      setStorage(sessionKeys());
    });
    const timer = setInterval(() => {
      idbCounts().then(setIdb);
    }, 1500);
    idbCounts().then(setIdb);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  return (
    <FormShell title="Inspector" testId="form-inspector">
      <Note>Árbol de ventanas, sessionStorage e IndexedDB.</Note>
      <Section title="Store">
        <Pre testId="inspector-meta">{JSON.stringify(meta, null, 2)}</Pre>
      </Section>
      <Section title="Ventanas">
        <Pre testId="inspector-tree">{JSON.stringify(tree, null, 2)}</Pre>
      </Section>
      <Section title="sessionStorage">
        <Pre testId="inspector-ss">{JSON.stringify(storage, null, 2)}</Pre>
      </Section>
      <Section title="IndexedDB">
        <Pre testId="inspector-idb">{JSON.stringify(idb, null, 2)}</Pre>
      </Section>
      <Section title="API log">
        <Pre testId="inspector-log">{JSON.stringify(log.slice(0, 20), null, 2)}</Pre>
      </Section>
    </FormShell>
  );
}
