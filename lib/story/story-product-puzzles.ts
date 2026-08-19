import { STORY_FABRIC_GOLD_TITLES, STORY_FABRIC_TILE_COPY } from "@/lib/story/story-fabric-visuals";
import { STORY_FLOAT_GOLD_TITLES, STORY_FLOAT_TILE_COPY } from "@/lib/story/story-float-visuals";
import { STORY_MEET_DOE_GOLD_TITLES } from "@/lib/story/story-meet-doe-visuals";
import {
  STORY_GENOME_GOLD_TITLES,
  STORY_GENOME_TILE_COPY,
} from "@/lib/story/story-genome-visuals";
import {
  STORY_PULSE_GOLD_TITLES,
  STORY_PULSE_TILE_COPY,
} from "@/lib/story/story-pulse-visuals";
import {
  STORY_FABRIC_TALL_LEFT_POSTER,
  STORY_FLOAT_MID_LEFT_POSTER,
  STORY_FLOAT_TOP_RIGHT_POSTER,
  STORY_GENOME_BOTTOM_RIGHT_POSTER,
  STORY_GENOME_TOP_LEFT_POSTER,
  STORY_PULSE_TALL_LEFT_POSTER,
  STORY_PULSE_WIDE_BOTTOM_POSTER,
  STORY_ROADMAP_PRIOR_AUTH_POSTER,
  STORY_ROADMAP_RESULTS_POSTER,
} from "@/lib/story/story-shader-posters";
import { storyProductPuzzlePlaceholder } from "@/lib/story/story-product-puzzle-copy";

export type StoryProductPuzzleLayout = "genome" | "pulse" | "fabric" | "float" | "meet-doe";

export type StoryProductPuzzleTile = {
  id: string;
  placement: string;
  label: string;
  description: string;
  /** Pre-rendered shader poster masked into this tile. */
  posterSrc?: string;
  /** Empty grid slot — reserves layout space without a visible tile. */
  spacer?: boolean;
  /** Nested empty UI boxes — narrow slot left, wide slot right. */
  innerSplit?: "narrow-wide";
  /** Overlapping phone-number pills overlay. */
  phonePills?: boolean;
  /** Legacy home call-logic canvas with connector nodes. */
  callLogicDiagram?: boolean;
  /** Clinic fintech dashboard — scaled from bottom, edge cropped. */
  floatDashboard?: boolean;
  /** Big corner title (Pulse-style); optional brown gradient tone. */
  meetDoeCornerLabel?: {
    text: string;
    corner: "top-left" | "bottom-left" | "bottom-right";
    tone?: "gold" | "brown";
  };
  /** Gold display title at the top of a Meet Doe tile. */
  meetDoeGoldTitle?: string | readonly string[];
  /** Genome tile visual overlay. */
  genomeVisual?: "fleet" | "router" | "train" | "agents";
  /** Gold display title at the top of a Genome tile. */
  genomeGoldTitle?: string | readonly string[];
  /** Pulse tile visual overlay. */
  pulseVisual?: "voices" | "desk" | "live" | "nights";
  /** Gold display title at the top of a Pulse tile. */
  pulseGoldTitle?: string | readonly string[];
  /** Fabric tile visual overlay. */
  fabricVisual?: "canvas" | "tone" | "library" | "sim";
  /** Gold display title at the top of a Fabric tile. */
  fabricGoldTitle?: string | readonly string[];
  /** Float tile visual overlay. */
  floatVisual?: "hold" | "rates" | "codes" | "denials";
  /** Gold display title at the top of a Float tile. */
  floatGoldTitle?: string | readonly string[];
};

export type StoryProductPuzzleConfig = {
  layout: StoryProductPuzzleLayout;
  ariaLabel: string;
  tiles: readonly StoryProductPuzzleTile[];
};

