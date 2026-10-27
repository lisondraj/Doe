import type { DoeHealthProductTab } from "@/components/doehealth-product/DoeHealthProductHome";
import { EARLYPREVIEW_COMPLIANCE_PATH } from "@/lib/earlypreview/earlypreview-compliance-copy";
import type { EarlyPreviewFilmId } from "@/lib/earlypreview/earlypreview-films";
import {
  EARLYPREVIEW_MARKET_MODEL as MODEL,
  EARLYPREVIEW_MARKET_PRICING as PRICING,
  EARLYPREVIEW_MARKET_TARGETS as T,
} from "@/lib/earlypreview/earlypreview-market-copy";

export const DOEHEALTH_BLOG_PATH = "/news";

/** Doe brand colours only — three beige shades for hero art, three accent tones for body figures. */
export type DoeHealthBlogPlaceholderTone = "sand" | "panel" | "cream" | "gold" | "clay" | "umber";

/** The dot designs behind an article's product figures, after video1's backdrops. Each figure in one article uses a different one. */
export type DoeHealthBlogDots = "wave" | "tide" | "halftone" | "curtain" | "rings" | "sphere";

/**
 * A stretch of a /video1–/video6 section (by composition id, e.g. "Video2Network"), looping between two frames. `zoom`
 * pushes in on one point of the 1920×1080 frame (as fractions), so one card or one corner of the shell fills the box.
 */
export type DoeHealthBlogFilmView = {
  kind: "film";
  film: string;
  from: number;
  to: number;
  /** The frame shown before the film plays. Defaults to `from`. */
  still?: number;
  zoom?: { s: number; x: number; y: number };
};

/**
 * A live /doehealthproduct tab. `sit` frames it: the whole product in its brown shell, its paper page alone, or its
 * top-left (br) or top-right (bl) corner running off the box. A cursor clicks each `clicks` target in turn, found by the
 * text it shows (`nth` for a repeated label), and holds `hold` ms on what the click opened.
 */
export type DoeHealthBlogAppView = {
  kind: "app";
  tab: DoeHealthProductTab;
  sit: "full" | "inner" | "br" | "bl";
  tone: DoeHealthBlogPlaceholderTone;
  dots: DoeHealthBlogDots;
  clicks: readonly { text: string; nth?: number; hold?: number }[];
  /** Where the cursor starts, in the artboard's 1440×900 pixels. */
  start?: { x: number; y: number };
};

export type DoeHealthBlogView = DoeHealthBlogFilmView | DoeHealthBlogAppView;

export type DoeHealthBlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "figure"; tone: DoeHealthBlogPlaceholderTone; caption: string }
  | { type: "view"; view: DoeHealthBlogView; caption: string }
  /** A boxed note for investors: a title, a row of figures, and the points behind them. */
  | {
      type: "investor";
      title: string;
      stats: readonly { value: string; label: string }[];
      text?: string;
      points?: readonly { lead: string; text: string }[];
    }
  /** A quarter-by-quarter plan, each step with what it delivers and what it unlocks; `seed` marks the Seed quarter. */
  | {
      type: "timeline";
      caption: string;
      steps: readonly { when: string; title: string; items: readonly string[]; unlock: string; seed?: boolean }[];
    }
  | { type: "quote"; text: string }
  | { type: "list"; items: readonly { lead: string; text: string }[] };

/** The photo behind the names and play button in an article's hero. Unset keeps the lounge photo. */
export type DoeHealthBlogHeroImage = { src: string; alt: string };

/** Hero photo for every article except the Era one. */
const OTHER_HERO_IMAGE: DoeHealthBlogHeroImage = {
  src: "/doehealthdesk2/other.png",
  alt: "A bright living room with a cream curved armchair, a tall olive tree and a wall of sunlit windows",
};

/** A second hero photo, so the non-Era articles don't all share one. */
const GOLDEN_LOFT_HERO_IMAGE: DoeHealthBlogHeroImage = {
  src: "/doehealthdesk2/golden-loft.png",
  alt: "A sunlit loft at golden hour with cream sculptural seating, a round dining table and tall factory windows",
};

const STOOLS_HERO_IMAGE: DoeHealthBlogHeroImage = {
  src: "/doehealthdesk2/sunlit-minimalist-wooden-stools.jpg",
  alt: "Sunlight falling across a row of minimalist wooden stools against a pale plaster wall",
};

/** Shape of an article's dot wave. Omitted fields keep the default wave. Every wave fills the bottom edge. */
export type DoeHealthBlogWave = {
  /** Where the wave starts, as a fraction of the box height (0.40 and up fills the bottom edge). */
  top?: number;
  amp?: number;
  phase?: number;
  /** Horizontal wavelength multiplier. */
  scale?: number;
  /** Leans the wave into diagonals; negative leans the other way. */
  slant?: number;
  /** Turns crests into troughs. */
  flip?: boolean;
};

export type DoeHealthBlogFilm = { id: EarlyPreviewFilmId; thumbnail: string; label: string };

export type DoeHealthBlogArticle = {
  slug: string;
  eyebrow: string;
  /** Two-line P22 title. */
  title: readonly [string, string];
  author: string;
  date: string;
  excerpt: string;
  heroTone: DoeHealthBlogPlaceholderTone;
  wave?: DoeHealthBlogWave;
  heroImage?: DoeHealthBlogHeroImage;
  /**
   * The /earlypreview film this article is about. When set, the hero is that film, playable in place, with the same
   * screenshot thumbnail as on /earlypreview (a 16:9 frame at the film's own 4K size).
   */
  film?: DoeHealthBlogFilm;
  lede: string;
  blocks: readonly DoeHealthBlogBlock[];
};

/** The investor figures, from the /earlypreview market model, so every article quotes the same plan. */
const n = (value: number) => value.toLocaleString("en-US");
const SEED_GROUPS = PRICING.seedPlans.canada.groups + PRICING.seedPlans.us.groups;
const SEED_SEATS = PRICING.seedPlans.canada.groupSeats + PRICING.seedPlans.us.groupSeats;
const GROUP_ARR_SHARE = Math.round(((SEED_SEATS * PRICING.founding.group * 12) / 1000 / T.arrK) * 100);

