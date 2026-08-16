import {
  STORY_FABRIC_TALL_LEFT_POSTER,
  STORY_GENOME_BOTTOM_RIGHT_POSTER,
  STORY_GENOME_TOP_LEFT_POSTER,
  STORY_PULSE_TALL_LEFT_POSTER,
  STORY_PULSE_WIDE_BOTTOM_POSTER,
} from "@/lib/story/story-shader-posters";
import { storyProductPuzzlePlaceholder } from "@/lib/story/story-product-puzzle-copy";

export type StoryProductPuzzleLayout = "genome" | "pulse" | "fabric" | "float";

export type StoryProductPuzzleTile = {
  id: string;
  placement: string;
  label: string;
  description: string;
  /** Pre-rendered shader poster masked into this tile. */
  posterSrc?: string;
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
      label: "Genome primary",
      description: storyProductPuzzlePlaceholder("Genome", "Primary surface"),
      posterSrc: STORY_GENOME_TOP_LEFT_POSTER,
    },
    {
      id: "genome-2",
      placement: "genome-2",
      label: "Genome routing",
      description: storyProductPuzzlePlaceholder("Genome", "Routing layer"),
    },
    {
      id: "genome-3",
      placement: "genome-3",
      label: "Genome memory",
      description: storyProductPuzzlePlaceholder("Genome", "Workflow memory"),
    },
    {
      id: "genome-4",
      placement: "genome-4",
      label: "Genome governance",
      description: storyProductPuzzlePlaceholder("Genome", "Governance surface"),
      posterSrc: STORY_GENOME_BOTTOM_RIGHT_POSTER,
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
      label: "Pulse signals",
      description: storyProductPuzzlePlaceholder("Pulse", "Signal surface"),
      posterSrc: STORY_PULSE_WIDE_BOTTOM_POSTER,
    },
    {
      id: "pulse-2",
      placement: "pulse-2",
      label: "Pulse routing",
      description: storyProductPuzzlePlaceholder("Pulse", "Routing lane"),
      posterSrc: STORY_PULSE_TALL_LEFT_POSTER,
    },
    {
      id: "pulse-3",
      placement: "pulse-3",
      label: "Pulse intake",
      description: storyProductPuzzlePlaceholder("Pulse", "Intake channel"),
    },
    {
      id: "pulse-4",
      placement: "pulse-4",
      label: "Pulse dispatch",
      description: storyProductPuzzlePlaceholder("Pulse", "Dispatch lane"),
    },
  ],
};

/**
 * Fabric — 3 tiles, tall left + stacked right (2×2 grid).
 * [||][=]
 * [||][=]
 */
export const STORY_FABRIC_PUZZLE: StoryProductPuzzleConfig = {
  layout: "fabric",
  ariaLabel: "Fabric",
  tiles: [
    {
      id: "fabric-1",
      placement: "fabric-1",
      label: "Fabric foundation",
      description: storyProductPuzzlePlaceholder("Fabric", "Foundation layer"),
      posterSrc: STORY_FABRIC_TALL_LEFT_POSTER,
    },
    {
      id: "fabric-2",
      placement: "fabric-2",
      label: "Fabric interfaces",
      description: storyProductPuzzlePlaceholder("Fabric", "Interface mesh"),
    },
    {
      id: "fabric-3",
      placement: "fabric-3",
      label: "Fabric delivery",
      description: storyProductPuzzlePlaceholder("Fabric", "Delivery path"),
    },
  ],
};

/**
 * Float — 3 tiles, stacked left + tall right (2×2 grid).
 * [==][||]
 * [==][||]
 */
export const STORY_FLOAT_PUZZLE: StoryProductPuzzleConfig = {
  layout: "float",
  ariaLabel: "Float",
  tiles: [
    {
      id: "float-1",
      placement: "float-1",
      label: "Float entry",
      description: storyProductPuzzlePlaceholder("Float", "Entry point"),
    },
    {
      id: "float-2",
      placement: "float-2",
      label: "Float context",
      description: storyProductPuzzlePlaceholder("Float", "Context window"),
      posterSrc: STORY_GENOME_TOP_LEFT_POSTER,
    },
    {
      id: "float-3",
      placement: "float-3",
      label: "Float agents",
      description: storyProductPuzzlePlaceholder("Float", "Agent surface"),
      posterSrc: STORY_PULSE_WIDE_BOTTOM_POSTER,
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
};
