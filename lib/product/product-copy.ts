import type { ProductNavTab } from "@/lib/product/product-nav";

export const PRODUCT_LANDING_GREETING = "Good morning, Dr. Chen";

export const PRODUCT_LANDING_GREETING_LINE = "Good morning,";

export const PRODUCT_LANDING_GREETING_NAME = "Dr. Chen";

export const PRODUCT_LANDING_TAB_LABEL = "Today";

/** @deprecated Use PRODUCT_LANDING_DAY_SUMMARY panels. */
export const PRODUCT_LANDING_HEADLINE = "Last 24 hours · Today ahead";

/** @deprecated Use PRODUCT_LANDING_DAY_SUMMARY panels. */
export const PRODUCT_LANDING_SUBHEAD =
  "A visual summary of overnight activity and what is coming on the clinic line today.";

export const PRODUCT_LANDING_DAY_SUMMARY = {
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

export const PRODUCT_LANDING_LIVE_QUOTE = {
  caller: "Sarah Westfield",
  callDuration: "0m6s",
  line1: {
    beforeName: "Hello this is ",
    name: "Sarah",
    afterName: ", I would like",
  },
  line2: {
    beforeSubject: "to book an ",
    subject: "appointment",
  },
} as const;

export const PRODUCT_LANDING_AGENT_REPLY = {
  caller: "Doe Agent",
  callDuration: "0m9s",
  line1: "Before we begin, please read the",
  line2: "code sent to your phone",
} as const;

export const PRODUCT_LANDING_AGENT_STEPS = [
  "Sarah's chart",
  "Auth code",
  "Calendar",
] as const;

export const PRODUCT_LANDING_CALL_OUTCOME = {
  caller: "Sarah Westfield",
  phone: "(512) 555-0192",
  totalCallTime: "1m18s",
  status: "Appointment Booked",
} as const;

export const PRODUCT_LANDING_CALL_HISTORY_LABEL = "Last call history";

export const PRODUCT_LANDING_CALL_HISTORY_ORBIT_AGENTS = [
  { id: "voice", icon: "voice", nameLines: ["Voice", "Agent"] },
  { id: "research", icon: "research", nameLines: ["Research", "Agent"] },
  { id: "scheduling", icon: "calendar", nameLines: ["Scheduling", "Agent"] },
  { id: "inbox", icon: "inbox", nameLines: ["Inbox", "Agent"] },
  { id: "billing", icon: "billing", nameLines: ["Billing", "Agent"] },
  { id: "referrals", icon: "referrals", nameLines: ["Referrals", "Agent"] },
  { id: "prior-auth", icon: "prior-auth", nameLines: ["Prior", "Auth"] },
] as const;

export const PRODUCT_LANDING_CALL_HISTORY_ORBIT = {
  labelLines: ["Active", "Agents"],
  editAgentsLabel: "Edit Agents",
} as const;

export const PRODUCT_LANDING_CALL_HISTORY_ACTIONS = [
  "Call Back",
  "See Transcript",
  "Review Actions",
] as const;

export const PRODUCT_LANDING_PRIMARY_CTA = "Listen in";

export const PRODUCT_LANDING_SECONDARY_CTA = "Open call log";

export const PRODUCT_LANDING_STATUS_VALUE = "Live";

export const PRODUCT_LANDING_STATUS_NOTE = "Main line · (512) 555-0140";

export const PRODUCT_LANDING_SHIFT = {
  overnight: "4 after-hours calls handled overnight · 2 notes waiting for you",
  callsToday: "47",
  resolvedPct: "83%",
  waiting: "2",
  forYou: "3",
} as const;

export const PRODUCT_LANDING_LINES = [
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

export const PRODUCT_LANDING_CONSOLE = {
  stateLabel: "Live on main line",
  caller: "M. Nguyen",
  patientContext: "Established patient · last visit Feb 12",
  reason: "Reschedule lab review with Dr. Chen",
  line: "Main clinic line",
  duration: "1:14",
  agentLine: "Checking Thursday afternoon openings with your schedule…",
  agentStatus: "Booking",
} as const;

export const PRODUCT_LANDING_TRANSCRIPT = [
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

export const PRODUCT_LANDING_QUEUE = [
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

export const PRODUCT_LANDING_ATTENTION = [
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

export const PRODUCT_LANDING_PULSE = [
  { label: "Calls today", value: PRODUCT_LANDING_SHIFT.callsToday },
  { label: "Resolved by Doe", value: PRODUCT_LANDING_SHIFT.resolvedPct },
  { label: "Waiting on you", value: PRODUCT_LANDING_SHIFT.forYou },
] as const;

/** @deprecated Use PRODUCT_LANDING_SHIFT. */
export const PRODUCT_LANDING_BRIEF = PRODUCT_LANDING_SHIFT.overnight;

export const PRODUCT_PLACEHOLDER_COPY: Record<"calls" | "agents" | "settings", string> = {
  calls: "Call history and live monitoring will live here.",
  agents: "Agent configuration and rollout controls will live here.",
  settings: "Clinic settings and integrations will live here.",
};

export function isProductPlaceholderTab(tab: ProductNavTab): tab is "calls" | "agents" | "settings" {
  return tab !== "landing";
}

/** @deprecated Landing redesign no longer uses capability cards. */
export const PRODUCT_LANDING_CAPABILITIES = [
  {
    title: "Answers the clinic line",
    detail: "Books, intakes, and triages while you stay with patients.",
  },
] as const;

/** @deprecated Use PRODUCT_LANDING_PULSE. */
export const PRODUCT_LANDING_METRICS = PRODUCT_LANDING_PULSE;

/** @deprecated Use PRODUCT_LANDING_TRANSCRIPT + PRODUCT_LANDING_CONSOLE. */
export const PRODUCT_LANDING_CALL_PREVIEW = {
  caller: PRODUCT_LANDING_CONSOLE.caller,
  line: PRODUCT_LANDING_CONSOLE.line,
  duration: PRODUCT_LANDING_CONSOLE.duration,
  transcript: PRODUCT_LANDING_TRANSCRIPT,
} as const;
