export type Product2NavTab = "landing" | "calls" | "agents" | "settings";

export type Product2NavItem = {
  id: Product2NavTab;
  label: string;
};

export const PRODUCT2_NAV_ITEMS: readonly Product2NavItem[] = [
  { id: "landing", label: "Landing" },
  { id: "calls", label: "Calls" },
  { id: "agents", label: "Agents" },
  { id: "settings", label: "Settings" },
] as const;

export const PRODUCT2_NAV_SECTION_LABEL = "Product 2";

export const PRODUCT2_CLINIC_LABEL = "Westside Family Clinic";
