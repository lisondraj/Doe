import { resolveDoeDtcAgentRuntime, resolveDoeDtcAgentModel } from "@/lib/doedtc/agent/types";
import {
  buildRefusalRetrySystemMessage,
  reconcileReplyClaims,
  shouldRetryEmptyRefusal,
} from "@/lib/doedtc/agent/honesty";
import {
  assertToolPromptCoverage,
  buildDoeDtcToolCapabilityPrompt,
} from "@/lib/doedtc/agent/tool-prompt-registry";
import { createDoeDtcAgentTurnId } from "@/lib/doedtc/doedtc-agent-audit";
import { getActiveDoeDtcBrowserJobId } from "@/lib/doedtc/doedtc-browser";
import {
  createInitialToolTurnState,
  executeDoeDtcTool,
} from "@/lib/doedtc/agent/tool-dispatch";
import { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
import { generateDoeDtcAssessment } from "@/lib/doedtc/doedtc-assessment";
import {
  buildDoeAgentVoiceBlock,
  DOE_AGENT_MAKE_SURE_ROUTING,
  hasConcretePlan,
  looksCapabilityHedge,
} from "@/lib/doedtc/doedtc-agent-voice";
import { DOE_AGENT_ACTION_POLICY } from "@/lib/doedtc/doedtc-agent-policy";
import { DOE_AGENT_PRIMITIVES_PROMPT } from "@/lib/doedtc/doedtc-primitives";
import {
  buildScheduledTextPendingArgs,
  executeAgentPendingCommit,
} from "@/lib/doedtc/doedtc-agent-commit";
import {
  addDoeDtcMem0Fact,
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
  setAgentPending,
} from "@/lib/doedtc/doedtc-pending";
import { doeDtcAppUrl, doeDtcArtifactShareUrl, doeDtcCareUrl, doeDtcFeedbackUrl, doeDtcGuideUrl, doeDtcListenUrl, doeDtcPrepareUrl, doeDtcSessionUrl } from "@/lib/doedtc/doedtc-copy";
import {
  formatDoeDtcAppointmentWhen,
  normalizeDoeDtcAppointmentTiming,
  type DoeDtcAppointmentTimingPrecision,
} from "@/lib/doedtc/doedtc-appointment-timing";
import { doeDtcFindPhoneCountry } from "@/lib/doedtc/doedtc-phone-countries";
import { doeDtcGenderLabel } from "@/lib/doedtc/doedtc-types";
import { normalizeArtifactLayout } from "@/lib/doedtc/doedtc-artifacts";
import {
  addDoeDtcAppointment,
  addDoeDtcHouseholdMember,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  archiveDoeDtcArtifact,
  createDoeDtcArtifact,
  createDoeDtcHouseholdInvite,
  findDoeDtcArtifactByTitle,
  logDoeDtcArtifactEntry,
  removeDoeDtcArtifactEntry,
  removeDoeDtcCondition,
  removeDoeDtcMedication,
  renameDoeDtcCondition,
  renameDoeDtcMedication,
  resolveDoeDtcHouseholdSubject,
  revokeDoeDtcHouseholdAccess,
  shareDoeDtcArtifact,
  unshareDoeDtcArtifact,
  updateDoeDtcArtifact,
  updateDoeDtcArtifactEntry,
  createDoeDtcListenSession,
  createDoeDtcPreparation,
  createDoeDtcTicket,
  getDoeDtcProfileSnapshot,
  insertDoeDtcMemory,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  listDoeDtcMessages,
  loadDoeDtcHouseholdAccessContext,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import {
  findHouseholdMemberByName,
  formatHouseholdForAgent,
  isHouseholdMemberAdult,
} from "@/lib/doedtc/doedtc-household";
import {
  findAccountabilityPactForUser,
  inviteAccountabilityPartner,
  logAccountabilityCheckIn,
  pauseAccountabilityPact,
  resumeAccountabilityPact,
  startAccountabilityPact,
  withdrawAccountabilityPact,
} from "@/lib/doedtc/doedtc-accountability-db";
import {
  formatAccountabilityForAgent,
  normalizeAccountabilityMechanics,
} from "@/lib/doedtc/doedtc-accountability";
import {
  cancelScheduledText,
  createScheduledText,
  listScheduledTextsForUser,
  resolveScheduledTextRecipient,
  sendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled-db";
import {
  agentNowLabel,
  ensureFutureSendAt,
  formatScheduledSendAtLabel,
  formatScheduledTextForAgent,
  isPendingOfferText,
  isScheduleOfferText,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
  shouldSendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled";
import {
  buildHabitWorkflowConfig,
  cancelWorkflow,
  createHabitWorkflow,
  formatWorkflowsForAgent,
  listActiveWorkflowsForUser,
} from "@/lib/doedtc/doedtc-workflows";
import {
  createDoeDtcGuide,
  listGuidesForUser,
  saveDoeDtcGuide,
  updateDoeDtcGuide,
} from "@/lib/doedtc/doedtc-guides-db";
import {
  formatGuideForAgent,
  isGuideSaveOfferText,
  normalizeGuideBlocks,
  normalizeGuideLayout,
} from "@/lib/doedtc/doedtc-guides";
import { sendDoeDtcFamilyInviteMessage, sendDoeDtcHouseholdAccessRevokedNotice } from "@/lib/doedtc/doedtc-messaging";
import {
  DOEDTC_PROFILE_READ_TABS,
  formatDoeDtcProfileOverview,
  readDoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-profile-read";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";
import type {
  DoeDtcAppointmentRow,
  DoeDtcAssessmentResult,
  DoeDtcAssessmentRow,
  DoeDtcFamilyMemberRow,
  DoeDtcFamilyRelationship,
  DoeDtcMessageRow,
  DoeDtcProfileTab,
  DoeDtcSymptomRow,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const DOEDTC_ASSESSMENT_MODEL = "gpt-4o-mini";
const MAX_TOOL_ROUNDS = 8;
const AGENT_TOOL_TEMPERATURE = 0.25;



type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; content: string };

export type DoeDtcAgentTurnResult = {
  replyText: string;
  careUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  feedbackUrl?: string;
  prepareUrl?: string;
  guideUrl?: string;
  artifactShareUrl?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  reactionEmoji?: string;
  replyToInbound?: boolean;
  browserNeedsConfirm?: boolean;
  assessmentRan: boolean;
  preservePendingOffer?: boolean;
};

const URL_IN_TEXT = /https?:\/\/\S+/gi;
const CLOSER_TAIL =
  /(?:\s*[,.!]+\s*)?(?:feel free to (?:ask|let me know|reach out|text|message)(?:\b.{0,80})?|let me know if (?:you(?:'d| would)? (?:like|want|need)|you have |there's |you need ).{0,80}|if there(?:'s| is) anything you need.{0,40}|if you need anything.{0,40}|here if you need me.{0,20}|just let me know(?:\b.{0,60})?|let me know\.[!?.,]?\s*$|don'?t hesitate to (?:ask|reach out|text).{0,40}|happy to (?:help|chat|look)(?:\b.{0,40})?(?: if you want)?|(?:is there )?anything else I can (?:help|do).{0,40}|what else can I (?:help|do).{0,40}|(?:^|(?<=[.!?]\s))want me to .{0,80}|i can also (?:help|look|check|do|add).{0,60}|just say the word[!?.,]?\s*$)[!?.,]?\s*$/i;
const KEEP_CLOSER_RATE = 0.08;
const INCOMPLETE_FRAGMENT_START =
  /^(if|when|want|let me|feel free|i can also|what else|anything else|is there|do you|would you|should i|can i|could you)\b/i;

function looksIncompleteFragment(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/[.!?]$/.test(trimmed)) return false;
  if (INCOMPLETE_FRAGMENT_START.test(trimmed)) return true;
  if (/[,;…]$/.test(trimmed) || /\.{2,}$/.test(trimmed)) return true;
  if (/\bif you\b/i.test(trimmed)) return true;
  return false;
}

function splitCompleteAndTrailing(text: string): { complete: string[]; trailing: string | null } {
  const trimmed = text.trim();
  if (!trimmed) return { complete: [], trailing: null };

  const complete: string[] = [];
  const regex = /[^.!?]+[.!?]+/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(trimmed)) !== null) {
    complete.push(match[0].trim());
    lastIndex = regex.lastIndex;
  }
  const trailing = trimmed.slice(lastIndex).trim();
  return { complete, trailing: trailing || null };
}

function dropIncompleteTrailingSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "All set.";

  const { complete, trailing } = splitCompleteAndTrailing(trimmed);

  if (trailing && looksIncompleteFragment(trailing)) {
    const joined = complete.join(" ").trim();
    return joined || "All set.";
  }

  if (complete.length === 0 && looksIncompleteFragment(trimmed)) {
    return "All set.";
  }

  return trimmed;
}

function stripMarkdownFromReply(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1");
}

export function sanitizeDoeDtcReplyText(
  text: string,
  options?: {
    keepCloserRate?: number;
    preservePendingOffer?: boolean;
    /** @deprecated use preservePendingOffer */
    preserveScheduleOffer?: boolean;
    /** @deprecated use preservePendingOffer */
    preserveGuideSaveOffer?: boolean;
  },
): string {
  const withoutMarkdown = stripMarkdownFromReply(text);
  const withoutUrls = withoutMarkdown.replace(URL_IN_TEXT, "");
  const shouldPreserveOffer =
    (options?.preservePendingOffer && isPendingOfferText(withoutUrls)) ||
    (options?.preserveScheduleOffer && isScheduleOfferText(withoutUrls)) ||
    (options?.preserveGuideSaveOffer && isGuideSaveOfferText(withoutUrls));
  const stripped = shouldPreserveOffer ? withoutUrls : withoutUrls.replace(CLOSER_TAIL, "");
  const rate = options?.keepCloserRate ?? KEEP_CLOSER_RATE;
  const keepCloser = stripped !== withoutUrls && Math.random() < rate;
  const normalized = (keepCloser ? withoutUrls : stripped)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[,;]+(?:\s*[.!]*)?\s*$/g, "")
    .trim();
  const cleaned = dropIncompleteTrailingSentence(normalized);
  if (looksCapabilityHedge(cleaned) && !hasConcretePlan(cleaned)) {
    return "Tell me who to text and when, and I'll set it up.";
  }
  return cleaned;
}

function compactTranscript(messages: DoeDtcMessageRow[]): string {
  const lines = messages
    .filter((entry) => entry.body.trim())
    .map((entry) => {
      const speaker = entry.direction === "inbound" ? "User" : "Doe";
      return `${speaker}: ${entry.body.trim()}`;
    });
  const joined = lines.join("\n");
  if (joined.length <= 9000) return joined;
  return joined.slice(joined.length - 9000);
}

function formatSymptomLog(symptoms: DoeDtcSymptomRow[]): string {
  if (symptoms.length === 0) return "No prior symptom logs.";
  return symptoms
    .map((row) => {
      const label = row.summary?.trim() || row.raw_text.trim();
      const parts = [label];
      if (row.severity !== "unknown") parts.push(`severity: ${row.severity}`);
      if (row.onset) parts.push(`onset: ${row.onset}`);
      if (row.tags.length > 0) parts.push(`tags: ${row.tags.join(", ")}`);
      parts.push(`symptom_id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatAssessmentHistory(assessments: DoeDtcAssessmentRow[]): string {
  if (assessments.length === 0) return "No prior assessments.";
  return assessments
    .map((row) => `- ${row.result.summary} (reported: ${row.symptoms_text.slice(0, 120)})`)
    .join("\n");
}

function formatAppointmentLog(appointments: DoeDtcAppointmentRow[]): string {
  if (appointments.length === 0) return "No appointments logged.";
  return appointments
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      const parts = [`${row.title} | when: ${when}`];
      if (row.timing_note) parts.push("(approximate — do not state as an exact calendar datetime)");
      if (row.location) parts.push(`at ${row.location}`);
      if (row.notes) parts.push(`notes: ${row.notes}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function formatFamilyLog(familyMembers: DoeDtcFamilyMemberRow[]): string {
  if (familyMembers.length === 0) return "No family members logged.";
  return familyMembers
    .map((row) => {
      const parts = [`${row.full_name} (${row.relationship})`];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      parts.push(`id: ${row.id}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

async function resolveAgentHouseholdSubject(params: {
  viewerUserId: string;
  args: Record<string, unknown>;
  requireEdit?: boolean;
}): Promise<
  | { subjectUserId: string; subjectMemberId?: string; subjectMemberName?: string }
  | { error: string }
> {
  const memberId = typeof params.args.member_id === "string" ? params.args.member_id.trim() : "";
  const memberName = typeof params.args.member_name === "string" ? params.args.member_name.trim() : "";
  if (!memberId && !memberName) {
    return { subjectUserId: params.viewerUserId };
  }
  const resolved = await resolveDoeDtcHouseholdSubject({
    viewerUserId: params.viewerUserId,
    memberId: memberId || null,
    memberName: memberName || null,
  });
  if ("error" in resolved) return { error: resolved.error };
  if (!resolved.canView) {
    return { error: `You do not have permission to view ${resolved.subjectMember.full_name}'s profile.` };
  }
  if (params.requireEdit && !resolved.canEdit) {
    return {
      error: `You do not have permission to edit ${resolved.subjectMember.full_name}'s profile.`,
    };
  }
  return {
    subjectUserId: resolved.subjectUserId,
    subjectMemberId: resolved.subjectMember.id,
    subjectMemberName: resolved.subjectMember.full_name,
  };
}

function buildReplyFromTurnState(params: {
  modelContent?: string | null;
  assessmentSummary?: string;
  browserNeedsConfirm: boolean;
  browserExcerpt?: string;
  workUrl?: string;
  screenshotUrl?: string;
  vaultUrl?: string;
  liveViewUrl?: string;
  sessionUrl?: string;
  listenUrl?: string;
  profileUrl?: string;
  feedbackUrl?: string;
  prepareUrl?: string;
  guideUrl?: string;
  artifactShareUrl?: string;
  browserUserMessage?: string;
  preservePendingOffer?: boolean;
}): string {
  if (params.browserUserMessage?.trim()) {
    return sanitizeDoeDtcReplyText(params.browserUserMessage, {
      preservePendingOffer: params.preservePendingOffer,
    });
  }

  const trimmed = params.modelContent?.trim();
  if (trimmed) {
    return sanitizeDoeDtcReplyText(trimmed, {
      preservePendingOffer: params.preservePendingOffer,
    });
  }

  if (params.assessmentSummary) return params.assessmentSummary;
  if (params.browserNeedsConfirm) return "Reply CONFIRM to proceed, or STOP to cancel.";
  if (params.browserExcerpt) {
    const snippet = params.browserExcerpt.replace(/\s+/g, " ").trim().slice(0, 280);
    return snippet.length > 0 ? snippet : "Here's what I found — sending a preview.";
  }
  if (params.workUrl) return "Here's what I found — sending a preview.";
  if (params.screenshotUrl) return "Here's a screenshot of the page.";
  if (params.vaultUrl) return "Sending a secure sign-in link.";
  if (params.liveViewUrl) return "Sending a Live View link so you can sign in.";
  if (params.sessionUrl) return "Sending a live session link so you can watch.";
  if (params.listenUrl) return "Sending a Listen link to record your visit.";
  if (params.profileUrl) return "Sending your profile link.";
  if (params.feedbackUrl) return "Sending a link to track your report.";
  if (params.prepareUrl) return "Sending your visit prep summary.";
  if (params.guideUrl) return "Sending your guide.";
  if (params.artifactShareUrl) return "Sending your shared tracker link.";

  return "Got it.";
}

export function buildDoeDtcAgentSystemPrompt(params: {
  user: DoeDtcUserRow;
  medications: string[];
  conditions: string[];
  transcript: string;
  symptomLog: string;
  assessmentHistory: string;
  appointmentLog: string;
  relevantMemories: string;
  playbookNotes: string;
  pendingBlock: string;
  familyLog: string;
  householdLog: string;
  accountabilityLog: string;
  scheduledLog: string;
  workflowsLog: string;
  guidesLog: string;
  profileOverview: string;
  nowLabel: string;
}): string {
  const prompt = `${buildDoeAgentVoiceBlock()}

${DOE_AGENT_ACTION_POLICY}

${DOE_AGENT_PRIMITIVES_PROMPT}

Now (user local time): ${params.nowLabel}.
${params.pendingBlock ? `\n${params.pendingBlock}\n` : ""}
Playbook (how you've corrected yourself before):
${params.playbookNotes}

Profile:

- Name: ${params.user.full_name ?? "Unknown"}
- Medications: ${params.medications.join(", ") || "None listed"}
- Conditions: ${params.conditions.join(", ") || "None listed"}
- Gender: ${doeDtcGenderLabel(params.user.gender)}
- Date of birth: ${params.user.date_of_birth ?? "Not specified"}
- Country: ${params.user.country ? doeDtcFindPhoneCountry(params.user.country).name : "Not specified"}

Profile tabs (read with read_profile if you need more detail):
${params.profileOverview}

Recent conversation:
${params.transcript || "No prior messages."}

Appointments:
${params.appointmentLog}

Household (shared family):
${params.householdLog}

Accountability pacts:
${params.accountabilityLog}

Scheduled texts:
${params.scheduledLog}

Habit workflows:
${params.workflowsLog}

Guides (saved + recent):
${params.guidesLog}

Relevant memories:
${params.relevantMemories}

Symptom log:
${params.symptomLog}

Prior assessments:
${params.assessmentHistory}

${buildDoeDtcToolCapabilityPrompt()}
${DOE_AGENT_MAKE_SURE_ROUTING}

Parallel work:
- Only one browser task runs at a time, but you may run other tools in the same turn (log symptoms, family, meds, start_listen, etc.) while a browser job is open.
- Do not wait for browsing to finish before saving profile or appointment data.

iMessage texture:
- react_to_message: rarely, with varied emojis — skip routine turns, CONFIRM/STOP/Hi Doe, and most replies.
- use_thread_reply: occasionally when answering a direct question or correction (~1 in 3 eligible turns), never for link-only bubbles.

Safety:
- Never invent appointment dates or times. Use log_appointment with approximate timing when vague.
- For approximate appointments, repeat the user's vague wording — never convert to an exact datetime.
- Use log_family_member for new family members and update_family_member for corrections. Use relationship child for sons/daughters.
- Use add_medication and add_condition for profile medical info — never remember_fact for those.
- When the patient corrects a med or condition, update or remove the existing row. Do not leave the old name on the profile.
- Never claim a definitive diagnosis. Flag emergencies clearly.
- Irreversible browser actions need request_commit, then the patient replies CONFIRM.
- After useful browser findings, you may store a one-line outcome via remember_fact.`;
  assertToolPromptCoverage(prompt);
  return prompt;
}

export { DOEDTC_AGENT_TOOLS } from "@/lib/doedtc/doedtc-agent-tools";
export { generateDoeDtcAssessment } from "@/lib/doedtc/doedtc-assessment";

async function callDoeDtcAgent(messages: ChatMessage[]): Promise<{
  message: {
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: { name: string; arguments: string };
    }>;
  };
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Doe agent is not configured: OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: resolveDoeDtcAgentModel(),
      temperature: AGENT_TOOL_TEMPERATURE,
      tools: DOEDTC_AGENT_TOOLS,
      tool_choice: "auto",
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Doe agent failed: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: "function";
          function: { name: string; arguments: string };
        }>;
      };
    }>;
  };

  const message = json.choices?.[0]?.message;
  if (!message) {
    throw new Error("Doe agent returned no message.");
  }

  return { message };
}

export async function runDoeDtcAgentTurnLegacy(params: {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  const timezone = normalizeScheduledTimezone(null);

  const [snapshot, messageHistory, relevantMemoryRows, recentGuides, pendingRow, playbookNotes] =
    await Promise.all([
      getDoeDtcProfileSnapshot(params.user.id),
      listDoeDtcMessages(params.user.id, 40),
      searchDoeDtcMem0Memories({ userId: params.user.id, query: params.inboundText, topK: 5 }),
      listGuidesForUser(params.user.id),
      getAgentPending(params.user.id),
      searchDoeDtcMem0Playbook({ userId: params.user.id, query: params.inboundText, topK: 3 }),
    ]);

  if (pendingRow && parseDecline(params.inboundText)) {
    await clearAgentPending(params.user.id);
    return {
      replyText: "Okay, I won't.",
      assessmentRan: false,
    };
  }

  let affirmCommitFailedNote: string | null = null;
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
    affirmCommitFailedNote = `Pending ${pendingRow.commit_tool} failed: ${commit.error}. Fix the stored args and call ${pendingRow.commit_tool} — do not propose again or re-ask the same confirmation.`;
  }

  const pendingBlock = pendingRow
    ? `${formatAgentPendingForPrompt(pendingRow)}${affirmCommitFailedNote ? `\n${affirmCommitFailedNote}` : ""}`
    : "";
  const playbookBlock =
    playbookNotes.length > 0 ? playbookNotes.map((note) => `- ${note}`).join("\n") : "None yet.";
  const activeWorkflows = await listActiveWorkflowsForUser(params.user.id);

  const systemPrompt = buildDoeDtcAgentSystemPrompt({
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

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: params.inboundText },
  ];

  const turnState = createInitialToolTurnState(
    await getActiveDoeDtcBrowserJobId(params.user.id),
  );
  turnState.turnId = createDoeDtcAgentTurnId();
  let lastModelContent: string | null = null;
  let reflectionNoteInjected = false;
  let refusalRetryInjected = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const toolErrorsThisRound: string[] = [];
    const { message } = await callDoeDtcAgent(messages);
    lastModelContent = message.content;

    if (!message.tool_calls?.length) {
      let replyText = buildReplyFromTurnState({
        modelContent: message.content,
        assessmentSummary: turnState.assessmentSummary,
        browserNeedsConfirm: turnState.browserNeedsConfirm,
        browserExcerpt: turnState.browserExcerpt,
        browserUserMessage: turnState.browserUserMessage,
        workUrl: turnState.workUrl,
        screenshotUrl: turnState.screenshotUrl,
        vaultUrl: turnState.vaultUrl,
        liveViewUrl: turnState.liveViewUrl,
        sessionUrl: turnState.sessionUrl,
        listenUrl: turnState.listenUrl,
        profileUrl: turnState.profileUrl,
        feedbackUrl: turnState.feedbackUrl,
        prepareUrl: turnState.prepareUrl,
        guideUrl: turnState.guideUrl,
        artifactShareUrl: turnState.artifactShareUrl,
        preservePendingOffer: turnState.preservePendingOffer,
      });

      if (
        shouldRetryEmptyRefusal({
          replyText,
          toolsExecuted: turnState.toolsExecuted ?? [],
        }) &&
        !refusalRetryInjected
      ) {
        refusalRetryInjected = true;
        messages.push({
          role: "assistant",
          content: message.content,
        });
        messages.push({
          role: "system",
          content: buildRefusalRetrySystemMessage(params.inboundText),
        });
        continue;
      }

      const reconciled = await reconcileReplyClaims({
        user: params.user,
        inboundText: params.inboundText,
        replyText,
        state: turnState,
        toolsExecuted: turnState.toolsExecuted ?? [],
      });
      turnState.listenUrl = reconciled.listenUrl ?? turnState.listenUrl;
      turnState.profileUrl = reconciled.profileUrl ?? turnState.profileUrl;
      turnState.sessionUrl = reconciled.sessionUrl ?? turnState.sessionUrl;
      replyText = reconciled.replyText;

      if (!message.content?.trim()) {
        replyText = buildReplyFromTurnState({
          assessmentSummary: turnState.assessmentSummary,
          browserNeedsConfirm: turnState.browserNeedsConfirm,
          browserExcerpt: turnState.browserExcerpt,
          browserUserMessage: turnState.browserUserMessage,
          workUrl: turnState.workUrl,
          screenshotUrl: turnState.screenshotUrl,
          vaultUrl: turnState.vaultUrl,
          liveViewUrl: turnState.liveViewUrl,
          sessionUrl: turnState.sessionUrl,
          listenUrl: turnState.listenUrl,
          profileUrl: turnState.profileUrl,
          feedbackUrl: turnState.feedbackUrl,
          prepareUrl: turnState.prepareUrl,
          guideUrl: turnState.guideUrl,
          artifactShareUrl: turnState.artifactShareUrl,
          preservePendingOffer: turnState.preservePendingOffer,
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
        assessmentRan: turnState.assessmentRan,
        preservePendingOffer: turnState.preservePendingOffer,
      };
    }

    messages.push({
      role: "assistant",
      content: message.content,
      tool_calls: message.tool_calls,
    });

    const toolCtx = {
      user: params.user,
      inboundText: params.inboundText,
      inboundMessageId: params.inboundMessageId,
      snapshot,
    };

    for (const toolCall of message.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
      const output = await executeDoeDtcTool({
        name: toolCall.function.name,
        args,
        ctx: toolCtx,
        state: turnState,
      });

      if (output.ok === false && typeof output.error === "string") {
        toolErrorsThisRound.push(`${toolCall.function.name}: ${output.error}`);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(output),
      });
    }

    if (toolErrorsThisRound.length > 0 && !reflectionNoteInjected) {
      reflectionNoteInjected = true;
      messages.push({
        role: "system",
        content: `Tool error(s): ${toolErrorsThisRound.join("; ")}. Fix the tool args and commit — do not re-ask the same confirmation. Do not tell the user the time already passed unless they asked for a time that cannot work.`,
      });
    }
  }

  const reconciled = await reconcileReplyClaims({
    user: params.user,
    inboundText: params.inboundText,
    replyText: lastModelContent ?? "",
    state: turnState,
    toolsExecuted: turnState.toolsExecuted ?? [],
  });
  turnState.listenUrl = reconciled.listenUrl ?? turnState.listenUrl;
  turnState.profileUrl = reconciled.profileUrl ?? turnState.profileUrl;
  turnState.sessionUrl = reconciled.sessionUrl ?? turnState.sessionUrl;

  return {
    replyText: buildReplyFromTurnState({
      modelContent: reconciled.replyText,
      assessmentSummary: turnState.assessmentSummary,
      browserNeedsConfirm: turnState.browserNeedsConfirm,
      browserExcerpt: turnState.browserExcerpt,
      browserUserMessage: turnState.browserUserMessage,
      workUrl: turnState.workUrl,
      screenshotUrl: turnState.screenshotUrl,
      vaultUrl: turnState.vaultUrl,
      liveViewUrl: turnState.liveViewUrl,
      sessionUrl: turnState.sessionUrl,
      listenUrl: turnState.listenUrl,
      profileUrl: turnState.profileUrl,
      feedbackUrl: turnState.feedbackUrl,
      prepareUrl: turnState.prepareUrl,
      guideUrl: turnState.guideUrl,
      artifactShareUrl: turnState.artifactShareUrl,
      preservePendingOffer: turnState.preservePendingOffer,
    }),
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

export async function runDoeDtcAgentTurn(params: {
  user: import("@/lib/doedtc/doedtc-types").DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
}): Promise<DoeDtcAgentTurnResult> {
  if (resolveDoeDtcAgentRuntime() === "sdk") {
    const { runDoeDtcAgentTurnSdk } = await import("@/lib/doedtc/agent/run-sdk");
    return runDoeDtcAgentTurnSdk(params);
  }
  return runDoeDtcAgentTurnLegacy(params);
}