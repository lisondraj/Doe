export const PRODUCTNEW_PROFILE = {
  name: "Dr. Maya Chen",
  company: "Harborview Family Medicine",
} as const;

export const PRODUCTNEW_CLINIC = {
  name: "Harborview Family Medicine",
  doctor: "Dr. Maya Chen",
  date: "Monday, August 24",
  time: "7:48 AM",
} as const;

export const PRODUCTNEW_VOICE = {
  since: "6:00 AM",
  total: 47,
  hourly: [
    { label: "6", value: 3 },
    { label: "7", value: 8 },
    { label: "8", value: 14 },
    { label: "9", value: 12 },
    { label: "10", value: 6 },
    { label: "11", value: 4 },
  ],
  resolved: 41,
  escalated: 6,
  avgDuration: "1m 48s",
  categories: [
    { label: "Scheduling", count: 18, pct: 38 },
    { label: "Prescription refill", count: 12, pct: 26 },
    { label: "Billing question", count: 9, pct: 19 },
    { label: "Insurance verification", count: 5, pct: 11 },
    { label: "Other", count: 3, pct: 6 },
  ],
} as const;

export const PRODUCTNEW_APPOINTMENTS = {
  total: 24,
  checkedIn: 9,
  inRoom: 4,
  upcoming: 8,
  openSlots: 3,
  noShows: 1,
  schedule: [
    { time: "08:00", end: "08:30", patient: "J. Alvarez", type: "Annual physical", status: "done" },
    { time: "08:30", end: "09:00", patient: "R. Kim", type: "Follow-up", status: "done" },
    { time: "09:00", end: "09:30", patient: "S. Patel", type: "New patient", status: "active" },
    { time: "09:30", end: "10:00", patient: "T. Nguyen", type: "Lab review", status: "upcoming" },
    { time: "10:00", end: "10:30", patient: "M. Garcia", type: "Follow-up", status: "upcoming" },
    { time: "10:30", end: "11:00", patient: "Open slot", type: "", status: "open" },
    { time: "11:00", end: "11:30", patient: "D. Brooks", type: "Annual physical", status: "upcoming" },
    { time: "11:30", end: "12:00", patient: "Open slot", type: "", status: "open" },
  ],
} as const;

export type ProductNewScheduleStatus = "done" | "active" | "upcoming" | "open";

export type ProductNewScheduleAppt = {
  id: string;
  room: number;
  time: string;
  end: string;
  patient: string;
  type: string;
  provider: string;
  status: ProductNewScheduleStatus;
};

export const PRODUCTNEW_ROOMS = [1, 2, 3, 4] as const;

export const PRODUCTNEW_SCHEDULE_DAY = "Monday, August 24";

