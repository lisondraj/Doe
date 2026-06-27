"use client";

/**
 * Canada + USA silhouettes and/or join-hero agent grid.
 * Canada uses an inline SVG path mask; USA uses a JPG mask with invert filter
 * (black country → shows orange, white background → transparent).
 */
import { useId } from "react";
import { dmSans, suisseIntl } from "@/lib/home/fonts";
import {
  useJoinHeroScrollReveal,
  joinHeroBoxRevealClass,
  joinHeroBoxRevealDelay,
  JOIN_HERO_BOX_REVEAL_STAGGER_MS,
  JOIN_HERO_BOX_RISE_DURATION_MS,
  JOIN_HERO_BOX_SEQUENCE_GAP_MS,
} from "@/lib/join/use-join-hero-scroll-reveal";
import {
  CANADA_SILHOUETTE_PATH,
  CANADA_SILHOUETTE_VIEWBOX,
} from "@/lib/join/canada-silhouette-path";
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

type CountryLayout = "hero-agents" | "mission-right";

type CountryGeometry = {
  viewBox: { x: number; y: number; w: number; h: number };
  mapW: number;
  mapH: number;
  mapRegionRight: number;
  mapRegionBottom: number;
  countryImageScale: number;
  ca: { xMul: number; yMul: number };
  us: { xMul: number; yMul: number };
};

const HERO_AGENTS_COUNTRY: CountryGeometry = {
  viewBox: { x: -860, y: -760, w: 2100, h: 1960 },
  mapW: 780,
  mapH: 560,
  mapRegionRight: 1240,
  mapRegionBottom: 420,
  countryImageScale: 1.22,
  ca: { xMul: 1.38, yMul: 1.42 },
  us: { xMul: 0.92, yMul: 0.52 },
};

/** Larger maps anchored on the right — About Doe's Mission band. */
const MISSION_RIGHT_COUNTRY: CountryGeometry = {
  viewBox: { x: 80, y: -520, w: 1180, h: 1080 },
  mapW: 980,
  mapH: 720,
  mapRegionRight: 1120,
  mapRegionBottom: 420,
  countryImageScale: 1.42,
  ca: { xMul: 1.34, yMul: 1.48 },
  us: { xMul: 0.86, yMul: 0.46 },
};

function countryRects(geometry: CountryGeometry) {
  const { mapW, mapH, mapRegionRight, mapRegionBottom, ca, us } = geometry;

  const caBox = {
    x: mapRegionRight - mapW * ca.xMul,
    y: mapRegionBottom - mapH * ca.yMul,
    w: mapW,
    h: mapH,
  };
  const usBox = {
    x: mapRegionRight - mapW * us.xMul,
    y: mapRegionBottom - mapH * us.yMul,
    w: mapW,
    h: mapH,
  };

  return { caBox, usBox };
}

