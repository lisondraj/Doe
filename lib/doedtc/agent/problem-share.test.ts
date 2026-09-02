import assert from "node:assert/strict";
import test from "node:test";

import { inferPrimaryIntent } from "@/lib/doedtc/agent/action-slots";
import {
  inboundAskedForChartOrFileStatus,
  inboundLooksLikeProblemShare,
  looksLikeChartOrFileDump,
  shouldRetryChartOrFileDump,
  stripUnsolicitedEmptyCatalogReply,
} from "@/lib/doedtc/agent/problem-share";
import { classifyTurnMode } from "@/lib/doedtc/agent/turn-mode";

test("forgetting after an appointment is a problem share, not a chart status ask", () => {
  const inbound = "I always forget things after an appointment";
  assert.equal(inboundLooksLikeProblemShare(inbound), true);
  assert.equal(inboundAskedForChartOrFileStatus(inbound), false);
  assert.equal(inferPrimaryIntent({ inboundText: inbound }), "none");
  assert.equal(classifyTurnMode({ inboundText: inbound, intent: "none" }).mode, "conversation");
  assert.equal(looksLikeChartOrFileDump("There's nothing set right now."), true);
  assert.equal(shouldRetryChartOrFileDump(inbound, "There's nothing set right now."), true);
  assert.equal(inboundLooksLikeProblemShare("Remind me after my appointment"), false);
  assert.equal(inboundLooksLikeProblemShare("any reminders set?"), false);
});

test("other problem shares stay off the chart-write path", () => {
  assert.equal(inboundLooksLikeProblemShare("No she won't talk to me"), true);
  assert.equal(inboundLooksLikeProblemShare("She said she's been going thru it with her boyfriend"), true);
  assert.equal(inboundLooksLikeProblemShare("I blank out after the dentist"), true);
  assert.equal(inboundLooksLikeProblemShare("add metformin to my chart"), false);
});

test("unsolicited empty-file dumps retry even when the inbound is not a known problem phrase", () => {
  assert.equal(
    shouldRetryChartOrFileDump("How was your day", "There's nothing set right now."),
    true,
  );
  assert.equal(shouldRetryChartOrFileDump("any reminders set?", "There's nothing set right now."), false);
  assert.equal(inboundAskedForChartOrFileStatus("what's on my chart"), true);
});

test("stripUnsolicitedEmptyCatalogReply removes dump sentences on conversational turns", () => {
  const stripped = stripUnsolicitedEmptyCatalogReply({
    inboundText: "I always forget things after an appointment",
    replyText: "That's rough. There's nothing set right now.",
  });
  assert.doesNotMatch(stripped, /nothing set/i);
  assert.match(stripped, /That's rough/i);

  const kept = stripUnsolicitedEmptyCatalogReply({
    inboundText: "any reminders set?",
    replyText: "There's nothing set right now.",
  });
  assert.match(kept, /nothing set/i);
});
