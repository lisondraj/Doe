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
    amount: "$330K",
    subcategories: [
      { label: "Founding AI/ML Engineer", percent: "22%", amount: "$165K" },
      { label: "Founding Full-Stack / Infrastructure Engineer", percent: "19%", amount: "$145K" },
      { label: "Recruiting/equipment/payroll buffer", percent: "3%", amount: "$20K" },
    ],
  },
  {
    id: "ai-compute-infrastructure",
    category: "AI, Compute & Infrastructure",
    percent: "13%",
    amount: "$97.5K",
    subcategories: [
      { label: "Model inference & training", percent: "4.9%", amount: "$36.6K" },
      { label: "Voice / telephony infrastructure", percent: "3.3%", amount: "$24.4K" },
      { label: "Cloud / databases / storage", percent: "2.4%", amount: "$18.3K" },
      { label: "Evals, observability & developer infrastructure", percent: "2.4%", amount: "$18.2K" },
    ],
  },
  {
    id: "go-to-market",
    category: "Go-to-Market",
    percent: "10%",
    amount: "$75K",
    subcategories: [
      { label: "Clinic acquisition / sales", percent: "4.2%", amount: "$31.3K" },
      { label: "Marketing / content / launches", percent: "2.5%", amount: "$18.8K" },
      { label: "Partnerships / events / conferences", percent: "1.7%", amount: "$12.5K" },
      { label: "U.S. expansion / market development", percent: "1.7%", amount: "$12.5K" },
    ],
  },
  {
    id: "security-compliance",
    category: "Security & Compliance",
    percent: "10%",
    amount: "$75K",
    subcategories: [
      { label: "Security engineering / tooling", percent: "3%", amount: "$22.5K" },
      { label: "SOC 2 / audits / penetration testing", percent: "3%", amount: "$22.5K" },
      { label: "Healthcare privacy / HIPAA / PHIPA", percent: "2%", amount: "$15K" },
      { label: "Compliance infrastructure / monitoring", percent: "2%", amount: "$15K" },
    ],
  },
  {
    id: "clinical-ops-support",
    category: "Clinical Ops & Support",
    percent: "6%",
    amount: "$45K",
    subcategories: [
      { label: "Clinic implementation / onboarding", percent: "2.6%", amount: "$19.3K" },
      { label: "Customer support / success", percent: "1.7%", amount: "$12.9K" },
      { label: "Clinical QA / workflow development", percent: "1.7%", amount: "$12.9K" },
    ],
  },
  {
    id: "founders-operations",
    category: "Founders & Operations",
    percent: "7%",
    amount: "$52.5K",
    subcategories: [
      { label: "Founder compensation", percent: "5.3%", amount: "$39.4K" },
      { label: "General software / administration", percent: "1.7%", amount: "$13.1K" },
    ],
  },
  {
    id: "legal-accounting-insurance",
    category: "Legal / Accounting / Insurance",
    percent: "5%",
    amount: "$37.5K",
    subcategories: [
      { label: "Corporate / financing / contracts / IP", percent: "2.5%", amount: "$18.8K" },
      { label: "Accounting / tax / insurance", percent: "2.5%", amount: "$18.8K" },
    ],
  },
  {
    id: "reserve",
    category: "Reserve",
    percent: "5%",
    amount: "$37.5K",
    subcategories: [{ label: "Unallocated runway / contingency", percent: "5%", amount: "$37.5K" }],
  },
] as const;

export const STORY_FUNDRAISE_BUDGET_TOTAL = {
  category: "Total",
  percent: "100%",
  amount: "$750K",
} as const;