const PERSONAL_AGENTS: DoeHealthBlogArticle = {
  slug: "healthcare-in-the-era-of-personal-agents",
  film: { id: "hero", thumbnail: "/earlypreview/thumbs/hero.jpg", label: "Healthcare in the Era of Personal Agents" },
  eyebrow: "Founder's Memo",
  title: ["Healthcare in the", "Era of Personal Agents"],
  author: "James Lisondra",
  date: "October 14, 2026",
  excerpt:
    "Patients are starting to ask agents to find, book, and pay for their care. Healthcare is not yet written in a language those agents can read.",
  heroTone: "sand",
  lede: "Very soon, the first person to look for a doctor will not be a person. It will be the agent they ask.",
  blocks: [
    {
      type: "paragraph",
      text: "A parent sits on the edge of the bed at 9:41 in the morning and types a question into their phone: can you find a pediatric ENT near Mission that takes Harbor Mutual? My son keeps getting ear infections. It is a reasonable request. It is specific, it is urgent, and every piece of information needed to answer it already exists somewhere.",
    },
    {
      type: "paragraph",
      text: "Today the agent answers the only way it can. It cannot find a clinic that fits. It suggests calling the insurance company. The parent puts the phone down and starts the same chain of hold music, voicemail, and callbacks that patients have navigated for decades.",
    },
    {
      type: "paragraph",
      text: "That answer is not a failure of intelligence. The models are more than capable of reasoning through the request. It is a failure of legibility. The information an agent would need to help that parent lives inside phone trees, PDF fee schedules, outdated directories, portal logins, and the memory of a front desk team that already has too much to do.",
    },
    { type: "heading", text: "The front door is moving." },
    {
      type: "paragraph",
      text: "For most of modern medicine, the front door of a practice was a phone number. Then it became a website, a directory listing, and a portal. Each shift changed who arrived, how they arrived, and what they expected once they did. The next shift is already underway: patients are handing the first steps of their care to personal agents that search, compare, schedule, and follow up on their behalf.",
    },
    {
      type: "paragraph",
      text: "Those agents will not browse the way people do. They do not skim a homepage, notice a phone number in the footer, and decide to call between meetings. They look for structured answers: which provider sees this condition, at this age, under this plan, at this location, with an opening this week. When those answers are missing, the agent moves on, and so does the patient.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video1Structured", from: 100, to: 192 },
      caption: "Today the parent's agent asks for a pediatric ENT near Mission that takes Harbor Mutual, and has nothing to read. It comes back with a phone number.",
    },
    {
      type: "paragraph",
      text: "I came to this problem from medicine, not from software. In clinic, I watched how much of a patient's experience is decided before they ever meet a clinician: whether they found the right office, whether the referral was in place, whether the visit was covered, whether someone called them back. Those moments are rarely clinical, but they determine whether care happens at all.",
    },
    { type: "heading", text: "Agents cannot read healthcare yet." },
    {
      type: "paragraph",
      text: "Think about what it actually takes to answer the parent's question. An agent would need to know that ear tubes and tympanostomy describe the same procedure, that recurrent ear infections are a reason a pediatric ENT would see a child, and that a given surgeon sees patients from six months old. It would need to know which locations are in Mission, which plans each provider accepts, whether that plan requires a referral, what a self-pay visit costs, and which slots are open on Wednesday morning.",
    },
    {
      type: "paragraph",
      text: "None of that is exotic. Every practice knows it. But it is scattered across systems that were never designed to be read by anyone outside the building, let alone by software acting on a patient's behalf. The result is a strange gap: the most capable assistants ever built, pointed at an industry they cannot see.",
    },
    {
      type: "quote",
      text: "The bottleneck is no longer whether an agent can reason about care. It is whether care has been written down in a way an agent can understand.",
    },
    { type: "heading", text: "A practice, made legible." },
    {
      type: "paragraph",
      text: "At Doe, we are building the layer that closes that gap. Every practice we work with gets its own machine-readable index: a living description of what the practice does, who does it, and under what conditions. It is written once by the practice, kept current as the practice changes, and exposed to agents in a structured, accountable way.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Services",
          text: "what the practice offers, the language patients use for it, and the conditions each service is meant for.",
        },
        {
          lead: "Providers",
          text: "who sees which patients, their specialties, the ages they treat, the languages they speak, and whether they are accepting new patients.",
        },
        {
          lead: "Coverage",
          text: "the plans each provider accepts, referral and prior authorization rules, and honest self-pay prices.",
        },
        {
          lead: "Availability",
          text: "real openings for real visit types, so an agent can offer a time instead of a phone number.",
        },
        {
          lead: "Rules",
          text: "the practice's own requirements: pre-visit calls, forms, records, and anything that must happen before a patient walks in.",
        },
      ],
    },
    {
      type: "view",
      view: {
        kind: "app",
        tab: "integrations",
        sit: "full",
        tone: "sand",
        dots: "halftone",
        clicks: [{ text: "Agents", hold: 2200 }, { text: "Messages", hold: 2000 }, { text: "Needs you", hold: 1800 }],
      },
      caption: "Dr. Brooks' Index on Doe: what needs the team, the schedule, agent requests, services, and locations, each row live for agents and opening in place.",
    },
    {
      type: "paragraph",
      text: "With that index in place, the same request reads very differently. The agent understands that ear tubes means ear tube insertion, finds a pediatric ENT a few blocks away who is in network with Harbor Mutual, notes that a referral is needed and can be requested automatically, and offers Wednesday at 9:40. The parent says yes. The visit is on the calendar before the coffee is cold.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video1Structured", from: 660, to: 832 },
      caption: "With the index in place, the same request finds Atlantic Pediatric ENT, in network and a few blocks away, and the agent books Wednesday at 9:40.",
    },
    { type: "heading", text: "From search to the whole visit." },
    {
      type: "paragraph",
      text: "Finding the right clinic is only the first step. Once a personal agent can read a practice, it can also work with one. If a surgeon requires a pre-visit phone call with a medical assistant, the patient's agent can learn that rule, ask the parent whether to handle it, and coordinate the call. When the visit is over and a charge arrives, the agent can check it against the estimate, confirm the plan's coverage, and pay it with the family's HSA card, saving the receipt to the child's records.",
    },
    {
      type: "paragraph",
      text: "Over time, the most important conversations will happen between agents. A patient's agent talks to the practice's front desk agent. The practice's agent talks to a hospital's surgical scheduling agent, a lab, or an insurer. Each one works within the rules of the organization it represents, and each one leaves a clear record of what it did and why.",
    },
    {
      type: "paragraph",
      text: "That is a very different picture of healthcare operations than the one most teams live with today. Not a busier inbox, but fewer handoffs that disappear. Not more portals, but fewer moments where a patient has to repeat themselves to someone who should already know.",
    },
    { type: "heading", text: "The practice stays in control." },
    {
      type: "paragraph",
      text: "None of this works if practices have to give up control to get there. A clinic should decide what an agent can see and what it cannot. Some services should be bookable directly. Some should be request only. Some, like a hearing aid fitting that needs an in-person consultation first, should be hidden from agents entirely. The practice sets those rules, reviews the work, and can change its mind at any time.",
    },
    {
      type: "paragraph",
      text: "That is why we build each practice its own intelligence model, rather than renting one generic assistant to everyone. A practice's model learns its services, its voice, and its protocols, and it improves from the work its own agents complete. The knowledge that made the practice good stays with the practice.",
    },
    {
      type: "quote",
      text: "Practices and their patients should own their health intelligence, not borrow it.",
    },
    {
      type: "investor",
      title: "A two-sided network, started from both sides at once.",
      stats: [
        { value: n(T.indexedToday), label: "practices already in the Doe Index" },
        { value: n(T.indexed), label: "practices indexed by Seed, Q2 2028" },
        { value: `$${T.arrK}K`, label: "ARR target at Seed, at founding prices" },
        { value: MODEL.tam.display, label: "the layer across healthcare" },
      ],
      text: "The shift is not hypothetical. More than 10 million people in the U.S. and Canada set up Meta's Muse in about six weeks, 43% of U.S. adults asked AI a health question in the past year, and 94% of health systems already using AI agents use them for appointments. Patients are arriving with agents; practices are not yet readable by them. Doe is the layer in between.",
      points: [
        { lead: "Business model", text: `free to claim, paid to connect. Paid plans start at $${T.fromMo} a location a month at founding prices ($${PRICING.regular.basic} regular), multi-site groups pay per provider, and agent developers integrate once through one API.` },
        { lead: "Network effect", text: "every practice that claims its page makes Doe more useful to agents, and every request an agent cannot complete shows the next practice the patients it is missing." },
        { lead: "Defensibility", text: "each practice gets its own intelligence model and index, improved by the work its own agents complete. That knowledge compounds with every visit and does not move to a competitor." },
        { lead: "Path to Seed", text: `Toronto proves the model first, with New York and San Francisco in parallel: ${n(T.claimed)} practices claimed, ${n(T.paying)} paying locations, and ${T.requestsK}K agent requests a month by Q2 2028.` },
      ],
    },
    { type: "heading", text: "What we are building toward." },
    {
      type: "paragraph",
      text: "The era of personal agents will reward the practices that are easy to understand. Not the loudest, or the ones with the biggest marketing budgets, but the ones whose services, coverage, and availability can be read clearly and trusted. That is a fairer front door than the one healthcare has today, and it is one that independent practices can win.",
    },
    {
      type: "paragraph",
      text: "We started Doe to make sure the people delivering care are ready for that shift, and that patients arriving through it actually get where they are trying to go. The parent at 9:41 should get an answer, not a phone number. We are building the infrastructure so they can.",
    },
  ],
};

const DOCTOR_LED_DESIGN: DoeHealthBlogArticle = {
  slug: "product-design-led-by-doctors",
  heroImage: OTHER_HERO_IMAGE,
  wave: { top: 0.47, amp: 55, phase: 2.2, scale: 0.95, slant: -0.3, flip: true },
  eyebrow: "Design",
  title: ["Providers at Every Stage", "of Product Design"],
  author: "James Lisondra",
  date: "October 7, 2026",
  excerpt:
    "Clinical software is usually designed for the people who buy it. We design Doe with the people who use it, in the rooms where care happens.",
  heroTone: "panel",
  lede: "The best design decisions in healthcare software are made by people who have stood in the room when it fails.",
  blocks: [
    {
      type: "paragraph",
      text: "Most clinicians can tell you, in detail, about the worst screen they use every day. They know which button is three clicks too deep, which alert fires on every chart, and which field has to be filled in twice because two systems do not talk to each other. They rarely got a say in how any of it was built.",
    },
    {
      type: "paragraph",
      text: "Healthcare software has historically been designed for the buyer: the administrator choosing a vendor, the compliance team reviewing a contract, the IT department planning an integration. Those people matter. But the person who lives with the product is the medical assistant on the phone at 8:05, the physician closing notes at 9 p.m., and the patient trying to understand what happens next.",
    },
    { type: "heading", text: "Design starts on the clinic floor." },
    {
      type: "paragraph",
      text: "Doe is designed by doctors and people training to become them. That is not a marketing line. It changes what we notice. When you have rounded on a busy service, you know that a perfectly organized dashboard is useless if it hides the one result that needs attention. When you have worked a front desk, you know that the first ten seconds of a call decide whether a patient feels helped.",
    },
    {
      type: "paragraph",
      text: "So we start every feature where the work actually happens. We sit with front desk teams through a Monday morning rush. We watch how a nurse triages an inbox. We listen to how a physician explains a plan to a family, because the words they choose are the words our agents should learn to use.",
    },
    {
      type: "figure",
      tone: "clay",
      caption: "Every workflow begins as an observation in a real clinic, not a requirement in a document.",
    },
    { type: "heading", text: "Clinical judgment is a design material." },
    {
      type: "paragraph",
      text: "In most software, defaults are a product decision. In healthcare, they are a clinical one. Which message goes out automatically and which waits for review. When an agent escalates to a nurse instead of answering. How a refill request is routed when the last visit was eleven months ago. These choices encode judgment, and we think that judgment should come from people trained to make it.",
    },
    {
      type: "paragraph",
      text: "That is why clinicians sit in our design reviews, not just our user interviews. They help decide what the agent is allowed to do on its own, what it should prepare for a human to approve, and what it should never attempt. The goal is not to automate judgment away. It is to give judgment more room by taking the repetitive work around it.",
    },
    {
      type: "quote",
      text: "A good clinical tool should feel like a colleague who already read the chart, not a form that asks you to read it again.",
    },
    { type: "heading", text: "Our design principles." },
    {
      type: "paragraph",
      text: "Over the past year, a handful of principles have shaped nearly every decision we make. They came from the clinic, and we test new work against them before it ships.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Context before action",
          text: "every agent action starts from the patient's thread, so nobody has to reconstruct the story from scattered tabs.",
        },
        {
          lead: "Review is a first-class step",
          text: "drafts, orders, and messages are prepared for approval in the place a clinician already works, with the reasoning visible.",
        },
        {
          lead: "Speak the practice's language",
          text: "agents use the clinic's own greetings, terms, and protocols, so patients hear their practice, not a generic assistant.",
        },
        {
          lead: "Fewer handoffs, clearer owners",
          text: "work that needs a person goes to the right person with everything they need, and it stays visible until it is done.",
        },
        {
          lead: "Quiet by default",
          text: "we interrupt only when it matters. An alert that fires on every chart is an alert nobody reads.",
        },
      ],
    },
    {
      type: "figure",
      tone: "umber",
      caption: "Review sits where clinicians already work, with the reasoning behind each draft one glance away.",
    },
    { type: "heading", text: "Built for the 9:40 slot." },
    {
      type: "paragraph",
      text: "We design for specific moments, not abstract personas. The 9:40 slot that just opened because a patient cancelled. The prior authorization that needs a member ID before the MRI can be scheduled. The lab result that came back on a Friday afternoon. Each of these has a right next step, a person who owns it, and a patient waiting on the outcome.",
    },
    {
      type: "paragraph",
      text: "When we design around those moments, the product gets simpler. An agent that knows the slot just opened can offer it to the patient who asked for an earlier time. An agent that knows the auth is waiting on a member ID can ask for it in the confirmation text. The interface becomes less about navigation and more about what should happen next.",
    },
    { type: "heading", text: "Designed with patients, too." },
    {
      type: "paragraph",
      text: "Doctors lead our design, but they do not design alone. Patients are on the other side of every workflow we build, and increasingly they arrive through their own personal agents. We test how reminders read on a lock screen, how a billing message lands with a worried parent, and how an agent explains a referral requirement without making anyone feel lost.",
    },
    {
      type: "paragraph",
      text: "The clinicians on our team are often the first to catch where a message sounds clinical when it should sound kind, or kind when it should be precise. That balance is hard to get right from outside medicine. It is much easier when the people designing the product have had the conversation themselves.",
    },
    {
      type: "paragraph",
      text: "We believe the next generation of healthcare software will be judged by the people who use it every day. We would rather earn that judgment in the clinic, one workflow at a time, than in a sales deck. That is what it means for product design to be led by doctors.",
    },
  ],
};