/** Genome — 4 tiles, wide TL + BR (3×2 grid). */
export const STORY_GENOME_PUZZLE: StoryProductPuzzleConfig = {
  layout: "genome",
  ariaLabel: "Genome",
  tiles: [
    {
      id: "genome-1",
      placement: "genome-1",
      label: "Clinic Genomes",
      description: STORY_GENOME_TILE_COPY.seals,
      posterSrc: STORY_GENOME_TOP_LEFT_POSTER,
      genomeVisual: "fleet",
      genomeGoldTitle: STORY_GENOME_GOLD_TITLES.seals,
    },
    {
      id: "genome-2",
      placement: "genome-2",
      label: "Harbor Genome",
      description: STORY_GENOME_TILE_COPY.kept,
      posterSrc: STORY_FLOAT_TOP_RIGHT_POSTER,
      genomeVisual: "router",
      genomeGoldTitle: STORY_GENOME_GOLD_TITLES.kept,
    },
    {
      id: "genome-3",
      placement: "genome-3",
      label: "Weekly train",
      description: STORY_GENOME_TILE_COPY.sunday,
      posterSrc: STORY_FLOAT_MID_LEFT_POSTER,
      genomeVisual: "train",
      genomeGoldTitle: STORY_GENOME_GOLD_TITLES.sunday,
    },
    {
      id: "genome-4",
      placement: "genome-4",
      label: "On Genome",
      description: STORY_GENOME_TILE_COPY.knows,
      posterSrc: STORY_GENOME_BOTTOM_RIGHT_POSTER,
      genomeVisual: "agents",
      genomeGoldTitle: STORY_GENOME_GOLD_TITLES.knows,
    },
  ],
};

/**
 * Pulse — 4 tiles, wide top-left + tall right (3×2 grid).
 * [====][||]
 * [=][=][||]
 */
export const STORY_PULSE_PUZZLE: StoryProductPuzzleConfig = {
  layout: "pulse",
  ariaLabel: "Pulse",
  tiles: [
    {
      id: "pulse-1",
      placement: "pulse-1",
      label: "Voice agents",
      description: STORY_PULSE_TILE_COPY.voices,
      posterSrc: STORY_PULSE_WIDE_BOTTOM_POSTER,
      pulseVisual: "voices",
      pulseGoldTitle: STORY_PULSE_GOLD_TITLES.voices,
    },
    {
      id: "pulse-2",
      placement: "pulse-2",
      label: "Front desk",
      description: STORY_PULSE_TILE_COPY.desk,
      posterSrc: STORY_PULSE_TALL_LEFT_POSTER,
      pulseVisual: "desk",
      pulseGoldTitle: STORY_PULSE_GOLD_TITLES.desk,
    },
    {
      id: "pulse-3",
      placement: "pulse-3",
      label: "Live floor",
      description: STORY_PULSE_TILE_COPY.live,
      posterSrc: STORY_FLOAT_TOP_RIGHT_POSTER,
      pulseVisual: "live",
      pulseGoldTitle: STORY_PULSE_GOLD_TITLES.live,
    },
    {
      id: "pulse-4",
      placement: "pulse-4",
      label: "After hours",
      description: STORY_PULSE_TILE_COPY.nights,
      posterSrc: STORY_FLOAT_MID_LEFT_POSTER,
      pulseVisual: "nights",
      pulseGoldTitle: STORY_PULSE_GOLD_TITLES.nights,
    },
  ],
};

/**
 * Fabric — 4 tiles, tall left + two squares TR + wide BR (3×2).
 * [||][=][=]
 * [||][====]
 */
export const STORY_FABRIC_PUZZLE: StoryProductPuzzleConfig = {
  layout: "fabric",
  ariaLabel: "Fabric",
  tiles: [
    {
      id: "fabric-1",
      placement: "fabric-1",
      label: "Design canvas",
      description: STORY_FABRIC_TILE_COPY.canvas,
      posterSrc: STORY_FABRIC_TALL_LEFT_POSTER,
      fabricVisual: "canvas",
      fabricGoldTitle: STORY_FABRIC_GOLD_TITLES.canvas,
    },
    {
      id: "fabric-2",
      placement: "fabric-2",
      label: "Agent voice",
      description: STORY_FABRIC_TILE_COPY.tone,
      posterSrc: STORY_FLOAT_TOP_RIGHT_POSTER,
      fabricVisual: "tone",
      fabricGoldTitle: STORY_FABRIC_GOLD_TITLES.tone,
    },
    {
      id: "fabric-3",
      placement: "fabric-3",
      label: "Community library",
      description: STORY_FABRIC_TILE_COPY.library,
      posterSrc: STORY_ROADMAP_RESULTS_POSTER,
      fabricVisual: "library",
      fabricGoldTitle: STORY_FABRIC_GOLD_TITLES.library,
    },
    {
      id: "fabric-4",
      placement: "fabric-4",
      label: "Conversation simulator",
      description: STORY_FABRIC_TILE_COPY.sim,
      posterSrc: STORY_PULSE_WIDE_BOTTOM_POSTER,
      fabricVisual: "sim",
      fabricGoldTitle: STORY_FABRIC_GOLD_TITLES.sim,
    },
  ],
};

