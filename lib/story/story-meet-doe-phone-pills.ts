export type StoryMeetDoePhonePillSize = "xs" | "sm" | "md" | "lg";

export type StoryMeetDoePhonePill = {
  id: string;
  agent: string;
  number: string;
  size: StoryMeetDoePhonePillSize;
  gradient: string;
  top: string;
  left?: string;
  right?: string;
  zIndex: number;
  opacity?: number;
  /** Anchor horizontally on left percentage. */
  central?: boolean;
};

/** Extra waveform bars for the central Scheduling Agent pill. */
export const STORY_MEET_DOE_PHONE_CENTRAL_WAVE_BAR_COUNT = 24;

/** Bar count per pill size — speech waveform under each call pill. */
export const STORY_MEET_DOE_PHONE_WAVE_BAR_COUNTS: Record<StoryMeetDoePhonePillSize, number> = {
  lg: 22,
  md: 18,
  sm: 14,
  xs: 10,
};

/** Deterministic speech-like bar heights (0–1) per pill. */
export function storyMeetDoeSpeechWaveHeights(pillId: string, barCount: number): number[] {
  if (barCount <= 0) return [];

  let seed = pillId.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 7);
  const heights: number[] = [];

  for (let index = 0; index < barCount; index += 1) {
    seed = (seed * 1_664_525 + 1_013_904_223 + index) >>> 0;
    const roll = (seed % 10_000) / 10_000;

    if (roll < 0.18) {
      heights.push(0.08 + roll * 0.55);
    } else if (roll < 0.42) {
      heights.push(0.22 + roll * 0.72);
    } else if (roll < 0.78) {
      heights.push(0.46 + roll * 0.48);
    } else {
      heights.push(0.68 + roll * 0.32);
    }
  }

  return heights;
}

/** Overlapping call pills — one central, others scattered; flat orientation. */
export const STORY_MEET_DOE_PHONE_PILLS: readonly StoryMeetDoePhonePill[] = [
  {
    id: "pill-central",
    agent: "Scheduling Agent",
    number: "(415) 555-0142",
    size: "lg",
    gradient: "linear-gradient(135deg, #E8C08E 0%, #D4893F 100%)",
    top: "38%",
    left: "50%",
    zIndex: 8,
    central: true,
  },
  {
    id: "pill-2",
    agent: "Billing Agent",
    number: "(628) 555-0198",
    size: "md",
    gradient: "linear-gradient(145deg, #D49D4F 0%, #BF593D 100%)",
    top: "4%",
    left: "10%",
    zIndex: 5,
    opacity: 0.92,
  },
  {
    id: "pill-3",
    agent: "Referral Agent",
    number: "(917) 555-0108",
    size: "sm",
    gradient: "linear-gradient(160deg, #D2774C 0%, #C47A5A 100%)",
    top: "2%",
    left: "52%",
    zIndex: 7,
    opacity: 0.56,
  },
  {
    id: "pill-4",
    agent: "Intake Agent",
    number: "(212) 555-0176",
    size: "md",
    gradient: "linear-gradient(120deg, #E8C08E 0%, #D2774C 100%)",
    top: "58%",
    left: "8%",
    zIndex: 4,
    opacity: 0.88,
  },
  {
    id: "pill-5",
    agent: "Labs Agent",
    number: "(503) 555-0133",
    size: "sm",
    gradient: "linear-gradient(180deg, #BF593D 0%, #D49D4F 100%)",
    top: "44%",
    left: "64%",
    zIndex: 6,
    opacity: 0.5,
  },
  {
    id: "pill-6",
    agent: "Triage Agent",
    number: "(310) 555-0164",
    size: "md",
    gradient: "linear-gradient(125deg, #C47A5A 0%, #D4893F 100%)",
    top: "22%",
    left: "5%",
    zIndex: 5,
    opacity: 0.74,
  },
  {
    id: "pill-7",
    agent: "Prior Auth Agent",
    number: "(646) 555-0119",
    size: "sm",
    gradient: "linear-gradient(155deg, #D4893F 0%, #BF593D 100%)",
    top: "16%",
    left: "58%",
    zIndex: 4,
    opacity: 0.62,
  },
  {
    id: "pill-8",
    agent: "Follow-up Agent",
    number: "(512) 555-0155",
    size: "xs",
    gradient: "linear-gradient(170deg, #E8C08E 0%, #C47A5A 100%)",
    top: "66%",
    left: "26%",
    zIndex: 3,
    opacity: 0.44,
  },
  {
    id: "pill-9",
    agent: "Records Agent",
    number: "(404) 555-0127",
    size: "sm",
    gradient: "linear-gradient(140deg, #D2774C 0%, #D49D4F 100%)",
    top: "62%",
    right: "2%",
    zIndex: 5,
    opacity: 0.82,
  },
] as const;
