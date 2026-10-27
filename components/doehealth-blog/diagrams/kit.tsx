"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { DoeHealthBlogDotField } from "@/components/doehealth-blog/DoeHealthBlogDotField";
import { articleBoxColors } from "@/components/doehealth-blog/DoeHealthBlogPlaceholder";
import type { DoeHealthBlogDots, DoeHealthBlogPlaceholderTone } from "@/lib/doehealth/doehealth-blog-articles";
import { dmSans, p22Mackinac } from "@/lib/home/fonts";
import { C, F } from "@/remotion/video1/theme";

export { C, F };

/** Code and headers in the figures. */
export const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace";

/**
 * One animated figure: a fixed artboard laid out in pixels, drawn at `t` seconds into a loop. `wide` is the 16:9 (or
 * 16:7 hero) desktop box; `compact` is the 4:3 phone box, laid out on its own so the type stays readable.
 */
export type DiagramScene = {
  /** Seconds before the loop starts over. */
  loop: number;
  /** The moment shown when motion is reduced: everything in place. */
  still: number;
  wide: { w: number; h: number };
  compact: { w: number; h: number };
  render: (t: number, compact: boolean) => ReactNode;
};

/* ------------------------------------------------------------------ motion */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const easeInOut = (x: number) => {
  const v = clamp01(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};

/** 0 → 1 over `dur` seconds from `at`, eased. */
export function prog(t: number, at: number, dur = 0.5) {
  return easeOut((t - at) / dur);
}

/** The films' entrance: fades up from a small offset. */
export function fly(t: number, at: number, opts: { x?: number; y?: number; dur?: number; scale?: number } = {}): CSSProperties {
  const { x = 0, y = 14, dur = 0.55, scale = 1 } = opts;
  const p = prog(t, at, dur);
  const s = scale + (1 - scale) * p;
  return {
    opacity: p,
    transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)${s !== 1 ? ` scale(${s})` : ""}`,
  };
}

/** Linear mix between two hex colours. */
export function mix(a: string, b: string, k: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * clamp01(k));
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/** How lit something is while `t` sits in [from, to], with soft edges. */
export function lit(t: number, from: number, to: number, edge = 0.25) {
  return Math.min(prog(t, from, edge), 1 - prog(t, to, edge));
}

/** The first `n` characters of `text` typed out from `at`, at `cps` characters per second. */
export function typed(t: number, at: number, text: string, cps = 42) {
  const n = Math.max(0, Math.floor((t - at) * cps));
  return n >= text.length ? text : text.slice(0, n);
}

/* --------------------------------------------------------------- the frame */

function useBoxSize(ref: React.RefObject<HTMLElement | null>) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w && h) setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return box;
}

function useOnScreen(ref: React.RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return on;
}

/** Seconds into the loop. Runs only while on screen; picks up where it left off. */
function useLoopClock(loop: number, playing: boolean, fixed: number | undefined) {
  const [t, setT] = useState(fixed ?? 0);
  const tRef = useRef(fixed ?? 0);
  useEffect(() => {
    if (fixed !== undefined) {
      tRef.current = fixed;
      setT(fixed);
      return undefined;
    }
    if (!playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      tRef.current = (tRef.current + Math.min(0.1, (now - last) / 1000)) % loop;
      last = now;
      setT(tRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [loop, playing, fixed]);
  return t;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

/**
 * The figure box: the article's beige with its dot design moving behind, and the scene's artboard scaled to fit in front.
 * `freezeAt` holds one moment (for stills and tests).
 */
export function DiagramFrame({
  scene,
  tone,
  dots,
  freezeAt,
}: {
  scene: DiagramScene;
  tone: DoeHealthBlogPlaceholderTone;
  dots: DoeHealthBlogDots;
  freezeAt?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const box = useBoxSize(boxRef);
  const on = useOnScreen(boxRef);
  const reduce = useReducedMotion();
  const fixed = freezeAt ?? (reduce ? scene.still : undefined);
  const t = useLoopClock(scene.loop, on, fixed);
  const compact = box ? box.w / box.h < 1.5 : false;
  const size = compact ? scene.compact : scene.wide;
  const s = box ? Math.min(box.w / size.w, box.h / size.h) : 0;
  // Each loop fades in from the beige and back out to it, so the restart never jumps.
  const seam = fixed !== undefined ? 1 : Math.min(1, t / 0.3, (scene.loop - t) / 0.5);
  const { bg, dot } = articleBoxColors(tone);

  return (
    <div ref={boxRef} className={`doehealth-blog-view doehealth-blog-diagram ${dmSans.variable} ${p22Mackinac.variable}`} style={{ background: bg }} aria-hidden>
      <DoeHealthBlogDotField dots={dots} color={dot} />
      {box ? (
        <div
          className="doehealth-blog-diagram__stage"
          style={{
            width: size.w,
            height: size.h,
            opacity: clamp01(seam),
            fontFamily: F.ui,
            color: C.walnut,
            transform: `translate(${(box.w - size.w * s) / 2}px, ${(box.h - size.h * s) / 2}px) scale(${s})`,
          }}
        >
          {scene.render(t, compact)}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- primitives */

type Box = { x: number; y: number; w: number; h?: number };

/** Absolutely placed paper card, the films' flat card: paper, a hairline, round corners. */
export function Card({ x, y, w, h, style, dark = false, children }: Box & { style?: CSSProperties; dark?: boolean; children?: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 26,
        background: dark ? C.ink : C.paper,
        border: dark ? "none" : `1px solid ${C.line}`,
        color: dark ? C.paper : C.walnut,
        fontFamily: F.ui,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The films' agent label: an ink pill (the person's agent) or a salmon one (the organization's). */
export function Pill({ children, tone = "ink", size = 18, style }: { children: ReactNode; tone?: "ink" | "salmon" | "beige" | "live"; size?: number; style?: CSSProperties }) {
  const look = {
    ink: { background: C.ink, color: C.paper },
    salmon: { background: C.salmon, color: C.salmonText },
    beige: { background: C.beige, color: C.walnut },
    live: { background: C.liveBg, color: C.liveText },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        height: size * 2.1,
        padding: `0 ${size * 0.85}px`,
        borderRadius: 999,
        fontFamily: F.ui,
        fontWeight: 500,
        fontSize: size,
        whiteSpace: "nowrap",
        ...look,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Display type: P22 Mackinac, tight. */
export function Title({ children, size = 34, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: F.display, fontWeight: 500, fontSize: size, lineHeight: 1.15, letterSpacing: "-0.025em", color: C.walnut, ...style }}>
      {children}
    </div>
  );
}

export function Mono({ children, size = 16, color, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: size, lineHeight: 1.5, color: color ?? C.walnut, whiteSpace: "pre", ...style }}>{children}</span>
  );
}

export function Check({ size = 18, color = C.liveText, on = 1 }: { size?: number; color?: string; on?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "block", flexShrink: 0 }}>
      <circle cx={10} cy={10} r={10} fill={color} opacity={0.14 * on} />
      <circle cx={10} cy={10} r={9.25} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35 + 0.65 * on} />
      <path d="M5.8 10.4l2.7 2.7 5.7-6" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={14} strokeDashoffset={14 * (1 - on)} />
    </svg>
  );
}

/** A small round toggle, on (ink) or off (beige). */
export function Toggle({ on }: { on: number }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 44, height: 26, borderRadius: 999, background: mix("#E8DCC4", "#140C04", on), flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: 3 + 18 * on, width: 20, height: 20, borderRadius: 999, background: C.paper }} />
    </span>
  );
}

/** The films' cursor: ink arrow, paper outline. */
export function Cursor({ x, y, press = 0, opacity = 1 }: { x: number; y: number; press?: number; opacity?: number }) {
  return (
    <div style={{ position: "absolute", left: x - 2, top: y - 2, opacity, transform: `scale(${1 - 0.14 * press})`, transformOrigin: "2px 2px", zIndex: 5 }}>
      <svg width={26} height={36} viewBox="0 0 22 30" style={{ display: "block" }}>
        <path d="M2 1.8v22.4l6-5.6 4.1 9.3 3.6-1.6-4-9.1h8.2z" fill={C.ink} stroke={C.paper} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** A click ring that opens and fades from `at`. */
export function Ring({ x, y, t, at }: { x: number; y: number; t: number; at: number }) {
  const p = clamp01((t - at) / 0.5);
  if (p <= 0 || p >= 1) return null;
  const r = 10 + 22 * easeOut(p);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: 999,
        border: `2px solid ${C.walnut}`,
        opacity: 0.5 * (1 - p),
        zIndex: 4,
      }}
    />
  );
}

/**
 * A wire between two points, drawn in from `at` over `dur`, with a packet that runs along it once per `every`
 * seconds after it is drawn (or once at `send` when given).
 */
export function Wire({
  from,
  to,
  t,
  at,
  dur = 0.6,
  bend = 0.35,
  packets = [],
  color = C.walnut,
  dashed = true,
  width = 1.6,
  opacity = 0.32,
  packetColor,
}: {
  from: [number, number];
  to: [number, number];
  t: number;
  at: number;
  dur?: number;
  bend?: number;
  /** Times a packet sets off along the wire; each takes 0.8s. */
  packets?: readonly number[];
  color?: string;
  dashed?: boolean;
  width?: number;
  opacity?: number;
  packetColor?: string;
}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const c1: [number, number] = [x1 + dx * bend, y1];
  const c2: [number, number] = [x2 - dx * bend, y2];
  const d = `M${x1},${y1} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x2},${y2}`;
  const draw = prog(t, at, dur);
  const at3 = (u: number) => {
    const m = 1 - u;
    return [
      m * m * m * x1 + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * x2,
      m * m * m * y1 + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * y2,
    ];
  };
  const live = packets
    .map((p) => (t - p) / 0.8)
    .filter((u) => u > 0 && u < 1)
    .map((u) => at3(easeInOut(u)));
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeOpacity={opacity}
        strokeDasharray={dashed ? "2 7" : undefined}
        strokeLinecap="round"
        pathLength={1}
        style={dashed ? { opacity: draw } : { strokeDasharray: 1, strokeDashoffset: 1 - draw }}
      />
      {live.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={6} fill={packetColor ?? C.alert} />
      ))}
    </g>
  );
}

/** Full-artboard SVG layer for wires, under the cards. */
export function Wires({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {children}
    </svg>
  );
}

/** A labelled row of small steps (a task's states, a flow's stages) with the current one lit. */
export function Steps({ items, active, size = 15, style }: { items: readonly string[]; active: number; size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, ...style }}>
      {items.map((item, i) => {
        const on = i === active;
        const done = i < active;
        return (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                height: size * 2,
                display: "inline-flex",
                alignItems: "center",
                padding: `0 ${size * 0.8}px`,
                borderRadius: 999,
                fontFamily: MONO,
                fontSize: size,
                background: on ? C.ink : done ? C.liveBg : C.chip,
                color: on ? C.paper : done ? C.liveText : C.faint,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
            {i < items.length - 1 ? <span style={{ width: 14, height: 1.5, background: C.line2 }} /> : null}
          </div>
        );
      })}
    </div>
  );
}
