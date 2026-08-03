import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_PULSE_FEATURE_CARDS = [
  {
    id: "pulse-panel-awareness",
    shaderVariant: v9,
    subheading: "Schedules appointments, asks pre-visit questions, and prepares your visit.",
    description:
      "Pulse books the visit, collects what the patient needs to know before they arrive, and makes sure your team walks in ready.",
  },
  {
    id: "pulse-signal-routing",
    shaderVariant: v1,
    subheading: "Instantly calls patients with future appointments to replace no-shows.",
    description:
      "When a slot opens, Pulse reaches out to patients on your waitlist and fills the opening before it becomes lost revenue.",
  },
  {
    id: "pulse-escalation-paths",
    shaderVariant: v2,
    subheading:
      "Waits on hold with insurers to set up prior authorization, handles all follow-up calls and updates the patient.",
    description:
      "Pulse stays on the line with payers, tracks every callback, and keeps the patient informed until authorization is complete.",
  },
  {
    id: "pulse-change-detection",
    shaderVariant: v3,
    subheading: "Prepares everything you need for a seamless appointment.",
    description:
      "Chart summaries, intake answers, and open tasks are gathered ahead of time so the visit starts on time and on track.",
  },
  {
    id: "pulse-role-triage",
    shaderVariant: v4,
    subheading: "Handles all clinic management calls so you can focus on patient care.",
    description:
      "Scheduling changes, billing questions, and front-desk requests go to Pulse so clinical staff can stay with patients.",
  },
  {
    id: "pulse-chart-linked-alerts",
    shaderVariant: v5,
    subheading: "Security tools so patient information never leaves your electronic medical record.",
    description:
      "Pulse reads and writes through your EMR so protected health information stays inside the systems you already trust.",
  },
  {
    id: "pulse-quiet-hours",
    shaderVariant: v6,
    subheading: "Remembers every call for every patient, ever.",
    description:
      "Full conversation history lives on the chart so any team member can pick up where the last call left off.",
  },
  {
    id: "pulse-specialty-filters",
    shaderVariant: v7,
    subheading: "Responds to all requests from your voicemail.",
    description:
      "Every message is returned, triaged, and resolved or routed without waiting for staff to replay the inbox.",
  },
  {
    id: "pulse-audit-trail",
    shaderVariant: v8,
    subheading:
      "Calls specialists to book referrals, and surfaces results in the patient's chart after their visit.",
    description:
      "Pulse coordinates outbound referral calls and logs outcomes in the record once the visit is done.",
  },
  {
    id: "pulse-closed-loop",
    shaderVariant: v0,
    subheading: "Extensive call history tools to track and log every agentic action.",
    description:
      "Searchable logs show who Pulse called, what it did, and what changed in the chart for audit and follow-up.",
  },
  {
    id: "pulse-multilingual",
    shaderVariant: v10,
    subheading: "Supports over 30+ languages, listens and analyzes at the same time.",
    description:
      "Patients can speak in their preferred language while Pulse understands and responds without a separate translation step.",
  },
  {
    id: "pulse-existing-stack",
    shaderVariant: v11,
    subheading: "Uses your existing clinic phone number and software.",
    description:
      "Keep the number patients already know and connect Pulse to the EMR and tools your clinic runs today.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
