"use client";

import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent, type TransitionEvent } from "react";

import { suisseIntl, suisseIntlLight } from "@/lib/home/fonts";
import { AGENTS_CAROUSEL_DESCRIPTIONS } from "@/lib/doephone/agents-carousel-copy";
import {
  HERO_DIAL_ORB_CAROUSEL_SHADER,
  HERO_DIAL_ORBS,
  heroDialOrbCarouselScheme,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { doephoneAgentsRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";

function orbAccentStyle(scheme: HeroDialOrbScheme): CSSProperties {
  const [dark, mid, light] = scheme.colors;
  return {
    "--orb-halo-dark": dark,
    "--orb-halo-mid": mid,
    "--orb-halo-light": light,
    "--orb-halo-back": scheme.colorBack,
  } as CSSProperties;
}

function CarouselChevron({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`home-agents-carousel__nav home-agents-carousel__nav--${direction}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={onClick}
    >
      <span className="home-agents-carousel__nav-hit">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__nav-icon">
        {direction === "left" ? (
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      </span>
    </button>
  );
}

function AgentCarouselOrb({
  scheme,
  focused,
}: {
  scheme: HeroDialOrbScheme;
  focused: boolean;
}) {
  const displayScheme = heroDialOrbCarouselScheme(scheme);

  return (
    <div
      className={`home-agents-carousel__orb hero-speaking-orb${
        focused ? " home-agents-carousel__orb--focused" : ""
      }`}
      style={orbAccentStyle(displayScheme)}
    >
      <div className="hero-speaking-orb__progress-shell">
        <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
          <HeroDialOrbGrainShader
            scheme={displayScheme}
            shaderConfig={HERO_DIAL_ORB_CAROUSEL_SHADER}
          />
        </div>
      </div>
    </div>
  );
}

/** Agents band order — Inbox second so a neighbor peeks on the left at start. */
const AGENTS_CAROUSEL_ORBS: readonly HeroDialOrbScheme[] = [
  HERO_DIAL_ORBS[1],
  HERO_DIAL_ORBS[0],
  HERO_DIAL_ORBS[2],
  HERO_DIAL_ORBS[3],
  HERO_DIAL_ORBS[4],
  HERO_DIAL_ORBS[5],
  HERO_DIAL_ORBS[6],
];

const AGENTS_CAROUSEL_ORB_COUNT = AGENTS_CAROUSEL_ORBS.length;
const AGENTS_CAROUSEL_START_INDEX = 1;
const AGENTS_CAROUSEL_LOOP_ORBS: readonly HeroDialOrbScheme[] = [
  ...AGENTS_CAROUSEL_ORBS,
  ...AGENTS_CAROUSEL_ORBS,
  ...AGENTS_CAROUSEL_ORBS,
];
const AGENTS_CAROUSEL_LOOP_START =
  AGENTS_CAROUSEL_ORB_COUNT + AGENTS_CAROUSEL_START_INDEX;
const AGENTS_CAROUSEL_SWIPE_THRESHOLD_PX = 44;

/** Hero agent orbs — horizontal carousel with chevrons and label. */
export function DoePhoneHomeAgentsCarousel() {
  const [position, setPosition] = useState(AGENTS_CAROUSEL_LOOP_START);
  const [trackInstant, setTrackInstant] = useState(false);
  const reenableTransitionRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal(0.2);

  const active = AGENTS_CAROUSEL_LOOP_ORBS[position];

  const goPrev = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current - 1);
  }, []);

  const goNext = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current + 1);
  }, []);

  const handleViewportTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleViewportTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) < AGENTS_CAROUSEL_SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX < 0) {
        goNext();
        return;
      }

      goPrev();
    },
    [goNext, goPrev],
  );

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (trackInstant) {
        return;
      }

      if (event.target !== event.currentTarget || event.propertyName !== "transform") {
        return;
      }

      if (position >= AGENTS_CAROUSEL_ORB_COUNT && position < AGENTS_CAROUSEL_ORB_COUNT * 2) {
        return;
      }

      setTrackInstant(true);
      setPosition((current) => {
        if (current < AGENTS_CAROUSEL_ORB_COUNT) {
          return current + AGENTS_CAROUSEL_ORB_COUNT;
        }

        if (current >= AGENTS_CAROUSEL_ORB_COUNT * 2) {
          return current - AGENTS_CAROUSEL_ORB_COUNT;
        }

        return current;
      });
    },
    [position, trackInstant],
  );

  useEffect(() => {
    if (!trackInstant) {
      return;
    }

    reenableTransitionRef.current = window.requestAnimationFrame(() => {
      reenableTransitionRef.current = window.requestAnimationFrame(() => {
        setTrackInstant(false);
      });
    });

    return () => {
      if (reenableTransitionRef.current !== null) {
        window.cancelAnimationFrame(reenableTransitionRef.current);
      }
    };
  }, [trackInstant, position]);

  return (
    <div
      ref={sectionRef}
      className={`home-agents-carousel ${suisseIntl.className}`}
      style={doephoneAgentsRevealStyleVars() as CSSProperties}
      aria-hidden
    >
      <div className="home-agents-carousel__stage">
        <div
          className={`home-agents-carousel__viewport ${doePhoneSectionRevealSegmentClass("agents-orbs", revealed)}`}
          onTouchStart={handleViewportTouchStart}
          onTouchEnd={handleViewportTouchEnd}
          onTouchCancel={() => {
            swipeStartRef.current = null;
          }}
        >
          <div
            className={`home-agents-carousel__track${
              trackInstant ? " home-agents-carousel__track--instant" : ""
            }`}
            onTransitionEnd={handleTrackTransitionEnd}
            style={{
              transform: `translateX(calc(50% - var(--home-agents-orb-half) - ${position} * var(--home-agents-orb-step)))`,
            }}
          >
            {AGENTS_CAROUSEL_LOOP_ORBS.map((scheme, orbIndex) => (
              <AgentCarouselOrb
                key={`${scheme.label}-${orbIndex}`}
                scheme={scheme}
                focused={orbIndex === position}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="home-agents-carousel__caption">
        <div className="home-agents-carousel__label-row">
          <CarouselChevron
            direction="left"
            onClick={goPrev}
            label="Previous agent"
            className={doePhoneSectionRevealSegmentClass("agents-nav", revealed)}
          />
          <div
            className={`hero-speaking-orb__tag hero-speaking-orb__tag--carousel hero-speaking-orb__tag--visible ${suisseIntl.className} ${doePhoneSectionRevealSegmentClass("agents-label", revealed)}`}
            aria-hidden
          >
            <span className="hero-speaking-orb__tag-text">{active.label}</span>
          </div>
          <CarouselChevron
            direction="right"
            onClick={goNext}
            label="Next agent"
            className={doePhoneSectionRevealSegmentClass("agents-nav", revealed)}
          />
        </div>
        <p
          className={`home-agents-carousel__description ${suisseIntlLight.className} ${doePhoneSectionRevealSegmentClass("agents-label", revealed)}`}
          aria-hidden
        >
          {AGENTS_CAROUSEL_DESCRIPTIONS[active.label] ?? ""}
        </p>
      </div>
    </div>
  );
}
