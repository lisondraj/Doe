/** Station formats modeled on real OSCE (Objective Structured Clinical Examination) circuits. */
export type VoiceAgentStationType = "history" | "physical_exam" | "management_counseling";

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

export const VOICE_AGENT_STATION_LABELS: Record<VoiceAgentStationType, string> = {
  history: "History taking",
  physical_exam: "Physical examination",
  management_counseling: "Management & counseling",
};
