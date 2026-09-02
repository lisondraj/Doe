/** Per-turn situation object — gaps the model should notice, not a feature dump. */

import {
  extractChartMentions,
  formatActionSlotsBlock,
  resolveActionSlots,
  type ActionBlocker,
  type ActionSlotResult,
} from "@/lib/doedtc/agent/action-slots";
import {
  findMatchingArtifact,
  findMatchingGuide,
  interpretBuildIntent,
  interpretDeliverableAsk,
  looksLikeChartWrite,
} from "@/lib/doedtc/agent/deliverable-policy";
import { inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import {
  householdMemberState,
  inboundLooksLikeInvite,
  inboundLooksLikeProfileWrite,
  routeHouseholdSubject,
  type HouseholdMemberLike,
} from "@/lib/doedtc/doedtc-household-policy";
import {
  extractUnownedChartItems,
  formatChartGapOfferLine,
  looksLikeIncidentalChartMention,
} from "@/lib/doedtc/agent/chart-gap";
import { isNonActionTurnMode, type TurnMode } from "@/lib/doedtc/agent/turn-mode";
import type { DoeDtcArtifactRow, DoeDtcGuideRow } from "@/lib/doedtc/doedtc-types";

export { extractChartMentions } from "@/lib/doedtc/agent/action-slots";
export type { ActionBlocker, ActionSlotResult } from "@/lib/doedtc/agent/action-slots";

export type SituationOpportunityKind =
  | "invite_pending_member"
  | "sibling_offer"
  | "build_guide"
  | "build_tracker"
  | "send_existing"
  | "chart_gap";

export type SituationOpportunity = {
  kind: SituationOpportunityKind;
  confidence: "high" | "medium";
  tool: string;
  memberName?: string;
  siblingName?: string;
  promptLine: string;
};

export type SituationBrief = {
  mentionedMembers: HouseholdMemberLike[];
  unknownNames: string[];
  actionSlots: ActionSlotResult;
  blockers: ActionBlocker[];
  opportunity: SituationOpportunity | null;
  promptBlock: string;
};

/** Secondary offers only — primary blockers come from action slots. */
function pickExtraOffer(params: {
  inboundText: string;
  viewerUserId: string;
  members: HouseholdMemberLike[];
  artifacts: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
  medications?: string[];
  conditions?: string[];
  resultTitles?: string[];
  mentioned: HouseholdMemberLike[];
  unknownNames: string[];
  pluralGroup: boolean;
  primaryBlockers: ActionBlocker[];
  turnMode?: TurnMode;
}): SituationOpportunity | null {
  const text = params.inboundText;
  if (params.turnMode && isNonActionTurnMode(params.turnMode)) {
    return null;
  }
  const blocking = params.primaryBlockers.some((row) => row.blocksPrimary);
  const gaps = extractUnownedChartItems({
    inboundText: text,
    medications: params.medications,
    conditions: params.conditions,
    artifactTitles: params.artifacts.map((row) => row.title),
    resultTitles: params.resultTitles,
    householdNames: params.members.map((row) => row.full_name),
  });
  if (
    gaps.length > 0 &&
    params.unknownNames.length === 0 &&
    !blocking &&
    !looksLikeChartWrite(text) &&
    !looksLikeIncidentalChartMention(text)
  ) {
    const gap = gaps[0]!;
    return {
      kind: "chart_gap",
      confidence: "high",
      tool: gap.tool,
      promptLine: formatChartGapOfferLine(gap),
    };
  }
  const writeOrJoin =
    inboundLooksLikeProfileWrite(text) ||
    inboundLooksLikeInvite(text) ||
    /\b(profile|chart|join)\b/i.test(text);

  const focus = params.mentioned[0];

  if (focus && writeOrJoin && householdMemberState(focus) === "pending_phone") {
    const hasInviteBlocker = params.primaryBlockers.some((row) => row.tool === "send_family_invite");
    if (!hasInviteBlocker) {
      const confirm =
        inboundAlreadyAsked(text) && inboundLooksLikeInvite(text) ? "act_now" : "confirm_once";
      return {
        kind: "invite_pending_member",
        confidence: "high",
        tool: "send_family_invite",
        memberName: focus.full_name,
        promptLine: `After the primary action, one complete offer to send ${focus.full_name} a join link (${confirm}).`,
      };
    }
  }

  const howTo =
    /\b(?:how (?:do i|to|can i)|don'?t know how|show me how|instructions?|how-?to)\b/i.test(text);
  const matchingGuide = findMatchingGuide(text, params.guides);
  if (howTo && matchingGuide) {
    return {
      kind: "send_existing",
      confidence: "high",
      tool: "send_guide_link",
      promptLine: "Matching guide exists — send_guide_link. Do not create a duplicate.",
    };
  }

  const build = interpretBuildIntent({
    inboundText: text,
    snapshot: { artifacts: params.artifacts as DoeDtcArtifactRow[], guides: params.guides as DoeDtcGuideRow[] },
  });
  if (build === "guide" && params.primaryBlockers.every((row) => row.slot !== "artifact")) {
    return {
      kind: "build_guide",
      confidence: "high",
      tool: "create_guide",
      promptLine:
        "How-to with no matching guide. list_guides first; if none match, create_guide and send the link. Ask once if they want it saved.",
    };
  }
  if (build === "tracker" && params.primaryBlockers.every((row) => row.slot !== "artifact")) {
    return {
      kind: "build_tracker",
      confidence: "high",
      tool: "create_profile_artifact",
      promptLine:
        "They want to track something with no matching tracker. create_profile_artifact, then send the link.",
    };
  }

  const ask = interpretDeliverableAsk(text);
  if (ask.has("tracker") && findMatchingArtifact(text, params.artifacts)) {
    return {
      kind: "send_existing",
      confidence: "high",
      tool: "send_profile_link",
      promptLine: "Matching tracker exists — send_profile_link (tab=trackers, artifact id). Do not create a duplicate.",
    };
  }
  if (ask.has("guide") && findMatchingGuide(text, params.guides)) {
    return {
      kind: "send_existing",
      confidence: "high",
      tool: "send_guide_link",
      promptLine: "Matching guide exists — send_guide_link. Do not create a duplicate.",
    };
  }
  if (ask.has("tracker") && !findMatchingArtifact(text, params.artifacts)) {
    return {
      kind: "build_tracker",
      confidence: "high",
      tool: "create_profile_artifact",
      promptLine: "They asked for a tracker that does not exist. create_profile_artifact, then send the link.",
    };
  }

  if (focus && writeOrJoin && householdMemberState(focus) === "pending_phone") {
    const route = routeHouseholdSubject({
      viewerUserId: params.viewerUserId,
      inboundText: text,
      action: "profile_write",
      member: focus,
    });
    if (route.offer?.tool === "send_family_invite") {
      return {
        kind: "invite_pending_member",
        confidence: "high",
        tool: "send_family_invite",
        memberName: focus.full_name,
        promptLine: route.offer.promptLine,
      };
    }
  }

  return null;
}

export function buildSituationBrief(params: {
  inboundText: string;
  viewerUserId: string;
  viewerName?: string | null;
  members: HouseholdMemberLike[];
  artifacts?: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides?: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
  medications?: string[];
  conditions?: string[];
  resultTitles?: string[];
}): SituationBrief {
  const actionSlots = resolveActionSlots({
    inboundText: params.inboundText,
    viewerUserId: params.viewerUserId,
    members: params.members,
    artifacts: params.artifacts,
    guides: params.guides,
  });

  const { mentioned, unknownNames, pluralGroup } = extractChartMentions({
    inboundText: params.inboundText,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });

  const opportunity = pickExtraOffer({
    inboundText: params.inboundText,
    viewerUserId: params.viewerUserId,
    members: params.members,
    artifacts: params.artifacts ?? [],
    guides: params.guides ?? [],
    medications: params.medications,
    conditions: params.conditions,
    resultTitles: params.resultTitles,
    mentioned,
    unknownNames,
    pluralGroup,
    primaryBlockers: actionSlots.blockers,
    turnMode: actionSlots.turnMode.mode,
  });

  const lines: string[] = [formatActionSlotsBlock(actionSlots).replace(/^Action slots \(do not recite\):\n/, "")];

  if (opportunity) {
    lines.push(`Extra offer (${opportunity.kind}): ${opportunity.promptLine}`);
    lines.push("Cap: one complete extra offer after the primary action. Never auto-text unmentioned family.");
  }

  return {
    mentionedMembers: mentioned,
    unknownNames,
    actionSlots,
    blockers: actionSlots.blockers,
    opportunity,
    promptBlock: lines.join("\n"),
  };
}

export function formatSituationBriefBlock(brief: SituationBrief): string {
  const body = brief.promptBlock.trim();
  if (!body) return "";
  return `Situation (do not recite):\n${body}`;
}
