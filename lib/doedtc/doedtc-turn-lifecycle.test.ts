import assert from "node:assert/strict";
import test from "node:test";

import {
  claimInboundTurn,
  existingInboundReaction,
  resolveTurnReactionAction,
  shouldApplyInboundReaction,
  shouldSkipDuplicateInboundTurn,
} from "@/lib/doedtc/doedtc-turn-lifecycle";
import {
  inboundLooksComplex,
  inferAmbientReaction,
  inferMatchingReaction,
  pickMatchingReaction,
  shouldSendWorkingTextAck,
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

test("duplicate inbound turns are skipped while one is already running or done", () => {
  const now = Date.parse("2026-09-01T22:00:00.000Z");
  assert.equal(
    shouldSkipDuplicateInboundTurn(
      [{ status: "working", created_at: "2026-09-01T21:59:30.000Z" }],
      now,
    ),
    true,
  );
  assert.equal(
    shouldSkipDuplicateInboundTurn(
      [{ status: "done", created_at: "2026-09-01T21:00:00.000Z" }],
      now,
    ),
    true,
  );
  assert.equal(
    shouldSkipDuplicateInboundTurn(
      [{ status: "failed", created_at: "2026-09-01T21:59:30.000Z" }],
      now,
    ),
    false,
  );
  assert.equal(
    shouldSkipDuplicateInboundTurn(
      [{ status: "received", created_at: "2026-09-01T21:50:00.000Z" }],
      now,
    ),
    false,
  );
});

test("the same inbound message keeps one reaction instead of toggling", () => {
  assert.equal(shouldApplyInboundReaction(undefined, "👍"), true);
  assert.equal(shouldApplyInboundReaction("👍", "👍"), false);
  assert.equal(shouldApplyInboundReaction("👍", "✅"), true);
  assert.equal(shouldApplyInboundReaction("✅", "✅"), false);
  assert.equal(shouldApplyInboundReaction("✅", "👍"), false);
  assert.equal(existingInboundReaction([{ working_at: "2026-09-01T21:59:30.000Z", final_reaction: null }]), "👍");
  assert.equal(
    existingInboundReaction([{ working_at: "2026-09-01T21:59:30.000Z", final_reaction: "✅" }]),
    "✅",
  );
  assert.equal(claimInboundTurn("msg-lab-photo", "turn-a"), true);
  assert.equal(claimInboundTurn("msg-lab-photo", "turn-b"), false);
  assert.equal(claimInboundTurn("msg-lab-photo", "turn-a"), true);
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

test("slow work gets a working-on-it text, photos and reminders do not", () => {
  assert.equal(shouldSendWorkingTextAck({ inboundText: "screenshot google.com" }), true);
  assert.equal(shouldSendWorkingTextAck({ inboundText: "what is this", hasFiles: true }), false);
  assert.equal(shouldSendWorkingTextAck({ inboundText: "Are these in My chart", hasFiles: true }), false);
  assert.equal(shouldSendWorkingTextAck({ inboundText: "remind me in 5 seconds" }), false);
  assert.equal(shouldSendWorkingTextAck({ inboundText: "yes" }), false);
});

test("matching reactions are occasional and stay semantic", () => {
  assert.equal(inferMatchingReaction("lol that's hilarious"), "😂");
  assert.equal(inferMatchingReaction("yes"), null);
  assert.ok(["🙏", "❤️"].includes(inferMatchingReaction("thanks so much") ?? ""));
  assert.equal(pickMatchingReaction("lol that's hilarious", { hash: 0 }), "😂");
  assert.equal(pickMatchingReaction("lol that's hilarious", { hash: 1 }), null);
});

test("ambient reactions cover ordinary health asks but stay gated", () => {
  assert.ok(["👌", "⏰"].includes(inferAmbientReaction("remind me in 5 seconds") ?? ""));
  assert.ok(["💪", "🙌"].includes(inferAmbientReaction("im taking my viagra tomorrow") ?? ""));
  assert.equal(inferAmbientReaction("yes"), null);
  assert.equal(pickMatchingReaction("remind me in 5 seconds", { hash: 1, ambientEvery: 4 }), null);
  assert.ok(pickMatchingReaction("remind me in 5 seconds", { hash: 4, ambientEvery: 4 }));
});
