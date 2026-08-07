import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const BLENDED_INTELLIGENCE_SLUG = "blended-intelligence";

export const BLENDED_INTELLIGENCE_PATH = `/blog/${BLENDED_INTELLIGENCE_SLUG}`;

export const BLENDED_INTELLIGENCE_ARTICLE = {
  slug: BLENDED_INTELLIGENCE_SLUG,
  path: BLENDED_INTELLIGENCE_PATH,
  title: "Blended Intelligence",
  excerpt:
    "Blended Intelligence combines the privacy and control of a self-hosted open-weight model with selective frontier-model reasoning for difficult clinical operations.",
  subheading: "Secure & powerful intelligence for clinics.",
  openingLede:
    "Blended Intelligence gives clinics a practical way to use capable AI without sending every task and every piece of clinic context to a frontier model.",
  openingLedeContinuation:
    "The foundation is a self-hosted, open-weight model running in the clinic's dedicated environment. It handles the work that depends on local context: organizing records, preparing drafts, routing routine tasks, applying clinic policy, and maintaining the operational memory needed for care coordination. That context stays inside infrastructure the clinic controls.",
  openingLedeContinuation2:
    "For a smaller set of genuinely difficult tasks, Doe can use a frontier model for additional reasoning. The system sends only the minimum approved information needed for that task, records the handoff, and returns the result to the clinic's governed workflow. The result is stronger reasoning when it matters, without making an outside model the permanent home of the clinic's intelligence.",
  byline: "By James Lisondra",
  date: "August 7, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "goldParagraph",
      text: "The goal is straightforward: keep the clinic's everyday intelligence private and self-hosted, then use frontier capability only when a task requires it.",
    },
    {
      type: "shader",
      id: "blended-intelligence-signal",
      shaderVariant: "active-agents-band",
      caption:
        "A self-hosted model manages clinic context and routine work. Frontier reasoning is used selectively for approved complex tasks.",
    },
    {
      type: "subheading",
      text: "Open-weight and frontier models",
    },
    {
      type: "paragraph",
      text: "An open-weight model is a model that Doe can deploy and operate directly in the clinic's dedicated environment. This allows the clinic's intelligence layer to stay self-hosted, governed by its own permissions and policies, and connected to its approved operational context. It is the right foundation for daily work that depends on local information and reliable controls.",
    },
    {
      type: "paragraph",
      text: "A frontier model is a larger, externally hosted model built for difficult general reasoning. It can be useful when a task requires deeper synthesis across complex facts or a more capable explanation. Blended Intelligence uses it selectively, with only the minimum approved information for that specific task, then returns the result to the clinic's self-hosted workflow for review.",
    },
    {
      type: "quote",
      id: "blended-intelligence-context-quote",
      lead:
        "A clinic does not have to choose one model for every task",
      continuation:
        "Blended Intelligence keeps routine work in a self-hosted environment and uses **frontier capability only where it provides a meaningful benefit**.",
    },
    {
      type: "subheading",
      text: "What stays inside the clinic environment",
    },
    {
      type: "paragraph",
      text: "The self-hosted open-weight model is the system of record for the clinic's working context. It can access approved data and execute the workflows the organization has configured. It supports the repetitive, context-heavy work that makes up much of the clinical day without requiring the clinic to share that entire working environment with an outside model.",
    },
    {
      type: "bullets",
      id: "blended-intelligence-security",
      items: [
        "**Clinic-specific context:** Patient, scheduling, inbox, referral, and workflow information can remain in the dedicated clinic environment.",
        "**Open-weight control:** The clinic's intelligence layer is built on a model the platform can deploy, configure, evaluate, and govern directly.",
        "**Role and policy enforcement:** The system can apply permissions, escalation rules, templates, and operational standards before a task reaches a person.",
        "**Auditability:** Teams can review the context used, the workflow path, and the actions taken for the work they choose to monitor.",
      ],
    },
    {
      type: "shader",
      id: "blended-intelligence-boundaries",
      shaderVariant: "validate",
      caption:
        "The clinic's self-hosted model remains responsible for context, policy, routing, and the record of the workflow.",
    },
    {
      type: "subheading",
      text: "When a frontier model is used",
    },
    {
      type: "paragraph",
      text: "A frontier model is not the default destination for a patient record or a clinic workflow. It is an additional capability that Doe can invoke for specific complex work. Before any handoff, the workflow determines whether a frontier model is needed and limits the information to what has been approved for that task.",
    },
    {
      type: "bullets",
      id: "blended-intelligence-provider-benefits",
      items: [
        "**Complex synthesis:** A frontier model can help structure a difficult body of information into a clear draft, summary, or next-step analysis.",
        "**High-effort communication:** It can assist with complex explanations, patient-ready language, and detailed operational correspondence that benefit from stronger general reasoning.",
        "**Structured return to the workflow:** The result returns to Doe's clinic environment, where it can be reviewed, edited, routed, or escalated using the clinic's normal process.",
        "**Minimal approved context:** The system uses the smallest relevant set of information for the frontier task rather than treating the whole chart or clinic database as a prompt.",
      ],
    },
    {
      type: "quote",
      id: "blended-intelligence-provider-quote",
      lead:
        "Providers should see a clearer and more useful result, not a hidden model decision",
      continuation:
        "The self-hosted system prepares the context and the frontier model helps with difficult reasoning. **The provider remains responsible for the clinical decision.**",
    },
    {
      type: "subheading",
      text: "What providers can expect",
    },
    {
      type: "paragraph",
      text: "For most work, providers and staff should experience a system that is prepared before they arrive. It can organize relevant context, draft routine communication, track the status of coordination tasks, and identify exceptions that need attention. These actions occur in the self-hosted clinic environment where local standards can be applied consistently.",
    },
    {
      type: "paragraph",
      text: "When a task truly needs more reasoning capacity, the provider should be able to understand what the system was asked to do, what information was used, and why the result still needs their review. Blended Intelligence is designed to make the use of frontier capability deliberate and visible, not automatic or opaque.",
    },
    {
      type: "shader",
      id: "blended-intelligence-feedback",
      shaderVariant: "integrate",
      caption:
        "The system can choose the right model for the work while keeping the clinic's workflow, review process, and operational record in one place.",
    },
    {
      type: "subheading",
      text: "A single platform with a secure intelligence layer",
    },
    {
      type: "linkedParagraph",
      id: "blended-intelligence-genome-link",
      before:
        "Doe products share one intelligence layer rather than creating isolated tools. Pulse supports patient communication, Float supports financial operations, Fabric shapes the workflows, and ",
      linkLabel: "Genome",
      href: "/blog/introducing-genome",
      after:
        " delivers the clinic-specific model and private infrastructure that makes this approach available to providers. Blended Intelligence connects these products to the same self-hosted context and the same governed path to frontier reasoning when it is needed.",
    },
    {
      type: "goldParagraph",
      text: "The platform is built to reflect how a clinic works, protect the context that makes its work specific, and bring in additional reasoning power only when the task calls for it.",
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
    "Blended Intelligence gives clinics a clear path to capable AI: self-hosted open-weight intelligence for privacy, control, and daily operations, with frontier reasoning available for the complex tasks where it can make a real difference.",
  emailInviteHeadline: "Discuss Blended Intelligence with Doe.",
  emailInviteLabel: "Contact James",
} satisfies AboutStyleLongformArticle;

export const BLENDED_INTELLIGENCE_TITLE = BLENDED_INTELLIGENCE_ARTICLE.title;

export const BLENDED_INTELLIGENCE_EXCERPT = BLENDED_INTELLIGENCE_ARTICLE.excerpt;
