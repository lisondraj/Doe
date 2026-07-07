"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef } from "react";

import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

/** Orb palettes — Doe teal shades offset from hero #1E343A so orbs don't blend in. */
const HERO_SPEAKING_ORB_SCHEMES = {
  seafoam: {
    colors: ["#C8ECE4", "#78B8A8", "#5A9C8C"] as const,
    colorBack: "#2E5850",
  },
  aqua: {
    colors: ["#B8DCE8", "#6CA8BC", "#4E8CA0"] as const,
    colorBack: "#2E4E5C",
  },
  lagoon: {
    colors: ["#A8D4CC", "#68A898", "#4C8878"] as const,
    colorBack: "#325850",
  },
  glacier: {
    colors: ["#D4ECEC", "#94C4C0", "#72A8A4"] as const,
    colorBack: "#3A6864",
  },
  cypress: {
    colors: ["#98C8BC", "#5C9C8C", "#468470"] as const,
    colorBack: "#2C5248",
  },
  reef: {
    colors: ["#B0E0D8", "#74B4A4", "#589888"] as const,
    colorBack: "#346058",
  },
  surf: {
    colors: ["#A0CCC4", "#60A090", "#4A8878"] as const,
    colorBack: "#304E4A",
  },
} as const;

type OrbScheme = (typeof HERO_SPEAKING_ORB_SCHEMES)[keyof typeof HERO_SPEAKING_ORB_SCHEMES];

const SCHEME_ORDER = [
  HERO_SPEAKING_ORB_SCHEMES.seafoam,
  HERO_SPEAKING_ORB_SCHEMES.aqua,
  HERO_SPEAKING_ORB_SCHEMES.lagoon,
  HERO_SPEAKING_ORB_SCHEMES.glacier,
  HERO_SPEAKING_ORB_SCHEMES.cypress,
  HERO_SPEAKING_ORB_SCHEMES.reef,
  HERO_SPEAKING_ORB_SCHEMES.surf,
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

function orbNodeStyle(orb: OrbPose) {
  return {
    left: `calc(50% + ${orb.xPct}%)`,
    top: `calc(50% + ${orb.yPct}%)`,
    transform: `translate3d(-50%, -50%, 0) scale(${orb.scale})`,
    opacity: orb.opacity,
    zIndex: orb.zIndex,
  } as const;
}

function SpeakingGradientOrb({ scheme }: { scheme: OrbScheme }) {
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
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(initialZDepths);

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
