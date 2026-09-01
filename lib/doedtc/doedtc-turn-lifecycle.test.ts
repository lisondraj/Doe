import assert from "node:assert/strict";
import test from "node:test";

import { resolveTurnReactionAction } from "@/lib/doedtc/doedtc-turn-lifecycle";
import {
  inboundLooksComplex,
  inferMatchingReaction,
  pickMatchingReaction,
} from "@/lib/doedtc/doedtc-reactions";

test("fast turns skip lifecycle reactions", () => {
  assert.equal(
    resolveTurnReactionAction({ workingReactionApplied: false }),
    "none",
  );
});

test("slow turns swap working tapback to done", () => {
  assert.equal(
    resolveTurnReactionAction({ workingReactionApplied: true }),
    "swap_done",
  );
});

test("matching reactions stay put instead of swapping to done", () => {
  assert.equal(
    resolveTurnReactionAction({
      workingReactionApplied: false,
      matchingReactionApplied: true,
    }),
    "keep_matching",
  );
  assert.equal(
    resolveTurnReactionAction({
      workingReactionApplied: true,
      matchingReactionApplied: true,
      failed: true,
    }),
    "keep_matching",
  );
});

test("browser jobs keep a working tapback until the job finishes", () => {
  assert.equal(
    resolveTurnReactionAction({
      workingReactionApplied: false,
      deferFinalReaction: true,
    }),
    "ensure_working",
  );
  assert.equal(
    resolveTurnReactionAction({
      workingReactionApplied: true,
      deferFinalReaction: true,
    }),
    "none",
  );
});

test("attachment turns count as complex work", () => {
  assert.equal(inboundLooksComplex("[attachments: file-1]"), true);
  assert.equal(inboundLooksComplex("here are my labs [attachments: file-1]"), true);
});

test("failed slow turns swap to failed; fast failures stay quiet", () => {
  assert.equal(
    resolveTurnReactionAction({ workingReactionApplied: true, failed: true }),
    "swap_failed",
  );
  assert.equal(
    resolveTurnReactionAction({ workingReactionApplied: false, failed: true }),
    "none",
  );
});

test("only complex inbound qualifies for lifecycle 👍/✅", () => {
  assert.equal(inboundLooksComplex("remind me in 5 seconds"), false);
  assert.equal(inboundLooksComplex("yes"), false);
  assert.equal(inboundLooksComplex("log 3 glasses of water"), false);
  assert.equal(inboundLooksComplex("screenshot google.com"), true);
  assert.equal(inboundLooksComplex("record my visit"), true);
});

test("matching reactions are occasional and stay semantic", () => {
  assert.equal(inferMatchingReaction("lol that's hilarious"), "😂");
  assert.equal(inferMatchingReaction("yes"), null);
  assert.equal(inferMatchingReaction("remind me in 5 seconds"), null);
  assert.equal(pickMatchingReaction("lol that's hilarious", { hash: 0 }), "😂");
  assert.equal(pickMatchingReaction("lol that's hilarious", { hash: 1 }), null);
});
