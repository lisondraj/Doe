import assert from "node:assert/strict";
import test from "node:test";

import {
  buildReminderClarifyingQuestion,
  buildReminderIntentDirective,
  parseReminderIntent,
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
