import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_PULSE_FEATURE_CARDS = [
  {
    id: "pulse-panel-awareness",
    shaderVariant: v9,
    subheading: "Schedules appointments, asks pre-visit questions, and prepares your visit.",
    description:
      "Patients get confirmed slots and tailored intake before they walk in. Your MA opens the chart to completed answers instead of a blank form.",
  },
  {
    id: "pulse-signal-routing",
    shaderVariant: v1,
    subheading: "Instantly calls patients with future appointments to replace no-shows.",
    description:
      "Open slots get offered to waitlisted patients in minutes, not after a staff member finds time to dial. Recovery happens while the schedule is still fresh.",
  },
  {
    id: "pulse-escalation-paths",
    shaderVariant: v2,
    subheading:
      "Waits on hold with insurers to set up prior authorization, handles all follow-up calls and updates the patient.",
    description:
      "Your team stops losing hours to payer hold music. Status notes land in the chart and the patient hears back without chasing the front desk.",
  },
  {
    id: "pulse-change-detection",
    shaderVariant: v3,
    subheading: "Prepares everything you need for a seamless appointment.",
    description:
      "Labs, meds, and outstanding orders are pulled together before the clinician enters the room. Fewer surprises mean shorter visits and happier patients.",
  },
  {
    id: "pulse-role-triage",
    shaderVariant: v4,
    subheading: "Handles all clinic management calls so you can focus on patient care.",
    description:
      "Refill requests, parking questions, and insurance updates get resolved on the first call. Nurses and physicians stay in exam rooms instead of playing phone tag.",
  },
  {
    id: "pulse-chart-linked-alerts",
    shaderVariant: v5,
    subheading: "Security tools so patient information never leaves your electronic medical record.",
    description:
      "Agents pull facts from and write back to your EMR under the same access controls your staff use. No shadow databases or copied charts sitting outside your stack.",
  },
  {
    id: "pulse-quiet-hours",
    shaderVariant: v6,
    subheading: "Remembers every call for every patient, ever.",
    description:
      "A new front-desk hire can see what was promised last Tuesday. Context survives staff turnover, shift changes, and handoffs between sites.",
  },
  {
    id: "pulse-specialty-filters",
    shaderVariant: v7,
    subheading: "Responds to all requests from your voicemail.",
    description:
      "Overnight messages do not pile up until Monday morning. Pulse returns each call, captures intent, and either closes the loop or flags what still needs a human.",
  },
  {
    id: "pulse-audit-trail",
    shaderVariant: v8,
    subheading:
      "Calls specialists to book referrals, and surfaces results in the patient's chart after their visit.",
    description:
      "Referral bottlenecks shrink when outbound booking runs in the background. When the specialist confirms, the date and notes appear where your team already works.",
  },
  {
    id: "pulse-closed-loop",
    shaderVariant: v0,
    subheading: "Extensive call history tools to track and log every agentic action.",
    description:
      "Compliance reviews and quality checks get a timestamped trail of every outbound call, chart update, and handoff. Disputes resolve from facts, not memory.",
  },
  {
    id: "pulse-multilingual",
    shaderVariant: v10,
    subheading: "Supports over 30+ languages, listens and analyzes at the same time.",
    description:
      "Multilingual panels no longer need a bilingual staff member on every shift. Pulse interprets in real time so visit details stay accurate in the record.",
  },
  {
    id: "pulse-existing-stack",
    shaderVariant: v11,
    subheading: "Uses your existing clinic phone number and software.",
    description:
      "Patients keep calling the number on your website. Implementation plugs into the EMR and practice tools you already pay for, without a rip-and-replace project.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
