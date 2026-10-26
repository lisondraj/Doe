/** /earlypreview product section (the beige one under "We've been building together"): its title, two lines. */
export const EARLYPREVIEW_PRODUCT_HEADLINE = {
  line1: "Product Design",
  line2: "Built By Providers",
} as const;

/** The carousel's boxes in order, each a P22 title over a piece of the product. */
export const EARLYPREVIEW_PRODUCT_SLIDES = [
  { id: "index", title: "Dynamic Index" },
  { id: "interface", title: "Clinic-Agent Interface" },
  { id: "auth", title: "Authentication" },
  { id: "permissions", title: "Agent-Clinic Permissions" },
  { id: "insurance", title: "Insurance Verification" },
  { id: "forms", title: "Pre-Visit Forms" },
  { id: "followUp", title: "Follow-Up" },
  { id: "multiSite", title: "Multi-Site/Provider Permissions" },
  { id: "clinics", title: "Clinic-Clinic Communication" },
  { id: "departments", title: "Doe for Hospitals: Cross-Department Agents" },
  { id: "directory", title: "Doe for Hospitals: Department Directory" },
  { id: "scheduling", title: "Live Scheduling" },
  { id: "services", title: "Services Catalog" },
  { id: "insights", title: "Clinic Insights" },
  { id: "automations", title: "Agent Automations" },
  { id: "payments", title: "Post-Seed: Payments" },
] as const;

export type EarlyPreviewProductSlideId = (typeof EARLYPREVIEW_PRODUCT_SLIDES)[number]["id"];
