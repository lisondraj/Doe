"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef } from "react";

import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

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
  violet: {
    colors: ["#B898DC", "#8068B0", "#E8DCF4"] as const,
    colorBack: "#443060",
  },
  sand: {
    colors: ["#E4C89C", "#C4A070", "#F4E8D0"] as const,
    colorBack: "#54402C",
  },
  sage: {
    colors: ["#A8C09C", "#7C9C6C", "#E0EAD4"] as const,
    colorBack: "#384830",
  },
  blush: {
    colors: ["#E8B8C4", "#CC8898", "#F6E0E4"] as const,
    colorBack: "#5C3440",
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
  HERO_SPEAKING_ORB_SCHEMES.violet,
  HERO_SPEAKING_ORB_SCHEMES.sand,
  HERO_SPEAKING_ORB_SCHEMES.sage,
  HERO_SPEAKING_ORB_SCHEMES.blush,
] as const;

/**
 * Tilted ellipse whose nearest vertex sits exactly at the stage center — every
 * orb travels this same path, so each one genuinely passes through the center
 * highlight spot (and grows to full size there) as it swings around.
 */
const ORBIT = {
  rx: 54,
  ry: 38,
  tiltDeg: -24,
  orbitCount: SCHEME_ORDER.length,
} as const;

/** Single shared size — apparent size is depth-driven scale only. */
const ORB_BASE_SIZE = "clamp(13.5rem, 40vmin, 17.5rem)";
const ORBIT_MIN_SCALE = 0.44;
const ORBIT_MAX_SCALE = 1;

/** One full lap — time between an orb's consecutive passes through center. */
const ORBIT_REVOLUTION_MS = 42000;

/** Z-order tracks a lagged depth so front/back swaps ease in, not pop. */
const Z_DEPTH_LERP = 0.055;

/** Recenters the shifted-vertex ellipse within the stage (the loop mostly arcs
 *  up and away from its near vertex, so the raw bounding box isn't symmetric). */
const ORBIT_ANCHOR_X = 15.5;
const ORBIT_ANCHOR_Y = 34.7;

/** Evenly-spaced angles leave a visible gap between the small far orbs (the
 *  near vertex compresses cartesian spacing while the far vertex stretches
 *  it) — nudge the back of the loop closer together to close that gap. */
const ORBIT_BACK_BUNCH = 0.2;

/** Volumetric sphere — smooth gradient, no grain. */
const HERO_ORB_SHADER = {
  shape: "sphere" as const,
  softness: 0.58,
  intensity: 0.11,
  noise: 0,
  fit: "contain" as const,
  scale: 1.22,
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
  // Shift so the near vertex (sin(t) = 1) lands exactly on y = 0 — the path's
  // nearest point coincides with the stage center, not just a nearby offset.
  const y = (Math.sin(t) - 1) * ORBIT.ry;

  const xPct = x * Math.cos(tilt) - y * Math.sin(tilt) + ORBIT_ANCHOR_X;
  const yPct = x * Math.sin(tilt) + y * Math.cos(tilt) + ORBIT_ANCHOR_Y;

  return {
    xPct,
    yPct,
    depth,
    scale: ORBIT_MIN_SCALE + eased * (ORBIT_MAX_SCALE - ORBIT_MIN_SCALE),
    opacity: 0.34 + eased * 0.66,
  };
}

function buildOrbLayout(phase: number, zDepths: number[]) {
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

function SpeakingGradientOrb({ scheme }: { scheme: OrbScheme }) {
  return (
    <div className="hero-speaking-orb" style={{ width: ORB_BASE_SIZE, height: ORB_BASE_SIZE }}>
      <div
        className="hero-speaking-orb__core relative overflow-hidden rounded-full shadow-[0_18px_48px_rgba(30,52,58,0.32)]"
        style={{ backgroundColor: scheme.colorBack }}
      >
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
    </div>
  );
}

function orbNodeStyle(orb: ReturnType<typeof buildOrbLayout>[number]) {
  return {
    left: `calc(50% + ${orb.xPct}%)`,
    top: `calc(50% + ${orb.yPct}%)`,
    transform: `translate3d(-50%, -50%, 0) scale(${orb.scale})`,
    opacity: orb.opacity,
    zIndex: orb.zIndex,
  } as const;
}

/** Hero — every orb travels one shared elliptical path that dips through the
 *  center, so each color takes its turn passing through the big highlight spot. */
export function DoePhoneHeroGradientCircles() {
  const initialLayoutRef = useRef(
    buildOrbLayout(
      0,
      Array.from({ length: ORBIT.orbitCount }, (_, index) =>
        orbitPoint(index, ORBIT.orbitCount, 0).depth,
      ),
    ),
  );
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(
    Array.from({ length: ORBIT.orbitCount }, (_, index) =>
      orbitPoint(index, ORBIT.orbitCount, 0).depth,
    ),
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyLayout = (phase: number) => {
      const layout = buildOrbLayout(phase, zDepthsRef.current);
      layout.forEach((orb, index) => {
        const node = nodeRefs.current[index];
        if (!node) return;
        const style = orbNodeStyle(orb);
        node.style.left = style.left;
        node.style.top = style.top;
        node.style.transform = style.transform;
        node.style.opacity = `${style.opacity}`;
        node.style.zIndex = `${style.zIndex}`;
      });
    };

    if (media.matches) {
      applyLayout(0);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === undefined) startRef.current = now;
      const elapsed = now - startRef.current;
      const phase = (elapsed % ORBIT_REVOLUTION_MS) / ORBIT_REVOLUTION_MS;
      applyLayout(phase);
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
            <SpeakingGradientOrb scheme={scheme} />
          </div>
        ))}
      </div>
    </div>
  );
}
