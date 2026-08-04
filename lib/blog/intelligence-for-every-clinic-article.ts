import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

/** Reiterates the Broader Doe Vision thesis in this article's own words, not a copy. */
const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_LEDE =
  "We think the future of medicine runs on intelligence every clinic owns outright, not one borrowed from a single outside vendor.";

const INTELLIGENCE_FOR_EVERY_CLINIC_OPENING_CONTINUATION =
  "This article walks through how we plan to build that: how the system learns from your clinic's own work, why sensitive models stay on infrastructure you control, and the security bar we hold ourselves to.";

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
      text: "Most healthcare software works the same way today. Your team's information gets sent out to one large, general-purpose AI model, and you hope the answer holds up. We are building toward something more useful: an intelligence system built specifically around your clinic, running on computers your clinic trusts, that keeps getting sharper the more your team uses it.",
    },
    {
      type: "paragraph",
      text: "Before we go further, we think it helps to first introduce a few of the terms this article leans on, in plain language rather than jargon.",
    },
    {
      type: "paragraph",
      text: "Reinforcement learning is a training method that rewards a system for good outcomes and corrects it for bad ones, the same way a new team member gets sharper from feedback on real cases rather than a written test. Open-weight models are AI models you can actually install and run on servers you control, instead of a closed system you can only reach through someone else's website. Frontier models are today's largest, most capable general-purpose AI systems, usually reached only through an outside company's service. Protected health information, often shortened to PHI, is any patient detail covered by HIPAA, from a name and birth date to a diagnosis or clinical note. And Blended Intelligence is our name for using an open-weight model and a frontier model together, sending each piece of a task to whichever one is right for the job.",
    },
    {
      type: "subheading",
      text: "Learning from the work your clinic already does",
    },
    {
      type: "paragraph",
      text: "Think of reinforcement learning as on-the-job training for software. Rather than judging the system against one canned test, we let it learn from outcomes your staff already track: whether a prior authorization got approved, whether a patient confirmed a visit, whether a note passed review, whether a call ended without a human needing to step in. Each of those outcomes becomes a small lesson the system uses to improve.",
    },
    {
      type: "paragraph",
      text: "That kind of feedback is specific and sensitive to your clinic, so it needs to stay on infrastructure your clinic controls rather than being pooled with everyone else's data. We are building the pipelines to capture that daily feedback safely, so the system keeps improving without a single patient chart ever having to leave your walls to make it happen.",
    },
    {
      type: "shader",
      id: "doe-labs-rl-workflow",
      shaderVariant: "validate",
      caption: "Every approval, confirmation, and resolved call becomes a small lesson for the system.",
    },
    {
      type: "subheading",
      text: "Why we run open-weight models instead of renting one",
    },
    {
      type: "paragraph",
      text: "An open-weight model is one we can actually see inside of and run ourselves, instead of a closed system we can only send requests to. That matters for two reasons. First, we can tune it to a specialty's vocabulary and a clinic's local policy without waiting on an outside company's release schedule. Second, and more important for healthcare, we can host it entirely on cloud servers your clinic controls.",
    },
    {
      type: "paragraph",
      text: "That means patient information never has to leave infrastructure you trust just to get a useful answer. The model, the agents that use it, and the audit trail your compliance team reviews all live inside the same secure environment, instead of being scattered across a handful of outside vendor APIs.",
    },
    {
      type: "shader",
      id: "doe-labs-open-weight",
      shaderVariant: "looking-ahead",
      caption: "The model, the data, and the audit trail live behind the same locked door.",
    },
    {
      type: "subheading",
      text: "Blended Intelligence: the right model for the right part of the job",
    },
    {
      type: "paragraph",
      text: "Not every task needs the same tool. A frontier model is excellent at broad reasoning, comparing guidelines, or working through a long and complicated plan, but it typically lives outside your walls. An open-weight model may not be quite as broadly capable, but it can safely handle anything that touches a real patient record, because it never has to leave your own infrastructure.",
    },
    {
      type: "paragraph",
      text: "Blended Intelligence is how we use both without asking a clinic to choose. A request gets split as it comes in. The pieces that can safely leave the sensitive boundary, like reviewing published research or comparing policy language, go to a frontier model. Anything touching a patient's identity, medications, visit details, or billing stays with the open-weight model running on your own compute. An orchestration layer, essentially a traffic controller for the request, stitches both responses back together and logs exactly which model handled which piece.",
    },
    {
      type: "quote",
      id: "doe-labs-blended-intelligence-quote",
      lead: "The clinician sees one clear answer, and the compliance team sees one clean record of how it was produced",
      continuation:
        "The result reads better than either model manages alone, **frontier-level reasoning paired with the privacy patient care demands**.",
    },
    {
      type: "shader",
      id: "doe-labs-blended-intelligence",
      shaderVariant: "integrate",
      caption: "One request, two models, one traceable answer.",
    },
    {
      type: "subheading",
      text: "The security bar we are building toward",
    },
    {
      type: "paragraph",
      text: "In healthcare, security cannot be an afterthought bolted onto a finished product. We are building toward a standard where sensitive patient information never has to leave clinic-controlled compute to get an answer, where every model call is logged with a clear record of what happened, and where a blended request can be explained to an auditor in plain terms instead of treated as an unexplainable black box.",
    },
    {
      type: "paragraph",
      text: "In practice, that means data is encrypted both while it moves and while it sits in storage, access to models and logs is limited to the roles that actually need it, and any model version can be paused or rolled back without taking your clinic offline. Every agent, chart, and billing workflow shares one security boundary instead of trusting a dozen separate outside vendors.",
    },
    {
      type: "quote",
      id: "doe-labs-security-quote",
      lead: "This is the standard Doe intends to guarantee for healthcare",
      continuation:
        "Intelligence that performs like the frontier, protects information like **your own chart room**, and stays accountable to the clinicians who still make the final call.",
    },
    {
      type: "shader",
      id: "doe-labs-security",
      shaderVariant: "ambient-band",
      caption: "One security boundary, one audit trail, one standard we hold ourselves to.",
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
