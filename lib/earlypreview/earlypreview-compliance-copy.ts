/**
 * /earlypreview compliance section: security and compliance through Seed (Q2 2028), for the U.S. and Canada. The
 * path runs on the plan section's quarters, and each quarter unlocks one of that plan's milestones, so the two never
 * disagree. Nothing here claims a certification before the quarter it is earned in.
 */

import { EARLYPREVIEW_MARKET_TARGETS as T } from "@/lib/earlypreview/earlypreview-market-copy";

/**
 * The overview: the protocol's six pieces as cards, each led by its drawing and one figure, with the quarter it lands
 * in from the path below. `art` picks the card's drawing.
 */
export const EARLYPREVIEW_COMPLIANCE_OVERVIEW = {
  nav: "Overview",
  title: ["Security is the product.", "Six pieces, one protocol."],
  cards: [
    {
      id: "auth",
      art: "grant",
      when: "Q1 ’27",
      name: "Doe Auth",
      line: "Agents hold a patient’s signed grant for one purpose. Never a password.",
      figure: "7 days",
      caption: "then a grant ends on its own",
    },
    {
      id: "minimum",
      art: "fields",
      when: "Day one",
      name: "Minimum necessary",
      line: "The API returns only what an action needs, and Doe keeps none of it.",
      figure: "6 fields",
      caption: "leave for a booking, not the chart",
    },
    {
      id: "evals",
      art: "matrix",
      when: "Q1 ’27",
      name: "Continuous evals",
      line: "Every model is attacked on synthetic patients before it touches a real one.",
      figure: "12 attacks",
      caption: "rerun on every new model or tool",
    },
    {
      id: "ledger",
      art: "ledger",
      when: "Q1 ’27",
      name: "Doe Ledger",
      line: "Who asked, for whom, under which grant, with which model, touching what.",
      figure: "7 questions",
      caption: "a hospital can ask of any action",
    },
    {
      id: "isolation",
      art: "tenants",
      when: "Day one",
      name: "Isolation",
      line: "One security boundary per clinic. TLS 1.3 in transit, keys in a managed KMS.",
      figure: "AES-256",
      caption: "at rest, for every clinic apart",
    },
    {
      id: "certified",
      art: "stairs",
      when: "Through Seed",
      name: "Certified on schedule",
      line: "PHIPA in Q2 ’27, HIPAA BAAs in Q3 ’27, SOC 2 Type I by the first hospital LOI.",
      figure: "Type II",
      caption: "SOC 2 report by Seed, Q2 ’28",
    },
  ],
} as const;

/**
 * The Doe Health Intelligence Protocol as seven layers, improving over time: each time AI moves (a frontier model, new
 * attack research, a new agent standard, new guidance), the change is sandboxed first, then ships to every agent on
 * Doe at once. `hits` are the layers each update changes. The 48 hours is Doe's target.
 */
export const EARLYPREVIEW_COMPLIANCE_PROTOCOL = {
  nav: "Protocol",
  title: ["One protocol, seven layers.", "It improves every time AI does."],
  layers: [
    { id: "identity", name: "Identity", detail: "Patient, agent, developer" },
    { id: "grants", name: "Grants", detail: "Signed, scoped, expiring" },
    { id: "policy", name: "Policy", detail: "Each clinic’s own rules" },
    { id: "risk", name: "Risk", detail: "Six tiers, L0 to L5" },
    { id: "disclosure", name: "Disclosure", detail: "Minimum necessary" },
    { id: "trust", name: "Trust", detail: "Earned in the sandbox" },
    { id: "ledger", name: "Ledger", detail: "Every action, answerable" },
  ],
  updates: [
    { id: "frontier-1", event: "Frontier model", hits: ["risk", "trust"] },
    { id: "research", event: "LLM security research", hits: ["policy", "disclosure", "trust"] },
    { id: "standard", event: "Agent standard", hits: ["identity", "grants"] },
    { id: "guidance", event: "Regulator guidance", hits: ["policy", "disclosure", "ledger"] },
    { id: "frontier-2", event: "Frontier model", hits: ["grants", "risk", "trust"] },
  ],
  start: "Day one",
  moves: "Each time AI moves",
  count: "Improved",
  stat: { value: "48h", caption: "from a frontier model’s release to its sandbox verdict" },
  foot: {
    lead: "Sandboxed on synthetic patients first, then shipped as one release, ",
    strong: "so every agent on Doe gets it at once",
    tail: ".",
  },
} as const;

/**
 * An incident, on a log scale of seconds to the HIPAA outer limit. The first four steps are automatic and are Doe's
 * design targets; the rest are people, on the playbook.
 */
