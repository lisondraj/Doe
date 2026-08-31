import { createDoeDtcListenSession } from "@/lib/doedtc/doedtc-db";
import { doeDtcAppUrl, doeDtcListenUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import type { DoeReply } from "@/lib/doedtc/agent/types";
import type { DoeDtcRunContext } from "@/lib/doedtc/agent/types";
import type { DoeDtcAgentTurnResult } from "@/lib/doedtc/doedtc-agent";

export async function resolveDoeReplyDeliverables(params: {
  reply: DoeReply;
  ctx: DoeDtcRunContext;
}): Promise<Partial<DoeDtcAgentTurnResult>> {
  const { reply, ctx } = params;
  const { user, turnState } = ctx;
  const updates: Partial<DoeDtcAgentTurnResult> = {};

  for (const item of reply.send) {
    if (item === "listen" && !turnState.listenUrl) {
      const session = await createDoeDtcListenSession({ userId: user.id });
      turnState.listenUrl = doeDtcListenUrl(user.care_token, session.id);
      updates.listenUrl = turnState.listenUrl;
    }
    if (item === "profile" && !turnState.profileUrl) {
      turnState.profileUrl = doeDtcAppUrl(user.care_token);
      updates.profileUrl = turnState.profileUrl;
    }
    if (item === "session" && !turnState.sessionUrl && turnState.activeBrowserJobId) {
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
}): DoeDtcAgentTurnResult {
  const { replyText, turnState } = params;
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
    assessmentRan: turnState.assessmentRan,
    preservePendingOffer: turnState.preservePendingOffer,
  };
}
