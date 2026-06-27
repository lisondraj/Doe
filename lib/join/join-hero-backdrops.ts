import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import type { WorkflowCarouselDesignBackdrop } from "@/lib/workflow-carousel-design-backdrops";
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";

export type JoinHeroBandConfig = {
  id: string;
  backdrop: WorkflowCarouselDesignBackdrop;
  showInbox: boolean;
  /** Bottom-left headline — one or two lines max. */
  headline: readonly [string] | readonly [string, string];
  /** Top-left copy — one or more paragraphs. */
  description?: readonly string[];
  /** Title and description corner — defaults to bottom-left / top-left. */
  textAlign?: "left" | "right";
  /** Optional decorative overlay for the band. */
  decoration?: "north-america-maps" | "agent-grid" | "ai-chat" | "co-founders-cards";
  /** Beige uses solid fill + taupe line overlays; orange uses gradient + white lines. */
  surface?: WorkflowCarouselSurface;
};

/** Primary join hero — Agents dot grid (existing top box). */
export const JOIN_HERO_PRIMARY_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

/** Standard Doe orange radial — Co-Founders hero band. */
export const JOIN_HERO_ORANGE_RADIAL_BACKDROP: WorkflowCarouselDesignBackdrop = {
  slideIndex: 3,
  label: "Join",
  gradient: "radial-gradient(circle at center, #C47A5A 0%, #D2774C 58%, #D49D4F 100%)",
  grid: "polar",
  polarCenterY: "50%",
  lineOverlayOpacity: 0.09,
};

/** Three additional hero bands — varied gradients and line overlays, no inbox UI. */
export const JOIN_HERO_EXTRA_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "incoming",
    showInbox: false,
    surface: "beige",
    decoration: "north-america-maps",
    headline: ["About Doe's", "Mission."],
    description: [
      "Doe is an all-in-one healthcare communication layer built on top of health providers' existing inboxes. It automates every touchpoint in a patient's healthcare journey, from intake and scheduling to follow-ups and care coordination, without replacing the tools teams already trust.",
      "Doe will be a registered Delaware corporation, validate its tool with the Canadian healthcare market, and eventually expand to the US starting in California and New York City.",
      "We believe providers should have full autonomy over the AI in their workflows. Doe will start with physicians, then expand to nurse practitioners, PAs, nurses, and allied health teams.",
    ],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[1].backdrop,
  },
  {
    id: "tools",
    showInbox: false,
    decoration: "ai-chat",
    headline: ["Rebuilding healthcare", "communication."],
    description: [
      "Doe differentiates from existing AI in patient care by letting providers fully customize their experience. They can build new tools connected to their clinic's integrations through a no-code, visual-first interface and shape the product around their own workflow.",
      "Doe will offer front-desk triage and a voice assistant, handle patient intake, and process all incoming documents.",
      "During live patient encounters, Doe provides tools to automate documentation, surface clinical evidence, and pull patient information. It is built for doctors as multi-faceted people whose work extends far beyond the clinic.",
    ],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[3].backdrop,
  },
  {
    id: "integrate",
    showInbox: false,
    surface: "beige",
    decoration: "co-founders-cards",
    headline: ["Where we're at", "right now."],
    description: [
      "We're seeking technical talent from around the world to help build Doe. If you care about healthcare, AI, and giving providers real control over the tools they use every day, we want to hear from you.",
      "We are currently fundraising with US and Canadian backers who share our belief that better clinical communication starts with software providers can shape themselves.",
    ],
    backdrop: DOEPHONE_COMMUNICATION_SLIDES[5].backdrop,
  },
  {
    id: "join",
    showInbox: false,
    headline: ["Co-Founders"],
    description: [
      "Brothers James and Matthew Lisondra co-founded Doe to pair clinical depth with technical execution in health tech.",
      "James holds an MD from the University of Ottawa with experience in clinical medicine and healthcare delivery. Matthew holds a PhD from the University of Toronto with backgrounds in physics, robotics, AI, and computer science.",
      "Both have published in scholarly journals and presented at international conferences.",
    ],
    backdrop: JOIN_HERO_ORANGE_RADIAL_BACKDROP,
  },
] as const;

export const JOIN_HERO_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "agents",
    showInbox: false,
    decoration: "agent-grid",
    headline: ["Let's rebuild.", "healthcare."],
    backdrop: JOIN_HERO_PRIMARY_BACKDROP,
  },
  ...JOIN_HERO_EXTRA_BANDS,
] as const;

/** Main page closing section — three of four join hero band visuals below primary. */
export const JOIN_MAIN_PAGE_CLOSING_VISUALS = JOIN_HERO_EXTRA_BANDS.slice(0, 3).map((band) => ({
  backdrop: band.backdrop,
  surface: band.surface ?? ("orange" as WorkflowCarouselSurface),
}));
