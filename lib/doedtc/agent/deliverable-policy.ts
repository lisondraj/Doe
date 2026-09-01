import { doeDtcAppUrl } from "@/lib/doedtc/doedtc-copy";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

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
  /\b(send|sending|share|shared|text me|forward|dm me|link|url|open|get|give me|where(?:'?s| is)|need|show me|show)\b/i;

const PROFILE_NOUN_RE = /\b(profile|dashboard|appointments?\s*page|my chart|my app)\b/i;
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

const HOW_TO_RE =
  /\b(?:how (?:do i|to|can i)|don'?t know how|show me how|instructions?|how-?to)\b/i;
const TRACK_BUILD_RE =
  /\b(?:help me track|track my|i (?:need|want) to track|set up (?:a )?track(?:er)?|create (?:a )?track(?:er)?)\b/i;

export function wantsOutboundLink(text: string): boolean {
  return LINK_ASK_RE.test(text);
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

  if (PROFILE_NOUN_RE.test(text) && (linkish || /\b(send|share|open)\b/i.test(text))) {
    kinds.add("profile");
  }
  if (TRACKER_NOUN_RE.test(text) && linkish && !SHARE_NOUN_RE.test(text)) {
    kinds.add("tracker");
  } else if (
    TRACKER_SEND_NOUN_RE.test(text) &&
    linkish &&
    !SHARE_NOUN_RE.test(text) &&
    /\b(where(?:'?s| is)|need|show me|show|get|give me|send|share|link|url)\b/i.test(text)
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
      /\b(where(?:'?s| is)|need|show me|i need)\b/i.test(text) &&
      !findMatchingArtifact(text, params.snapshot?.artifacts));

  if (wantsTrack && !findMatchingArtifact(text, params.snapshot?.artifacts)) {
    if (HOW_TO_RE.test(text)) return "guide";
    return "tracker";
  }

  return null;
}

export function askedForPrivateAppLink(inboundText: string): boolean {
  const kinds = interpretDeliverableAsk(inboundText);
  return kinds.has("profile") || kinds.has("tracker");
}

export function askedForDeliverable(inboundText: string, kind: DeliverableKind): boolean {
  return interpretDeliverableAsk(inboundText).has(kind);
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
  if (/\bappointments?\b/i.test(params.inboundText)) return { tab: "appointments" };
  if (/\bdashboard\b/i.test(params.inboundText)) return { tab: "dashboard" };
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
    !toolSucceeded(tools, "send_profile_link") &&
    !toolSucceeded(tools, "create_profile_artifact")
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
  if (kind === "guide" && toolSucceeded(toolsExecuted, "create_guide")) return true;
  if (kind === "guide" && toolSucceeded(toolsExecuted, "send_guide_link")) return true;
  if (kind === "prepare" && toolSucceeded(toolsExecuted, "create_preparation")) return true;
  if (kind === "vault" && toolSucceeded(toolsExecuted, "request_vault")) return true;
  return false;
}
