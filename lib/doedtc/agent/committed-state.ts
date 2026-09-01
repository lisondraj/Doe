import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import { extractChartMentions } from "@/lib/doedtc/agent/action-slots";
import {
  buildChartFile,
  reconcileReplyWithChartFile,
  type ChartFile,
} from "@/lib/doedtc/agent/chart-file";
import { schedulingToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import { getAgentPending } from "@/lib/doedtc/doedtc-pending";
import {
  buildScheduledTextFile,
  formatScheduledTextFileReply,
  scheduledTextFileIsEmpty,
  type ScheduledTextFile,
} from "@/lib/doedtc/doedtc-scheduled";
import { listScheduledTextsForUser } from "@/lib/doedtc/doedtc-scheduled-db";
import type { DoeDtcHouseholdMemberRow } from "@/lib/doedtc/doedtc-types";

export function inboundAsksReminderStatus(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:in my file|any reminders?|reminders? (?:set|in)|what(?:'s| is) (?:set|on (?:the|my) file)|do i have (?:a |any )?(?:reminder|scheduled)|are there any reminders?)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  if (/^what about this\??$/i.test(trimmed)) return true;
  return false;
}

export function replyClaimsReminderEmpty(text: string): boolean {
  return /\b(?:no reminders?|nothing set|nothing (?:is )?set(?: right now)?|don'?t see any|do not see any|there(?:'s| is) nothing(?: set)?)\b/i.test(
    text,
  );
}

export function replyClaimsReminderSet(text: string): boolean {
  return (
    /\b(?:i(?:'ve| have) set|reminder (?:is|for)|on (?:the|your) file)\b/i.test(text) ||
    /\b(?:i(?:'ll| will)|done[.—])\s+(?:text|ping|remind)\b/i.test(text)
  );
}

export function hasOnFileReminders(file: ScheduledTextFile): boolean {
  return file.committed.length > 0 || file.recentlySent.length > 0;
}

export function reconcileReplyWithScheduledTextFile(params: {
  inboundText: string;
  replyText: string;
  file: ScheduledTextFile;
  scheduleTextSucceeded: boolean;
}): string {
  const asksStatus = inboundAsksReminderStatus(params.inboundText);
  const claimsEmpty = replyClaimsReminderEmpty(params.replyText);
  const claimsSet = replyClaimsReminderSet(params.replyText);
  if (!asksStatus && !claimsEmpty && !claimsSet) {
    return params.replyText;
  }

  const onFile = hasOnFileReminders(params.file);
  const anything = onFile || Boolean(params.file.draft);

  if (asksStatus) {
    return formatScheduledTextFileReply(params.file);
  }

  if (claimsEmpty && anything) {
    return formatScheduledTextFileReply(params.file);
  }

  if (claimsSet && !params.scheduleTextSucceeded && !onFile) {
    return formatScheduledTextFileReply(params.file);
  }

  return params.replyText;
}

export async function loadScheduledTextFile(userId: string): Promise<ScheduledTextFile> {
  const [rows, pending] = await Promise.all([
    listScheduledTextsForUser(userId),
    getAgentPending(userId),
  ]);
  return buildScheduledTextFile({ rows, pending });
}

export function toolSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
  toolName: string,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.name === toolName && row.ok);
}

function subjectNameFromInbound(params: {
  inboundText: string;
  members: DoeDtcHouseholdMemberRow[];
  viewerUserId: string;
}): string | null {
  const { mentioned, unknownNames } = extractChartMentions({
    inboundText: params.inboundText,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });
  return mentioned[0]?.full_name ?? unknownNames[0] ?? null;
}

export function reconcileReplyWithLiveChart(params: {
  userId: string;
  inboundText: string;
  replyText: string;
  file: ChartFile;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
  viewerUserId: string;
}): string {
  const reminderFirst = reconcileReplyWithScheduledTextFile({
    inboundText: params.inboundText,
    replyText: params.replyText,
    file: params.file.reminders,
    scheduleTextSucceeded: schedulingToolSucceeded(params.toolsExecuted),
  });

  return reconcileReplyWithChartFile({
    inboundText: params.inboundText,
    replyText: reminderFirst,
    file: params.file,
    subjectName: subjectNameFromInbound({
      inboundText: params.inboundText,
      members: params.file.household,
      viewerUserId: params.viewerUserId,
    }),
    logAppointmentSucceeded: toolSucceeded(params.toolsExecuted, "log_appointment"),
    logFamilyMemberSucceeded: toolSucceeded(params.toolsExecuted, "log_family_member"),
    logArtifactEntrySucceeded: toolSucceeded(params.toolsExecuted, "log_artifact_entry"),
  });
}

export async function groundReplyInCommittedState(params: {
  userId: string;
  inboundText: string;
  replyText: string;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): Promise<{ replyText: string; file: ScheduledTextFile; chartFile: ChartFile }> {
  const asksReminder = inboundAsksReminderStatus(params.inboundText);
  const claimsReminder =
    replyClaimsReminderEmpty(params.replyText) || replyClaimsReminderSet(params.replyText);

  const [snapshot, pending] = await Promise.all([
    getDoeDtcProfileSnapshot(params.userId),
    getAgentPending(params.userId),
  ]);

  const chartFile = buildChartFile({ snapshot, pending });
  const needsGrounding =
    asksReminder ||
    claimsReminder ||
    /\b(?:booked|logged|saved|added)\b/i.test(params.replyText) ||
    /\b(?:on (?:the|my) chart|appointment)\b/i.test(params.inboundText);

  if (!needsGrounding) {
    return {
      replyText: params.replyText,
      file: chartFile.reminders,
      chartFile,
    };
  }

  const replyText = reconcileReplyWithLiveChart({
    userId: params.userId,
    inboundText: params.inboundText,
    replyText: params.replyText,
    file: chartFile,
    toolsExecuted: params.toolsExecuted,
    viewerUserId: params.userId,
  });

  return { replyText, file: chartFile.reminders, chartFile };
}

export { scheduledTextFileIsEmpty };
