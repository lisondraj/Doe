import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  askedAboutActiveWork,
  formatActiveWorkBlock,
  looksLikeDeferredWorkClaim,
} from "@/lib/doedtc/agent/active-work";

describe("active work status ask", () => {
  it("matches what-are-you-doing questions", () => {
    assert.equal(askedAboutActiveWork("what are you working on"), true);
    assert.equal(askedAboutActiveWork("what are you doing"), true);
    assert.equal(askedAboutActiveWork("still on that?"), true);
    assert.equal(askedAboutActiveWork("any update"), true);
    assert.equal(askedAboutActiveWork("how's that going"), true);
  });

  it("does not treat chart or reminder asks as status checks", () => {
    assert.equal(askedAboutActiveWork("how's my progress on weight"), false);
    assert.equal(askedAboutActiveWork("remind me at 8"), false);
    assert.equal(askedAboutActiveWork("where are my labs"), false);
  });
});

describe("deferred work claims", () => {
  it("catches working-on-it and later-send promises", () => {
    assert.equal(looksLikeDeferredWorkClaim("I'm working on it, I'll send in a minute"), true);
    assert.equal(looksLikeDeferredWorkClaim("I am working on that"), true);
    assert.equal(looksLikeDeferredWorkClaim("I'll send it shortly"), true);
    assert.equal(looksLikeDeferredWorkClaim("Give me a minute"), true);
    assert.equal(looksLikeDeferredWorkClaim("I'll get back to you soon"), true);
  });

  it("does not match finished or immediate replies", () => {
    assert.equal(looksLikeDeferredWorkClaim("Sent. Screenshot coming as a follow-up."), false);
    assert.equal(looksLikeDeferredWorkClaim("Logged the water."), false);
    assert.equal(looksLikeDeferredWorkClaim("On this one now."), false);
  });
});

describe("formatActiveWorkBlock", () => {
  it("tells the model there is nothing else when empty", () => {
    const block = formatActiveWorkBlock([]);
    assert.match(block, /Active work: none besides this turn/);
    assert.match(block, /on this message/);
  });

  it("lists parallel browser jobs and other turns", () => {
    const block = formatActiveWorkBlock([
      { kind: "browser", summary: "Browser (open): screenshot Kaiser portal" },
      { kind: "turn", summary: "Also handling (working): remind Maya at 7" },
    ]);
    assert.match(block, /other parallel tasks/i);
    assert.match(block, /Kaiser portal/);
    assert.match(block, /remind Maya at 7/);
  });
});
