/** Station formats modeled on real OSCE (Objective Structured Clinical Examination) circuits. */
export type VoiceAgentStationType = "history" | "physical_exam" | "management_counseling";

export type VoiceAgentMode = "practice" | "learn";

export interface VoiceAgentSetup {
  durationMinutes: number;
  topic: string;
  stationType: VoiceAgentStationType;
  checklist: readonly string[];
}

export interface VoiceAgentTranscriptEntry {
  id: string;
  role: "user" | "assistant";
  text: string;
  final: boolean;
}

export interface VoiceAgentFeedback {
  strengths: readonly string[];
  improvements: readonly string[];
  overallImpression: string;
}

export interface VoiceAgentHistoryRecord {
  id: string;
  mode: VoiceAgentMode;
  topic: string;
  stationType: VoiceAgentStationType | null;
  startedAt: string;
  endedAt: string;
  transcript: VoiceAgentTranscriptEntry[];
  adviceTranscript: VoiceAgentTranscriptEntry[];
  feedback: VoiceAgentFeedback | null;
}

export const VOICE_AGENT_STATION_LABELS: Record<VoiceAgentStationType, string> = {
  history: "History taking",
  physical_exam: "Physical examination",
  management_counseling: "Management & counseling",
};

export const VOICE_AGENT_MODE_LABELS: Record<VoiceAgentMode, string> = {
  practice: "Practice",
  learn: "Learning",
};

export const VOICE_AGENT_NOTE_CATEGORIES: readonly VoiceAgentStationType[] = [
  "history",
  "physical_exam",
  "management_counseling",
];

export const VOICE_AGENT_NOTE_CATEGORY_LABELS: Record<VoiceAgentStationType, string> = {
  history: "History",
  physical_exam: "Physical exam",
  management_counseling: "Management / counselling",
};

export interface VoiceAgentNote {
  id: string;
  topic: string;
  category: VoiceAgentStationType;
  text: string;
  createdAt: string;
}

export interface VoiceAgentNoteGroup {
  topic: string;
  count: number;
  updatedAt: string;
  notesByCategory: Record<VoiceAgentStationType, VoiceAgentNote[]>;
}
