import { isLifecycleReactionEmoji } from "@/lib/doedtc/doedtc-reactions";
import {
  actDoeDtcBrowser,
  computerDoeDtcBrowser,
  navigateDoeDtcBrowser,
  requestDoeDtcBrowserCommit,
  requestDoeDtcLiveLogin,
  requestDoeDtcVaultLink,
  snapshotDoeDtcBrowser,
  startDoeDtcBrowserTaskAsync,
  toUserSafeBrowserError,
} from "@/lib/doedtc/doedtc-browser";
import { getDoeDtcBrowserJobById } from "@/lib/doedtc/doedtc-browser-db";
import { buildScheduledTextPendingArgs } from "@/lib/doedtc/doedtc-agent-commit";
import {
  addDoeDtcMem0Fact,
  addDoeDtcMem0PlaybookNote,
} from "@/lib/doedtc/doedtc-memory";
import { clearAgentPending, getAgentPending, setAgentPending } from "@/lib/doedtc/doedtc-pending";
import {
  doeDtcArtifactShareUrl,
  doeDtcCareUrl,
  doeDtcFeedbackUrl,
  doeDtcGuideUrl,
  doeDtcListenUrl,
  doeDtcPrepareUrl,
  doeDtcSessionUrl,
} from "@/lib/doedtc/doedtc-copy";
import {
  formatDoeDtcAppointmentWhen,
  normalizeDoeDtcAppointmentTiming,
  type DoeDtcAppointmentTimingPrecision,
} from "@/lib/doedtc/doedtc-appointment-timing";
import { normalizeArtifactLayout } from "@/lib/doedtc/doedtc-artifacts";
import {
  addDoeDtcAppointment,
  addDoeDtcResult,
  addDoeDtcHouseholdMember,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  archiveDoeDtcArtifact,
  createDoeDtcArtifact,
  createDoeDtcHouseholdInvite,
  deleteDoeDtcMemory,
  findDoeDtcArtifactByTitle,
  logDoeDtcArtifactEntry,
  removeDoeDtcAppointment,
  removeDoeDtcResult,
  removeDoeDtcArtifactEntry,
  removeDoeDtcCondition,
  removeDoeDtcMedication,
  removeDoeDtcHouseholdMember,
  removeDoeDtcSymptom,
  renameDoeDtcCondition,
  renameDoeDtcMedication,
  resolveDoeDtcHouseholdSubject,
  revokeDoeDtcHouseholdAccess,
  shareDoeDtcArtifact,
  unshareDoeDtcArtifact,
  updateDoeDtcAppointment,
  updateDoeDtcArtifact,
  updateDoeDtcArtifactEntry,
  updateDoeDtcHouseholdMember,
  updateDoeDtcSymptom,
  createDoeDtcListenSession,
  getDoeDtcListenSession,
  createDoeDtcPreparation,
  createDoeDtcTicket,
  insertDoeDtcMemory,
  insertDoeDtcSymptom,
  linkDoeDtcSymptomToAssessment,
  loadDoeDtcHouseholdAccessContext,
  saveDoeDtcAssessment,
} from "@/lib/doedtc/doedtc-db";
import { findHouseholdMemberByName, isHouseholdMemberAdult } from "@/lib/doedtc/doedtc-household";
import {
  findAccountabilityPactForUser,
  inviteAccountabilityPartner,
  logAccountabilityCheckIn,
  pauseAccountabilityPact,
  resumeAccountabilityPact,
  startAccountabilityPact,
  withdrawAccountabilityPact,
} from "@/lib/doedtc/doedtc-accountability-db";
import { normalizeAccountabilityMechanics } from "@/lib/doedtc/doedtc-accountability";
import {
  cancelScheduledText,
  createScheduledText,
  listScheduledTextsForUser,
  sendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled-db";
import {
  buildScheduledTextFile,
  ensureFutureSendAt,
  formatScheduledSendAtLabel,
  normalizeScheduledTimezone,
  parseScheduledSendAt,
  serializeScheduledTextFile,
  shouldSendScheduledTextInline,
} from "@/lib/doedtc/doedtc-scheduled";
import {
  buildHabitWorkflowConfig,
  cancelWorkflow,
  createComposedWorkflow,
  createHabitWorkflow,
  listActiveWorkflowsForUser,
} from "@/lib/doedtc/doedtc-workflows";
import {
  validateWorkflowGraph,
  type WorkflowGraph,
} from "@/lib/doedtc/doedtc-workflow-graph";
import {
  archiveDoeDtcGuide,
  createDoeDtcGuide,
  listGuidesForUser,
  saveDoeDtcGuide,
  unsaveDoeDtcGuide,
  updateDoeDtcGuide,
} from "@/lib/doedtc/doedtc-guides-db";
import {
  findGuideByTitleHint,
  formatGuideForAgent,
  normalizeGuideBlocks,
  normalizeGuideLayout,
} from "@/lib/doedtc/doedtc-guides";
import { sendDoeDtcFamilyInviteMessage, sendDoeDtcHouseholdAccessRevokedNotice } from "@/lib/doedtc/doedtc-messaging";
import {
  DOEDTC_PROFILE_READ_TABS,
  readDoeDtcProfileTab,
} from "@/lib/doedtc/doedtc-profile-read";
import {
  normalizeDoeDtcFamilyRelationship,
  resolveDoeDtcFamilyMemberName,
} from "@/lib/doedtc/doedtc-family-relationship";
import { generateDoeDtcAssessment } from "@/lib/doedtc/doedtc-assessment";
import { logDoeDtcAgentToolCall } from "@/lib/doedtc/doedtc-agent-audit";
import {
  ensureTurnId,
  recordToolExecution,
} from "@/lib/doedtc/agent/honesty";
import {
  askedForPrivateAppLink,
  buildPrivateAppLink,
} from "@/lib/doedtc/agent/deliverable-policy";
import { appointmentNotesForProxy } from "@/lib/doedtc/doedtc-household-policy";
import {
  REPEAT_TOOL_ERROR,
  shouldAllowProfileLink,
  toolCallSignature,
} from "@/lib/doedtc/agent/turn-integrity";
import type { DoeDtcAttachmentContext } from "@/lib/doedtc/agent/attachments";
import { runParseDocumentTool, runReadAttachmentTool } from "@/lib/doedtc/agent/document-parse";
import type { DoeDtcAgentToolExecutionRecord } from "@/lib/doedtc/doedtc-agent-audit";
import type { DoeDtcFamilyMemberInput, DoeDtcProfileSnapshot, DoeDtcProfileTab, DoeDtcUserRow } from "@/lib/doedtc/doedtc-types";

export type DoeDtcToolTurnState = {
  turnId?: string;
  toolsExecuted?: DoeDtcAgentToolExecutionRecord[];
  seenToolSignatures?: Set<string>;
  profileLinkCalls?: number;
  familyInvitesSent?: string[];
  familyInviteErrors?: string[];
  latestSymptomId: string | null;
  assessmentRan: boolean;
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
  replyToInbound: boolean;
  browserNeedsConfirm: boolean;
  activeBrowserJobId: string | null;
  browserJobDispatched?: boolean;
  browserBusy?: boolean;
  browserExcerpt?: string;
  browserUserMessage?: string;
  preservePendingOffer: boolean;
  assessmentSummary?: string;
};

export type DoeDtcToolExecutionContext = {
  user: DoeDtcUserRow;
  inboundText: string;
  inboundMessageId?: string;
  snapshot: DoeDtcProfileSnapshot;
  attachmentContext?: DoeDtcAttachmentContext;
};

export function createInitialToolTurnState(activeBrowserJobId: string | null): DoeDtcToolTurnState {
  return {
    turnId: undefined,
    toolsExecuted: [],
    familyInvitesSent: [],
    familyInviteErrors: [],
    latestSymptomId: null,
    assessmentRan: false,
    replyToInbound: false,
    browserNeedsConfirm: false,
    activeBrowserJobId,
    preservePendingOffer: false,
  };
}

async function resolveAgentHouseholdSubject(params: {
  viewerUserId: string;
  args: Record<string, unknown>;
  requireEdit?: boolean;
}): Promise<
  | {
      subjectUserId: string;
      subjectMemberId?: string;
      subjectMemberName?: string;
      proxied?: boolean;
      nextStep?: string;
    }
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
    proxied: resolved.proxied,
    nextStep: resolved.nextStep,
  };
}

