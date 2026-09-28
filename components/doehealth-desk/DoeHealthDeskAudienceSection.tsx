"use client";

import { useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { DOEHEALTH_DESK_AUDIENCES } from "@/lib/doehealth/doehealth-desk-audiences";
import { inter, p22Mackinac } from "@/lib/home/fonts";

const AUDIENCE_COUNT = DOEHEALTH_DESK_AUDIENCES.length;

/** iPhone: minimum time between one card starting its reveal and the next one starting. */
const CARD_GAP_MS = 220;

/**
 * A card may only reveal / lock once it has really been scrolled to. On a slow device the mockup above it
 * is often not laid out yet when observers first run, which puts the first card at the top of the screen
 * at scrollY 0 — that first callback must not count as "seen" (it would lock the first card with no motion).
 * So a card is eligible once it has been seen below the screen, or the page has been scrolled.
 */
function noteBelow(entry: IntersectionObserverEntry, seenBelow: boolean[], index: number) {
  if (entry.rootBounds && entry.boundingClientRect.top >= entry.rootBounds.bottom) seenBelow[index] = true;
  return seenBelow[index] || window.scrollY > 40;
}

function allRevealed() {
  return Array.from({ length: AUDIENCE_COUNT }, () => true);
}

export function DoeHealthDeskAudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [sectionIn, setSectionIn] = useState(false);
  const [cardIn, setCardIn] = useState<boolean[]>(() => Array.from({ length: AUDIENCE_COUNT }, () => false));
  // A card is "settled" once it has fully arrived. From then on it is locked in place: scrolling back up
  // or down past it never replays or reverses its slide (the scroll-driven slide would otherwise run backwards).
  const [cardSettled, setCardSettled] = useState<boolean[]>(() =>
    Array.from({ length: AUDIENCE_COUNT }, () => false),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCardSettled(allRevealed());
      return;
    }

    const observers: IntersectionObserver[] = [];
    const seenBelow = Array.from({ length: AUDIENCE_COUNT }, () => false);
    DOEHEALTH_DESK_AUDIENCES.forEach((_, index) => {
      const el = cardRefs.current[index];
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (!noteBelow(entry, seenBelow, index)) return;
          const fullyIn = entry.isIntersecting && entry.intersectionRatio >= 0.95;
          // Also lock cards that were scrolled past without ever being fully seen (jumps, flicks).
          const passed = !!entry.rootBounds && entry.boundingClientRect.bottom <= entry.rootBounds.top;
          if (!fullyIn && !passed) return;
          observer.disconnect();
          setCardSettled((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
        },
        { threshold: [0, 0.95] },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSectionIn(true);
      setCardIn(allRevealed());
      return;
    }

    if (narrow) {
      const observers: IntersectionObserver[] = [];
      const timers: number[] = [];
      const reached = Array.from({ length: AUDIENCE_COUNT }, () => false);
      const seenBelow = Array.from({ length: AUDIENCE_COUNT }, () => false);
      let revealed = 0;
      let lastRevealAt = 0;
      let flushTimer = 0;

      // Cards reveal strictly one by one, in order: a card waits until the previous one has been
      // revealed for at least CARD_GAP_MS, so a quick scroll never fires several at once.
      const flush = () => {
        flushTimer = 0;
        if (revealed >= AUDIENCE_COUNT || !reached[revealed]) return;

        const wait = lastRevealAt + CARD_GAP_MS - performance.now();
        if (wait > 0) {
          flushTimer = window.setTimeout(flush, wait);
          timers.push(flushTimer);
          return;
        }

        const index = revealed;
        revealed += 1;
        lastRevealAt = performance.now();
        setCardIn((prev) => {
          if (prev[index]) return prev;
          const next = [...prev];
          next[index] = true;
          return next;
        });
        flush();
      };

      DOEHEALTH_DESK_AUDIENCES.forEach((_, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;
            if (!noteBelow(entry, seenBelow, index)) return;
            // Also count cards already scrolled past, so a jump never leaves the queue blocked.
            const passed = !!entry.rootBounds && entry.boundingClientRect.bottom <= entry.rootBounds.top;
            if (!entry.isIntersecting && !passed) return;
            observer.disconnect();
            reached[index] = true;
            if (!flushTimer) requestAnimationFrame(flush);
          },
          // Fire as soon as the card starts entering from the bottom, so the whole slide happens on
          // screen even during a fast flick. threshold 0: the sideways start offset must not lower
          // the ratio.
          { threshold: 0, rootMargin: "0px 0px -8% 0px" },
        );

        observer.observe(el);
        observers.push(observer);
      });

      return () => {
        for (const observer of observers) observer.disconnect();
        for (const timer of timers) window.clearTimeout(timer);
      };
    }

    const node = gridRef.current;
    if (!node) return;

    const gridSeenBelow = [false];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !noteBelow(entry, gridSeenBelow, 0)) return;
        if (entry.isIntersecting) {
          setSectionIn(true);
          setCardIn(allRevealed());
          observer.disconnect();
        }
      },
      { threshold: 0.55, rootMargin: "-18% 0px -22% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`doehealth-desk-audiences ${DOEPHONE_DESKTOP_PAGE_INSET_X}${sectionIn ? " is-in" : ""}`}
      aria-label="Built for practices, providers, patients, and students"
    >
      <div ref={gridRef} className="doehealth-desk-audiences__grid">
        {DOEHEALTH_DESK_AUDIENCES.map((audience, index) => {
          const low = index % 2 === 1;
          const filledDesk = audience.id === "practices" || audience.id === "patients";
          const filledPhone = audience.id === "practices" || audience.id === "patients";
          const headlineDarken = filledPhone ? "cream" : "ink";
          return (
            <article
              key={audience.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={`doehealth-desk-audiences__card${low ? " is-low" : " is-high"}${filledDesk ? " is-filled-desk" : ""}${filledPhone ? " is-filled-phone" : ""}${cardIn[index] ? " is-in" : ""}${cardSettled[index] ? " is-settled" : ""}`}
            >
              <div className="doehealth-desk-audiences__copy">
                <h2
                  className={`doehealth-desk-audiences__title ${p22Mackinac.className} desk-headline-darken--${headlineDarken}${cardIn[index] ? " is-headline-in" : ""}`}
                >
                  {audience.title}
                </h2>
                <p className={`doehealth-desk-audiences__dek ${inter.className}`}>
                  {audience.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
