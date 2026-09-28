"use client";

import { useEffect, useRef, useState } from "react";

import { DOEHEALTH_DESK_GENOME, doehealthDeskGenomeTiming } from "@/lib/doehealth/doehealth-desk-genome-copy";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

const SURFACES = [
  { name: "Front Desk", tag: "Voice", detail: "(416) 555-0190" },
  { name: "Chart", tag: "Note", detail: "Maya Chen · A1C 8.4" },
  { name: "Visit Reminder", tag: "SMS", detail: "Tomorrow · 9:40" },
] as const;

/** Centered Genome 1.0 — solid brown block; nav inverts on overlap only. */
export function DoeHealthDeskGenomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [introIn, setIntroIn] = useState(false);
  const [highlightIn, setHighlightIn] = useState(false);
  const [bodySegmentsIn, setBodySegmentsIn] = useState<boolean[]>(() =>
    Array.from({ length: 1 + DOEHEALTH_DESK_GENOME.lines.length }, () => false),
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroIn(true);
      setHighlightIn(true);
      setBodySegmentsIn(Array.from({ length: 1 + DOEHEALTH_DESK_GENOME.lines.length }, () => true));
      return;
    }

    const timers: number[] = [];
    const timing = doehealthDeskGenomeTiming(!window.matchMedia("(max-width: 1023px)").matches);
    const highlightStartMs = timing.startDelayMs + timing.introRevealMs;
    const bodyStartMs =
      highlightStartMs + timing.darkenDelayMs + Math.round(timing.darkenMs * timing.bodyAfterDarkenRatio);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.28) continue;

          timers.push(window.setTimeout(() => setIntroIn(true), timing.startDelayMs));

          timers.push(
            window.setTimeout(() => {
              setHighlightIn(true);
            }, highlightStartMs),
          );

          timers.push(
            window.setTimeout(() => {
              const dekCount = DOEHEALTH_DESK_GENOME.lines.length;
              for (let index = 0; index < dekCount; index += 1) {
                timers.push(
                  window.setTimeout(() => {
                    setBodySegmentsIn((current) => {
                      if (current[index]) return current;
                      const updated = [...current];
                      updated[index] = true;
                      return updated;
                    });
                  }, index * timing.dekStaggerMs),
                );
              }
              timers.push(
                window.setTimeout(() => {
                  setBodySegmentsIn((current) => {
                    const boardIndex = dekCount;
                    if (current[boardIndex]) return current;
                    const updated = [...current];
                    updated[boardIndex] = true;
                    return updated;
                  });
                }, dekCount * timing.dekStaggerMs + timing.boardAfterDekMs),
              );
            }, bodyStartMs),
          );

          observer.disconnect();
        }
      },
      { threshold: [0, 0.12, 0.28, 0.45] },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, []);

  const bodySegmentClass = (bodyIndex: number) => (bodySegmentsIn[bodyIndex] ? " is-segment-in" : "");

  const highlightClass = (delay: boolean) =>
    highlightIn ? ` desk-genome-headline-highlight${delay ? " desk-genome-headline-highlight--delay" : ""} is-headline-in` : "";

  return (
    <section
      ref={sectionRef}
      id="genome"
      className="doehealth-desk-genome doehealth-desk-nav-wash-surface"
      aria-label="Introducing Genome 1.0"
    >
      <div className="doehealth-desk-genome__stack">
        <div className={`doehealth-desk-genome__intro${introIn ? " is-segment-in" : ""}${highlightIn ? " is-highlight-active" : ""}`}>
          <p className={`doehealth-desk-genome__eyebrow ${p22Mackinac.className}${highlightClass(false)}`}>
            {DOEHEALTH_DESK_GENOME.eyebrow}
          </p>
          <h2 className={`doehealth-desk-genome__title ${p22Mackinac.className}${highlightClass(true)}`}>
            {DOEHEALTH_DESK_GENOME.title}
          </h2>
        </div>
        {DOEHEALTH_DESK_GENOME.lines.map((line, index) => (
          <p
            key={line}
            className={`doehealth-desk-genome__dek-line ${inter.className}${index === 0 ? " doehealth-desk-genome__dek-line--first" : ""}${bodySegmentClass(index)}`}
          >
            {line}
          </p>
        ))}
        <div className={`doehealth-desk-genome__board ${inter.className}${bodySegmentClass(DOEHEALTH_DESK_GENOME.lines.length)}`}>
          <header className="doehealth-desk-genome__board-head">
            <div>
              <strong className={dmSans.className}>Westfield</strong>
              <small>Clinic genome</small>
            </div>
            <em>1.0</em>
          </header>
          <ul>
            {SURFACES.map((surface) => (
              <li key={surface.name}>
                <span>
                  <b className={dmSans.className}>{surface.name}</b>
                  <small>{surface.detail}</small>
                </span>
                <i>{surface.tag}</i>
              </li>
            ))}
          </ul>
          <footer>Trained on 1,284 finished tasks</footer>
        </div>
      </div>
    </section>
  );
}
