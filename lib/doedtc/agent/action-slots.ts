/** Per-turn intent + slot fill + blockers — combinatorial anticipation without case lists. */

import {
  findMatchingArtifact,
  findMatchingGuide,
  interpretBuildIntent,
  interpretDeliverableAsk,
} from "@/lib/doedtc/agent/deliverable-policy";
import { inboundAlreadyAsked } from "@/lib/doedtc/doedtc-agent-policy";
import type { DoeAgentActionClass } from "@/lib/doedtc/doedtc-agent-policy";
import { normalizeDoeDtcFamilyRelationship } from "@/lib/doedtc/doedtc-family-relationship";
import {
  householdMemberState,
  inboundLooksLikeHabitOrReminder,
  inboundLooksLikeInvite,
  inboundLooksLikeProfileWrite,
  inferHouseholdActionKind,
  routeHouseholdSubject,
  type HouseholdActionKind,
  type HouseholdMemberLike,
} from "@/lib/doedtc/doedtc-household-policy";
import { parseReminderIntent } from "@/lib/doedtc/doedtc-reminder-intent";
import type {
  DoeDtcArtifactRow,
  DoeDtcFamilyRelationship,
  DoeDtcGender,
  DoeDtcGuideRow,
} from "@/lib/doedtc/doedtc-types";

export type ActionIntent =
  | "log_appointment"
  | "schedule_text"
  | "profile_write"
  | "invite"
  | "send_or_build_tracker"
  | "send_or_build_guide"
  | "none";

export type SlotName =
  | "subject"
  | "on_chart"
  | "phone"
  | "joined"
  | "when"
  | "body"
  | "artifact"
  | "relationship";

export type ActionBlocker = {
  slot: SlotName;
  confidence: "high" | "medium";
  /** Natural language the model should weave into the reply (do not recite verbatim). */
  userFacing: string;
  /** Internal steering for tools and sequencing. */
  promptLine: string;
  tool?: string;
  blocksPrimary: boolean;
};

export type ActionSlotResult = {
  intent: ActionIntent;
  householdAction: HouseholdActionKind | null;
  subjectName: string | null;
  subjectMember: HouseholdMemberLike | null;
  mentionedMembers: HouseholdMemberLike[];
  unknownNames: string[];
  blockers: ActionBlocker[];
  missingSlot: boolean;
  actionClass: DoeAgentActionClass;
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
    "book",
    "schedule",
  ].map((row) => row.toLowerCase()),
);

const REL_WORD_RE =
  /\b(?:my\s+)?(son|sons|daughter|daughters|kid|kids|child|children|wife|husband|partner|mom|dad|mother|father|brother|sister|grandma|grandpa)\b/gi;

