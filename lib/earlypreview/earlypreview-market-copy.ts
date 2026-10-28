/**
 * /earlypreview market section: the copy, the reported signals and Doe's market model, in one place so the numbers
 * can be changed without touching the layout. Every reported figure carries its source link. The market size,
 * revenue model and expansion figures are Doe's own estimates; TAM matches the $28B on /about.
 */

export type EarlyPreviewMarketSource = {
  readonly label: string;
  readonly href?: string;
};

export const EARLYPREVIEW_MARKET_SOURCES = {
  marketwatch: {
    label: "MarketWatch",
    href: "https://www.marketwatch.com/livecoverage/meta-earnings-stock-results-muse-q3/card/muse-users-are-hooked-on-online-shopping-NApJZdwp7wMDpagjjnyY",
  },
  arkose: {
    label: "Arkose Labs, Q3 2026",
    href: "https://www.arkoselabs.com/agentic-ai-trust-report-q3-2026",
  },
  thinknow: {
    label: "ThinkNow, n = 1,548",
    href: "https://thinknow.com/blog/the-new-front-door-to-healthcare-how-consumers-are-using-ai/",
  },
  hyro: {
    label: "Hyro 2026",
    href: "https://www.hyro.ai/resources/guides-reports/2026-ai-agent-benchmark-report/",
  },
  model: { label: "Doe market model, 2026 (estimates)" },
  blsClinics: {
    label: "BLS QCEW 621",
    href: "https://www.bls.gov/iag/tgs/iag621.htm",
  },
  blsCare: {
    label: "BLS QCEW 623",
    href: "https://www.bls.gov/iag/tgs/iag623.htm",
  },
  blsHospitals: {
    label: "BLS QCEW 622",
    href: "https://www.bls.gov/iag/tgs/iag622.htm",
  },
  isedClinics: {
    label: "StatCan 621",
    href: "https://ised-isde.canada.ca/app/ixb/cis/businesses-entreprises/621",
  },
  isedCare: {
    label: "StatCan 623",
    href: "https://ised-isde.canada.ca/app/ixb/cis/summary-sommaire/623",
  },
  isedHospitals: {
    label: "StatCan 622",
    href: "https://ised-isde.canada.ca/app/ixb/cis/summary-sommaire/622",
  },
  cms: {
    label: "CMS NHE 2024",
    href: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/historical",
  },
  cihi: {
    label: "CIHI 2025",
    href: "https://www.cihi.ca/en/national-health-expenditure-trends",
  },
  aha: {
    label: "AHA 2026",
    href: "https://www.aha.org/statistics/fast-facts-us-hospitals",
  },
} as const satisfies Record<string, EarlyPreviewMarketSource>;

const S = EARLYPREVIEW_MARKET_SOURCES;

/** Why now: two signals for personal agents (cream), two for healthcare (salmon), matching the title's two lines. */
export const EARLYPREVIEW_MARKET_WHY_NOW = {
  title: ["Personal agents are scaling.", "Healthcare is next."],
  stats: [
    {
      id: "muse",
      value: 10,
      suffix: "M+",
      caption:
        "people in the U.S. and Canada set up Meta's Muse in about six weeks",
      health: false,
      source: S.marketwatch,
    },
    {
      id: "sessions",
      value: 30,
      suffix: "×+",
      caption: "growth in Muse agent sessions during September 2026",
      health: false,
      source: S.arkose,
    },
    {
      id: "questions",
      value: 43,
      suffix: "%",
      caption: "of U.S. adults asked AI a health question in the past year",
      health: true,
      source: S.thinknow,
    },
    {
      id: "systems",
      value: 94,
      suffix: "%",
      caption: "of health systems using AI agents use them for appointments",
      health: true,
      source: S.hyro,
    },
  ],
} as const;

/**
 * Commercial monthly price: per location for an independent clinic, per provider for a multi-site group, and per
 * provider for Doe One in every segment. The Seed target and the plans screens all read it.
 */
const PLAN_MO = {
  free: 0,
  basic: 69,
  advanced: 129,
  groupBasic: 49,
  group: 89,
  one: 299,
} as const;

/**
 * Founding pricing: a clinic that buys in the first half of 2027 keeps its founding price for its first year, then
 * pays the commercial `PLAN_MO` price. The Seed target is at founding prices, to stay conservative.
 */
const FOUNDING_MO = {
  basic: 39,
  advanced: 79,
  groupBasic: 29,
  group: 59,
  one: 199,
} as const;

/**
 * The base-case target at Seed, Q2 2028, about 20 months out: the one model the Seed, cities and targets screens all
 * add up from. Toronto proves the model first, with U.S. test sites in parallel: 70% of it in Canada, 30% in the U.S.
 * ARR is the founding MRR × 12: independent locations at their plan's price, multi-site groups (on Advanced) per
 * provider seat. Doe One is in beta until Seed, so it adds nothing to the base case; it is the upside instead.
 * Free clinics are the claimed ones that don't pay.
 */
/** 65% of the Index in Canada, 35% in the U.S.; about 1 in 19 indexed clinics claims its page in both. */
const SEED_INDEXED = { canada: 9_750, us: 5_250 } as const;
const SEED_CLAIMED = { canada: 520, us: 280 } as const;
/** Independent clinics are one location each. Multi-site groups average 4 locations and 12 provider seats. */
const SEED_PLANS = {
  canada: { basic: 33, advanced: 19, groups: 7, groupSites: 28, groupSeats: 84 },
  us: { basic: 17, advanced: 11, groups: 3, groupSites: 12, groupSeats: 36 },
} as const;
const SEED_LOIS = "1–2";
/** Clinics in the Doe Index today, and agent requests a month at Seed (thousands). */
const INDEXED_TODAY = 1_500;
const SEED_REQUESTS_K = 2;
/** The Doe One upside: 9 beta clinics convert at founding price, 3 providers each. */
const DOE_ONE_UPSIDE_SEATS = 9 * 3;

