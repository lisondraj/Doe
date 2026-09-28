/** Static /doehealth hero copy — Introducing / Genome 1.0 (see DoeHealthHeroGenomeCopy). */
export const DOEHEALTH_HERO_GENOME_COPY = {
  eyebrow: "Introducing",
  title: "Genome 1.0",
  subheadingLine1: "Health deserves",
  subheadingLine2: "personalized intelligence.",
} as const;

/** Hero headline props for /doehealth — no rotating carousel entries. */
export const DOEHEALTH_HERO_HEADLINE = {
  line1: DOEHEALTH_HERO_GENOME_COPY.title,
  line2: "",
  className: "doehealth-hero-headline",
} as const;
