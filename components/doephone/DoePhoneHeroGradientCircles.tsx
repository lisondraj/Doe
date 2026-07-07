"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useEffect, useRef, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { DOE_HOME_ORANGE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

const TAG_DEPTH_ENTER = 0.62;
const TAG_DEPTH_RESET = 0.15;
const TAG_FADE_MS = 420;

type TagCorner = "tl" | "tr" | "bl" | "br";

const TAG_CORNERS_ALL: TagCorner[] = ["tl", "tr", "bl", "br"];

const PULSE_SLOT_MS = 2500;
const PULSE_ACTIVE_FRACTION = 0.52;
const PULSE_PAIR_COUNT = 2;
const HALO_ECHO_LAG = 0.2;
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

/** Orb palettes — cohesive orange / gold / yellow family (no muddy browns). */
const HERO_SPEAKING_ORB_SCHEMES = {
  champagne: {
    colors: ["#9A8020", "#F2E090", "#FFF8E0"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  gold: {
    colors: ["#907018", DOE_HOME_ORANGE_PALETTE.gold, "#F8E8B0"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  honey: {
    colors: ["#987018", "#F0C848", "#FCEAB8"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  saffron: {
    colors: ["#986018", "#E8B038", "#F8D888"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  apricot: {
    colors: ["#985028", "#E89858", "#F8D0A8"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  orange: {
    colors: ["#904028", DOE_HOME_ORANGE_PALETTE.orange, "#F4B890"] as const,
    colorBack: DOE_HOME_ORANGE_PALETTE.back,
  },
  peach: {
    colors: ["#985838", "#E8A078", "#F8D0B8"] as const,
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

/** Orbit order — warm spectrum with yellow/orange alternation for neighbor contrast. */
const SCHEME_ORDER = [
  HERO_SPEAKING_ORB_SCHEMES.champagne,
  HERO_SPEAKING_ORB_SCHEMES.orange,
  HERO_SPEAKING_ORB_SCHEMES.honey,
  HERO_SPEAKING_ORB_SCHEMES.peach,
  HERO_SPEAKING_ORB_SCHEMES.gold,
  HERO_SPEAKING_ORB_SCHEMES.apricot,
  HERO_SPEAKING_ORB_SCHEMES.saffron,
] as const;

/**
 * Vertical path along the right edge — orbs rise from bottom-left (front /
 * highlight) to upper-right (half off the phone edge) and back down.
 */
const ORBIT = {
  orbitCount: SCHEME_ORDER.length,
  /** Bottom-left highlight — largest orb, pill anchor. */
  leftX: -24,
  yBottom: 34,
  /** Upper-right — ~half the orb spills past the phone edge. */
  rightX: 44,
  yTop: -32,
} as const;

/** Single shared size — apparent size is depth-driven scale only. */
const ORB_BASE_SIZE = "clamp(13.75rem, 40vmin, 18.25rem)";
const ORBIT_MIN_SCALE = 0.56;
const ORBIT_MAX_SCALE = 1;

/** One full lap — time between an orb's consecutive passes through center. */
const ORBIT_REVOLUTION_MS = 36000;

/** Z-order tracks a lagged depth so front/back swaps ease in, not pop. */
const Z_DEPTH_LERP = 0.045;

/** Bunch orbs closer at the far/back end of the vertical path (upper-right). */
const ORBIT_BACK_BUNCH = 0.34;

const ORBIT_WARP_SCALE = ORBIT_BACK_BUNCH / (Math.PI * 2);
const ORBIT_COUNT = ORBIT.orbitCount;

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

/** Quintic smootherstep — gentler scale/opacity at orbit extremes. */
function easeDepth(depth: number) {
  return depth * depth * depth * (depth * (depth * 6 - 15) + 10);
}

function orbitPoint(index: number, count: number, phase: number, target?: OrbPose): OrbPose {
  const fraction = index / count + phase;
  const warped = fraction + ORBIT_WARP_SCALE * Math.sin(fraction * Math.PI * 2);
  const t = Math.PI / 2 + warped * Math.PI * 2;

  const depth = (Math.sin(t) + 1) / 2;
  const eased = easeDepth(depth);

  const xPct = ORBIT.leftX + (ORBIT.rightX - ORBIT.leftX) * (1 - depth);
  const yPct = ORBIT.yTop + (ORBIT.yBottom - ORBIT.yTop) * depth;
  const scale = ORBIT_MIN_SCALE + eased * (ORBIT_MAX_SCALE - ORBIT_MIN_SCALE);
  const opacity = 0.72 + eased * 0.28;

  if (target) {
    target.xPct = xPct;
    target.yPct = yPct;
    target.depth = depth;
    target.scale = scale;
    target.opacity = opacity;
    return target;
  }

  return { xPct, yPct, depth, scale, opacity, zIndex: 10 };
}

function buildOrbLayout(phase: number, zDepths: number[], zOrder: number[], poses: OrbPose[]) {
  for (let index = 0; index < ORBIT_COUNT; index += 1) {
    orbitPoint(index, ORBIT_COUNT, phase, poses[index]);
  }

  for (let index = 0; index < ORBIT_COUNT; index += 1) {
    zDepths[index] += (poses[index].depth - zDepths[index]) * Z_DEPTH_LERP;
  }

  for (let index = 0; index < ORBIT_COUNT; index += 1) {
    zOrder[index] = index;
  }
  zOrder.sort((a, b) => zDepths[a] - zDepths[b] || a - b);

  for (let rank = 0; rank < ORBIT_COUNT; rank += 1) {
    poses[zOrder[rank]].zIndex = 10 + rank * 2;
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

type HaloDomCache = {
  primaryOpacity: string;
  primaryTransform: string;
  echoOpacity: string;
  echoTransform: string;
  active: boolean;
};

type TagDomCache = {
  opacity: number;
  transform: string;
  nudgeDx: number;
  nudgeDy: number;
  nudgeValid: boolean;
};

function orbNodeStyle(orb: OrbPose) {
  const xPct = Math.round(orb.xPct * 100) / 100;
  const yPct = Math.round(orb.yPct * 100) / 100;
  const scale = Math.round(orb.scale * 1000) / 1000;
  const opacity = Math.round(orb.opacity * 1000) / 1000;
  return {
    left: `calc(50% + ${xPct}%)`,
    top: `calc(50% + ${yPct}%)`,
    transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
    opacity,
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


function focusOrbIndex(layout: OrbPose[]) {
  let focus = 0;
  for (let i = 1; i < layout.length; i += 1) {
    if (layout[i].depth > layout[focus].depth) focus = i;
  }
  return focus;
}

type PillPhase = "idle" | "entering" | "holding" | "leaving";

type PillController = {
  activeOrbIndex: number;
  phase: PillPhase;
  phaseStartMs: number;
  orbCooldown: boolean[];
  activeCorner: TagCorner | null;
  lastCorner: TagCorner | null;
  sessionId: number;
};

function createPillController(): PillController {
  return {
    activeOrbIndex: -1,
    phase: "idle",
    phaseStartMs: 0,
    orbCooldown: Array.from({ length: ORBIT.orbitCount }, () => false),
    activeCorner: null,
    lastCorner: null,
    sessionId: 0,
  };
}

function nextTagCorner(last: TagCorner | null, orbIndex: number): TagCorner {
  const start = orbIndex % TAG_CORNERS_ALL.length;
  for (let i = 0; i < TAG_CORNERS_ALL.length; i += 1) {
    const corner = TAG_CORNERS_ALL[(start + i) % TAG_CORNERS_ALL.length];
    if (corner !== last) return corner;
  }
  return TAG_CORNERS_ALL[(start + 1) % TAG_CORNERS_ALL.length];
}

function pillOpacityForPhase(phase: PillPhase, phaseElapsedMs: number) {
  if (phase === "idle") return 0;
  const fadeT = Math.min(1, phaseElapsedMs / TAG_FADE_MS);
  if (phase === "entering") return fadeT;
  if (phase === "holding") return 1;
  return 1 - fadeT;
}

/** Pill tracks the bottom-left front orb (highest instantaneous path depth). */
function updatePillController(
  ctrl: PillController,
  layout: OrbPose[],
  elapsedMs: number,
) {
  const focusIndex = focusOrbIndex(layout);

  for (let i = 0; i < ORBIT.orbitCount; i += 1) {
    if (ctrl.orbCooldown[i] && layout[i].depth < TAG_DEPTH_RESET) {
      ctrl.orbCooldown[i] = false;
    }
  }

  const finishActive = () => {
    if (ctrl.activeOrbIndex >= 0) {
      ctrl.orbCooldown[ctrl.activeOrbIndex] = true;
      if (ctrl.activeCorner) {
        ctrl.lastCorner = ctrl.activeCorner;
      }
    }
    ctrl.activeOrbIndex = -1;
    ctrl.phase = "idle";
    ctrl.activeCorner = null;
  };

  const startForFocus = (orbIndex: number) => {
    ctrl.activeOrbIndex = orbIndex;
    ctrl.phase = "entering";
    ctrl.phaseStartMs = elapsedMs;
    ctrl.activeCorner = nextTagCorner(ctrl.lastCorner, orbIndex);
    ctrl.sessionId += 1;
  };

  if (ctrl.activeOrbIndex >= 0) {
    const active = ctrl.activeOrbIndex;
    const phaseElapsed = elapsedMs - ctrl.phaseStartMs;
    const stillFocus = focusIndex === active;

    if (stillFocus) {
      if (ctrl.phase === "entering" && phaseElapsed >= TAG_FADE_MS) {
        ctrl.phase = "holding";
        ctrl.phaseStartMs = elapsedMs;
      }
    } else if (ctrl.phase === "entering" || ctrl.phase === "holding") {
      ctrl.phase = "leaving";
      ctrl.phaseStartMs = elapsedMs;
    } else if (ctrl.phase === "leaving" && phaseElapsed >= TAG_FADE_MS) {
      finishActive();
    }
  }

  if (ctrl.activeOrbIndex < 0 && !ctrl.orbCooldown[focusIndex]) {
    const focusDepth = layout[focusIndex].depth;
    if (focusDepth >= TAG_DEPTH_ENTER) {
      startForFocus(focusIndex);
    }
  }

  const showIndex = ctrl.activeOrbIndex;
  const phaseElapsed = showIndex >= 0 ? elapsedMs - ctrl.phaseStartMs : 0;
  const showPill =
    showIndex >= 0 &&
    (ctrl.phase === "leaving" ||
      (focusIndex === showIndex && (ctrl.phase === "entering" || ctrl.phase === "holding")));
  const opacity = showPill ? pillOpacityForPhase(ctrl.phase, phaseElapsed) : 0;

  return {
    showIndex,
    opacity,
    label: showIndex >= 0 ? ORB_AGENT_LABELS[showIndex] : "",
    corner: ctrl.activeCorner,
    sessionId: ctrl.sessionId,
  };
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

/** Flip corner near viewport edges, still avoiding a repeat of the last corner when possible. */
function pickTagCorner(preferred: TagCorner, anchorRect: DOMRect, avoid: TagCorner | null = null) {
  let corner = preferred;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

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

  if (avoid && corner === avoid) {
    const fallback = TAG_CORNERS_ALL.find((candidate) => candidate !== avoid);
    if (fallback) corner = fallback;
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

function initVisibleTagLayout(
  tag: HTMLDivElement,
  node: HTMLDivElement,
  preferredCorner: TagCorner,
  label: string,
  avoidCorner: TagCorner | null,
  tagText?: HTMLSpanElement | null,
): TagCorner {
  const corner = pickTagCorner(preferredCorner, node.getBoundingClientRect(), avoidCorner);
  applyTagCornerClass(tag, corner);

  if (tagText) tagText.textContent = label;

  tag.style.visibility = "visible";
  return corner;
}

function updateVisibleTagFrame(
  tag: HTMLDivElement,
  corner: TagCorner,
  tagOpacity: number,
  remeasureNudge: boolean,
  cache: TagDomCache,
) {
  const roundedOpacity = Math.round(tagOpacity * 100) / 100;
  const baseTransform = tagMotionTransform(corner, tagOpacity, true);

  if (remeasureNudge || !cache.nudgeValid) {
    tag.style.transform = baseTransform;
    const nudge = viewportNudge(tag.getBoundingClientRect());
    cache.nudgeDx = nudge.dx;
    cache.nudgeDy = nudge.dy;
    cache.nudgeValid = true;
  }

  const transform =
    cache.nudgeDx === 0 && cache.nudgeDy === 0
      ? baseTransform
      : tagTransformWithNudge(corner, tagOpacity, true, {
          dx: cache.nudgeDx,
          dy: cache.nudgeDy,
        });

  if (cache.opacity !== roundedOpacity) {
    tag.style.opacity = `${roundedOpacity}`;
    cache.opacity = roundedOpacity;
  }
  if (cache.transform !== transform) {
    tag.style.transform = transform;
    cache.transform = transform;
  }
}

function applyHaloDom(
  primary: HTMLDivElement,
  echo: HTMLDivElement,
  waves: { primary: number; echo: number } | null,
  cache: HaloDomCache,
) {
  if (!waves) {
    if (!cache.active) return;
    primary.style.opacity = "0";
    echo.style.opacity = "0";
    cache.active = false;
    return;
  }

  const primaryStyle = haloRingStyle(waves.primary);
  const echoStyle = haloRingStyle(waves.echo);
  cache.active = true;

  if (cache.primaryOpacity !== primaryStyle.opacity) {
    primary.style.opacity = primaryStyle.opacity;
    cache.primaryOpacity = primaryStyle.opacity;
  }
  if (cache.primaryTransform !== primaryStyle.transform) {
    primary.style.transform = primaryStyle.transform;
    cache.primaryTransform = primaryStyle.transform;
  }
  if (cache.echoOpacity !== echoStyle.opacity) {
    echo.style.opacity = echoStyle.opacity;
    cache.echoOpacity = echoStyle.opacity;
  }
  if (cache.echoTransform !== echoStyle.transform) {
    echo.style.transform = echoStyle.transform;
    cache.echoTransform = echoStyle.transform;
  }
}

function isOrbitNeighbor(a: number, b: number, count: number) {
  const diff = Math.abs(a - b);
  return diff === 1 || diff === count - 1;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Two random pulsing orbs per slot — never orbit neighbors, never the pill orb. */
function pulseIndicesForSlot(
  slotIndex: number,
  count: number,
  excludeIndices: number[],
) {
  const exclude = new Set(excludeIndices);
  const pool: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (!exclude.has(i)) pool.push(i);
  }

  const rand = mulberry32(slotIndex * 9973 + count * 31 + 17);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked: number[] = [];
  for (const orb of pool) {
    if (picked.length >= PULSE_PAIR_COUNT) break;
    if (picked.every((other) => !isOrbitNeighbor(other, orb, count))) {
      picked.push(orb);
    }
  }

  return picked;
}

function pulsePhase(elapsedMs: number) {
  const slotElapsed = elapsedMs % PULSE_SLOT_MS;
  const activeMs = PULSE_SLOT_MS * PULSE_ACTIVE_FRACTION;
  if (slotElapsed > activeMs) return null;
  return slotElapsed / activeMs;
}

function haloWavesForOrb(index: number, pulseSet: ReadonlySet<number>, sharedPhase: number | null) {
  if (!pulseSet.has(index) || sharedPhase === null) return null;

  return {
    primary: sharedPhase,
    echo: Math.max(0, sharedPhase - HALO_ECHO_LAG),
  };
}

function haloRingStyle(progress: number) {
  const eased = 1 - (1 - progress) ** 1.8;
  const opacity = Math.round((1 - eased) * 0.48 * 1000) / 1000;
  const scale = Math.round((1 + eased * 0.34) * 10000) / 10000;
  return {
    opacity: `${opacity}`,
    transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
  } as const;
}

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  tagRef,
  tagTextRef,
  haloPrimaryRef,
  haloEchoRef,
}: {
  scheme: OrbScheme;
  tagRef?: (node: HTMLDivElement | null) => void;
  tagTextRef?: (node: HTMLSpanElement | null) => void;
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
        className={`hero-speaking-orb__tag ${suisseIntl.className}`}
        aria-hidden
      >
        <span ref={tagTextRef} className="hero-speaking-orb__tag-text">{ORB_AGENT_LABELS[0]}</span>
      </div>
    </div>
  );
});

/** Hero — orbs travel a vertical path along the right edge; each passes
 *  through the bottom-left highlight spot where the pill attaches. */
export function DoePhoneHeroGradientCircles() {
  const initialZDepths = Array.from({ length: ORBIT_COUNT }, (_, index) =>
    orbitPoint(index, ORBIT_COUNT, 0).depth,
  );
  const layoutRef = useRef<OrbPose[]>(
    Array.from({ length: ORBIT_COUNT }, () => ({
      xPct: 0,
      yPct: 0,
      depth: 0,
      scale: 1,
      opacity: 1,
      zIndex: 10,
    })),
  );
  const initialLayoutRef = useRef(buildOrbLayout(0, [...initialZDepths], Array.from({ length: ORBIT_COUNT }, (_, i) => i), layoutRef.current));
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
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
  const haloCacheRef = useRef<HaloDomCache[]>(
    Array.from({ length: ORBIT_COUNT }, () => ({
      primaryOpacity: "",
      primaryTransform: "",
      echoOpacity: "",
      echoTransform: "",
      active: false,
    })),
  );
  const tagCacheRef = useRef<TagDomCache[]>(
    Array.from({ length: ORBIT_COUNT }, () => ({
      opacity: Number.NaN,
      transform: "",
      nudgeDx: 0,
      nudgeDy: 0,
      nudgeValid: false,
    })),
  );
  const pulseCacheRef = useRef({ slot: -1, exclude: -1, set: new Set<number>() });
  const zOrderRef = useRef(Array.from({ length: ORBIT_COUNT }, (_, index) => index));
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const zDepthsRef = useRef<number[]>(initialZDepths);
  const pillCtrlRef = useRef<PillController>(createPillController());
  const tagSessionRef = useRef(-1);
  const tabVisibleRef = useRef(true);
  const tagRefFns = useRef(
    Array.from({ length: ORBIT_COUNT }, (_, index) => (node: HTMLDivElement | null) => {
      tagRefs.current[index] = node;
    }),
  ).current;
  const tagTextRefFns = useRef(
    Array.from({ length: ORBIT_COUNT }, (_, index) => (node: HTMLSpanElement | null) => {
      tagTextRefs.current[index] = node;
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
      const layout = buildOrbLayout(phase, zDepthsRef.current, zOrderRef.current, layoutRef.current);
      const pill = updatePillController(pillCtrlRef.current, layout, elapsedMs);
      const frontTagVisible = pill.opacity > 0.01;
      const currentLabel = pill.label;
      const pulseExcludeIndex = pill.showIndex;
      const pulseSlot = Math.floor(elapsedMs / PULSE_SLOT_MS);
      const pulseCache = pulseCacheRef.current;
      if (pulseCache.slot !== pulseSlot || pulseCache.exclude !== pulseExcludeIndex) {
        pulseCache.slot = pulseSlot;
        pulseCache.exclude = pulseExcludeIndex;
        const excludeIndices = pulseExcludeIndex >= 0 ? [pulseExcludeIndex] : [];
        pulseCache.set = new Set(pulseIndicesForSlot(pulseSlot, ORBIT_COUNT, excludeIndices));
      }
      const pulseSet = pulseCache.set;
      const sharedPulsePhase = pulsePhase(elapsedMs);
      const pillShowIndex = pill.showIndex;

      for (let index = 0; index < ORBIT_COUNT; index += 1) {
        const node = nodeRefs.current[index];
        if (!node) continue;
        const target = layout[index];
        const nodeCache = nodeCacheRef.current[index];
        const style = orbNodeStyle(target);
        const nodeMoved = nodeCache.transform !== style.transform;
        applyOrbNodeStyle(node, style, nodeCache);

        if (index === pillShowIndex) {
          const tag = tagRefs.current[index];
          if (tag && frontTagVisible && pill.corner) {
            const tagCache = tagCacheRef.current[index];
            if (tagSessionRef.current !== pill.sessionId) {
              const corner = initVisibleTagLayout(
                tag,
                node,
                pill.corner,
                currentLabel,
                pillCtrlRef.current.lastCorner,
                tagTextRefs.current[index],
              );
              pillCtrlRef.current.activeCorner = corner;
              tagSessionRef.current = pill.sessionId;
              tagCache.nudgeValid = false;
            }
            updateVisibleTagFrame(
              tag,
              pillCtrlRef.current.activeCorner ?? pill.corner,
              pill.opacity,
              nodeMoved,
              tagCache,
            );
          } else if (tag && tag.style.visibility !== "hidden") {
            if (tagSessionRef.current === pill.sessionId) {
              tagSessionRef.current = -1;
            }
            tagCacheRef.current[index].nudgeValid = false;
            tag.style.opacity = "0";
            tag.style.visibility = "hidden";
            const restCorner = pillCtrlRef.current.lastCorner ?? "tl";
            tag.style.transform = tagRestTransform(restCorner);
          }
        } else {
          const tag = tagRefs.current[index];
          if (tag && tag.style.visibility !== "hidden") {
            tagCacheRef.current[index].nudgeValid = false;
            tag.style.opacity = "0";
            tag.style.visibility = "hidden";
            const restCorner = pillCtrlRef.current.lastCorner ?? "tl";
            tag.style.transform = tagRestTransform(restCorner);
          }
        }

        const haloPrimary = haloPrimaryRefs.current[index];
        const haloEcho = haloEchoRefs.current[index];
        if (!haloPrimary || !haloEcho) continue;

        const haloCache = haloCacheRef.current[index];
        if (pulseSet.has(index)) {
          applyHaloDom(
            haloPrimary,
            haloEcho,
            haloWavesForOrb(index, pulseSet, sharedPulsePhase),
            haloCache,
          );
        } else if (haloCache.active) {
          applyHaloDom(haloPrimary, haloEcho, null, haloCache);
        }
      }
    };

    if (media.matches) {
      applyLayout(0, 0);
      const focusIndex = focusOrbIndex(initialLayoutRef.current);
      tagRefs.current.forEach((tag, index) => {
        if (!tag) return;
        const node = nodeRefs.current[index];
        const isFocus = index === focusIndex;
        const depth = initialLayoutRef.current[index]?.depth ?? 0;
        if (isFocus && node && depth >= TAG_DEPTH_ENTER) {
          const corner = initVisibleTagLayout(
            tag,
            node,
            nextTagCorner(pillCtrlRef.current.lastCorner, index),
            ORB_AGENT_LABELS[index],
            pillCtrlRef.current.lastCorner,
            tagTextRefs.current[index],
          );
          pillCtrlRef.current.activeCorner = corner;
          tagCacheRef.current[index].nudgeValid = false;
          updateVisibleTagFrame(tag, corner, 1, true, tagCacheRef.current[index]);
        } else {
          tag.style.opacity = "0";
          tag.style.visibility = "hidden";
          const restCorner = pillCtrlRef.current.lastCorner ?? "tl";
          tag.style.transform = tagRestTransform(restCorner);
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
              tagRef={tagRefFns[index]}
              tagTextRef={tagTextRefFns[index]}
              haloPrimaryRef={haloPrimaryRefFns[index]}
              haloEchoRef={haloEchoRefFns[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