type PlanCounts = (typeof SEED_PLANS)[keyof typeof SEED_PLANS];
const yearly = (plans: PlanCounts) =>
  (plans.basic * FOUNDING_MO.basic +
    plans.advanced * FOUNDING_MO.advanced +
    plans.groupSeats * FOUNDING_MO.group) *
  12;
const paying = (plans: PlanCounts) =>
  plans.basic + plans.advanced + plans.groupSites;

const SEED_PAID = {
  canada: paying(SEED_PLANS.canada),
  us: paying(SEED_PLANS.us),
};
const SEED_ARR = yearly(SEED_PLANS.canada) + yearly(SEED_PLANS.us);
/** The base case plus Doe One's beta converting, to the nearest $10K. */
const UPSIDE_ARR_K =
  Math.round((SEED_ARR + DOE_ONE_UPSIDE_SEATS * FOUNDING_MO.one * 12) / 10_000) * 10;

const total = (split: { canada: number; us: number }) =>
  split.canada + split.us;
const n = (value: number) => value.toLocaleString("en-US");

/** The Seed targets, for the plan section, so it quotes the same model as the Seed and cities screens. */
export const EARLYPREVIEW_MARKET_TARGETS = {
  indexedToday: INDEXED_TODAY,
  indexed: total(SEED_INDEXED),
  indexedCanada: SEED_INDEXED.canada,
  indexedUs: SEED_INDEXED.us,
  claimed: total(SEED_CLAIMED),
  paying: total(SEED_PAID),
  arrK: Math.round(SEED_ARR / 1000),
  requestsK: SEED_REQUESTS_K,
  lois: SEED_LOIS,
  /** Founding price of the entry paid plan, per location a month. */
  fromMo: FOUNDING_MO.basic,
} as const;

/**
 * The Seed plan mix and both price lists, for the plan section's revenue screen: the same paying locations at founding
 * prices, then at regular prices once their founding year ends.
 */
export const EARLYPREVIEW_MARKET_PRICING = {
  founding: FOUNDING_MO,
  regular: PLAN_MO,
  seedPlans: SEED_PLANS,
  seedClaimed: SEED_CLAIMED,
  upsideArrK: UPSIDE_ARR_K,
} as const;

/** A milestone on the way to Seed: its name, then a short line on what it means. Parts sit under it, indented. */
export type EarlyPreviewSeedMilestone = {
  readonly name: string;
  readonly text?: string;
  readonly parts?: readonly { readonly name: string; readonly text: string }[];
};

const SEED_MILESTONES: readonly EarlyPreviewSeedMilestone[] = [
  { name: "Prove PMF", text: "Toronto first, U.S. test sites in parallel" },
  {
    name: "Push the core",
    parts: [
      { name: "Auth", text: "Patients verified, agents on signed grants" },
      { name: "Index", text: "Every provider, readable by agents" },
      { name: "Interface", text: "Clinics agents can ask, book and send to" },
    ],
  },
  { name: "Expand the architecture", text: "Integrations, sandbox evals, two data regions" },
  { name: "Clear compliance", text: "PHIPA and HIPAA, SOC 2 under way" },
  { name: "Open enterprise", text: "First health-system conversations" },
];

/** The milestones before Seed: what has to be true, in order, without the figures (those live in the plan section). */
export const EARLYPREVIEW_MARKET_SEED = {
  title: ["Milestones to Seed.", "Prove it, then scale it."],
  milestones: SEED_MILESTONES,
} as const;

/**
 * Every health provider location in the U.S. and Canada, by kind and country, from the official counts. U.S.
 * figures are BLS QCEW establishments with employees (private and public), Q4 2025; Canadian figures are ISED /
 * Statistics Canada establishments for 2025, which also count practitioners without employees.
 */
type ProviderRow = {
  readonly id: string;
  readonly name: string;
  readonly us: number;
  readonly canada: number;
};
const PROVIDERS: readonly ProviderRow[] = [
  { id: "clinics", name: "Clinics & practices", us: 778_576, canada: 267_573 },
  { id: "care", name: "Long-term & residential care", us: 96_049, canada: 18_495 },
  { id: "hospitals", name: "Hospitals", us: 21_016, canada: 1_046 },
];
/** Ontario's clinics and practices (ISED 2025: 42,604 with employees, 64,771 without): the Toronto beachhead. */
const ONTARIO_CLINICS = 107_375;
/** Every location priced at Advanced, Doe's per-location list price, a year. Enterprise contracts are upside. */
const LOCATION_YR = PLAN_MO.advanced * 12;
const sum = (pick: (row: ProviderRow) => number) =>
  PROVIDERS.reduce((acc, row) => acc + pick(row), 0);
const ALL_US = sum((row) => row.us);
const ALL_CANADA = sum((row) => row.canada);
const ALL_LOCATIONS = ALL_US + ALL_CANADA;
const CLINIC_LOCATIONS = PROVIDERS[0].us + PROVIDERS[0].canada;
const usdB = (dollars: number) =>
  dollars >= 1e9
    ? `$${(dollars / 1e9).toFixed(2)}B`
    : `$${Math.round(dollars / 1e6)}M`;
const compact = (value: number) =>
  value >= 1e6 ? `${(value / 1e6).toFixed(2)}M` : `${Math.round(value / 1e3)}K`;

export type EarlyPreviewMarketSize = {
  readonly id: string;
  readonly key: string;
  readonly value: string;
  readonly what: string;
  readonly detail: string;
};

export type EarlyPreviewMarketRow = {
  readonly id: string;
  readonly name: string;
  readonly us: string;
  readonly canada: string;
  readonly total: string;
  readonly value: string;
  /** The row's share of all locations, and the U.S. share of the row, for its bar. */
  readonly share: number;
  readonly usShare: number;
};

