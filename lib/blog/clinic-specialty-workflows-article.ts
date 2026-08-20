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
      type: "paragraph",
      text: "The goal is not to make every care journey look alike. It is to make the recurring work around that journey legible: what is waiting, who owns it, what information is missing, and when a clinician needs to decide. A useful operating layer should reduce the number of handoffs that disappear into a phone note, portal message, spreadsheet, or inbox.",
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
      type: "subheading",
      text: "Start with the work that repeats.",
    },
    {
      type: "paragraph",
      text: "Specialty operations are full of repeatable moments that are important precisely because they are easy to overlook: confirming that an imaging order is ready before the patient arrives, checking whether a lab was completed before a medication review, preparing the right consent materials, or closing the loop after a procedure. These are strong places to begin because teams can define the expected outcome, review the work before it is sent, and improve the workflow over time.",
    },
    {
      type: "bullets",
      id: "clinic-workflow-starting-points",
      items: [
        "**Intake and readiness:** collect the information, records, consents, and benefits checks needed for the next step.",
        "**Scheduling and coordination:** route requests to the right role and keep appointments, preparation, and follow-up connected.",
        "**Documentation and review:** prepare a complete draft or checklist while leaving clinical judgment and final approval with the team.",
        "**Patient communication:** make the next action clear, timely, and consistent with the clinic’s own voice and protocols.",
        "**Handoffs and escalation:** surface work that requires a nurse, advanced practice clinician, physician, or administrative owner before it becomes a delay.",
      ],
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
      text: "A system that grows with the practice.",
    },
    {
      type: "paragraph",
      text: "A specialty clinic does not need to replace every system on day one to gain a better operating model. The first workflow may be a narrow one—result follow-up, a pre-procedure checklist, a refill review, or a home-visit handoff. Once the team trusts the context, ownership, and review process, adjacent workflows can connect to the same patient thread instead of becoming another isolated tool.",
    },
    {
      type: "paragraph",
      text: "That sequence matters. It gives clinicians and staff a way to evaluate the work in the setting where it actually happens, while giving the organization a clearer view of where time is spent, where decisions stall, and which interventions improve continuity. The same foundation can support a single clinician, a growing specialty practice, or a distributed group without changing the underlying record of responsibility.",
    },
    {
      type: "goldParagraph",
      text: "The most durable clinical software earns its place one reliable workflow at a time—then makes every connected workflow more useful because the context is already there.",
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
    {
      type: "subheading",
      text: "Built to be accountable in the details.",
    },
    {
      type: "paragraph",
      text: "Care teams should be able to see why work was routed, which information informed a draft, and who reviewed the next step. Doe is designed around that visibility. It should be possible to inspect a workflow without reconstructing it from disconnected tabs, and possible to improve a process without asking staff to work around yet another black box.",
    },
    {
      type: "paragraph",
      text: "This is especially important as a clinic adds services, locations, and team members. The operating model has to preserve the practical knowledge that made the practice work in the first place: how it prioritizes, how it escalates, and how it communicates with patients. Configuration is not just branding or templates. It is how the system learns to support a clinic’s standards while keeping the people responsible for care in control.",
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
