import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcGuideUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import {
  applyDeliverablePolicyToTurnState,
  buildPrivateAppLink,
  findMatchingGuide,
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
  const snapshot = ctx.snapshot;
  const updates: Partial<DoeDtcAgentTurnResult> = {};

  for (const item of reply.send) {
    if (item === "listen" && !turnState.listenUrl) {
      if (!shouldHonorStructuredSend("listen", inboundText, toolsExecuted, snapshot)) continue;
      const session = await createDoeDtcListenSession({ userId: user.id });
      turnState.listenUrl = doeDtcListenUrl(user.care_token, session.id);
      updates.listenUrl = turnState.listenUrl;
    }
    if ((item === "profile" || item === "tracker") && !turnState.profileUrl) {
      if (
        !shouldHonorStructuredSend("profile", inboundText, toolsExecuted, snapshot) &&
        !shouldHonorStructuredSend("tracker", inboundText, toolsExecuted, snapshot)
      ) {
        continue;
      }
      turnState.profileUrl = buildPrivateAppLink({
        careToken: user.care_token,
        inboundText,
        snapshot,
      });
      updates.profileUrl = turnState.profileUrl;
    }
    if (item === "guide" && !turnState.guideUrl) {
      if (!shouldHonorStructuredSend("guide", inboundText, toolsExecuted, snapshot)) continue;
      const match = findMatchingGuide(inboundText, snapshot.guides);
      if (match) {
        turnState.guideUrl = doeDtcGuideUrl(user.care_token, { guide: match.id });
        updates.guideUrl = turnState.guideUrl;
      }
    }
    if (item === "prepare") {
      if (!shouldHonorStructuredSend("prepare", inboundText, toolsExecuted, snapshot)) continue;
      if (turnState.prepareUrl) updates.prepareUrl = turnState.prepareUrl;
    }
    if (item === "vault") {
      if (!shouldHonorStructuredSend("vault", inboundText, toolsExecuted, snapshot)) continue;
      if (turnState.vaultUrl) updates.vaultUrl = turnState.vaultUrl;
    }
    if (item === "session" && !turnState.sessionUrl && turnState.activeBrowserJobId) {
      if (!shouldHonorStructuredSend("session", inboundText, toolsExecuted, snapshot)) continue;
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
