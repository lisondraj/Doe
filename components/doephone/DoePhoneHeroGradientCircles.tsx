"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

/** Center-orb tag labels — cycles while the front orb is in the highlight spot. */
const HERO_ORB_AGENT_TAGS = [
  "Voice Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
  "Refill Agent",
] as const;

type TagCorner = "tl" | "tr" | "bl" | "br";

const TAG_CORNERS: TagCorner[] = ["tl", "tr", "bl", "br"];

const CENTER_DEPTH_THRESHOLD = 0.86;
const PULSE_SLOT_MS = 2600;
const PULSE_MAX_BOOST = 0.07;
const TAG_CYCLE_MS = 3400;
const TAG_FADE_IN = 0.14;
const TAG_HOLD = 0.58;
const TAG_FADE_OUT = 0.28;

/** Orb palettes — offset from hero (teal + gold/orange/copper). */
const HERO_SPEAKING_ORB_SCHEMES = {
  mint: {
    colors: ["#7EC4B0", "#5A9E88", "#C8EDE0"] as const,
    colorBack: "#1E4A42",
  },
  rose: {
    colors: ["#E8A8B8", "#C9788E", "#F2DDD4"] as const,
    colorBack: "#523040",
  },
  periwinkle: {
    colors: ["#9EB8E0", "#6E94C4", "#C5DCF0"] as const,
    colorBack: "#2A4468",
  },
  apricot: {
    colors: ["#F0C078", "#E09850", "#FAE8C8"] as const,
    colorBack: "#5C4028",
  },
  lilac: {
    colors: ["#C4A8E8", "#9678C8", "#EDE4F8"] as const,
    colorBack: "#403058",
  },
  coral: {
    colors: ["#F4A896", "#E07868", "#FCE0D8"] as const,
    colorBack: "#6E3828",
  },
  teal: {
    colors: ["#88C4C4", "#58A0A0", "#D0ECEC"] as const,
    colorBack: "#284848",
  },
} as const;

type OrbScheme = (typeof HERO_SPEAKING_ORB_SCHEMES)[keyof typeof HERO_SPEAKING_ORB_SCHEMES];

const SCHEME_ORDER = [
  HERO_SPEAKING_ORB_SCHEMES.mint,
  HERO_SPEAKING_ORB_SCHEMES.rose,
  HERO_SPEAKING_ORB_SCHEMES.periwinkle,
  HERO_SPEAKING_ORB_SCHEMES.apricot,
  HERO_SPEAKING_ORB_SCHEMES.lilac,
  HERO_SPEAKING_ORB_SCHEMES.coral,
  HERO_SPEAKING_ORB_SCHEMES.teal,
] as const;

/**
 * Tilted ellipse whose nearest vertex sits exactly at the stage center — every
 * orb travels this same path, so each one genuinely passes through the center
 * highlight spot (and grows to full size there) as it swings around.
 */
const ORBIT = {
  rx: 48,
  ry: 32,
  tiltDeg: -22,
  orbitCount: SCHEME_ORDER.length,
} as const;

/** Single shared size — apparent size is depth-driven scale only. */
const ORB_BASE_SIZE = "clamp(15.5rem, 46vmin, 20.5rem)";
const ORBIT_MIN_SCALE = 0.56;
const ORBIT_MAX_SCALE = 1;

/** One full lap — time between an orb's consecutive passes through center. */
const ORBIT_REVOLUTION_MS = 36000;

/** Z-order tracks a lagged depth so front/back swaps ease in, not pop. */
const Z_DEPTH_LERP = 0.045;

/** Recenters the shifted-vertex ellipse within the stage. */
const ORBIT_ANCHOR_X = 14.8;
const ORBIT_ANCHOR_Y = 33.2;

/**
 * Even parameter spacing leaves a visible gap between the small far orbs — warp
 * the back of the loop so those orbs sit closer together.
 */
const ORBIT_BACK_BUNCH = 0.34;

/** Volumetric sphere — smooth gradient, no grain. */
const HERO_ORB_SHADER = {
  shape: "sphere" as const,
  softness: 0.58,
  intensity: 0.11,
  noise: 0,
  fit: "cover" as const,
  scale: 1.32,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  worldWidth: 0,
  worldHeight: 0,
  speed: 0,
} as const;

