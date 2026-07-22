import type { Product2NavTab } from "@/lib/product2/product2-nav";

export const PRODUCT2_LANDING_GREETING = "Good morning, Dr. Chen";

export const PRODUCT2_LANDING_GREETING_LINE = "Good morning,";

export const PRODUCT2_LANDING_GREETING_NAME = "Dr. Chen";

export const PRODUCT2_LANDING_TAB_LABEL = "Today";

export const PRODUCT2_CALL_HISTORY_TAB_LABEL = "Call History";

export const PRODUCT2_CALL_HISTORY_CONVO_VIEW_FULL = "Full";
export const PRODUCT2_CALL_HISTORY_CONVO_VIEW_AGENT_ONLY = "Agent Only";

export const PRODUCT2_CALL_HISTORY_RAIL_ACTIONS = [
  "Call Back",
  "Actions",
  "Download Transcript",
] as const;

export const PRODUCT2_CALL_HISTORY_COMPOSER_PLACEHOLDER = "Ask about this call…";

export const PRODUCT2_CALL_HISTORY_COMPOSER_MODEL = "Fable 5";

export const PRODUCT2_CALL_HISTORY_HERO_NAME = {
  topLine: "Sarah",
  bottomLine: "Westfield",
} as const;

export const PRODUCT2_CALL_HISTORY_VISIT_TITLE = {
  topLine: "Metformin Refill",
  bottomLine: "Appointment",
} as const;

export const PRODUCT2_CALL_HISTORY_VISIT_BOOKED = {
  prefix: "Booked for",
  datetime: "Tuesday, Jul 22 · 10:30 AM",
} as const;

export const PRODUCT2_CALL_HISTORY_HERO_DETAILS = [
  { label: "DOB", value: "Mar 14, 1988" },
  { label: "Insurance", value: "Blue Cross PPO" },
  { label: "Last Seen", value: "Feb 12, 2026" },
] as const;

export const PRODUCT2_CALL_HISTORY_A1C_TREND = {
  label: "Last A1C",
  readings: [
    { date: "Jul '24", value: 6.5 },
    { date: "Oct '24", value: 6.9 },
    { date: "Jan '25", value: 7.3 },
    { date: "Apr '25", value: 6.8 },
    { date: "Jul '25", value: 6.4 },
    { date: "Oct '25", value: 6.5 },
    { date: "Jul '26", value: 6.9 },
  ],
  doseChanges: [
    { atIndex: 1, dose: 500 },
    { atIndex: 3, dose: 750 },
    { atIndex: 5, dose: 500 },
  ],
} as const;

/** @deprecated Use PRODUCT2_LANDING_DAY_SUMMARY panels. */
export const PRODUCT2_LANDING_HEADLINE = "Last 24 hours · Today ahead";

/** @deprecated Use PRODUCT2_LANDING_DAY_SUMMARY panels. */
export const PRODUCT2_LANDING_SUBHEAD =
  "A visual summary of overnight activity and what is coming on the clinic line today.";

export const PRODUCT2_LANDING_DAY_SUMMARY = {
  last24h: {
    label: "Last 24 hours",
    totalCalls: "47",
    overnightCalls: "4",
    resolvedPct: 83,
    notesWaiting: "2",
    volume: [14, 10, 8, 6, 12, 22, 38, 52, 68, 74, 58, 42],
    volumeLabels: ["12a", "4a", "8a", "12p", "4p", "8p"],
    split: { overnight: 4, clinicHours: 43 },
    tiles: [
      { id: "scheduling", label: "Scheduling", value: "18", detail: "appointments & slots" },
      { id: "refills", label: "Refills", value: "11", detail: "medication requests" },
      { id: "admin", label: "Admin", value: "18", detail: "billing & prior auth" },
    ],
  },
  todayAhead: {
    label: "Today ahead",
    liveCaller: "M. Nguyen",
    liveDetail: "Reschedule on main line",
    queue: "2",
    needsYou: "3",
    peakWindow: "10–11 AM",
    peakDetail: "Expected call peak",
    nextAppointment: {
      label: "Next appointment",
      time: "9:30 AM",
      relative: "In 47 min",
      patient: "Elena Ruiz",
      detail: "Annual physical",
      location: "Room 204",
    },
    timeline: [
      { id: "now", time: "Now", label: "Live", detail: "M. Nguyen · booking", state: "active" as const },
      { id: "queue-1", time: "+2m", label: "Queue", detail: "S. Patel · prior auth", state: "queued" as const },
      { id: "queue-2", time: "+4m", label: "Queue", detail: "New patient inquiry", state: "queued" as const },
      { id: "review", time: "8:15", label: "Review", detail: "Metformin refill note", state: "pending" as const },
    ],
  },
} as const;

