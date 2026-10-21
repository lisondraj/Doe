/** /earlypreview hero title: two lines, fixed (the /doehealthdesk2 hero picks at random). */
export const EARLYPREVIEW_HERO_HEADLINE = {
  line1: "Personal agents are here.",
  line2: "But healthcare is not ready.",
} as const;

/** /earlypreview second section (the beige band under the hero): its own title, two lines, fixed. */
export const EARLYPREVIEW_BAND_HEADLINE = {
  line1: "We've been building together",
  line2: "since we were young.",
} as const;

/** /earlypreview beige section under the enterprise one: its own title, two lines, fixed. */
export const EARLYPREVIEW_PRACTICES_HEADLINE = {
  line1: "We're accelerating growth",
  line2: "through private practices.",
} as const;

/** /earlypreview enterprise section: its small text, one entry per line (two lines, like the others). */
export const EARLYPREVIEW_ENTERPRISE_DEK = [
  "Personal agents will entirely transform the way",
  "patients navigate through larger health systems.",
] as const;

/** /earlypreview second section: its small text, one entry per line (two lines, like the hero's). */
export const EARLYPREVIEW_BAND_DEK = [
  "James & Matthew Lisondra combine their expertise",
  "to reinvent healthcare in the era of personal agents.",
] as const;

/** /earlypreview hero small text: two lines under the title. */
export const EARLYPREVIEW_HERO_DEK = [
  "Doe is building an intelligent platform",
  "connecting healthcare & personal agents.",
] as const;
