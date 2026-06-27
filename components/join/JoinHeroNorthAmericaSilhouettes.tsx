"use client";

/**
 * Canada + USA silhouettes.
 * Uses SVG <mask> + <feComponentTransfer> invert filter so the black-on-white
 * JPG images correctly mask an orange gradient fill (black country → shows orange,
 * white background → transparent).
 */
import { useId } from "react";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import { useJoinHeroScrollReveal, joinHeroBoxRevealClass, joinHeroBoxRevealDelay, JOIN_HERO_BOX_REVEAL_STAGGER_MS, JOIN_HERO_BOX_RISE_DURATION_MS, JOIN_HERO_BOX_SEQUENCE_GAP_MS } from "@/lib/join/use-join-hero-scroll-reveal";
import {
  HERO_AGENT_BOX_H,
  HERO_AGENT_BOX_W,
  HeroAgentBoxContent,
  HeroAgentBoxGrainFilter,
} from "@/lib/join/hero-agent-box-svg";

const GRADIENT_STOPS = [
  { offset: "0%", color: "#E7A944" },
  { offset: "30%", color: "#D49D4F" },
  { offset: "62%", color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const VW = 2100;
const VH = 1960;
const VOX = -860;
const VOY = -760;

// Agent grid — top-right; countries diagonal on the right (Canada top-left, US bottom-right).
const GRID_RIGHT = 1180;
const GRID_TOP = -700;
const MAP_W = 780;
const MAP_H = 560;
const MAP_REGION_RIGHT = 1240;
const MAP_REGION_BOTTOM = 420;

const BOX_W = HERO_AGENT_BOX_W;
const BOX_H = HERO_AGENT_BOX_H;
const BOX_RX = HERO_AGENT_BOX_RX;
const BOX_ROW_GAP = 52;
const ROW_SPAN = BOX_W + BOX_ROW_GAP;
const GRID_CX = GRID_RIGHT - ROW_SPAN - BOX_W / 2;
const TOP_ROW_Y = GRID_TOP + BOX_H / 2 + 24;
const BOTTOM_ROW_Y = TOP_ROW_Y + BOX_H + BOX_ROW_GAP;

const CA = {
  x: MAP_REGION_RIGHT - MAP_W * 1.38,
  y: MAP_REGION_BOTTOM - MAP_H * 1.42,
  w: MAP_W,
  h: MAP_H,
};
const US = {
  x: MAP_REGION_RIGHT - MAP_W * 0.92,
  y: MAP_REGION_BOTTOM - MAP_H * 0.52,
  w: MAP_W,
  h: MAP_H,
};

/** Zoom map art inside the fixed clip rects — larger silhouettes without moving white boxes. */
const COUNTRY_IMAGE_SCALE = 1.22;

function scaledMapImage(box: { x: number; y: number; w: number; h: number }) {
  const w = box.w * COUNTRY_IMAGE_SCALE;
  const h = box.h * COUNTRY_IMAGE_SCALE;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

const CA_MAP = scaledMapImage(CA);
const US_MAP = scaledMapImage(US);

const ORBIT: { x: number; y: number }[] = [
  { x: GRID_CX - ROW_SPAN, y: TOP_ROW_Y },
  { x: GRID_CX, y: TOP_ROW_Y },
  { x: GRID_CX + ROW_SPAN, y: TOP_ROW_Y },
  { x: GRID_CX - ROW_SPAN, y: BOTTOM_ROW_Y },
  { x: GRID_CX, y: BOTTOM_ROW_Y },
  { x: GRID_CX + ROW_SPAN, y: BOTTOM_ROW_Y },
];

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const id = useId().replace(/:/g, "");
  const { ref, revealed } = useJoinHeroScrollReveal();

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-[clamp(0,0.75vw,0.75rem)] top-[8%] z-[2] translate-x-2 scale-[0.88] w-[min(88%,24rem)] overflow-visible origin-top-right"
      : "pointer-events-none absolute right-[clamp(0.25rem,1.5vw,1.25rem)] top-[clamp(0.35rem,1.8vh,1.1rem)] z-[2] translate-x-3 scale-[1.02] w-[min(94%,64rem)] overflow-visible origin-top-right";

  const caGrad = `${id}-ca-grad`;
  const usGrad = `${id}-us-grad`;
  const caMask  = `${id}-ca-mask`;
  const usMask  = `${id}-us-mask`;
  const invertF = `${id}-invert`;
  const orbIdPrefix = `${id}-orb`;
  const voiceOrbGrain = `${id}-voice-orb-grain`;
  const countryGrain = `${id}-country-grain`;

  return (
    <div ref={ref} className={`${wrapperClass} ${suisseIntl.className} ${dmSans.className}`} aria-hidden>
      <svg
        viewBox={`${VOX} ${VOY} ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={invertF} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="-1" intercept="1" />
              <feFuncG type="linear" slope="-1" intercept="1" />
              <feFuncB type="linear" slope="-1" intercept="1" />
            </feComponentTransfer>
          </filter>

          <linearGradient id={caGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            {GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <linearGradient id={usGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            {GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          <mask id={caMask}>
            <image
              href="/images/canada-map.jpg"
              x={CA_MAP.x} y={CA_MAP.y}
              width={CA_MAP.w} height={CA_MAP.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>

          <mask id={usMask}>
            <image
              href="/images/usa-map.jpg"
              x={US_MAP.x} y={US_MAP.y}
              width={US_MAP.w} height={US_MAP.h}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${invertF})`}
            />
          </mask>

          <HeroAgentBoxGrainFilter id={voiceOrbGrain} />

          <filter id={countryGrain} x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
            <feComponentTransfer in="monoNoise" result="faintNoise">
              <feFuncA type="linear" slope="0.22" intercept="0" />
            </feComponentTransfer>
            <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
            <feBlend in="SourceGraphic" in2="maskedNoise" mode="overlay" />
          </filter>
        </defs>

        {/* Canada — reveals first */}
        <g
          className={joinHeroBoxRevealClass(revealed)}
          style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 0) }}
          filter={`url(#${countryGrain})`}
        >
          <rect x={CA.x} y={CA.y} width={CA.w} height={CA.h} fill={`url(#${caGrad})`} mask={`url(#${caMask})`} />
        </g>

        {/* USA — follows Canada */}
        <g
          className={joinHeroBoxRevealClass(revealed)}
          style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 1) }}
          filter={`url(#${countryGrain})`}
        >
          <rect x={US.x} y={US.y} width={US.w} height={US.h} fill={`url(#${usGrad})`} mask={`url(#${usMask})`} />
        </g>

        <style>{`
          .${id}-box rect {
            stroke: none;
          }
        `}</style>

        {ORBIT.map((pt, i) => {
          // Wait for USA (index 1) to finish before boxes start
          const boxRevealBase =
            JOIN_HERO_BOX_REVEAL_STAGGER_MS + JOIN_HERO_BOX_RISE_DURATION_MS + JOIN_HERO_BOX_SEQUENCE_GAP_MS;

          return (
          <g
            key={`box-${i}`}
            className={`${joinHeroBoxRevealClass(revealed)} ${id}-box`}
            style={{ animationDelay: joinHeroBoxRevealDelay(revealed, i, boxRevealBase) }}
          >
            <HeroAgentBoxContent
              agentIndex={i as 0 | 1 | 2 | 3 | 4 | 5}
              boxX={pt.x - BOX_W / 2}
              boxY={pt.y - BOX_H / 2}
              grainFilterId={voiceOrbGrain}
              idPrefix={`${orbIdPrefix}-${i}`}
            />
          </g>
          );
        })}
      </svg>
    </div>
  );
}
