export type StoryTabId =
  | "introduction"
  | "meet-doe"
  | "genome"
  | "compliance"
  | "pulse"
  | "fabric"
  | "float"
  | "use-cases"
  | "team"
  | "our-ask"
  | "budget"
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
  { id: "compliance", label: "Compliance" },
] as const;

export const STORY_PRODUCT_SECTION_LABEL = "Product";

export const STORY_PRODUCT_TABS: readonly StoryNavTab[] = [
  { id: "pulse", label: "Pulse" },
  { id: "fabric", label: "Fabric" },
  { id: "float", label: "Float" },
] as const;

export const STORY_PRIMARY_TABS_BEFORE_FUNDRAISE: readonly StoryNavTab[] = [
  { id: "use-cases", label: "Use Cases" },
  { id: "team", label: "Team" },
] as const;

export const STORY_FUNDRAISE_SECTION_LABEL = "Fundraise";

export const STORY_FUNDRAISE_TABS: readonly StoryNavTab[] = [
  { id: "our-ask", label: "Our Ask" },
  { id: "budget", label: "Budget" },
] as const;

export const STORY_PRIMARY_TABS_AFTER_FUNDRAISE: readonly StoryNavTab[] = [
  { id: "goals-at-seed", label: "Goals at Seed" },
  { id: "roadmap-gtm", label: "Roadmap" },
] as const;

export const STORY_PRIMARY_TABS: readonly StoryNavTab[] = [
  ...STORY_PRIMARY_TABS_BEFORE_PRODUCT,
  ...STORY_PRIMARY_TABS_BEFORE_FUNDRAISE,
  ...STORY_PRIMARY_TABS_AFTER_FUNDRAISE,
] as const;

export const STORY_DOCUMENTS_SECTION_LABEL = "Documents";

export const STORY_DOCUMENT_TABS: readonly StoryNavTab[] = [
  { id: "cap-table", label: "Cap Table" },
  { id: "incorporation", label: "Incorporation" },
] as const;

export const STORY_DEFAULT_TAB: StoryTabId = "introduction";

export function storyTabHeaderLabel(tab: StoryTabId): string {
  const productTab = STORY_PRODUCT_TABS.find((item) => item.id === tab);
  if (productTab) {
    return `${STORY_PRODUCT_SECTION_LABEL} / ${productTab.label}`;
  }

  const fundraiseTab = STORY_FUNDRAISE_TABS.find((item) => item.id === tab);
  if (fundraiseTab) {
    if (tab === "budget") {
      return STORY_FUNDRAISE_SECTION_LABEL;
    }
    return `${STORY_FUNDRAISE_SECTION_LABEL} / ${fundraiseTab.label}`;
  }

  const documentTab = STORY_DOCUMENT_TABS.find((item) => item.id === tab);
  if (documentTab) {
    return `${STORY_DOCUMENTS_SECTION_LABEL} / ${documentTab.label}`;
  }

  return STORY_PRIMARY_TABS.find((item) => item.id === tab)?.label ?? tab;
}

export function isStoryProductTab(tab: StoryTabId): boolean {
  return STORY_PRODUCT_TABS.some((item) => item.id === tab);
}

export function isStoryFundraiseTab(tab: StoryTabId): boolean {
  return STORY_FUNDRAISE_TABS.some((item) => item.id === tab);
}

export function isStoryDocumentTab(tab: StoryTabId): boolean {
  return STORY_DOCUMENT_TABS.some((item) => item.id === tab);
}
