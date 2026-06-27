/** Section-2 carousel menu overlays — join-adjacent scale, distinct from /join hero cards. */
export const CAROUSEL_MENU_UI = {
  overlayPadX: "clamp(0.45rem,1.35vmin,0.75rem)",
  overlayPadY: "clamp(0.3rem,1vmin,0.55rem)",
  maxWidth: "min(99%,36rem)",
  maxWidthPhone: "min(99%,38rem)",
  cardRadius: "rounded-[clamp(1.05rem,0.88rem+0.8vmin,1.3rem)]",
  cardShell:
    "overflow-hidden border border-[#D9D4CC]/92 bg-white shadow-[0_20px_56px_rgba(30,52,58,0.22)]",
  padX: "clamp(1.05rem,3.6vmin,1.45rem)",
  padY: "clamp(0.9rem,3vmin,1.25rem)",
  type: {
    eyebrow: "clamp(0.68rem,2.15vmin,0.86rem)",
    caption: "clamp(0.78rem,2.45vmin,0.96rem)",
    body: "clamp(0.98rem,3.15vmin,1.18rem)",
    title: "clamp(1.12rem,3.55vmin,1.38rem)",
    headline: "clamp(1.28rem,4.1vmin,1.58rem)",
    display: "clamp(1.45rem,4.65vmin,1.82rem)",
  },
  row: "rounded-[0.68rem] border border-[#EDE9E2] bg-[#FAFAF8]",
  divider: "#EBE7E0",
  ink: "#1E343A",
  muted: "rgba(30, 52, 58, 0.52)",
  accent: "#D2774C",
} as const;
