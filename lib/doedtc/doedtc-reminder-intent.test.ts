import assert from "node:assert/strict";
import test from "node:test";

import {
  buildReminderClarifyingQuestion,
  buildReminderIntentDirective,
  parseReminderIntent,
  sanitizeScheduledTextBody,
} from "@/lib/doedtc/doedtc-reminder-intent";

test("parseReminderIntent extracts time and body from complete ask", () => {
  const intent = parseReminderIntent("In 5 seconds text me hi");
  assert.equal(intent.matched, true);
  assert.equal(intent.sendAtPhrase, "in 5 seconds");
  assert.equal(intent.body, "hi");
  assert.equal(intent.missingSlot, null);
});

test("parseReminderIntent flags missing body for reminder-only ask", () => {
  const intent = parseReminderIntent("Text me with a reminder in 10 seconds");
  assert.equal(intent.matched, true);
  assert.equal(intent.sendAtPhrase, "in 10 seconds");
  assert.equal(intent.body, null);
  assert.equal(intent.missingSlot, "body");
});

test("parseReminderIntent ignores unrelated messages", () => {
  const intent = parseReminderIntent("What are my meds");
  assert.equal(intent.matched, false);
});

test("buildReminderIntentDirective asks for body when slot missing", () => {
  const intent = parseReminderIntent("remind me in 5 seconds");
  const directive = buildReminderIntentDirective(intent);
  assert.ok(directive);
  assert.match(directive!, /Do NOT call schedule_text/i);
});

test("buildReminderIntentDirective commits when body is present", () => {
  const intent = parseReminderIntent("In 5 seconds text me hi");
  const directive = buildReminderIntentDirective(intent);
  assert.ok(directive);
  assert.match(directive!, /schedule_text/i);
  assert.match(directive!, /in 5 seconds/);
});

test("buildReminderClarifyingQuestion is short", () => {
  const intent = parseReminderIntent("remind me in 5 seconds");
  const question = buildReminderClarifyingQuestion(intent);
  assert.match(question.toLowerCase(), /about what/);
});

test("parseReminderIntent extracts named reminder bodies and clock times", () => {
  const relative = parseReminderIntent("remind me ozempic in 10 seconds");
  assert.equal(relative.matched, true);
  assert.equal(relative.body, "ozempic");

  const clock = parseReminderIntent("remind me to take ozempic at 8pm");
  assert.equal(clock.matched, true);
  assert.equal(clock.sendAtPhrase, "at 8pm");
  assert.equal(clock.body, "take ozempic");
});

test("sanitizeScheduledTextBody never sends the confirmation or raw remind-me wrapper", () => {
  assert.equal(
    sanitizeScheduledTextBody({
      body: "Absolutely I will remind you",
      inboundText: "remind me ozempic in 10 seconds",
      intent: "reminder",
    }),
    "ozempic",
  );
  assert.equal(
    sanitizeScheduledTextBody({
      body: "remind me ozempic",
      inboundText: "remind me ozempic in 10 seconds",
    }),
    "ozempic",
  );
  assert.equal(
    sanitizeScheduledTextBody({
      body: "hi",
      inboundText: "In 5 seconds text me hi",
    }),
    "hi",
  );
});

test("sanitizeScheduledTextBody strips restated asks even without inbound", () => {
  assert.equal(
    sanitizeScheduledTextBody({
      body: "remind to take ozempic",
      intent: "reminder",
    }),
    "take ozempic",
  );
  assert.equal(
    sanitizeScheduledTextBody({
      body: "Can you remind to take ozempic in 10 seconds",
      intent: "reminder",
    }),
    "take ozempic",
  );
  assert.equal(
    sanitizeScheduledTextBody({
      body: "in 10 seconds remind to take ozempic",
      intent: "reminder",
    }),
    "take ozempic",
  );
  assert.equal(
    sanitizeScheduledTextBody({
      body: "remind me to take ozempic",
      inboundText: "remind to take ozempic in 10 seconds",
    }),
    "take ozempic",
  );
});

test("parseReminderIntent payload is the task not the remind-command", () => {
  const intent = parseReminderIntent("remind to take ozempic in 10 seconds");
  assert.equal(intent.matched, true);
  assert.equal(intent.body, "take ozempic");
});