const row = (
  id: string,
  name: string,
  us: number,
  canada: number,
): EarlyPreviewMarketRow => ({
  id,
  name,
  us: n(us),
  canada: n(canada),
  total: n(us + canada),
  value: usdB((us + canada) * LOCATION_YR),
  share: (us + canada) / ALL_LOCATIONS,
  usShare: us / (us + canada),
});

const SIZES: readonly EarlyPreviewMarketSize[] = [
  {
    id: "tam",
    key: "TAM",
    value: usdB(ALL_LOCATIONS * LOCATION_YR),
    what: "Every provider",
    detail: `${compact(ALL_LOCATIONS)} locations, U.S. and Canada`,
  },
  {
    id: "sam",
    key: "SAM",
    value: usdB(CLINIC_LOCATIONS * LOCATION_YR),
    what: "Clinics & practices",
    detail: `${compact(CLINIC_LOCATIONS)} locations, where we sell first`,
  },
  {
    id: "som",
    key: "SOM",
    value: usdB(ONTARIO_CLINICS * LOCATION_YR),
    what: "Ontario clinics",
    detail: `${compact(ONTARIO_CLINICS)} locations, the Toronto beachhead`,
  },
];

const MARKET_SOURCES: readonly EarlyPreviewMarketSource[] = [
  S.blsClinics,
  S.blsHospitals,
  S.blsCare,
  S.isedClinics,
  S.isedHospitals,
  S.isedCare,
  S.cms,
  S.cihi,
  S.aha,
];

/**
 * Toronto first, then the U.S., then the market behind them. The dot grid is the same for both countries: Canada's
 * clinics fill its share of the dots, the U.S. the rest; the paying ones are salmon.
 */
export const EARLYPREVIEW_MARKET_CITIES = {
  canada: {
    place: "Toronto",
    title: ["Proving PMF in Toronto.", "U.S. Expansion in Parallel."],
    indexed: SEED_INDEXED.canada,
    claimed: SEED_CLAIMED.canada,
    paying: SEED_PAID.canada,
  },
  us: {
    place: "United States",
    title: ["Then the U.S.", "Our first test sites."],
    indexed: SEED_INDEXED.us,
    claimed: SEED_CLAIMED.us,
    paying: SEED_PAID.us,
  },
  market: {
    title: ["Every provider,", "U.S. and Canada."],
    sizes: SIZES,
    table: {
      head: ["Provider locations", "U.S.", "Canada", "Total", "A year"],
      rows: PROVIDERS.map((p) => row(p.id, p.name, p.us, p.canada)),
      total: row("total", "All providers", ALL_US, ALL_CANADA),
    },
    note: `A year = locations × $${n(LOCATION_YR)}, Advanced at list price. Health-system contracts come on top. U.S. counts establishments with staff; Canada also counts solo practitioners.`,
    facts: [
      { value: "$5.3T", label: "U.S. health spending, 2024" },
      { value: "C$399B", label: "Canadian health spending, 2025" },
      { value: "6,100", label: "U.S. hospitals" },
    ],
    sources: MARKET_SOURCES,
  },
} as const;

/** The four kinds of clinic Doe sells to until Seed, drawn as circles above the wider list. */
const CLINIC_FOCUS = ["Aesthetics", "Orthopaedics & MSK", "Dentistry", "Concierge"] as const;

/**
 * The clinics Doe targets: private-pay practices first, where one owner decides and pays, then medical practices and
 * specialties. Each group's name is salmon; its types follow in a light grey.
 */
export const EARLYPREVIEW_MARKET_CLINICS = {
  title: ["We're targeting", "short-sales cycles first."],
  focusLabel: "Our focus to Seed",
  focus: CLINIC_FOCUS,
  groups: [
    {
      id: "private",
      lead: "Private Services",
      types: [
        "Dental",
        "Aesthetics",
        "Med Spas",
        "Concierge",
        "Physiotherapy",
        "Chiropractic",
        "Optometry",
        "Massage Therapy",
        "Naturopathy",
        "Acupuncture",
        "Psychotherapy",
        "Fertility",
      ],
    },
    {
      id: "medical",
      lead: "Medical",
      types: [
        "Family Medicine",
        "Walk-in",
        "Urgent Care",
        "Pediatrics",
        "Dermatology",
        "Cardiology",
        "Orthopedics",
        "Sports Medicine",
        "OB/GYN",
        "ENT",
      ],
    },
  ],
} as const;

/** The clinics in the Doe Index today. Private-pay, short-cycle clinics are the ones Doe sells to first. */
const INDEX_TYPES = [
  { id: "dental", count: 3_200, privatePay: true },
  { id: "physio", count: 3_000, privatePay: true },
  { id: "mental", count: 1_800, privatePay: false },
  { id: "aesthetics", count: 1_100, privatePay: true },
  { id: "optometry", count: 900, privatePay: true },
] as const;
const INDEX_TOTAL = INDEX_TYPES.reduce((sum, type) => sum + type.count, 0);
const INDEX_PRIVATE_PAY = INDEX_TYPES.reduce(
  (sum, type) => sum + (type.privatePay ? type.count : 0),
  0,
);
const INDEX_US = 7_000;
const pct = (part: number) => `${Math.round((part / INDEX_TOTAL) * 100)}%`;

/**
 * Go-to-market: the clinics already in the Doe Index, each emailed its page, then how a page turns into a paying
 * clinic: every clinic gets its page, claims it for free, and is asked to upgrade once agent demand shows up.
 */
export const EARLYPREVIEW_MARKET_INDEX = {
  index: {
    title: [`We've already indexed ${n(INDEXED_TODAY)}`, "clinics in the US & Canada."],
    detail: [
      "We're emailing every clinic its",
      "index page to claim by the end of Q1 2027.",
    ],
  },
} as const;

