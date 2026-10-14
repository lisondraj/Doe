export const VIDEO1_WIDTH = 1920;
export const VIDEO1_HEIGHT = 1080;
export const VIDEO1_FPS = 30;

export const C = {
  beige: "#F4EEDF",
  paper: "#FFFCF1",
  ink: "#140C04",
  walnut: "#281910",
  salmon: "#FCCFB8",
  salmonText: "#7A3E26",
  sand2: "#E8DCC4",
  sand3: "#CDBD9E",
  muted: "rgba(40, 25, 16, 0.62)",
  faint: "rgba(40, 25, 16, 0.45)",
  line: "rgba(40, 25, 16, 0.10)",
  line2: "rgba(40, 25, 16, 0.16)",
  chip: "rgba(40, 25, 16, 0.07)",
  dot: "#C2A987",
  alert: "#E07C55",
  alertText: "#B4552F",
  live: "#6E9A5B",
  liveText: "#3F6431",
  liveBg: "rgba(110, 154, 91, 0.14)",
} as const;

/** next/font variables are set on the /video1 wrapper; fallbacks cover headless renders. */
export const F = {
  display: "var(--font-p22-mackinac, 'P22 Mackinac Pro', Georgia, serif)",
  ui: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)",
  body: "var(--font-inter, Inter, system-ui, sans-serif)",
  ios: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
} as const;

export const SHADOW = {
  card: "0 1px 2px rgba(40, 25, 16, 0.06), 0 2px 8px rgba(40, 25, 16, 0.03)",
  float: "0 1px 2px rgba(40, 25, 16, 0.05), 0 24px 64px rgba(40, 25, 16, 0.10)",
  shell: "0 40px 120px rgba(40, 25, 16, 0.20)",
} as const;
