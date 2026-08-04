import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
  BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION,
  BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD,
} from "@/lib/blog/broader-doe-vision-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTELLIGENCE_FOR_EVERY_CLINIC_SLUG = "intelligence-for-every-clinic";

export const INTELLIGENCE_FOR_EVERY_CLINIC_PATH = `/blog/${INTELLIGENCE_FOR_EVERY_CLINIC_SLUG}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE = {
  slug: INTELLIGENCE_FOR_EVERY_CLINIC_SLUG,
  path: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  title: "Intelligence for",
  titleLine2: "every clinic",
  excerpt:
    "A Doe Labs proposal for reinforcement learning, open-weight models on secure cloud compute, and Blended Intelligence: the stack we believe every clinic will run.",
  subheading: "A research proposal on the intelligence stack clinics will own.",
  openingLede: BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_LEAD,
  openingLedeContinuation: BROADER_DOE_VISION_PROPOSAL_HIGHLIGHT_CONTINUATION,
  openingLedeContinuation2:
    "That blend of clinic-owned intelligence is the thesis behind Doe. This article outlines the technological advances we are building toward in Doe Labs, and the security standard we intend to guarantee for healthcare.",
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "I strongly believe that within the next few years, intelligence in medicine will undergo a rapid transformation, completely detached from today's landscape. When providers lead the design of their own intelligent tools, AI can redefine care without asking clinics to surrender how they practice.",
    },
    {
      type: "paragraph",
      text: "Most tools on the market still follow one playbook: connect a generalist frontier model to sensitive patient data and hope the response is sufficient. Doe Labs is building toward the opposite. Every clinic should run an intelligence stack it owns, tuned to local nuance, hosted on infrastructure it trusts, and improved by the work happening inside its walls.",
    },
    {
      type: "subheading",
      text: "Reinforcement learning on real clinic workflows",
    },
    {
      type: "paragraph",
      text: "Reinforcement learning is how an intelligence stack learns what good looks like inside a specific clinic. Instead of treating every task as a one-shot prompt, the model receives reward signals from outcomes your team already measures: was the prior auth approved, did the patient confirm, did the note pass review, did the call resolve without escalation.",
    },
    {
      type: "paragraph",
      text: "Those signals are noisy in healthcare, which is exactly why they must be collected on clinic-owned compute. Doe Labs is designing pipelines that turn daily workflow feedback into durable improvements without exporting raw chart content to a shared training pool.",
    },
    {
      type: "shader",
      id: "doe-labs-rl-workflow",
      shaderVariant: "validate",
      caption: "Reward signals drawn from live workflow outcomes, not synthetic benchmarks.",
    },
    {
      type: "subheading",
      text: "Open-weight models on secure cloud compute",
    },
    {
      type: "paragraph",
      text: "Open-weight models give clinics something frontier APIs cannot: inspectable weights, predictable behavior, and the ability to adapt a model to specialty vocabulary, payer rules, and local policy without waiting on a vendor roadmap.",
    },
    {
      type: "paragraph",
      text: "Hosting those models on secure cloud compute means the clinic keeps control of where patient information lives, who can access it, and how it moves between services. The model runs close to the chart, close to the agents, and close to the audit trail your compliance team expects.",
    },
    {
      type: "shader",
      id: "doe-labs-open-weight",
      shaderVariant: "looking-ahead",
      caption: "Open weights on private infrastructure, not a shared frontier black box.",
    },
    {
      type: "subheading",
      text: "Blended Intelligence",
    },
    {
      type: "paragraph",
      text: "Blended Intelligence is Doe Labs' name for combining the best of both worlds. Frontier models handle complex reasoning when a task can leave the sensitive boundary: literature review, policy comparison, long-horizon planning, and synthesis across public guidance.",
    },
    {
      type: "paragraph",
      text: "Open-weight models handle what must stay inside the clinic: patient identifiers, visit transcripts, medication lists, billing context, and any inference that touches protected health information. The orchestration layer routes each request to the right model, merges the result, and records which path was taken.",
    },
    {
      type: "paragraph",
      text: "The output is better than either model alone. Frontier depth where the task allows it. Local fidelity where privacy demands it. One answer to the clinician, one audit entry for compliance, one stack the clinic can actually own.",
    },
    {
      type: "shader",
      id: "doe-labs-blended-intelligence",
      shaderVariant: "integrate",
      caption: "Frontier reasoning and open-weight privacy composed into one clinic-owned answer.",
    },
    {
      type: "subheading",
      text: "The security standard we are building toward",
    },
    {
      type: "paragraph",
      text: "Healthcare cannot treat security as a checkbox on a SOC 2 slide. Doe Labs is building toward a standard where sensitive patient information never leaves clinic-controlled compute for inference, where every model call is logged with provenance, and where blended routes are explicit enough for a compliance review without reverse engineering a black box.",
    },
    {
      type: "paragraph",
      text: "That means encrypted transit and at-rest storage by default, role-scoped access to weights and logs, and the ability to pause or roll back a model version without taking the clinic offline. It means agents, charts, and billing workflows share one security boundary instead of scattering trust across a dozen vendor APIs.",
    },
    {
      type: "paragraph",
      text: "This is the level of security Doe wants to guarantee for healthcare: intelligence that feels as capable as the frontier, as private as the chart room, and as accountable as the professionals who still make the final call.",
    },
    {
      type: "shader",
      id: "doe-labs-security",
      shaderVariant: "ambient-band",
      caption: "Clinic-controlled compute, explicit model routing, audit-ready by design.",
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
