import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { DOEHOME_SHADERS } from "@/lib/doehome/doehome-shaders";
import { DESIGN5_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const CLINIC_SPECIALTY_WORKFLOWS_SLUG = "clinic-specialty-workflows";

export const CLINIC_SPECIALTY_WORKFLOWS_PATH = `/blog/${CLINIC_SPECIALTY_WORKFLOWS_SLUG}`;

export const CLINIC_SPECIALTY_WORKFLOWS_ARTICLE = {
  slug: CLINIC_SPECIALTY_WORKFLOWS_SLUG,
  path: CLINIC_SPECIALTY_WORKFLOWS_PATH,
  title: "Built for the way",
  titleLine2: "each clinic practices",
  excerpt:
    "How Doe is being built for diagnostic imaging, endocrine and weight management, aesthetic care, home care, concierge medicine, and other specialty clinic workflows.",
  subheading: "Specialty workflows on one foundation.",
  openingLede:
    "Doe is a clinical operations system that adapts to specialty workflow—not a generic assistant placed on top of the same old queue.",
  openingLedeContinuation:
    "A diagnostic imaging center, an endocrine practice, and a concierge clinician all need the same fundamental things: reliable patient context, clear ownership, and a record of what happened next. But their work does not look the same. Doe is being built so that every specialty can run its own operating model on a shared, accountable foundation.",
  byline: "By Doe",
  date: "August 19, 2026",
  heroBackdrop: DESIGN5_BACKDROP,
  contentBlocks: [
    {
      type: "paragraph",
      text: "The core stays consistent: a unified patient thread, workflow-aware agents, role-based routing, and reviewable actions. The surface changes to match the clinic—its care journey, terminology, staff roles, follow-up cadence, and the systems it already uses.",
    },
    {
      type: "doehomeScene",
      id: "clinic-imaging-ui",
      shaderSrc: DOEHOME_SHADERS.chart,
      specialty: "Diagnostic imaging",
      functionLabel: "Order-to-result coordination",
      details: ["MRI knee · authorization due", "Prior study found", "Result review queued"],
      caption: "UI for imaging order intake, authorization status, and result follow-up.",
    },
    {
      type: "subheading",
      text: "One foundation. Configured for the specialty.",
    },
    {
      type: "paragraph",
      text: "For diagnostic imaging, Doe can coordinate intake, prior authorization, preparation instructions, result routing, and the next recommended action. For endocrine and weight management practices, it can keep medication, labs, coaching, and recurring clinical review connected across months of care.",
    },
    {
      type: "doehomeScene",
      id: "clinic-endocrine-ui",
      shaderSrc: DOEHOME_SHADERS.genome,
      specialty: "Endocrine & weight management",
      functionLabel: "Longitudinal care plans",
      details: ["A1c due in 14 days", "GLP-1 refill review", "Nutrition check-in sent"],
      caption: "UI for medication follow-up, lab reminders, and care-plan check-ins.",
    },
    {
      type: "paragraph",
      text: "Plastic surgery, dermatology, and aesthetic clinics need a different rhythm: consultation preparation, informed consent, photography workflows, procedure readiness, and highly responsive post-procedure communication. Home-care teams, nurse practitioners, physician assistants, and concierge clinicians need a mobile-first operating layer that follows care across homes, hospitals, and the clinic—not one that assumes every decision happens at a front desk.",
    },
    {
      type: "doehomeScene",
      id: "clinic-aesthetics-ui",
      shaderSrc: DOEHOME_SHADERS.pulse,
      specialty: "Plastic surgery & aesthetics",
      functionLabel: "Consult-to-procedure flow",
      details: ["Consultation packet complete", "Photo consent received", "Day-3 recovery check"],
      caption: "UI for consultation intake, photo consent, and post-procedure messaging.",
    },
    {
      type: "quote",
      id: "clinic-models-quote",
      lead: "Doe is being shaped for specialty practices, independent clinicians, multi-site groups, and teams building new care models",
      continuation:
        "The point is not to force them into a generic workflow. It is to make their existing expertise **easier to operate, inspect, and improve**.",
    },
    {
      type: "doehomeScene",
      id: "clinic-home-care-ui",
      shaderSrc: DOEHOME_SHADERS.handoff,
      specialty: "Home care & concierge medicine",
      functionLabel: "Field care coordination",
      details: ["Home visit routed", "NP handoff prepared", "Follow-up call scheduled"],
      caption: "UI for visit routing, clinician handoffs, and patient follow-up.",
    },
    {
      type: "subheading",
      text: "Purpose-built, without a separate system for every team.",
    },
    {
      type: "paragraph",
      text: "Specialty configuration should not create a new silo. A referral, a result, a clinician decision, and a patient message all remain part of the same thread. Doe can route work by license and responsibility, preserve the evidence behind a recommendation, and keep teams in control of the actions that affect care.",
    },
    {
      type: "paragraph",
      text: "We are starting with the operational moments that create the most friction: intake, scheduling, authorizations, documentation, results, follow-up, and handoffs. Then we adapt the UI and automation around the real work of the clinic.",
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
    "Doe is being built so specialty clinics can keep their own operating model—on a shared, accountable foundation.",
  emailInviteHeadline: "Continue the conversation.",
  emailInviteLabel: "Contact Doe",
} satisfies AboutStyleLongformArticle;

export const CLINIC_SPECIALTY_WORKFLOWS_TITLE = `${CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.title} ${CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.titleLine2}`;

export const CLINIC_SPECIALTY_WORKFLOWS_EXCERPT = CLINIC_SPECIALTY_WORKFLOWS_ARTICLE.excerpt;

export const CLINIC_SPECIALTY_WORKFLOWS_DESCRIPTION = CLINIC_SPECIALTY_WORKFLOWS_EXCERPT;
