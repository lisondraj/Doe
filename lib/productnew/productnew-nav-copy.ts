export type ProductNewBillingSubId = "overview" | "claims" | "payments" | "statements";

export const PRODUCTNEW_BILLING_PAGES: readonly { id: ProductNewBillingSubId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "claims", label: "Claims" },
  { id: "payments", label: "Payments" },
  { id: "statements", label: "Statements" },
];

export const PRODUCTNEW_NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Schedule" },
  { id: "convert", label: "Call history" },
  { id: "builder", label: "Voice agent" },
  { id: "cards", label: "Patients" },
  { id: "reports", label: "Billing", children: PRODUCTNEW_BILLING_PAGES },
] as const;