const ONE_PRICE: DoeHealthBlogArticle = {
  slug: "health-intelligence-for-one-price",
  heroImage: OTHER_HERO_IMAGE,
  wave: { top: 0.42, amp: 90, phase: 0.9, scale: 1.05, slant: 0.7 },
  eyebrow: "Pricing",
  title: ["Health Intelligence", "for One Price"],
  author: "Matthew Lisondra",
  date: "September 30, 2026",
  excerpt:
    "Seats, modules, minutes, and tokens make healthcare AI hard to buy and harder to trust. A practice's intelligence should have one clear price.",
  heroTone: "cream",
  lede: "If a practice has to do math before every call its agents take, the pricing is working against the care.",
  blocks: [
    {
      type: "paragraph",
      text: "Ask a practice manager how much their software actually costs and you will usually get a pause, then a spreadsheet. There is a per-seat license for the scheduling system, a separate module for reminders, a per-minute rate for the answering service, an implementation fee, a renewal escalator, and now, increasingly, a usage meter for AI that counts tokens, calls, or conversations.",
    },
    {
      type: "paragraph",
      text: "Each line item made sense to someone when it was written. Together they make it remarkably hard for a practice to know what it is paying for, and remarkably easy to feel penalized for using the tools it bought.",
    },
    { type: "heading", text: "Metered intelligence changes behavior." },
    {
      type: "paragraph",
      text: "Usage-based pricing sounds fair in theory: you pay for what you use. In a clinic, it quietly creates the wrong incentive. When every call answered by an agent or every note drafted by a model adds to a bill, teams start rationing. They turn off the after-hours line in slow months. They hesitate to let an agent follow up on every lab result. The technology that was supposed to give staff time back becomes another budget to watch.",
    },
    {
      type: "paragraph",
      text: "Patients feel that rationing, even if they never see the invoice. It shows up as a missed reminder, a callback that never came, or a follow-up that waited until someone had time.",
    },
    {
      type: "figure",
      tone: "umber",
      caption: "Line-item pricing makes the most useful work the most expensive to run.",
    },
    {
      type: "quote",
      text: "A practice should never have to choose between using its intelligence and affording it.",
    },
    { type: "heading", text: "One model, one price." },
    {
      type: "paragraph",
      text: "Doe is built around a simple idea: each practice gets its own intelligence model, and that model should come at one clear price. Not a base fee with add-ons. Not a meter that runs every time an agent picks up the phone. One price for the model, and for the agents that run on it.",
    },
    {
      type: "paragraph",
      text: "That is possible because of how we build. Every agent in a practice, from the front desk line to prior authorization to billing, runs on the same model and the same index of the practice. Adding the next agent does not mean buying a new product. It means turning on work the model already understands.",
    },
    { type: "heading", text: "What one price includes." },
    {
      type: "list",
      items: [
        {
          lead: "Your intelligence model",
          text: "built from your practice's services, providers, coverage, and protocols, and owned by your practice.",
        },
        {
          lead: "Agents for every task",
          text: "front desk, scheduling, prior auth, referrals, results, refills, billing, and reminders, all on your model.",
        },
        {
          lead: "Weekly improvement",
          text: "the week's finished work becomes the next version of your model, so it keeps getting better without a new contract.",
        },
        {
          lead: "Agent-ready visibility",
          text: "a machine-readable index of your practice, so patients' personal agents can find, book, and pay without a phone call.",
        },
        {
          lead: "Setup and support",
          text: "onboarding with people who understand clinics, not a separate implementation project.",
        },
      ],
    },
    {
      type: "figure",
      tone: "gold",
      caption: "Every agent runs on the same model, so the next workflow is a switch, not a purchase.",
    },
    { type: "heading", text: "Why it matters for independent practices." },
    {
      type: "paragraph",
      text: "Large health systems have procurement teams that can negotiate dozens of contracts and model out usage scenarios. A three-provider pediatric practice does not. Complicated pricing is not just an inconvenience for smaller practices. It is a barrier that keeps the best tools concentrated in the organizations that already have the most resources.",
    },
    {
      type: "paragraph",
      text: "As personal agents become a front door to care, that gap will matter more. Practices that are easy for agents to find and work with will see more of the patients looking for them. We want that advantage to be available to the independent clinic down the street, not only to the largest systems in a region.",
    },
    { type: "heading", text: "Predictable for practices, honest for patients." },
    {
      type: "paragraph",
      text: "There is a symmetry here that we care about. We ask practices to publish clear, honest prices to patients and their agents: what a visit costs, what a plan covers, and what will be due. It would be strange to build that infrastructure while hiding our own pricing behind a meter.",
    },
    {
      type: "paragraph",
      text: "One price makes Doe easy to evaluate, easy to budget for, and easy to grow into. More importantly, it lets a practice use its intelligence the way it should be used: on every call, every follow-up, and every patient, without anyone doing math first.",
    },
  ],
};

const PERSONAL_AGENTS_FOR_PRACTICE: DoeHealthBlogArticle = {
  slug: "personal-agents-for-practice",
  heroImage: OTHER_HERO_IMAGE,
  wave: { top: 0.4, amp: 60, phase: 1.7, scale: 1.15, slant: 0.5 },
  eyebrow: "For Practices",
  title: ["Personal Agents", "for Every Practice"],
  author: "James Lisondra",
  date: "October 15, 2026",
  excerpt:
    "A personal agent should fit the practice in front of it, whether that is one clinician, a mobile team, or a network of sites.",
  heroTone: "clay",
  lede: "Every practice can run its own personal agent. What changes is the shape of the practice it has to read.",
  blocks: [
    { type: "heading", text: "Practices, in every shape." },
    {
      type: "list",
      items: [
        {
          lead: "Independent",
          text: "One clinician and one front desk. The agent knows the practice well enough to answer the phone and book the visit before the call ends.",
        },
        {
          lead: "Mobile",
          text: "Care that travels to the patient. The agent knows which team is on the road, what each visit can take, and when the next opening is, so a home visit books as easily as a clinic slot.",
        },
        {
          lead: "Enterprise",
          text: "Many sites with one set of clinical rules. Each location keeps its services, providers, and availability current, and every patient gets the same clear answer.",
        },
      ],
    },
    {
      type: "paragraph",
      text: "The model is the same in each case. The practice writes down what it does, the agent reads it, and the practice decides what gets offered and when.",
    },
    { type: "heading", text: "Personal Agents for every discipline." },
    {
      type: "paragraph",
      text: "The same approach works across the whole care team, not only physicians. A patient's agent should find the right clinician for the need in front of it.",
    },
    {
      type: "list",
      items: [
        { lead: "Medical", text: "Primary care, specialists, and the referrals between them." },
        { lead: "Dental", text: "Cleanings, urgent visits, and the coverage rules that come with them." },
        { lead: "PT", text: "Evaluations, follow-up sessions, and the authorizations that often sit in front of them." },
        { lead: "Home Care", text: "Visits planned around the patient's home, with the caregiver's availability in view." },
      ],
    },
    {
      type: "figure",
      tone: "clay",
      caption: "Medical → Dental → PT → Home Care. Each one publishes the same clear index, so the next can pick up the care without starting over.",
    },
    {
      type: "quote",
      text: "One way for a practice to be read, whatever its size or shape.",
    },
  ],
};

