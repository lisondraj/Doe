/**
 * /earlypreview market section: the copy, the reported signals and Doe's market model, in one place so the numbers
 * can be changed without touching the layout. Every reported figure carries its source link. The market size,
 * revenue model and expansion figures are Doe's own estimates; TAM matches the $28B on /about.
 */

export type EarlyPreviewMarketSource = { readonly label: string; readonly href?: string };

export const EARLYPREVIEW_MARKET_SOURCES = {
  marketwatch: {
    label: "MarketWatch",
    href: "https://www.marketwatch.com/livecoverage/meta-earnings-stock-results-muse-q3/card/muse-users-are-hooked-on-online-shopping-NApJZdwp7wMDpagjjnyY",
  },
  arkose: { label: "Arkose Labs, Q3 2026", href: "https://www.arkoselabs.com/agentic-ai-trust-report-q3-2026" },
  thinknow: {
    label: "ThinkNow, n = 1,548",
    href: "https://thinknow.com/blog/the-new-front-door-to-healthcare-how-consumers-are-using-ai/",
  },
  hyro: { label: "Hyro 2026", href: "https://www.hyro.ai/resources/guides-reports/2026-ai-agent-benchmark-report/" },
  model: { label: "Doe market model, 2026 (estimates)" },
} as const satisfies Record<string, EarlyPreviewMarketSource>;

const S = EARLYPREVIEW_MARKET_SOURCES;

/** Why now: two signals for personal agents (cream), two for healthcare (salmon), matching the title's two lines. */
export const EARLYPREVIEW_MARKET_WHY_NOW = {
  title: ["Personal agents are scaling.", "Healthcare is next."],
  stats: [
    { id: "muse", value: 10, suffix: "M+", caption: "people in the U.S. and Canada set up Meta's Muse in about six weeks", health: false },
    { id: "sessions", value: 30, suffix: "×+", caption: "growth in Muse agent sessions during September 2026", health: false },
    { id: "questions", value: 43, suffix: "%", caption: "of U.S. adults asked AI a health question in the past year", health: true },
    { id: "systems", value: 94, suffix: "%", caption: "of health systems using AI agents use them for appointments", health: true },
  ],
  sources: [S.marketwatch, S.arkose, S.thinknow, S.hyro],
} as const;

/**
 * Doe's market model. One dot in the market size field is `dotM` million dollars of annual spend, so the dot counts
 * come from the dollar figures. SAM is the sum of its segments.
 */
export const EARLYPREVIEW_MARKET_MODEL = {
  dotM: 10,
  tam: {
    key: "TAM",
    display: "$28B",
    title: "Total opportunity",
    detail: "Agent infrastructure as a standard layer across every U.S. and Canadian health provider.",
  },
  sam: {
    key: "SAM",
    display: "$3.1B",
    title: "Serviceable today",
    detail: "165,000 independent practices, 9,000 multi-site groups and the agent developers who reach them.",
    segments: [
      { id: "practices", amountM: 2_376 },
      { id: "groups", amountM: 540 },
      { id: "api", amountM: 204 },
    ],
  },
  som: {
    key: "SOM",
    amountM: 131.4,
    display: "$131M",
    title: "Obtainable in 5–7 years",
    detail: "ARR we can plausibly win by year 7: about 4% of SAM.",
  },
} as const;

export const EARLYPREVIEW_MARKET_SIZE = {
  title: ["A $28B layer", "across healthcare."],
  note: `Each dot is $${EARLYPREVIEW_MARKET_MODEL.dotM}M of annual spend.`,
  sources: [S.model],
} as const;

/** Year 7 of the model: organizations × ACV, plus agent actions × price. The bar's shares come from these rows. */
export const EARLYPREVIEW_MARKET_REVENUE = {
  title: ["$131M ARR,", "built from the bottom up."],
  rows: [
    { id: "practices", label: "Independent practices", short: "Practices", count: "6,000", price: "$14.4K", priceUnit: "ACV", amountM: 86.4 },
    { id: "groups", label: "Multi-site groups", short: "Groups", count: "450", price: "$60K", priceUnit: "ACV", amountM: 27 },
    { id: "api", label: "Agent API and transactions", short: "API", count: "150M", price: "$0.12", priceUnit: "per action", amountM: 18 },
  ],
  total: { label: "Year 7 ARR", display: "$131.4M" },
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
      acv: "$14.4K ACV",
      detail: "Practices of 1–10 providers, plus agent developers on one API: a $2.6B start. Toronto, then the U.S.",
    },
    { id: "groups", when: "Years 2–4", name: "Multi-site groups", acv: "$60K ACV", detail: "One model shared across every location." },
    { id: "systems", when: "Years 4–6", name: "Health systems", acv: "$400K+ ACV", detail: "Agents that guide patients across departments." },
    { id: "platform", when: "Years 6+", name: "Agent platforms", acv: "Usage + enterprise", detail: "The layer every personal agent uses to reach care." },
  ],
  sources: [S.model],
} as const;
