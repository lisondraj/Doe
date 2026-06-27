import {
  JOIN_HERO_EXTRA_BANDS,
  JOIN_HERO_PRIMARY_BACKDROP,
  type JoinHeroBandConfig,
} from "@/lib/join/join-hero-backdrops";

const [incoming, tools, integrate, join] = JOIN_HERO_EXTRA_BANDS;

/** /about hero bands — independent from /join and /waitlist; diverge copy here over time. */
export const ABOUT_HERO_BANDS: readonly JoinHeroBandConfig[] = [
  {
    id: "agents",
    showInbox: true,
    headline: ["About", "Doe."],
    backdrop: JOIN_HERO_PRIMARY_BACKDROP,
  },
  incoming,
  tools,
  integrate,
  join,
] as const;
