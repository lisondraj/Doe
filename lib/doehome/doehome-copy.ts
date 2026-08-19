export const DOEHOME_CONTACT_EMAIL = "james@doe.care";

/** Solid promo banner on `/doehomepage`. Top overscroll matches this; bottom stays espresso. */
export const DOEHOME_GOLD_SOLID = "#d4a574";
export const DOEHOME_PAGE_SURFACE = "#1a1208";

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
    "Your clinic, your model",
    "Pulse answers every line",
    "Agents on your model",
  ],
  promoCta: "Join waitlist",
  menuOpen: "Open menu",
  menuClose: "Close menu",
} as const;

export const DOEHOME_HERO = {
  title: "Building personalized",
  tagline: ["intelligence for every clinic."],
  lede: "Doe is an AI-native operating system for your patient. Sign up to secure an intelligent model for your clinic.",
  emailLabel: "Work email",
  emailPlaceholder: "you@clinic.com",
  primaryCta: "Join Waitlist",
  secondaryCta: "See Genome",
} as const;

export const DOEHOME_HERO_TAPE = {
  clinic: "Harbor Ortho",
  heading: "This morning",
  title: "After Hours Summary",
  columns: ["Event", "Chart", "Source"],
  foot: "Version 2.1 underneath it all",
  lines: [
    { t: "7:04", text: "Overnight refill", chart: "Dana K. · note", source: "Pulse" },
    { t: "7:06", text: "Cancel visit", chart: "Marcus T. · schedule", source: "Human" },
    { t: "8:12", text: "Maya on the main line", chart: "Elena R. · call", source: "Pulse" },
    { t: "8:14", text: "Friday 10:20 held", chart: "James L. · visit", source: "Human" },
  ],
} as const;

export const DOEHOME_STATS = [
  {
    value: "Your Own Model",
    label: "Genome brings security & frontier intelligence to every clinic.",
    productLink: "genome",
  },
  {
    value: "Full-Suite of AI Agents",
    label: "Fabric is a no-code canvas that allows you to automate any workflow.",
    productLink: "fabric",
  },
  {
    value: "AI for Your Finances",
    label: "Float handles remittance, contracts, and denials for the front desk.",
    productLink: "float",
  },
] as const;

/** iPhone hero stat row — Fabric, Pulse, Float (Genome sits above). */
export const DOEHOME_IPHONE_STAT_ROW = [
  { product: "fabric", tagline: "Design AI Agents" },
  { product: "pulse", tagline: "Voice Agents" },
  { product: "float", tagline: "AI for Your Finances" },
] as const;

export const DOEHOME_IPHONE_GENOME_TAGLINE = ["Personalized intelligence", "for your clinic"] as const;

