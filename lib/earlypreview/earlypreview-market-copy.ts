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
 * The target at Seed, Q2 2028, 18 months out: the one model the Seed, cities and breakdown screens all add up from.
 * Toronto proves the model first, with U.S. test sites in parallel: about 70% of it in Canada, 30% in the U.S. ARR is
 * the founding MRR × 12: independent locations at their plan's price; multi-site groups (on Advanced) and Doe One
 * clinics per provider seat. Free clinics are the claimed ones that don't pay.
 */
const SEED_INDEXED = { canada: 11_900, us: 5_100 } as const;
const SEED_CLAIMED = { canada: 700, us: 300 } as const;
/**
 * Independent clinics are one location each. Multi-site groups average 4 locations and 10 provider seats; Doe One
 * clinics average 3 providers.
 */
const SEED_PLANS = {
  canada: {
    basic: 43,
    advanced: 21,
    one: 7,
    oneSeats: 21,
    groups: 7,
    groupSites: 28,
    groupSeats: 70,
  },
  us: {
    basic: 19,
    advanced: 9,
    one: 3,
    oneSeats: 9,
    groups: 3,
    groupSites: 12,
    groupSeats: 30,
  },
} as const;
const SEED_LOIS = "1–2";

type PlanCounts = (typeof SEED_PLANS)[keyof typeof SEED_PLANS];
const yearly = (plans: PlanCounts) =>
  (plans.basic * FOUNDING_MO.basic +
    plans.advanced * FOUNDING_MO.advanced +
    plans.oneSeats * FOUNDING_MO.one +
    plans.groupSeats * FOUNDING_MO.group) *
  12;
const paying = (plans: PlanCounts) =>
  plans.basic + plans.advanced + plans.one + plans.groupSites;
const accounts = (plans: PlanCounts) =>
  plans.basic + plans.advanced + plans.one + plans.groups;
const both = (key: keyof PlanCounts) =>
  SEED_PLANS.canada[key] + SEED_PLANS.us[key];

const SEED_PAID = {
  canada: paying(SEED_PLANS.canada),
  us: paying(SEED_PLANS.us),
};
const SEED_ARR = yearly(SEED_PLANS.canada) + yearly(SEED_PLANS.us);
const SEED_ACCOUNTS = accounts(SEED_PLANS.canada) + accounts(SEED_PLANS.us);
const SEED_SEATS = both("groupSeats") + both("oneSeats");

const total = (split: { canada: number; us: number }) =>
  split.canada + split.us;
const n = (value: number) => value.toLocaleString("en-US");
const kUsd = (dollars: number) => `$${Math.round(dollars / 1000)}K`;

/** A line of copy whose figures are set apart from the words around them. */
export type EarlyPreviewMarketLine = readonly {
  readonly text: string;
  readonly figure?: true;
}[];
const fig = (text: string) => ({ text, figure: true as const });

/** The Seed target as one metric a line, from the Index down to paying clinics. */
export const EARLYPREVIEW_MARKET_SEED = {
  title: ["Target at Seed.", `${kUsd(SEED_ARR)} ARR by Q2 2028.`],
  lines: [
    [fig(n(total(SEED_INDEXED))), { text: " organizations indexed" }],
    [
      fig(n(SEED_INDEXED.canada)),
      { text: " in Canada, " },
      fig(n(SEED_INDEXED.us)),
      { text: " in the U.S." },
    ],
    [fig(n(total(SEED_CLAIMED))), { text: " clinics claim their page" }],
    [
      fig(n(total(SEED_CLAIMED) - total(SEED_PAID))),
      { text: " on Free, " },
      fig(n(total(SEED_PAID))),
      { text: " paying locations" },
    ],
    [
      fig(n(SEED_ACCOUNTS)),
      { text: " accounts, " },
      fig(n(both("groups"))),
      { text: " multi-site groups" },
    ],
    [fig("2K"), { text: " agent requests a month" }],
  ] satisfies readonly EarlyPreviewMarketLine[],
} as const;

