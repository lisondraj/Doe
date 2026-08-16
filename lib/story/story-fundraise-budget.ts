export type StoryFundraiseBudgetSubRow = {
  label: string;
  percent: string;
  amount: string;
};

export type StoryFundraiseBudgetGroup = {
  id: string;
  category: string;
  percent: string;
  amount: string;
  subcategories: readonly StoryFundraiseBudgetSubRow[];
};

export const STORY_FUNDRAISE_BUDGET_GROUPS: readonly StoryFundraiseBudgetGroup[] = [
  {
    id: "technical-hires",
    category: "Technical Hires",
    percent: "44%",
    amount: "$660K",
    subcategories: [
      { label: "Founding AI/ML Engineer", percent: "11%", amount: "$165K" },
      { label: "Founding Full-Stack / Infrastructure Engineer", percent: "10%", amount: "$150K" },
      { label: "Founding Applied AI / Voice Engineer", percent: "10%", amount: "$150K" },
      { label: "Founding Platform / Security Engineer", percent: "8%", amount: "$120K" },
      { label: "Recruiting/equipment/payroll buffer", percent: "5%", amount: "$75K" },
    ],
  },
  {
    id: "ai-compute-infrastructure",
    category: "AI, Compute & Infrastructure",
    percent: "13%",
    amount: "$195K",
    subcategories: [
      { label: "Model inference & training", percent: "4.9%", amount: "$73.2K" },
      { label: "Voice / telephony infrastructure", percent: "3.3%", amount: "$48.8K" },
      { label: "Cloud / databases / storage", percent: "2.4%", amount: "$36.6K" },
      { label: "Evals, observability & developer infrastructure", percent: "2.4%", amount: "$36.4K" },
    ],
  },
  {
    id: "go-to-market",
    category: "Go-to-Market",
    percent: "10%",
    amount: "$150K",
    subcategories: [
      { label: "Clinic acquisition / sales", percent: "4.2%", amount: "$62.6K" },
      { label: "Marketing / content / launches", percent: "2.5%", amount: "$37.6K" },
      { label: "Partnerships / events / conferences", percent: "1.7%", amount: "$25K" },
      { label: "U.S. expansion / market development", percent: "1.7%", amount: "$25K" },
    ],
  },
  {
    id: "security-compliance",
    category: "Security & Compliance",
    percent: "10%",
    amount: "$150K",
    subcategories: [
      { label: "Security engineering / tooling", percent: "3%", amount: "$45K" },
      { label: "SOC 2 / audits / penetration testing", percent: "3%", amount: "$45K" },
      { label: "Healthcare privacy / HIPAA / PHIPA", percent: "2%", amount: "$30K" },
      { label: "Compliance infrastructure / monitoring", percent: "2%", amount: "$30K" },
    ],
  },
  {
    id: "clinical-ops-support",
    category: "Clinical Ops & Support",
    percent: "6%",
    amount: "$90K",
    subcategories: [
      { label: "Clinic implementation / onboarding", percent: "2.6%", amount: "$38.6K" },
      { label: "Customer support / success", percent: "1.7%", amount: "$25.8K" },
      { label: "Clinical QA / workflow development", percent: "1.7%", amount: "$25.8K" },
    ],
  },
  {
    id: "founders-operations",
    category: "Founders & Operations",
    percent: "7%",
    amount: "$105K",
    subcategories: [
      { label: "Founder compensation", percent: "5.3%", amount: "$78.8K" },
      { label: "General software / administration", percent: "1.7%", amount: "$26.2K" },
    ],
  },
  {
    id: "legal-accounting-insurance",
    category: "Legal / Accounting / Insurance",
    percent: "5%",
    amount: "$75K",
    subcategories: [
      { label: "Corporate / financing / contracts / IP", percent: "2.5%", amount: "$37.6K" },
      { label: "Accounting / tax / insurance", percent: "2.5%", amount: "$37.6K" },
    ],
  },
  {
    id: "reserve",
    category: "Reserve",
    percent: "5%",
    amount: "$75K",
    subcategories: [{ label: "Unallocated runway / contingency", percent: "5%", amount: "$75K" }],
  },
] as const;

export const STORY_FUNDRAISE_BUDGET_TOTAL = {
  category: "Total",
  percent: "100%",
  amount: "$1.5M",
} as const;