function scaledMapImage(
  box: { x: number; y: number; w: number; h: number },
  countryImageScale: number,
) {
  const w = box.w * countryImageScale;
  const h = box.h * countryImageScale;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** Fit vector silhouette inside map rect (xMidYMid meet). */
function fittedSilhouetteTransform(
  mapRect: { x: number; y: number; w: number; h: number },
  viewBox: { w: number; h: number },
) {
  const scale = Math.min(mapRect.w / viewBox.w, mapRect.h / viewBox.h);
  const fittedW = viewBox.w * scale;
  const fittedH = viewBox.h * scale;
  return {
    x: mapRect.x + (mapRect.w - fittedW) / 2,
    y: mapRect.y + (mapRect.h - fittedH) / 2,
    scale,
  };
}

// Agent grid — top-right on the hero-agents band.
const GRID_RIGHT = 1180;
const GRID_TOP = -700;
const BOX_W = HERO_AGENT_BOX_W;
const BOX_H = HERO_AGENT_BOX_H;
const BOX_ROW_GAP = 52;
const ROW_SPAN = BOX_W + BOX_ROW_GAP;
const GRID_CX = GRID_RIGHT - ROW_SPAN - BOX_W / 2;
const TOP_ROW_Y = GRID_TOP + BOX_H / 2 + 24;
const BOTTOM_ROW_Y = TOP_ROW_Y + BOX_H + BOX_ROW_GAP;

const ORBIT: { x: number; y: number }[] = [
  { x: GRID_CX - ROW_SPAN, y: TOP_ROW_Y },
  { x: GRID_CX, y: TOP_ROW_Y },
  { x: GRID_CX + ROW_SPAN, y: TOP_ROW_Y },
  { x: GRID_CX - ROW_SPAN, y: BOTTOM_ROW_Y },
  { x: GRID_CX, y: BOTTOM_ROW_Y },
  { x: GRID_CX + ROW_SPAN, y: BOTTOM_ROW_Y },
];

function wrapperClass(
  variant: "mobile" | "desktop",
  countryLayout: CountryLayout,
  showAgents: boolean,
  showCountries: boolean,
) {
  if (countryLayout === "mission-right" && showCountries && !showAgents) {
    return variant === "mobile"
      ? "pointer-events-none absolute right-0 top-1/2 z-[2] h-[min(82%,34rem)] w-[min(96%,30rem)] -translate-y-1/2 translate-x-[3%] origin-center overflow-visible"
      : "pointer-events-none absolute right-[clamp(0.25rem,1.4vw,1.75rem)] top-1/2 z-[2] h-[min(94%,38rem)] w-[min(64%,52rem)] -translate-y-1/2 origin-center-right overflow-visible";
  }

  return variant === "mobile"
    ? "pointer-events-none absolute right-[clamp(0,0.75vw,0.75rem)] top-[8%] z-[2] w-[min(88%,24rem)] translate-x-2 scale-[0.88] origin-top-right overflow-visible"
    : "pointer-events-none absolute right-[clamp(0.25rem,1.5vw,1.25rem)] top-[clamp(0.35rem,1.8vh,1.1rem)] z-[2] w-[min(94%,64rem)] translate-x-3 scale-[1.02] origin-top-right overflow-visible";
}

export function JoinHeroNorthAmericaSilhouettes({
  variant,
  showAgents = true,
  showCountries = true,
  countryLayout = "hero-agents",
}: {
  variant: "mobile" | "desktop";
  showAgents?: boolean;
  showCountries?: boolean;
  countryLayout?: CountryLayout;
}) {
  const id = useId().replace(/:/g, "");
  const { ref, revealed } = useJoinHeroScrollReveal();

  const geometry = countryLayout === "mission-right" ? MISSION_RIGHT_COUNTRY : HERO_AGENTS_COUNTRY;
  const { caBox, usBox } = countryRects(geometry);
  const caMap = scaledMapImage(caBox, geometry.countryImageScale);
  const caSilhouette = fittedSilhouetteTransform(caMap, CANADA_SILHOUETTE_VIEWBOX);
  const usMap = scaledMapImage(usBox, geometry.countryImageScale);
  const { viewBox } = geometry;

  const caGrad = `${id}-ca-grad`;
  const usGrad = `${id}-us-grad`;
  const caMask = `${id}-ca-mask`;
  const usMask = `${id}-us-mask`;
  const invertF = `${id}-invert`;
  const orbIdPrefix = `${id}-orb`;
  const voiceOrbGrain = `${id}-voice-orb-grain`;
  const countryGrain = `${id}-country-grain`;

  return (
    <div
      ref={ref}
      className={`${wrapperClass(variant, countryLayout, showAgents, showCountries)} ${suisseIntl.className} ${dmSans.className}`}
      aria-hidden
    >
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
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

          {showCountries ? (
            <>
              <mask id={caMask}>
                <g
                  transform={`translate(${caSilhouette.x}, ${caSilhouette.y}) scale(${caSilhouette.scale})`}
                >
                  <path d={CANADA_SILHOUETTE_PATH} fill="white" fillRule="evenodd" />
                </g>
              </mask>

              <mask id={usMask}>
                <image
                  href="/images/usa-map.jpg"
                  x={usMap.x}
                  y={usMap.y}
                  width={usMap.w}
                  height={usMap.h}
                  preserveAspectRatio="xMidYMid meet"
                  filter={`url(#${invertF})`}
                />
              </mask>
            </>
          ) : null}

          {showAgents ? <HeroAgentBoxGrainFilter id={voiceOrbGrain} /> : null}

          {showCountries ? (
            <filter id={countryGrain} x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" stitchTiles="stitch" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
              <feComponentTransfer in="monoNoise" result="faintNoise">
                <feFuncA type="linear" slope="0.22" intercept="0" />
              </feComponentTransfer>
              <feComposite in="faintNoise" in2="SourceGraphic" operator="in" result="maskedNoise" />
              <feBlend in="SourceGraphic" in2="maskedNoise" mode="overlay" />
            </filter>
          ) : null}
        </defs>

        {showCountries ? (
          <>
            <g
              className={joinHeroBoxRevealClass(revealed)}
              style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 0) }}
              filter={`url(#${countryGrain})`}
            >
              <rect x={caBox.x} y={caBox.y} width={caBox.w} height={caBox.h} fill={`url(#${caGrad})`} mask={`url(#${caMask})`} />
            </g>

            <g
              className={joinHeroBoxRevealClass(revealed)}
              style={{ animationDelay: joinHeroBoxRevealDelay(revealed, 1) }}
              filter={`url(#${countryGrain})`}
            >
              <rect x={usBox.x} y={usBox.y} width={usBox.w} height={usBox.h} fill={`url(#${usGrad})`} mask={`url(#${usMask})`} />
            </g>
          </>
        ) : null}

        {showAgents ? (
          <>
            <style>{`
              .${id}-box rect {
                stroke: none;
              }
            `}</style>

            {ORBIT.map((pt, i) => {
              const boxRevealBase =
                showCountries
                  ? JOIN_HERO_BOX_REVEAL_STAGGER_MS + JOIN_HERO_BOX_RISE_DURATION_MS + JOIN_HERO_BOX_SEQUENCE_GAP_MS
                  : 0;

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
          </>
        ) : null}
      </svg>
    </div>
  );
}
