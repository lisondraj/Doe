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

export type AppLinkOptions = {
  tab?: string;
  artifact?: string;
  member?: string;
};

const LINK_ASK_RE =
  /\b(send|sending|share|shared|text me|forward|dm me|link|url|open)\b/i;

const PROFILE_NOUN_RE = /\b(profile|dashboard|appointments?\s*page|my chart|my app)\b/i;
const TRACKER_NOUN_RE =
  /\b(trackers?|weight(?:\s+log|\s+tracker)?|artifact|log(?:\s+link)?)\b/i;
const LISTEN_NOUN_RE =
  /\b(listen(?:\s+link)?|record(?:ing)?\s+(?:my\s+)?(?:visit|appointment|doctor))\b/i;
const GUIDE_NOUN_RE = /\bguides?\b/i;
const PREPARE_NOUN_RE = /\b(prep(?:aration)?|visit summary)\b/i;
const SESSION_NOUN_RE = /\b(live view|watch|sandbox|session link)\b/i;
const SHARE_NOUN_RE = /\b(public(?:\s+link)?|share(?:d)?\s+link|read-?only link)\b/i;
const VAULT_NOUN_RE = /\b(vault|sign-?in link)\b/i;

export function wantsOutboundLink(text: string): boolean {
  return LINK_ASK_RE.test(text);
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
  const text = params.inboundText.toLowerCase();
  const artifacts = (params.snapshot?.artifacts ?? []).filter((row) => !row.archived_at);

  const matched = artifacts.find((row) => {
    const title = row.title.toLowerCase();
    if (!title) return false;
    if (text.includes(title)) return true;
    const firstWord = title.split(/\s+/)[0];
    return Boolean(firstWord && firstWord.length >= 4 && text.includes(firstWord));
  });

  if (matched || (TRACKER_NOUN_RE.test(params.inboundText) && wantsOutboundLink(params.inboundText))) {
    return {
      tab: "trackers",
      artifact: matched?.id,
    };
  }
  if (/\bguides?\b/i.test(params.inboundText)) return { tab: "guides" };
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
  };
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
}): void {
  const ask = interpretDeliverableAsk(params.inboundText);
  const tools = params.toolsExecuted;

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
}

export function shouldHonorStructuredSend(
  kind: DeliverableKind,
  inboundText: string,
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[],
): boolean {
  if (askedForDeliverable(inboundText, kind)) return true;
  if (kind === "profile" && askedForDeliverable(inboundText, "tracker")) return true;
  if (kind === "tracker" && askedForDeliverable(inboundText, "profile")) return true;
  if (kind === "listen" && toolSucceeded(toolsExecuted, "start_listen")) return true;
  if (kind === "session" && toolSucceeded(toolsExecuted, "show_session")) return true;
  if (kind === "share" && toolSucceeded(toolsExecuted, "share_artifact")) return true;
  if (kind === "profile" && toolSucceeded(toolsExecuted, "send_profile_link")) return true;
  if (kind === "tracker" && toolSucceeded(toolsExecuted, "send_profile_link")) return true;
  return false;
}
