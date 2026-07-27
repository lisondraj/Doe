export type ProductMobileTab = "today" | "calls" | "schedule" | "inbox";

export type ProductMobileNavItem = {
  id: ProductMobileTab;
  label: string;
};

export const PRODUCT_MOBILE_NAV_ITEMS: readonly ProductMobileNavItem[] = [
  { id: "today", label: "Today" },
  { id: "calls", label: "Calls" },
  { id: "schedule", label: "Schedule" },
  { id: "inbox", label: "Inbox" },
] as const;

export {
  PRODUCT_MOBILE_INBOX_THREADS,
  type ProductMobileInboxThread,
} from "@/lib/product/product-mobile-inbox";