/**
 * Earlypreview's own price list (not /pricing): a monthly base for one provider, then each provider past the first.
 * Locations aren't priced; ten or more are quoted. Founding prices are for the first clinics in, for a set time.
 */
const TIERS = [
  { id: "free", name: "Free", priceMo: 0, perProvider: 0 },
  { id: "basic", name: "Basic", priceMo: 49, perProvider: 19 },
  { id: "advanced", name: "Advanced", priceMo: 149, perProvider: 39 },
  { id: "one", name: "Doe One", priceMo: 299, perProvider: 79 },
] as const;

type TierId = (typeof TIERS)[number]["id"];

/** Under a tier's price: what each extra provider adds, and Doe One's usage. */
const EXTRAS: Record<TierId, readonly string[]> = {
  free: ["Always free"],
  basic: ["+$19/provider/mo"],
  advanced: ["+$39/provider/mo"],
  one: ["+$79/provider/mo", "plus usage"],
};

/** The same, short, for the small line under each tier's name in the tiers table. */
const TABLE_EXTRAS: Record<TierId, readonly string[]> = {
  free: ["Always free"],
  basic: ["+$19/prov"],
  advanced: ["+$39/prov"],
  one: ["+$79/prov +\u00a0usage"],
};

const CUSTOM_LOCATIONS =
  "10+ locations: custom pricing, discounted from your bulk total. Create an account and book a call to lock it in.";

/**
 * Free to paid: each tier's monthly price for one provider, what each extra provider adds under it, then the few
 * things it adds over the tier before. The tiers screen after it has the whole table.
 */
export const EARLYPREVIEW_MARKET_PLANS = {
  title: ["Free to Claim.", "Paid to Connect."],
  custom: CUSTOM_LOCATIONS,
  plans: TIERS.map((tier) => ({
    id: tier.id,
    name: tier.name,
    priceMo: tier.priceMo,
    extras: EXTRAS[tier.id],
    features: {
      free: ["Claim your profile", "Switched on for agents", "Verified badge", "Edit it by typing", "Basic Doe Engine"],
      basic: [
        "Everything in Free",
        "Agents book and send you documents",
        "Well-known, MCP and API",
        "Email and scheduler integrations",
        "Reminders and confirmations",
      ],
      advanced: [
        "Everything in Basic",
        "Priority in the Doe Engine",
        "Doe Interface, documents and forms",
        "Offers, waitlist and autofill",
        "Deposits and no-show protection",
        "Analytics and automations",
        "Ambient scribe (basic)",
      ],
      one: [
        "Everything in Advanced",
        "Full ambient scribe",
        "Appointments+",
        "Staff agents with computer use",
        "Voice agents",
        "Insurance, prior auth and AI Insights",
        "LLM Router and usage tracking",
        "White-glove onboarding",
      ],
    }[tier.id],
  })),
} as const;

/** A tier's cell: a tick, a dash for not included, or a short word for how much of it the tier has. */
export type EarlyPreviewTierCell = boolean | string;

export type EarlyPreviewTierRow = {
  readonly label: string;
  /** One plain sentence on what it is, shown when the row is opened. */
  readonly detail: string;
  readonly cells: readonly [EarlyPreviewTierCell, EarlyPreviewTierCell, EarlyPreviewTierCell, EarlyPreviewTierCell];
};

/** A whole tiers table: its title and hint, the four tiers across the top, then its rows in sections. */
export type EarlyPreviewTiersTable = {
  readonly title: readonly string[];
  readonly hint: string;
  readonly tiers: readonly {
    readonly id: string;
    readonly name: string;
    readonly priceMo: number;
    readonly extras: readonly string[];
  }[];
  readonly sections: readonly {
    readonly id: string;
    readonly label: string;
    readonly rows: readonly EarlyPreviewTierRow[];
  }[];
};

const ALL = [true, true, true, true] as const;
const FROM_BASIC = [false, true, true, true] as const;
const FROM_ADVANCED = [false, false, true, true] as const;
const ONE_ONLY = [false, false, false, true] as const;
/** A cell for each tier, in order, from the price list. */
const perTier = (pick: (tier: (typeof TIERS)[number]) => EarlyPreviewTierCell): EarlyPreviewTierRow["cells"] => [
  pick(TIERS[0]),
  pick(TIERS[1]),
  pick(TIERS[2]),
  pick(TIERS[3]),
];

/**
 * What each tier includes and what it costs, in sections: getting found, getting booked, getting paid, running the
 * clinic, the team and support, spam protection, trust and security, then the price. Every row opens to one sentence on what it is. The table scrolls under the tiers' names.
 */
