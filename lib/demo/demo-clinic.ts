/**
 * /demo — Dr. Brooks' Migraine Clinic as a personal agent (PA) sees it through Doe, and as the clinic sees
 * the same agents from /demo/clinic. Everything here is private pay, priced in CAD.
 */

export const CLINIC = {
  name: "Dr. Brooks' Migraine Clinic",
  doctor: "Dr. Sarah Brooks",
  addressLine1: "480 University Avenue, Suite 1200",
  addressLine2: "Toronto, Ontario M5G 1V2",
  phone: "(416) 555-0142",
  hours: "Mon to Fri, 8 am to 6 pm",
} as const;

/** The person the agent is acting for in the demo. */
export const DEMO_USER = {
  name: "Alex Rivera",
  request: "Botox for chronic migraine",
} as const;

export type DemoService = {
  id: string;
  name: string;
  detail: string;
  duration: string;
  price: number;
  /** The service the user asked for. */
  match?: boolean;
};

export const SERVICES: DemoService[] = [
  {
    id: "botox",
    name: "Botox for chronic migraine",
    detail: "155 units · 31 sites · drug included",
    duration: "30 min",
    price: 1450,
    match: true,
  },
  {
    id: "consult",
    name: "Headache consultation",
    detail: "Required before first Botox",
    duration: "45 min",
    price: 350,
  },
  { id: "followup", name: "Follow-up visit", detail: "Diary and response review", duration: "20 min", price: 175 },
  { id: "block", name: "Occipital nerve block", detail: "Bilateral", duration: "20 min", price: 295 },
  { id: "trigger", name: "Trigger point injections", detail: "Up to 6 points", duration: "20 min", price: 225 },
  { id: "virtual", name: "Virtual follow-up", detail: "Video", duration: "15 min", price: 125 },
];

export type DemoBundle = {
  id: string;
  name: string;
  includes: string[];
  price: number;
  was: number;
};

export const BUNDLES: DemoBundle[] = [
  {
    id: "start",
    name: "Start bundle",
    includes: ["Headache consultation", "First Botox session, same day"],
    price: 1650,
    was: 1800,
  },
  {
    id: "year",
    name: "Year of relief",
    includes: ["4 Botox sessions, every 12 weeks", "2 follow-up visits", "Headache diary review"],
    price: 5200,
    was: 6150,
  },
  {
    id: "rescue",
    name: "Botox + nerve block",
    includes: ["Botox session", "Occipital nerve block, same visit"],
    price: 1650,
    was: 1745,
  },
];

export type DemoOffer = { id: string; title: string; tag: string };

export const OFFERS: DemoOffer[] = [
  { id: "agent", title: "5% off when booked by an agent", tag: "Agents only" },
  { id: "credit", title: "Consult fee credited", tag: "New patients" },
  { id: "network", title: "Doe network priority", tag: "Network" },
];

export type DemoSlot = { id: string; time: string; provider: string };
export type DemoDay = { id: string; weekday: string; date: string; slots: DemoSlot[] };

export const PROVIDERS = ["Dr. Sarah Brooks", "Dr. Lin Chen"] as const;

export const DAYS: DemoDay[] = [
  { id: "mon", weekday: "Mon", date: "Nov 2", slots: [s("mon-1", "9:00 am", 0), s("mon-2", "11:30 am", 1), s("mon-3", "3:15 pm", 0)] },
  { id: "tue", weekday: "Tue", date: "Nov 3", slots: [s("tue-1", "8:30 am", 1), s("tue-2", "1:00 pm", 0)] },
  { id: "wed", weekday: "Wed", date: "Nov 4", slots: [s("wed-1", "10:00 am", 0), s("wed-2", "2:30 pm", 1), s("wed-3", "4:45 pm", 0)] },
  { id: "thu", weekday: "Thu", date: "Nov 5", slots: [s("thu-1", "9:45 am", 1)] },
  { id: "fri", weekday: "Fri", date: "Nov 6", slots: [s("fri-1", "8:00 am", 0), s("fri-2", "12:15 pm", 0), s("fri-3", "3:30 pm", 1)] },
];

function s(id: string, time: string, provider: 0 | 1): DemoSlot {
  return { id, time, provider: PROVIDERS[provider] };
}

export const PAYMENT_NOTES = [
  { k: "OHIP", v: "Not covered" },
  { k: "Billing", v: "Patient pays clinic" },
  { k: "Private plans", v: "Itemized receipt (DIN, units)" },
  { k: "Reimbursed by", v: "Manulife, Sun Life, Canada Life, Green Shield" },
  { k: "Pay with", v: "Card via Doe, e-Transfer, in clinic" },
  { k: "Payment plans", v: "Bundles only" },
];

export const COMMS = [
  { id: "inbox", title: "Agent inbox", meta: "Under 5 min", on: true },
  { id: "updates", title: "Booking updates", meta: "Holds, confirmations, reminders", on: true },
  { id: "cancel", title: "Cancellation alerts", meta: "Earlier slots", on: true },
  { id: "phone", title: "Phone callback to user", meta: "Coordinator", on: false },
];

export type IntakeSource = "profile" | "confirmed" | "user";

export type IntakeField = {
  id: string;
  label: string;
  value: string;
  source: IntakeSource;
  section: "About" | "Headache history" | "Safety" | "Consent";
};

export const INTAKE_FIELDS: IntakeField[] = [
  { id: "name", label: "Full name", value: "Alex Rivera", source: "profile", section: "About" },
  { id: "dob", label: "Date of birth", value: "1989-04-17", source: "profile", section: "About" },
  { id: "phone", label: "Phone", value: "(647) 555-0198", source: "profile", section: "About" },
  { id: "email", label: "Email", value: "alex.rivera@example.com", source: "profile", section: "About" },
  { id: "tried", label: "Preventives tried", value: "Topiramate, propranolol", source: "profile", section: "Headache history" },
  { id: "acute", label: "Acute medications", value: "Sumatriptan 50 mg as needed", source: "profile", section: "Headache history" },
  { id: "allergies", label: "Allergies", value: "None known", source: "profile", section: "Safety" },
  { id: "pregnant", label: "Pregnant or breastfeeding", value: "No", source: "confirmed", section: "Safety" },
  { id: "neuro", label: "Neuromuscular disorder", value: "No", source: "confirmed", section: "Safety" },
  { id: "consent", label: "Consent to treatment", value: "", source: "user", section: "Consent" },
];

export const money = (n: number) => `$${n.toLocaleString("en-CA")}`;
