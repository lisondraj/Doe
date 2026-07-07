"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import { DOE_HOME_ORANGE_PALETTE } from "@/lib/proto/proto-shader-backdrop-colors";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

const TAG_FADE_MS = 420;

/** One dedicated agent label per orb on the dial. */
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

const SCHEME_ORDER = [
  HERO_SPEAKING_ORB_SCHEMES.champagne,
  HERO_SPEAKING_ORB_SCHEMES.orange,
  HERO_SPEAKING_ORB_SCHEMES.honey,
  HERO_SPEAKING_ORB_SCHEMES.peach,
  HERO_SPEAKING_ORB_SCHEMES.gold,
  HERO_SPEAKING_ORB_SCHEMES.apricot,
  HERO_SPEAKING_ORB_SCHEMES.saffron,
] as const;

const ORB_COUNT = SCHEME_ORDER.length;
const DIAL_STEP = (Math.PI * 2) / ORB_COUNT;
/** Dial radius — left half of this circle is visible; center sits on the right edge. */
const DIAL_RADIUS_VMIN = 46;
const ORB_BASE_SIZE = "clamp(17rem, 52vmin, 24rem)";
const SWIPE_RAD_PER_PX = 0.011;
const SNAP_MS = 260;

/** Center slot — 9 o'clock on the dial (leftmost, vertically centered). */
const CENTER_SLOT_ANGLE = Math.PI;

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

type DialOrbPose = {
  xVmin: number;
  yVmin: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isFocused: boolean;
};

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

function normalizeDialIndex(index: number) {
  return ((index % ORB_COUNT) + ORB_COUNT) % ORB_COUNT;
}

function focusedIndexForRotation(dialRotation: number) {
  return normalizeDialIndex(Math.round(-dialRotation / DIAL_STEP));
}

function snapDialRotation(dialRotation: number) {
  return Math.round(dialRotation / DIAL_STEP) * DIAL_STEP;
}

function angularDistance(a: number, b: number) {
  let diff = Math.abs(a - b) % (Math.PI * 2);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
}

function buildDialLayout(dialRotation: number): DialOrbPose[] {
  const focusedIndex = focusedIndexForRotation(dialRotation);

  return SCHEME_ORDER.map((_, index) => {
    const angle = CENTER_SLOT_ANGLE + index * DIAL_STEP + dialRotation;
    const xVmin = Math.cos(angle) * DIAL_RADIUS_VMIN;
    const yVmin = Math.sin(angle) * DIAL_RADIUS_VMIN;
    const isFocused = index === focusedIndex;
    const dist = angularDistance(angle, CENTER_SLOT_ANGLE);
    const t = Math.min(1, dist / (DIAL_STEP * 0.72));
    const scale = isFocused ? 1 : 0.74 - t * 0.1;
    const opacity = isFocused ? 1 : 0.5 + (1 - t) * 0.18;

    return {
      xVmin,
      yVmin,
      scale,
      opacity,
      zIndex: isFocused ? 20 : 10 + Math.round((1 - t) * 6),
      isFocused,
    };
  });
}

function dialNodeStyle(pose: DialOrbPose) {
  const x = Math.round(pose.xVmin * 100) / 100;
  const y = Math.round(pose.yVmin * 100) / 100;
  const scale = Math.round(pose.scale * 1000) / 1000;
  const opacity = Math.round(pose.opacity * 1000) / 1000;

  return {
    transform: `translate(calc(${x}vmin - 50%), calc(${y}vmin - 50%)) scale(${scale})`,
    opacity,
    zIndex: pose.zIndex,
  } as const;
}

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  label,
  showPill,
}: {
  scheme: OrbScheme;
  label: string;
  showPill: boolean;
}) {
  return (
    <div className="hero-speaking-orb" style={orbAccentStyle(scheme)}>
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
        className={`hero-speaking-orb__tag hero-speaking-orb__tag--left-mid ${suisseIntl.className}${
          showPill ? " hero-speaking-orb__tag--visible" : ""
        }`}
        aria-hidden={!showPill}
      >
        <span className="hero-speaking-orb__tag-text">{label}</span>
      </div>
    </div>
  );
});

/** Hero — static half-circle dial on the right edge; swipe up/down to rotate. */
export function DoePhoneHeroGradientCircles() {
  const [dialRotation, setDialRotation] = useState(0);
  const dialRotationRef = useRef(0);
  const dragRef = useRef<{ active: boolean; startY: number; startRotation: number; pointerId: number } | null>(
    null,
  );
  const snapRafRef = useRef<number | undefined>(undefined);
  const reducedMotionRef = useRef(false);

  const layout = useMemo(() => buildDialLayout(dialRotation), [dialRotation]);
  const focusedIndex = focusedIndexForRotation(dialRotation);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const animateSnap = useCallback((from: number, to: number) => {
    if (snapRafRef.current !== undefined) {
      cancelAnimationFrame(snapRafRef.current);
    }

    if (reducedMotionRef.current || Math.abs(from - to) < 0.0001) {
      dialRotationRef.current = to;
      setDialRotation(to);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SNAP_MS);
      const eased = 1 - (1 - t) ** 3;
      const value = from + (to - from) * eased;
      dialRotationRef.current = value;
      setDialRotation(value);
      if (t < 1) {
        snapRafRef.current = requestAnimationFrame(tick);
      } else {
        snapRafRef.current = undefined;
      }
    };

    snapRafRef.current = requestAnimationFrame(tick);
  }, []);

  const finishDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const snapped = snapDialRotation(dialRotationRef.current);
    animateSnap(dialRotationRef.current, snapped);
  }, [animateSnap]);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return;
    if (snapRafRef.current !== undefined) {
      cancelAnimationFrame(snapRafRef.current);
      snapRafRef.current = undefined;
    }
    dragRef.current = {
      active: true,
      startY: event.clientY,
      startRotation: dialRotationRef.current,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag?.active || drag.pointerId !== event.pointerId) return;
    const deltaY = event.clientY - drag.startY;
    const next = drag.startRotation - deltaY * SWIPE_RAD_PER_PX;
    dialRotationRef.current = next;
    setDialRotation(next);
  }, []);

  const onPointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag?.active || drag.pointerId !== event.pointerId) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      finishDrag();
    },
    [finishDrag],
  );

  useEffect(() => {
    return () => {
      if (snapRafRef.current !== undefined) cancelAnimationFrame(snapRafRef.current);
    };
  }, []);

  return (
    <div className="hero-speaking-orbs" aria-hidden>
      <div
        className="hero-speaking-orbs__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div className="hero-speaking-orbs__dial">
          {SCHEME_ORDER.map((scheme, index) => {
            const pose = layout[index];
            const style = dialNodeStyle(pose);
            return (
              <div
                key={`dial-${index}`}
                className="hero-speaking-orbs__node"
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                <SpeakingGradientOrb
                  scheme={scheme}
                  label={ORB_AGENT_LABELS[index]}
                  showPill={pose.isFocused}
                />
              </div>
            );
          })}
        </div>
      </div>
      <span className="sr-only">Agent dial — {ORB_AGENT_LABELS[focusedIndex]} selected. Swipe up or down to change.</span>
    </div>
  );
}
