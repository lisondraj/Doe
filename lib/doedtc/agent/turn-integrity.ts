import {
  askedForPrivateAppLink,
  interpretBuildIntent,
} from "@/lib/doedtc/agent/deliverable-policy";
import { DOEDTC_LINQ } from "@/lib/doedtc/doedtc-copy";
import { AGENT_TURN_FALLBACK_REPLY } from "@/lib/doedtc/doedtc-turn-lifecycle";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";

export const NO_OP_TOOLS = new Set([
  "react_to_message",
  "use_thread_reply",
  "read_profile",
]);

export const FILLER_REPLIES = new Set([
  "Got it.",
  "Got it",
  "All set.",
  "All set",
  AGENT_TURN_FALLBACK_REPLY,
  DOEDTC_LINQ.profileLinkIntro,
  DOEDTC_LINQ.feedbackLinkIntro,
  DOEDTC_LINQ.prepareLinkIntro,
  DOEDTC_LINQ.guideLinkIntro,
  DOEDTC_LINQ.artifactShareLinkIntro,
  DOEDTC_LINQ.listenIntro,
  DOEDTC_LINQ.careLinkIntro,
  DOEDTC_LINQ.workIntro,
  DOEDTC_LINQ.screenshotIntro,
  DOEDTC_LINQ.vaultIntro,
  DOEDTC_LINQ.liveViewIntro,
  "Sending your profile link.",
  "Here's what I found — sending a preview.",
  "Here's a screenshot of the page.",
  "Sending a secure sign-in link.",
  "Sending a Live View link so you can sign in.",
  "Sending a live session link so you can watch.",
  "Sending a Listen link to record your visit.",
  "Sending your visit prep summary.",
  "Sending your guide.",
  "Sending your shared tracker link.",
  "Reply CONFIRM to proceed, or STOP to cancel.",
]);

export const DEGENERATE_TURN_REPLY =
  "I hit a snag on that one — try again in a moment.";

export const REPEAT_TOOL_ERROR =
  "Already called this turn with the same arguments. Use the previous result and answer the user.";

export function toolCallSignature(name: string, args: Record<string, unknown>): string {
  const keys = Object.keys(args).sort();
  const normalized: Record<string, unknown> = {};
  for (const key of keys) {
    normalized[key] = args[key];
  }
  return `${name}:${JSON.stringify(normalized)}`;
}

export function isFillerReply(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (FILLER_REPLIES.has(trimmed)) return true;
  if (/^https?:\/\/\S+$/i.test(trimmed)) return true;
  return false;
}

export function meaningfulToolSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.ok && !NO_OP_TOOLS.has(row.name));
}

export function isDegenerateTurn(params: {
  replyText: string | null | undefined;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
  state?: Pick<
    DoeDtcToolTurnState,
    | "assessmentRan"
    | "browserNeedsConfirm"
    | "browserJobDispatched"
    | "profileUrl"
    | "listenUrl"
    | "guideUrl"
    | "workUrl"
    | "screenshotUrl"
    | "vaultUrl"
    | "liveViewUrl"
    | "sessionUrl"
    | "prepareUrl"
    | "feedbackUrl"
    | "artifactShareUrl"
    | "careUrl"
  >;
}): boolean {
  if (params.state?.assessmentRan) return false;
  if (params.state?.browserNeedsConfirm) return false;
  if (params.state?.browserJobDispatched) return false;
  if (meaningfulToolSucceeded(params.toolsExecuted)) return false;

  const reply = params.replyText?.trim() ?? "";
  const hasMeaningfulReply = reply.length > 0 && !isFillerReply(reply);
  const hasDeliverable = Boolean(
    params.state?.profileUrl ||
      params.state?.listenUrl ||
      params.state?.guideUrl ||
      params.state?.workUrl ||
      params.state?.screenshotUrl ||
      params.state?.vaultUrl ||
      params.state?.liveViewUrl ||
      params.state?.sessionUrl ||
      params.state?.prepareUrl ||
      params.state?.feedbackUrl ||
      params.state?.artifactShareUrl ||
      params.state?.careUrl,
  );

  if (hasMeaningfulReply) return false;
  if (hasDeliverable && hasMeaningfulReply) return false;
  return !hasMeaningfulReply;
}

export function shouldAllowProfileLink(params: {
  inboundText: string;
  state: Pick<
    DoeDtcToolTurnState,
    "assessmentRan" | "guideUrl" | "prepareUrl" | "artifactShareUrl" | "profileUrl"
  >;
  profileLinkCalls: number;
}): boolean {
  if (params.profileLinkCalls >= 1) return false;
  if (askedForPrivateAppLink(params.inboundText)) return true;
  return (
    interpretBuildIntent({ inboundText: params.inboundText }) === "tracker" &&
    Boolean(params.state.profileUrl)
  );
}

export function compactTranscriptForAgent(
  messages: Array<{ direction: string; body: string }>,
  maxMessages = 20,
): string {
  return messages
    .slice(-maxMessages)
    .filter((row) => {
      if (row.direction !== "outbound") return true;
      return !isFillerReply(row.body);
    })
    .map((row) => `${row.direction === "inbound" ? "User" : "Doe"}: ${row.body}`)
    .join("\n");
}

export function buildForcedReplySystemMessage(inboundText: string): string {
  return `You must answer the user's last message in plain iMessage text now. No tools. No profile links. Be specific and helpful. User said: "${inboundText.slice(0, 280)}".`;
}

export function schedulingToolSucceeded(
  toolsExecuted: DoeDtcAgentToolExecutionRecord[] | undefined,
): boolean {
  return (toolsExecuted ?? []).some((row) => row.ok && row.name === "schedule_text");
}
