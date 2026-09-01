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
import {
  inboundLooksComplex,
  LIFECYCLE_DONE_EMOJI,
  LIFECYCLE_FAILED_EMOJI,
  LIFECYCLE_WORKING_EMOJI,
  pickMatchingReaction,
} from "@/lib/doedtc/doedtc-reactions";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export const DOE_DTC_WORKING_REACTION = LIFECYCLE_WORKING_EMOJI;
export const DOE_DTC_DONE_REACTION = LIFECYCLE_DONE_EMOJI;
export const DOE_DTC_FAILED_REACTION = LIFECYCLE_FAILED_EMOJI;
export const AGENT_TURN_TIMEOUT_MS = 240_000;
export const WORKING_REACTION_DELAY_MS = 1_200;
export const AGENT_TURN_FALLBACK_REPLY =
  "Something broke on my side. Give that another try in a moment.";

type PendingReactionKind = "lifecycle" | "matching";

type PendingWorkingReaction = {
  cancelled: boolean;
  applied: boolean;
  applying?: Promise<void>;
  timer?: ReturnType<typeof setTimeout>;
  inboundMessageId: string;
  kind: PendingReactionKind;
  emoji: string;
};

const pendingWorkingReactions = new Map<string, PendingWorkingReaction>();

export type DoeTurnReactionAction = "none" | "ensure_working" | "swap_done" | "swap_failed" | "keep_matching";

export function resolveTurnReactionAction(params: {
  workingReactionApplied: boolean;
  matchingReactionApplied?: boolean;
  deferFinalReaction?: boolean;
  failed?: boolean;
}): DoeTurnReactionAction {
  if (params.matchingReactionApplied) return "keep_matching";
  if (params.failed) {
    return params.workingReactionApplied ? "swap_failed" : "none";
  }
  if (params.deferFinalReaction) {
    return params.workingReactionApplied ? "none" : "ensure_working";
  }
  return params.workingReactionApplied ? "swap_done" : "none";
}

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

  if (!params.inboundMessageId) return;

  const matching = pickMatchingReaction(params.inboundText);
  if (matching) {
    const pending: PendingWorkingReaction = {
      cancelled: false,
      applied: false,
      inboundMessageId: params.inboundMessageId,
      kind: "matching",
      emoji: matching,
    };
    pendingWorkingReactions.set(params.turnId, pending);
    void applyNamedReaction(params.turnId, matching);
    return;
  }

  if (!inboundLooksComplex(params.inboundText)) return;

  const pending: PendingWorkingReaction = {
    cancelled: false,
    applied: false,
    inboundMessageId: params.inboundMessageId,
    kind: "lifecycle",
    emoji: DOE_DTC_WORKING_REACTION,
    timer: setTimeout(() => {
      void applyNamedReaction(params.turnId, DOE_DTC_WORKING_REACTION);
    }, WORKING_REACTION_DELAY_MS),
  };
  pendingWorkingReactions.set(params.turnId, pending);
}

async function applyNamedReaction(turnId: string, emoji: string): Promise<void> {
  const pending = pendingWorkingReactions.get(turnId);
  if (!pending || pending.cancelled || pending.applied) return;

  pending.applying = (async () => {
    if (pending.cancelled || pending.applied) return;
    try {
      await linqAddReaction({
        messageId: pending.inboundMessageId,
        emoji,
      });
      pending.applied = true;
      pending.emoji = emoji;
      if (pending.cancelled) return;
      if (pending.kind === "lifecycle") {
        await updateDoeDtcAgentTurnRecord({
          turnId,
          patch: {
            status: "working",
            working_at: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.warn(
        "[doedtc] working reaction failed:",
        error instanceof Error ? error.message : String(error),
      );
    }
  })();
  await pending.applying;
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

async function takePendingWorkingReaction(
  turnId: string,
): Promise<PendingWorkingReaction | undefined> {
  const pending = pendingWorkingReactions.get(turnId);
  if (!pending) return undefined;
  pending.cancelled = true;
  if (pending.timer) clearTimeout(pending.timer);
  pendingWorkingReactions.delete(turnId);
  if (pending.applying) await pending.applying;
  return pending;
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
  const pending = await takePendingWorkingReaction(params.turnId);
  const matchingReactionApplied = pending?.kind === "matching" && pending.applied;
  const workingReactionApplied = pending?.kind === "lifecycle" && pending.applied;
  const action = resolveTurnReactionAction({
    workingReactionApplied,
    matchingReactionApplied,
    deferFinalReaction: params.deferFinalReaction,
    failed: params.failed,
  });

  if (action === "ensure_working" && params.inboundMessageId) {
    await swapDoeDtcTurnReaction({
      inboundMessageId: params.inboundMessageId,
      toEmoji: DOE_DTC_WORKING_REACTION,
    });
    await updateDoeDtcAgentTurnRecord({
      turnId: params.turnId,
      patch: {
        status: "working",
        working_at: new Date().toISOString(),
      },
    });
  } else if (action === "swap_done") {
    await swapDoeDtcTurnReaction({
      inboundMessageId: params.inboundMessageId,
      fromEmoji: DOE_DTC_WORKING_REACTION,
      toEmoji: DOE_DTC_DONE_REACTION,
    });
  } else if (action === "swap_failed") {
    await swapDoeDtcTurnReaction({
      inboundMessageId: params.inboundMessageId,
      fromEmoji: DOE_DTC_WORKING_REACTION,
      toEmoji: DOE_DTC_FAILED_REACTION,
    });
  }

  const finalReaction =
    action === "keep_matching"
      ? pending?.emoji
      : action === "swap_failed"
        ? DOE_DTC_FAILED_REACTION
        : action === "swap_done"
          ? DOE_DTC_DONE_REACTION
          : undefined;
  const status = params.failed ? "failed" : params.deferFinalReaction ? "browsing" : "done";

  await updateDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    patch: {
      status,
      done_at: params.deferFinalReaction && !params.failed ? undefined : new Date().toISOString(),
      reply_text: params.replyText,
      thread_reply: params.threadReply,
      final_reaction: finalReaction,
      error: params.error,
    },
  });
}

export async function finalizeDoeDtcTurnAfterBrowser(params: {
  turnId: string;
}): Promise<void> {
  const turn = await getDoeDtcAgentTurn(params.turnId);
  if (!turn?.inbound_message_id) return;

  const hadWorkingReaction = Boolean(turn.working_at);
  if (hadWorkingReaction) {
    await swapDoeDtcTurnReaction({
      inboundMessageId: turn.inbound_message_id,
      fromEmoji: DOE_DTC_WORKING_REACTION,
      toEmoji: DOE_DTC_DONE_REACTION,
    });
  }

  await updateDoeDtcAgentTurnRecord({
    turnId: params.turnId,
    patch: {
      status: "done",
      done_at: new Date().toISOString(),
      final_reaction: hadWorkingReaction ? DOE_DTC_DONE_REACTION : undefined,
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
