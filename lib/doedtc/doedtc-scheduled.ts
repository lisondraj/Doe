import type { DoeDtcScheduledTextRow } from "@/lib/doedtc/doedtc-types";

const DEFAULT_TIMEZONE = "America/New_York";

export function normalizeScheduledTimezone(raw?: string | null): string {
  return typeof raw === "string" && raw.trim() ? raw.trim() : DEFAULT_TIMEZONE;
}

export function parseScheduledSendAt(raw: string, from = new Date()): Date {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Send time is required.");

  const absolute = new Date(trimmed);
  if (!Number.isNaN(absolute.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return absolute;
  }

  const lower = trimmed.toLowerCase();
  const tomorrowMatch = lower.match(/^tomorrow(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (tomorrowMatch) {
    const date = new Date(from);
    date.setDate(date.getDate() + 1);
    applyTimeParts(date, tomorrowMatch[1], tomorrowMatch[2], tomorrowMatch[3]);
    return date;
  }

  const atMatch = lower.match(/^at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (atMatch) {
    const date = new Date(from);
    applyTimeParts(date, atMatch[1], atMatch[2], atMatch[3]);
    if (date <= from) date.setDate(date.getDate() + 1);
    return date;
  }

  const inHoursMatch = lower.match(/^in\s+(\d+)\s+hours?$/i);
  if (inHoursMatch) {
    return new Date(from.getTime() + Number(inHoursMatch[1]) * 60 * 60 * 1000);
  }

  const inMinutesMatch = lower.match(/^in\s+(\d+)\s+minutes?$/i);
  if (inMinutesMatch) {
    return new Date(from.getTime() + Number(inMinutesMatch[1]) * 60 * 1000);
  }

  if (!Number.isNaN(absolute.getTime())) return absolute;
  throw new Error("Could not parse send time.");
}

function applyTimeParts(
  date: Date,
  hourRaw?: string,
  minuteRaw?: string,
  meridiemRaw?: string,
): void {
  if (!hourRaw) {
    date.setHours(9, 0, 0, 0);
    return;
  }
  let hour = Number(hourRaw);
  const minute = minuteRaw ? Number(minuteRaw) : 0;
  const meridiem = meridiemRaw?.toLowerCase();
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  date.setHours(hour, minute, 0, 0);
}

export function formatScheduledTextForAgent(rows: DoeDtcScheduledTextRow[]): string {
  if (rows.length === 0) return "No scheduled texts.";
  return rows
    .map((row) => {
      const when = row.send_at.slice(0, 16).replace("T", " ");
      return `- ${row.intent} | to: ${row.recipient_phone} | at: ${when} | status: ${row.status} | id: ${row.id}`;
    })
    .join("\n");
}

export function formatScheduledSendAtLabel(sendAt: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(sendAt);
  } catch {
    return sendAt.toISOString();
  }
}

export function isScheduleOfferText(text: string): boolean {
  return /\b(text you|text me|remind you|remind me|send you a text|scheduled text)\b/i.test(text);
}
