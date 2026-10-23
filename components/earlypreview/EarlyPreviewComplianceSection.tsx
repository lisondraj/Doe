"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";

/**
 * Compliance and security through Seed, for the U.S. and Canada. Four screens in the market section's
 * style: the plan, Canada, the United States, then the controls both countries share.
 */
const SLIDES = [
  {
    id: "plan",
    nav: "Plan",
    label: "Compliance and security, through Seed",
    title: ["Compliance & Security.", "Through Seed, U.S. and Canada."],
    items: [
      { mark: "By Seed", detail: "One plan, for clinics in the U.S. and Canada.", salmon: false },
      { mark: "Canada", detail: "PIPEDA and PHIPA ready for the Toronto clinics.", salmon: true },
      { mark: "United States", detail: "HIPAA and a BAA in place for each pilot site.", salmon: true },
      { mark: "Both", detail: "SOC 2 Type I complete. Type II underway through Seed.", salmon: false },
    ],
  },
  {
    id: "canada",
    nav: "Canada",
    label: "Canada, PIPEDA and PHIPA",
    title: ["Canada.", "PIPEDA and PHIPA."],
    items: [
      { mark: "PIPEDA", detail: "Federal privacy, ready by Seed.", salmon: true },
      { mark: "PHIPA", detail: "Ontario health privacy, for the Toronto clinics.", salmon: true },
      { mark: "In Canada", detail: "Canadian clinic data stays in Canada.", salmon: false },
      { mark: "Consent", detail: "A clinic sees who reached its page, and why.", salmon: false },
    ],
  },
  {
    id: "us",
    nav: "U.S.",
    label: "The United States, HIPAA for the pilot",
    title: ["The United States.", "HIPAA for the pilot."],
    items: [
      { mark: "HIPAA", detail: "Safeguards in place before the first U.S. site.", salmon: true },
      { mark: "BAA", detail: "A business associate agreement with each pilot clinic.", salmon: true },
      { mark: "Private compute", detail: "Patient information stays off a general model.", salmon: false },
      { mark: "Same controls", detail: "The pilot runs what Toronto already runs.", salmon: false },
    ],
  },
  {
    id: "controls",
    nav: "Controls",
    label: "One control set, across both countries",
    title: ["One control set.", "Across both countries."],
    items: [
      { mark: "SOC 2 I", detail: "Complete.", salmon: true },
      { mark: "SOC 2 II", detail: "Underway through Seed.", salmon: true },
      { mark: "Encryption", detail: "In transit and at rest, in both countries.", salmon: false },
      { mark: "Audit", detail: "Every agent action is written down.", salmon: false },
    ],
  },
] as const;

const LEN = 2;
const FADE = 0.28;
const TIMING = SLIDES.map((slide, index) => ({ ...slide, start: index * LEN, len: LEN }));
const END = TIMING[TIMING.length - 1].start + LEN;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));

function sceneClock(p: number, index: number) {
  const { start, len } = TIMING[index];
  const fadeIn = index === 0 ? 1 : ramp(p, [start, start + FADE]);
  const fadeOut = index === TIMING.length - 1 ? 1 : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

function Scene({ o, label, children }: { o: number; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = o > 0.5;
  useEffect(() => {
    if (ref.current) ref.current.inert = !live;
  }, [live]);
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      aria-hidden={!live}
      className={`earlypreview-market__scene ${DOEPHONE_DESKTOP_PAGE_INSET_X}${live ? " is-live" : ""}${o <= 0.001 ? " is-gone" : ""}`}
      style={vars({ "--o": o })}
    >
      {children}
    </div>
  );
}

function SceneTitle({ title, t }: { title: readonly string[]; t: number }) {
  const s = ramp(t, [0.04, 0.62]);
  return (
    <h2 className="earlypreview-market__title">
      {title.map((line, index) => (
        <span key={line} className={`earlypreview-market__swipe${index === 1 ? " is-salmon" : ""}`} style={vars({ "--s": s })}>
          {line}
        </span>
      ))}
    </h2>
  );
}

function Slide({ p, index }: { p: number; index: number }) {
  const slide = TIMING[index];
  const { o, t } = sceneClock(p, index);
  return (
    <Scene o={o} label={slide.label}>
      <SceneTitle title={slide.title} t={t} />
      <div className="earlypreview-market__body">
        <ul className="earlypreview-compliance__items">
          {slide.items.map((item, i) => (
            <li
              key={item.mark}
              className={`earlypreview-compliance__item${item.salmon ? " is-salmon" : ""}`}
              style={vars({ "--e": en(t, 0.28 + i * 0.12, 0.62 + i * 0.12) })}
            >
              <span className="earlypreview-compliance__mark">{item.mark}</span>
              <p className="earlypreview-compliance__detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}

function SceneNav({ p, goTo }: { p: number; goTo: (target: number) => void }) {
  return (
    <nav className={`earlypreview-market__nav ${DOEPHONE_DESKTOP_PAGE_INSET_X}`} aria-label="Compliance and security">
      {TIMING.map((slide, index) => {
        const live = p >= slide.start && (p < slide.start + slide.len || index === TIMING.length - 1);
        return (
          <button
            key={slide.id}
            type="button"
            className={`earlypreview-market__nav-item${live ? " is-live" : ""}`}
            style={vars({ "--f": ramp(p, [slide.start, slide.start + slide.len]) })}
            aria-current={live ? "step" : undefined}
            onClick={() => goTo(slide.start + (index === 0 ? 0.2 : FADE))}
          >
            <span className="earlypreview-market__nav-line" aria-hidden />
            <span className="earlypreview-market__nav-label">{slide.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** The blank brown band above the footer: compliance and security, four screens through Seed. */
export function EarlyPreviewComplianceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip, goTo } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market earlypreview-compliance doehealth-desk2-nav-wash-surface" aria-label="Compliance and security through Seed">
        {TIMING.map((slide, index) => (
          <Slide key={slide.id} p={Math.min(slide.start + slide.len + 0.001, Math.max(slide.start - 0.001, p))} index={index} />
        ))}
        <SceneNav p={p} goTo={goTo} />
        {p > 0 && p < END ? (
          <button type="button" className="doehealth-desk2-visible__skip" aria-label="Skip the compliance section" onClick={skip}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 5.5 13 12 7 18.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.35 5.5v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </section>
    </div>
  );
}
