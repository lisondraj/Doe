import { JoinInternshipHero } from "@/components/join/JoinInternshipHero";
import { JOIN_HERO_BANDS } from "@/lib/join/join-hero-backdrops";
import { JOIN_MOBILE_SECTION_STACK_GAP } from "@/lib/join/join-layout";

/** Stacked join hero bands — primary with inbox UI, three gradient-only variants below. */
export function JoinHeroBands({ variant }: { variant: "mobile" | "desktop" }) {
  return (
    <div className={`flex w-full flex-col ${JOIN_MOBILE_SECTION_STACK_GAP}`}>
      {JOIN_HERO_BANDS.map((band) => (
        <JoinInternshipHero
          key={band.id}
          variant={variant}
          backdrop={band.backdrop}
          showInbox={band.showInbox}
        />
      ))}
    </div>
  );
}
