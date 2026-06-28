export type AboutDesktopFaqItem = {
  question: string;
  answer: string;
};

export const ABOUT_DESKTOP_FAQ_ITEMS: readonly AboutDesktopFaqItem[] = [
  {
    question: "What is Doe?",
    answer:
      "Doe is ambient clinical intelligence for frontline care. We listen during the visit, draft documentation with citations, and surface only what needs a clinician's eyes before sign-off—so teams spend less time charting and more time with patients.",
  },
  {
    question: "How does Doe differentiate from other healthcare AI tools?",
    answer:
      "Every sentence in a Doe draft links back to the moment in the conversation that supports it. Clinicians review evidence, not opaque output—with explicit pause, discard, and edit controls before anything lands in the record.",
  },
  {
    question: "Which countries does Doe serve?",
    answer:
      "We are building for physicians and clinics in the United States and Canada first—where administrative load and documentation burden are reshaping how care is delivered on both sides of the border.",
  },
  {
    question: "Which professions will Doe support?",
    answer:
      "Doe starts with physicians in ambulatory and hospital-based practice—primary care, internal medicine, and urgent care—with nursing and allied roles on the roadmap as triage and inbox workflows expand.",
  },
] as const;