function withHouseholdProxyMeta(
  output: Record<string, unknown>,
  subject: { proxied?: boolean; nextStep?: string; subjectMemberName?: string },
): Record<string, unknown> {
  if (!subject.proxied) return output;
  return {
    ...output,
    proxied: true,
    logged_on: "parent_chart",
    for_member: subject.subjectMemberName,
    next_step: subject.nextStep,
  };
}

export async function executeDoeDtcTool(params: {
  name: string;
  args: Record<string, unknown>;
  ctx: DoeDtcToolExecutionContext;
  state: DoeDtcToolTurnState;
}): Promise<Record<string, unknown>> {
  const { name, args, ctx, state } = params;
  ensureTurnId(state);

  if (!state.seenToolSignatures) {
    state.seenToolSignatures = new Set();
  }
  const signature = toolCallSignature(name, args);
  if (state.seenToolSignatures.has(signature)) {
    return { ok: false, error: REPEAT_TOOL_ERROR };
  }
  state.seenToolSignatures.add(signature);

  if (name === "send_profile_link") {
    state.profileLinkCalls = (state.profileLinkCalls ?? 0) + 1;
    if (
      !shouldAllowProfileLink({
        inboundText: ctx.inboundText,
        state,
        profileLinkCalls: state.profileLinkCalls,
      })
    ) {
      return { ok: false, error: "Profile link not needed for this request." };
    }
  }

  const started = Date.now();
  let output: Record<string, unknown>;
  try {
    output = await executeDoeDtcToolInner({ name, args, ctx, state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tool execution failed.";
    output = { ok: false, error: message };
  }

  const ok = output.ok !== false;
  const errorText = typeof output.error === "string" ? output.error : undefined;
  recordToolExecution(state, { name, ok, error: errorText });
  void logDoeDtcAgentToolCall({
    turnId: state.turnId!,
    userId: ctx.user.id,
    toolName: name,
    args,
    ok,
    error: errorText,
    durationMs: Date.now() - started,
  });
  return output;
}

async function executeDoeDtcToolInner(params: {
  name: string;
  args: Record<string, unknown>;
  ctx: DoeDtcToolExecutionContext;
  state: DoeDtcToolTurnState;
}): Promise<Record<string, unknown>> {
  const { name, args, ctx, state } = params;
  let output: Record<string, unknown>;
  try {
    if (name === "log_symptoms") {
      const rawText = String(args.raw_text ?? ctx.inboundText).trim();
      const row = await insertDoeDtcSymptom({
        userId: ctx.user.id,
        rawText,
        summary: typeof args.summary === "string" ? args.summary : null,
        severity:
          args.severity === "mild" ||
          args.severity === "moderate" ||
          args.severity === "severe"
            ? args.severity
            : "unknown",
        onset: typeof args.onset === "string" ? args.onset : null,
        tags: Array.isArray(args.tags)
          ? args.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
          : [],
      });
      state.latestSymptomId = row.id;
      output = { ok: true, id: row.id };
    } else if (name === "run_assessment") {
      const symptomsText = String(args.symptoms_text ?? ctx.inboundText).trim();
      const result = await generateDoeDtcAssessment({
        symptomsText,
        medications: ctx.snapshot.medications,
        conditions: ctx.snapshot.conditions,
        whyDoe: ctx.user.why_doe ?? "",
        focus: typeof args.focus === "string" ? args.focus : undefined,
      });
      const saved = await saveDoeDtcAssessment({
        userId: ctx.user.id,
        symptomsText,
        result,
      });
      if (state.latestSymptomId) {
        await linkDoeDtcSymptomToAssessment({
          symptomId: state.latestSymptomId,
          assessmentId: saved.id,
        });
      }
      state.assessmentRan = true;
      state.assessmentSummary = result.summary;
      state.careUrl = doeDtcCareUrl(ctx.user.care_token);
      output = {
        ok: true,
        assessment_id: saved.id,
        summary: result.summary,
        link_sent_separately: true,
      };
    } else if (name === "log_appointment") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const precision = String(args.timing_precision ?? "").trim() as DoeDtcAppointmentTimingPrecision;
      const normalized = normalizeDoeDtcAppointmentTiming({
        title: String(args.title ?? ""),
        timing_precision: precision,
        starts_at: typeof args.starts_at === "string" ? args.starts_at : null,
        timing_note: typeof args.timing_note === "string" ? args.timing_note : null,
        location: typeof args.location === "string" ? args.location : null,
        notes: typeof args.notes === "string" ? args.notes : null,
      });
      const row = await addDoeDtcAppointment({
        userId: subject.subjectUserId,
        title: normalized.title,
        startsAt: normalized.startsAt,
        timingNote: normalized.timingNote,
        location: normalized.location,
        notes: appointmentNotesForProxy({
          notes: normalized.notes,
          proxied: subject.proxied,
          memberName: subject.subjectMemberName,
        }),
      });
      output = withHouseholdProxyMeta(
        {
          ok: true,
          id: row.id,
          title: row.title,
          starts_at: row.starts_at,
          timing_note: row.timing_note,
        },
        subject,
      );
      const when = formatDoeDtcAppointmentWhen(row);
      await addDoeDtcMem0Fact({
        userId: ctx.user.id,
        fact: `Appointment: ${row.title} — ${when}`,
      });
    } else if (name === "log_family_member") {
      const relationshipRaw = String(args.relationship ?? "").trim();
      const relationship = normalizeDoeDtcFamilyRelationship(relationshipRaw);
      if (!relationship) throw new Error("Invalid relationship.");
      const fullName = resolveDoeDtcFamilyMemberName({
        fullName: String(args.full_name ?? ""),
        relationship,
      });
      if (!fullName) throw new Error("full_name is required.");
      const row = await addDoeDtcHouseholdMember({
        adminUserId: ctx.user.id,
        fullName,
        relationship,
        phone: typeof args.phone === "string" ? args.phone : null,
        dateOfBirth: typeof args.date_of_birth === "string" ? args.date_of_birth : null,
      });
      output = {
        ok: true,
        id: row.id,
        full_name: row.full_name,
        relationship: row.relationship,
        status: row.status,
        invite_available: Boolean(row.phone && row.status === "pending"),
      };
    } else if (name === "send_family_invite") {
      const memberId = String(args.member_id ?? "").trim();
      const memberName = String(args.member_name ?? "").trim();
      let resolvedMemberId = memberId;
      if (!resolvedMemberId && memberName) {
        const { members } = await loadDoeDtcHouseholdAccessContext(ctx.user.id);
        const member = findHouseholdMemberByName(members, memberName);
        if (!member) throw new Error("Family member not found.");
        resolvedMemberId = member.id;
      }
      if (!resolvedMemberId) throw new Error("member_id or member_name is required.");
      const { invite, member } = await createDoeDtcHouseholdInvite({
        adminUserId: ctx.user.id,
        memberId: resolvedMemberId,
      });
      const memberPhone = member.phone?.trim();
      if (!memberPhone) throw new Error("Add a phone number before sending an invite.");
      await sendDoeDtcFamilyInviteMessage({
        adminUser: ctx.user,
        memberPhone,
        inviteToken: invite.token,
        memberName: member.full_name,
      });
      if (!state.familyInvitesSent) state.familyInvitesSent = [];
      state.familyInvitesSent.push(member.full_name);
      output = {
        ok: true,
        member_id: member.id,
        full_name: member.full_name,
        invite_sent: true,
      };
    } else if (name === "update_family_member") {
      const relationshipRaw =
        typeof args.relationship === "string" ? String(args.relationship).trim() : undefined;
      const relationship = relationshipRaw
        ? normalizeDoeDtcFamilyRelationship(relationshipRaw)
        : undefined;
      if (relationshipRaw && !relationship) throw new Error("Invalid relationship.");
      const row = await updateDoeDtcHouseholdMember({
        adminUserId: ctx.user.id,
        memberId: typeof args.member_id === "string" ? args.member_id : undefined,
        memberName: typeof args.member_name === "string" ? args.member_name : undefined,
        fullName: typeof args.full_name === "string" ? args.full_name : undefined,
        relationship: relationship ?? undefined,
        phone: args.phone === null ? null : typeof args.phone === "string" ? args.phone : undefined,
        dateOfBirth:
          args.date_of_birth === null
            ? null
            : typeof args.date_of_birth === "string"
              ? args.date_of_birth
              : undefined,
        gender:
          args.gender === null
            ? null
            : typeof args.gender === "string"
              ? (args.gender as DoeDtcFamilyMemberInput["gender"])
              : undefined,
      });
      output = {
        ok: true,
        id: row.id,
        full_name: row.full_name,
        relationship: row.relationship,
        status: row.status,
        invite_available: Boolean(row.phone && row.status === "pending"),
        updated: true,
      };
    } else if (name === "remove_family_member") {
      const memberId = String(args.member_id ?? "").trim();
      const memberName = String(args.member_name ?? "").trim();
      let resolvedMemberId = memberId;
      if (!resolvedMemberId && memberName) {
        const { members } = await loadDoeDtcHouseholdAccessContext(ctx.user.id);
        const member = findHouseholdMemberByName(members, memberName);
        if (!member) throw new Error("Family member not found.");
        resolvedMemberId = member.id;
      }
      if (!resolvedMemberId) throw new Error("member_id or member_name is required.");
      await removeDoeDtcHouseholdMember({
        adminUserId: ctx.user.id,
        memberId: resolvedMemberId,
      });
      output = { ok: true, member_id: resolvedMemberId, removed: true };
    } else if (name === "update_appointment") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const appointmentId = String(args.appointment_id ?? "").trim();
      if (!appointmentId) throw new Error("appointment_id is required.");
      const precision =
        typeof args.timing_precision === "string"
          ? (String(args.timing_precision).trim() as DoeDtcAppointmentTimingPrecision)
          : undefined;
      const normalized =
        precision !== undefined
          ? normalizeDoeDtcAppointmentTiming({
              title: typeof args.title === "string" ? args.title : "",
              timing_precision: precision,
              starts_at: typeof args.starts_at === "string" ? args.starts_at : null,
              timing_note: typeof args.timing_note === "string" ? args.timing_note : null,
              location: typeof args.location === "string" ? args.location : null,
              notes: typeof args.notes === "string" ? args.notes : null,
            })
          : null;
      const row = await updateDoeDtcAppointment({
        userId: subject.subjectUserId,
        appointmentId,
        title: normalized?.title ?? (typeof args.title === "string" ? args.title : undefined),
        startsAt:
          normalized?.startsAt ??
          (typeof args.starts_at === "string" ? args.starts_at : undefined),
        timingNote:
          normalized?.timingNote ??
          (typeof args.timing_note === "string" ? args.timing_note : undefined),
        location:
          normalized?.location ??
          (typeof args.location === "string" ? args.location : undefined),
        notes: normalized?.notes ?? (typeof args.notes === "string" ? args.notes : undefined),
      });
      output = {
        ok: true,
        id: row.id,
        title: row.title,
        starts_at: row.starts_at,
        timing_note: row.timing_note,
        updated: true,
      };
    } else if (name === "cancel_appointment") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const appointmentId = String(args.appointment_id ?? "").trim();
      if (!appointmentId) throw new Error("appointment_id is required.");
      await removeDoeDtcAppointment({
        userId: subject.subjectUserId,
        appointmentId,
      });
      output = { ok: true, appointment_id: appointmentId, cancelled: true };
    } else if (name === "update_symptom") {
      const symptomId = String(args.symptom_id ?? state.latestSymptomId ?? "").trim();
      if (!symptomId) throw new Error("symptom_id is required.");
      const row = await updateDoeDtcSymptom({
        userId: ctx.user.id,
        symptomId,
        rawText: typeof args.raw_text === "string" ? args.raw_text : undefined,
        summary: typeof args.summary === "string" ? args.summary : undefined,
        severity:
          args.severity === "mild" ||
          args.severity === "moderate" ||
          args.severity === "severe"
            ? args.severity
            : undefined,
        onset: typeof args.onset === "string" ? args.onset : undefined,
        tags: Array.isArray(args.tags)
          ? args.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 12)
          : undefined,
      });
      output = { ok: true, id: row.id, updated: true };
    } else if (name === "remove_symptom") {
      const symptomId = String(args.symptom_id ?? state.latestSymptomId ?? "").trim();
      if (!symptomId) throw new Error("symptom_id is required.");
      await removeDoeDtcSymptom({ userId: ctx.user.id, symptomId });
      output = { ok: true, symptom_id: symptomId, removed: true };
    } else if (name === "add_medication") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const medName = String(args.name ?? "").trim();
      if (!medName) throw new Error("Medication name is required.");
      const result = await appendDoeDtcMedication({ userId: subject.subjectUserId, name: medName });
      output = withHouseholdProxyMeta(
        { ok: true, name: result.name, added: result.added, subject: subject.subjectMemberName ?? "you" },
        subject,
      );
    } else if (name === "update_medication") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const from = String(args.from ?? "").trim();
      const to = String(args.to ?? "").trim();
      if (!from || !to) throw new Error("Both medication names are required.");
      const result = await renameDoeDtcMedication({ userId: subject.subjectUserId, from, to });
      output = { ok: true, from: result.from, to: result.to, updated: result.updated, subject: subject.subjectMemberName ?? "you" };
    } else if (name === "remove_medication") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const name = String(args.name ?? "").trim();
      if (!name) throw new Error("Medication name is required.");
      const result = await removeDoeDtcMedication({ userId: subject.subjectUserId, name });
      output = { ok: true, name: result.name, removed: result.removed, subject: subject.subjectMemberName ?? "you" };
    } else if (name === "add_condition") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const name = String(args.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      const result = await appendDoeDtcCondition({ userId: subject.subjectUserId, name });
      output = withHouseholdProxyMeta(
        { ok: true, name: result.name, added: result.added, subject: subject.subjectMemberName ?? "you" },
        subject,
      );
    } else if (name === "update_condition") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const from = String(args.from ?? "").trim();
      const to = String(args.to ?? "").trim();
      if (!from || !to) throw new Error("Both condition names are required.");
      const result = await renameDoeDtcCondition({ userId: subject.subjectUserId, from, to });
      output = { ok: true, from: result.from, to: result.to, updated: result.updated, subject: subject.subjectMemberName ?? "you" };
    } else if (name === "remove_condition") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const name = String(args.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      const result = await removeDoeDtcCondition({ userId: subject.subjectUserId, name });
      output = { ok: true, name: result.name, removed: result.removed, subject: subject.subjectMemberName ?? "you" };
    } else if (name === "log_result") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const title = String(args.title ?? "").trim();
      const resultedAt = String(args.resulted_at ?? "").trim();
      if (!title || !resultedAt) throw new Error("title and resulted_at are required.");
      const row = await addDoeDtcResult({
        userId: subject.subjectUserId,
        title,
        resultedAt,
        source: typeof args.source === "string" ? args.source : null,
        summary: typeof args.summary === "string" ? args.summary : null,
      });
      output = {
        ok: true,
        id: row.id,
        title: row.title,
        resulted_at: row.resulted_at,
        subject: subject.subjectMemberName ?? "you",
      };
    } else if (name === "remove_result") {
      const resultId = String(args.result_id ?? "").trim();
      if (!resultId) throw new Error("result_id is required.");
      await removeDoeDtcResult({ userId: ctx.user.id, resultId });
      output = { ok: true, id: resultId, removed: true };
    } else if (name === "create_profile_artifact") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const title = String(args.title ?? "").trim();
      if (!title) throw new Error("Tracker title is required.");
      const existing = await findDoeDtcArtifactByTitle({
        userId: subject.subjectUserId,
        title,
      });
      const row =
        existing ??
        (await createDoeDtcArtifact({
          userId: subject.subjectUserId,
          title,
          kind:
            args.kind === "counter" ||
            args.kind === "checklist" ||
            args.kind === "score" ||
            args.kind === "log"
              ? args.kind
              : undefined,
          layout: typeof args.layout === "string" ? normalizeArtifactLayout(args.layout) : undefined,
          fields: args.fields,
          blocks: args.blocks,
          goal: typeof args.goal === "number" ? args.goal : undefined,
        }));
      if (!existing || askedForPrivateAppLink(ctx.inboundText)) {
        state.profileUrl = buildPrivateAppLink({
          careToken: ctx.user.care_token,
          inboundText: ctx.inboundText,
          snapshot: ctx.snapshot,
          tab: "trackers",
          artifact: row.id,
          member: subject.subjectUserId !== ctx.user.id ? subject.subjectUserId : undefined,
        });
      }
      output = {
        ok: true,
        id: row.id,
        title: row.title,
        kind: row.kind,
        created: !existing,
        subject: subject.subjectMemberName ?? "you",
        link_sent_separately: Boolean(state.profileUrl),
      };
    } else if (name === "update_profile_artifact") {
      const artifactId = String(args.artifact_id ?? "").trim();
      if (!artifactId) throw new Error("artifact_id is required.");
      if (args.archive === true) {
        await archiveDoeDtcArtifact({ userId: ctx.user.id, artifactId });
        output = { ok: true, id: artifactId, archived: true };
      } else {
        const row = await updateDoeDtcArtifact({
          userId: ctx.user.id,
          artifactId,
          title: typeof args.title === "string" ? args.title : undefined,
          kind:
            args.kind === "counter" ||
            args.kind === "checklist" ||
            args.kind === "score" ||
            args.kind === "log"
              ? args.kind
              : undefined,
          layout: typeof args.layout === "string" ? normalizeArtifactLayout(args.layout) : undefined,
          fields: args.fields,
          blocks: args.blocks,
          goal: typeof args.goal === "number" ? args.goal : args.goal === null ? null : undefined,
        });
        if (askedForPrivateAppLink(ctx.inboundText)) {
          state.profileUrl = buildPrivateAppLink({
            careToken: ctx.user.care_token,
            inboundText: ctx.inboundText,
            snapshot: ctx.snapshot,
            tab: "trackers",
            artifact: row.id,
          });
        }
        output = {
          ok: true,
          id: row.id,
          title: row.title,
          kind: row.kind,
          link_sent_separately: Boolean(state.profileUrl),
        };
      }
    } else if (name === "log_artifact_entry") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const artifactId = String(args.artifact_id ?? "").trim();
      if (!artifactId) throw new Error("artifact_id is required.");
      const row = await logDoeDtcArtifactEntry({
        userId: subject.subjectUserId,
        artifactId,
        values: args.values,
        occurredAt: typeof args.occurred_at === "string" ? args.occurred_at : null,
      });
      if (askedForPrivateAppLink(ctx.inboundText)) {
        state.profileUrl = buildPrivateAppLink({
          careToken: ctx.user.care_token,
          inboundText: ctx.inboundText,
          snapshot: ctx.snapshot,
          tab: "trackers",
          artifact: artifactId,
          member: subject.subjectUserId !== ctx.user.id ? subject.subjectUserId : undefined,
        });
      }
      output = {
        ok: true,
        id: row.id,
        artifact_id: artifactId,
        occurred_at: row.occurred_at,
        subject: subject.subjectMemberName ?? "you",
        link_sent_separately: Boolean(state.profileUrl),
      };
    } else if (name === "share_artifact") {
      const artifactId = typeof args.artifact_id === "string" ? args.artifact_id.trim() : undefined;
      const titleHint = typeof args.title === "string" ? args.title.trim() : undefined;
      const row = await shareDoeDtcArtifact({
        userId: ctx.user.id,
        artifactId,
        titleHint,
      });
      if (!row.share_token) throw new Error("Could not create share link.");
      state.artifactShareUrl = doeDtcArtifactShareUrl(row.share_token);
      output = {
        ok: true,
        id: row.id,
        title: row.title,
        shared: true,
        link_sent_separately: true,
      };
    } else if (name === "unshare_artifact") {
      const artifactId = String(args.artifact_id ?? "").trim();
      if (!artifactId) throw new Error("artifact_id is required.");
      const row = await unshareDoeDtcArtifact({ userId: ctx.user.id, artifactId });
      output = { ok: true, id: row.id, title: row.title, shared: false };
    } else if (name === "update_artifact_entry") {
      const entryId = String(args.entry_id ?? "").trim();
      if (!entryId) throw new Error("entry_id is required.");
      const row = await updateDoeDtcArtifactEntry({
        userId: ctx.user.id,
        entryId,
        values: args.values,
        occurredAt: typeof args.occurred_at === "string" ? args.occurred_at : null,
      });
      output = {
        ok: true,
        id: row.id,
        artifact_id: row.artifact_id,
        occurred_at: row.occurred_at,
      };
    } else if (name === "remove_artifact_entry") {
      const entryId = String(args.entry_id ?? "").trim();
      if (!entryId) throw new Error("entry_id is required.");
      await removeDoeDtcArtifactEntry({ userId: ctx.user.id, entryId });
      output = { ok: true, id: entryId, removed: true };
    } else if (name === "create_preparation") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: false,
      });
      if ("error" in subject) throw new Error(subject.error);
      const prepTitle =
        typeof args.title === "string"
          ? args.title
          : subject.subjectMemberName
            ? `${subject.subjectMemberName} — visit prep`
            : undefined;
      const row = await createDoeDtcPreparation({
        userId: subject.subjectUserId,
        title: prepTitle,
        reason: typeof args.reason === "string" ? args.reason : undefined,
      });
      if (subject.subjectUserId !== ctx.user.id && typeof args.reason === "string") {
        await createDoeDtcArtifact({
          userId: subject.subjectUserId,
          title: args.reason.slice(0, 80),
          kind: "log",
        });
      }
      state.prepareUrl = doeDtcPrepareUrl(ctx.user.care_token, { preparation: row.id });
      output = {
        ok: true,
        id: row.id,
        code: row.code,
        title: row.title,
        subject: subject.subjectMemberName ?? "you",
        on_subject_profile: subject.subjectUserId !== ctx.user.id,
        link_sent_separately: true,
      };
    } else if (name === "create_guide") {
      const topic = String(args.topic ?? "").trim();
      const title = String(args.title ?? "").trim();
      if (!topic || !title) throw new Error("topic and title are required.");
      const blocks = Array.isArray(args.blocks) ? normalizeGuideBlocks(args.blocks) : undefined;
      const row = await createDoeDtcGuide({
        userId: ctx.user.id,
        title,
        topic,
        layout: normalizeGuideLayout(args.layout),
        blocks,
      });
      state.guideUrl = doeDtcGuideUrl(ctx.user.care_token, { guide: row.id });
      await setAgentPending({
        userId: ctx.user.id,
        kind: "save_guide",
        commitTool: "save_guide",
        args: { guide_id: row.id },
        summary: `Save guide "${row.title}" to profile`,
      });
      state.preservePendingOffer = true;
      output = {
        ok: true,
        id: row.id,
        title: row.title,
        layout: row.layout,
        blocks: row.blocks.length,
        link_sent_separately: true,
        next_step: "Ask if they want you to save this to their profile before calling save_guide.",
      };
    } else if (name === "save_guide") {
      const row = await saveDoeDtcGuide({
        userId: ctx.user.id,
        guideId: typeof args.guide_id === "string" ? args.guide_id : undefined,
        titleHint: typeof args.title_hint === "string" ? args.title_hint : undefined,
      });
      await clearAgentPending(ctx.user.id);
      output = { ok: true, id: row.id, title: row.title, saved: true };
    } else if (name === "update_guide") {
      if (args.archive === true || args.unsave === true) {
        const rows = await listGuidesForUser(ctx.user.id);
        const guideId = typeof args.guide_id === "string" ? args.guide_id.trim() : "";
        const titleHint = typeof args.title_hint === "string" ? args.title_hint.trim() : "";
        const target = guideId
          ? rows.find((row) => row.id === guideId)
          : titleHint
            ? findGuideByTitleHint(rows, titleHint)
            : rows[0];
        if (!target) throw new Error("Guide not found.");
        if (args.archive === true) {
          const row = await archiveDoeDtcGuide({ userId: ctx.user.id, guideId: target.id });
          output = { ok: true, id: row.id, title: row.title, archived: true };
        } else {
          const row = await unsaveDoeDtcGuide({ userId: ctx.user.id, guideId: target.id });
          output = { ok: true, id: row.id, title: row.title, unsaved: true };
        }
      } else {
        const row = await updateDoeDtcGuide({
          userId: ctx.user.id,
          guideId: typeof args.guide_id === "string" ? args.guide_id : undefined,
          titleHint: typeof args.title_hint === "string" ? args.title_hint : undefined,
          title: typeof args.title === "string" ? args.title : undefined,
          topic: typeof args.topic === "string" ? args.topic : undefined,
          layout: args.layout ? normalizeGuideLayout(args.layout) : undefined,
          blocks: Array.isArray(args.blocks) ? normalizeGuideBlocks(args.blocks) : undefined,
          replaceBlocks: args.replace_blocks === true,
        });
        state.guideUrl = doeDtcGuideUrl(ctx.user.care_token, { guide: row.id });
        output = {
          ok: true,
          id: row.id,
          title: row.title,
          blocks: row.blocks.length,
          link_sent_separately: true,
        };
      }
    } else if (name === "list_guides") {
      const rows = await listGuidesForUser(ctx.user.id);
      output = {
        ok: true,
        guides: rows.map((row) => ({
          id: row.id,
          title: row.title,
          topic: row.topic,
          saved: Boolean(row.saved_at),
          layout: row.layout,
        })),
      };
    } else if (name === "send_guide_link") {
      const rows = await listGuidesForUser(ctx.user.id);
      const guideId = typeof args.guide_id === "string" ? args.guide_id.trim() : "";
      const titleHint = typeof args.title_hint === "string" ? args.title_hint.trim() : "";
      const match = guideId
        ? rows.find((row) => row.id === guideId)
        : titleHint
          ? rows.find(
              (row) =>
                row.title.toLowerCase().includes(titleHint.toLowerCase()) ||
                row.topic.toLowerCase().includes(titleHint.toLowerCase()),
            )
          : rows[0];
      if (!match) throw new Error("Guide not found.");
      state.guideUrl = doeDtcGuideUrl(ctx.user.care_token, { guide: match.id });
      output = { ok: true, id: match.id, title: match.title, link_sent_separately: true };
    } else if (name === "submit_ticket") {
      const kind = args.kind === "bug" ? "bug" : "feedback";
      const title = String(args.title ?? "").trim();
      const body = String(args.body ?? "").trim();
      if (!title || !body) throw new Error("Title and description are required.");
      const row = await createDoeDtcTicket({
        userId: ctx.user.id,
        kind,
        title,
        body,
      });
      state.feedbackUrl = doeDtcFeedbackUrl(ctx.user.care_token, { ticket: row.id });
      output = {
        ok: true,
        id: row.id,
        kind: row.kind,
        title: row.title,
        status: row.status,
        link_sent_separately: true,
      };
    } else if (name === "remember_fact") {
      const fact = String(args.fact ?? "").trim();
      if (!fact) throw new Error("Fact is required.");
      const row = await insertDoeDtcMemory({
        userId: ctx.user.id,
        fact,
        category: typeof args.category === "string" ? args.category : "general",
      });
      await addDoeDtcMem0Fact({ userId: ctx.user.id, fact: row.fact });
      output = { ok: true, id: row.id, fact: row.fact };
    } else if (name === "forget_fact") {
      const row = await deleteDoeDtcMemory({
        userId: ctx.user.id,
        memoryId: typeof args.memory_id === "string" ? args.memory_id : undefined,
        factHint: typeof args.fact === "string" ? args.fact : undefined,
      });
      if (!row) throw new Error("Memory not found.");
      output = { ok: true, id: row.id, fact: row.fact, removed: true };
    } else if (name === "start_browser_task") {
      if (state.browserBusy) {
        output = { ok: false, error: "Browser task already running in this turn." };
      } else {
        state.browserBusy = true;
        const started = await startDoeDtcBrowserTaskAsync({
          user: ctx.user,
          intent: String(args.intent ?? ""),
          url: String(args.url ?? ""),
          mode:
            args.mode === "login" || args.mode === "write" || args.mode === "research"
              ? args.mode
              : "research",
          turnId: state.turnId,
        });
        if (!started.ok) {
          state.browserUserMessage = started.user_message;
          state.browserBusy = false;
          output = {
            ok: false,
            error: started.error,
            user_message: started.user_message,
          };
        } else {
          state.activeBrowserJobId = started.jobId;
          state.browserJobDispatched = true;
          if (state.turnId) {
            const { markDoeDtcTurnBrowsing } = await import("@/lib/doedtc/doedtc-turn-lifecycle");
            void markDoeDtcTurnBrowsing({
              turnId: state.turnId,
              browserJobId: started.jobId,
            });
          }
          output = {
            ok: true,
            status: "running",
            job_id: started.jobId,
            host: started.host,
            screenshot_pending: true,
          };
        }
      }
    } else if (name === "browser_navigate") {
      const jobId = state.activeBrowserJobId ?? "";
      const result = await navigateDoeDtcBrowser({
        user: ctx.user,
        jobId,
        url: String(args.url ?? ""),
      });
      output = result;
    } else if (name === "browser_act") {
      const jobId = state.activeBrowserJobId ?? "";
      const result = await actDoeDtcBrowser({
        user: ctx.user,
        jobId,
        action:
          args.action === "click" || args.action === "type" || args.action === "scroll"
            ? args.action
            : "scroll",
        selector: typeof args.selector === "string" ? args.selector : undefined,
        text: typeof args.text === "string" ? args.text : undefined,
      });
      if (
        result.ok &&
        /\b(ss|screenshot|snap(?:shot)?|picture|photo)\b/i.test(ctx.inboundText)
      ) {
        const shot = await snapshotDoeDtcBrowser({
          user: ctx.user,
          jobId,
          caption: typeof args.text === "string" ? args.text : ctx.inboundText,
        });
        if (shot.workUrl) state.workUrl = shot.workUrl;
        if (shot.screenshotUrl) state.screenshotUrl = shot.screenshotUrl;
        if (shot.excerpt) state.browserExcerpt = shot.excerpt;
        output = {
          ...result,
          screenshot_sent_separately: Boolean(shot.screenshotUrl),
        };
      } else if (!result.ok) {
        state.browserUserMessage = toUserSafeBrowserError(result.error ?? "Browser action failed.");
        output = { ...result, user_message: state.browserUserMessage };
      } else {
        output = result;
      }
    } else if (name === "browser_computer") {
      const jobId = state.activeBrowserJobId ?? "";
      const actionName = String(args.action ?? "").trim();
      const result = await computerDoeDtcBrowser({
        user: ctx.user,
        jobId,
        action:
          actionName === "click_mouse"
            ? {
                type: "click_mouse",
                x: typeof args.x === "number" ? args.x : 640,
                y: typeof args.y === "number" ? args.y : 360,
              }
            : actionName === "type_text"
              ? { type: "type_text", text: typeof args.text === "string" ? args.text : "" }
              : actionName === "press_key"
                ? {
                    type: "press_key",
                    keys: Array.isArray(args.keys)
                      ? args.keys.filter((key): key is string => typeof key === "string")
                      : ["Return"],
                  }
                : actionName === "screenshot"
                  ? { type: "screenshot" }
                  : {
                      type: "scroll",
                      x: typeof args.x === "number" ? args.x : 640,
                      y: typeof args.y === "number" ? args.y : 400,
                    },
      });
      if (!result.ok) {
        state.browserUserMessage = toUserSafeBrowserError(result.error ?? "Computer action failed.");
        output = { ...result, user_message: state.browserUserMessage };
      } else {
        if (result.workUrl) {
          state.workUrl = result.workUrl;
        }
        if (result.screenshotUrl) {
          state.screenshotUrl = result.screenshotUrl;
        }
        if (result.excerpt) {
          state.browserExcerpt = result.excerpt;
        }
        output = {
          ok: result.ok,
          url: result.url,
          title: result.title,
          excerpt: result.excerpt,
          screenshot_sent_separately: Boolean(result.screenshotUrl),
          link_sent_separately: Boolean(result.workUrl),
        };
      }
    } else if (name === "browser_snapshot") {
      const jobId = state.activeBrowserJobId ?? "";
      const pollMs = state.browserJobDispatched ? 20_000 : 0;
      const started = Date.now();
      let result = await snapshotDoeDtcBrowser({
        user: ctx.user,
        jobId,
        caption: typeof args.caption === "string" ? args.caption : undefined,
      });

      while (
        state.browserJobDispatched &&
        !result.screenshotUrl &&
        Date.now() - started < pollMs
      ) {
        const job = await getDoeDtcBrowserJobById(jobId);
        if (job?.status === "committed" || job?.status === "failed") {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        result = await snapshotDoeDtcBrowser({
          user: ctx.user,
          jobId,
          caption: typeof args.caption === "string" ? args.caption : undefined,
        });
      }

      if (state.browserJobDispatched && !result.screenshotUrl && !result.workUrl) {
        output = {
          ok: true,
          status: "pending",
          job_id: jobId,
          message: "Screenshot is still rendering — it will arrive as a follow-up message.",
        };
      } else {
        if (result.workUrl) {
          state.workUrl = result.workUrl;
        }
        if (result.screenshotUrl) {
          state.screenshotUrl = result.screenshotUrl;
        }
        if (result.excerpt) {
          state.browserExcerpt = result.excerpt;
        }
        output = {
          ok: result.ok,
          url: result.url,
          title: result.title,
          excerpt: result.excerpt,
          screenshot_sent_separately: Boolean(result.screenshotUrl),
          link_sent_separately: Boolean(result.workUrl),
        };
      }
    } else if (name === "request_vault") {
      const jobId = state.activeBrowserJobId ?? "";
      const vault = await requestDoeDtcVaultLink({
        user: ctx.user,
        jobId,
        host: String(args.host ?? ""),
      });
      if (!vault.ok) {
        output = vault;
      } else {
        state.vaultUrl = vault.vaultUrl;
        output = { ok: true, link_sent_separately: true };
      }
    } else if (name === "request_live_login") {
      const jobId = state.activeBrowserJobId ?? "";
      const live = await requestDoeDtcLiveLogin({ user: ctx.user, jobId });
      if (!live.ok) {
        output = live;
      } else {
        state.liveViewUrl = live.liveViewUrl;
        output = { ok: true, link_sent_separately: true };
      }
    } else if (name === "show_session") {
      if (!state.activeBrowserJobId) {
        output = { ok: false, error: "No active browser task to watch." };
      } else {
        state.sessionUrl = doeDtcSessionUrl(ctx.user.care_token);
        output = { ok: true, link_sent_separately: true };
      }
    } else if (name === "react_to_message") {
      if (!ctx.inboundMessageId) {
        output = { ok: false, error: "No inbound message to react to." };
      } else {
        const emoji = String(args.emoji ?? "").trim();
        if (!emoji) {
          output = { ok: false, error: "Emoji is required." };
        } else if (isLifecycleReactionEmoji(emoji)) {
          output = { ok: false, error: "Use a content tapback, not 👍/✅/👎." };
        } else {
          state.reactionEmoji = emoji.slice(0, 8);
          output = { ok: true, queued: true };
        }
      }
    } else if (name === "use_thread_reply") {
      if (!ctx.inboundMessageId) {
        output = { ok: false, error: "No inbound message to reply to." };
      } else {
        state.replyToInbound = true;
        output = { ok: true, queued: true };
      }
    } else if (name === "request_commit") {
      const jobId = state.activeBrowserJobId ?? "";
      const result = await requestDoeDtcBrowserCommit({
        user: ctx.user,
        jobId,
        pendingAction: {
          selector: String(args.selector ?? ""),
          label: String(args.label ?? ""),
          url: typeof args.url === "string" ? args.url : undefined,
        },
      });
      if (result.workUrl) {
        state.workUrl = result.workUrl;
      }
      if (result.screenshotUrl) {
        state.screenshotUrl = result.screenshotUrl;
      }
      if (result.excerpt) {
        state.browserExcerpt = result.excerpt;
      }
      state.browserNeedsConfirm = true;
      output = {
        ok: result.ok,
        url: result.url,
        title: result.title,
        excerpt: result.excerpt,
        awaiting_confirm: true,
        link_sent_separately: Boolean(result.workUrl),
      };
    } else if (name === "start_listen") {
      const appointmentId =
        typeof args.appointment_id === "string" && args.appointment_id.trim()
          ? args.appointment_id.trim()
          : null;
      const session = await createDoeDtcListenSession({
        userId: ctx.user.id,
        appointmentId,
      });
      state.listenUrl = doeDtcListenUrl(ctx.user.care_token, session.id);
      output = { ok: true, session_id: session.id, link_sent_separately: true };
    } else if (name === "read_listen_session") {
      const sessionId = typeof args.session_id === "string" ? args.session_id.trim() : "";
      let session = sessionId
        ? await getDoeDtcListenSession({ sessionId, userId: ctx.user.id })
        : null;
      if (!session) {
        session =
          ctx.snapshot.listenSessions.find((row) => row.status === "completed") ??
          ctx.snapshot.listenSessions[0] ??
          null;
      }
      if (!session) {
        output = { ok: false, error: "No Listen session found." };
      } else if (session.status !== "completed") {
        output = {
          ok: false,
          error: "Session not completed yet.",
          session_id: session.id,
          status: session.status,
        };
      } else {
        output = {
          ok: true,
          session_id: session.id,
          status: session.status,
          summary: session.summary,
          transcript: session.transcript?.slice(0, 4000) ?? null,
          completed_at: session.completed_at,
        };
      }
    } else if (name === "send_profile_link") {
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
      });
      if ("error" in subject) throw new Error(subject.error);
      state.profileUrl = buildPrivateAppLink({
        careToken: ctx.user.care_token,
        inboundText: ctx.inboundText,
        snapshot: ctx.snapshot,
        tab: typeof args.tab === "string" ? args.tab : undefined,
        artifact: typeof args.artifact === "string" ? args.artifact.trim() : undefined,
        member: subject.subjectUserId !== ctx.user.id ? subject.subjectUserId : undefined,
      });
      output = { ok: true, subject: subject.subjectMemberName ?? "you", link_sent_separately: true };
    } else if (name === "propose_scheduled_text") {
      const intent = String(args.intent ?? "").trim();
      const body = String(args.body ?? "").trim();
      const sendAtRaw = String(args.send_at ?? "").trim();
      if (!intent || !body || !sendAtRaw) throw new Error("intent, body, and send_at are required.");
      const timezone = normalizeScheduledTimezone(
        typeof args.timezone === "string" ? args.timezone : undefined,
      );
      const built = await buildScheduledTextPendingArgs({
        user: ctx.user,
        intent,
        body,
        sendAtRaw,
        timezone,
        memberId: typeof args.member_id === "string" ? args.member_id : null,
        memberName: typeof args.member_name === "string" ? args.member_name : null,
      });
      await setAgentPending({
        userId: ctx.user.id,
        kind: "schedule_text",
        commitTool: "schedule_text",
        args: built.args,
        summary: built.summary,
      });
      state.preservePendingOffer = true;
      output = {
        ok: true,
        draft: true,
        intent,
        body,
        send_at: built.sendAtIso,
        send_at_label: formatScheduledSendAtLabel(new Date(built.sendAtIso), timezone),
        recipient: built.recipientName,
        next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
      };
    } else if (name === "schedule_text") {
      const timezone = normalizeScheduledTimezone(
        typeof args.timezone === "string" ? args.timezone : undefined,
      );
      const intent = String(args.intent ?? "").trim();
      const body = String(args.body ?? "").trim();
      const sendAtRaw = String(args.send_at ?? "").trim();
      let rolledForward = false;
      let row;
      const now = new Date();
      let sendAt = parseScheduledSendAt(sendAtRaw, now, timezone);
      try {
        sendAt = ensureFutureSendAt(sendAt, now, timezone);
      } catch {
        sendAt = ensureFutureSendAt(parseScheduledSendAt(sendAtRaw, now, timezone), now, timezone);
        rolledForward = true;
        await addDoeDtcMem0PlaybookNote({
          userId: ctx.user.id,
          note: "When scheduling reminders, roll past clock times forward one local day instead of treating them as already passed.",
        });
      }
    
      if (shouldSendScheduledTextInline(sendAt, now)) {
        row = await sendScheduledTextInline({
          creator: ctx.user,
          intent,
          body,
          sendAt,
          timezone,
          inboundText: ctx.inboundText,
          memberId: typeof args.member_id === "string" ? args.member_id : null,
          memberName: typeof args.member_name === "string" ? args.member_name : null,
        });
      } else {
        try {
          row = await createScheduledText({
            creator: ctx.user,
            intent,
            body,
            sendAtRaw,
            timezone,
            inboundText: ctx.inboundText,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
        } catch {
          row = await createScheduledText({
            creator: ctx.user,
            intent,
            body,
            sendAtIso: sendAt.toISOString(),
            timezone,
            inboundText: ctx.inboundText,
            memberId: typeof args.member_id === "string" ? args.member_id : null,
            memberName: typeof args.member_name === "string" ? args.member_name : null,
          });
          rolledForward = true;
        }
      }
      await clearAgentPending(ctx.user.id);
      const firesSoon = shouldSendScheduledTextInline(new Date(row.send_at), now);
      output = {
        ok: true,
        scheduled_text_id: row.id,
        send_at: row.send_at,
        recipient_phone: row.recipient_phone,
        status: row.status,
        sent_inline: false,
        queued: true,
        fires_after_this_reply: firesSoon || undefined,
        rolled_forward: rolledForward || undefined,
      };
    } else if (name === "cancel_scheduled_text") {
      const cancelled = await cancelScheduledText({
        userId: ctx.user.id,
        scheduledTextId:
          typeof args.scheduled_text_id === "string" ? args.scheduled_text_id : undefined,
        intentHint: typeof args.intent_hint === "string" ? args.intent_hint : undefined,
      });
      if (!cancelled) throw new Error("Scheduled text not found.");
      output = { ok: true, scheduled_text_id: cancelled.id, status: cancelled.status };
    } else if (name === "list_scheduled_texts") {
      const [rows, pending] = await Promise.all([
        listScheduledTextsForUser(ctx.user.id),
        getAgentPending(ctx.user.id),
      ]);
      const file = buildScheduledTextFile({ rows, pending });
      output = {
        ok: true,
        ...serializeScheduledTextFile(file),
      };
    } else if (name === "revoke_household_access") {
      const member = ctx.snapshot.household.viewerMember;
      if (!member) throw new Error("You are not in a household.");
      const isAdult =
        member.relationship !== "child" || isHouseholdMemberAdult(member.date_of_birth);
      if (isAdult && args.confirmed !== true) {
        throw new Error("Explicit confirmation is required before revoking household access.");
      }
      const result = await revokeDoeDtcHouseholdAccess({ userId: ctx.user.id });
      await sendDoeDtcHouseholdAccessRevokedNotice({
        memberName: result.memberName,
        household: ctx.snapshot.household.household!,
      });
      output = { ok: true, revoked: true, member_name: result.memberName };
    } else if (name === "propose_accountability") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const subjectName = String(args.subject_name ?? "").trim() || ctx.user.full_name || "You";
      const mechanics = normalizeAccountabilityMechanics(
        args.mechanics && typeof args.mechanics === "object"
          ? (args.mechanics as Record<string, unknown>)
          : undefined,
      );
      const title = String(args.title ?? goal).trim();
      await setAgentPending({
        userId: ctx.user.id,
        kind: "start_accountability",
        commitTool: "start_accountability",
        args: {
          title,
          goal,
          subject_name: subjectName,
          involve_partner: Boolean(args.involve_partner),
          partner_name: typeof args.partner_name === "string" ? args.partner_name : undefined,
          partner_phone: typeof args.partner_phone === "string" ? args.partner_phone : undefined,
          member_id: typeof args.member_id === "string" ? args.member_id : undefined,
          member_name: typeof args.member_name === "string" ? args.member_name : undefined,
          mechanics,
        },
        summary: `Start accountability for ${subjectName}: ${goal}`,
      });
      state.preservePendingOffer = true;
      output = {
        ok: true,
        draft: true,
        title,
        goal,
        subject_name: subjectName,
        involve_partner: Boolean(args.involve_partner ?? args.involve_partner),
        partner_name: typeof args.partner_name === "string" ? args.partner_name : null,
        partner_phone: typeof args.partner_phone === "string" ? args.partner_phone : null,
        mechanics,
        next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
      };
    } else if (name === "start_accountability") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const subjectName =
        String(args.subject_name ?? "").trim() || subject.subjectMemberName || ctx.user.full_name || "You";
      const mechanics = normalizeAccountabilityMechanics(
        args.mechanics && typeof args.mechanics === "object"
          ? (args.mechanics as Record<string, unknown>)
          : undefined,
      );
      const view = await startAccountabilityPact({
        owner: ctx.user,
        title: String(args.title ?? goal).trim(),
        goal,
        mechanics,
        subjectUserId: subject.subjectUserId,
        subjectMemberId: subject.subjectMemberId ?? null,
        subjectName,
        partnerName: typeof args.partner_name === "string" ? args.partner_name : null,
        partnerPhone: typeof args.partner_phone === "string" ? args.partner_phone : null,
        involvePartner: Boolean(args.involve_partner ?? args.involve_partner),
      });
      await clearAgentPending(ctx.user.id);
      output = {
        ok: true,
        pact_id: view.pact.id,
        title: view.pact.title,
        status: view.pact.status,
        subject: subjectName,
        link_sent_separately: Boolean(state.profileUrl),
      };
    } else if (name === "propose_habit_workflow") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const subjectName = String(args.subject_name ?? "").trim() || ctx.user.full_name || "You";
      const timezone = normalizeScheduledTimezone(
        typeof args.timezone === "string" ? args.timezone : undefined,
      );
      const config = await buildHabitWorkflowConfig({
        owner: ctx.user,
        goal,
        subjectName,
        subjectMemberId: typeof args.member_id === "string" ? args.member_id : null,
        checkInHour: typeof args.check_in_hour === "number" ? args.check_in_hour : undefined,
        checkInBody: typeof args.check_in_body === "string" ? args.check_in_body : undefined,
        awaitTimeoutMinutes:
          typeof args.await_timeout_minutes === "number" ? args.await_timeout_minutes : undefined,
        timezone,
      });
      await setAgentPending({
        userId: ctx.user.id,
        kind: "start_habit_workflow",
        commitTool: "start_habit_workflow",
        args: {
          goal,
          subject_name: subjectName,
          check_in_hour: config.check_in_hour,
          check_in_body: config.check_in_body,
          await_timeout_minutes: config.await_timeout_minutes,
          timezone: config.timezone,
          member_id: typeof args.member_id === "string" ? args.member_id : undefined,
          member_name: typeof args.member_name === "string" ? args.member_name : undefined,
        },
        summary: `Daily habit for ${subjectName}: ${goal}`,
      });
      state.preservePendingOffer = true;
      output = {
        ok: true,
        draft: true,
        goal,
        subject_name: subjectName,
        check_in_hour: config.check_in_hour,
        await_timeout_minutes: config.await_timeout_minutes,
        next_step: "Only ask for confirmation if a slot is missing or it texts someone else.",
      };
    } else if (name === "start_habit_workflow") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const subjectName =
        String(args.subject_name ?? "").trim() || subject.subjectMemberName || ctx.user.full_name || "You";
      const timezone = normalizeScheduledTimezone(
        typeof args.timezone === "string" ? args.timezone : undefined,
      );
      const config = await buildHabitWorkflowConfig({
        owner: ctx.user,
        goal,
        subjectName,
        subjectMemberId: subject.subjectMemberId ?? null,
        checkInHour: typeof args.check_in_hour === "number" ? args.check_in_hour : undefined,
        checkInBody: typeof args.check_in_body === "string" ? args.check_in_body : undefined,
        awaitTimeoutMinutes:
          typeof args.await_timeout_minutes === "number" ? args.await_timeout_minutes : undefined,
        timezone,
      });
      const workflow = await createHabitWorkflow({
        owner: ctx.user,
        goal,
        config,
        subjectMemberId: subject.subjectMemberId ?? null,
      });
      await clearAgentPending(ctx.user.id);
      output = {
        ok: true,
        workflow_id: workflow.id,
        goal: workflow.goal,
        subject: config.subject_name,
        check_in_hour: config.check_in_hour,
        next_run_at: workflow.next_run_at,
      };
    } else if (name === "propose_workflow") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const graphRaw = args.graph;
      if (!graphRaw || typeof graphRaw !== "object") throw new Error("graph is required.");
      const validation = validateWorkflowGraph(graphRaw as WorkflowGraph);
      if (!validation.ok) throw new Error(validation.error);
      await setAgentPending({
        userId: ctx.user.id,
        kind: "start_workflow",
        commitTool: "start_workflow",
        args: {
          goal,
          graph: graphRaw,
          subject_name: typeof args.subject_name === "string" ? args.subject_name : undefined,
          member_id: typeof args.member_id === "string" ? args.member_id : undefined,
          member_name: typeof args.member_name === "string" ? args.member_name : undefined,
          timezone: typeof args.timezone === "string" ? args.timezone : undefined,
        },
        summary: `Workflow: ${goal}`,
      });
      state.preservePendingOffer = true;
      output = {
        ok: true,
        draft: true,
        goal,
        node_count: (graphRaw as WorkflowGraph).nodes.length,
        next_step: "Confirm to start the composed workflow.",
      };
    } else if (name === "start_workflow") {
      const goal = String(args.goal ?? "").trim();
      if (!goal) throw new Error("goal is required.");
      const graphRaw = args.graph;
      if (!graphRaw || typeof graphRaw !== "object") throw new Error("graph is required.");
      const graph = graphRaw as WorkflowGraph;
      const validation = validateWorkflowGraph(graph);
      if (!validation.ok) throw new Error(validation.error);
      const subject = await resolveAgentHouseholdSubject({
        viewerUserId: ctx.user.id,
        args,
        requireEdit: true,
      });
      if ("error" in subject) throw new Error(subject.error);
      const subjectName =
        String(args.subject_name ?? "").trim() || subject.subjectMemberName || ctx.user.full_name || "You";
      const timezone = normalizeScheduledTimezone(
        typeof args.timezone === "string" ? args.timezone : undefined,
      );
      const baseConfig = await buildHabitWorkflowConfig({
        owner: ctx.user,
        goal,
        subjectName,
        subjectMemberId: subject.subjectMemberId ?? null,
        timezone,
      });
      const workflow = await createComposedWorkflow({
        owner: ctx.user,
        goal,
        graph,
        composed: {
          timezone: baseConfig.timezone,
          subject_phone: baseConfig.subject_phone,
          subject_user_id: baseConfig.subject_user_id,
          subject_name: baseConfig.subject_name,
          notify_phone: baseConfig.notify_phone,
          notify_user_id: baseConfig.notify_user_id,
          notify_name: baseConfig.notify_name,
          daily_hour: baseConfig.check_in_hour,
          initial_body: baseConfig.check_in_body,
          await_minutes: baseConfig.await_timeout_minutes,
        },
        subjectMemberId: subject.subjectMemberId ?? null,
      });
      await clearAgentPending(ctx.user.id);
      output = {
        ok: true,
        workflow_id: workflow.id,
        goal: workflow.goal,
        subject: baseConfig.subject_name,
        node_count: graph.nodes.length,
        next_run_at: workflow.next_run_at,
      };
    } else if (name === "cancel_habit_workflow") {
      const cancelled = await cancelWorkflow({
        userId: ctx.user.id,
        workflowId: typeof args.workflow_id === "string" ? args.workflow_id : undefined,
        goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
      });
      if (!cancelled) throw new Error("Habit workflow not found.");
      output = { ok: true, workflow_id: cancelled.id, status: cancelled.status };
    } else if (name === "invite_accountability_partner") {
      const pactId = String(args.pact_id ?? "").trim();
      const partnerPhone = String(args.partner_phone ?? "").trim();
      if (!partnerPhone) throw new Error("partner_phone is required.");
      let resolvedPactId = pactId;
      if (!resolvedPactId) {
        const pact = await findAccountabilityPactForUser({ userId: ctx.user.id });
        if (!pact) throw new Error("Accountability pact not found.");
        resolvedPactId = pact.id;
      }
      await inviteAccountabilityPartner({
        owner: ctx.user,
        pactId: resolvedPactId,
        partnerName: typeof args.partner_name === "string" ? args.partner_name : undefined,
        partnerPhone,
      });
      output = { ok: true, pact_id: resolvedPactId, invite_sent: true };
    } else if (name === "log_accountability_checkin") {
      const outcomeRaw = String(args.outcome ?? "").trim();
      if (outcomeRaw !== "yes" && outcomeRaw !== "no" && outcomeRaw !== "skip") {
        throw new Error("outcome must be yes, no, or skip.");
      }
      const pactId = String(args.pact_id ?? "").trim();
      const pact =
        (pactId
          ? await findAccountabilityPactForUser({ userId: ctx.user.id, pactId })
          : null) ??
        (await findAccountabilityPactForUser({
          userId: ctx.user.id,
          goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
        }));
      if (!pact) throw new Error("Accountability pact not found.");
      const event = await logAccountabilityCheckIn({
        pactId: pact.id,
        actorUserId: ctx.user.id,
        outcome: outcomeRaw,
        note: typeof args.note === "string" ? args.note : null,
      });
      output = { ok: true, pact_id: pact.id, outcome: event.outcome, event_id: event.id };
    } else if (name === "withdraw_accountability") {
      const pactId = String(args.pact_id ?? "").trim();
      const pact =
        (pactId
          ? await findAccountabilityPactForUser({ userId: ctx.user.id, pactId })
          : null) ??
        (await findAccountabilityPactForUser({
          userId: ctx.user.id,
          goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
        }));
      if (!pact) throw new Error("Accountability pact not found.");
      const view = await withdrawAccountabilityPact({
        ownerUserId: ctx.user.id,
        pactId: pact.id,
        reason: typeof args.reason === "string" ? args.reason : null,
      });
      output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
    } else if (name === "pause_accountability") {
      const pactId = String(args.pact_id ?? "").trim();
      const pact =
        (pactId
          ? await findAccountabilityPactForUser({ userId: ctx.user.id, pactId })
          : null) ??
        (await findAccountabilityPactForUser({
          userId: ctx.user.id,
          goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
        }));
      if (!pact) throw new Error("Accountability pact not found.");
      const view = await pauseAccountabilityPact({ ownerUserId: ctx.user.id, pactId: pact.id });
      output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
    } else if (name === "resume_accountability") {
      const pactId = String(args.pact_id ?? "").trim();
      const pact =
        (pactId
          ? await findAccountabilityPactForUser({ userId: ctx.user.id, pactId })
          : null) ??
        (await findAccountabilityPactForUser({
          userId: ctx.user.id,
          goalHint: typeof args.goal_hint === "string" ? args.goal_hint : undefined,
        }));
      if (!pact) throw new Error("Accountability pact not found.");
      const view = await resumeAccountabilityPact({ ownerUserId: ctx.user.id, pactId: pact.id });
      output = { ok: true, pact_id: view.pact.id, status: view.pact.status };
    } else if (name === "read_profile") {
      const tab = String(args.tab ?? "") as DoeDtcProfileTab;
      if (!DOEDTC_PROFILE_READ_TABS.includes(tab)) {
        output = { ok: false, error: "Unknown profile tab." };
      } else {
        const subject = await resolveAgentHouseholdSubject({
          viewerUserId: ctx.user.id,
          args,
        });
        if ("error" in subject) {
          output = { ok: false, error: subject.error };
        } else {
          const read = await readDoeDtcProfileTab({
            userId: subject.subjectUserId,
            tab,
            viewerUserId: ctx.user.id,
          });
          output = {
            ok: true,
            tab: read.tab,
            content: read.content,
            subject: subject.subjectMemberName ?? "you",
          };
        }
      }
    } else if (name === "read_attachment") {
      const fileId = String(args.file_id ?? "").trim();
      if (!fileId) throw new Error("file_id is required.");
      output = await runReadAttachmentTool({ userId: ctx.user.id, fileId });
    } else if (name === "parse_document") {
      const fileIds = Array.isArray(args.file_ids)
        ? args.file_ids.filter((row): row is string => typeof row === "string").map((row) => row.trim()).filter(Boolean)
        : typeof args.file_id === "string" && args.file_id.trim()
          ? [args.file_id.trim()]
          : [];
      output = await runParseDocumentTool({
        user: ctx.user,
        inboundText: ctx.inboundText,
        snapshot: ctx.snapshot,
        state,
        fileIds,
        caption: typeof args.caption === "string" ? args.caption : undefined,
        autoCommit: typeof args.auto_commit === "boolean" ? args.auto_commit : undefined,
        attachmentContext: ctx.attachmentContext,
      });
    } else {
      output = { ok: false, error: "Unknown tool" };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tool execution failed.";
    throw new Error(message);
  }
  return output;
}

