"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  DOEHEALTH_DESK_HERO_AUDIENCE,
  DOEHEALTH_DESK_HERO_AUDIENCE_CROSSFADE_MS,
  DOEHEALTH_DESK_HERO_AUDIENCE_ROTATE_MS,
} from "@/lib/doehealth/doehealth-desk-hero-copy";

const AUDIENCE = DOEHEALTH_DESK_HERO_AUDIENCE;
const SIZER_WORD = "providers";

type AudiencePhase = "current" | "in" | "out";

function AudienceWord({
  word,
  phase,
  animate,
  onAnimationEnd,
}: {
  word: string;
  phase: AudiencePhase;
  animate?: boolean;
  onAnimationEnd?: () => void;
}) {
  return (
    <span
      className={`doehealth-desk-hero__audience-word doehealth-desk-hero__audience-word--${phase}${
        animate ? " doehealth-desk-hero__audience-word--animate" : ""
      }`}
      onAnimationEnd={onAnimationEnd}
    >
      {word}
    </span>
  );
}

/** Smooth vertical crossfade — practices → providers → patients → students. */
export function DoeHealthDeskAudienceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<{ from: number; to: number } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const transitionRef = useRef<{ from: number; to: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const completeTransition = useCallback(() => {
    const current = transitionRef.current;
    if (!current) return;

    transitionRef.current = null;
    activeIndexRef.current = current.to;
    setActiveIndex(current.to);
    setTransition(null);
    isTransitioningRef.current = false;
  }, []);

  useEffect(() => {
    if (AUDIENCE.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      if (isTransitioningRef.current) return;

      const nextIndex = (activeIndexRef.current + 1) % AUDIENCE.length;

      if (reduceMotion) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        return;
      }

      isTransitioningRef.current = true;
      const nextTransition = { from: activeIndexRef.current, to: nextIndex };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
    }, DOEHEALTH_DESK_HERO_AUDIENCE_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  useEffect(() => {
    if (!transition || reduceMotion) return undefined;

    const fallback = window.setTimeout(
      completeTransition,
      DOEHEALTH_DESK_HERO_AUDIENCE_CROSSFADE_MS + 80,
    );
    return () => window.clearTimeout(fallback);
  }, [completeTransition, reduceMotion, transition]);

  return (
    <span className="doehealth-desk-hero__audience-carousel" aria-live="polite">
      <span className="doehealth-desk-hero__audience-sizer" aria-hidden>
        {SIZER_WORD}
      </span>
      {transition ? (
        <>
          <AudienceWord word={AUDIENCE[transition.from]} phase="out" animate />
          <AudienceWord
            word={AUDIENCE[transition.to]}
            phase="in"
            animate
            onAnimationEnd={completeTransition}
          />
        </>
      ) : (
        <AudienceWord word={AUDIENCE[activeIndex]} phase="current" />
      )}
    </span>
  );
}
