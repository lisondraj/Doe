import { JoinApplyBelowHint } from "@/components/join/JoinApplyBelowHint";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import {
  JOIN_DESKTOP_HERO_HEIGHT,
  JOIN_MOBILE_HERO_HEIGHT,
} from "@/lib/join/join-layout";
import { lora } from "@/lib/home/fonts";

const AGENTS_CAROUSEL_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

export function JoinInternshipHero({ variant }: { variant: "mobile" | "desktop" }) {
  const heightClass = variant === "mobile" ? JOIN_MOBILE_HERO_HEIGHT : JOIN_DESKTOP_HERO_HEIGHT;
  const titleClass =
    variant === "mobile"
      ? "text-[clamp(2.35rem,1.75rem+3.2vmin,3.35rem)] iphone-page:text-[clamp(2.65rem,1.95rem+3.8vmin,3.75rem)]"
      : "text-[clamp(2.75rem,4.5vw,4.25rem)]";

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={AGENTS_CAROUSEL_BACKDROP}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center">
        <p
          className={`font-normal leading-[1.06] tracking-[-0.03em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.22)] ${titleClass} ${lora.className}`}
        >
          Doe Internship
        </p>
        <JoinApplyBelowHint variant={variant} />
      </div>
    </div>
  );
}
