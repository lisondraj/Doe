"use client";

import { SkipButton } from "@/components/doehealth-desk2/DoeHealthDesk2AudienceSection";
import { type ReactNode, memo, useEffect, useRef, useState } from "react";

import { DOEPHONE_DESKTOP_PAGE_INSET_X } from "@/lib/doephone/section-styles";
import {
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  cssVars as vars,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";
import {
  EARLYPREVIEW_COMPLIANCE_OVERVIEW as OVERVIEW,
} from "@/lib/earlypreview/earlypreview-compliance-copy";

/**
 * Security and compliance, for investors, in one screen the scroll plays: the six pieces of the protocol as cards
 * that slide by, Doe Auth among them.
 */
const SLIDES = [{ id: "overview", nav: OVERVIEW.nav, len: 3.6 }] as const;

const FADE = 0.28;
const TIMING = SLIDES.map((slide, index) => {
  const start = SLIDES.slice(0, index).reduce((sum, item) => sum + item.len, 0);
  return { ...slide, start };
});
const END = TIMING[TIMING.length - 1].start + TIMING[TIMING.length - 1].len;

const smooth = (t: number) => t * t * (3 - 2 * t);
const en = (t: number, a: number, b: number) => smooth(ramp(t, [a, b]));
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function sceneClock(p: number, index: number) {
  const { start, len } = TIMING[index];
  const fadeIn = index === 0 ? 1 : ramp(p, [start, start + FADE]);
  const fadeOut = index === TIMING.length - 1 ? 1 : 1 - ramp(p, [start + len - FADE, start + len]);
  return { o: fadeIn * fadeOut, t: p - start };
}

function Scene({
  o,
  label,
  className = "",
  children,
}: {
  o: number;
  label: string;
  className?: string;
  children: ReactNode;
}) {
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
      className={`earlypreview-market__scene ${DOEPHONE_DESKTOP_PAGE_INSET_X} ${className}${live ? " is-live" : ""}${o <= 0.001 ? " is-gone" : ""}`}
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

/** iPhone: whether the page is the phone layout, read once mounted. */
function usePhoneLayout(ref: { current: HTMLElement | null }) {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    setPhone(!!ref.current?.closest(".doehealth-desk2-page")?.querySelector(".doephone-mobile-root"));
  }, [ref]);
  return phone;
}

type SceneProps = { p: number; phone: boolean };

/* ------------------------------------------------------------ 1 · overview */

type CardArt = (typeof OVERVIEW.cards)[number]["art"];

/** The fields drawing: a record of dots, and the six that leave it for the column on the right. */
const FIELD_GRID = { cols: 11, rows: 6, pitch: 13, x: 16, y: 32 } as const;
const FIELD_PICKS = [4, 13, 25, 31, 46, 58] as const;

/** One card's drawing in dots and lines, built by --d (0 → 1) in CSS so the scroll never re-renders its dots. */
const CardArtwork = memo(function CardArtwork({ art }: { art: CardArt }) {
  switch (art) {
    case "grant":
      return (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} style={vars({ "--j": i })}>
              <circle cx={30 + i * 30} cy={70} r={9} className="is-ring" />
              <circle cx={30 + i * 30} cy={70} r={9} className="is-grant" />
            </g>
          ))}
        </>
      );
    case "fields":
      return (
        <>
          {Array.from({ length: FIELD_GRID.cols * FIELD_GRID.rows }, (_, i) => {
            const x = FIELD_GRID.x + (i % FIELD_GRID.cols) * FIELD_GRID.pitch;
            const y = FIELD_GRID.y + Math.floor(i / FIELD_GRID.cols) * FIELD_GRID.pitch;
            const f = FIELD_PICKS.indexOf(i as (typeof FIELD_PICKS)[number]);
            if (f < 0) return <circle key={i} cx={x} cy={y} r={3.4} className="is-rest" style={vars({ "--j": i })} />;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4.2}
                className="is-pick"
                style={vars({ "--j": i, "--f": f, "--dx": 214 - x, "--dy": 30 + f * 15 - y })}
              />
            );
          })}
        </>
      );
    case "matrix":
      return (
        <>
          {Array.from({ length: 14 * 7 }, (_, i) => {
            const c = i % 14;
            const r = Math.floor(i / 14);
            return <circle key={i} cx={22 + c * 15} cy={26 + r * 15} r={3.4} className={c === 9 && r === 3 ? "is-fail" : "is-run"} style={vars({ "--c": c })} />;
          })}
        </>
      );
    case "ledger":
      return (
        <>
          {[176, 132, 190, 150, 118, 168, 140].map((length, i) => (
            <g key={i} style={vars({ "--j": i })}>
              <circle cx={24} cy={22 + i * 16} r={4} className={i === 2 ? "is-mark is-salmon" : "is-mark"} />
              <path d={`M38 ${22 + i * 16}h${length}`} className="is-entry" />
            </g>
          ))}
        </>
      );
    case "tenants":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => {
            const x = 14 + (i % 3) * 74;
            const y = 22 + Math.floor(i / 3) * 56;
            return (
              <g key={i} style={vars({ "--j": i })}>
                <rect x={x} y={y} width={64} height={46} rx={10} className="is-wall" />
                {Array.from({ length: 6 }, (_, k) => (
                  <circle key={k} cx={x + 16 + (k % 3) * 16} cy={y + 15 + Math.floor(k / 3) * 16} r={3.2} className="is-inside" />
                ))}
              </g>
            );
          })}
        </>
      );
    case "stairs":
      return (
        <>
          {[0, 1, 2, 3].flatMap((c) =>
            Array.from({ length: 3 * (c + 1) * 2 }, (_, k) => (
              <circle
                key={`${c}-${k}`}
                cx={32 + c * 52 + (k % 3) * 13}
                cy={124 - Math.floor(k / 3) * 13}
                r={3.6}
                className={c === 3 ? "is-step is-salmon" : "is-step"}
                style={vars({ "--c": c })}
              />
            )),
          )}
        </>
      );
  }
});

