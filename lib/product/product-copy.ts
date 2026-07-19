import type { ProductNavTab } from "@/lib/product/product-nav";

export const PRODUCT_LANDING_HEADLINE = "Doe is answering your clinic line.";

export const PRODUCT_LANDING_SUBHEAD =
  "You open Doe and see the agent live: who is on the phone, what was decided, and what still needs you.";

export const PRODUCT_LANDING_PRIMARY_CTA = "Listen in";

export const PRODUCT_LANDING_SECONDARY_CTA = "Open inbox notes";

export const PRODUCT_LANDING_STATUS_VALUE = "Live";

export const PRODUCT_LANDING_STATUS_NOTE = "Main line · (512) 555-0140";

export const PRODUCT_LANDING_GREETING = "Good morning, Dr. Chen";

export const PRODUCT_LANDING_BRIEF =
  "Overnight, Doe handled 4 after-hours calls and left 2 notes for your review. Right now it is booking a follow-up on the main line.";

export const PRODUCT_LANDING_CONSOLE = {
  stateLabel: "On a call",
  caller: "M. Nguyen",
  reason: "Reschedule lab review",
  line: "Main clinic line",
  duration: "1:14",
  agentLine: "Checking Thursday openings with Dr. Chen…",
} as const;

export const PRODUCT_LANDING_TRANSCRIPT = [
  {
    speaker: "Patient" as const,
    text: "Hi, I need to move my appointment from next Tuesday.",
    time: "0:08",
  },
  {
    speaker: "Doe" as const,
    text: "I can help with that. Are you looking for later this week or next?",
    time: "0:14",
  },
  {
    speaker: "Patient" as const,
    text: "Thursday afternoon, if anything is open with Dr. Chen.",
    time: "0:22",
  },
  {
    speaker: "Doe" as const,
    text: "I have 2:30 or 4:00 on Thursday. Which would you prefer?",
    time: "0:31",
  },
  {
    speaker: "Patient" as const,
    text: "2:30 works. Do I still need to fast?",
    time: "0:38",
  },
  {
    speaker: "Doe" as const,
    text: "For this visit, no fasting. I will send a confirmation to your phone.",
    time: "0:46",
  },
] as const;

export const PRODUCT_LANDING_ATTENTION = [
  {
    id: "attn-1",
    label: "Overnight",
    title: "Metformin refill captured",
    detail: "Pharmacy review queued · left at 7:52 AM",
    action: "Review note",
  },
  {
    id: "attn-2",
    label: "Handoff",
    title: "Billing question waiting",
    detail: "J. Ortiz · transcript and account flags attached",
    action: "Take call",
  },
  {
    id: "attn-3",
    label: "Referral",
    title: "Spanish intake completed",
    detail: "R. Delgado · cardiology referral ready to send",
    action: "Open chart",
  },
] as const;

export const PRODUCT_LANDING_PULSE = [
  { label: "Calls today", value: "47" },
  { label: "Resolved by Doe", value: "83%" },
  { label: "Waiting on you", value: "3" },
] as const;

export const PRODUCT_LANDING_AI_INPUT = {
  placeholder: "Tell Doe how to handle the next call…",
  suggestions: [
    "If they ask about refills, verify DOB then route to pharmacy",
    "After 6pm, run bilingual intake before booking",
    "Warm-transfer prior auth questions to care coordination",
  ],
} as const;

/** @deprecated Landing redesign no longer uses line tabs. */
export const PRODUCT_LANDING_LINES = [
  { id: "main", label: "Main clinic line", detail: "(512) 555-0140", active: true },
] as const;

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

export const PRODUCT_PLACEHOLDER_COPY: Record<"calls" | "agents" | "settings", string> = {
  calls: "Call history and live monitoring will live here.",
  agents: "Agent configuration and rollout controls will live here.",
  settings: "Clinic settings and integrations will live here.",
};

export function isProductPlaceholderTab(tab: ProductNavTab): tab is "calls" | "agents" | "settings" {
  return tab !== "landing";
}
