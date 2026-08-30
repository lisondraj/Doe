import type {
  DoeDtcHouseholdConsentLevel,
  DoeDtcHouseholdConsentRow,
  DoeDtcHouseholdMemberRow,
  DoeDtcHouseholdRow,
} from "@/lib/doedtc/doedtc-types";

export function isHouseholdMemberAdult(dateOfBirth: string | null | undefined): boolean {
  if (!dateOfBirth) return false;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

function consentAllows(
  level: DoeDtcHouseholdConsentLevel,
  memberIds: string[],
  viewerMemberId: string,
): boolean {
  if (level === "all") return true;
  if (level === "none") return false;
  return memberIds.includes(viewerMemberId);
}

export function canViewMemberProfile(params: {
  household: DoeDtcHouseholdRow;
  members: DoeDtcHouseholdMemberRow[];
  consents: DoeDtcHouseholdConsentRow[];
  viewerUserId: string;
  subjectUserId: string;
}): boolean {
  if (params.viewerUserId === params.subjectUserId) return true;

  const viewerMember = params.members.find((row) => row.user_id === params.viewerUserId);
  const subjectMember = params.members.find((row) => row.user_id === params.subjectUserId);
  if (!viewerMember || !subjectMember) return false;

  if (viewerMember.role === "admin") {
    if (subjectMember.relationship === "child" && !isHouseholdMemberAdult(subjectMember.date_of_birth)) {
      return true;
    }
    const consent = params.consents.find((row) => row.user_id === params.subjectUserId);
    if (!consent) return false;
    return consentAllows(consent.share_health, consent.share_member_ids, viewerMember.id);
  }

  const consent = params.consents.find((row) => row.user_id === params.subjectUserId);
  if (!consent) return false;
  return consentAllows(consent.share_health, consent.share_member_ids, viewerMember.id);
}

export function canEditMemberProfile(params: {
  household: DoeDtcHouseholdRow;
  members: DoeDtcHouseholdMemberRow[];
  consents: DoeDtcHouseholdConsentRow[];
  viewerUserId: string;
  subjectUserId: string;
}): boolean {
  if (params.viewerUserId === params.subjectUserId) return true;

  const viewerMember = params.members.find((row) => row.user_id === params.viewerUserId);
  const subjectMember = params.members.find((row) => row.user_id === params.subjectUserId);
  if (!viewerMember || !subjectMember) return false;

  if (viewerMember.role === "admin") {
    if (subjectMember.relationship === "child" && !isHouseholdMemberAdult(subjectMember.date_of_birth)) {
      return true;
    }
    const consent = params.consents.find((row) => row.user_id === params.subjectUserId);
    if (!consent) return false;
    return consentAllows(consent.allow_edits, consent.edit_member_ids, viewerMember.id);
  }

  const consent = params.consents.find((row) => row.user_id === params.subjectUserId);
  if (!consent) return false;
  return consentAllows(consent.allow_edits, consent.edit_member_ids, viewerMember.id);
}

export function isHouseholdAdmin(params: {
  household: DoeDtcHouseholdRow;
  viewerUserId: string;
}): boolean {
  return params.household.admin_user_id === params.viewerUserId;
}

export function formatHouseholdForAgent(params: {
  household: DoeDtcHouseholdRow | null;
  members: DoeDtcHouseholdMemberRow[];
  viewerUserId: string;
}): string {
  if (!params.household || params.members.length === 0) return "No household set up.";
  return params.members
    .map((row) => {
      const parts = [
        `${row.full_name} (${row.relationship})`,
        `role: ${row.role}`,
        `status: ${row.status}`,
      ];
      if (row.phone) parts.push(`phone: ${row.phone}`);
      if (row.user_id) parts.push(`user_id: ${row.user_id}`);
      parts.push(`member_id: ${row.id}`);
      if (row.role === "admin") parts.push("admin");
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

export function findHouseholdMemberByName(
  members: DoeDtcHouseholdMemberRow[],
  name: string,
): DoeDtcHouseholdMemberRow | null {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;
  return (
    members.find((row) => row.full_name.trim().toLowerCase() === trimmed) ??
    members.find((row) => row.full_name.trim().toLowerCase().includes(trimmed)) ??
    null
  );
}
