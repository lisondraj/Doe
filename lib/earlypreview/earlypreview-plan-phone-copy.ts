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
          { lane: "supply", text: `${n(T.indexedToday)} Toronto practices indexed from public college registers` },
          { lane: "agents", text: "First agent developers building in the Doe sandbox" },
        ],
      },
      {
        when: "Q1 ’27",
        items: [
          { lane: "supply", text: "Every indexed Toronto practice emailed its Doe page" },
          { lane: "agents", text: "MCP server and SDKs public" },
          { lane: "revenue", text: `Paid plans open at founding prices: $${P.founding.basic} and $${P.founding.advanced} a month` },
        ],
      },
      {
        when: "Q2 ’27",
        items: [
          { lane: "supply", text: "Founding 100 practices set up by our team" },
          { lane: "agents", text: "First live requests from patients’ agents" },
        ],
      },
      {
        when: "Q3 ’27",
        items: [
          { lane: "supply", text: "New York and San Francisco indexed from the NPPES NPI registry" },
          { lane: "revenue", text: "First practices claim their page because of agent requests" },
        ],
      },
      {
        when: "Q4 ’27",
        items: [
          { lane: "agents", text: "10 agent integrations live" },
          { lane: "revenue", text: "First hospital letters of intent" },
        ],
      },
      {
        when: "Q1 ’28",
        items: [{ lane: "revenue", text: `U.S. multi-site groups on Advanced, $${P.founding.group} a provider a month` }],
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

  /** The registers the Index is built from, with their public size. */
  sources: {
    title: ["Where the 15,000", "practices come from."],
    rows: [
      { name: "College of Physicians and Surgeons of Ontario", gives: "Every licensed Ontario physician and practice address", size: "Public register" },
      { name: "Royal College of Dental Surgeons of Ontario", gives: "Every registered Ontario dentist", size: "≈10,800" },
      { name: "College of Physiotherapists of Ontario", gives: "Every registered Ontario physiotherapist", size: "10,000+" },
      { name: "NPPES NPI registry", gives: "Every U.S. provider and organization, with address and specialty", size: "9.4M records" },
      { name: "Practice websites and maps", gives: "Services, hours and insurance accepted, checked per practice", size: "Per practice" },
    ],
    note: "Register sizes: RCDSO strategic plan 2023–25, CPO annual report 2021–22, NPPES full file 2026.",
    split: { today: n(T.indexedToday), canada: n(T.indexedCanada), us: n(T.indexedUs), total: n(T.indexed) },
  },

  /** Who pays first: private-pay practices, and owner-run groups. */
  groups: {
    title: ["Pre-seed customers:", "private-pay and multi-site."],
    privatePay: {
      value: "65%",
      label: "of paying clinics at Seed are private-pay",
      text: "Dental, physiotherapy, optometry and aesthetics. The owner decides and pays; there is no insurer contract or procurement step.",
    },
    seed: [
      { value: String(groups), label: "groups by Seed" },
      { value: String(groupSites), label: "locations" },
      { value: String(groupSeats), label: "provider seats" },
    ],
    seedText: `Owner-run groups of 2 to 12 locations, found through shared owners in the Index. $${P.founding.group} a provider a month at founding prices, $${P.regular.group} after.`,
    networks: {
      label: "National networks, after Seed",
      rows: [
        { name: "dentalcorp", what: "Dental practices", size: "570+", when: "Q1 2025" },
        { name: "123Dentist", what: "Dental clinics", size: "450+", when: "Dec 2025" },
        { name: "Lifemark", what: "Physio and rehab clinics", size: "325+", when: "2025" },
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

  /** The report that turns missed demand into a claim, shown as the email itself. */
  loop: {
    email: {
      label: "Example report",
      from: "Doe",
      to: "Bloor West Physiotherapy",
      subject: "18 agent requests couldn’t be answered this month",
      rows: [
        { value: "7", text: "asked for your hours" },
        { value: "6", text: "asked if you take Sun Life" },
        { value: "5", text: "tried to book an assessment" },
      ],
      action: "Claim your page: free, about five minutes",
    },
  },

  /** How one health system signs, with the security work each step needs. */
  systems: {
    steps: [
      { when: "Q1 ’27", text: "A Clinical Partner working inside the department" },
      { when: "Q2 ’27", text: "A department champion who owns the workflow" },
      { when: "Q3 ’27", text: "One scoped workflow: referral intake" },
      { when: "Q2–Q4 ’27", text: "Security: PHIPA assessment, HIPAA BAAs, SOC 2 Type I" },
      { when: "Q4 ’27", text: "Letter of intent" },
      { when: "By Seed", text: `${T.lois} paid pilots: referral intake and rehabilitation`, seed: true },
      { when: "After Seed", text: "System-wide contract", after: true },
    ],
  },

  /** The launch campaign, told by James: a med student who wants AI to work for providers. Six views on scroll. */
  campaign: {
    title: ["The Doe Toronto launch,", "told by James."],
    james: {
      name: "Meet James",
      line: "Med student and Doe co-founder. He’s building the AI he wants to use in clinic.",
      photo: "/earlypreview/thumbs/hero.jpg",
    },
    website: {
      title: "Claim your page and edit it.",
      url: "doe.care/bloor-west-physiotherapy",
      rows: ["Hours", "Services and prices", "Insurance"],
      badge: "Claimed",
    },
    meter: {
      title: "Teach personal agents about your clinic before your competitor does.",
      label: "How likely a patient’s agent finds you and gets every answer",
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
    onePrice: { title: "Every intelligent tool you love. One place, one price.", tools: ["Scribe", "Voice agent", "Booking", "Forms", "Payments"] },
    privateModel: { title: "Every tool on your own intelligent model, with private compute.", tools: ["Scribe", "Voice", "Booking"], model: "Your model", compute: "Private compute" },
    secure: {
      title: "The Doe Secure Protocol",
      lines: [
        "Health Intelligence Protocol: new LLM research folded in as it lands",
        "Security that updates its architecture as frontier models change",
        "Building toward personalized intelligence",
      ],
    },
    toronto: {
      title: "Doe Toronto is launching soon.",
      line: "Have your clinic ready before launch day.",
      tiers: [
        { name: "Waitlist", price: "Free" },
        { name: "Founding cohort", price: "$9.99 deposit", detail: "Founding pricing, 3 months free, extra AI tools" },
      ],
    },
    canada: { title: "Canadian Intelligence", href: "/doecanada" },
  },
} as const;
