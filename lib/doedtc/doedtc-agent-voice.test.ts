import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import {
  buildDoeAgentVoiceBlock,
  DOE_AGENT_FEW_SHOTS,
  DOE_AGENT_STANCE,
  hasConcretePlan,
  looksCapabilityHedge,
} from "@/lib/doedtc/doedtc-agent-voice";

test("buildDoeAgentVoiceBlock includes capable-friend stance", () => {
  const block = buildDoeAgentVoiceBlock();
  assert.match(block, /does the thing, not a menu of features/);
  assert.match(block, /Never open with what you cannot do/);
  assert.match(block, /One plan, not a fork/);
  assert.match(block, /sharp friend/);
});

test("voice block excludes hedge product names from examples", () => {
  assert.match(DOE_AGENT_STANCE, /Do not name internal products/);
  assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /accountability pack/i);
  assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /I can't directly/i);
});

test("few-shots include bath and meds examples", () => {
  assert.match(DOE_AGENT_FEW_SHOTS, /take a bath/);
  assert.match(DOE_AGENT_FEW_SHOTS, /Maya and Leo/);
  assert.match(DOE_AGENT_FEW_SHOTS, /take my meds/);
});

test("looksCapabilityHedge detects opening disclaimers", () => {
  assert.equal(
    looksCapabilityHedge("I can't directly ensure your kids take a bath, but I can help."),
    true,
  );
  assert.equal(looksCapabilityHedge("I cannot physically make sure they bathe."), true);
  assert.equal(looksCapabilityHedge("Doe is not a doctor and this is not a diagnosis."), false);
  assert.equal(
    looksCapabilityHedge("I'll text Maya and Leo at 7. I can't be there in person but I'll ping them."),
    false,
  );
});

test("hasConcretePlan detects actionable offers", () => {
  assert.equal(hasConcretePlan("I'll text Maya and Leo at 7 tonight."), true);
  assert.equal(hasConcretePlan("I can't directly ensure that."), false);
});

test("sanitizeDoeDtcReplyText rewrites hedge-only replies", () => {
  const cleaned = sanitizeDoeDtcReplyText(
    "I can't directly ensure your kids take a bath, but I can help you set up a reminder.",
    { keepCloserRate: 0 },
  );
  assert.match(cleaned, /who to text and when/i);
});

test("sanitizeDoeDtcReplyText keeps replies that include a plan", () => {
  const original =
    "I'll text Maya and Leo at 7 to hop in the bath, and ping you if they don't reply. Want me to set that?";
  const cleaned = sanitizeDoeDtcReplyText(original, { keepCloserRate: 0, preservePendingOffer: true });
  assert.match(cleaned, /text Maya and Leo at 7/i);
});
