import { randomUUID } from "node:crypto";

import {
  askedForDeliverable,
  askedForPrivateAppLink,
  buildPrivateAppLink,
  findMatchingGuide,
  interpretBuildIntent,
} from "@/lib/doedtc/agent/deliverable-policy";
import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcGuideUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import { applyReminderSafetyNet } from "@/lib/doedtc/doedtc-reminder-intent";
import { meaningfulToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const REFUSAL_PATTERN =
  /\b(can'?t|cannot|unable to|not able to|don'?t have (?:the )?(?:ability|access)|won'?t be able to)\b/i;
const SELF_HELP_PATTERN =
  /\b(you might try|try visiting|in your browser|yourself|on your (?:own|phone|device))\b/i;

export const SCHEDULED_TEXT_CLAIM =
  /\b(?:i(?:'ve| have) set.{0,40}reminder|(?:i(?:'ll| will)|done[.—])\s+(?:text|ping|remind)\s+you\b)/i;

const CLAIM_REGISTRY: Array<{
  id: string;
  claim: RegExp;
  requiredTools: string[];
    repair?: "profile" | "tracker" | "listen" | "session" | "guide" | "invite_correction" | "schedule";
}> = [
  {
    id: "profile_link",
    claim:
      /\b(send(?:ing)?|here'?s|share)\b.{0,48}\b(profile|dashboard|appointments?\s*page)\b|\b(profile|dashboard|appointments?\s*page)\b.{0,24}\b(link|url)\b/i,
    requiredTools: ["send_profile_link"],
    repair: "profile",
  },
  {
    id: "tracker_link",
    claim:
      /\b(send(?:ing)?|here'?s|share)\b.{0,48}\b(tracker|weight(?:\s+log)?|artifact)\b|\b(tracker|weight(?:\s+tracker)?)\b.{0,24}\b(link|url)\b/i,
    requiredTools: ["send_profile_link", "share_artifact", "create_profile_artifact"],
    repair: "tracker",
  },
  {
    id: "guide_link",
    claim:
      /\b(send(?:ing)?|here'?s|share)\b.{0,48}\b(guide|how-?to|instructions)\b|\b(guide|how-?to|instructions)\b.{0,24}\b(link|url)\b/i,
    requiredTools: ["create_guide", "send_guide_link"],
    repair: "guide",
  },
  {
    id: "listen_link",
    claim:
      /\b(send(?:ing)?|here'?s)\b.{0,40}\b(listen|recording)\b|\b(listen|recording)\b.{0,20}\b(link|url)\b/i,
    requiredTools: ["start_listen"],
    repair: "listen",
  },
  {
    id: "session_link",
    claim:
      /\b(send(?:ing)?|here'?s)\b.{0,40}\b(session|live view)\b|\b(session|live view)\b.{0,20}\b(link|url)\b/i,
    requiredTools: ["show_session"],
    repair: "session",
  },
  {
    id: "family_invite",
    claim: /\b(send(?:ing)? invites?|invite(?:s)? (?:are|is) (?:on the way|coming|sent)|they'?ll get a link)\b/i,
    requiredTools: ["send_family_invite"],
    repair: "invite_correction",
  },
  {
    id: "scheduled_text",
    claim: SCHEDULED_TEXT_CLAIM,
    requiredTools: ["schedule_text"],
    repair: "schedule",
  },
  {
    id: "appointment_logged",
    claim:
      /\b(?:i(?:'ve| have) (?:booked|logged|saved)|booked|logged)\b.{0,40}\b(?:appointment|dentist|doctor|visit)\b/i,
    requiredTools: ["log_appointment"],
  },
  {
    id: "result_logged",
    claim: /\b(?:i(?:'ve| have)? logged|logged|saved)\b.{0,48}\b(?:a1c|lab|result|results|bloodwork|cbc|glucose|cholesterol)\b/i,
    requiredTools: ["log_result", "parse_document"],
  },
  {
    id: "medication_logged",
    claim: /\b(?:i(?:'ve| have)? logged|logged|added)\b.{0,40}\b(?:med(?:ication)?|rx|prescription)\b/i,
    requiredTools: ["add_medication", "parse_document"],
  },
  {
    id: "member_added",
    claim: /\b(?:i(?:'ve| have) added|added)\b.{0,32}\b(?:to (?:the|your) (?:chart|household|family)|on (?:the|your) chart)\b/i,
    requiredTools: ["log_family_member"],
  },
  {
    id: "artifact_logged",
    claim: /\b(?:i(?:'ve| have)? logged|logged)\b.{0,40}\b(?:glasses?|shot|dose|water|entry)\b/i,
    requiredTools: ["log_artifact_entry"],
  },
];

export function looksLikeRefusal(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return REFUSAL_PATTERN.test(trimmed) || SELF_HELP_PATTERN.test(trimmed);
}

export function shouldRetryEmptyRefusal(params: {
  replyText: string;
  toolsExecuted: DoeDtcAgentToolExecutionRecord[];
  turnMode?: import("@/lib/doedtc/agent/turn-mode").TurnMode;
}): boolean {
  if (
    params.turnMode &&
    (params.turnMode === "crisis" ||
      params.turnMode === "distress" ||
      params.turnMode === "conversation")
  ) {
    return false;
  }
  return looksLikeRefusal(params.replyText) && !meaningfulToolSucceeded(params.toolsExecuted);
}

export function buildRefusalRetrySystemMessage(inboundText: string): string {
  return `You refused without calling any tools. The user asked: "${inboundText.slice(0, 280)}". You have real tools — attempt the task (start_browser_task, send_family_invite, read_profile, etc.) before saying you cannot do it. Only refuse after a tool actually failed.`;
}

export function toolSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[],
  toolName: string,
): boolean {
  return toolsExecuted.some((row) => row.name === toolName && row.ok);
}

export function replyClaimsAction(text: string, claim: RegExp): boolean {
  return (
    claim.test(text) &&
    /\b(link|send(?:ing)?|here'?s|on the way|in a moment|text you|remind you)\b/i.test(text)
  );
}

function buildInviteCorrectionReply(state: DoeDtcToolTurnState): string | null {
  const sent = state.familyInvitesSent ?? [];
  const errors = state.familyInviteErrors ?? [];
  if (sent.length === 0 && errors.length === 0) {
    return "I haven't sent any invites yet. Tell me who has a phone number and I'll text them a join link.";
  }
  const parts: string[] = [];
  if (sent.length > 0) {
    parts.push(`Sent invites to ${sent.join(", ")}.`);
  }
  if (errors.length > 0) {
    parts.push(errors.join(" "));
  }
  return parts.join(" ") || null;
}

export async function reconcileReplyClaims(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  replyText: string;
  state: DoeDtcToolTurnState;
  toolsExecuted: DoeDtcAgentToolExecutionRecord[];
  snapshot?: DoeDtcProfileSnapshot;
}): Promise<{
  replyText: string;
  listenUrl?: string;
  profileUrl?: string;
  sessionUrl?: string;
  guideUrl?: string;
}> {
  let replyText = params.replyText;
  let listenUrl = params.state.listenUrl;
  let profileUrl = params.state.profileUrl;
  let sessionUrl = params.state.sessionUrl;
  let guideUrl = params.state.guideUrl;
  const build = interpretBuildIntent({
    inboundText: params.inboundText,
    snapshot: params.snapshot,
  });

  for (const entry of CLAIM_REGISTRY) {
    if (!replyClaimsAction(replyText, entry.claim)) continue;
    const backed = entry.requiredTools.some((tool) => toolSucceeded(params.toolsExecuted, tool));
    if (backed) continue;

    if (entry.repair === "listen" && !listenUrl) {
      if (!askedForDeliverable(params.inboundText, "listen")) continue;
      const session = await createDoeDtcListenSession({ userId: params.user.id });
      listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
    } else if ((entry.repair === "profile" || entry.repair === "tracker") && !profileUrl) {
      if (!askedForPrivateAppLink(params.inboundText) && build !== "tracker") continue;
      profileUrl = buildPrivateAppLink({
        careToken: params.user.care_token,
        inboundText: params.inboundText,
        snapshot: params.snapshot,
      });
    } else if (entry.repair === "guide" && !guideUrl) {
      if (!askedForDeliverable(params.inboundText, "guide") && build !== "guide") continue;
      const match = findMatchingGuide(params.inboundText, params.snapshot?.guides);
      if (match) {
        guideUrl = doeDtcGuideUrl(params.user.care_token, { guide: match.id });
      }
    } else if (entry.repair === "session" && !sessionUrl && params.state.activeBrowserJobId) {
      if (!askedForDeliverable(params.inboundText, "session")) continue;
      sessionUrl = doeDtcSessionUrl(params.user.care_token);
    } else if (entry.repair === "invite_correction") {
      const corrected = buildInviteCorrectionReply(params.state);
      if (corrected) replyText = corrected;
    } else if (entry.repair === "schedule" && params.snapshot) {
      const repaired = await applyReminderSafetyNet({
        user: params.user,
        inboundText: params.inboundText,
        ctx: {
          user: params.user,
          inboundText: params.inboundText,
          snapshot: params.snapshot,
        },
        state: params.state,
        toolsExecuted: params.toolsExecuted,
      });
      if (repaired.applied && repaired.replyHint) {
        replyText = repaired.replyHint;
      }
    }
  }

  if (
    !profileUrl &&
    (askedForPrivateAppLink(params.inboundText) || build === "tracker") &&
    !looksLikeRefusal(replyText) &&
    /\b(i(?:'ll| will) send|sending|here'?s|on (?:its|the) way)\b/i.test(replyText)
  ) {
    profileUrl = buildPrivateAppLink({
      careToken: params.user.care_token,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
    });
  }

  if (
    !listenUrl &&
    askedForDeliverable(params.inboundText, "listen") &&
    !looksLikeRefusal(replyText) &&
    !toolSucceeded(params.toolsExecuted, "start_listen") &&
    /\b(i(?:'ll| will) send|sending|here'?s)\b/i.test(replyText)
  ) {
    const session = await createDoeDtcListenSession({ userId: params.user.id });
    listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
  }

  if (
    !guideUrl &&
    (askedForDeliverable(params.inboundText, "guide") || build === "guide") &&
    !looksLikeRefusal(replyText) &&
    /\b(i(?:'ll| will) send|sending|here'?s|on (?:its|the) way)\b/i.test(replyText)
  ) {
    const match = findMatchingGuide(params.inboundText, params.snapshot?.guides);
    if (match) {
      guideUrl = doeDtcGuideUrl(params.user.care_token, { guide: match.id });
    }
  }

  if (
    !sessionUrl &&
    params.state.activeBrowserJobId &&
    askedForDeliverable(params.inboundText, "session")
  ) {
    sessionUrl = doeDtcSessionUrl(params.user.care_token);
  }

  return { replyText, listenUrl, profileUrl, sessionUrl, guideUrl };
}

export function recordToolExecution(
  state: DoeDtcToolTurnState,
  record: DoeDtcAgentToolExecutionRecord,
): void {
  if (!state.toolsExecuted) state.toolsExecuted = [];
  state.toolsExecuted.push(record);
}

export function ensureTurnId(state: DoeDtcToolTurnState): string {
  if (!state.turnId) state.turnId = randomUUID();
  return state.turnId;
}
