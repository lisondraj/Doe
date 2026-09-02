import assert from "node:assert/strict";
import test from "node:test";

import {
  inboundAsksReminderStatus,
  reconcileReplyWithLiveChart,
  reconcileReplyWithScheduledTextFile,
  replyClaimsReminderEmpty,
  replyClaimsReminderSet,
} from "@/lib/doedtc/agent/committed-state";
import { buildChartFile } from "@/lib/doedtc/agent/chart-file";
import {
  buildScheduledTextFile,
  formatScheduledTextFileForAgent,
  formatScheduledTextFileReply,
  type ScheduledTextFile,
} from "@/lib/doedtc/doedtc-scheduled";
import type { DoeDtcScheduledTextRow } from "@/lib/doedtc/doedtc-types";

function row(partial: Partial<DoeDtcScheduledTextRow> & { intent: string; status: "pending" | "sent" }): DoeDtcScheduledTextRow {
  return {
    id: partial.id ?? "row-1",
    created_by_user_id: "user-1",
    recipient_user_id: "user-1",
    recipient_member_id: null,
    recipient_phone: "+15555550100",
    send_at: partial.send_at ?? "2026-09-02T12:00:00.000Z",
    timezone: "America/New_York",
    intent: partial.intent,
    body: partial.body ?? "body",
    status: partial.status,
    sent_at: partial.status === "sent" ? "2026-09-01T12:00:00.000Z" : null,
    error: null,
    created_at: "",
    updated_at: "",
  };
}

const emptyFile: ScheduledTextFile = { committed: [], recentlySent: [], draft: null };

test("inboundAsksReminderStatus detects file questions", () => {
  assert.equal(inboundAsksReminderStatus("So are there any reminders in my file"), true);
  assert.equal(inboundAsksReminderStatus("What about this"), false);
  assert.equal(inboundAsksReminderStatus("set a timer for 5 seconds"), false);
});

test("replyClaimsReminderEmpty and Set", () => {
  assert.equal(replyClaimsReminderEmpty("There's nothing set right now"), false);
  assert.equal(
    replyClaimsReminderEmpty("There are no reminders set for you right now."),
    true,
  );
  assert.equal(replyClaimsReminderSet("I've set a reminder for Fred's appointment tomorrow."), true);
  assert.equal(replyClaimsReminderSet("Logged your shot."), false);
});

test("buildScheduledTextFile splits committed, sent, and schedule drafts", () => {
  const file = buildScheduledTextFile({
    rows: [row({ intent: "Fred appointment", status: "pending" }), row({ id: "s2", intent: "timer", status: "sent" })],
    pending: {
      kind: "schedule_text",
      summary: "Clarissa reminder tomorrow",
      args: { intent: "Clarissa reminder", send_at: "tomorrow", body: "hi" },
    },
  });
  assert.equal(file.committed.length, 1);
  assert.equal(file.recentlySent.length, 1);
  assert.equal(file.draft?.intent, "Clarissa reminder");
});

test("buildScheduledTextFile ignores RunState pending as a reminder draft", () => {
  const file = buildScheduledTextFile({
    rows: [],
    pending: { kind: "schedule_text", summary: "SDK", args: { runState: "blob" } },
  });
  assert.equal(file.draft, null);
});

test("formatScheduledTextFileForAgent labels drafts as not on the file", () => {
  const formatted = formatScheduledTextFileForAgent(
    buildScheduledTextFile({
      rows: [],
      pending: {
        kind: "schedule_text",
        summary: "Clarissa reminder",
        args: { intent: "Clarissa reminder", send_at: "tomorrow" },
      },
    }),
  );
  assert.match(formatted, /Draft \(NOT on the file/);
  assert.doesNotMatch(formatted, /^No scheduled texts\.$/);
});

test("propose then status ask rewrites to draft, not nothing and not I've set", () => {
  const file = buildScheduledTextFile({
    rows: [],
    pending: {
      kind: "schedule_text",
      summary: "Clarissa reminder tomorrow",
      args: { intent: "Clarissa reminder", send_at: "tomorrow", body: "hi" },
    },
  });
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "So are there any reminders in my file",
    replyText: "There's nothing set right now",
    file,
    scheduleTextSucceeded: false,
  });
  assert.match(reply, /drafted/i);
  assert.doesNotMatch(reply, /nothing set/i);
  assert.doesNotMatch(reply, /I've set/i);
});

test("committed row then status ask names the reminder", () => {
  const file: ScheduledTextFile = {
    committed: [row({ intent: "Fred's appointment", status: "pending" })],
    recentlySent: [],
    draft: null,
  };
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "are there any reminders in my file",
    replyText: "There's nothing set right now",
    file,
    scheduleTextSucceeded: false,
  });
  assert.match(reply, /Fred's appointment/);
  assert.doesNotMatch(reply, /nothing set/i);
});