/**
 * One row of the targets table, at founding prices: its locations by country, and the ARR it adds. Per-provider
 * tiers count their locations but bill their seats.
 */
const planRow = (
  id: string,
  name: string,
  priceMo: number,
  locations: keyof PlanCounts,
  billed: keyof PlanCounts = locations,
) => ({
  id,
  name,
  price: `$${priceMo}`,
  canada: SEED_PLANS.canada[locations],
  us: SEED_PLANS.us[locations],
  arr: kUsd(both(billed) * priceMo * 12),
});

/**
 * Toronto first, then the U.S., then the clinics that add up to ARR at Seed. The dot grid is the same for both:
 * Canada's clinics fill its share of the dots, the U.S. the rest; the paying ones are salmon.
 */
export const EARLYPREVIEW_MARKET_CITIES = {
  canada: {
    title: ["Proving PMF in Toronto.", "U.S. Expansion in Parallel."],
    arr: kUsd(yearly(SEED_PLANS.canada)),
    arrLabel: "Toronto ARR by Seed",
    indexed: SEED_INDEXED.canada,
    claimed: SEED_CLAIMED.canada,
    paying: SEED_PAID.canada,
  },
  us: {
    title: ["Then the U.S.", "Our first test sites."],
    arr: kUsd(yearly(SEED_PLANS.us)),
    arrLabel: "U.S. ARR by Seed",
    indexed: SEED_INDEXED.us,
    claimed: SEED_CLAIMED.us,
    paying: SEED_PAID.us,
  },
  breakdown: {
    rows: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        canada: SEED_CLAIMED.canada - SEED_PAID.canada,
        us: SEED_CLAIMED.us - SEED_PAID.us,
        arr: "$0",
      },
      planRow("basic", "Basic", FOUNDING_MO.basic, "basic"),
      planRow("advanced", "Advanced", FOUNDING_MO.advanced, "advanced"),
      planRow("groups", "Multi-site", FOUNDING_MO.group, "groupSites", "groupSeats"),
      planRow("one", "Doe One", FOUNDING_MO.one, "one", "oneSeats"),
    ],
    total: { canada: SEED_PAID.canada, us: SEED_PAID.us, arr: kUsd(SEED_ARR) },
    facts: [
      [fig(n(SEED_SEATS)), { text: " Provider Seats" }],
      [fig("65%"), { text: " Private-Pay Services" }],
      [fig(SEED_LOIS), { text: " Enterprise LOIs" }],
    ] satisfies readonly EarlyPreviewMarketLine[],
  },
} as const;

/**
 * The clinics Doe targets: private-pay practices first, where one owner decides and pays, then medical practices and
 * specialties. Each group's name is salmon; its types follow in a light grey.
 */
export const EARLYPREVIEW_MARKET_CLINICS = {
  title: ["We're targeting", "short-sales cycles first."],
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
        "Hearing",
        "Orthodontics",
        "Cosmetic Surgery",
        "Weight Loss",
        "IV Therapy",
        "Hair Restoration",
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
        "Gastroenterology",
        "Urology",
        "Endocrinology",
        "Neurology",
        "Allergy",
        "Rheumatology",
        "Ophthalmology",
        "Sleep Medicine",
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
    title: ["We've already indexed 8,000", "clinics in the US & Canada."],
    detail: [
      "We're emailing every clinic its",
      "index page to claim by the end of Q1 2027.",
    ],
  },
} as const;

/**
 * Free to paid: every clinic starts free, Basic makes it readable to agents, Advanced lets agents book it, and Doe One
 * runs the whole visit. Each tier's features here are the short version; the included screen has the detail.
 */
