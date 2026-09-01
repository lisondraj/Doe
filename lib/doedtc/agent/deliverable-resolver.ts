import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import {
  applyDeliverablePolicyToTurnState,
  buildPrivateAppLink,
  shouldHonorStructuredSend,
} from "@/lib/doedtc/agent/deliverable-policy";
import type { DoeReply } from "@/lib/doedtc/agent/types";
import type { DoeDtcRunContext } from "@/lib/doedtc/agent/types";
import type { DoeDtcAgentTurnResult } from "@/lib/doedtc/doedtc-agent";

export async function resolveDoeReplyDeliverables(params: {
  reply: DoeReply;
  ctx: DoeDtcRunContext;
}): Promise<Partial<DoeDtcAgentTurnResult>> {
  const { reply, ctx } = params;
  const { user, turnState, inboundText } = ctx;
  const toolsExecuted = turnState.toolsExecuted;
  const updates: Partial<DoeDtcAgentTurnResult> = {};

  for (const item of reply.send) {
    if (item === "listen" && !turnState.listenUrl) {
      if (!shouldHonorStructuredSend("listen", inboundText, toolsExecuted)) continue;
      const session = await createDoeDtcListenSession({ userId: user.id });
      turnState.listenUrl = doeDtcListenUrl(user.care_token, session.id);
      updates.listenUrl = turnState.listenUrl;
    }
    if ((item === "profile" || item === "tracker") && !turnState.profileUrl) {
      if (
        !shouldHonorStructuredSend("profile", inboundText, toolsExecuted) &&
        !shouldHonorStructuredSend("tracker", inboundText, toolsExecuted)
      ) {
        continue;
      }
      turnState.profileUrl = buildPrivateAppLink({
        careToken: user.care_token,
        inboundText,
        snapshot: ctx.snapshot,
      });
      updates.profileUrl = turnState.profileUrl;
    }
    if (item === "session" && !turnState.sessionUrl && turnState.activeBrowserJobId) {
      if (!shouldHonorStructuredSend("session", inboundText, toolsExecuted)) continue;
      turnState.sessionUrl = doeDtcSessionUrl(user.care_token);
      updates.sessionUrl = turnState.sessionUrl;
    }
  }

  if (reply.reaction) {
    turnState.reactionEmoji = reply.reaction.slice(0, 8);
    updates.reactionEmoji = turnState.reactionEmoji;
  }
  if (reply.threadReply) {
    turnState.replyToInbound = true;
    updates.replyToInbound = true;
  }

  return updates;
}

export function assembleTurnResult(params: {
  replyText: string;
  turnState: DoeDtcRunContext["turnState"];
  inboundText?: string;
}): DoeDtcAgentTurnResult {
  const { replyText, turnState } = params;
  if (params.inboundText) {
    applyDeliverablePolicyToTurnState({
      inboundText: params.inboundText,
      turnState,
      toolsExecuted: turnState.toolsExecuted,
    });
  }
  return {
    replyText,
    careUrl: turnState.assessmentRan ? turnState.careUrl : undefined,
    listenUrl: turnState.listenUrl,
    profileUrl: turnState.profileUrl,
    feedbackUrl: turnState.feedbackUrl,
    prepareUrl: turnState.prepareUrl,
    guideUrl: turnState.guideUrl,
    artifactShareUrl: turnState.artifactShareUrl,
    workUrl: turnState.workUrl,
    screenshotUrl: turnState.screenshotUrl,
    vaultUrl: turnState.vaultUrl,
    liveViewUrl: turnState.liveViewUrl,
    sessionUrl: turnState.sessionUrl,
    reactionEmoji: turnState.reactionEmoji,
    replyToInbound: turnState.replyToInbound,
    browserNeedsConfirm: turnState.browserNeedsConfirm,
    browserJobDispatched: turnState.browserJobDispatched,
    assessmentRan: turnState.assessmentRan,
    preservePendingOffer: turnState.preservePendingOffer,
  };
}
