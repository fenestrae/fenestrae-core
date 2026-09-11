import { describe, expect, it } from "vitest";
import { ae, fenestrae } from "./index.js";

describe("public façades", () => {
  it("keeps fenestrae and ae in sync", () => {
    expect(Object.keys(fenestrae).sort()).toEqual(Object.keys(ae).sort());
    expect(fenestrae.showTab).toBeTypeOf("function");
    expect(fenestrae.init).toBeTypeOf("function");
    expect(fenestrae.context.save).toBeTypeOf("function");
  });
});
