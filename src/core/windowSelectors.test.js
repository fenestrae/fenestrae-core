import { describe, expect, it } from "vitest";
import { WIN_TYPES } from "../store/types";
import {
  selectDockedInZone,
  selectDockedZones,
  selectFixedByZone,
  selectFloatingTops,
  selectOrderedByType,
  selectTabs,
} from "./windowSelectors";

function wins(entries) {
  return new Map(entries.map((w) => [w.id, w]));
}

describe("windowSelectors", () => {
  const catalog = wins([
    { id: "t1", type: WIN_TYPES.TAB },
    { id: "t2", type: WIN_TYPES.TAB },
    { id: "f1", type: WIN_TYPES.FLOAT, fixed: false },
    { id: "top1", type: WIN_TYPES.TOP, docked: true, dockZone: "left" },
    { id: "top2", type: WIN_TYPES.TOP, docked: false, fixed: false },
    { id: "fix", type: WIN_TYPES.PANEL, fixed: true, fixedZone: "top" },
  ]);
  const order = ["t1", "f1", "top1", "top2", "fix", "t2"];

  it("collects tabs in Map insertion order", () => {
    expect(selectTabs(catalog).map((w) => w.id)).toEqual(["t1", "t2"]);
  });

  it("collects ordered windows of one type, skipping fixed ones", () => {
    expect(selectOrderedByType(catalog, order, WIN_TYPES.FLOAT).map((w) => w.id)).toEqual(["f1"]);
  });

  it("keeps undocked top windows for the floating layer", () => {
    expect(selectFloatingTops(catalog, order).map((w) => w.id)).toEqual(["top2"]);
  });

  it("groups fixed and docked windows by zone", () => {
    expect(selectFixedByZone(catalog, "top").map((w) => w.id)).toEqual(["fix"]);
    expect(selectDockedInZone(catalog, "left").map((w) => w.id)).toEqual(["top1"]);
    expect(selectDockedZones(catalog)).toEqual({
      top: false,
      left: true,
      right: false,
      bottom: false,
    });
  });
});
