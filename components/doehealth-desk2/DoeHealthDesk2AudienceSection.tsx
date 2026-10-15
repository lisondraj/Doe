"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import { DoeHealthDesk2FindScenes, DOEHEALTH_DESK2_FIND_SPAN } from "@/components/doehealth-desk2/DoeHealthDesk2FindScenes";
import { DOEHEALTH_DESK2_NAV_WASH_EVENT } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";

import {
  DOEHEALTH_DESK2_VISIBLE,
  DOEHEALTH_DESK2_VISIBLE_INTRO,
  DOEHEALTH_DESK2_VISIBLE_THREAD,
} from "@/lib/doehealthdesk2/doehealthdesk2-story-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { WAITLIST_PATH } from "@/lib/site-domains";
import { cssVars as vars, scrollRamp as ramp, useDoeHealthDesk2ScrollLock } from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";

/**
 * Every motion is a ramp over scroll progress: [start, end] in progress units. Nothing runs on a
 * timer or a CSS transition, so scrolling is the only clock.
 */
const RAMP = {
  introSwipe: [0, 0.7],
  introFade: [0.9, 1.3],
  threadIn: [1.3, 1.4],
  phone: [1.3, 2.1],
  zoom: [2.2, 3.0],
  ask: [2.3, 2.7],
  reply: [2.7, 3.1],
  caption: [3.2, 3.6],
  /** The bubbles and caption fade while the phone's details undraw in reverse, leaving its body. */
  chatOut: [4.0, 4.15],
  unbuild: [4.0, 4.3],
  /** The body's outline morphs into the first drawing's frame as the beige comes in under it. */
  morph: [4.3, 4.9],
  beigeIn: [4.35, 4.75],
} as const;
/** The beige layer runs on its own progress, starting here, when the morph lands on its frame. */
const FIND_FROM = RAMP.morph[1];
const FINAL = {
  beigeOut: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 0.3],
  titleIn: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 0.3, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 0.5],
  titleSwipe: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 0.4, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.2],
  prompt: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.4, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.8],
  promptSwipe: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.4, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 2.0],
  /** The search box's pink outline draws in as the prompt lands. */
  search: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.4, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 1.95],
} as const;
/** Progress at which the lock releases going down (going up releases below 0). */
const END = FINAL.promptSwipe[1];

/** Same icon as the /doehealthdesk skip button; CSS turns it to point down. */
function SkipIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 5.5 13 12 7 18.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.35 5.5v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** 0 → 1 as `t` moves through [k, k + w]: one stroke's share of the phone drawing. */
const seg = (t: number, k: number, w: number) => Math.min(1, Math.max(0, (t - k) / w));
/** Eases the phone's grow so it settles instead of stopping dead. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * The search box's outline, in peach. It measures its box so the stroke fits any size; `draw` (0 to 1)
 * traces it in, like the iPhone and the carousel drawings.
 */
