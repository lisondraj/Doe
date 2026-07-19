"use client";

import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
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

import { inter, suisseIntl } from "@/lib/home/fonts";
import {
  HERO_DIAL_ORB_CAROUSEL_SHADER,
  HERO_DIAL_ORB_COUNT,
  HERO_DIAL_ORBS,
  heroDialOrbCarouselScheme,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";

const DIAL_STEP = (Math.PI * 2) / HERO_DIAL_ORB_COUNT;
const AUTO_ADVANCE_MS = 5000;

const DESKTOP_DIAL_RADIUS_VMIN = 44;
/** Match mobile orb:radius ratio so overlap stays identical when scaled. */
const DESKTOP_ORB_SIZE_VMIN = DESKTOP_DIAL_RADIUS_VMIN * (52 / 51);

const HERO_DIAL_LAYOUT = {
  mobile: {
    radiusVmin: 51,
    orbSize: "clamp(16.25rem, 52vmin, 22.75rem)",
  },
  desktop: {
    /** vmin-locked — keeps overlap + alignment stable as the viewport resizes. */
    radiusVmin: DESKTOP_DIAL_RADIUS_VMIN,
    orbSize: `${DESKTOP_ORB_SIZE_VMIN.toFixed(1)}vmin`,
  },
} as const;
const SWITCH_MS = 1100;
const PLAY_DURATION_MS = 30_000;
const EXPAND_CLOSE_MS = 820;
const EXPANDED_ORB_MARGIN_PX = 44;

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

/** Smooth ease-in-out — continuous dial roll without overshoot. */
function easeDialStep(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
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
    const dist = angularDistance(angle, CENTER_SLOT_ANGLE);
    const t = Math.min(1, dist / (DIAL_STEP * 0.72));
    const focusBlend = Math.max(0, 1 - dist / (DIAL_STEP * 0.55));
    const focusSmooth = focusBlend * focusBlend * (3 - 2 * focusBlend);
    const baseScale = 0.91 - t * 0.05;
    const scale = baseScale + focusSmooth * (1.05 - baseScale);
    const baseOpacity = 0.62 + (1 - t) * 0.22;
    const opacity = baseOpacity + focusSmooth * (1 - baseOpacity);
    const isFocused = index === focusedIndex;

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
  return {
    transform: `translate3d(calc(${pose.xVmin}vmin - 50%), calc(${pose.yVmin}vmin - 50%), 0) scale(${pose.scale})`,
    opacity: pose.opacity,
    zIndex: pose.zIndex,
  } as const;
}

const HeroOrbRingingOverlay = memo(function HeroOrbRingingOverlay() {
  return (
    <div className="hero-speaking-orb__ringing" aria-live="polite">
      <div className="hero-speaking-orb__ringing-waves" aria-hidden>
        <svg className="hero-speaking-orb__ringing-waves-svg" viewBox="0 0 200 80" preserveAspectRatio="xMidYMid meet">
          <g className="hero-speaking-orb__ringing-wave-group hero-speaking-orb__ringing-wave-group--a">
            <path
              className="hero-speaking-orb__ringing-wave"
              d="M0 40 Q25 72 50 40 T100 40 T150 40 T200 40"
            />
          </g>
          <g className="hero-speaking-orb__ringing-wave-group hero-speaking-orb__ringing-wave-group--b">
            <path
              className="hero-speaking-orb__ringing-wave"
              d="M0 40 Q25 8 50 40 T100 40 T150 40 T200 40"
            />
          </g>
        </svg>
      </div>
      <p className={`hero-speaking-orb__ringing-label ${inter.className}`}>Ringing…</p>
    </div>
  );
});

const SpeakingGradientOrb = memo(function SpeakingGradientOrb({
  scheme,
  isFocused,
  showPill,
  orbSize,
  interactive = false,
  expanded = false,
  showRinging = false,
  onPlayClick,
}: {
  scheme: HeroDialOrbScheme;
  isFocused: boolean;
  showPill: boolean;
  orbSize: string;
  interactive?: boolean;
  expanded?: boolean;
  showRinging?: boolean;
  onPlayClick?: (sourceNode: HTMLElement) => void;
}) {
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
        <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
        <HeroDialOrbGrainShader
          scheme={heroDialOrbCarouselScheme(scheme)}
          shaderConfig={HERO_DIAL_ORB_CAROUSEL_SHADER}
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
              aria-label={`Call ${scheme.label}`}
              onClick={(event) => {
                onPlayClick?.(event.currentTarget);
              }}
            />
          ) : null
        ) : showRinging ? (
          <HeroOrbRingingOverlay />
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
  disableInteractions = false,
}: {
  variant?: "mobile" | "desktop";
  disableInteractions?: boolean;
}) {
  const dialLayout = HERO_DIAL_LAYOUT[variant];
  const isMobileInteractive = variant === "mobile" && !disableInteractions;
  const [dialRotation, setDialRotation] = useState(0);
  const [pillVisible, setPillVisible] = useState(true);
  const [expandedOrbIndex, setExpandedOrbIndex] = useState<number | null>(null);
  const [expandSettled, setExpandSettled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [expandFlip, setExpandFlip] = useState<{
    x: number;
    y: number;
    size: number;
    settledSize: number;
  } | null>(null);
  const dialRotationRef = useRef(0);
  const switchRafRef = useRef<number | undefined>(undefined);
  const switchingRef = useRef(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotionRef = useRef(false);
  const tabVisibleRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const playCloseTimerRef = useRef<number | undefined>(undefined);
  const expandCloseTimerRef = useRef<number | undefined>(undefined);

  const layout = useMemo(
    () => buildDialLayout(dialRotation, dialLayout.radiusVmin),
    [dialRotation, dialLayout.radiusVmin],
  );
  const focusedIndex = focusedIndexForRotation(dialRotation);
  const focusedLabel = HERO_DIAL_ORBS[focusedIndex]?.label ?? "Agent";
  const expandedScheme =
    expandedOrbIndex === null ? null : HERO_DIAL_ORBS[expandedOrbIndex] ?? null;

  const applyDialLayoutToDom = useCallback(
    (
      rotation: number,
      options?: {
        expandedOrbIndex?: number | null;
        isClosing?: boolean;
      },
    ) => {
      const expandedIndex = options?.expandedOrbIndex ?? expandedOrbIndex;
      const closing = options?.isClosing ?? isClosing;
      const poses = buildDialLayout(rotation, dialLayout.radiusVmin);

      poses.forEach((pose, index) => {
        const node = nodeRefs.current[index];
        if (!node) return;

        const style = dialNodeStyle(pose);
        const isExpandedSource = expandedIndex === index;
        node.style.transform = style.transform;
        node.style.opacity = String(
          isExpandedSource ? (closing ? style.opacity : 0) : style.opacity,
        );
        node.style.zIndex = String(style.zIndex);
        node.classList.toggle("hero-speaking-orbs__node--focused", pose.isFocused);

        const orb = node.querySelector(".hero-speaking-orb");
        if (orb) {
          orb.classList.toggle("hero-speaking-orb--focused", pose.isFocused);
        }
      });
    },
    [dialLayout.radiusVmin, expandedOrbIndex, isClosing],
  );

  useLayoutEffect(() => {
    if (switchingRef.current) return;
    applyDialLayoutToDom(dialRotation);
  }, [applyDialLayoutToDom, dialRotation]);

  const finishCloseExpanded = useCallback(() => {
    if (expandCloseTimerRef.current !== undefined) {
      window.clearTimeout(expandCloseTimerRef.current);
      expandCloseTimerRef.current = undefined;
    }
    setIsClosing(false);
    setExpandSettled(false);
    setExpandFlip(null);
    setExpandedOrbIndex(null);
  }, []);

  const beginCloseExpanded = useCallback(() => {
    if (expandedOrbIndex === null || isClosing) return;

    if (playCloseTimerRef.current !== undefined) {
      window.clearTimeout(playCloseTimerRef.current);
      playCloseTimerRef.current = undefined;
    }
    if (expandCloseTimerRef.current !== undefined) {
      window.clearTimeout(expandCloseTimerRef.current);
    }

    setIsClosing(true);
    setExpandSettled(false);
    const closeMs = reducedMotionRef.current ? 0 : EXPAND_CLOSE_MS;
    expandCloseTimerRef.current = window.setTimeout(() => {
      finishCloseExpanded();
    }, closeMs);
  }, [expandedOrbIndex, finishCloseExpanded, isClosing]);

  const openExpanded = useCallback(
    (index: number, sourceNode: HTMLElement) => {
      if (!isMobileInteractive || !rootRef.current) return;

      if (playCloseTimerRef.current !== undefined) {
        window.clearTimeout(playCloseTimerRef.current);
        playCloseTimerRef.current = undefined;
      }

      const sourceOrb = sourceNode.closest(".hero-speaking-orb");
      const sourceRect =
        sourceOrb instanceof HTMLElement
          ? sourceOrb.getBoundingClientRect()
          : sourceNode.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const centerX = sourceRect.left + sourceRect.width / 2 - rootRect.left;
      const centerY = sourceRect.top + sourceRect.height / 2 - rootRect.top;
      const size = Math.max(sourceRect.width, sourceRect.height);
      const settledSize = Math.max(
        size,
        Math.min(rootRect.width, rootRect.height) - EXPANDED_ORB_MARGIN_PX,
      );

      setIsClosing(false);
      setExpandedOrbIndex(index);
      setExpandSettled(reducedMotionRef.current);
      setExpandFlip({ x: centerX, y: centerY, size, settledSize });
    },
    [isMobileInteractive],
  );

  useLayoutEffect(() => {
    if (expandedOrbIndex === null || expandFlip === null || expandSettled || isClosing) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandSettled(true);
      });
    });

    return () => cancelAnimationFrame(id);
  }, [expandFlip, expandSettled, expandedOrbIndex, isClosing]);

  useEffect(() => {
    if (expandedOrbIndex === null || !expandSettled) return;

    playCloseTimerRef.current = window.setTimeout(() => {
      beginCloseExpanded();
    }, PLAY_DURATION_MS);

    return () => {
      if (playCloseTimerRef.current !== undefined) {
        window.clearTimeout(playCloseTimerRef.current);
        playCloseTimerRef.current = undefined;
      }
    };
  }, [beginCloseExpanded, expandSettled, expandedOrbIndex]);

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

    dialRef.current?.classList.add("hero-speaking-orbs__dial--stepping");

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SWITCH_MS);
      const eased = easeDialStep(t);
      const value = from + (to - from) * eased;
      dialRotationRef.current = value;
      applyDialLayoutToDom(value);
      if (t < 1) {
        switchRafRef.current = requestAnimationFrame(tick);
      } else {
        switchRafRef.current = undefined;
        dialRef.current?.classList.remove("hero-speaking-orbs__dial--stepping");
        setDialRotation(to);
        onDone();
      }
    };

    switchRafRef.current = requestAnimationFrame(tick);
  }, [applyDialLayoutToDom]);

  const advanceDial = useCallback(() => {
    if (switchingRef.current || !tabVisibleRef.current) return;
    switchingRef.current = true;
    setPillVisible(false);

    const from = dialRotationRef.current;
    const to = from - DIAL_STEP;
    animateStep(from, to, () => {
      switchingRef.current = false;
      setPillVisible(true);
    });
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
      if (playCloseTimerRef.current !== undefined) window.clearTimeout(playCloseTimerRef.current);
      if (expandCloseTimerRef.current !== undefined) window.clearTimeout(expandCloseTimerRef.current);
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
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
      } as CSSProperties;
    }

    return {
      left: "50%",
      top: "50%",
      width: expandFlip.settledSize,
      height: expandFlip.settledSize,
      aspectRatio: "1 / 1",
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
      }${isClosing ? " hero-speaking-orbs--closing" : ""}`}
      aria-hidden={expandedOrbIndex === null ? true : undefined}
    >
      <div className="hero-speaking-orbs__stage">
        <div ref={dialRef} className="hero-speaking-orbs__dial">
          {HERO_DIAL_ORBS.map((scheme, index) => {
            const pose = layout[index];
            const style = dialNodeStyle(pose);
            const isExpandedSource = expandedOrbIndex === index;
            return (
              <div
                key={scheme.label}
                ref={(node) => {
                  nodeRefs.current[index] = node;
                }}
                className={`hero-speaking-orbs__node${
                  isExpandedSource ? " hero-speaking-orbs__node--expanded-source" : ""
                }${pose.isFocused ? " hero-speaking-orbs__node--focused" : ""}`}
                style={{
                  transform: style.transform,
                  opacity: isExpandedSource ? (isClosing ? style.opacity : 0) : style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                <div className="hero-speaking-orbs__node-reveal">
                  <SpeakingGradientOrb
                    scheme={scheme}
                    isFocused={pose.isFocused}
                    showPill={pose.isFocused && pillVisible && expandedOrbIndex === null}
                    orbSize={dialLayout.orbSize}
                    interactive={isMobileInteractive && expandedOrbIndex === null && pose.isFocused}
                    onPlayClick={(sourceNode) => openExpanded(index, sourceNode)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {expandedScheme && expandedOrbIndex !== null ? (
        <div
          className={`hero-speaking-orbs__expanded${
            isClosing ? " hero-speaking-orbs__expanded--closing" : ""
          }`}
          role="dialog"
          aria-label={`${expandedScheme.label} playback`}
        >
          <button
            type="button"
            className="hero-speaking-orbs__expanded-dismiss"
            aria-label="Close playback"
            onClick={beginCloseExpanded}
          />
          <div
            className={`hero-speaking-orbs__expanded-orb${
              expandSettled ? " hero-speaking-orbs__expanded-orb--settled" : ""
            }${isClosing ? " hero-speaking-orbs__expanded-orb--closing" : ""}`}
            style={expandedOrbStyle}
          >
            <SpeakingGradientOrb
              scheme={expandedScheme}
              isFocused
              showPill={false}
              orbSize="100%"
              expanded
              showRinging={expandSettled && !isClosing}
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
