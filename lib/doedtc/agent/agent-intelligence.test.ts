import assert from "node:assert/strict";
import test from "node:test";

import { planReplyIsUsable } from "@/lib/doedtc/agent/planner-run";
import { buildPlannerInstructionsBlock } from "@/lib/doedtc/agent/plan-schema";
import { isDegenerateTurn } from "@/lib/doedtc/agent/turn-integrity";
import { buildDoeAgentVoiceBlock } from "@/lib/doedtc/doedtc-agent-voice";

test("planReplyIsUsable rejects filler and accepts real advice", () => {
  assert.equal(planReplyIsUsable("Got it."), false);
  assert.equal(planReplyIsUsable(""), false);
  assert.equal(
    planReplyIsUsable(
      "Week 1: notice when lethargy hits. Week 2: swap the habit. Week 3: check how you feel.",
    ),
    true,
  );
});

test("planner instructions call out reply-only strategy plans", () => {
  const block = buildPlannerInstructionsBlock();
  assert.match(block, /General advice \/ strategies/);
  assert.match(block, /specialist: null, immediate: \[\]/);
  assert.match(block, /Never invent alcohol/);
});

test("voice block forbids inventing abstain targets", () => {
  const block = buildDoeAgentVoiceBlock();
  assert.match(block, /Never invent what someone wants to abstain from/);
  assert.match(block, /Never default to alcohol, drugs, or any stereotype/);
});

test("isDegenerateTurn flags empty replies that would become a snag", () => {
  assert.equal(
    isDegenerateTurn({
      replyText: "",
      toolsExecuted: [],
      state: {},
    }),
    true,
  );
  assert.equal(
    isDegenerateTurn({
      replyText: "Got it.",
      toolsExecuted: [],
      state: {},
    }),
    true,
  );
  assert.equal(
    isDegenerateTurn({
      replyText:
        "Week 1: skip orgasm when you feel wiped. Week 2: swap to a walk. Week 3: see if energy holds.",
      toolsExecuted: [],
      state: {},
    }),
    false,
  );
});
