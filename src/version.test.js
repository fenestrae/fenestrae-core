import { describe, expect, it } from "vitest";
import { author, license, version } from "./version";

describe("package identity", () => {
  it("exposes the published version and license", () => {
    expect(version).toBe("1.0.3");
    expect(license).toBe("Apache-2.0");
    expect(author).toBe("Toni Raventós");
  });
});
