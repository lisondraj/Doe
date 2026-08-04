import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const PULSE_AMBIENT_FEATURE_CARDS = [
  {
    id: "pulse-ambient-post-call-prep",
    shaderVariant: v5,
    subheading: "Appointment prep begins the moment an agent call ends.",
    description:
      "When Pulse handles a call and an appointment is on the books, Ambient starts building the visit right away. Intake answers, scheduling details, and agent notes are assembled before the clinician ever opens the chart.",
  },
  {
    id: "pulse-ambient-weekly-summary",
    shaderVariant: v6,
    subheading: "Review your whole week in one prepared summary.",
    description:
      "Physicians get a single briefing of every upcoming patient and what Pulse already learned on the phone. You walk into Monday knowing what to analyze, not what to hunt down across tabs.",
  },
  {
    id: "pulse-ambient-session-start",
    shaderVariant: v7,
    subheading: "Tap Start on a pre-built session when the visit begins.",
    description:
      "Each appointment opens as a ready session tied to that patient and that day. One click starts Ambient in the room so documentation and retrieval run in the background while you stay in the conversation.",
  },
  {
    id: "pulse-ambient-live-room-capture",
    shaderVariant: v8,
    subheading: "Ambient listens in the room and surfaces what everyone says.",
    description:
      "The session transcribes the visit in real time, tuned for clinical vocabulary and multiple speakers. The thread stays visible when you need it, without turning the exam into a typing exercise.",
  },
  {
    id: "pulse-ambient-contextual-retrieval",
    shaderVariant: v9,
    subheading: "Relevant answers appear as the patient asks them.",
    description:
      "While the patient is talking, Ambient pulls chart facts, prior agent call history, and targeted web results into view. You can answer on time and keep your eyes on the patient, not the screen.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
