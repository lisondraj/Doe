"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useEffect, useRef, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { DOE_HOME_ORANGE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

const TAG_DEPTH_ENTER = 0.66;
const TAG_LOOP_MS = 3800;
const TAG_FADE_IN = 0.14;
const TAG_HOLD = 0.58;
const TAG_FADE_OUT = 0.28;

type TagCorner = "tl" | "tr" | "bl" | "br";

const ORB_TAG_CORNERS: TagCorner[] = ["tl", "tr", "bl", "br", "tl", "tr", "bl"];

const PULSE_SLOT_MS = 2600;
const PULSE_MAX_BOOST = 0.07;
const PULSE_SECONDARY_ORBIT_STEP = 3;

const HALO_CYCLE_MS = 3000;
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

/** Orb palettes — warm hero family (gold / orange / copper / rose / tan) on ink back. */
const HERO_SPEAKING_ORB_SCHEMES = {
  gold: {
    colors: ["#9A7420", DOE_HOME_ORANGE_PALETTE.gold, "#F8E4B0"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  orange: {
    colors: ["#984E30", DOE_HOME_ORANGE_PALETTE.orange, "#F0C0A0"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  copper: {
    colors: ["#946A28", DOE_HOME_ORANGE_PALETTE.copper, "#EDD4A8"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  rose: {
    colors: ["#884838", DOE_HOME_ORANGE_PALETTE.rose, "#E8C0B0"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  tan: {
    colors: ["#805038", DOE_HOME_ORANGE_PALETTE.tan, "#DCC8B4"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  honey: {
    colors: ["#A07828", "#E0B050", "#F5E0B8"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  ember: {
    colors: ["#903820", "#C86848", "#E8A898"] as const,
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
  HERO_SPEAKING_ORB_SCHEMES.gold,
  HERO_SPEAKING_ORB_SCHEMES.orange,
  HERO_SPEAKING_ORB_SCHEMES.copper,
  HERO_SPEAKING_ORB_SCHEMES.rose,
  HERO_SPEAKING_ORB_SCHEMES.tan,
  HERO_SPEAKING_ORB_SCHEMES.honey,
  HERO_SPEAKING_ORB_SCHEMES.ember,
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

function buildOrbLayout(phase: number, zDepths: number[], zOrder: number[]): OrbPose[] {
  const poses = Array.from({ length: ORBIT.orbitCount }, (_, index) =>
    orbitPoint(index, ORBIT.orbitCount, phase),
  );

  for (let index = 0; index < ORBIT.orbitCount; index += 1) {
    zDepths[index] += (poses[index].depth - zDepths[index]) * Z_DEPTH_LERP;
  }

  for (let index = 0; index < ORBIT.orbitCount; index += 1) {
    zOrder[index] = index;
  }
  zOrder.sort((a, b) => zDepths[a] - zDepths[b] || a - b);

  for (let rank = 0; rank < ORBIT.orbitCount; rank += 1) {
    const index = zOrder[rank];
    poses[index].zIndex = 10 + rank * 2;
  }

  return poses;
}

type OrbNodeCache = {
  left: string;
  top: string;
  transform: string;
  opacity: number;
  zIndex: number;
};

function orbNodeStyle(orb: OrbPose, pulseScale = 1) {
  return {
    left: `calc(50% + ${orb.xPct}%)`,
    top: `calc(50% + ${orb.yPct}%)`,
    transform: `translate3d(-50%, -50%, 0) scale(${orb.scale * pulseScale})`,
    opacity: orb.opacity,
    zIndex: orb.zIndex,
  } as const;
}

function applyOrbNodeStyle(
  node: HTMLDivElement,
  style: ReturnType<typeof orbNodeStyle>,
  cache: OrbNodeCache,
) {
  if (
    cache.left !== style.left ||
    cache.top !== style.top ||
    cache.transform !== style.transform ||
    cache.opacity !== style.opacity ||
    cache.zIndex !== style.zIndex
  ) {
    node.style.left = style.left;
    node.style.top = style.top;
    node.style.transform = style.transform;
    node.style.opacity = `${style.opacity}`;
    node.style.zIndex = `${style.zIndex}`;
    cache.left = style.left;
    cache.top = style.top;
    cache.transform = style.transform;
    cache.opacity = style.opacity;
    cache.zIndex = style.zIndex;
  }
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

function tagLoopOpacity(elapsedMs: number) {
  const cycle = (elapsedMs % TAG_LOOP_MS) / TAG_LOOP_MS;

  if (cycle < TAG_FADE_IN) return cycle / TAG_FADE_IN;
  if (cycle < TAG_FADE_IN + TAG_HOLD) return 1;
  const fadeStart = TAG_FADE_IN + TAG_HOLD;
  return Math.max(0, 1 - (cycle - fadeStart) / TAG_FADE_OUT);
}

function tagLabelIndex(elapsedMs: number) {
  return Math.floor(elapsedMs / TAG_LOOP_MS) % ORB_AGENT_LABELS.length;
}

function frontOrbInTagWindow(depth: number) {
  return depth >= TAG_DEPTH_ENTER;
}

function tagMotionTransform(corner: TagCorner, tagOpacity: number, visible: boolean) {
  const scale = visible ? 0.94 + tagOpacity * 0.06 : 0.94;
  const offset = visible ? (1 - tagOpacity) * 5 : 6;

  switch (corner) {
    case "tl":
    case "tr":
      return `translateY(${offset}px) scale(${scale})`;
    case "bl":
    case "br":
      return `translateY(${-offset}px) scale(${scale})`;
  }
}

function tagRestTransform(corner: TagCorner) {
  return tagMotionTransform(corner, 0, false);
}

const VIEWPORT_EDGE_PAD = 14;
const TAG_EDGE_GUARD_PX = 100;

const TAG_CORNER_CLASS: Record<TagCorner, string> = {
  tl: "hero-speaking-orb__tag--tl",
  tr: "hero-speaking-orb__tag--tr",
  bl: "hero-speaking-orb__tag--bl",
  br: "hero-speaking-orb__tag--br",
};

/** Flip corner when the orb sits near a viewport edge so the pill stays on-screen. */
function pickTagCorner(preferred: TagCorner, anchorRect: DOMRect): TagCorner {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let corner = preferred;

  if (anchorRect.left < TAG_EDGE_GUARD_PX && (corner === "tl" || corner === "bl")) {
    corner = corner === "tl" ? "tr" : "br";
  }
  if (anchorRect.right > vw - TAG_EDGE_GUARD_PX && (corner === "tr" || corner === "br")) {
    corner = corner === "tr" ? "tl" : "bl";
  }
  if (anchorRect.top < TAG_EDGE_GUARD_PX && (corner === "tl" || corner === "tr")) {
    corner = corner === "tl" ? "bl" : "br";
  }
  if (anchorRect.bottom > vh - TAG_EDGE_GUARD_PX && (corner === "bl" || corner === "br")) {
    corner = corner === "bl" ? "tl" : "tr";
  }

  return corner;
}

function viewportNudge(rect: DOMRect) {
  let dx = 0;
  let dy = 0;
  const maxX = window.innerWidth - VIEWPORT_EDGE_PAD;
  const minX = VIEWPORT_EDGE_PAD;
  const maxY = window.innerHeight - VIEWPORT_EDGE_PAD;
  const minY = VIEWPORT_EDGE_PAD;

  if (rect.left < minX) dx = minX - rect.left;
  else if (rect.right > maxX) dx = maxX - rect.right;

  if (rect.top < minY) dy = minY - rect.top;
  else if (rect.bottom > maxY) dy = maxY - rect.bottom;

  return { dx, dy };
}

function tagTransformWithNudge(
  corner: TagCorner,
  tagOpacity: number,
  visible: boolean,
  nudge: { dx: number; dy: number },
) {
  const base = tagMotionTransform(corner, tagOpacity, visible);
  if (!visible || (nudge.dx === 0 && nudge.dy === 0)) return base;
  return `${base} translate(${nudge.dx}px, ${nudge.dy}px)`;
}

function applyTagCornerClass(tag: HTMLDivElement, corner: TagCorner) {
  if (tag.dataset.cornerApplied === corner) return;
  tag.classList.remove(
    "hero-speaking-orb__tag--tl",
    "hero-speaking-orb__tag--tr",
    "hero-speaking-orb__tag--bl",
    "hero-speaking-orb__tag--br",
  );
  tag.classList.add(TAG_CORNER_CLASS[corner]);
  tag.dataset.cornerApplied = corner;
}

function applyVisibleTagLayout(
  tag: HTMLDivElement,
  node: HTMLDivElement,
  preferredCorner: TagCorner,
  tagOpacity: number,
  label: string,
) {
  const corner = pickTagCorner(preferredCorner, node.getBoundingClientRect());
  applyTagCornerClass(tag, corner);

  const tagText = tag.querySelector<HTMLSpanElement>(".hero-speaking-orb__tag-text");
  if (tagText) tagText.textContent = label;

  tag.style.visibility = "visible";
  tag.style.opacity = `${tagOpacity}`;
  tag.style.transform = tagMotionTransform(corner, tagOpacity, true);
  const nudge = viewportNudge(tag.getBoundingClientRect());
  tag.style.transform = tagTransformWithNudge(corner, tagOpacity, true, nudge);
}

function isOrbitNeighbor(a: number, b: number, count: number) {
  const diff = Math.abs(a - b);
  return diff === 1 || diff === count - 1;
}

/** Second pulse — same orbit ring, never the orb just before/after the front one. */
function secondaryPulseIndex(frontIndex: number, count: number) {
  const candidate = (frontIndex + PULSE_SECONDARY_ORBIT_STEP) % count;
  if (!isOrbitNeighbor(frontIndex, candidate, count)) return candidate;
  return (frontIndex + PULSE_SECONDARY_ORBIT_STEP + 1) % count;
}

function pulseWave(elapsedMs: number) {
  const phase = (elapsedMs % PULSE_SLOT_MS) / PULSE_SLOT_MS;
  const wave = Math.sin(phase * Math.PI);
  return 1 + PULSE_MAX_BOOST * wave * wave;
}

function shouldPulseOrb(
  index: number,
  frontIndex: number,
  frontTagVisible: boolean,
  secondaryIndex: number,
) {
  if (frontIndex < 0) return false;
  if (index === frontIndex && frontTagVisible) return true;
  return index === secondaryIndex;
}

function haloWavesForOrb(
  index: number,
  elapsedMs: number,
  frontIndex: number,
  frontTagVisible: boolean,
  secondaryIndex: number,
) {
  if (!shouldPulseOrb(index, frontIndex, frontTagVisible, secondaryIndex)) return null;

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
function pulseScaleForOrb(
  index: number,
  elapsedMs: number,
  frontIndex: number,
  frontTagVisible: boolean,
  secondaryIndex: number,
) {
  if (!shouldPulseOrb(index, frontIndex, frontTagVisible, secondaryIndex)) return 1;
  return pulseWave(elapsedMs);
}

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  tagCorner,
  tagRef,
  haloPrimaryRef,
  haloEchoRef,
}: {
  scheme: OrbScheme;
  tagCorner: TagCorner;
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
          colors={[scheme.colors[0], scheme.colors[1], scheme.colors[2]]}
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
        <span className="hero-speaking-orb__tag-text">{ORB_AGENT_LABELS[0]}</span>
      </div>
    </div>
  );
});

/** Hero — every orb travels one shared elliptical path that dips through the
 *  center, so each color takes its turn passing through the big highlight spot. */
export function DoePhoneHeroGradientCircles() {
  const initialZDepths = Array.from({ length: ORBIT.orbitCount }, (_, index) =>
    orbitPoint(index, ORBIT.orbitCount, 0).depth,
  );
  const initialLayoutRef = useRef(buildOrbLayout(0, [...initialZDepths], Array.from({ length: ORBIT.orbitCount }, (_, i) => i)));
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloPrimaryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const haloEchoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeCacheRef = useRef<OrbNodeCache[]>(
    Array.from({ length: ORBIT.orbitCount }, () => ({
      left: "",
      top: "",
      transform: "",
      opacity: Number.NaN,
      zIndex: Number.NaN,
    })),
  );
  const haloActiveRef = useRef<boolean[]>(Array.from({ length: ORBIT.orbitCount }, () => false));
  const zOrderRef = useRef(Array.from({ length: ORBIT.orbitCount }, (_, index) => index));
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(initialZDepths);
  const tabVisibleRef = useRef(true);
  const tagRefFns = useRef(
    Array.from({ length: ORBIT.orbitCount }, (_, index) => (node: HTMLDivElement | null) => {
      tagRefs.current[index] = node;
    }),
  ).current;
  const haloPrimaryRefFns = useRef(
    Array.from({ length: ORBIT.orbitCount }, (_, index) => (node: HTMLDivElement | null) => {
      haloPrimaryRefs.current[index] = node;
    }),
  ).current;
  const haloEchoRefFns = useRef(
    Array.from({ length: ORBIT.orbitCount }, (_, index) => (node: HTMLDivElement | null) => {
      haloEchoRefs.current[index] = node;
    }),
  ).current;
  const nodeRefFns = useRef(
    Array.from({ length: ORBIT.orbitCount }, (_, index) => (node: HTMLDivElement | null) => {
      nodeRefs.current[index] = node;
    }),
  ).current;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyLayout = (phase: number, elapsedMs: number) => {
      const layout = buildOrbLayout(phase, zDepthsRef.current, zOrderRef.current);
      const frontIndex = frontOrbIndex(layout);
      const frontDepth = frontIndex >= 0 ? layout[frontIndex].depth : 0;
      const inTagWindow = frontIndex >= 0 && frontOrbInTagWindow(frontDepth);
      const loopOpacity = tagLoopOpacity(elapsedMs);
      const frontTagOpacity = inTagWindow ? loopOpacity : 0;
      const frontTagVisible = frontTagOpacity > 0.01;
      const currentLabel = ORB_AGENT_LABELS[tagLabelIndex(elapsedMs)];
      const secondaryPulse =
        frontIndex >= 0 ? secondaryPulseIndex(frontIndex, ORBIT.orbitCount) : -1;

      layout.forEach((orb, index) => {
        const node = nodeRefs.current[index];
        if (!node) return;
        const pulseScale = pulseScaleForOrb(
          index,
          elapsedMs,
          frontIndex,
          frontTagVisible,
          secondaryPulse,
        );
        const style = orbNodeStyle(orb, pulseScale);
        applyOrbNodeStyle(node, style, nodeCacheRef.current[index]);

        const tag = tagRefs.current[index];
        if (tag) {
          const isFront = index === frontIndex;
          const tagOpacity = isFront ? frontTagOpacity : 0;
          const visible = isFront && frontTagVisible;

          if (visible && node) {
            applyVisibleTagLayout(tag, node, ORB_TAG_CORNERS[index], tagOpacity, currentLabel);
          } else if (tag.style.visibility !== "hidden") {
            tag.style.opacity = "0";
            tag.style.visibility = "hidden";
            tag.style.transform = tagRestTransform(ORB_TAG_CORNERS[index]);
          }
        }

        const haloWaves = haloWavesForOrb(
          index,
          elapsedMs,
          frontIndex,
          frontTagVisible,
          secondaryPulse,
        );
        const haloPrimary = haloPrimaryRefs.current[index];
        const haloEcho = haloEchoRefs.current[index];
        const haloActive = haloWaves !== null;

        if (haloPrimary && haloEcho) {
          if (haloActive) {
            const primaryStyle = haloRingStyle(haloWaves.primary);
            const echoStyle = haloRingStyle(haloWaves.echo);
            haloPrimary.style.opacity = primaryStyle.opacity;
            haloPrimary.style.transform = primaryStyle.transform;
            haloEcho.style.opacity = echoStyle.opacity;
            haloEcho.style.transform = echoStyle.transform;
            haloActiveRef.current[index] = true;
          } else if (haloActiveRef.current[index]) {
            haloPrimary.style.opacity = "0";
            haloEcho.style.opacity = "0";
            haloActiveRef.current[index] = false;
          }
        }
      });
    };

    if (media.matches) {
      applyLayout(0, 0);
      const frontIndex = frontOrbIndex(initialLayoutRef.current);
      const currentLabel = ORB_AGENT_LABELS[0];
      tagRefs.current.forEach((tag, index) => {
        if (!tag) return;
        const isFront = index === frontIndex;
        const node = nodeRefs.current[index];
        if (isFront && node) {
          applyVisibleTagLayout(tag, node, ORB_TAG_CORNERS[index], 1, currentLabel);
        } else {
          tag.style.opacity = "0";
          tag.style.visibility = "hidden";
          tag.style.transform = tagRestTransform(ORB_TAG_CORNERS[index]);
        }
      });
      return;
    }

    const pausedAtRef = { current: undefined as number | undefined };

    const tick = (now: number) => {
      rafRef.current = undefined;
      if (!tabVisibleRef.current) return;
      if (startRef.current === undefined) startRef.current = now;
      const elapsed = now - startRef.current;
      const phase = (elapsed % ORBIT_REVOLUTION_MS) / ORBIT_REVOLUTION_MS;
      applyLayout(phase, elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      tabVisibleRef.current = visible;

      if (!visible) {
        pausedAtRef.current = performance.now();
        if (rafRef.current !== undefined) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = undefined;
        }
        return;
      }

      if (pausedAtRef.current !== undefined && startRef.current !== undefined) {
        startRef.current += performance.now() - pausedAtRef.current;
        pausedAtRef.current = undefined;
      }

      if (rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    tabVisibleRef.current = document.visibilityState === "visible";
    document.addEventListener("visibilitychange", onVisibility);

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="hero-speaking-orbs" aria-hidden>
      <div className="hero-speaking-orbs__stage">
        {SCHEME_ORDER.map((scheme, index) => (
          <div
            key={`orbit-${index}`}
            ref={nodeRefFns[index]}
            className="hero-speaking-orbs__node"
            style={orbNodeStyle(initialLayoutRef.current[index])}
          >
            <SpeakingGradientOrb
              scheme={scheme}
              tagCorner={ORB_TAG_CORNERS[index]}
              tagRef={tagRefFns[index]}
              haloPrimaryRef={haloPrimaryRefFns[index]}
              haloEchoRef={haloEchoRefFns[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
