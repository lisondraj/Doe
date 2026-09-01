import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  askedWhatYouCanDo,
  looksLikeCapabilityBrochure,
} from "@/lib/doedtc/agent/capability-ask";

describe("capability ask", () => {
  it("matches bare what-can-you-do questions", () => {
    assert.equal(askedWhatYouCanDo("what can you do"), true);
    assert.equal(askedWhatYouCanDo("What can you do?"), true);
    assert.equal(askedWhatYouCanDo("what do you do"), true);
    assert.equal(askedWhatYouCanDo("who are you"), true);
  });

  it("does not treat a real ask as a capability menu", () => {
    assert.equal(askedWhatYouCanDo("what can you do about this headache"), false);
    assert.equal(askedWhatYouCanDo("remind me at 8"), false);
    assert.equal(askedWhatYouCanDo("where are my labs"), false);
  });

  it("detects the health-information brochure", () => {
    assert.equal(
      looksLikeCapabilityBrochure(
        "I can help manage health information, set reminders, and track how you're feeling.",
      ),
      true,
    );
    assert.equal(looksLikeCapabilityBrochure("Logged the water."), false);
    assert.equal(looksLikeCapabilityBrochure("Text me what you want to do next."), false);
  });
});
