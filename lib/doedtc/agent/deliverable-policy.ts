import { doeDtcAppUrl } from "@/lib/doedtc/doedtc-copy";
import { looksLikeIncidentalChartMention } from "@/lib/doedtc/agent/chart-gap";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

const CHART_WRITE_LINK_TOOLS = new Set([
  "add_medication",
  "add_condition",
  "log_result",
  "log_appointment",
  "log_family_member",
  "add_locker_item",
  "create_profile_artifact",
  "log_artifact_entry",
  "update_profile",
]);

function chartWriteSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.ok && CHART_WRITE_LINK_TOOLS.has(row.name));
}

function labsWriteSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.ok && row.name === "log_result");
}

function documentLabsWriteSucceeded(
  documentParse?: Record<string, unknown> | null,
): boolean {
  if (!documentParse || documentParse.auto_committed !== true) return false;
  const writes = documentParse.write_results;
  if (!Array.isArray(writes)) return false;
  return writes.some(
    (row) =>
      row &&
      typeof row === "object" &&
      (row as { tool?: string }).tool === "log_result" &&
      (row as { ok?: boolean }).ok === true,
  );
}

/** After labs land, always send the results tab. Other writes still need an explicit ask. */
export function shouldSendChartWriteLink(params: {
  inboundText: string;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
  documentParse?: Record<string, unknown> | null;
}): boolean {
  if (labsWriteSucceeded(params.toolsExecuted) || documentLabsWriteSucceeded(params.documentParse)) {
    return true;
  }
  return chartWriteSucceeded(params.toolsExecuted) && isExplicitChartWriteAsk(params.inboundText);
}

export type DeliverableKind =
  | "profile"
  | "tracker"
  | "listen"
  | "guide"
  | "prepare"
  | "session"
  | "share"
  | "vault";

export type BuildIntent = "guide" | "tracker";

export type AppLinkOptions = {
  tab?: string;
  artifact?: string;
  member?: string;
};

