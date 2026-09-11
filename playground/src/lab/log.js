import { winStore } from "fenestrae";

const MAX = 100;
let entries = [];
const listeners = new Set();
let seq = 1;

function notify() {
  for (const fn of listeners) fn(entries);
}

function safe(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

export function nextId(prefix) {
  seq += 1;
  return `${prefix}-${seq}`;
}

export function logApi(method, detail, result) {
  entries = [{ t: Date.now(), method, detail, result: result === undefined ? undefined : safe(result) }, ...entries].slice(0, MAX);
  notify();
  return result;
}

export function getLog() {
  return entries;
}

export function clearLog() {
  entries = [];
  notify();
}

export function subscribeLog(fn) {
  listeners.add(fn);
  fn(entries);
  return () => listeners.delete(fn);
}

export function lastWin(predicate = () => true) {
  const { wins, winOrder } = winStore.getState();
  for (let i = winOrder.length - 1; i >= 0; i -= 1) {
    const win = wins.get(winOrder[i]);
    if (win && predicate(win)) return win;
  }
  return null;
}

export function findWin(predicate) {
  const { wins } = winStore.getState();
  for (const win of wins.values()) {
    if (predicate(win)) return win;
  }
  return null;
}