export const PRODUCT2_LANDING_LIVE_CONVO = [
  {
    id: "caller-open",
    role: "caller" as const,
    caller: "Sarah Westfield",
    callDuration: "0m6s",
    callDurationIso: "PT0M6S",
    lines: [
      { before: "Hi, this is ", tag: "Sarah", after: ". I need a" },
      { before: "refill visit for my ", tag: "Metformin" },
    ],
  },
  {
    id: "agent-intake",
    role: "agent" as const,
    caller: "Doe Agent",
    callDuration: "0m14s",
    callDurationIso: "PT0M14S",
    steps: ["Generated confirmation code"],
    lines: [
      "Before we begin, please state your date of birth",
      "and read the code sent to your phone",
    ],
  },
  {
    id: "caller-verify",
    role: "caller" as const,
    caller: "Sarah Westfield",
    callDuration: "0m22s",
    callDurationIso: "PT0M22S",
    lines: [
      { before: "Sure, my date of birth is ", tag: "March 14, 1988", after: " and" },
      { before: "the code is ", tag: "482931" },
    ],
  },
  {
    id: "agent-verified",
    role: "agent" as const,
    caller: "Doe Agent",
    callDuration: "0m26s",
    callDurationIso: "PT0M26S",
    chartProfile: {
      name: "Sarah Westfield",
      tags: ["March 14, 1988", "Blue Cross PPO"],
      highlights: [
        { title: "Metformin Started", value: "Jan 14, 2024" },
        { title: "Current Dose", value: "500mg" },
        { title: "Blood Pressure", value: "128/82", trend: "up" },
      ],
      a1cTrend: {
        label: "Last A1C",
        readings: [
          { date: "Jul '24", value: 6.5 },
          { date: "Oct '24", value: 6.9 },
          { date: "Jan '25", value: 7.3 },
          { date: "Apr '25", value: 6.8 },
          { date: "Jul '25", value: 6.4 },
          { date: "Oct '25", value: 6.5 },
          { date: "Jul '26", value: 6.9 },
        ],
        doseChanges: [
          { atIndex: 1, dose: 500 },
          { atIndex: 3, dose: 750 },
          { atIndex: 5, dose: 500 },
        ],
      },
    },
    steps: ["Confirmed patient identity", "Accessed chart"],
    lines: ["Thank you, Sarah.", "I've pulled up your chart."],
  },
  {
    id: "agent-side-effects",
    role: "agent" as const,
    caller: "Doe Agent",
    callDuration: "0m34s",
    callDurationIso: "PT0M34S",
    steps: ["Side effect check", "Symptom log", "Visit slots"],
    lines: ["Any side effects since", "your last refill?"],
  },
  {
    id: "caller-side-effects",
    role: "caller" as const,
    caller: "Sarah Westfield",
    callDuration: "0m42s",
    callDurationIso: "PT0M42S",
    lines: [
      { before: "Just mild ", tag: "nausea", after: ", nothing new" },
      { before: "and no ", tag: "dizziness" },
    ],
  },
  {
    id: "agent-schedule",
    role: "agent" as const,
    caller: "Doe Agent",
    callDuration: "0m54s",
    callDurationIso: "PT0M54S",
    steps: ["Booking refill visit", "Prior auth pending", "Rx routing"],
    lines: [
      { before: "I have ", tag: "Tuesday", after: " at 10:30 AM" },
      { before: "with ", tag: "Dr. Chen", after: " for the refill visit." },
    ],
  },
  {
    id: "caller-confirm",
    role: "caller" as const,
    caller: "Sarah Westfield",
    callDuration: "1m02s",
    callDurationIso: "PT1M2S",
    lines: [{ before: "", tag: "Tuesday works", after: " for me" }],
  },
  {
    id: "agent-close",
    role: "agent" as const,
    caller: "Doe Agent",
    callDuration: "1m14s",
    callDurationIso: "PT1M14S",
    steps: ["Visit booked", "Confirmation sent", "Chart updated"],
    lines: ["Confirmation sent by text.", "Dr. Chen will review your prior auth."],
  },
] as const;