const BOOK_APPOINTMENT_RE =
  /\b(?:book|schedule|log|add)\b.{0,32}\b(?:appointment|dentist|doctor(?:'s)?(?:\s+visit)?|checkup|check-up|visit)\b/i;

const WHEN_HINT_RE =
  /\b(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next (?:week|month|tuesday|monday|wednesday|thursday|friday|saturday|sunday)|in \d+ (?:days?|weeks?)|at \d|\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i;

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

function capitalizeName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
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
    members.find((row) => firstName(row.full_name).toLowerCase() === trimmed) ??
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
    /\b(?:for|to|with)\s+([A-Za-z][a-z]{1,20})\b/gi,
    /\b([A-Za-z][a-z]{1,20})'s\b/g,
    /\b(?:remind|text|message|tell|ping|make sure|book|log|schedule)\s+([A-Za-z][a-z]{1,20})\b/gi,
    /\b(?:book|log|schedule)\s+([A-Za-z][a-z]{1,20})\s+(?:an?\s+)?(?:appointment|dentist|doctor|visit)\b/gi,
    /\bmy\s+(?:son|daughter|kid|child|wife|husband|partner)\s+([A-Za-z][a-z]{1,20})\b/gi,
  ];
  for (const pattern of namePatterns) {
    for (const match of execAll(pattern, text)) {
      const raw = (match[1] ?? "").trim();
      if (!raw || NAME_STOPWORDS.has(raw.toLowerCase())) continue;
      const display = capitalizeName(raw);
      const onChart =
        findMemberByName(params.members, raw) ??
        others.find((row) => firstName(row.full_name).toLowerCase() === raw.toLowerCase());
      if (onChart) {
        add(onChart);
        continue;
      }
      if (!unknownNames.some((name) => name.toLowerCase() === display.toLowerCase())) {
        unknownNames.push(display);
      }
    }
  }

  return { mentioned, unknownNames, pluralGroup };
}

export function inferPrimaryIntent(params: {
  inboundText: string;
  artifacts?: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides?: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
}): ActionIntent {
  const text = params.inboundText.trim();
  if (!text) return "none";

  if (inboundLooksLikeInvite(text)) return "invite";

  if (BOOK_APPOINTMENT_RE.test(text) || /\blog(?:ged)?\s+.+'s\s+(?:dentist|doctor|appointment)/i.test(text)) {
    return "log_appointment";
  }

  const reminder = parseReminderIntent(text);
  if (reminder.matched || inboundLooksLikeHabitOrReminder(text)) {
    return "schedule_text";
  }

  const build = interpretBuildIntent({
    inboundText: text,
    snapshot: {
      artifacts: (params.artifacts ?? []) as DoeDtcArtifactRow[],
      guides: (params.guides ?? []) as DoeDtcGuideRow[],
    },
  });
  if (build === "guide") return "send_or_build_guide";
  if (build === "tracker") return "send_or_build_tracker";

  const ask = interpretDeliverableAsk(text);
  if (ask.has("tracker")) return "send_or_build_tracker";
  if (ask.has("guide")) return "send_or_build_guide";

  if (inboundLooksLikeProfileWrite(text)) return "profile_write";

  return "none";
}

function householdActionForIntent(intent: ActionIntent): HouseholdActionKind | null {
  if (intent === "invite") return "invite";
  if (intent === "log_appointment" || intent === "profile_write") return "profile_write";
  if (intent === "schedule_text") return "remind_habit";
  return null;
}

function intentNeedsSubject(intent: ActionIntent): boolean {
  return (
    intent === "log_appointment" ||
    intent === "schedule_text" ||
    intent === "profile_write" ||
    intent === "invite"
  );
}

function intentNeedsWhen(intent: ActionIntent): boolean {
  return intent === "log_appointment" || intent === "schedule_text";
}

function intentNeedsPhone(intent: ActionIntent, householdAction: HouseholdActionKind | null): boolean {
  if (intent === "schedule_text" || householdAction === "remind_habit") return true;
  if (intent === "invite") return true;
  return false;
}

function buildUnknownSubjectBlockers(params: {
  name: string;
  intent: ActionIntent;
  householdAction: HouseholdActionKind | null;
}): ActionBlocker[] {
  const { name, intent, householdAction } = params;
  const blockers: ActionBlocker[] = [
    {
      slot: "on_chart",
      confidence: "high",
      userFacing: `${name} isn't on the household yet`,
      promptLine: `${name} is not on the chart. Add them with log_family_member (ask relationship/phone only if missing), then do the original ask.`,
      tool: "log_family_member",
      blocksPrimary: true,
    },
  ];

  if (intentNeedsPhone(intent, householdAction)) {
    blockers.push({
      slot: "phone",
      confidence: "high",
      userFacing: `I don't have a number for ${name}`,
      promptLine: `No phone for ${name}. Ask for a number if they should get texts — do not invent SMS.`,
      tool: "update_family_member",
      blocksPrimary: householdAction === "remind_habit" || intent === "invite",
    });
  } else if (intent === "log_appointment" || intent === "profile_write") {
    blockers.push({
      slot: "phone",
      confidence: "medium",
      userFacing: `I don't have a number for ${name} yet`,
      promptLine: `After adding ${name}, parent-proxied log is OK. Ask for a phone number if they should get their own Doe.`,
      tool: "update_family_member",
      blocksPrimary: false,
    });
  }

  return blockers;
}

function buildKnownSubjectBlockers(params: {
  member: HouseholdMemberLike;
  intent: ActionIntent;
  householdAction: HouseholdActionKind;
  inboundText: string;
  viewerUserId: string;
}): ActionBlocker[] {
  const route = routeHouseholdSubject({
    viewerUserId: params.viewerUserId,
    inboundText: params.inboundText,
    action: params.householdAction,
    member: params.member,
  });
  const name = params.member.full_name;
  const state = householdMemberState(params.member);
  const blockers: ActionBlocker[] = [];

  if (state === "pending_no_phone") {
    blockers.push({
      slot: "phone",
      confidence: "high",
      userFacing: `${name} isn't joined yet and I don't have a number`,
      promptLine: route.offer?.promptLine ?? route.nextStep,
      tool: "update_family_member",
      blocksPrimary: params.householdAction === "remind_habit" || params.intent === "invite",
    });
  }

  if (state === "pending_phone" && params.householdAction === "profile_write") {
    blockers.push({
      slot: "joined",
      confidence: "medium",
      userFacing: `${name} hasn't joined Doe yet`,
      promptLine: route.nextStep,
      tool: route.primaryTool,
      blocksPrimary: false,
    });
  }

  if (state === "unknown") {
    blockers.push({
      slot: "on_chart",
      confidence: "high",
      userFacing: `${name} isn't on the household yet`,
      promptLine: route.nextStep,
      tool: "log_family_member",
      blocksPrimary: true,
    });
  }

  return blockers;
}

function buildWhenBlocker(intent: ActionIntent, inboundText: string): ActionBlocker | null {
  if (!intentNeedsWhen(intent)) return null;
  if (WHEN_HINT_RE.test(inboundText)) return null;

  if (intent === "schedule_text") {
    const reminder = parseReminderIntent(inboundText);
    if (reminder.matched && reminder.sendAtPhrase) return null;
    return {
      slot: "when",
      confidence: "high",
      userFacing: "I need a time for that",
      promptLine: "When should this fire? Ask one short question if no reasonable default.",
      blocksPrimary: true,
    };
  }

  if (intent === "log_appointment") {
    return {
      slot: "when",
      confidence: "medium",
      userFacing: "I don't have a date or time yet",
      promptLine:
        "No date/time in the ask. log_appointment with timing_note for vague wording — ask once only if truly blank.",
      blocksPrimary: false,
    };
  }

  return null;
}

function buildBodyBlocker(inboundText: string): ActionBlocker | null {
  const reminder = parseReminderIntent(inboundText);
  if (!reminder.matched || reminder.missingSlot !== "body") return null;
  return {
    slot: "body",
    confidence: "high",
    userFacing: "I need to know what the reminder should say",
    promptLine: "Ask exactly one short question for the reminder body. Do not schedule yet.",
    blocksPrimary: true,
  };
}

function buildArtifactBlockers(params: {
  intent: ActionIntent;
  inboundText: string;
  artifacts: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
}): ActionBlocker[] {
  if (params.intent === "send_or_build_tracker") {
    const match = findMatchingArtifact(params.inboundText, params.artifacts);
    if (!match) {
      return [
        {
          slot: "artifact",
          confidence: "high",
          userFacing: "You don't have a tracker for that yet",
          promptLine: "No matching tracker — create_profile_artifact, then send the link.",
          tool: "create_profile_artifact",
          blocksPrimary: false,
        },
      ];
    }
  }
  if (params.intent === "send_or_build_guide") {
    const howTo =
      /\b(?:how (?:do i|to|can i)|don'?t know how|show me how|instructions?|how-?to)\b/i.test(
        params.inboundText,
      );
    const match = findMatchingGuide(params.inboundText, params.guides);
    if (howTo && !match) {
      return [
        {
          slot: "artifact",
          confidence: "high",
          userFacing: "I don't have a guide for that yet",
          promptLine: "list_guides first; if none match, create_guide and send the link.",
          tool: "create_guide",
          blocksPrimary: false,
        },
      ];
    }
  }
  return [];
}

function deriveActionClass(params: {
  inboundText: string;
  blockers: ActionBlocker[];
  intent: ActionIntent;
}): DoeAgentActionClass {
  const blocking = params.blockers.some((row) => row.blocksPrimary);
  if (blocking) return "confirm_once";
  if (params.blockers.some((row) => row.slot === "body" || row.slot === "when")) {
    return "confirm_once";
  }
  if (inboundAlreadyAsked(params.inboundText) && params.intent !== "none") {
    return "act_now";
  }
  if (params.intent === "invite" && !inboundLooksLikeInvite(params.inboundText)) {
    return "confirm_once";
  }
  return "act_now";
}

function formatBlockersPromptBlock(params: {
  intent: ActionIntent;
  subjectName: string | null;
  mentioned: HouseholdMemberLike[];
  unknownNames: string[];
  blockers: ActionBlocker[];
  actionClass: DoeAgentActionClass;
}): string {
  const lines: string[] = [];

  if (params.intent !== "none") {
    lines.push(`Primary intent: ${params.intent}.`);
  }

  if (params.mentioned.length > 0) {
    lines.push(
      `Named on chart: ${params.mentioned
        .map((row) => {
          const state = householdMemberState(row);
          const phone = row.phone ? "phone on file" : "no phone";
          return `${row.full_name} (${row.relationship}, ${state}, ${phone})`;
        })
        .join("; ")}.`,
    );
  }
  if (params.unknownNames.length > 0) {
    lines.push(`Named but not on chart: ${params.unknownNames.join(", ")}.`);
  }

  if (params.blockers.length > 0) {
    lines.push("Blockers (name each in one finished sentence — do not recite this list):");
    for (const blocker of params.blockers) {
      lines.push(
        `- [${blocker.slot}] ${blocker.userFacing}. ${blocker.promptLine}${blocker.tool ? ` Tool: ${blocker.tool}.` : ""}`,
      );
    }
    lines.push(
      "Say the high-confidence blockers naturally before acting or asking once. Never claim the primary action is done while a blocking slot is open.",
    );
  } else if (params.intent !== "none") {
    lines.push("No blockers for the primary intent — act with commit tools.");
  }

  lines.push(`Action class: ${params.actionClass}.`);
  return lines.join("\n");
}

export function resolveActionSlots(params: {
  inboundText: string;
  viewerUserId: string;
  members: HouseholdMemberLike[];
  artifacts?: Array<Pick<DoeDtcArtifactRow, "id" | "title" | "archived_at">>;
  guides?: Array<Pick<DoeDtcGuideRow, "id" | "title" | "topic">>;
}): ActionSlotResult {
  const artifacts = params.artifacts ?? [];
  const guides = params.guides ?? [];
  const intent = inferPrimaryIntent({
    inboundText: params.inboundText,
    artifacts,
    guides,
  });

  const { mentioned, unknownNames } = extractChartMentions({
    inboundText: params.inboundText,
    members: params.members,
    viewerUserId: params.viewerUserId,
  });

  const householdAction = householdActionForIntent(intent);
  const subjectMember = mentioned[0] ?? null;
  const subjectName =
    subjectMember?.full_name ?? unknownNames[0] ?? (intentNeedsSubject(intent) ? null : null);

  const blockers: ActionBlocker[] = [];

  const bodyBlocker = buildBodyBlocker(params.inboundText);
  if (bodyBlocker) blockers.push(bodyBlocker);

  if (intentNeedsSubject(intent) && householdAction) {
    if (unknownNames.length > 0 && !subjectMember) {
      blockers.push(
        ...buildUnknownSubjectBlockers({
          name: unknownNames[0]!,
          intent,
          householdAction,
        }),
      );
    } else if (subjectMember) {
      blockers.push(
        ...buildKnownSubjectBlockers({
          member: subjectMember,
          intent,
          householdAction,
          inboundText: params.inboundText,
          viewerUserId: params.viewerUserId,
        }),
      );
    }
  }

  const whenBlocker = buildWhenBlocker(intent, params.inboundText);
  if (whenBlocker) blockers.push(whenBlocker);

  blockers.push(
    ...buildArtifactBlockers({
      intent,
      inboundText: params.inboundText,
      artifacts,
      guides,
    }),
  );

  const missingSlot = blockers.some(
    (row) => row.blocksPrimary || row.slot === "body" || row.slot === "when",
  );
  const actionClass = deriveActionClass({
    inboundText: params.inboundText,
    blockers,
    intent,
  });

  const promptBlock = formatBlockersPromptBlock({
    intent,
    subjectName: subjectName ?? unknownNames[0] ?? subjectMember?.full_name ?? null,
    mentioned,
    unknownNames,
    blockers,
    actionClass,
  });

  return {
    intent,
    householdAction,
    subjectName: subjectName ?? unknownNames[0] ?? subjectMember?.full_name ?? null,
    subjectMember,
    mentionedMembers: mentioned,
    unknownNames,
    blockers,
    missingSlot,
    actionClass,
    promptBlock,
  };
}

export function formatActionSlotsBlock(result: ActionSlotResult): string {
  const body = result.promptBlock.trim();
  if (!body) return "";
  return `Action slots (do not recite):\n${body}`;
}
