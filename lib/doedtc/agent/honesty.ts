import { randomUUID } from "node:crypto";

import { askedAboutActiveWork, looksLikeDeferredWorkClaim } from "@/lib/doedtc/agent/active-work";
import {
  attachChartSectionLink,
  isChartWriteLinkTool,
} from "@/lib/doedtc/agent/chart-write";
import {
  askedForDeliverable,
  askedForPrivateAppLink,
  buildPrivateAppLink,
  extractSendableSurface,
  findMatchingGuide,
  inferAppLinkOptions,
  interpretBuildIntent,
  looksLikeChartRead,
  looksLikeChartWrite,
  looksLikeSendFollowUp,
  shouldSendChartWriteLink,
} from "@/lib/doedtc/agent/deliverable-policy";
import { inboundHasAttachments } from "@/lib/doedtc/agent/attachments";
import { looksLikeBrowseAsk } from "@/lib/doedtc/doedtc-browser-allowlist";
import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcGuideUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import { applyReminderSafetyNet } from "@/lib/doedtc/doedtc-reminder-intent";
import { meaningfulToolSucceeded } from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

const REFUSAL_PATTERN =
  /\b(can'?t|cannot|unable to|not able to|wasn'?t able to|couldn'?t (?:complete|read|open|see|parse)|can'?t read|don'?t have (?:the )?(?:ability|access)|won'?t be able to|without specific (?:details|information)|need (?:a |the )?(?:specific )?(?:url|page|link))\b/i;
const SELF_HELP_PATTERN =
  /\b(you might try|try visiting|in your browser|yourself|on your (?:own|phone|device))\b/i;

export const SCHEDULED_TEXT_CLAIM =
  /\b(?:i(?:'ve| have) set.{0,40}reminder|(?:i(?:'ll| will)|done[.—])\s+(?:text|ping|remind)\s+you\b)/i;

