/** Chat history for /voice-agent — Supabase is the source of truth. */

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { parseVoiceAgentLesson } from "@/lib/voice-agent/voice-agent-lesson";
import type {
  VoiceAgentFeedback,
  VoiceAgentHistoryRecord,
  VoiceAgentMode,
  VoiceAgentStationType,
  VoiceAgentTranscriptEntry,
} from "@/lib/voice-agent/voice-agent-types";

const MAX_RECORDS = 40;

interface VoiceAgentSessionRow {
  id: string;
  mode: string;
  topic: string;
  station_type: string | null;
  started_at: string;
  ended_at: string;
  transcript: unknown;
  advice_transcript: unknown;
  feedback: unknown;
  lesson: unknown;
}

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

function rowToRecord(row: VoiceAgentSessionRow): VoiceAgentHistoryRecord | null {
  if (!isMode(row.mode) || typeof row.topic !== "string") return null;
  const stationType = row.station_type === null ? null : isStationType(row.station_type) ? row.station_type : null;
  const feedback = row.feedback === null ? null : isFeedback(row.feedback) ? row.feedback : null;
  return {
    id: row.id,
    mode: row.mode,
    topic: row.topic,
    stationType,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    transcript: toTranscript(row.transcript),
    adviceTranscript: toTranscript(row.advice_transcript),
    feedback,
    lesson: parseVoiceAgentLesson(row.lesson),
  };
}

export async function loadVoiceAgentHistory(): Promise<VoiceAgentHistoryRecord[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("voice_agent_sessions")
    .select(
      "id, mode, topic, station_type, started_at, ended_at, transcript, advice_transcript, feedback, lesson",
    )
    .order("ended_at", { ascending: false })
    .limit(MAX_RECORDS);

  if (error || !data) {
    if (error) console.error("voice-agent history load", error);
    return [];
  }

  return data
    .map((row) => rowToRecord(row as VoiceAgentSessionRow))
    .filter((record): record is VoiceAgentHistoryRecord => record !== null);
}

export async function upsertVoiceAgentHistory(
  record: VoiceAgentHistoryRecord,
): Promise<VoiceAgentHistoryRecord[]> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { error } = await supabase.from("voice_agent_sessions").upsert(
    {
      id: record.id,
      user_id: user.id,
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
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("voice-agent history upsert", error);
  }

  return loadVoiceAgentHistory();
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
