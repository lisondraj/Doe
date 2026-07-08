"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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
const PLAY_DURATION_MS = 30_000;

/** Center slot — 9 o'clock on the dial (leftmost, vertically centered). */
const CENTER_SLOT_ANGLE = Math.PI;

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

function buildDialLayout(dialRotation: number, dialRadiusVmin: number): DialOrbPose[] {
  const focusedIndex = focusedIndexForRotation(dialRotation);

  return HERO_DIAL_ORBS.map((_, index) => {
    const angle = CENTER_SLOT_ANGLE + index * DIAL_STEP + dialRotation;
    const xVmin = Math.cos(angle) * dialRadiusVmin;
    const yVmin = Math.sin(angle) * dialRadiusVmin;
    const isFocused = index === focusedIndex;
    const dist = angularDistance(angle, CENTER_SLOT_ANGLE);
    const t = Math.min(1, dist / (DIAL_STEP * 0.72));
    const scale = isFocused ? 1.05 : 0.91 - t * 0.05;
    const opacity = isFocused ? 1 : 0.62 + (1 - t) * 0.22;

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

const OrbCircularProgress = memo(function OrbCircularProgress({
  durationMs,
}: {
  durationMs: number;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActive(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <svg
      className="hero-speaking-orb__progress-ring"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle
        className="hero-speaking-orb__progress-track"
        cx="50"
        cy="50"
        r="48.5"
        pathLength={1}
      />
      <circle
        className={`hero-speaking-orb__progress-fill${active ? " hero-speaking-orb__progress-fill--active" : ""}`}
        cx="50"
        cy="50"
        r="48.5"
        pathLength={1}
        style={{
          transitionDuration: active ? `${durationMs}ms` : "0ms",
        }}
      />
    </svg>
  );
});

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  isFocused,
  showPill,
  orbSize,
  interactive = false,
  expanded = false,
  showProgress = false,
  onPlayClick,
}: {
  scheme: HeroDialOrbScheme;
  isFocused: boolean;
  showPill: boolean;
  orbSize: string;
  interactive?: boolean;
  expanded?: boolean;
  showProgress?: boolean;
  onPlayClick?: (sourceNode: HTMLElement) => void;
}) {
  const intensity = scheme.intensity ?? HERO_DIAL_ORB_SHADER.intensity;
  const playIcon = (
    <svg className="hero-speaking-orb__play-icon" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" fill="rgba(255, 251, 246, 0.2)" stroke="rgba(255, 251, 246, 0.42)" strokeWidth="1.25" />
      <path
        d="M20.2 16.4v15.2c0 .72.78 1.16 1.4.8l10.2-5.9c.62-.36.62-1.24 0-1.6l-10.2-5.9c-.62-.36-1.4.08-1.4.8z"
        fill="rgba(255, 251, 246, 0.94)"
      />
    </svg>
  );

  return (
    <div
      className={`hero-speaking-orb${isFocused ? " hero-speaking-orb--focused" : ""}${
        expanded ? " hero-speaking-orb--expanded" : ""
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
      <div className="hero-speaking-orb__progress-shell">
        {showProgress ? (
          <OrbCircularProgress durationMs={PLAY_DURATION_MS} />
        ) : null}
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
        {!expanded ? (
          interactive ? (
            <button
              type="button"
              className="hero-speaking-orb__play hero-speaking-orb__play--interactive"
              aria-label={`Play ${scheme.label}`}
              onClick={(event) => {
                const node = event.currentTarget.closest(".hero-speaking-orbs__node");
                if (node instanceof HTMLElement) onPlayClick?.(node);
              }}
            >
              {playIcon}
            </button>
          ) : (
            <div className="hero-speaking-orb__play" aria-hidden>
              {playIcon}
            </div>
          )
        ) : null}
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
  const isMobileInteractive = variant === "mobile";
  const [dialRotation, setDialRotation] = useState(0);
  const [pillVisible, setPillVisible] = useState(true);
  const [stepping, setStepping] = useState(false);
  const [expandedOrbIndex, setExpandedOrbIndex] = useState<number | null>(null);
  const [expandSettled, setExpandSettled] = useState(false);
  const [expandFlip, setExpandFlip] = useState<{
    x: number;
    y: number;
    size: number;
  } | null>(null);
  const dialRotationRef = useRef(0);
  const switchRafRef = useRef<number | undefined>(undefined);
  const pillTimerRef = useRef<number | undefined>(undefined);
  const switchingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const tabVisibleRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const playCloseTimerRef = useRef<number | undefined>(undefined);

  const layout = useMemo(
    () => buildDialLayout(dialRotation, dialLayout.radiusVmin),
    [dialRotation, dialLayout.radiusVmin],
  );
  const focusedIndex = focusedIndexForRotation(dialRotation);
  const focusedLabel = HERO_DIAL_ORBS[focusedIndex]?.label ?? "Agent";
  const expandedScheme =
    expandedOrbIndex === null ? null : HERO_DIAL_ORBS[expandedOrbIndex] ?? null;

  const closeExpanded = useCallback(() => {
    if (playCloseTimerRef.current !== undefined) {
      window.clearTimeout(playCloseTimerRef.current);
      playCloseTimerRef.current = undefined;
    }
    setExpandSettled(false);
    setExpandFlip(null);
    setExpandedOrbIndex(null);
  }, []);

  const openExpanded = useCallback(
    (index: number, sourceNode: HTMLElement) => {
      if (!isMobileInteractive || !rootRef.current) return;

      if (playCloseTimerRef.current !== undefined) {
        window.clearTimeout(playCloseTimerRef.current);
        playCloseTimerRef.current = undefined;
      }

      const sourceRect = sourceNode.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const centerX = sourceRect.left + sourceRect.width / 2 - rootRect.left;
      const centerY = sourceRect.top + sourceRect.height / 2 - rootRect.top;
      const size = Math.max(sourceRect.width, sourceRect.height);

      setExpandedOrbIndex(index);
      setExpandSettled(reducedMotionRef.current);
      setExpandFlip({ x: centerX, y: centerY, size });
    },
    [isMobileInteractive],
  );

  useLayoutEffect(() => {
    if (expandedOrbIndex === null || expandFlip === null || expandSettled) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandSettled(true);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [expandFlip, expandSettled, expandedOrbIndex]);

  useEffect(() => {
    if (expandedOrbIndex === null || !expandSettled) return;

    playCloseTimerRef.current = window.setTimeout(() => {
      closeExpanded();
    }, PLAY_DURATION_MS);

    return () => {
      if (playCloseTimerRef.current !== undefined) {
        window.clearTimeout(playCloseTimerRef.current);
        playCloseTimerRef.current = undefined;
      }
    };
  }, [closeExpanded, expandSettled, expandedOrbIndex]);

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

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (switchRafRef.current !== undefined) cancelAnimationFrame(switchRafRef.current);
      if (pillTimerRef.current !== undefined) window.clearTimeout(pillTimerRef.current);
      if (playCloseTimerRef.current !== undefined) window.clearTimeout(playCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (expandedOrbIndex !== null) return;

    const interval = window.setInterval(advanceDial, AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [advanceDial, expandedOrbIndex]);

  const expandedOrbStyle = useMemo(() => {
    if (!expandFlip) return undefined;

    if (!expandSettled) {
      return {
        left: expandFlip.x,
        top: expandFlip.y,
        width: expandFlip.size,
        height: expandFlip.size,
        transform: "translate(-50%, -50%)",
      } as CSSProperties;
    }

    return {
      left: "50%",
      top: "50%",
      width: "100%",
      height: "auto",
      aspectRatio: "1 / 1",
      maxHeight: "100%",
      transform: "translate(-50%, -50%)",
    } as CSSProperties;
  }, [expandFlip, expandSettled]);

  return (
    <div
      ref={rootRef}
      className={`hero-speaking-orbs${
        variant === "desktop" ? " hero-speaking-orbs--desktop" : ""
      }${isMobileInteractive ? " hero-speaking-orbs--mobile-interactive" : ""}${
        expandedOrbIndex !== null ? " hero-speaking-orbs--expanded" : ""
      }`}
      aria-hidden={expandedOrbIndex === null ? true : undefined}
    >
      <div className="hero-speaking-orbs__stage">
        <div className={`hero-speaking-orbs__dial${stepping ? " hero-speaking-orbs__dial--stepping" : ""}`}>
          {HERO_DIAL_ORBS.map((scheme, index) => {
            const pose = layout[index];
            const style = dialNodeStyle(pose);
            const isExpandedSource = expandedOrbIndex === index;
            return (
              <div
                key={scheme.label}
                className={`hero-speaking-orbs__node${
                  isExpandedSource ? " hero-speaking-orbs__node--expanded-source" : ""
                }`}
                style={{
                  transform: style.transform,
                  opacity: isExpandedSource ? 0 : style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                <SpeakingGradientOrb
                  scheme={scheme}
                  isFocused={pose.isFocused}
                  showPill={pose.isFocused && pillVisible && expandedOrbIndex === null}
                  orbSize={dialLayout.orbSize}
                  interactive={isMobileInteractive && expandedOrbIndex === null}
                  onPlayClick={(sourceNode) => openExpanded(index, sourceNode)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {expandedScheme && expandedOrbIndex !== null ? (
        <div
          className="hero-speaking-orbs__expanded"
          role="dialog"
          aria-label={`${expandedScheme.label} playback`}
        >
          <button
            type="button"
            className="hero-speaking-orbs__expanded-dismiss"
            aria-label="Close playback"
            onClick={closeExpanded}
          />
          <div
            className={`hero-speaking-orbs__expanded-orb${
              expandSettled ? " hero-speaking-orbs__expanded-orb--settled" : ""
            }`}
            style={expandedOrbStyle}
          >
            <SpeakingGradientOrb
              scheme={expandedScheme}
              isFocused
              showPill={false}
              orbSize="100%"
              expanded
              showProgress={expandSettled}
            />
          </div>
        </div>
      ) : null}

      <span className="sr-only">
        {expandedOrbIndex !== null
          ? `${expandedScheme?.label ?? "Agent"} playback open.`
          : `Agent dial — ${focusedLabel} selected.`}
      </span>
    </div>
  );
}
