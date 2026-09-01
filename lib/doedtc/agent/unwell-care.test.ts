import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  looksLikeLogNarration,
  looksLikeUnwellShare,
} from "@/lib/doedtc/agent/unwell-care";

describe("unwell care", () => {
  it("matches feeling sick and explore-it-further", () => {
    assert.equal(looksLikeUnwellShare("It was awful I felt sick."), true);
    assert.equal(looksLikeUnwellShare("I felt nauseous"), true);
    assert.equal(looksLikeUnwellShare("Can we explore it further"), true);
    assert.equal(looksLikeUnwellShare("what do you think this is"), true);
  });

  it("does not treat reminder or tracker asks as unwell shares", () => {
    assert.equal(looksLikeUnwellShare("remind me at 8"), false);
    assert.equal(looksLikeUnwellShare("log my water"), false);
    assert.equal(looksLikeUnwellShare("where are my labs"), false);
  });

  it("detects log-first narration", () => {
    assert.equal(looksLikeLogNarration("I've logged that you felt nauseous."), true);
    assert.equal(looksLikeLogNarration("I can log this symptom and help track how you're feeling."), true);
    assert.equal(looksLikeLogNarration("That sounds miserable. Any fever or just the nausea?"), false);
  });
});
