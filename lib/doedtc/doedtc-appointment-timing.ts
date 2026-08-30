export type DoeDtcAppointmentTimingPrecision = "exact" | "day" | "approximate";

export type DoeDtcAppointmentTimingInput = {
  title: string;
  timing_precision: DoeDtcAppointmentTimingPrecision;
  starts_at?: string | null;
  timing_note?: string | null;
  location?: string | null;
  notes?: string | null;
};

export type NormalizedDoeDtcAppointmentTiming = {
  title: string;
  startsAt: string | null;
  timingNote: string | null;
  location: string | null;
  notes: string | null;
};

const TIMING_PRECISIONS = new Set<DoeDtcAppointmentTimingPrecision>(["exact", "day", "approximate"]);

export function normalizeDoeDtcAppointmentTiming(
  input: DoeDtcAppointmentTimingInput,
): NormalizedDoeDtcAppointmentTiming {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Title is required.");
  }

  const precision = input.timing_precision;
  if (!TIMING_PRECISIONS.has(precision)) {
    throw new Error("Invalid timing_precision.");
  }

  const location = input.location?.trim() || null;
  const notes = input.notes?.trim() || null;

  if (precision === "approximate") {
    const timingNote = input.timing_note?.trim() ?? "";
    if (!timingNote) {
      throw new Error("timing_note is required when timing is approximate.");
    }
    if (input.starts_at?.trim()) {
      throw new Error(
        "Do not invent starts_at for approximate timing. Use timing_note with the user's exact words.",
      );
    }
    return { title, startsAt: null, timingNote, location, notes };
  }

  const startsAtRaw = input.starts_at?.trim() ?? "";
  if (!startsAtRaw) {
    throw new Error("starts_at is required when timing_precision is exact or day.");
  }

  const parsedDate = new Date(startsAtRaw);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid appointment datetime.");
  }

  if (precision === "exact" && looksLikeInventedMidnight(parsedDate)) {
    throw new Error(
      "Exact timing needs a time from the user. Use timing_precision day if only the date is known, or approximate if timing is vague.",
    );
  }

  return {
    title,
    startsAt: parsedDate.toISOString(),
    timingNote: null,
    location,
    notes,
  };
}

function looksLikeInventedMidnight(date: Date): boolean {
  return date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0;
}

export function formatDoeDtcAppointmentWhen(row: {
  starts_at: string | null;
  timing_note: string | null;
}): string {
  if (row.timing_note?.trim()) {
    return row.timing_note.trim();
  }
  if (!row.starts_at) {
    return "Date not set";
  }
  return new Date(row.starts_at).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
