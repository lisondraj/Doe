/** Per-turn situation object — gaps the model should notice, not a feature dump. */

import {
  findMatchingArtifact,
  findMatchingGuide,
  interpretBuildIntent,
  interpretDeliverableAsk,
} from "@/lib/doedtc/agent/deliverable-policy";
import { inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import {
  householdMemberState,
  inboundLooksLikeHabitOrReminder,
  inboundLooksLikeInvite,
  inboundLooksLikeProfileWrite,
  inferHouseholdActionKind,
  routeHouseholdSubject,
  type HouseholdMemberLike,
} from "@/lib/doedtc/doedtc-household-policy";
import { normalizeDoeDtcFamilyRelationship } from "@/lib/doedtc/doedtc-family-relationship";
import type {
  DoeDtcArtifactRow,
  DoeDtcFamilyRelationship,
  DoeDtcGender,
  DoeDtcGuideRow,
} from "@/lib/doedtc/doedtc-types";

export type SituationOpportunityKind =
  | "add_family_member"
  | "invite_pending_member"
  | "ask_phone"
  | "sibling_offer"
  | "build_guide"
  | "build_tracker"
  | "send_existing";

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
  opportunity: SituationOpportunity | null;
  promptBlock: string;
};

const NAME_STOPWORDS = new Set(
  [
    "i",
    "me",
    "my",
    "we",
    "you",
    "the",
    "a",
    "an",
    "and",
    "or",
    "to",
    "for",
    "of",
    "on",
    "in",
    "at",
    "can",
    "could",
    "please",
    "remind",
    "text",
    "send",
    "log",
    "track",
    "how",
    "where",
    "need",
    "show",
    "make",
    "sure",
    "take",
    "want",
    "help",
    "set",
    "doe",
    "today",
    "tomorrow",
    "tonight",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "ozempic",
    "metformin",
    "wegovy",
    "mounjaro",
    "appointment",
    "dentist",
    "doctor",
    "tracker",
    "weight",
    "guide",
  ].map((row) => row.toLowerCase()),
);

const REL_WORD_RE =
  /\b(?:my\s+)?(son|sons|daughter|daughters|kid|kids|child|children|wife|husband|partner|mom|dad|mother|father|brother|sister|grandma|grandpa)\b/gi;

function execAll(re: RegExp, text: string): RegExpExecArray[] {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const copy = new RegExp(re.source, flags);
  const out: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = copy.exec(text);
  while (match) {
    out.push(match);
    if (match[0] === "") copy.lastIndex += 1;
    match = copy.exec(text);
  }
  return out;
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName.trim();
}

function findMemberByName(
  members: HouseholdMemberLike[],
  name: string,
): HouseholdMemberLike | null {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;
  return (
    members.find((row) => row.full_name.trim().toLowerCase() === trimmed) ??
    members.find((row) => row.full_name.trim().toLowerCase().includes(trimmed)) ??
    null
  );
}

