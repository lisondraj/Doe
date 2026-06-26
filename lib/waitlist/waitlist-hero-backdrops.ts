import {
  JOIN_HERO_EXTRA_BANDS,
  JOIN_HERO_PRIMARY_BACKDROP,
  type JoinHeroBandConfig,
} from "@/lib/join/join-hero-backdrops";

const [incoming, tools, integrate, join] = JOIN_HERO_EXTRA_BANDS;

/** /waitlist hero bands — independent copy from /join; diverge copy here over time. */
export const WAITLIST_HERO_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "agents",
    showInbox: true,
    headline: ["A platform", "built for you."],
    backdrop: JOIN_HERO_PRIMARY_BACKDROP,
  },
  {
    ...incoming,
    headline: ["By doctors,", "for doctors."],
  },
  {
    ...tools,
    headline: ["Build on top of", "your existing stack."],
  },
  {
    ...integrate,
    headline: ["Fully customizable,", "all for you."],
  },
  join,
] as const;