type OrbPose = {
  xPct: number;
  yPct: number;
  depth: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

/** Smoothstep — softer grow/fade at orbit extremes. */
function easeDepth(depth: number) {
  return depth * depth * (3 - 2 * depth);
}

function orbitPoint(index: number, count: number, phase: number): OrbPose {
  const tilt = (ORBIT.tiltDeg * Math.PI) / 180;
  const fraction = index / count + phase;
  const warped = fraction + (ORBIT_BACK_BUNCH / (Math.PI * 2)) * Math.sin(fraction * Math.PI * 2);
  const t = Math.PI / 2 + warped * Math.PI * 2;

  // depth: 1 at the near vertex (t = π/2), 0 at the far vertex (t = -π/2).
  const depth = (Math.sin(t) + 1) / 2;
  const eased = easeDepth(depth);

  const x = Math.cos(t) * ORBIT.rx;
  const y = (Math.sin(t) - 1) * ORBIT.ry;

  const xPct = x * Math.cos(tilt) - y * Math.sin(tilt) + ORBIT_ANCHOR_X;
  const yPct = x * Math.sin(tilt) + y * Math.cos(tilt) + ORBIT_ANCHOR_Y;

  return {
    xPct,
    yPct,
    depth,
    scale: ORBIT_MIN_SCALE + eased * (ORBIT_MAX_SCALE - ORBIT_MIN_SCALE),
    opacity: 0.72 + eased * 0.28,
    zIndex: 10,
  };
}

function buildOrbLayout(phase: number, zDepths: number[]): OrbPose[] {
  const poses = Array.from({ length: ORBIT.orbitCount }, (_, index) =>
    orbitPoint(index, ORBIT.orbitCount, phase),
  );

  for (let index = 0; index < ORBIT.orbitCount; index += 1) {
    zDepths[index] += (poses[index].depth - zDepths[index]) * Z_DEPTH_LERP;
  }

  const zOrder = Array.from({ length: ORBIT.orbitCount }, (_, index) => index).sort(
    (a, b) => zDepths[a] - zDepths[b] || a - b,
  );
  const zByIndex = new Map(zOrder.map((index, rank) => [index, 10 + rank * 2]));

  return poses.map((pose, index) => ({
    ...pose,
    zIndex: zByIndex.get(index) ?? 10,
  }));
}

function orbNodeStyle(orb: OrbPose, pulseScale = 1) {
  return {
    left: `calc(50% + ${orb.xPct}%)`,
    top: `calc(50% + ${orb.yPct}%)`,
    transform: `translate3d(-50%, -50%, 0) scale(${orb.scale * pulseScale})`,
    opacity: orb.opacity,
    zIndex: orb.zIndex,
  } as const;
}

function orbTagCorner(index: number): TagCorner {
  return TAG_CORNERS[index % TAG_CORNERS.length];
}

/** Two or three orbs pulse per time slot — staggered around the loop. */
function pulseScaleForOrb(index: number, elapsedMs: number) {
  const slot = Math.floor(elapsedMs / PULSE_SLOT_MS);
  const phase = (elapsedMs % PULSE_SLOT_MS) / PULSE_SLOT_MS;
  const active = new Set([
    slot % ORBIT.orbitCount,
    (slot + 2) % ORBIT.orbitCount,
    (slot + 4) % ORBIT.orbitCount,
  ]);

  if (!active.has(index)) return 1;

  const wave = Math.sin(phase * Math.PI);
  return 1 + PULSE_MAX_BOOST * wave * wave;
}

function centerOrbIndex(layout: OrbPose[]) {
  let centerIndex = -1;
  let maxDepth = -1;

  layout.forEach((orb, index) => {
    if (orb.depth > maxDepth) {
      maxDepth = orb.depth;
      centerIndex = index;
    }
  });

  if (maxDepth < CENTER_DEPTH_THRESHOLD) return -1;
  return centerIndex;
}

function tagOpacityForCycle(elapsedMs: number) {
  const cycle = (elapsedMs % TAG_CYCLE_MS) / TAG_CYCLE_MS;

  if (cycle < TAG_FADE_IN) return cycle / TAG_FADE_IN;
  if (cycle < TAG_FADE_IN + TAG_HOLD) return 1;
  const fadeStart = TAG_FADE_IN + TAG_HOLD;
  return Math.max(0, 1 - (cycle - fadeStart) / TAG_FADE_OUT);
}

function tagLabelIndex(elapsedMs: number) {
  return Math.floor(elapsedMs / TAG_CYCLE_MS) % HERO_ORB_AGENT_TAGS.length;
}

function SpeakingGradientOrb({
  scheme,
  tagCorner,
  tagRef,
}: {
  scheme: OrbScheme;
  tagCorner: TagCorner;
  tagRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div className="hero-speaking-orb" style={{ width: ORB_BASE_SIZE, height: ORB_BASE_SIZE }}>
      <div className="hero-speaking-orb__core relative overflow-hidden rounded-full shadow-[0_18px_48px_rgba(30,52,58,0.32)]">
        <GrainGradient
          width="100%"
          height="100%"
          fit={HERO_ORB_SHADER.fit}
          worldWidth={HERO_ORB_SHADER.worldWidth}
          worldHeight={HERO_ORB_SHADER.worldHeight}
          colors={[...scheme.colors]}
          colorBack={scheme.colorBack}
          softness={HERO_ORB_SHADER.softness}
          intensity={HERO_ORB_SHADER.intensity}
          noise={HERO_ORB_SHADER.noise}
          shape={HERO_ORB_SHADER.shape}
          speed={HERO_ORB_SHADER.speed}
          rotation={HERO_ORB_SHADER.rotation}
          offsetX={HERO_ORB_SHADER.offsetX}
          offsetY={HERO_ORB_SHADER.offsetY}
          scale={HERO_ORB_SHADER.scale}
          maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-18px_36px_rgba(30,52,58,0.22)]"
          aria-hidden
        />
      </div>
      <div
        ref={tagRef}
        className={`hero-speaking-orb__tag hero-speaking-orb__tag--${tagCorner} ${suisseIntl.className}`}
        aria-hidden
      >
        <span className="hero-speaking-orb__tag-text" />
      </div>
    </div>
  );
}

