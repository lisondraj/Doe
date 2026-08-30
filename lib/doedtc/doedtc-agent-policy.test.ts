import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyAgentAction,
  inboundAlreadyAsked,
} from "@/lib/doedtc/doedtc-agent-policy";
import { buildDoeAgentVoiceBlock, hasConcretePlan } from "@/lib/doedtc/doedtc-agent-voice";
import {
  buildDefaultHabitCheckInBody,
  computeWorkflowNextRunAt,
  defaultHabitCheckInHour,
} from "@/lib/doedtc/doedtc-workflows";

test("classifyAgentAction commits when inbound already asked", () => {
  assert.equal(
    classifyAgentAction({
      inboundText: "can you set a timer for 5 seconds",
      textsThirdParty: false,
      missingSlot: false,
    }),
    "act_now",
  );
});

test("classifyAgentAction confirms third-party texts", () => {
  assert.equal(
    classifyAgentAction({
      inboundText: "text Maya tonight",
      textsThirdParty: true,
      missingSlot: false,
    }),
    "confirm_once",
  );
});

test("inboundAlreadyAsked detects timer and make-sure asks", () => {
  assert.equal(inboundAlreadyAsked("Can you set a timer for 5 seconds"), true);
  assert.equal(inboundAlreadyAsked("help my kid shower daily"), true);
  assert.equal(inboundAlreadyAsked("thanks"), false);
});

test("buildDoeAgentVoiceBlock does not instruct wait for yes before schedule_text", () => {
  const block = buildDoeAgentVoiceBlock();
  assert.doesNotMatch(block, /wait for yes before schedule_text/i);
  assert.doesNotMatch(block, /Never auto-schedule/i);
  assert.match(block, /schedule_text/i);
});

test("hasConcretePlan accepts done timer replies", () => {
  assert.equal(hasConcretePlan("Done — I'll text you in 5 seconds."), true);
});

test("parseScheduledSendAt accepts in 5 seconds", async () => {
  const { parseScheduledSendAt, shouldSendScheduledTextInline } = await import(
    "@/lib/doedtc/doedtc-scheduled"
  );
  const from = new Date("2026-08-30T12:00:00.000Z");
  const when = parseScheduledSendAt("in 5 seconds", from);
  assert.equal(when.toISOString(), "2026-08-30T12:00:05.000Z");
  assert.equal(shouldSendScheduledTextInline(when, from), true);
});

test("buildDefaultHabitCheckInBody handles shower goals", () => {
  const body = buildDefaultHabitCheckInBody("learn to shower daily", "Maya");
  assert.match(body, /shower/i);
  assert.match(body, /Maya/);
});

test("defaultHabitCheckInHour picks evening for shower habits", () => {
  assert.equal(defaultHabitCheckInHour("learn to shower daily"), 19);
  assert.equal(defaultHabitCheckInHour("morning meds"), 8);
});

test("computeWorkflowNextRunAt schedules a future check-in", () => {
  const from = new Date("2026-08-30T15:00:00.000Z");
  const next = computeWorkflowNextRunAt(
    {
      cadence: "daily",
      timezone: "America/New_York",
      check_in_hour: 19,
      check_in_body: "test",
      subject_phone: "+15551234567",
      subject_user_id: null,
      subject_name: "Maya",
      notify_phone: "+15559876543",
      notify_user_id: "owner",
      notify_name: "Parent",
      await_timeout_minutes: 120,
    },
    from,
  );
  assert.ok(next.getTime() > from.getTime());
});