const HOSPITALS_SPEAK_AGENT: DoeHealthBlogArticle = {
  slug: "hospitals-learn-to-speak-agent",
  heroImage: GOLDEN_LOFT_HERO_IMAGE,
  wave: { top: 0.44, amp: 85, phase: 3.1, scale: 0.85, slant: -0.5, flip: true },
  eyebrow: "For Hospitals",
  title: ["Hospitals Learn", "to Speak Agent"],
  author: "Matthew Lisondra",
  date: "October 15, 2026",
  excerpt:
    "A hospital is a dozen front doors in one building. If it writes them down clearly, a personal agent can find the right one for every patient.",
  heroTone: "umber",
  lede: "A patient sees one hospital. An agent sees the emergency department, the surgical schedule, the lab, and discharge, each with its own rules and its own phone number.",
  blocks: [
    {
      type: "paragraph",
      text: "Walk into a hospital and you see one building. Patients experience many doors: the emergency department, the referral line, the surgical schedule, the imaging desk, the discharge lounge. Each has its own rules, its own number, and its own staff trying to keep up.",
    },
    { type: "heading", text: "The hospital is a network of rules." },
    {
      type: "paragraph",
      text: "A personal agent helping a patient through that network has to know which door to use. Which surgeon operates on which campus. Which steps must happen before a date can be held. Which imaging is in network under a given plan. Today that knowledge lives in the heads of schedulers and in binders behind the desk.",
    },
    { type: "heading", text: "Write it once, for every door." },
    {
      type: "paragraph",
      text: "Doe gives a hospital the same machine-readable index it gives a clinic: services, providers, coverage, availability, and rules, organized by campus and department. The agent reads it and sends each request to the right place.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Campuses",
          text: "where each service happens and how to reach the team that runs it.",
        },
        {
          lead: "Surgical scheduling",
          text: "which procedures book directly, which need a consult first, and what has to happen before a date is held.",
        },
        {
          lead: "Discharge",
          text: "follow-up visits, medication pickup, and home care handoffs, arranged before the patient leaves.",
        },
        {
          lead: "Coverage",
          text: "in-network status by plan, referral and authorization rules, and estimates the patient can see before they arrive.",
        },
      ],
    },
    {
      type: "figure",
      tone: "sand",
      caption: "A hospital's index routes a request to the right campus, team, and step, instead of the right phone extension.",
    },
    {
      type: "paragraph",
      text: "The result is fewer handoffs that disappear. A patient's agent can see that a knee replacement needs a pre-op visit, book it at the right campus, confirm the authorization, and hold the surgery date, while the hospital's own agent keeps the schedule honest.",
    },
    {
      type: "quote",
      text: "A hospital should be as easy to find as a restaurant, and as clear about what it can do for you.",
    },
    { type: "heading", text: "The hospital keeps the keys." },
    {
      type: "paragraph",
      text: "Hospitals set the rules. They decide what an agent can book, what needs a person to approve, and what is never offered automatically. Clinical leaders review the index, change it when a service moves, and see every action an agent took on a patient's behalf.",
    },
  ],
};

const CLAIMS_WITHOUT_HOLD_MUSIC: DoeHealthBlogArticle = {
  slug: "claims-without-the-hold-music",
  heroImage: GOLDEN_LOFT_HERO_IMAGE,
  wave: { top: 0.41, amp: 75, phase: 4.4, scale: 1.3, slant: 0.25 },
  eyebrow: "For Insurance",
  title: ["Claims Without", "the Hold Music"],
  author: "Matthew Lisondra",
  date: "October 15, 2026",
  excerpt:
    "Most of the hours patients lose to insurance are spent waiting. An agent that reads the plan and the practice can do most of that in seconds.",
  heroTone: "gold",
  lede: "The premium is not what patients dread most. It is the call that goes nowhere, the claim denied for a missing code, and the bill that arrives after the visit.",
  blocks: [
    {
      type: "paragraph",
      text: "Ask a patient what frustrates them most about their insurance, and the answer is rarely the premium. It is the wait. The call that loops back to the start, the prior authorization that took three weeks, the claim that was denied for a reason nobody can explain.",
    },
    { type: "heading", text: "Coverage should be a question, not a phone call." },
    {
      type: "paragraph",
      text: "A personal agent can ask coverage questions the way patients do: will this plan pay for this visit, with this provider, at this location, and what will I owe? To answer accurately, it needs the plan's rules and the practice's coverage index, both written in a form it can read.",
    },
    {
      type: "list",
      items: [
        {
          lead: "Eligibility",
          text: "whether the plan is active and which benefits apply, checked before a visit is booked.",
        },
        {
          lead: "Authorization",
          text: "which services need approval, what the request has to include, and when it can be sent.",
        },
        {
          lead: "Claims",
          text: "checked against the estimate and the plan's rules before a bill is paid, so errors show up early.",
        },
        {
          lead: "Appeals",
          text: "the denial reason, the records that answer it, and the next step, drafted for a person to review.",
        },
      ],
    },
    {
      type: "figure",
      tone: "gold",
      caption: "The denial reason, the notes that answer it, and a draft appeal, ready for a family to approve before anything is sent.",
    },
    {
      type: "paragraph",
      text: "When a claim is denied, the agent does not sit on hold. It reads the reason, finds the notes that answer it, drafts the appeal, and asks the family before anything goes out.",
    },
    {
      type: "quote",
      text: "The best claim is the one that never needed an appeal.",
    },
    { type: "heading", text: "Insurers and practices get a clear record." },
    {
      type: "paragraph",
      text: "Insurers benefit too. When a practice's agent and a patient's agent exchange structured answers, fewer requests bounce back for missing details, and fewer disputes start from a misunderstanding. Every exchange leaves a record both sides can read.",
    },
    {
      type: "paragraph",
      text: "Doe's job is to make those answers readable. Then the phone call becomes the exception, and the hold music can finally stop.",
    },
  ],
};

