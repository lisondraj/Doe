export const DOEHEALTH_DESK_GENOME = {
  eyebrow: "Introducing",
  title: "Genome 1.0",
  lines: [
    "Our flagship blueprint for building, deploying,",
    "and improving your own intelligence model.",
  ],
} as const;

/**
 * Genome reveal sequence: headline lines fade up, horizontal highlight, description, board.
 * darkenMs / darkenDelayMs must match `--desk-genome-headline-darken-*` in doehealth-desk.css.
 */
export function doehealthDeskGenomeTiming(desktop: boolean) {
  return desktop
    ? {
        startDelayMs: 200,
        introRevealMs: 950,
        darkenMs: 5_500,
        darkenDelayMs: 700,
        /** Description starts once the ease-out sweep is visually mostly done. */
        bodyAfterDarkenRatio: 0.6,
        dekStaggerMs: 140,
        boardAfterDekMs: 180,
      }
    : {
        startDelayMs: 0,
        introRevealMs: 640,
        darkenMs: 4_000,
        darkenDelayMs: 500,
        bodyAfterDarkenRatio: 1,
        dekStaggerMs: 100,
        boardAfterDekMs: 120,
      };
}
