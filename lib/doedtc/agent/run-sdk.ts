import { run, RunState } from "@openai/agents";
import type { Agent } from "@openai/agents";

import { getActiveDoeDtcBrowserJobId } from "@/lib/doedtc/doedtc-browser";
import {
  assembleTurnResult,
  resolveDoeReplyDeliverables,
} from "@/lib/doedtc/agent/deliverable-resolver";
import { createInitialToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import { createDoeSpecialistAgents } from "@/lib/doedtc/agent/specialists";
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
  clearAgentPending,
  formatAgentPendingForPrompt,
  getAgentPending,
  parseAffirmation,
  parseDecline,
} from "@/lib/doedtc/doedtc-pending";
import { sanitizeDoeDtcReplyText } from "@/lib/doedtc/doedtc-agent";
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
  return messages
    .slice(-20)
    .map((row) => `${row.direction === "inbound" ? "User" : "Doe"}: ${row.body}`)
    .join("\n");
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

  const instructions = buildDoeDtcAgentSystemPrompt({
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
  });

  return {
    user: params.user,
    inboundText: params.inboundText,
    inboundMessageId: params.inboundMessageId,
    snapshot,
    turnState: createInitialToolTurnState(activeBrowserJobId),
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
}): Promise<DoeDtcAgentTurnResult> {
  const pendingRow = await getAgentPending(params.user.id);

  if (pendingRow && parseDecline(params.inboundText)) {
    await clearAgentPending(params.user.id);
    return { replyText: "Okay, I won't.", assessmentRan: false };
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

  const loaded = await loadRunContext(params);
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
    // Store serialized run state for approval resume — uses pending table args JSON
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

  const finalOutput = result.finalOutput as DoeReply | undefined;
  const replyText = sanitizeDoeDtcReplyText(
    finalOutput?.reply ?? "Got it.",
    { preservePendingOffer: loaded.turnState.preservePendingOffer },
  );

  if (finalOutput) {
    await resolveDoeReplyDeliverables({ reply: finalOutput, ctx: loaded });
  }

  return assembleTurnResult({ replyText, turnState: loaded.turnState });
}
