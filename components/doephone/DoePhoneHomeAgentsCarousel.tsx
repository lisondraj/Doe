"use client";

import { HomeAgentsCarouselBillingPeek } from "@/components/doephone/HomeAgentsCarouselBillingPeek";
import { HomeAgentsCarouselInboxPeek } from "@/components/doephone/HomeAgentsCarouselInboxPeek";
import { HomeAgentsCarouselLabsPeek } from "@/components/doephone/HomeAgentsCarouselLabsPeek";
import { HomeAgentsCarouselLivePeek } from "@/components/doephone/HomeAgentsCarouselLivePeek";
import { HomeAgentsCarouselReferralsPeek } from "@/components/doephone/HomeAgentsCarouselReferralsPeek";
import { HomeAgentsCarouselRefillPeek } from "@/components/doephone/HomeAgentsCarouselRefillPeek";
import { HomeAgentsCarouselSchedulingPeek } from "@/components/doephone/HomeAgentsCarouselSchedulingPeek";
import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
import { HeroDialOrbPaperShader } from "@/components/doephone/HeroDialOrbPaperShader";
import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
  type TouchEvent,
} from "react";

import { dmSans } from "@/lib/home/fonts";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { AGENTS_CAROUSEL_DESCRIPTIONS } from "@/lib/doephone/agents-carousel-copy";
import {
  HERO_DIAL_ORB_CAROUSEL_SHADER,
  HERO_DIAL_ORBS,
  heroDialOrbCarouselIphonePaperScheme,
  heroDialOrbCarouselScheme,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";
import { doePhoneSectionRevealSegmentClass } from "@/lib/doephone/use-doe-phone-section-reveal";
import { SHADER_WEBGL_SLOT_PRIORITY } from "@/lib/doephone/shader-webgl-budget";
import { useHomeHeroShaderReady } from "@/lib/doephone/use-home-hero-shader-ready";
import { useShaderViewportGate } from "@/lib/doephone/use-shader-viewport-gate";
import { doeHomeAgentsCarouselOrbShaderVariantForLabel } from "@/lib/proto/proto-grain-gradient";

function orbAccentStyle(scheme: HeroDialOrbScheme): CSSProperties {
  const [dark, mid, light] = scheme.colors;
  return {
    "--orb-halo-dark": dark,
    "--orb-halo-mid": mid,
    "--orb-halo-light": light,
    "--orb-halo-back": scheme.colorBack,
  } as CSSProperties;
}

function CarouselChevron({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`home-agents-carousel__nav home-agents-carousel__nav--${direction}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={onClick}
    >
      <span className="home-agents-carousel__nav-hit">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden className="home-agents-carousel__nav-icon">
        {direction === "left" ? (
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      </span>
    </button>
  );
}

const AgentCarouselPeek = memo(function AgentCarouselPeek({
  label,
  isPhone = false,
}: {
  label: string;
  isPhone?: boolean;
}) {
  switch (label) {
    case "Inbox Agent":
      return <HomeAgentsCarouselInboxPeek />;
    case "Labs Agent":
      return <HomeAgentsCarouselLabsPeek />;
    case "Referrals Agent":
      return <HomeAgentsCarouselReferralsPeek />;
    case "Scheduling Agent":
      return <HomeAgentsCarouselSchedulingPeek iphone={isPhone} />;
    case "Live Appointment":
      return <HomeAgentsCarouselLivePeek iphone={isPhone} />;
    case "Billing Agent":
      return <HomeAgentsCarouselBillingPeek />;
    case "Refill Agent":
      return <HomeAgentsCarouselRefillPeek />;
    default:
      return null;
  }
});

function getOrbBlur(distance: number) {
  if (distance === 0) {
    return 0;
  }
  return Math.min(3.2, distance * 1.05);
}

/** iPhone band order — Scheduling first so it is centered on page load. */
const AGENTS_CAROUSEL_ORBS_PHONE: readonly HeroDialOrbScheme[] = [
  HERO_DIAL_ORBS[1],
  HERO_DIAL_ORBS[0],
  HERO_DIAL_ORBS[2],
  HERO_DIAL_ORBS[3],
  HERO_DIAL_ORBS[4],
  HERO_DIAL_ORBS[5],
  HERO_DIAL_ORBS[6],
];

/** Desktop band order — Scheduling third; section opens focused there. */
const AGENTS_CAROUSEL_ORBS_DESKTOP: readonly HeroDialOrbScheme[] = [
  HERO_DIAL_ORBS[0],
  HERO_DIAL_ORBS[2],
  HERO_DIAL_ORBS[1],
  HERO_DIAL_ORBS[3],
  HERO_DIAL_ORBS[4],
  HERO_DIAL_ORBS[5],
  HERO_DIAL_ORBS[6],
];

const DESKTOP_CAROUSEL_INITIAL_ORB_INDEX = 2;

const AGENTS_CAROUSEL_TRACK_LEADING_CLONE = 0;
const AGENTS_CAROUSEL_TRACK_START = AGENTS_CAROUSEL_TRACK_LEADING_CLONE + 1;
const AGENTS_CAROUSEL_SWIPE_THRESHOLD_PX = 44;

function buildAgentsCarouselTrack(orbs: readonly HeroDialOrbScheme[]) {
  return [orbs[orbs.length - 1], ...orbs, orbs[0]] as const;
}

function getAgentsCarouselInitialOrbIndex(isDesktop: boolean) {
  return isDesktop ? DESKTOP_CAROUSEL_INITIAL_ORB_INDEX : 0;
}

function getAgentsCarouselInitialTrackIndex(isDesktop: boolean) {
  return AGENTS_CAROUSEL_TRACK_START + getAgentsCarouselInitialOrbIndex(isDesktop);
}

function isMainStripOrbIndex(orbIndex: number, trailingCloneIndex: number) {
  return orbIndex >= AGENTS_CAROUSEL_TRACK_START && orbIndex < trailingCloneIndex;
}

function agentsCarouselPaperSlotKey(orbIndex: number) {
  return `agents-carousel-paper:orb-${orbIndex}`;
}

/** Peek UI — isolated from paper/grain so WebGL work never blocks peek paint. */
const AgentCarouselPeekSlot = memo(
  function AgentCarouselPeekSlot({
    label,
    isDesktop,
  }: {
    label: string;
    isDesktop: boolean;
  }) {
    const peekLiftClass = isDesktop
      ? "home-agents-carousel__orb-peek-lift home-agents-carousel__orb-peek-lift--in home-agents-carousel__orb-peek-lift--instant"
      : "";

    return (
      <div className="home-agents-carousel__orb-peek-reveal home-agents-carousel__orb-peek-reveal--visible">
        {isDesktop ? (
          <div className={peekLiftClass}>
            <AgentCarouselPeek label={label} isPhone={false} />
          </div>
        ) : (
          <AgentCarouselPeek label={label} isPhone />
        )}
      </div>
    );
  },
  (prev, next) => prev.label === next.label && prev.isDesktop === next.isDesktop,
);

/** Orb fill — CSS grain always (instant); paper WebGL only on warm neighbors in view. */
const AgentCarouselOrbSurface = memo(
  function AgentCarouselOrbSurface({
    orbIndex,
    scheme,
    isPhoneLayout,
    paperEnabled,
    paperSlotPriority,
  }: {
    orbIndex: number;
    scheme: HeroDialOrbScheme;
    isPhoneLayout: boolean;
    paperEnabled: boolean;
    paperSlotPriority: number;
  }) {
    const paperScheme = heroDialOrbCarouselIphonePaperScheme(scheme);

    return (
      <>
        <HeroDialOrbGrainShader
          scheme={paperScheme}
          shaderConfig={HERO_DIAL_ORB_CAROUSEL_SHADER}
        />
        {paperEnabled ? (
          <HeroDialOrbPaperShader
            scheme={paperScheme}
            variant={doeHomeAgentsCarouselOrbShaderVariantForLabel(scheme.label)}
            slotPriority={paperSlotPriority}
            slotKey={agentsCarouselPaperSlotKey(orbIndex)}
            enabled={paperEnabled}
          />
        ) : null}
      </>
    );
  },
  (prev, next) =>
    prev.orbIndex === next.orbIndex &&
    prev.scheme === next.scheme &&
    prev.isPhoneLayout === next.isPhoneLayout &&
    prev.paperEnabled === next.paperEnabled &&
    prev.paperSlotPriority === next.paperSlotPriority,
);

const AgentCarouselOrb = memo(
  function AgentCarouselOrb({
    orbIndex,
    scheme,
    focused,
    blurPx,
    isDesktop,
    isPhoneLayout,
    paperEnabled,
    paperSlotPriority,
  }: {
    orbIndex: number;
    scheme: HeroDialOrbScheme;
    focused: boolean;
    blurPx: number;
    isDesktop: boolean;
    isPhoneLayout: boolean;
    paperEnabled: boolean;
    paperSlotPriority: number;
  }) {
    const displayScheme = isPhoneLayout
      ? heroDialOrbCarouselIphonePaperScheme(scheme)
      : heroDialOrbCarouselScheme(scheme);

    return (
      <div
        className={`home-agents-carousel__orb-shell${
          focused ? " home-agents-carousel__orb-shell--focused" : ""
        }`}
        style={blurPx > 0 ? { filter: `blur(${blurPx}px)` } : undefined}
      >
        <div
          className={`home-agents-carousel__orb hero-speaking-orb${
            focused ? " home-agents-carousel__orb--focused" : ""
          }`}
          style={orbAccentStyle(displayScheme)}
        >
          <div className="hero-speaking-orb__progress-shell">
            <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
              <AgentCarouselOrbSurface
                orbIndex={orbIndex}
                scheme={scheme}
                isPhoneLayout={isPhoneLayout}
                paperEnabled={paperEnabled}
                paperSlotPriority={paperSlotPriority}
              />
              <AgentCarouselPeekSlot label={scheme.label} isDesktop={isDesktop} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.orbIndex === next.orbIndex &&
    prev.scheme === next.scheme &&
    prev.focused === next.focused &&
    prev.blurPx === next.blurPx &&
    prev.isDesktop === next.isDesktop &&
    prev.isPhoneLayout === next.isPhoneLayout &&
    prev.paperEnabled === next.paperEnabled &&
    prev.paperSlotPriority === next.paperSlotPriority,
);

function trackTransform(trackIndex: number) {
  return `translate3d(calc(50vw - var(--home-agents-orb-half) - ${trackIndex} * var(--home-agents-orb-step)), 0, 0)`;
}

/** Hero agent orbs — fixed peek/grain per physical orb, smooth translate, invisible clone reset. */
export function DoePhoneHomeAgentsCarousel({ revealed = false }: { revealed?: boolean }) {
  const heroShaderReady = useHomeHeroShaderReady();
  const carouselStageRef = useRef<HTMLDivElement>(null);
  const carouselInView = useShaderViewportGate(carouselStageRef, "50% 0px");
  const [layoutVariant, setLayoutVariant] = useState<DoePhoneVariant>(readBootstrappedDoePhoneVariant);
  const [layoutReady, setLayoutReady] = useState(true);
  const isDesktop = layoutReady && layoutVariant === "desktop";
  const isPhoneLayout = layoutVariant === "phone";

  const carouselOrbs = isDesktop ? AGENTS_CAROUSEL_ORBS_DESKTOP : AGENTS_CAROUSEL_ORBS_PHONE;
  const trackOrbs = useMemo(() => buildAgentsCarouselTrack(carouselOrbs), [carouselOrbs]);
  const orbCount = carouselOrbs.length;
  const trailingCloneIndex = trackOrbs.length - 1;

  const [trackIndex, setTrackIndex] = useState(() =>
    getAgentsCarouselInitialTrackIndex(readBootstrappedDoePhoneVariant() === "desktop"),
  );
  const [instantTransition, setInstantTransition] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const animatingRef = useRef(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasSectionRevealResetRef = useRef(false);

  const active = trackOrbs[trackIndex];

  useLayoutEffect(() => {
    setLayoutVariant(readBootstrappedDoePhoneVariant());
    setLayoutReady(true);
    const sync = () => setLayoutVariant(resolveDoePhoneVariant());
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!layoutReady) {
      return;
    }
    setTrackIndex(getAgentsCarouselInitialTrackIndex(isDesktop));
    hasSectionRevealResetRef.current = false;
  }, [isDesktop, layoutReady]);

  useLayoutEffect(() => {
    if (!revealed) {
      hasSectionRevealResetRef.current = false;
    }
  }, [revealed]);

  useLayoutEffect(() => {
    if (!isDesktop || !revealed || hasSectionRevealResetRef.current) {
      return;
    }

    hasSectionRevealResetRef.current = true;
    setInstantTransition(true);
    setTrackIndex(getAgentsCarouselInitialTrackIndex(true));
    animatingRef.current = false;
    setIsAnimating(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInstantTransition(false);
      });
    });
  }, [isDesktop, revealed]);

  const resetTrackIndex = useCallback((nextIndex: number) => {
    setInstantTransition(true);
    setTrackIndex(nextIndex);
    animatingRef.current = false;
    setIsAnimating(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInstantTransition(false);
      });
    });
  }, []);

  const goPrev = useCallback(() => {
    if (animatingRef.current) {
      return;
    }
    animatingRef.current = true;
    setIsAnimating(true);
    setInstantTransition(false);
    setTrackIndex((current) => current - 1);
  }, []);

  const goNext = useCallback(() => {
    if (animatingRef.current) {
      return;
    }
    animatingRef.current = true;
    setIsAnimating(true);
    setInstantTransition(false);
    setTrackIndex((current) => current + 1);
  }, []);

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (instantTransition) {
        return;
      }
      if (event.target !== event.currentTarget || event.propertyName !== "transform") {
        return;
      }

      if (trackIndex === trailingCloneIndex) {
        resetTrackIndex(AGENTS_CAROUSEL_TRACK_START);
        return;
      }

      if (trackIndex === AGENTS_CAROUSEL_TRACK_LEADING_CLONE) {
        resetTrackIndex(AGENTS_CAROUSEL_TRACK_START + orbCount - 1);
        return;
      }

      animatingRef.current = false;
      setIsAnimating(false);
    },
    [instantTransition, orbCount, resetTrackIndex, trackIndex, trailingCloneIndex],
  );

  const handleViewportTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleViewportTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) < AGENTS_CAROUSEL_SWIPE_THRESHOLD_PX) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX < 0) {
        goNext();
        return;
      }

      goPrev();
    },
    [goNext, goPrev],
  );

  const trackClassName = [
    "home-agents-carousel__track",
    instantTransition ? "home-agents-carousel__track--instant" : "",
    isAnimating ? "home-agents-carousel__track--animating" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`home-agents-carousel ${dmSans.className}`} aria-hidden>
      <div
        ref={carouselStageRef}
        className="home-agents-carousel__stage"
      >
        <div
          className="home-agents-carousel__viewport"
          onTouchStart={handleViewportTouchStart}
          onTouchEnd={handleViewportTouchEnd}
          onTouchCancel={() => {
            swipeStartRef.current = null;
          }}
        >
          <div
            className={trackClassName}
            onTransitionEnd={handleTrackTransitionEnd}
            style={{ transform: trackTransform(trackIndex) }}
          >
            {trackOrbs.map((scheme, orbIndex) => {
              const distance = Math.abs(orbIndex - trackIndex);
              const focused = orbIndex === trackIndex;
              const onMainStrip = isPhoneLayout && isMainStripOrbIndex(orbIndex, trailingCloneIndex);
              const warmPaper =
                carouselInView &&
                (isPhoneLayout ? onMainStrip && distance <= 1 : focused);
              const paperEnabled = warmPaper && (isPhoneLayout ? heroShaderReady : true);
              const paperSlotPriority = focused
                ? SHADER_WEBGL_SLOT_PRIORITY.CAROUSEL_FOCUSED
                : SHADER_WEBGL_SLOT_PRIORITY.CAROUSEL_ADJACENT;

              return (
                <AgentCarouselOrb
                  key={`orb-${orbIndex}`}
                  orbIndex={orbIndex}
                  scheme={scheme}
                  focused={focused}
                  blurPx={isDesktop ? 0 : getOrbBlur(distance)}
                  isDesktop={isDesktop}
                  isPhoneLayout={isPhoneLayout}
                  paperEnabled={paperEnabled}
                  paperSlotPriority={paperSlotPriority}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="home-agents-carousel__caption">
        <div className="home-agents-carousel__label-row">
          <CarouselChevron
            direction="left"
            onClick={goPrev}
            label="Previous agent"
            className={doePhoneSectionRevealSegmentClass("agents-nav", revealed)}
          />
          <div
            className={`hero-speaking-orb__tag hero-speaking-orb__tag--carousel hero-speaking-orb__tag--visible ${dmSans.className} ${doePhoneSectionRevealSegmentClass("agents-label", revealed)}`}
            aria-hidden
          >
            <span className="hero-speaking-orb__tag-text">{active.label}</span>
          </div>
          <CarouselChevron
            direction="right"
            onClick={goNext}
            label="Next agent"
            className={doePhoneSectionRevealSegmentClass("agents-nav", revealed)}
          />
        </div>
        <p
          className={`home-agents-carousel__description ${dmSans.className} ${doePhoneSectionRevealSegmentClass("agents-nav", revealed)}`}
          aria-hidden
        >
          {AGENTS_CAROUSEL_DESCRIPTIONS[active.label] ?? ""}
        </p>
      </div>
    </div>
  );
}
