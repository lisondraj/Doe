/** Scroll-locked brown section under the hero — scene 1. */
export const DOEHEALTH_DESK2_VISIBLE_INTRO = [
  { text: "Personal agents are here.", tone: "cream" },
  { text: "But most won't find your clinic.", tone: "salmon" },
] as const;

/** Scene 2 — the iMessage thread from video1, where the agent can't find the clinic. */
export const DOEHEALTH_DESK2_VISIBLE_THREAD = {
  day: "Today",
  time: "9:41 AM",
  ask: "Can you find a pediatric ENT near Mission that takes Harbor Mutual? My son keeps getting ear infections.",
  reply:
    "I can\u2019t seem to find any pediatric ENT clinics that take Harbor Mutual near you. You could try calling your insurance.",
  caption: ["They know nothing", "about your practice."],
} as const;

/** Scene 3. */
export const DOEHEALTH_DESK2_VISIBLE = {
  title: [
    { text: "We made ", tone: "cream" },
    { text: "1000+ clinics", tone: "salmon" },
    { text: " visible to personal agents.", tone: "cream" },
  ],
  prompt: "See if your clinic was included.",
  search: { label: "Your clinic website", placeholder: "yourclinic.com", submit: "Check" },
} as const;

export const DOEHEALTH_DESK2_AGENTS = {
  title: ["Agents for every\u00A0task,", "for one price."],
} as const;

/** Five agents. The first three sit in the page margins; the rest follow off the right edge. */
export const DOEHEALTH_DESK2_AGENT_CAROUSEL = [
  { name: "Answer", now: "On the line" },
  { name: "Schedule", now: "9:40 still open" },
  { name: "Pay", now: "Copay posted" },
  { name: "Scribe", now: "Follow-up drafted" },
  { name: "Prepare", now: "Your questions are saved" },
] as const;

export const DOEHEALTH_DESK2_AGENT_DETAIL = {
  name: "Front Desk",
  line: "Answers the clinic line and books the visit.",
  quote: "Westfield, this is the front desk. How can I help you today?",
  facts: [
    { label: "Line", value: "(416) 555-0190" },
    { label: "Hours", value: "Weekdays, 8–5" },
    { label: "Voice", value: "Annie" },
  ],
} as const;

export const DOEHEALTH_DESK2_AGENT_LIST = [
  { name: "Front Desk", now: "On the line" },
  { name: "Prior Auth", now: "MRI with Aetna" },
  { name: "Schedule", now: "9:40 still open" },
  { name: "Inbox", now: "Five waiting" },
  { name: "Referral", now: "Cardiology" },
  { name: "Results", now: "A1C is back" },
  { name: "Notes", now: "Follow-up drafted" },
  { name: "Billing", now: "Copay posted" },
  { name: "Refill", now: "Metformin, 90 days" },
  { name: "Intake", now: "Forms are in" },
  { name: "Labs", now: "Friday draw" },
  { name: "Coverage", now: "Aetna, in network" },
  { name: "Reminder", now: "Tomorrow, 9:40" },
  { name: "After hours", now: "On call" },
] as const;

export const DOEHEALTH_DESK2_SUNDAY = {
  title: ["Sunday", "writes it back."],
  lines: ["The week’s finished work becomes the next Genome.", "Nothing the agents completed is thrown away."],
  from: "1.0",
  to: "1.1",
  tasks: [
    { agent: "Front Desk", detail: "Moved Maya Chen to Thursday, 9:40", day: "Monday" },
    { agent: "Prior Auth", detail: "Aetna approved the MRI", day: "Monday" },
    { agent: "Notes", detail: "Signed the diabetes follow-up", day: "Tuesday" },
    { agent: "Referral", detail: "Sent the cardiology packet", day: "Wednesday" },
    { agent: "Results", detail: "Filed the A1C to the chart", day: "Thursday" },
    { agent: "Billing", detail: "Posted the week’s copays", day: "Saturday" },
  ],
  kept: [
    { label: "Greeting", value: "Westfield, this is the front desk." },
    { label: "Auth", value: "Member ID, then the MRI order." },
    { label: "No-show", value: "Reopen the slot, then text." },
  ],
} as const;

export const DOEHEALTH_DESK2_CLOSE = {
  title: ["The desk,", "already working."],
  lines: ["The line, the chart, and the book.", "Westfield, Thursday morning."],
} as const;

export const DOEHEALTH_DESK2_CLOSE_BOOK = [
  { time: "8:10", who: "J. Alvarez" },
  { time: "8:40", who: "R. Okonkwo" },
  { time: "9:40", who: "M. Chen", open: true },
  { time: "10:20", who: "S. Patel" },
  { time: "11:00", who: "L. Nguyen" },
  { time: "11:40", who: "A. Brooks" },
] as const;

/** Beige stretch of the brown section: the title wheel, in order. */
export const DOEHEALTH_DESK2_FIND = {
  titles: [
    ["We help personal", "agents find you."],
    ["Give us your", "clinic website"],
    ["Connect your", "everyday tools."],
    ["We keep every", "agent updated."],
  ],
} as const;
