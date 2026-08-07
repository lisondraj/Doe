import {
  ABOUT_STYLE_FEATURE_SHADER_VARIANTS,
  type AboutStyleFeatureCard,
} from "@/lib/blog/about-style-feature-card";

const [v0, v1, v2, v3, v4, v5, v6, v7, v8, v9] = ABOUT_STYLE_FEATURE_SHADER_VARIANTS;

export const GENOME_IS_BUILT_FOR_YOU_FEATURE_CARDS = [
  {
    id: "genome-workflow-memory",
    shaderVariant: v9,
    subheading: "A model shaped around the workflows your clinic already approves.",
    description:
      "Genome can be configured around the routing rules, documentation patterns, and escalation paths your team relies on, so routine work begins with local context instead of a generic prompt.",
  },
  {
    id: "genome-specialty-language",
    shaderVariant: v1,
    subheading: "Fluent in the specialty language your team uses every day.",
    description:
      "From referral requirements to specialty-specific note structures, Genome is designed to recognize the terms, templates, and operating conventions that make sense in your practice.",
  },
  {
    id: "genome-private-compute",
    shaderVariant: v2,
    subheading: "Runs within private cloud compute dedicated to your organization.",
    description:
      "The model operates in a clinic-authorized environment, giving your organization a clearer foundation for access controls, auditability, and governed data handling.",
  },
  {
    id: "genome-patient-context",
    shaderVariant: v3,
    subheading: "Keeps patient context inside the environment where care is coordinated.",
    description:
      "For supported workflows, patient information is processed within the dedicated deployment rather than being sent to a general-purpose model for routine clinical or operational work.",
  },
  {
    id: "genome-outcome-learning",
    shaderVariant: v4,
    subheading: "Improves from the outcomes your team already measures.",
    description:
      "Completed referrals, approved authorizations, documentation revisions, and appropriate escalations can provide feedback that helps Genome refine similar work over time.",
  },
  {
    id: "genome-consistent-execution",
    shaderVariant: v5,
    subheading: "Applies approved logic more consistently across repetitive work.",
    description:
      "When staff face the same intake question, routing decision, or administrative handoff, Genome can support a repeatable process without asking each person to reconstruct the context from scratch.",
  },
  {
    id: "genome-role-guardrails",
    shaderVariant: v6,
    subheading: "Recognizes when a decision belongs with a person, not a model.",
    description:
      "Role boundaries and escalation criteria help distinguish routine administrative work from situations that need clinical judgment, supervisory review, or direct patient communication.",
  },
  {
    id: "genome-model-controls",
    shaderVariant: v7,
    subheading: "Gives your organization a practical way to govern model changes.",
    description:
      "Versioning, review, and rollback controls are designed to let teams evaluate a model update before it becomes part of a live workflow.",
  },
  {
    id: "genome-efficient-scale",
    shaderVariant: v8,
    subheading: "Reduces reliance on repeated external model calls as usage grows.",
    description:
      "By handling appropriate work within a dedicated open-weight deployment, Genome is designed to improve the cost profile of AI-enabled operations over time.",
  },
  {
    id: "genome-traceable-operations",
    shaderVariant: v0,
    subheading: "Creates an auditable record of how work moved through the system.",
    description:
      "Teams can review model activity alongside workflow outcomes, supporting quality improvement, compliance review, and a clearer understanding of where the system adds value.",
  },
] as const satisfies readonly AboutStyleFeatureCard[];
