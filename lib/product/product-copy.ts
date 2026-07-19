import type { ProductNavTab } from "@/lib/product/product-nav";

export const PRODUCT_LANDING_EYEBROW = "Voice";

export const PRODUCT_LANDING_HEADLINE = "A voice agent for your clinic.";

export const PRODUCT_LANDING_SUBHEAD =
  "Doe answers your clinic line, handles intake and scheduling, and routes complex calls to your team. Live on your existing phone number.";

export const PRODUCT_LANDING_PRIMARY_CTA = "Turn on voice";

export const PRODUCT_LANDING_SECONDARY_CTA = "Preview a call";

export const PRODUCT_LANDING_STATUS_LABEL = "Agent status";

export const PRODUCT_LANDING_STATUS_VALUE = "Live";

export const PRODUCT_LANDING_STATUS_NOTE = "Answering the main clinic line";

export const PRODUCT_LANDING_LINES = [
  { id: "main", label: "Main clinic line", detail: "(512) 555-0140", active: true },
  { id: "after-hours", label: "After hours", detail: "Forwards at 6pm", active: false },
  { id: "spanish", label: "Spanish line", detail: "Shared routing", active: false },
] as const;

export const PRODUCT_LANDING_CAPABILITIES = [
  {
    title: "Two-way listen and think",
    detail: "Doe listens while it reasons, then responds without dead air.",
  },
  {
    title: "Low latency",
    detail: "Sub-second turn-taking so callers stay in flow.",
  },
  {
    title: "Human handoff",
    detail: "Warm transfer with full call context to your front desk.",
  },
  {
    title: "Multi-language",
    detail: "English and Spanish on the same clinic number.",
  },
] as const;

export const PRODUCT_LANDING_METRICS = [
  { label: "Calls today", value: "47" },
  { label: "Avg. handle time", value: "2m 18s" },
  { label: "Routed to staff", value: "6" },
] as const;

export const PRODUCT_LANDING_CALL_PREVIEW = {
  caller: "Incoming call",
  line: "Main clinic line",
  duration: "0:42",
  transcript: [
    {
      speaker: "Patient",
      text: "Hi, I need to reschedule my appointment for next week.",
      time: "0:04",
    },
    {
      speaker: "Doe",
      text: "I can help with that. What day works best for you?",
      time: "0:11",
    },
    {
      speaker: "Patient",
      text: "Thursday afternoon, if anything is open.",
      time: "0:18",
    },
    {
      speaker: "Doe",
      text: "I have 2:30 or 4:00 on Thursday. Which would you prefer?",
      time: "0:26",
    },
  ],
} as const;

export const PRODUCT_PLACEHOLDER_COPY: Record<"calls" | "agents" | "settings", string> = {
  calls: "Call history and live monitoring will live here.",
  agents: "Agent configuration and rollout controls will live here.",
  settings: "Clinic settings and integrations will live here.",
};

export function isProductPlaceholderTab(tab: ProductNavTab): tab is "calls" | "agents" | "settings" {
  return tab !== "landing";
}
