export type ProductNavTab = "landing" | "calls" | "agents" | "settings";

export type ProductNavItem = {
  id: ProductNavTab;
  label: string;
};

export const PRODUCT_NAV_ITEMS: readonly ProductNavItem[] = [
  { id: "landing", label: "Landing" },
  { id: "calls", label: "Calls" },
  { id: "agents", label: "Agents" },
  { id: "settings", label: "Settings" },
] as const;

export const PRODUCT_NAV_SECTION_LABEL = "Product";

export const PRODUCT_CLINIC_LABEL = "Westside Family Clinic";
