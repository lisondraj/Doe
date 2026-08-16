import { DESIGNERS_PRODUCT_NEXT_BODY, DESIGNERS_PRODUCT_NEXT_HEADLINE, DESIGNERS_PRODUCT_VOICE_FEATURES } from "@/lib/designers/designers-product-copy";
import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";

export const STORY_ROADMAP_HEADLINE = DESIGNERS_PRODUCT_NEXT_HEADLINE;

export const STORY_ROADMAP_BODY = DESIGNERS_PRODUCT_NEXT_BODY;

export const STORY_ROADMAP_FOCUS_LABEL = "Live today";

export const STORY_ROADMAP_FOCUS = DOEHEALTH_VOICE_ROADMAP.focus;

export const STORY_ROADMAP_PRODUCT_EYEBROW = "Product rollout";

export const STORY_ROADMAP_DIAGRAM_LABEL = "Agent rollout from voice";

export const STORY_ROADMAP_VOICE_FEATURES = DESIGNERS_PRODUCT_VOICE_FEATURES;

export type StoryRoadmapAgent = {
  id: string;
  label: string;
  description: string;
  phase: 1 | 2;
};

export const STORY_ROADMAP_AGENTS: readonly StoryRoadmapAgent[] = [
  {
    id: "front-desk",
    label: "Front-desk",
    description: "Triage, intake, and clinic routing on every call.",
    phase: 1,
  },
  {
    id: "scheduling",
    label: "Scheduling",
    description: "Book, reschedule, waitlists, and reminder workflows.",
    phase: 1,
  },
  {
    id: "prior-auth",
    label: "Prior Auth",
    description: "Payer authorization requests and follow-up status.",
    phase: 1,
  },
  {
    id: "referrals",
    label: "Referrals",
    description: "Specialist routing, referral packets, and tracking.",
    phase: 2,
  },
  {
    id: "results",
    label: "Results",
    description: "Lab and imaging result communication to patients.",
    phase: 2,
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Encounter notes, chart completion, and handoff summaries.",
    phase: 2,
  },
] as const;

export const STORY_ROADMAP_AGENT_ROWS: readonly (readonly StoryRoadmapAgent[])[] = [
  STORY_ROADMAP_AGENTS.filter((agent) => agent.phase === 1),
  STORY_ROADMAP_AGENTS.filter((agent) => agent.phase === 2),
] as const;

export const STORY_GTM_EYEBROW = "Go-to-market";

export const STORY_GTM_HEADLINE = "Canada first, then the US.";

export type StoryGtmPhase = {
  id: string;
  step: string;
  title: string;
  headline: string;
  detail: string;
  markers: readonly string[];
};

export const STORY_GTM_PHASES: readonly StoryGtmPhase[] = [
  {
    id: "validate",
    step: "01",
    title: "Validate",
    headline: "Canada",
    detail:
      "Pilot with Canadian healthcare clinics, prove clinical ROI, and harden compliance before scaling across provinces.",
    markers: ["Ontario pilots", "PIPEDA-ready stack", "25 clinics at seed"],
  },
  {
    id: "expand",
    step: "02",
    title: "Expand",
    headline: "United States",
    detail:
      "Enter California and New York City first, then broaden to additional US markets with the same provider-led rollout.",
    markers: ["California + NYC", "SOC 2 in flight", "Physician-first wedge"],
  },
  {
    id: "scale",
    step: "03",
    title: "Scale",
    headline: "Full clinical teams",
    detail:
      "Move from physicians to nurse practitioners, PAs, nurses, and allied health — while clinics customize agents in Fabric.",
    markers: ["Delaware C-Corp", "US + CA backers", "Agent Builder in clinic"],
  },
] as const;

export const STORY_GTM_POINTS: readonly string[] = STORY_GTM_PHASES.map(
  (phase) => `${phase.headline} — ${phase.detail}`,
) as readonly string[];