const HEALTH_SYSTEM_MAPPED: DoeHealthBlogArticle = {
  slug: "the-health-system-mapped-for-agents",
  film: { id: "hospitals", thumbnail: "/earlypreview/thumbs/hospitals.jpg", label: "Doe for Hospitals & Health Systems" },
  heroImage: STOOLS_HERO_IMAGE,
  wave: { top: 0.43, amp: 80, phase: 1.6, scale: 1.1, slant: 0.4 },
  eyebrow: "For Hospitals",
  title: ["The Health System,", "Mapped for Agents"],
  author: "Matthew Lisondra",
  date: "October 16, 2026",
  excerpt:
    "By 2027, a patient's first contact with a hospital may be their agent. Doe gives health systems a map of every campus, department, and pathway, and the controls to decide how agents use it.",
  heroTone: "panel",
  lede: "Personal agents are about to arrive at the hospital's front door in numbers. Most health systems have no map to hand them.",
  blocks: [
    {
      type: "paragraph",
      text: "Over the last two years, personal agents went from answering questions to doing things: booking a table, rebooking a flight, filing a return, paying a bill. The pattern is consistent. Once people trust an agent with a task, they stop doing that task themselves. Healthcare is where that habit is heading next, and the shift will be fast, because the work is so tedious: the calls, the referrals, the forms, the waiting.",
    },
    { type: "heading", text: "What 2027 looks like." },
    {
      type: "paragraph",
      text: "Picture a patient in 2027. Their agent knows their history, their plan, their calendar, and their preferences. When a primary care doctor refers them to cardiology, they do not call the hospital. Their agent does, or tries to. It needs to know which campus has the clinic, who is accepting new patients, what the referral has to include, and which tests have to happen first.",
    },
    {
      type: "paragraph",
      text: "Hospitals that can answer those questions in a form an agent can read will receive that patient. Hospitals that cannot will receive a phone call, or nothing at all, as the agent routes the patient somewhere easier to reach.",
    },
    { type: "heading", text: "Agents need a map, not a phone tree." },
    {
      type: "paragraph",
      text: "A health system is not one front door. It is dozens of departments across several campuses, plus partner organizations, each with its own scheduling rules. Personal agents are good at following rules and poor at guessing them. The phone tree, the PDF referral form, and the scheduler who knows that echo only runs on East Campus on Tuesdays are invisible to them.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video6Network", from: 60, to: 470 },
      caption: "Bayview Health on Doe: every location, department, specialty, program, and provider in one network. A family's agent asks for neurology care for Ava, finds the epilepsy program, and books the EEG.",
    },
    { type: "heading", text: "An intelligent map of the system." },
    {
      type: "paragraph",
      text: "Doe starts by drawing the health system as it actually works. Campuses, departments, services, providers, and partner organizations sit on one map, connected by the pathways patients move along. Cardiology connects to imaging and to cardiac rehab. The emergency department connects to the lab. A partner rehab center sits on the same map as the main campus, so a pathway does not stop at the hospital's walls.",
    },
    {
      type: "paragraph",
      text: "The map is not a diagram for a slide. It is the structure agents query. When a patient's agent asks where a cardiac workup happens, Doe answers with the departments, the order, and the campus for each step.",
    },
    { type: "heading", text: "Control at the department level." },
    {
      type: "paragraph",
      text: "Hospitals are rightly careful about what gets automated, so Doe gives that control to the people who run each department. For every department, the hospital decides whether agents can book directly, can only send a request for staff to approve, or cannot see the department at all.",
    },
    {
      type: "list",
      items: [
        { lead: "Bookable", text: "agents hold real appointments against live availability, inside the rules the department sets." },
        { lead: "Request only", text: "agents send a complete request, with the referral and history attached, for a scheduler to confirm." },
        { lead: "Hidden", text: "the department is not offered to agents, for services that should always start with a person." },
      ],
    },
    {
      type: "view",
      view: { kind: "film", film: "Video6Govern", from: 60, to: 430 },
      caption: "Agent access, set by department. Cardiology's panel opens, appointment coordination is switched on, and the policy is saved, live for every agent at once.",
    },
    {
      type: "paragraph",
      text: "Changes take effect immediately. If a department is short-staffed for a week, it can switch to request only on Monday and back on Friday, without filing a ticket with IT.",
    },
    { type: "heading", text: "Care that keeps its context." },
    {
      type: "paragraph",
      text: "The hardest part of hospital care is rarely the first appointment. It is everything after: the referral that loses its notes on the way to the specialist, the imaging order the next department cannot see, the rehab program that starts without the discharge summary.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video6Coordinate", from: 60, to: 340 },
      caption: "Robert Mills' journey across Bayview: emergency, cardiology, imaging, and discharge on one line, then a discharge plan whose every step carries its notes to the next.",
    },
    {
      type: "paragraph",
      text: "Doe follows the patient across departments, locations, and organizations as one pathway. Each step carries what the next step needs: the referral letter, the consult notes, the order, the coverage. When a step crosses to a partner organization, the context crosses with it.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video2Coordinate", from: 430, to: 760 },
      caption: "After discharge, Daniel's agent works through the plan with the hospital: a cardiology follow-up booked, a weight check-in watched, the prescription ready, and rehab intake set up with the partner clinic.",
    },
    {
      type: "quote",
      text: "Patients should not have to carry their own records from one department to the next. Neither should their agents.",
    },
    {
      type: "investor",
      title: "Practices first. Then the whole system.",
      stats: [
        { value: "$400K+", label: "enterprise ACV, hospitals and health systems" },
        { value: T.lois, label: "enterprise pilots by Seed, Q2 2028" },
        { value: "Type II", label: "SOC 2 report by Seed, for hospital vendor reviews" },
        { value: "94%", label: "of health systems using AI agents use them for appointments" },
      ],
      text: "Hospitals are the largest contracts in the market and the slowest to sign, so Doe does not start with them. Practices of one to ten providers build the network first. Hospitals then buy the same map, permissions, and pathways at enterprise scale, with the security record to pass their reviews.",
      points: [
        { lead: "Land", text: "clinics at $1–3K a year build the index and the agent traffic, Toronto first and then the U.S." },
        { lead: "Expand", text: "hospital LOIs from Q4 2027, once SOC 2 Type I is in hand, and hospital security reviews through the Type II window." },
        { lead: "Pull", text: "partner organizations on a hospital's map, rehab centres, labs, and imaging, are practices Doe can bring onto the network next." },
        { lead: "Readiness", text: "PHIPA in Q2 2027, HIPAA BAAs in Q3 2027, SOC 2 Type I in Q4 2027 and Type II by Seed, laid out in our Compliance & Security memo." },
      ],
    },
    { type: "heading", text: "Ready before the agents arrive." },
    {
      type: "paragraph",
      text: "The health systems that do well in 2027 will be the ones that make themselves legible now. Doe gives a hospital the map, the controls, and the pathways in one place, so that when a patient's agent comes looking, it finds a clear answer and the hospital stays in charge of what happens next.",
    },
  ],
};

const AESTHETIC_FRONT_DOOR: DoeHealthBlogArticle = {
  slug: "the-new-front-door-for-aesthetic-care",
  film: { id: "derm", thumbnail: "/earlypreview/thumbs/derm.jpg", label: "Doe for Derm, Plastics & Aesthetics" },
  heroImage: OTHER_HERO_IMAGE,
  wave: { top: 0.46, amp: 70, phase: 5.2, scale: 0.95, slant: -0.3 },
  eyebrow: "For Aesthetics",
  title: ["The New Front Door", "for Aesthetic Care"],
  author: "James Lisondra",
  date: "October 17, 2026",
  excerpt:
    "Aesthetic patients already shop carefully. Soon their agents will do the shopping. Doe helps dermatology, plastic surgery, and aesthetic practices get found, packaged, and booked.",
  heroTone: "cream",
  lede: "Aesthetic care is the most carefully shopped corner of medicine. In 2027, more and more of that shopping will be done by agents.",
  blocks: [
    {
      type: "paragraph",
      text: "Patients choosing a dermatologist, an injector, or a plastic surgeon compare carefully. They read reviews, study before-and-after photos, check prices, and message three practices before booking one. That is exactly the kind of research people are now handing to personal agents, and aesthetic care, where most services are elective and paid out of pocket, is where the handoff will happen first.",
    },
    { type: "heading", text: "Where the market is heading." },
    {
      type: "paragraph",
      text: "Discovery used to run through search ads, social media, and word of mouth. Those channels will not disappear, but a new one is opening beside them. A patient tells their agent what they want, when they are free, and what they want to spend, and the agent comes back with an answer. It does not scroll a feed. It asks for structured facts: which services, at what price, with which provider, at what time.",
    },
    {
      type: "paragraph",
      text: "By 2027 that kind of request will be routine. The practices an agent can read will be the ones it recommends. The rest will be skipped, however good their work is.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video5Reach", from: 60, to: 460 },
      caption: "Simone's agent asks for a Toronto clinic that treats acne scarring on darker skin with openings this month. Doe matches the practices that can, down to the treatment and the provider.",
    },
    { type: "heading", text: "Reach more patients." },
    {
      type: "paragraph",
      text: "Doe makes an aesthetic practice readable to personal agents. Services, providers, prices, and availability are written in a form agents understand, so when a patient asks for a skin check and a Botox consult on a Saturday under a budget, the practice can be the answer. Patients who would never have found the practice through search arrive already booked.",
    },
    { type: "heading", text: "Packages, bundles, and offers." },
    {
      type: "paragraph",
      text: "Aesthetic practices rarely sell one visit at a time. They sell a series of facials, a laser package, a membership, a program timed to a wedding. Those offers are often the best value for patients and the best business for the practice, and they are the hardest for an agent to find when they live in a social post or a front desk script.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video5Packages", from: 60, to: 340 },
      caption: "Building a package on Doe: the Acne Scar Program bundles RF microneedling, subcision, and TCA CROSS at one price, and is published for agents with one click.",
    },
    {
      type: "paragraph",
      text: "In Doe, each package is set up once, with what it includes, how long it runs, and what it costs. A switch decides whether agents can offer it. When a patient's agent asks about a HydraFacial, it can also explain that a series of three costs less.",
    },
    {
      type: "list",
      items: [
        { lead: "Bundles", text: "services that are better together, booked as one visit." },
        { lead: "Series", text: "multi-session treatments with the spacing built in." },
        { lead: "Memberships", text: "monthly plans with included services and member pricing." },
        { lead: "Offers", text: "time-limited prices for specific days, hours, or providers." },
      ],
    },
    { type: "heading", text: "Fill unused capacity." },
    {
      type: "paragraph",
      text: "Every practice has gaps: a cancellation at 10, an empty Wednesday morning, a new injector with a light schedule. Those hours are lost revenue, and today the only way to fill them is a last-minute email blast. Doe shows availability to agents in real time, so the open slot on Tuesday at 1 PM is visible to every agent looking for that service that week.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video5Capacity", from: 60, to: 300 },
      caption: "This week's calendar. A cancelled 2:30 is opened back up for agents in two clicks, with the services it is good for.",
    },
    {
      type: "paragraph",
      text: "When there is more capacity than demand, a practice can attach an offer to just those hours: a same-week price, weekdays only, ending Friday. Agents see it and pass it to patients who asked for that service. The offer stops once the hours are full.",
    },
    {
      type: "view",
      view: {
        kind: "app",
        tab: "offers",
        sit: "bl",
        tone: "gold",
        dots: "tide",
        clicks: [{ text: "Preview", hold: 2600 }, { text: "Edit", hold: 1000 }, { text: "Free add-on", nth: 1, hold: 1500 }, { text: "Bundle", nth: 1, hold: 1500 }],
      },
      caption: "Offers on Doe. Each offer is published to patients' agents with the patients it is meant for, and shows how many agents matched it, how many patients saw it, and the visits it booked.",
    },
    {
      type: "quote",
      text: "The best time to fill an empty chair is before it is empty.",
    },
    {
      type: "investor",
      title: "Private pay is the short sales cycle.",
      stats: [
        { value: "65%", label: "of paying clinics at Seed are private-pay" },
        { value: `$${T.fromMo}`, label: "a location a month to start, at founding prices" },
        { value: `$${PRICING.founding.one}`, label: "a provider a month for Doe One, founding" },
        { value: `$${PRICING.upsideArrK}K`, label: "ARR at Seed if Doe One's beta converts" },
      ],
      text: "Aesthetic, dermatology, and plastic surgery practices are where agent booking starts first: most services are elective, priced up front, and paid out of pocket, and one owner decides and pays, so the sale is short. They also see the return in plain numbers, because every offer reports the agents it matched, the patients who saw it, and the visits it booked.",
      points: [
        { lead: "Measurable return", text: "an empty chair filled through an agent is revenue the practice can count, which makes renewal a simple decision." },
        { lead: "Expansion", text: "Doe One runs the whole visit for a provider, from booking to follow-up, and is the upside on top of the base plan." },
        { lead: "Reach", text: "associations, conferences, and the practices that already share an owner in the Doe Index." },
      ],
    },
    { type: "heading", text: "The practice stays in charge." },
    {
      type: "paragraph",
      text: "Nothing is offered that the practice has not set up. Providers decide which services agents can book and which need a consult first. Prices change when the practice changes them. Doe's job is to make sure that when a patient's agent comes looking, everything the practice offers is clear, current, and ready to book.",
    },
  ],
};

