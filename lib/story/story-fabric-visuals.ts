export const STORY_FABRIC_CANVAS = {
  branch: {
    kicker: "If records in?",
    paths: [
      { id: "then", label: "Book visit", fill: 78 },
      { id: "else", label: "Request", fill: 36 },
    ],
  },
  start: {
    kicker: "Canvas",
    nodes: [
      { id: "now", label: "New referral", on: true },
      { id: "next", label: "If", on: false },
      { id: "then", label: "Then", on: false },
    ],
  },
  handoff: {
    kicker: "Handoff",
    mark: "MD",
    name: "Covering MD",
  },
} as const;

export const STORY_FABRIC_TONE = [
  {
    id: "maya",
    name: "Maya",
    language: "EN · ES",
    levels: [
      { id: "tone", label: "Warm", fill: 86 },
      { id: "pace", label: "Calm", fill: 40 },
    ],
  },
  {
    id: "cole",
    name: "Cole",
    language: "EN",
    levels: [
      { id: "tone", label: "Direct", fill: 32 },
      { id: "pace", label: "Brisk", fill: 88 },
    ],
  },
] as const;

export const STORY_FABRIC_LIBRARY = {
  kicker: "Peer flow",
  title: "Pre-op intake",
  count: "1.2k",
  label: "clinics on this flow",
  sent: "1",
  sentLabel: "your clinic",
  clinics: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] as const,
} as const;

export const STORY_FABRIC_SIM = {
  booth: {
    kicker: "Private",
    count: "0",
    label: "live calls",
    sent: "3",
    sentLabel: "tested",
    slots: [1, 1, 1] as const,
  },
  runs: [
    {
      id: "parent",
      scenario: "Angry parent",
      result: "Escalate",
      turns: [82, 48, 94],
    },
    {
      id: "senior",
      scenario: "Confused senior",
      result: "Repeat",
      turns: [64, 64, 46],
    },
  ],
} as const;

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
