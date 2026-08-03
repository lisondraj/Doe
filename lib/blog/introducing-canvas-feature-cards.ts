import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_CANVAS_FEATURE_CARDS = [
  {
    id: "canvas-visual-builder",
    shaderVariant: v9,
    subheading: "An agent design canvas built for doctors so you can deliver clinic-ready agents.",
    description:
      "Design voice agents on a visual canvas made for clinical workflows, then deploy them to your clinic without engineering.",
  },
  {
    id: "canvas-step-ownership",
    shaderVariant: v1,
    subheading: "Customize your voice agent's voice, tone, and personality.",
    description:
      "Choose how your agent sounds and speaks so it matches your practice brand and how your team talks to patients.",
  },
  {
    id: "canvas-trigger-logic",
    shaderVariant: v2,
    subheading: "Connect over 50+ commonly used clinic software.",
    description:
      "Link scheduling, billing, messaging, and records tools your staff already use so agents can act inside real workflows.",
  },
  {
    id: "canvas-safe-previews",
    shaderVariant: v3,
    subheading: "Integrate your clinic's documents, templates, and policies.",
    description:
      "Upload the forms, scripts, and rules your team follows so every agent answer reflects how your clinic actually operates.",
  },
  {
    id: "canvas-template-library",
    shaderVariant: v4,
    subheading: "Download designs from a global community of physician builders.",
    description:
      "Browse agent templates published by other doctors and adapt them to your specialty and site in minutes.",
  },
  {
    id: "canvas-version-history",
    shaderVariant: v5,
    subheading: "Share agent components with your team to build faster.",
    description:
      "Reuse prompts, steps, and logic blocks across agents so everyone builds from the same clinic-approved parts.",
  },
  {
    id: "canvas-role-guardrails",
    shaderVariant: v6,
    subheading: "Test conversations instantly with a built-in simulator",
    description:
      "Run sample patient calls before go-live to hear how the agent handles real questions and edge cases.",
  },
  {
    id: "canvas-chart-context",
    shaderVariant: v7,
    subheading: "Use prompts, voice, or images to design agents for your clinic's needs.",
    description:
      "Describe what you want in plain language, record examples, or drop in reference images to shape agent behavior.",
  },
  {
    id: "canvas-branching-paths",
    shaderVariant: v8,
    subheading: "Route agent actions to a specific team member.",
    description:
      "Send completed tasks, messages, and handoffs to the right nurse, MA, or physician based on your clinic rules.",
  },
  {
    id: "canvas-launch-controls",
    shaderVariant: v0,
    subheading: "Determine what should be escalated to a human.",
    description:
      "Set clear thresholds for when the agent stops and your staff takes over so patients always reach a person when it matters.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
