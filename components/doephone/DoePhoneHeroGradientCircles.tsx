"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

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
const ORBIT_REVOLUTION_MS = 26000;

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

type PlacedOrb = {
  id: string;
  scheme: OrbScheme;
  xPct: number;
  yPct: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

function orbitPoint(index: number, count: number, phase: number) {
  const tilt = (ORBIT.tiltDeg * Math.PI) / 180;
  const fraction = index / count + phase;
  const warped = fraction + (ORBIT_BACK_BUNCH / (Math.PI * 2)) * Math.sin(fraction * Math.PI * 2);
  const t = Math.PI / 2 + warped * Math.PI * 2;

  // depth: 1 at the near vertex (t = π/2), 0 at the far vertex (t = -π/2).
  const depth = (Math.sin(t) + 1) / 2;

  const x = Math.cos(t) * ORBIT.rx;
  // Shift so the near vertex (sin(t) = 1) lands exactly on y = 0 — the path's
  // nearest point coincides with the stage center, not just a nearby offset.
  const y = (Math.sin(t) - 1) * ORBIT.ry;

  const xPct = x * Math.cos(tilt) - y * Math.sin(tilt) + ORBIT_ANCHOR_X;
  const yPct = x * Math.sin(tilt) + y * Math.cos(tilt) + ORBIT_ANCHOR_Y;

  return {
    xPct,
    yPct,
    scale: ORBIT_MIN_SCALE + depth * (ORBIT_MAX_SCALE - ORBIT_MIN_SCALE),
    opacity: 0.34 + depth * 0.66,
    zIndex: Math.round(10 + depth * 190),
  };
}

function buildOrbLayout(phase: number): PlacedOrb[] {
  return Array.from({ length: ORBIT.orbitCount }, (_, index) => ({
    id: `orbit-${index}`,
    scheme: SCHEME_ORDER[index],
    ...orbitPoint(index, ORBIT.orbitCount, phase),
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

/** Hero — every orb travels one shared elliptical path that dips through the
 *  center, so each color takes its turn passing through the big highlight spot. */
export function DoePhoneHeroGradientCircles() {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const tick = (now: number) => {
      if (startRef.current === undefined) startRef.current = now;
      const elapsed = now - startRef.current;
      setPhase((elapsed % ORBIT_REVOLUTION_MS) / ORBIT_REVOLUTION_MS);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const orbs = buildOrbLayout(phase);

  return (
    <div className="hero-speaking-orbs" aria-hidden>
      <div className="hero-speaking-orbs__stage">
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="hero-speaking-orbs__node"
            style={{
              left: `calc(50% + ${orb.xPct}%)`,
              top: `calc(50% + ${orb.yPct}%)`,
              transform: `translate(-50%, -50%) scale(${orb.scale})`,
              opacity: orb.opacity,
              zIndex: orb.zIndex,
            }}
          >
            <SpeakingGradientOrb scheme={orb.scheme} />
          </div>
        ))}
      </div>
    </div>
  );
}