const LINK_ASK_RE =
  /\b(send|sending|share|shared|text me|forward|dm me|link|url|open|get|give me|where(?:'?s| is| are)|need|show me|show|go(?:\s+)?to|goto)\b/i;

const PROFILE_NOUN_RE =
  /\b(profile|dashboard|appointments?\s*page|my chart|my app|chart|labs?|lab results?|results?|bloodwork|blood\s+work|lockers?|credentials?|family(?:\s+(?:tab|page|section|link))?|conditions?(?:\s+(?:tab|page|section|link))?|feedback)\b/i;
const TRACKER_NOUN_RE =
  /\b(trackers?|weight(?:\s+log|\s+tracker)|artifact|log\s+link|(?:my\s+)?shots)\b/i;
const TRACKER_SEND_NOUN_RE =
  /\b(trackers?|weight(?:\s+log|\s+tracker)?|artifact|log\s+link|shots)\b/i;
const LISTEN_NOUN_RE =
  /\b(listen(?:\s+link)?|record(?:ing)?\s+(?:my\s+)?(?:visit|appointment|doctor))\b/i;
const GUIDE_NOUN_RE = /\b(guides?|instructions?|how-?to|how to)\b/i;
const PREPARE_NOUN_RE = /\b(prep(?:aration)?|visit summary)\b/i;
const SESSION_NOUN_RE = /\b(live view|watch|sandbox|session link)\b/i;
const SHARE_NOUN_RE = /\b(public(?:\s+link)?|share(?:d)?\s+link|read-?only link)\b/i;
const VAULT_NOUN_RE = /\b(vault|sign-?in link)\b/i;

/** Profile tabs and other in-app surfaces a user can ask to be sent. Specific before generic. */
const SENDABLE_SURFACES: Array<{ re: RegExp; noun: string }> = [
  { re: /\blockers?\b/i, noun: "lockers" },
  { re: /\b(?:credentials?|saved passwords?)\b/i, noun: "lockers" },
  { re: /\bfamily\b/i, noun: "family" },
  { re: /\bconditions?\b/i, noun: "conditions" },
  { re: /\bappointments?\b/i, noun: "appointments" },
  { re: /\btrackers?\b/i, noun: "trackers" },
  { re: /\bguides?\b/i, noun: "guides" },
  { re: /\bdashboard\b/i, noun: "dashboard" },
  { re: /\b(?:labs?|lab results?|results?|bloodwork|blood\s+work)\b/i, noun: "labs" },
  { re: /\bfeedback\b/i, noun: "feedback" },
  { re: /\blisten(?:\s+link)?\b/i, noun: "listen" },
  { re: /\b(?:chart|profile)\b/i, noun: "profile" },
];

export function extractSendableSurface(text: string): { noun: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  for (const row of SENDABLE_SURFACES) {
    if (row.re.test(trimmed)) return { noun: row.noun };
  }
  return null;
}

const SHORT_DELIVERABLE_FOLLOWUP_RE =
  /^(?:\?+|the link|send it|send that|that link|link please|please send(?: it)?)\.?$/i;

export function isShortDeliverableFollowUp(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 48) return false;
  return SHORT_DELIVERABLE_FOLLOWUP_RE.test(trimmed);
}

const SEND_FOLLOWUP_STOP = new Set([
  "can",
  "u",
  "you",
  "could",
  "would",
  "please",
  "hey",
  "ok",
  "okay",
  "send",
  "text",
  "share",
  "forward",
  "me",
  "the",
  "a",
  "an",
  "that",
  "this",
  "it",
  "there",
  "to",
  "for",
  "link",
  "url",
  "my",
  "your",
  "now",
]);

/**
 * "Can u send me link to that" / "send me the link" — a send ask that
 * points at something already in the thread, not a named new destination.
 */
export function looksLikeSendFollowUp(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 90) return false;
  if (isShortDeliverableFollowUp(trimmed)) return false;
  if (looksLikeChartWrite(trimmed)) return false;
  if (!/\b(?:send|text|share|forward)\b/i.test(trimmed)) return false;
  const linkish = /\b(?:link|url)\b/i.test(trimmed);
  const pronoun = /\b(?:that|it|this)\b/i.test(trimmed);
  if (!linkish && !pronoun) return false;
  const words = trimmed
    .split(/\s+/)
    .map((word) => word.toLowerCase().replace(/[?.!,]/g, ""))
    .filter(Boolean);
  if (words.length > 12) return false;
  const extra = words.filter((word) => !SEND_FOLLOWUP_STOP.has(word));
  const named = extractSendableSurface(trimmed);
  if (extra.length > 0 && !named) return false;
  if (extra.length > 0 && named && !pronoun) return false;
  return true;
}

function outboundLooksLikeExternalBrowse(body: string): boolean {
  return /\b(?:screenshot|from (?:the )?(?:site|page)|google search|search results?)\b/i.test(
    body,
  );
}

