import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import dbManager from "../database/dbManager";

dbManager.waitForOtherConnections = async () => {};
