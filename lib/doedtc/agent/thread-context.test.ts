import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMemorySearchQuery,
  formatThreadContinuityBlock,
  inboundLooksLikeThreadFollowUp,
  resolveThreadInboundText,
} from "@/lib/doedtc/agent/thread-context";

test("short continuers include what about this", () => {
  assert.equal(inboundLooksLikeThreadFollowUp("what about this"), true);
});

test("time answers stay as the inbound instead of replacing the remind-me ask", () => {
  assert.equal(inboundLooksLikeThreadFollowUp("5:30 PM"), true);
  assert.equal(
    resolveThreadInboundText({
      inboundText: "5:30 PM",
      priorInboundBodies: ["Can you remind me to buy groceries?"],
    }),
    "5:30 PM",
  );
});

test("short continuers are thread follow-ups, fresh asks are not", () => {
  assert.equal(inboundLooksLikeThreadFollowUp("yeah"), true);
  assert.equal(inboundLooksLikeThreadFollowUp("and then after that"), true);
  assert.equal(inboundLooksLikeThreadFollowUp("she won't talk to me"), false);
  assert.equal(inboundLooksLikeThreadFollowUp("Remind me after my appointment"), false);
  assert.equal(inboundLooksLikeThreadFollowUp("what's on my chart"), false);
  assert.equal(inboundLooksLikeThreadFollowUp("screenshot google.com"), false);
});

test("follow-ups resolve to the earlier substantial inbound except bare yes", () => {
  const prior = ["I always forget things after an appointment", "yeah"];
  assert.equal(
    resolveThreadInboundText({ inboundText: "yeah", priorInboundBodies: prior }),
    "yeah",
  );
  assert.equal(
    resolveThreadInboundText({ inboundText: "and then after that", priorInboundBodies: prior }),
    "I always forget things after an appointment",
  );
  assert.equal(
    resolveThreadInboundText({
      inboundText: "Remind me after my appointment",
      priorInboundBodies: prior,
    }),
    "Remind me after my appointment",
  );
});

test("memory search includes earlier inbounds so short follow-ups still retrieve", () => {
  const query = buildMemorySearchQuery({
    inboundText: "yeah",
    priorInboundBodies: ["I always forget things after an appointment", "Sarah won't talk"],
  });
  assert.match(query, /forget things after an appointment/);
  assert.match(query, /Sarah/);
  assert.match(query, /yeah/);
});

test("continuity block appears on follow-ups even when routing stays on yeah", () => {
  const prior = ["I always forget things after an appointment"];
  assert.match(
    formatThreadContinuityBlock({ inboundText: "yeah", priorInboundBodies: prior }) ?? "",
    /forget things after an appointment/,
  );
  assert.equal(
    formatThreadContinuityBlock({
      inboundText: "Remind me after my appointment",
      priorInboundBodies: prior,
    }),
    undefined,
  );
});
