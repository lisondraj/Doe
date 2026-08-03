import type { AboutStyleLongformArticle } from "@/lib/blog/about-style-longform-article";
import { INTRODUCING_PULSE_FEATURE_CARDS } from "@/lib/blog/introducing-pulse-feature-cards";
import { HEY_CAROUSEL_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";

export const INTRODUCING_PULSE_SLUG = "introducing-pulse";

export const INTRODUCING_PULSE_PATH = `/blog/${INTRODUCING_PULSE_SLUG}`;

export const INTRODUCING_PULSE_ARTICLE = {
  slug: INTRODUCING_PULSE_SLUG,
  path: INTRODUCING_PULSE_PATH,
  title: "Introducing Pulse",
  excerpt:
    "Pulse brings live clinical signals into one stream so care teams can see what changed, who needs attention, and what to do next.",
  subheading: "We're building voice agents that go beyond the front desk.",
  openingLede: "Today, we're excited to introduce Doe's first two flagship products, Pulse and Canvas.",
  openingLedeContinuation:
    "Pulse is our suite of AI-native voice agents built to automate every aspect of your clinic's workflow. Our agents can schedule appointments, handle calls with insurers, prepare you for your appointments, handle clinic management issues. Pulse integrates with your clinic phone number and existing software to pick-up, respond to, and resolve any kind of request that reaches your front desk.",
  byline: "By James Lisondra",
  date: "August 2, 2026",
  heroBackdrop: HEY_CAROUSEL_BACKDROP,
  featureCards: INTRODUCING_PULSE_FEATURE_CARDS,
  bodyParagraphs: [
    "Most clinics already generate more signal than any one team can watch. Vitals update, labs return, messages arrive, and orders cross departments — often in systems that never talk to each other on the way in.",
    "Pulse sits on top of the workflows you already run in Doe. It watches the streams that matter to your practice, surfaces only the shifts that need a human, and routes each one to the right role with the chart context attached.",
    "We built Pulse for teams that want proactive care without building a command center. The product is designed around three ideas: every signal should be actionable, every escalation should respect scope of practice, and nothing important should depend on someone refreshing a tab.",
    "Early partners are using Pulse to catch deteriorating panels, stalled referrals, and inbox threads that would have sat until the next clinic day. The goal is not more alerts — it is fewer surprises.",
    "Pulse is rolling out specialty by specialty. If your team wants early access, we would love to hear how you triage change today.",
  ],
  contactParagraphIndex: 4,
  proposalHighlightLead:
    "We believe the next generation of clinical software will not ask teams to hunt for change — it will deliver change with context, accountability, and a clear next step.",
  proposalHighlightContinuation:
    "Pulse is our first product built entirely around that belief.",
  proposalClosing:
    "Over the coming weeks we will share more about how Pulse connects to scheduling, messaging, and documentation inside Doe.",
  thesisSectionHeadline: "What Pulse Is Built For",
  thesisIntro: "Pulse is designed around a short set of principles that will guide how we ship and expand the product:",
  thesisPoints: [
    "Signal should arrive with patient context, not as a bare notification that sends staff hunting through tabs.",
    "Routing should respect license and role so nurses, MAs, and physicians each see work meant for them.",
    "Every alert should either produce an action or disappear — Pulse should reduce noise, not add to it.",
  ],
  closing:
    "These principles define how Pulse will grow inside Doe and how we will partner with early clinics on the rollout.",
  finalParagraph:
    "If live clinical awareness matters to your practice, we would welcome the chance to connect.",
  emailInviteHeadline: "We'd love to chat.",
  emailInviteLabel: "Email James",
} satisfies AboutStyleLongformArticle;

export const INTRODUCING_PULSE_TITLE = INTRODUCING_PULSE_ARTICLE.title;

export const INTRODUCING_PULSE_EXCERPT = INTRODUCING_PULSE_ARTICLE.excerpt;
