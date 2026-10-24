/**
 * /earlypreview plan section: the go-to-market to Seed (Q2 2028). Doe is a two-sided network, so the plan is how it
 * starts both sides at once: supply built without asking, demand borrowed from the personal-agent developers who
 * already have the patients, and a loop where unmet agent demand recruits the next practice. The supply and revenue
 * figures are the market model's, so they always match the Seed screen; the rest are the plan's own targets.
 */

import {
  EARLYPREVIEW_MARKET_PRICING as P,
  EARLYPREVIEW_MARKET_TARGETS as T,
} from "@/lib/earlypreview/earlypreview-market-copy";

const n = (value: number) => value.toLocaleString("en-US");

/** The Seed plan mix, both countries together: locations on each plan, and provider seats in multi-site groups. */
const MIX = {
  basic: P.seedPlans.canada.basic + P.seedPlans.us.basic,
  advanced: P.seedPlans.canada.advanced + P.seedPlans.us.advanced,
  seats: P.seedPlans.canada.groupSeats + P.seedPlans.us.groupSeats,
};
/** A year of each plan's revenue in $K at one price list. */
const yearK = (prices: { basic: number; advanced: number; group: number }) => ({
  basic: (MIX.basic * prices.basic * 12) / 1000,
  advanced: (MIX.advanced * prices.advanced * 12) / 1000,
  group: (MIX.seats * prices.group * 12) / 1000,
});
const FOUNDING_K = yearK(P.founding);
const REGULAR_K = yearK(P.regular);
const sumK = (k: { basic: number; advanced: number; group: number }) => Math.round(k.basic + k.advanced + k.group);

/** The quarters to Seed, the timeline's columns. */
export const EARLYPREVIEW_PLAN_QUARTERS = ["Q4 '26", "Q1 '27", "Q2 '27", "Q3 '27", "Q4 '27", "Q1 '28", "Q2 '28"] as const;

