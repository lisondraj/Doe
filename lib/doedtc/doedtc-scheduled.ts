import type { DoeDtcScheduledTextRow } from "@/lib/doedtc/doedtc-types";

export const DEFAULT_TIMEZONE = "America/New_York";

/** Sub-minute delays fire from the inbound worker after the confirmation reply is sent. */
export const INLINE_SCHEDULE_MAX_MS = 45_000;

export function normalizeScheduledTimezone(raw?: string | null): string {
  return typeof raw === "string" && raw.trim() ? raw.trim() : DEFAULT_TIMEZONE;
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getDatePartsInZone(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    minute: Number(parts.minute),
  };
}

/** Convert wall-clock in `timeZone` to a UTC instant. */
export function wallTimeInZoneToUtc(
  parts: ZonedParts,
  timeZone: string,
): Date {
  const desiredUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
  let guess = desiredUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const shown = getDatePartsInZone(new Date(guess), timeZone);
    const shownUtc = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour, shown.minute, 0);
    const delta = desiredUtc - shownUtc;
    if (delta === 0) break;
    guess += delta;
  }
  return new Date(guess);
}

function addLocalDays(parts: ZonedParts, days: number): ZonedParts {
  const base = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, 12, 0, 0));
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
    day: base.getUTCDate(),
    hour: parts.hour,
    minute: parts.minute,
  };
}

function hasAbsoluteOffset(raw: string): boolean {
  return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw.trim());
}

function isNaiveIsoDateTime(raw: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?)?$/.test(raw.trim());
}

function parseNaiveIso(raw: string, timeZone: string): Date {
  const normalized = raw.trim().replace(" ", "T");
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) throw new Error("Could not parse send time.");
  return wallTimeInZoneToUtc(
    {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
    },
    timeZone,
  );
}

