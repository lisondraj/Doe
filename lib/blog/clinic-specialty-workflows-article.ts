import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const CLINIC_SPECIALTY_WORKFLOWS_SLUG = "clinic-specialty-workflows";

export const CLINIC_SPECIALTY_WORKFLOWS_PATH = `/blog/${CLINIC_SPECIALTY_WORKFLOWS_SLUG}`;

export const CLINIC_SPECIALTY_WORKFLOWS_ARTICLE = {
  slug: CLINIC_SPECIALTY_WORKFLOWS_SLUG,
  path: CLINIC_SPECIALTY_WORKFLOWS_PATH,
  title: "Healthcare is not",
  titleLine2: "one kind of practice",
  excerpt:
    "A first-person perspective on the many ways healthcare practices operate, and how Doe can adapt to help each one grow.",
  subheading: "An operating model should fit the work.",
  openingLede:
    "The more I learned about medicine, the clearer it became: the best operating system should adapt to how care is actually delivered.",
  openingLedeContinuation:
    "As I made my way through medical school, I expected to learn about the breadth of medicine through diagnoses and treatments. I did. But I also started to see another kind of variation: the extraordinary number of ways a healthcare practice can work.",
  openingLedeContinuation2:
    "A procedure-driven team has a different rhythm from a longitudinal care practice. A referral-heavy service has different pressure points from a team managing recurring communication, follow-up, and preparation.",
  byline: "By Doe",
  date: "August 19, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "That distinction matters. Growth in healthcare is not only about seeing more patients. It is about giving people enough context to move work forward, keeping promises from falling through, and making every handoff easier to understand. The operating model has to fit the practice before it can make the practice better.",
    },
    {
      type: "shader",
      id: "specialty-practice-cadence",
      shaderVariant: "front-desk",
      caption: "Every practice has its own cadence, language, and definition of a completed handoff.",
    },
    {
      type: "subheading",
      text: "One platform should not mean one workflow.",
    },
    {
      type: "paragraph",
      text: "At Doe, we are building the foundation once and reshaping it around the work in front of a team. The patient thread, the ability to understand context, and the accountability behind each action stay consistent. What changes is how the system speaks the practice's language: its roles, timing, intake, approvals, documentation, follow-up, and definition of a useful next step.",
    },
    {
      type: "shader",
      id: "specialty-care-journey",
      shaderVariant: "ambient",
      caption: "The operational model should follow the care journey, not force the journey into a generic queue.",
    },
    {
      type: "paragraph",
      text: "This is not customization for its own sake. It is how software earns the right to be part of care delivery. A system that respects a team's actual operating model can help make the moments around care more reliable, reduce the work that gets recreated by hand, and reveal where the next improvement should come from.",
    },
    {
      type: "shader",
      id: "specialty-operational-knowledge",
      shaderVariant: "customize-agents-band",
      caption: "Specialty knowledge belongs in the way work is routed, reviewed, and improved over time.",
    },
    {
      type: "quote",
      id: "specialty-growth-quote",
      lead: "I came away from medical school with a deep respect for how much tacit knowledge lives inside a strong practice",
      continuation:
        "Doe should make that knowledge **easier to use and improve**, not flatten it into a generic set of tasks.",
    },
    {
      type: "shader",
      id: "specialty-shared-foundation",
      shaderVariant: "integrate",
      caption: "A shared foundation can still make room for very different ways of delivering care.",
    },
    {
      type: "subheading",
      text: "Built to grow with the practice.",
    },
    {
      type: "paragraph",
      text: "When a practice grows, the gaps between people, systems, and patient expectations become more visible. Doe is designed to keep the work connected as volume increases: to turn the important parts of a team's process into a shared operating model, give people a clear place to take over, and preserve the context behind every decision.",
    },
    {
      type: "paragraph",
      text: "The goal is not to prescribe how every practice should run. It is to give every kind of practice a platform that can become more useful as the team learns, changes, and grows.",
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
    "Doe is being built so every practice can keep its own operating model on a shared, accountable foundation.",
  emailInviteHeadline: "Continue the conversation.",
  emailInviteLabel: "Contact Doe",
} satisfies AboutStyleLongformArticle;

export const CLINIC_SPECIALTY_WORKFLOWS_TITLE =
  `${CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.title} ${CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.titleLine2}`;

export const CLINIC_SPECIALTY_WORKFLOWS_EXCERPT = CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.excerpt;

export const CLINIC_SPECIALTY_WORKFLOWS_DESCRIPTION = CLINIC_SPECIALTY_WORKFLOWS_EXCERPT;
