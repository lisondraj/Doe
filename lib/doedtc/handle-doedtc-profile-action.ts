import {
  addDoeDtcAppointment,
  addDoeDtcHouseholdMember,
  addDoeDtcLockerItem,
  addDoeDtcResult,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  archiveDoeDtcArtifact,
  canViewerAccessSubjectProfile,
  createDoeDtcHouseholdInvite,
  createDoeDtcTicket,
  generateDoeDtcShareCode,
  getDoeDtcProfileSnapshot,
  getDoeDtcUserByCareToken,
  logDoeDtcArtifactEntry,
  removeDoeDtcAppointment,
  removeDoeDtcArtifactEntry,
  removeDoeDtcCondition,
  removeDoeDtcHouseholdMember,
  removeDoeDtcLockerItem,
  removeDoeDtcMedication,
  removeDoeDtcResult,
  revokeDoeDtcShareCode,
  revokeDoeDtcHouseholdAccess,
  setDoeDtcHealthConnectionPending,
  shareDoeDtcArtifact,
  unshareDoeDtcArtifact,
  updateDoeDtcArtifact,
  updateDoeDtcArtifactEntry,
} from "@/lib/doedtc/doedtc-db";
import {
  archiveDoeDtcGuide,
  saveDoeDtcGuide,
  unsaveDoeDtcGuide,
} from "@/lib/doedtc/doedtc-guides-db";
import {
  pauseAccountabilityPact,
  resumeAccountabilityPact,
  withdrawAccountabilityPact,
} from "@/lib/doedtc/doedtc-accountability-db";
import { cancelScheduledText } from "@/lib/doedtc/doedtc-scheduled-db";
import { cancelWorkflow } from "@/lib/doedtc/doedtc-workflows";
import { normalizeDoeDtcFamilyRelationship, resolveDoeDtcFamilyMemberName } from "@/lib/doedtc/doedtc-family-relationship";
import { sendDoeDtcFamilyInviteMessage, sendDoeDtcHouseholdAccessRevokedNotice } from "@/lib/doedtc/doedtc-messaging";
import type {
  DoeDtcGender,
  DoeDtcHealthProvider,
  DoeDtcProfileSnapshot,
  DoeDtcUserRow,
} from "@/lib/doedtc/doedtc-types";

const PROVIDERS = new Set<DoeDtcHealthProvider>(["whoop", "apple_health"]);

async function resolveWriteTargetUser(params: {
  viewer: DoeDtcUserRow;
  subjectUserId?: string | null;
}): Promise<string> {
  const subjectUserId = params.subjectUserId?.trim() || params.viewer.id;
  if (subjectUserId === params.viewer.id) return params.viewer.id;
  const access = await canViewerAccessSubjectProfile({
    viewerUserId: params.viewer.id,
    subjectUserId,
  });
  if (!access.canEdit) {
    throw new Error("You do not have permission to edit this profile.");
  }
  return subjectUserId;
}

