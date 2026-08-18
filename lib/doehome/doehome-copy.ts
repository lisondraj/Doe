export const DOEHOME_CONTACT_EMAIL = "james@doe.care";

export const DOEHOME_PAGE_TITLE = "Doe";
export const DOEHOME_PAGE_DESCRIPTION =
  "Doe is an AI platform for clinics. Genome gives each clinic its own intelligence. Pulse answers the phones. Fabric builds your agents. Float runs the financial work.";

export const DOEHOME_NAV_LINKS = [
  { href: "#genome", label: "Genome" },
  { href: "#pulse", label: "Pulse" },
  { href: "#fabric", label: "Fabric" },
  { href: "#float", label: "Float" },
] as const;

export const DOEHOME_NAV = {
  mark: "Doe",
  markAccent: "",
  cta: "Join Waitlist",
  ctaShort: "Join Waitlist",
  promos: [
    "Genome — a model for your clinic, not a generic one.",
    "Pulse answers the line. Overnight calls come back at open.",
    "Fabric builds agents on your Genome. Float watches what payers actually send.",
  ],
  promoCta: "Join waitlist",
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const DOEHOME_HERO = {
  title: "Doe",
  tagline: ["An AI platform", "for clinics."],
  lede: "We're bringing personalized intelligence to every clinic. Genome learns your workflow. Pulse, Fabric, and Float run on top of it — phones, agents, and the financial work the front desk should not still be doing by hand.",
  emailLabel: "Work email",
  emailPlaceholder: "you@clinic.com",
  primaryCta: "Join Waitlist",
  secondaryCta: "See Genome",
} as const;

export const DOEHOME_PRODUCTS = [
  {
    id: "genome",
    kicker: "Core",
    name: "Genome",
    limit: "Clinic model",
    limitLabel: "Post-trained on your workflow",
    status: "Live",
    rider: "Group · clinic · provider",
    insuredLabel: "Named clinic",
    insured: "Harbor Ortho",
  },
  {
    id: "pulse",
    kicker: "Voice",
    name: "Pulse",
    limit: "4 live lines",
    limitLabel: "Front desk, prior auth, nights",
    status: "Answering",
    rider: "Writes to chart",
    insuredLabel: "Main line",
    insured: "(416) 555-0140",
  },
  {
    id: "fabric",
    kicker: "Build",
    name: "Fabric",
    limit: "No-code agents",
    limitLabel: "On your clinic Genome",
    status: "Canvas",
    rider: "Human handoff",
    insuredLabel: "Flow",
    insured: "New referral → book visit",
  },
  {
    id: "float",
    kicker: "Finance",
    name: "Float",
    limit: "Underpaid $18k",
    limitLabel: "Aetna vs contracted rate",
    status: "Watching",
    rider: "Appeals queued",
    insuredLabel: "Clinic",
    insured: "Harbor Ortho",
  },
] as const;

export const DOEHOME_STATS = [
  { value: "47", label: "Calls in the last 24 hours — 83% resolved without a person" },
  { value: "4", label: "Overnight voicemails Pulse returned at open, written to chart" },
  { value: "v2.1", label: "Harbor Genome — trained on last week’s approved outcomes" },
] as const;

export const DOEHOME_GENOME = {
  id: "genome",
  title: ["Every clinic gets their", "own intelligence model."],
  lede: "Genome is the core of Doe. A group can run a model per clinic. A clinic can run a model per provider. Each one is post-trained on that team’s workflow data — prior auth, referrals, visit prep — not a generic hospital model.",
  groupLabel: "Group",
  clinicLabel: "Clinic",
  providerLabel: "Provider",
  modelLabel: "On this Genome",
  trainLabel: "Weekly train",
  trainCta: "Train v2.2",
  trainWhen: "Sunday 6:00pm",
  trainSignals: "1,284 outcomes",
  frontierLabel: "Frontier only when needed",
  group: {
    name: "Northstar Health",
    count: "4 clinic models",
  },
  clinics: [
    { id: "riverside", name: "Riverside", model: "Riverside Genome", version: "v1.8" },
    { id: "harbor", name: "Harbor Ortho", model: "Harbor Genome", version: "v2.1" },
    { id: "oakridge", name: "Oakridge", model: "Oakridge Genome", version: "v1.4" },
    { id: "westlake", name: "Westlake", model: "Westlake Genome", version: "v1.9" },
  ],
  providers: [
    { id: "chen", name: "Dr. Chen", model: "Chen Genome", note: "Visit prep · referrals" },
    { id: "ruiz", name: "Dr. Ruiz", model: "Ruiz Genome", note: "Prior auth · imaging" },
    { id: "patel", name: "Dr. Patel", model: "Patel Genome", note: "Scribe · follow-up" },
  ],
  submodels: [
    { id: "pa", task: "Prior auth" },
    { id: "ri", task: "Referral" },
    { id: "vp", task: "Visit prep" },
  ],
  router: {
    clinic: ["Confirm visit", "Visit summary", "Referral file"],
    frontier: ["Denial appeal"],
  },
} as const;

export const DOEHOME_PULSE = {
  id: "pulse",
  title: ["Pulse answers the clinic", "on every live line."],
  lede: "Voice AI agents for the front desk, prior auth, and overnight coverage. Each agent has its own voice, language, tone, and hours. When a call needs a person, Pulse holds context and hands it over.",
  live: "4 live",
  human: "1 with you",
  agents: [
    { id: "desk", name: "Front desk", voice: "Maya", language: "EN · ES", tone: "Warm", state: "Live", time: "0:42", hours: "8a–6p" },
    { id: "auth", name: "Prior auth", voice: "Cole", language: "EN", tone: "Direct", state: "Hold", time: "4:18", hours: "Always" },
    { id: "sched", name: "Scheduling", voice: "Maya", language: "EN · ES", tone: "Calm", state: "Live", time: "1:06", hours: "8a–6p" },
    { id: "nights", name: "After hours", voice: "Lina", language: "EN · FR", tone: "Soft", state: "Live", time: "0:19", hours: "6p–8a" },
  ],
  call: {
    line: "Main clinic line",
    agent: "Maya",
    turns: [
      { who: "Dana", text: "Can I move Thursday to Friday?" },
      { who: "Maya", text: "Friday 10:20 is open. I’ll hold it." },
      { who: "Dana", text: "That’s perfect — thank you." },
    ],
  },
  nights: {
    label: "Overnight, returned at open",
    items: [
      { at: "11:42pm", task: "Refill request", done: "7:04am" },
      { at: "1:18am", task: "Cancel visit", done: "7:06am" },
      { at: "5:02am", task: "New patient", done: "7:11am" },
    ],
  },
} as const;

export const DOEHOME_FABRIC = {
  id: "fabric",
  title: ["Build the agents", "your clinic actually runs."],
  lede: "Fabric is a visual builder for clinic agents. Describe a step, drag a branch, add a human handoff. The agents you build run on your clinic’s Genome — not a generic model.",
  prompt: "Describe a block…",
  tools: ["Start", "If", "Human"],
  steps: [
    { id: "start", kicker: "Start", label: "New referral" },
    { id: "if", kicker: "If", label: "Records complete?" },
    { id: "then", kicker: "Then", label: "Book visit" },
    { id: "human", kicker: "Human", label: "Covering MD" },
  ],
  library: [
    { id: "preop", title: "Pre-op intake", source: "Texas · colorectal", uses: "1.2k" },
    { id: "auth", title: "Prior auth packet", source: "Ohio · ortho", uses: "840" },
    { id: "triage", title: "Refill triage", source: "NY · peds", uses: "610" },
  ],
} as const;

export const DOEHOME_FLOAT = {
  id: "float",
  title: ["Financial work that", "does not wait on hold."],
  lede: "Float is the financial management layer. Agents stay on payer hold. Remittance is checked against contracted rates. Codes come from the visit. Denials are appealed before they expire.",
  hold: { payer: "Aetna", task: "Prior auth · Harbor", timer: "14:22", status: "On hold", ref: "A-4419" },
  rates: [
    { name: "Aetna", paid: 82, delta: "−$18k" },
    { name: "UHC", paid: 91, delta: "−$12k" },
    { name: "BCBS", paid: 96, delta: "−$6k" },
  ],
  codes: [
    { code: "99214", label: "Est. office", hint: "96%" },
    { code: "20610", label: "Joint inj.", hint: "Confirm" },
    { code: "J3301", label: "Kenalog", hint: "88%" },
  ],
  denials: [
    { payer: "Aetna", reason: "Missing notes", due: "Fri" },
    { payer: "UHC", reason: "Auth lapse", due: "Live" },
    { payer: "BCBS", reason: "Bundling", due: "Mon" },
  ],
} as const;

export const DOEHOME_STACK = {
  title: ["One platform.", "Genome underneath."],
  items: [
    { name: "Genome", body: "The clinic’s own model — or a model per provider, or per site in a group — post-trained on approved workflow outcomes." },
    { name: "Pulse", body: "Voice agents on every line, including overnight. Written back to the chart." },
    { name: "Fabric", body: "No-code agents for the workflows you actually run, on your Genome." },
    { name: "Float", body: "Payer hold, underpayments, coding, and denials — the financial work that used to sit in a queue." },
  ],
} as const;

export const DOEHOME_FAQ = {
  title: "Built for the teams who deliver care.",
  items: [
    {
      q: "What is Genome?",
      a: "Genome is Doe’s core product: an intelligence model for your clinic. Multi-site groups can run a model per clinic. Clinics can run a model per provider. Each is post-trained on that team’s workflow data.",
    },
    {
      q: "Where does patient data go?",
      a: "Routine work stays on the clinic’s own Genome. Only hard cases route to a frontier model. Workflow outcomes used for weekly training are ones your team already approved.",
    },
    {
      q: "What does Pulse do?",
      a: "Pulse is voice AI for the clinic line. Separate agents for front desk, prior auth, and nights — each with their own voice, language, tone, and hours. Overnight voicemail is returned at open.",
    },
    {
      q: "Do we need engineers to use Fabric?",
      a: "No. Fabric is a visual builder. Describe a step, add a branch, add a human handoff. Agents run on your Genome, not a generic model.",
    },
    {
      q: "How is Float different from a billing vendor?",
      a: "Float watches remittance against contracted rates, stays on payer hold, suggests codes from the visit, and queues denials before they expire. It writes outcomes back to the chart.",
    },
    {
      q: "Can a group see every clinic?",
      a: "Yes. A group owner watches every clinic Genome from one dashboard, then opens a location to see the workflow submodels and providers underneath it.",
    },
  ],
} as const;

export const DOEHOME_CTA = {
  title: "Bring Doe into your clinic.",
  body: "Tell us about the site. We’ll follow up.",
  submit: "Join waitlist",
  fields: {
    name: "Name",
    company: "Clinic name",
    website: "Website",
    email: "Work email",
  },
} as const;

export const DOEHOME_FOOTER = {
  blurb: "Doe Intelligence, Inc.",
  coverageCta: "Join waitlist",
  legal: "Doe is an AI platform for clinics.",
  email: DOEHOME_CONTACT_EMAIL,
  fill: "#3050e0",
  productLabel: "Product",
  columns: [
    {
      title: "Company",
      links: [
        { href: "/story", label: "Story" },
        { href: "/product", label: "Product" },
        { href: "#faq", label: "FAQ" },
      ],
    },
  ],
} as const;