function applyTimeParts(
  parts: ZonedParts,
  hourRaw?: string,
  minuteRaw?: string,
  meridiemRaw?: string,
): ZonedParts {
  if (!hourRaw) {
    return { ...parts, hour: 9, minute: 0 };
  }
  let hour = Number(hourRaw);
  const minute = minuteRaw ? Number(minuteRaw) : 0;
  const meridiem = meridiemRaw?.toLowerCase();
  if (meridiem === "pm" && hour < 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;
  return { ...parts, hour, minute };
}

export function ensureFutureSendAt(
  sendAt: Date,
  from = new Date(),
  timeZone = DEFAULT_TIMEZONE,
  maxRollDays = 7,
): Date {
  let candidate = sendAt;
  let rolls = 0;
  while (candidate.getTime() <= from.getTime() && rolls < maxRollDays) {
    const parts = getDatePartsInZone(candidate, timeZone);
    const rolled = addLocalDays(parts, 1);
    candidate = wallTimeInZoneToUtc(rolled, timeZone);
    rolls += 1;
  }
  return candidate;
}

export function parseScheduledSendAt(
  raw: string,
  from = new Date(),
  timezone = DEFAULT_TIMEZONE,
): Date {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Send time is required.");

  const timeZone = normalizeScheduledTimezone(timezone);
  const nowParts = getDatePartsInZone(from, timeZone);

  if (isNaiveIsoDateTime(trimmed) && !hasAbsoluteOffset(trimmed)) {
    return parseNaiveIso(trimmed, timeZone);
  }

  const absolute = new Date(trimmed);
  if (!Number.isNaN(absolute.getTime()) && hasAbsoluteOffset(trimmed)) {
    return absolute;
  }

  const lower = trimmed.toLowerCase();

  const inHoursMatch = lower.match(/^in\s+(\d+)\s+hours?$/i);
  if (inHoursMatch) {
    return new Date(from.getTime() + Number(inHoursMatch[1]) * 60 * 60 * 1000);
  }

  const inMinutesMatch = lower.match(/^in\s+(\d+)\s+minutes?$/i);
  if (inMinutesMatch) {
    return new Date(from.getTime() + Number(inMinutesMatch[1]) * 60 * 1000);
  }

  const inSecondsMatch = lower.match(/^in\s+(\d+)\s+seconds?$/i);
  if (inSecondsMatch) {
    return new Date(from.getTime() + Number(inSecondsMatch[1]) * 1000);
  }

  const forSecondsMatch = lower.match(/^for\s+(\d+)\s+seconds?$/i);
  if (forSecondsMatch) {
    return new Date(from.getTime() + Number(forSecondsMatch[1]) * 1000);
  }

  const todayMatch = lower.match(/^today(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (todayMatch) {
    const parts = applyTimeParts(nowParts, todayMatch[1], todayMatch[2], todayMatch[3]);
    return wallTimeInZoneToUtc(parts, timeZone);
  }

  const tomorrowMatch = lower.match(/^tomorrow(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/i);
  if (tomorrowMatch) {
    const base = addLocalDays(nowParts, 1);
    const parts = applyTimeParts(base, tomorrowMatch[1], tomorrowMatch[2], tomorrowMatch[3]);
    return wallTimeInZoneToUtc(parts, timeZone);
  }

  const atMatch = lower.match(/^at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (atMatch) {
    let parts = applyTimeParts(nowParts, atMatch[1], atMatch[2], atMatch[3]);
    let candidate = wallTimeInZoneToUtc(parts, timeZone);
    if (candidate.getTime() <= from.getTime()) {
      parts = addLocalDays(parts, 1);
      candidate = wallTimeInZoneToUtc(parts, timeZone);
    }
    return candidate;
  }

  const clockMatch = lower.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (clockMatch) {
    let parts = applyTimeParts(nowParts, clockMatch[1], clockMatch[2], clockMatch[3]);
    let candidate = wallTimeInZoneToUtc(parts, timeZone);
    if (candidate.getTime() <= from.getTime()) {
      parts = addLocalDays(parts, 1);
      candidate = wallTimeInZoneToUtc(parts, timeZone);
    }
    return candidate;
  }

  if (!Number.isNaN(absolute.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return absolute;
  }

  if (!Number.isNaN(absolute.getTime())) return absolute;
  throw new Error("Could not parse send time.");
}

export function scheduledDelayMs(sendAt: Date, from = new Date()): number {
  return Math.max(0, sendAt.getTime() - from.getTime());
}

export function shouldSendScheduledTextInline(sendAt: Date, from = new Date()): boolean {
  const delayMs = scheduledDelayMs(sendAt, from);
  return delayMs > 0 && delayMs < INLINE_SCHEDULE_MAX_MS;
}

export function agentNowLabel(timezone = DEFAULT_TIMEZONE): string {
  const now = new Date();
  const timeZone = normalizeScheduledTimezone(timezone);
  try {
    const date = new Intl.DateTimeFormat(undefined, {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);
    const time = new Intl.DateTimeFormat(undefined, {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(now);
    return `${date} · ${time}`;
  } catch {
    return now.toISOString();
  }
}

export type ScheduledTextFileDraft = {
  intent: string;
  sendAt: string | null;
  summary: string;
  awaitingBody: boolean;
};

export type ScheduledTextFile = {
  committed: DoeDtcScheduledTextRow[];
  recentlySent: DoeDtcScheduledTextRow[];
  draft: ScheduledTextFileDraft | null;
};

export function buildScheduledTextFile(params: {
  rows: DoeDtcScheduledTextRow[];
  pending?: { kind: string; summary: string; args: Record<string, unknown> } | null;
}): ScheduledTextFile {
  const committed = params.rows.filter((row) => row.status === "pending");
  const recentlySent = params.rows.filter((row) => row.status === "sent");
  const pending = params.pending;
  const isRunState = typeof pending?.args.runState === "string" && String(pending.args.runState).trim().length > 0;
  let draft: ScheduledTextFileDraft | null = null;
  if (pending && pending.kind === "schedule_text" && !isRunState) {
    draft = {
      intent: typeof pending.args.intent === "string" && pending.args.intent.trim()
        ? pending.args.intent.trim()
        : "reminder",
      sendAt: typeof pending.args.send_at === "string" ? pending.args.send_at : null,
      summary: pending.summary,
      awaitingBody: pending.args.awaiting_body === true,
    };
  }
  return { committed, recentlySent, draft };
}

export function scheduledTextFileIsEmpty(file: ScheduledTextFile): boolean {
  return file.committed.length === 0 && file.recentlySent.length === 0 && file.draft === null;
}

function formatScheduledTextRowForAgent(row: DoeDtcScheduledTextRow): string {
  const when = row.send_at.slice(0, 16).replace("T", " ");
  return `- ${row.intent} | to: ${row.recipient_phone} | at: ${when} | status: ${row.status} | id: ${row.id}`;
}

export function formatScheduledTextForAgent(rows: DoeDtcScheduledTextRow[]): string {
  if (rows.length === 0) return "No scheduled texts.";
  return rows.map(formatScheduledTextRowForAgent).join("\n");
}

export function formatScheduledTextFileForAgent(file: ScheduledTextFile): string {
  const parts: string[] = [];
  if (file.committed.length > 0) {
    parts.push("Committed (on the file):");
    parts.push(...file.committed.map(formatScheduledTextRowForAgent));
  }
  if (file.recentlySent.length > 0) {
    parts.push("Recently sent (already delivered, not upcoming):");
    parts.push(...file.recentlySent.map(formatScheduledTextRowForAgent));
  }
  if (file.draft) {
    const wait = file.draft.awaitingBody ? " Still waiting for the reminder body." : "";
    parts.push(`Draft (NOT on the file until they confirm): ${file.draft.summary}.${wait}`);
  }
  if (parts.length === 0) return "No scheduled texts. No drafts.";
  return parts.join("\n");
}

export function serializeScheduledTextFile(file: ScheduledTextFile): {
  committed: Array<{
    id: string;
    intent: string;
    send_at: string;
    status: string;
    recipient_phone: string;
  }>;
  recently_sent: Array<{
    id: string;
    intent: string;
    send_at: string;
    status: string;
    recipient_phone: string;
  }>;
  draft: {
    draft: true;
    intent: string;
    send_at: string | null;
    summary: string;
    awaiting_body: boolean;
  } | null;
} {
  const serializeRow = (row: DoeDtcScheduledTextRow) => ({
    id: row.id,
    intent: row.intent,
    send_at: row.send_at,
    status: row.status,
    recipient_phone: row.recipient_phone,
  });
  return {
    committed: file.committed.map(serializeRow),
    recently_sent: file.recentlySent.map(serializeRow),
    draft: file.draft
      ? {
          draft: true,
          intent: file.draft.intent,
          send_at: file.draft.sendAt,
          summary: file.draft.summary,
          awaiting_body: file.draft.awaitingBody,
        }
      : null,
  };
}

function labelScheduledIntent(intent: string): string {
  const trimmed = intent.trim();
  return trimmed || "reminder";
}

export function formatScheduledTextFileReply(file: ScheduledTextFile): string {
  if (scheduledTextFileIsEmpty(file)) {
    return "There's nothing set right now.";
  }
  const parts: string[] = [];
  if (file.committed.length > 0) {
    const names = file.committed.map((row) => labelScheduledIntent(row.intent)).join(", ");
    parts.push(`On the file: ${names}.`);
  }
  if (file.recentlySent.length > 0) {
    const names = file.recentlySent.map((row) => labelScheduledIntent(row.intent)).join(", ");
    parts.push(`Already sent: ${names}.`);
  }
  if (file.draft) {
    parts.push(
      file.draft.awaitingBody
        ? `I have a draft for ${labelScheduledIntent(file.draft.intent)}. Tell me what it should say and I'll set it.`
        : `I drafted ${file.draft.summary}. It's not in your file until you confirm.`,
    );
  }
  return parts.join(" ");
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
  return /\b(text you|text me|remind you|remind me|set up a reminder|send you a text|scheduled text|schedule (?:this|that|it)|want me to (?:text|set|schedule|remind))\b/i.test(
    text,
  );
}

export function isPendingOfferText(text: string): boolean {
  return (
    isScheduleOfferText(text) ||
    /\b(want me to save|save this to your profile|start this accountability|confirm before|want me to set that)\b/i.test(
      text,
    )
  );
}
