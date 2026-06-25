export type JoinInternTrack = {
  title: string;
  description: readonly [string, string, string];
  graphic: 0 | 1 | 2 | 3;
  /** Agents radial gradient (line art only — no dot grid). */
  cardFill?: "beige" | "agents";
};

export const JOIN_INTERN_TRACKS: readonly JoinInternTrack[] = [
  {
    title: "Experience",
    description: [
      "Build your resume in a high-growth, fast-paced startup.",
      "Take real ownership and ship meaningful work from day one.",
      "Learn how a lean team moves quickly without cutting corners.",
    ],
    graphic: 0,
  },
  {
    title: "Network",
    description: [
      "Connect with industry leaders and technical peers.",
      "Learn from clinicians, engineers, and operators in the field.",
      "Build relationships that outlast the internship.",
    ],
    graphic: 1,
    cardFill: "agents",
  },
  {
    title: "The Mission",
    description: [
      "Support Doe's mission to rebuild healthcare.",
      "Contribute to technical innovation across the US and Canada.",
      "Work on problems that touch real patients and providers.",
    ],
    graphic: 2,
  },
  {
    title: "Opportunity",
    description: [
      "A path to join the founding team after your internship.",
      "Equity opportunity for interns who grow with Doe.",
      "Shape what we build as an early contributor.",
    ],
    graphic: 3,
    cardFill: "agents",
  },
] as const;
