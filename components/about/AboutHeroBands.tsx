"use client";

import { JoinHeroBands } from "@/components/join/JoinHeroBands";
import { ABOUT_HERO_BANDS } from "@/lib/about/about-hero-backdrops";

/** About hero stack — uses about band config, not /join or /waitlist defaults. */
export function AboutHeroBands({ variant }: { variant: "mobile" | "desktop" }) {
  return <JoinHeroBands variant={variant} bands={ABOUT_HERO_BANDS} />;
}
