import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { JOIN_MOBILE_HERO_HEIGHT } from "@/lib/join/join-mobile-layout";
import { lora } from "@/lib/home/fonts";

const AGENTS_CAROUSEL_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

/** Join mobile hero — Agents carousel fill, centered white title. */
export function JoinMobileHero() {
  return (
    <div
      className={`relative w-full overflow-hidden ${JOIN_MOBILE_HERO_HEIGHT} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={AGENTS_CAROUSEL_BACKDROP}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <p
        className={`absolute inset-0 z-[3] flex items-center justify-center px-6 text-center font-normal leading-[1.06] tracking-[-0.03em] text-white text-[clamp(2.35rem,1.75rem+3.2vmin,3.35rem)] iphone-page:text-[clamp(2.65rem,1.95rem+3.8vmin,3.75rem)] [text-shadow:0_2px_18px_rgba(0,0,0,0.22)] ${lora.className}`}
      >
        Doe Internship
      </p>
    </div>
  );
}
