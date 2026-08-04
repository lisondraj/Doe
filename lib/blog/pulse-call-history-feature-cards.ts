import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const PULSE_CALL_HISTORY_FEATURE_CARDS = [
  {
    id: "pulse-call-history-unified-review",
    shaderVariant: v0,
    subheading: "Review every agent-handled call from one workspace.",
    description:
      "Front desk, nursing, and physician leads open the same call history instead of chasing recordings across tools. Every conversation Pulse handles is searchable, sortable, and tied to the patient it served.",
  },
  {
    id: "pulse-call-history-agentic-logs",
    shaderVariant: v1,
    subheading: "See a timestamped log of every agentic action.",
    description:
      "Each chart update, handoff, and outbound follow-up is recorded with context. Compliance reviews and quality checks get facts instead of reconstructed memory.",
  },
  {
    id: "pulse-call-history-audio-playback",
    shaderVariant: v2,
    subheading: "Listen to full audio playback on demand.",
    description:
      "Replay any call the moment a question comes up. Staff hear exactly what was promised, what tone was used, and what still needs a human touch.",
  },
  {
    id: "pulse-call-history-agentic-callback",
    shaderVariant: v3,
    subheading: "Trigger agentic callbacks when follow-up is needed.",
    description:
      "When a thread needs another pass, Pulse can recall the patient with full context from the original call. No one re-explains the issue from scratch.",
  },
  {
    id: "pulse-call-history-prompt-analysis",
    shaderVariant: v4,
    subheading: "Analyze call patterns with natural-language prompts.",
    description:
      "Ask questions across your entire call history: common denial reasons, no-show recovery rates, or phrases that precede escalations. Get answers grounded in your clinic's data.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
