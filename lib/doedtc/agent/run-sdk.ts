import { run, RunState } from "@openai/agents";
import type { Agent } from "@openai/agents";

import { getActiveDoeDtcBrowserJobId } from "@/lib/doedtc/doedtc-browser";
import {
  assembleTurnResult,
  resolveDoeReplyDeliverables,
} from "@/lib/doedtc/agent/deliverable-resolver";
import { createInitialToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import { createDoeSpecialistAgents } from "@/lib/doedtc/agent/specialists";
import {
  compactTranscriptForAgent,
  DEGENERATE_TURN_REPLY,
  isDegenerateTurn,
} from "@/lib/doedtc/agent/turn-integrity";
import { DoeReplySchema, type DoeDtcRunContext, type DoeReply } from "@/lib/doedtc/agent/types";
import {
  buildDoeDtcAgentSystemPrompt,
  type DoeDtcAgentTurnResult,
} from "@/lib/doedtc/doedtc-agent";
import { executeAgentPendingCommit } from "@/lib/doedtc/doedtc-agent-commit";
import {
  addDoeDtcMem0PlaybookNote,
  formatMem0Block,
  searchDoeDtcMem0Memories,
  searchDoeDtcMem0Playbook,
} from "@/lib/doedtc/doedtc-memory";
import {
  applyReminderSafetyNet,
  buildAwaitingBodyCommitArgs,
  buildReminderClarifyingQuestion,
  buildReminderIntentDirective,
  isAwaitingBodyPending,
  parseReminderIntent,
  storeAwaitingBodyReminderPending,
} from "@/lib/doedtc/doedtc-reminder-intent";
import {
  clearAgentPending,
  extractRunStateSerialized,
  formatAgentPendingForPrompt,
  getAgentPending,
  isCommitPending,
  isRunStatePending,
  parseAffirmation,
  parseDecline,
  setAgentPending,
  type DoeDtcAgentPendingRow,
} from "@/lib/doedtc/doedtc-pending";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
import { createDoeDtcAgentTurnId } from "@/lib/doedtc/doedtc-agent-audit";
import {
  formatAccountabilityForAgent,
} from "@/lib/doedtc/doedtc-accountability";
import { formatHouseholdForAgent } from "@/lib/doedtc/doedtc-household";
import { formatGuideForAgent } from "@/lib/doedtc/doedtc-guides";
import {
  agentNowLabel,
  formatScheduledTextForAgent,
  normalizeScheduledTimezone,
} from "@/lib/doedtc/doedtc-scheduled";
import { formatWorkflowsForAgent, listActiveWorkflowsForUser } from "@/lib/doedtc/doedtc-workflows";
import {
  formatDoeDtcProfileOverview,
} from "@/lib/doedtc/doedtc-profile-read";
import {
  getDoeDtcProfileSnapshot,
  listDoeDtcMessages,
} from "@/lib/doedtc/doedtc-db";
import { listGuidesForUser } from "@/lib/doedtc/doedtc-guides-db";
import type { DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

function compactTranscript(messages: Awaited<ReturnType<typeof listDoeDtcMessages>>): string {
  return compactTranscriptForAgent(messages, 20);
}

function formatSymptomLog(
  symptoms: Awaited<ReturnType<typeof getDoeDtcProfileSnapshot>>["symptoms"],
): string {
  if (symptoms.length === 0) return "None yet.";
  return symptoms
    .slice(0, 8)
    .map((row) => `- ${row.summary ?? row.raw_text} (${row.severity})`)
    .join("\n");
}

function formatAssessmentHistory(
  assessments: Awaited<ReturnType<typeof getDoeDtcProfileSnapshot>>["assessments"],
): string {
  if (assessments.length === 0) return "None yet.";
  return assessments
    .slice(0, 5)
    .map((row) => `- ${row.result.summary} (reported: ${row.symptoms_text.slice(0, 120)})`)
    .join("\n");
}

function formatAppointmentLog(
  appointments: Awaited<ReturnType<typeof getDoeDtcProfileSnapshot>>["appointments"],
): string {
  if (appointments.length === 0) return "None yet.";
  return appointments
    .slice(0, 8)
    .map((row) => `- ${row.title}${row.starts_at ? ` @ ${row.starts_at}` : row.timing_note ? ` (${row.timing_note})` : ""}`)
    .join("\n");
}

function formatFamilyLog(
  familyMembers: Awaited<ReturnType<typeof getDoeDtcProfileSnapshot>>["familyMembers"],
): string {
  if (familyMembers.length === 0) return "None yet.";
  return familyMembers
    .map((row) => {
      const parts = [`${row.full_name} (${row.relationship})`];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

async function loadRunContext(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  turnId?: string;
  reminderDirective?: string | null;
  pendingRow?: DoeDtcAgentPendingRow | null;
}): Promise<DoeDtcRunContext> {
  const pendingRow = params.pendingRow ?? (await getAgentPending(params.user.id));

  const [snapshot, messageHistory, relevantMemoryRows, recentGuides, playbookNotes, activeBrowserJobId] =
    await Promise.all([
      getDoeDtcProfileSnapshot(params.user.id),
      listDoeDtcMessages(params.user.id, 40),
      searchDoeDtcMem0Memories({ userId: params.user.id, query: params.inboundText, topK: 5 }),
      listGuidesForUser(params.user.id),
      searchDoeDtcMem0Playbook({ userId: params.user.id, query: params.inboundText, topK: 3 }),
      getActiveDoeDtcBrowserJobId(params.user.id),
    ]);

  const timezone = normalizeScheduledTimezone(null);
  const activeWorkflows = await listActiveWorkflowsForUser(params.user.id);
  const pendingBlock = pendingRow ? formatAgentPendingForPrompt(pendingRow) : "";
  const playbookBlock =
    playbookNotes.length > 0 ? playbookNotes.map((note) => `- ${note}`).join("\n") : "None yet.";

  const instructions =
    buildDoeDtcAgentSystemPrompt({
      user: params.user,
      medications: snapshot.medications,
      conditions: snapshot.conditions,
      transcript: compactTranscript(messageHistory),
      symptomLog: formatSymptomLog(snapshot.symptoms),
      assessmentHistory: formatAssessmentHistory(snapshot.assessments),
      appointmentLog: formatAppointmentLog(snapshot.appointments),
      relevantMemories: formatMem0Block(relevantMemoryRows),
      playbookNotes: playbookBlock,
      pendingBlock,
      familyLog: formatFamilyLog(snapshot.familyMembers),
      householdLog: formatHouseholdForAgent({
        household: snapshot.household.household,
        members: snapshot.household.members,
        consents: snapshot.household.consents,
        viewerUserId: params.user.id,
      }),
      accountabilityLog: formatAccountabilityForAgent(snapshot.accountabilityPacts),
      scheduledLog: formatScheduledTextForAgent(snapshot.scheduledTexts.filter((row) => row.status === "pending")),
      workflowsLog: formatWorkflowsForAgent(activeWorkflows),
      guidesLog:
        recentGuides.length === 0
          ? "None yet."
          : recentGuides.map((row) => `- ${formatGuideForAgent(row)} | id: ${row.id}`).join("\n"),
      profileOverview: formatDoeDtcProfileOverview(snapshot),
      nowLabel: agentNowLabel(timezone),
    }) + (params.reminderDirective ? `\n\n${params.reminderDirective}` : "");

  return {
    user: params.user,
    inboundText: params.inboundText,
    inboundMessageId: params.inboundMessageId,
    snapshot,
    turnState: {
      ...createInitialToolTurnState(activeBrowserJobId),
      turnId: params.turnId ?? createDoeDtcAgentTurnId(),
    },
    instructions,
  };
}

function createDoeManagerAgent(ctx: DoeDtcRunContext): Agent<DoeDtcRunContext, typeof DoeReplySchema> {
  return createDoeSpecialistAgents(ctx).manager;
}

async function commitAwaitingBodyPending(params: {
  user: DoeDtcUserRow;
  pendingRow: DoeDtcAgentPendingRow;
  body: string;
}): Promise<DoeDtcAgentTurnResult | null> {
  let commit = await executeAgentPendingCommit({
    user: params.user,
    pending: {
      ...params.pendingRow,
      args: buildAwaitingBodyCommitArgs(params.pendingRow.args, params.body),
    },
  });
  if (!commit.ok && commit.recoverable) {
    commit = await executeAgentPendingCommit({
      user: params.user,
      pending: {
        ...params.pendingRow,
        args: buildAwaitingBodyCommitArgs(params.pendingRow.args, params.body),
      },
      allowRollForward: true,
    });
  }
  if (commit.ok) {
    await clearAgentPending(params.user.id);
    if (commit.playbookNote) {
      await addDoeDtcMem0PlaybookNote({ userId: params.user.id, note: commit.playbookNote });
    }
    return {
      replyText: sanitizeDoeDtcReplyText(commit.replyHint),
      profileUrl: commit.profileUrl,
      assessmentRan: false,
    };
  }

  if (!commit.recoverable) {
    await clearAgentPending(params.user.id);
  }
  return null;
}

async function commitStoredPending(params: {
  user: DoeDtcUserRow;
  pendingRow: DoeDtcAgentPendingRow;
}): Promise<DoeDtcAgentTurnResult | null> {
  let commit = await executeAgentPendingCommit({ user: params.user, pending: params.pendingRow });
  if (!commit.ok && commit.recoverable) {
    commit = await executeAgentPendingCommit({
      user: params.user,
      pending: params.pendingRow,
      allowRollForward: true,
    });
  }
  if (commit.ok) {
    await clearAgentPending(params.user.id);
    if (commit.playbookNote) {
      await addDoeDtcMem0PlaybookNote({ userId: params.user.id, note: commit.playbookNote });
    }
    return {
      replyText: sanitizeDoeDtcReplyText(commit.replyHint),
      profileUrl: commit.profileUrl,
      assessmentRan: false,
    };
  }

  if (!commit.recoverable) {
    await clearAgentPending(params.user.id);
  }
  return null;
}

async function resumeRunStatePending(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  turnId?: string;
  pendingRow: DoeDtcAgentPendingRow;
  approve: boolean;
}): Promise<DoeDtcAgentTurnResult> {
  const serialized = extractRunStateSerialized(params.pendingRow.args);
  if (!serialized) {
    await clearAgentPending(params.user.id);
    return { replyText: DEGENERATE_TURN_REPLY, assessmentRan: false, degenerate: true };
  }

  const loaded = await loadRunContext({
    user: params.user,
    inboundText: params.inboundText,
    inboundMessageId: params.inboundMessageId,
    turnId: params.turnId,
    pendingRow: params.pendingRow,
  });
  const agent = createDoeManagerAgent(loaded);
  const runState = await RunState.fromString(agent, serialized);
  const interruption = runState.getInterruptions()[0];

  if (interruption) {
    if (params.approve) {
      runState.approve(interruption);
    } else {
      runState.reject(interruption, { message: "User declined." });
    }
  }

  const result = await run(agent, runState, { context: loaded, maxTurns: 12 });

  if (result.interruptions?.length) {
    const nextInterruption = result.interruptions[0];
    await setAgentPending({
      userId: params.user.id,
      kind: "schedule_text",
      commitTool: nextInterruption?.name ?? "approval",
      args: { runState: result.state.toString() },
      summary: nextInterruption?.name
        ? `Waiting for approval to run ${nextInterruption.name}.`
        : "Waiting for your confirmation.",
    });
    loaded.turnState.preservePendingOffer = true;
  } else {
    await clearAgentPending(params.user.id);
  }

  return finalizeSdkRun({
    result,
    loaded,
    inboundText: params.inboundText,
    inboundMessageId: params.inboundMessageId,
  });
}

async function finalizeSdkRun(params: {
  result: {
    finalOutput?: unknown;
    interruptions?: Array<{ name?: string }>;
  };
  loaded: DoeDtcRunContext;
  inboundText: string;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const safety = await applyReminderSafetyNet({
    user: params.loaded.user,
    inboundText: params.inboundText,
    ctx: {
      user: params.loaded.user,
      inboundText: params.inboundText,
      inboundMessageId: params.inboundMessageId,
      snapshot: params.loaded.snapshot,
    },
    state: params.loaded.turnState,
    toolsExecuted: params.loaded.turnState.toolsExecuted,
  });

  const finalOutput = params.result.finalOutput as DoeReply | undefined;
  let rawReply = finalOutput?.reply?.trim() || "";
  if (safety.applied && safety.replyHint) {
    rawReply = safety.replyHint;
  }

  const degenerate = isDegenerateTurn({
    replyText: rawReply,
    toolsExecuted: params.loaded.turnState.toolsExecuted,
    state: params.loaded.turnState,
  });

  const replyText = sanitizeDoeDtcReplyText(
    degenerate ? DEGENERATE_TURN_REPLY : rawReply || DEGENERATE_TURN_REPLY,
    { preservePendingOffer: params.loaded.turnState.preservePendingOffer },
  );

  if (finalOutput && !degenerate) {
    await resolveDoeReplyDeliverables({ reply: finalOutput, ctx: params.loaded });
  }

  const turnResult = assembleTurnResult({
    replyText,
    turnState: params.loaded.turnState,
  });
  return { ...turnResult, degenerate: degenerate || !rawReply };
}

export async function runDoeDtcAgentTurnSdk(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  turnId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  let pendingRow = await getAgentPending(params.user.id);

  if (pendingRow && parseDecline(params.inboundText)) {
    if (isRunStatePending(pendingRow.args)) {
      return resumeRunStatePending({
        ...params,
        pendingRow,
        approve: false,
      });
    }
    await clearAgentPending(params.user.id);
    return { replyText: "Okay, I won't.", assessmentRan: false };
  }

  if (pendingRow && isAwaitingBodyPending(pendingRow.args) && !parseDecline(params.inboundText)) {
    const body = params.inboundText.trim();
    if (body) {
      const committed = await commitAwaitingBodyPending({
        user: params.user,
        pendingRow,
        body,
      });
      if (committed) return committed;
    }
  }

  const reminderIntent = parseReminderIntent(params.inboundText);
  if (!pendingRow && reminderIntent.matched && reminderIntent.missingSlot === "body") {
    await storeAwaitingBodyReminderPending({ user: params.user, intent: reminderIntent });
    return {
      replyText: sanitizeDoeDtcReplyText(buildReminderClarifyingQuestion(reminderIntent), {
        preservePendingOffer: true,
      }),
      assessmentRan: false,
      preservePendingOffer: true,
    };
  }

  if (pendingRow && isRunStatePending(pendingRow.args) && parseAffirmation(params.inboundText)) {
    return resumeRunStatePending({
      ...params,
      pendingRow,
      approve: true,
    });
  }

  if (pendingRow && isCommitPending(pendingRow.args) && parseAffirmation(params.inboundText)) {
    const committed = await commitStoredPending({ user: params.user, pendingRow });
    if (committed) return committed;
    pendingRow = await getAgentPending(params.user.id);
  }

  if (pendingRow && isRunStatePending(pendingRow.args)) {
    await clearAgentPending(params.user.id);
    pendingRow = null;
  }

  const loaded = await loadRunContext({
    ...params,
    reminderDirective: buildReminderIntentDirective(reminderIntent),
    pendingRow,
  });
  const agent = createDoeManagerAgent(loaded);

  const result = await run(agent, params.inboundText, { context: loaded, maxTurns: 12 });

  if (result.interruptions?.length) {
    await clearAgentPending(params.user.id);
    const interruption = result.interruptions[0];
    await setAgentPending({
      userId: params.user.id,
      kind: "schedule_text",
      commitTool: interruption?.name ?? "approval",
      args: { runState: result.state.toString() },
      summary: interruption?.name
        ? `Waiting for approval to run ${interruption.name}.`
        : "Waiting for your confirmation.",
    });
    loaded.turnState.preservePendingOffer = true;
  }

  return finalizeSdkRun({
    result,
    loaded,
    inboundText: params.inboundText,
    inboundMessageId: params.inboundMessageId,
  });
}
