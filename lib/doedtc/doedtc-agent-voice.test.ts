import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import {
  buildDoeAgentVoiceBlock,
  DOE_AGENT_FEW_SHOTS,
  DOE_AGENT_STANCE,
} from "@/lib/doedtc/doedtc-agent-voice";

test("buildDoeAgentVoiceBlock includes capable-friend stance", () => {
  const block = buildDoeAgentVoiceBlock();
  assert.match(block, /does the thing, not a menu of features/);
  assert.match(block, /Never open with what you cannot do/);
  assert.match(block, /When they already asked with enough detail, act/);
  assert.match(block, /sharp friend/);
  assert.match(block, /Compose from the Primitives block/);
});

test("voice block excludes hedge product names from examples", () => {
  assert.match(DOE_AGENT_STANCE, /Do not name internal products/);
  assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /accountability pack/i);
  assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /I can't directly/i);
});

test("few-shots describe routing without mandating exact reply text", () => {
  assert.match(DOE_AGENT_FEW_SHOTS, /take a bath/);
  assert.match(DOE_AGENT_FEW_SHOTS, /wording is yours/);
  assert.doesNotMatch(DOE_AGENT_FEW_SHOTS, /Done\. I'll text you in 5 seconds/);
});

test("sanitizeDoeDtcReplyText preserves hedge replies", () => {
  const original =
    "I can't directly ensure your kids take a bath, but I can help you set up a reminder.";
  const cleaned = sanitizeDoeDtcReplyText(original, { keepCloserRate: 0 });
  assert.match(cleaned, /can't directly ensure/i);
  assert.doesNotMatch(cleaned, /who to text and when/i);
});

test("sanitizeDoeDtcReplyText keeps replies that include a plan", () => {
  const original =
    "I'll text Maya and Leo at 7 to hop in the bath, and ping you if they don't reply. Want me to set that?";
  const cleaned = sanitizeDoeDtcReplyText(original, { keepCloserRate: 0, preservePendingOffer: true });
  assert.match(cleaned, /text Maya and Leo at 7/i);
});
