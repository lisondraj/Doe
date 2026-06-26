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
import type { WorkflowCarouselSurface } from "@/lib/workflow-carousel-design-backdrops";
import { lora, suisseIntl } from "@/lib/home/fonts";

const JOIN_HERO_HEADLINE_MOBILE =
  "text-[clamp(2.35rem,8vw,3.55rem)] iphone-page:text-[clamp(2.5rem,1.9rem+3.4vmin,4.15rem)]";

const JOIN_HERO_HEADLINE_DESKTOP = "text-[clamp(2.85rem,4.8vw,4.35rem)]";

const JOIN_HERO_TOP_LEFT_PAD =
  "pt-8 px-8 iphone-page:pt-[clamp(2rem,1.65rem+1.45vmin,2.6rem)] iphone-page:px-[clamp(2rem,1.65rem+1.45vmin,2.6rem)]";

const JOIN_HERO_DESCRIPTION_MOBILE =
  "max-w-[min(100%,20.25rem)] text-[clamp(0.98rem,3.9vw,1.18rem)] font-normal leading-[1.5] tracking-[-0.012em] iphone-page:max-w-[min(100%,21.75rem)]";

const JOIN_HERO_DESCRIPTION_DESKTOP =
  "max-w-[min(100%,33em)] text-[clamp(1.08rem,1.55vw,1.34rem)] font-normal leading-[1.52] tracking-[-0.014em]";

function joinHeroInkClass(surface: WorkflowCarouselSurface = "orange") {
  return surface === "beige" ? "text-[#1E343A]" : "text-white";
}

function joinHeroDescriptionInkClass(surface: WorkflowCarouselSurface = "orange") {
  return surface === "beige" ? "text-[#1E343A]/88" : "text-white/95";
}

function JoinHeroDescription({
  paragraphs,
  variant,
  surface = "orange",
  textAlign = "left",
}: {
  paragraphs: readonly string[];
  variant: "mobile" | "desktop";
  surface?: WorkflowCarouselSurface;
  textAlign?: "left" | "right";
}) {
  const textClass = variant === "mobile" ? JOIN_HERO_DESCRIPTION_MOBILE : JOIN_HERO_DESCRIPTION_DESKTOP;
  const anchorClass = textAlign === "right" ? "right-0 text-right" : "left-0 text-left";

  return (
    <div
      className={`absolute top-0 z-[3] ${anchorClass} ${JOIN_HERO_TOP_LEFT_PAD} ${textClass} ${joinHeroDescriptionInkClass(surface)} ${suisseIntl.className}`}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={paragraph === paragraphs[0] ? "" : "mt-[1.1em]"}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function JoinHeroHeadline({
  titleClass,
  lines,
  surface = "orange",
  textAlign = "left",
}: {
  titleClass: string;
  lines: readonly [string] | readonly [string, string];
  surface?: WorkflowCarouselSurface;
  textAlign?: "left" | "right";
}) {
  const anchorClass = textAlign === "right" ? "bottom-0 right-0 text-right" : "bottom-0 left-0 text-left";

  return (
    <p
      className={`absolute z-[3] max-w-[min(100%,20em)] font-normal leading-[1.04] tracking-[-0.035em] ${anchorClass} ${joinHeroInkClass(surface)} ${BLOG_LANDING_HERO_CORNER_PAD} ${titleClass} ${lora.className}`}
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
  description,
  surface = "orange",
  textAlign = "left",
}: {
  variant: "mobile" | "desktop";
  backdrop?: WorkflowCarouselDesignBackdropConfig;
  showInbox?: boolean;
  headline?: readonly [string] | readonly [string, string];
  description?: readonly string[];
  surface?: WorkflowCarouselSurface;
  textAlign?: "left" | "right";
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
        surface={surface}
        className={DOEPHONE_SECTION_CAROUSEL_RADIUS}
      />

      <JoinHeroHeadline titleClass={titleClass} lines={headline} surface={surface} textAlign={textAlign} />

      {description?.length ? (
        <JoinHeroDescription
          paragraphs={description}
          variant={variant}
          surface={surface}
          textAlign={textAlign}
        />
      ) : null}

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
