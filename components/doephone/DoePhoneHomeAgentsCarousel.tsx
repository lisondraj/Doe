"use client";

import { HomeAgentsCarouselBillingPeek } from "@/components/doephone/HomeAgentsCarouselBillingPeek";
import { HomeAgentsCarouselInboxPeek } from "@/components/doephone/HomeAgentsCarouselInboxPeek";
import { HomeAgentsCarouselLabsPeek } from "@/components/doephone/HomeAgentsCarouselLabsPeek";
import { HomeAgentsCarouselLivePeek } from "@/components/doephone/HomeAgentsCarouselLivePeek";
import { HomeAgentsCarouselReferralsPeek } from "@/components/doephone/HomeAgentsCarouselReferralsPeek";
import { HomeAgentsCarouselRefillPeek } from "@/components/doephone/HomeAgentsCarouselRefillPeek";
import { HomeAgentsCarouselSchedulingPeek } from "@/components/doephone/HomeAgentsCarouselSchedulingPeek";
import { HeroDialOrbGrainShader } from "@/components/doephone/HeroDialOrbGrainShader";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
  type TransitionEvent,
} from "react";

import { suisseIntl, suisseIntlLight } from "@/lib/home/fonts";
import {
  DOEPHONE_DESKTOP_MEDIA_QUERY,
  readBootstrappedDoePhoneVariant,
  resolveDoePhoneVariant,
  type DoePhoneVariant,
} from "@/lib/doephone/resolve-doe-phone-variant";
import { doephoneAgentsRevealStyleVars } from "@/lib/doephone/section-reveal-timing";
import {
  doePhoneSectionRevealSegmentClass,
  useDoePhoneSectionReveal,
} from "@/lib/doephone/use-doe-phone-section-reveal";
import { AGENTS_CAROUSEL_DESCRIPTIONS } from "@/lib/doephone/agents-carousel-copy";
import {
  HERO_DIAL_ORB_CAROUSEL_SHADER,
  HERO_DIAL_ORBS,
  heroDialOrbCarouselScheme,
  type HeroDialOrbScheme,
} from "@/lib/doephone/hero-dial-orbs";

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

function AgentCarouselPeek({ label }: { label: string }) {
  switch (label) {
    case "Inbox Agent":
      return <HomeAgentsCarouselInboxPeek />;
    case "Labs Agent":
      return <HomeAgentsCarouselLabsPeek />;
    case "Referrals Agent":
      return <HomeAgentsCarouselReferralsPeek />;
    case "Scheduling Agent":
      return <HomeAgentsCarouselSchedulingPeek />;
    case "Live Appointment":
      return <HomeAgentsCarouselLivePeek />;
    case "Billing Agent":
      return <HomeAgentsCarouselBillingPeek />;
    case "Refill Agent":
      return <HomeAgentsCarouselRefillPeek />;
    default:
      return null;
  }
}

function getOrbBlur(distance: number, focused: boolean) {
  if (focused || distance === 0) {
    return 0;
  }

  return Math.min(3.2, distance * 1.05);
}