/** @deprecated Use PRODUCT2_LANDING_LIVE_CONVO. */
export const PRODUCT2_LANDING_LIVE_QUOTE = {
  caller: "Sarah Westfield",
  callDuration: "0m6s",
  line1: {
    beforeName: "Hi, this is ",
    name: "Sarah",
    afterName: ". I need a",
  },
  line2: {
    beforeSubject: "refill visit for my ",
    subject: "Metformin",
  },
} as const;

/** @deprecated Use PRODUCT2_LANDING_LIVE_CONVO. */
export const PRODUCT2_LANDING_AGENT_REPLY = {
  caller: "Doe Agent",
  callDuration: "0m14s",
  line1: "Before we begin, please state your date of birth",
  line2: "and read the code sent to your phone",
} as const;

/** @deprecated Use PRODUCT2_LANDING_LIVE_CONVO. */
export const PRODUCT2_LANDING_AGENT_STEPS = [
  "Side effect check",
  "Symptom log",
  "Visit slots",
] as const;

export const PRODUCT2_LANDING_CALL_OUTCOME = {
  caller: "Sarah Westfield",
  phone: "(512) 555-0192",
  totalCallTime: "1m14s",
  status: "Refill visit scheduled",
} as const;

export const PRODUCT2_LANDING_CALL_HISTORY_LABEL = "Last call history";

export const PRODUCT2_LANDING_CALL_HISTORY_ORBIT_AGENTS = [
  { id: "voice", icon: "voice", nameLines: ["Voice", "Agent"] },
  { id: "research", icon: "research", nameLines: ["Research", "Agent"] },
  { id: "scheduling", icon: "calendar", nameLines: ["Scheduling", "Agent"] },
  { id: "inbox", icon: "inbox", nameLines: ["Inbox", "Agent"] },
  { id: "billing", icon: "billing", nameLines: ["Billing", "Agent"] },
  { id: "referrals", icon: "referrals", nameLines: ["Referrals", "Agent"] },
  { id: "prior-auth", icon: "prior-auth", nameLines: ["Prior", "Auth"] },
] as const;

export const PRODUCT2_LANDING_CALL_HISTORY_ORBIT = {
  labelLines: ["Active", "Agents"],
  editAgentsLabel: "Edit Agents",
} as const;

export const PRODUCT2_LANDING_CALL_HISTORY_ACTIONS = [
  "Call Back",
  "See Transcript",
  "Review Actions",
] as const;

export const PRODUCT2_LANDING_PRIMARY_CTA = "Listen in";

export const PRODUCT2_LANDING_SECONDARY_CTA = "Open call log";

export const PRODUCT2_LANDING_STATUS_VALUE = "Live";

export const PRODUCT2_LANDING_STATUS_NOTE = "Main line · (512) 555-0140";

export const PRODUCT2_LANDING_SHIFT = {
  overnight: "4 after-hours calls handled overnight · 2 notes waiting for you",
  callsToday: "47",
  resolvedPct: "83%",
  waiting: "2",
  forYou: "3",
} as const;

export const PRODUCT2_LANDING_LINES = [
  {
    id: "main",
    label: "Main clinic line",
    number: "(512) 555-0140",
    status: "live" as const,
    detail: "Active call · M. Nguyen",
  },
  {
    id: "after-hours",
    label: "After-hours line",
    number: "(512) 555-0141",
    status: "standby" as const,
    detail: "Routes to Doe when clinic is closed",
  },
] as const;

export const PRODUCT2_LANDING_CONSOLE = {
  stateLabel: "Live on main line",
  caller: "M. Nguyen",
  patientContext: "Established patient · last visit Feb 12",
  reason: "Reschedule lab review with Dr. Chen",
  line: "Main clinic line",
  duration: "1:14",
  agentLine: "Checking Thursday afternoon openings with your schedule…",
  agentStatus: "Booking",
} as const;

