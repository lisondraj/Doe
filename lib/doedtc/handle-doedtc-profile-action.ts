import {
  addDoeDtcAppointment,
  addDoeDtcFamilyMember,
  addDoeDtcLockerItem,
  addDoeDtcResult,
  appendDoeDtcCondition,
  appendDoeDtcMedication,
  generateDoeDtcShareCode,
  getDoeDtcProfileSnapshot,
  getDoeDtcUserByCareToken,
  removeDoeDtcAppointment,
  removeDoeDtcCondition,
  removeDoeDtcFamilyMember,
  removeDoeDtcLockerItem,
  removeDoeDtcMedication,
  removeDoeDtcResult,
  revokeDoeDtcShareCode,
  setDoeDtcHealthConnectionPending,
} from "@/lib/doedtc/doedtc-db";
import { normalizeDoeDtcFamilyRelationship, resolveDoeDtcFamilyMemberName } from "@/lib/doedtc/doedtc-family-relationship";
import type {
  DoeDtcFamilyRelationship,
  DoeDtcHealthProvider,
  DoeDtcProfileSnapshot,
} from "@/lib/doedtc/doedtc-types";

const PROVIDERS = new Set<DoeDtcHealthProvider>(["whoop", "apple_health"]);

export async function handleDoeDtcProfileAction(params: {
  token: string;
  action: string;
  payload: Record<string, unknown>;
}): Promise<{ snapshot: DoeDtcProfileSnapshot }> {
  const user = await getDoeDtcUserByCareToken(params.token.trim());
  if (!user) {
    throw new Error("Profile link is invalid.");
  }

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
      await addDoeDtcFamilyMember({
        userId: user.id,
        fullName,
        relationship,
        phone: typeof params.payload.phone === "string" ? params.payload.phone : null,
      });
      break;
    }
    case "remove_family": {
      const memberId = String(params.payload.memberId ?? "");
      if (!memberId) throw new Error("Missing family member.");
      await removeDoeDtcFamilyMember({ userId: user.id, memberId });
      break;
    }
    case "add_appointment": {
      const title = String(params.payload.title ?? "").trim();
      const startsAt = String(params.payload.startsAt ?? "").trim();
      if (!title || !startsAt) throw new Error("Title and date are required.");
      await addDoeDtcAppointment({
        userId: user.id,
        title,
        startsAt: new Date(startsAt).toISOString(),
        location: typeof params.payload.location === "string" ? params.payload.location : null,
        notes: typeof params.payload.notes === "string" ? params.payload.notes : null,
      });
      break;
    }
    case "remove_appointment": {
      const appointmentId = String(params.payload.appointmentId ?? "");
      if (!appointmentId) throw new Error("Missing appointment.");
      await removeDoeDtcAppointment({ userId: user.id, appointmentId });
      break;
    }
    case "add_result": {
      const title = String(params.payload.title ?? "").trim();
      const resultedAt = String(params.payload.resultedAt ?? "").trim();
      if (!title || !resultedAt) throw new Error("Title and date are required.");
      await addDoeDtcResult({
        userId: user.id,
        title,
        resultedAt: new Date(resultedAt).toISOString(),
        source: typeof params.payload.source === "string" ? params.payload.source : null,
        summary: typeof params.payload.summary === "string" ? params.payload.summary : null,
      });
      break;
    }
    case "remove_result": {
      const resultId = String(params.payload.resultId ?? "");
      if (!resultId) throw new Error("Missing result.");
      await removeDoeDtcResult({ userId: user.id, resultId });
      break;
    }
    case "add_locker": {
      const label = String(params.payload.label ?? "").trim();
      const username = String(params.payload.username ?? "").trim();
      const password = String(params.payload.password ?? "");
      if (!label || !password) throw new Error("Label and password are required.");
      await addDoeDtcLockerItem({ userId: user.id, label, username, password });
      break;
    }
    case "remove_locker": {
      const itemId = String(params.payload.itemId ?? "");
      if (!itemId) throw new Error("Missing locker item.");
      await removeDoeDtcLockerItem({ userId: user.id, itemId });
      break;
    }
    case "connect_health": {
      const provider = params.payload.provider;
      if (typeof provider !== "string" || !PROVIDERS.has(provider as DoeDtcHealthProvider)) {
        throw new Error("Unknown provider.");
      }
      await setDoeDtcHealthConnectionPending({
        userId: user.id,
        provider: provider as DoeDtcHealthProvider,
      });
      break;
    }
    case "generate_share":
      await generateDoeDtcShareCode({ userId: user.id });
      break;
    case "revoke_share": {
      const shareCodeId = String(params.payload.shareCodeId ?? "");
      if (!shareCodeId) throw new Error("Missing share code.");
      await revokeDoeDtcShareCode({ userId: user.id, shareCodeId });
      break;
    }
    case "add_medication": {
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Medication name is required.");
      await appendDoeDtcMedication({ userId: user.id, name });
      break;
    }
    case "remove_medication": {
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Medication name is required.");
      await removeDoeDtcMedication({ userId: user.id, name });
      break;
    }
    case "add_condition": {
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      await appendDoeDtcCondition({ userId: user.id, name });
      break;
    }
    case "remove_condition": {
      const name = String(params.payload.name ?? "").trim();
      if (!name) throw new Error("Condition name is required.");
      await removeDoeDtcCondition({ userId: user.id, name });
      break;
    }
    default:
      throw new Error("Unknown action.");
  }

  const snapshot = await getDoeDtcProfileSnapshot(user.id);
  return { snapshot };
}
