/**
 * /earlypreview market section: the copy, the reported signals and Doe's market model, in one place so the numbers
 * can be changed without touching the layout. Every reported figure carries its source link. The market size,
 * revenue model and expansion figures are Doe's own estimates; TAM matches the $28B on /about.
 */

import {
  FEATURE_GROUPS,
  type FeatureGroup,
  PLAN_ORDER,
  PLANS as PRICING_PLANS,
  type Plan as PricingPlan,
  SPECIALTIES,
  SPECIALTY_FROM,
} from "@/lib/doehealthdesk2/doehealthdesk2-pricing";

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

/** A tier's extras: what each provider and location past the first adds a month, as on /pricing. */
const extras = (plan: PricingPlan) =>
  plan.base === 0
    ? ["Every provider and location"]
    : [`+$${plan.perProvider}/provider/mo`, `+$${plan.perLocation}/location/mo`];

/** The /pricing feature groups each tier adds, the specialty sets in Advanced. */
const SPECIALTY_GROUP: FeatureGroup = {
  title: "Specialty feature sets",
  from: SPECIALTY_FROM,
  items: SPECIALTIES.map((specialty) => specialty.label),
};
const GROUPS: readonly FeatureGroup[] = [
  ...FEATURE_GROUPS.filter((group) => PLAN_ORDER.indexOf(group.from) <= PLAN_ORDER.indexOf(SPECIALTY_FROM)),
  SPECIALTY_GROUP,
  ...FEATURE_GROUPS.filter((group) => PLAN_ORDER.indexOf(group.from) > PLAN_ORDER.indexOf(SPECIALTY_FROM)),
];

/** A tier's features on the plans screen: Free lists its profile, each paid tier what it adds over the one before. */
const features = (plan: PricingPlan, index: number) =>
  index === 0
    ? GROUPS.filter((group) => group.from === plan.id).flatMap((group) => group.items.filter((item) => item.length < 40))
    : [
        `Everything in ${PRICING_PLANS[index - 1]!.name}`,
        ...GROUPS.filter((group) => group.from === plan.id).map((group) => group.title),
      ];

/**
 * Free to paid, priced as on /pricing: each tier's monthly price for one provider at one location, what each extra
 * provider and location adds under it, then its features. The tiers screen after it has the detail.
 */
export const EARLYPREVIEW_MARKET_PLANS = {
  title: ["Free to Claim.", "Paid to Connect."],
  plans: PRICING_PLANS.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    priceMo: plan.base,
    extras: extras(plan),
    features: features(plan, index),
  })),
} as const;

/** One plain sentence on what each /pricing feature group is, shown when its row on the tiers screen is opened. */
const GROUP_DETAIL: Record<string, string> = {
  "Clinic profile":
    "Your clinic's page in the Doe Index. Claim it, keep services, providers, hours and insurance current, and get verified.",
  "Dynamic Index":
    "Your page stays live. Services, providers, hours, availability and prices sync from your scheduling, PMS, EHR and CRM.",
  "Doe Interface":
    "A direct line between patients' personal agents and your clinic, with structured questions, replies and handoff to staff.",
  Offers: "Publish promotions, openings and packages. Personal agents surface them to the patients they fit.",
  Analytics: "How agents find you: searches, inquiries, top services, missed requests and response times.",
  "Personal agents for staff":
    "Agents for your team that take on scheduling, referrals, intake, insurance and follow-ups.",
  "AI Insights": "Where demand goes unmet, which services are trending, how agents convert and the revenue they bring.",
  Flow: "Incoming forms read, mapped and routed on their own, outgoing documents filled in, and missing details flagged.",
  Automations: "Rules in plain language. When something happens, reply, route, book, notify staff or send forms.",
  "Advanced controls":
    "Decide what agents may do: permissions, human approval rules and workflow policies, across every location.",
  "Specialty feature sets": "Workflows built for concierge, aesthetics, fertility and home care practices.",
  "Voice agents": "Every call answered, day and night. Book, reschedule and triage, with a live handoff to staff.",
  "White-glove onboarding": "A dedicated success manager, custom integrations and priority support.",
};

/**
 * What each tier includes, as on /pricing: the four tiers across the top with their price and what each extra provider
 * and location adds, one row per feature group, ticked from the first tier that has it. On iPhone the extras close
 * the table as two rows instead.
 */
export const EARLYPREVIEW_MARKET_INCLUDED = {
  title: ["What's in each tier.", "And what it costs."],
  tiers: PRICING_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceMo: plan.base,
    extras: extras(plan),
  })),
  rows: GROUPS.map((group) => ({
    id: group.title,
    label: group.title,
    detail: GROUP_DETAIL[group.title] ?? `${group.items.join(", ")}.`,
    from: PRICING_PLANS.find((plan) => plan.id === group.from)!.name,
    cells: PLAN_ORDER.map((id) => PLAN_ORDER.indexOf(id) >= PLAN_ORDER.indexOf(group.from)),
  })),
  costs: [
    { id: "provider", label: "Each extra provider", cells: PRICING_PLANS.map((plan) => (plan.perProvider ? `+$${plan.perProvider}` : "$0")) },
    { id: "location", label: "Each extra location", cells: PRICING_PLANS.map((plan) => (plan.perLocation ? `+$${plan.perLocation}` : "$0")) },
  ],
  costsNote: "A month. Larger practices get a volume discount on extra providers and locations.",
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