function SearchOutline({ draw, box }: { draw: number; box: RefObject<HTMLElement> }) {
  const [size, setSize] = useState({ w: 0, h: 0, r: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      const r = parseFloat(getComputedStyle(el).borderRadius) || 0;
      setSize({ w: el.clientWidth, h: el.clientHeight, r });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [box]);

  const { w, h, r } = size;
  return (
    <svg className="doehealth-desk2-visible__search-line" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={vars({ "--draw": draw })}>
      {w > 0 ? (
        <rect x={0.75} y={0.75} width={Math.max(0, w - 1.5)} height={Math.max(0, h - 1.5)} rx={Math.max(0, r - 0.75)} pathLength={1} />
      ) : null}
    </svg>
  );
}

/** Full iPhone (390 x 844, as in video1) in peach outline, traced in as `t` goes 0 to 1. */
function PhoneOutline({ t, body }: { t: number; body: boolean }) {
  const draw = (k: number, w: number) => vars({ "--draw": seg(t, k, w) });
  return (
    <svg className="doehealth-desk2-visible__iphone-svg" viewBox="0 0 390 844" fill="none" aria-hidden="true">
      {body ? <rect x="2" y="2" width="386" height="840" rx="62" pathLength={1} style={draw(0, 0.55)} /> : null}
      <rect x="16" y="16" width="358" height="812" rx="50" pathLength={1} className="is-soft" style={draw(0.15, 0.55)} />
      <rect x="146" y="34" width="98" height="28" rx="14" pathLength={1} style={draw(0.45, 0.2)} />
      <path d="M-2 168v34M-2 232v62M-2 312v62M392 256v104" pathLength={1} className="is-soft" style={draw(0.5, 0.25)} />
      <circle cx="44" cy="772" r="18" pathLength={1} className="is-soft" style={draw(0.65, 0.2)} />
      <rect x="74" y="750" width="286" height="44" rx="22" pathLength={1} className="is-soft" style={draw(0.7, 0.25)} />
      <path d="M136 816h118" pathLength={1} style={draw(0.85, 0.15)} />
    </svg>
  );
}

type Outline = { x: number; y: number; w: number; h: number; r: number; s: number };
const PEACH = [252, 207, 184];
const DEEP_BEIGE = [110, 92, 64];

/**
 * The phone's body outline taking over from the phone, then morphing (place, size, corners, stroke,
 * peach to deep beige) into the first beige drawing's frame. Both ends are measured in the section, so
 * it lands exactly on the frame the beige layer then keeps. `m` (0 to 1) is the morph.
 */
function MorphOutline({ m, section }: { m: number; section: RefObject<HTMLElement> }) {
  const [ends, setEnds] = useState<{ w: number; h: number; from: Outline; to: Outline } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const root = section.current;
      const phone = root?.querySelector(".doehealth-desk2-visible__iphone");
      const art = root?.querySelector(".doehealth-desk2-find__art");
      if (!root || !phone || !art) return;
      const o = root.getBoundingClientRect();
      const a = phone.getBoundingClientRect();
      const b = art.getBoundingClientRect();
      setEnds({
        w: o.width,
        h: o.height,
        from: { x: a.left - o.left + (a.width * 2) / 390, y: a.top - o.top + (a.height * 2) / 844, w: (a.width * 386) / 390, h: (a.height * 840) / 844, r: (a.width * 62) / 390, s: (a.width * 1.6) / 390 },
        to: { x: b.left - o.left + (b.width * 20) / 400, y: b.top - o.top + (b.height * 30) / 320, w: (b.width * 360) / 400, h: (b.height * 260) / 320, r: (b.width * 16) / 400, s: (b.width * 1.4) / 400 },
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [section]);

  if (!ends) return null;
  const k = smooth(m);
  const mix = (a: number, b: number) => a + (b - a) * k;
  const { from: f, to: t } = ends;
  const [r, g, b] = PEACH.map((c, i) => Math.round(mix(c, DEEP_BEIGE[i])));
  return (
    <svg className="doehealth-desk2-visible__morph" viewBox={`0 0 ${ends.w} ${ends.h}`} fill="none" aria-hidden="true" style={vars({ "--m": k })}>
      <rect x={mix(f.x, t.x)} y={mix(f.y, t.y)} width={mix(f.w, t.w)} height={mix(f.h, t.h)} rx={mix(f.r, t.r)} stroke={`rgb(${r} ${g} ${b})`} strokeWidth={mix(f.s, t.s)} />
    </svg>
  );
}

type SwipePart = { readonly text: string; readonly tone: "cream" | "salmon" };

/**
 * Two layers with identical geometry, each with one swipe gradient across the WHOLE title, so the
 * sweep runs as one piece. The cream layer shows the cream words, the peach layer the peach.
 * `s` (0 to 1) is the sweep position, set by scroll.
 */
function SwipeTitle({ parts, s, lines = false, wide = false }: { parts: readonly SwipePart[]; s: number; lines?: boolean; wide?: boolean }) {
  const linesClass = lines ? " is-lines" : "";
  return (
    <div className={`doehealth-desk2-visible__title-wrap${wide ? " doehealth-desk2-visible__title-wrap--wide" : ""}`}>
      <h2
        className={`doehealth-desk2-visible__title${linesClass} desk2-genome-swipe desk2-genome-swipe--cream`}
        style={vars({ "--s": s })}
      >
        {parts.map((part) => (
          <span key={part.text} className={part.tone === "salmon" ? "is-off" : undefined}>
            {part.text}
          </span>
        ))}
      </h2>
      <h2
        aria-hidden="true"
        className={`doehealth-desk2-visible__title doehealth-desk2-visible__title--overlay${linesClass} desk2-genome-swipe desk2-genome-swipe--salmon`}
        style={vars({ "--s": s })}
      >
        {parts.map((part) => (
          <span key={part.text} className={part.tone === "cream" ? "is-off" : undefined}>
            {part.text}
          </span>
        ))}
      </h2>
    </div>
  );
}

/**
 * Brown section, one screen tall. When it reaches the top of the viewport the page holds still and
 * scrolling steps through its scenes: the intro, the iMessage thread, a beige stretch (with the nav
 * switching to its light look), then the closing brown scene. At either end the lock releases; once
 * the closing scene is reached the section stays on it.
 */
export function DoeHealthDesk2AudienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { p, skip } = useDoeHealthDesk2ScrollLock(sectionRef, END);

  const thread = DOEHEALTH_DESK2_VISIBLE_THREAD;
  const introOpacity = 1 - ramp(p, RAMP.introFade);
  const threadOpacity = ramp(p, RAMP.threadIn) * (1 - ramp(p, [RAMP.unbuild[1], RAMP.unbuild[1] + 0.05]));
  const chatOpacity = 1 - ramp(p, RAMP.chatOut);
  /** From here to FIND_FROM the morph outline stands in for the phone's body. */
  const morphing = p >= RAMP.unbuild[0] && p < FIND_FROM;
  const beige = ramp(p, RAMP.beigeIn) * (1 - ramp(p, FINAL.beigeOut));
  const titleOpacity = ramp(p, FINAL.titleIn);
  const searchShown = ramp(p, FINAL.prompt);
  const searchRef = useRef<HTMLFormElement>(null);
  const search = DOEHEALTH_DESK2_VISIBLE.search;

  const navWash = (1 - beige).toFixed(3);
  useEffect(() => {
    window.dispatchEvent(new Event(DOEHEALTH_DESK2_NAV_WASH_EVENT));
  }, [navWash]);

  return (
    <section
      ref={sectionRef}
      className={`doehealth-desk2-visible doehealth-desk2-nav-wash-surface ${p22Mackinac.className}`}
      data-nav-wash={navWash}
      data-nav-beige={beige.toFixed(4)}
      aria-label="Personal agents and your clinic"
    >
      <div className="doehealth-desk2-visible__scene" style={vars({ "--o": introOpacity })} aria-hidden={introOpacity < 0.5}>
        {/* The dot wave along the bottom; it fades with this scene, so it's gone once the iPhone comes in. */}
        {/* Revealed by the same swipe as this intro's title (--s), so the two start together. */}
        {/* Mounted only while the intro shows: its canvas redraws every frame, which is heavy on an iPhone. */}
        {introOpacity > 0.01 ? (
          <div className="doehealth-desk2-visible__dots" style={vars({ "--s": ramp(p, RAMP.introSwipe) })}>
            <div className="doehealth-desk2-visible__dots-fade">
              <DoeHealthBlogDotWave color="rgba(252, 207, 184, 0.6)" top={0.3} amp={60} fade={0.5} />
            </div>
          </div>
        ) : null}
        <SwipeTitle parts={DOEHEALTH_DESK2_VISIBLE_INTRO} s={ramp(p, RAMP.introSwipe)} lines wide />
      </div>

      <div className="doehealth-desk2-visible__scene" style={vars({ "--o": threadOpacity })} aria-hidden={threadOpacity < 0.5}>
        {/* The phone draws in whole, then grows toward the left until only its lower part shows. */}
        <div className="doehealth-desk2-visible__stage" style={vars({ "--z": smooth(ramp(p, RAMP.zoom)) })}>
          <div className="doehealth-desk2-visible__iphone">
            <PhoneOutline t={ramp(p, RAMP.phone) - ramp(p, RAMP.unbuild)} body={p < RAMP.unbuild[0]} />
            <div className="doehealth-desk2-visible__chat" style={{ opacity: chatOpacity }}>
              <div className="doehealth-desk2-visible__thread">
                <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--center" style={vars({ "--e": ramp(p, RAMP.ask) })}>
                  <p className="doehealth-desk2-visible__stamp">
                    <strong>{thread.day}</strong> {thread.time}
                  </p>
                </div>
                <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--out" style={vars({ "--e": ramp(p, RAMP.ask) })}>
                  <p className="doehealth-desk2-visible__bubble doehealth-desk2-visible__bubble--out">{thread.ask}</p>
                </div>
                <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--in" style={vars({ "--e": ramp(p, RAMP.reply) })}>
                  <p className="doehealth-desk2-visible__bubble">{thread.reply}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="doehealth-desk2-visible__caption" style={vars({ "--e": ramp(p, RAMP.caption) * chatOpacity })}>
          {thread.caption.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>

      <div className="doehealth-desk2-find" style={vars({ "--o": beige })} aria-hidden={beige < 0.5}>
        {p >= RAMP.unbuild[0] && p < FINAL.beigeOut[1] ? <DoeHealthDesk2FindScenes p={p - FIND_FROM} /> : null}
      </div>

      {morphing ? <MorphOutline m={ramp(p, RAMP.morph)} section={sectionRef} /> : null}

      <div className="doehealth-desk2-visible__scene" style={vars({ "--o": titleOpacity })} aria-hidden={titleOpacity < 0.5}>
        {/* Halftone tides along both side edges, rolling in motion behind the closing title. */}
        {/* Revealed by the same swipe as the title (--s), so the two start together. */}
        {/* Mounted only while the closing title shows, for the same reason as the intro dots. */}
        {titleOpacity > 0.01 ? (
          <div className="doehealth-desk2-visible__tide" style={vars({ "--s": ramp(p, FINAL.titleSwipe) })}>
            <DoeHealthDesk2DotTide color="rgba(252, 207, 184, 0.6)" />
          </div>
        ) : null}
        <SwipeTitle parts={DOEHEALTH_DESK2_VISIBLE.title} s={ramp(p, FINAL.titleSwipe)} />
        <p className="doehealth-desk2-visible__sub" style={vars({ "--e": ramp(p, FINAL.prompt) })}>
          <span className="desk2-genome-swipe desk2-genome-swipe--salmon" style={vars({ "--s": ramp(p, FINAL.promptSwipe) })}>
            {DOEHEALTH_DESK2_VISIBLE.prompt}
          </span>
        </p>
        <form ref={searchRef} className={`doehealth-desk2-visible__search ${inter.className}`} action={WAITLIST_PATH} method="get" style={vars({ "--e": searchShown })}>
          <SearchOutline draw={ramp(p, FINAL.search)} box={searchRef} />
          <input
            type="text"
            name="website"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            aria-label={search.label}
            placeholder={search.placeholder}
            tabIndex={searchShown < 0.5 ? -1 : undefined}
          />
          <button type="submit" aria-label={search.submit} tabIndex={searchShown < 0.5 ? -1 : undefined}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      {p > 0 && p < END ? (
        <button type="button" className="doehealth-desk2-visible__skip" style={vars({ "--b": beige })} aria-label="Skip to see if your clinic was included" onClick={skip}>
          <SkipIcon />
        </button>
      ) : null}
    </section>
  );
}
