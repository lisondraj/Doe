"use client";

import { JoinHeroBands } from "@/components/join/JoinHeroBands";
import { WAITLIST_HERO_BANDS } from "@/lib/waitlist/waitlist-hero-backdrops";

/** Waitlist hero stack — uses waitlist band config, not /join defaults. */
export function WaitlistHeroBands({ variant }: { variant: "mobile" | "desktop" }) {
  return <JoinHeroBands variant={variant} bands={WAITLIST_HERO_BANDS} />;
}
