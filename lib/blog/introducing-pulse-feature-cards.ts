import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_PULSE_FEATURE_CARDS = [
  {
    id: "pulse-panel-awareness",
    shaderVariant: v9,
    subheading: "Schedules appointments, asks pre-visit questions, and prepares your visit.",
    description:
      "Pulse watches every patient on your panel and surfaces meaningful shifts — not every tick, only the changes that deserve a clinician's attention.",
  },
  {
    id: "pulse-signal-routing",
    shaderVariant: v1,
    subheading: "Instantly calls patients with future appointments to replace no-shows",
    description:
      "Each alert arrives with chart context and a suggested owner, so the right nurse, MA, or physician sees the work without a manual handoff.",
  },
  {
    id: "pulse-escalation-paths",
    shaderVariant: v2,
    subheading:
      "Waits on hold with insurers to set up prior authorization, handles all follow-up calls and updates the patient",
    description:
      "When a signal persists or worsens, Pulse escalates along paths your practice defines — with timestamps, notes, and accountability built in.",
  },
  {
    id: "pulse-change-detection",
    shaderVariant: v3,
    subheading: "Prepares everything you need for a seamless appointment.",
    description:
      "Labs, vitals, messages, and orders are compared against recent baselines so teams catch drift early instead of at the next visit.",
  },
  {
    id: "pulse-role-triage",
    shaderVariant: v4,
    subheading: "Handles all clinic management calls so you can focus on patient care.",
    description:
      "Routing respects scope of practice and shift coverage, keeping front-desk noise out of clinical queues and vice versa.",
  },
  {
    id: "pulse-chart-linked-alerts",
    shaderVariant: v5,
    subheading: "Security tools so patient information never leaves your electronic medical record.",
    description:
      "Every Pulse item opens directly into the relevant chart section, thread, or task so staff never reconstruct context from a push notification alone.",
  },
  {
    id: "pulse-quiet-hours",
    shaderVariant: v6,
    subheading: "Remembers every call for every patient, ever.",
    description:
      "Practices set when signals may interrupt and when they should queue, protecting after-hours teams without losing overnight urgency.",
  },
  {
    id: "pulse-specialty-filters",
    shaderVariant: v7,
    subheading: "Responds to all requests from your voicemail.",
    description:
      "Cardiology, primary care, and behavioral health teams each define which streams matter to them — Pulse adapts per specialty and site.",
  },
  {
    id: "pulse-audit-trail",
    shaderVariant: v8,
    subheading: "Audit Trail",
    description:
      "Who saw a signal, who acted, and what changed is logged automatically for compliance, handoffs, and quality review.",
  },
  {
    id: "pulse-closed-loop",
    shaderVariant: v0,
    subheading: "Closed-Loop Actions",
    description:
      "Signals can resolve into tasks, messages, or documentation updates inside Doe so awareness turns into completed work, not another open tab.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
