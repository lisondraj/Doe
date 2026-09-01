/** Deterministic household action routing — joined vs pending vs unknown. */

import { inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import type { DoeDtcHouseholdMemberRow } from "@/lib/doedtc/doedtc-types";

export type HouseholdSubjectState = "joined" | "pending_phone" | "pending_no_phone" | "unknown";

export type HouseholdActionKind = "remind_habit" | "profile_write" | "invite";

export type HouseholdMemberLike = Pick<
  DoeDtcHouseholdMemberRow,
  "id" | "full_name" | "user_id" | "phone" | "status" | "relationship" | "role" | "gender"
>;

export function householdMemberState(
  member: Pick<HouseholdMemberLike, "user_id" | "phone" | "status"> | null | undefined,
): HouseholdSubjectState {
  if (!member) return "unknown";
  if (member.user_id) return "joined";
  if (member.phone?.trim()) return "pending_phone";
  return "pending_no_phone";
}

export function inboundLooksLikeHabitOrReminder(text: string): boolean {
  return /\b(remind|make sure|habit|every (?:day|night)|daily|nag|bath|shower|check in|text (?:them|her|him|maya|leo))\b/i.test(
    text,
  );
}

export function inboundLooksLikeProfileWrite(text: string): boolean {
  return /\b(appointment|dentist|doctor(?:'s)?(?:\s+visit)?|checkup|check-up|meds?\b|medication|prescription|log (?:an? )?(?:appointment|visit)|add (?:her|his|their) (?:meds?|medication))\b/i.test(
    text,
  );
}

export function inboundLooksLikeInvite(text: string): boolean {
  return /\b(invite|join (?:doe|the family|us)|send (?:them|her|him) (?:a )?(?:link|invite))\b/i.test(
    text,
  );
}

export function inferHouseholdActionKind(inboundText: string): HouseholdActionKind | null {
  if (inboundLooksLikeInvite(inboundText)) return "invite";
  if (inboundLooksLikeProfileWrite(inboundText)) return "profile_write";
  if (inboundLooksLikeHabitOrReminder(inboundText)) return "remind_habit";
  return null;
}

export type HouseholdRoute = {
  state: HouseholdSubjectState;
  action: HouseholdActionKind;
  /** Log/read against this user id. Pending members proxy onto the parent chart. */
  subjectUserId: string | null;
  /** Household member row to pass as member_id / member_name. */
  memberId: string | null;
  memberName: string | null;
  proxyToParent: boolean;
  primaryTool: string;
  offer: {
    tool: string;
    confirm: "act_now" | "confirm_once";
    promptLine: string;
  } | null;
  nextStep: string;
  neverAutoTextUnmentioned: true;
};

function inviteConfirm(inboundText: string): "act_now" | "confirm_once" {
  return inboundAlreadyAsked(inboundText) && inboundLooksLikeInvite(inboundText)
    ? "act_now"
    : "confirm_once";
}

/**
 * Route a named household subject. Unknown names pass `member: null`.
 * Never auto-texts siblings or unmentioned members.
 */
export function routeHouseholdSubject(params: {
  viewerUserId: string;
  inboundText: string;
  action: HouseholdActionKind;
  member: HouseholdMemberLike | null;
}): HouseholdRoute {
  const state = householdMemberState(params.member);
  const name = params.member?.full_name ?? null;
  const memberId = params.member?.id ?? null;
  const confirm = inviteConfirm(params.inboundText);

  const base = {
    state,
    action: params.action,
    memberId,
    memberName: name,
    neverAutoTextUnmentioned: true as const,
  };

  if (state === "unknown") {
    const who = "them";
    return {
      ...base,
      subjectUserId: null,
      proxyToParent: false,
      primaryTool: "log_family_member",
      offer: {
        tool: "log_family_member",
        confirm: "confirm_once",
        promptLine: `They named someone who is not on the chart. Ask one question: add ${who}? Then act.`,
      },
      nextStep: "Ask one question to add them with log_family_member. Do not invent SMS.",
    };
  }

  if (state === "joined") {
    return {
      ...base,
      subjectUserId: params.member!.user_id,
      proxyToParent: false,
      primaryTool:
        params.action === "remind_habit"
          ? "schedule_text or start_habit_workflow"
          : params.action === "invite"
            ? "none"
            : "act on their chart",
      offer: null,
      nextStep:
        params.action === "invite"
          ? `${name} already has Doe — do not send another invite.`
          : `Act on ${name}.`,
    };
  }

  if (state === "pending_phone") {
    if (params.action === "remind_habit") {
      return {
        ...base,
        subjectUserId: params.viewerUserId,
        proxyToParent: false,
        primaryTool: "schedule_text or start_habit_workflow",
        offer: null,
        nextStep: `Text ${name} (phone on file). Parent gets miss notify on habits.`,
      };
    }
    if (params.action === "invite") {
      return {
        ...base,
        subjectUserId: params.viewerUserId,
        proxyToParent: false,
        primaryTool: "send_family_invite",
        offer: {
          tool: "send_family_invite",
          confirm,
          promptLine: `Offer send_family_invite for ${name} (${confirm}).`,
        },
        nextStep: `Send or offer a join link to ${name}.`,
      };
    }
    return {
      ...base,
      subjectUserId: params.viewerUserId,
      proxyToParent: true,
      primaryTool: "parent-proxied log",
      offer: {
        tool: "send_family_invite",
        confirm,
        promptLine: `After the primary action, one complete offer: send ${name} a join link (${confirm}).`,
      },
      nextStep: `Log under the parent for ${name}, then offer send_family_invite.`,
    };
  }

  // pending_no_phone
  if (params.action === "remind_habit") {
    return {
      ...base,
      subjectUserId: params.viewerUserId,
      proxyToParent: true,
      primaryTool: "schedule_text or start_habit_workflow",
      offer: null,
      nextStep: `No phone for ${name} — text the parent. Do not invent SMS.`,
    };
  }
  if (params.action === "invite") {
    return {
      ...base,
      subjectUserId: params.viewerUserId,
      proxyToParent: false,
      primaryTool: "update_family_member",
      offer: {
        tool: "update_family_member",
        confirm: "confirm_once",
        promptLine: `Ask for a phone number for ${name}. Do not invent SMS.`,
      },
      nextStep: `Ask for a number for ${name}. Do not invent SMS.`,
    };
  }
  return {
    ...base,
    subjectUserId: params.viewerUserId,
    proxyToParent: true,
    primaryTool: "parent-proxied log",
    offer: {
      tool: "update_family_member",
      confirm: "confirm_once",
      promptLine: `Logged on the parent chart for ${name}. Ask for a phone number if they should get their own Doe.`,
    },
    nextStep: `Log under the parent for ${name}, or ask for a phone number. Do not invent SMS.`,
  };
}

export function parentProxyNextStep(member: HouseholdMemberLike): string {
  const route = routeHouseholdSubject({
    viewerUserId: "parent",
    inboundText: "log appointment",
    action: "profile_write",
    member,
  });
  return route.nextStep;
}

export function appointmentNotesForProxy(params: {
  notes?: string | null;
  proxied?: boolean;
  memberName?: string | null;
}): string | null {
  const base = params.notes?.trim() || "";
  if (!params.proxied || !params.memberName?.trim()) return base || null;
  const tag = `For ${params.memberName.trim()} (not joined yet)`;
  return base ? `${base} — ${tag}` : tag;
}
