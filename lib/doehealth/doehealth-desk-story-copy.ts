export const DOEHEALTH_DESK_AGENTS = {
  title: ["Agents for every\u00A0task,", "on your model."],
} as const;

/** Ten agents. The first three sit in the page margins; the rest follow off the right edge. */
export const DOEHEALTH_DESK_AGENT_CAROUSEL = [
  { name: "Front Desk", now: "On the line" },
  { name: "Prior Auth", now: "MRI with Aetna" },
  { name: "Schedule", now: "9:40 still open" },
  { name: "Notes", now: "Follow-up drafted" },
  { name: "Referral", now: "Cardiology" },
  { name: "Results", now: "A1C is back" },
  { name: "Inbox", now: "Five waiting" },
  { name: "Billing", now: "Copay posted" },
  { name: "Refill", now: "Metformin, 90 days" },
  { name: "Reminder", now: "Tomorrow, 9:40" },
] as const;

export type DoeHealthDeskAgentAudienceId = "practice" | "provider" | "patient" | "student";

/**
 * Agents section switch. "practice" is the default and reuses the original carousel above,
 * unchanged; each other audience flips the carousel to its own agents.
 */
export const DOEHEALTH_DESK_AGENT_AUDIENCES: readonly {
  id: DoeHealthDeskAgentAudienceId;
  label: string;
  agents: readonly { name: string; now: string }[];
}[] = [
  { id: "practice", label: "Practice", agents: DOEHEALTH_DESK_AGENT_CAROUSEL },
  {
    id: "provider",
    label: "Provider",
    agents: [
      { name: "Scribe", now: "Note drafted" },
      { name: "Chart Prep", now: "Twelve visits tomorrow" },
      { name: "Orders", now: "Two need a signature" },
      { name: "Results", now: "A1C is back" },
      { name: "Referral", now: "Cardiology" },
      { name: "Prior Auth", now: "MRI with Aetna" },
      { name: "Inbox", now: "Five waiting" },
      { name: "Coding", now: "Level 4 suggested" },
      { name: "Refill", now: "Metformin, 90 days" },
      { name: "Follow-up", now: "Back in six weeks" },
    ],
  },
  {
    id: "patient",
    label: "Patient",
    agents: [
      { name: "Reminder", now: "Tomorrow, 9:40" },
      { name: "Visit Prep", now: "Your questions are saved" },
      { name: "Scheduling", now: "Thursday works" },
      { name: "Results", now: "Your A1C is back" },
      { name: "Refill", now: "Metformin, 90 days" },
      { name: "Care Team", now: "Message sent" },
      { name: "Coverage", now: "Aetna, in network" },
      { name: "Records", now: "Sent to Dr. Shah" },
      { name: "Billing", now: "Copay posted" },
      { name: "Check-in", now: "How was the week?" },
    ],
  },
  {
    id: "student",
    label: "Student",
    agents: [
      { name: "Case Notes", now: "Today’s rounds" },
      { name: "Study Plan", now: "Cardiology, 40 min" },
      { name: "Quiz", now: "Twelve questions ready" },
      { name: "Shadowing", now: "Thursday clinic" },
      { name: "Logbook", now: "Three procedures" },
      { name: "Guidelines", now: "ADA, updated" },
      { name: "Presenting", now: "Morning report" },
      { name: "Feedback", now: "From Dr. Shah" },
      { name: "Research", now: "Two papers queued" },
      { name: "Exam Prep", now: "Step 2, six weeks out" },
    ],
  },
];

export const DOEHEALTH_DESK_AGENT_DETAIL = {
  name: "Front Desk",
  line: "Answers the clinic line and books the visit.",
  quote: "Westfield, this is the front desk. How can I help you today?",
  facts: [
    { label: "Line", value: "(416) 555-0190" },
    { label: "Hours", value: "Weekdays, 8–5" },
    { label: "Voice", value: "Annie" },
  ],
} as const;

export const DOEHEALTH_DESK_AGENT_LIST = [
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

export const DOEHEALTH_DESK_SUNDAY = {
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

export const DOEHEALTH_DESK_CLOSE = {
  title: ["The desk,", "already working."],
  lines: ["The line, the chart, and the book.", "Westfield, Thursday morning."],
} as const;

export const DOEHEALTH_DESK_CLOSE_BOOK = [
  { time: "8:10", who: "J. Alvarez" },
  { time: "8:40", who: "R. Okonkwo" },
  { time: "9:40", who: "M. Chen", open: true },
  { time: "10:20", who: "S. Patel" },
  { time: "11:00", who: "L. Nguyen" },
  { time: "11:40", who: "A. Brooks" },
] as const;
