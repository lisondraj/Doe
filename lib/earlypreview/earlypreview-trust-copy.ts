/**
 * /earlypreview security and compliance section: four screens, each one idea with one visual. Kept honest: the
 * sandbox runs today, the protocol's four parts are the MVP, and no certification is claimed.
 */

export const EARLYPREVIEW_TRUST_SCREENS = 4;

/** Screen 1: the protocol, as the credential an agent carries. */
export const TRUST_PROTOCOL = {
  title: ["Health Intelligence", "Protocol."],
  parts: [
    { name: "Doe Auth", line: "Proves which agent is asking" },
    { name: "Doe Grant", line: "Who it acts for, and what it may do" },
    { name: "Policy", line: "Each clinic's rules, on every request" },
    { name: "Doe Ledger", line: "A record of every action" },
  ],
  note: "The web authenticated users. APIs authenticated apps. Doe authenticates delegated intent. All four parts are in the MVP.",
  identity: { label: "Doe Auth", name: "Northstar Health", sub: "Verified healthcare agent" },
  grant: {
    label: "Doe Grant",
    id: "gr_7f3a·91c2",
    fields: [
      { label: "Agent", value: "Northstar Health" },
      { label: "Acting for", value: "Maya Chen" },
      { label: "Purpose", value: "Dermatology referral" },
      { label: "Expires", value: "In 24 hours" },
    ],
    may: ["Search specialists", "Share insurance", "Request a booking"],
    never: "Read records",
    seal: "Signed",
    revocable: "Revocable any time",
  },
} as const;

/** Screen 2: what an agent may do alone, what it must ask for, and what it never does. */
export const TRUST_CONSENT = {
  title: ["Agents ask.", "Patients decide."],
  tiers: [
    { name: "Runs on its own", line: "Search, compare, check coverage" },
    { name: "Asks first", line: "Book, pay or share records" },
    { name: "Never on its own", line: "Diagnosis and treatment" },
  ],
  phone: { date: "Wednesday, October 21", time: "9:41", app: "Northstar Health" },
  found: { text: "Found 14 in-network dermatologists near you.", tag: "Done on its own" },
  confirm: {
    title: "Book Dr. Patel?",
    text: "Thu, Oct 22 · 1:20 PM · Riverside Dermatology",
    deny: "Not now",
    allow: "Confirm",
    done: "Confirmed by Maya",
  },
  refused: { text: "Asked for a treatment plan. Sent to your clinician instead.", tag: "Never on its own" },
} as const;

/** Screen 3: the sandbox Doe runs today, attacking every change before a patient sees it. */
export const TRUST_SANDBOX = {
  title: ["Attacked every day.", "By us, first."],
  window: "Doe Sandbox · Riverside Dermatology, simulated",
  live: "Running today",
  pending: "Testing",
  attacks: [
    { attack: "Prompt hidden in a PDF", result: "Ignored" },
    { attack: "Expired grant", result: "Refused" },
    { attack: "Asks for full records", result: "Out of scope" },
    { attack: "Books without asking", result: "Asked patient" },
    { attack: "Spoofed clinic", result: "Flagged" },
    { attack: "EHR times out", result: "Failed safely" },
  ],
  update: {
    label: "Model update",
    change: "agent v2.4 → v2.5",
    checks: ["Evals rerun", "Attack suite", "Policy checks"],
    cleared: "Cleared for patients",
  },
} as const;

/** Screen 4: the ledger entry every action leaves, and the laws on both sides of the border it is built around. */
export const TRUST_AUDIT = {
  title: ["Every action,", "on the record."],
  receipt: {
    head: "Doe Ledger",
    id: "#48,213",
    rows: [
      { label: "Agent", value: "Northstar Health" },
      { label: "For", value: "Maya Chen" },
      { label: "Grant", value: "gr_7f3a·91c2" },
      { label: "Policy", value: "Riverside · allow" },
      { label: "Action", value: "Appointment request" },
      { label: "Data", value: "Name, DOB, insurance" },
      { label: "Outcome", value: "Patient confirmed" },
    ],
    hash: "9c1e…a47b",
    chained: "Chained to the entry before",
    stamp: "Recorded",
  },
  regions: [
    { rules: "HIPAA, HITECH, BAAs", name: "United States" },
    { rules: "PIPEDA, PHIPA, residency", name: "Canada" },
  ],
  note: "Designed around these laws and contracts from day one. Doe does not hold SOC 2, ISO 27001 or HITRUST today; SOC 2 Type I comes first.",
} as const;
