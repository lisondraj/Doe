import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Reiterates the Broader Doe Vision thesis in this article's own words, not a copy. */
const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE =
  "The next generation of clinical intelligence should be governed by the organizations responsible for patient care, rather than depend entirely on a single external vendor.";

const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION =
  "This article describes the architecture we are building toward: systems that learn from a clinic’s operational feedback, keep sensitive workloads within clinic-authorized infrastructure, and produce an auditable record of each decision.";

export const INTELLIGENCE_FOR_EVERY_CLINIC_SLUG = "intelligence-for-every-clinic";

export const INTELLIGENCE_FOR_EVERY_CLINIC_PATH = `/blog/${INTELLIGENCE_FOR_EVERY_CLINIC_SLUG}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE = {
  slug: INTELLIGENCE_FOR_EVERY_CLINIC_SLUG,
  path: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  title: "Intelligence for",
  titleLine2: "every clinic",
  excerpt:
    "A Doe Labs proposal for reinforcement learning, open-weight models on secure cloud compute, and Blended Intelligence: an approach designed for clinical operations.",
  subheading: "The architecture we are building toward.",
  openingLede: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE,
  openingLedeContinuation: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION,
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "Much of today’s healthcare software routes clinical and operational context to a large, general-purpose AI service, with limited visibility into how that service is adapted to a practice’s needs. We are building toward a more appropriate model: **an intelligence system configured for an individual clinic**, deployed within infrastructure the clinic authorizes, and improved through carefully governed feedback from its workflows.",
    },
    {
      type: "paragraph",
      text: "The following terms are used throughout this article. Each is defined in practical terms for clinical and operational leaders.",
    },
    {
      type: "glossary",
      id: "doe-labs-glossary",
      entries: [
        {
          term: "Reinforcement learning",
          definition:
            "A training approach in which a system receives feedback on the quality of its actions and uses that feedback to improve future decisions. In a clinic, the signals may come from documented workflow outcomes rather than from a static test set.",
        },
        {
          term: "Open-weight models",
          definition:
            "AI models whose parameters can be deployed and operated within an organization’s approved computing environment, rather than accessed only through an external provider’s hosted service.",
        },
        {
          term: "Frontier models",
          definition:
            "Highly capable general-purpose AI systems that are typically provided through a third-party service and are well suited to broad reasoning and synthesis.",
        },
        {
          term: "PHI",
          definition:
            "Protected health information: identifiable patient information regulated under HIPAA, including demographic data, diagnoses, medications, and clinical documentation.",
        },
        {
          term: "Blended Intelligence",
          definition:
            "Our approach to coordinating an open-weight model with a frontier model, assigning each portion of a request to the environment best suited to handle it.",
        },
      ],
    },
    {
      type: "subheading",
      text: "Learning from the work your clinic already does",
    },
    {
      type: "paragraph",
      text: "Reinforcement learning allows software to learn from observed workflow outcomes rather than relying solely on a fixed benchmark. Relevant signals may include:",
    },
    {
      type: "bullets",
      id: "doe-labs-rl-outcomes",
      items: [
        "Prior authorization approval status",
        "Appointment confirmation status",
        "Completion of documentation review",
        "Resolution of a call without staff intervention",
      ],
    },
    {
      type: "paragraph",
      text: "Each outcome can serve as a training signal, allowing the system to refine how it prioritizes, drafts, routes, or escalates similar work.",
    },
    {
      type: "paragraph",
      text: "These signals are both clinic-specific and potentially sensitive. They should remain within the clinic’s approved security boundary, rather than be combined indiscriminately with data from unrelated organizations. We are building data and training pipelines that support continuous improvement **without requiring patient charts to be exported from the clinic-authorized environment**.",
    },
    {
      type: "shader",
      id: "doe-labs-rl-workflow",
      shaderVariant: "validate",
      caption: "Workflow outcomes provide structured feedback for improving future performance.",
    },
    {
      type: "subheading",
      text: "Why we run open-weight models instead of renting one",
    },
    {
      type: "paragraph",
      text: "An open-weight model can be deployed and operated within a clinic-authorized environment rather than accessed only through a closed external service. This provides two important capabilities: the model can be adapted to specialty terminology and local policies without depending on a vendor’s release cycle, and sensitive workloads can remain on approved cloud infrastructure.",
    },
    {
      type: "goldParagraph",
      text: "This design keeps patient information within an approved environment when it is needed to produce an answer. The model, the workflow agents that use it, and the audit evidence reviewed by compliance teams can operate within the same security boundary, rather than across a collection of disconnected external APIs.",
    },
    {
      type: "shader",
      id: "doe-labs-open-weight",
      shaderVariant: "looking-ahead",
      caption: "The model, sensitive data, and audit evidence operate within one governed security boundary.",
    },
    {
      type: "subheading",
      text: "Blended Intelligence: the right model for the right part of the job",
    },
    {
      type: "goldParagraph",
      text: "Clinical operations do not require a single model for every task. A frontier model may be useful for broad reasoning, comparing publicly available guidance, or synthesizing a complex plan, but it is commonly hosted outside the clinic’s environment. An open-weight model can handle tasks involving patient records within the approved security boundary, even where its general-purpose capability differs from that of a frontier model.",
    },
    {
      type: "paragraph",
      text: "Blended Intelligence uses both capabilities without asking a clinic to make an all-or-nothing choice. A request is assessed and divided at intake. Work that can be performed outside the sensitive boundary, such as reviewing published research or comparing policy language, may be directed to a frontier model. Work involving patient identity, medications, visit details, or billing remains with the open-weight model deployed on approved compute. An orchestration layer routes the request, combines the permitted outputs, and records which model handled each component.",
    },
    {
      type: "quote",
      id: "doe-labs-blended-intelligence-quote",
      lead: "Clinicians receive a clear response, and compliance teams receive a traceable record of how it was produced",
      continuation:
        "The objective is to pair capable general reasoning with **the privacy and accountability required for patient care**.",
    },
    {
      type: "shader",
      id: "doe-labs-blended-intelligence",
      shaderVariant: "integrate",
      caption: "One request can use two models while maintaining a traceable decision record.",
    },
    {
      type: "subheading",
      text: "The security bar we are building toward",
    },
    {
      type: "paragraph",
      text: "In healthcare, security and governance must be designed into the system from the outset. We are building toward a standard in which sensitive patient information can remain within clinic-authorized compute, each model interaction is logged with sufficient context for review, and a blended request can be explained clearly to an auditor rather than treated as an opaque process.",
    },
    {
      type: "paragraph",
      text: "In practice, this includes:",
    },
    {
      type: "bullets",
      id: "doe-labs-security-measures",
      items: [
        "Encryption for data in transit and at rest",
        "Role-based access to models, data, and audit logs",
        "The ability to pause or roll back a model version without disrupting clinic operations",
      ],
    },
    {
      type: "paragraph",
      text: "Agents, charts, and billing workflows can share a common security boundary instead of relying on a growing number of independently governed external services.",
    },
    {
      type: "quote",
      id: "doe-labs-security-quote",
      lead: "This is the standard Doe is designing for healthcare",
      continuation:
        "Intelligence that combines advanced capability with **appropriate safeguards** and remains accountable to the clinicians responsible for the final decision.",
    },
    {
      type: "shader",
      id: "doe-labs-security",
      shaderVariant: "ambient-band",
      caption: "A shared security boundary and audit trail support consistent operational governance.",
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
  finalParagraph:
    "We welcome discussion with provider organizations evaluating how clinical intelligence can be deployed with appropriate governance, privacy, and accountability.",
  emailInviteHeadline: "Continue the conversation.",
  emailInviteLabel: "Contact James",
} satisfies AboutStyleLongformArticle;

export const INTELLIGENCE_FOR_EVERY_CLINIC_TITLE = `${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.title} ${INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.titleLine2}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_EXCERPT = INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE.excerpt;
