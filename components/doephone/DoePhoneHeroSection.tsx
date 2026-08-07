"use client";

import Link from "next/link";

import { DoePhoneHeroGradientCircles } from "@/components/doephone/DoePhoneHeroGradientCircles";
import { DoePhoneHeroHeadline } from "@/components/doephone/DoePhoneHeroHeadline";
import { DoePhoneHomeHeroGrainShader } from "@/components/doephone/DoePhoneHomeHeroGrainShader";
import { ProtoHomeHeroGradient } from "@/components/proto/ProtoHomeHeroGradient";
import { WorkflowCarouselDesignBackdrop } from "@/components/workflow-carousel-design-backdrop";
import {
  DOEPHONE_HERO_INTRO_GRADIENT_MS,
  DOEPHONE_HERO_INTRO_GRADIENT_START,
  doephoneHeroIntroStyleVars,
} from "@/lib/doephone/hero-intro-timing";
import {
  DOEPHONE_DESKTOP_PAGE_INSET_LEFT,
  DOEPHONE_HERO_COPY_INSET,
} from "@/lib/doephone/section-styles";
import { CARE_COORDINATION_BACKDROP } from "@/lib/workflow-carousel-design-backdrops";
import { PROTO_HERO_HEIGHT } from "@/lib/proto/proto-hero-layout";
import { PROTO_FONT_CLASS } from "@/lib/proto/proto-font";
import { PROTO_RECEPTION_PALETTE } from "@/lib/proto/proto-communication-gradients";
import {
  DOE_HOME_HERO_DUSK_PALETTE,
  doeHomeHeroDuskShaderSurface,
} from "@/lib/proto/proto-shader-backdrop-colors";
import type { HeroDialOrbScheme } from "@/lib/doephone/hero-dial-orbs";
import type { DoeHomeHeroHeadlineEntry } from "@/lib/doehealth/doehealth-hero-carousel";
import {
  DOEHEALTH_HERO_HEADLINE_CROSSFADE_MS,
  DOEHEALTH_HERO_HEADLINE_ROTATE_MS,
} from "@/lib/doehealth/doehealth-hero-carousel";
import { inter } from "@/lib/home/fonts";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