export const PRODUCT2_LANDING_TRANSCRIPT = [
  {
    speaker: "Patient" as const,
    text: "Hi, I need to move my appointment from next Tuesday.",
    time: "0:08",
  },
  {
    speaker: "Doe" as const,
    text: "Of course. Are you looking for later this week, or would next week work better?",
    time: "0:14",
  },
  {
    speaker: "Patient" as const,
    text: "Thursday afternoon, if anything is open with Dr. Chen.",
    time: "0:22",
  },
  {
    speaker: "Doe" as const,
    text: "I have 2:30 PM or 4:00 PM on Thursday. Which would you prefer?",
    time: "0:31",
  },
  {
    speaker: "Patient" as const,
    text: "2:30 works. Do I still need to fast for the labs?",
    time: "0:38",
  },
  {
    speaker: "Doe" as const,
    text: "No fasting for this visit. I will text a confirmation and include prep instructions.",
    time: "0:46",
  },
] as const;

export const PRODUCT2_LANDING_QUEUE = [
  {
    id: "queue-1",
    caller: "S. Patel",
    reason: "Prior auth status for MRI",
    wait: "~2 min",
  },
  {
    id: "queue-2",
    caller: "Unknown caller",
    reason: "New patient scheduling inquiry",
    wait: "~4 min",
  },
] as const;

export const PRODUCT2_LANDING_ATTENTION = [
  {
    id: "attn-1",
    urgency: "high" as const,
    label: "Overnight",
    title: "Metformin refill captured",
    detail: "Pharmacy review queued · chart note ready · left at 7:52 AM",
    action: "Review note",
  },
  {
    id: "attn-2",
    urgency: "normal" as const,
    label: "Handoff",
    title: "Billing question waiting",
    detail: "J. Ortiz · transcript and account flags attached",
    action: "Take call",
  },
  {
    id: "attn-3",
    urgency: "normal" as const,
    label: "Referral",
    title: "Spanish intake completed",
    detail: "R. Delgado · cardiology referral ready to send",
    action: "Open chart",
  },
] as const;

export const PRODUCT2_LANDING_PULSE = [
  { label: "Calls today", value: PRODUCT2_LANDING_SHIFT.callsToday },
  { label: "Resolved by Doe", value: PRODUCT2_LANDING_SHIFT.resolvedPct },
  { label: "Waiting on you", value: PRODUCT2_LANDING_SHIFT.forYou },
] as const;

/** @deprecated Use PRODUCT2_LANDING_SHIFT. */
export const PRODUCT2_LANDING_BRIEF = PRODUCT2_LANDING_SHIFT.overnight;

export const PRODUCT2_PLACEHOLDER_COPY: Record<"calls" | "agents" | "settings", string> = {
  calls: "Call history and live monitoring will live here.",
  agents: "Agent configuration and rollout controls will live here.",
  settings: "Clinic settings and integrations will live here.",
};

export function isProduct2PlaceholderTab(tab: Product2NavTab): tab is "calls" | "agents" | "settings" {
  return tab !== "landing";
}

/** @deprecated Landing redesign no longer uses capability cards. */
export const PRODUCT2_LANDING_CAPABILITIES = [
  {
    title: "Answers the clinic line",
    detail: "Books, intakes, and triages while you stay with patients.",
  },
] as const;

/** @deprecated Use PRODUCT2_LANDING_PULSE. */
export const PRODUCT2_LANDING_METRICS = PRODUCT2_LANDING_PULSE;

/** @deprecated Use PRODUCT2_LANDING_TRANSCRIPT + PRODUCT2_LANDING_CONSOLE. */
export const PRODUCT2_LANDING_CALL_PREVIEW = {
  caller: PRODUCT2_LANDING_CONSOLE.caller,
  line: PRODUCT2_LANDING_CONSOLE.line,
  duration: PRODUCT2_LANDING_CONSOLE.duration,
  transcript: PRODUCT2_LANDING_TRANSCRIPT,
} as const;