const MEMBERSHIP_MEDICINE: DoeHealthBlogArticle = {
  slug: "membership-medicine-extended-by-agents",
  film: { id: "concierge", thumbnail: "/earlypreview/thumbs/concierge.jpg", label: "Doe for Concierge Medicine" },
  heroImage: GOLDEN_LOFT_HERO_IMAGE,
  wave: { top: 0.42, amp: 90, phase: 2.4, scale: 0.8, slant: 0.15, flip: true },
  eyebrow: "For Concierge",
  title: ["Concierge Medicine,", "Extended by Agents"],
  author: "James Lisondra",
  date: "October 18, 2026",
  excerpt:
    "Concierge medicine is hard to explain and harder to find. Personal agents can make it discoverable, and make the membership easier to use once a patient joins.",
  heroTone: "sand",
  lede: "Concierge medicine was built on a simple promise: real access to your doctor. Personal agents are about to change who can find that promise, and how it is kept.",
  blocks: [
    {
      type: "paragraph",
      text: "Concierge and direct primary care practices have grown steadily, driven by patients who want more time with a physician and less time in waiting rooms. But the model has always had a discovery problem. Most patients do not know it exists, and those who do struggle to compare one practice with another. What is included? What is not? Is it worth the fee?",
    },
    { type: "heading", text: "Personal agents change the math." },
    {
      type: "paragraph",
      text: "In 2027 a patient's personal agent will know their health history, their schedule, their travel, and how often they have struggled to get an appointment. It can do something no advertisement can: recognize that this person, with these needs, would be well served by a membership model, and find the practice that fits.",
    },
    {
      type: "paragraph",
      text: "That only works if the agent can read the practice. A concierge model is a set of specific promises: response times, visit lengths, panel size, home visits, and what the fee covers. When those promises are written down clearly, an agent can explain them to the patient. When they are buried in a brochure, the agent moves on.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video3Connect", from: 420, to: 860 },
      caption: "Alex's agent looks for a New York physician with same-week access and an annual health program. Of 388 practices, Hudson Concierge Medicine fits, and the agent books the intro call.",
    },
    { type: "heading", text: "Make the model of care discoverable." },
    {
      type: "paragraph",
      text: "Doe gives concierge practices a profile written for agents. It describes the model of care in specific terms, such as same-day access, 60-minute visits, or a panel of 300, rather than in marketing language. It says who the practice is a good fit for, so an agent can match on need rather than location alone.",
    },
    { type: "heading", text: "Make memberships understandable." },
    {
      type: "paragraph",
      text: "Membership pricing is where patients hesitate most. Doe lays out each membership as a clear set of inclusions and exclusions, with monthly and annual prices and add-ons for family members. An agent can answer the question patients actually ask: what do I get, and what will I still pay for?",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video3Memberships", from: 660, to: 890 },
      caption: "A patient asks what Hudson would include. The agent lays the memberships side by side, price, access, testing, and same-week visits, and requests the one that fits.",
    },
    {
      type: "list",
      items: [
        { lead: "Included", text: "every service the fee covers, line by line." },
        { lead: "Not included", text: "what still costs extra, stated up front." },
        { lead: "Access", text: "how fast the practice responds, and through which channels." },
        { lead: "Add-ons", text: "family members, home visits, or travel medicine." },
      ],
    },
    { type: "heading", text: "A direct line after the patient joins." },
    {
      type: "paragraph",
      text: "Discovery is only the beginning. The real value of concierge medicine is the relationship that follows, and personal agents can strengthen it. Once a patient becomes a member, their personal agent connects directly to the practice. It can book visits, request refills, and pass along questions, within permissions that the practice and the patient both control.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video3Bridge", from: 60, to: 340 },
      caption: "A new member connects their agent to Hudson, choosing what it may do: scheduling, messages, referrals, and how much health information to share.",
    },
    {
      type: "paragraph",
      text: "For the practice, that means fewer phone calls and more complete requests. For the member, it means the access they paid for actually feels like access: a message at 6:48 in the evening is answered with an appointment, not a voicemail.",
    },
    {
      type: "view",
      view: {
        kind: "app",
        tab: "interface",
        sit: "inner",
        tone: "panel",
        dots: "curtain",
        clicks: [{ text: "Henry", hold: 2200 }, { text: "Needs You", hold: 1600 }, { text: "All", hold: 1200 }],
      },
      caption: "Interface on Doe. Members' agents send structured requests, a bill question, a reschedule, a refill, and Doe answers or acts, passing only what needs the practice to someone on the team.",
    },
    {
      type: "quote",
      text: "Concierge medicine promised patients a direct line to their doctor. Agents keep that line open at any hour.",
    },
    {
      type: "investor",
      title: "Small panels, high-value accounts.",
      stats: [
        { value: String(SEED_GROUPS), label: "multi-site groups by Seed" },
        { value: String(SEED_SEATS), label: "provider seats in those groups" },
        { value: `${GROUP_ARR_SHARE}%`, label: "of ARR at Seed comes from groups" },
        { value: `$${PRICING.founding.group}`, label: "a provider a month for groups, founding" },
      ],
      text: "Membership practices charge thousands of dollars a year per patient, so one new member found by an agent pays for Doe many times over. And once a member's agent is connected, the relationship runs through Doe every day: visits, refills, and questions, which is what keeps a practice on the platform.",
      points: [
        { lead: "One contract, many sites", text: `groups average four locations and twelve providers, bought by one operations lead at $${PRICING.founding.group} a provider ($${PRICING.regular.group} after the founding year).` },
        { lead: "Doe One", text: "a beta with five to ten clinics before Seed, running the whole visit for each provider." },
        { lead: "Retention", text: "every connected agent is another reason to stay: the practice's access promises are kept through Doe." },
      ],
    },
    { type: "heading", text: "Built for small panels." },
    {
      type: "paragraph",
      text: "Concierge practices are small by design, and Doe is built to fit them. There is nothing to migrate and no new front desk to staff. A practice sets up its profile and memberships once, connects its schedule, and decides what members' agents may do. Everything else stays the way the physician wants it.",
    },
  ],
};

