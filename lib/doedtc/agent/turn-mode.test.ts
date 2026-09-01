import assert from "node:assert/strict";
import test from "node:test";

import { resolveActionSlots } from "@/lib/doedtc/agent/action-slots";
import {
  classifyTurnMode,
  CRISIS_REPLY,
  inboundLooksLikeCrisis,
  inboundLooksLikeDistress,
  toolEnabledForTurnMode,
} from "@/lib/doedtc/agent/turn-mode";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";

test("Why am I so tired classifies as conversation with tools available", () => {
  const result = classifyTurnMode({ inboundText: "Why am I so tired", intent: "none" });
  assert.equal(result.mode, "conversation");
  assert.equal(result.disableCommitTools, false);
  assert.equal(toolEnabledForTurnMode("read_profile", "conversation", "none"), true);
  assert.equal(toolEnabledForTurnMode("log_result", "conversation", "none"), true);
});

test("lab results question keeps read and log tools in conversation mode", () => {
  const result = classifyTurnMode({
    inboundText: "What were my lab results earlier today",
    intent: "none",
  });
  assert.equal(result.mode, "conversation");
  assert.equal(toolEnabledForTurnMode("read_profile", result.mode, result.intent), true);
  assert.equal(toolEnabledForTurnMode("log_result", result.mode, result.intent), true);
  assert.equal(toolEnabledForTurnMode("parse_document", result.mode, result.intent), true);
});

test("I don't wanna be here classifies as crisis with 988 reply", () => {
  assert.equal(inboundLooksLikeCrisis("I don't wanna be here"), true);
  const result = classifyTurnMode({ inboundText: "I don't wanna be here", intent: "none" });
  assert.equal(result.mode, "crisis");
  assert.equal(result.emergencyOrDiagnosis, true);
  assert.match(CRISIS_REPLY, /988/);
  assert.equal(toolEnabledForTurnMode("read_profile", "crisis", "none"), false);
});

test("I can't function classifies as distress without commit tools", () => {
  assert.equal(inboundLooksLikeDistress("I can't function"), true);
  const result = classifyTurnMode({ inboundText: "I can't function", intent: "none" });
  assert.equal(result.mode, "distress");
  assert.equal(toolEnabledForTurnMode("schedule_text", "distress", "none"), false);
  assert.equal(toolEnabledForTurnMode("read_profile", "distress", "none"), true);
});

test("reminder ask stays action", () => {
  const slots = resolveActionSlots({
    inboundText: "any reminders set?",
    viewerUserId: "user-1",
    members: [],
    artifacts: [],
    guides: [],
  });
  assert.equal(slots.turnMode.mode, "action");
});

test("photo inbound stays action with parse_document enabled", () => {
  const slots = resolveActionSlots({
    inboundText: "what is this\n[attachments: file-abc]",
    viewerUserId: "user-1",
    members: [],
    artifacts: [],
    guides: [],
  });
  assert.equal(slots.intent, "parse_document");
  assert.equal(slots.turnMode.mode, "action");
  assert.equal(toolEnabledForTurnMode("parse_document", "action", "parse_document"), true);
});

test("hedge replies are not rewritten into scheduling prompts", () => {
  const reply = sanitizeDoeDtcReplyText(
    "I can't directly retrieve your lab results from earlier today.",
    { keepCloserRate: 0 },
  );
  assert.doesNotMatch(reply, /Tell me who to text/);
  assert.match(reply, /lab results/i);
});

test("conversation replies pass through unchanged", () => {
  const reply = sanitizeDoeDtcReplyText("I don't see any fatigue logs yet.", {
    keepCloserRate: 0,
  });
  assert.doesNotMatch(reply, /Tell me who to text/);
  assert.match(reply, /fatigue/i);
});
