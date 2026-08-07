import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Reiterates the Broader Doe Vision thesis in this article's own words, not a copy. */
const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE =
  "Clinical intelligence should strengthen the systems a practice already relies on, not require patient data and institutional knowledge to be handed to a single outside vendor.";

const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION =
  "This article describes the approach we are building toward: systems that learn from a clinic's operational outcomes, use sensitive models within clinic-controlled infrastructure, and provide a clear record of how each response was produced.";

export const INTELLIGENCE_FOR_EVERY_CLINIC_SLUG = "intelligence-for-every-clinic";

export const INTELLIGENCE_FOR_EVERY_CLINIC_PATH = `/blog/${INTELLIGENCE_FOR_EVERY_CLINIC_SLUG}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE = {
  slug: INTELLIGENCE_FOR_EVERY_CLINIC_SLUG,
  path: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  title: "Intelligence for",
  titleLine2: "every clinic",
  excerpt:
    "A Doe Labs proposal for reinforcement learning, open-weight models on secure cloud infrastructure, and Blended Intelligence: a practical architecture for provider organizations.",
  subheading: "What we're building towards.",
  openingLede: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE,
  openingLedeContinuation: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION,
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "Many current AI tools for healthcare depend on a general-purpose model operated outside the practice. They may be useful for narrow tasks, but they do not inherently reflect a clinic's specialty, workflows, or governance requirements. We are building toward **an intelligence system designed around the clinic itself**: one that operates in an environment the organization controls and improves through measured operational feedback.",
    },
    {
      type: "paragraph",
      text: "The concepts below are technical, but their practical implications are straightforward. We define them here before describing the architecture.",
    },
    {
      type: "glossary",
      id: "doe-labs-glossary",
      entries: [
        {
          term: "Reinforcement learning",
          definition:
            "A training method in which a system is evaluated against real outcomes and adjusted toward better decisions. In a clinical operations setting, the feedback may come from measures such as authorization approval, successful outreach, or quality review.",
        },
        {
          term: "Open-weight models",
          definition:
            "AI models whose parameters are available for an organization to deploy and operate in its own approved computing environment, rather than only through a vendor-managed service.",
        },
        {
          term: "Frontier models",
          definition:
            "Large, highly capable general-purpose AI systems. They can be valuable for complex reasoning, but are typically accessed through an external provider's service.",
        },
        {
          term: "PHI",
          definition:
            "Protected health information: patient information regulated under HIPAA, including identifiers, clinical documentation, diagnoses, medications, and scheduling details.",
        },
        {
          term: "Blended Intelligence",
          definition:
            "Our term for an architecture that combines an open-weight model with a frontier model, assigning each portion of a task according to its sensitivity and the type of reasoning required.",
        },
      ],
    },
    {
      type: "subheading",
      text: "Learning from the work your clinic already does",
    },
    {
      type: "paragraph",
      text: "Reinforcement learning allows a system to improve against the outcomes a practice already measures. Rather than relying only on a fixed benchmark, the system can be evaluated against operational results such as:",
    },
    {
      type: "bullets",
      id: "doe-labs-rl-outcomes",
      items: [
        "Whether a prior authorization got approved",
        "Whether a patient confirmed a visit",
        "Whether a note passed review",
        "Whether a call ended without a human needing to step in",
      ],
    },
    {
      type: "paragraph",
      text: "Each result becomes a structured feedback signal. Over time, those signals can help the system identify which actions, language, and workflows are more likely to support the practice's intended outcome.",
    },
    {
      type: "paragraph",
      text: "This feedback is both operationally specific and often sensitive. It should remain within the clinic's approved security boundary rather than being pooled across unrelated organizations. We are building pipelines that capture and evaluate these signals within clinic-controlled infrastructure, enabling improvement **without using patient charts as external training data**.",
    },
    {
      type: "shader",
      id: "doe-labs-rl-workflow",
      shaderVariant: "validate",
      caption: "Approvals, confirmations, quality reviews, and resolved calls can become measured feedback for the system.",
    },
    {
      type: "subheading",
      text: "Why we run open-weight models instead of renting one",
    },
    {
      type: "paragraph",
      text: "An open-weight model can be deployed and operated in an organization's own approved environment, rather than treated as an opaque service endpoint. That creates two practical advantages: the model can be adapted to a specialty's terminology and local policy, and it can be hosted on cloud infrastructure governed by the clinic or health system.",
    },
    {
      type: "goldParagraph",
      text: "This design keeps patient information within an approved environment when a workflow requires it. The model, the agents that invoke it, and the audit records reviewed by compliance can operate within the same security boundary rather than being distributed across multiple external APIs.",
    },
    {
      type: "shader",
      id: "doe-labs-open-weight",
      shaderVariant: "looking-ahead",
      caption: "The model, sensitive data, and audit record can remain within one governed environment.",
    },
    {
      type: "subheading",
      text: "Blended Intelligence: the right model for the right part of the job",
    },
    {
      type: "goldParagraph",
      text: "No single model is optimal for every task. A frontier model may offer strong general reasoning for work such as analyzing published guidance or comparing policy language, but it is generally accessed outside the clinical environment. An open-weight model can address workflows involving PHI within clinic-controlled infrastructure, even when a broader model may be better suited to a separate, non-sensitive reasoning step.",
    },
    {
      type: "paragraph",
      text: "Blended Intelligence is the architecture that allows both models to contribute without treating them as interchangeable. A request is evaluated and separated into components. Work that can be performed outside the sensitive boundary, such as reviewing public research or comparing policy language, may be sent to a frontier model. Components involving patient identity, medications, encounters, or billing remain with the open-weight model running in the organization's environment. An orchestration layer routes the work, combines the results, and records which model handled each component.",
    },
    {
      type: "quote",
      id: "doe-labs-blended-intelligence-quote",
      lead: "The clinician receives one coherent response, and the compliance team receives a traceable account of how it was produced.",
      continuation:
        "The objective is to pair appropriate general reasoning with **the privacy, governance, and accountability patient care requires**.",
    },
    {
      type: "shader",
      id: "doe-labs-blended-intelligence",
      shaderVariant: "integrate",
      caption: "One request can use two models while preserving a traceable record of each step.",
    },
    {
      type: "subheading",
      text: "The security bar we are building toward",
    },
    {
      type: "paragraph",
      text: "Security and governance must define the architecture from the beginning. We are building toward a standard in which sensitive information remains within clinic-controlled compute when required, every model interaction is logged, and a blended request can be explained to an auditor in clear operational terms rather than treated as an opaque result.",
    },
    {
      type: "paragraph",
      text: "In practice, that includes:",
    },
    {
      type: "bullets",
      id: "doe-labs-security-measures",
      items: [
        "Encryption for data in transit and at rest",
        "Role-based access to models, configuration, and audit records",
        "The ability to pause or roll back a model version without interrupting core clinic operations",
      ],
    },
    {
      type: "paragraph",
      text: "The goal is a consistent security boundary across agents, chart workflows, and billing operations, with fewer unnecessary transfers to separate external vendors.",
    },
    {
      type: "quote",
      id: "doe-labs-security-quote",
      lead: "This is the standard Doe is building toward for healthcare.",
      continuation:
        "Intelligence that is capable, governed, and **accountable to the clinicians and organizations responsible for care**.",
    },
    {
      type: "shader",
      id: "doe-labs-security",
      shaderVariant: "ambient-band",
      caption: "One security boundary, one audit trail, and a consistent standard for accountable clinical intelligence.",
    },
  ],
  bodyParagraphs: [],
  proposalHighlightLead: "",
  proposalHighlightContinuation: "",
  proposalClosing: "",
  thesisSectionHeadline: "",
  thesisIntro: "",
  thesisPoints: [],
  closing: "",
  finalParagraph: BROADER_DOE_VISION_FINAL_PARAGRAPH,
  emailInviteHeadline: BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  emailInviteLabel: BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
} satisfies AboutStyleLongformArticle;

export const INTELLIGENCE_FOR_EVERY_CLINIC_TITLE = `${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.title} ${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.titleLine2}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_EXCERPT = INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.excerpt;