function AgentCarouselOrb({
  scheme,
  focused,
  distance,
  isDesktop,
  peekRevealed,
  peekRevealSettled,
}: {
  scheme: HeroDialOrbScheme;
  focused: boolean;
  distance: number;
  isDesktop: boolean;
  peekRevealed: boolean;
  peekRevealSettled: boolean;
}) {
  const displayScheme = heroDialOrbCarouselScheme(scheme);
  const blur = getOrbBlur(distance, focused);
  const showPeek = !isDesktop || focused;
  const peekRevealClass = isDesktop
    ? peekRevealSettled
      ? "home-agents-carousel__orb-peek-reveal--settled"
      : doePhoneSectionRevealSegmentClass("agents-peek", peekRevealed)
    : "";

  return (
    <div
      className={`home-agents-carousel__orb-shell${
        focused ? " home-agents-carousel__orb-shell--focused" : ""
      }`}
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        className={`home-agents-carousel__orb hero-speaking-orb${
          focused ? " home-agents-carousel__orb--focused" : ""
        }`}
        style={orbAccentStyle(displayScheme)}
      >
        <div className="hero-speaking-orb__progress-shell">
          <div className="hero-speaking-orb__core relative overflow-hidden rounded-full">
            <HeroDialOrbGrainShader
              scheme={displayScheme}
              shaderConfig={HERO_DIAL_ORB_CAROUSEL_SHADER}
            />
            {showPeek ? (
              <div className={`home-agents-carousel__orb-peek-reveal${peekRevealClass ? ` ${peekRevealClass}` : ""}`}>
                <AgentCarouselPeek label={scheme.label} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Agents band order — Scheduling first so it is centered on page load. */
const AGENTS_CAROUSEL_ORBS: readonly HeroDialOrbScheme[] = [
  HERO_DIAL_ORBS[1],
  HERO_DIAL_ORBS[0],
  HERO_DIAL_ORBS[2],
  HERO_DIAL_ORBS[3],
  HERO_DIAL_ORBS[4],
  HERO_DIAL_ORBS[5],
  HERO_DIAL_ORBS[6],
];

const AGENTS_CAROUSEL_ORB_COUNT = AGENTS_CAROUSEL_ORBS.length;
const AGENTS_CAROUSEL_START_INDEX = 0;
const AGENTS_CAROUSEL_LOOP_ORBS: readonly HeroDialOrbScheme[] = [
  ...AGENTS_CAROUSEL_ORBS,
  ...AGENTS_CAROUSEL_ORBS,
  ...AGENTS_CAROUSEL_ORBS,
];
const AGENTS_CAROUSEL_LOOP_START =
  AGENTS_CAROUSEL_ORB_COUNT + AGENTS_CAROUSEL_START_INDEX;
const AGENTS_CAROUSEL_SWIPE_THRESHOLD_PX = 44;

/** Hero agent orbs — horizontal carousel with chevrons and label. */
export function DoePhoneHomeAgentsCarousel() {
  const [layoutVariant, setLayoutVariant] = useState<DoePhoneVariant>("phone");
  const [layoutReady, setLayoutReady] = useState(false);
  const isDesktop = layoutReady && layoutVariant === "desktop";
  const { ref: sectionRef, revealed } = useDoePhoneSectionReveal(isDesktop ? 0.15 : 1);
  const [peekRevealSettled, setPeekRevealSettled] = useState(false);
  const [position, setPosition] = useState(AGENTS_CAROUSEL_LOOP_START);
  const [trackInstant, setTrackInstant] = useState(true);
  const reenableTransitionRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const active = AGENTS_CAROUSEL_LOOP_ORBS[position];

  useLayoutEffect(() => {
    setLayoutVariant(readBootstrappedDoePhoneVariant());
    setLayoutReady(true);
    const sync = () => setLayoutVariant(resolveDoePhoneVariant());
    const mq = window.matchMedia(DOEPHONE_DESKTOP_MEDIA_QUERY);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!revealed || !isDesktop) {
      return;
    }

    const settleTimer = window.setTimeout(() => {
      setPeekRevealSettled(true);
    }, 1900);

    return () => window.clearTimeout(settleTimer);
  }, [isDesktop, revealed]);

  const goPrev = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current - 1);
  }, []);

  const goNext = useCallback(() => {
    setTrackInstant(false);
    setPosition((current) => current + 1);
  }, []);

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

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (trackInstant) {
        return;
      }

      if (event.target !== event.currentTarget || event.propertyName !== "transform") {
        return;
      }

      if (position >= AGENTS_CAROUSEL_ORB_COUNT && position < AGENTS_CAROUSEL_ORB_COUNT * 2) {
        return;
      }

      setTrackInstant(true);
      setPosition((current) => {
        if (current < AGENTS_CAROUSEL_ORB_COUNT) {
          return current + AGENTS_CAROUSEL_ORB_COUNT;
        }

        if (current >= AGENTS_CAROUSEL_ORB_COUNT * 2) {
          return current - AGENTS_CAROUSEL_ORB_COUNT;
        }

        return current;
      });
    },
    [position, trackInstant],
  );

  useEffect(() => {
    if (!trackInstant) {
      return;
    }

    reenableTransitionRef.current = window.requestAnimationFrame(() => {
      reenableTransitionRef.current = window.requestAnimationFrame(() => {
        setTrackInstant(false);
      });
    });

    return () => {
      if (reenableTransitionRef.current !== null) {
        window.cancelAnimationFrame(reenableTransitionRef.current);
      }
    };
  }, [trackInstant, position]);

  return (
    <div
      ref={sectionRef}
      className={`home-agents-carousel ${suisseIntl.className}`}
      style={isDesktop ? doephoneAgentsRevealStyleVars() : undefined}
      aria-hidden
    >
      <div className="home-agents-carousel__stage">
        <div
          className="home-agents-carousel__viewport"
          onTouchStart={handleViewportTouchStart}
          onTouchEnd={handleViewportTouchEnd}
          onTouchCancel={() => {
            swipeStartRef.current = null;
          }}
        >
          <div
            className={`home-agents-carousel__track${
              trackInstant ? " home-agents-carousel__track--instant" : ""
            }`}
            onTransitionEnd={handleTrackTransitionEnd}
            style={{
              transform: `translateX(calc(50% - var(--home-agents-orb-half) - ${position} * var(--home-agents-orb-step)))`,
            }}
          >
            {AGENTS_CAROUSEL_LOOP_ORBS.map((scheme, orbIndex) => (
              <AgentCarouselOrb
                key={`${scheme.label}-${orbIndex}`}
                scheme={scheme}
                focused={orbIndex === position}
                distance={Math.abs(orbIndex - position)}
                isDesktop={isDesktop}
                peekRevealed={revealed}
                peekRevealSettled={peekRevealSettled}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="home-agents-carousel__caption">
        <div className="home-agents-carousel__label-row">
          <CarouselChevron
            direction="left"
            onClick={goPrev}
            label="Previous agent"
          />
          <div
            className={`hero-speaking-orb__tag hero-speaking-orb__tag--carousel hero-speaking-orb__tag--visible ${suisseIntl.className}`}
            aria-hidden
          >
            <span className="hero-speaking-orb__tag-text">{active.label}</span>
          </div>
          <CarouselChevron
            direction="right"
            onClick={goNext}
            label="Next agent"
          />
        </div>
        <p
          className={`home-agents-carousel__description ${suisseIntlLight.className}`}
          aria-hidden
        >
          {AGENTS_CAROUSEL_DESCRIPTIONS[active.label] ?? ""}
        </p>
      </div>
    </div>
  );
}
