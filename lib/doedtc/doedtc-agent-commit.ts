import { startAccountabilityPact } from "@/lib/doedtc/doedtc-accountability-db";
import { normalizeAccountabilityMechanics } from "@/lib/doedtc/doedtc-accountability";
import { doeDtcAppUrl } from "@/lib/doedtc/doedtc-copy";
import { saveDoeDtcGuide } from "@/lib/doedtc/doedtc-guides-db";
import type { DoeDtcAgentPendingRow } from "@/lib/doedtc/doedtc-pending";
import {
  createScheduledText,
  resolveScheduledTextRecipient,
  sendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled-db";
import {
  ensureFutureSendAt,
  formatScheduledSendAtLabel,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
  shouldSendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled";
import {
  buildHabitWorkflowConfig,
  createHabitWorkflow,
} from "@/lib/doedtc/doedtc-workflows";
import {
  createDoeDtcHouseholdInvite,
  loadDoeDtcHouseholdAccessContext,
  resolveDoeDtcHouseholdSubject,
} from "@/lib/doedtc/doedtc-db";
import { findHouseholdMemberByName } from "@/lib/doedtc/doedtc-household";
import { sendDoeDtcFamilyInviteMessage } from "@/lib/doedtc/doedtc-messaging";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export type AgentPendingCommitResult =
  | {
      ok: true;
      replyHint: string;
      playbookNote?: string;
      profileUrl?: string;
    }
  | { ok: false; error: string; recoverable: boolean; rolledArgs?: Record<string, unknown> };

export async function executeAgentPendingCommit(params: {
  user: DoeDtcUserRow;
  pending: DoeDtcAgentPendingRow;
  allowRollForward?: boolean;
}): Promise<AgentPendingCommitResult> {
  const args = params.pending.args;

  try {
    switch (params.pending.commit_tool) {
      case "schedule_text": {
        const timezone = normalizeScheduledTimezone(
          typeof args.timezone === "string" ? args.timezone : undefined,
        );
        const sendAtRaw = String(args.send_at ?? "").trim();
        if (!sendAtRaw) throw new Error("Missing send time.");
        let sendAt = parseScheduledSendAt(sendAtRaw, new Date(), timezone);
        const beforeRoll = sendAt.toISOString();
        sendAt = ensureFutureSendAt(sendAt, new Date(), timezone);
        const rolled = sendAt.toISOString() !== beforeRoll;

        if (shouldSendScheduledTextInline(sendAt, new Date())) {
          await sendScheduledTextInline({
            creator: params.user,
            intent: String(args.intent ?? "").trim(),
            body: String(args.body ?? "").trim(),
            sendAt,
            timezone,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
          return {
            ok: true,
            replyHint: `Done — I'll text you in a few seconds.`,
          };
        }

        const row = await createScheduledText({
          creator: params.user,
          intent: String(args.intent ?? "").trim(),
          body: String(args.body ?? "").trim(),
          sendAtIso: sendAt.toISOString(),
          timezone,
          memberId: typeof args.member_id === "string" ? args.member_id : null,
          memberName: typeof args.member_name === "string" ? args.member_name : null,
        });

        const label = formatScheduledSendAtLabel(new Date(row.send_at), timezone);
        return {
          ok: true,
          replyHint: rolled
            ? `Got it — I'll text you ${label}.`
            : `Got it — I'll text you at ${label}.`,
          playbookNote: rolled
            ? "When scheduling reminders, roll past clock times forward one local day instead of treating them as already passed."
            : undefined,
        };
      }
      case "save_guide": {
        const row = await saveDoeDtcGuide({
          userId: params.user.id,
          guideId: typeof args.guide_id === "string" ? args.guide_id : undefined,
          titleHint: typeof args.title_hint === "string" ? args.title_hint : undefined,
        });
        return {
          ok: true,
          replyHint: `Saved "${row.title}" to your profile.`,
          profileUrl: doeDtcAppUrl(params.user.care_token, { tab: "guides" }),
        };
      }
      case "start_accountability": {
        const goal = String(args.goal ?? "").trim();
        if (!goal) throw new Error("goal is required.");
        let subjectUserId = params.user.id;
        let subjectMemberId: string | null = null;
        let subjectName = String(args.subject_name ?? "").trim() || params.user.full_name || "You";
        if (args.member_id || args.member_name) {
          const subject = await resolveDoeDtcHouseholdSubject({
            viewerUserId: params.user.id,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
          if ("error" in subject) throw new Error(subject.error);
          if (!subject.canEdit) {
            throw new Error(`You do not have permission to edit ${subject.subjectMember.full_name}'s profile.`);
          }
          subjectUserId = subject.subjectUserId;
          subjectMemberId = subject.subjectMember.id;
          subjectName = subject.subjectMember.full_name;
        }
        const mechanics = normalizeAccountabilityMechanics(
          args.mechanics && typeof args.mechanics === "object"
            ? (args.mechanics as Record<string, unknown>)
            : undefined,
        );
        const view = await startAccountabilityPact({
          owner: params.user,
          title: String(args.title ?? goal).trim(),
          goal,
          mechanics,
          subjectUserId,
          subjectMemberId,
          subjectName,
          partnerName: typeof args.partner_name === "string" ? args.partner_name : null,
          partnerPhone: typeof args.partner_phone === "string" ? args.partner_phone : null,
          involvePartner: Boolean(args.involve_partner),
        });
        return {
          ok: true,
          replyHint: `Accountability pact "${view.pact.title}" is live.`,
          profileUrl: doeDtcAppUrl(params.user.care_token, { tab: "accountability" }),
        };
      }
      case "start_habit_workflow": {
        const goal = String(args.goal ?? "").trim();
        if (!goal) throw new Error("goal is required.");
        let subjectMemberId: string | null = null;
        let subjectName = String(args.subject_name ?? "").trim() || params.user.full_name || "You";
        if (args.member_id || args.member_name) {
          const subject = await resolveDoeDtcHouseholdSubject({
            viewerUserId: params.user.id,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
          if ("error" in subject) throw new Error(subject.error);
          if (!subject.canEdit) {
            throw new Error(`You do not have permission to edit ${subject.subjectMember.full_name}'s profile.`);
          }
          subjectMemberId = subject.subjectMember.id;
          subjectName = subject.subjectMember.full_name;
        }
        const timezone = normalizeScheduledTimezone(
          typeof args.timezone === "string" ? args.timezone : undefined,
        );
        const config = await buildHabitWorkflowConfig({
          owner: params.user,
          goal,
          subjectName,
          subjectMemberId,
          checkInHour: typeof args.check_in_hour === "number" ? args.check_in_hour : undefined,
          checkInBody: typeof args.check_in_body === "string" ? args.check_in_body : undefined,
          awaitTimeoutMinutes:
            typeof args.await_timeout_minutes === "number" ? args.await_timeout_minutes : undefined,
          timezone,
        });
        const workflow = await createHabitWorkflow({
          owner: params.user,
          goal,
          config,
          subjectMemberId,
        });
        return {
          ok: true,
          replyHint: `I'll text ${config.subject_name} at ${config.check_in_hour}:00 each day for ${workflow.goal} and ping you if they don't reply.`,
        };
      }
      case "send_family_invite": {
        const memberId = String(args.member_id ?? "").trim();
        const memberName = String(args.member_name ?? "").trim();
        let resolvedMemberId = memberId;
        if (!resolvedMemberId && memberName) {
          const { members } = await loadDoeDtcHouseholdAccessContext(params.user.id);
          const member = findHouseholdMemberByName(members, memberName);
          if (!member) throw new Error("Family member not found.");
          resolvedMemberId = member.id;
        }
        if (!resolvedMemberId) throw new Error("member_id or member_name is required.");
        const { invite, member } = await createDoeDtcHouseholdInvite({
          adminUserId: params.user.id,
          memberId: resolvedMemberId,
        });
        await sendDoeDtcFamilyInviteMessage({
          adminUser: params.user,
          memberPhone: member.phone!,
          inviteToken: invite.token,
          memberName: member.full_name,
        });
        return {
          ok: true,
          replyHint: `Sent ${member.full_name} a join link.`,
        };
      }
      default:
        throw new Error(`Unknown pending commit tool: ${params.pending.commit_tool}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not complete that action.";
    const recoverable =
      params.allowRollForward !== false &&
      params.pending.commit_tool === "schedule_text" &&
      /future|passed|parse/i.test(message);
    return { ok: false, error: message, recoverable };
  }
}

export async function buildScheduledTextPendingArgs(params: {
  user: DoeDtcUserRow;
  intent: string;
  body: string;
  sendAtRaw: string;
  timezone?: string | null;
  memberId?: string | null;
  memberName?: string | null;
}): Promise<{ args: Record<string, unknown>; summary: string; sendAtIso: string; recipientName: string }> {
  const timezone = normalizeScheduledTimezone(params.timezone);
  let sendAt = parseScheduledSendAt(params.sendAtRaw, new Date(), timezone);
  sendAt = ensureFutureSendAt(sendAt, new Date(), timezone);
  const recipient = await resolveScheduledTextRecipient({
    creator: params.user,
    memberId: params.memberId,
    memberName: params.memberName,
  });
  const label = formatScheduledSendAtLabel(sendAt, timezone);
  return {
    sendAtIso: sendAt.toISOString(),
    recipientName: recipient.recipientName,
    summary: `Text ${recipient.recipientName} at ${label}: ${params.intent}`,
    args: {
      intent: params.intent,
      body: params.body,
      send_at: sendAt.toISOString(),
      timezone,
      member_id: params.memberId ?? undefined,
      member_name: params.memberName ?? undefined,
    },
  };
}