export const DOE_DTC_TOOL_NAMES = [
  "log_symptoms",
  "update_symptom",
  "remove_symptom",
  "run_assessment",
  "log_appointment",
  "update_appointment",
  "cancel_appointment",
  "log_family_member",
  "update_family_member",
  "remove_family_member",
  "send_family_invite",
  "add_medication",
  "update_medication",
  "remove_medication",
  "add_condition",
  "update_condition",
  "remove_condition",
  "log_result",
  "remove_result",
  "create_profile_artifact",
  "update_profile_artifact",
  "log_artifact_entry",
  "share_artifact",
  "unshare_artifact",
  "update_artifact_entry",
  "remove_artifact_entry",
  "create_preparation",
  "create_guide",
  "save_guide",
  "update_guide",
  "list_guides",
  "send_guide_link",
  "submit_ticket",
  "remember_fact",
  "forget_fact",
  "start_browser_task",
  "browser_navigate",
  "browser_act",
  "browser_computer",
  "browser_snapshot",
  "request_vault",
  "request_live_login",
  "show_session",
  "react_to_message",
  "use_thread_reply",
  "request_commit",
  "start_listen",
  "read_listen_session",
  "send_profile_link",
  "propose_scheduled_text",
  "schedule_text",
  "cancel_scheduled_text",
  "list_scheduled_texts",
  "revoke_household_access",
  "propose_accountability",
  "start_accountability",
  "propose_habit_workflow",
  "start_habit_workflow",
  "propose_workflow",
  "start_workflow",
  "cancel_habit_workflow",
  "invite_accountability_partner",
  "log_accountability_checkin",
  "withdraw_accountability",
  "pause_accountability",
  "resume_accountability",
  "read_profile",
  "read_attachment",
  "parse_document",
] as const;