export const EARLYPREVIEW_MARKET_INCLUDED = {
  title: ["What's in each tier.", "And what it costs."],
  /** Under the title: how to open a feature's description. */
  hint: "Select any feature to see what it is.",
  tiers: TIERS.map((tier) => ({ id: tier.id, name: tier.name, priceMo: tier.priceMo, extras: TABLE_EXTRAS[tier.id] })),
  sections: [
    {
      id: "found",
      label: "Get found",
      rows: [
        {
          label: "Clinic Profile",
          detail: "Claim your clinic's profile and switch it on for patients' personal agents.",
          cells: ALL,
        },
        {
          label: "Verified Badge",
          detail: "A verified mark on your profile, so agents and patients know it's really your clinic.",
          cells: ALL,
        },
        {
          label: "Edit by Typing",
          detail: "Update your clinic by typing what changed. On Free a few fields, like live availability, stay locked.",
          cells: ["Most", true, true, true],
        },
        {
          label: "Services & Providers",
          detail:
            "Your services, providers and prices, each set up the way agents should present them, with the offers and booking rules attached.",
          cells: ALL,
        },
        {
          label: "Doe Engine",
          detail:
            "How agents find you. Standard adds the well-known file, MCP and an API. Priority surfaces your clinic ahead of others in rotation, with Exa Connect, the MCP registry, MCP and PAP.",
          cells: ["Basic", "Standard", "Priority", "Priority"],
        },
        {
          label: "Any Language",
          detail: "Agents read and answer for your clinic in the patient's own language, English and French first.",
          cells: FROM_BASIC,
        },
      ],
    },
    {
      id: "booked",
      label: "Get booked",
      rows: [
        {
          label: "Agent Booking",
          detail: "Patients' agents book, reschedule and cancel with you directly, and send you their documents.",
          cells: FROM_BASIC,
        },
        {
          label: "Reminders & Confirmations",
          detail: "Reminders and confirmations go out on their own, by text and email, so fewer patients forget.",
          cells: FROM_BASIC,
        },
        {
          label: "Integrations",
          detail:
            "Basic connects your email and any scheduling app you use. Advanced connects your EMR and the deeper systems your clinic runs on.",
          cells: [false, "Basic", "Advanced", "Advanced"],
        },
        {
          label: "Document Exchange",
          detail:
            "Referrals, records, results, forms and payer letters in and out. Doe reads each one and files it to the chart, with every step tracked.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Forms",
          detail:
            "Build your intake, consent and records forms. Agents send them, fill in what they can for the patient, and return them where you want.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Doe Interface",
          detail:
            "A direct line from a patient's agent to your clinic, with no phone call. Bookings, refills, billing and prep questions arrive structured, and Doe answers or acts.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Referrals",
          detail: "Referrals in and out, with the records attached, moving from Sent to Seen on one board.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Offers",
          detail: "Publish openings, promotions and packages. Agents bring them to the patients they fit.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Waitlist & Autofill",
          detail: "A waitlist that fills cancelled slots on its own, so an empty chair gets booked again.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Analytics",
          detail: "When agents ask, what they ask, how fast you answer, what they book and through which channels.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Unanswered Questions",
          detail: "The questions agents asked that your clinic couldn't answer yet, each with one click to cover it.",
          cells: FROM_ADVANCED,
        },
      ],
    },
    {
      id: "paid",
      label: "Get paid",
      rows: [
        {
          label: "Deposits & Prepayment",
          detail: "Take a deposit or the full fee when an agent books, so every slot is held by someone committed.",
          cells: FROM_ADVANCED,
        },
        {
          label: "No-Show Protection",
          detail: "A card on file and a cancellation policy the patient's agent agrees to before it books.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Invoicing & Collection",
          detail: "Invoices go to the patient's agent to approve and pay, and every visit's payment is tracked to collected.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Payouts",
          detail: "Bookings, deposits and add-ons paid out together, on a schedule you can see.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Prior Authorization",
          detail: "Prior auth with the payer handled before the visit, for every service that needs it.",
          cells: ONE_ONLY,
        },
        {
          label: "Insurance Checks",
          detail: "Coverage and eligibility checked before the visit, so there are no surprises at the front desk.",
          cells: ONE_ONLY,
        },
      ],
    },
    {
      id: "run",
      label: "Run the clinic",
      rows: [
        {
          label: "Smart Schedule",
          detail: "Your day, week, month and year at a glance, with each visit's notes and prep a click away.",
          cells: FROM_BASIC,
        },
        {
          label: "Automations",
          detail:
            "Workflows that run when something happens, like an agent booking, a claim denied or a link left unopened, each with its own switch.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Ambient Scribe",
          detail: "Visit notes written while you talk. Advanced has the basic scribe, Doe One the full one.",
          cells: [false, false, "Basic", "Full"],
        },
        {
          label: "Voice Agents",
          detail:
            "Every call answered, day and night, with booking and a live handoff to staff. Calls land beside agent requests. An add-on on Advanced.",
          cells: [false, false, "Add-on", true],
        },
        {
          label: "Appointments+",
          detail: "Appointments with the prep, pre-visit videos and follow-up built in, before and after every visit.",
          cells: ONE_ONLY,
        },
        {
          label: "Staff Agents",
          detail: "A personal agent for each member of your staff that can work in your clinic's software for them.",
          cells: ONE_ONLY,
        },
        {
          label: "AI Insights",
          detail: "Where demand goes unmet, which services are rising and what to offer next, from what agents ask for.",
          cells: ONE_ONLY,
        },
        {
          label: "LLM Router",
          detail:
            "Each request goes to the best model for it, fast and cheap for simple questions, stronger for hard ones, so agents get good answers at a sensible cost.",
          cells: ONE_ONLY,
        },
        {
          label: "Usage Tracking",
          detail: "See what your usage adds up to: requests, calls and notes by day, by provider and by feature, so the bill is never a surprise.",
          cells: ONE_ONLY,
        },
      ],
    },
    {
      id: "team",
      label: "Team & support",
      rows: [
        {
          label: "Agent Access",
          detail:
            "Decide what agents may do. Pick Open, Balanced or Cautious, then set each service to allowed, reviewed first, restricted or off. One switch pauses them all.",
          cells: [false, "Presets", "Full", "Full"],
        },
        {
          label: "Roles & Permissions",
          detail: "Decide what each person on your team can see and do.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Every Location, One Login",
          detail:
            "All your locations from one account: each with its own hours and services, and who works where on which days.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Custom Workflows",
          detail: "Workflows built around how your clinic already runs, set up with you.",
          cells: ONE_ONLY,
        },
        {
          label: "White-Glove Onboarding",
          detail: "We set Doe up with you: integrations, your data and training for your team.",
          cells: ONE_ONLY,
        },
        {
          label: "Support",
          detail: "From self-serve docs on Free to a dedicated success manager on Doe One.",
          cells: ["Docs", "Email", "Priority", "Dedicated"],
        },
      ],
    },
    {
      id: "spam",
      label: "Spam protection",
      rows: [
        {
          label: "Spam Filter",
          detail:
            "Spam and junk requests filtered out before they reach you. Free catches the obvious; every paid tier filters it all.",
          cells: ["Basic", "Full", "Full", "Full"],
        },
        {
          label: "Verified Agents Only",
          detail:
            "Only agents carrying a patient's signed grant can ask or book. Anonymous bots are turned away at the door.",
          cells: FROM_BASIC,
        },
        {
          label: "Block List",
          detail: "Block any agent, number or email in one click, across every channel.",
          cells: FROM_BASIC,
        },
        {
          label: "Fake Booking Detection",
          detail:
            "Bookings that look fake, like a made-up patient or a burst of holds, are caught and held for review before they take a slot.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Bot & Scraper Blocking",
          detail: "Bots and scrapers kept off your calendar, your prices and your providers' details.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Rate Limits",
          detail: "Caps on how often any one agent can ask or book, so no one can flood your clinic.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Duplicate Merging",
          detail: "The same request sent twice, or by two agents for one patient, merged into one.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Robocall Screening",
          detail: "Spam and robocalls screened out before your voice agent or your staff pick up. With voice agents on Advanced.",
          cells: [false, false, "Add-on", true],
        },
        {
          label: "Spam Report",
          detail: "What was blocked each week and why, with one click to let anything back in.",
          cells: FROM_ADVANCED,
        },
      ],
    },
    {
      id: "trust",
      label: "Trust & security",
      rows: [
        {
          label: "Encryption",
          detail: "Everything encrypted in transit and at rest, on every tier.",
          cells: ALL,
        },
        {
          label: "PHIPA & HIPAA",
          detail: "Built to PHIPA in Canada and HIPAA in the U.S., with SOC 2 under way.",
          cells: ALL,
        },
        {
          label: "Signed BAA",
          detail: "A signed business associate agreement with Doe, for every paid clinic.",
          cells: FROM_BASIC,
        },
        {
          label: "Audit Log",
          detail: "Every agent action recorded: who asked, what was shared and when.",
          cells: FROM_ADVANCED,
        },
        {
          label: "Single Sign-On",
          detail: "Your whole team signs in with the accounts they already use.",
          cells: ONE_ONLY,
        },
      ],
    },
    {
      id: "price",
      label: "Price, a month",
      rows: [
        {
          label: "Base",
          detail: "One provider, any one clinic. Doe One adds usage on top.",
          cells: perTier((tier) => `$${tier.priceMo}`),
        },
        {
          label: "Each Extra Provider",
          detail: "Added each month for every provider past the first.",
          cells: perTier((tier) => (tier.perProvider ? `+$${tier.perProvider}` : false)),
        },
        {
          label: "Founding Price",
          detail:
            "Basic is $29 for the first 100 clinics and $39 for the next 50, each for a full year. Advanced is $59 for the first 50 and $89 for the next 50, each for six months. Doe One is $199 plus usage.",
          cells: [false, "$29", "$59", "$199"],
        },
        {
          label: "10+ Locations",
          detail: "Custom pricing, discounted from your bulk total. Create an account and book a call to lock it in.",
          cells: [false, "Custom", "Custom", "Custom"],
        },
      ],
    },
  ] satisfies readonly { id: string; label: string; rows: readonly EarlyPreviewTierRow[] }[],
} as const;

