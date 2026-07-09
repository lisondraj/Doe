"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  HERO_DIAL_ORB_COUNT,
  HERO_DIAL_ORB_SHADER,
  HERO_DIAL_ORBS,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

const DIAL_STEP = (Math.PI * 2) / HERO_DIAL_ORB_COUNT;
const AUTO_ADVANCE_MS = 5000;

const HERO_DIAL_LAYOUT = {
  mobile: {
    radiusVmin: 47,
    orbSize: "clamp(15rem, 48vmin, 21rem)",
  },
  desktop: {
    radiusVmin: 62,
    orbSize: "clamp(19rem, 58vmin, 30rem)",
  },
} as const;
const SWITCH_MS = 920;
const PILL_OUT_MS = 220;

/** Center slot — 9 o'clock on the dial (leftmost, vertically centered). */
const CENTER_SLOT_ANGLE = Math.PI;

type DialOrbPose = {
  xPercent: number;
  yPercent: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isFocused: boolean;
};

/** Slight overshoot — dial rolls one notch down then settles. */
function easeDialStep(t: number) {
  const c1 = 1.525;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function orbAccentStyle(scheme: HeroDialOrbScheme, orbSize: string) {
  const [dark, mid, light] = scheme.colors;
  return {
    width: orbSize,
    height: orbSize,
    "--orb-halo-dark": dark,
    "--orb-halo-mid": mid,
    "--orb-halo-light": light,
    "--orb-halo-back": scheme.colorBack,
  } as CSSProperties;
}

function normalizeDialIndex(index: number) {
  return ((index % HERO_DIAL_ORB_COUNT) + HERO_DIAL_ORB_COUNT) % HERO_DIAL_ORB_COUNT;
}

function focusedIndexForRotation(dialRotation: number) {
  return normalizeDialIndex(Math.round(-dialRotation / DIAL_STEP));
}

function angularDistance(a: number, b: number) {
  let diff = Math.abs(a - b) % (Math.PI * 2);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
}

function focusProximity(angle: number) {
  const dist = angularDistance(angle, CENTER_SLOT_ANGLE);
  const t = Math.min(1, dist / (DIAL_STEP * 0.72));
  return 1 - t;
}

function buildDialLayout(
  dialRotation: number,
  visualFocusedIndex: number,
): DialOrbPose[] {
  return HERO_DIAL_ORBS.map((_, index) => {
    const angle = CENTER_SLOT_ANGLE + index * DIAL_STEP + dialRotation;
    const xPercent = Math.cos(angle) * 100;
    const yPercent = Math.sin(angle) * 50;
    const proximity = focusProximity(angle);
    const isFocused = index === visualFocusedIndex;
    const scale = 0.91 + proximity * 0.14;
    const opacity = 0.62 + proximity * 0.38;

    return {
      xPercent,
      yPercent,
      scale,
      opacity,
      zIndex: isFocused ? 20 : 10 + Math.round(proximity * 6),
      isFocused,
    };
  });
}

function dialNodeStyle(pose: DialOrbPose) {
  return {
    transform: `translate3d(calc(${pose.xPercent}% - 50%), calc(${pose.yPercent}% - 50%), 0) scale(${pose.scale})`,
    opacity: pose.opacity,
    zIndex: pose.zIndex,
  } as const;
}

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  isFocused,
  showPill,
  orbSize,
  stepping,
}: {
  scheme: HeroDialOrbScheme;
  isFocused: boolean;
  showPill: boolean;
  orbSize: string;
  stepping: boolean;
}) {
  const intensity = scheme.intensity ?? HERO_DIAL_ORB_SHADER.intensity;

  return (
    <div
      className={`hero-speaking-orb${isFocused ? " hero-speaking-orb--focused" : ""}${
        stepping ? " hero-speaking-orb--stepping" : ""
      }`}
      style={orbAccentStyle(scheme, orbSize)}
    >
      <div
        className="hero-speaking-orb__halo-ring"
        aria-hidden
      />
      <div
        className="hero-speaking-orb__halo-ring hero-speaking-orb__halo-ring--echo"
        aria-hidden
      />
      <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
        <GrainGradient
          width="100%"
          height="100%"
          fit={HERO_DIAL_ORB_SHADER.fit}
          worldWidth={HERO_DIAL_ORB_SHADER.worldWidth}
          worldHeight={HERO_DIAL_ORB_SHADER.worldHeight}
          colors={[scheme.colors[0], scheme.colors[1], scheme.colors[2]]}
          colorBack={scheme.colorBack}
          softness={HERO_DIAL_ORB_SHADER.softness}
          intensity={intensity}
          noise={HERO_DIAL_ORB_SHADER.noise}
          shape={HERO_DIAL_ORB_SHADER.shape}
          speed={HERO_DIAL_ORB_SHADER.speed}
          rotation={HERO_DIAL_ORB_SHADER.rotation}
          offsetX={HERO_DIAL_ORB_SHADER.offsetX}
          offsetY={HERO_DIAL_ORB_SHADER.offsetY}
          scale={HERO_DIAL_ORB_SHADER.scale}
          maxPixelCount={PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full hero-speaking-orb__core-shade"
          aria-hidden
        />
        <div className="hero-speaking-orb__play" aria-hidden>
          <svg className="hero-speaking-orb__play-icon" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="rgba(255, 251, 246, 0.2)" stroke="rgba(255, 251, 246, 0.42)" strokeWidth="1.25" />
            <path
              d="M20.2 16.4v15.2c0 .72.78 1.16 1.4.8l10.2-5.9c.62-.36.62-1.24 0-1.6l-10.2-5.9c-.62-.36-1.4.08-1.4.8z"
              fill="rgba(255, 251, 246, 0.94)"
            />
          </svg>
        </div>
      </div>
      <div
        className={`hero-speaking-orb__tag hero-speaking-orb__tag--left-mid ${suisseIntl.className}${
          showPill ? " hero-speaking-orb__tag--visible" : ""
        }`}
        aria-hidden={!showPill}
      >
        <span className="hero-speaking-orb__tag-text">{scheme.label}</span>
      </div>
    </div>
  );
});