export const EARLYPREVIEW_COMPLIANCE_INCIDENTS = {
  nav: "Incidents",
  title: ["Something will go wrong.", "Doe contains it in seconds."],
  steps: [
    { at: 0.3, text: "Unusual pattern flagged", auto: true },
    { at: 1, text: "Scopes narrowed", auto: true },
    { at: 3, text: "Sessions ended", auto: true },
    { at: 10, text: "Revoked at every clinic", auto: true },
    { at: 3600, text: "The clinic is told", auto: false },
    { at: 86400, text: "Exposure assessed, evidence kept", auto: false },
    { at: 259200, text: "Retested before it returns", auto: false },
    { at: 604800, text: "Formal notice, in writing", auto: false },
  ],
  ticks: [
    { at: 1, label: "1 second" },
    { at: 60, label: "1 minute" },
    { at: 3600, label: "1 hour" },
    { at: 86400, label: "1 day" },
    { at: 604800, label: "1 week" },
  ],
  limit: { at: 5184000, label: "HIPAA’s outer limit", sub: "60 days" },
  phases: { auto: "Automatic", people: "People, on the playbook" },
  foot: {
    lead: "Playbooks for stolen credentials, prompt-injection exploits, unsafe model updates and compromised vendors, ",
    strong: "written before the first patient",
    tail: ".",
  },
} as const;

export const EARLYPREVIEW_COMPLIANCE_EVALS = {
  nav: "Evals",
  title: ["Permissions are earned.", "Then earned again."],
  attacks: [
    "Prompt injection",
    "Injected web pages",
    "Jailbreaks",
    "Tool hijacking",
    "Memory poisoning",
    "PHI leakage",
    "Identity spoofing",
    "Privilege escalation",
    "Invented consent",
    "Malicious documents",
    "Data exfiltration",
    "Agent-to-agent tricks",
  ],
  lanes: [
    { label: "Search", risky: false },
    { label: "Request a visit", risky: false },
    { label: "Book a visit", risky: true },
    { label: "Send documents", risky: true },
  ],
  suspended: "Suspended",
  runsLabel: "attacks run",
  foot: {
    lead: "A new model, prompt, tool or permission ",
    strong: "reruns every attack",
    tail: " on synthetic patients. Access follows the result.",
  },
} as const;

/** What Doe is cleared to handle, bottom to top: the staircase's steps. */
export const EARLYPREVIEW_COMPLIANCE_LEVELS = [
  { name: "Public data" },
  { name: "Synthetic patients" },
  { name: "Canadian PHI", law: "PHIPA" },
  { name: "U.S. PHI", law: "HIPAA" },
  { name: "Hospital systems", law: "SOC 2" },
] as const;

export const EARLYPREVIEW_COMPLIANCE_PATH = {
  nav: "Path to Seed",
  title: ["Cleared step by step.", "Hospital-ready by Seed."],
  unlocks: "Unlocks",
  /** One a quarter, Q4 '26 to Seed. `level` is the highest step that quarter clears; `key` sits under its column. */
  quarters: [
    {
      when: "Q4 ’26",
      level: 1,
      key: "Risk assessment",
      items: ["HIPAA security risk assessment", "Policies and incident response", "Healthcare privacy counsel"],
      unlock: "Agent teams build on synthetic patients",
    },
    {
      when: "Q1 ’27",
      level: 1,
      key: "Pen test",
      items: ["Doe Auth and signed grants", "First external penetration test", "Evals on every model"],
      unlock: "MCP server and SDKs go public",
    },
    {
      when: "Q2 ’27",
      level: 2,
      key: "PHIPA assessments",
      items: ["Threat risk and privacy impact assessments", "An agreement with every clinic", "Canadian data hosted in Canada"],
      unlock: "First real patient requests, Toronto",
    },
    {
      when: "Q3 ’27",
      level: 3,
      key: "HIPAA BAAs",
      items: ["BAAs with every U.S. clinic", "Model providers under BAA, zero retention", "A U.S. data region"],
      unlock: "New York and San Francisco",
    },
    {
      when: "Q4 ’27",
      level: 3,
      key: "SOC 2 Type I",
      items: ["SOC 2 Type I report", "Second penetration test", "Hospital questionnaire package"],
      unlock: "Hospital LOIs",
    },
    {
      when: "Q1 ’28",
      level: 3,
      key: "Type II window",
      items: ["SOC 2 Type II observation window", "Incident drill with a clinic", "Vendor risk reviews rehearsed"],
      unlock: "Hospital security reviews",
    },
    {
      when: "Q2 ’28",
      level: 4,
      key: "SOC 2 Type II",
      items: ["SOC 2 Type II report", "Hospital vendor reviews passed", "HITRUST only if a buyer asks"],
      unlock: `Seed, with ${T.lois} enterprise pilots`,
      seed: true,
    },
  ],
} as const;