export const EARLYPREVIEW_PLAN = {
  /** Three motions, started together: each lane's milestones sit in the quarter they land (0 is Q4 '26). */
  timeline: {
    nav: "Timeline",
    title: ["Supply, agents and revenue.", "All three from day one."],
    seed: "Seed",
    now: "Now",
    lanes: [
      {
        id: "supply",
        name: "Supply",
        milestones: [
          { q: 0, text: `${n(T.indexedToday)} practices indexed` },
          { q: 1, text: "Every Toronto practice emailed its page" },
          { q: 2, text: "Founding 100 set up by hand" },
          { q: 3, text: "New York and San Francisco indexed" },
          { q: 6, text: `${n(T.indexed)} indexed, ${n(T.claimed)} claimed`, seed: true },
        ],
      },
      {
        id: "agents",
        name: "Agents",
        milestones: [
          { q: 0, text: "First design partners in the sandbox" },
          { q: 1, text: "MCP server and SDKs public" },
          { q: 2, text: "First live agent requests" },
          { q: 4, text: "10 agent integrations" },
          { q: 6, text: `5 active agents, ${T.requestsK}K requests a month`, seed: true },
        ],
      },
      {
        id: "revenue",
        name: "Revenue",
        milestones: [
          { q: 1, text: "Paid plans open at founding prices" },
          { q: 3, text: "First claims from agent demand" },
          { q: 4, text: "Hospital LOIs" },
          { q: 6, text: `$${T.arrK}K ARR, ${T.lois} enterprise pilots`, seed: true },
        ],
      },
    ],
  },
  /** Where potential customers come from, source by source: what each one is, and what it gives us. */
  sources: {
    nav: "Sources",
    title: ["Every practice, found", "four different ways."],
    groups: [
      {
        id: "find",
        name: "Where we find them",
        items: [
          { name: "Ontario college registers", gives: "Every licensed clinician and where they practise" },
          { name: "NPPES NPI registry", gives: "Every U.S. provider, by address and specialty" },
          { name: "Practice websites and maps", gives: "Services, hours, insurance and photos" },
          { name: "Shared owners in the Index", gives: "Which practices belong to one group" },
        ],
      },
      {
        id: "gather",
        name: "Where they gather",
        items: [
          { name: "Provincial associations", gives: "Member offers to a whole profession" },
          { name: "Dental study clubs", gives: "Ten to thirty owners in one room, monthly" },
          { name: "Conferences", gives: "ODA, CDA Presents, MGMA, Greater NY Dental" },
          { name: "Practice software", gives: "Practices on Jane or Cliniko, through planned integrations" },
        ],
      },
      {
        id: "bring",
        name: "Who brings them",
        items: [
          { name: "Clinical Partners", gives: "Students and new clinicians inside clinics" },
          { name: "Practice invites", gives: "Owners who bring the practice next door" },
          { name: "Founder-led", gives: "Top accounts and the Founding 100, by hand" },
        ],
      },
      {
        id: "pull",
        name: "What pulls them in",
        items: [
          { name: "Agents’ missed requests", gives: "Patients who already tried to book them" },
          { name: "Their page, already built", gives: "A reason to claim before a competitor does" },
        ],
      },
    ],
  },
  /** The rooms we'll be in, month by month to Seed: practice owners, groups, agent builders and health systems. */
  events: {
    nav: "Conferences",
    title: ["Where practices meet,", "we’re in the room."],
    kinds: [
      { id: "practice", name: "Practice owners" },
      { id: "groups", name: "Groups" },
      { id: "agents", name: "Agent builders" },
      { id: "systems", name: "Health systems" },
    ],
    /** Months from Nov ’26 to Jun ’28; each event sits in the month it usually runs. */
    months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    firstYear: 2026,
    list: [
      { month: 1, kind: "practice", name: "Doe Toronto launch", place: "Toronto" },
      { month: 4, kind: "systems", name: "HIMSS", place: "Global" },
      { month: 6, kind: "practice", name: "ODA Spring Meeting", place: "Toronto" },
      { month: 6, kind: "agents", name: "Web Summit", place: "Vancouver" },
      { month: 7, kind: "agents", name: "AI Engineer World’s Fair", place: "San Francisco" },
      { month: 7, kind: "systems", name: "e-Health", place: "Canada" },
      { month: 9, kind: "practice", name: "CDA Presents", place: "San Francisco" },
      { month: 11, kind: "groups", name: "MGMA Leaders", place: "U.S." },
      { month: 11, kind: "systems", name: "HLTH", place: "Las Vegas" },
      { month: 12, kind: "practice", name: "Greater NY Dental", place: "New York" },
      { month: 15, kind: "systems", name: "ViVE", place: "U.S." },
      { month: 16, kind: "systems", name: "HIMSS", place: "Global" },
      { month: 18, kind: "practice", name: "ODA Spring Meeting", place: "Toronto" },
      { month: 19, kind: "agents", name: "AI Engineer World’s Fair", place: "San Francisco" },
    ],
    groups: {
      label: "Association offers we’re pitching",
      names: ["Ontario Dental Association", "Ontario Physiotherapy Association", "Ontario Association of Optometrists", "Ontario Psychological Association"],
    },
  },
  /** Multi-site groups: one contract, many locations, most of the revenue. */
  groups: {
    nav: "Groups",
    title: ["One contract,", "twelve providers."],
    sites: 4,
    perSite: 3,
    root: "A multi-site group",
    site: "Location",
    figures: [
      { id: "groups", value: String(P.seedPlans.canada.groups + P.seedPlans.us.groups), label: "groups by Seed" },
      { id: "sites", value: String(P.seedPlans.canada.groupSites + P.seedPlans.us.groupSites), label: "locations" },
      { id: "seats", value: String(MIX.seats), label: "provider seats" },
    ],
    share: { value: `${Math.round((FOUNDING_K.group / T.arrK) * 100)}%`, label: "of ARR at Seed comes from groups" },
    how: [
      { lead: "The buyer", text: "An operations lead, for every site at once" },
      { lead: "The price", text: `$${P.founding.group} a provider, $${P.regular.group} after the founding year` },
      { lead: "Where we find them", text: "The Index already shows which practices share an owner; MGMA and dental service organizations" },
    ],
  },
  /** Demand, borrowed: the partnership pipeline with personal-agent developers, team by team. */
  agents: {
    nav: "Agents",
    title: ["We partner with the agents", "patients already use."],
    columns: [
      { id: "target", name: "Target list", value: 50, how: "Assistants, health, benefits and device agents", when: "Q4 ’26" },
      { id: "sandbox", name: "In the sandbox", value: 20, how: "Free Doe Connect, MCP server, SDKs", when: "From Q4 ’26" },
      { id: "integrated", name: "Integrated", value: 10, how: "One of our engineers on each", when: "By Q4 ’27" },
      { id: "active", name: "Active", value: 5, how: "Real patient requests through Doe", when: "By Seed", salmon: true },
    ],
    sources: "Found founder to founder, at AI Engineer World’s Fair and Web Summit, and through MCP registries.",
  },
  /** The loop on the practice's own Doe page: unclaimed and missing demand, then claimed and bookable. */
  loop: {
    nav: "Loop",
    title: ["Every missed request", "recruits a practice."],
    page: {
      name: "Bloor West Physiotherapy",
      place: "Toronto · Physiotherapy",
      unclaimed: "Unclaimed",
      claimed: "Claimed",
      missed: 18,
      missedLine: "agent requests couldn’t be answered this month",
      bookable: "Bookable by agents",
      rows: [
        { label: "Services", value: "Assessment, sports rehab, concussion care" },
        { label: "Hours", value: "Mon to Sat, 8 to 8" },
        { label: "Insurance", value: "Sun Life, Manulife, Canada Life" },
        { label: "Availability", value: "Live, 14 openings this week" },
        { label: "Booking", value: "Agents can book directly" },
      ],
    },
    stages: [
      { lead: "Before", text: "Agents find the page, but can’t see hours or book, so the patient goes elsewhere." },
      { lead: "The report", text: "Doe emails the owner what they missed, straight from the request log." },
      { lead: "After", text: "They claim it in minutes, and the next request books." },
    ],
    stat: { value: "15%", caption: "of new claims start from a missed-demand report by Seed. It costs an email." },
  },
  /** One practice from its first email to paying, day by day. */
  journey: {
    nav: "Journey",
    title: ["From first email to paying.", "No sales call."],
    days: 60,
    marks: [
      { day: 0, text: "Page built and emailed" },
      { day: 2, text: "Claimed, free, in five minutes" },
      { day: 7, text: "Hours and insurance verified" },
      { day: 14, text: "First agent booking" },
      { day: 30, text: "First demand report" },
      { day: 45, text: `Upgrades to paid, from $${P.founding.basic}`, salmon: true },
    ],
    stat: { value: "45 days", caption: "from first email to paying, the target for every practice" },
    foot: "Acquisition costs an email and five minutes of the owner’s time; the Founding 100 are set up for them.",
  },
  /** How a health system signs before Seed, lit floor by floor on a hospital drawn in section. */
  systems: {
    nav: "Hospitals",
    title: ["Practices first.", "Then the health system."],
    floors: ["Primary care", "Referral intake", "Imaging", "Dermatology", "Cardiology", "Rehabilitation", "Mental health"],
    /** The floor the first workflow runs on, and the one a second pilot adds. */
    pilotFloors: [1, 5],
    steps: [
      { name: "A Clinical Partner inside", when: "Q1 ’27" },
      { name: "A department champion", when: "Q2 ’27" },
      { name: "One scoped workflow", when: "Q3 ’27" },
      { name: "Security review, on our pack", when: "Q4 ’27" },
      { name: "LOI", when: "Q4 ’27" },
      { name: `${T.lois} pilots`, when: "By Seed", salmon: true },
      { name: "System-wide", when: "After Seed" },
    ],
  },
} as const;