export async function handleDoeDtcProfileAction(params: {
  token: string;
  action: string;
  payload: Record<string, unknown>;
}): Promise<{ snapshot: DoeDtcProfileSnapshot }> {
  const user = await getDoeDtcUserByCareToken(params.token.trim());
  if (!user) {
    throw new Error("Profile link is invalid.");
  }

  const subjectUserIdRaw =
    typeof params.payload.subjectUserId === "string" ? params.payload.subjectUserId : null;
  const snapshotSubjectUserId = subjectUserIdRaw?.trim() || user.id;

  switch (params.action) {
    case "add_family": {
      const relationshipRaw = params.payload.relationship;
      if (typeof relationshipRaw !== "string") {
        throw new Error("Choose a relationship.");
      }
      const relationship = normalizeDoeDtcFamilyRelationship(relationshipRaw);
      if (!relationship) throw new Error("Choose a relationship.");
      const fullName = resolveDoeDtcFamilyMemberName({
        fullName: String(params.payload.fullName ?? ""),
        relationship,
      });
      if (!fullName) throw new Error("Name is required.");
      const member = await addDoeDtcHouseholdMember({
        adminUserId: user.id,
        fullName,
        relationship,
        phone: typeof params.payload.phone === "string" ? params.payload.phone : null,
        dateOfBirth:
          typeof params.payload.dateOfBirth === "string" ? params.payload.dateOfBirth : null,
        gender:
          typeof params.payload.gender === "string" ? (params.payload.gender as DoeDtcGender) : null,
        medications: Array.isArray(params.payload.medications)
          ? params.payload.medications.map((item) => String(item ?? "").trim()).filter(Boolean)
          : [],
        conditions: Array.isArray(params.payload.conditions)
          ? params.payload.conditions.map((item) => String(item ?? "").trim()).filter(Boolean)
          : [],
      });
      if (params.payload.sendInvite === true && member.phone) {
        try {
          const { invite, member: invited } = await createDoeDtcHouseholdInvite({
            adminUserId: user.id,
            memberId: member.id,
          });
          await sendDoeDtcFamilyInviteMessage({
            adminUser: user,
            memberPhone: invited.phone!,
            inviteToken: invite.token,
            memberName: invited.full_name,
          });
        } catch {
          // Person is saved; they can resend from the family card menu.
        }
      }
      break;
    }
    case "remove_family": {
      const memberId = String(params.payload.householdMemberId ?? params.payload.memberId ?? "");
      if (!memberId) throw new Error("Missing family member.");
      await removeDoeDtcHouseholdMember({ adminUserId: user.id, memberId });
      break;
    }
    case "send_family_invite": {
      const memberId = String(params.payload.householdMemberId ?? params.payload.memberId ?? "");
      if (!memberId) throw new Error("Missing family member.");
      const { invite, member } = await createDoeDtcHouseholdInvite({
        adminUserId: user.id,
        memberId,
      });
      await sendDoeDtcFamilyInviteMessage({
        adminUser: user,
        memberPhone: member.phone!,
        inviteToken: invite.token,
        memberName: member.full_name,
      });
      break;
    }
    case "add_appointment": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const title = String(params.payload.title ?? "").trim();
      const startsAt = String(params.payload.startsAt ?? "").trim();
      if (!title || !startsAt) throw new Error("Title and date are required.");
      await addDoeDtcAppointment({
        userId: targetUserId,
        title,
        startsAt: new Date(startsAt).toISOString(),
        location: typeof params.payload.location === "string" ? params.payload.location : null,
        notes: typeof params.payload.notes === "string" ? params.payload.notes : null,
      });
      break;
    }
    case "remove_appointment": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const appointmentId = String(params.payload.appointmentId ?? "");
      if (!appointmentId) throw new Error("Missing appointment.");
      await removeDoeDtcAppointment({ userId: targetUserId, appointmentId });
      break;
    }
    case "add_result": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const title = String(params.payload.title ?? "").trim();
      const resultedAt = String(params.payload.resultedAt ?? "").trim();
      if (!title || !resultedAt) throw new Error("Title and date are required.");
      await addDoeDtcResult({
        userId: targetUserId,
        title,
        resultedAt: new Date(resultedAt).toISOString(),
        source: typeof params.payload.source === "string" ? params.payload.source : null,
        summary: typeof params.payload.summary === "string" ? params.payload.summary : null,
      });
      break;
    }
    case "remove_result": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const resultId = String(params.payload.resultId ?? "");
      if (!resultId) throw new Error("Missing result.");
      await removeDoeDtcResult({ userId: targetUserId, resultId });
      break;
    }
    case "add_locker": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const label = String(params.payload.label ?? "").trim();
      const username = String(params.payload.username ?? "").trim();
      const password = String(params.payload.password ?? "");
      if (!label || !password) throw new Error("Label and password are required.");
      await addDoeDtcLockerItem({ userId: targetUserId, label, username, password });
      break;
    }
    case "remove_locker": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const itemId = String(params.payload.itemId ?? "");
      if (!itemId) throw new Error("Missing locker item.");
      await removeDoeDtcLockerItem({ userId: targetUserId, itemId });
      break;
    }
    case "connect_health": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const provider = params.payload.provider;
      if (typeof provider !== "string" || !PROVIDERS.has(provider as DoeDtcHealthProvider)) {
        throw new Error("Unknown provider.");
      }
      await setDoeDtcHealthConnectionPending({
        userId: targetUserId,
        provider: provider as DoeDtcHealthProvider,
      });
      break;
    }
    case "generate_share":
      await generateDoeDtcShareCode({
        userId: await resolveWriteTargetUser({ viewer: user, subjectUserId: subjectUserIdRaw }),
      });
      break;
    case "revoke_share": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const shareCodeId = String(params.payload.shareCodeId ?? "");
      if (!shareCodeId) throw new Error("Missing share code.");
      await revokeDoeDtcShareCode({ userId: targetUserId, shareCodeId });
      break;
    }
    case "add_medication": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Medication name is required.");
      await appendDoeDtcMedication({ userId: targetUserId, name });
      break;
    }
    case "remove_medication": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Medication name is required.");
      await removeDoeDtcMedication({ userId: targetUserId, name });
      break;
    }
    case "add_condition": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      await appendDoeDtcCondition({ userId: targetUserId, name });
      break;
    }
    case "remove_condition": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      await removeDoeDtcCondition({ userId: targetUserId, name });
      break;
    }
    case "add_artifact_entry": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const artifactId = String(params.payload.artifactId ?? "");
      if (!artifactId) throw new Error("Missing tracker.");
      await logDoeDtcArtifactEntry({
        userId: targetUserId,
        artifactId,
        values: params.payload.values,
        occurredAt:
          typeof params.payload.occurredAt === "string" ? params.payload.occurredAt : null,
      });
      break;
    }
    case "update_artifact_entry": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const entryId = String(params.payload.entryId ?? "");
      if (!entryId) throw new Error("Missing entry.");
      await updateDoeDtcArtifactEntry({
        userId: targetUserId,
        entryId,
        values: params.payload.values,
        occurredAt:
          typeof params.payload.occurredAt === "string" ? params.payload.occurredAt : null,
      });
      break;
    }
    case "remove_artifact_entry": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const entryId = String(params.payload.entryId ?? "");
      if (!entryId) throw new Error("Missing entry.");
      await removeDoeDtcArtifactEntry({ userId: targetUserId, entryId });
      break;
    }
    case "update_artifact": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const artifactId = String(params.payload.artifactId ?? "");
      if (!artifactId) throw new Error("Missing tracker.");
      await updateDoeDtcArtifact({
        userId: targetUserId,
        artifactId,
        title: typeof params.payload.title === "string" ? params.payload.title : undefined,
        fields: params.payload.fields,
      });
      break;
    }
    case "archive_artifact": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const artifactId = String(params.payload.artifactId ?? "");
      if (!artifactId) throw new Error("Missing tracker.");
      await archiveDoeDtcArtifact({ userId: targetUserId, artifactId });
      break;
    }
    case "share_artifact": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const artifactId = String(params.payload.artifactId ?? "").trim() || undefined;
      const titleHint =
        typeof params.payload.titleHint === "string" ? params.payload.titleHint : undefined;
      await shareDoeDtcArtifact({ userId: targetUserId, artifactId, titleHint });
      break;
    }
    case "unshare_artifact": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const artifactId = String(params.payload.artifactId ?? "");
      if (!artifactId) throw new Error("Missing tracker.");
      await unshareDoeDtcArtifact({ userId: targetUserId, artifactId });
      break;
    }
    case "submit_ticket": {
      const targetUserId = await resolveWriteTargetUser({
        viewer: user,
        subjectUserId: subjectUserIdRaw,
      });
      const kind = params.payload.kind === "bug" ? "bug" : "feedback";
      const title = String(params.payload.title ?? "").trim();
      const body = String(params.payload.body ?? "").trim();
      if (!title || !body) throw new Error("Title and description are required.");
      await createDoeDtcTicket({ userId: targetUserId, kind, title, body });
      break;
    }
    case "withdraw_accountability": {
      const pactId = String(params.payload.pactId ?? "").trim();
      if (!pactId) throw new Error("Missing accountability pact.");
      await withdrawAccountabilityPact({
        ownerUserId: user.id,
        pactId,
        reason: typeof params.payload.reason === "string" ? params.payload.reason : null,
      });
      break;
    }
    case "pause_accountability": {
      const pactId = String(params.payload.pactId ?? "").trim();
      if (!pactId) throw new Error("Missing accountability pact.");
      await pauseAccountabilityPact({ ownerUserId: user.id, pactId });
      break;
    }
    case "resume_accountability": {
      const pactId = String(params.payload.pactId ?? "").trim();
      if (!pactId) throw new Error("Missing accountability pact.");
      await resumeAccountabilityPact({ ownerUserId: user.id, pactId });
      break;
    }
    case "cancel_scheduled_text": {
      const scheduledTextId = String(params.payload.scheduledTextId ?? "").trim();
      if (!scheduledTextId) throw new Error("Missing scheduled text.");
      await cancelScheduledText({ userId: user.id, scheduledTextId });
      break;
    }
    case "cancel_habit_workflow": {
      const workflowId = String(params.payload.workflowId ?? "").trim();
      if (!workflowId) throw new Error("Missing habit workflow.");
      const cancelled = await cancelWorkflow({ userId: user.id, workflowId });
      if (!cancelled) throw new Error("Habit workflow not found.");
      break;
    }
    case "revoke_household_access": {
      if (params.payload.confirmed !== true) {
        throw new Error("Please confirm before stopping household sharing.");
      }
      const result = await revokeDoeDtcHouseholdAccess({ userId: user.id });
      const snapshotBefore = await getDoeDtcProfileSnapshot(user.id, { viewerUserId: user.id });
      if (snapshotBefore.household.household) {
        await sendDoeDtcHouseholdAccessRevokedNotice({
          memberName: result.memberName,
          household: snapshotBefore.household.household,
        });
      }
      break;
    }
    case "save_guide": {
      const guideId = String(params.payload.guideId ?? "").trim();
      if (!guideId) throw new Error("Missing guide.");
      await saveDoeDtcGuide({ userId: user.id, guideId });
      break;
    }
    case "unsave_guide": {
      const guideId = String(params.payload.guideId ?? "").trim();
      if (!guideId) throw new Error("Missing guide.");
      await unsaveDoeDtcGuide({ userId: user.id, guideId });
      break;
    }
    case "archive_guide": {
      const guideId = String(params.payload.guideId ?? "").trim();
      if (!guideId) throw new Error("Missing guide.");
      await archiveDoeDtcGuide({ userId: user.id, guideId });
      break;
    }
    default:
      throw new Error("Unknown action.");
  }

  const snapshot = await getDoeDtcProfileSnapshot(snapshotSubjectUserId, {
    viewerUserId: user.id,
  });
  return { snapshot };
}