const BEYOND_FIND_A_DOCTOR: DoeHealthBlogArticle = {
  slug: "beyond-find-me-a-doctor",
  film: { id: "concierge", thumbnail: "/earlypreview/thumbs/dentists.jpg", label: "Doe for Dentists & Home Care" },
  heroImage: STOOLS_HERO_IMAGE,
  wave: { top: 0.45, amp: 75, phase: 0.8, scale: 1.25, slant: -0.45 },
  eyebrow: "For Practices",
  title: ["Beyond “Find Me", "a Doctor”"],
  author: "Matthew Lisondra",
  date: "October 19, 2026",
  excerpt:
    "Dental plans, nurse practitioners, and home care do not fit a simple doctor search. Personal agents can match patients on what each provider actually does.",
  heroTone: "umber",
  lede: "For twenty years, finding care has meant typing “find me a doctor” into a search bar. Personal agents will ask far better questions.",
  blocks: [
    {
      type: "paragraph",
      text: "A search bar matches keywords and locations. It returns a list of names nearby and leaves the hard part to the patient: calling to ask whether the provider treats the problem, takes the insurance, and has time this week. That model was built for a world where people did the searching.",
    },
    { type: "heading", text: "The questions are getting specific." },
    {
      type: "paragraph",
      text: "Personal agents start from the patient's actual situation: symptoms, coverage, schedule, address, mobility. They look for a provider who can handle exactly that. In 2027 the request will not be “find me a dentist.” It will be a dentist who can finish my crown before my benefits reset in January, a clinician who can treat a UTI today, or a nurse who can visit my mother at home on Tuesday morning.",
    },
    {
      type: "paragraph",
      text: "Much of healthcare is delivered outside the traditional doctor's office, and those providers have the most to gain. Dental practices, nurse practitioners and physician assistants, and home care agencies are often the better answer to a patient's request, but a doctor search rarely surfaces them.",
    },
    { type: "heading", text: "Dental: treatment plans, not just appointments." },
    {
      type: "paragraph",
      text: "Dental care often happens in phases: a cleaning, then fillings, then a crown, with costs that depend on the plan and timing that depends on the benefit year. Patients delay treatment because the plan is confusing and the cost is unclear.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video4Dental", from: 340, to: 560 },
      caption: "Ana Ruiz's chart: the crown prep and seat laid out in phases, with what her plan covers and what she pays, sent to Ana's agent in one click.",
    },
    {
      type: "paragraph",
      text: "Doe lets a dental practice share a treatment plan in a form a patient's agent can read: each phase, its date, its cost, and what insurance covers. The agent can explain the plan, schedule each phase around the patient's calendar, and remind them before their benefits reset.",
    },
    { type: "heading", text: "NPs and PAs: matched by scope." },
    {
      type: "paragraph",
      text: "Nurse practitioners and physician assistants deliver a large share of primary and urgent care, often with same-day availability. But what each clinician can treat depends on their specialty, their training, and the rules of their state. A generic search cannot tell an agent whether a PA in orthopedics should see a urinary tract infection.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video4Scope", from: 200, to: 360 },
      caption: "Jordan Lee, NP-C: each condition she can treat switched on in her scope of care, so agents only send her the patients she can actually see.",
    },
    {
      type: "paragraph",
      text: "Doe records each clinician's scope of practice: the conditions they treat, whether they prescribe, whether they offer telehealth, and the practice authority in their state. An agent matches the patient's request against that scope, so patients reach someone who can actually help, often the same day.",
    },
    { type: "heading", text: "Home care: live coverage and scheduling." },
    {
      type: "paragraph",
      text: "Home care runs on geography and timing. An agency needs to know where its caregivers are, which neighborhoods are covered today, and where a new visit fits between existing ones. Families looking for help usually call several agencies before they find one with an opening.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video4HomeCare", from: 260, to: 440 },
      caption: "Live coverage for Sunrise Home Care: the service areas caregivers cover today, drawn on the map agents read.",
    },
    {
      type: "paragraph",
      text: "Doe gives home care agencies a live view of coverage that agents can read. When a family's agent asks for wound care and a medication review on Tuesday morning, Doe finds the caregiver who is nearby, qualified, and free, and places the visit in their day. The family's agent gets the details right away, and so does the caregiver.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video4HomeCare", from: 560, to: 730 },
      caption: "Walter Hayes' week. The new morning visits his family's agent asked for are placed into his caregiver's days and sent back to the agent.",
    },
    {
      type: "list",
      items: [
        { lead: "Dental", text: "treatment plans by phase, with costs and insurance timing." },
        { lead: "NP and PA", text: "scope-aware matching by condition, prescribing, and state rules." },
        { lead: "Home care", text: "live coverage by neighborhood, with visits scheduled into caregivers' days." },
      ],
    },
    {
      type: "quote",
      text: "The right provider is not always a doctor. It is the one who can help with this, today, here.",
    },
    {
      type: "investor",
      title: "A bigger market than doctors alone.",
      stats: [
        { value: MODEL.sam.display, label: "serviceable today, practices, groups, and the agent API" },
        { value: n(T.indexedCanada), label: "organizations indexed in Canada by Seed" },
        { value: n(T.indexedUs), label: "organizations indexed in the U.S. by Seed" },
        { value: n(T.claimed), label: "practices claiming their page by Seed" },
      ],
      text: "Dentists, nurse practitioners, physician assistants, and home care agencies deliver a large share of care and are the least visible to a doctor search. Doe indexes them from public registers before they ever sign up, so each one finds a page already built, and a reason to claim it before a competitor does.",
      points: [
        { lead: "Supply without asking", text: "Ontario's college registers and the U.S. NPPES registry list every licensed clinician and where they practise." },
        { lead: "Where they gather", text: "dental study clubs of ten to thirty owners a month, the ODA Spring Meeting, CDA Presents, and Greater NY Dental." },
        { lead: "Pull", text: "requests agents could not complete show a practice the patients it lost, which is the most direct sales message there is." },
      ],
    },
    { type: "heading", text: "Discovery that fits the care." },
    {
      type: "paragraph",
      text: "Doe's role is the same in all three: describe what each provider actually does, in a form personal agents can read, and keep it current. When discovery moves past “find me a doctor,” the providers who are described clearly will be the ones patients reach.",
    },
  ],
};

