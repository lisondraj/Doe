export const DOEHEALTH_DESK_GENOME_PROBLEM = [
  {
    parts: [
      { text: "Healthcare AI is built on ", tone: "cream" as const },
      { text: "borrowed intelligence.", tone: "salmon" as const },
    ],
  },
  {
    parts: [{ text: "Built by big AI labs.", tone: "cream" as const }],
  },
  {
    parts: [{ text: "Controlled outside your practice.", tone: "cream" as const }],
  },
  {
    parts: [
      { text: "Trusted with your most ", tone: "cream" as const },
      { text: "sensitive work.", tone: "salmon" as const },
    ],
  },
] as const;

export const DOEHEALTH_DESK_GENOME_BELIEVE = {
  parts: [
    { text: "We believe providers and their patients should own their own ", tone: "cream" as const },
    { text: "health intelligence.", tone: "salmon" as const },
  ],
} as const;

export const DOEHEALTH_DESK_GENOME_LOCKUP = {
  eyebrow: "Introducing",
  title: "Genome 1.0",
  dek: "Doe's flagship architecture for building, deploying, and improving your own intelligence model.",
} as const;

export const DOEHEALTH_DESK_GENOME_BEATS = [
  { id: "open", weight: 1 },
  { id: "hold0", weight: 0.55 },
  { id: "roll1", weight: 0.65 },
  { id: "hold1", weight: 0.55 },
  { id: "roll2", weight: 0.65 },
  { id: "hold2", weight: 0.55 },
  { id: "roll3", weight: 0.65 },
  { id: "holdTrust", weight: 1.25 },
  { id: "outTrust", weight: 0.5 },
  { id: "inBelieve", weight: 0.45 },
  { id: "swipeBelieve", weight: 1.15 },
  { id: "holdBelieve", weight: 1.25 },
  { id: "outBelieve", weight: 0.5 },
  { id: "inIntro", weight: 0.6 },
  { id: "inGenome", weight: 0.8 },
  { id: "holdGenome", weight: 1 },
] as const;

export const DOEHEALTH_DESK_GENOME_BEAT_TOTAL = DOEHEALTH_DESK_GENOME_BEATS.reduce(
  (sum, beat) => sum + beat.weight,
  0,
);

export type DoeHealthDeskGenomeBeatId = (typeof DOEHEALTH_DESK_GENOME_BEATS)[number]["id"];

export function doehealthDeskGenomeProgressAt(id: DoeHealthDeskGenomeBeatId) {
  let walked = 0;
  for (const beat of DOEHEALTH_DESK_GENOME_BEATS) {
    if (beat.id === id) return walked / DOEHEALTH_DESK_GENOME_BEAT_TOTAL;
    walked += beat.weight;
  }
  return 1;
}

/** Scroll progress where Introducing / Genome 1.0 has landed (dek still follows). */
export const DOEHEALTH_DESK_GENOME_INTRO_PROGRESS = doehealthDeskGenomeProgressAt("inGenome");

/** Scroll progress where the lockup is complete, including the flagship dek. */
export const DOEHEALTH_DESK_GENOME_FINAL_PROGRESS = doehealthDeskGenomeProgressAt("holdGenome");

export function doehealthDeskGenomeBeat(progress: number) {
  const x = Math.min(1, Math.max(0, progress)) * DOEHEALTH_DESK_GENOME_BEAT_TOTAL;
  let walked = 0;
  for (let i = 0; i < DOEHEALTH_DESK_GENOME_BEATS.length; i += 1) {
    const beat = DOEHEALTH_DESK_GENOME_BEATS[i];
    const next = walked + beat.weight;
    if (x <= next || i === DOEHEALTH_DESK_GENOME_BEATS.length - 1) {
      return { id: beat.id, t: Math.min(1, Math.max(0, (x - walked) / beat.weight)), i };
    }
    walked = next;
  }
  const last = DOEHEALTH_DESK_GENOME_BEATS[DOEHEALTH_DESK_GENOME_BEATS.length - 1];
  return { id: last.id, t: 1, i: DOEHEALTH_DESK_GENOME_BEATS.length - 1 };
}
