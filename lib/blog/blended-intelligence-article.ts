import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const BLENDED_INTELLIGENCE_SLUG = "blended-intelligence";

export const BLENDED_INTELLIGENCE_PATH = `/blog/${BLENDED_INTELLIGENCE_SLUG}`;

export const BLENDED_INTELLIGENCE_ARTICLE = {
  slug: BLENDED_INTELLIGENCE_SLUG,
  path: BLENDED_INTELLIGENCE_PATH,
  title: "Blended Intelligence",
  excerpt: "Secure, capable intelligence for clinics—built to support clinical work without separating it from the people, policies, and context that make care accountable.",
  subheading: "Secure & powerful intelligence for clinics.",
  openingLede:
    "The most useful intelligence in a clinic should not ask people to choose between capability and control.",
  openingLedeContinuation:
    "Clinicians need tools that can reason across the administrative work surrounding care: the patient message that follows a visit, the prior authorization that depends on chart facts, the referral that needs a thoughtful handoff. At the same time, every action must remain connected to the people who are responsible for the patient, the standards of the organization, and the record that makes work reviewable.",
  openingLedeContinuation2:
    "Blended Intelligence is Doe’s approach to that balance. It combines adaptable AI with clinic-specific context, practical guardrails, and clear human ownership—so intelligence can make work move without becoming a black box beside the care team.",
  byline: "By James Lisondra",
  date: "August 7, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "goldParagraph",
      text: "The best path is neither generic automation nor a collection of narrow rules. It is intelligence that can understand the work, stay grounded in the clinic, and know when a person needs to decide.",
    },
    {
      type: "shader",
      id: "blended-intelligence-signal",
      shaderVariant: "active-agents-band",
      caption:
        "Blended Intelligence brings reasoning, clinic context, and accountable review into the same operational flow.",
    },
    {
      type: "subheading",
      text: "Power matters. Context matters more.",
    },
    {
      type: "paragraph",
      text: "A powerful model can summarize a long note, draft a response, or identify the next step in a workflow. But clinical operations are not a sequence of isolated prompts. The right next step depends on the patient’s history, the team’s roles, local policy, payer requirements, and the care plan already in motion.",
    },
    {
      type: "paragraph",
      text: "That is why a useful system needs more than raw model capability. It needs the right context at the right time, selected from approved sources and presented in a way a provider or staff member can inspect. When intelligence is grounded in the clinic’s own operating environment, it can be more useful without becoming less accountable.",
    },
    {
      type: "quote",
      id: "blended-intelligence-context-quote",
      lead:
        "Clinical work does not become safer when intelligence is separated from its context",
      continuation:
        "It becomes safer when **the system can show its work, respect its boundaries, and involve the right person at the right moment**.",
    },
    {
      type: "subheading",
      text: "A secure foundation for everyday work",
    },
    {
      type: "paragraph",
      text: "Security is not a feature that can be added after an assistant has learned how to act. It shapes where information is processed, who can use a workflow, what the system is allowed to retrieve, and how activity is recorded for review. Blended Intelligence is designed around private, governed deployments that keep operational context close to the clinic that owns it.",
    },
    {
      type: "bullets",
      id: "blended-intelligence-security",
      items: [
        "**Purpose-limited access:** Workflows receive the context needed for the task, rather than a broad and unnecessary view of clinic data.",
        "**Role-aware routing:** Recommendations, drafts, and escalations can be directed to the people whose responsibilities and scope match the work.",
        "**Reviewable activity:** Teams can inspect the source context, workflow outcome, and handoff behind important actions.",
        "**Controls that evolve with the clinic:** Access, policies, and workflow configurations can change as teams, specialties, and requirements change.",
      ],
    },
    {
      type: "shader",
      id: "blended-intelligence-boundaries",
      shaderVariant: "validate",
      caption:
        "The objective is not unrestricted access. It is useful intelligence operating through clear, clinic-defined boundaries.",
    },
    {
      type: "subheading",
      text: "What this means at the provider level",
    },
    {
      type: "paragraph",
      text: "For providers, the promise of AI should be more room for the clinical judgment only they can provide—not another system that creates unclear recommendations, hidden work, or more reconciliation at the end of the day. Blended Intelligence is intended to improve the handoff between routine coordination and clinician decision-making.",
    },
    {
      type: "bullets",
      id: "blended-intelligence-provider-benefits",
      items: [
        "**More complete preparation:** Relevant messages, records, and pending tasks can be organized before a decision point, so providers begin with context instead of a scavenger hunt.",
        "**Clearer escalations:** The system can distinguish routine follow-up from exceptions that need clinical attention, while keeping the reason for escalation visible.",
        "**Drafts that remain drafts:** Suggested messages, documentation, and next steps are support for judgment—not a substitute for review or sign-off.",
        "**Continuity across the team:** The patient story can travel with the work, reducing the need to reconstruct context between inboxes, schedules, and follow-up tasks.",
        "**Less administrative drag:** Repetitive coordination can move faster while providers retain control of the decisions that affect care.",
      ],
    },
    {
      type: "quote",
      id: "blended-intelligence-provider-quote",
      lead:
        "The point is not to make clinical judgment automatic",
      continuation:
        "The point is to make the work around that judgment **more prepared, more consistent, and easier to trust**.",
    },
    {
      type: "subheading",
      text: "Intelligence that improves with oversight",
    },
    {
      type: "paragraph",
      text: "A clinic has valuable signals already: whether a referral was completed, whether a patient received the right follow-up, whether a draft needed revision, whether an escalation reached the right person. Blended Intelligence uses those signals to help workflows become more reliable over time—within the rules and review processes the clinic sets.",
    },
    {
      type: "paragraph",
      text: "This does not mean turning every decision into a training signal or allowing systems to change themselves without scrutiny. It means giving clinical and operational leaders a practical way to evaluate what is working, correct what is not, and improve the parts of the workflow where repeatable patterns genuinely exist.",
    },
    {
      type: "shader",
      id: "blended-intelligence-feedback",
      shaderVariant: "integrate",
      caption:
        "Outcomes, corrections, and escalation patterns can become a governed feedback loop for the work a clinic chooses to improve.",
    },
    {
      type: "subheading",
      text: "One platform, personalized to the clinic",
    },
    {
      type: "paragraph",
      text: "Doe products are designed as connected parts of a shared intelligence layer. Pulse can handle the conversation, Float can carry the financial workflow, Fabric can shape the operational logic, and Genome can bring a clinic’s approved context closer to the model. They are not meant to create separate versions of the patient story.",
    },
    {
      type: "goldParagraph",
      text: "The larger idea is a platform that becomes more useful as it learns the clinic’s way of working: personalized to its standards, connected across its products, and always answerable to the people who deliver care.",
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
    "Blended Intelligence is how we are building Doe: advanced enough to handle meaningful work, secure enough for clinical environments, and designed so that human judgment remains the center of care.",
  emailInviteHeadline: "Discuss Blended Intelligence with Doe.",
  emailInviteLabel: "Contact James",
} satisfies AboutStyleLongformArticle;

export const BLENDED_INTELLIGENCE_TITLE = BLENDED_INTELLIGENCE_ARTICLE.title;

export const BLENDED_INTELLIGENCE_EXCERPT = BLENDED_INTELLIGENCE_ARTICLE.excerpt;
