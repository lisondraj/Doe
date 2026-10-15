"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { DoeHealthBlogDotWave } from "@/components/doehealth-blog/DoeHealthBlogDotWave";
import { DoeHealthDesk2DotTide } from "@/components/doehealth-desk2/DoeHealthDesk2DotTide";
import {
  DoeHealthDesk2FindScenes,
  DOEHEALTH_DESK2_FIND_ARRIVALS,
  DOEHEALTH_DESK2_FIND_FRAME,
  DOEHEALTH_DESK2_FIND_LAST,
  DOEHEALTH_DESK2_FIND_SPAN,
  pairUp,
} from "@/components/doehealth-desk2/DoeHealthDesk2FindScenes";
import { DOEHEALTH_DESK2_NAV_WASH_EVENT } from "@/components/doehealth-desk2/DoeHealthDesk2NavWash";

import {
  DOEHEALTH_DESK2_VISIBLE,
  DOEHEALTH_DESK2_VISIBLE_INTRO,
  DOEHEALTH_DESK2_VISIBLE_THREAD,
} from "@/lib/doehealthdesk2/doehealthdesk2-story-copy";
import { inter, p22Mackinac } from "@/lib/home/fonts";
import { WAITLIST_PATH } from "@/lib/site-domains";
import {
  cssVars as vars,
  DOEHEALTH_DESK2_PHONE_STEP_PX,
  scrollRamp as ramp,
  useDoeHealthDesk2ScrollLock,
} from "@/lib/doehealthdesk2/use-doehealthdesk2-scroll-lock";

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
  /** The thread draws in: "Today", the question, then the reply. */
  stamp: [2.3, 2.5],
  ask: [2.35, 2.7],
  reply: [2.7, 3.1],
  caption: [3.2, 3.6],
  /** The caption fades while the thread's text undraws; the phone and the bubbles keep their outlines. */
  chatOut: [4.0, 4.15],
  /** The thread's text undraws in reverse: the reply, the question, then "Today". */
  replyOut: [4.0, 4.12],
  askOut: [4.05, 4.2],
  stampOut: [4.1, 4.25],
  unbuild: [4.0, 4.3],
  /** Every outline of the phone and the bubbles morphs into the first drawing as the beige comes in under it. */
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
  /** The last beige drawing morphs into the search box's peach outline as the beige goes; its field and arrow come with the prompt. */
  toBox: [FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN, FIND_FROM + DOEHEALTH_DESK2_FIND_SPAN + 0.7],
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
 * A peach outline around `box` (the search box, a chat bubble). It measures its box so the stroke fits
 * any size; `draw` (0 to 1) traces it in, like the iPhone and the carousel drawings.
 */
function TracedOutline({ draw, box, className }: { draw: number; box: RefObject<HTMLElement>; className: string }) {
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
    <svg className={className} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={vars({ "--draw": draw })}>
      {w > 0 ? (
        <rect x={0.75} y={0.75} width={Math.max(0, w - 1.5)} height={Math.max(0, h - 1.5)} rx={Math.max(0, r - 0.75)} pathLength={1} />
      ) : null}
    </svg>
  );
}

/**
 * A chat bubble: `line` (0 to 1) traces its outline, `text` (0 to 1) sweeps its text in. The outline is
 * handed to the morph when the phone turns into the first beige drawing.
 */
