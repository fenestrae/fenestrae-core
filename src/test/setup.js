import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import dbManager from "../database/dbManager";

dbManager.waitForOtherConnections = async () => {};

if (typeof window !== "undefined" && !window.innerWidth) {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1024 });
  Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 768 });
}
