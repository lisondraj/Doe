import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTRODUCING_GENOME_SLUG = "introducing-genome";

export const INTRODUCING_GENOME_PATH = `/blog/${INTRODUCING_GENOME_SLUG}`;

export const INTRODUCING_GENOME_ARTICLE = {
  slug: INTRODUCING_GENOME_SLUG,
  path: INTRODUCING_GENOME_PATH,
  title: "Introducing Genome",
  excerpt:
    "Genome gives each clinic a model shaped by its own workflows, deployed in a private cloud environment designed for clinical governance.",
  subheading: "One clinic. One model.",
  openingLede:
    "Every clinic has a way of caring for patients that cannot be reduced to a generic workflow.",
  openingLedeContinuation:
    "It is visible in the judgment behind an escalation, the sequence of a referral, the way a team prepares a patient for a visit, and the local policies that protect continuity of care. Those patterns are accumulated through years of clinical practice. They should inform the intelligence a clinic uses.",
  openingLedeContinuation2:
    "Today, we are introducing Genome: Doe’s approach to giving each clinic its own model. Genome is designed to learn from the clinic’s approved workflows and operate within dedicated private cloud infrastructure, so the intelligence supporting care remains close to the organization responsible for it.",
  byline: "By James Lisondra",
  date: "August 7, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "goldParagraph",
      text: "Genome is built around a straightforward principle: a clinic’s intelligence should reflect its own standards of care, operational decisions, and clinical context—not an average drawn from everyone else’s.",
    },
    {
      type: "photo",
      id: "genome-care-team",
      src: "/images/genome-clinic-care-team.png",
      alt: "A care team reviewing their clinical workflow together in an outpatient clinic.",
      caption:
        "The best operational knowledge in a clinic is often held by the people coordinating care. Genome is designed to make that knowledge usable without abstracting it away.",
    },
    {
      type: "shader",
      id: "genome-clinic-workflow",
      shaderVariant: "validate",
      caption:
        "Genome is intended to reflect the decisions and workflows already established by the people who deliver and coordinate care.",
    },
    {
      type: "subheading",
      text: "Why general-purpose AI is not enough for a clinic",
    },
    {
      type: "paragraph",
      text: "Most healthcare AI systems follow the same general pattern: information leaves the clinical environment, is processed by a large frontier model operated by a third party, and is returned as an answer, draft, or recommendation. That pattern can be useful for broad, non-sensitive work. It is less well suited to the operational detail, local policy, and privacy requirements that shape day-to-day care.",
    },
    {
      type: "paragraph",
      text: "A general-purpose model does not begin with an understanding of how your referral team handles incomplete records, which scheduling exceptions require clinical review, or how your staff document a payer-specific requirement. Those are not edge cases. They are the work of the clinic.",
    },
    {
      type: "quote",
      id: "genome-clinic-context-quote",
      lead:
        "Clinical intelligence should be informed by the environment in which care is delivered",
      continuation:
        "Genome is designed to turn a clinic’s approved workflows into **a durable source of operational context**.",
    },
    {
      type: "subheading",
      text: "A model that belongs to your clinic",
    },
    {
      type: "paragraph",
      text: "Genome gives each clinic a distinct model configuration built on a capable open-weight foundation. In practical terms, this means Doe can adapt the model to the workflows, language, policies, and patterns that are specific to your organization without asking your team to start from a generic baseline every time. The foundation supplies broad capability; the clinic-specific adaptation gives the model the operational context that makes that capability useful in your practice.",
    },
    {
      type: "paragraph",
      text: "The model is deployed in private cloud compute dedicated to your clinic. Patient information is processed inside that approved environment, rather than being sent out to a general-purpose model for routine clinical or operational work. In other words, the model runs where your clinic authorizes it to run; information does not need to travel out to a distant AI service just to receive an answer. This architecture is designed to support HIPAA-compliant deployments with the access controls, auditability, and safeguards healthcare organizations require.",
    },
    {
      type: "subheading",
      text: "How Genome benefits your clinic",
    },
    {
      type: "paragraph",
      text: "A clinic-specific model can improve the quality and economics of routine operations without changing who is accountable for care. Genome is designed to provide practical benefits over time:",
    },
    {
      type: "bullets",
      id: "genome-model-benefits",
      items: [
        "**Clinic-specific context:** The model can reflect local workflows, specialty language, templates, and escalation policies.",
        "**Fewer preventable errors:** Repeated tasks can follow the same approved logic, reducing variation and missed steps across routine administrative work.",
        "**Improvement through feedback:** Documented outcomes help the model refine how it drafts, routes, prioritizes, and escalates work over time.",
        "**Lower operating costs over time:** A dedicated open-weight deployment can reduce dependence on repeated third-party model calls as more work is handled within the clinic environment.",
        "**Governed data handling:** Patient information remains within the clinic’s dedicated infrastructure for the workflows Genome supports.",
      ],
    },
    {
      type: "photo",
      id: "genome-private-infrastructure",
      src: "/images/genome-private-infrastructure.png",
      alt: "A clinician reviewing a secure clinical operations display in a private care environment.",
      caption:
        "Genome keeps the model and the approved clinical context in the same dedicated environment, rather than moving sensitive work to and from a general-purpose AI service.",
    },
    {
      type: "shader",
      id: "genome-private-compute",
      shaderVariant: "prototype",
      caption:
        "Genome is deployed on private cloud compute dedicated to the clinic, with the model, data handling, and audit controls operating in one governed environment.",
    },
    {
      type: "subheading",
      text: "Learning from workflow, with clinical oversight",
    },
    {
      type: "paragraph",
      text: "Genome is designed to learn from the signals a clinic already produces through its work. An authorization approval, a completed referral, a documentation revision, or an appropriate escalation can all indicate whether a workflow was handled effectively. These outcomes provide structured feedback that can improve future performance.",
    },
    {
      type: "paragraph",
      text: "This is not an argument for removing clinical judgment. Providers and staff remain responsible for the decisions that affect patient care. Genome is intended to reduce the administrative friction around those decisions by making routine work more consistent, more context-aware, and easier to review.",
    },
    {
      type: "goldParagraph",
      text: "Over time, the value of a clinic-specific model is not only speed. It is a system that recognizes the difference between a routine task and the moment when a patient, a provider, or a care team needs attention.",
    },
    {
      type: "subheading",
      text: "Private by design, accountable in practice",
    },
    {
      type: "paragraph",
      text: "The value of a clinic-specific model depends on the boundaries around it. Genome is designed so that the model, the data it processes, and the record of its activity can remain within the same private cloud environment. This gives organizations a clearer basis for access control, logging, review, and model governance.",
    },
    {
      type: "bullets",
      id: "genome-governance-controls",
      items: [
        "Encryption for data in transit and at rest",
        "Role-based access to model functions, workflow data, and audit logs",
        "Traceable records of model activity and workflow outcomes",
        "Version controls that allow teams to evaluate, pause, or roll back changes",
      ],
    },
    {
      type: "quote",
      id: "genome-ownership-quote",
      lead:
        "A clinic should not have to choose between advanced AI and control of its clinical context",
      continuation:
        "Genome is our effort to deliver both: **a model that improves with the clinic while remaining accountable to it**.",
    },
    {
      type: "shader",
      id: "genome-governance",
      shaderVariant: "integrate",
      caption:
        "One clinic-specific model, operating within one dedicated environment and governed through one auditable record.",
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
    "Genome will be introduced with a focused group of provider organizations. We welcome conversations with clinical and operational leaders who want to evaluate a clinic-specific model within their own governance framework.",
  emailInviteHeadline: "Discuss Genome with Doe.",
  emailInviteLabel: "Contact James",
} satisfies AboutStyleLongformArticle;

export const INTRODUCING_GENOME_TITLE = INTRODUCING_GENOME_ARTICLE.title;

export const INTRODUCING_GENOME_EXCERPT = INTRODUCING_GENOME_ARTICLE.excerpt;