/** Hero — half-circle dial on the right edge; auto-steps down every 5s. */
export function DoePhoneHeroGradientCircles({
  variant = "mobile",
}: {
  variant?: "mobile" | "desktop";
}) {
  const dialLayout = HERO_DIAL_LAYOUT[variant];
  const [dialRotation, setDialRotation] = useState(0);
  const [pillVisible, setPillVisible] = useState(true);
  const [stepping, setStepping] = useState(false);
  const [committedFocusedIndex, setCommittedFocusedIndex] = useState(0);
  const dialRotationRef = useRef(0);
  const switchRafRef = useRef<number | undefined>(undefined);
  const pillTimerRef = useRef<number | undefined>(undefined);
  const switchingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const tabVisibleRef = useRef(true);

  const visualFocusedIndex = stepping ? committedFocusedIndex : focusedIndexForRotation(dialRotation);

  const layout = useMemo(
    () => buildDialLayout(dialRotation, visualFocusedIndex),
    [dialRotation, visualFocusedIndex],
  );
  const focusedLabel = HERO_DIAL_ORBS[visualFocusedIndex]?.label ?? "Agent";

  const animateStep = useCallback((from: number, to: number, onDone: () => void) => {
    if (switchRafRef.current !== undefined) {
      cancelAnimationFrame(switchRafRef.current);
    }

    if (reducedMotionRef.current) {
      dialRotationRef.current = to;
      setDialRotation(to);
      setCommittedFocusedIndex(focusedIndexForRotation(to));
      onDone();
      return;
    }

    setStepping(true);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SWITCH_MS);
      const eased = easeDialStep(t);
      const value = from + (to - from) * eased;
      dialRotationRef.current = value;
      setDialRotation(value);
      if (t < 1) {
        switchRafRef.current = requestAnimationFrame(tick);
      } else {
        switchRafRef.current = undefined;
        setStepping(false);
        setCommittedFocusedIndex(focusedIndexForRotation(to));
        onDone();
      }
    };

    switchRafRef.current = requestAnimationFrame(tick);
  }, []);

  const advanceDial = useCallback(() => {
    if (switchingRef.current || !tabVisibleRef.current) return;
    switchingRef.current = true;
    setPillVisible(false);

    if (pillTimerRef.current !== undefined) {
      window.clearTimeout(pillTimerRef.current);
    }

    pillTimerRef.current = window.setTimeout(() => {
      const from = dialRotationRef.current;
      const to = from - DIAL_STEP;
      animateStep(from, to, () => {
        switchingRef.current = false;
        setPillVisible(true);
      });
    }, reducedMotionRef.current ? 0 : PILL_OUT_MS);
  }, [animateStep]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onVisibility = () => {
      tabVisibleRef.current = document.visibilityState === "visible";
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    const interval = window.setInterval(advanceDial, AUTO_ADVANCE_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
      if (switchRafRef.current !== undefined) cancelAnimationFrame(switchRafRef.current);
      if (pillTimerRef.current !== undefined) window.clearTimeout(pillTimerRef.current);
    };
  }, [advanceDial]);

  return (
    <div
      className={`hero-speaking-orbs${variant === "desktop" ? " hero-speaking-orbs--desktop" : ""}`}
      aria-hidden
    >
      <div className={`hero-speaking-orbs__stage${stepping ? " hero-speaking-orbs__stage--stepping" : ""}`}>
        <div className="hero-speaking-orbs__dial">
          {HERO_DIAL_ORBS.map((scheme, index) => {
            const pose = layout[index];
            const style = dialNodeStyle(pose);
            return (
              <div
                key={scheme.label}
                className="hero-speaking-orbs__node"
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                <SpeakingGradientOrb
                  scheme={scheme}
                  isFocused={pose.isFocused}
                  showPill={pose.isFocused && pillVisible && !stepping}
                  orbSize={dialLayout.orbSize}
                  stepping={stepping}
                />
              </div>
            );
          })}
        </div>
      </div>
      <span className="sr-only">Agent dial — {focusedLabel} selected.</span>
    </div>
  );
}
