import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Reiterates the Broader Doe Vision thesis in this article's own words, not a copy. */
const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE =
  "We think every provider, every clinic, and eventually every small workflow in healthcare will run on an intelligence stack it owns, not a general one rented from a single vendor.";

const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION =
  "We expect that stack to be built on open-weight models, sharpened by frontier reasoning, and run entirely on private cloud compute the clinic controls.";

export const INTELLIGENCE_FOR_EVERY_CLINIC_SLUG = "intelligence-for-every-clinic";

export const INTELLIGENCE_FOR_EVERY_CLINIC_PATH = `/blog/${INTELLIGENCE_FOR_EVERY_CLINIC_SLUG}`;

export const INTELLIGENCE_FOR_EVERY_CLINIC_ARTICLE = {
  slug: INTELLIGENCE_FOR_EVERY_CLINIC_SLUG,
  path: INTELLIGENCE_FOR_EVERY_CLINIC_PATH,
  title: "Intelligence for",
  titleLine2: "every clinic",
  excerpt:
    "A Doe Labs proposal for reinforcement learning, open-weight models on secure cloud compute, and Blended Intelligence: the stack we believe every clinic will run.",
  subheading: "What we're building towards.",
  openingLede: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE,
  openingLedeContinuation: INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION,
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "Medicine is about to go through a shift most clinics have not felt yet. It will not arrive as one giant model that tries to do everything. It will arrive as intelligence that clinicians and engineers build around how a specific practice actually runs, tuned to a specialty instead of asking the specialty to adapt to it.",
    },
    {
      type: "paragraph",
      text: "Most software on the market still follows one script: send patient data to a large, general-purpose model and hope the answer holds up. Doe Labs is building toward something different. Every clinic should run an intelligence stack it owns, tuned to local nuance, hosted on infrastructure it trusts, and sharpened by the work happening inside its own walls every day.",
    },
    {
      type: "subheading",
      text: "Reinforcement learning, trained on real clinic work",
    },
    {
      type: "paragraph",
      text: "Reinforcement learning is how an intelligence stack learns what good actually looks like inside your clinic. Instead of grading every task as a one-shot prompt, the model gets a reward signal from outcomes your team already tracks: did the prior authorization get approved, did the patient confirm the appointment, did the note pass review, did the call resolve without an escalation.",
    },
    {
      type: "paragraph",
      text: "Those signals are messy in healthcare, which is exactly why they need to stay on infrastructure the clinic controls. Doe Labs is building pipelines that turn ordinary daily feedback, the kind every front desk and care team already generates, into lasting improvements, without ever exporting raw chart data into a shared training pool.",
    },
    {
      type: "shader",
      id: "doe-labs-rl-workflow",
      shaderVariant: "validate",
      caption: "Reward signals pulled from real outcomes on the floor, not a synthetic benchmark.",
    },
    {
      type: "subheading",
      text: "Open-weight models on infrastructure you control",
    },
    {
      type: "paragraph",
      text: "Open-weight models give clinics something a closed frontier API cannot: weights you can inspect, behavior you can predict, and the freedom to adapt the model to specialty vocabulary, payer rules, and local policy without waiting on someone else's roadmap.",
    },
    {
      type: "paragraph",
      text: "Hosting those models on secure, clinic-controlled cloud compute means you keep the final say over where patient information lives, who can reach it, and how it moves between services. The model runs close to the chart, close to the agents doing the work, and close to the audit trail your compliance team already expects.",
    },
    {
      type: "shader",
      id: "doe-labs-open-weight",
      shaderVariant: "looking-ahead",
      caption: "Open weights running on private infrastructure, never a shared black box.",
    },
    {
      type: "subheading",
      text: "Blended Intelligence",
    },
    {
      type: "paragraph",
      text: "Blended Intelligence is our name for combining the strengths of both approaches instead of picking one. A frontier model takes on the reasoning heavy work that can safely leave the sensitive boundary: literature review, policy comparison, long horizon planning, and synthesis across public guidance.",
    },
    {
      type: "paragraph",
      text: "An open-weight model handles everything that has to stay inside the clinic: patient identifiers, visit transcripts, medication lists, billing context, and any step that touches protected health information. An orchestration layer decides which model gets which piece of a task, merges the results, and records exactly which path was used.",
    },
    {
      type: "paragraph",
      text: "The result reads better than either model working alone. Frontier level depth where the task allows it, local fidelity where privacy demands it. One answer for the clinician, one audit trail for compliance, one stack the clinic can genuinely call its own.",
    },
    {
      type: "shader",
      id: "doe-labs-blended-intelligence",
      shaderVariant: "integrate",
      caption: "Frontier reasoning and open-weight privacy, merged into a single answer.",
    },
    {
      type: "subheading",
      text: "The security standard we're building toward",
    },
    {
      type: "paragraph",
      text: "Security in healthcare cannot be a line item on a compliance slide. Doe Labs is building toward a standard where sensitive patient information never has to leave clinic-controlled compute to get an answer, where every model call carries a provenance log, and where a blended route is clear enough for a compliance review without anyone reverse engineering a black box.",
    },
    {
      type: "paragraph",
      text: "In practice that means encryption in transit and at rest by default, role-scoped access to both weights and logs, and the ability to pause or roll back a model version without taking the clinic offline. Agents, charts, and billing workflows share one security boundary instead of scattering trust across a dozen separate vendor APIs.",
    },
    {
      type: "paragraph",
      text: "This is the standard of security Doe intends to guarantee for healthcare: intelligence that feels as capable as the frontier, as private as the chart room, and as accountable as the clinicians who still make the final call.",
    },
    {
      type: "shader",
      id: "doe-labs-security",
      shaderVariant: "ambient-band",
      caption: "Clinic-controlled compute, explicit routing, audit-ready from day one.",
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
