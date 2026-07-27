export type AboutDesktopFaqItem = {
  question: string;
  answer: string;
};

/** Shared /about four-tab accordion — iPhone + desktop. */
export const ABOUT_DESKTOP_FAQ_ITEMS: readonly AboutDesktopFaqItem[] = [
  {
    question: "What is Doe?",
    answer:
      "Doe is a no-code agent builder for physicians. Clinicians design and deploy agents for their practice without writing code, so the tools that run the workday are shaped by the people who deliver care.",
  },
  {
    question: "Where do we start?",
    answer:
      "We start with voice agents. Physicians can stand up agents that listen, speak, and act across the visit and the inbox, then refine them as workflows change—without an engineering team in the loop.",
  },
  {
    question: "What have we built?",
    answer:
      "Once those voice agents are in place, Doe becomes a product with features built for doctors: documentation, scheduling, outreach, and chart-aware actions that sit beside the agents clinicians configure themselves.",
  },
  {
    question: "Where are we expanding?",
    answer:
      "We plan to expand into more health-aligned agent categories—across clinical, administrative, and patient-facing work—so practices can grow a full agent stack on the same no-code foundation.",
  },
] as const;
