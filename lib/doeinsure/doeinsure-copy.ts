export const DOEINSURE_CONTACT_EMAIL = "james@doe.care";

export const DOEINSURE_PAGE_TITLE = "Doe Insure";
export const DOEINSURE_PAGE_DESCRIPTION =
  "Insurance for new and existing healthcare AI companies. Cover the model, the data, and the company.";

export const DOEINSURE_NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#coverage", label: "Coverage" },
  { href: "#stages", label: "Stages" },
  { href: "#connect", label: "Connect" },
  { href: "#faq", label: "FAQ" },
] as const;

export const DOEINSURE_NAV = {
  mark: "Doe",
  markAccent: "Insure",
  cta: "Request coverage",
  ctaShort: "Request",
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const DOEINSURE_HERO = {
  eyebrow: "Doe Insure",
  headline: ["Insurance for builders", "in healthcare AI."],
  lede: "Coverage for new and existing healthcare AI companies. Connect the stack, quote from live data, and raise limits the hour a hospital asks.",
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  primaryCta: "Get started",
  secondaryCta: "See the platform",
} as const;

export const DOEINSURE_POLICY_SAMPLES = [
  {
    kicker: "Policy",
    id: "DI-4418",
    name: "Healthcare AI E&O",
    limit: "$5,000,000",
    limitLabel: "Each claim / aggregate",
    status: "Bound",
    rider: "Cyber included",
    insuredLabel: "Named insured",
    insured: "Northwell Ambient, Inc.",
  },
  {
    kicker: "Quote",
    id: "DI-2201",
    name: "Cyber and privacy",
    limit: "$2,000,000",
    limitLabel: "Each claim / aggregate",
    status: "Quoted",
    rider: "PHI rider",
    insuredLabel: "Named insured",
    insured: "Harbor Notes, Inc.",
  },
  {
    kicker: "Match",
    id: "DI-8810",
    name: "Tech E&O + D&O",
    limit: "$10,000,000",
    limitLabel: "Each claim / aggregate",
    status: "Matching",
    rider: "Named insured",
    insuredLabel: "Additional insured",
    insured: "Mayo Imaging Labs",
  },
] as const;

export const DOEINSURE_POLICY_CARD = DOEINSURE_POLICY_SAMPLES[0];

export const DOEINSURE_STATS = [
  { value: "Minutes", label: "To a quote from live stack data" },
  { value: "Monthly", label: "Premiums that follow revenue" },
  { value: "48 hrs", label: "To match a hospital contract" },
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

export const DOEINSURE_STAGES = {
  eyebrow: "Stages",
  title: "From early idea to Growth+.",
  lede: "Each round changes the risk. Coverage, limits, and premium follow the company you are this month — not the form you filled last year.",
  items: [
    {
      id: "idea",
      name: "Idea",
      moment: "Founders, a repo, no revenue.",
      cover: "Bind on product class. $1M limits. Pay as you scale from day one.",
      policies: ["Cyber and privacy", "Media and IP"],
    },
    {
      id: "pre-seed",
      name: "Pre-seed",
      moment: "Angels, an accelerator, a first COI request.",
      cover: "Connect the stack. Quote in minutes. Certificates without a broker queue.",
      policies: ["Cyber and privacy", "Technology E&O", "Media and IP"],
    },
    {
      id: "seed",
      name: "Seed",
      moment: "First clinic pilots. PHI is in the building.",
      cover: "E&O and cyber on one form. BAA pack. Still usage-priced.",
      policies: ["Technology E&O", "Cyber and privacy", "Media and IP"],
    },
    {
      id: "series-a",
      name: "Series A",
      moment: "First health-system conversation.",
      cover: "Contract scanner. Raise limits the hour legal asks — often $5M.",
      policies: ["Technology E&O", "Cyber and privacy", "Directors and officers", "Media and IP"],
    },
    {
      id: "series-b",
      name: "Series B",
      moment: "Multi-site GTM. Maybe SaMD.",
      cover: "Named insureds for the hospital. Product injury, not just downtime.",
      policies: [
        "Technology E&O",
        "Cyber and privacy",
        "Product liability",
        "Directors and officers",
        "Media and IP",
      ],
    },
    {
      id: "series-c",
      name: "Series C",
      moment: "National book. Agents shipping every quarter.",
      cover: "$5–10M as the working limit. Model-change endorsements as the fleet grows.",
      policies: [
        "Technology E&O",
        "Cyber and privacy",
        "Product liability",
        "Directors and officers",
        "Media and IP",
        "Regulatory defense",
      ],
    },
    {
      id: "growth",
      name: "Growth+",
      moment: "Late stage, public path, or an existing vendor book.",
      cover: "Prior acts, incident desk, continuous posture. $10M+ to match enterprise paper.",
      policies: [
        "Technology E&O",
        "Cyber and privacy",
        "Product liability",
        "Directors and officers",
        "Media and IP",
        "Regulatory defense",
      ],
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

export const DOEINSURE_PLATFORM = {
  eyebrow: "Platform",
  title: "Built for companies that change every month.",
  featured: [
    {
      id: "api",
      kicker: "01",
      name: "API-driven underwriting",
      problem:
        "A static 20-page PDF every year fails the moment data volume, client count, or the codebase moves.",
      way: "Connect AWS or Azure, GitHub, and SOC 2 platforms such as Vanta or Drata. The engine reads security metrics, encryption logs, and uptime as they stand today.",
      benefit: "A quote in minutes, not a questionnaire that is already stale.",
      ui: {
        kicker: "Live stack",
        rows: [
          { source: "AWS", metric: "Encryption", value: "On" },
          { source: "GitHub", metric: "Protected branches", value: "100%" },
          { source: "Vanta", metric: "SOC 2", value: "Ready" },
        ],
        foot: "Quote ready · 4 min",
      },
    },
    {
      id: "scale",
      kicker: "02",
      name: "Pay as you scale",
      problem:
        "A team at $10k MRR in January can be at $500k by June. An annual premium guessed in December is either a cash-flow hit or a gap.",
      way: "Premiums follow actual processed data volume or active users, adjusted each month.",
      benefit: "You are not under-insured after a growth month, and you do not overpay in the pre-seed months.",
      ui: {
        kicker: "This month",
        rows: [
          { label: "MRR", from: "$10k", to: "$86k" },
          { label: "Active users", from: "412", to: "3,104" },
          { label: "Premium", from: "$410", to: "$1,240" },
        ],
        foot: "Billed on usage · no annual true-up",
      },
    },
    {
      id: "contract",
      kicker: "03",
      name: "Contract matching",
      problem:
        "A Kaiser or Mayo contract can demand Tech E&O or Cyber limits of $5M or $10M within 48 hours, or the deal waits.",
      way: "Upload the hospital draft. The scanner pulls the insurance clauses. One action raises limits to what legal asked for.",
      benefit: "The enterprise close is not held by a broker calendar.",
      ui: {
        kicker: "Kaiser draft · extracted",
        clause: "Cyber and Tech E&O of not less than $10,000,000 each claim.",
        from: "$1,000,000",
        to: "$10,000,000",
        action: "Match limit",
      },
    },
  ],
  more: {
    eyebrow: "Also in the dashboard",
    title: "The rest of the close, without a new packet.",
    items: [
      {
        id: "coi",
        name: "Certificates on demand",
        body: "Hospital credentialing wants a COI, additional insured, and waiver of subrogation this afternoon. Issue it from the dashboard.",
      },
      {
        id: "posture",
        name: "Continuous posture",
        body: "Cloud, repo, and compliance signals keep the risk file current. A drift in encryption or access is visible before renewal.",
      },
      {
        id: "model",
        name: "Model-change endorsements",
        body: "Ship a new agent, modality, or autonomous step. Coverage follows the product, not next year’s renewal date.",
      },
      {
        id: "baa",
        name: "BAA and PHI pack",
        body: "Named insureds, BAAs, and PHI incident language packaged for the health-system legal review.",
      },
      {
        id: "incident",
        name: "Incident desk",
        body: "A 24-hour path for a suspected PHI event — counsel, forensics, and notice — without hunting a panel number.",
      },
      {
        id: "prior",
        name: "Prior acts on switch",
        body: "Move an existing book off a generic tech form. Prior acts so last year’s clinics stay inside the coverage.",
      },
    ],
  },
} as const;

export const DOEINSURE_CONNECT = {
  eyebrow: "Connect",
  title: "Underwrite from the stack you already run.",
  lede: "Read-only connections. Encryption logs, uptime, and compliance evidence land in the file without a 20-page PDF.",
  action: "Connect",
  done: "Connected",
  items: [
    {
      name: "AWS",
      reads: "Encryption, IAM, uptime",
      body: "Encryption at rest, IAM posture, region, and uptime. The cloud the model actually runs on.",
    },
    {
      name: "Azure",
      reads: "Health-system tenants",
      body: "The same for teams on Microsoft Cloud — including health-system tenants.",
    },
    {
      name: "GitHub",
      reads: "Branches, reviews, releases",
      body: "Protected branches, review rules, and release path. How code gets to production.",
    },
    {
      name: "Vanta",
      reads: "SOC 2 this week",
      body: "SOC 2 evidence as it stands this week, not last year’s audit PDF.",
    },
    {
      name: "Drata",
      reads: "Controls and gaps",
      body: "Controls, gaps, and continuous tests pulled into the same risk file.",
    },
    {
      name: "Stripe",
      reads: "Processed volume",
      body: "Processed volume for pay-as-you-scale. Premium follows real usage, not a January guess.",
    },
  ],
} as const;

export const DOEINSURE_COMPARE = {
  eyebrow: "Instead of a broker packet",
  title: "The old way is a PDF. This is a live file.",
  columns: ["Traditional", "Doe Insure"],
  rows: [
    { label: "Application", old: "20-page PDF, once a year", next: "APIs into cloud, repo, and SOC 2" },
    { label: "Quote", old: "Weeks, then a guess", next: "Minutes from live metrics" },
    { label: "Premium", old: "Annual, prepaid on projected revenue", next: "Monthly, tied to usage or users" },
    { label: "Hospital contract", old: "Broker calendar, deal slips", next: "Upload the draft, match the limit" },
    { label: "COI", old: "Email a wholesaler, wait", next: "Issue from the dashboard" },
    { label: "New model", old: "Wait for renewal", next: "Endorse when you ship" },
  ],
} as const;

export const DOEINSURE_NEXT = {
  eyebrow: "After you start",
  title: "Email in. Coverage that can move.",
  steps: [
    {
      n: "01",
      name: "Work email",
      body: "Get started from the hero. We open a file against that address — no packet attached.",
    },
    {
      n: "02",
      name: "Name and company",
      body: "Add the site if you have one. We map product class before anyone sends a questionnaire.",
    },
    {
      n: "03",
      name: "Connect the stack",
      body: "AWS or Azure, GitHub, Vanta or Drata. Read-only. The quote uses what is true today.",
    },
    {
      n: "04",
      name: "Bind and stay current",
      body: "Usage-priced from idea through Growth+. Raise limits when a hospital’s legal team writes $10M into the MSA.",
    },
  ],
} as const;

export const DOEINSURE_LIMITS = {
  eyebrow: "Limits",
  title: "From a first COI to a $10M hospital ask.",
  items: [
    {
      value: "$1M",
      label: "Idea and pre-seed working limit",
      note: "Cyber and media to start. E&O as soon as there is a product.",
      includes: ["Cyber and privacy", "Media and IP"],
    },
    {
      value: "$2–5M",
      label: "Seed through Series A",
      note: "Clinic PHI and the first health-system paper.",
      includes: ["Technology E&O", "Cyber and privacy", "Media and IP"],
    },
    {
      value: "$5–10M",
      label: "Series B through Growth+",
      note: "Contract matching, named insureds, D&O, product, regulatory.",
      includes: [
        "Technology E&O",
        "Cyber and privacy",
        "Product liability",
        "Directors and officers",
        "Regulatory defense",
      ],
    },
  ],
} as const;

export const DOEINSURE_HOW = {
  eyebrow: "How it works",
  title: "Connect the stack. Quote from live data. Stay current.",
  steps: [
    {
      n: "01",
      name: "Connect infrastructure",
      body: "AWS or Azure, GitHub, and Vanta or Drata. No 20-page PDF. The file is the stack you already run.",
    },
    {
      n: "02",
      name: "Quote from live metrics",
      body: "Security posture, encryption, uptime, and product class. A number in minutes, then coverage that can move with you.",
    },
    {
      n: "03",
      name: "Scale and match contracts",
      body: "Premiums follow usage. When a hospital asks for $10M by Friday, raise the limit from the same dashboard.",
    },
  ],
} as const;

export const DOEINSURE_UNDERWRITE = {
  eyebrow: "What we look at",
  title: "Read from the stack, not a stale PDF.",
  items: [
    "Cloud encryption, access, and uptime",
    "Repo protections and release path",
    "SOC 2 evidence from Vanta or Drata",
    "PHI in training, inference, and logs",
    "Human-in-the-loop vs. autonomous action",
    "SaMD status and intended use",
  ],
} as const;

export const DOEINSURE_FAQ = {
  eyebrow: "FAQ",
  title: "Straight answers.",
  items: [
    {
      q: "Do we still fill out a 20-page PDF?",
      a: "No. Connect AWS or Azure, GitHub, and your SOC 2 platform. Underwriting reads the live stack. You confirm product class; you do not retype last year’s questionnaire.",
    },
    {
      q: "How does pricing work if we grow fast?",
      a: "Premiums move with processed data volume or active users, month by month. You are not locked to a January revenue guess, and you are not uncovered in June.",
    },
    {
      q: "Can you match a hospital contract in 48 hours?",
      a: "Upload the draft. We extract the insurance clauses and raise Tech E&O or Cyber limits to what legal required — including $5M and $10M asks.",
    },
    {
      q: "Do you write pre-revenue companies?",
      a: "Yes. New healthcare AI companies are the core book. Pay-as-you-scale is built for pre-seed cash flow.",
    },
    {
      q: "What about FDA-regulated products?",
      a: "SaMD, CDS, and tools that are not devices yet. Regulatory defense sits with the rest of the coverage.",
    },
    {
      q: "What do you need to connect?",
      a: "AWS or Azure, GitHub, and Vanta or Drata if you have them. Stripe if you want usage-priced premium from processed volume. Connections are read-only.",
    },
    {
      q: "Is the data used only for underwriting?",
      a: "Yes. Stack metrics go into the risk file. They are not sold, and they are not used to train a public model.",
    },
    {
      q: "Will you cover an existing book of clinic customers?",
      a: "Yes. Incumbent vendors move over with prior acts so last year’s clinics stay inside the coverage.",
    },
  ],
} as const;

export const DOEINSURE_CTA = {
  eyebrow: "Get coverage",
  title: "Tell us who you are.",
  body: "Name, company, and a work email. Add the website if you have one — we will take it from there.",
  submit: "Send",
  fields: {
    name: "Name",
    company: "Company name",
    website: "Website",
    websiteHint: "If applicable",
    email: "Work email",
  },
} as const;

export const DOEINSURE_FOOTER = {
  mark: "Doe",
  markAccent: "Insure",
  blurb: "Insurance for healthcare AI companies. Cover the model, the data, and the company.",
  legal: "Doe Intelligence Inc",
  place: "Delaware",
  email: DOEINSURE_CONTACT_EMAIL,
  productLabel: "Product",
  companyLabel: "Company",
  home: "Doe",
  homeHref: "/",
  request: "Request coverage",
} as const;
