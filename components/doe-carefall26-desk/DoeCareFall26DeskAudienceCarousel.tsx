"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  DOECAREFALL26_DESK_HERO_AUDIENCE,
  DOECAREFALL26_DESK_HERO_AUDIENCE_CROSSFADE_MS,
  DOECAREFALL26_DESK_HERO_AUDIENCE_ROTATE_MS,
} from "@/lib/doecarefall26/doecarefall26-desk-hero-copy";

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
      className={`doecarefall26-desk-hero__audience-word doecarefall26-desk-hero__audience-word--${phase}${
        animate ? " doecarefall26-desk-hero__audience-word--animate" : ""
      }`}
      onAnimationEnd={onAnimationEnd}
    >
      {word}
    </span>
  );
}

/** Smooth vertical crossfade through the audience list. */
export function DoeCareFall26DeskAudienceCarousel({
  paused = false,
  audience = DOECAREFALL26_DESK_HERO_AUDIENCE,
}: {
  paused?: boolean;
  audience?: readonly string[];
}) {
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

  useEffect(() => {
    if (activeIndexRef.current < audience.length) return;
    activeIndexRef.current = 0;
    transitionRef.current = null;
    isTransitioningRef.current = false;
    setActiveIndex(0);
    setTransition(null);
  }, [audience]);

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
    if (audience.length <= 1 || paused) return undefined;

    const interval = window.setInterval(() => {
      if (isTransitioningRef.current) return;

      const nextIndex = (activeIndexRef.current + 1) % audience.length;

      if (reduceMotion) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        return;
      }

      isTransitioningRef.current = true;
      const nextTransition = { from: activeIndexRef.current, to: nextIndex };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
    }, DOECAREFALL26_DESK_HERO_AUDIENCE_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [audience, paused, reduceMotion]);

  useEffect(() => {
    if (!transition || reduceMotion) return undefined;

    const fallback = window.setTimeout(
      completeTransition,
      DOECAREFALL26_DESK_HERO_AUDIENCE_CROSSFADE_MS + 80,
    );
    return () => window.clearTimeout(fallback);
  }, [completeTransition, reduceMotion, transition]);

  return (
    <span className="doecarefall26-desk-hero__audience-carousel" aria-live="polite">
      <span className="doecarefall26-desk-hero__audience-sizer" aria-hidden>
        {SIZER_WORD}
      </span>
      {transition ? (
        <>
          <AudienceWord word={audience[transition.from]} phase="out" animate />
          <AudienceWord word={audience[transition.to]} phase="in" animate onAnimationEnd={completeTransition} />
        </>
      ) : (
        <AudienceWord word={audience[activeIndex]} phase="current" />
      )}
    </span>
  );
}
