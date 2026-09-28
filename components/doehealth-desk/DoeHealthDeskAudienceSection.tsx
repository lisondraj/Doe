"use client";

import { useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import { DOEHEALTH_DESK_AUDIENCES } from "@/lib/doehealth/doehealth-desk-audiences";
import { inter, p22Mackinac } from "@/lib/home/fonts";

const AUDIENCE_COUNT = DOEHEALTH_DESK_AUDIENCES.length;

function allRevealed() {
  return Array.from({ length: AUDIENCE_COUNT }, () => true);
}

export function DoeHealthDeskAudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [sectionIn, setSectionIn] = useState(false);
  const [cardIn, setCardIn] = useState<boolean[]>(() => Array.from({ length: AUDIENCE_COUNT }, () => false));

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 1023px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSectionIn(true);
      setCardIn(allRevealed());
      return;
    }

    if (narrow) {
      const observers: IntersectionObserver[] = [];

      // Every card reveals on its own once it is clearly on screen (cards start shifted sideways,
      // so the ratio is lower than the card's real visibility).
      DOEHEALTH_DESK_AUDIENCES.forEach((_, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            requestAnimationFrame(() => {
              setCardIn((prev) => {
                if (prev[index]) return prev;
                const next = [...prev];
                next[index] = true;
                return next;
              });
            });
            observer.disconnect();
          },
          { threshold: 0.35, rootMargin: "0px 0px -14% 0px" },
        );

        observer.observe(el);
        observers.push(observer);
      });

      return () => {
        for (const observer of observers) observer.disconnect();
      };
    }

    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
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
              className={`doehealth-desk-audiences__card${low ? " is-low" : " is-high"}${filledDesk ? " is-filled-desk" : ""}${filledPhone ? " is-filled-phone" : ""}${cardIn[index] ? " is-in" : ""}`}
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
