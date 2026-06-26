import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";

export type JoinHeroBandConfig = {
  id: string;
  backdrop: WorkflowCarouselDesignBackdrop;
  showInbox: boolean;
  /** Bottom-left headline — one or two lines max. */
  headline: readonly [string] | readonly [string, string];
  /** Top-left paragraph — primary hero only. */
  description?: string;
};

/** Primary join hero — Agents dot grid (existing top box). */
export const JOIN_HERO_PRIMARY_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

/** Three additional hero bands — varied gradients and line overlays, no inbox UI. */
export const JOIN_HERO_EXTRA_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "incoming",
    showInbox: false,
    headline: ["About Doe's", "Mission"],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[1].backdrop,
  },
  {
    id: "tools",
    showInbox: false,
    headline: ["Rebuilding healthcare", "communication"],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[3].backdrop,
  },
  {
    id: "integrate",
    showInbox: false,
    headline: ["Co-Founders"],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[5].backdrop,
  },
] as const;

export const JOIN_HERO_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "agents",
    showInbox: true,
    headline: ["Let's rebuild", "healthcare."],
    description:
      "Doe is an all-in-one healthcare communication layer built on top of health providers' existing inboxes. It automates every touchpoint in a patient's healthcare journey — from intake and scheduling to follow-ups and care coordination — without replacing the tools teams already trust.",
    backdrop: JOIN_HERO_PRIMARY_BACKDROP,
  },
  ...JOIN_HERO_EXTRA_BANDS,
] as const;
