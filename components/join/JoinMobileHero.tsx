import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { JOIN_MOBILE_HERO_HEIGHT } from "@/lib/join/join-mobile-layout";
import { inter, lora } from "@/lib/home/fonts";

const AGENTS_CAROUSEL_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

function JoinApplyBelowChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-[0.72em] w-[0.72em] shrink-0"}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center">
        <p
          className={`font-normal leading-[1.06] tracking-[-0.03em] text-white text-[clamp(2.35rem,1.75rem+3.2vmin,3.35rem)] iphone-page:text-[clamp(2.65rem,1.95rem+3.8vmin,3.75rem)] [text-shadow:0_2px_18px_rgba(0,0,0,0.22)] ${lora.className}`}
        >
          Doe Internship
        </p>

        <p
          className={`mt-[clamp(0.65rem,0.5rem+0.55vmin,0.95rem)] flex items-center justify-center gap-[0.35em] text-[clamp(0.78rem,0.68rem+0.42vmin,0.92rem)] iphone-page:text-[clamp(0.82rem,0.72rem+0.45vmin,0.98rem)] font-medium tracking-[0.04em] text-white/88 [text-shadow:0_1px_10px_rgba(0,0,0,0.18)] ${inter.className}`}
        >
          <JoinApplyBelowChevron />
          <span>Apply Below</span>
          <JoinApplyBelowChevron />
        </p>
      </div>
    </div>
  );
}
