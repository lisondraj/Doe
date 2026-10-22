/**
 * /earlypreview go-to-market section: every figure the four screens show, in one place. Practice counts are rounded
 * estimates from public licensing registers (Ontario colleges, NPPES); prices and targets are Doe's plan as of
 * October 2026.
 */

export type EarlyPreviewGtmLine = readonly { readonly text: string; readonly tone: "cream" | "salmon" }[];

const line = (text: string, tone: "cream" | "salmon" = "cream"): EarlyPreviewGtmLine => [{ text, tone }];

/** Screen 1: the first city. The five verticals, ranked, add up to the practices the dot grid stands for. */
export const EARLYPREVIEW_GTM_CITY = {
  title: [line("Start in one city,"), line("where patients choose their care.", "salmon")],
  verticals: [
    { name: "Physio & chiro", count: "2,400" },
    { name: "Dental", count: "3,000" },
    { name: "Mental health", count: "1,200" },
    { name: "Aesthetics", count: "700" },
    { name: "Optometry", count: "650" },
  ],
  countLabel: "GTA practices",
  /** One dot in the grid is this many practices. */
  perDot: 35,
  stages: [
    { value: "8,000", label: "indexed" },
    { value: "1,000", label: "claimed" },
    { value: "250", label: "bookable" },
  ],
} as const;

/** Screen 2: agents on one side, the systems clinics run on the other, all through Doe Connect. */
export const EARLYPREVIEW_GTM_AGENTS = {
  title: [line("Don't build healthcare integrations."), line("Integrate Doe once.", "salmon")],
  sources: ["Personal agents", "Care navigators", "Health apps", "Assistants"],
  hub: { name: "Doe Connect", detail: "search · verify · availability · book" },
  rails: ["Jane", "Dentrix", "NexHealth", "athenahealth", "SimplePractice", "Boulevard", "Epic", "Oracle Health"],
  facts: [
    { value: "Under an hour", label: "to connect the MCP server" },
    { value: "Two days", label: "to production on the API" },
    { value: "Free for a year", label: "up to 1,000 bookings a month" },
  ],
} as const;

/** Screen 3: the demand report every clinic gets for free, which is what brings it onto a paid plan. */
export const EARLYPREVIEW_GTM_PRICING = {
  title: [line("Free to be found."), line("Paid when agents act.", "salmon")],
  report: {
    from: "Monthly demand report",
    text: "In March, 14 agents asked for pelvic floor physio within 3 km of King West. 9 matched your clinic. None could see your availability.",
  },
  plans: [
    { price: "$0", name: "Free", detail: "Verified profile and the demand report" },
    { price: "$79", name: "Pulse Pro", detail: "Two-way messages with agents" },
    { price: "$249", name: "Pulse Growth", detail: "Live availability and booking" },
  ],
  note: "A month, per location. No per-patient fees, no paid placement.",
} as const;

/** Screen 4: the next twelve months. Each figure counts up as it comes in. */
export const EARLYPREVIEW_GTM_MILESTONES = {
  title: [line("Toronto first."), line("Then New York and San Francisco.", "salmon")],
  quarters: [
    { value: "50", label: "founding clinics", when: "Q4 2026" },
    { value: "5", label: "agent integrations", when: "Q1 2027" },
    { value: "1,000", label: "Toronto practices claimed", when: "Q2 2027" },
    { value: "$500K", label: "ARR, with two new cities", when: "Q3 2027" },
  ],
} as const;

export const EARLYPREVIEW_GTM_SCREENS = 4;
