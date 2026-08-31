import {
  getDoeDtcAgentTurn,
  startDoeDtcAgentTurnRecord,
  updateDoeDtcAgentTurnRecord,
} from "@/lib/doedtc/doedtc-agent-audit";
import {
  linqAddReaction,
  linqMarkChatRead,
  linqRemoveReaction,
  linqStartTyping,
} from "@/lib/doedtc/linq";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export const DOE_DTC_WORKING_REACTION = "👍";
export const DOE_DTC_DONE_REACTION = "✅";
export const DOE_DTC_FAILED_REACTION = "👎";
export const AGENT_TURN_TIMEOUT_MS = 240_000;
export const AGENT_TURN_FALLBACK_REPLY =
  "Something broke on my side on that one — trying again now.";

export async function beginDoeDtcTurnLifecycle(params: {
  turnId: string;
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  chatId?: string;
}): Promise<void> {
  await startDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    userId: params.user.id,
    inboundMessageId: params.inboundMessageId,
    inboundText: params.inboundText,
  });

  if (params.chatId) {
    try {
      await linqMarkChatRead(params.chatId);
      await updateDoeDtcAgentTurnRecord({
        turnId: params.turnId,
        patch: { status: "read", read_at: new Date().toISOString() },
      });
    } catch (error) {
      console.warn(
        "[doedtc] mark read failed:",
        error instanceof Error ? error.message : String(error),
      );
    }

    try {
      await linqStartTyping(params.chatId);
    } catch (error) {
      console.warn(
        "[doedtc] typing failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  if (params.inboundMessageId) {
    try {
      await linqAddReaction({
        messageId: params.inboundMessageId,
        emoji: DOE_DTC_WORKING_REACTION,
      });
      await updateDoeDtcAgentTurnRecord({
        turnId: params.turnId,
        patch: {
          status: "working",
          working_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.warn(
        "[doedtc] working reaction failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

export async function markDoeDtcTurnBrowsing(params: {
  turnId: string;
  browserJobId: string;
}): Promise<void> {
  await updateDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    patch: {
      status: "browsing",
      browser_job_id: params.browserJobId,
    },
  });
}

export async function swapDoeDtcTurnReaction(params: {
  inboundMessageId?: string | null;
  fromEmoji?: string;
  toEmoji: string;
}): Promise<void> {
  if (!params.inboundMessageId) return;
  try {
    if (params.fromEmoji) {
      await linqRemoveReaction({
        messageId: params.inboundMessageId,
        emoji: params.fromEmoji,
      });
    }
    await linqAddReaction({ messageId: params.inboundMessageId, emoji: params.toEmoji });
  } catch (error) {
    console.warn(
      "[doedtc] reaction swap failed:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

export async function completeDoeDtcTurnLifecycle(params: {
  turnId: string;
  inboundMessageId?: string;
  replyText: string;
  threadReply: boolean;
  deferFinalReaction?: boolean;
  error?: string;
  failed?: boolean;
}): Promise<void> {
  const finalReaction = params.failed ? DOE_DTC_FAILED_REACTION : DOE_DTC_DONE_REACTION;
  const status = params.failed ? "failed" : params.deferFinalReaction ? "browsing" : "done";

  if (!params.deferFinalReaction) {
    await swapDoeDtcTurnReaction({
      inboundMessageId: params.inboundMessageId,
      fromEmoji: params.failed ? undefined : DOE_DTC_WORKING_REACTION,
      toEmoji: finalReaction,
    });
  } else if (params.failed) {
    await swapDoeDtcTurnReaction({
      inboundMessageId: params.inboundMessageId,
      fromEmoji: DOE_DTC_WORKING_REACTION,
      toEmoji: DOE_DTC_FAILED_REACTION,
    });
  }

  await updateDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    patch: {
      status,
      done_at: params.deferFinalReaction && !params.failed ? undefined : new Date().toISOString(),
      reply_text: params.replyText,
      thread_reply: params.threadReply,
      final_reaction: params.deferFinalReaction && !params.failed ? undefined : finalReaction,
      error: params.error,
    },
  });
}

export async function finalizeDoeDtcTurnAfterBrowser(params: {
  turnId: string;
}): Promise<void> {
  const turn = await getDoeDtcAgentTurn(params.turnId);
  if (!turn?.inbound_message_id) return;

  await swapDoeDtcTurnReaction({
    inboundMessageId: turn.inbound_message_id,
    fromEmoji: DOE_DTC_WORKING_REACTION,
    toEmoji: DOE_DTC_DONE_REACTION,
  });

  await updateDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    patch: {
      status: "done",
      done_at: new Date().toISOString(),
      final_reaction: DOE_DTC_DONE_REACTION,
    },
  });
}

export function withAgentTurnTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Agent turn timed out.")), AGENT_TURN_TIMEOUT_MS);
    }),
  ]);
}
