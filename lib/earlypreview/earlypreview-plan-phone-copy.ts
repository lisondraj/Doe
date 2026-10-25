/**
 * /earlypreview go-to-market, iPhone: the plan as an investor reads it. Every Doe figure comes from the market model
 * (the same one the Seed screen quotes); every outside figure is a public one, with where it comes from in the note
 * beside it. Plain statements, dated where they can be.
 */

import {
  EARLYPREVIEW_MARKET_PRICING as P,
  EARLYPREVIEW_MARKET_TARGETS as T,
} from "@/lib/earlypreview/earlypreview-market-copy";

const n = (value: number) => value.toLocaleString("en-US");
const groups = P.seedPlans.canada.groups + P.seedPlans.us.groups;
const groupSites = P.seedPlans.canada.groupSites + P.seedPlans.us.groupSites;
const groupSeats = P.seedPlans.canada.groupSeats + P.seedPlans.us.groupSeats;

export type PlanLane = "supply" | "agents" | "revenue";

export const EARLYPREVIEW_PLAN_PHONE = {
  lanes: [
    { id: "supply", name: "Supply" },
    { id: "agents", name: "Agents" },
    { id: "revenue", name: "Revenue" },
  ] as const,

  /** The three lanes on one calendar, quarter by quarter to Seed. */
  timeline: {
    title: ["The plan to Seed,", "quarter by quarter."],
    quarters: [
      {
        when: "Q4 ’26",
        tag: "Now",
        items: [
          { lane: "supply", text: `${n(T.indexedToday)} Toronto practices indexed` },
          { lane: "agents", text: "Agent developers in the sandbox" },
        ],
      },
      {
        when: "Q1 ’27",
        items: [
          { lane: "supply", text: "Every Toronto practice emailed its page" },
          { lane: "agents", text: "MCP server and SDKs public" },
          { lane: "revenue", text: `Paid plans open: $${P.founding.basic} and $${P.founding.advanced} a month` },
        ],
      },
      {
        when: "Q2 ’27",
        items: [
          { lane: "supply", text: "Founding 100 set up by our team" },
          { lane: "agents", text: "First live agent requests" },
        ],
      },
      {
        when: "Q3 ’27",
        items: [
          { lane: "supply", text: "New York and San Francisco indexed" },
          { lane: "revenue", text: "First claims from agent requests" },
        ],
      },
      {
        when: "Q4 ’27",
        items: [
          { lane: "agents", text: "10 agent integrations" },
          { lane: "revenue", text: "First hospital LOIs" },
        ],
      },
      {
        when: "Q1 ’28",
        items: [{ lane: "revenue", text: `U.S. multi-site groups, $${P.founding.group} a provider` }],
      },
      {
        when: "Q2 ’28",
        tag: "Seed",
        seed: true,
        items: [
          { lane: "supply", text: `${n(T.indexed)} indexed (${n(T.indexedCanada)} Canada, ${n(T.indexedUs)} U.S.), ${n(T.claimed)} claimed` },
          { lane: "agents", text: `5 agents in production, ${T.requestsK}K requests a month` },
          { lane: "revenue", text: `$${T.arrK}K ARR from ${T.paying} paying locations, ${T.lois} enterprise pilots` },
        ],
      },
    ],
  },

  /** What the plan adds up to at Seed, one figure a lane, under the calendar. */
  seedKpis: [
    { lane: "supply", value: n(T.indexed), label: "practices indexed", sub: `${n(T.claimed)} claimed` },
    { lane: "agents", value: "5", label: "agents live", sub: `${T.requestsK}K requests/mo` },
    { lane: "revenue", value: `$${T.arrK}K`, label: "ARR", sub: `${T.paying} paying locations` },
  ],

  /** The registers the Index is built from, with their public size. */
  sources: {
    title: ["Where the 15,000", "practices come from."],
    rows: [
      { name: "College of Physicians and Surgeons of Ontario", gives: "Physicians and practice addresses", size: "Public register" },
      { name: "Royal College of Dental Surgeons of Ontario", gives: "Registered dentists", size: "≈10,800" },
      { name: "College of Physiotherapists of Ontario", gives: "Registered physiotherapists", size: "10,000+" },
      { name: "NPPES NPI registry", gives: "U.S. providers, by address and specialty", size: "9.4M records" },
      { name: "Practice websites and maps", gives: "Services, hours, insurance", size: "Per practice" },
    ],
    criteria: {
      title: "What we pull from each practice",
      sub: "The signals for fast growth and a short sale",
      items: [
        { lead: "Owner-run", text: "One person decides and pays" },
        { lead: "Private-pay", text: "No insurer in the sale" },
        { lead: "2+ locations", text: "One owner, many sites" },
        { lead: "Books online", text: "Already buys software" },
        { lead: "Expanding", text: "New or growing locations" },
        { lead: "Hiring", text: "Front-desk roles open" },
      ],
    },
  },

  /** Where agent developers find Doe. */
  agents: {
    listings: [
      { name: "Official MCP Registry", text: "Doe’s MCP server listed for any MCP client", when: "Registry live since Sep 2025" },
      { name: "Apps in ChatGPT", text: "Built on the Apps SDK, which runs on MCP", when: "SDK announced Oct 2025" },
      { name: "Founder outreach", text: "AI Engineer World’s Fair and Web Summit", when: "Jun ’27" },
    ],
  },

  /** The path to a hospital letter of intent by Q4 ’27, gate by gate, with what each one produces. */
  systems: {
    title: ["Path to a hospital LOI", "by Q4 ’27."],
    cycle: {
      rows: [
        { label: "Typical health system purchase", from: 6, to: 18, value: "6–18 mo" },
        { label: "Doe: first meeting to LOI", from: 0, to: 10, value: "10 mo", plan: true },
      ],
    },
    gates: [
      {
        when: "Q1 ’27",
        title: "Clinical Partners inside",
        text: "Placements map one department’s referral intake",
      },
      {
        when: "Q2 ’27",
        title: "A department champion",
        text: "Physician lead and manager agree one workflow, one measure",
      },
      {
        when: "Q2 ’27",
        title: "Privacy impact assessment",
        text: "PHIPA review with the privacy office; PHI stays in Canada",
      },
      {
        when: "Q3 ’27",
        title: "Validation project",
        text: "Through the innovation office or a CAN Health Network project",
      },
      {
        when: "Q3 ’27",
        title: "Security review",
        text: "Vendor questionnaire, pen test, SOC 2 Type I, HIPAA BAA",
      },
      {
        when: "Q4 ’27",
        title: "Letter of intent",
        text: "Department and procurement sign scope, measure and fee",
        seed: true,
      },
      {
        when: "By Seed",
        title: `${T.lois} paid pilots`,
        text: "Referral intake and rehabilitation, 12-month terms",
      },
      {
        when: "After Seed",
        title: "System-wide contract",
        text: "Competitive bid, or a shared-services buyer like Mohawk Medbuy",
        after: true,
      },
    ],
  },

  /** The launch campaign, told by James: a med student who wants AI to work for providers. Six views on scroll. */
  campaign: {
    title: ["Six launch campaigns,", "fronted by James."],
    james: {
      name: "Meet James",
      line: "Med student and co-founder, building the AI he wants in clinic.",
      photo: "/earlypreview/thumbs/hero.jpg",
    },
    website: {
      title: "Claim your page.",
      url: "doe.care/bloor-west-physiotherapy",
      rows: ["Hours", "Services and prices", "Insurance"],
      badge: "Claimed",
    },
    meter: {
      title: "Teach agents about your clinic before a competitor does.",
      label: "Chance a patient’s agent finds you and gets every answer",
      note: "Illustrative",
      steps: [
        { text: "Name and address", add: 20 },
        { text: "Hours", add: 15 },
        { text: "Services and prices", add: 20 },
        { text: "Insurance accepted", add: 15 },
        { text: "Live openings", add: 15 },
        { text: "Booking", add: 15 },
      ],
    },
    handle: { title: "Claim your @.", value: "doe.care/@bloorwestphysio", status: "Available" },
    switch: { title: "It’s easier than ever to switch.", from: ["Booking tool", "Phone line", "Intake forms"], to: "Doe" },
    psychiatry: {
      title: "Doe Psychiatry",
      line: "A scribe built for one specialty.",
      note: ["Mental status exam", "PHQ-9: 14, moderate", "Follow-up in 2 weeks"],
    },
    onePrice: { title: "Every tool you love. One price.", tools: ["Scribe", "Voice agent", "Booking", "Forms", "Payments"] },
    privateModel: { title: "Your own model, on private compute.", tools: ["Scribe", "Voice", "Booking"], model: "Your model", compute: "Private compute" },
    secure: {
      title: "The Doe Secure Protocol",
      lines: [
        "Health Intelligence Protocol: new LLM research, built in",
        "Security that upgrades with every frontier model",
        "Toward personalized intelligence",
      ],
    },
    toronto: {
      title: "Doe Toronto is launching soon.",
      line: "Get your clinic ready before launch day.",
      tiers: [
        { name: "Waitlist", price: "Free" },
        { name: "Founding cohort", price: "$9.99 deposit", detail: "Founding pricing, 3 months free, extra AI tools" },
      ],
    },
    canada: { title: "Canadian Intelligence", href: "/doecanada" },
    /** Where each view's campaign runs, in order. */
    runs: [
      ["Instagram", "TikTok", "LinkedIn"],
      ["Email to every indexed practice"],
      ["Email", "Owner groups"],
      ["Specialty associations", "LinkedIn"],
      ["Hospital privacy and IT leads"],
      ["Waitlist page", "ODA Spring Meeting"],
    ],
  },
} as const;
