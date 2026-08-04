import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import {
  BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
  BROADER_DOE_VISION_FINAL_PARAGRAPH,
} from "@/lib/blog/broader-doe-vision-article";
import { INTRODUCING_FLOAT_FEATURE_CARDS } from "@/lib/blog/introducing-float-feature-cards";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTRODUCING_FLOAT_SLUG = "introducing-float";

export const INTRODUCING_FLOAT_PATH = `/blog/${INTRODUCING_FLOAT_SLUG}`;

export const INTRODUCING_FLOAT_ARTICLE = {
  slug: INTRODUCING_FLOAT_SLUG,
  path: INTRODUCING_FLOAT_PATH,
  title: "Introducing Float",
  excerpt:
    "Float is Doe's AI-native finance layer for clinics — insurance, billing, collections, and management fees in one system, powered by voice agents and the Fabric agent builder.",
  subheading: "Financial operations that stay in sync with care.",
  openingLede:
    "Today we're introducing Float — Doe's AI product for everything that happens after the visit: claims, collections, payer calls, and the overhead math that keeps multi-site groups honest.",
  openingLedeContinuation:
    "Most clinics still run revenue cycle across disconnected clearinghouses, phone trees, and spreadsheets. Float brings those workflows into one intelligent surface — with voice agents that handle payer hold times, an agent builder for custom collection flows, and AI that watches denials and balances before they become write-offs.",
  openingLedeContinuation2:
    "Float connects to the same chart, scheduling, and documentation context as Pulse and Fabric, so every billing action stays tied to the patient encounter it came from.",
  byline: "By James Lisondra",
  date: "August 4, 2026",
  heroBackdrop: CARE_COORDINATION_BACKDROP,
  featureCards: INTRODUCING_FLOAT_FEATURE_CARDS,
  bodyParagraphs: [
    "Revenue cycle work rarely fails because teams lack effort. It fails because information arrives late, payer rules change quietly, and the tools that move money sit apart from the tools that deliver care.",
    "Float starts from the chart and works outward: eligibility before the visit, charge capture at documentation, claim submission with clean context, and persistent follow-up when payers push back.",
    "Voice agents are not a gimmick on top of billing software — they are how Float closes the loop on tasks that used to require someone to dial, wait, and re-key what they heard. Fabric extends that same idea to workflows your finance team designs themselves.",
    "We are building Float with groups that operate across multiple sites and specialties, where management fees, shared overhead, and contract variance actually matter to the bottom line.",
    "Float is entering early access with a small set of primary care and specialty practices. If revenue cycle is the bottleneck between the care you deliver and the cash you need to keep delivering it, we would like to talk.",
  ],
  contactParagraphIndex: 4,
  proposalHighlightLead:
    "We believe financial operations should be as attentive and contextual as clinical ones — automated where repetition lives, human where judgment matters.",
  proposalHighlightContinuation: "Float is how Doe brings that standard to the business side of the clinic.",
  proposalClosing:
    "We will share more soon about payer integrations, appeal automation, and how Float connects to Pulse voice agents and Fabric workflows across Doe.",
  thesisSectionHeadline: "What Float Makes Possible",
  thesisIntro: "Float is shaped by three commitments that will guide every release:",
  thesisPoints: [
    "Every billing action should trace back to a specific patient encounter, with audit history staff and compliance teams can trust.",
    "Payer and patient outreach should run through agents that sound like the practice — configurable in Fabric, measurable in Float.",
    "Finance leaders should see cash, denials, and contract variance in one place instead of reconciling portals every Monday morning.",
  ],
  closing: "These commitments will guide Float as we expand from early access into the broader Doe platform.",
  finalParagraph: BROADER_DOE_VISION_FINAL_PARAGRAPH,
  emailInviteHeadline: BROADER_DOE_VISION_EMAIL_INVITE_HEADLINE,
  emailInviteLabel: BROADER_DOE_VISION_EMAIL_INVITE_LABEL,
} satisfies AboutStyleLongformArticle;

export const INTRODUCING_FLOAT_TITLE = INTRODUCING_FLOAT_ARTICLE.title;

export const INTRODUCING_FLOAT_EXCERPT = INTRODUCING_FLOAT_ARTICLE.excerpt;
