export type ProductAgentStatus = "live" | "draft" | "paused";

export type ProductVoiceAgentIntent = {
  id: string;
  label: string;
  action: string;
};

export type ProductVoiceAgentHandoff = {
  id: string;
  label: string;
  detail: string;
};

export const PRODUCT_VOICE_AGENT = {
  name: "Voice Agent",
  line: "Main clinic line",
  status: "live" as ProductAgentStatus,
  greeting:
    "Thank you for calling Chen Family Medicine. I'm Doe, the clinic assistant. How can I help you today?",
  language: "English · Spanish",
  voice: "Warm clinic tone",
  hours: "Routes after-hours to message capture",
  intents: [
    { id: "scheduling", label: "Scheduling", action: "Offer next available slot in Epic" },
    { id: "refill", label: "Refill request", action: "Collect pharmacy + send to inbox" },
    { id: "billing", label: "Billing question", action: "Gather account details, route to billing" },
    { id: "clinical", label: "Clinical concern", action: "Triage urgency, warm transfer if needed" },
  ] as const satisfies readonly ProductVoiceAgentIntent[],
  handoffs: [
    { id: "staff", label: "Staff transfer", detail: "Front desk · warm handoff" },
    { id: "oncall", label: "On-call physician", detail: "Urgent clinical only" },
    { id: "voicemail", label: "After-hours message", detail: "Capture + notify inbox" },
  ] as const satisfies readonly ProductVoiceAgentHandoff[],
} as const;

export function productAgentStatusLabel(status: ProductAgentStatus): string {
  if (status === "live") return "Live";
  if (status === "draft") return "Draft";
  return "Paused";
}