const CLAIM_REGISTRY: Array<{
  id: string;
  claim: RegExp;
  requiredTools: string[];
    repair?:
      | "profile"
      | "tracker"
      | "listen"
      | "session"
      | "guide"
      | "invite_correction"
      | "schedule"
      | "false_write"
      | "dont_ask_title";
    writeClaim?: boolean;
}> = [
  {
    id: "profile_link",
    claim:
      /\b(?:send(?:ing)?|sent|here'?s|share|i(?:'ve| have) sent)\b.{0,80}\b(?:link|url|profile|dashboard|appointments?\s*page|locker|chart|trackers?)\b|\b(?:profile|dashboard|appointments?\s*page|locker|chart)\b.{0,24}\b(?:link|url)\b|\b(?:the )?(?:link|url) (?:to|for) (?:your |the )?(?:profile|dashboard|locker|chart|trackers?|labs?|results?|family|conditions?)\b/i,
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
    claim:
      /\b(?:i(?:'ve| have) logged|i logged|logged your|saved (?:your|the|these))\b.{0,72}\b(?:a1c|lab|result|results|bloodwork|cbc|glucose|cholesterol|liver|lft|panel)\b/i,
    requiredTools: ["log_result"],
    repair: "false_write",
    writeClaim: true,
  },
  {
    id: "asked_for_result_title",
    claim:
      /\b(?:i need|need the|could you share|share that with me)\b.{0,40}\b(?:title and date|title)\b|\btitle and date for (?:these|this|the)\b/i,
    requiredTools: [],
    repair: "dont_ask_title",
    writeClaim: true,
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
  inboundText?: string;
}): boolean {
  if (params.turnMode === "crisis" || params.turnMode === "distress") {
    return false;
  }
  if (meaningfulToolSucceeded(params.toolsExecuted)) return false;

  const inbound = params.inboundText?.trim() ?? "";
  if (
    inbound &&
    (askedForPrivateAppLink(inbound) ||
      askedForDeliverable(inbound, "listen") ||
      askedForDeliverable(inbound, "guide") ||
      looksLikeChartWrite(inbound) ||
      looksLikeChartRead(inbound) ||
      looksLikeBrowseAsk(inbound) ||
      inboundHasAttachments(inbound))
  ) {
    return true;
  }

  if (looksLikeDeferredWorkClaim(params.replyText)) {
    if (askedAboutActiveWork(inbound)) return looksLikeRefusal(params.replyText);
    return true;
  }

  return looksLikeRefusal(params.replyText);
}

export function buildRefusalRetrySystemMessage(inboundText: string): string {
  return `You refused, stalled, or said you were working on it / would send later without starting a tool. The user asked: "${inboundText.slice(0, 280)}". Call the matching tool now (parse_document, start_browser_task, schedule_text, send_family_invite, read_profile, etc.). If they sent a file, parse_document first. Save only when the name on the page is the user or someone on the household. Do not promise a later send unless a tool already started. Only refuse after a tool actually failed.`;
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
    /\b(link|url|send(?:ing)?|sent|here'?s|on the way|in a moment|text you|remind you)\b/i.test(text)
  );
}

/** Model said the link already went out — the URL still has to be attached. */
export function looksLikeSentLinkClaim(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:screenshot|photo|picture|image)\b/i.test(trimmed) &&
    !/\b(?:link|url|profile|tracker|guide|listen|locker|chart)\b/i.test(trimmed)
  ) {
    return false;
  }
  return (
    /\b(?:i(?:'ve| have) sent|i sent|just sent|sent you)\b.{0,100}\b(?:link|url|profile|dashboard|tracker|guide|listen|locker|chart|tab)\b/i.test(
      trimmed,
    ) ||
    /\bsending(?: you)?(?: the| that| this)?(?: link| url)\b/i.test(trimmed) ||
    /\b(?:here'?s|here is)\b.{0,48}\b(?:the )?(?:link|url)\b/i.test(trimmed)
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
  if (params.state.chartWriteProbe) {
    return {
      replyText: params.state.chartWriteProbe,
      listenUrl,
      profileUrl: undefined,
      sessionUrl,
      guideUrl,
    };
  }
  const build = interpretBuildIntent({
    inboundText: params.inboundText,
    snapshot: params.snapshot,
  });

  for (const entry of CLAIM_REGISTRY) {
    const claimed = entry.writeClaim
      ? entry.claim.test(replyText)
      : replyClaimsAction(replyText, entry.claim);
    if (!claimed) continue;
    const parseSaved =
      entry.id === "result_logged" &&
      params.state.documentParse?.auto_committed === true &&
      Array.isArray(params.state.documentParse.write_results) &&
      params.state.documentParse.write_results.some(
        (row) => row && typeof row === "object" && (row as { ok?: boolean }).ok === true,
      );
    const backed =
      entry.requiredTools.some((tool) => toolSucceeded(params.toolsExecuted, tool)) || parseSaved;
    if (backed) continue;

    if (entry.repair === "listen" && !listenUrl) {
      if (!askedForDeliverable(params.inboundText, "listen")) continue;
      const session = await createDoeDtcListenSession({ userId: params.user.id });
      listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
    } else if ((entry.repair === "profile" || entry.repair === "tracker") && !profileUrl) {
      if (
        !askedForPrivateAppLink(params.inboundText) &&
        !looksLikeSendFollowUp(params.inboundText) &&
        !extractSendableSurface(replyText) &&
        build !== "tracker"
      ) {
        continue;
      }
      const inboundOpts = inferAppLinkOptions({
        inboundText: params.inboundText,
        snapshot: params.snapshot,
      });
      const replyOpts = inferAppLinkOptions({
        inboundText: replyText,
        snapshot: params.snapshot,
      });
      profileUrl = buildPrivateAppLink({
        careToken: params.user.care_token,
        inboundText: params.inboundText,
        snapshot: params.snapshot,
        tab: inboundOpts.tab || replyOpts.tab,
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
    } else if (entry.repair === "false_write") {
      replyText = "Those results are not on your chart yet. Say log them again and I'll save what I read.";
    } else if (entry.repair === "dont_ask_title") {
      replyText =
        "I already have the test from the photo. You don't need to give me a title. That's the test name, not your name.";
    }
  }

  if (
    !profileUrl &&
    (askedForPrivateAppLink(params.inboundText) || build === "tracker") &&
    !toolSucceeded(params.toolsExecuted, "send_profile_link")
  ) {
    profileUrl = buildPrivateAppLink({
      careToken: params.user.care_token,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
    });
  }

  if (
    !profileUrl &&
    looksLikeSentLinkClaim(replyText) &&
    (askedForPrivateAppLink(params.inboundText) ||
      looksLikeSendFollowUp(params.inboundText) ||
      Boolean(extractSendableSurface(replyText)))
  ) {
    const inboundOpts = inferAppLinkOptions({
      inboundText: params.inboundText,
      snapshot: params.snapshot,
    });
    const replyOpts = inferAppLinkOptions({
      inboundText: replyText,
      snapshot: params.snapshot,
    });
    profileUrl = buildPrivateAppLink({
      careToken: params.user.care_token,
      inboundText: params.inboundText,
      snapshot: params.snapshot,
      tab: inboundOpts.tab || replyOpts.tab,
    });
  }

  if (
    !profileUrl &&
    shouldSendChartWriteLink({
      inboundText: params.inboundText,
      toolsExecuted: params.toolsExecuted,
      documentParse: params.state.documentParse,
    })
  ) {
    const write = params.toolsExecuted.find(
      (row) => row.ok && isChartWriteLinkTool(row.name),
    );
    profileUrl = attachChartSectionLink({
      careToken: params.user.care_token,
      tool: write?.name ?? "log_result",
    });
  }

  if (
    !listenUrl &&
    askedForDeliverable(params.inboundText, "listen") &&
    !toolSucceeded(params.toolsExecuted, "start_listen")
  ) {
    const session = await createDoeDtcListenSession({ userId: params.user.id });
    listenUrl = doeDtcListenUrl(params.user.care_token, session.id);
  }

  if (
    !guideUrl &&
    (askedForDeliverable(params.inboundText, "guide") || build === "guide") &&
    !toolSucceeded(params.toolsExecuted, "create_guide") &&
    !toolSucceeded(params.toolsExecuted, "send_guide_link")
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
