import { DOEHEALTH_VOICE_ROADMAP } from "@/lib/doehealth/doehealth-voice-roadmap";

export const STORY_ROADMAP_HEADLINE = "Toronto to seed.";

export const STORY_ROADMAP_BODY =
  "Over the next 18 months, we will prove Doe with Toronto clinics, launch Genome and Pulse, then give teams Fabric and Float — while preparing a focused US pilot before seed.";

export const STORY_ROADMAP_FOCUS_LABEL = "Now";

export const STORY_ROADMAP_FOCUS = DOEHEALTH_VOICE_ROADMAP.focus;

export const STORY_ROADMAP_PRODUCT_EYEBROW = "Product rollout";

export const STORY_ROADMAP_DIAGRAM_LABEL = "Four launches across the next 18 months";

export const STORY_ROADMAP_VOICE_FEATURES = [
  { label: "Toronto", note: "Clinic design partners" },
  { label: "Team", note: "Hiring in Toronto" },
  { label: "US pilot", note: "Lead hired before seed" },
] as const;

export type StoryRoadmapAgent = {
  id: string;
  label: string;
  timing: string;
  description: string;
  phase: 1 | 2;
};

export const STORY_ROADMAP_AGENTS: readonly StoryRoadmapAgent[] = [
  {
    id: "genome",
    label: "Genome",
    timing: "Months 1–4",
    description: "Patient context and clinic memory for every interaction.",
    phase: 1,
  },
  {
    id: "pulse",
    label: "Pulse",
    timing: "Months 4–8",
    description: "Live care signals, patient follow-up, and team visibility.",
    phase: 1,
  },
  {
    id: "fabric",
    label: "Fabric",
    timing: "Months 8–13",
    description: "A visual builder for the clinical workflows teams run.",
    phase: 2,
  },
  {
    id: "float",
    label: "Float",
    timing: "Months 13–18",
    description: "Autonomous work across the clinic's daily operations.",
    phase: 2,
  },
] as const;

export const STORY_ROADMAP_AGENT_ROWS: readonly (readonly StoryRoadmapAgent[])[] = [
  STORY_ROADMAP_AGENTS.filter((agent) => agent.phase === 1),
  STORY_ROADMAP_AGENTS.filter((agent) => agent.phase === 2),
] as const;

export const STORY_GTM_EYEBROW = "Go-to-market";

export const STORY_GTM_HEADLINE = "Toronto first. Seed-ready in 18 months.";

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
    id: "toronto-foundation",
    step: "01",
    title: "Now → month 3",
    headline: "Build in Toronto",
    detail:
      "Establish Doe's operating base in Toronto, recruit early technical and clinical hires locally, and select design-partner clinics.",
    markers: ["Toronto hiring", "Clinic design partners", "Voice live today"],
  },
  {
    id: "toronto-launch",
    step: "02",
    title: "Months 4–8",
    headline: "Launch with Toronto clinics",
    detail:
      "Ship Genome and Pulse alongside Toronto clinic partners, measure time returned to staff, and turn repeatable workflows into a local playbook.",
    markers: ["Genome launch", "Pulse launch", "Toronto clinic cohort"],
  },
  {
    id: "us-pilot",
    step: "03",
    title: "Months 9–14",
    headline: "Prepare the US pilot",
    detail:
      "Hire a US-based clinical market lead, secure a small physician-led pilot cohort, and launch Fabric so clinics can shape their own workflows.",
    markers: ["US lead hired", "Fabric launch", "Pilot sites selected"],
  },
  {
    id: "seed",
    step: "04",
    title: "Months 15–18",
    headline: "Run the pilot. Raise seed.",
    detail:
      "Operate the first US pilot before seed, launch Float for autonomous clinic operations, and enter the round with Toronto and US proof points.",
    markers: ["US pilot live", "Float launch", "Seed-ready metrics"],
  },
] as const;

export const STORY_GTM_POINTS: readonly string[] = STORY_GTM_PHASES.map(
  (phase) => `${phase.headline} — ${phase.detail}`,
) as readonly string[];