export const PRODUCTNEW_SCHEDULE: readonly ProductNewScheduleAppt[] = [
  { id: "sch-1", room: 1, time: "08:00", end: "08:30", patient: "J. Alvarez", type: "Annual physical", provider: "Dr. Chen", status: "done" },
  { id: "sch-2", room: 1, time: "08:30", end: "09:00", patient: "R. Kim", type: "Follow-up", provider: "Dr. Chen", status: "done" },
  { id: "sch-3", room: 1, time: "09:30", end: "10:00", patient: "T. Nguyen", type: "Lab review", provider: "Dr. Chen", status: "upcoming" },
  { id: "sch-4", room: 1, time: "11:00", end: "11:30", patient: "D. Brooks", type: "Annual physical", provider: "Dr. Chen", status: "upcoming" },
  { id: "sch-5", room: 1, time: "13:30", end: "14:00", patient: "K. Reyes", type: "Follow-up", provider: "Dr. Chen", status: "upcoming" },
  { id: "sch-6", room: 1, time: "15:30", end: "16:00", patient: "Open slot", type: "", provider: "Dr. Chen", status: "open" },

  { id: "sch-7", room: 2, time: "09:00", end: "09:45", patient: "S. Patel", type: "New patient", provider: "Dr. Chen", status: "active" },
  { id: "sch-8", room: 2, time: "10:30", end: "11:00", patient: "Open slot", type: "", provider: "Dr. Chen", status: "open" },
  { id: "sch-9", room: 2, time: "13:00", end: "13:30", patient: "A. Wong", type: "Follow-up", provider: "N. Ortiz, NP", status: "upcoming" },
  { id: "sch-10", room: 2, time: "15:00", end: "15:30", patient: "L. Foster", type: "Annual physical", provider: "N. Ortiz, NP", status: "upcoming" },

  { id: "sch-11", room: 3, time: "08:30", end: "09:00", patient: "Open slot", type: "", provider: "N. Ortiz, NP", status: "open" },
  { id: "sch-12", room: 3, time: "10:00", end: "10:30", patient: "M. Garcia", type: "Follow-up", provider: "Dr. Chen", status: "upcoming" },
  { id: "sch-13", room: 3, time: "13:30", end: "14:15", patient: "P. Singh", type: "New patient intake", provider: "N. Ortiz, NP", status: "upcoming" },
  { id: "sch-14", room: 3, time: "16:00", end: "16:30", patient: "Open slot", type: "", provider: "Dr. Chen", status: "open" },

  { id: "sch-15", room: 4, time: "08:00", end: "08:30", patient: "C. Diaz", type: "Vaccine admin", provider: "Dr. Chen", status: "done" },
  { id: "sch-16", room: 4, time: "09:30", end: "10:00", patient: "Open slot", type: "", provider: "Dr. Chen", status: "open" },
  { id: "sch-17", room: 4, time: "11:30", end: "12:00", patient: "B. Ahmadi", type: "Lab draw", provider: "N. Ortiz, NP", status: "upcoming" },
  { id: "sch-18", room: 4, time: "14:30", end: "15:00", patient: "E. Ramos", type: "Follow-up", provider: "Dr. Chen", status: "upcoming" },
  { id: "sch-19", room: 4, time: "16:30", end: "17:00", patient: "Open slot", type: "", provider: "Dr. Chen", status: "open" },
] as const;

export type ProductNewPatientChart = {
  name: string;
  age: number;
  sex: "M" | "F";
  mrn: string;
  vitals: { bp: string; hr: string; temp: string; weight: string } | null;
  allergies: string[];
  medications: string[];
  problems: string[];
  lastVisit: string;
};