export const EARLYPREVIEW_MARKET_PLANS = {
  title: ["Free to Claim.", "Paid to Connect."],
  founding: {
    label: "Founding Pricing",
    detail: ["Buy in the first half of 2027,", "and your price holds for a year."],
  },
  /** The same corner after the founding year: each tier's regular price. */
  regular: {
    label: "Regular Pricing",
    detail: ["After your first year,", "each tier moves to its regular price."],
  },
  plans: [
    {
      id: "free",
      name: "Free",
      priceMo: PLAN_MO.free,
      features: [
        "Your verified clinic page",
        "Found by patients' AI assistants",
        "Monthly report on patient demand",
      ],
    },
    {
      id: "basic",
      name: "Basic",
      priceMo: PLAN_MO.basic,
      foundingMo: FOUNDING_MO.basic,
      /** Multi-site groups pay per provider instead of per location. */
      group: {
        label: "Multi-site",
        priceMo: PLAN_MO.groupBasic,
        foundingMo: FOUNDING_MO.groupBasic,
        unit: "/provider/mo",
      },
      features: [
        "Everything in Free",
        "Accurate hours, prices and services",
        "Spam and fake requests filtered out",
        "Booking requests from your website",
      ],
    },
    {
      id: "advanced",
      name: "Advanced",
      priceMo: PLAN_MO.advanced,
      foundingMo: FOUNDING_MO.advanced,
      group: {
        label: "Multi-site",
        priceMo: PLAN_MO.group,
        foundingMo: FOUNDING_MO.group,
        unit: "/provider/mo",
      },
      features: [
        "Everything in Basic",
        "Live openings, synced with your EHR",
        "Patients book instantly and pay deposits",
        "Bots and scrapers kept off your calendar",
      ],
    },
    {
      id: "one",
      name: "Doe One",
      priceMo: PLAN_MO.one,
      foundingMo: FOUNDING_MO.one,
      note: "Per provider, every clinic",
      features: [
        "Everything in Advanced",
        "A receptionist that answers every call",
        "Visit notes written for you",
        "Pre-visit videos, so patients arrive ready",
      ],
    },
  ],
} as const;

/** One tier's column on the included screen. */
type IncludedCell = string | null;

/**
 * What each paid tier includes, one row per layer of the clinic, Basic to Doe One. `null` is not included; an add-on
 * names its price. The Free tier is the claimed page under all of them, so it has no column.
 */
export const EARLYPREVIEW_MARKET_INCLUDED = {
  title: ["What's in each tier.", "Doe One runs the whole visit."],
  tiers: [
    { id: "basic", name: "Basic", priceMo: PLAN_MO.basic },
    { id: "advanced", name: "Advanced", priceMo: PLAN_MO.advanced },
    { id: "one", name: "Doe One", priceMo: PLAN_MO.one },
  ],
  rows: [
    {
      id: "visibility",
      label: "Visibility",
      cells: [
        "Patients' AI assistants find your clinic",
        "Every service and provider shown accurately",
        "Featured wherever patients search",
      ],
    },
    {
      id: "schedule",
      label: "Scheduling",
      cells: [
        "Hours, prices and openings shown",
        "Live openings, synced with your EHR",
        "A calendar that fills itself, across every site",
      ],
    },
    {
      id: "booking",
      label: "Booking",
      cells: [
        "Requests come through your website",
        "Patients book instantly and pay deposits",
        "Bookings, deposits and add-on sales in one payout",
      ],
    },
    {
      id: "protection",
      label: "Protection",
      cells: [
        null,
        "Spam and fake bookings filtered out",
        "Bots and scrapers kept off your calendar",
      ],
    },
    {
      id: "voice",
      label: "Phone",
      cells: [
        null,
        "Add-on: $149/mo per phone line",
        "A receptionist that answers and books calls",
      ],
    },
    {
      id: "appointments",
      label: "Visits",
      cells: [
        null,
        "Add-on: $199/mo per provider",
        "Visit notes written for you, with evidence at hand",
      ],
    },
    {
      id: "prepare",
      label: "Prepare",
      cells: [null, null, "Pre-visit videos, so patients arrive ready"],
    },
  ] satisfies readonly {
    id: string;
    label: string;
    cells: readonly [IncludedCell, IncludedCell, IncludedCell];
  }[],
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
