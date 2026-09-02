import { looksLikeUnwellShare } from "@/lib/doedtc/agent/unwell-care";
import { findHouseholdMemberByName } from "@/lib/doedtc/doedtc-household";
import {
  createOpenLoop,
  defaultCareFollowUpWake,
  hasOpenLoopWithContext,
} from "@/lib/doedtc/doedtc-open-loops";
import { normalizeScheduledTimezone } from "@/lib/doedtc/doedtc-scheduled";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { DoeDtcProfileSnapshot } from "@/lib/doedtc/doedtc-types";

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_HOUR = 60 * 60 * 1000;

function symptomConcernFromInbound(inboundText: string): { memberName: string | null; symptom: string | null } {
  const trimmed = inboundText.trim();
  const thirdPerson = trimmed.match(
    /\b(?:my|our)\s+(?:kid|child|son|daughter|kids?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/i,
  );
  if (thirdPerson?.[1]) {
    const symptomMatch = trimmed.match(
      /\b(?:has|have|had|with)\s+(?:a\s+)?(fever|headache|cough|cold|flu|pain|nausea|sore throat|rash)\b/i,
    );
    return { memberName: thirdPerson[1].trim(), symptom: symptomMatch?.[1]?.toLowerCase() ?? null };
  }

  const namedMember = trimmed.match(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:has|have|had)\s+(?:a\s+)?(fever|headache|cough|cold|flu|pain|nausea)\b/i,
  );
  if (namedMember?.[1]) {
    return { memberName: namedMember[1].trim(), symptom: namedMember[2]?.toLowerCase() ?? null };
  }

  const selfSymptom = trimmed.match(
    /\b(?:i(?:'m| am)|feeling|feel)\b.{0,40}\b(sick|nauseous|ill|awful|terrible|dizzy|headache|sore|fever|unwell|crappy|rough)\b/i,
  );
  if (selfSymptom?.[1]) {
    return { memberName: null, symptom: selfSymptom[1].toLowerCase() };
  }

  return { memberName: null, symptom: null };
}

function recentUnwellSymptoms(snapshot: DoeDtcProfileSnapshot): Array<{
  symptom: string;
  loggedAt: string;
}> {
  const cutoff = Date.now() - MS_DAY;
  return snapshot.symptoms
    .filter((row) => Date.parse(row.created_at) >= cutoff)
    .map((row) => ({
      symptom: row.summary?.trim() || row.raw_text?.trim() || "not feeling well",
      loggedAt: row.created_at,
    }));
}

function upcomingAppointments(snapshot: DoeDtcProfileSnapshot): Array<{
  id: string;
  title: string;
  when: string;
}> {
  const now = Date.now();
  const horizon = now + MS_DAY;
  return snapshot.appointments
    .filter((row) => {
      const when = row.starts_at ? Date.parse(row.starts_at) : NaN;
      return Number.isFinite(when) && when >= now && when <= horizon;
    })
    .map((row) => ({
      id: row.id,
      title: row.title?.trim() || "appointment",
      when: row.starts_at!,
    }));
}

function recentLabsWithoutFollowUp(snapshot: DoeDtcProfileSnapshot): Array<{ id: string; title: string }> {
  const cutoff = Date.now() - 3 * MS_DAY;
  return snapshot.results
    .filter((row) => Date.parse(row.created_at) >= cutoff)
    .map((row) => ({ id: row.id, title: row.title?.trim() || "lab results" }));
}

export async function seedCareFollowUpLoops(params: {
  userId: string;
  snapshot: DoeDtcProfileSnapshot;
  inboundText?: string;
  timezone?: string;
}): Promise<number> {
  const timezone = normalizeScheduledTimezone(params.timezone ?? null);
  const wakeAt = defaultCareFollowUpWake(new Date(), timezone);
  let created = 0;

  if (params.inboundText && looksLikeUnwellShare(params.inboundText)) {
    const concern = symptomConcernFromInbound(params.inboundText);
    let memberId: string | null = null;
    let memberName = concern.memberName;
    if (memberName) {
      const member = findHouseholdMemberByName(params.snapshot.household.members, memberName);
      if (member) {
        memberId = member.id;
        memberName = member.full_name;
      }
    }
    const symptom = concern.symptom ?? "not feeling well";
    const label = memberName ? `${memberName}'s ${symptom}` : `your ${symptom}`;
    const exists = await hasOpenLoopWithContext({
      userId: params.userId,
      kind: "unwell_follow_up",
      memberId: memberId ?? undefined,
    });
    if (!exists) {
      await createOpenLoop({
        userId: params.userId,
        goal: `Check on ${label}`,
        nextWakeAt: wakeAt,
        source: "care_seed",
        context: {
          kind: "unwell_follow_up",
          member_id: memberId ?? undefined,
          member_name: memberName ?? undefined,
          symptom,
          concern: label,
          last_inbound: params.inboundText.trim(),
        },
      });
      created += 1;
    }
  }

  for (const row of recentUnwellSymptoms(params.snapshot)) {
    const exists = await hasOpenLoopWithContext({
      userId: params.userId,
      kind: "unwell_follow_up",
    });
    if (exists) continue;
    const label = row.symptom;
    await createOpenLoop({
      userId: params.userId,
      goal: `Check on ${label}`,
      nextWakeAt: wakeAt,
      source: "care_seed",
      context: {
        kind: "unwell_follow_up",
        symptom: row.symptom,
        concern: label,
      },
    });
    created += 1;
    break;
  }

  for (const appt of upcomingAppointments(params.snapshot)) {
    const exists = await hasOpenLoopWithContext({
      userId: params.userId,
      kind: "appointment_reminder",
      appointmentId: appt.id,
    });
    if (exists) continue;
    const when = Date.parse(appt.when);
    const reminderWake = new Date(Math.max(Date.now() + MS_HOUR, when - 12 * MS_HOUR));
    const label = `Remind about ${appt.title}`;
    await createOpenLoop({
      userId: params.userId,
      goal: label,
      nextWakeAt: reminderWake,
      source: "care_seed",
      context: {
        kind: "appointment_reminder",
        appointment_id: appt.id,
        concern: label,
      },
    });
    created += 1;
  }

  for (const lab of recentLabsWithoutFollowUp(params.snapshot)) {
    const exists = await hasOpenLoopWithContext({
      userId: params.userId,
      kind: "lab_follow_up",
    });
    if (exists) continue;
    await createOpenLoop({
      userId: params.userId,
      goal: `Follow up on ${lab.title}`,
      nextWakeAt: new Date(Date.now() + 2 * MS_DAY),
      source: "care_seed",
      context: {
        kind: "lab_follow_up",
        result_id: lab.id,
        concern: lab.title,
      },
    });
    created += 1;
    break;
  }

  return created;
}

export async function seedCareFollowUpLoopsForTick(params: {
  userId: string;
  snapshot: DoeDtcProfileSnapshot;
}): Promise<number> {
  return seedCareFollowUpLoops({
    userId: params.userId,
    snapshot: params.snapshot,
  });
}

export async function listCareSeedCandidateUserIds(): Promise<string[]> {
  const supabase = createSupabaseAdmin();
  const now = new Date();
  const dayAgo = new Date(now.getTime() - MS_DAY).toISOString();
  const threeDaysAgo = new Date(now.getTime() - 3 * MS_DAY).toISOString();
  const dayAhead = new Date(now.getTime() + MS_DAY).toISOString();

  const [symptoms, appointments, results] = await Promise.all([
    supabase.from("doedtc_symptoms").select("user_id").gte("created_at", dayAgo),
    supabase
      .from("doedtc_appointments")
      .select("user_id")
      .not("starts_at", "is", null)
      .gte("starts_at", now.toISOString())
      .lte("starts_at", dayAhead),
    supabase.from("doedtc_results").select("user_id").gte("created_at", threeDaysAgo),
  ]);

  const ids = new Set<string>();
  for (const row of [
    ...((symptoms.data ?? []) as Array<{ user_id: string }>),
    ...((appointments.data ?? []) as Array<{ user_id: string }>),
    ...((results.data ?? []) as Array<{ user_id: string }>),
  ]) {
    if (row.user_id) ids.add(row.user_id);
  }
  return [...ids];
}
