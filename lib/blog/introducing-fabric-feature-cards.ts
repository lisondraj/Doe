import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_FABRIC_FEATURE_CARDS = [
  {
    id: "fabric-visual-builder",
    shaderVariant: v9,
    subheading: "An agent design surface built for doctors on Fabric so you can deliver clinic-ready agents.",
    description:
      "Drag steps, branches, and handoffs instead of filing IT tickets. What you sketch Friday can be live for a pilot panel by Monday.",
  },
  {
    id: "fabric-step-ownership",
    shaderVariant: v1,
    subheading: "Customize your voice agent's voice, tone, and personality.",
    description:
      "Warm and conversational for pediatrics, crisp and direct for surgical follow-up. Patients hear a voice that feels like it belongs to your practice.",
  },
  {
    id: "fabric-trigger-logic",
    shaderVariant: v2,
    subheading: "Connect over 50+ commonly used clinic software.",
    description:
      "Scheduling, e-prescribing, billing, and messaging tools wire together so agents can book, document, and bill inside systems staff already trust.",
  },
  {
    id: "fabric-safe-previews",
    shaderVariant: v3,
    subheading: "Integrate your clinic's documents, templates, and policies.",
    description:
      "Your after-visit summaries, consent language, and triage rules become the source of truth. Agents cite what your compliance team already approved.",
  },
  {
    id: "fabric-template-library",
    shaderVariant: v4,
    subheading: "Download designs from a global community of physician builders.",
    description:
      "A colorectal surgeon in Texas shares a pre-op intake flow you adapt for your own pre-op clinic. Start from peer-tested work instead of a blank canvas.",
  },
  {
    id: "fabric-version-history",
    shaderVariant: v5,
    subheading: "Share agent components with your team to build faster.",
    description:
      "One physician builds a prior-auth block; three others drop it into their agents. Shared libraries cut duplicate work across sites and specialties.",
  },
  {
    id: "fabric-role-guardrails",
    shaderVariant: v6,
    subheading: "Test conversations instantly with a built-in simulator",
    description:
      "Hear how the agent handles an angry parent, a confused senior, or a rushed new patient before a single real call goes live. Fix gaps in private.",
  },
  {
    id: "fabric-chart-context",
    shaderVariant: v7,
    subheading: "Use prompts, voice, or images to design agents for your clinic's needs.",
    description:
      "Dictate a script, upload a screenshot of your intake form, or paste a policy PDF. Fabric turns clinical intent into executable logic.",
  },
  {
    id: "fabric-branching-paths",
    shaderVariant: v8,
    subheading: "Route agent actions to a specific team member.",
    description:
      "Urgent results go to the covering physician; routine refills land with the MA pool. Ownership rules mirror how your clinic already divides work.",
  },
  {
    id: "fabric-launch-controls",
    shaderVariant: v0,
    subheading: "Determine what should be escalated to a human.",
    description:
      "High-acuity symptoms, upset callers, and out-of-scope requests transfer with full context attached. Staff step in only where judgment is required.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