/**
 * Monthly price per location: the same plans as the go-to-market pricing screen (`EARLYPREVIEW_GTM_PRICING`).
 * Enterprise is priced per contract and starts after Seed.
 */
const PRICE_MO = { free: 0, pro: 79, growth: 249 } as const;
const ENTERPRISE_ACV = "$400K+";

/** Doe's price tiers. */
export const EARLYPREVIEW_MARKET_TIERS = {
  title: ["Free to start.", "Priced per location."],
  tiers: [
    {
      id: "free",
      name: "Free",
      who: "Verified profile and demand report",
      priceMo: PRICE_MO.free,
      note: "For every clinic",
    },
    {
      id: "pro",
      name: "Pulse Pro",
      who: "Two-way messages with agents",
      priceMo: PRICE_MO.pro,
    },
    {
      id: "growth",
      name: "Pulse Growth",
      who: "Live availability and booking",
      priceMo: PRICE_MO.growth,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      who: "Hospitals and health systems",
      custom: ENTERPRISE_ACV,
      unit: "ACV",
      when: "After Seed",
    },
  ],
  usage: {
    label: "Agent API",
    price: "Free",
    unit: "for a year, up to 1,000 bookings a month",
  },
  sources: [S.model],
} as const;

/** Clinics that have claimed their Doe profile by Seed, free and paid. */
const CLAIMED = 1_000;

const PAID_ROWS = [
  {
    id: "growth",
    label: "Pulse Growth clinics",
    short: "Growth",
    paid: true,
    qty: 40,
    price: PRICE_MO.growth * 12,
  },
  {
    id: "groups",
    label: "Multi-site locations, Growth",
    short: "Multi-site",
    paid: true,
    qty: 20,
    price: PRICE_MO.growth * 12,
  },
  {
    id: "pro",
    label: "Pulse Pro clinics",
    short: "Pro",
    paid: true,
    qty: 75,
    price: PRICE_MO.pro * 12,
  },
] as const;

const SEED_ARR_K = PAID_ROWS.reduce(
  (sum, row) => sum + (row.qty * row.price) / 1000,
  0,
);
const SEED_CLINICS = PAID_ROWS.reduce((sum, row) => sum + row.qty, 0);
const SEED_CANADA = 95;

/**
 * ARR at Seed, from the tiers: locations × yearly price. Free profiles are the rest of the claimed clinics: they pay
 * nothing but are where paid plans come from. The paid rows are the Seed quarter of the TAM screen's chart.
 */