/** The card track's step (one card and its gap) and how far it can move before its last card meets the edge. */
function useTrackMetrics(trackRef: { current: HTMLElement | null }) {
  const [metrics, setMetrics] = useState({ step: 0, max: 0 });
  useEffect(() => {
    const track = trackRef.current;
    const frame = track?.parentElement;
    if (!track || !frame) return undefined;
    const measure = () => {
      const [first, second] = Array.from(track.children) as HTMLElement[];
      const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
      const max = Math.max(0, track.scrollWidth - frame.clientWidth);
      setMetrics((prev) => (prev.step === step && prev.max === max ? prev : { step, max }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [trackRef]);
  return metrics;
}

/** Where the focus walks the cards on the screen's clock. */
const FOCUS = [0.95, 3.25] as const;

/**
 * The overview: the protocol's six pieces as cards that slide by one at a time. The focus rests on a card, then
 * moves to the next; the focused card is fully lit at the page edge and builds its drawing, the rest wait dimmed
 * beside it. Each card leads with its drawing and one figure; the quarter it lands in sits in its corner.
 */
function OverviewScene({ p, phone }: SceneProps) {
  const { o, t } = sceneClock(p, 0);
  const trackRef = useRef<HTMLOListElement>(null);
  const { step, max } = useTrackMetrics(trackRef);
  const count = OVERVIEW.cards.length;
  const u = ramp(t, FOCUS) * (count - 1);
  const base = Math.floor(u);
  // Rest on each card for the first part of its share of the scroll, then move to the next.
  const focus = Math.min(count - 1, base + smooth(clamp01((u - base - 0.4) / 0.6)));
  return (
    <Scene o={o} label="Six pieces, one protocol">
      <SceneTitle title={OVERVIEW.title} t={t} />
      <div className="earlypreview-market__body">
        <div className="earlypreview-compliance__deck">
          <ol ref={trackRef} className="earlypreview-compliance__cards" style={{ transform: `translateX(${-Math.min(focus * step, max)}px)` }}>
            {OVERVIEW.cards.map((card, i) => {
              const near = clamp01(1 - Math.abs(focus - i));
              // iPhone: the card in focus fills its dots while the focus rests on it, then the focus moves to the next
              // card, which fills in turn; a filled card stays filled. The last fills once the focus reaches it.
              const built = phone
                ? i === 0
                  ? en(t, 0.55, 1.05)
                  : i === count - 1
                    ? en(t, FOCUS[1], FOCUS[1] + 0.28)
                    : smooth(clamp01((u - i) / 0.4))
                : i === 0
                  ? en(t, 0.55, 1.05)
                  : clamp01((focus - i + 0.6) / 0.6);
              return (
                <li
                  key={card.id}
                  className="earlypreview-compliance__card"
                  style={vars({ "--e": en(t, 0.35 + i * 0.06, 0.65 + i * 0.06), "--a": near })}
                  aria-current={near > 0.5 ? "true" : undefined}
                >
                  <span className="earlypreview-compliance__card-when">{card.when}</span>
                  <svg className={`earlypreview-compliance__card-art is-${card.art}`} viewBox="0 0 240 140" fill="none" style={vars({ "--d": built })} aria-hidden>
                    <CardArtwork art={card.art} />
                  </svg>
                  <h3 className="earlypreview-compliance__card-name">{card.name}</h3>
                  <p className="earlypreview-compliance__card-line">{card.line}</p>
                  <p className="earlypreview-compliance__card-figure">
                    <strong>{card.figure}</strong>
                    <span>{card.caption}</span>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Scene>
  );
}

/* ------------------------------------------------------------ section */

const SCENES = [OverviewScene].map((scene) => memo(scene));

/** The brown band above the invite: security and compliance, scroll-locked like the market section. */
export function EarlyPreviewComplianceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);
  const phone = usePhoneLayout(sectionRef);
  return (
    <div className="earlypreview-market-track" style={vars({ "--market-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
      <section ref={sectionRef} className="earlypreview-market earlypreview-compliance doehealth-desk2-nav-wash-surface" aria-label="Compliance and security">
        {SCENES.map((Screen, index) => {
          const slide = TIMING[index];
          return <Screen key={slide.id} phone={phone} p={Math.min(slide.start + slide.len + 0.001, Math.max(slide.start - 0.001, p))} />;
        })}
        <SkipButton shown={p > 0 && p < END} label="Skip the compliance section" onClick={skip} />
      </section>
    </div>
  );
}