/**
 * Float — 4 tiles, square TL + wide TR, wide BL + square BR (3×2).
 * [=][====]
 * [====][=]
 */
export const STORY_FLOAT_PUZZLE: StoryProductPuzzleConfig = {
  layout: "float",
  ariaLabel: "Float",
  tiles: [
    {
      id: "float-1",
      placement: "float-1",
      label: "Payer hold",
      description: STORY_FLOAT_TILE_COPY.hold,
      posterSrc: STORY_FLOAT_MID_LEFT_POSTER,
      floatVisual: "hold",
      floatGoldTitle: STORY_FLOAT_GOLD_TITLES.hold,
    },
    {
      id: "float-2",
      placement: "float-2",
      label: "Contract rates",
      description: STORY_FLOAT_TILE_COPY.rates,
      posterSrc: STORY_GENOME_BOTTOM_RIGHT_POSTER,
      floatVisual: "rates",
      floatGoldTitle: STORY_FLOAT_GOLD_TITLES.rates,
    },
    {
      id: "float-3",
      placement: "float-3",
      label: "Charge capture",
      description: STORY_FLOAT_TILE_COPY.codes,
      posterSrc: STORY_GENOME_TOP_LEFT_POSTER,
      floatVisual: "codes",
      floatGoldTitle: STORY_FLOAT_GOLD_TITLES.codes,
    },
    {
      id: "float-4",
      placement: "float-4",
      label: "Denial queue",
      description: STORY_FLOAT_TILE_COPY.denials,
      posterSrc: STORY_ROADMAP_PRIOR_AUTH_POSTER,
      floatVisual: "denials",
      floatGoldTitle: STORY_FLOAT_GOLD_TITLES.denials,
    },
  ],
};

/**
 * Meet Doe — 5 tiles, 2 on top + 3 below (6-column grid).
 * [====][====]
 * [==][==][==]
 */
export const STORY_MEET_DOE_PUZZLE: StoryProductPuzzleConfig = {
  layout: "meet-doe",
  ariaLabel: "Meet Doe",
  tiles: [
    {
      id: "meet-doe-1",
      placement: "meet-doe-1",
      label: "Meet Doe overview",
      description: storyProductPuzzlePlaceholder("Meet Doe", "Overview"),
      spacer: true,
    },
    {
      id: "meet-doe-2",
      placement: "meet-doe-2",
      label: "Meet Doe platform",
      description: storyProductPuzzlePlaceholder("Meet Doe", "Platform surface"),
      posterSrc: STORY_GENOME_TOP_LEFT_POSTER,
      innerSplit: "narrow-wide",
      meetDoeGoldTitle: STORY_MEET_DOE_GOLD_TITLES.genome,
    },
    {
      id: "meet-doe-3",
      placement: "meet-doe-3",
      label: "Meet Doe intelligence",
      description: storyProductPuzzlePlaceholder("Meet Doe", "Intelligence layer"),
      posterSrc: STORY_GENOME_BOTTOM_RIGHT_POSTER,
      phonePills: true,
      meetDoeGoldTitle: STORY_MEET_DOE_GOLD_TITLES.pulse,
    },
    {
      id: "meet-doe-4",
      placement: "meet-doe-4",
      label: "Meet Doe fabric",
      description: storyProductPuzzlePlaceholder("Meet Doe", "Fabric layer"),
      posterSrc: STORY_ROADMAP_PRIOR_AUTH_POSTER,
      callLogicDiagram: true,
      meetDoeGoldTitle: STORY_MEET_DOE_GOLD_TITLES.fabric,
    },
    {
      id: "meet-doe-5",
      placement: "meet-doe-5",
      label: "Meet Doe pulse",
      description: storyProductPuzzlePlaceholder("Meet Doe", "Pulse layer"),
      posterSrc: STORY_GENOME_BOTTOM_RIGHT_POSTER,
      floatDashboard: true,
      meetDoeGoldTitle: STORY_MEET_DOE_GOLD_TITLES.float,
    },
  ],
};

export const STORY_PRODUCT_PUZZLES: Record<
  Exclude<StoryProductPuzzleLayout, never>,
  StoryProductPuzzleConfig
> = {
  genome: STORY_GENOME_PUZZLE,
  pulse: STORY_PULSE_PUZZLE,
  fabric: STORY_FABRIC_PUZZLE,
  float: STORY_FLOAT_PUZZLE,
  "meet-doe": STORY_MEET_DOE_PUZZLE,
};
