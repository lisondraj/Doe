import { ABOUT_STYLE_FEATURE_SHADER_VARIANTS, type AboutStyleFeatureCard } from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const INTRODUCING_CANVAS_FEATURE_CARDS = [
  {
    id: "canvas-visual-builder",
    shaderVariant: v0,
    subheading: "Visual Workflow Builder",
    description:
      "Canvas lets teams lay out steps, branches, and handoffs on a canvas that mirrors how work actually moves through the clinic.",
  },
  {
    id: "canvas-step-ownership",
    shaderVariant: v1,
    subheading: "Step Ownership",
    description:
      "Every node assigns a role or team so accountability is clear before a workflow goes live for staff.",
  },
  {
    id: "canvas-trigger-logic",
    shaderVariant: v2,
    subheading: "Trigger Logic",
    description:
      "Define what starts a workflow — a new referral, a lab result, a message type — without writing code or opening a ticket.",
  },
  {
    id: "canvas-safe-previews",
    shaderVariant: v3,
    subheading: "Safe Previews",
    description:
      "Run simulations against sample cases to see how work routes before enabling a path for the whole practice.",
  },
  {
    id: "canvas-template-library",
    shaderVariant: v4,
    subheading: "Template Library",
    description:
      "Start from proven patterns for intake, prior auth, follow-up, and referral management, then customize to your site.",
  },
  {
    id: "canvas-version-history",
    shaderVariant: v5,
    subheading: "Version History",
    description:
      "Every edit is versioned so teams can compare changes, roll back safely, and understand who modified a live workflow.",
  },
  {
    id: "canvas-role-guardrails",
    shaderVariant: v6,
    subheading: "Role Guardrails",
    description:
      "Canvas enforces license and scope boundaries at design time so workflows cannot assign clinical work to the wrong role.",
  },
  {
    id: "canvas-chart-context",
    shaderVariant: v7,
    subheading: "Chart Context",
    description:
      "Steps stay tethered to patient records, messages, and tasks — context travels with the workflow instead of splitting across tools.",
  },
  {
    id: "canvas-branching-paths",
    shaderVariant: v8,
    subheading: "Branching Paths",
    description:
      "Model conditional routes for payer rules, urgency, or specialty so one template covers the variations your team already handles manually.",
  },
  {
    id: "canvas-launch-controls",
    shaderVariant: v9,
    subheading: "Launch Controls",
    description:
      "Publish to a pilot group, schedule activation, or pause a path instantly when operations need to adjust mid-week.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
