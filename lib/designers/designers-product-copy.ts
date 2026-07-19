import { DOEHEALTH_ACTIVE_AGENTS_SUBHEADING } from "@/lib/doehealth/doehealth-built-by-doctors-copy";

export const DESIGNERS_PRODUCT_EYEBROW = "Product";

export const DESIGNERS_PRODUCT_TITLE = "Doe";

export const DESIGNERS_PRODUCT_LEAD = "Multimodal AI agents for clinical teams.";

export const DESIGNERS_PRODUCT_SUMMARY =
  "Doe automates every touchpoint in a patient's care journey, from intake and scheduling to documentation and follow-up. It runs on top of the EHR, inbox, and phone systems clinics already use.";

export const DESIGNERS_PRODUCT_POINTS = [
  "One platform for voice, messaging, and document workflows.",
  "Built by clinicians for front-desk, nursing, and back-office teams.",
  "Staff stay in control. Agents route edge cases to the right person.",
] as const;

/** Voice agent capabilities — live phone layer. */
export const DESIGNERS_PRODUCT_VOICE_EYEBROW = "Voice";

export const DESIGNERS_PRODUCT_VOICE_LEAD =
  "Live phone agents built for clinical calls. Every capability below ships with the voice layer.";

export const DESIGNERS_PRODUCT_VOICE_FEATURES = [
  { label: "Security", note: "Encrypted calls and clinic-controlled access" },
  { label: "Two-way listen & think", note: "Full-duplex conversation with live reasoning" },
  { label: "Low latency", note: "Sub-second response on active calls" },
  { label: "Languages", note: "Multi-language patient support" },
  { label: "Human handoff", note: "Warm transfer to staff when needed" },
  { label: "Call context", note: "Queue history and clinic routing memory" },
] as const;

/** Roadmap beyond the current Voice release. */
export const DESIGNERS_PRODUCT_NEXT_EYEBROW = "Where we're heading next";

export const DESIGNERS_PRODUCT_NEXT_HEADLINE = "Beyond voice.";

export const DESIGNERS_PRODUCT_NEXT_BODY =
  "Voice is live today. Next up: front-desk and scheduling agents, then prior auth, referrals, results, and documentation across the rest of the patient journey.";

export const DESIGNERS_PRODUCT_NEXT_VOICE_LINE = DOEHEALTH_ACTIVE_AGENTS_SUBHEADING;

export const DESIGNERS_PRODUCT_NEXT_DIAGRAM_LABEL = "Agent rollout from voice";
