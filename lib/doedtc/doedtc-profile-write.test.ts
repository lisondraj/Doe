import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeDoeDtcGender } from "@/lib/doedtc/doedtc-types";

describe("profile write helpers", () => {
  it("accepts loose gender labels from the agent", () => {
    assert.equal(normalizeDoeDtcGender("female"), "female");
    assert.equal(normalizeDoeDtcGender("Male"), "male");
    assert.equal(normalizeDoeDtcGender("non_binary"), "nonbinary");
    assert.equal(normalizeDoeDtcGender("non-binary"), "nonbinary");
    assert.equal(normalizeDoeDtcGender("prefer_not_to_say"), "prefer_not");
    assert.equal(normalizeDoeDtcGender("prefer not"), "prefer_not");
    assert.equal(normalizeDoeDtcGender("unknown"), null);
  });
});
