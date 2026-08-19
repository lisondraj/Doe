export const STORY_GENOME_SEALS = {
  clinics: [
    { id: "harbor", initials: "HO", name: "Harbor", version: "v2.1", selected: true },
    { id: "riverside", initials: "RI", name: "Riverside", version: "v1.9", selected: false },
    { id: "oakridge", initials: "OR", name: "Oakridge", version: "v2.0", selected: false },
    { id: "westlake", initials: "WL", name: "Westlake", version: "v1.8", selected: false },
  ],
} as const;

export const STORY_GENOME_KEPT = {
  clinic: "Harbor Genome",
  kept: "1,204",
  keptLabel: "on this Genome",
  sent: "0",
  sentLabel: "to Frontier",
} as const;

export const STORY_GENOME_SUNDAY = {
  day: "Sun",
  time: "6:00",
  count: "v2.2",
  from: "v2.1",
  countLabel: "from 1,284 tasks",
  marks: [
    { id: "mon", label: "M" },
    { id: "tue", label: "T" },
    { id: "wed", label: "W" },
    { id: "thu", label: "T" },
    { id: "fri", label: "F" },
    { id: "sat", label: "S" },
    { id: "sun", label: "S" },
  ],
} as const;

export const STORY_GENOME_KNOWS = {
  clinic: "Harbor Genome",
  layers: [
    { id: "desk", label: "Front desk", count: "412", share: 100 },
    { id: "auth", label: "Prior auth", count: "286", share: 78 },
    { id: "referral", label: "Referral", count: "194", share: 56 },
    { id: "prep", label: "Visit prep", count: "128", share: 38 },
  ],
} as const;

export const STORY_GENOME_GOLD_TITLES = {
  seals: ["Every clinic gets their", "own Genome."],
  kept: ["Patient information stays", "on Harbor's Genome."],
  sunday: ["Train next Genome", "off last week's work."],
  knows: ["Agents run on top of", "the clinic's Genome."],
} as const;

export const STORY_GENOME_TILE_COPY = {
  seals:
    "Each clinic in the group has its own Genome. Harbor’s v2.1 is not Riverside’s, and none of them is a shared generic model.",
  kept:
    "Sensitive patient information is sent to Harbor’s own Genome. Routine work stays there; nothing PHI is handed to a frontier model.",
  sunday:
    "Sunday close trains the next Harbor Genome from last week’s completed tasks — 1,284 approved outcomes become v2.2.",
  knows:
    "The agents you build sit on Harbor’s Genome. Front desk, prior auth, referral, and visit prep all run on this clinic’s intelligence.",
} as const;
