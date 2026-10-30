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
    detail: "155 units across 31 sites (PREEMPT protocol). Medication included.",
    duration: "30 min",
    price: 1450,
    match: true,
  },
  {
    id: "consult",
    name: "Headache consultation",
    detail: "First visit with Dr. Brooks. Required before a first Botox session.",
    duration: "45 min",
    price: 350,
  },
  { id: "followup", name: "Follow-up visit", detail: "Review of headache diary and treatment response.", duration: "20 min", price: 175 },
  { id: "block", name: "Occipital nerve block", detail: "Both sides, with local anaesthetic.", duration: "20 min", price: 295 },
  { id: "trigger", name: "Trigger point injections", detail: "Neck and shoulder, up to 6 points.", duration: "20 min", price: 225 },
  { id: "virtual", name: "Virtual follow-up", detail: "Video visit for medication changes.", duration: "15 min", price: 125 },
];

export type DemoBundle = {
  id: string;
  name: string;
  includes: string[];
  price: number;
  was: number;
  note: string;
};

export const BUNDLES: DemoBundle[] = [
  {
    id: "start",
    name: "Start bundle",
    includes: ["Headache consultation", "First Botox session, same day"],
    price: 1650,
    was: 1800,
    note: "Most agents book this for a first visit.",
  },
  {
    id: "year",
    name: "Year of relief",
    includes: ["4 Botox sessions, every 12 weeks", "2 follow-up visits", "Headache diary review"],
    price: 5200,
    was: 6150,
    note: "Prepaid, or 4 payments of $1,300.",
  },
  {
    id: "rescue",
    name: "Botox + nerve block",
    includes: ["Botox session", "Occipital nerve block, same visit"],
    price: 1650,
    was: 1745,
    note: "For users with a current flare.",
  },
];

export type DemoOffer = { id: string; title: string; detail: string; tag: string };

export const OFFERS: DemoOffer[] = [
  { id: "agent", title: "5% off when booked by an agent", detail: "Applied at checkout to any service booked through Doe.", tag: "Agents only" },
  { id: "credit", title: "Consult fee credited", detail: "The $350 consult comes off the first Botox session if booked within 30 days.", tag: "New patients" },
  { id: "network", title: "Doe network priority", detail: "Members of the Doe network see cancellation slots first.", tag: "Network" },
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
  { title: "Private pay only", detail: "OHIP does not cover Botox for migraine at this clinic. Every service is billed to the patient." },
  { title: "Receipts for reimbursement", detail: "Itemized receipts list the drug, DIN and units, for private plans or a health spending account." },
  { title: "Private plans we see reimbursed", detail: "Manulife, Sun Life, Canada Life, Green Shield. The clinic does not bill plans directly." },
  { title: "How to pay", detail: "Card on file through Doe, Interac e-Transfer, or in clinic. Bundles can be split into payments." },
];

export const COMMS = [
  { id: "inbox", title: "Agent inbox", detail: "Replies in under 5 minutes during clinic hours.", on: true },
  { id: "updates", title: "Booking updates", detail: "Holds, confirmations and reminders sent to your agent.", on: true },
  { id: "cancel", title: "Cancellation alerts", detail: "Earlier slots offered as they open.", on: true },
  { id: "phone", title: "Phone callback", detail: "A coordinator calls your user directly.", on: false },
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
  { id: "days", label: "Headache days per month", value: "18", source: "confirmed", section: "Headache history" },
  { id: "years", label: "Years with chronic migraine", value: "6", source: "confirmed", section: "Headache history" },
  { id: "tried", label: "Preventives tried", value: "Topiramate, propranolol", source: "profile", section: "Headache history" },
  { id: "acute", label: "Acute medications", value: "Sumatriptan 50 mg as needed", source: "profile", section: "Headache history" },
  { id: "allergies", label: "Allergies", value: "None known", source: "profile", section: "Safety" },
  { id: "pregnant", label: "Pregnant or breastfeeding", value: "No", source: "confirmed", section: "Safety" },
  { id: "neuro", label: "Neuromuscular disorder", value: "No", source: "confirmed", section: "Safety" },
  { id: "consent", label: "Consent to treatment", value: "", source: "user", section: "Consent" },
];

export const money = (n: number) => `$${n.toLocaleString("en-CA")}`;
