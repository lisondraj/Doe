"use client";

import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JoinInternTrackReveal } from "@/components/join/JoinInternTrackReveal";
import { JOIN_HERO_BANDS } from "@/lib/join/join-hero-backdrops";
import { JOIN_MOBILE_SECTION_STACK_GAP } from "@/lib/join/join-layout";

/** Stacked join hero bands — primary with inbox UI, four gradient/beige variants below. */
export function JoinHeroBands({ variant }: { variant: "mobile" | "desktop" }) {
  return (
    <div className={`flex w-full flex-col ${JOIN_MOBILE_SECTION_STACK_GAP}`}>
      {JOIN_HERO_BANDS.map((band) => (
        <JoinInternTrackReveal
          key={band.id}
          variant={variant}
          className="join-hero-band-reveal w-full"
        >
          <JoinInternshipHero
            variant={variant}
            backdrop={band.backdrop}
            showInbox={band.showInbox}
            headline={band.headline}
            description={band.description}
            surface={band.surface ?? "orange"}
            textAlign={band.textAlign}
            decoration={band.decoration}
          />
        </JoinInternTrackReveal>
      ))}
    </div>
  );
}
