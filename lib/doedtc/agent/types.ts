import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";
import type { DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import { z } from "zod";

export const DoeReplySchema = z.object({
  reply: z.string().describe("Plain iMessage text. No markdown, no URLs."),
  send: z
    .array(z.enum(["profile", "tracker", "listen", "guide", "prepare", "session", "vault"]))
    .default([]),
  reaction: z.string().nullable().default(null),
  threadReply: z.boolean().default(false),
});

export type DoeReply = z.infer<typeof DoeReplySchema>;

export type DoeDtcRunContext = {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  snapshot: DoeDtcProfileSnapshot;
  turnState: DoeDtcToolTurnState;
  instructions: string;
  plannerInstructions?: string;
  specialistInstructions?: Partial<
    Record<"healthRecord" | "guides" | "scheduling" | "browser", string>
  >;
};

export const DOE_DTC_TURN_RESULT_FIELDS = [
  "replyText",
  "careUrl",
  "listenUrl",
  "profileUrl",
  "feedbackUrl",
  "prepareUrl",
  "guideUrl",
  "artifactShareUrl",
  "workUrl",
  "screenshotUrl",
  "vaultUrl",
  "liveViewUrl",
  "sessionUrl",
  "reactionEmoji",
  "replyToInbound",
  "browserNeedsConfirm",
  "browserJobDispatched",
  "assessmentRan",
  "preservePendingOffer",
] as const;

export type DoeDtcAgentRuntime = "legacy" | "sdk";

export function resolveDoeDtcAgentRuntime(): DoeDtcAgentRuntime {
  const value = process.env.DOEDTC_AGENT_RUNTIME?.trim().toLowerCase();
  if (value === "legacy") return "legacy";
  return "sdk";
}

export function resolveDoeDtcAgentModel(): string {
  return process.env.DOEDTC_AGENT_MODEL?.trim() || "gpt-4o";
}
