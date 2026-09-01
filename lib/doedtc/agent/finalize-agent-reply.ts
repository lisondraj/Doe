import { groundReplyInCommittedState } from "@/lib/doedtc/agent/committed-state";
import { reconcileReplyClaims } from "@/lib/doedtc/agent/honesty";
import {
  shouldSkipReminderSafetyNet,
  type TurnModeResult,
} from "@/lib/doedtc/agent/turn-mode";
import {
  DEGENERATE_TURN_REPLY,
  isDegenerateTurn,
} from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcToolExecutionContext, DoeDtcToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import { applyReminderSafetyNet } from "@/lib/doedtc/doedtc-reminder-intent";
import type { DoeDtcProfileSnapshot, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export async function finalizeAgentReply(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  replyText: string;
  turnState: DoeDtcToolTurnState;
  snapshot: DoeDtcProfileSnapshot;
  turnMode: TurnModeResult;
  toolCtx?: DoeDtcToolExecutionContext;
}): Promise<{ replyText: string; degenerate: boolean }> {
  let rawReply = params.replyText.trim();

  if (!shouldSkipReminderSafetyNet(params.turnMode.mode) && params.toolCtx) {
    const safety = await applyReminderSafetyNet({
      user: params.user,
      inboundText: params.inboundText,
      ctx: params.toolCtx,
      state: params.turnState,
      toolsExecuted: params.turnState.toolsExecuted,
    });
    if (safety.applied && safety.replyHint) {
      rawReply = safety.replyHint;
    }
  }

  const reconciled = await reconcileReplyClaims({
    user: params.user,
    inboundText: params.inboundText,
    replyText: rawReply,
    state: params.turnState,
    toolsExecuted: params.turnState.toolsExecuted ?? [],
    snapshot: params.snapshot,
  });
  params.turnState.listenUrl = reconciled.listenUrl ?? params.turnState.listenUrl;
  params.turnState.profileUrl = reconciled.profileUrl ?? params.turnState.profileUrl;
  params.turnState.sessionUrl = reconciled.sessionUrl ?? params.turnState.sessionUrl;
  params.turnState.guideUrl = reconciled.guideUrl ?? params.turnState.guideUrl;
  rawReply = reconciled.replyText || rawReply;

  const grounded = await groundReplyInCommittedState({
    userId: params.user.id,
    inboundText: params.inboundText,
    replyText: rawReply,
    toolsExecuted: params.turnState.toolsExecuted,
    turnMode: params.turnMode.mode,
  });
  rawReply = grounded.replyText;

  const degenerate = isDegenerateTurn({
    replyText: rawReply,
    toolsExecuted: params.turnState.toolsExecuted,
    state: params.turnState,
  });

  const replyText = sanitizeDoeDtcReplyText(
    degenerate ? DEGENERATE_TURN_REPLY : rawReply || DEGENERATE_TURN_REPLY,
    {
      preservePendingOffer: params.turnState.preservePendingOffer,
      turnMode: params.turnMode.mode,
    },
  );

  return { replyText, degenerate: degenerate || !rawReply.trim() };
}
