/** localStorage history for /voice-agent practice and learning sessions. */

import type {
  VoiceAgentFeedback,
  VoiceAgentHistoryRecord,
  VoiceAgentMode,
  VoiceAgentStationType,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";

const HISTORY_KEY = "doe-voice-agent-history-v1";
const MAX_RECORDS = 40;

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

function isHistoryRecord(value: unknown): value is VoiceAgentHistoryRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as VoiceAgentHistoryRecord;
  return (
    typeof record.id === "string" &&
    isMode(record.mode) &&
    typeof record.topic === "string" &&
    (record.stationType === null || isStationType(record.stationType)) &&
    typeof record.startedAt === "string" &&
    typeof record.endedAt === "string" &&
    Array.isArray(record.transcript) &&
    record.transcript.every(isTranscriptEntry) &&
    (record.feedback === null || isFeedback(record.feedback))
  );
}

export function loadVoiceAgentHistory(): VoiceAgentHistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryRecord);
  } catch {
    return [];
  }
}

export function upsertVoiceAgentHistory(record: VoiceAgentHistoryRecord): VoiceAgentHistoryRecord[] {
  const existing = loadVoiceAgentHistory();
  const next = [record, ...existing.filter((entry) => entry.id !== record.id)]
    .sort((a, b) => (a.endedAt < b.endedAt ? 1 : -1))
    .slice(0, MAX_RECORDS);

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /** quota or private mode — keep in-memory list */
  }

  return next;
}

export function transcriptForHistory(
  transcript: readonly VoiceAgentTranscriptEntry[],
): VoiceAgentTranscriptEntry[] {
  return transcript
    .filter((entry) => entry.final && entry.text.trim().length > 0)
    .map((entry) => ({
      id: entry.id,
      role: entry.role,
      text: entry.text.trim(),
      final: true,
    }));
}
