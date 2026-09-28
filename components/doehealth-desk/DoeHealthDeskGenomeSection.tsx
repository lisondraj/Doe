"use client";

import { useEffect, useRef, useState } from "react";

import { DOEHEALTH_DESK_GENOME } from "@/lib/doehealth/doehealth-desk-genome-copy";
import { dmSans, inter, p22Mackinac } from "@/lib/home/fonts";

const SURFACES = [
  { name: "Front Desk", tag: "Voice", detail: "(416) 555-0190" },
  { name: "Chart", tag: "Note", detail: "Maya Chen · A1C 8.4" },
  { name: "Visit Reminder", tag: "SMS", detail: "Tomorrow · 9:40" },
] as const;

/** Centered Genome 1.0 — solid brown block; nav inverts on overlap only. */
export function DoeHealthDeskGenomeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: [0, 0.12, 0.28, 0.45] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="genome"
      className={`doehealth-desk-genome doehealth-desk-nav-wash-surface${shown ? " is-in" : ""}`}
      aria-label="Introducing Genome 1.0"
    >
      <div className="doehealth-desk-genome__stack">
        <p className={`doehealth-desk-genome__eyebrow ${p22Mackinac.className}`}>{DOEHEALTH_DESK_GENOME.eyebrow}</p>
        <h2 className={`doehealth-desk-genome__title ${p22Mackinac.className}`}>{DOEHEALTH_DESK_GENOME.title}</h2>
        {DOEHEALTH_DESK_GENOME.lines.map((line, index) => (
          <p
            key={line}
            className={`doehealth-desk-genome__dek-line ${inter.className}${index === 0 ? " doehealth-desk-genome__dek-line--first" : ""}`}
          >
            {line}
          </p>
        ))}
        <div className={`doehealth-desk-genome__board ${inter.className}`}>
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
