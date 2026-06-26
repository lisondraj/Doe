import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";

export type JoinHeroBandConfig = {
  id: string;
  backdrop: WorkflowCarouselDesignBackdrop;
  showInbox: boolean;
  /** Bottom-left headline — one or two lines max. */
  headline: readonly [string] | readonly [string, string];
  /** Top-left paragraph — optional per band. */
  description?: string;
  /** Beige uses solid fill + taupe line overlays; orange uses gradient + white lines. */
  surface?: WorkflowCarouselSurface;
};

/** Primary join hero — Agents dot grid (existing top box). */
export const JOIN_HERO_PRIMARY_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

/** Standard Doe orange radial — fifth hero band. */
export const JOIN_HERO_ORANGE_RADIAL_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 3,
  label: "Join",
  gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
  grid: "diagonal",
};

/** Three additional hero bands — varied gradients and line overlays, no inbox UI. */
export const JOIN_HERO_EXTRA_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "incoming",
    showInbox: false,
    surface: "beige",
    headline: ["About Doe's", "Mission"],
    description:
      "Doe is an all-in-one healthcare communication layer built on top of health providers' existing inboxes. It automates every touchpoint in a patient's healthcare journey, from intake and scheduling to follow-ups and care coordination, without replacing the tools teams already trust.",
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
    surface: "beige",
    headline: ["Co-Founders"],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[5].backdrop,
  },
  {
    id: "join",
    showInbox: false,
    headline: ["Build with", "Doe."],
    backdrop: JOIN_HERO_ORANGE_RADIAL_BACKDROP,
  },
] as const;

export const JOIN_HERO_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "agents",
    showInbox: true,
    headline: ["Let's rebuild", "healthcare."],
    backdrop: JOIN_HERO_PRIMARY_BACKDROP,
  },
  ...JOIN_HERO_EXTRA_BANDS,
] as const;
