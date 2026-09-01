import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import { schedulingToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import { getAgentPending } from "@/lib/doedtc/doedtc-pending";
import {
  buildScheduledTextFile,
  formatScheduledTextFileReply,
  scheduledTextFileIsEmpty,
  type ScheduledTextFile,
} from "@/lib/doedtc/doedtc-scheduled";
import { listScheduledTextsForUser } from "@/lib/doedtc/doedtc-scheduled-db";

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
    /\b(?:i(?:'ll| will)|done —)\s+(?:text|ping|remind)\b/i.test(text)
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

export async function groundReplyInCommittedState(params: {
  userId: string;
  inboundText: string;
  replyText: string;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): Promise<{ replyText: string; file: ScheduledTextFile }> {
  const asksStatus = inboundAsksReminderStatus(params.inboundText);
  const claimsEmpty = replyClaimsReminderEmpty(params.replyText);
  const claimsSet = replyClaimsReminderSet(params.replyText);
  if (!asksStatus && !claimsEmpty && !claimsSet) {
    return {
      replyText: params.replyText,
      file: { committed: [], recentlySent: [], draft: null },
    };
  }

  const file = await loadScheduledTextFile(params.userId);
  const replyText = reconcileReplyWithScheduledTextFile({
    inboundText: params.inboundText,
    replyText: params.replyText,
    file,
    scheduleTextSucceeded: schedulingToolSucceeded(params.toolsExecuted),
  });
  return { replyText, file };
}

export { scheduledTextFileIsEmpty };