function HeroReadMoreArrow() {
  return (
    <svg
      className="doehealth-hero-read-more__arrow"
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 6h7M6.75 3.25 9.5 6 6.75 8.75"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroCarouselNavChevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      className="doehealth-hero-copy-carousel__chevron"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d={direction === "prev" ? "M15.25 5.75 8.5 12l6.75 6.25" : "M8.75 5.75 15.5 12l-6.75 6.25"}
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroReadMoreRow({ entry }: { entry: DoeHomeHeroHeadlineEntry }) {
  if (entry.readMoreLinks.length === 0) {
    return null;
  }

  return (
    <div className={`doehealth-hero-read-more-row pointer-events-auto ${inter.className}`}>
      {entry.readMorePrefix ? (
        <span className="doehealth-hero-read-more__prefix">{entry.readMorePrefix}</span>
      ) : null}
      {entry.readMoreLinks.map((link) => (
        <Link key={link.href} href={link.href} className="doehealth-hero-read-more">
          <span className="doehealth-hero-read-more__label">{link.label}</span>
          <HeroReadMoreArrow />
        </Link>
      ))}
    </div>
  );
}

/** Headline + optional read-more row for one hero carousel entry. */
function HeroCopyBlock({
  entry,
  fontClass,
  className,
  fitToContainer,
  showReadMore = true,
}: {
  entry: DoeHomeHeroHeadlineEntry;
  fontClass?: string;
  className?: string;
  fitToContainer?: boolean;
  showReadMore?: boolean;
}) {
  return (
    <>
      <DoePhoneHeroHeadline
        line1={entry.line1}
        line2={entry.line2 ?? ""}
        fontClass={fontClass}
        className={[className, entry.headlineClassName].filter(Boolean).join(" ")}
        fitToContainer={fitToContainer || entry.headlineClassName === "doehealth-hero-headline--single-line"}
      />
      {showReadMore ? <HeroReadMoreRow entry={entry} /> : null}
    </>
  );
}

type HeroCopyTransition = { from: number; to: number };

function isSingleLineHeroEntry(entry: DoeHomeHeroHeadlineEntry) {
  return entry.headlineClassName === "doehealth-hero-headline--single-line";
}

/** Rotates the hero headline + link through several entries with a gold crossfade. */
function HeroCopyCarousel({
  entries,
  fontClass,
  className,
  fitToContainer,
}: {
  entries: readonly DoeHomeHeroHeadlineEntry[];
  fontClass?: string;
  className?: string;
  fitToContainer?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<HeroCopyTransition | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const transitionRef = useRef<HeroCopyTransition | null>(null);
  const rotateIntervalRef = useRef<number | null>(null);
  const tabVisibleRef = useRef(true);

  useLayoutEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const completeTransition = useCallback(() => {
    const current = transitionRef.current;
    if (!current) return;

    transitionRef.current = null;
    activeIndexRef.current = current.to;
    setActiveIndex(current.to);
    setTransition(null);
    isTransitioningRef.current = false;
  }, []);

  const beginTransition = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current || nextIndex === activeIndexRef.current) return;

      if (reducedMotion) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        return;
      }

      isTransitioningRef.current = true;
      const nextTransition = { from: activeIndexRef.current, to: nextIndex };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
    },
    [reducedMotion],
  );

  const goToNext = useCallback(() => {
    beginTransition((activeIndexRef.current + 1) % entries.length);
  }, [beginTransition, entries.length]);

  const goToPrev = useCallback(() => {
    beginTransition((activeIndexRef.current - 1 + entries.length) % entries.length);
  }, [beginTransition, entries.length]);

  const restartRotateInterval = useCallback(() => {
    if (rotateIntervalRef.current !== null) {
      window.clearInterval(rotateIntervalRef.current);
    }

    rotateIntervalRef.current = window.setInterval(() => {
      if (!tabVisibleRef.current || isTransitioningRef.current) return;
      beginTransition((activeIndexRef.current + 1) % entries.length);
    }, DOEHEALTH_HERO_HEADLINE_ROTATE_MS);
  }, [beginTransition, entries.length]);

  useEffect(() => {
    tabVisibleRef.current = document.visibilityState === "visible";
    const onVisibility = () => {
      tabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    restartRotateInterval();

    return () => {
      if (rotateIntervalRef.current !== null) {
        window.clearInterval(rotateIntervalRef.current);
      }
    };
  }, [restartRotateInterval]);

  const handleManualNav = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "prev") goToPrev();
      else goToNext();
      restartRotateInterval();
    },
    [goToNext, goToPrev, restartRotateInterval],
  );

  useEffect(() => {
    if (!transition || reducedMotion) return undefined;

    const fallback = window.setTimeout(completeTransition, DOEHEALTH_HERO_HEADLINE_CROSSFADE_MS + 80);
    return () => window.clearTimeout(fallback);
  }, [completeTransition, reducedMotion, transition]);

  const sizerEntry = entries.find((entry) => entry.line2) ?? entries[0];
  const singleLineTransition =
    transition != null &&
    (isSingleLineHeroEntry(entries[transition.from]) || isSingleLineHeroEntry(entries[transition.to]));
  const readMoreIndex = transition?.to ?? activeIndex;

  return (
    <div className="doehealth-hero-copy-carousel-wrap">
      <button
        type="button"
        className="doehealth-hero-copy-carousel__nav doehealth-hero-copy-carousel__nav--prev pointer-events-auto"
        aria-label="Previous hero headline"
        onClick={() => handleManualNav("prev")}
      >
        <HeroCarouselNavChevron direction="prev" />
      </button>

      <div
        className={`doehealth-hero-copy-carousel${singleLineTransition ? " doehealth-hero-copy-carousel--single-line-transition" : ""}`}
        style={
          {
            ["--doehealth-hero-copy-crossfade-ms" as string]: `${DOEHEALTH_HERO_HEADLINE_CROSSFADE_MS}ms`,
          } as CSSProperties
        }
      >
        <div className="doehealth-hero-copy-carousel__sizer" aria-hidden="true">
          <HeroCopyBlock
            entry={sizerEntry}
            fontClass={fontClass}
            className={className}
            fitToContainer={fitToContainer}
            showReadMore={false}
          />
        </div>
        {transition ? (
          <>
            <div className="doehealth-hero-copy-carousel__slide doehealth-hero-copy-carousel__slide--out doehealth-hero-copy-carousel__slide--animate">
              <HeroCopyBlock
                entry={entries[transition.from]}
                fontClass={fontClass}
                className={className}
                fitToContainer={fitToContainer}
                showReadMore={false}
              />
            </div>
            <div
              className="doehealth-hero-copy-carousel__slide doehealth-hero-copy-carousel__slide--in doehealth-hero-copy-carousel__slide--animate"
              onAnimationEnd={(event) => {
                if (event.currentTarget !== event.target) return;
                if (
                  event.animationName !== "doehealth-hero-copy-in" &&
                  event.animationName !== "doehealth-hero-copy-in-fade"
                ) {
                  return;
                }
                completeTransition();
              }}
            >
              <HeroCopyBlock
                entry={entries[transition.to]}
                fontClass={fontClass}
                className={className}
                fitToContainer={fitToContainer}
                showReadMore={false}
              />
            </div>
          </>
        ) : (
          <div className="doehealth-hero-copy-carousel__slide doehealth-hero-copy-carousel__slide--current">
            <HeroCopyBlock
              entry={entries[activeIndex]}
              fontClass={fontClass}
              className={className}
              fitToContainer={fitToContainer}
              showReadMore={false}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="doehealth-hero-copy-carousel__nav doehealth-hero-copy-carousel__nav--next pointer-events-auto"
        aria-label="Next hero headline"
        onClick={() => handleManualNav("next")}
      >
        <HeroCarouselNavChevron direction="next" />
      </button>

      <HeroReadMoreRow entry={entries[readMoreIndex]} />
    </div>
  );
}

/** Hero — slightly below full viewport so Safari bottom bar does not clip; section 2 stays full height. */
export const DOEPHONE_HERO_HEIGHT =
  "calc(var(--app-vh,100lvh)*0.88 + max(8rem, calc(env(safe-area-inset-top, 0px) + 3.5rem)))";

const DOEPHONE_HERO_DESKTOP_HEIGHT = "100dvh";

export function DoePhoneHeroSection({
  variant = "mobile",
  proto = false,
  iphoneBackdrop = false,
  heroLine1,
  heroLine2,
  heroHeadlineClassName,
  heroHeadlineFitToContainer,
  heroReadMoreHref,
  heroReadMoreLabel = "Read more",
  heroReadMorePrefix,
  heroReadMoreLinks,
  heroEntries,
  disableHeroOrbInteractions,
  heroOrbSchemes,
}: {
  /** Desktop home uses full viewport height and wider copy gutters. */
  variant?: "mobile" | "desktop";
  /** Proto landing — dark palette and hiring headline. */
  proto?: boolean;
  /** Desktop — render the iPhone hero background (dusk shader + agent orb dial). */
  iphoneBackdrop?: boolean;
  heroLine1?: string;
  heroLine2?: string;
  heroHeadlineClassName?: string;
  heroHeadlineFitToContainer?: boolean;
  heroReadMoreHref?: string;
  heroReadMoreLabel?: string;
  heroReadMorePrefix?: string;
  heroReadMoreLinks?: readonly { label: string; href: string }[];
  /** Rotating hero headline carousel — when 2+ entries, cycles with a crossfade instead of static copy. */
  heroEntries?: readonly DoeHomeHeroHeadlineEntry[];
  disableHeroOrbInteractions?: boolean;
  /** Optional hero dial orb palette (e.g. /doehealth gold schemes). */
  heroOrbSchemes?: readonly HeroDialOrbScheme[];
}) {
  const [introZoom, setIntroZoom] = useState(DOEPHONE_HERO_INTRO_GRADIENT_START);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || proto) {
      setIntroZoom(1);
      setIntroDone(true);
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DOEPHONE_HERO_INTRO_GRADIENT_MS);
      const eased = t * t * (3 - 2 * t);
      setIntroZoom(
        DOEPHONE_HERO_INTRO_GRADIENT_START +
          (1 - DOEPHONE_HERO_INTRO_GRADIENT_START) * eased,
      );
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIntroZoom(1);
        setIntroDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [proto]);

  const gradientZoom = introDone ? 1 : introZoom;
  const isDesktop = variant === "desktop";
  const isMobile = !isDesktop;
  const isProto = proto;
  /** iPhone-style hero (dusk shader + orb dial) — mobile always, desktop when opted in. */
  const renderIphoneHero = !isProto && (isMobile || iphoneBackdrop);
  const homeHeroShader = doeHomeHeroDuskShaderSurface();
  const heroHeight = isDesktop
    ? DOEPHONE_HERO_DESKTOP_HEIGHT
    : isProto
      ? PROTO_HERO_HEIGHT
      : DOEPHONE_HERO_HEIGHT;
  const copyInset = isDesktop ? DOEPHONE_DESKTOP_PAGE_INSET_LEFT : DOEPHONE_HERO_COPY_INSET;
  const copyBottom = isDesktop
    ? "bottom-[clamp(5rem,16vh,10rem)]"
    : "bottom-[clamp(2.75rem,9vmin,4.25rem)]";

  return (
    <section
      className={`doephone-hero-section relative w-full overflow-hidden ${
        isProto ? "" : "bg-[#1A1208]"
      }`}
      style={
        {
          minHeight: heroHeight,
          height: heroHeight,
          ...(renderIphoneHero
            ? { backgroundColor: DOE_HOME_HERO_DUSK_PALETTE.back }
            : isMobile && isProto
              ? { backgroundColor: PROTO_RECEPTION_PALETTE.deep }
              : {}),
          ...doephoneHeroIntroStyleVars(),
        } as CSSProperties
      }
      aria-label="Hero"
    >
      {isProto && isMobile ? (
        <ProtoHomeHeroGradient />
      ) : renderIphoneHero ? (
        <DoePhoneHomeHeroGrainShader
          variant={homeHeroShader.variant}
          colors={homeHeroShader.colors}
          colorBack={homeHeroShader.colorBack}
        />
      ) : (
        <WorkflowCarouselDesignBackdrop
          backdrop={CARE_COORDINATION_BACKDROP}
          embedded
          introOnLoad={!isProto}
          gradientScale={gradientZoom}
        />
      )}

      {renderIphoneHero ? (
        <DoePhoneHeroGradientCircles
          variant={variant}
          disableInteractions={disableHeroOrbInteractions}
          orbSchemes={heroOrbSchemes}
        />
      ) : null}

      <div
        className={`pointer-events-none absolute left-0 right-0 z-[3] ${copyInset} ${copyBottom}`}
      >
        <div className="doephone-hero-copy w-full min-w-0">
          {heroEntries && heroEntries.length > 1 ? (
            <HeroCopyCarousel
              entries={heroEntries}
              fontClass={isProto ? PROTO_FONT_CLASS : undefined}
              className={heroHeadlineClassName}
              fitToContainer={heroHeadlineFitToContainer}
            />
          ) : (
            <>
              <DoePhoneHeroHeadline
                line1={isProto ? "Recruiting for the" : heroLine1 ?? "Voice Agents."}
                line2={isProto ? "intelligence era." : heroLine2 ?? "for Healthcare..."}
                fontClass={isProto ? PROTO_FONT_CLASS : undefined}
                className={heroHeadlineClassName}
                fitToContainer={heroHeadlineFitToContainer}
              />
              {heroReadMoreLinks && heroReadMoreLinks.length > 0 ? (
                <div className={`doehealth-hero-read-more-row pointer-events-auto ${inter.className}`}>
                  {heroReadMorePrefix ? (
                    <span className="doehealth-hero-read-more__prefix">{heroReadMorePrefix}</span>
                  ) : null}
                  {heroReadMoreLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="doehealth-hero-read-more">
                      <span className="doehealth-hero-read-more__label">{link.label}</span>
                      <HeroReadMoreArrow />
                    </Link>
                  ))}
                </div>
              ) : heroReadMoreHref ? (
                <Link
                  href={heroReadMoreHref}
                  className={`doehealth-hero-read-more pointer-events-auto ${inter.className}`}
                >
                  <span className="doehealth-hero-read-more__label">{heroReadMoreLabel}</span>
                  <HeroReadMoreArrow />
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