export const PRODUCTNEW_PATIENT_CHARTS: readonly ProductNewPatientChart[] = [
  {
    name: "J. Alvarez",
    age: 47,
    sex: "M",
    mrn: "MRN-100234",
    vitals: { bp: "128/82", hr: "72 bpm", temp: "98.4°F", weight: "184 lb" },
    allergies: ["Penicillin"],
    medications: ["Lisinopril 10mg", "Atorvastatin 20mg"],
    problems: ["Hypertension", "Hyperlipidemia"],
    lastVisit: "Feb 12 · Annual physical",
  },
  {
    name: "R. Kim",
    age: 34,
    sex: "F",
    mrn: "MRN-100455",
    vitals: { bp: "118/76", hr: "68 bpm", temp: "98.2°F", weight: "142 lb" },
    allergies: [],
    medications: ["Sertraline 50mg"],
    problems: ["Generalized anxiety"],
    lastVisit: "Jun 3 · Follow-up",
  },
  {
    name: "T. Nguyen",
    age: 61,
    sex: "M",
    mrn: "MRN-100112",
    vitals: { bp: "132/84", hr: "76 bpm", temp: "98.6°F", weight: "201 lb" },
    allergies: ["Sulfa drugs"],
    medications: ["Metformin 500mg", "Lisinopril 20mg"],
    problems: ["Type 2 diabetes", "Hypertension"],
    lastVisit: "Aug 10 · Lab draw",
  },
  {
    name: "D. Brooks",
    age: 29,
    sex: "M",
    mrn: "MRN-100987",
    vitals: { bp: "116/72", hr: "64 bpm", temp: "98.1°F", weight: "168 lb" },
    allergies: [],
    medications: [],
    problems: [],
    lastVisit: "Aug 2024 · Annual physical",
  },
  {
    name: "K. Reyes",
    age: 52,
    sex: "F",
    mrn: "MRN-100321",
    vitals: { bp: "122/78", hr: "70 bpm", temp: "98.3°F", weight: "156 lb" },
    allergies: ["Latex"],
    medications: ["Levothyroxine 75mcg"],
    problems: ["Hypothyroidism"],
    lastVisit: "May 20 · Follow-up",
  },
  {
    name: "S. Patel",
    age: 24,
    sex: "F",
    mrn: "MRN-101015",
    vitals: null,
    allergies: [],
    medications: [],
    problems: [],
    lastVisit: "No prior visits on file",
  },
  {
    name: "A. Wong",
    age: 39,
    sex: "M",
    mrn: "MRN-100678",
    vitals: { bp: "120/78", hr: "74 bpm", temp: "98.5°F", weight: "175 lb" },
    allergies: [],
    medications: ["Albuterol inhaler, PRN"],
    problems: ["Asthma"],
    lastVisit: "Jul 15 · Follow-up",
  },
  {
    name: "L. Foster",
    age: 66,
    sex: "F",
    mrn: "MRN-100056",
    vitals: { bp: "138/88", hr: "78 bpm", temp: "98.4°F", weight: "149 lb" },
    allergies: ["Codeine"],
    medications: ["Amlodipine 5mg", "Aspirin 81mg"],
    problems: ["Hypertension", "Osteoarthritis"],
    lastVisit: "Aug 2024 · Annual physical",
  },
  {
    name: "M. Garcia",
    age: 45,
    sex: "F",
    mrn: "MRN-100432",
    vitals: { bp: "124/80", hr: "72 bpm", temp: "98.3°F", weight: "160 lb" },
    allergies: [],
    medications: ["Omeprazole 20mg"],
    problems: ["GERD"],
    lastVisit: "Jun 28 · Follow-up",
  },
  {
    name: "P. Singh",
    age: 31,
    sex: "M",
    mrn: "MRN-101028",
    vitals: null,
    allergies: [],
    medications: [],
    problems: [],
    lastVisit: "No prior visits on file",
  },
  {
    name: "C. Diaz",
    age: 5,
    sex: "F",
    mrn: "MRN-100789",
    vitals: { bp: "—", hr: "96 bpm", temp: "98.6°F", weight: "42 lb" },
    allergies: [],
    medications: [],
    problems: [],
    lastVisit: "Aug 2024 · Well-child visit",
  },
  {
    name: "B. Ahmadi",
    age: 58,
    sex: "M",
    mrn: "MRN-100221",
    vitals: { bp: "130/84", hr: "68 bpm", temp: "98.2°F", weight: "190 lb" },
    allergies: ["Iodinated contrast"],
    medications: ["Metoprolol 25mg"],
    problems: ["Coronary artery disease"],
    lastVisit: "Jul 30 · Lab draw",
  },
  {
    name: "E. Ramos",
    age: 42,
    sex: "F",
    mrn: "MRN-100543",
    vitals: { bp: "118/74", hr: "70 bpm", temp: "98.4°F", weight: "138 lb" },
    allergies: [],
    medications: ["Sumatriptan, PRN"],
    problems: ["Migraine"],
    lastVisit: "May 5 · Follow-up",
  },
] as const;

export const PRODUCTNEW_FINANCES = {
  collected: 8420,
  outstanding: 2140,
  pendingClaims: 6380,
  copays: 3100,
  insurance: 5320,
  weekTrend: [4200, 5100, 4800, 6200, 5900, 7100, 8420],
} as const;

export const PRODUCTNEW_CLINIC_STATUS = {
  waitingRoom: 4,
  avgWaitMin: 8,
  labsPending: 5,
  labsCritical: 1,
  roomsActive: 3,
  roomsTotal: 4,
} as const;

export type ProductNewClaimStatus = "submitted" | "in-review" | "paid" | "denied";

