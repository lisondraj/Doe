import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

const FEDERATED_CLINIC_INTELLIGENCE_OPENING_LEDE =
  "A clinic should be able to benefit from what many clinics learn without sending its patient records to a shared training pool.";

const FEDERATED_CLINIC_INTELLIGENCE_OPENING_CONTINUATION =
  "Federated learning and low-rank adaptation offer a practical path: improve a shared intelligence model with governed, clinic-level updates while preserving each organization’s control over its data, policies, and deployment.";

export const FEDERATED_CLINIC_INTELLIGENCE_SLUG = "federated-clinic-intelligence";

export const FEDERATED_CLINIC_INTELLIGENCE_PATH = `/blog/${FEDERATED_CLINIC_INTELLIGENCE_SLUG}`;

export const FEDERATED_CLINIC_INTELLIGENCE_ARTICLE = {
  slug: FEDERATED_CLINIC_INTELLIGENCE_SLUG,
  path: FEDERATED_CLINIC_INTELLIGENCE_PATH,
  title: "Shared intelligence,",
  titleLine2: "local control",
  excerpt:
    "How federated learning and low-rank adaptation can help clinical organizations improve a shared model without turning patient records into a central dataset.",
  subheading: "A practical architecture for multi-clinic learning.",
  openingLede: FEDERATED_CLINIC_INTELLIGENCE_OPENING_LEDE,
  openingLedeContinuation: FEDERATED_CLINIC_INTELLIGENCE_OPENING_CONTINUATION,
  byline: "Doe Labs",
  date: "August 15, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "Healthcare organizations are asked to choose between two incomplete options: use a general model that does not understand local workflows, or build a bespoke system that is expensive to maintain and learns from only one clinic. We are building toward a third option: **a shared foundation model that gets better from governed, local improvements without requiring clinics to pool patient charts**.",
    },
    {
      type: "paragraph",
      text: "For providers, the promise is more useful operational intelligence with clear boundaries. For investors, the promise is a learning system that can improve across a network without creating a separate full-model training program for every customer.",
    },
    {
      type: "glossary",
      id: "federated-clinic-intelligence-glossary",
      entries: [
        {
          term: "Shared intelligence model",
          definition:
            "A common base model and workflow layer that can support many organizations. It supplies broad capabilities and is not intended to replace a clinic’s local policies or clinical judgment.",
        },
        {
          term: "Federated learning",
          definition:
            "A training pattern in which participating organizations compute approved model updates locally. The coordinating system aggregates those updates instead of collecting the organizations’ underlying records in one central dataset.",
        },
        {
          term: "Low-rank adaptation (LoRA)",
          definition:
            "A way to adapt a large model by training a small set of additional parameters rather than retraining the entire model. These compact updates can be evaluated, versioned, and deployed with less compute.",
        },
        {
          term: "Adapter",
          definition:
            "The small, task- or organization-specific set of LoRA parameters attached to a shared base model. An adapter can be enabled, tested, rolled back, or withheld independently of the base model.",
        },
      ],
    },
    {
      type: "subheading",
      text: "The provider question: can it learn without giving up control?",
    },
    {
      type: "paragraph",
      text: "A multi-clinic learning system should not ask a provider to hand over a copy of its charts, call recordings, or billing history. In a federated design, the clinic-authorized environment keeps the sensitive source data local. It produces only an approved training update after the organization has decided what work is eligible for learning, what data has been minimized or excluded, and what review is required.",
    },
    {
      type: "paragraph",
      text: "That distinction matters. An update is not automatically anonymous, and federated learning is not a substitute for a security program, contractual controls, or clinical governance. Updates still require careful protections: access control, encryption, logging, monitoring for leakage or poisoning, validation before aggregation, and a clear ability to opt out or roll back.",
    },
    {
      type: "bullets",
      id: "federated-provider-controls",
      items: [
        "Keep patient records and raw workflow artifacts inside clinic-authorized infrastructure",
        "Choose which operational tasks are eligible to generate learning signals",
        "Review and validate adapters before they affect a live workflow",
        "Roll back a model or adapter version without interrupting the base system",
      ],
    },
    {
      type: "goldParagraph",
      text: "The goal is not to make one clinic behave like another. It is to let each clinic retain its operating policies while benefiting from patterns that are useful across the network.",
    },
    {
      type: "shader",
      id: "federated-local-control",
      shaderVariant: "integrate",
      caption: "Local data and policy controls remain with the clinic; only approved updates enter the shared learning process.",
    },
    {
      type: "subheading",
      text: "Why low-rank adaptation changes the economics",
    },
    {
      type: "paragraph",
      text: "Training or fine-tuning an entire large model for every customer is usually the wrong economic shape for healthcare operations. It duplicates expensive compute, makes version management difficult, and turns every clinic deployment into a separate research project. LoRA changes that shape by keeping the shared base model stable and training only a small adapter for an approved task or workflow.",
    },
    {
      type: "paragraph",
      text: "The practical result is that a clinic can evaluate a smaller update for a narrow job — for example, routing a referral, identifying a missing authorization field, or drafting a patient outreach message — rather than repeatedly retraining the entire model. That makes it more feasible to test improvements, measure outcomes, and retire changes that do not produce value.",
    },
    {
      type: "quote",
      id: "federated-economics-quote",
      lead: "A shared model should create compounding learning, not compounding infrastructure cost.",
      continuation:
        "Compact adapters make it possible to separate the economics of a durable platform from **the local configuration each clinic needs**.",
    },
    {
      type: "shader",
      id: "federated-lora-economics",
      shaderVariant: "prototype",
      caption: "Small, versioned adapters can be evaluated and deployed without retraining the full shared model.",
    },
    {
      type: "subheading",
      text: "What a governed learning loop looks like",
    },
    {
      type: "paragraph",
      text: "The value of a shared model comes from a disciplined loop, not from simply collecting more data. A clinic begins with a defined operational objective and measurable outcome. Its local environment prepares an approved training task, evaluates a candidate adapter against a held-out workflow set, and sends only the allowed update and evaluation evidence to the federation process. The coordinating layer rejects updates that fail policy or quality checks, aggregates approved contributions, and releases a new candidate version for local validation.",
    },
    {
      type: "bullets",
      id: "federated-learning-loop",
      items: [
        "Define an operational outcome, such as fewer incomplete referrals or faster prior-authorization preparation",
        "Generate a local, governed adapter update from approved workflow evidence",
        "Validate quality, safety, and policy constraints before sharing an update",
        "Aggregate only approved updates into a candidate shared improvement",
        "Measure local performance before promotion, with full version and rollback records",
      ],
    },
    {
      type: "paragraph",
      text: "This is deliberately more conservative than consumer AI training. Healthcare value comes from repeatable workflows, bounded tasks, and evidence that a change improved the work without creating a new safety or privacy risk.",
    },
    {
      type: "subheading",
      text: "Network learning without network lock-in",
    },
    {
      type: "paragraph",
      text: "For an investor, federation and LoRA create an architecture for learning leverage. One durable base system can serve many organizations, while the cost of a local improvement is closer to evaluating and operating a compact adapter than maintaining a full bespoke model. Each successful, governed improvement can increase the usefulness of the shared platform for the next participating clinic.",
    },
    {
      type: "paragraph",
      text: "For a provider, the same architecture should avoid a different kind of lock-in. A clinic needs visibility into which model version and adapters are in use, a clear boundary around its data, and the ability to preserve local workflow standards. Shared intelligence earns trust when it is inspectable, reversible, and accountable to the organization delivering care.",
    },
    {
      type: "goldParagraph",
      text: "The economic advantage is not centralization for its own sake. It is a better unit of learning: one that can travel as a governed model improvement while the records, policies, and responsibility for care stay local.",
    },
    {
      type: "shader",
      id: "federated-network-learning",
      shaderVariant: "looking-ahead",
      caption: "A shared base model can compound useful operational learning while local organizations retain control over deployment and validation.",
    },
    {
      type: "subheading",
      text: "Where this applies first",
    },
    {
      type: "paragraph",
      text: "The first applications should be operational, measurable, and reviewable — not autonomous clinical diagnosis. Examples include intake completeness checks, referral routing, prior-authorization preparation, documentation quality prompts, patient outreach drafting, and escalation classification. These workflows have clearer success criteria and can be deployed with a human review path.",
    },
    {
      type: "paragraph",
      text: "As with any clinical technology, applicability depends on the workflow, data governance, model evaluation, and oversight of the provider organization. The responsible next step is not to promise that one model will solve every clinic problem. It is to build a repeatable way to test where shared learning creates real operational value.",
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
    "Doe is building toward clinical intelligence that improves across organizations without asking providers to trade away security, local control, or accountability.",
  emailInviteHeadline: "Build the learning loop together.",
  emailInviteLabel: "Contact Doe Labs",
} satisfies AboutStyleLongformArticle;

export const FEDERATED_CLINIC_INTELLIGENCE_TITLE = `${FEDERATED_CLINIC_INTELLIGENCE_ARTICLE.title} ${FEDERATED_CLINIC_INTELLIGENCE_ARTICLE.titleLine2}`;

export const FEDERATED_CLINIC_INTELLIGENCE_EXCERPT = FEDERATED_CLINIC_INTELLIGENCE_ARTICLE.excerpt;
