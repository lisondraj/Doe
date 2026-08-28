/** Chat history for /voice-agent — saved to the signed-in user's Supabase row. */

import { parseVoiceAgentLesson } from "@/lib/voice-agent/voice-agent-lesson";
import type {
  VoiceAgentFeedback,
  VoiceAgentHistoryRecord,
  VoiceAgentMode,
  VoiceAgentStationType,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";

function isMode(value: unknown): value is VoiceAgentMode {
  return value === "practice" || value === "learn";
}

function isStationType(value: unknown): value is VoiceAgentStationType {
  return value === "history" || value === "physical_exam" || value === "management_counseling";
}

function isTranscriptEntry(value: unknown): value is VoiceAgentTranscriptEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as VoiceAgentTranscriptEntry;
  return (
    typeof entry.id === "string" &&
    (entry.role === "user" || entry.role === "assistant") &&
    typeof entry.text === "string"
  );
}

function isFeedback(value: unknown): value is VoiceAgentFeedback {
  if (typeof value !== "object" || value === null) return false;
  const feedback = value as VoiceAgentFeedback;
  return (
    Array.isArray(feedback.strengths) &&
    Array.isArray(feedback.improvements) &&
    typeof feedback.overallImpression === "string"
  );
}

function toTranscript(value: unknown): VoiceAgentTranscriptEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isTranscriptEntry).map((entry) => ({
    id: entry.id,
    role: entry.role,
    text: entry.text,
    final: true,
  }));
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function parseVoiceAgentHistoryRecord(value: unknown): VoiceAgentHistoryRecord | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;
  const id = readString(row.id);
  const mode = row.mode;
  const topic = readString(row.topic);
  if (!id || !isMode(mode) || !topic) return null;

  const stationRaw = row.stationType ?? row.station_type;
  const stationType = stationRaw === null || stationRaw === undefined ? null : isStationType(stationRaw) ? stationRaw : null;
  const feedbackRaw = row.feedback;
  const feedback = feedbackRaw === null || feedbackRaw === undefined ? null : isFeedback(feedbackRaw) ? feedbackRaw : null;
  const startedAt = readString(row.startedAt) ?? readString(row.started_at);
  const endedAt = readString(row.endedAt) ?? readString(row.ended_at);
  if (!startedAt || !endedAt) return null;

  return {
    id,
    mode,
    topic,
    stationType,
    startedAt,
    endedAt,
    transcript: toTranscript(row.transcript),
    adviceTranscript: toTranscript(row.adviceTranscript ?? row.advice_transcript),
    feedback,
    lesson: parseVoiceAgentLesson(row.lesson),
  };
}

export function serializeVoiceAgentHistoryRecord(record: VoiceAgentHistoryRecord, userId: string) {
  return {
    id: record.id,
    user_id: userId,
    mode: record.mode,
    topic: record.topic,
    station_type: record.stationType,
    started_at: record.startedAt,
    ended_at: record.endedAt,
    transcript: record.transcript,
    advice_transcript: record.adviceTranscript ?? [],
    feedback: record.feedback,
    lesson: record.lesson,
    updated_at: new Date().toISOString(),
  };
}

export async function loadVoiceAgentHistory(): Promise<VoiceAgentHistoryRecord[]> {
  const response = await fetch("/api/voice-agent/history", { cache: "no-store" });
  const data = (await response.json().catch(() => null)) as { history?: unknown } | null;
  if (!response.ok || !data || !Array.isArray(data.history)) {
    if (!response.ok) console.error("voice-agent history load", data);
    return [];
  }
  return data.history
    .map((row) => parseVoiceAgentHistoryRecord(row))
    .filter((record): record is VoiceAgentHistoryRecord => record !== null);
}

export async function upsertVoiceAgentHistory(
  record: VoiceAgentHistoryRecord,
  options?: { keepalive?: boolean },
): Promise<VoiceAgentHistoryRecord[] | null> {
  const parsed = parseVoiceAgentHistoryRecord(record);
  if (!parsed) return null;

  try {
    const response = await fetch("/api/voice-agent/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
      keepalive: options?.keepalive === true,
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as { history?: unknown } | null;
    if (!response.ok || !data || !Array.isArray(data.history)) {
      if (!response.ok) console.error("voice-agent history upsert", data);
      return null;
    }
    return data.history
      .map((row) => parseVoiceAgentHistoryRecord(row))
      .filter((entry): entry is VoiceAgentHistoryRecord => entry !== null);
  } catch (error) {
    console.error("voice-agent history upsert", error);
    return null;
  }
}

export function transcriptForHistory(
  transcript: readonly VoiceAgentTranscriptEntry[],
): VoiceAgentTranscriptEntry[] {
  return transcript
    .filter((entry) => entry.text.trim().length > 0)
    .map((entry) => ({
      id: entry.id,
      role: entry.role,
      text: entry.text.trim(),
      final: true,
    }));
}
