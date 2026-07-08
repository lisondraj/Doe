"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { suisseIntl } from "@/lib/home/fonts";
import {
  DOE_HOME_ORANGE_PALETTE,
} from "@/lib/proto/proto-shader-backdrop-colors";
import { PROTO_SHADER_MAX_PIXEL_COUNT_PHONE_HERO } from "@/lib/proto/proto-grain-gradient";

/** One dedicated agent label per orb on the dial. */
const ORB_AGENT_LABELS = [
  "Inbox Agent",
  "Scheduling Agent",
  "Labs Agent",
  "Referrals Agent",
  "Live Appointment",
  "Billing Agent",
  "Refill Agent",
] as const;

const BRAND = DOE_HOME_ORANGE_PALETTE;

/** Orange / orange-gold ladder — vibrant, offset from hero brand stops (circles only). */
const HERO_ORB_SHADE_LADDER = [
  { colors: ["#966018", "#ECA850", "#F2CCA8"] as const, colorBack: BRAND.back },
  { colors: ["#964818", "#DC8038", "#ECB498"] as const, colorBack: BRAND.back },
  { colors: ["#965518", "#DC9860", "#ECBCA8"] as const, colorBack: BRAND.back },
  { colors: ["#965818", "#E4B060", "#F2CC98"] as const, colorBack: BRAND.back },
  { colors: ["#965010", "#EC9048", "#ECBA90"] as const, colorBack: BRAND.back },
  { colors: ["#864810", "#CC8838", "#DEAC80"] as const, colorBack: BRAND.back },
  { colors: ["#963810", "#DC6828", "#E6A878"] as const, colorBack: BRAND.back },
] as const;

type OrbScheme = (typeof HERO_ORB_SHADE_LADDER)[number];

const SCHEME_ORDER = HERO_ORB_SHADE_LADDER;

const ORB_COUNT = SCHEME_ORDER.length;
const DIAL_STEP = (Math.PI * 2) / ORB_COUNT;
const DIAL_RADIUS_VMIN = 47;
const ORB_BASE_SIZE = "clamp(15rem, 48vmin, 21rem)";
const AUTO_ADVANCE_MS = 5000;
const SWITCH_MS = 920;
const PILL_OUT_MS = 220;

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

/** Slight overshoot — dial rolls one notch down then settles. */
function easeDialStep(t: number) {
  const c1 = 1.525;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

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
    const scale = isFocused ? 1.04 : 0.9 - t * 0.05;
    const opacity = isFocused ? 1 : 0.56 + (1 - t) * 0.2;

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
        <span className="hero-speaking-orb__tag-text">{label}</span>
      </div>
    </div>
  );
});

/** Hero — half-circle dial on the right edge; auto-steps down every 10s. */
export function DoePhoneHeroGradientCircles() {
  const [dialRotation, setDialRotation] = useState(0);
  const [pillVisible, setPillVisible] = useState(true);
  const [stepping, setStepping] = useState(false);
  const dialRotationRef = useRef(0);
  const switchRafRef = useRef<number | undefined>(undefined);
  const pillTimerRef = useRef<number | undefined>(undefined);
  const switchingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const tabVisibleRef = useRef(true);

  const layout = useMemo(() => buildDialLayout(dialRotation), [dialRotation]);
  const focusedIndex = focusedIndexForRotation(dialRotation);

  const animateStep = useCallback((from: number, to: number, onDone: () => void) => {
    if (switchRafRef.current !== undefined) {
      cancelAnimationFrame(switchRafRef.current);
    }

    if (reducedMotionRef.current) {
      dialRotationRef.current = to;
      setDialRotation(to);
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
    <div className="hero-speaking-orbs" aria-hidden>
      <div className="hero-speaking-orbs__stage">
        <div className={`hero-speaking-orbs__dial${stepping ? " hero-speaking-orbs__dial--stepping" : ""}`}>
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
                  showPill={pose.isFocused && pillVisible}
                />
              </div>
            );
          })}
        </div>
      </div>
      <span className="sr-only">Agent dial — {ORB_AGENT_LABELS[focusedIndex]} selected.</span>
    </div>
  );
}
