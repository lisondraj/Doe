import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";
import {
  DOEPHONE_HERO_BACKDROP,
  HEY_CAROUSEL_BACKDROP,
  DESIGN3_BACKDROP,
  DESIGN5_BACKDROP,
} from "@/lib/workflow-carousel-design-backdrops";

export type BlogArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  author: string;
  date: string;
  body: readonly string[];
  backdrop: WorkflowCarouselDesignBackdrop;
};

export const BLOG_ARTICLES: readonly BlogArticle[] = [
  {
    slug: "code-intelligence-for-doe-agent",
    eyebrow: "Now / AI",
    title: "Code Intelligence for Doe Agent",
    author: "Karri Saarinen",
    date: "May 14, 2026",
    body: [
      "Doe Agent can now read your codebase and answer questions from the source itself. It can explain how a feature works, investigate likely causes behind a problem, and help teams understand the current implementation directly.",
      "Instead of guessing from stale docs or a partial stack trace, engineers ask in plain language and get answers grounded in the repo—file paths, call sites, and the contracts that actually ship. The agent cites what it read so you can verify before you merge.",
      "We built this for teams that move fast without leaving context on Slack threads. Code intelligence keeps product, clinical, and platform work tied to the same source of truth as the code review.",
      "Healthcare software carries a particular kind of complexity. A single feature can touch scheduling logic, insurance eligibility checks, clinical decision rules, and billing codes—sometimes across codebases that evolved independently over a decade. When something breaks at the edge of two systems, the answer rarely lives in one file. Code intelligence lets the agent trace the full path: which service owns the rule, which team last changed it, and what the contract between them actually says.",
      "The agent also helps teams onboard faster. Instead of spending the first two weeks of a new role reading PRs and asking seniors where things live, engineers can ask directly. Where does the appointment confirmation get sent? Which model owns prior auth status? What happens to a message when the inbox is in maintenance mode? These are questions that used to require tribal knowledge. Now they have answers in seconds.",
      "We are not trying to replace thoughtful engineering. We are trying to eliminate the friction that prevents thoughtful engineering from happening. When the answer to a question is a search away rather than a meeting away, teams spend more time building and less time reconstructing context they should never have had to lose in the first place.",
      "Code intelligence is available now for all Doe teams on the Growth and Enterprise plans. Support for monorepos and multi-service architectures is rolling out through June.",
    ],
    backdrop: DOEPHONE_HERO_BACKDROP,
  },
  {
    slug: "ambient-documentation-at-the-bedside",
    eyebrow: "Product / Clinical",
    title: "Ambient Documentation at the Bedside",
    author: "Maya Chen",
    date: "April 28, 2026",
    body: [
      "Doe listens during the visit, drafts the note with citations, and surfaces only what needs a clinician's eyes before sign-off. The chart updates without another hour at the keyboard after clinic.",
      "Ambient capture runs with explicit consent and clear controls—pause, discard, or edit before anything lands in the record. Drafts follow your note templates and pull problem lists, meds, and prior visits so you are not starting from a blank screen.",
      "The goal is not to remove the clinician from the note. It is to remove the clerical tax that keeps smart people documenting instead of caring for the next patient in the queue.",
      "Every practice has a different rhythm. A family medicine visit runs differently than a hospitalist consult or an ED triage. Ambient documentation adapts to each context—the length, the tone, the sections that matter—because the note is trained on how your practice already writes, not on a generic template built in a conference room somewhere.",
      "Trust is the harder problem. Clinicians have been burned by autofill that missed the nuance, by voice recognition that mangled medication names, by AI that hallucinated a finding that was never said. Doe addresses this by making every sentence traceable. Each claim in the draft links to the moment in the conversation that supports it. You review evidence, not output.",
      "We piloted ambient documentation with three primary care groups and two specialty practices over six months. On average, clinicians recovered forty-five minutes per day previously spent on after-hours charting. Patient interaction time in the room increased. Burnout scores on the MBI-HWB survey dropped meaningfully across all five sites.",
      "Ambient documentation is available in early access for primary care, internal medicine, and urgent care. Specialty configurations for cardiology, endocrinology, and behavioral health are in active development with clinical advisors.",
    ],
    backdrop: HEY_CAROUSEL_BACKDROP,
  },
  {
    slug: "prior-auth-grounded-in-chart-facts",
    eyebrow: "Workflow / Revenue",
    title: "Prior Auth Grounded in Chart Facts",
    author: "James Okonkwo",
    date: "April 3, 2026",
    body: [
      "Prior authorization packets assemble from live chart context—diagnoses, labs, and prior denials—so teams stop retyping the same story into payer portals every week.",
      "Doe maps payer criteria to what is already documented, flags missing labs or stale imaging, and drafts the clinical justification with citations back to the chart. Staff review, edit, and submit instead of hunting through scanned PDFs.",
      "When denials arrive, the same thread picks up where it left off. Appeals reuse the original evidence trail so revenue cycle does not lose the narrative between first submission and second look.",
      "The prior authorization process was designed for a world where payers and providers had time to negotiate. That world does not exist in modern practice. A physician orders a scan, a staff member spends forty minutes assembling a packet from memory, the payer denies on a technicality, and the patient waits another two weeks while the appeal winds through a fax queue. The clinical need does not change. Only the paperwork does.",
      "Doe approaches prior auth as a knowledge problem rather than a forms problem. The information payers need is almost always already in the chart. The challenge is extracting it accurately, mapping it to the right criteria for the right plan, and presenting it in the format that moves fastest through a specific payer's review process. We have built payer-specific logic for over two hundred commercial and government plans, and we update it continuously as criteria change.",
      "Revenue cycle teams that use Doe for prior auth report a significant reduction in initial denial rates and faster turnaround on appeals. More importantly, they report that staff are spending less time on submission and more time on complex cases that actually require human judgment—conversations with medical directors, peer-to-peer reviews, and escalations where clinical relationships matter.",
      "Prior auth automation is available now for all Doe customers. Payer coverage expands weekly. Contact your account team to see which plans are supported for your specialty.",
    ],
    backdrop: DESIGN5_BACKDROP,
  },
  {
    slug: "one-inbox-for-every-channel",
    eyebrow: "Now / Inbox",
    title: "One Inbox for Every Channel",
    author: "Elena Vasquez",
    date: "March 12, 2026",
    body: [
      "Patient messages, lab callbacks, and referral faxes land in one triaged stream. Doe drafts replies, routes escalations, and keeps nothing trapped in a screenshot on someone's camera roll.",
      "Every thread carries context—who the patient is, which visit is next, and what was promised last time. Triage rules respect scope of practice so nurses, MAs, and physicians each see work meant for their license.",
      "The inbox is the front door to everything else in Doe. Agents run inside the same conversation: scheduling, prior auth, and follow-up tasks stay attached to the message that started them.",
      "Most practices manage communication across four or five channels simultaneously: patient portal messages, phone callbacks logged in paper or a spreadsheet, fax inbound for lab and referral results, text messages from patients who found a staff member's number, and internal Slack threads trying to coordinate the above. The result is that nothing has a single owner, context splits across systems, and things fall through the cracks not because anyone is careless but because the system makes carefulness nearly impossible.",
      "Doe consolidates these streams without requiring practices to abandon any of them. The patient portal, fax line, and phone queue all feed into the same triage layer. Doe assigns priority, drafts a suggested response, and routes each item to the right person. When the nurse opens the inbox in the morning, she sees her work—not everyone's work with no way to tell which items need her specifically.",
      "The drafts Doe writes are not generic. They reference the patient's chart, use the practice's tone, and anticipate follow-up questions. A lab result message includes the result, what it means in the context of the patient's recent visit, and what they should do next. A scheduling request acknowledges the visit type, checks availability against provider rules, and proposes a time in the same reply. The goal is to make the first message the last message.",
      "The unified inbox is included in all Doe plans. Fax integration requires a one-time setup with your existing fax number or a new number provisioned through Doe. Phone integration is available in beta.",
    ],
    backdrop: DESIGN3_BACKDROP,
  },
] as const;

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}
