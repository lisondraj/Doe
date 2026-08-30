import assert from "node:assert/strict";
import test from "node:test";

import {
  canPauseAccountabilityPact,
  canWithdrawAccountabilityPact,
  computeAccountabilityStreak,
  computeNextCheckInAt,
  defaultMessagePack,
  normalizeAccountabilityMechanics,
  parseCheckInOutcome,
  pickCheckInMessage,
  shouldPromptMiss,
} from "@/lib/doedtc/doedtc-accountability";
import type {
  DoeDtcAccountabilityEventRow,
  DoeDtcAccountabilityPactRow,
} from "@/lib/doedtc/doedtc-types";

test("normalizeAccountabilityMechanics applies defaults", () => {
  const mechanics = normalizeAccountabilityMechanics({ cadence: "weekly", privacy: "high" });
  assert.equal(mechanics.cadence, "weekly");
  assert.equal(mechanics.privacy, "high");
  assert.equal(mechanics.check_in_hour, 20);
  assert.equal(mechanics.who_gets_check_in, "subject");
});

test("canWithdrawAccountabilityPact is owner-only and not after withdrawn", () => {
  const pact: Pick<DoeDtcAccountabilityPactRow, "owner_user_id" | "status"> = {
    owner_user_id: "owner-1",
    status: "active",
  };
  assert.equal(canWithdrawAccountabilityPact(pact, "owner-1"), true);
  assert.equal(canWithdrawAccountabilityPact(pact, "other"), false);
  assert.equal(
    canWithdrawAccountabilityPact({ ...pact, status: "withdrawn" }, "owner-1"),
    false,
  );
});

test("canPauseAccountabilityPact allows owner on active pact", () => {
  const pact: Pick<DoeDtcAccountabilityPactRow, "owner_user_id" | "status"> = {
    owner_user_id: "owner-1",
    status: "active",
  };
  assert.equal(canPauseAccountabilityPact(pact, "owner-1"), true);
  assert.equal(canPauseAccountabilityPact({ ...pact, status: "paused" }, "owner-1"), false);
});

test("computeNextCheckInAt returns future date for daily cadence", () => {
  const mechanics = normalizeAccountabilityMechanics({ cadence: "daily", check_in_hour: 9 });
  const from = new Date("2026-08-30T15:00:00.000Z");
  const next = computeNextCheckInAt(mechanics, from);
  assert.ok(next);
  assert.ok(next!.getTime() > from.getTime());
});

test("computeNextCheckInAt returns null for on_demand", () => {
  const mechanics = normalizeAccountabilityMechanics({ cadence: "on_demand" });
  assert.equal(computeNextCheckInAt(mechanics), null);
});

test("parseCheckInOutcome recognizes yes/no", () => {
  assert.equal(parseCheckInOutcome("yes"), "yes");
  assert.equal(parseCheckInOutcome("Yep!"), "yes");
  assert.equal(parseCheckInOutcome("nope"), "no");
  assert.equal(parseCheckInOutcome("maybe"), null);
});

test("pickCheckInMessage rotates variants", () => {
  const pack = defaultMessagePack({
    goal: "brush teeth",
    ownerName: "Alex",
    subjectName: "Sam",
    privacy: "normal",
  });
  assert.equal(pickCheckInMessage(pack, 0), pack.check_in_variants[0]);
  assert.equal(pickCheckInMessage(pack, 1), pack.check_in_variants[1]);
});

test("computeAccountabilityStreak counts consecutive yes days", () => {
  const now = new Date();
  const events: Pick<DoeDtcAccountabilityEventRow, "kind" | "outcome" | "occurred_at">[] = [
    {
      kind: "check_in",
      outcome: "yes",
      occurred_at: now.toISOString(),
    },
    {
      kind: "check_in",
      outcome: "yes",
      occurred_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  assert.ok(computeAccountabilityStreak(events) >= 2);
});

test("shouldPromptMiss after 12h without response", () => {
  const promptAt = new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString();
  const events: Pick<DoeDtcAccountabilityEventRow, "kind" | "occurred_at">[] = [
    { kind: "check_in_prompt", occurred_at: promptAt },
  ];
  assert.equal(shouldPromptMiss(events, promptAt), true);
});

test("defaultMessagePack keeps high privacy invite vague", () => {
  const pack = defaultMessagePack({
    goal: "stay sober",
    ownerName: "Alex",
    subjectName: "Alex",
    privacy: "high",
  });
  assert.match(pack.partner_invite.toLowerCase(), /personal goal/);
  assert.doesNotMatch(pack.partner_invite.toLowerCase(), /sober/);
});
