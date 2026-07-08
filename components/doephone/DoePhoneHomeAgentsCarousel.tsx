"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useCallback, useState, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  HERO_DIAL_ORB_SHADER,
  HERO_DIAL_ORBS,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

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
}: {
  scheme: HeroDialOrbScheme;
  focused: boolean;
}) {
  const intensity = scheme.intensity ?? HERO_DIAL_ORB_SHADER.intensity;

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
          <GrainGradient
            width="100%"
            height="100%"
            fit={HERO_DIAL_ORB_SHADER.fit}
            worldWidth={HERO_DIAL_ORB_SHADER.worldWidth}
            worldHeight={HERO_DIAL_ORB_SHADER.worldHeight}
            colors={[scheme.colors[0], scheme.colors[1], scheme.colors[2]]}
            colorBack={scheme.colorBack}
            softness={HERO_DIAL_ORB_SHADER.softness}
            intensity={intensity}
            noise={HERO_DIAL_ORB_SHADER.noise}
            shape={HERO_DIAL_ORB_SHADER.shape}
            speed={HERO_DIAL_ORB_SHADER.speed}
            rotation={HERO_DIAL_ORB_SHADER.rotation}
            offsetX={HERO_DIAL_ORB_SHADER.offsetX}
            offsetY={HERO_DIAL_ORB_SHADER.offsetY}
            scale={HERO_DIAL_ORB_SHADER.scale}
            maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO}
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

/** Hero agent orbs — horizontal carousel with chevrons and label pill. */
export function DoePhoneHomeAgentsCarousel() {
  const [index, setIndex] = useState(AGENTS_CAROUSEL_START_INDEX);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + AGENTS_CAROUSEL_ORB_COUNT) % AGENTS_CAROUSEL_ORB_COUNT);
  }, []);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % AGENTS_CAROUSEL_ORB_COUNT);
  }, []);

  const active = AGENTS_CAROUSEL_ORBS[index];

  return (
    <div className={`home-agents-carousel ${suisseIntl.className}`} aria-hidden>
      <div className="home-agents-carousel__stage">
        <CarouselChevron direction="left" onClick={goPrev} label="Previous agent" />
        <div className="home-agents-carousel__viewport">
          <div
            className="home-agents-carousel__track"
            style={{
              transform: `translateX(calc(50% - var(--home-agents-orb-half) - ${index} * var(--home-agents-orb-step)))`,
            }}
          >
            {AGENTS_CAROUSEL_ORBS.map((scheme, orbIndex) => (
              <AgentCarouselOrb key={scheme.label} scheme={scheme} focused={orbIndex === index} />
            ))}
          </div>
        </div>
        <CarouselChevron direction="right" onClick={goNext} label="Next agent" />
      </div>
      <div className="home-agents-carousel__pill" key={active.label}>
        <span className="home-agents-carousel__pill-text">{active.label}</span>
      </div>
    </div>
  );
}
