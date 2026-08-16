export type StoryGoldOffset = "nw" | "ne" | "sw" | "se";

export type StoryProductLine = {
  leading?: string;
  accent: string;
  trailing?: string;
  offset?: StoryGoldOffset;
};

export type StoryGoalFocusLine = {
  text: string;
  offset?: StoryGoldOffset;
};

export type StoryGoalAtSeedItem = {
  id: string;
  meta?: string;
  focus?: string;
  focusOffset?: StoryGoldOffset;
  focusLines?: readonly StoryGoalFocusLine[];
  metaAbove?: readonly string[];
  productLines?: readonly StoryProductLine[];
};

export const STORY_GOALS_AT_SEED_ITEMS: readonly StoryGoalAtSeedItem[] = [
  { id: "clinics", focus: "25", meta: "clinics live" },
  { id: "providers", focus: "60–90", focusOffset: "ne", meta: "providers" },
  { id: "margin", focus: "70%+", meta: "gross margin" },
  {
    id: "product-launches",
    meta: "4 Product Launches",
    productLines: [
      { accent: "Genome", trailing: " Pulse", offset: "nw" },
      { leading: "Fabric ", accent: "Float", offset: "se" },
    ],
  },
  {
    id: "privacy",
    focusLines: [{ text: "PIPEDA" }, { text: "+ PHIPA" }],
    meta: "ready",
  },
  {
    id: "soc2",
    focusLines: [
      { text: "SOC 2 I", offset: "sw" },
      { text: "Complete" },
    ],
    meta: "Type II underway",
  },
  { id: "us-pilot", focus: "US pilot", metaAbove: ["preparing for"] },
  { id: "calls", focus: "25K+", focusOffset: "se", meta: "automated calls" },
  { id: "hires", focus: "3–4", meta: "technical hires" },
] as const;
