import { run, RunState, user } from "@openai/agents";
import type { Agent } from "@openai/agents";

import {
  buildSdkVisionUserInput,
  enrichTranscriptBodiesForAgent,
  loadDoeDtcAttachmentContext,
} from "@/lib/doedtc/agent/attachments";
import { getActiveDoeDtcBrowserJobId } from "@/lib/doedtc/doedtc-browser";
import {
  assembleTurnResult,
  resolveDoeReplyDeliverables,
} from "@/lib/doedtc/agent/deliverable-resolver";
import {
  askedForPrivateAppLink,
  lastOutboundBodyFromMessages,
  looksLikeChartRead,
  priorInboundBodiesFromMessages,
  resolveDeliverableInboundText,
} from "@/lib/doedtc/agent/deliverable-policy";
import {
  buildMemorySearchQuery,
  formatThreadContinuityBlock,
  resolveThreadInboundText,
  THREAD_TRANSCRIPT_FETCH,
  THREAD_TRANSCRIPT_KEEP,
} from "@/lib/doedtc/agent/thread-context";
import {
  buildIncidentalChartWriteRetrySystemMessage,
  chartWriteSucceeded,
  formatIncidentalChartWriteContinueBlock,
  looksLikeChartWriteAckOnly,
} from "@/lib/doedtc/agent/chart-write";
import { isIncidentalChartWrite } from "@/lib/doedtc/agent/deliverable-policy";
import {
  isChartWriteResumeContinue,
  resumeChartWritePending,
} from "@/lib/doedtc/agent/chart-write-resume";
import { looksLikeBrowseAsk } from "@/lib/doedtc/doedtc-browser-allowlist";
import { finalizeAgentReply } from "@/lib/doedtc/agent/finalize-agent-reply";
import {
  buildRefusalRetrySystemMessage,
  shouldRetryEmptyRefusal,
} from "@/lib/doedtc/agent/honesty";
import { CRISIS_REPLY } from "@/lib/doedtc/agent/turn-mode";
import { createInitialToolTurnState } from "@/lib/doedtc/agent/tool-dispatch";
import { buildSpecialistInstructionMap, createDoeSpecialistAgents } from "@/lib/doedtc/agent/specialists";
import { executeDoePlan, runDoePlannerTurn } from "@/lib/doedtc/agent/planner-run";
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
import { buildDoeAgentPromptSignals } from "@/lib/doedtc/agent/tool-prompt-registry";
import { formatActiveWorkBlock, loadActiveWork } from "@/lib/doedtc/agent/active-work";
import {
  askedWhatYouCanDo,
  buildCapabilityRetrySystemMessage,
  formatCapabilityAskBlock,
  looksLikeCapabilityBrochure,
} from "@/lib/doedtc/agent/capability-ask";
import {
  buildUnwellCareRetrySystemMessage,
  formatUnwellCareBlock,
  looksLikeLogNarration,
  looksLikeUnwellShare,
} from "@/lib/doedtc/agent/unwell-care";
import {
  buildProblemShareRetrySystemMessage,
  formatProblemShareBlock,
  inboundLooksLikeProblemShare,
  shouldRetryChartOrFileDump,
} from "@/lib/doedtc/agent/problem-share";
import { buildSituationBrief, formatSituationBriefBlock } from "@/lib/doedtc/agent/situation-brief";
import { executeAgentPendingCommit } from "@/lib/doedtc/doedtc-agent-commit";
import {
  addDoeDtcMem0PlaybookNote,
  formatMem0Block,
  searchDoeDtcMem0Memories,
  searchDoeDtcMem0Playbook,
} from "@/lib/doedtc/doedtc-memory";
import {
  buildAwaitingBodyCommitArgs,
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
  isChartWritePending,
  isCommitPending,
  isDocumentIdentityPending,
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
  buildScheduledTextFile,
  formatScheduledTextFileForAgent,
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
import type { DoeDtcFileRow } from "@/lib/doedtc/doedtc-files-db";

function compactTranscript(
  messages: Awaited<ReturnType<typeof listDoeDtcMessages>>,
  filesById: Map<string, DoeDtcFileRow>,
  recentInboundFiles: DoeDtcFileRow[],
): string {
  const filtered = messages.filter((entry) => entry.body.trim());
  const enriched = enrichTranscriptBodiesForAgent(filtered, filesById, recentInboundFiles);
  return compactTranscriptForAgent(enriched, THREAD_TRANSCRIPT_KEEP);
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
  inboundFileIds?: string[];
  extraVisionUrls?: string[];
  turnId?: string;
  reminderDirective?: string | null;
  pendingRow?: DoeDtcAgentPendingRow | null;
  incidentalChartWrite?: { label: string; originalInbound: string } | null;
}): Promise<DoeDtcRunContext> {
  const pendingRow = params.pendingRow ?? (await getAgentPending(params.user.id));
  const messageHistory = await listDoeDtcMessages(params.user.id, THREAD_TRANSCRIPT_FETCH);
  const priorInboundBodies = priorInboundBodiesFromMessages(messageHistory);
  const memoryQuery = buildMemorySearchQuery({
    inboundText: params.incidentalChartWrite?.originalInbound || params.inboundText,
    priorInboundBodies,
  });

  const [snapshot, relevantMemoryRows, recentGuides, playbookNotes, activeBrowserJobId, attachmentContext, activeWorkItems] =
    await Promise.all([
      getDoeDtcProfileSnapshot(params.user.id),
      searchDoeDtcMem0Memories({
        userId: params.user.id,
        query: memoryQuery,
        topK: 8,
      }),
      listGuidesForUser(params.user.id),
      searchDoeDtcMem0Playbook({ userId: params.user.id, query: memoryQuery, topK: 3 }),
      getActiveDoeDtcBrowserJobId(params.user.id),
      loadDoeDtcAttachmentContext({
        userId: params.user.id,
        inboundText: params.inboundText,
        inboundFileIds: params.inboundFileIds,
        extraVisionUrls: params.extraVisionUrls,
      }),
      loadActiveWork({ userId: params.user.id, currentTurnId: params.turnId }),
    ]);

  const filesById = new Map(attachmentContext.recentFiles.map((file) => [file.id, file]));
  const recentInboundFiles = attachmentContext.recentFiles.filter((file) => file.source === "inbound");

  const timezone = normalizeScheduledTimezone(null);
  const activeWorkflows = await listActiveWorkflowsForUser(params.user.id);
  const pendingBlock = pendingRow ? formatAgentPendingForPrompt(pendingRow) : "";
  const playbookBlock =
    playbookNotes.length > 0 ? playbookNotes.map((note) => `- ${note}`).join("\n") : "None yet.";

  const promptSignals = buildDoeAgentPromptSignals({
    snapshot,
    activeBrowserJobId,
    pendingRow,
  });

  const deliverableInboundText = resolveDeliverableInboundText({
    inboundText: params.inboundText,
    priorInboundBodies,
    lastOutboundBody: lastOutboundBodyFromMessages(messageHistory),
  });
  const threadInboundText = resolveThreadInboundText({
    inboundText: params.inboundText,
    priorInboundBodies,
  });
  const briefInboundText =
    params.incidentalChartWrite?.originalInbound?.trim() ||
    (deliverableInboundText !== params.inboundText.trim() ? deliverableInboundText : threadInboundText);
  const threadContinuityBlock = formatThreadContinuityBlock({
    inboundText: params.inboundText,
    priorInboundBodies,
  });

  const brief = buildSituationBrief({
    inboundText: briefInboundText,
    viewerUserId: params.user.id,
    viewerName: params.user.full_name,
    members: snapshot.household.members,
    artifacts: snapshot.artifacts,
    guides: snapshot.guides,
    medications: snapshot.medications,
    conditions: snapshot.conditions,
    resultTitles: snapshot.results.map((row) => row.title),
  });
  const situationBrief = formatSituationBriefBlock(brief);
  const turnMode = brief.actionSlots.turnMode;

  const promptParams = {
    user: params.user,
    medications: snapshot.medications,
    conditions: snapshot.conditions,
    transcript: compactTranscript(messageHistory, filesById, recentInboundFiles),
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
    scheduledLog: formatScheduledTextFileForAgent(
      buildScheduledTextFile({ rows: snapshot.scheduledTexts, pending: pendingRow }),
    ),
    workflowsLog: formatWorkflowsForAgent(activeWorkflows),
    guidesLog:
      recentGuides.length === 0
        ? "None yet."
        : recentGuides.map((row) => `- ${formatGuideForAgent(row)} | id: ${row.id}`).join("\n"),
    recentAttachmentsLog: attachmentContext.recentFilesLog,
    profileOverview: formatDoeDtcProfileOverview(snapshot),
    nowLabel: agentNowLabel(timezone),
    promptSignals,
    situationBrief,
    activeWorkBlock: formatActiveWorkBlock(activeWorkItems),
    capabilityAskBlock: askedWhatYouCanDo(deliverableInboundText)
      ? formatCapabilityAskBlock()
      : undefined,
    unwellCareBlock: looksLikeUnwellShare(briefInboundText)
      ? formatUnwellCareBlock()
      : undefined,
    incidentalChartWriteBlock: params.incidentalChartWrite
      ? formatIncidentalChartWriteContinueBlock(params.incidentalChartWrite)
      : undefined,
    problemShareBlock: inboundLooksLikeProblemShare(briefInboundText)
      ? formatProblemShareBlock()
      : undefined,
    threadContinuityBlock,
    turnMode: turnMode.mode,
  };

  const turnState = {
    ...createInitialToolTurnState(activeBrowserJobId),
    turnId: params.turnId ?? createDoeDtcAgentTurnId(),
  };
  const { ensureInboundDocumentParsed, formatDocumentParseForPrompt } = await import(
    "@/lib/doedtc/agent/document-parse"
  );
  const parseNote = formatDocumentParseForPrompt(
    await ensureInboundDocumentParsed({
      user: params.user,
      inboundText: deliverableInboundText,
      snapshot,
      state: turnState,
      attachmentContext,
    }),
  );

  const promptSplit = buildSpecialistInstructionMap({
    user: params.user,
    inboundText: deliverableInboundText,
    inboundMessageId: params.inboundMessageId,
    snapshot,
    turnState,
    instructions: "",
    promptParams,
  });

  const instructions =
    buildDoeDtcAgentSystemPrompt(promptParams) +
    (params.reminderDirective ? `\n\n${params.reminderDirective}` : "") +
    (parseNote ? `\n\n${parseNote}` : "");

  return {
    user: params.user,
    inboundText: deliverableInboundText,
    inboundMessageId: params.inboundMessageId,
    inboundFileIds: params.inboundFileIds,
    attachmentContext,
    turnMode,
    snapshot,
    turnState,
    instructions,
    plannerInstructions:
      promptSplit.plannerInstructions +
      (params.reminderDirective ? `\n\n${params.reminderDirective}` : "") +
      (parseNote ? `\n\n${parseNote}` : ""),
    specialistInstructions: promptSplit.specialistInstructions,
    incidentalChartWrite: params.incidentalChartWrite ?? undefined,
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
    inboundMessageId: params.inboundMessageId,
  });
}

