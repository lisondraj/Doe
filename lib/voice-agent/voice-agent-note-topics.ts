import type {
  VoiceAgentNote,
  VoiceAgentNoteGroup,
  VoiceAgentStationType,
} from "@/lib/voice-agent/voice-agent-types";
import { VOICE_AGENT_NOTE_CATEGORIES } from "@/lib/voice-agent/voice-agent-types";

const TOPIC_STOP = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "or",
  "osce",
  "station",
  "case",
  "taking",
  "exam",
  "examination",
  "for",
  "with",
  "about",
]);

function emptyCategories(): Record<VoiceAgentStationType, VoiceAgentNote[]> {
  return {
    history: [],
    physical_exam: [],
    management_counseling: [],
  };
}

const TOPIC_SYNONYMS: Record<string, string> = {
  cp: "chest pain",
  acs: "chest pain",
  mi: "chest pain",
  nstemi: "chest pain",
  stemi: "chest pain",
  angina: "chest pain",
  sob: "shortness of breath",
  soob: "shortness of breath",
  dyspnoea: "shortness of breath",
  dyspnea: "shortness of breath",
};

export function normalizeTopicKey(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !TOPIC_STOP.has(token))
    .flatMap((token) => (TOPIC_SYNONYMS[token] ?? token).split(" "))
    .filter((token) => token.length >= 2 && !TOPIC_STOP.has(token))
    .join(" ")
    .trim();
}

function tokenSet(topic: string): Set<string> {
  const key = normalizeTopicKey(topic);
  return new Set(key ? key.split(" ") : []);
}

export function topicsMatch(a: string, b: string): boolean {
  const keyA = normalizeTopicKey(a);
  const keyB = normalizeTopicKey(b);
  if (!keyA || !keyB) return false;
  if (keyA === keyB) return true;
  if (keyA.includes(keyB) || keyB.includes(keyA)) return true;

  const setA = tokenSet(a);
  const setB = tokenSet(b);
  if (setA.size === 0 || setB.size === 0) return false;
  let overlap = 0;
  setB.forEach((token) => {
    if (setA.has(token)) overlap += 1;
  });
  const union = new Set<string>();
  setA.forEach((token) => union.add(token));
  setB.forEach((token) => union.add(token));
  return overlap / union.size >= 0.6;
}

export function tidyTopicName(topic: string): string {
  const fromKey = normalizeTopicKey(topic);
  const cleaned = (fromKey || topic.replace(/\b(osce|station|case)\b/gi, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "General";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function canonicalTopicName(candidate: string, existing: readonly string[]): string {
  const tidied = tidyTopicName(candidate);
  const match = existing.find((topic) => topicsMatch(tidied, topic));
  return match ?? tidied;
}

export function groupNotesByTopic(notes: readonly VoiceAgentNote[]): VoiceAgentNoteGroup[] {
  const groups: VoiceAgentNoteGroup[] = [];

  for (const note of notes) {
    const tidied = tidyTopicName(note.topic);
    const existing = groups.find((group) => topicsMatch(group.topic, note.topic) || topicsMatch(group.topic, tidied));
    if (existing) {
      existing.notesByCategory[note.category].push(note);
      existing.count += 1;
      if (note.createdAt > existing.updatedAt) existing.updatedAt = note.createdAt;
      if (tidied.length > existing.topic.length) existing.topic = tidied;
      continue;
    }
    const next = {
      topic: tidied,
      count: 1,
      updatedAt: note.createdAt,
      notesByCategory: emptyCategories(),
    };
    next.notesByCategory[note.category].push(note);
    groups.push(next);
  }

  for (const group of groups) {
    for (const category of VOICE_AGENT_NOTE_CATEGORIES) {
      group.notesByCategory[category].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
  }

  return groups.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