export type ProductNewClaim = {
  id: string;
  patient: string;
  payer: string;
  amount: number;
  submitted: string;
  status: ProductNewClaimStatus;
  timeline: { date: string; label: string; detail?: string }[];
};

export const PRODUCTNEW_CLAIMS: readonly ProductNewClaim[] = [
  {
    id: "CLM-4821",
    patient: "M. Garcia",
    payer: "Blue Shield PPO",
    amount: 340,
    submitted: "Aug 21",
    status: "in-review",
    timeline: [
      { date: "Aug 21", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 22", label: "Payer received", detail: "Acknowledged by Blue Shield" },
      { date: "Aug 24", label: "Under review", detail: "Awaiting adjudication" },
    ],
  },
  {
    id: "CLM-4819",
    patient: "T. Nguyen",
    payer: "Aetna HMO",
    amount: 185,
    submitted: "Aug 19",
    status: "paid",
    timeline: [
      { date: "Aug 19", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 20", label: "Payer received", detail: "Acknowledged by Aetna" },
      { date: "Aug 22", label: "Adjudicated", detail: "Approved at contracted rate" },
      { date: "Aug 23", label: "Payment posted", detail: "$185.00 deposited via ERA" },
    ],
  },
  {
    id: "CLM-4815",
    patient: "S. Patel",
    payer: "Blue Shield PPO",
    amount: 520,
    submitted: "Aug 18",
    status: "denied",
    timeline: [
      { date: "Aug 18", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 19", label: "Payer received", detail: "Acknowledged by Blue Shield" },
      { date: "Aug 21", label: "Denied", detail: "Missing prior authorization" },
      { date: "Aug 22", label: "Appeal drafted", detail: "Assigned to James Okafor" },
    ],
  },
  {
    id: "CLM-4812",
    patient: "J. Alvarez",
    payer: "Medicare",
    amount: 210,
    submitted: "Aug 17",
    status: "paid",
    timeline: [
      { date: "Aug 17", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 18", label: "Payer received", detail: "Acknowledged by Medicare" },
      { date: "Aug 20", label: "Adjudicated", detail: "Approved at contracted rate" },
      { date: "Aug 21", label: "Payment posted", detail: "$210.00 deposited via ERA" },
    ],
  },
  {
    id: "CLM-4808",
    patient: "R. Kim",
    payer: "United Healthcare",
    amount: 275,
    submitted: "Aug 15",
    status: "submitted",
    timeline: [
      { date: "Aug 15", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 16", label: "Payer received", detail: "Acknowledged by United Healthcare" },
    ],
  },
  {
    id: "CLM-4802",
    patient: "D. Brooks",
    payer: "Aetna HMO",
    amount: 150,
    submitted: "Aug 12",
    status: "paid",
    timeline: [
      { date: "Aug 12", label: "Claim submitted", detail: "Filed via Availity" },
      { date: "Aug 13", label: "Payer received", detail: "Acknowledged by Aetna" },
      { date: "Aug 15", label: "Adjudicated", detail: "Approved at contracted rate" },
      { date: "Aug 16", label: "Payment posted", detail: "$150.00 deposited via ERA" },
    ],
  },
] as const;

export type ProductNewPayment = {
  id: string;
  patient: string;
  method: "Card" | "Insurance" | "Cash" | "ACH";
  amount: number;
  date: string;
  note: string;
};

export const PRODUCTNEW_PAYMENTS: readonly ProductNewPayment[] = [
  { id: "PMT-9931", patient: "D. Brooks", method: "Card", amount: 40, date: "11:14 AM", note: "Copay · annual physical" },
  { id: "PMT-9930", patient: "T. Nguyen", method: "Insurance", amount: 185, date: "10:52 AM", note: "Aetna ERA deposit" },
  { id: "PMT-9929", patient: "S. Patel", method: "Card", amount: 60, date: "10:05 AM", note: "Copay · new patient visit" },
  { id: "PMT-9928", patient: "M. Garcia", method: "Cash", amount: 25, date: "9:47 AM", note: "Copay · follow-up" },
  { id: "PMT-9927", patient: "R. Kim", method: "ACH", amount: 120, date: "9:20 AM", note: "Outstanding balance" },
  { id: "PMT-9926", patient: "J. Alvarez", method: "Card", amount: 40, date: "8:41 AM", note: "Copay · annual physical" },
] as const;

export type ProductNewStatement = {
  id: string;
  patient: string;
  balance: number;
  daysOverdue: number;
  lastStatement: string;
};

export const PRODUCTNEW_STATEMENTS: readonly ProductNewStatement[] = [
  { id: "ST-2210", patient: "M. Garcia", balance: 340, daysOverdue: 42, lastStatement: "Jul 28" },
  { id: "ST-2198", patient: "S. Patel", balance: 520, daysOverdue: 35, lastStatement: "Aug 4" },
  { id: "ST-2181", patient: "K. Reyes", balance: 96, daysOverdue: 18, lastStatement: "Aug 12" },
  { id: "ST-2177", patient: "A. Wong", balance: 214, daysOverdue: 12, lastStatement: "Aug 15" },
  { id: "ST-2165", patient: "L. Foster", balance: 58, daysOverdue: 6, lastStatement: "Aug 19" },
] as const;

export type ProductNewCallAction = {
  time: string;
  label: string;
  detail?: string;
};

export type ProductNewCallLog = {
  id: string;
  time: string;
  caller: string;
  phone: string;
  duration: string;
  category: string;
  outcome: "resolved" | "escalated" | "voicemail";
  summary: string;
  actions: ProductNewCallAction[];
};

export const PRODUCTNEW_CALL_HISTORY: readonly ProductNewCallLog[] = [
  {
    id: "call-11",
    time: "11:12 AM",
    caller: "D. Brooks",
    phone: "(415) 555-0148",
    duration: "2m 04s",
    category: "Scheduling",
    outcome: "resolved",
    summary: "Rescheduled annual physical from Friday to next Monday 11:00 AM.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:06", label: "Intent detected", detail: "Reschedule existing appointment" },
      { time: "0:14", label: "Patient lookup", detail: "Matched D. Brooks in Epic by name + DOB" },
      { time: "0:29", label: "Checked availability", detail: "Queried Dr. Chen's calendar, next 7 days" },
      { time: "0:47", label: "Offered slot", detail: "Monday 11:00 AM proposed and accepted" },
      { time: "1:10", label: "Appointment updated", detail: "Epic booking moved, confirmation queued" },
      { time: "1:52", label: "Confirmation sent", detail: "SMS + email reminder scheduled" },
      { time: "2:04", label: "Call ended", detail: "Resolved without handoff" },
    ],
  },
  {
    id: "call-10",
    time: "10:47 AM",
    caller: "M. Garcia",
    phone: "(415) 555-0119",
    duration: "3m 21s",
    category: "Billing question",
    outcome: "escalated",
    summary: "Disputed a copay charge; routed to James in billing for account review.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:09", label: "Intent detected", detail: "Billing dispute" },
      { time: "0:22", label: "Patient lookup", detail: "Matched M. Garcia, account #48213" },
      { time: "0:38", label: "Pulled billing history", detail: "Retrieved last 3 statements from Availity" },
      { time: "1:15", label: "Unable to resolve", detail: "Charge requires manual adjustment" },
      { time: "1:40", label: "Escalation triggered", detail: "Routed to billing queue" },
      { time: "2:58", label: "Warm transfer", detail: "Connected to James Okafor" },
      { time: "3:21", label: "Call ended", detail: "Escalated to billing" },
    ],
  },
  {
    id: "call-9",
    time: "10:22 AM",
    caller: "T. Nguyen",
    phone: "(415) 555-0176",
    duration: "1m 38s",
    category: "Prescription refill",
    outcome: "resolved",
    summary: "Refilled lisinopril and verified pharmacy on file.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:08", label: "Intent detected", detail: "Prescription refill" },
      { time: "0:19", label: "Patient lookup", detail: "Matched T. Nguyen in Epic" },
      { time: "0:33", label: "Pharmacy verified", detail: "Walgreens on Market St, on file" },
      { time: "0:52", label: "Refill request sent", detail: "Lisinopril 10mg routed via Surescripts" },
      { time: "1:24", label: "Confirmation read back", detail: "Ready for pickup in 24 hours" },
      { time: "1:38", label: "Call ended", detail: "Resolved without handoff" },
    ],
  },
  {
    id: "call-8",
    time: "9:58 AM",
    caller: "S. Patel",
    phone: "(415) 555-0132",
    duration: "2m 47s",
    category: "New patient",
    outcome: "resolved",
    summary: "Booked a new patient intake and sent onboarding forms.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:11", label: "Intent detected", detail: "New patient scheduling" },
      { time: "0:24", label: "Insurance captured", detail: "Blue Shield PPO, verified eligible" },
      { time: "0:58", label: "Checked availability", detail: "Next new-patient slot in Epic" },
      { time: "1:32", label: "Appointment booked", detail: "Thursday 9:00 AM with Dr. Chen" },
      { time: "2:10", label: "Intake forms sent", detail: "Emailed onboarding packet" },
      { time: "2:47", label: "Call ended", detail: "Resolved without handoff" },
    ],
  },
  {
    id: "call-7",
    time: "9:31 AM",
    caller: "Unknown caller",
    phone: "(628) 555-0104",
    duration: "0m 52s",
    category: "Clinical concern",
    outcome: "escalated",
    summary: "Reported chest tightness; triaged as urgent and transferred to on-call.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:05", label: "Intent detected", detail: "Clinical symptom reported" },
      { time: "0:14", label: "Urgency triage", detail: "Flagged as potentially urgent" },
      { time: "0:24", label: "Escalation triggered", detail: "Bypassed queue, direct to on-call" },
      { time: "0:41", label: "Warm transfer", detail: "Connected to on-call physician" },
      { time: "0:52", label: "Call ended", detail: "Escalated, urgent" },
    ],
  },
  {
    id: "call-6",
    time: "9:04 AM",
    caller: "R. Kim",
    phone: "(415) 555-0161",
    duration: "1m 15s",
    category: "Scheduling",
    outcome: "resolved",
    summary: "Confirmed today's 8:30 AM follow-up appointment.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:07", label: "Intent detected", detail: "Confirm existing appointment" },
      { time: "0:16", label: "Patient lookup", detail: "Matched R. Kim in Epic" },
      { time: "0:33", label: "Appointment confirmed", detail: "8:30 AM follow-up, checked in status set" },
      { time: "1:15", label: "Call ended", detail: "Resolved without handoff" },
    ],
  },
  {
    id: "call-5",
    time: "8:40 AM",
    caller: "J. Alvarez",
    phone: "(415) 555-0107",
    duration: "0m 41s",
    category: "Insurance verification",
    outcome: "resolved",
    summary: "Verified active coverage ahead of annual physical.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:06", label: "Intent detected", detail: "Insurance verification" },
      { time: "0:15", label: "Eligibility check", detail: "Queried Availity, active PPO plan" },
      { time: "0:34", label: "Confirmation read back", detail: "Coverage active through Dec 31" },
      { time: "0:41", label: "Call ended", detail: "Resolved without handoff" },
    ],
  },
  {
    id: "call-4",
    time: "8:12 AM",
    caller: "Unknown caller",
    phone: "(415) 555-0193",
    duration: "0m 28s",
    category: "Other",
    outcome: "voicemail",
    summary: "Caller hung up before intent was captured; left no voicemail.",
    actions: [
      { time: "0:00", label: "Call answered", detail: "Front desk line, greeting played" },
      { time: "0:09", label: "Awaiting response", detail: "No input detected" },
      { time: "0:28", label: "Call ended", detail: "Caller disconnected" },
    ],
  },
] as const;

export const PRODUCTNEW_SHARE_USERS = [
  { name: "Ana Reyes · Front desk", avatar: "#6b7280" },
  { name: "James Okafor · Billing", avatar: "#78716c" },
  { name: "Priya Anand · RN", avatar: "#a8a29e" },
] as const;