test("empty committed and empty draft allows nothing set", () => {
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "are there any reminders in my file",
    replyText: "I've set a reminder for Fred's appointment tomorrow.",
    file: emptyFile,
    scheduleTextSucceeded: false,
  });
  assert.equal(reply, formatScheduledTextFileReply(emptyFile));
  assert.match(reply, /nothing set/i);
});

test("unbacked I've set with empty file does not echo the transcript", () => {
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "What about this",
    replyText: "I've set a reminder for Fred's appointment tomorrow.",
    file: emptyFile,
    scheduleTextSucceeded: false,
  });
  assert.doesNotMatch(reply, /Fred/);
  assert.match(reply, /nothing set/i);
});

test("schedule_text success keeps a set claim when the file is still catching up", () => {
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "remind me tomorrow",
    replyText: "I've set a reminder for tomorrow.",
    file: emptyFile,
    scheduleTextSucceeded: true,
  });
  assert.match(reply, /I've set/);
});

test("reconcileReplyWithLiveChart rewrites unbacked Fred appointment claim", () => {
  const file = buildChartFile({
    snapshot: {
      user: { id: "u1" },
      household: { household: null, members: [], consents: [] },
      appointments: [],
      artifacts: [],
      scheduledTexts: [],
    } as never,
  });
  const reply = reconcileReplyWithLiveChart({
    userId: "u1",
    inboundText: "Book Fred's appointment",
    replyText: "I've logged Fred's dentist appointment.",
    file,
    toolsExecuted: [],
    viewerUserId: "u1",
  });
  assert.match(reply, /Fred isn't on the household/i);
});

test("fatigue conversation is not replaced by reminder file dump", () => {
  const sentRows = [
    row({ id: "s1", intent: "", status: "sent" }),
    row({ id: "s2", intent: "", status: "sent" }),
    row({ id: "s3", intent: "", status: "sent" }),
  ];
  const file = buildScheduledTextFile({ rows: sentRows, pending: null });
  const chartFile = buildChartFile({
    snapshot: {
      user: { id: "user-1" },
      household: { household: null, members: [], consents: [] },
      appointments: [],
      artifacts: [],
      scheduledTexts: sentRows,
    } as never,
  });
  const modelReply = "I don't see any fatigue logs in your chart yet.";
  const scoped = reconcileReplyWithScheduledTextFile({
    inboundText: "Why am I so tired",
    replyText: modelReply,
    file,
    scheduleTextSucceeded: false,
    turnMode: "conversation",
  });
  assert.equal(scoped, modelReply);

  const grounded = reconcileReplyWithLiveChart({
    userId: "user-1",
    inboundText: "Why am I so tired",
    replyText: modelReply,
    file: chartFile,
    toolsExecuted: [],
    viewerUserId: "user-1",
    turnMode: "conversation",
  });
  assert.equal(grounded, modelReply);
  assert.doesNotMatch(grounded, /Already sent/i);
});

test("forgetting after an appointment is not rewritten to nothing set", () => {
  const chartFile = buildChartFile({
    snapshot: {
      user: { id: "user-1" },
      household: { household: null, members: [], consents: [] },
      appointments: [],
      artifacts: [],
      scheduledTexts: [],
    } as never,
  });
  const modelReply = "That's frustrating. Want me to text you a recap after visits so it doesn't slip?";
  const grounded = reconcileReplyWithLiveChart({
    userId: "user-1",
    inboundText: "I always forget things after an appointment",
    replyText: modelReply,
    file: chartFile,
    toolsExecuted: [],
    viewerUserId: "user-1",
    turnMode: "conversation",
  });
  assert.equal(grounded, modelReply);
  assert.doesNotMatch(grounded, /nothing set/i);
});

test("reminder status ask still grounds to live file", () => {
  const sentRows = [
    row({ id: "s1", intent: "", status: "sent" }),
    row({ id: "s2", intent: "", status: "sent" }),
  ];
  const file = buildScheduledTextFile({ rows: sentRows, pending: null });
  const reply = reconcileReplyWithScheduledTextFile({
    inboundText: "any reminders set?",
    replyText: "There are no reminders set for you.",
    file,
    scheduleTextSucceeded: false,
    turnMode: "action",
  });
  assert.match(reply, /Already sent/i);
  assert.match(reply, /2 reminders/i);
});

test("formatScheduledTextFileReply summarizes repeated empty intents", () => {
  const file = buildScheduledTextFile({
    rows: [
      row({ id: "s1", intent: "", status: "sent" }),
      row({ id: "s2", intent: "", status: "sent" }),
      row({ id: "s3", intent: "", status: "sent" }),
    ],
    pending: null,
  });
  const reply = formatScheduledTextFileReply(file);
  assert.match(reply, /3 reminders already sent/i);
  assert.doesNotMatch(reply, /reminder, reminder, reminder/i);
});