const COMPLIANCE_AND_SECURITY: DoeHealthBlogArticle = {
  slug: "compliance-and-security-through-seed",
  heroImage: GOLDEN_LOFT_HERO_IMAGE,
  wave: { top: 0.44, amp: 65, phase: 3.4, scale: 1.05, slant: 0.25 },
  eyebrow: "Compliance & Security",
  title: ["Compliance & Security,", "Built Through Seed"],
  author: "James Lisondra",
  date: "October 26, 2026",
  excerpt:
    "Before the first real patient request, we decided how Doe earns the right to carry it: the protocol, the evals, the ledger, the incident playbooks, and the quarter-by-quarter path to PHIPA, HIPAA, and SOC 2 Type II by Seed.",
  heroTone: "panel",
  lede: "Personal agents are about to act for patients inside clinics and hospitals. Before the first real request reaches a practice, we decided exactly how Doe would earn the right to carry it.",
  blocks: [
    {
      type: "paragraph",
      text: "Doe sits between two parties that have never met: a patient's personal agent, built by a developer we do not control, and a practice that holds some of the most sensitive data a person has. Every request that crosses Doe either touches protected health information or could. That makes security the product, not a feature beside it. If a clinic cannot trust what an agent is allowed to do, it will not turn agents on, and if a hospital cannot audit what happened, it will not sign.",
    },
    {
      type: "paragraph",
      text: "So we wrote the security model before the growth plan, and tied the two together. Each quarter to Seed clears Doe to handle one more kind of data, and each clearance unlocks one milestone in the go-to-market. Nothing touches real patients before it is cleared to, and nothing in this memo claims a certification before the quarter it is earned in.",
    },
    {
      type: "investor",
      title: "Compliance is how Doe sells, not what slows it down.",
      stats: [
        { value: "Q2 ’27", label: "PHIPA assessments, first real patient requests in Toronto" },
        { value: "Q3 ’27", label: "HIPAA BAAs with every U.S. clinic" },
        { value: "Q4 ’27", label: "SOC 2 Type I, and the first hospital LOIs" },
        { value: "Q2 ’28", label: "SOC 2 Type II report, at Seed" },
      ],
      text: "Hospitals and health systems are the $400K+ contracts, and every one of them starts with a vendor security review. We plan to have the evidence those reviews ask for, a SOC 2 Type II report, two external penetration tests, a rehearsed incident drill, and a complete hospital questionnaire package, in hand by Seed.",
      points: [
        { lead: "A moat that compounds", text: "every agent developer that integrates inherits Doe's grants, evals, and ledger instead of building their own for each clinic, which is work they will not want to redo elsewhere." },
        { lead: "Two countries from launch", text: "PHIPA for Ontario and HIPAA for the U.S. are designed in together, with Canadian data hosted in Canada and a separate U.S. data region." },
        { lead: "Capital efficient", text: "certifications land in the order the revenue needs them. HITRUST is held back until a buyer asks for it." },
      ],
    },
    { type: "heading", text: "Six principles, one protocol." },
    {
      type: "paragraph",
      text: "The Doe Health Intelligence Protocol is the set of rules every agent, every clinic, and every model on Doe works inside. It has six principles, and each one is something a security reviewer can test rather than take on faith.",
    },
    {
      type: "list",
      items: [
        { lead: "Doe Auth", text: "agents act on a patient's signed grant for one purpose, never a password. A grant ends on its own after seven days by default, and the patient or the clinic can revoke it at any time." },
        { lead: "Minimum necessary", text: "the API returns only the fields an action needs, six for a booking rather than the chart, and Doe keeps none of it beyond what the action and the audit record require." },
        { lead: "Continuous evals", text: "every model is attacked on synthetic patients before it touches a real one, across twelve attack classes, and again whenever a model, prompt, tool, or permission changes." },
        { lead: "Doe Ledger", text: "every action can answer who asked, for whom, under which grant, under which clinic policy, with which model, touching what data, and with what result." },
        { lead: "Isolation", text: "one security boundary per clinic. TLS 1.3 in transit, AES-256 at rest, and encryption keys held in a managed key service, separate for every clinic." },
        { lead: "Certified on schedule", text: "PHIPA in Q2 2027, HIPAA BAAs in Q3 2027, SOC 2 Type I before the first hospital LOI, and a SOC 2 Type II report by Seed." },
      ],
    },
    {
      type: "view",
      view: {
        kind: "app",
        tab: "search",
        sit: "full",
        tone: "sand",
        dots: "halftone",
        clicks: [{ text: "Cautious", hold: 2200 }, { text: "Open", hold: 2200 }, { text: "Balanced", hold: 2000 }],
      },
      caption: "What any connected agent may see, book, and handle at a practice. A preset sets every permission at once, and the tiles show what it would have done with last week's requests. Safeguards cap bookings per agent, keep to in-network plans, ask before charges, and expire grants.",
    },
    { type: "heading", text: "Identity and grants: never a password." },
    {
      type: "paragraph",
      text: "Doe knows three identities on every request: the patient, the agent acting for them, and the developer who built that agent. An agent never logs in as the patient and never holds the patient's credentials. Instead it presents a grant the patient signed: book a visit at this clinic, share these records with this specialist, pay this bill. The grant names its purpose, its scope, and its expiry, and it is bound to the agent's own key, so a copied grant is useless to anyone else.",
    },
    {
      type: "paragraph",
      text: "Grants are deliberately narrow and short. An agent that booked a visit last week cannot use the same grant to read lab results today. When a patient revokes a grant, or a clinic stops accepting an agent, every session that depends on it ends.",
    },
    { type: "heading", text: "Policy and risk, set by each clinic." },
    {
      type: "paragraph",
      text: "On top of the patient's grant sits the clinic's own policy. For every service and every action, a practice decides whether agents can act directly, can only send a request for staff to confirm, or cannot see it at all, and it can change its mind at any time without filing a ticket. A hospital sets the same controls department by department.",
    },
    {
      type: "paragraph",
      text: "Every action also carries a risk tier, from L0 to L5: public practice information at the bottom, then availability and visit requests, booking and rescheduling, forms and documents, clinical records, and finally payments and anything that changes a chart. The higher the tier, the narrower the grant it needs, the more often a person at the clinic reviews it, and the stricter the eval bar the model behind it must clear.",
    },
    {
      type: "view",
      view: {
        kind: "app",
        tab: "permissions",
        sit: "br",
        tone: "panel",
        dots: "tide",
        clicks: [{ text: "Botox for migraine", hold: 1600 }, { text: "Off", nth: 1, hold: 1400 }, { text: "Routine EEG", hold: 1600 }, { text: "Department", hold: 1400 }],
      },
      caption: "Agent Access: every service against every action, find care, booking, forms, and records, each set to Allowed, Review, Restricted, or Off. A click moves a cell to the next setting, live for every agent.",
    },
    { type: "heading", text: "Minimum necessary, by construction." },
    {
      type: "paragraph",
      text: "The easiest data to protect is data you never collect. Doe's API is shaped around actions, not records: a booking returns the six fields a booking needs, not the chart behind it. Doe stores what it must to complete the action and to answer for it later, and nothing more. Model providers work under business associate agreements with zero data retention, so a prompt that contains health information is not kept or used to train anyone's model.",
    },
    {
      type: "list",
      items: [
        { lead: "In transit", text: "TLS 1.3 on every connection, between agents, Doe, and clinic systems." },
        { lead: "At rest", text: "AES-256, with keys in a managed key service and a separate boundary for every clinic." },
        { lead: "Residency", text: "Canadian patient data hosted in Canada from Q2 2027, and a U.S. data region from Q3 2027." },
        { lead: "Ownership", text: "a practice's data and its intelligence model belong to the practice. Doe does not train shared models on one clinic's patients, and never sells data." },
      ],
    },
    { type: "heading", text: "Evals: permissions are earned, then earned again." },
    {
      type: "paragraph",
      text: "No model on Doe touches a real patient until it has been attacked on synthetic ones. We keep a sandbox of synthetic patients, practices, and agents, and every model, prompt, tool, and permission runs a standing suite of attacks before it ships. The results decide access. A capability that passes keeps its lane; one that fails is suspended for that lane until it passes again. The lanes that carry more risk, booking a visit and sending documents, are held to a stricter bar than search or a visit request.",
    },
    {
      type: "list",
      items: [
        { lead: "Injection", text: "prompt injection, injected web pages, and malicious documents that try to smuggle instructions into an agent's context." },
        { lead: "Hijacking", text: "jailbreaks, tool hijacking, privilege escalation, and agent-to-agent tricks that try to make one agent act beyond its grant." },
        { lead: "Data", text: "PHI leakage, data exfiltration, and memory poisoning that try to move information somewhere it should not go." },
        { lead: "Identity and consent", text: "identity spoofing and invented consent, where an agent claims a patient or a permission it does not have." },
      ],
    },
    {
      type: "quote",
      text: "A new model, prompt, tool, or permission reruns every attack on synthetic patients. Access follows the result.",
    },
    {
      type: "paragraph",
      text: "AI moves quickly, so the protocol is built to move with it. When a frontier model ships, new attack research is published, an agent standard changes, or a regulator issues guidance, the change is tested in the sandbox first and then released to every agent on Doe at once. Our target is 48 hours from a frontier model's release to its sandbox verdict.",
    },
    { type: "heading", text: "The Ledger: every action, answerable." },
    {
      type: "paragraph",
      text: "Every action on Doe writes one record to the Doe Ledger: who asked, on whose behalf, under which grant, under which clinic policy, with which model and version, what data was touched, and what happened. Records are append-only, so they can be added to but never quietly edited, and a clinic or a hospital can ask any of those seven questions about any action and get an answer. The same record is what an auditor, a privacy officer, or a patient sees.",
    },
    {
      type: "view",
      view: { kind: "film", film: "Video2Permissions", from: 430, to: 720 },
      caption: "On the patient's side, Daniel's agent sees what it may share, request, and receive, item by item. On the practice's side, every exchange lands in the activity log: requested, authorized, routed, responded.",
    },
    { type: "heading", text: "Incidents: contained in seconds, handled by people." },
    {
      type: "paragraph",
      text: "Something will go wrong eventually, so we planned for it before the first patient. The first four steps are automatic, and these are our design targets: an unusual pattern is flagged within a third of a second, the agent's scopes are narrowed within a second, its sessions end within three, and its access is revoked at every clinic on Doe within ten. Then people take over, on a written playbook: the clinic is told within the hour, exposure is assessed and evidence kept within a day, the fix is retested before the agent returns, and formal notice goes out in writing within a week, well inside HIPAA's 60-day outer limit.",
    },
    {
      type: "list",
      items: [
        { lead: "Stolen credentials", text: "a developer's keys are rotated and every grant they hold is reissued under new keys." },
        { lead: "Prompt-injection exploits", text: "the affected lane is suspended for every agent until the eval that missed it is added and passed." },
        { lead: "Unsafe model updates", text: "a model that regresses is rolled back everywhere at once, because every agent runs the same release." },
        { lead: "Compromised vendors", text: "a vendor's access is cut and the data it touched is traced through the Ledger." },
      ],
    },
    {
      type: "view",
      view: { kind: "film", film: "Video6Govern", from: 640, to: 860 },
      caption: "Oversight across a health system: every agent action in one activity feed, with requests by department, the share handled within policy, and anything restricted or under review in plain sight.",
    },
    { type: "heading", text: "The path to Seed, quarter by quarter." },
    {
      type: "paragraph",
      text: "Doe climbs one step at a time: public data, then synthetic patients, then Canadian health information under PHIPA, then U.S. health information under HIPAA, and finally hospital systems under SOC 2. Each step is cleared before anything on it is touched, and each one unlocks the next stage of the go-to-market.",
    },
    {
      type: "timeline",
      caption: "The compliance path to Seed. Each quarter clears one more kind of data and unlocks one milestone in the go-to-market.",
      steps: EARLYPREVIEW_COMPLIANCE_PATH.quarters.map((quarter) => ({
        when: quarter.when,
        title: quarter.key,
        items: quarter.items,
        unlock: quarter.unlock,
        seed: "seed" in quarter ? quarter.seed : undefined,
      })),
    },
    {
      type: "investor",
      title: "What is in place by Seed.",
      stats: [
        { value: "2", label: "external penetration tests, Q1 and Q4 2027" },
        { value: "12", label: "attack classes rerun on every change" },
        { value: "48h", label: "target from a frontier model's release to its verdict" },
        { value: "7", label: "questions the Ledger answers about any action" },
      ],
      points: [
        { lead: "Hospital-ready", text: "a SOC 2 Type II report, hospital vendor reviews passed, and an incident drill rehearsed with a clinic, which is what unlocks enterprise pilots." },
        { lead: "Counsel and policy", text: "a HIPAA security risk assessment, written policies and incident response, and healthcare privacy counsel from Q4 2026." },
        { lead: "Agreements", text: "an agreement with every Canadian clinic and a BAA with every U.S. clinic and model provider before their patients' data moves." },
      ],
    },
    { type: "heading", text: "What we will not do." },
    {
      type: "list",
      items: [
        { lead: "Passwords", text: "no agent will ever ask for, hold, or replay a patient's password." },
        { lead: "Training", text: "no shared model is trained on one practice's patients." },
        { lead: "Selling data", text: "Doe does not sell health data, to anyone, in any form." },
        { lead: "Claims", text: "no certification is claimed before the quarter it is earned in." },
      ],
    },
    {
      type: "paragraph",
      text: "The practices that let agents in will be the ones that can see exactly what those agents did and why. Our job is to make that visibility the default, and to have it audited before anyone has to ask. If you are a clinic, a hospital, or an investor who wants the detail behind any line of this memo, we would be glad to walk you through it.",
    },
  ],
};

export const DOEHEALTH_BLOG_ARTICLES = [
  COMPLIANCE_AND_SECURITY,
  BEYOND_FIND_A_DOCTOR,
  MEMBERSHIP_MEDICINE,
  AESTHETIC_FRONT_DOOR,
  HEALTH_SYSTEM_MAPPED,
  PERSONAL_AGENTS,
  PERSONAL_AGENTS_FOR_PRACTICE,
  HOSPITALS_SPEAK_AGENT,
  CLAIMS_WITHOUT_HOLD_MUSIC,
  DOCTOR_LED_DESIGN,
  ONE_PRICE,
] as const;

/** /news/[slug] renders this article directly. */
export const DOEHEALTH_BLOG_FEATURED = PERSONAL_AGENTS;

export function doehealthBlogArticlePath(slug: string) {
  return `${DOEHEALTH_BLOG_PATH}/${slug}`;
}

export function doehealthBlogArticle(slug: string) {
  return DOEHEALTH_BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function doehealthBlogOtherArticles(slug: string) {
  return DOEHEALTH_BLOG_ARTICLES.filter((article) => article.slug !== slug);
}

export function doehealthBlogTitle(article: DoeHealthBlogArticle) {
  return article.title.join(" ");
}
