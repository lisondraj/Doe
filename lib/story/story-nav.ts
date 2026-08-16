export type StoryTabId =
  | "introduction"
  | "meet-doe"
  | "genome"
  | "compliance"
  | "pulse"
  | "fabric"
  | "float"
  | "use-cases"
  | "platform"
  | "team"
  | "our-ask"
  | "goals-at-seed"
  | "roadmap-gtm"
  | "cap-table"
  | "incorporation";

export type StoryNavTab = {
  id: StoryTabId;
  label: string;
};

export const STORY_PRIMARY_TABS_BEFORE_PRODUCT: readonly StoryNavTab[] = [
  { id: "introduction", label: "Introduction" },
  { id: "meet-doe", label: "Meet Doe" },
  { id: "genome", label: "Genome" },
] as const;

export const STORY_PRODUCT_SECTION_LABEL = "Product";

export const STORY_PRODUCT_TABS: readonly StoryNavTab[] = [
  { id: "pulse", label: "Pulse" },
  { id: "fabric", label: "Fabric" },
  { id: "float", label: "Float" },
] as const;

export const STORY_PRIMARY_TABS_BEFORE_FUNDRAISE: readonly StoryNavTab[] = [
  { id: "use-cases", label: "Use Cases" },
  { id: "platform", label: "Platform" },
  { id: "compliance", label: "Compliance" },
  { id: "team", label: "Team" },
] as const;

export const STORY_FUNDRAISE_SECTION_LABEL = "Fundraise";

export const STORY_FUNDRAISE_TABS: readonly StoryNavTab[] = [
  { id: "our-ask", label: "Our Ask" },
  { id: "goals-at-seed", label: "Goals at Seed" },
] as const;

export const STORY_PRIMARY_TABS_AFTER_FUNDRAISE: readonly StoryNavTab[] = [
  { id: "roadmap-gtm", label: "Roadmap" },
  { id: "cap-table", label: "Cap Table" },
  { id: "incorporation", label: "Incorporation" },
] as const;

export const STORY_PRIMARY_TABS: readonly StoryNavTab[] = [
  ...STORY_PRIMARY_TABS_BEFORE_PRODUCT,
  ...STORY_PRIMARY_TABS_BEFORE_FUNDRAISE,
  ...STORY_PRIMARY_TABS_AFTER_FUNDRAISE,
] as const;

/** Flat sidebar order — primary, product, and fundraise tabs. */
export const STORY_NAV_TAB_ORDER: readonly StoryTabId[] = [
  ...STORY_PRIMARY_TABS_BEFORE_PRODUCT.map((tab) => tab.id),
  ...STORY_PRODUCT_TABS.map((tab) => tab.id),
  ...STORY_PRIMARY_TABS_BEFORE_FUNDRAISE.map((tab) => tab.id),
  ...STORY_FUNDRAISE_TABS.map((tab) => tab.id),
  ...STORY_PRIMARY_TABS_AFTER_FUNDRAISE.map((tab) => tab.id),
] as const;

export function storyAdjacentTab(tab: StoryTabId, direction: -1 | 1): StoryTabId | null {
  const index = STORY_NAV_TAB_ORDER.indexOf(tab);
  if (index < 0) return null;

  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= STORY_NAV_TAB_ORDER.length) return null;

  return STORY_NAV_TAB_ORDER[nextIndex] ?? null;
}

export const STORY_DEFAULT_TAB: StoryTabId = "introduction";

export function storyTabHeaderLabel(tab: StoryTabId): string {
  const productTab = STORY_PRODUCT_TABS.find((item) => item.id === tab);
  if (productTab) {
    return `${STORY_PRODUCT_SECTION_LABEL} / ${productTab.label}`;
  }

  const fundraiseTab = STORY_FUNDRAISE_TABS.find((item) => item.id === tab);
  if (fundraiseTab) {
    return `${STORY_FUNDRAISE_SECTION_LABEL} / ${fundraiseTab.label}`;
  }

  return STORY_PRIMARY_TABS.find((item) => item.id === tab)?.label ?? tab;
}

export function isStoryProductTab(tab: StoryTabId): boolean {
  return STORY_PRODUCT_TABS.some((item) => item.id === tab);
}

export function isStoryFundraiseTab(tab: StoryTabId): boolean {
  return STORY_FUNDRAISE_TABS.some((item) => item.id === tab);
}

export const STORY_GOLD_NAV_TAB_IDS: readonly StoryTabId[] = ["cap-table", "incorporation"] as const;

export function isStoryGoldNavTab(tab: StoryTabId): boolean {
  return STORY_GOLD_NAV_TAB_IDS.includes(tab);
}
