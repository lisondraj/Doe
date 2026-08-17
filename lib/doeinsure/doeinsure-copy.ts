export const DOEINSURE_CONTACT_EMAIL = "james@doe.care";

export const DOEINSURE_PAGE_TITLE = "Doe Insure";
export const DOEINSURE_PAGE_DESCRIPTION =
  "Insurance for new and existing healthcare AI companies. Cover the model, the data, and the company.";

export const DOEINSURE_NAV_LINKS = [
  { href: "#coverage", label: "Coverage" },
  { href: "#who", label: "Who we insure" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
] as const;

export const DOEINSURE_HERO = {
  eyebrow: "Doe Insure",
  headline: ["Insurance for", "healthcare AI."],
  lede: "Coverage for new and existing healthcare AI companies — ambient scribes, diagnostic models, clinical agents, and the teams that ship them.",
  primaryCta: "Request coverage",
  secondaryCta: "See what we cover",
} as const;

export const DOEINSURE_POLICY_CARD = {
  kicker: "Policy",
  id: "DI-4418",
  name: "Healthcare AI E&O",
  limit: "$5,000,000",
  limitLabel: "Each claim / aggregate",
  status: "Bound",
  rider: "Cyber included",
  insuredLabel: "Named insured",
  insured: "Northwell Ambient, Inc.",
} as const;

export const DOEINSURE_STATS = [
  { value: "10 days", label: "Typical bind" },
  { value: "$10M", label: "Limits available" },
  { value: "Seed–public", label: "Companies we write" },
] as const;

export const DOEINSURE_COVERAGE = {
  eyebrow: "Coverage",
  title: "Built for the risks that generic tech policies miss.",
  items: [
    {
      id: "eo",
      name: "Technology E&O",
      body: "When a model is wrong, late, or silent. Errors and omissions for clinical software, agents, and decision support.",
    },
    {
      id: "cyber",
      name: "Cyber and privacy",
      body: "PHI, HIPAA, OCR, and the breach that starts in a training set or a vendor. First-party and liability in one place.",
    },
    {
      id: "product",
      name: "Product liability",
      body: "Software as a medical device, ambient capture, and anything that sits in a care pathway. Product injury, not just downtime.",
    },
    {
      id: "do",
      name: "Directors and officers",
      body: "Board, fundraising, and the decisions that come with putting AI in front of patients. Side A, B, and C.",
    },
    {
      id: "ip",
      name: "Media and IP",
      body: "Training data, generated output, and the claims that follow. Copyright, likeness, and confidential information.",
    },
    {
      id: "reg",
      name: "Regulatory defense",
      body: "FDA, state AGs, and professional boards. Counsel who have sat in those rooms, not a generic panel.",
    },
  ],
} as const;

export const DOEINSURE_WHO = {
  eyebrow: "Who we insure",
  title: "From first model to first health-system contract.",
  items: [
    {
      name: "New companies",
      body: "Pre-revenue and seed teams that cannot buy a standard tech E&O form because the application still asks for last year’s revenue.",
    },
    {
      name: "Existing health AI",
      body: "Ambient, RCM, imaging, and copilot vendors already in clinic. We write the AI rider the incumbent carrier left blank.",
    },
    {
      name: "Hospital ventures",
      body: "Health-system spinouts and jointly owned models. Named insureds that include the hospital, the lab, and the startup.",
    },
  ],
} as const;

export const DOEINSURE_HOW = {
  eyebrow: "How it works",
  title: "Underwrite the product, not a generic NAICS code.",
  steps: [
    {
      n: "01",
      name: "Tell us what you ship",
      body: "Model class, data, where it sits in care, and whether a clinician is still in the loop.",
    },
    {
      n: "02",
      name: "We underwrite the stack",
      body: "Architecture, evaluation, vendor map, and go-to-market. Written by people who have read a 510(k).",
    },
    {
      n: "03",
      name: "Bind and stay current",
      body: "Quotes in days. Endorsements when you add an agent, a new modality, or a health-system logo.",
    },
  ],
} as const;

export const DOEINSURE_UNDERWRITE = {
  eyebrow: "What we look at",
  title: "The application is the product.",
  items: [
    "Human-in-the-loop vs. autonomous action",
    "PHI in training, inference, and logs",
    "SaMD status and intended use",
    "Evaluation, monitoring, and rollback",
    "BAA map and subprocessors",
    "Claims and incident history",
  ],
} as const;

export const DOEINSURE_FAQ = {
  eyebrow: "FAQ",
  title: "Straight answers.",
  items: [
    {
      q: "Do you write pre-revenue companies?",
      a: "Yes. New healthcare AI companies are the core book. We price from product risk, not last year’s revenue.",
    },
    {
      q: "Can this replace our current cyber policy?",
      a: "It can. Most teams buy a combined E&O and cyber form. If you already have cyber, we endorse around it.",
    },
    {
      q: "What about FDA-regulated products?",
      a: "We write SaMD, CDS, and tools that are not devices yet. Regulatory defense sits on the same paper.",
    },
    {
      q: "Will you cover an existing book of clinic customers?",
      a: "Yes. Incumbent vendors are written as they are, including prior acts when the expiring carrier will not follow the AI use.",
    },
  ],
} as const;

export const DOEINSURE_CTA = {
  eyebrow: "Request coverage",
  title: "Tell us what you ship.",
  body: "A short note is enough. We reply with the form that matches your product, not a 40-page package built for a hospital system.",
  submit: "Send request",
  fields: {
    company: "Company",
    email: "Work email",
    stage: "Stage",
    product: "What you ship",
  },
  stages: ["Pre-seed / seed", "Series A–C", "Later stage / public", "Hospital venture"],
} as const;

export const DOEINSURE_FOOTER = {
  wordmark: "Doe Insure",
  blurb: "A Doe product. Insurance for healthcare AI companies.",
  legal: "Doe Intelligence Inc · Delaware",
  email: DOEINSURE_CONTACT_EMAIL,
} as const;
