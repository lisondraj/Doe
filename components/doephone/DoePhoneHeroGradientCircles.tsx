"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { DOE_HOME_ORANGE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

const TAG_DEPTH_ENTER = 0.48;
const TAG_DEPTH_EXIT = 0.46;
const TAG_DEPTH_RESET = 0.18;
const TAG_FADE_MS = 420;

const PULSE_SLOT_MS = 2600;
const PULSE_MAX_BOOST = 0.07;

const HALO_CYCLE_MS = 3000;
const HALO_ORB_OFFSETS = [0, 2, 4] as const;
/** One dedicated agent label per orb — advances as each orb reaches the front. */
const ORB_AGENT_LABELS = [
  "Voice Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
  "Refill Agent",
] as const;

/** Orb palettes — dark → mid → light, backs in the hero ink family (#1E343A). */
const HERO_SPEAKING_ORB_SCHEMES = {
  mint: {
    colors: ["#3D7A6A", "#68B09A", "#C5EDE2"] as const,
    colorBack: "#1A3834",
  },
  rose: {
    colors: ["#A45870", "#D08898", "#F0D4D8"] as const,
    colorBack: "#382430",
  },
  periwinkle: {
    colors: ["#4A72A8", "#7CA0CC", "#D0E4F4"] as const,
    colorBack: "#243048",
  },
  apricot: {
    colors: ["#B87838", "#E0A050", "#F8E4C0"] as const,
    colorBack: "#483020",
  },
  lilac: {
    colors: ["#7860A8", "#A890D0", "#E4D8F4"] as const,
    colorBack: "#302448",
  },
  coral: {
    colors: ["#C06050", "#E88878", "#FADCD4"] as const,
    colorBack: "#442820",
  },
  teal: {
    colors: ["#3A8888", "#68B0B0", "#C8EAEA"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
} as const;

type OrbScheme = (typeof HERO_SPEAKING_ORB_SCHEMES)[keyof typeof HERO_SPEAKING_ORB_SCHEMES];

function orbAccentStyle(scheme: OrbScheme) {
  const [dark, mid, light] = scheme.colors;
  return {
    width: ORB_BASE_SIZE,
    height: ORB_BASE_SIZE,
    "--orb-halo-dark": dark,
    "--orb-halo-mid": mid,
    "--orb-halo-light": light,
    "--orb-halo-back": scheme.colorBack,
  } as CSSProperties;
}

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

function frontOrbIndex(layout: OrbPose[]) {
  let frontIndex = -1;
  let maxDepth = -1;

  layout.forEach((orb, index) => {
    if (orb.depth > maxDepth) {
      maxDepth = orb.depth;
      frontIndex = index;
    }
  });

  return frontIndex;
}

type OrbTagPhase = "idle" | "entering" | "holding" | "leaving" | "done";

type OrbTagState = {
  phase: OrbTagPhase;
  phaseStartMs: number;
};

function createTagState(): OrbTagState {
  return { phase: "idle", phaseStartMs: 0 };
}

/** One fade-in, hold, fade-out per center pass — no repeat until the orb loops back. */
function advanceTagState(state: OrbTagState, depth: number, elapsedMs: number): OrbTagState {
  const fadeT = Math.min(1, (elapsedMs - state.phaseStartMs) / TAG_FADE_MS);

  switch (state.phase) {
    case "idle":
      if (depth >= TAG_DEPTH_ENTER) {
        return { phase: "entering", phaseStartMs: elapsedMs };
      }
      return state;

    case "entering": {
      if (depth < TAG_DEPTH_EXIT) {
        return { phase: "idle", phaseStartMs: elapsedMs };
      }
      if (fadeT >= 1) {
        return { phase: "holding", phaseStartMs: elapsedMs };
      }
      return state;
    }

    case "holding":
      if (depth < TAG_DEPTH_EXIT) {
        return { phase: "leaving", phaseStartMs: elapsedMs };
      }
      return state;

    case "leaving": {
      if (fadeT >= 1 || depth < TAG_DEPTH_RESET) {
        return { phase: "done", phaseStartMs: elapsedMs };
      }
      return state;
    }

    case "done":
      if (depth < TAG_DEPTH_RESET) {
        return { phase: "idle", phaseStartMs: elapsedMs };
      }
      return state;

    default:
      return state;
  }
}

function tagOpacityFromState(state: OrbTagState, elapsedMs: number) {
  const fadeT = Math.min(1, (elapsedMs - state.phaseStartMs) / TAG_FADE_MS);

  switch (state.phase) {
    case "entering":
      return fadeT;
    case "holding":
      return 1;
    case "leaving":
      return 1 - fadeT;
    default:
      return 0;
  }
}

function haloWavesForOrb(index: number, elapsedMs: number) {
  const slot = Math.floor(elapsedMs / HALO_CYCLE_MS);
  const active = HALO_ORB_OFFSETS.map((offset) => (slot + offset) % ORBIT.orbitCount);
  if (!active.includes(index)) return null;

  const wave = (elapsedMs % HALO_CYCLE_MS) / HALO_CYCLE_MS;
  return {
    primary: wave,
    echo: (wave + 0.38) % 1,
  };
}

function haloRingStyle(progress: number) {
  const eased = 1 - (1 - progress) ** 1.6;
  return {
    opacity: `${(1 - eased) * 0.62}`,
    transform: `translate3d(-50%, -50%, 0) scale(${1 + eased * 0.48})`,
  } as const;
}
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

function SpeakingGradientOrb({
  scheme,
  agentLabel,
  tagRef,
  haloPrimaryRef,
  haloEchoRef,
}: {
  scheme: OrbScheme;
  agentLabel: string;
  tagRef?: (node: HTMLDivElement | null) => void;
  haloPrimaryRef?: (node: HTMLDivElement | null) => void;
  haloEchoRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div className="hero-speaking-orb" style={orbAccentStyle(scheme)}>
      <div ref={haloPrimaryRef} className="hero-speaking-orb__halo-ring" aria-hidden />
      <div
        ref={haloEchoRef}
        className="hero-speaking-orb__halo-ring hero-speaking-orb__halo-ring--echo"
        aria-hidden
      />
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
        className={`hero-speaking-orb__tag hero-speaking-orb__tag--bc ${suisseIntl.className}`}
        aria-hidden
      >
        <span className="hero-speaking-orb__tag-text">{agentLabel}</span>
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
  const haloPrimaryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloEchoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagStatesRef = useRef<OrbTagState[]>(
    Array.from({ length: ORBIT.orbitCount }, () => createTagState()),
  );
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(initialZDepths);
  const lastFrontIndexRef = useRef(-1);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyLayout = (phase: number, elapsedMs: number) => {
      const layout = buildOrbLayout(phase, zDepthsRef.current);
      const frontIndex = frontOrbIndex(layout);

      if (frontIndex !== lastFrontIndexRef.current && lastFrontIndexRef.current >= 0) {
        const previous = lastFrontIndexRef.current;
        const previousState = tagStatesRef.current[previous];
        if (
          previousState.phase === "entering" ||
          previousState.phase === "holding" ||
          previousState.phase === "leaving"
        ) {
          tagStatesRef.current[previous] = { phase: "done", phaseStartMs: elapsedMs };
        }
      }
      lastFrontIndexRef.current = frontIndex;

      if (frontIndex >= 0) {
        const current = tagStatesRef.current[frontIndex];
        tagStatesRef.current[frontIndex] = advanceTagState(
          current,
          layout[frontIndex].depth,
          elapsedMs,
        );
      }

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
        if (tag) {
          const isFront = index === frontIndex;
          const tagOpacity = isFront ? tagOpacityFromState(tagStatesRef.current[index], elapsedMs) : 0;
          const visible = isFront && tagOpacity > 0.01;

          tag.style.opacity = `${tagOpacity}`;
          tag.style.visibility = visible ? "visible" : "hidden";
          tag.style.transform = visible
            ? `translateX(-50%) translateY(${(1 - tagOpacity) * 5}px) scale(${0.94 + tagOpacity * 0.06})`
            : "translateX(-50%) translateY(8px) scale(0.94)";
        }

        const haloWaves = haloWavesForOrb(index, elapsedMs);
        const haloPrimary = haloPrimaryRefs.current[index];
        const haloEcho = haloEchoRefs.current[index];

        if (haloPrimary && haloEcho) {
          if (haloWaves) {
            const primaryStyle = haloRingStyle(haloWaves.primary);
            const echoStyle = haloRingStyle(haloWaves.echo);
            haloPrimary.style.opacity = primaryStyle.opacity;
            haloPrimary.style.transform = primaryStyle.transform;
            haloEcho.style.opacity = echoStyle.opacity;
            haloEcho.style.transform = echoStyle.transform;
          } else {
            haloPrimary.style.opacity = "0";
            haloEcho.style.opacity = "0";
          }
        }
      });
    };

    if (media.matches) {
      applyLayout(0, 0);
      const frontIndex = frontOrbIndex(initialLayoutRef.current);
      tagRefs.current.forEach((tag, index) => {
        if (!tag) return;
        const isFront = index === frontIndex;
        tag.style.opacity = isFront ? "1" : "0";
        tag.style.visibility = isFront ? "visible" : "hidden";
        tag.style.transform = isFront
          ? "translateX(-50%) translateY(0) scale(1)"
          : "translateX(-50%) translateY(8px) scale(0.94)";
      });
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
              agentLabel={ORB_AGENT_LABELS[index]}
              tagRef={(node) => {
                tagRefs.current[index] = node;
              }}
              haloPrimaryRef={(node) => {
                haloPrimaryRefs.current[index] = node;
              }}
              haloEchoRef={(node) => {
                haloEchoRefs.current[index] = node;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
