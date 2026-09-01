/** Live chart views — committed profile state pullable after writes (mirrors ScheduledTextFile). */

import {
  buildScheduledTextFile,
  formatScheduledTextFileReply,
  type ScheduledTextFile,
} from "@/lib/doedtc/doedtc-scheduled";
import type {
  DoeDtcAppointmentRow,
  DoeDtcArtifactRow,
  DoeDtcHouseholdMemberRow,
  DoeDtcProfileSnapshot,
} from "@/lib/doedtc/doedtc-types";
import { formatDoeDtcAppointmentWhen } from "@/lib/doedtc/doedtc-appointment-timing";
import { householdMemberState } from "@/lib/doedtc/doedtc-household-policy";

export type ChartFile = {
  household: DoeDtcHouseholdMemberRow[];
  appointments: DoeDtcAppointmentRow[];
  artifacts: DoeDtcArtifactRow[];
  reminders: ScheduledTextFile;
};

export function buildChartFile(params: {
  snapshot: Pick<
    DoeDtcProfileSnapshot,
    "household" | "appointments" | "artifacts" | "scheduledTexts"
  >;
  pending?: { kind: string; summary: string; args: Record<string, unknown> } | null;
}): ChartFile {
  return {
    household: params.snapshot.household.members,
    appointments: params.snapshot.appointments,
    artifacts: params.snapshot.artifacts.filter((row) => !row.archived_at),
    reminders: buildScheduledTextFile({
      rows: params.snapshot.scheduledTexts,
      pending: params.pending ?? null,
    }),
  };
}

export function formatHouseholdChartReply(members: DoeDtcHouseholdMemberRow[]): string {
  const others = members.filter((row) => row.role !== "admin");
  if (others.length === 0) {
    return "No one else is on your household chart yet.";
  }
  return others
    .map((row) => {
      const state = householdMemberState(row);
      const phone = row.phone ? "phone on file" : "no phone";
      return `${row.full_name} (${row.relationship}, ${state}, ${phone})`;
    })
    .join("; ");
}

export function formatAppointmentsChartReply(appointments: DoeDtcAppointmentRow[]): string {
  if (appointments.length === 0) {
    return "No appointments on your chart yet.";
  }
  return appointments
    .slice(0, 8)
    .map((row) => {
      const when = formatDoeDtcAppointmentWhen(row);
      return `${row.title} (${when})`;
    })
    .join("; ");
}

export function memberExistsOnChart(
  members: DoeDtcHouseholdMemberRow[],
  name: string | null | undefined,
): boolean {
  if (!name?.trim()) return false;
  const trimmed = name.trim().toLowerCase();
  return members.some(
    (row) =>
      row.full_name.trim().toLowerCase() === trimmed ||
      row.full_name.trim().toLowerCase().split(/\s+/)[0] === trimmed,
  );
}

export function findRecentAppointmentForSubject(params: {
  appointments: DoeDtcAppointmentRow[];
  subjectName?: string | null;
  inboundText: string;
}): DoeDtcAppointmentRow | null {
  const recent = [...params.appointments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  if (recent.length === 0) return null;

  const subject = params.subjectName?.trim().toLowerCase();
  if (subject) {
    const tagged = recent.find((row) => row.notes?.toLowerCase().includes(subject));
    if (tagged) return tagged;
  }

  const text = params.inboundText.toLowerCase();
  for (const row of recent) {
    const title = row.title.toLowerCase();
    if (title && text.includes(title)) return row;
    if (row.notes && text.includes(row.notes.toLowerCase().slice(0, 24))) return row;
  }

  return recent[0] ?? null;
}

export function inboundAsksChartStatus(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return (
    /\b(?:on (?:the|my) chart|in (?:the|my) (?:household|family|file)|who(?:'s| is) on|anyone on|do i have .+ on)\b/i.test(
      trimmed,
    ) ||
    /\b(?:what appointments?|any appointments?)\b/i.test(trimmed)
  );
}

export function replyClaimsAppointmentLogged(text: string): boolean {
  return /\b(?:i(?:'ve| have) (?:booked|logged|saved|added)|booked|logged|saved)\b.{0,40}\b(?:appointment|dentist|doctor|visit)\b/i.test(
    text,
  );
}

export function replyClaimsMemberAdded(text: string): boolean {
  return /\b(?:i(?:'ve| have) added|added)\b.{0,32}\b(?:to (?:the|your) (?:chart|household|family)|on (?:the|your) chart)\b/i.test(
    text,
  );
}

export function replyClaimsArtifactLogged(text: string): boolean {
  return /\b(?:i(?:'ve| have)? logged|logged)\b.{0,40}\b(?:glasses?|shot|dose|water|entry|tracker)\b/i.test(
    text,
  );
}

export function reconcileReplyWithChartFile(params: {
  inboundText: string;
  replyText: string;
  file: ChartFile;
  subjectName?: string | null;
  logAppointmentSucceeded: boolean;
  logFamilyMemberSucceeded: boolean;
  logArtifactEntrySucceeded: boolean;
}): string {
  let reply = params.replyText;

  const asksStatus = inboundAsksChartStatus(params.inboundText);
  if (asksStatus && /\bappointment/i.test(params.inboundText)) {
    return formatAppointmentsChartReply(params.file.appointments);
  }
  if (asksStatus && /\b(?:household|family|chart)\b/i.test(params.inboundText)) {
    return formatHouseholdChartReply(params.file.household);
  }

  const claimsAppointment = replyClaimsAppointmentLogged(reply);
  if (claimsAppointment && !params.logAppointmentSucceeded) {
    const match = findRecentAppointmentForSubject({
      appointments: params.file.appointments,
      subjectName: params.subjectName,
      inboundText: params.inboundText,
    });
    if (match) {
      reply = `I've got ${match.title} on the chart (${formatDoeDtcAppointmentWhen(match)}).`;
    } else if (params.subjectName && !memberExistsOnChart(params.file.household, params.subjectName)) {
      reply = `${params.subjectName} isn't on the household yet. Add them first, then I can log the appointment.`;
    } else {
      reply = "I haven't saved that appointment yet.";
    }
  }

  const claimsMember = replyClaimsMemberAdded(reply);
  if (claimsMember && !params.logFamilyMemberSucceeded) {
    const name = params.subjectName;
    if (name && memberExistsOnChart(params.file.household, name)) {
      reply = `${name} is on your household chart.`;
    } else {
      reply = "I haven't added them to the chart yet.";
    }
  }

  const claimsArtifact = replyClaimsArtifactLogged(reply);
  if (claimsArtifact && !params.logArtifactEntrySucceeded) {
    reply = "I haven't logged that on your tracker yet.";
  }

  const reminderReply = formatScheduledTextFileReply(params.file.reminders);
  if (
    (/\b(?:no reminders?|nothing set)\b/i.test(reply) ||
      /\b(?:i(?:'ve| have) set|reminder (?:is|for))\b/i.test(reply)) &&
    params.file.reminders.committed.length + params.file.reminders.recentlySent.length > 0
  ) {
    return reminderReply;
  }

  return reply;
}

export { formatScheduledTextFileReply };