export const EARLYPREVIEW_MARKET_REVENUE = {
  title: ["Approaching $250K ARR", "around Seed."],
  rows: [
    ...PAID_ROWS,
    {
      id: "free",
      label: "Free profiles",
      short: "Free",
      paid: false,
      qty: CLAIMED - SEED_CLINICS,
      price: 0,
    },
  ],
  priceUnit: "a year",
  total: { label: "ARR at Seed, Q2 '28" },
  sources: [S.model],
} as const;

/**
 * The 18 months to Seed: paying clinic locations and ARR at the end of each quarter, Canada first and then the U.S.
 * The average price per clinic climbs as more of them move up to Pulse Growth. Hospitals sign LOIs before Seed;
 * enterprise contracts come after it. The last quarter is the revenue table.
 */
export const EARLYPREVIEW_MARKET_RAMP = {
  lois: 3,
  quarters: [
    {
      id: "q4-26",
      when: "Q4 '26",
      milestone: "Toronto, medical",
      canada: 12,
      us: 0,
      arrK: 18,
    },
    {
      id: "q1-27",
      when: "Q1 '27",
      milestone: "Multi-site groups",
      canada: 28,
      us: 0,
      arrK: 45,
    },
    {
      id: "q2-27",
      when: "Q2 '27",
      milestone: "All services",
      canada: 48,
      us: 0,
      arrK: 80,
    },
    {
      id: "q3-27",
      when: "Q3 '27",
      milestone: "U.S. launch",
      canada: 65,
      us: 8,
      arrK: 125,
    },
    {
      id: "q4-27",
      when: "Q4 '27",
      milestone: "Hospital LOIs",
      canada: 78,
      us: 18,
      arrK: 168,
    },
    {
      id: "q1-28",
      when: "Q1 '28",
      milestone: "U.S. multi-site",
      canada: 88,
      us: 30,
      arrK: 212,
    },
    {
      id: "q2-28",
      when: "Q2 '28",
      milestone: "Seed",
      canada: SEED_CANADA,
      us: SEED_CLINICS - SEED_CANADA,
      arrK: SEED_ARR_K,
      seed: true,
    },
  ],
  after: {
    id: "after",
    when: "After Seed",
    milestone: "Enterprise",
    value: ENTERPRISE_ACV,
    unit: "ACV",
    stat: "Hospitals",
    statLabel: "and health systems",
  },
} as const;

/**
 * The go-to-market plan to Seed, in eight stages and three phases. Each stage has one headline target, the motion as
 * a short chain of steps, and what it proves. Stage 7's numbers are the revenue table's; stage 8's LOIs are the ramp's.
 */
export const EARLYPREVIEW_MARKET_GTM = {
  title: ["Eight moves to Seed.", "Supply, then agents, then revenue."],
  phases: [
    { id: "supply", label: "Supply", from: 0, to: 2 },
    { id: "agents", label: "Agent demand", from: 3, to: 5 },
    { id: "revenue", label: "Revenue", from: 6, to: 7 },
  ],
  stages: [
    {
      id: "seed",
      phase: "supply",
      name: "Seed the network",
      target: "15K",
      unit: "practices indexed",
      sub: "Toronto, then New York and San Francisco",
      flow: [
        "Public sites and provider registries",
        "Auto-built Doe profiles",
        "Clustered by specialty and city",
        "“Claim your profile” pages",
      ],
      goal: "Useful supply before any clinic has to onboard.",
    },
    {
      id: "claim",
      phase: "supply",
      name: "Claim and verify",
      target: CLAIMED.toLocaleString("en-US"),
      unit: "clinics claimed",
      sub: "500 verified · 50 founding clinics, set up by hand",
      flow: [
        "Founder outreach to top practices",
        "Every clinic gets its pre-built page",
        "Free claim and verification",
        "Phone and LinkedIn for big accounts",
      ],
      goal: "About 7% of indexed clinics claim: dense, accurate supply.",
    },
    {
      id: "actionable",
      phase: "supply",
      name: "Make supply actionable",
      target: "250",
      unit: "bookable clinics",
      flow: [
        "Providers",
        "Services",
        "Requirements",
        "Insurance and payment",
        "Availability",
        "Booking",
      ],
      tools: {
        label: "Integrate the top Canadian and U.S. EMRs and clinic tools",
        canada: ["Jane", "Accuro", "Oscar Pro", "TELUS PS Suite"],
        us: [
          "athenahealth",
          "eClinicalWorks",
          "Dentrix",
          "NexHealth",
          "SimplePractice",
        ],
      },
      goal: "From a directory to infrastructure agents can use.",
    },
    {
      id: "agents",
      phase: "agents",
      name: "Win agent distribution",
      target: "5",
      unit: "live agent integrations",
      sub: "From 50 target teams, 10 in the sandbox",
      flow: [
        "50 agent teams",
        "Founder DMs to CTOs",
        "One healthcare request, end to end",
        "Free MCP, sandbox and SDK",
        "Hands-on integration",
      ],
      goal: "Real machine demand, without waiting on consumer traffic.",
    },
    {
      id: "route",
      phase: "agents",
      name: "Route agent demand",
      target: "2K",
      unit: "requests a month",
      sub: "60%+ matched · 20%+ end in an action",
      flow: [
        "Agent request",
        "Normalize intent",
        "Match the Index",
        "Resolve requirements",
        "Book, or hand off",
        "Log every miss",
      ],
      goal: "Proof that Doe resolves real healthcare requests.",
    },
    {
      id: "demand",
      phase: "agents",
      name: "Demand-led growth",
      target: "15%",
      unit: "of new claims from agent demand",
      flow: [
        "Agents miss an unclaimed clinic",
        "“14 agents tried to book you”",
        "One link to claim",
        "Follow up until connected",
      ],
      goal: "Usage itself becomes clinic acquisition.",
    },
    {
      id: "monetize",
      phase: "revenue",
      name: "Monetize the network",
      target: `$${Math.round(SEED_ARR_K)}K`,
      unit: "ARR at Seed",
      sub: `${SEED_CLINICS} paying · ${Math.round((SEED_CLINICS / CLAIMED) * 100)}% of claimed · about $${Math.round((SEED_ARR_K * 1000) / SEED_CLINICS / 12)} a month each`,
      flow: [
        "Free Index profile",
        "Agent demand arrives",
        "Pulse Pro: messages",
        "Pulse Growth: live booking",
      ],
      goal: "Clinics pay for demand already reaching them, not for visibility.",
    },
    {
      id: "scale",
      phase: "revenue",
      name: "Scale and enterprise",
      target: `${EARLYPREVIEW_MARKET_RAMP.lois}`,
      unit: "hospital LOIs",
      sub: "Enterprise pilots after Seed",
      flow: [
        "Grow where demand gaps show",
        "City-by-city density playbook",
        "Multi-site groups already indexed",
        "One hospital department, one workflow",
        "Epic once a buyer is confirmed",
      ],
      goal: "Doe as infrastructure, not small-clinic software.",
    },
  ],
  sources: [S.model],
} as const;

