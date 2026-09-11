import { describe, expect, it } from "vitest";
import {
  buildContextId,
  buildLaunchpadPhysicalId,
  buildLegacyContextId,
  buildUserId,
  CONTEXT_KEY_LEGACY,
  ID_SEPARATOR,
  LAUNCHPAD_LOGICAL_ID,
  ROOT_PARENT_ID,
} from "./constants";

describe("composite ids", () => {
  it("builds operator, context and launchpad ids with the same separator", () => {
    expect(ROOT_PARENT_ID).toBe("0");
    expect(buildUserId("erp", "pepe")).toBe(`erp${ID_SEPARATOR}pepe`);
    expect(buildContextId("s1", "w1", "filters")).toBe(`s1${ID_SEPARATOR}w1${ID_SEPARATOR}filters`);
    expect(buildLegacyContextId("w1")).toBe(`w1${ID_SEPARATOR}${CONTEXT_KEY_LEGACY}`);
    expect(buildLaunchpadPhysicalId("abc")).toBe(`${LAUNCHPAD_LOGICAL_ID}${ID_SEPARATOR}abc`);
  });
});
