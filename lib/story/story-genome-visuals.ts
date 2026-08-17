export const STORY_GENOME_FLEET = {
  group: "Northstar Health",
  clinicCount: "4 models",
  clinics: [
    { id: "riverside", name: "Riverside", selected: false },
    { id: "harbor", name: "Harbor", selected: true },
    { id: "oakridge", name: "Oakridge", selected: false },
    { id: "westlake", name: "Westlake", selected: false },
  ],
  selected: {
    name: "Harbor Ortho",
    model: "Harbor Genome",
    version: "v2.1",
    submodels: [
      { id: "pa", task: "Prior auth" },
      { id: "ri", task: "Referral" },
      { id: "vp", task: "Visit prep" },
    ],
  },
} as const;

export const STORY_GENOME_ROUTER = {
  personal: {
    label: "Your model",
    note: "Clinic",
    count: "3",
    tasks: ["Confirm visit", "Visit summary", "Referral file"],
  },
  frontier: {
    label: "Frontier",
    note: "Shared",
    count: "1",
    tasks: ["Denial appeal"],
  },
} as const;

export const STORY_GENOME_TRAIN = {
  when: "Sunday 6:00pm",
  clinic: "Harbor Ortho",
  toVersion: "v2.2",
  fromVersion: "v2.1",
  sources: ["Prior auth", "Referral", "Visit prep"],
  signals: "1,284 outcomes",
  cta: "Train",
} as const;

export const STORY_GENOME_AGENTS = {
  model: "Harbor Genome",
  modelNote: "Your model",
  left: { id: "intake", kicker: "Trigger", label: "Front desk" },
  right: [
    { id: "auth", kicker: "Agent", label: "Prior auth" },
    { id: "referral", kicker: "Agent", label: "Referral" },
  ],
  presets: [
    { id: "scribe", label: "Scribe" },
    { id: "billing", label: "Billing" },
    { id: "triage", label: "Triage" },
  ],
} as const;

export const STORY_GENOME_GOLD_TITLES = {
  fleet: ["Every clinic gets their", "own intelligence model."],
  router: ["Sensitive patient information", "sent to clinic's own model"],
  train: ["Clinics can train their model", "off last week's completed tasks"],
  agents: [
    "No-code canvas to build",
    "agents on top of clinic's intelligence.",
  ],
} as const;

export const STORY_GENOME_TILE_COPY = {
  fleet:
    "A group owner can watch every clinic’s Genome from one dashboard, then open a location to see the workflow submodels underneath it.",
  router:
    "Genome routes routine work to the clinic’s own model and sends only the hard cases to a frontier model.",
  train:
    "At the end of the week, prompt Genome to train the next version from approved workflow outcomes.",
  agents:
    "In Fabric, the agents you build run on your clinic’s Genome — not a generic model.",
} as const;
