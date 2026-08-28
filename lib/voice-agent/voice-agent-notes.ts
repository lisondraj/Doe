/** Spoken OSCE notes — grouped by topic, then history / exam / management. */

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { canonicalTopicName } from "@/lib/voice-agent/voice-agent-note-topics";
import type { VoiceAgentNote, VoiceAgentStationType } from "@/lib/voice-agent/voice-agent-types";

export {
  canonicalTopicName,
  groupNotesByTopic,
  tidyTopicName,
  topicsMatch,
} from "@/lib/voice-agent/voice-agent-note-topics";

interface VoiceAgentNoteRow {
  id: string;
  topic: string;
  category: string;
  body: string;
  created_at: string;
}

function isStationType(value: unknown): value is VoiceAgentStationType {
  return value === "history" || value === "physical_exam" || value === "management_counseling";
}

export function parseVoiceAgentNote(value: unknown): VoiceAgentNote | null {
  if (typeof value !== "object" || value === null) return null;
  const row = value as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : null;
  const topic = typeof row.topic === "string" ? row.topic.trim() : "";
  const category = row.category;
  const body = typeof row.body === "string" ? row.body : typeof row.text === "string" ? row.text : "";
  const createdAt = typeof row.created_at === "string" ? row.created_at : typeof row.createdAt === "string" ? row.createdAt : "";
  if (!id || !topic || !isStationType(category) || !body.trim() || !createdAt) return null;
  return { id, topic, category, text: body.trim(), createdAt };
}

function rowToNote(row: VoiceAgentNoteRow): VoiceAgentNote | null {
  return parseVoiceAgentNote(row);
}

export async function loadVoiceAgentNotes(): Promise<VoiceAgentNote[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("voice_agent_notes")
    .select("id, topic, category, body, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("voice-agent notes load", error);
    return [];
  }

  return data
    .map((row) => rowToNote(row as VoiceAgentNoteRow))
    .filter((note): note is VoiceAgentNote => note !== null);
}

export async function insertVoiceAgentNote(input: {
  topic: string;
  category: VoiceAgentStationType;
  text: string;
}): Promise<VoiceAgentNote[]> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const existing = await loadVoiceAgentNotes();
  const topic = canonicalTopicName(
    input.topic,
    Array.from(new Set(existing.map((note) => note.topic))),
  );
  const body = input.text.trim();
  if (!body) return existing;

  const { error } = await supabase.from("voice_agent_notes").insert({
    user_id: user.id,
    topic,
    category: input.category,
    body,
  });

  if (error) {
    console.error("voice-agent notes insert", error);
  }

  return loadVoiceAgentNotes();
}

export async function deleteVoiceAgentNote(id: string): Promise<VoiceAgentNote[]> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("voice_agent_notes").delete().eq("id", id);
  if (error) console.error("voice-agent notes delete", error);
  return loadVoiceAgentNotes();
}