function wordInText(text: string, word: string): boolean {
  const trimmed = word.trim();
  if (!trimmed || trimmed.length < 2) return false;
  return new RegExp(`\\b${trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
}

function genderForRelWord(word: string): DoeDtcGender | null {
  const rel = word.toLowerCase();
  if (/^(daughter|daughters|wife|mom|mother|grandma)$/.test(rel)) return "female";
  if (/^(son|sons|husband|dad|father|grandpa)$/.test(rel)) return "male";
  return null;
}

function isPluralRel(word: string): boolean {
  return /^(kids|children|sons|daughters)$/i.test(word);
}

export function extractChartMentions(params: {
  inboundText: string;
  members: HouseholdMemberLike[];
  viewerUserId?: string;
}): { mentioned: HouseholdMemberLike[]; unknownNames: string[]; pluralGroup: boolean } {
  const text = params.inboundText.trim();
  const others = params.members.filter(
    (row) => row.user_id !== params.viewerUserId && row.role !== "admin",
  );
  const mentioned: HouseholdMemberLike[] = [];
  const seen = new Set<string>();

  const add = (member: HouseholdMemberLike | null | undefined) => {
    if (!member || seen.has(member.id)) return;
    seen.add(member.id);
    mentioned.push(member);
  };

  for (const member of others) {
    if (wordInText(text, member.full_name) || wordInText(text, firstName(member.full_name))) {
      add(member);
    }
  }

  let pluralGroup = /\b(kids|children|both|all (?:the )?kids)\b/i.test(text);

  for (const match of execAll(REL_WORD_RE, text)) {
    const word = match[1] ?? "";
    if (isPluralRel(word)) pluralGroup = true;
    const relationship = normalizeDoeDtcFamilyRelationship(word);
    if (!relationship) continue;
    const gender = genderForRelWord(word);
    const pool = others.filter((row) => row.relationship === relationship);
    const gendered = gender ? pool.filter((row) => row.gender === gender) : pool;
    const candidates = gendered.length > 0 ? gendered : pool;
    if (candidates.length === 1) add(candidates[0]);
  }

  const unknownNames: string[] = [];
  const namePatterns = [
    /\b(?:for|to|with)\s+([A-Z][a-z]{1,20})\b/g,
    /\b([A-Z][a-z]{1,20})'s\b/g,
    /\b(?:remind|text|message|tell|ping|make sure)\s+([A-Z][a-z]{1,20})\b/g,
    /\bmy\s+(?:son|daughter|kid|child|wife|husband|partner)\s+([A-Z][a-z]{1,20})\b/gi,
  ];
  for (const pattern of namePatterns) {
    for (const match of execAll(pattern, text)) {
      const raw = (match[1] ?? "").trim();
      if (!raw || NAME_STOPWORDS.has(raw.toLowerCase())) continue;
      const onChart =
        findMemberByName(params.members, raw) ??
        others.find((row) => firstName(row.full_name).toLowerCase() === raw.toLowerCase());
      if (onChart) {
        add(onChart);
        continue;
      }
      if (!unknownNames.some((name) => name.toLowerCase() === raw.toLowerCase())) {
        unknownNames.push(raw);
      }
    }
  }

  return { mentioned, unknownNames, pluralGroup };
}

function siblingOf(
  mentioned: HouseholdMemberLike,
  members: HouseholdMemberLike[],
  viewerUserId?: string,
): HouseholdMemberLike | null {
  const relationship: DoeDtcFamilyRelationship = mentioned.relationship;
  const others = members.filter(
    (row) =>
      row.id !== mentioned.id &&
      row.user_id !== viewerUserId &&
      row.relationship === relationship,
  );
  return others[0] ?? null;
}

function pickOpportunity(params: {
  inboundText: string;
  viewerUserId: string;
  members: HouseholdMemberLike[];
  artifacts: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
  mentioned: HouseholdMemberLike[];
  unknownNames: string[];
  pluralGroup: boolean;
}): SituationOpportunity | null {
  const text = params.inboundText;
  const action = inferHouseholdActionKind(text);
  const writeOrJoin =
    inboundLooksLikeProfileWrite(text) ||
    inboundLooksLikeInvite(text) ||
    /\b(profile|chart|join)\b/i.test(text);

  if (params.unknownNames.length > 0 && (action || writeOrJoin || inboundLooksLikeHabitOrReminder(text))) {
    const name = params.unknownNames[0]!;
    return {
      kind: "add_family_member",
      confidence: "high",
      tool: "log_family_member",
      memberName: name,
      promptLine: `${name} is not on the chart. One question: add them with log_family_member (ask relationship/phone only if missing). Then do the original ask.`,
    };
  }

  const focus = params.mentioned[0];
  if (focus && action === "profile_write") {
    const route = routeHouseholdSubject({
      viewerUserId: params.viewerUserId,
      inboundText: text,
      action: "profile_write",
      member: focus,
    });
    if (route.state === "pending_phone" && route.offer) {
      return {
        kind: "invite_pending_member",
        confidence: "high",
        tool: "send_family_invite",
        memberName: focus.full_name,
        promptLine: route.offer.promptLine,
      };
    }
    if (route.state === "pending_no_phone" && route.offer) {
      return {
        kind: "ask_phone",
        confidence: "high",
        tool: "update_family_member",
        memberName: focus.full_name,
        promptLine: route.offer.promptLine,
      };
    }
  }

  if (focus && writeOrJoin && householdMemberState(focus) === "pending_phone") {
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

  if (focus && writeOrJoin && householdMemberState(focus) === "pending_no_phone") {
    return {
      kind: "ask_phone",
      confidence: "high",
      tool: "update_family_member",
      memberName: focus.full_name,
      promptLine: `${focus.full_name} has not joined and has no phone. Parent-proxied log is OK. Ask for a number — do not invent SMS.`,
    };
  }

  if (
    focus &&
    !params.pluralGroup &&
    params.mentioned.length === 1 &&
    inboundLooksLikeHabitOrReminder(text)
  ) {
    const sibling = siblingOf(focus, params.members, params.viewerUserId);
    if (sibling) {
      return {
        kind: "sibling_offer",
        confidence: "high",
        tool: "none",
        memberName: focus.full_name,
        siblingName: firstName(sibling.full_name),
        promptLine: `After the ${focus.full_name} habit/reminder, at most one complete sentence: "I also have ${firstName(sibling.full_name)} on the chart — same for them?" Never auto-start a second workflow.`,
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
  if (build === "guide") {
    return {
      kind: "build_guide",
      confidence: "high",
      tool: "create_guide",
      promptLine:
        "How-to with no matching guide. list_guides first; if none match, create_guide and send the link. Ask once if they want it saved.",
    };
  }
  if (build === "tracker") {
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

  return null;
}

export function buildSituationBrief(params: {
  inboundText: string;
  viewerUserId: string;
  viewerName?: string | null;
  members: HouseholdMemberLike[];
  artifacts?: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides?: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
}): SituationBrief {
  const { mentioned, unknownNames, pluralGroup } = extractChartMentions({
    inboundText: params.inboundText,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });
  const opportunity = pickOpportunity({
    inboundText: params.inboundText,
    viewerUserId: params.viewerUserId,
    members: params.members,
    artifacts: params.artifacts ?? [],
    guides: params.guides ?? [],
    mentioned,
    unknownNames,
    pluralGroup,
  });

  const lines: string[] = [];
  if (mentioned.length > 0) {
    lines.push(
      `Named on chart: ${mentioned
        .map((row) => {
          const state = householdMemberState(row);
          const phone = row.phone ? "phone on file" : "no phone";
          return `${row.full_name} (${row.relationship}, ${state}, ${phone})`;
        })
        .join("; ")}.`,
    );
  }
  if (unknownNames.length > 0) {
    lines.push(`Named but not on chart: ${unknownNames.join(", ")}.`);
  }
  if (opportunity) {
    lines.push(`One opportunity (${opportunity.kind}): ${opportunity.promptLine}`);
    lines.push("Cap: one complete offer after the primary action. Never auto-text unmentioned family.");
  } else {
    lines.push("No extra offer this turn.");
  }

  return {
    mentionedMembers: mentioned,
    unknownNames,
    opportunity,
    promptBlock: lines.join("\n"),
  };
}

export function formatSituationBriefBlock(brief: SituationBrief): string {
  const body = brief.promptBlock.trim();
  if (!body) return "";
  return `Situation (do not recite):\n${body}`;
}
