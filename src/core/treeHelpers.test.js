import { describe, expect, it } from "vitest";
import { getAllDescendants } from "./treeHelpers";

function tree() {
  return new Map([
    ["root", { id: "root", parentId: "0" }],
    ["child", { id: "child", parentId: "root" }],
    ["grand", { id: "grand", parentId: "child" }],
    ["other", { id: "other", parentId: "0" }],
  ]);
}

describe("getAllDescendants", () => {
  it("returns a depth-first list of descendant ids", () => {
    const wins = tree();
    expect(getAllDescendants("root", wins)).toEqual(["child", "grand"]);
    expect(getAllDescendants("other", wins)).toEqual([]);
  });
});
