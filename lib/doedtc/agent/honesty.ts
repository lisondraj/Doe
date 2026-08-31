import { randomUUID } from "node:crypto";

import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcAppUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import { applyReminderSafetyNet } from "@/lib/doedtc/doedtc-reminder-intent";
import { meaningfulToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const REFUSAL_PATTERN =
  /\b(can'?t|cannot|unable to|not able to|don'?t have (?:the )?(?:ability|access)|won'?t be able to)\b/i;
const SELF_HELP_PATTERN =
  /\b(you might try|try visiting|in your browser|yourself|on your (?:own|phone|device))\b/i;

const CLAIM_REGISTRY: Array<{
  id: string;
  claim: RegExp;
  requiredTools: string[];
  repair?: "profile" | "listen" | "session" | "invite_correction" | "schedule";
}> = [
  {
    id: "profile_link",
    claim: /\b(profile|dashboard|appointments?\s*page)\b/i,
    requiredTools: ["send_profile_link"],
    repair: "profile",
  },
  {
    id: "listen_link",
    claim: /\b(listen|record(?:ing)?|transcrib(?:e|ing)?)\b/i,
    requiredTools: ["start_listen"],
    repair: "listen",
  },
  {
    id: "session_link",
    claim: /\b(session|live view|watch|sandbox)\b/i,
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
    claim: /\b(?:i'?ll|i will|done —)\s+(?:text|ping|remind)\s+you\b.*\b(?:in|at)\s+\d+\s*(?:second|minute|hour)/i,
    requiredTools: ["schedule_text", "propose_scheduled_text"],
    repair: "schedule",
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
}): boolean {
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
  return claim.test(text) && /\b(link|send(?:ing)?|here'?s|will|i'?ll|on the way|in a moment)\b/i.test(text);
}

function buildInviteCorrectionReply(state: DoeDtcToolTurnState): string | null {
  const sent = state.familyInvitesSent ?? [];
  const errors = state.familyInviteErrors ?? [];
  if (sent.length === 0 && errors.length === 0) {
    return "I haven't sent any invites yet — tell me who has a phone number and I'll text them a join link.";
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
}> {
  let replyText = params.replyText;
  let listenUrl = params.state.listenUrl;
  let profileUrl = params.state.profileUrl;
  let sessionUrl = params.state.sessionUrl;

  for (const entry of CLAIM_REGISTRY) {
    if (!replyClaimsAction(replyText, entry.claim)) continue;
    const backed = entry.requiredTools.some((tool) => toolSucceeded(params.toolsExecuted, tool));
    if (backed) continue;

    if (entry.repair === "listen" && !listenUrl) {
      const session = await createDoeDtcListenSession({ userId: params.user.id });
      listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
    } else if (entry.repair === "profile" && !profileUrl) {
      profileUrl = doeDtcAppUrl(params.user.care_token);
    } else if (entry.repair === "session" && !sessionUrl && params.state.activeBrowserJobId) {
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

  const shouldSendSession =
    Boolean(params.state.activeBrowserJobId) &&
    (/\b(watch|stream|live)\b/i.test(params.inboundText) ||
      (replyClaimsAction(replyText, /\b(session|live view|watch|sandbox)\b/i) &&
        !toolSucceeded(params.toolsExecuted, "show_session")));

  if (!sessionUrl && shouldSendSession) {
    sessionUrl = doeDtcSessionUrl(params.user.care_token);
  }

  return { replyText, listenUrl, profileUrl, sessionUrl };
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