/**
 * Doe's marketing engine. Every channel is told in James' voice, a med student who wants AI to work for providers.
 * The meter is the visual clinics see: how likely a personal agent is to find them and get them right, rising with
 * every detail they add. The LOI path is how a hospital signs before Seed.
 */
export const EARLYPREVIEW_MARKET_MARKETING = {
  title: ["Doe's marketing engine.", "Told by a med student."],
  meter: {
    label: "Chance a personal agent finds your clinic and gets it right",
    steps: [
      { label: "Listed", pct: 12 },
      { label: "Website claimed", pct: 30 },
      { label: "Services and providers", pct: 48 },
      { label: "Hours and location", pct: 60 },
      { label: "Insurance and payment", pct: 72 },
      { label: "Requirements", pct: 82 },
      { label: "Live availability", pct: 91 },
      { label: "Booking", pct: 97 },
    ],
  },
  channels: [
    {
      id: "james",
      name: "Meet James",
      hook: "A med student making AI work for providers.",
      detail: "Every campaign is in his voice.",
    },
    {
      id: "claim",
      name: "Claim campaigns",
      hook: "Claim your website. Claim your @.",
      detail: "Teach agents about your clinic before your competitor does.",
    },
    {
      id: "products",
      name: "Product hooks",
      hook: "Doe Psychiatry: a scribe for your specialty.",
      detail:
        "Every AI tool in one place, at one price, on private compute. Easy to switch.",
    },
    {
      id: "launch",
      name: "Doe Toronto launch",
      hook: "Have your clinic ready for launch day.",
      detail:
        "Free waitlist. A $9.99 deposit holds a founding spot: 3 months free and extra AI tools.",
    },
    {
      id: "trust",
      name: "Doe Secure Protocol",
      hook: "Security that updates as fast as the models.",
      detail:
        "The Health Intelligence Protocol, built toward Personalized Intelligence.",
      link: { label: "Canadian Intelligence", href: "/doecanada" },
    },
    {
      id: "field",
      name: "Field and partners",
      hook: "National health organizations and conferences.",
      detail:
        "Digital health, medical and specialty events, plus the Clinical Partners Program: pre-health, professional students and early-career clinicians.",
    },
  ],
  loi: {
    label: "Enterprise LOI",
    steps: [
      "Clinical Partner inside a hospital",
      "A department champion",
      "One scoped workflow",
      "LOI before Seed",
    ],
  },
  sources: [S.model],
} as const;

/**
 * Doe's market model. One dot in the market size field is `dotM` million dollars of annual spend, so the dot counts
 * come from the dollar figures: the field's 2,800 dots are the $28B TAM. SAM is the sum of its segments; SOM is ARR at Seed.
 */
export const EARLYPREVIEW_MARKET_MODEL = {
  dotM: 10,
  tam: { key: "TAM", display: "$28B", title: "Total opportunity" },
  sam: {
    key: "SAM",
    display: "$3.1B",
    title: "Serviceable today",
    segments: [
      { id: "practices", amountM: 2_376 },
      { id: "groups", amountM: 540 },
      { id: "api", amountM: 204 },
    ],
  },
  som: {
    key: "SOM",
    amountM: SEED_ARR_K / 1000,
    display: `$${Math.round(SEED_ARR_K)}K`,
    title: "By Seed, 18 months",
  },
} as const;

export const EARLYPREVIEW_MARKET_SIZE = {
  title: ["A $28B layer", "across healthcare."],
  note: `Each dot is $${EARLYPREVIEW_MARKET_MODEL.dotM}M of annual spend.`,
  sources: [S.model],
} as const;

/** The expansion path. Its first step is the beachhead. */
export const EARLYPREVIEW_MARKET_EXPANSION = {
  title: ["Practices first.", "Then the whole system."],
  steps: [
    {
      id: "clinics",
      when: "Years 1–2",
      beachhead: "Beachhead",
      name: "Clinics",
      acv: "$1–3K ACV",
      detail:
        "Practices of 1–10 providers, plus agent developers on one API: a $2.6B start. Toronto, then the U.S.",
    },
    {
      id: "groups",
      when: "Years 2–4",
      name: "Multi-site groups",
      acv: "$15K ACV",
      detail: "One model shared across every location.",
    },
    {
      id: "systems",
      when: "Years 4–6",
      name: "Health systems",
      acv: `${ENTERPRISE_ACV} ACV`,
      detail: "Agents that guide patients across departments.",
    },
    {
      id: "platform",
      when: "Years 6+",
      name: "Agent platforms",
      acv: "Usage + enterprise",
      detail: "The layer every personal agent uses to reach care.",
    },
  ],
  sources: [S.model],
} as const;
