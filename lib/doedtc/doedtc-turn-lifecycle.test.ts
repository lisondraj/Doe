import assert from "node:assert/strict";
import test from "node:test";

import { resolveTurnReactionAction } from "@/lib/doedtc/doedtc-turn-lifecycle";

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