/** Hero — every orb travels one shared elliptical path that dips through the
 *  center, so each color takes its turn passing through the big highlight spot. */
export function DoePhoneHeroGradientCircles() {
  const initialZDepths = Array.from({ length: ORBIT.orbitCount }, (_, index) =>
    orbitPoint(index, ORBIT.orbitCount, 0).depth,
  );
  const initialLayoutRef = useRef(buildOrbLayout(0, [...initialZDepths]));
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(initialZDepths);
  const initialCenterIndexRef = useRef(centerOrbIndex(initialLayoutRef.current));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyLayout = (phase: number, elapsedMs: number) => {
      const layout = buildOrbLayout(phase, zDepthsRef.current);
      const centerIndex = centerOrbIndex(layout);
      const tagOpacity = centerIndex >= 0 ? tagOpacityForCycle(elapsedMs) : 0;
      const labelIndex = tagLabelIndex(elapsedMs);
      const label = HERO_ORB_AGENT_TAGS[labelIndex];

      layout.forEach((orb, index) => {
        const node = nodeRefs.current[index];
        if (!node) return;
        const pulseScale = pulseScaleForOrb(index, elapsedMs);
        const style = orbNodeStyle(orb, pulseScale);
        node.style.left = style.left;
        node.style.top = style.top;
        node.style.transform = style.transform;
        node.style.opacity = `${style.opacity}`;
        node.style.zIndex = `${style.zIndex}`;

        const tag = tagRefs.current[index];
        const tagText = tagTextRefs.current[index];
        if (!tag) return;

        const isCenter = index === centerIndex;
        tag.style.opacity = isCenter ? `${tagOpacity}` : "0";
        tag.style.transform = isCenter
          ? `translateY(${(1 - tagOpacity) * 5}px) scale(${0.94 + tagOpacity * 0.06})`
          : "translateY(6px) scale(0.94)";

        if (tagText && isCenter) {
          tagText.textContent = label;
        }
      });
    };

    if (media.matches) {
      applyLayout(0, 0);
      const centerIndex = initialCenterIndexRef.current;
      if (centerIndex >= 0) {
        const tag = tagRefs.current[centerIndex];
        const tagText = tagTextRefs.current[centerIndex];
        if (tag) {
          tag.style.opacity = "1";
          tag.style.transform = "translateY(0) scale(1)";
        }
        if (tagText) {
          tagText.textContent = HERO_ORB_AGENT_TAGS[0];
        }
      }
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === undefined) startRef.current = now;
      const elapsed = now - startRef.current;
      const phase = (elapsed % ORBIT_REVOLUTION_MS) / ORBIT_REVOLUTION_MS;
      applyLayout(phase, elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="hero-speaking-orbs" aria-hidden>
      <div className="hero-speaking-orbs__stage">
        {SCHEME_ORDER.map((scheme, index) => (
          <div
            key={`orbit-${index}`}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            className="hero-speaking-orbs__node"
            style={orbNodeStyle(initialLayoutRef.current[index])}
          >
            <SpeakingGradientOrb
              scheme={scheme}
              tagCorner={orbTagCorner(index)}
              tagRef={(node) => {
                tagRefs.current[index] = node;
                const tagText = node?.querySelector<HTMLSpanElement>(".hero-speaking-orb__tag-text") ?? null;
                tagTextRefs.current[index] = tagText;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
