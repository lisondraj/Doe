import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HeroTriagePreview } from "@/components/home/HeroTriagePreview";
import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_COMMUNICATION_SLIDES } from "@/lib/doephone/communication-carousel";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import { JOIN_HERO_TRIAGE_PANEL } from "@/lib/home/hero-triage-theme";
import {
  JOIN_DESKTOP_HERO_HEIGHT,
  JOIN_MOBILE_HERO_CARD_HEIGHT,
} from "@/lib/join/join-layout";
import { lora, suisseIntl } from "@/lib/home/fonts";

const AGENTS_CAROUSEL_BACKDROP = DOEPHONE_COMMUNICATION_SLIDES[0].backdrop;

const JOIN_HERO_HEADLINE_MOBILE =
  "text-[clamp(2.35rem,8vw,3.55rem)] iphone-page:text-[clamp(2.5rem,1.9rem+3.4vmin,4.15rem)]";

const JOIN_HERO_HEADLINE_DESKTOP = "text-[clamp(2.85rem,4.8vw,4.35rem)]";

/** Join hero — Agents fill, blog-style bottom-left headline. */
export function JoinInternshipHero({ variant }: { variant: "mobile" | "desktop" }) {
  const heightClass = variant === "mobile" ? JOIN_MOBILE_HERO_CARD_HEIGHT : JOIN_DESKTOP_HERO_HEIGHT;
  const titleClass = variant === "mobile" ? JOIN_HERO_HEADLINE_MOBILE : JOIN_HERO_HEADLINE_DESKTOP;

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={AGENTS_CAROUSEL_BACKDROP}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <p
        className={`absolute bottom-0 left-0 z-[3] max-w-[min(100%,20em)] text-left font-normal leading-[1.04] tracking-[-0.035em] text-white ${BLOG_LANDING_HERO_CORNER_PAD} ${titleClass} ${lora.className}`}
      >
        <span className="block">Let&apos;s rebuild</span>
        <span className="block">healthcare.</span>
      </p>

      {variant === "desktop" ? (
        <HeroTriagePreview
          fontClassName={suisseIntl.className}
          size="desktop"
          theme="light"
          className="z-[2]"
          style={{
            top: JOIN_HERO_TRIAGE_PANEL.top,
            right: JOIN_HERO_TRIAGE_PANEL.right,
            bottom: JOIN_HERO_TRIAGE_PANEL.bottom,
            width: JOIN_HERO_TRIAGE_PANEL.width,
          }}
        />
      ) : null}
    </div>
  );
}
