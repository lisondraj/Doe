export type JoinInternTrack = {
  title: string;
  description: readonly [string, string, string];
  graphic: 0 | 1 | 2 | 3;
  /** Agents radial gradient (line art only — no dot grid). */
  cardFill?: "beige" | "agents";
};

export const JOIN_INTERN_TRACKS: readonly JoinInternTrack[] = [
  {
    title: "Clinical",
    description: [
      "Rotate alongside practicing clinicians.",
      "See how care decisions happen at the bedside.",
      "Build context for everything you ship.",
    ],
    graphic: 0,
  },
  {
    title: "Engineering",
    description: [
      "Ship features used in real clinics.",
      "Work across product, infra, and clinical AI.",
      "Learn how healthcare software actually ships.",
    ],
    graphic: 1,
    cardFill: "agents",
  },
  {
    title: "Research",
    description: [
      "Study how systems deliver care at scale.",
      "Partner with clinical and ops teams on pilots.",
      "Turn observations into measurable outcomes.",
    ],
    graphic: 2,
  },
  {
    title: "Operations",
    description: [
      "See how a modern practice runs day to day.",
      "Support intake, routing, and patient comms.",
      "Understand the business of care delivery.",
    ],
    graphic: 3,
    cardFill: "agents",
  },
] as const;
