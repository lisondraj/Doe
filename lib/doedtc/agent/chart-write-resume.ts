import { inboundHasAttachments } from "@/lib/doedtc/agent/attachments";
import {
  assessChartWrite,
  chartWriteOriginalInbound,
  firstString,
  mergeChartWriteFollowUp,
  selectChartWriteResumeKind,
  withChartWritePendingArgs,
} from "@/lib/doedtc/agent/chart-write";
import { getDoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-db";
import {
  clearAgentPending,
  isChartWritePending,
  setAgentPending,
  type DoeDtcAgentPendingRow,
} from "@/lib/doedtc/doedtc-pending";
import { shouldDeferChartWriteForReminder } from "@/lib/doedtc/doedtc-reminder-intent";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export type ChartWriteResumeConfirm = {
  continueOriginal?: false;
  replyText: string;
  profileUrl?: string;
  assessmentRan: false;
};

export type ChartWriteResumeContinue = {
  continueOriginal: true;
  label: string;
  originalInbound: string;
  assessmentRan: false;
};

export type ChartWriteResumeResult = ChartWriteResumeConfirm | ChartWriteResumeContinue;

export function isChartWriteResumeContinue(
  result: ChartWriteResumeResult,
): result is ChartWriteResumeContinue {
  return result.continueOriginal === true;
}

export async function resumeChartWritePending(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  pending: DoeDtcAgentPendingRow;
}): Promise<ChartWriteResumeResult | null> {
  if (!isChartWritePending(params.pending)) return null;
  if (!params.inboundText.trim()) {
    await clearAgentPending(params.user.id);
    return null;
  }
  if (
    shouldDeferChartWriteForReminder({
      inboundText: params.inboundText,
      tool: params.pending.commit_tool,
    })
  ) {
    return null;
  }

  const tool = params.pending.commit_tool;
  const originalInbound =
    chartWriteOriginalInbound(params.pending.args) || params.inboundText;
  const merged = mergeChartWriteFollowUp({
    tool,
    args: params.pending.args,
    inboundText: params.inboundText,
  });
  const assessment = assessChartWrite({
    tool,
    args: merged,
    inboundText: params.inboundText,
    hasAttachments: inboundHasAttachments(params.inboundText),
  });

  if (!assessment.complete) {
    await setAgentPending({
      userId: params.user.id,
      kind: "chart_write",
      commitTool: tool,
      args: withChartWritePendingArgs(merged, originalInbound),
      summary: assessment.probe,
    });
    return { replyText: assessment.probe, assessmentRan: false };
  }

  const { createInitialToolTurnState, executeDoeDtcTool } = await import(
    "@/lib/doedtc/agent/tool-dispatch"
  );
  const snapshot = await getDoeDtcProfileSnapshot(params.user.id);
  const state = createInitialToolTurnState(null);
  const output = await executeDoeDtcTool({
    name: tool,
    args: merged,
    ctx: {
      user: params.user,
      inboundText: params.inboundText,
      snapshot,
    },
    state,
  });

  if (output.needs_more === true && typeof output.user_message === "string") {
    return { replyText: output.user_message, assessmentRan: false };
  }
  if (output.ok === false) {
    const error = typeof output.error === "string" ? output.error : "";
    return {
      replyText: error || "I couldn't add that yet. Tell me the missing details.",
      assessmentRan: false,
    };
  }

  await clearAgentPending(params.user.id);
  const label =
    firstString(output.name, output.title, output.full_name, merged.name, merged.title, merged.full_name) ||
    "that";
  if (selectChartWriteResumeKind({ originalInbound, currentInbound: params.inboundText }) === "continue") {
    return {
      continueOriginal: true,
      label,
      originalInbound,
      assessmentRan: false,
    };
  }
  return {
    replyText: `Added ${label} to your chart.`,
    profileUrl: state.profileUrl,
    assessmentRan: false,
  };
}