export const DOEHOME_GENOME = {
  id: "genome",
  title: ["Intelligence for every", "clinic and provider."],
  lede: "Genome gives every clinic and provider its own model. A group can run one per site. A clinic can run one per provider. Each model learns from your team’s workflow, from prior auth and referrals to visit prep, so the software fits how you actually work.",
  genericLabel: "Generic hospital model",
  genericNote: "Same answers at every site",
  yoursLabel: "Harbor model",
  yoursNote: "Post-trained on this clinic",
  groupLabel: "Group",
  clinicLabel: "Clinic",
  providerLabel: "Provider",
  modelLabel: "This model",
  trainLabel: "Weekly train from approved work",
  trainCta: "Train Version 2.2",
  trainWhen: "Sunday 6:00pm",
  trainSignals: "1,284 outcomes",
  trainMeta: "Sunday 6:00pm, 1,284 outcomes",
  clinicPathLabel: "Stays on Harbor’s model",
  frontierLabel: "Frontier only if needed",
  groupWindowTitle: "Northstar Health models",
  group: {
    name: "Northstar Health",
    count: "4 clinic models",
  },
  tableTitle: "Clinic model discovery",
  columns: ["Clinic", "Model", "Version", "State"],
  clinics: [
    { id: "riverside", name: "Riverside", model: "Riverside model", version: "Version 1.8", state: "Idle" },
    { id: "harbor", name: "Harbor Ortho", model: "Harbor model", version: "Version 2.1", state: "Live" },
    { id: "oakridge", name: "Oakridge", model: "Oakridge model", version: "Version 1.4", state: "Idle" },
    { id: "westlake", name: "Westlake", model: "Westlake model", version: "Version 1.9", state: "Train" },
  ],
  providers: [
    { id: "chen", name: "Dr. Chen", model: "Chen model", note: "Visit prep, referrals" },
    { id: "ruiz", name: "Dr. Ruiz", model: "Ruiz model", note: "Prior auth, imaging" },
    { id: "patel", name: "Dr. Patel", model: "Patel model", note: "Scribe, follow-up" },
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
  title: ["Voice agents answer", "every single call."],
  lede: "Pulse is voice AI for your clinic lines. Front desk, prior auth, and after hours each get their own agent with voice, language, and hours. Every call gets answered, and overnight voicemails return at open on the chart.",
  number: "(416) 555-0140",
  live: "Live",
  human: "Take over",
  agents: [
    { id: "desk", name: "Front desk", voice: "Maya", language: "EN, ES", tone: "Warm", state: "Live", time: "0:42", hours: "8a to 6p" },
    { id: "auth", name: "Prior auth", voice: "Cole", language: "EN", tone: "Direct", state: "Hold", time: "4:18", hours: "Always" },
    { id: "sched", name: "Scheduling", voice: "Maya", language: "EN, ES", tone: "Calm", state: "Live", time: "1:06", hours: "8a to 6p" },
    { id: "nights", name: "After hours", voice: "Lina", language: "EN, FR", tone: "Soft", state: "Live", time: "0:19", hours: "6p to 8a" },
  ],
  call: {
    line: "Main clinic line",
    agent: "Maya",
    liveLabel: "Maya, Live",
    turns: [
      { who: "Dana", text: "Can I move Thursday to Friday?" },
      { who: "Maya", text: "Friday 10:20 is open. I’ll hold it." },
      { who: "Dana", text: "That’s perfect, thank you." },
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
  title: ["A canvas to build", "your own agents."],
  lede: "Fabric is a no-code canvas for building your own agents. Start with a trigger, add branches and human handoffs, and publish without an engineering ticket. Every flow runs on your clinic’s model, not a generic one.",
  runsOn: "Runs on Harbor’s model",
  prompt: "Describe a block…",
  tools: ["Start", "If", "Human"],
  steps: [
    { id: "start", kicker: "Start", label: "New referral" },
    { id: "if", kicker: "If", label: "Records complete?" },
    { id: "then", kicker: "Then", label: "Book visit" },
    { id: "human", kicker: "Human", label: "Covering MD" },
  ],
  library: [
    { id: "preop", title: "Pre-op intake", source: "Texas, colorectal", uses: "1.2k" },
    { id: "auth", title: "Prior auth packet", source: "Ohio, ortho", uses: "840" },
    { id: "triage", title: "Refill triage", source: "NY, peds", uses: "610" },
  ],
} as const;

export const DOEHOME_FLOAT = {
  id: "float",
  title: ["See the money", "payers are keeping."],
  lede: "Float is the financial layer. Agents sit on payer hold so your front desk does not. Remittance is checked against the contract. Codes come from the visit. Denials are appealed before they expire.",
  windowTitle: "Aetna remittance",
  tableTitle: "Would you like me to call?",
  columns: ["Payer", "Claim", "Allow.", "Paid"],
  underpay: "−$18k",
  underpayNote: ["Aetna paid 82% of contracted", "rate this month"] as const,
  contractLabel: "Contract",
  paidLabel: "Paid",
  contract: 100,
  paid: 82,
  claims: [
    { payer: "Aetna", claim: "A-4419", allowed: "$220", paid: "$180", cut: 82 },
    { payer: "UHC", claim: "U-1182", allowed: "$410", paid: "$410", cut: 100 },
    { payer: "Cigna", claim: "C-7731", allowed: "$185", paid: "$140", cut: 76 },
  ],
  hold: {
    payer: "Aetna",
    task: "Prior auth, Harbor",
    timer: "14:22",
    status: "On hold",
    ref: "A-4419",
    note: "No one from Harbor is waiting",
  },
  denials: [
    { payer: "UHC", reason: "Auth lapse", due: "Now" },
  ],
  allowedLabel: "Allow.",
  paidAmtLabel: "Paid",
  underLabel: "Kept by payer",
  allowed: "$220",
  paidAmt: "$180",
} as const;

export const DOEHOME_CHART = {
  id: "chart",
  title: ["If it happened,", "it’s in the chart."],
  lede: "Calls, bookings, holds, and denials write back to the record. The front desk does not retype Doe at the end of the day.",
  patient: "Dana K.",
  clinic: "Harbor Ortho",
  mrn: "MRN 4419",
  patientMeta: "MRN 4419, Harbor Ortho",
  windowTitle: "Harbor Ortho chart",
  tableTitle: "Chart write-back",
  columns: ["Field", "Value", "Source"],
  tabs: ["Chart", "Notes", "Auth"],
  inbox: ["Dana K.", "Luis M.", "Helen R."],
  fields: [
    { k: "Visit", v: "Fri 10:20, held" },
    { k: "Note", v: "Refill returned 7:04am" },
    { k: "Auth", v: "Aetna A-4419" },
  ],
  sources: ["Pulse", "Fabric", "Float"],
} as const;

export const DOEHOME_HANDOFF = {
  id: "handoff",
  title: ["A person can take", "any live job."],
  lede: "Pulse, Fabric, and Float keep the thread. When someone at Harbor takes over, they are not starting from a voicemail.",
  agent: { name: "Maya", role: "Pulse, front desk" },
  human: { name: "Maya Chen", role: "At the desk" },
  context: ["Dana K.", "Friday 10:20", "MRI follow-up"],
  cta: "Take over",
  badge: "Live thread",
  cardTitle: "Take over this job",
} as const;

export const DOEHOME_CONNECT = {
  id: "connect",
  title: ["Plugs into the stack", "you already have."],
  lede: "Doe does not ask the clinic to leave Athena, Epic, or the fax. The model sits underneath. Agents read and write through what you have.",
  ports: [
    { name: "Athena", kind: "EHR" },
    { name: "Epic", kind: "EHR" },
    { name: "Fax", kind: "Records" },
  ],
  tiles: [
    { mark: "At", name: "Athena" },
    { mark: "Ep", name: "Epic" },
    { mark: "Fx", name: "Fax" },
    { mark: "eC", name: "eClinicalWorks" },
    { mark: "DC", name: "DrChrono" },
    { mark: "Av", name: "Availity" },
    { mark: "Ss", name: "Surescripts" },
    { mark: "Wy", name: "Waystar" },
    { mark: "El", name: "Elation" },
    { mark: "MD", name: "ModMed" },
    { mark: "RC", name: "RingCentral" },
    { mark: "Tw", name: "Twilio" },
    { mark: "Ng", name: "NextGen" },
    { mark: "Gw", name: "Greenway" },
    { mark: "AM", name: "AdvancedMD" },
    { mark: "Ph", name: "Phreesia" },
    { mark: "CM", name: "CoverMyMeds" },
    { mark: "CH", name: "Change" },
  ],
  hub: "Harbor model",
  hubVersion: "Version 2.1",
} as const;

export const DOEHOME_OPEN = {
  id: "open",
  title: ["Overnight work is", "waiting at the door."],
  lede: "The clinic does not open to a voicemail pile. Pulse returned the calls. Notes are on the chart. Today is already moving.",
  closed: "Closed 6p to 8a",
  opened: "Open 8:00am",
  tableTitle: "Waiting at the door",
  columns: ["Overnight", "Task", "Chart"],
  items: [
    { at: "11:42pm", task: "Refill request", done: "On the chart" },
    { at: "1:18am", task: "Cancel visit", done: "On the chart" },
    { at: "5:02am", task: "New patient", done: "On the chart" },
  ],
} as const;

export const DOEHOME_BOOK = {
  id: "book",
  title: ["The open slot is", "already held."],
  lede: "Pulse books while the line is live. The week grid updates, the slot is pinned, and the chart already has Friday 10:20.",
  windowTitle: "Harbor Ortho week",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  hours: ["9:00", "10:20", "11:40"],
  held: { day: "Fri", hour: "10:20", name: "Dana K.", label: "Held" },
} as const;

export const DOEHOME_SCRIBE = {
  id: "scribe",
  title: ["The visit writes", "its own note."],
  lede: "Ambient capture sits in the room. The Harbor model turns the visit into a note, then writes it back so Dr. Chen is not typing after the patient leaves.",
  windowTitle: "Exam 2, Dr. Chen",
  room: "Exam 2",
  provider: "Dr. Chen",
  patient: "Dana K.",
  lines: [
    "MRI follow-up, right knee",
    "Hold Friday 10:20",
    "Refill already on the chart",
  ],
  stamp: "Wrote to chart",
  badge: "Ambient",
  cardTitle: "Visit note",
} as const;

export const DOEHOME_AUTH = {
  id: "auth",
  title: ["The auth packet", "builds itself."],
  lede: "Float stays on payer hold. The packet fills from the visit: order, clinic note, imaging. Harbor sends it before anyone sits on a queue.",
  windowTitle: "Aetna A-4419",
  payer: "Aetna",
  ref: "A-4419",
  pages: [
    { id: "order", label: "Order" },
    { id: "note", label: "Clinic note" },
    { id: "image", label: "Imaging" },
  ],
  stamp: "Sent",
  badge: "Pending",
  cardTitle: "Review packet",
  action: "Submit prior authorization",
  files: [
    { name: "Order.pdf", meta: "Harbor Ortho" },
    { name: "Clinic_note.pdf", meta: "Dr. Chen" },
    { name: "Imaging.pdf", meta: "Right knee MRI" },
  ],
} as const;

export const DOEHOME_BOARD = {
  id: "board",
  title: ["Today is already", "a work board."],
  lede: "Overnight work, live lines, and chart write-backs sit on one board. The front desk opens to a day that has already started.",
  windowTitle: "Harbor Ortho today",
  boardTitle: "Today’s board",
  columns: [
    {
      id: "overnight",
      name: "Overnight",
      cards: [
        { id: "refill", title: "Refill request", meta: "On the chart" },
        { id: "cancel", title: "Cancel visit", meta: "On the chart" },
      ],
    },
    {
      id: "live",
      name: "Live",
      cards: [{ id: "dana", title: "Dana K.", meta: "Main line" }],
    },
    {
      id: "chart",
      name: "Chart",
      cards: [{ id: "hold", title: "Friday 10:20", meta: "Held" }],
    },
  ],
} as const;

export const DOEHOME_STACK = {
  title: ["One platform.", "Genome underneath."],
  foundation: {
    name: "Genome",
    body: "The clinic model. Pulse, Fabric, and Float run on it.",
  },
  products: [
    { name: "Pulse", body: "Voice on every line, including overnight. Written back to the chart." },
    { name: "Fabric", body: "Agents for the workflows you actually run, on your model." },
    { name: "Float", body: "Payer hold, underpayments, coding, and denials." },
  ],
} as const;

export const DOEHOME_FAQ = {
  title: ["Built for the teams", "who deliver care."],
  items: [
    {
      q: "What is Genome?",
      a: "Genome is Doe’s core product: an intelligence model for your clinic. Multi-site groups can run a model per clinic. Clinics can run a model per provider. Each is post-trained on that team’s workflow data.",
    },
    {
      q: "Where does patient data go?",
      a: "Routine work stays on the clinic’s own model. Only hard cases route to a frontier model. Workflow outcomes used for weekly training are ones your team already approved.",
    },
    {
      q: "What does Pulse do?",
      a: "Pulse is voice AI for the clinic line. Separate agents for front desk, prior auth, and nights, each with their own voice, language, tone, and hours. Overnight voicemail is returned at open.",
    },
    {
      q: "Do we need engineers to use Fabric?",
      a: "No. Fabric is a visual builder. Describe a step, add a branch, add a human handoff. Agents run on your model, not a generic one.",
    },
    {
      q: "How is Float different from a billing vendor?",
      a: "Float watches remittance against contracted rates, stays on payer hold, suggests codes from the visit, and queues denials before they expire. It writes outcomes back to the chart.",
    },
    {
      q: "Can a group see every clinic?",
      a: "Yes. A group owner watches every clinic’s model from one dashboard, then opens a location to see the workflow and providers underneath it.",
    },
  ],
} as const;

export const DOEHOME_CTA = {
  title: ["Bring Doe", "into your clinic."],
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
  fill: "#1a1208",
  productLabel: "Product",
  columns: [
    {
      title: "Company",
      links: [
        { href: "/story", label: "Story" },
        { href: "/product", label: "Product" },
        { href: "#chart", label: "Chart" },
        { href: "#book", label: "Book" },
        { href: "#faq", label: "FAQ" },
      ],
    },
  ],
} as const;
