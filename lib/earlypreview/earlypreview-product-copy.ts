/**
 * /earlypreview product section: four screens, one patient's week told through the product. Mia Jacobs's agent moves
 * her son Leo's ENT visit; the clinic answers it, checks it, books it, and a developer finds it through the API.
 */

import type { EpTone } from "@/components/earlypreview/EarlyPreviewLockedKit";

export const EARLYPREVIEW_PRODUCT_SCREENS = 4;

/** Screen 1 (Bridge): the clinic's inbox, where patients' agents write in and the front desk replies. */
export const PRODUCT_INBOX = {
  title: ["Every patient's agent,", "answered in one inbox."],
  heading: "Messages",
  count: "5 from agents",
  threads: [
    { name: "Mia Jacobs", topic: "Leo · Reschedule", time: "2:14", initials: "MJ", tone: "salmon" },
    { name: "Ruth Chen", topic: "Refill question", time: "1:52", initials: "RC", tone: "sage" },
    { name: "Noah Kim", topic: "Records request", time: "1:30", initials: "NK", tone: "sand" },
    { name: "Ava Patel", topic: "Visit prep", time: "12:08", initials: "AP", tone: "salmon" },
    { name: "Omar Haddad", topic: "New patient", time: "11:41", initials: "OH", tone: "sage" },
  ] satisfies { name: string; topic: string; time: string; initials: string; tone: EpTone }[],
  thread: {
    who: "Mia's agent",
    for: "Personal agent for Mia Jacobs",
    messages: [
      { from: "agent", text: "Hi, I'm Mia Jacobs's agent. Leo needs to move Thursday's ear check. Is anything open Friday morning?" },
      { from: "desk", text: "Friday at 9:40 with Dr. Alvarez is open. Shall I hold it?" },
      { from: "agent", text: "Yes, please. Mia has confirmed." },
    ],
    done: "Moved to Fri 9:40 · Dr. Alvarez",
    reply: "Reply to Mia's agent",
  },
} as const;

/** Screen 2 (Verify, Prepare, Return): the visit, checked and ready before Leo walks in. */
export const PRODUCT_READY = {
  title: ["Checked and ready", "before the patient arrives."],
  chart: {
    name: "Leo Jacobs",
    visit: "Fri, Oct 23 · 9:40 AM · Dr. Alvarez",
    rows: [
      { label: "Insurance", value: "Harbor Mutual PPO", chip: "Verified" },
      { label: "Copay", value: "$40" },
      { label: "Referral", value: "On file", chip: "Checked" },
    ],
    formsLabel: "Forms",
    formsBy: "Completed by Mia's agent",
    forms: ["Intake", "Health history", "Consent to treat"],
    ready: "Ready for check-in",
  },
  products: [
    { name: "Verify", line: "Coverage and copay checked at booking" },
    { name: "Prepare", line: "Forms finished by the patient's agent" },
    { name: "Return", line: "Notes and prescriptions sent back after" },
  ],
} as const;

/** Screen 3 (Integrate, Channel): booked from the patient's own assistant, landing on the clinic's day. */
export const PRODUCT_BOOK = {
  title: ["Booked from the assistant", "patients already use."],
  phone: {
    app: "Assistant",
    ask: "Can Leo see his ENT on Friday morning instead?",
    answer: "Atlantic Pediatric ENT has Friday at 9:40 with Dr. Alvarez. Harbor Mutual covers it, with a $40 copay.",
    card: {
      clinic: "Atlantic Pediatric ENT",
      when: "Fri, Oct 23 · 9:40 AM",
      who: "Dr. Alvarez · In network",
      action: "Confirm",
      done: "Booked",
    },
  },
  day: {
    heading: "Friday",
    date: "Oct 23",
    hours: ["9 AM", "10 AM", "11 AM"],
    /** Start and length in minutes after 9:00. */
    visits: [
      { at: 0, len: 30, name: "Ava Patel", what: "Follow-up" },
      { at: 80, len: 40, name: "Omar Haddad", what: "New patient" },
      { at: 130, len: 30, name: "Ruth Chen", what: "Hearing test" },
    ],
    booked: { at: 40, len: 30, name: "Leo Jacobs", what: "Ear check", by: "Booked by Mia's agent" },
  },
} as const;

/** One token of the code sample: its text and how it is coloured. */
export type ProductCodeToken = readonly [text: string, kind?: "key" | "fn" | "str" | "punct"];

/** Screen 4 (Access, Actions, Cycle, API): the index behind it all, one call for any agent. */
export const PRODUCT_API = {
  title: ["Every practice and opening,", "one API call away."],
  tabs: ["API", "MCP", "SDK"],
  file: "find-ent.ts",
  code: [
    [["const ", "key"], ["slots = ", undefined], ["await ", "key"], ["doe.", undefined], ["search", "fn"], ["({", "punct"]],
    [["  service: ", undefined], ['"Pediatric ENT"', "str"], [",", "punct"]],
    [["  near: ", undefined], ['"Mission, San Francisco"', "str"], [",", "punct"]],
    [["  insurance: ", undefined], ['"Harbor Mutual"', "str"], [",", "punct"]],
    [["  for: ", undefined], ["grant", undefined], [",", "punct"]],
    [["});", "punct"]],
  ] satisfies ProductCodeToken[][],
  results: {
    head: "3 open this week",
    items: [
      { name: "Atlantic Pediatric ENT", meta: "0.8 mi · In network", slot: "Fri 9:40", tone: "salmon" },
      { name: "Bayside Children's ENT", meta: "1.6 mi · In network", slot: "Fri 11:15", tone: "sage" },
      { name: "Mission Ear & Hearing", meta: "2.1 mi · $40 copay", slot: "Mon 8:30", tone: "sand" },
    ] satisfies { name: string; meta: string; slot: string; tone: EpTone }[],
  },
} as const;
