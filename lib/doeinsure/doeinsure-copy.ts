export const DOEINSURE_CONTACT_EMAIL = "james@doe.care";

export const DOEINSURE_PAGE_TITLE = "Doe Insure";
export const DOEINSURE_PAGE_DESCRIPTION =
  "Insurance for new and existing healthcare AI companies. Cover the model, the data, and the company.";

export const DOEINSURE_NAV_LINKS = [
  { href: "#stages", label: "Growth" },
  { href: "#scale", label: "Scale" },
  { href: "#match", label: "Match" },
  { href: "#faq", label: "FAQ" },
] as const;

export const DOEINSURE_NAV = {
  mark: "Doe",
  markAccent: "Insure",
  cta: "Get Your Quote",
  ctaShort: "Get Your Quote",
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

export const DOEINSURE_HERO_CLASSES = [
  { id: "ambient", name: "Ambient", detail: "Scribe in the room. PHI at capture." },
  { id: "rcm", name: "RCM", detail: "Agents on claims, eligibility, and denial." },
  { id: "imaging", name: "Imaging", detail: "Reads in the care pathway. SaMD path." },
] as const;

export const DOEINSURE_HERO_TICKER = [
  { time: "Just now", company: "Harbor Notes", event: "Quote ready", value: "$2M" },
  { time: "4 min", company: "Northwell Ambient", event: "Bound", value: "$5M" },
  { time: "12 min", company: "Mayo Imaging Labs", event: "Limit matched", value: "$10M" },
  { time: "31 min", company: "Cedar Prior Auth", event: "COI issued", value: "Kaiser" },
] as const;

export const DOEINSURE_APP = {
  mark: "Doe",
  accent: "Insure",
  nav: [
    { id: "intake", label: "Intake" },
    { id: "stack", label: "APIs" },
    { id: "risk", label: "Risk" },
  ],
  intake: {
    kicker: "New file",
    company: "Company",
    website: "Website",
    classLabel: "Product class",
    open: "Open risk file",
    hint: "Intake maps product class before a questionnaire exists.",
  },
  stack: {
    kicker: "Read-only",
    hint: "Connect the stack you already run. Encryption, uptime, and SOC 2 land in the file.",
    connect: "Connect",
    reading: "Reading",
  },
  risk: {
    kicker: "Assessment",
    score: "72",
    max: "100",
    label: "Clear to quote",
    hint: "Risk from live signals — not a 20-page PDF.",
    signals: [
      { name: "Encryption", value: "On" },
      { name: "PHI path", value: "Logged" },
      { name: "Human in loop", value: "Yes" },
      { name: "SOC 2", value: "Ready" },
    ],
  },
} as const;

export const DOEINSURE_POLICY_SAMPLES = [
  {
    kicker: "Policy",
    id: "DI-4418",
    name: "Healthcare AI E&O",
    limit: "$5M",
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
    limit: "$2M",
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
    limit: "$10M",
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
  title: ["Coverage as fast", "as your company."],
  items: [
    {
      id: "idea",
      name: "Idea",
      lead: true,
      limit: "$1M",
      badge: "First bind",
      tags: ["Pre-revenue", "First founders", "No clinic"],
      cover: "Pay as you scale from day one.",
      includes: ["Cyber and privacy", "Media and IP", "Usage-priced premium", "Product-class bind"],
      policies: ["Cyber and privacy", "Media and IP"],
    },
    {
      id: "pre-seed",
      name: "Pre-seed",
      limit: "$1M",
      badge: "Adds E&O",
      tags: ["Accelerator", "Angel-backed", "First COI"],
      cover: "Connect the stack. Quote in minutes. Certificates without a broker queue.",
      includes: ["Cyber and privacy", "Technology E&O", "Media and IP", "Certificates on demand"],
      policies: ["Cyber and privacy", "Technology E&O", "Media and IP"],
    },
    {
      id: "seed",
      name: "Seed",
      limit: "$2M",
      badge: "PHI in clinic",
      tags: ["Clinic pilots", "PHI live", "Seed round"],
      cover: "E&O and cyber on one form. BAA pack. Still usage-priced.",
      includes: ["Technology E&O", "Cyber and privacy", "Media and IP", "BAA and PHI pack"],
      policies: ["Technology E&O", "Cyber and privacy", "Media and IP"],
    },
    {
      id: "series-a",
      name: "Series A",
      limit: "$5M",
      badge: "Adds D&O",
      tags: ["Health systems", "Enterprise", "Series A"],
      cover: "Contract scanner. Raise limits the hour legal asks.",
      includes: [
        "Technology E&O",
        "Cyber and privacy",
        "Directors and officers",
        "Media and IP",
        "Contract matching",
      ],
      policies: ["Technology E&O", "Cyber and privacy", "Directors and officers", "Media and IP"],
    },
    {
      id: "growth",
      name: "Growth",
      band: true,
      limit: "$10M+",
      badge: "Full stack",
      tags: ["Late stage", "Public path", "Vendor switch"],
      includes: [
        "Technology E&O",
        "Cyber and privacy",
        "Product liability",
        "Directors and officers",
        "Media and IP",
        "Regulatory defense",
        "Prior acts on switch",
        "Incident desk",
      ],
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

export const DOEINSURE_QUOTE = {
  id: "quote",
  eyebrow: "01 · Quote",
  title: "A quote from the live stack.",
  lede: "A 20-page PDF is stale the day the repo moves. Connect cloud, GitHub, and SOC 2. Underwriting reads encryption, uptime, and controls as they stand today.",
  waiting: "Connect every source to open a quote.",
  ready: "Quote ready",
  premium: "$1,240",
  premiumLabel: "Estimated monthly",
  time: "Four minutes from first connect",
  bind: "Bind this quote",
  connect: "Connect",
  connected: "Reading",
  connectAll: "Connect all",
  reset: "Reset stack",
  sources: [
    {
      name: "AWS",
      reads: "Encryption, IAM, uptime",
      metric: "Encryption at rest",
      value: "On · 3 regions",
    },
    {
      name: "GitHub",
      reads: "Branches, reviews, releases",
      metric: "Protected branches",
      value: "100%",
    },
    {
      name: "Vanta",
      reads: "SOC 2 this week",
      metric: "SOC 2",
      value: "Ready",
    },
  ],
} as const;

export const DOEINSURE_SCALE = {
  id: "scale",
  title: ["Dynamic policy pricing", "to scale with you."],
  play: "Play January to June",
  pause: "Pause",
  ours: "Doe Insure",
  traditional: "Traditional",
  traditionalNote: "Prepaid on January revenue — uncovered by June, or overpaid in the winter.",
  oursNote: "Billed on this month’s usage.",
  months: [
    { label: "Jan", mrr: "$10k", users: "412", premium: "$410", traditional: "$4920" },
    { label: "Feb", mrr: "$18k", users: "890", premium: "$520", traditional: "$4920" },
    { label: "Mar", mrr: "$31k", users: "1402", premium: "$680", traditional: "$4920" },
    { label: "Apr", mrr: "$48k", users: "2110", premium: "$890", traditional: "$4920" },
    { label: "May", mrr: "$67k", users: "2680", premium: "$1080", traditional: "$4920" },
    { label: "Jun", mrr: "$86k", users: "3104", premium: "$1240", traditional: "$4920" },
  ],
} as const;

export const DOEINSURE_MATCH = {
  id: "match",
  title: ["We help you close", "contracts in record time."],
  scenarioLabel: "Contract type",
  draftLabel: "Incoming MSA",
  fileLabel: "Your policy",
  scanning: "Scanning insurance clauses…",
  blocked: "Deal blocked",
  unblocked: "Deal unblocked",
  deadline: "In 48 hours",
  hours: "48 hrs",
  hoursDone: "Matched",
  matchAll: "Match all clauses",
  matched: "All clauses matched",
  request: "Request this limit",
  progressLabel: "Clauses matched",
  currentLabel: "Working limit",
  requiredLabel: "MSA requires",
  policyUpdates: "Policy updates",
  waitingUpdates: "Waiting on clauses.",
  scenarios: [
    {
      id: "enterprise-msa",
      name: "Enterprise MSA",
      ask: "$10M",
      from: "$1M",
      tags: ["MSA", "Add. insured", "48 hrs"],
      excerpt:
        "Vendor shall maintain Cyber Liability and Technology E&O insurance of not less than $10M each claim and in the aggregate, naming the health system an additional insured on the certificate.",
      clauses: [
        {
          id: "limit",
          label: "Limit",
          text: "Cyber and Tech E&O of not less than $10M each claim.",
          policyMatch: "Raise cyber + tech E&O to $10M",
        },
        {
          id: "ai",
          label: "Additional insured",
          text: "Named insured to include the health system and its affiliates.",
          policyMatch: "Add health system as additional insured",
        },
        {
          id: "waiver",
          label: "Waiver",
          text: "Waiver of subrogation in favor of the hospital.",
          policyMatch: "Add waiver of subrogation",
        },
      ],
    },
    {
      id: "pilot-agreement",
      name: "Pilot agreement",
      ask: "$5M",
      from: "$1M",
      tags: ["Pilot", "Tech E&O", "48 hrs"],
      excerpt:
        "Coverage shall include Technology Errors & Omissions with limits of $5M, plus waiver of subrogation and additional-insured coverage for the health system.",
      clauses: [
        {
          id: "limit",
          label: "Limit",
          text: "Technology E&O of not less than $5M each claim.",
          policyMatch: "Raise tech E&O to $5M",
        },
        {
          id: "ai",
          label: "Additional insured",
          text: "Health system and affiliates as additional insured.",
          policyMatch: "Add health system as additional insured",
        },
        {
          id: "waiver",
          label: "Waiver",
          text: "Waiver of subrogation required on all liability lines.",
          policyMatch: "Add waiver of subrogation",
        },
      ],
    },
    {
      id: "go-live",
      name: "Go-live vendor pack",
      ask: "$10M",
      from: "$2M",
      tags: ["Go-live", "COI due", "48 hrs"],
      excerpt:
        "Professional and cyber liability of $10M. Certificate must show additional-insured and primary, noncontributory language before go-live.",
      clauses: [
        {
          id: "limit",
          label: "Limit",
          text: "Professional and cyber liability of $10M.",
          policyMatch: "Raise professional + cyber to $10M",
        },
        {
          id: "ai",
          label: "Additional insured",
          text: "Health system as additional insured, primary and noncontributory.",
          policyMatch: "Add primary/noncontributory wording",
        },
        {
          id: "coi",
          label: "Certificate",
          text: "Certificate of insurance due prior to go-live.",
          policyMatch: "Queue certificate for delivery",
        },
      ],
    },
  ],
} as const;

export const DOEINSURE_STACK = {
  id: "stack",
  title: ["Connect your stack.", "Quote in minutes."],
  company: "Harbor Notes",
  waiting: "Waiting on stack",
  reading: "Reading live signals",
  ready: "Quote ready",
  premium: "$1240",
  premiumNote: "Monthly",
  connectAll: "Connect all",
  request: "Request this quote",
  sources: [
    {
      id: "aws",
      name: "AWS",
      signal: "Encryption",
      value: "On",
      x: 16,
      y: 18,
    },
    {
      id: "github",
      name: "GitHub",
      signal: "Branches",
      value: "100%",
      x: 84,
      y: 18,
    },
    {
      id: "vanta",
      name: "Vanta",
      signal: "SOC 2",
      value: "Ready",
      x: 16,
      y: 82,
    },
    {
      id: "stripe",
      name: "Stripe",
      signal: "Volume",
      value: "Live",
      x: 84,
      y: 82,
    },
  ],
} as const;

export const DOEINSURE_ISSUE = {
  id: "issue",
  title: ["Certificates on demand.", "Issued from the file."],
  insured: "Harbor Notes, Inc.",
  issuing: "Issuing",
  issued: "Issued",
  waiting: "Ready to issue",
  issueAll: "Issue certificate",
  request: "Request coverage",
  fields: [
    { id: "holder", label: "Holder" },
    { id: "insured", label: "Named insured" },
    { id: "limit", label: "Limit" },
    { id: "endorsement", label: "Endorsement" },
  ],
  requests: [
    {
      id: "msa",
      name: "Enterprise MSA",
      time: "Now",
      holder: "Health system legal",
      limit: "$10M",
      endorsement: "Additional insured",
    },
    {
      id: "clinic",
      name: "Clinic credentialing",
      time: "12 min",
      holder: "Credentialing desk",
      limit: "$5M",
      endorsement: "Waiver of subrogation",
    },
    {
      id: "golive",
      name: "Go-live vendor pack",
      time: "48 min",
      holder: "Vendor management",
      limit: "$10M",
      endorsement: "Primary / noncontributory",
    },
  ],
} as const;

export const DOEINSURE_CLAIM = {
  id: "claim",
  title: ["File a claim in minutes.", "Not a week of forms."],
  company: "Harbor Notes",
  draftTitle: "New claim",
  waiting: "Draft",
  collecting: "Collecting",
  ready: "Ready",
  opened: "Opened",
  file: "File claim",
  filed: "Claim opened",
  whenLabel: "When",
  reserveLabel: "Reserve",
  evidenceLabel: "Pulled from the stack",
  adjusterLabel: "Adjuster",
  nextLabel: "First response",
  incidents: [
    {
      id: "phi",
      name: "PHI path",
      line: "Cyber",
      note: "A clinic flagged a possible PHI path in last night’s ambient session.",
      when: "Apr 12, 9:14p",
      reserve: "$85k",
      evidence: ["CloudTrail", "Session 4812", "Vanta"],
      number: "HN-1842",
      adjuster: "Priya Shah",
      next: "2 hours",
    },
    {
      id: "outage",
      name: "Model outage",
      line: "Tech E&O",
      note: "Inference dropped for 41 minutes during Northwell evening clinic.",
      when: "Apr 9, 6:02p",
      reserve: "$40k",
      evidence: ["Uptime", "Release 2.14", "Pager"],
      number: "HN-1847",
      adjuster: "James Cole",
      next: "2 hours",
    },
    {
      id: "demand",
      name: "Vendor demand",
      line: "Media",
      note: "Health-system counsel asked for written notice after a training-set question.",
      when: "Apr 4, 11:20a",
      reserve: "$120k",
      evidence: ["MSA clause", "Model card", "Legal note"],
      number: "HN-1851",
      adjuster: "Elena Ruiz",
      next: "4 hours",
    },
  ],
} as const;

export const DOEINSURE_READ = {
  id: "read",
  title: ["Upload the packet.", "The file reads it."],
  waiting: "Waiting",
  reading: "Reading",
  filed: "In the file",
  pagesLabel: "pages",
  extractLabel: "Extracted",
  packets: [
    {
      id: "msa",
      name: "Enterprise MSA",
      file: "NORTHWELL_MSA.PDF",
      pages: "14",
      kind: "Contract",
      excerpt: [
        { text: "Vendor shall maintain Cyber Liability and Technology E&O of not less than ", mark: null },
        { text: "$10M", mark: "limit" },
        { text: " each claim, naming the ", mark: null },
        { text: "health system an additional insured", mark: "insured" },
        { text: ", with ", mark: null },
        { text: "waiver of subrogation", mark: "waiver" },
        { text: " in favor of the hospital.", mark: null },
      ],
      fields: [
        { id: "limit", label: "Limit", value: "$10M" },
        { id: "insured", label: "Named", value: "Health system" },
        { id: "waiver", label: "Waiver", value: "Required" },
      ],
    },
    {
      id: "soc2",
      name: "SOC 2 letter",
      file: "VANTA_SOC2.PDF",
      pages: "6",
      kind: "Evidence",
      excerpt: [
        { text: "Harbor Notes holds a ", mark: null },
        { text: "SOC 2 Type II", mark: "type" },
        { text: " report for the period ending ", mark: null },
        { text: "May 2026", mark: "period" },
        { text: ", issued through ", mark: null },
        { text: "Vanta", mark: "issuer" },
        { text: ". Controls cover encryption, access, and change management.", mark: null },
      ],
      fields: [
        { id: "type", label: "Report", value: "Type II" },
        { id: "period", label: "Through", value: "May 2026" },
        { id: "issuer", label: "Issuer", value: "Vanta" },
      ],
    },
    {
      id: "notice",
      name: "Incident notice",
      file: "PHI_NOTICE.PDF",
      pages: "2",
      kind: "Notice",
      excerpt: [
        { text: "Written notice of a possible ", mark: null },
        { text: "PHI path", mark: "line" },
        { text: " in an ambient session on ", mark: null },
        { text: "Apr 12, 9:14p", mark: "when" },
        { text: " at ", mark: null },
        { text: "Northwell evening clinic", mark: "site" },
        { text: ". Session 4812 is attached.", mark: null },
      ],
      fields: [
        { id: "line", label: "Line", value: "Cyber" },
        { id: "when", label: "When", value: "Apr 12, 9:14p" },
        { id: "site", label: "Site", value: "Northwell" },
      ],
    },
  ],
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
  title: "Insurance built for you.",
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
  blurb: "Doe Intelligence, Inc.",
  coverageCta: "Get coverage",
  legal: "Doe Insure is a registered MGA.",
  email: DOEINSURE_CONTACT_EMAIL,
  fill: "#3050e0",
} as const;
