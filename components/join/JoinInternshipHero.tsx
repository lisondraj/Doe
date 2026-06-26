import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import { HeroTriagePreview } from "@/components/home/HeroTriagePreview";
import { BLOG_LANDING_HERO_CORNER_PAD } from "@/lib/blog/blog-layout-styles";
import { DOEPHONE_SECTION_CAROUSEL_RADIUS } from "@/lib/doephone/section-styles";
import {
  JOIN_HERO_TRIAGE_PANEL,
  JOIN_HERO_TRIAGE_SCALE,
  JOIN_MOBILE_HERO_TRIAGE_PANEL,
  JOIN_MOBILE_HERO_TRIAGE_SCALE,
} from "@/lib/home/hero-triage-theme";
import {
  JOIN_DESKTOP_HERO_HEIGHT,
  JOIN_MOBILE_HERO_CARD_HEIGHT,
} from "@/lib/join/join-layout";
import { JOIN_HERO_BANDS, JOIN_HERO_PRIMARY_BACKDROP } from "@/lib/join/join-hero-backdrops";
import type { WorkflowCarouselDesignBackdrop as WorkflowCarouselDesignBackdropConfig } from "@/lib/workflow-carousel-design-backdrops";
import { lora, suisseIntl } from "@/lib/home/fonts";

const JOIN_HERO_HEADLINE_MOBILE =
  "text-[clamp(2.35rem,8vw,3.55rem)] iphone-page:text-[clamp(2.5rem,1.9rem+3.4vmin,4.15rem)]";

const JOIN_HERO_HEADLINE_DESKTOP = "text-[clamp(2.85rem,4.8vw,4.35rem)]";

function JoinHeroHeadline({
  titleClass,
  lines,
}: {
  titleClass: string;
  lines: readonly [string] | readonly [string, string];
}) {
  return (
    <p
      className={`absolute bottom-0 left-0 z-[3] max-w-[min(100%,20em)] text-left font-normal leading-[1.04] tracking-[-0.035em] text-white ${BLOG_LANDING_HERO_CORNER_PAD} ${titleClass} ${lora.className}`}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

/** Join hero band — gradient backdrop, bottom-left headline, optional inbox UI on primary only. */
export function JoinInternshipHero({
  variant,
  backdrop = JOIN_HERO_PRIMARY_BACKDROP,
  showInbox = true,
  headline = JOIN_HERO_BANDS[0].headline,
}: {
  variant: "mobile" | "desktop";
  backdrop?: WorkflowCarouselDesignBackdropConfig;
  showInbox?: boolean;
  headline?: readonly [string] | readonly [string, string];
}) {
  const heightClass = variant === "mobile" ? JOIN_MOBILE_HERO_CARD_HEIGHT : JOIN_DESKTOP_HERO_HEIGHT;
  const titleClass = variant === "mobile" ? JOIN_HERO_HEADLINE_MOBILE : JOIN_HERO_HEADLINE_DESKTOP;

  return (
    <div
      className={`relative w-full overflow-hidden border border-[#D9D4CC] ${heightClass} ${DOEPHONE_SECTION_CAROUSEL_RADIUS}`}
    >
      <WorkflowCarouselDesignBackdrop
        backdrop={backdrop}
        embedded
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <JoinHeroHeadline titleClass={titleClass} lines={headline} />

      {showInbox && variant === "mobile" ? (
        <HeroTriagePreview
          fontClassName={suisseIntl.className}
          size="mobile"
          theme="light"
          layout="simple"
          mobileAnchor="join"
          mobileScale={JOIN_MOBILE_HERO_TRIAGE_SCALE}
          className="z-[2]"
          style={{
            left: JOIN_MOBILE_HERO_TRIAGE_PANEL.left,
            top: JOIN_MOBILE_HERO_TRIAGE_PANEL.top,
            width: 0,
            height: 0,
            overflow: "visible",
          }}
        />
      ) : showInbox && variant === "desktop" ? (
        <HeroTriagePreview
          fontClassName={suisseIntl.className}
          size="desktop"
          theme="light"
          layout="simple"
          showNavIcons
          desktopScale={JOIN_HERO_TRIAGE_SCALE}
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
