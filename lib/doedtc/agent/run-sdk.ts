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
  formatAgentPendingForPrompt,
  getAgentPending,
  parseAffirmation,
  parseDecline,
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
}): Promise<DoeDtcRunContext> {
  const [snapshot, messageHistory, relevantMemoryRows, recentGuides, pendingRow, playbookNotes, activeBrowserJobId] =
    await Promise.all([
      getDoeDtcProfileSnapshot(params.user.id),
      listDoeDtcMessages(params.user.id, 40),
      searchDoeDtcMem0Memories({ userId: params.user.id, query: params.inboundText, topK: 5 }),
      listGuidesForUser(params.user.id),
      getAgentPending(params.user.id),
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

export async function runDoeDtcAgentTurnSdk(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  turnId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const pendingRow = await getAgentPending(params.user.id);

  if (pendingRow && parseDecline(params.inboundText)) {
    await clearAgentPending(params.user.id);
    return { replyText: "Okay, I won't.", assessmentRan: false };
  }

  if (pendingRow && isAwaitingBodyPending(pendingRow.args) && !parseDecline(params.inboundText)) {
    const body = params.inboundText.trim();
    if (body) {
      let commit = await executeAgentPendingCommit({
        user: params.user,
        pending: {
          ...pendingRow,
          args: buildAwaitingBodyCommitArgs(pendingRow.args, body),
        },
      });
      if (!commit.ok && commit.recoverable) {
        commit = await executeAgentPendingCommit({
          user: params.user,
          pending: {
            ...pendingRow,
            args: buildAwaitingBodyCommitArgs(pendingRow.args, body),
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

  if (pendingRow && parseAffirmation(params.inboundText)) {
    let commit = await executeAgentPendingCommit({ user: params.user, pending: pendingRow });
    if (!commit.ok && commit.recoverable) {
      commit = await executeAgentPendingCommit({
        user: params.user,
        pending: pendingRow,
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
  }

  const loaded = await loadRunContext({
    ...params,
    reminderDirective: buildReminderIntentDirective(reminderIntent),
  });
  const agent = createDoeManagerAgent(loaded);

  let runState: RunState<DoeDtcRunContext, Agent<DoeDtcRunContext, typeof DoeReplySchema>> | null = null;
  if (pendingRow?.args && typeof pendingRow.args === "object" && "runState" in pendingRow.args) {
    const serialized = String((pendingRow.args as { runState?: string }).runState ?? "");
    if (serialized) {
      runState = await RunState.fromString(agent, serialized);
    }
  }

  const result = runState
    ? await run(agent, runState, { context: loaded, maxTurns: 12 })
    : await run(agent, params.inboundText, { context: loaded, maxTurns: 12 });

  if (result.interruptions?.length) {
    await clearAgentPending(params.user.id);
    const { setAgentPending } = await import("@/lib/doedtc/doedtc-pending");
    const interruption = result.interruptions[0];
    await setAgentPending({
      userId: params.user.id,
      kind: "schedule_text",
      commitTool: interruption?.name ?? "approval",
      args: { runState: result.state.toString() },
      summary: "Waiting for your confirmation.",
    });
    loaded.turnState.preservePendingOffer = true;
  }

  const safety = await applyReminderSafetyNet({
    user: params.user,
    inboundText: params.inboundText,
    ctx: {
      user: params.user,
      inboundText: params.inboundText,
      inboundMessageId: params.inboundMessageId,
      snapshot: loaded.snapshot,
    },
    state: loaded.turnState,
    toolsExecuted: loaded.turnState.toolsExecuted,
  });

  const finalOutput = result.finalOutput as DoeReply | undefined;
  let rawReply = finalOutput?.reply?.trim() || "";
  if (safety.applied && safety.replyHint) {
    rawReply = safety.replyHint;
  }

  const degenerate = isDegenerateTurn({
    replyText: rawReply,
    toolsExecuted: loaded.turnState.toolsExecuted,
    state: loaded.turnState,
  });

  const replyText = sanitizeDoeDtcReplyText(
    degenerate ? DEGENERATE_TURN_REPLY : rawReply || DEGENERATE_TURN_REPLY,
    { preservePendingOffer: loaded.turnState.preservePendingOffer },
  );

  if (finalOutput && !degenerate) {
    await resolveDoeReplyDeliverables({ reply: finalOutput, ctx: loaded });
  }

  const turnResult = assembleTurnResult({
    replyText,
    turnState: loaded.turnState,
  });
  return { ...turnResult, degenerate: degenerate || !rawReply };
}
