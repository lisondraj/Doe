export const STORY_FABRIC_CANVAS = {
  prompt: "Describe a block…",
  tools: ["Start", "If", "Human"],
  apps: ["Athena", "Epic", "Fax"],
  steps: [
    { id: "start", kicker: "Start", label: "New referral" },
    { id: "if", kicker: "If", label: "Records complete?" },
  ],
  outcomes: [
    { id: "then", kicker: "Then", label: "Book visit" },
    { id: "else", kicker: "Else", label: "Request records" },
  ],
  handoff: { kicker: "Human", label: "Covering MD" },
} as const;

export const STORY_FABRIC_TONE = [
  {
    id: "maya",
    name: "Maya",
    role: "Front desk",
    specialty: "Pediatrics",
    sample: "Friday 10:20 is open.",
    tone: "Warm",
    pace: "Calm",
    language: "EN · ES",
  },
  {
    id: "cole",
    name: "Cole",
    role: "Follow-up",
    specialty: "Ortho",
    sample: "Your MRI is in. I’ll send it.",
    tone: "Direct",
    pace: "Brisk",
    language: "EN",
  },
] as const;

export const STORY_FABRIC_LIBRARY = {
  eyebrow: "Community · 3 flows",
  items: [
    {
      id: "preop",
      title: "Pre-op intake",
      source: "Texas · colorectal",
      uses: "1.2k",
      selected: true,
    },
    {
      id: "auth",
      title: "Prior auth packet",
      source: "Ohio · ortho",
      uses: "840",
      selected: false,
    },
    {
      id: "refill",
      title: "Refill triage",
      source: "NY · peds",
      uses: "610",
      selected: false,
    },
  ],
} as const;

export const STORY_FABRIC_SIM = [
  {
    id: "parent",
    scenario: "Angry parent",
    result: "Escalate",
    mode: "Private",
    who: "Parent",
    text: "Nobody called me back.",
    agent: "I’ll page the covering MA now.",
  },
  {
    id: "senior",
    scenario: "Confused senior",
    result: "Repeat",
    mode: "Private",
    who: "Helen",
    text: "Is this about Thursday?",
    agent: "Yes — 10:20 with Dr. Chen.",
  },
  {
    id: "rush",
    scenario: "Rushed new patient",
    result: "Book",
    mode: "Private",
    who: "Luis",
    text: "Can I come in today?",
    agent: "2:40 is open. I’ll hold it.",
  },
] as const;

export const STORY_FABRIC_GOLD_TITLES = {
  canvas: ["Build clinic agents with", "branches and a human handoff."],
  tone: ["Set each agent's voice,", "tone, language, and pace."],
  library: ["Start from peer-tested flows", "then adapt them for your clinic."],
  sim: ["Test the agent in private", "before a real call goes live."],
} as const;

export const STORY_FABRIC_TILE_COPY = {
  canvas:
    "Fabric is a visual builder for clinic agents. Describe a step, or drag a branch and a human handoff, without waiting on an engineering ticket.",
  tone:
    "Give each agent a voice that belongs to the practice — warm for pediatrics, direct for surgical follow-up — in the languages your panel actually speaks.",
  library:
    "Start from a peer-tested flow. A colorectal surgeon in Texas shares pre-op intake; you adapt it for your own clinic.",
  sim:
    "Hear how the agent handles an angry parent, a confused senior, or a rushed new patient before a single real call goes live.",
} as const;
