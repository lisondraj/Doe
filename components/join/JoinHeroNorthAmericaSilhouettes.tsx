"use client";

/**
 * Canada + USA silhouettes.
 * Uses SVG <mask> + <feComponentTransfer> invert filter so the black-on-white
 * JPG images correctly mask an orange gradient fill (black country → shows orange,
 * white background → transparent).
 */
import { useId } from "react";
import { suisseIntl } from "@/lib/home/fonts";
import { useJoinHeroScrollReveal } from "@/lib/join/use-join-hero-scroll-reveal";

const AGENT_INK = "#1E343A";

const ORBIT_AGENTS = [
  "Voice Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
] as const;

const ORBIT_ICON_R = 16;
const ORBIT_LABEL_SIZE = 38;
const BOX_PAD_X = 42;
const BOX_PAD_Y = 40;
const ROW_ICON_TEXT_GAP = 16;

const GRADIENT_STOPS = [
  { offset: "0%",   color: "#E7A944" },
  { offset: "30%",  color: "#D49D4F" },
  { offset: "62%",  color: "#D2774C" },
  { offset: "100%", color: "#C47A5A" },
] as const;

const VW = 2100;
const VH = 1960;
const VOX = -860;
const VOY = -760;

// Canada + USA centered on the orbit hub (CX, CY) — scaled up within box clearance
const CA = { x: -225, y: -281, w: 850, h: 525 };
const US = { x: -232, y: 194, w: 864, h: 517 };

/** Zoom map art inside the fixed clip rects — larger silhouettes without moving white boxes. */
const COUNTRY_IMAGE_SCALE = 1.14;

function scaledMapImage(box: { x: number; y: number; w: number; h: number }) {
  const w = box.w * COUNTRY_IMAGE_SCALE;
  const h = box.h * COUNTRY_IMAGE_SCALE;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

const CA_MAP = scaledMapImage(CA);
const US_MAP = scaledMapImage(US);

// Composition center for orbit layout — elliptical so top/bottom rings sit closer
const CX = 200;
const CY = 215;
const RX = 792;
const RY = 652;

const BOX_W = 614;
const BOX_H = 382;
const BOX_RX = 51;

/** Extra radial push for individual orbit boxes (index → outset). */
const ORBIT_BOX_OUTSET: Partial<Record<number, number>> = {
  0: 42, // Voice Agent — top
  3: 42, // Referrals Agent — bottom
};

const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
  const d = ORBIT_BOX_OUTSET[i] ?? 0;
  return { x: CX + (RX + d) * Math.cos(a), y: CY + (RY + d) * Math.sin(a) };
});

function OrbitAgentRow({ boxX, boxY, name }: { boxX: number; boxY: number; name: string }) {
  const iconCx = boxX + BOX_PAD_X + ORBIT_ICON_R;
  const iconCy = boxY + BOX_PAD_Y + ORBIT_ICON_R;
  const textX = iconCx + ORBIT_ICON_R + ROW_ICON_TEXT_GAP;

  return (
    <g aria-hidden>
      <g transform={`translate(${iconCx}, ${iconCy})`}>
        <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.78} stroke={AGENT_INK} strokeWidth={2.2} fill="none" />
        <circle cx={0} cy={0} r={ORBIT_ICON_R * 0.22} fill={AGENT_INK} />
        <path
          d={`M0 ${-ORBIT_ICON_R}v${ORBIT_ICON_R * 0.38}M0 ${ORBIT_ICON_R * 0.42}v${ORBIT_ICON_R * 0.58}M${-ORBIT_ICON_R} 0h${ORBIT_ICON_R * 0.38}M${ORBIT_ICON_R * 0.42} 0h${ORBIT_ICON_R * 0.58}`}
          stroke={AGENT_INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.42}
        />
      </g>
      <text
        x={textX}
        y={iconCy}
        dominantBaseline="middle"
        textAnchor="start"
        fill={AGENT_INK}
        fontSize={ORBIT_LABEL_SIZE}
        fontWeight={500}
        fontFamily={suisseIntl.style.fontFamily}
        letterSpacing="-0.02em"
      >
        {name}
      </text>
    </g>
  );
}

export function JoinHeroNorthAmericaSilhouettes({ variant }: { variant: "mobile" | "desktop" }) {
  const id = useId().replace(/:/g, "");
  const { ref, revealed } = useJoinHeroScrollReveal();

  const wrapperClass =
    variant === "mobile"
      ? "pointer-events-none absolute right-[clamp(0,0.75vw,0.75rem)] top-[42%] z-[2] -translate-y-1/2 translate-x-3 scale-[0.965] w-[min(78%,26rem)] overflow-visible origin-center"
      : "pointer-events-none absolute right-[clamp(0.25rem,1.5vw,1.25rem)] top-1/2 z-[2] -translate-y-1/2 translate-x-6 scale-[0.965] w-[min(72%,58rem)] overflow-visible origin-center";

  const caGrad  = `${id}-ca-grad`;
  const usGrad  = `${id}-us-grad`;
  const caMask  = `${id}-ca-mask`;
  const usMask  = `${id}-us-mask`;
  const invertF = `${id}-invert`;

  return (
    <div ref={ref} className={`${wrapperClass} ${suisseIntl.className}`} aria-hidden>
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
        </defs>

        <rect x={CA.x} y={CA.y} width={CA.w} height={CA.h} fill={`url(#${caGrad})`} mask={`url(#${caMask})`} />
        <rect x={US.x} y={US.y} width={US.w} height={US.h} fill={`url(#${usGrad})`} mask={`url(#${usMask})`} />

        <style>{`
          .${id}-box rect {
            stroke: none;
          }
        `}</style>

        {ORBIT.map((pt, i) => (
          <g
            key={`box-${i}`}
            className={`join-hero-box-reveal ${id}-box${revealed ? " join-hero-box-reveal--in" : ""}`}
            style={{ animationDelay: revealed ? `${i * 70}ms` : undefined }}
          >
            <rect
              x={pt.x - BOX_W / 2} y={pt.y - BOX_H / 2}
              width={BOX_W} height={BOX_H}
              rx={BOX_RX}
              fill="#FFFFFF"
              stroke="none"
            />
            <OrbitAgentRow
              boxX={pt.x - BOX_W / 2}
              boxY={pt.y - BOX_H / 2}
              name={ORBIT_AGENTS[i]}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
