"use client";

import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type TransitionEvent } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  HERO_DIAL_ORBS,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";

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
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`home-agents-carousel__nav home-agents-carousel__nav--${direction}`}
      aria-label={label}
      onClick={onClick}
    >
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
    </button>
  );
}

function AgentCarouselOrb({
  scheme,
  focused,
  mountShader,
}: {
  scheme: HeroDialOrbScheme;
  focused: boolean;
  mountShader: boolean;
}) {
  return (
    <div
      className={`home-agents-carousel__orb hero-speaking-orb${
        focused ? " hero-speaking-orb--focused home-agents-carousel__orb--focused" : ""
      }`}
      style={orbAccentStyle(scheme)}
    >
      <div className="hero-speaking-orb__halo-ring" aria-hidden />
      <div className="hero-speaking-orb__halo-ring hero-speaking-orb__halo-ring--echo" aria-hidden />
      <div className="hero-speaking-orb__progress-shell">
        <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
          <HeroDialOrbGrainShader
            scheme={scheme}
            eager={focused}
            enabled={mountShader}
            mountDelayMs={focused ? 280 : 0}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-full hero-speaking-orb__core-shade"
            aria-hidden
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
const AGENTS_CAROUSEL_SHADER_WINDOW = 1;

function shouldMountCarouselShader(orbIndex: number, position: number) {
  return Math.abs(orbIndex - position) <= AGENTS_CAROUSEL_SHADER_WINDOW;
}

/** Hero agent orbs — horizontal carousel with chevrons and label pill. */
export function DoePhoneHomeAgentsCarousel() {
  const [position, setPosition] = useState(AGENTS_CAROUSEL_LOOP_START);
  const [trackInstant, setTrackInstant] = useState(false);
  const reenableTransitionRef = useRef<number | null>(null);

  const active = AGENTS_CAROUSEL_LOOP_ORBS[position];

  const goPrev = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current - 1);
  }, []);

  const goNext = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current + 1);
  }, []);

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
    <div className={`home-agents-carousel ${suisseIntl.className}`} aria-hidden>
      <div className="home-agents-carousel__stage">
        <CarouselChevron direction="left" onClick={goPrev} label="Previous agent" />
        <div className="home-agents-carousel__viewport">
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
                mountShader={shouldMountCarouselShader(orbIndex, position)}
              />
            ))}
          </div>
        </div>
        <CarouselChevron direction="right" onClick={goNext} label="Next agent" />
      </div>
      <div className="home-agents-carousel__pill">
        <span className="home-agents-carousel__pill-text">{active.label}</span>
      </div>
    </div>
  );
}