function shouldRetrySdkReply(loaded: DoeDtcRunContext, replyText: string): boolean {
  if (
    shouldRetryEmptyRefusal({
      replyText,
      toolsExecuted: loaded.turnState.toolsExecuted ?? [],
      turnMode: loaded.turnMode?.mode,
      inboundText: loaded.inboundText,
    })
  ) {
    return true;
  }
  if (askedWhatYouCanDo(loaded.inboundText) && looksLikeCapabilityBrochure(replyText)) {
    return true;
  }
  if (looksLikeUnwellShare(loaded.inboundText) && looksLikeLogNarration(replyText)) {
    return true;
  }
  if (shouldRetryChartOrFileDump(loaded.inboundText, replyText)) {
    return true;
  }
  if (!looksLikeChartWriteAckOnly(replyText)) return false;
  const original = loaded.incidentalChartWrite?.originalInbound ?? loaded.inboundText;
  if (loaded.incidentalChartWrite) return true;
  return (
    chartWriteSucceeded(loaded.turnState.toolsExecuted) && isIncidentalChartWrite(original)
  );
}

async function finalizeSdkRun(params: {
  result: {
    finalOutput?: unknown;
    interruptions?: Array<{ name?: string }>;
  };
  loaded: DoeDtcRunContext;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const finalOutput = params.result.finalOutput as DoeReply | undefined;
  let rawReply = finalOutput?.reply?.trim() || "";
  const deliverableInboundText = params.loaded.inboundText;

  const finalized = await finalizeAgentReply({
    user: params.loaded.user,
    inboundText: deliverableInboundText,
    inboundMessageId: params.inboundMessageId,
    replyText: rawReply,
    turnState: params.loaded.turnState,
    snapshot: params.loaded.snapshot,
    turnMode: params.loaded.turnMode ?? {
      mode: "action",
      intent: "none",
      emergencyOrDiagnosis: false,
      disableCommitTools: false,
      promptBlock: "",
    },
    toolCtx: {
      user: params.loaded.user,
      inboundText: deliverableInboundText,
      inboundMessageId: params.inboundMessageId,
      snapshot: params.loaded.snapshot,
      attachmentContext: params.loaded.attachmentContext,
    },
  });

  if (finalOutput && !finalized.degenerate) {
    await resolveDoeReplyDeliverables({ reply: finalOutput, ctx: params.loaded });
  }

  const turnResult = assembleTurnResult({
    replyText: finalized.replyText,
    turnState: params.loaded.turnState,
    inboundText: deliverableInboundText,
  });
  return { ...turnResult, degenerate: finalized.degenerate };
}

export async function runDoeDtcAgentTurnSdk(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  inboundFileIds?: string[];
  extraVisionUrls?: string[];
  turnId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  let pendingRow = await getAgentPending(params.user.id);
  let incidentalChartWrite: { label: string; originalInbound: string } | null = null;

  if (pendingRow && (isDocumentIdentityPending(pendingRow.args) || pendingRow.kind === "parse_document")) {
    const { resolveHeldDocumentIdentity } = await import("@/lib/doedtc/agent/document-parse");
    const resolved = await resolveHeldDocumentIdentity({
      user: params.user,
      inboundText: params.inboundText,
      pending: pendingRow,
    });
    if (resolved) return resolved;
  }

  if (
    pendingRow &&
    isChartWritePending(pendingRow) &&
    !parseDecline(params.inboundText)
  ) {
    if (
      looksLikeChartRead(params.inboundText) ||
      askedForPrivateAppLink(params.inboundText) ||
      looksLikeBrowseAsk(params.inboundText)
    ) {
      await clearAgentPending(params.user.id);
      pendingRow = null;
    } else {
      const resumed = await resumeChartWritePending({
        user: params.user,
        inboundText: params.inboundText,
        pending: pendingRow,
      });
      if (resumed && isChartWriteResumeContinue(resumed)) {
        incidentalChartWrite = {
          label: resumed.label,
          originalInbound: resumed.originalInbound,
        };
        pendingRow = null;
      } else if (resumed) {
        return resumed;
      } else {
        pendingRow = await getAgentPending(params.user.id);
      }
    }
  }

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
    incidentalChartWrite,
  });

  if (loaded.turnMode?.mode === "crisis") {
    return {
      replyText: sanitizeDoeDtcReplyText(CRISIS_REPLY),
      assessmentRan: false,
    };
  }

  const plan = await runDoePlannerTurn(loaded);
  if (plan) {
    const executed = await executeDoePlan({ plan, ctx: loaded });
    if (executed.ok && !shouldRetrySdkReply(loaded, executed.reply)) {
      const finalized = await finalizeAgentReply({
        user: loaded.user,
        inboundText: loaded.inboundText,
        inboundMessageId: params.inboundMessageId,
        replyText: executed.reply,
        turnState: loaded.turnState,
        snapshot: loaded.snapshot,
        turnMode: loaded.turnMode ?? {
          mode: "action",
          intent: "none",
          emergencyOrDiagnosis: false,
          disableCommitTools: false,
          promptBlock: "",
        },
        toolCtx: {
          user: loaded.user,
          inboundText: loaded.inboundText,
          inboundMessageId: params.inboundMessageId,
          snapshot: loaded.snapshot,
          attachmentContext: loaded.attachmentContext,
        },
      });
      loaded.turnState.preservePendingOffer =
        loaded.turnState.preservePendingOffer || Boolean(executed.preservePending);
      const turnResult = assembleTurnResult({
        replyText: finalized.replyText,
        turnState: loaded.turnState,
        inboundText: loaded.inboundText,
      });
      return { ...turnResult, degenerate: finalized.degenerate };
    }
  }

  const visionInput = buildSdkVisionUserInput(
    loaded.attachmentContext?.inboundTextForModel ?? params.inboundText,
    loaded.attachmentContext?.visionImageUrls ?? [],
  );
  const sdkInput = typeof visionInput === "string" ? visionInput : [user(visionInput)];

  const runManager = async () => {
    const agent = createDoeSpecialistAgents(loaded).manager;
    return run(agent, sdkInput, { context: loaded, maxTurns: 12 });
  };

  let result = await runManager();

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

  const firstPass = await finalizeSdkRun({
    result,
    loaded,
    inboundMessageId: params.inboundMessageId,
  });

  if (result.interruptions?.length || !shouldRetrySdkReply(loaded, firstPass.replyText)) {
    return firstPass;
  }

  const retryNudge =
    looksLikeChartWriteAckOnly(firstPass.replyText) && loaded.incidentalChartWrite
      ? buildIncidentalChartWriteRetrySystemMessage(loaded.incidentalChartWrite)
      : shouldRetryChartOrFileDump(loaded.inboundText, firstPass.replyText)
        ? buildProblemShareRetrySystemMessage(loaded.inboundText)
        : looksLikeUnwellShare(loaded.inboundText) && looksLikeLogNarration(firstPass.replyText)
          ? buildUnwellCareRetrySystemMessage()
          : askedWhatYouCanDo(loaded.inboundText) && looksLikeCapabilityBrochure(firstPass.replyText)
            ? buildCapabilityRetrySystemMessage()
            : buildRefusalRetrySystemMessage(loaded.inboundText);
  loaded.instructions = `${loaded.instructions}\n\n${retryNudge}`;
  if (loaded.plannerInstructions) {
    loaded.plannerInstructions = `${loaded.plannerInstructions}\n\n${retryNudge}`;
  }
  if (loaded.specialistInstructions) {
    for (const key of Object.keys(loaded.specialistInstructions) as Array<
      keyof NonNullable<typeof loaded.specialistInstructions>
    >) {
      const current = loaded.specialistInstructions[key];
      if (current) loaded.specialistInstructions[key] = `${current}\n\n${retryNudge}`;
    }
  }
  result = await runManager();
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
    inboundMessageId: params.inboundMessageId,
  });
}