function DrawnBubble({ text, line, sweep, out = false }: { text: string; line: number; sweep: number; out?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  return (
    <p ref={ref} className={`doehealth-desk2-visible__bubble${out ? " doehealth-desk2-visible__bubble--out" : ""}`}>
      <TracedOutline draw={line} box={ref} className="doehealth-desk2-visible__bubble-line" />
      <span className="desk2-genome-swipe desk2-genome-swipe--salmon" style={vars({ "--s": sweep })}>
        {text}
      </span>
    </p>
  );
}

/** Full iPhone (390 x 844, as in video1) in peach outline, traced in as `t` goes 0 to 1. */
function PhoneOutline({ t }: { t: number }) {
  const draw = (k: number, w: number) => vars({ "--draw": seg(t, k, w) });
  return (
    <svg className="doehealth-desk2-visible__iphone-svg" viewBox="0 0 390 844" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="386" height="840" rx="62" pathLength={1} style={draw(0, 0.55)} />
      <rect x="16" y="16" width="358" height="812" rx="50" pathLength={1} className="is-soft" style={draw(0.15, 0.55)} />
      <rect x="146" y="34" width="98" height="28" rx="14" pathLength={1} style={draw(0.45, 0.2)} />
      <path d="M-2 168v34M-2 232v62M-2 312v62M392 256v104" pathLength={1} className="is-soft" style={draw(0.5, 0.25)} />
      <circle cx="44" cy="772" r="18" pathLength={1} className="is-soft" style={draw(0.65, 0.2)} />
      <rect x="74" y="750" width="286" height="44" rx="22" pathLength={1} className="is-soft" style={draw(0.7, 0.25)} />
      <path d="M136 816h118" pathLength={1} style={draw(0.85, 0.15)} />
    </svg>
  );
}

/** A rounded outline with its stroke's opacity and width, in whatever space it is given in. */
type Part = { x: number; y: number; w: number; h: number; r: number; opacity: number; width: number };
type PartPair = { a: Part; b: Part; fade?: "in" | "out" };

/** The phone's parts as drawn by PhoneOutline, in its 390 x 844 space. Side buttons and the home bar are hairline boxes. */
const PHONE_BODY: Part = { x: 2, y: 2, w: 386, h: 840, r: 62, opacity: 1, width: 1.6 };
const PHONE_SCREEN: Part = { x: 16, y: 16, w: 358, h: 812, r: 50, opacity: 0.55, width: 1.6 };
const PHONE_PARTS: readonly Part[] = [
  { x: 146, y: 34, w: 98, h: 28, r: 14, opacity: 1, width: 1.6 },
  ...[
    [168, 34],
    [232, 62],
    [312, 62],
  ].map(([y, h]) => ({ x: -2.25, y, w: 0.5, h, r: 0, opacity: 0.55, width: 1.6 })),
  { x: 391.75, y: 256, w: 0.5, h: 104, r: 0, opacity: 0.55, width: 1.6 },
  { x: 26, y: 754, w: 36, h: 36, r: 18, opacity: 0.55, width: 1.6 },
  { x: 74, y: 750, w: 286, h: 44, r: 22, opacity: 0.55, width: 1.6 },
  { x: 136, y: 815.75, w: 118, h: 0.5, r: 0, opacity: 1, width: 1.6 },
];

const PEACH = [252, 207, 184];
const DEEP_BEIGE = [110, 92, 64];

/**
 * The whole phone turning into the first beige drawing, the way the beige drawings turn into each other.
 * Its body and screen become the drawing's frame; its island, buttons, composer, home bar and the chat
 * bubbles' outlines each travel into the nearest shape of the drawing (place, size, corners, stroke,
 * peach to deep beige), and any left over shrink away. Both ends are measured in the section, so every
 * shape lands exactly where the beige layer then keeps it. `m` (0 to 1) is the morph.
 */
function PhoneMorph({ m, section }: { m: number; section: RefObject<HTMLElement> }) {
  const [ends, setEnds] = useState<{ w: number; h: number; pairs: PartPair[] } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const root = section.current;
      const phone = root?.querySelector(".doehealth-desk2-visible__iphone");
      const art = root?.querySelector(".doehealth-desk2-find__art");
      if (!root || !phone || !art) return;
      const o = root.getBoundingClientRect();
      const a = phone.getBoundingClientRect();
      const b = art.getBoundingClientRect();
      const place = (part: Part, box: DOMRect, sx: number, sy: number): Part => ({
        x: box.left - o.left + part.x * sx,
        y: box.top - o.top + part.y * sy,
        w: part.w * sx,
        h: part.h * sy,
        r: part.r * sx,
        opacity: part.opacity,
        width: part.width * sx,
      });
      const onPhone = (part: Part) => place(part, a, a.width / 390, a.height / 844);
      const onArt = (part: Part) => place(part, b, b.width / 400, b.height / 320);
      const bubbles = Array.from(root.querySelectorAll<HTMLElement>(".doehealth-desk2-visible__bubble")).map((el): Part => {
        const box = el.getBoundingClientRect();
        const scale = el.offsetWidth ? box.width / el.offsetWidth : 1;
        return {
          x: box.left - o.left,
          y: box.top - o.top,
          w: box.width,
          h: box.height,
          r: (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) * scale,
          opacity: el.classList.contains("doehealth-desk2-visible__bubble--out") ? 1 : 0.55,
          width: 1.5 * scale,
        };
      });
      const frame = onArt(DOEHEALTH_DESK2_FIND_FRAME);
      setEnds({
        w: o.width,
        h: o.height,
        pairs: [
          { a: onPhone(PHONE_BODY), b: frame },
          { a: onPhone(PHONE_SCREEN), b: frame },
          ...pairUp([...PHONE_PARTS.map(onPhone), ...bubbles], DOEHEALTH_DESK2_FIND_ARRIVALS.map(onArt)),
        ],
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [section]);

  return ends ? <MorphLayer {...ends} m={m} from={PEACH} to={DEEP_BEIGE} /> : null;
}

/** Draws a morph's pairs eased from their first shape to their second, the stroke colour going `from` to `to`. */
function MorphLayer({ w, h, pairs, m, from, to }: { w: number; h: number; pairs: readonly PartPair[]; m: number; from: readonly number[]; to: readonly number[] }) {
  const k = smooth(m);
  const mix = (a: number, b: number) => a + (b - a) * k;
  const [r, g, b] = from.map((c, i) => Math.round(mix(c, to[i])));
  return (
    <svg className="doehealth-desk2-visible__morph" viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true" stroke={`rgb(${r} ${g} ${b})`} style={vars({ "--m": k })}>
      {pairs.map(({ a, b: end, fade }, i) => (
        <rect
          key={i}
          x={mix(a.x, end.x)}
          y={mix(a.y, end.y)}
          width={mix(a.w, end.w)}
          height={mix(a.h, end.h)}
          rx={mix(a.r, end.r)}
          strokeWidth={mix(a.width, end.width)}
          strokeOpacity={mix(a.opacity, end.opacity)}
          opacity={fade === "in" ? k : fade === "out" ? 1 - k : 1}
        />
      ))}
    </svg>
  );
}

/**
 * The last beige drawing turning into the closing search box, the way the iPhone turned into the first:
 * its frame travels into the box's outline (deep beige to peach) and its other shapes shrink away where
 * they are. Both ends are measured in the section, so the outline lands where the box keeps it.
 * `m` (0 to 1) is the morph.
 */
function SearchMorph({ m, section }: { m: number; section: RefObject<HTMLElement> }) {
  const [ends, setEnds] = useState<{ w: number; h: number; pairs: PartPair[] } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const root = section.current;
      const art = root?.querySelector(".doehealth-desk2-find__art");
      const search = root?.querySelector<HTMLElement>(".doehealth-desk2-visible__search");
      if (!root || !art || !search) return;
      const o = root.getBoundingClientRect();
      const b = art.getBoundingClientRect();
      const s = search.getBoundingClientRect();
      const sx = b.width / 400;
      const sy = b.height / 320;
      const onArt = (part: Part): Part => ({ x: b.left - o.left + part.x * sx, y: b.top - o.top + part.y * sy, w: part.w * sx, h: part.h * sy, r: part.r * sx, opacity: part.opacity, width: part.width * sx });
      const radius = parseFloat(getComputedStyle(search).borderTopLeftRadius) || 0;
      const box: Part = { x: s.left - o.left + 0.75, y: s.top - o.top + 0.75, w: s.width - 1.5, h: s.height - 1.5, r: Math.max(0, radius - 0.75), opacity: 1, width: 1.5 };
      setEnds({
        w: o.width,
        h: o.height,
        pairs: [
          { a: onArt(DOEHEALTH_DESK2_FIND_FRAME), b: box },
          ...DOEHEALTH_DESK2_FIND_LAST.map((part) => {
            const a = onArt(part);
            return { a, b: { ...a, x: a.x + a.w / 2, y: a.y + a.h / 2, w: 0, h: 0, r: 0 }, fade: "out" as const };
          }),
        ],
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [section]);

  return ends ? <MorphLayer {...ends} m={m} from={DEEP_BEIGE} to={PEACH} /> : null;
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

  /** In or just about to enter the viewport. The dot canvases redraw every frame, so they only run while the section is near. */
  const [near, setNear] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "40px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const thread = DOEHEALTH_DESK2_VISIBLE_THREAD;
  const introOpacity = 1 - ramp(p, RAMP.introFade);
  const threadOpacity = ramp(p, RAMP.threadIn) * (1 - ramp(p, [RAMP.unbuild[1], RAMP.unbuild[1] + 0.05]));
  const chatOpacity = 1 - ramp(p, RAMP.chatOut);
  const stampIn = ramp(p, RAMP.stamp);
  const askIn = ramp(p, RAMP.ask);
  const replyIn = ramp(p, RAMP.reply);
  /** From here to FIND_FROM the morph stands in for the phone and the bubbles' outlines. */
  const morphing = p >= RAMP.morph[0] && p < FIND_FROM;
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
    <div className="doehealth-desk2-visible-track" style={vars({ "--desk2-visible-run": END * DOEHEALTH_DESK2_PHONE_STEP_PX })}>
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
          {near && introOpacity > 0.01 ? (
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
              {morphing || p >= FIND_FROM ? null : <PhoneOutline t={ramp(p, RAMP.phone)} />}
              <div className="doehealth-desk2-visible__chat">
                <div className="doehealth-desk2-visible__thread">
                  <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--center" style={vars({ "--e": stampIn })}>
                    <p className="doehealth-desk2-visible__stamp desk2-genome-swipe desk2-genome-swipe--salmon" style={vars({ "--s": stampIn - ramp(p, RAMP.stampOut) })}>
                      <strong>{thread.day}</strong> {thread.time}
                    </p>
                  </div>
                  <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--out" style={vars({ "--e": askIn })}>
                    <DrawnBubble
                      text={thread.ask}
                      line={p < RAMP.morph[0] ? seg(askIn, 0, 0.6) : 0}
                      sweep={seg(askIn, 0.35, 0.65) - ramp(p, RAMP.askOut)}
                      out
                    />
                  </div>
                  <div className="doehealth-desk2-visible__row doehealth-desk2-visible__row--in" style={vars({ "--e": replyIn })}>
                    <DrawnBubble text={thread.reply} line={p < RAMP.morph[0] ? seg(replyIn, 0, 0.6) : 0} sweep={seg(replyIn, 0.35, 0.65) - ramp(p, RAMP.replyOut)} />
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

        {morphing ? <PhoneMorph m={ramp(p, RAMP.morph)} section={sectionRef} /> : null}
        {p >= FINAL.toBox[0] && p < FINAL.toBox[1] ? <SearchMorph m={ramp(p, FINAL.toBox)} section={sectionRef} /> : null}

        <div className="doehealth-desk2-visible__scene" style={vars({ "--o": titleOpacity })} aria-hidden={titleOpacity < 0.5}>
          {/* Halftone tides along both side edges, rolling in motion behind the closing title. */}
          {/* Revealed by the same swipe as the title (--s), so the two start together. */}
          {/* Mounted only while the closing title shows, for the same reason as the intro dots. */}
          {near && titleOpacity > 0.01 ? (
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
            <TracedOutline draw={p >= FINAL.toBox[1] ? 1 : 0} box={searchRef} className="doehealth-desk2-visible__search-line" />
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
    </div>
  );
}