const HOW_TO_RE =
  /\b(?:how (?:do i|to|can i)|don'?t know how|show me how|instructions?|how-?to)\b/i;
const TRACK_BUILD_RE =
  /\b(?:help me track|track my|i (?:need|want) to track|set up (?:a )?track(?:er)?|create (?:a )?track(?:er)?)\b/i;

export function wantsOutboundLink(text: string): boolean {
  return LINK_ASK_RE.test(text);
}

/** Add/log/save to the chart — not a request to text a deep link. */
export function looksLikeChartWrite(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (
    /\b(?:add|log|save|put|record|update|remove)\b.{0,48}\b(?:to (?:my |the )?(?:chart|profile)|(?:my )?(?:chart|profile|meds?|medications?|conditions?|labs?|results?|trackers?|bloodwork))\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  if (looksLikeIncidentalChartMention(trimmed)) return false;
  if (/\b(?:i take|i(?:'m| am) (?:on|taking)|prescribed|started taking)\b/i.test(trimmed)) {
    return true;
  }
  if (/\bdiagnosed (?:with|as)\b/i.test(trimmed)) return true;
  if (
    /\b(?:my )?(?:a1c|hemoglobin|cholesterol|ldl|hdl|glucose|tsh|cbc|vitamin d)\b.{0,32}\b(?:was|is|came back|of|at)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }
  return false;
}

const EXPLICIT_FAMILY_ADD_RE =
  /\b(?:add|log|save|put|record)\b.{0,48}\b(?:(?:my |the )?(?:daughter|son|kid|child|wife|husband|partner|mom|dad|mother|father|sister|brother|family|friend)|(?:them|her|him).{0,24}(?:chart|profile))\b/i;

/** They asked to save something — not a name you noticed was missing mid-conversation. */
export function isExplicitChartWriteAsk(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (looksLikeChartWrite(trimmed)) return true;
  return EXPLICIT_FAMILY_ADD_RE.test(trimmed);
}

/** Chart write that was inferred so you could keep helping — not the ask itself. */
export function isIncidentalChartWrite(text: string): boolean {
  return Boolean(text.trim()) && !isExplicitChartWriteAsk(text);
}

export function findMatchingArtifact(
  inboundText: string,
  artifacts: Array<{ id: string; title: string; archived_at?: string | null }> | undefined,
): { id: string; title: string } | null {
  const text = inboundText.toLowerCase();
  const rows = (artifacts ?? []).filter((row) => !row.archived_at);
  const matched = rows.find((row) => {
    const title = row.title.toLowerCase();
    if (!title) return false;
    if (text.includes(title)) return true;
    const firstWord = title.split(/\s+/)[0];
    return Boolean(firstWord && firstWord.length >= 4 && text.includes(firstWord));
  });
  return matched ? { id: matched.id, title: matched.title } : null;
}

export function findMatchingGuide(
  inboundText: string,
  guides: Array<{ id: string; title: string; topic?: string | null }> | undefined,
): { id: string; title: string } | null {
  const text = inboundText.toLowerCase();
  const rows = guides ?? [];
  const matched = rows.find((row) => {
    const title = row.title.toLowerCase();
    const topic = (row.topic ?? "").toLowerCase();
    if (title && text.includes(title)) return true;
    if (topic && topic.length >= 4 && text.includes(topic)) return true;
    const firstWord = title.split(/\s+/)[0];
    return Boolean(firstWord && firstWord.length >= 4 && text.includes(firstWord));
  });
  return matched ? { id: matched.id, title: matched.title } : null;
}

export function interpretDeliverableAsk(inboundText: string): Set<DeliverableKind> {
  const text = inboundText.trim();
  const kinds = new Set<DeliverableKind>();
  if (!text) return kinds;

  const linkish = wantsOutboundLink(text);
  const chartWrite = looksLikeChartWrite(text);

  if (
    !chartWrite &&
    PROFILE_NOUN_RE.test(text) &&
    (linkish || /\b(send|share|open)\b/i.test(text))
  ) {
    kinds.add("profile");
  }
  if (!chartWrite && TRACKER_NOUN_RE.test(text) && linkish && !SHARE_NOUN_RE.test(text)) {
    kinds.add("tracker");
  } else if (
    !chartWrite &&
    TRACKER_SEND_NOUN_RE.test(text) &&
    linkish &&
    !SHARE_NOUN_RE.test(text) &&
    /\b(where(?:'?s| is| are)|need|show me|show|get|give me|send|share|link|url)\b/i.test(text)
  ) {
    kinds.add("tracker");
  }
  if (LISTEN_NOUN_RE.test(text) && (linkish || /\b(record|listen)\b/i.test(text))) {
    kinds.add("listen");
  }
  if (GUIDE_NOUN_RE.test(text) && linkish) {
    kinds.add("guide");
  }
  if (PREPARE_NOUN_RE.test(text) && linkish) {
    kinds.add("prepare");
  }
  if (SESSION_NOUN_RE.test(text) && (linkish || /\b(watch|live)\b/i.test(text))) {
    kinds.add("session");
  }
  if (SHARE_NOUN_RE.test(text)) {
    kinds.add("share");
  }
  if (VAULT_NOUN_RE.test(text) && linkish) {
    kinds.add("vault");
  }

  return kinds;
}

/**
 * How-to / don't-know-how → guide. Help-me-track / track-my with no matching
 * artifact → tracker. Existing matches are send, not build.
 */
export function interpretBuildIntent(params: {
  inboundText: string;
  snapshot?: Pick<DoeDtcProfileSnapshot, "artifacts" | "guides"> | null;
}): BuildIntent | null {
  const text = params.inboundText.trim();
  if (!text) return null;

  if (HOW_TO_RE.test(text) && !findMatchingGuide(text, params.snapshot?.guides)) {
    return "guide";
  }

  const wantsTrack =
    TRACK_BUILD_RE.test(text) ||
    (TRACKER_SEND_NOUN_RE.test(text) &&
      /\b(where(?:'?s| is| are)|need|show me|i need)\b/i.test(text) &&
      !findMatchingArtifact(text, params.snapshot?.artifacts));

  if (wantsTrack && !findMatchingArtifact(text, params.snapshot?.artifacts)) {
    if (HOW_TO_RE.test(text)) return "guide";
    return "tracker";
  }

  return null;
}

export function askedForPrivateAppLink(inboundText: string): boolean {
  if (looksLikeChartWrite(inboundText)) return false;
  const kinds = interpretDeliverableAsk(inboundText);
  return kinds.has("profile") || kinds.has("tracker");
}

/** Pull what's already on the chart — answer in iMessage, don't send a link. */
export function looksLikeChartRead(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (looksLikeChartWrite(trimmed) || askedForPrivateAppLink(trimmed)) return false;
  if (/\bare (?:these|they|this) (?:in|on) my (?:chart|profile|labs?|results?)\b/i.test(trimmed)) {
    return true;
  }
  if (
    /\b(?:lfts?|liver (?:function|panel)|a1c)\b/i.test(trimmed) &&
    /\b(?:what|which|any|my|the|were|are)\b/i.test(trimmed)
  ) {
    return true;
  }
  return /\b(?:what(?:'s| is| are| were)|which|list|do i (?:still )?have)\b.{0,48}\b(?:meds?|medications?|conditions?|labs?|results?|trackers?|on (?:my |the )?chart|in (?:my |the )?chart|on (?:my )?profile)\b/i.test(
    trimmed,
  );
}

export function askedForDeliverable(inboundText: string, kind: DeliverableKind): boolean {
  return interpretDeliverableAsk(inboundText).has(kind);
}

function priorInboundHadDeliverableAsk(body: string): boolean {
  return (
    askedForPrivateAppLink(body) ||
    askedForDeliverable(body, "listen") ||
    askedForDeliverable(body, "guide")
  );
}

const BARE_URL_RE = /^https?:\/\/\S+$/i;

export function outboundLooksLikeDeliverableSend(body: string): boolean {
  const trimmed = body.trim();
  if (!trimmed) return false;
  if (BARE_URL_RE.test(trimmed)) return true;
  if (/^sending\b/i.test(trimmed)) return true;
  return /\b(?:sent|sending|here'?s)\b.{0,48}\b(?:link|profile|tracker|guide|listen|chart)\b/i.test(
    trimmed,
  );
}

function bindSendFollowUpToSurface(body: string): string | null {
  const surface = extractSendableSurface(body);
  if (!surface) return null;
  if (surface.noun === "listen") return "send me the listen link";
  return `send me the ${surface.noun} link`;
}

/** Short follow-ups (? / send it / send me a link to that) continue the last sendable surface. */
export function resolveDeliverableInboundText(params: {
  inboundText: string;
  priorInboundBodies?: string[];
  lastOutboundBody?: string | null;
}): string {
  const trimmed = params.inboundText.trim();
  const shortFollowUp = isShortDeliverableFollowUp(trimmed);
  const sendFollowUp = looksLikeSendFollowUp(trimmed);
  if (!shortFollowUp && !sendFollowUp) return trimmed;

  const lastOutbound = params.lastOutboundBody?.trim() ?? "";
  const questionPoke = /^\?+$/.test(trimmed);
  if (
    questionPoke &&
    lastOutbound &&
    outboundLooksLikeDeliverableSend(lastOutbound)
  ) {
    return trimmed;
  }

  const prior = [...(params.priorInboundBodies ?? [])]
    .map((body) => body.trim())
    .filter(Boolean)
    .reverse();

  const bindFromOutbound =
    lastOutbound && !outboundLooksLikeExternalBrowse(lastOutbound)
      ? bindSendFollowUpToSurface(lastOutbound)
      : null;

  if (sendFollowUp) {
    if (bindFromOutbound) return bindFromOutbound;
    for (const body of prior) {
      if (body === trimmed) continue;
      const bound = bindSendFollowUpToSurface(body);
      if (bound) return bound;
      if (priorInboundHadDeliverableAsk(body)) return body;
    }
    return trimmed;
  }

  for (const body of prior) {
    if (body === trimmed) continue;
    if (priorInboundHadDeliverableAsk(body)) return body;
  }
  if (bindFromOutbound) return bindFromOutbound;
  for (const body of prior) {
    if (body === trimmed) continue;
    const bound = bindSendFollowUpToSurface(body);
    if (bound) return bound;
  }

  return trimmed;
}

export function priorInboundBodiesFromMessages(
  messages: Array<{ direction: string; body: string }>,
): string[] {
  return messages.filter((row) => row.direction === "inbound").map((row) => row.body);
}

export function lastOutboundBodyFromMessages(
  messages: Array<{ direction: string; body: string }>,
): string | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const row = messages[i];
    if (row.direction === "outbound" && row.body.trim()) return row.body;
  }
  return undefined;
}

export function inferAppLinkOptions(params: {
  inboundText: string;
  snapshot?: Pick<DoeDtcProfileSnapshot, "artifacts"> | null;
}): AppLinkOptions {
  const matched = findMatchingArtifact(params.inboundText, params.snapshot?.artifacts);

  if (matched || (TRACKER_SEND_NOUN_RE.test(params.inboundText) && wantsOutboundLink(params.inboundText))) {
    return {
      tab: "trackers",
      artifact: matched?.id,
    };
  }
  if (GUIDE_NOUN_RE.test(params.inboundText)) return { tab: "guides" };
  if (/\blockers?|credentials?|saved passwords?\b/i.test(params.inboundText)) {
    return { tab: "locker" };
  }
  if (/\bfamily\b/i.test(params.inboundText)) return { tab: "family" };
  if (/\bconditions?\b/i.test(params.inboundText)) return { tab: "conditions" };
  if (/\b(?:labs?|results?|bloodwork|blood\s+work)\b/i.test(params.inboundText)) return { tab: "results" };
  if (/\bappointments?\b/i.test(params.inboundText)) return { tab: "appointments" };
  if (/\bdashboard\b/i.test(params.inboundText)) return { tab: "dashboard" };
  if (/\bfeedback\b/i.test(params.inboundText)) return { tab: "feedback" };
  return {};
}

export function buildPrivateAppLink(params: {
  careToken: string;
  inboundText: string;
  snapshot?: Pick<DoeDtcProfileSnapshot, "artifacts"> | null;
  tab?: string;
  artifact?: string;
  member?: string;
}): string {
  const inferred = inferAppLinkOptions({
    inboundText: params.inboundText,
    snapshot: params.snapshot,
  });
  return doeDtcAppUrl(params.careToken, {
    tab: params.tab || inferred.tab,
    artifact: params.artifact || inferred.artifact,
    member: params.member,
  });
}

function toolSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
  name: string,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.name === name && row.ok);
}

/**
 * Strip leaked private app links that were not asked for and were not
 * produced by a tool whose job is to send that link.
 */
export function applyDeliverablePolicyToTurnState(params: {
  inboundText: string;
  turnState: {
    profileUrl?: string;
    listenUrl?: string;
    sessionUrl?: string;
    artifactShareUrl?: string;
    guideUrl?: string;
    prepareUrl?: string;
    vaultUrl?: string;
    documentParse?: Record<string, unknown>;
  };
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): void {
  const ask = interpretDeliverableAsk(params.inboundText);
  const tools = params.toolsExecuted;
  const build = interpretBuildIntent({ inboundText: params.inboundText });

  if (
    params.turnState.profileUrl &&
    !ask.has("profile") &&
    !ask.has("tracker") &&
    !askedForPrivateAppLink(params.inboundText) &&
    !looksLikeSendFollowUp(params.inboundText) &&
    !toolSucceeded(tools, "send_profile_link") &&
    !toolSucceeded(tools, "create_profile_artifact") &&
    !shouldSendChartWriteLink({
      inboundText: params.inboundText,
      toolsExecuted: tools,
      documentParse: params.turnState.documentParse,
    })
  ) {
    params.turnState.profileUrl = undefined;
  }

  if (
    params.turnState.listenUrl &&
    !ask.has("listen") &&
    !toolSucceeded(tools, "start_listen")
  ) {
    params.turnState.listenUrl = undefined;
  }

  if (
    params.turnState.sessionUrl &&
    !ask.has("session") &&
    !toolSucceeded(tools, "show_session")
  ) {
    params.turnState.sessionUrl = undefined;
  }

  if (
    params.turnState.artifactShareUrl &&
    !ask.has("share") &&
    !toolSucceeded(tools, "share_artifact")
  ) {
    params.turnState.artifactShareUrl = undefined;
  }

  if (
    params.turnState.guideUrl &&
    !ask.has("guide") &&
    build !== "guide" &&
    !toolSucceeded(tools, "create_guide") &&
    !toolSucceeded(tools, "send_guide_link")
  ) {
    params.turnState.guideUrl = undefined;
  }
}

export function shouldHonorStructuredSend(
  kind: DeliverableKind,
  inboundText: string,
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[],
  snapshot?: Pick<DoeDtcProfileSnapshot, "artifacts" | "guides"> | null,
): boolean {
  if (askedForDeliverable(inboundText, kind)) return true;
  if ((kind === "profile" || kind === "tracker") && looksLikeSendFollowUp(inboundText)) return true;
  const build = interpretBuildIntent({ inboundText, snapshot });
  if (kind === "profile" && askedForDeliverable(inboundText, "tracker")) return true;
  if (kind === "tracker" && askedForDeliverable(inboundText, "profile")) return true;
  if (kind === "guide" && build === "guide") return true;
  if (kind === "tracker" && build === "tracker") return true;
  if (kind === "profile" && build === "tracker") return true;
  if (kind === "listen" && toolSucceeded(toolsExecuted, "start_listen")) return true;
  if (kind === "session" && toolSucceeded(toolsExecuted, "show_session")) return true;
  if (kind === "share" && toolSucceeded(toolsExecuted, "share_artifact")) return true;
  if (kind === "profile" && toolSucceeded(toolsExecuted, "send_profile_link")) return true;
  if (kind === "tracker" && toolSucceeded(toolsExecuted, "send_profile_link")) return true;
  if (
    (kind === "profile" || kind === "tracker") &&
    shouldSendChartWriteLink({ inboundText, toolsExecuted })
  ) {
    return true;
  }
  if (kind === "guide" && toolSucceeded(toolsExecuted, "create_guide")) return true;
  if (kind === "guide" && toolSucceeded(toolsExecuted, "send_guide_link")) return true;
  if (kind === "prepare" && toolSucceeded(toolsExecuted, "create_preparation")) return true;
  if (kind === "vault" && toolSucceeded(toolsExecuted, "request_vault")) return true;
  return false;
}
